export type LeadStatus = "new" | "contacted" | "closed"

export type LeadConfidenceTier = "hot" | "warm" | "cold"

export interface LeadListItemData {
  id: string
  name: string | null
  email: string | null
  subject: string | null
  budget: string | null
  confidence: number
  status?: LeadStatus | null
  isRead?: boolean | null
  createdAt: string
}

export interface LeadDetailData extends LeadListItemData {
  projectDetails?: string | null
  conversationSummary?: string | null
  timeline?: string | null
  meetingTime?: string | null
  enrichment?: unknown | null
}

