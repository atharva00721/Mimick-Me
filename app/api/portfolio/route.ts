import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { onboardingDrafts } from "@/lib/schema";
import { getActivePortfolio } from "@/lib/active-portfolio";
import { deletePortfolioById } from "@/lib/db/portfolio";

export async function DELETE() {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Find the active portfolio and delete only it (not all portfolios)
    const portfolio = await getActivePortfolio(session.user.id);
    if (!portfolio) {
      return NextResponse.json({ ok: false, error: "Portfolio not found" }, { status: 404 });
    }

    await db.delete(onboardingDrafts).where(eq(onboardingDrafts.userId, session.user.id));
    const result = await deletePortfolioById(portfolio.id, session.user.id);

    if (!result.ok) {
      return NextResponse.json({ ok: false, error: "Failed to delete portfolio" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete portfolio", error);
    return NextResponse.json({ ok: false, error: "Failed to delete" }, { status: 500 });
  }
}
