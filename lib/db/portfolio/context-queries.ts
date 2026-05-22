import { and, eq } from "drizzle-orm";
import { db, withRetry } from "@/lib/db";
import { agents, portfolios, users } from "@/lib/schema";

const basePortfolioAgentSelect = {
  id: portfolios.id,
  userId: portfolios.userId,
  name: portfolios.name,
  handle: portfolios.handle,
  template: portfolios.template,
  content: portfolios.content,
  isPublished: portfolios.isPublished,
  agentId: agents.id,
  agentIsEnabled: agents.isEnabled,
  agentModel: agents.model,
  agentBehaviorType: agents.behaviorType,
  agentStrategyMode: agents.strategyMode,
  agentCustomPrompt: agents.customPrompt,
  agentTemperature: agents.temperature,
  agentDisplayName: agents.displayName,
  agentAvatarUrl: agents.avatarUrl,
  agentIntro: agents.intro,
  agentRoleLabel: agents.roleLabel,
  agentNotificationEmail: agents.notificationEmail,
  agentWorkingHours: agents.workingHours,
  agentOffDays: agents.offDays,
};

export async function getPublishedPortfolioWithAgentBySubdomain(subdomain: string) {
  try {
    const [row] = await withRetry(() => db
      .select({
        ...basePortfolioAgentSelect,
        subdomain: portfolios.subdomain,
        plan: users.plan,
      })
      .from(portfolios)
      .leftJoin(agents, eq(agents.portfolioId, portfolios.id))
      .leftJoin(users, eq(users.id, portfolios.userId))
      .where(and(eq(portfolios.subdomain, subdomain), eq(portfolios.isPublished, true)))
      .limit(1));
    return row ?? null;
  } catch (error) {
    console.error("Failed to fetch published portfolio with agent by subdomain", error);
    return null;
  }
}

export async function getPublishedPortfolioWithAgentByHandle(handle: string) {
  try {
    const [row] = await withRetry(() => db
      .select({
        ...basePortfolioAgentSelect,
        plan: users.plan,
      })
      .from(portfolios)
      .leftJoin(agents, eq(agents.portfolioId, portfolios.id))
      .leftJoin(users, eq(users.id, portfolios.userId))
      .where(and(eq(portfolios.handle, handle), eq(portfolios.isPublished, true)))
      .limit(1));
    return row ?? null;
  } catch (error) {
    console.error("Failed to fetch published portfolio with agent", error);
    return null;
  }
}

export async function getPortfolioWithAgentByHandle(handle: string) {
  try {
    const [row] = await db
      .select(basePortfolioAgentSelect)
      .from(portfolios)
      .leftJoin(agents, eq(agents.portfolioId, portfolios.id))
      .where(eq(portfolios.handle, handle))
      .limit(1);
    return row ?? null;
  } catch (error) {
    console.error("Failed to fetch portfolio with agent", error);
    return null;
  }
}

export async function getPublishedPortfolioWithAgentByAgentId(agentId: string) {
  try {
    const [row] = await db
      .select(basePortfolioAgentSelect)
      .from(portfolios)
      .innerJoin(agents, eq(agents.portfolioId, portfolios.id))
      .where(and(eq(agents.id, agentId), eq(portfolios.isPublished, true)))
      .limit(1);
    return row ?? null;
  } catch (error) {
    console.error("Failed to fetch published portfolio with agent id", error);
    return null;
  }
}

export async function getPortfolioWithAgentByAgentId(agentId: string) {
  try {
    const [row] = await db
      .select(basePortfolioAgentSelect)
      .from(portfolios)
      .innerJoin(agents, eq(agents.portfolioId, portfolios.id))
      .where(eq(agents.id, agentId))
      .limit(1);
    return row ?? null;
  } catch (error) {
    console.error("Failed to fetch portfolio with agent id", error);
    return null;
  }
}

export async function getPortfolioBackedAgentContextByAgentId(agentId: string) {
  return getPortfolioWithAgentByAgentId(agentId);
}

export async function getPortfolioBackedAgentContextByHandle(handle: string) {
  return getPortfolioWithAgentByHandle(handle);
}
