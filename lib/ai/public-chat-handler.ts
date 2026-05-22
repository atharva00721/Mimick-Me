import {
  isHandleTemporarilyBlocked,
  markHandleAiFailure,
  markHandleAiSuccess,
} from "@/lib/ai/failure-guard";
import { logPublicAgentEvent } from "@/lib/ai/safe-logging";
import { saveLeadWithDedup } from "@/lib/db/agent-leads";
import { trackAnalytics } from "@/lib/db/analytics";
import { saveChatMessage } from "@/lib/db/lead-chats";
import { consumeCredits, getCredits } from "@/lib/credits";
import { resolvePublicAgentContext } from "@/lib/ai/public-chat/agent-context";
import { hasSufficientLeadFields, parseLeadChannelsFromText } from "@/lib/ai/public-chat/lead-parsing";
import { invokePublicChatModel } from "@/lib/ai/public-chat/model-invocation";
import { mapPublicChatHandlerError, mapLeadFields, evaluateLeadDetection } from "@/lib/ai/public-chat/response-policy";
import { normalizePublicChatRequest } from "@/lib/ai/public-chat/request-normalization";
import {
  CREDIT_COST,
  type LeadFieldPayload,
  type PublicChatInput,
  type PublicChatResult,
} from "@/lib/ai/public-chat/types";

export type { LeadFieldPayload, PublicChatInput, PublicChatResult } from "@/lib/ai/public-chat/types";
export { hasSufficientLeadFields, parseLeadChannelsFromText } from "@/lib/ai/public-chat/lead-parsing";

export async function handlePublicChat(input: PublicChatInput): Promise<PublicChatResult> {
  const startedAt = Date.now();
  const { sessionId, rateLimitError } = normalizePublicChatRequest(input);

  try {
    if (rateLimitError) {
      return rateLimitError;
    }

    if (input.handle && isHandleTemporarilyBlocked(input.handle)) {
      return {
        ok: true,
        reply: "Agent temporarily unavailable. Please try again later.",
        leadDetected: false,
        sessionId,
      };
    }

    if (input.userId) {
      const currentCredits = await getCredits(input.userId);
      if (currentCredits < CREDIT_COST) {
        return { ok: false, error: "Not enough credits", status: 402 };
      }
    }

    const resolvedContext = await resolvePublicAgentContext({
      agentId: input.agentId,
      handle: input.handle,
      userId: input.userId,
    });

    if (!resolvedContext.ok) {
      if (resolvedContext.error.fallbackReason) {
        await logPublicAgentEvent({
          handle: input.handle ?? "unknown",
          agentId: input.agentId,
          portfolioId: null,
          sessionId,
          model: "unknown",
          mode: "unknown",
          tokensUsed: 0,
          leadDetected: false,
          confidence: 0,
          success: false,
          fallbackReason: resolvedContext.error.fallbackReason,
          latencyMs: Date.now() - startedAt,
          creditCost: 0,
        });
      }

      return { ok: false, error: resolvedContext.error.error, status: resolvedContext.error.status };
    }

    const context = resolvedContext.data;
    const result = await invokePublicChatModel({
      context,
      message: input.message,
      history: input.history,
    });

    const industryType = context.content?.about?.paragraph ?? null;
    const leadFields: LeadFieldPayload = mapLeadFields(input.message, result);
    const { leadDetected, threshold, passesFieldThreshold } = evaluateLeadDetection({
      strategyMode: context.strategyMode,
      industryType,
      result,
      leadFields,
    });

    if (input.handle) {
      if (result.errorType) {
        markHandleAiFailure(input.handle);
      } else {
        markHandleAiSuccess(input.handle);
      }
    }

    const latencyMs = Date.now() - startedAt;
    void (async () => {
      try {
        if (input.userId) {
          await consumeCredits(input.userId, CREDIT_COST);
        }

        await saveChatMessage({ sessionId, role: "user", content: input.message });
        await saveChatMessage({ sessionId, role: "assistant", content: result.reply });

        if (leadDetected) {
          const ownerId = (context.portfolio as { userId?: string } | null)?.userId ?? (context.standaloneAgent as { userId: string })?.userId;
          const dedupeResult = await saveLeadWithDedup({
            agentId: context.agentId,
            portfolioId: context.portfolio?.id ?? null,
            ownerUserId: ownerId,
            name: result.lead.lead_data?.name?.trim() || null,
            email: leadFields.email,
            phone: leadFields.phone,
            website: leadFields.website,
            budget: leadFields.budget,
            projectDetails: leadFields.projectDetails,
            meetingTime: result.lead.lead_data?.meeting_time?.trim() || null,
            confidence: result.lead.confidence,
            sessionId,
            captureTurn: input.history.length + 1,
          });

          if (dedupeResult === "inserted" || dedupeResult === "updated") {
            try {
              const { scheduleLeadNotification } = await import("@/lib/ai/qstash-notifier");
              await scheduleLeadNotification(sessionId);
            } catch (e) {
              console.error("Failed to schedule QStash notification", e);
            }
          }
        }

        await logPublicAgentEvent({
          handle: context.handle,
          agentId: context.agentId,
          portfolioId: context.portfolio?.id ?? null,
          sessionId,
          model: context.model,
          mode: context.strategyMode,
          tokensUsed: result.usage.totalTokens,
          leadDetected,
          confidence: result.lead.confidence,
          success: !result.errorType,
          fallbackReason: result.errorType ?? null,
          latencyMs,
          creditCost: input.userId ? CREDIT_COST : 0,
          metadata: {
            historyCount: input.history.length,
            threshold,
            industryType,
            passesFieldThreshold,
          },
        });

        if (context.portfolio) {
          const isFirstMessage = !input.history || input.history.length === 0;
          if (isFirstMessage) {
            await trackAnalytics({
              portfolioId: context.portfolio.id,
              type: "chat_session_start",
              sessionId,
            });
          }

          await trackAnalytics({
            portfolioId: context.portfolio.id,
            type: "chat_message",
            sessionId,
          });
        }
      } catch (bgErr) {
        console.error(
          JSON.stringify({
            event: "public_chat_background_error",
            message: bgErr instanceof Error ? bgErr.message : String(bgErr),
            timestamp: new Date().toISOString(),
          })
        );
      }
    })();

    return { ok: true, reply: result.reply, leadDetected, sessionId };
  } catch (error) {
    const mappedError = mapPublicChatHandlerError(error);

    console.error(
      JSON.stringify({
        event: "public_chat_handler_error",
        error_type: mappedError.errorType,
        message: mappedError.message,
        ...(mappedError.stack && { stack: mappedError.stack }),
        timestamp: new Date().toISOString(),
      })
    );

    await logPublicAgentEvent({
      handle: input.handle ?? "unknown",
      agentId: input.agentId ?? null,
      portfolioId: null,
      sessionId,
      model: "unknown",
      mode: "unknown",
      tokensUsed: 0,
      leadDetected: false,
      confidence: 0,
      success: false,
      fallbackReason: `HandlerError:${mappedError.errorType}`,
      latencyMs: Date.now() - startedAt,
      creditCost: 0,
      metadata: {
        message: mappedError.message,
      },
    });

    return { ok: true, reply: mappedError.fallbackReply, leadDetected: false, sessionId };
  }
}
