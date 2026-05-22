import {
  leadConfidenceThresholdForMode,
  type ConversationStrategyMode,
} from "@/lib/agent/strategy-modes";
import { classifyAiError } from "@/lib/ai/safe-logging";
import { hasSufficientLeadFields, parseLeadChannelsFromText } from "@/lib/ai/public-chat/lead-parsing";
import { FALLBACK_REPLY, type LeadFieldPayload } from "@/lib/ai/public-chat/types";
import type { GenerateAgentReplyOutput } from "@/lib/ai/generate-agent-reply";

export function mapLeadFields(message: string, result: GenerateAgentReplyOutput): LeadFieldPayload {
  const extractedChannels = parseLeadChannelsFromText(message);
  return {
    email: result.lead.lead_data?.email?.trim() || null,
    phone: extractedChannels.phone,
    website: extractedChannels.website,
    budget: result.lead.lead_data?.budget?.trim() || null,
    projectDetails: result.lead.lead_data?.project_details?.trim() || null,
  };
}

export function evaluateLeadDetection(input: {
  strategyMode: ConversationStrategyMode;
  industryType: string | null;
  result: GenerateAgentReplyOutput;
  leadFields: LeadFieldPayload;
}): { leadDetected: boolean; threshold: number; passesFieldThreshold: boolean } {
  const threshold = leadConfidenceThresholdForMode(input.strategyMode, input.industryType);
  const passesFieldThreshold = hasSufficientLeadFields(input.strategyMode, input.leadFields);

  const leadDetected =
    input.strategyMode !== "passive" &&
    input.result.lead.lead_detected &&
    input.result.lead.confidence >= threshold &&
    passesFieldThreshold;

  return { leadDetected, threshold, passesFieldThreshold };
}

export function mapPublicChatHandlerError(error: unknown): {
  errorType: string;
  message: string;
  stack?: string;
  fallbackReply: string;
} {
  return {
    errorType: classifyAiError(error),
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    fallbackReply: FALLBACK_REPLY,
  };
}
