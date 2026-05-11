import { ModelMessage, generateText, tool } from "ai";
import { z } from "zod";
import { db } from "@/lib/db";
import { agents } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { getValidAccessToken, getCalendarEvents } from "@/lib/integrations/google-calendar";
import { resolveChatModel } from "@/lib/ai/model-provider";

import { buildPrompt } from "@/lib/ai/generate-agent-reply/prompt-builder";
import { prepareContext } from "@/lib/ai/generate-agent-reply/context-preparation";
import { parseLeadPayload } from "@/lib/ai/generate-agent-reply/response-parser";
import { fallback, withRetry } from "@/lib/ai/generate-agent-reply/retry-policy";

import type {
  GenerateAgentReplyInput,
  GenerateAgentReplyOutput,
} from "@/lib/ai/generate-agent-reply/types";

export type {
  AgentMessage,
  AgentLeadPayload,
  GenerateAgentReplyInput,
  GenerateAgentReplyOutput,
} from "@/lib/ai/generate-agent-reply/types";

function isSafeTemperature(temperature: number): boolean {
  return Number.isFinite(temperature) && temperature >= 0.2 && temperature <= 0.8;
}

async function requestReply(input: GenerateAgentReplyInput): Promise<{ text: string; tokens: number }> {
  const preparedContext = await prepareContext(input);
  const startTime = Date.now();

  console.log(`[requestReply] START for agent: ${input.agentId}, model: ${input.model}`);

  // Pre-fetch calendar access token once before generateText so the tool
  // execute closure never needs to do its own DB round-trip.
  let resolvedCalendarToken: string | null = input.calendarAccessToken ?? null;
  let calendarEnabled = false;

  // Extremely strict regex to ensure the user actually provided a date-like term.
  // We don't want the model taking "when are you free" and calling the tool without a date.
  const hasDateOrDayRegex = /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday|jan(uary)?|feb(ruary)?|mar(ch)?|apr(il)?|may|jun(e)?|jul(y)?|aug(ust)?|sep(tember)?|oct(ober)?|nov(ember)?|dec(ember)?|today|tomorrow|next week|next month|this week|this weekend|\d{1,2}(st|nd|rd|th)?( of)?( )?(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)|(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)( )?\d{1,2}|\d{1,2}\/\d{1,2})\b/i;
  const userMessageSuggestsDate = hasDateOrDayRegex.test(input.message);

  if (!resolvedCalendarToken || input.calendlyEnabled === undefined) {
    try {
      const [agentRow] = await db
        .select()
        .from(agents)
        .where(eq(agents.id, input.agentId))
        .limit(1);

      if (agentRow) {
        if (agentRow.googleCalendarEnabled && !resolvedCalendarToken) {
          resolvedCalendarToken = await getValidAccessToken(agentRow);
          calendarEnabled = !!resolvedCalendarToken && userMessageSuggestsDate;
        }

        // Populate Calendly fields if they aren't provided in the input
        if (input.calendlyEnabled === undefined) {
          input.calendlyEnabled = agentRow.calendlyEnabled;
          input.calendlyAccountEmail = agentRow.calendlyAccountEmail;
          input.calendlySchedulingUrl = agentRow.calendlySchedulingUrl;
        }
      }
    } catch {
      // Non-fatal — tool will gracefully return an error if token is null
    }
  } else {
    calendarEnabled = userMessageSuggestsDate;
  }

  const calendlyEnabled = !!input.calendlyEnabled && !!input.calendlySchedulingUrl;

  try {
    const messages: ModelMessage[] = [
      ...preparedContext.history.map(m => ({
        role: m.role as "user" | "assistant",
        content: m.content
      })),
      { role: "user", content: input.message },
    ];

    const result = await generateText({
      model: resolveChatModel(input.model),
      system: buildPrompt(input, preparedContext),
      messages,
      temperature: input.temperature,
      maxOutputTokens: 1500,
      // @ts-expect-error - AI SDK version mismatch
      maxSteps: 5,
      tools: {
        ...(calendarEnabled ? {
          check_availability: tool({
            description: "CRITICAL: ONLY call this tool if the user explicitly provided a day, date, or relative time (like 'tomorrow'). NEVER call this tool if you don't know the exact date they want. If they just ask 'when are you free?', DO NOT call this tool — instead, ask them what day they prefer.",
            inputSchema: z.object({
              date: z.string().describe("The date to check in YYYY-MM-DD format, e.g., 2024-02-28."),
            }),
            execute: async (args: any) => {
              const { date } = args;
              console.log(`[tool:check_availability] CALLED with RAW ARGS:`, JSON.stringify(args));
              if (!date || date.trim() === "") {
                console.warn("[tool:check_availability] Called with no date.");
                return "SYSTEM MESSAGE: You called check_availability without a date. Please output the following message to the user: 'I need to know which date you want to check before I can look at the calendar. Could you provide a specific day or date?'";
              }
              const toolStart = Date.now();
              try {
                // Use token pre-fetched before generateText — no DB query here
                if (!resolvedCalendarToken) {
                  console.warn("[tool:check_availability] No calendar token available");
                  return { error: "Calendar integration is not enabled or not authorized." };
                }

                const accessToken = resolvedCalendarToken;

                let targetDate = new Date();
                if (date === "tomorrow") {
                  targetDate.setDate(targetDate.getDate() + 1);
                } else if (date !== "today" && date !== "today's") {
                  const parsed = new Date(date);
                  if (!isNaN(parsed.getTime())) {
                    targetDate = parsed;
                  }
                }
                const targetDayOfWeek = targetDate.getDay();
                const dateStr = targetDate.toISOString().split("T")[0];

                const offDays = input.offDays || [];
                if (offDays.includes(dateStr)) {
                  console.log(`[tool:check_availability] Agent is off on ${dateStr}`);
                  return {
                    date: dateStr,
                    availability: "Unavailable. The agent is marked as off on this specific date.",
                    busy_slots: [],
                    summary: "Agent is off on this date."
                  };
                }

                const wh = (input.workingHours || []).find(w => w.dayOfWeek === targetDayOfWeek);
                if (wh && !wh.enabled) {
                  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                  console.log(`[tool:check_availability] Agent is closed on ${days[targetDayOfWeek]}s`);
                  return {
                    date: dateStr,
                    availability: `Unavailable. The agent is closed on ${days[targetDayOfWeek]}s.`,
                    busy_slots: [],
                    summary: "Agent is closed on this day of the week."
                  };
                }

                const timeMin = new Date(targetDate);
                timeMin.setHours(0, 0, 0, 0);
                const timeMax = new Date(targetDate);
                timeMax.setHours(23, 59, 59, 999);

                console.log(`[tool:check_availability] Fetching events for ${dateStr}...`);
                const events = await getCalendarEvents(
                  accessToken,
                  timeMin.toISOString(),
                  timeMax.toISOString()
                );

                if (!events || !events.items || events.items.length === 0) {
                  console.log(`[tool:check_availability] SUCCESS for ${dateStr} (0 events)`);
                  return {
                    date: dateStr,
                    availability: "Fully available. No events scheduled.",
                    busy_slots: [],
                    summary: "No events scheduled for this day."
                  };
                }

                const busySlots = events.items.map((event: any) => {
                  const startStr = event.start?.dateTime || event.start?.date;
                  const endStr = event.end?.dateTime || event.end?.date;
                  const start = startStr ? new Date(startStr) : null;
                  const end = endStr ? new Date(endStr) : null;

                  const isAllDay = !event.start?.dateTime;
                  const timeStr = (start && end && !isAllDay)
                    ? `${start.toTimeString().slice(0, 5)} - ${end.toTimeString().slice(0, 5)}`
                    : "All day";

                  return `${timeStr}: ${event.summary || "Busy"}`;
                });

                console.log(`[tool:check_availability] SUCCESS for ${dateStr} (${busySlots.length} events) in ${Date.now() - toolStart}ms`);
                return {
                  date: dateStr,
                  busy_slots: busySlots,
                  summary: `There are ${events.items.length} events scheduled on this day.`,
                  availability: busySlots.length > 0 ? "Partially busy." : "Available."
                };
              } catch (error: any) {
                console.error(`[tool:check_availability] CRITICAL ERROR in ${Date.now() - toolStart}ms:`, error);
                return { error: `An error occurred while checking availability: ${error.message || "Unknown error"}` };
              }
            },
          }),
        } : {}),

        ...(calendlyEnabled ? {
          get_calendly_link: tool({
            description: "Get the visitor's custom Calendly booking link. ONLY call this if the visitor specifically asks for a link, wants to 'book a meeting', 'schedule time', or 'see your calendar'. NEVER call this tool if Calendly is not enabled.",
            inputSchema: z.object({}),
            execute: async () => {
              console.log(`[tool:get_calendly_link] CALLED`);
              return {
                booking_url: input.calendlySchedulingUrl,
                instructions: "Share this link with the visitor so they can choose a time that works for them."
              };
            },
          }),
        } : {}),

        get_current_datetime: tool({
          description: "Get the current date and time. Use this when the visitor asks what time or date it is, or when you need to know the current moment to give a relevant answer.",
          inputSchema: z.object({}),
          execute: async () => {
            const now = new Date();
            console.log(`[tool:get_current_datetime] CALLED`);
            return {
              iso: now.toISOString(),
              date: now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
              time: now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }),
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            };
          },
        }),

        get_current_date: tool({
          description: "Get today's date. Use this when the visitor asks what day or date it is.",
          inputSchema: z.object({}),
          execute: async () => {
            const now = new Date();
            console.log(`[tool:get_current_date] CALLED`);
            return {
              iso: now.toISOString().split("T")[0],
              friendly: now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
              day_of_week: now.toLocaleDateString("en-US", { weekday: "long" }),
            };
          },
        }),

        get_current_time: tool({
          description: "Get the current time. Use this when the visitor asks what time it is.",
          inputSchema: z.object({}),
          execute: async () => {
            const now = new Date();
            console.log(`[tool:get_current_time] CALLED`);
            return {
              time_24h: now.toTimeString().slice(0, 5),
              time_12h: now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }),
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            };
          },
        }),
      },
    });

    const totalTokens = result.usage?.totalTokens ?? ((result.usage?.inputTokens ?? 0) + (result.usage?.outputTokens ?? 0));
    const text = result.text || "";

    console.log(`[requestReply] SUCCESS for agent: ${input.agentId} in ${Date.now() - startTime}ms. Tokens: ${totalTokens}`);
    console.log(`[requestReply] RAW TEXT returned from model (length: ${text.length}):\n${text}`);

    return { text, tokens: totalTokens };
  } catch (err: any) {
    console.error(`[requestReply] FATAL ERROR after ${Date.now() - startTime}ms:`, err);
    if (err instanceof Error) {
      console.error("Stack:", err.stack);
    }
    throw err;
  }
}

const DEFAULT_LEAD: GenerateAgentReplyOutput["lead"] = {
  lead_detected: false,
  confidence: 0,
  lead_data: { name: "", email: "", budget: "", project_details: "", meeting_time: "" },
};

function stripTrailingJsonNoise(text: string): string {
  let cleaned = text;

  cleaned = cleaned.replace(/```(?:json)?\s*[\s\S]*?```\s*$/g, "");

  cleaned = cleaned.replace(/\{[^{}]*"lead_detected"[^{}]*\}\s*$/, "");

  const truncatedIdx = cleaned.search(/\{[^}]*(?:"lead_detected"|lead_detected)[^}]*$/);
  if (truncatedIdx !== -1) {
    cleaned = cleaned.slice(0, truncatedIdx);
  }

  return cleaned.trim();
}

export async function generateAgentReply(
  input: GenerateAgentReplyInput
): Promise<GenerateAgentReplyOutput> {
  if (!isSafeTemperature(input.temperature)) {
    return fallback("UnsafeTemperature");
  }

  const attempt = await withRetry(requestReply.bind(null, input));

  if (!attempt.ok) {
    return fallback(`${attempt.firstErrorType}:${attempt.secondErrorType}`);
  }

  const parsed = parseLeadPayload(attempt.value.text);
  if (parsed) {
    return {
      reply: parsed.reply,
      lead: parsed.lead,
      usage: { totalTokens: attempt.value.tokens },
    };
  }

  if (attempt.attempts === 1) {
    const retryAttempt = await withRetry(requestReply.bind(null, input));
    if (retryAttempt.ok) {
      const retryParsed = parseLeadPayload(retryAttempt.value.text);
      if (retryParsed) {
        return {
          reply: retryParsed.reply,
          lead: retryParsed.lead,
          usage: { totalTokens: attempt.value.tokens + retryAttempt.value.tokens },
        };
      }
    }
  }

  const cleanReply = stripTrailingJsonNoise(attempt.value.text);
  const finalReply = (cleanReply || attempt.value.text || "").trim();

  return {
    reply: finalReply || "I'm having trouble retrieving that information right now. Could you try asking again?",
    lead: DEFAULT_LEAD,
    usage: { totalTokens: attempt.value.tokens },
  };
}
