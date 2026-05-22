import { generateAgentReply, type GenerateAgentReplyOutput } from "@/lib/ai/generate-agent-reply";
import type { PublicHistoryMessage } from "@/lib/validation/public-chat";
import type { ResolvedPublicAgentContext } from "@/lib/ai/public-chat/agent-context";

export async function invokePublicChatModel(input: {
  context: ResolvedPublicAgentContext;
  message: string;
  history: PublicHistoryMessage[];
}): Promise<GenerateAgentReplyOutput> {
  const { context, message, history } = input;

  return generateAgentReply({
    agentId: context.agentId,
    model: context.model,
    temperature: context.temperature,
    behaviorType: context.behaviorType,
    strategyMode: context.strategyMode,
    customPrompt: context.customPrompt,
    displayName: context.displayName,
    avatarUrl: context.avatarUrl,
    intro: context.intro,
    roleLabel: context.roleLabel,
    message,
    history,
    portfolio: context.content,
    workingHours: context.workingHours,
    offDays: context.offDays,
  });
}
