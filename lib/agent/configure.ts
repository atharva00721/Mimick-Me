import { and, desc, eq, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { agents } from "@/lib/schema";
import { isBehaviorPresetType } from "@/lib/agent/behavior-presets";
import { isSupportedAgentModel } from "@/lib/agent/models";
import { isConversationStrategyMode } from "@/lib/agent/strategy-modes";
import { checkAgentLimit } from "@/lib/billing";

export interface ConfigureAgentInput {
  isEnabled: boolean;
  model: string;
  behaviorType: string | null;
  strategyMode: string;
  customPrompt: string | null;
  temperature: number;
  displayName: string | null;
  avatarUrl: string | null;
  intro: string | null;
  roleLabel: string | null;
  workingHours?: { dayOfWeek: number; startTime: string; endTime: string; enabled: boolean }[] | null;
  offDays?: string[] | null;
  notificationEmail?: string | null;
  leadEnrichmentEnabled: boolean;
}

export function validateConfigureAgentInput(input: ConfigureAgentInput) {
  if (!isSupportedAgentModel(input.model)) {
    return { ok: false as const, error: "Invalid model selection" };
  }

  const trimmedPrompt = input.customPrompt?.trim() ?? "";
  const normalizedPrompt = trimmedPrompt.length > 0 ? trimmedPrompt : null;
  const normalizedDisplayName = input.displayName?.trim().slice(0, 80) || null;
  const normalizedAvatarUrl = input.avatarUrl?.trim() || null;
  const normalizedIntro = input.intro?.trim().slice(0, 280) || null;
  const normalizedRoleLabel = input.roleLabel?.trim().slice(0, 60) || null;
  const normalizedNotificationEmail = input.notificationEmail?.trim().slice(0, 255) || null;

  if (input.behaviorType && !isBehaviorPresetType(input.behaviorType)) {
    return { ok: false as const, error: "Invalid behavior preset" };
  }

  if (!isConversationStrategyMode(input.strategyMode)) {
    return { ok: false as const, error: "Invalid conversation strategy mode" };
  }

  if (!input.behaviorType && !normalizedPrompt) {
    return {
      ok: false as const,
      error: "Select a behavior preset or provide a custom prompt",
    };
  }

  if (Number.isNaN(input.temperature) || input.temperature < 0.2 || input.temperature > 0.8) {
    return { ok: false as const, error: "Temperature must be between 0.2 and 0.8" };
  }

  return {
    ok: true as const,
    value: {
      isEnabled: input.isEnabled,
      model: input.model,
      behaviorType: input.behaviorType,
      strategyMode: input.strategyMode,
      customPrompt: normalizedPrompt,
      temperature: Number(input.temperature.toFixed(2)),
      displayName: normalizedDisplayName,
      avatarUrl: normalizedAvatarUrl,
      intro: normalizedIntro,
      roleLabel: normalizedRoleLabel,
      notificationEmail: normalizedNotificationEmail,
      workingHours: input.workingHours ?? null,
      offDays: input.offDays ?? null,
      leadEnrichmentEnabled: input.leadEnrichmentEnabled ?? false,
    },
  };
}

export async function getAgentByPortfolioId(portfolioId: string) {
  const [agent] = await db
    .select()
    .from(agents)
    .where(eq(agents.portfolioId, portfolioId))
    .limit(1);

  return agent ?? null;
}

export async function getAgentByUserId(userId: string) {
  const [standaloneAgent] = await db
    .select()
    .from(agents)
    .where(and(eq(agents.userId, userId), isNull(agents.portfolioId)))
    .limit(1);

  if (standaloneAgent) {
    return standaloneAgent;
  }

  const [fallbackAgent] = await db
    .select()
    .from(agents)
    .where(eq(agents.userId, userId))
    .orderBy(desc(agents.updatedAt))
    .limit(1);

  return fallbackAgent ?? null;
}

/** Configure (upsert) an agent for a specific portfolio + user ownership. */
export async function configureAgentForPortfolio(userId: string, portfolioId: string, input: ConfigureAgentInput) {
  const validation = validateConfigureAgentInput(input);
  if (!validation.ok) {
    return { ok: false as const, status: 400, error: validation.error };
  }

  const existingAgent = await getAgentByPortfolioId(portfolioId);
  if (!existingAgent) {
    const limitCheck = await checkAgentLimit(userId);
    if (!limitCheck.allowed) {
      return { ok: false as const, status: 403, error: "Agent limit reached for your plan" };
    }
  }

  await db
    .insert(agents)
    .values({
      id: crypto.randomUUID(),
      userId,
      portfolioId,
      isEnabled: validation.value.isEnabled,
      model: validation.value.model,
      behaviorType: validation.value.behaviorType,
      strategyMode: validation.value.strategyMode,
      customPrompt: validation.value.customPrompt,
      temperature: validation.value.temperature,
      displayName: validation.value.displayName,
      avatarUrl: validation.value.avatarUrl,
      intro: validation.value.intro,
      roleLabel: validation.value.roleLabel,
      notificationEmail: validation.value.notificationEmail,
      workingHours: validation.value.workingHours,
      offDays: validation.value.offDays,
      leadEnrichmentEnabled: validation.value.leadEnrichmentEnabled,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: agents.portfolioId,
      set: {
        userId,
        isEnabled: validation.value.isEnabled,
        model: validation.value.model,
        behaviorType: validation.value.behaviorType,
        strategyMode: validation.value.strategyMode,
        customPrompt: validation.value.customPrompt,
        temperature: validation.value.temperature,
        displayName: validation.value.displayName,
        avatarUrl: validation.value.avatarUrl,
        intro: validation.value.intro,
        roleLabel: validation.value.roleLabel,
        notificationEmail: validation.value.notificationEmail,
        workingHours: validation.value.workingHours,
        offDays: validation.value.offDays,
        leadEnrichmentEnabled: validation.value.leadEnrichmentEnabled,
        updatedAt: new Date(),
      },
    });

  return { ok: true as const };
}

export async function configureAgentForUser(userId: string, input: ConfigureAgentInput) {
  const validation = validateConfigureAgentInput(input);
  if (!validation.ok) {
    return { ok: false as const, status: 400, error: validation.error };
  }

  const existingAgent = await getAgentByUserId(userId);

  if (existingAgent) {
    await db
      .update(agents)
      .set({
        isEnabled: validation.value.isEnabled,
        model: validation.value.model,
        behaviorType: validation.value.behaviorType,
        strategyMode: validation.value.strategyMode,
        customPrompt: validation.value.customPrompt,
        temperature: validation.value.temperature,
        displayName: validation.value.displayName,
        avatarUrl: validation.value.avatarUrl,
        intro: validation.value.intro,
        roleLabel: validation.value.roleLabel,
        notificationEmail: validation.value.notificationEmail,
        workingHours: validation.value.workingHours,
        offDays: validation.value.offDays,
        leadEnrichmentEnabled: validation.value.leadEnrichmentEnabled,
        updatedAt: new Date(),
      })
      .where(eq(agents.id, existingAgent.id));

    return { ok: true as const };
  }

  const limitCheck = await checkAgentLimit(userId);
  if (!limitCheck.allowed) {
    return { ok: false as const, status: 403, error: "Agent limit reached for your plan" };
  }

  await db.insert(agents).values({
    id: crypto.randomUUID(),
    userId,
    portfolioId: null,
    isEnabled: validation.value.isEnabled,
    model: validation.value.model,
    behaviorType: validation.value.behaviorType,
    strategyMode: validation.value.strategyMode,
    customPrompt: validation.value.customPrompt,
    temperature: validation.value.temperature,
    displayName: validation.value.displayName,
    avatarUrl: validation.value.avatarUrl,
    intro: validation.value.intro,
    roleLabel: validation.value.roleLabel,
    notificationEmail: validation.value.notificationEmail,
    workingHours: validation.value.workingHours,
    offDays: validation.value.offDays,
    leadEnrichmentEnabled: validation.value.leadEnrichmentEnabled,
    updatedAt: new Date(),
  });

  return { ok: true as const };
}

export async function configureStandaloneAgent(userId: string, input: ConfigureAgentInput) {
  return configureAgentForUser(userId, input);
}
