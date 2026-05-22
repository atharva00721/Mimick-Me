import { and, desc, eq } from "drizzle-orm";
import { db, withRetry } from "@/lib/db";
import { portfolios } from "@/lib/schema";

/** Returns the first (newest) portfolio for a user. */
export async function getPortfolioByUserId(userId: string) {
  try {
    const [portfolio] = await db
      .select()
      .from(portfolios)
      .where(eq(portfolios.userId, userId))
      .orderBy(desc(portfolios.createdAt))
      .limit(1);
    return portfolio ?? null;
  } catch (error) {
    console.error("Failed to fetch portfolio by user id", error);
    return null;
  }
}

/** Returns all portfolios for a user, newest first. */
export async function getPortfoliosByUserId(userId: string) {
  try {
    return await db
      .select()
      .from(portfolios)
      .where(eq(portfolios.userId, userId))
      .orderBy(desc(portfolios.createdAt));
  } catch (error) {
    console.error("Failed to fetch portfolios by user id", error);
    return [];
  }
}

/** Returns a specific portfolio by ID, verifying it belongs to the given user. */
export async function getPortfolioByIdAndUserId(id: string, userId: string) {
  try {
    const [portfolio] = await db
      .select()
      .from(portfolios)
      .where(and(eq(portfolios.id, id), eq(portfolios.userId, userId)))
      .limit(1);
    return portfolio ?? null;
  } catch (error) {
    console.error("Failed to fetch portfolio by id and user id", error);
    return null;
  }
}

export async function getPortfolioByHandle(handle: string) {
  try {
    const [portfolio] = await withRetry(() => db
      .select({
        id: portfolios.id,
        handle: portfolios.handle,
        template: portfolios.template,
        isPublished: portfolios.isPublished,
        content: portfolios.content,
      })
      .from(portfolios)
      .where(eq(portfolios.handle, handle))
      .limit(1));
    return portfolio ?? null;
  } catch (error) {
    console.error("Failed to fetch portfolio by handle", error);
    return null;
  }
}

/** Returns all published portfolios, newest first. Used for explore/discovery. */
export async function getAllPublishedPortfolios() {
  try {
    return await db
      .select({
        handle: portfolios.handle,
        template: portfolios.template,
        content: portfolios.content,
        name: portfolios.name,
        createdAt: portfolios.createdAt,
      })
      .from(portfolios)
      .where(eq(portfolios.isPublished, true))
      .orderBy(desc(portfolios.createdAt));
  } catch (error) {
    console.error("Failed to fetch published portfolios", error);
    return [];
  }
}

export async function getPublishedPortfolioByHandle(handle: string) {
  try {
    const [portfolio] = await withRetry(() => db
      .select({
        handle: portfolios.handle,
        template: portfolios.template,
        content: portfolios.content,
      })
      .from(portfolios)
      .where(and(eq(portfolios.handle, handle), eq(portfolios.isPublished, true)))
      .limit(1));
    return portfolio ?? null;
  } catch (error) {
    console.error("Failed to fetch published portfolio by handle", error);
    return null;
  }
}
