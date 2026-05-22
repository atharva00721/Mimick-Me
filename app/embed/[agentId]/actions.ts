"use server";

import { getSession } from "@/lib/auth/server";
import { handlePublicChat, type PublicChatResult } from "@/lib/ai/public-chat-handler";
import { sanitizeHistory } from "@/lib/validation/public-chat";

export async function embedChatWithAgent(body: {
    agentId: string;
    message: string;
    history: { role: "user" | "assistant"; content: string }[];
    sessionId?: string | null;
}): Promise<PublicChatResult> {
    let userId: string | null = null;
    try {
        const session = await getSession();
        userId = session?.user?.id ?? null;
    } catch {
        // embed visitors are typically unauthenticated
    }

    return handlePublicChat({
        handle: null,
        agentId: body.agentId,
        message: body.message,
        history: sanitizeHistory(body.history),
        sessionId: body.sessionId ?? null,
        ip: "embed",
        userId,
    });
}
