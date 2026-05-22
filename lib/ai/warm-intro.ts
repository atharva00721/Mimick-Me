import { generateObject } from "ai";
import { z } from "zod";
import { resolveChatModel } from "@/lib/ai/model-provider";

const warmIntroSchema = z.object({
  subject: z.string().min(5).max(140),
  body: z.string().min(40).max(1800),
});

export type WarmIntroDraft = z.infer<typeof warmIntroSchema>;

interface WarmIntroInput {
  recipientName?: string | null;
  recipientEmail?: string | null;
  budget?: string | null;
  projectSummary?: string | null;
  projectDetails?: string | null;
  recentConversation?: Array<{ role: "user" | "assistant"; content: string }>;
}

const SYSTEM_PROMPT = `You write short, professional, warm outreach emails for business owners.

Goal:
- Draft a follow-up email the portfolio owner can send to a captured lead.

Rules:
- Keep it concise and naturally human.
- Personalize with available context from summary/details/conversation.
- Mention one concrete observation from the lead's need.
- Add one clear CTA asking for a quick next step.
- Do not invent facts.
- Do not include markdown.
- Sign off with: "Best,\n[Your Name]" so users can customize.
- Return only JSON matching the schema.`;

export async function generateWarmIntroDraft(input: WarmIntroInput): Promise<WarmIntroDraft> {
  const model = resolveChatModel("google/gemini-3-flash");

  const contextLines = [
    `Lead name: ${input.recipientName || "Unknown"}`,
    `Lead email: ${input.recipientEmail || "Unknown"}`,
    `Budget: ${input.budget || "Unknown"}`,
    `Conversation summary: ${input.projectSummary || "None"}`,
    `Project details: ${input.projectDetails || "None"}`,
    "Recent conversation:",
    ...(input.recentConversation?.slice(-8).map((message) => `${message.role}: ${message.content}`) ?? ["None"]),
  ];

  const { object } = await generateObject({
    model,
    schema: warmIntroSchema,
    system: SYSTEM_PROMPT,
    prompt: contextLines.join("\n"),
  });

  return object;
}

