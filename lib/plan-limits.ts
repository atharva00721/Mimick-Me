export type PlanTier = "free" | "pro" | "business";

export const PLAN_LIMITS: Record<PlanTier, {
  portfolios: number;
  agents: number;
  aiMessagesPerMonth: number;
  leadCapturesPerMonth: number | null;
  canUseCalendar: boolean;
  canCustomDomain: boolean;
}> = {
  free: {
    portfolios: 1,
    agents: 1,
    aiMessagesPerMonth: 150,
    leadCapturesPerMonth: 5,
    canUseCalendar: false,
    canCustomDomain: false,
  },
  pro: {
    portfolios: 3,
    agents: 3,
    aiMessagesPerMonth: 2000,
    leadCapturesPerMonth: null,
    canUseCalendar: true,
    canCustomDomain: true,
  },
  business: {
    portfolios: 10,
    agents: 10,
    aiMessagesPerMonth: 15000,
    leadCapturesPerMonth: null,
    canUseCalendar: true,
    canCustomDomain: true,
  },
};
