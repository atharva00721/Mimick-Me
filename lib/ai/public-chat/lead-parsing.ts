import type { ConversationStrategyMode } from "@/lib/agent/strategy-modes";
import type { LeadFieldPayload } from "@/lib/ai/public-chat/types";

function normalizeWebsite(website: string | null | undefined): string | null {
  const raw = website?.trim().toLowerCase();
  if (!raw) {
    return null;
  }

  return raw.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export function parseLeadChannelsFromText(text: string): { phone: string | null; website: string | null } {
  const phoneMatch = text.match(/\+?[0-9][0-9\s().-]{6,}[0-9]/);
  const websiteMatch = text.match(/(?:https?:\/\/)?(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+(?:\/[\w-./?%&=]*)?/i);

  return {
    phone: phoneMatch?.[0]?.trim() ?? null,
    website: normalizeWebsite(websiteMatch?.[0] ?? null),
  };
}

export function hasSufficientLeadFields(mode: ConversationStrategyMode, leadData: LeadFieldPayload): boolean {
  const hasEmail = Boolean(leadData.email?.trim());
  const hasProjectDetails = Boolean(leadData.projectDetails?.trim() && leadData.projectDetails.trim().length >= 20);
  const hasBudget = Boolean(leadData.budget?.trim());
  const hasAltContact = Boolean(leadData.phone?.trim() || leadData.website?.trim());

  switch (mode) {
    case "sales":
      return (hasEmail || hasAltContact) && (hasProjectDetails || hasBudget);
    case "consultative":
      return hasEmail || (hasProjectDetails && hasAltContact);
    case "passive":
      return false;
    default:
      return hasEmail;
  }
}
