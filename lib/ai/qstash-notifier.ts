import { Client } from "@upstash/qstash";

const qstashClient = new Client({
    token: process.env.QSTASH_TOKEN!,
    baseUrl: process.env.QSTASH_URL, // Optional: if you provided a custom URL
});

type ScheduleLeadNotificationOptions = {
    delaySeconds?: number;
    attempt?: number;
};

export async function scheduleLeadNotification(
    sessionId: string,
    options: ScheduleLeadNotificationOptions = {}
) {
    const delaySeconds = options.delaySeconds ?? 120;
    const attempt = options.attempt ?? 0;
    const token = process.env.QSTASH_TOKEN;
    // Fallback to local 3000 if nothing is set (for local dev)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL;

    if (!token) {
        console.warn("[QStash] Missing QSTASH_TOKEN. Skipping delayed notification.");
        return;
    }

    if (!baseUrl) {
        console.warn("[QStash] Missing NEXT_PUBLIC_APP_URL. QStash needs a public URL to hit your webhook. If testing locally, use ngrok.");
        return;
    }

    try {
        console.log(`[QStash] 🚀 scheduleLeadNotification called for session: ${sessionId}`);
        // Ensure the URL is absolute and correctly formatted
        let protocol = 'https://';
        const cleanBaseUrl = baseUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');

        // Allow local testing if user explicitly set it to localhost
        if (baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1')) {
            protocol = 'http://';
        }

        const webhookUrl = `${protocol}${cleanBaseUrl}/api/webhooks/qstash/lead-notification`;

        await qstashClient.publishJSON({
            url: webhookUrl,
            body: {
                sessionId,
                attempt,
            },
            delay: delaySeconds,
        });

        console.log(`[QStash] Successfully scheduled delayed notification (attempt ${attempt}, delay ${delaySeconds}s) for session ${sessionId} to ${webhookUrl}`);
    } catch (error) {
        console.error("[QStash] Error scheduling notification:", error);
    }
}
