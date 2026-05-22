import type { PublicHistoryMessage } from "@/lib/validation/public-chat";

export const CREDIT_COST = 1;

export const FALLBACK_REPLY =
  "Thanks for your message. Please leave your email and project details and the professional will get back to you shortly.";

export type LeadFieldPayload = {
  email: string | null;
  phone: string | null;
  website: string | null;
  projectDetails: string | null;
  budget: string | null;
};

export interface PublicChatInput {
  handle: string | null;
  agentId: string | null;
  message: string;
  history: PublicHistoryMessage[];
  sessionId: string | null;
  ip: string;
  userId: string | null;
}

export type PublicChatResult =
  | { ok: true; reply: string; leadDetected: boolean; sessionId: string }
  | { ok: false; error: string; status: number };

