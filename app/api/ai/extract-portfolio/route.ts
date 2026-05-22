import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/server";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { consumeCredits, getCredits } from "@/lib/credits";

const nebius = createOpenAI({
    apiKey: process.env.NEBIUS_API_KEY,
    baseURL: process.env.NEBIUS_BASE_URL ?? "https://api.studio.nebius.com/v1",
});

const MODEL = "moonshotai/Kimi-K2.5";
const CREDIT_COST = 1;

const SYSTEM_PROMPT = `You are a portfolio content extraction engine.
Given a raw scrape of a professional website, extract the user's details.
Generate output as valid JSON only.
Do not use markdown.
Do not include code fences.
Do not include explanations.
Do not include any keys other than the required schema.
Use a professional, concise tone.
Output must be a single JSON object matching this exact TypeScript shape:
{
  "hero": {
    "headline": string,
    "subheadline": string
  },
  "about": {
    "paragraph": string
  },
  "services": [
    {
      "title": string,
      "description": string
    }
  ],
  "projects": [
    {
      "title": string,
      "description": string,
      "result": string
    }
  ],
  "faq": [
    {
      "question": string,
      "answer": string
    }
  ]
}`;

export async function POST(request: Request) {
    const session = await getSession();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { text } = await request.json();
        if (!text || typeof text !== "string") {
            return NextResponse.json({ error: "Text is required" }, { status: 400 });
        }

        const currentCredits = await getCredits(session.user.id);
        if (currentCredits < CREDIT_COST) {
            return NextResponse.json({ error: "Not enough credits" }, { status: 402 });
        }

        const response = await generateText({
            model: nebius.chat(MODEL),
            system: SYSTEM_PROMPT,
            prompt: `Extract portfolio content from the following scraped text:\n\n${text.substring(0, 15000)}`,
            temperature: 0.3,
        });

        let cleaned = response.text.trim();
        if (cleaned.startsWith("```json")) {
            cleaned = cleaned.replace(/^```json/, "").replace(/```$/, "");
        } else if (cleaned.startsWith("```")) {
            cleaned = cleaned.replace(/^```/, "").replace(/```$/, "");
        }
        cleaned = cleaned.trim();

        const parsed = JSON.parse(cleaned);

        const creditsConsumed = await consumeCredits(session.user.id, CREDIT_COST);
        if (!creditsConsumed) {
            return NextResponse.json({ error: "Not enough credits" }, { status: 402 });
        }

        return NextResponse.json({ success: true, data: parsed });
    } catch (error) {
        console.error("[api/ai/extract-portfolio] error:", error);
        return NextResponse.json({ error: "Failed to extract content" }, { status: 500 });
    }
}
