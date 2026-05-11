import { ModelMessage, streamText, tool } from "ai";
import { z } from "zod";
import { getSession } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { agents } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { getValidAccessToken, getCalendarEvents } from "@/lib/integrations/google-calendar";
import { resolveChatModel } from "@/lib/ai/model-provider";
import { buildPrompt } from "@/lib/ai/generate-agent-reply/prompt-builder";
import { prepareContext } from "@/lib/ai/generate-agent-reply/context-preparation";
import { getActivePortfolio } from "@/lib/active-portfolio";

export const maxDuration = 60;

export async function POST(req: Request) {
  const session = await getSession();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { messages, agentId, handle } = await req.json();

  const portfolio = await getActivePortfolio(session.user.id);
  if (!portfolio) {
    return new Response("Portfolio not found", { status: 404 });
  }

  const [agentRow] = await db
    .select()
    .from(agents)
    .where(eq(agents.id, agentId))
    .limit(1);

  if (!agentRow) {
    return new Response("Agent not found", { status: 404 });
  }

  const input = {
    agentId,
    model: agentRow.model,
    message: messages[messages.length - 1].content,
    temperature: agentRow.temperature,
    // ... other input fields needed for buildPrompt and prepareContext
    displayName: agentRow.displayName,
    intro: agentRow.intro,
    roleLabel: agentRow.roleLabel,
    workingHours: agentRow.workingHours,
    offDays: agentRow.offDays,
    calendlyEnabled: agentRow.calendlyEnabled,
    calendlySchedulingUrl: agentRow.calendlySchedulingUrl,
  };

  const preparedContext = await prepareContext(input as any);

  let resolvedCalendarToken: string | null = null;
  if (agentRow.googleCalendarEnabled) {
    resolvedCalendarToken = await getValidAccessToken(agentRow);
  }

  const result = await streamText({
    model: resolveChatModel(agentRow.model),
    system: buildPrompt(input as any, preparedContext),
    messages,
    temperature: agentRow.temperature,
    // @ts-expect-error - AI SDK version mismatch
    maxSteps: 5,
    tools: {
      check_availability: tool({
        description: "CRITICAL: ONLY call this tool if the user explicitly provided a day, date, or relative time (like 'tomorrow'). NEVER call this tool if you don't know the exact date they want.",
        inputSchema: z.object({
          date: z.string().describe("The date to check in YYYY-MM-DD format, e.g., 2024-02-28."),
        }),
        execute: async ({ date }) => {
          if (!resolvedCalendarToken) {
            return { error: "Calendar integration is not enabled or not authorized." };
          }

          let targetDate = new Date();
          if (date === "tomorrow") {
            targetDate.setDate(targetDate.getDate() + 1);
          } else if (date !== "today" && date !== "today's") {
            const parsed = new Date(date);
            if (!isNaN(parsed.getTime())) targetDate = parsed;
          }
          const targetDayOfWeek = targetDate.getDay();
          const dateStr = targetDate.toISOString().split("T")[0];

          const offDays = (agentRow.offDays as string[]) || [];
          if (offDays.includes(dateStr)) return { availability: "Unavailable. Agent is off." };

          const wh = ((agentRow.workingHours || []) as any[]).find(w => w.dayOfWeek === targetDayOfWeek);
          if (wh && !wh.enabled) return { availability: "Unavailable. Agent closed." };

          const timeMin = new Date(targetDate);
          timeMin.setHours(0, 0, 0, 0);
          const timeMax = new Date(targetDate);
          timeMax.setHours(23, 59, 59, 999);

          const events = await getCalendarEvents(resolvedCalendarToken, timeMin.toISOString(), timeMax.toISOString());
          if (!events?.items?.length) return { availability: "Fully available." };

          return {
            availability: "Partially busy.",
            busy_slots: events.items.map((e: any) => `${e.start?.dateTime || e.start?.date} - ${e.end?.dateTime || e.end?.date}: ${e.summary || "Busy"}`)
          };
        },
      }),
    },
  });

  // @ts-expect-error - AI SDK version mismatch
  return result.toDataStreamResponse();
}
