import { db, getProfileById } from "./db";
import { portfolios, agents, aiTelemetryEvents, agentLeads } from "./schema";
import { eq, count, and, gte, lte, inArray } from "drizzle-orm";
import { startOfMonth, endOfMonth } from "date-fns";
import { PLAN_LIMITS, type PlanTier } from "@/lib/plan-limits";

export async function getUserPlan(userId: string): Promise<PlanTier> {
    const profile = await getProfileById(userId);
    if (!profile) return "free";

    // Normalize missing or invalid plans to "free"
    const plan = (profile.plan || "free").toLowerCase();
    if (plan === "free" || plan === "pro" || plan === "business") {
        return plan as PlanTier;
    }
    return "free";
}

export async function checkPortfolioLimit(userId: string): Promise<{ allowed: boolean; currentCount: number; limit: number }> {
    const plan = await getUserPlan(userId);
    const limit = PLAN_LIMITS[plan].portfolios;

    const [{ value }] = await db
        .select({ value: count() })
        .from(portfolios)
        .where(eq(portfolios.userId, userId));

    return {
        allowed: value < limit,
        currentCount: value,
        limit,
    };
}

export async function checkAgentLimit(userId: string): Promise<{ allowed: boolean; currentCount: number; limit: number }> {
    const plan = await getUserPlan(userId);
    const limit = PLAN_LIMITS[plan].agents;

    const [{ value }] = await db
        .select({ value: count() })
        .from(agents)
        .where(eq(agents.userId, userId));

    return {
        allowed: value < limit,
        currentCount: value,
        limit,
    };
}

export async function checkAiMessageLimit(userId: string): Promise<{ allowed: boolean; currentCount: number; limit: number }> {
    const plan = await getUserPlan(userId);
    const limit = PLAN_LIMITS[plan].aiMessagesPerMonth;

    // We find limits based on telemetry events in the current month matching the user's agents
    // First, get all agents for this user
    const userAgents = await db
        .select({ id: agents.id })
        .from(agents)
        .where(eq(agents.userId, userId));

    if (userAgents.length === 0) {
        return { allowed: true, currentCount: 0, limit };
    }

    const agentIds = userAgents.map(a => a.id);

    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);

    // Optimized: Use a single query with inArray to avoid N+1 problem.
    // Drizzle's inArray throws if the array is empty, so we check userAgents.length above.
    const results = await db
        .select({ value: count() })
        .from(aiTelemetryEvents)
        .where(
            and(
                inArray(aiTelemetryEvents.agentId, agentIds),
                eq(aiTelemetryEvents.eventType, "chat_message"),
                gte(aiTelemetryEvents.createdAt, start),
                lte(aiTelemetryEvents.createdAt, end)
            )
        );
    const totalMessages = results[0]?.value ?? 0;

    return {
        allowed: totalMessages < limit,
        currentCount: totalMessages,
        limit,
    };
}

export async function canUseCalendar(userId: string): Promise<boolean> {
    const plan = await getUserPlan(userId);
    return PLAN_LIMITS[plan].canUseCalendar;
}

export async function canUsePortfolioSubdomain(userId: string): Promise<boolean> {
    const plan = await getUserPlan(userId);
    return PLAN_LIMITS[plan].canCustomDomain;
}

export async function checkLeadCaptureLimit(userId: string): Promise<{ allowed: boolean; currentCount: number; limit: number | null }> {
    const plan = await getUserPlan(userId);
    const limit = PLAN_LIMITS[plan].leadCapturesPerMonth;

    if (limit === null) {
        return { allowed: true, currentCount: 0, limit: null };
    }

    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);

    const ownedAgents = await db
        .select({ id: agents.id })
        .from(agents)
        .where(eq(agents.userId, userId));

    if (ownedAgents.length === 0) {
        return { allowed: true, currentCount: 0, limit };
    }

    const [{ value }] = await db
        .select({ value: count() })
        .from(agentLeads)
        .where(
            and(
                inArray(agentLeads.agentId, ownedAgents.map((agent) => agent.id)),
                gte(agentLeads.createdAt, start),
                lte(agentLeads.createdAt, end)
            )
        );

    return {
        allowed: value < limit,
        currentCount: value,
        limit,
    };
}
