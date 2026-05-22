import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/server";
import { getActivePortfolio } from "@/lib/active-portfolio";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { consumeCredits, getCredits } from "@/lib/credits";
import type { PortfolioSectionKey } from "@/lib/portfolio/section-registry";

const nebius = createOpenAI({
    apiKey: process.env.NEBIUS_API_KEY,
    baseURL: process.env.NEBIUS_BASE_URL ?? "https://api.studio.nebius.com/v1",
});

const MODEL = "moonshotai/Kimi-K2.5";
const CREDIT_COST = 1;

// Per-section JSON schema hints so the model knows exactly what to return
const SECTION_SCHEMAS: Record<PortfolioSectionKey, string> = {
    hero: `{ "hero": { "headline": string, "subheadline": string, "ctaText": string } }`,
    about: `{ "about": { "paragraph": string } }`,
    services: `{ "services": [ { "title": string, "description": string } ] }`,
    projects: `{ "projects": [ { "title": string, "description": string, "result": string } ] }`,
    products: `{ "products": [ { "title": string, "description": string, "price": string, "url": string, "image": string } ] }`,
    history: `{ "history": [ { "role": string, "company": string, "period": string, "description": string } ] }`,
    testimonials: `{ "testimonials": [ { "quote": string, "author": string, "role": string } ] }`,
    faq: `{ "faq": [ { "question": string, "answer": string } ] }`,
    gallery: `{ "gallery": [ { "url": string, "caption": string } ] }`,
    cta: `{ "cta": { "headline": string, "subtext": string } }`,
};

const ARRAY_SECTIONS: PortfolioSectionKey[] = [
    "services", "projects", "products", "history", "testimonials", "faq", "gallery",
];

function stripCodeFences(text: string) {
    let t = text.trim();
    if (t.startsWith("```json")) t = t.replace(/^```json/, "");
    else if (t.startsWith("```")) t = t.replace(/^```/, "");
    if (t.endsWith("```")) t = t.replace(/```$/, "");
    return t.trim();
}

export async function POST(req: Request) {
    const session = await getSession();
    if (!session?.user?.id) {
        return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const section = body.section as PortfolioSectionKey | undefined;
    const direction: string | undefined = body.direction;

    if (!section || !SECTION_SCHEMAS[section]) {
        return NextResponse.json({ ok: false, error: "Invalid section" }, { status: 400 });
    }

    try {
        const portfolio = await getActivePortfolio(session.user.id);
        if (!portfolio) {
            return NextResponse.json({ ok: false, error: "Portfolio not found" }, { status: 404 });
        }

        const currentCredits = await getCredits(session.user.id);
        if (currentCredits < CREDIT_COST) {
            return NextResponse.json({ ok: false, error: "Not enough credits" }, { status: 402 });
        }

        const isArray = ARRAY_SECTIONS.includes(section);
        const systemPrompt = `You are a portfolio content generation engine.
Generate output as valid JSON only.
Do not use markdown. Do not include code fences. Do not include explanations.
Output must be a single JSON object matching this exact shape:
${SECTION_SCHEMAS[section]}
${isArray ? "For arrays, generate a MAXIMUM of 2 to 3 items. Keep text concise and punchy." : "Keep text concise and punchy."}`;

        const directionHint = direction?.trim()
            ? `\n\nSpecific direction from the user: "${direction.trim()}"`
            : "";

        const prompt = `Regenerate the "${section}" section for this portfolio. Return valid JSON only.${directionHint}

Portfolio onboarding context:
${JSON.stringify(portfolio.onboardingData)}`;

        const response = await generateText({
            model: nebius.chat(MODEL),
            system: systemPrompt,
            prompt,
            temperature: 0.6,
            maxOutputTokens: 2048,
        });

        let parsed: Record<string, unknown>;
        try {
            parsed = JSON.parse(stripCodeFences(response.text));
        } catch {
            // Retry once on bad JSON
            const retry = await generateText({
                model: nebius.chat(MODEL),
                system: systemPrompt,
                prompt: `${prompt}\n\nYour previous response was invalid JSON. Return only valid JSON.`,
                temperature: 0.4,
                maxOutputTokens: 2048,
            });
            parsed = JSON.parse(stripCodeFences(retry.text));
        }

        // Ensure the top-level key matches the section
        if (!(section in parsed)) {
            return NextResponse.json({ ok: false, error: "Generation returned unexpected shape" }, { status: 500 });
        }

        const creditsConsumed = await consumeCredits(session.user.id, CREDIT_COST);
        if (!creditsConsumed) {
            return NextResponse.json({ ok: false, error: "Not enough credits" }, { status: 402 });
        }

        return NextResponse.json({ ok: true, data: { [section]: parsed[section] } });
    } catch (error) {
        console.error("[section-regenerate] error", error);
        return NextResponse.json({ ok: false, error: "Failed to regenerate section" }, { status: 500 });
    }
}
