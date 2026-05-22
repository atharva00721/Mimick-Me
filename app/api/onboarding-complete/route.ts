import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { onboardingDrafts } from "@/lib/schema";
import { createPortfolio, getPortfolioByHandle } from "@/lib/db/portfolio";
import { generatePortfolio } from "@/lib/ai/generate-portfolio";
import { ACTIVE_PORTFOLIO_COOKIE } from "@/lib/active-portfolio";
import type { OnboardingData } from "@/lib/onboarding/types";
import { validateFinalOnboardingState } from "@/lib/onboarding/validation";
import { consumeCredits, getCredits } from "@/lib/credits";
import { calculateSectionCount } from "@/lib/portfolio/section-registry";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: { state?: Partial<OnboardingData> } = {};
  try {
    const text = await request.text();
    if (text) body = (JSON.parse(text) as { state?: Partial<OnboardingData> }) ?? {};
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  let stateToUse = body?.state;
  if (!stateToUse || Object.keys(stateToUse).length === 0) {
    const [draft] = await db
      .select()
      .from(onboardingDrafts)
      .where(eq(onboardingDrafts.userId, session.user.id))
      .limit(1);
    stateToUse = (draft?.state as Partial<OnboardingData> | undefined) ?? {};
  }

  const parsed = validateFinalOnboardingState(stateToUse ?? {});
  if (!parsed.ok) {
    return NextResponse.json({ ok: false, error: parsed.message }, { status: 400 });
  }

  const finalState = parsed.value;

  try {
    const taken = await getPortfolioByHandle(finalState.handle);
    if (taken) {
      return NextResponse.json(
        { ok: false, error: "This handle is already taken. Please choose another one." },
        { status: 409 }
      );
    }

    const created = await createPortfolio({
      userId: session.user.id,
      handle: finalState.handle,
      onboardingData: finalState,
    });

    if (!created.ok) {
      return NextResponse.json(
        { ok: false, error: "Unable to save onboarding data right now." },
        { status: 500 }
      );
    }

    // For "I already have a website" (agent-only): auto-generate portfolio content from onboarding data
    // so they don't need to manually generate—their site info becomes a minimal landing page + agent.
    if (finalState.setupPath === "existing-site" && created.portfolioId) {
      try {
        const creditCost = calculateSectionCount(finalState.sections);
        const currentCredits = await getCredits(session.user.id);
        if (currentCredits >= creditCost) {
          await generatePortfolio(session.user.id, created.portfolioId);
          await consumeCredits(session.user.id, creditCost);
        }
      } catch (err) {
        console.error("[onboarding-complete] Auto-generate content failed:", err);
        // Non-blocking: user can still generate manually from Portfolio page
      }
    }

    // Clean up the draft
    await db.delete(onboardingDrafts).where(eq(onboardingDrafts.userId, session.user.id));

    // Set the newly-created portfolio as active so the user lands in it
    const response = NextResponse.json({ ok: true, redirectTo: "/dashboard" });
    response.cookies.set(ACTIVE_PORTFOLIO_COOKIE, created.portfolioId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });

    return response;
  } catch (error) {
    console.error("Failed to complete onboarding", error);
    return NextResponse.json({ ok: false, error: "Unable to complete onboarding right now." }, { status: 500 });
  }
}
