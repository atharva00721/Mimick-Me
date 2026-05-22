import type { BehaviorPresetType } from "@/lib/agent/behavior-presets";
import type { ConversationStrategyMode } from "@/lib/agent/strategy-modes";
import type { PortfolioContent } from "@/lib/validation/portfolio-schema";

export interface AgentMessage {
  role: "user" | "assistant";
  content: string;
}

interface LeadData {
  name: string;
  email: string;
  budget: string;
  project_details: string;
  meeting_time: string;
}

export interface AgentLeadPayload {
  lead_detected: boolean;
  confidence: number;
  lead_data: LeadData | null;
}

export interface GenerateAgentReplyInput {
  agentId: string;
  model: string;
  temperature: number;
  behaviorType: BehaviorPresetType | null;
  strategyMode: ConversationStrategyMode;
  customPrompt: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  intro: string | null;
  roleLabel: string | null;
  message: string;
  history: AgentMessage[];
  portfolio?: PortfolioContent | null;
  /** Pre-fetched Google Calendar access token — avoids a DB round-trip inside the tool loop */
  calendarAccessToken?: string | null;
  calendlyEnabled?: boolean;
  calendlyAccountEmail?: string | null;
  calendlySchedulingUrl?: string | null;
  workingHours?: { dayOfWeek: number; startTime: string; endTime: string; enabled: boolean }[] | null;
  offDays?: string[] | null;
}

export interface GenerateAgentReplyOutput {
  reply: string;
  lead: AgentLeadPayload;
  usage: {
    totalTokens: number;
  };
  errorType?: string;
}
