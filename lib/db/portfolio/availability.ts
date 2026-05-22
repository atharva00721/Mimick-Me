import { eq } from "drizzle-orm";
import { db, withRetry } from "@/lib/db";
import { portfolios } from "@/lib/schema";

export async function isHandleAvailable(handle: string): Promise<boolean> {
  try {
    const [existing] = await withRetry(() => db
      .select({ id: portfolios.id })
      .from(portfolios)
      .where(eq(portfolios.handle, handle))
      .limit(1));
    return !existing;
  } catch (error) {
    console.error("Failed to check handle availability", error);
    return false;
  }
}

export async function isSubdomainAvailable(subdomain: string, currentPortfolioId?: string) {
  try {
    const [existing] = await withRetry(() => db
      .select({ id: portfolios.id })
      .from(portfolios)
      .where(eq(portfolios.subdomain, subdomain))
      .limit(1));

    if (!existing) return true;
    return currentPortfolioId ? existing.id === currentPortfolioId : false;
  } catch (error) {
    console.error("Failed to check subdomain availability", error);
    return false;
  }
}
