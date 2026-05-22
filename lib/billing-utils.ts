import { db } from "./db";
import { users, portfolios, agents } from "./schema";
import { eq, and, lte } from "drizzle-orm";

export const PAST_DUE_GRACE_DAYS = 31;

export async function releaseUserSubdomains(userId: string) {
    await db
        .update(portfolios)
        .set({ subdomain: null })
        .where(eq(portfolios.userId, userId));
}

export async function disconnectUserIntegrations(userId: string) {
    await db
        .update(agents)
        .set({
            googleCalendarEnabled: false,
            googleCalendarAccessToken: null,
            googleCalendarRefreshToken: null,
            googleCalendarTokenExpiry: null,
            googleCalendarAccountEmail: null,
            calendlyEnabled: false,
            calendlyAccessToken: null,
            calendlyRefreshToken: null,
            calendlyTokenExpiry: null,
            calendlyAccountEmail: null,
            calendlyUserUri: null,
            calendlySchedulingUrl: null,
            updatedAt: new Date(),
        })
        .where(eq(agents.userId, userId));
}

export async function downgradeUserToFree(userId: string) {
    await db
        .update(users)
        .set({
            plan: "free",
            billingSubscriptionId: null,
            billingPastDueSince: null,
        })
        .where(eq(users.id, userId));

    await releaseUserSubdomains(userId);
    await disconnectUserIntegrations(userId);
}

export async function checkAndHandlePastDueDowngrade(userId: string, billingPastDueSince: Date | null) {
    if (!billingPastDueSince) return false;

    const threshold = new Date(Date.now() - PAST_DUE_GRACE_DAYS * 24 * 60 * 60 * 1000);

    if (billingPastDueSince <= threshold) {
        await downgradeUserToFree(userId);
        return true;
    }

    return false;
}
