import { isBehaviorPresetType, type BehaviorPresetType } from "@/lib/agent/behavior-presets";
import { isSupportedAgentModel } from "@/lib/agent/models";
import {
  isConversationStrategyMode,
  type ConversationStrategyMode,
} from "@/lib/agent/strategy-modes";
import { getAgentCoreConfigById } from "@/lib/db/knowledge";
import {
  getPortfolioBackedAgentContextByAgentId,
  getPortfolioBackedAgentContextByHandle,
} from "@/lib/db/portfolio";
import { validatePortfolioContent } from "@/lib/validation/portfolio-schema";

export type ResolvedPublicAgentContext = {
  portfolio:
  | Awaited<ReturnType<typeof getPortfolioBackedAgentContextByAgentId>>
  | Awaited<ReturnType<typeof getPortfolioBackedAgentContextByHandle>>
  | null;
  standaloneAgent: Awaited<ReturnType<typeof getAgentCoreConfigById>> | null;
  agentId: string;
  handle: string;
  model: string;
  temperature: number;
  behaviorType: BehaviorPresetType | null;
  strategyMode: ConversationStrategyMode;
  content: ReturnType<typeof validatePortfolioContent> | null;
  displayName: string | null;
  avatarUrl: string | null;
  intro: string | null;
  roleLabel: string | null;
  workingHours: { dayOfWeek: number; startTime: string; endTime: string; enabled: boolean }[] | null;
  offDays: string[] | null;
  customPrompt: string | null;
};

export type ResolveAgentError = {
  error: string;
  status: number;
  fallbackReason?: string;
};

export async function resolvePublicAgentContext(input: {
  agentId: string | null;
  handle: string | null;
  userId: string | null;
}): Promise<{ ok: true; data: ResolvedPublicAgentContext } | { ok: false; error: ResolveAgentError }> {
  const portfolio = input.agentId
    ? await getPortfolioBackedAgentContextByAgentId(input.agentId)
    : await getPortfolioBackedAgentContextByHandle(input.handle ?? "");

  const standaloneAgent = !portfolio && input.agentId ? await getAgentCoreConfigById(input.agentId) : null;

  if (!portfolio && !standaloneAgent) {
    return { ok: false, error: { error: "Agent not found", status: 404 } };
  }

  if (portfolio && !portfolio.isPublished && portfolio.userId !== input.userId) {
    return { ok: false, error: { error: "Portfolio not found", status: 404 } };
  }

  const agentId = portfolio?.agentId ?? standaloneAgent?.agentId;
  const agentIsEnabled = portfolio?.agentIsEnabled ?? standaloneAgent?.isEnabled;
  const agentModel = portfolio?.agentModel ?? standaloneAgent?.model;
  const agentTemperature = portfolio?.agentTemperature ?? standaloneAgent?.temperature;

  if (!agentId || !agentIsEnabled || !agentModel) {
    return { ok: false, error: { error: "Agent unavailable", status: 404 } };
  }

  if (!isSupportedAgentModel(agentModel)) {
    return {
      ok: false,
      error: {
        error: "Agent model misconfigured",
        status: 500,
        fallbackReason: "AgentModelMisconfigured",
      },
    };
  }

  if (typeof agentTemperature !== "number" || agentTemperature < 0.2 || agentTemperature > 0.8) {
    return {
      ok: false,
      error: {
        error: "Agent temperature misconfigured",
        status: 500,
        fallbackReason: "AgentTemperatureMisconfigured",
      },
    };
  }

  const behaviorTypeRaw = portfolio?.agentBehaviorType ?? standaloneAgent?.behaviorType;
  const behaviorType = behaviorTypeRaw && isBehaviorPresetType(behaviorTypeRaw) ? behaviorTypeRaw : null;

  const strategyRaw = portfolio?.agentStrategyMode ?? standaloneAgent?.strategyMode;
  const strategyMode: ConversationStrategyMode =
    strategyRaw && isConversationStrategyMode(String(strategyRaw))
      ? (String(strategyRaw) as ConversationStrategyMode)
      : "consultative";

  return {
    ok: true,
    data: {
      portfolio,
      standaloneAgent,
      agentId,
      handle: portfolio?.handle ?? input.handle ?? `agent:${agentId}`,
      model: agentModel,
      temperature: agentTemperature,
      behaviorType,
      strategyMode,
      content: portfolio?.content ? validatePortfolioContent(portfolio.content) : null,
      displayName: portfolio?.agentDisplayName ?? standaloneAgent?.displayName ?? null,
      avatarUrl: portfolio?.agentAvatarUrl ?? standaloneAgent?.avatarUrl ?? null,
      intro: portfolio?.agentIntro ?? standaloneAgent?.intro ?? null,
      roleLabel: portfolio?.agentRoleLabel ?? standaloneAgent?.roleLabel ?? null,
      workingHours: (portfolio?.agentWorkingHours as any) ?? standaloneAgent?.workingHours ?? null,
      offDays: portfolio?.agentOffDays ?? standaloneAgent?.offDays ?? null,
      customPrompt: portfolio?.agentCustomPrompt ?? standaloneAgent?.customPrompt ?? null,
    },
  };
}
