import { convertToModelMessages, stepCountIs, streamText, tool } from "ai";
import type { UIMessage } from "ai";
import { z } from "zod";
import { db } from "@/lib/db";
import { onboardingDrafts } from "@/lib/schema";
import { getPortfolioByHandle } from "@/lib/db/portfolio";
import {
  withDefaultSelectedSections,
  ONBOARDING_STEPS,
  type OnboardingData,
  type OnboardingStep,
  type OnboardingSelectedSections,
} from "@/lib/onboarding/types";
import {
  validateFinalOnboardingState,
  validateStepInput,
} from "@/lib/onboarding/validation";
import { resolveChatModel } from "./model-provider";

function buildSystemPrompt(
  collected: Partial<OnboardingData>,
  resumeText?: string
): string {
  const steps = ONBOARDING_STEPS;
  const collectedWithDefaults = withDefaultSelectedSections(collected) ?? collected;
  const collectedKeys = Object.keys(collectedWithDefaults) as OnboardingStep[];
  const nextStep = steps.find((s) => !collectedKeys.includes(s)) ?? null;

  const stateDesc =
    Object.keys(collected).length === 0
      ? "Nothing collected yet."
      : JSON.stringify(collectedWithDefaults, null, 2);

  const resumeBlock = resumeText
    ? `

**RESUME PROVIDED — EXTRACT AND SAVE IMMEDIATELY:**
The user uploaded a resume. Its full text content is below. You MUST:
1. Call save_step("setupPath", "build-new") immediately.
2. Extract the user's full name → call save_step("name", "<name>").
3. Extract their most recent job title → call save_step("title", "<title>").
4. Write a compelling 2-3 sentence elevator pitch bio (20-400 chars) → call save_step("bio", "<bio>").
5. Identify 3-5 key skills/services → call save_step("services", ["skill1", "skill2", ...]).
6. Extract 1-3 notable projects/roles → call save_step("projects", [{title: "...", description: "..."}]).
7. DO NOT ask the user for any of the above — you already have it from the resume.
8. After saving all fields, summarize what you found and ask if it looks right.
9. Then ask for the remaining fields: tone, handle.

<resume_content>
${resumeText}
</resume_content>
`
    : "";

  const siteUrlBlock = `
**WEBSITE PROVIDED — EXTRACT AND SAVE IMMEDIATELY:**
If the user chooses "I already have a website" (existing-site), they will be asked for their website URL (\`siteUrl\`) immediately after.
When they provide a URL, you MUST:
1. Call the \`scrape_website_for_info\` tool immediately with that URL.
2. Using the scraped text, extract and save ALL of the remaining existing-site fields:
   - \`name\`
   - \`title\`
   - \`bio\`
   - \`services\` (if they offer specific ones)
   - \`targetAudience\`
   - \`contactPreferences\`
   - \`faqs\` (if any or generate based on site content)
   - \`tone\` (infer from their copy)
3. Call \`save_step\` for all of these fields IMMEDIATELY in the same turn.
4. DO NOT ask the user for any of the above manually — your extraction handles it.
5. After saving all accessible fields, summarize what you found and ask if it looks right. Then proceed to ask for \`selectedSections\` or \`handle\`.
`;

  return `You are a friendly, chill onboarding assistant for Mimick.me, a portfolio platform. Your job is to collect the following information from the user in this exact order.

**Tone & boundaries:**
- Always be friendly, warm, and chill. Keep it casual and approachable.
- Stay focused on onboarding only. If the user asks random questions, jokes around, or goes off-topic, gently redirect: "Haha, I'd love to chat about that later! For now let's get your portfolio set up—[current question]." Never answer unrelated questions.
- Keep responses SHORT. 1–2 sentences max. Never repeat or summarize content the user just gave—they can see it. No fluff.
${resumeBlock}
${siteUrlBlock}
1. **setupPath** - Ask this first with human-friendly labels${resumeText ? ' (auto-set to "build-new" for resume uploads)' : ""}:
   - "I already have a website" (agent only)
   - "Build me a portfolio + agent" (from scratch)
2. **siteUrl** - ONLY for existing-site path: website URL to ingest
3. **name** - Full name for their portfolio (2-80 chars)
4. **selectedSections** - Ask user which sections they want enabled: About, Services, Projects, CTA, Socials. Hero is always enabled and cannot be turned off
5. **title** - Professional title (2-100 chars)
6. **bio** - Elevator pitch / short bio, at least 20 characters, max 400
7. **services** - ONLY if Services section is enabled
8. **projects** - ONLY if Projects section is enabled and setupPath is build-new
9. **targetAudience** - ONLY for existing-site path
10. **contactPreferences** - ONLY if CTA section is enabled and setupPath is existing-site
11. **faqs** - ONLY if Socials section is enabled and setupPath is existing-site
12. **tone** - One of: Professional, Friendly, Bold, Minimal
13. **handle** - Public URL handle (3-30 chars, lowercase letters, numbers, hyphens only)

**Collected so far:**
${stateDesc}

**Current step to collect:** ${nextStep ?? "All done"}

**Your flow for each step:**
1. Ask for the information (or if you have it from context/resume, skip to step 2)
2. Optionally refine or clean up the user's answer for clarity and professionalism
3. Show the refined value and ask: "Is that correct?" or "Should I use this?"
4. When the user confirms (yes, correct, looks good, etc.), call save_step with the step name and the confirmed value
5. **CRITICAL: Always respond in the same turn.** After save_step, immediately ask for the next step. Never leave the user without a response. Example: after saving name, say "Saved! What's your professional title?"
6. **CRITICAL for handle (last step):** When the user confirms the handle, you MUST call save_step(handle, value) AND then immediately call request_preview with the full collected data. Both in the same turn. The preview UI will not appear unless you call request_preview.

**Special rules:**
- **Combined messages:** If the user confirms AND gives the next answer in one message (e.g. "yes developer" when confirming name), save the current step, then treat the rest as the next step's answer. E.g. save name, then ask "So your title is Developer—is that correct?"
- For **selectedSections**: save an object with keys { hero: true, about, services, projects, cta, socials }.
- For **services**: parse into an array of strings (comma or newline separated)
- For **projects**: parse into array of { title, description } objects. Format: "Title: Description" per line. Need 1-3 projects when enabled.
- For **handle**: must be unique - if taken, ask user to pick another
- If the user's input is invalid, explain what you need and ask again in a friendly way.
- When required fields for the chosen path are collected and confirmed, call request_preview with the full data. Do NOT call complete_onboarding—the user will confirm via the preview UI.
- **CRITICAL for request_preview:** Keep your message SHORT. Say ONLY: "Everything look good? Click Confirm below to make it live!" or similar. Do NOT repeat the user's bio, projects, services, or any of their data. The preview card shows it all—your message should be one brief line only.
- **EDIT REQUESTS:** If the user has already seen the preview and sends a new message (e.g. "shorten the bio", "change title to Senior Developer", "make the tone more friendly"), they want to edit. Parse their request, update the relevant field(s) via save_step with the new value, then call request_preview again with the full updated data. Keep your reply to one short line.}`;
}

export async function streamOnboardingChat({
  userId,
  messages,
  collected,
  resumeText,
}: {
  userId: string;
  messages: UIMessage[];
  collected: Partial<OnboardingData>;
  resumeText?: string;
}) {
  const systemPrompt = buildSystemPrompt(collected, resumeText);
  const modelMessages = await convertToModelMessages(messages);

  const modelToUse = resumeText ? "google/gemini-3-flash" : "moonshotai/Kimi-K2.5";
  console.log(`[onboarding-agent] model=${modelToUse}, hasResumeText=${!!resumeText} (${resumeText?.length ?? 0} chars)`);

  const result = streamText({
    model: resolveChatModel(modelToUse),
    system: systemPrompt,
    messages: modelMessages,
    stopWhen: stepCountIs(15),
    onError: ({ error }) => {
      console.error("[onboarding-agent] streamText error:", error);
    },
    tools: {
      save_step: tool({
        description:
          "Save an onboarding step value. Call immediately for each field extracted from a resume, or when the user confirms a value. You can and should call this multiple times in a single response.",
        inputSchema: z.object({
          step: z.enum([
            "setupPath",
            "name",
            "selectedSections",
            "title",
            "bio",
            "sections",
            "services",
            "projects",
            "siteUrl",
            "targetAudience",
            "contactPreferences",
            "faqs",
            "tone",
            "handle",
          ]),
          value: z.union([
            z.string(),
            z.object({
              hero: z.union([z.enum(["on"]), z.literal(true)]),
              about: z.boolean(),
              services: z.boolean(),
              projects: z.boolean(),
              cta: z.boolean(),
              socials: z.boolean(),
            }),
            z.array(z.string()),
            z.array(
              z.object({
                title: z.string(),
                description: z.string(),
              })
            ),
          ]),
        }),
        execute: async ({ step, value }) => {
          let normalizedValue = value;
          if (step === "selectedSections" && typeof value === "object" && value !== null && "hero" in value) {
            normalizedValue = { ...value, hero: true };
          }
          const stringValue =
            typeof normalizedValue === "string"
              ? normalizedValue
              : step === "services"
                ? (normalizedValue as string[]).join(", ")
                : step === "projects"
                  ? (normalizedValue as { title: string; description: string }[])
                    .map((p) => `${p.title}: ${p.description}`)
                    .join("\n")
                  : step === "faqs"
                    ? (normalizedValue as string[]).join("\n")
                    : step === "selectedSections"
                      ? JSON.stringify(normalizedValue)
                      : String(normalizedValue);

          const validation = validateStepInput(
            step as OnboardingStep,
            stringValue
          );
          if (!validation.ok) {
            return { success: false, error: validation.message };
          }

          const parsedValue = validation.value;
          const key = step as keyof OnboardingData;
          (collected as Record<string, unknown>)[key] = parsedValue;
          const merged = { ...collected };

          try {
            await db
              .insert(onboardingDrafts)
              .values({
                userId,
                state: merged as Record<string, unknown>,
                updatedAt: new Date(),
              })
              .onConflictDoUpdate({
                target: onboardingDrafts.userId,
                set: {
                  state: merged as Record<string, unknown>,
                  updatedAt: new Date(),
                },
              });
          } catch (dbErr) {
            console.error("save_step db error (table may not exist):", dbErr);
          }

          return { success: true, message: `Saved ${step}` };
        },
      }),
      request_preview: tool({
        description:
          "Call when required onboarding fields are collected for the selected setup path. Returns data for preview UI. Do NOT call complete_onboarding.",
        inputSchema: z.object({
          name: z.string(),
          title: z.string(),
          bio: z.string(),
          services: z.array(z.string()).optional(),
          projects: z.array(
            z.object({
              title: z.string(),
              description: z.string(),
            })
          ).optional(),
          selectedSections: z.object({
            hero: z.union([z.enum(["on"]), z.literal(true)]),
            about: z.boolean(),
            services: z.boolean(),
            projects: z.boolean(),
            cta: z.boolean(),
            socials: z.boolean(),
          }).optional(),
          setupPath: z.enum(["existing-site", "build-new"]),
          siteUrl: z.string().optional(),
          targetAudience: z.string().optional(),
          contactPreferences: z.string().optional(),
          faqs: z.array(z.string()).optional(),
          tone: z.enum(["Professional", "Friendly", "Bold", "Minimal"]),
          handle: z.string(),
        }),
        execute: async (data) => {
          let finalData = data;
          if (data.selectedSections && data.selectedSections.hero === "on") {
            finalData = {
              ...data,
              selectedSections: {
                ...data.selectedSections,
                hero: true as const,
              },
            };
          }
          console.log("[request_preview] execute called with:", finalData);
          const parsed = validateFinalOnboardingState(
            finalData as unknown as OnboardingData
          );
          if (!parsed.ok) {
            console.error(
              "[request_preview] validation failed:",
              parsed.message
            );
            return { preview: false, error: parsed.message };
          }
          const finalState = parsed.value;
          const taken = await getPortfolioByHandle(finalState.handle);
          if (taken) {
            console.warn("[request_preview] handle taken:", finalState.handle);
            return {
              preview: false,
              error:
                "This handle is already taken. Please choose another one.",
            };
          }
          console.log("[request_preview] success!");
          return { preview: true, data: finalState };
        },
      }),
      scrape_website_for_info: tool({
        description:
          "Fetch and extract the readable text from a URL. Call this immediately when the user provides their website URL for the existing-site path.",
        inputSchema: z.object({
          url: z.string().url(),
        }),
        execute: async ({ url }) => {
          let text = "";
          try {
            console.log("[scrape_website_for_info] fetching:", url);
            const res = await fetch(`https://r.jina.ai/${url}`);
            if (!res.ok) {
              const fb = await fetch(url);
              const html = await fb.text();
              text = html.replace(/<[^>]*>?/gm, " ").replace(/\s+/g, " ").substring(0, 15000);
            } else {
              text = await res.text();
            }
          } catch (error) {
            console.error("[scrape_website_for_info] error:", error);
            return { success: false, error: String(error) };
          }
          return { success: true, text: text.substring(0, 15000) };
        },
      }),
    },
  });

  return result;
}
