import { and, eq } from "drizzle-orm";
import { checkPortfolioLimit } from "@/lib/billing";
import { db } from "@/lib/db";
import { portfolios } from "@/lib/schema";
import type { CreatePortfolioInput } from "./types";

export async function createPortfolio(input: CreatePortfolioInput) {
  try {
    const limitCheck = await checkPortfolioLimit(input.userId);
    if (!limitCheck.allowed) {
      return { ok: false as const, reason: "limit_reached" as const };
    }

    const firstName = input.onboardingData.name?.split(" ")[0];
    const portfolioName =
      input.name ?? (firstName ? `${firstName}'s Portfolio` : "My Portfolio");

    const [created] = await db
      .insert(portfolios)
      .values({
        id: crypto.randomUUID(),
        userId: input.userId,
        name: portfolioName,
        handle: input.handle,
        subdomain: null,
        onboardingData: input.onboardingData as any,
        template: "modern",
        theme: "minimal",
        isPublished: false,
        content: null,
        updatedAt: new Date(),
      })
      .returning({ id: portfolios.id });

    return { ok: true as const, portfolioId: created.id };
  } catch (error) {
    console.error("Failed to create portfolio", error);
    return { ok: false as const, reason: "db_error" as const };
  }
}

export async function deletePortfolioById(portfolioId: string, userId: string) {
  try {
    await db
      .delete(portfolios)
      .where(and(eq(portfolios.id, portfolioId), eq(portfolios.userId, userId)));
    return { ok: true as const };
  } catch (error) {
    console.error("Failed to delete portfolio", error);
    return { ok: false as const };
  }
}

/** @deprecated Use deletePortfolioById instead */
export async function deletePortfolioByUserId(userId: string) {
  try {
    await db.delete(portfolios).where(eq(portfolios.userId, userId));
    return { ok: true as const };
  } catch (error) {
    console.error("Failed to delete portfolio", error);
    return { ok: false as const };
  }
}
