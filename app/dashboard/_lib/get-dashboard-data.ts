import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { getActivePortfolio } from "@/lib/active-portfolio";
import { getAgentByPortfolioId, getAgentByUserId } from "@/lib/agent/configure";
import { getSession } from "@/lib/auth/server";

async function requireAuthUserId() {
  const session = await getSession();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

export async function getDashboardData() {
  const userId = await requireAuthUserId();

  const profile = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (profile?.billingPastDueSince) {
    const { checkAndHandlePastDueDowngrade } = await import("@/lib/billing-utils");
    const didDowngrade = await checkAndHandlePastDueDowngrade(userId, profile.billingPastDueSince);
    if (didDowngrade) {
      // Re-fetch profile if downgraded
      const updatedProfile = await db.query.users.findFirst({
        where: eq(users.id, userId),
      });
      return {
        portfolio: await getActivePortfolio(userId),
        agent: await getAgentByUserId(userId),
        plan: updatedProfile?.plan ?? "free"
      };
    }
  }

  const portfolio = await getActivePortfolio(userId);

  if (!portfolio) {
    const agent = await getAgentByUserId(userId);
    return { portfolio: null, agent, plan: profile?.plan ?? "free" };
  }

  const portfolioAgent = await getAgentByPortfolioId(portfolio.id);
  const agent = portfolioAgent ?? (await getAgentByUserId(userId));
  return { portfolio, agent, plan: profile?.plan ?? "free" };
}
