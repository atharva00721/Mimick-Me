import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/server";
import { getActivePortfolio } from "@/lib/active-portfolio";
import {
  generatePortfolio,
  PortfolioGenerationError,
} from "@/lib/ai/generate-portfolio";
import { consumeCredits, getCredits } from "@/lib/credits";
import { calculateSectionCount } from "@/lib/portfolio/section-registry";

export async function POST() {
  const session = await getSession();

  if (!session?.user?.id) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const portfolio = await getActivePortfolio(session.user.id);
    if (!portfolio) {
      return NextResponse.json({ ok: false, error: "Portfolio not found" }, { status: 404 });
    }

    type SectionKey = "about" | "hero" | "services" | "projects" | "products" | "history" | "testimonials" | "faq" | "gallery" | "cta";
    const sectionCount = calculateSectionCount(
      (portfolio.content as { visibleSections?: SectionKey[] } | null)?.visibleSections,
      (portfolio.onboardingData as { sections?: SectionKey[] })?.sections
    );
    const creditCost = Math.max(1, sectionCount);

    const currentCredits = await getCredits(session.user.id);
    if (currentCredits < creditCost) {
      return NextResponse.json(
        { ok: false, error: `Not enough credits. This action requires ${creditCost} credits.` },
        { status: 402 }
      );
    }

    await generatePortfolio(session.user.id, portfolio.id);

    const creditsConsumed = await consumeCredits(session.user.id, creditCost);
    if (!creditsConsumed) {
      return NextResponse.json({ ok: false, error: "Not enough credits" }, { status: 402 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof PortfolioGenerationError) {
      if (error.message === "Portfolio not found") {
        return NextResponse.json({ ok: false, error: "Portfolio not found" }, { status: 404 });
      }
      return NextResponse.json(
        { ok: false, error: "Failed to generate portfolio" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: false, error: "Unexpected server error" }, { status: 500 });
  }
}
