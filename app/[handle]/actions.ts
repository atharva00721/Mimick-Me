"use server";

import { getSession } from "@/lib/auth/server";
import { handlePublicChat, type PublicChatResult } from "@/lib/ai/public-chat-handler";
import { sanitizeHistory } from "@/lib/validation/public-chat";

export async function widgetChatWithAgent(body: {
    handle: string;
    message: string;
    history: { role: "user" | "assistant"; content: string }[];
    sessionId?: string | null;
}): Promise<PublicChatResult> {
    let userId: string | null = null;
    try {
        const session = await getSession();
        userId = session?.user?.id ?? null;
    } catch {
        // public visitors are typically unauthenticated
    }

    return handlePublicChat({
        handle: body.handle,
        agentId: null,
        message: body.message,
        history: sanitizeHistory(body.history),
        sessionId: body.sessionId ?? null,
        ip: "widget",
        userId,
    });
}
