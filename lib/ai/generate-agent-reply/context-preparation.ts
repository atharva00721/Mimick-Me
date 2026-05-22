import {
  hybridSearchKnowledgeContextByAgentId,
  type KnowledgeContextChunk,
} from "@/lib/knowledge/service";
import type { AgentMessage, GenerateAgentReplyInput } from "./types";

const CONTEXT_TOKEN_BUDGET = 3_200;
const CHARS_PER_TOKEN = 4;
const MAX_HISTORY_MESSAGES = 8;
const MAX_MESSAGE_CHARS = 1_200;
const KNOWLEDGE_LIMIT = 5;

export interface PreparedKnowledgeChunk {
  chunkId: string;
  sourceId: string;
  content: string;
}

export interface PreparedContext {
  history: AgentMessage[];
  knowledgeChunks: PreparedKnowledgeChunk[];
  profileMetadata: Record<string, unknown>;
  portfolioSections: Record<string, unknown> | null;
  isContextSparse: boolean;
}

function estimateTokens(value: string): number {
  return Math.ceil(value.length / CHARS_PER_TOKEN);
}

export function trimHistory(history: AgentMessage[]): AgentMessage[] {
  return history
    .filter((entry) => entry.role === "user" || entry.role === "assistant")
    .slice(-MAX_HISTORY_MESSAGES)
    .map((entry) => ({
      role: entry.role,
      content: entry.content.slice(0, MAX_MESSAGE_CHARS),
    }));
}

function trimKnowledgeChunksByBudget(chunks: PreparedKnowledgeChunk[], remainingTokens: number): PreparedKnowledgeChunk[] {
  if (remainingTokens <= 0) return [];

  const limited: PreparedKnowledgeChunk[] = [];
  let usedTokens = 0;

  for (const chunk of chunks) {
    const trimmedContent = chunk.content.trim();
    if (!trimmedContent) continue;

    const chunkTokens = estimateTokens(trimmedContent);
    if (usedTokens + chunkTokens <= remainingTokens) {
      limited.push({ ...chunk, content: trimmedContent });
      usedTokens += chunkTokens;
      continue;
    }

    const remaining = remainingTokens - usedTokens;
    const remainingChars = remaining * CHARS_PER_TOKEN;
    if (remainingChars > 120) {
      limited.push({
        ...chunk,
        content: `${trimmedContent.slice(0, remainingChars)}...`,
      });
    }

    break;
  }

  return limited;
}

function buildProfileMetadata(input: GenerateAgentReplyInput): Record<string, unknown> {
  return {
    strategyMode: input.strategyMode,
    behaviorType: input.behaviorType,
    hasCustomPrompt: Boolean(input.customPrompt?.trim()),
    displayName: input.displayName,
    roleLabel: input.roleLabel,
    intro: input.intro,
    calendlyEnabled: input.calendlyEnabled,
    calendlyAccountEmail: input.calendlyAccountEmail,
    calendlySchedulingUrl: input.calendlySchedulingUrl,
  };
}

function buildPortfolioSections(input: GenerateAgentReplyInput): Record<string, unknown> | null {
  if (!input.portfolio) return null;
  return {
    hero: input.portfolio.hero,
    about: input.portfolio.about,
    services: input.portfolio.services,
    projects: input.portfolio.projects,
  };
}

export function composeContext(input: GenerateAgentReplyInput, knowledgeChunks: KnowledgeContextChunk[]): PreparedContext {
  const history = trimHistory(input.history);
  const profileMetadata = buildProfileMetadata(input);
  const portfolioSections = buildPortfolioSections(input);

  const historyTokens = estimateTokens(JSON.stringify(history));
  const profileTokens = estimateTokens(JSON.stringify(profileMetadata));
  const portfolioTokens = portfolioSections ? estimateTokens(JSON.stringify(portfolioSections)) : 0;

  const remainingForKnowledge = CONTEXT_TOKEN_BUDGET - historyTokens - profileTokens - portfolioTokens;
  const preparedKnowledge = trimKnowledgeChunksByBudget(
    knowledgeChunks.map((chunk) => ({
      chunkId: chunk.chunkId,
      sourceId: chunk.sourceId,
      content: chunk.content,
    })),
    remainingForKnowledge
  );

  const hasAnyPortfolioData = Boolean(
    portfolioSections && Object.values(portfolioSections).some((value) => value !== null && value !== undefined)
  );
  const isContextSparse = history.length <= 1 && preparedKnowledge.length === 0 && !hasAnyPortfolioData;

  return {
    history,
    knowledgeChunks: preparedKnowledge,
    profileMetadata,
    portfolioSections,
    isContextSparse,
  };
}

export async function prepareContext(input: GenerateAgentReplyInput): Promise<PreparedContext> {
  const relevantChunks = await hybridSearchKnowledgeContextByAgentId(input.agentId, input.message, KNOWLEDGE_LIMIT);
  return composeContext(input, relevantChunks);
}
