import { db } from "@/lib/db";
import { agents } from "@/lib/schema";
import { decrypt, encrypt } from "@/lib/crypto";
import { eq } from "drizzle-orm";

const CALENDLY_CLIENT_ID = process.env.CALENDLY_CLIENT_ID || "";
const CALENDLY_CLIENT_SECRET = process.env.CALENDLY_CLIENT_SECRET || "";

const getRedirectUri = (origin?: string) => {
    const base = (origin || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
    return `${base}/api/integrations/calendly/callback`;
};

export function getCalendlyOAuthUrl(state: string, origin?: string): string {
    const clientId = process.env.CALENDLY_CLIENT_ID || "";
    const redirectUri = getRedirectUri(origin);

    return `https://auth.calendly.com/oauth/authorize?` +
        `client_id=${clientId}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&state=${encodeURIComponent(state)}` +
        `&response_type=code`;
}

export interface CalendlyTokens {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
    created_at: number;
}

export async function exchangeCodeForTokens(code: string, origin?: string): Promise<CalendlyTokens> {
    const clientId = process.env.CALENDLY_CLIENT_ID || "";
    const clientSecret = process.env.CALENDLY_CLIENT_SECRET || "";
    const redirectUri = getRedirectUri(origin);

    const response = await fetch("https://auth.calendly.com/oauth/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            code,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
            grant_type: "authorization_code",
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to exchange Calendly code for tokens: ${error}`);
    }

    return response.json();
}

export async function getCurrentUserEmail(accessToken: string): Promise<{ email: string, uri: string, schedulingUrl: string }> {
    const response = await fetch("https://api.calendly.com/users/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Failed to get Calendly user info: ${response.status} ${errorBody}`);
    }

    const data = await response.json();
    return {
        email: data.resource.email,
        uri: data.resource.uri,
        schedulingUrl: data.resource.scheduling_url
    };
}

const CALENDLY_WEBHOOK_SIGNING_KEY = process.env.CALENDLY_WEBHOOK_SIGNING_KEY || "";

export async function subscribeToWebhooks(userUri: string, accessToken: string) {
    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");

    const response = await fetch("https://api.calendly.com/webhook_subscriptions", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            url: `${baseUrl}/api/integrations/calendly/webhook`,
            events: ["invitee.created", "invitee.canceled"],
            organization: userUri.split("/users/")[0], // Calendly org URI
            scope: "organization",
            signing_key: CALENDLY_WEBHOOK_SIGNING_KEY,
        }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Failed to subscribe to Calendly webhooks: ${response.status} ${errorBody}`);
        throw new Error(`Failed to subscribe to Calendly webhooks: ${response.status} ${errorBody}`);
    }

    return response.json();
}

export function verifySignature(
    header: string | null,
    body: string
): boolean {
    if (!header || !CALENDLY_WEBHOOK_SIGNING_KEY) return false;

    const parts = header.split(",");
    const timestamp = parts.find((p) => p.startsWith("t="))?.split("=")[1];
    const signature = parts.find((p) => p.startsWith("v1="))?.split("=")[1];

    if (!timestamp || !signature) return false;

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createHmac } = require("node:crypto");
    const hmac = createHmac("sha256", CALENDLY_WEBHOOK_SIGNING_KEY);
    hmac.update(`${timestamp}.${body}`);
    const expectedSignature = hmac.digest("hex");

    return expectedSignature === signature;
}

export async function updateAgentCalendlyConnection(
    agentId: string,
    tokens: CalendlyTokens,
    accountEmail: string,
    userUri: string,
    schedulingUrl?: string
) {
    const tokenExpiry = new Date(Date.now() + tokens.expires_in * 1000);

    await db
        .update(agents)
        .set({
            calendlyEnabled: true,
            calendlyAccessToken: encrypt(tokens.access_token),
            calendlyRefreshToken: encrypt(tokens.refresh_token),
            calendlyTokenExpiry: tokenExpiry,
            calendlyAccountEmail: accountEmail,
            calendlyUserUri: userUri,
            calendlySchedulingUrl: schedulingUrl,
            updatedAt: new Date(),
        })
        .where(eq(agents.id, agentId));
}

export async function disconnectAgentCalendly(agentId: string) {
    await db
        .update(agents)
        .set({
            calendlyEnabled: false,
            calendlyAccessToken: null,
            calendlyRefreshToken: null,
            calendlyTokenExpiry: null,
            calendlyAccountEmail: null,
            calendlyUserUri: null,
            updatedAt: new Date(),
        })
        .where(eq(agents.id, agentId));
}
