import {
  checkPublicChatAgentRateLimit,
  checkPublicChatHandleRateLimit,
  checkPublicChatIpRateLimit,
} from "@/lib/rate-limit";
import type { PublicChatInput, PublicChatResult } from "@/lib/ai/public-chat/types";

export function normalizePublicChatRequest(input: PublicChatInput): {
  sessionId: string;
  rateLimitError: PublicChatResult | null;
} {
  const sessionId = input.sessionId || crypto.randomUUID();

  if (!checkPublicChatIpRateLimit(input.ip)) {
    return { sessionId, rateLimitError: { ok: false, error: "Rate limit exceeded", status: 429 } };
  }

  if (input.handle && !checkPublicChatHandleRateLimit(input.handle)) {
    return { sessionId, rateLimitError: { ok: false, error: "Rate limit exceeded", status: 429 } };
  }

  if (input.agentId && !checkPublicChatAgentRateLimit(input.agentId)) {
    return { sessionId, rateLimitError: { ok: false, error: "Rate limit exceeded", status: 429 } };
  }

  return { sessionId, rateLimitError: null };
}
