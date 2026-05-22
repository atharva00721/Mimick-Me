import { and, desc, eq, gte, or } from "drizzle-orm";
import { db } from "@/lib/db";
import { agentLeads } from "@/lib/schema";
import { linkMessagesToLead } from "./lead-chats";
import { checkLeadCaptureLimit } from "@/lib/billing";

export interface SaveLeadInput {
  agentId: string;
  portfolioId?: string | null;
  name: string | null;
  email: string | null;
  phone?: string | null;
  website?: string | null;
  budget: string | null;
  projectDetails: string | null;
  meetingTime: string | null;
  confidence: number;
  sessionId: string;
  captureTurn?: number | null;
  ownerUserId?: string | null;
}

export interface ExistingLead {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  budget: string | null;
  projectDetails: string | null;
  meetingTime: string | null;
  confidence: number;
  sessionId: string | null;
  captureTurn: number | null;
  notificationSent: boolean;
}

export function normalizeEmail(email: string | null | undefined): string {
  return email?.trim().toLowerCase() ?? "";
}

export function normalizePhone(phone: string | null | undefined): string {
  const digitsOnly = (phone ?? "").replace(/[^\d+]/g, "").trim();
  return digitsOnly;
}

export function normalizeWebsite(website: string | null | undefined): string {
  const raw = website?.trim().toLowerCase() ?? "";
  if (!raw) {
    return "";
  }

  return raw.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export interface LeadLookupKey {
  email: string;
  phone: string;
  website: string;
}

export function buildLeadLookup(input: Pick<SaveLeadInput, "email" | "phone" | "website">): LeadLookupKey {
  return {
    email: normalizeEmail(input.email),
    phone: normalizePhone(input.phone),
    website: normalizeWebsite(input.website),
  };
}

async function findExistingLead(agentId: string, lookup: LeadLookupKey): Promise<ExistingLead | null> {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const contactClauses = [];
  if (lookup.email) {
    contactClauses.push(eq(agentLeads.email, lookup.email));
  }

  if (lookup.phone) {
    contactClauses.push(eq(agentLeads.phone, lookup.phone));
  }

  if (lookup.website) {
    contactClauses.push(eq(agentLeads.website, lookup.website));
  }

  if (contactClauses.length === 0) {
    return null;
  }

  const [existing] = await db
    .select({
      id: agentLeads.id,
      name: agentLeads.name,
      email: agentLeads.email,
      phone: agentLeads.phone,
      website: agentLeads.website,
      budget: agentLeads.budget,
      projectDetails: agentLeads.projectDetails,
      meetingTime: agentLeads.meetingTime,
      confidence: agentLeads.confidence,
      sessionId: agentLeads.sessionId,
      captureTurn: agentLeads.captureTurn,
      notificationSent: agentLeads.notificationSent,
    })
    .from(agentLeads)
    .where(
      and(
        eq(agentLeads.agentId, agentId),
        gte(agentLeads.createdAt, since),
        or(...contactClauses)
      )
    )
    .orderBy(desc(agentLeads.createdAt))
    .limit(1);

  return existing ?? null;
}

export function mergeLeadData(existing: ExistingLead, input: SaveLeadInput, lookup: LeadLookupKey) {
  return {
    name: input.name?.trim() || existing.name,
    email: lookup.email || existing.email,
    phone: lookup.phone || existing.phone,
    website: lookup.website || existing.website,
    budget: input.budget?.trim() || existing.budget,
    projectDetails: input.projectDetails?.trim() || existing.projectDetails,
    meetingTime: input.meetingTime?.trim() || existing.meetingTime,
    confidence: Math.max(existing.confidence, input.confidence),
    captureTurn: existing.captureTurn ?? input.captureTurn ?? null,
  };
}

export async function saveLeadWithDedup(input: SaveLeadInput): Promise<"inserted" | "updated" | "skipped"> {
  const lookup = buildLeadLookup(input);

  const hasContactChannel = Boolean(lookup.email || lookup.phone || lookup.website);
  if (!hasContactChannel) {
    return "skipped";
  }

  const existing = await findExistingLead(input.agentId, lookup);

  if (existing) {
    const merged = mergeLeadData(existing, input, lookup);

    const hasChanges =
      merged.name !== existing.name ||
      merged.email !== existing.email ||
      merged.phone !== existing.phone ||
      merged.website !== existing.website ||
      merged.budget !== existing.budget ||
      merged.projectDetails !== existing.projectDetails ||
      merged.meetingTime !== existing.meetingTime ||
      merged.confidence !== existing.confidence ||
      merged.captureTurn !== existing.captureTurn;

    if (hasChanges || existing.sessionId !== input.sessionId) {
      const isNewSession = existing.sessionId !== input.sessionId;
      await db
        .update(agentLeads)
        .set({
          ...merged,
          sessionId: input.sessionId,
          updatedAt: new Date(),
          // Reset notification state when a lead is re-captured in a new chat session.
          // Without this, deduped leads can remain permanently "sent" and skip future emails.
          notificationSent: isNewSession ? false : existing.notificationSent,
        })
        .where(eq(agentLeads.id, existing.id));
      await linkMessagesToLead(existing.id, input.sessionId);
      return "updated";
    }

    await db
      .update(agentLeads)
      .set({ updatedAt: new Date() })
      .where(eq(agentLeads.id, existing.id));
    await linkMessagesToLead(existing.id, input.sessionId);

    return "updated";
  }

  if (input.ownerUserId) {
    const leadLimit = await checkLeadCaptureLimit(input.ownerUserId);
    if (!leadLimit.allowed) {
      return "skipped";
    }
  }

  const leadId = crypto.randomUUID();
  await db.insert(agentLeads).values({
    id: leadId,
    agentId: input.agentId,
    portfolioId: input.portfolioId ?? null,
    name: input.name,
    email: lookup.email || null,
    phone: lookup.phone || null,
    website: lookup.website || null,
    budget: input.budget,
    projectDetails: input.projectDetails,
    meetingTime: input.meetingTime,
    confidence: input.confidence,
    sessionId: input.sessionId,
    captureTurn: input.captureTurn ?? null,
    updatedAt: new Date(),
  });

  await linkMessagesToLead(leadId, input.sessionId);

  return "inserted";
}
