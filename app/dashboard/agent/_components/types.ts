import type { ConversationStrategyMode } from "@/lib/agent/strategy-modes";

export interface AgentConfigState {
  isEnabled: boolean;
  model: string;
  behaviorType: string;
  strategyMode: ConversationStrategyMode;
  customPrompt: string;
  temperature: number;
  displayName: string;
  avatarUrl: string;
  intro: string;
  roleLabel: string;
  notificationEmail: string | null;
  workingHours: { dayOfWeek: number; startTime: string; endTime: string; enabled: boolean }[];
  offDays: string[];
  googleCalendarEnabled: boolean;
  googleCalendarAccountEmail: string | null;
  calendlyEnabled: boolean;
  calendlyAccountEmail: string | null;
  leadEnrichmentEnabled: boolean;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
