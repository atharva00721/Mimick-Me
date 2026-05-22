import { getSession } from "@/lib/auth/server"
import { redirect, notFound } from "next/navigation"
import { and, desc, eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { agentLeads } from "@/lib/schema"
import { getDashboardData } from "../../../_lib/get-dashboard-data"
import { ChatsClient } from "./chats-client"
import type { LeadDetailData } from "@/components/leads/types"

function subjectFromLead(input: { conversationSummary?: string | null; projectDetails?: string | null }) {
  const source = (input.conversationSummary ?? input.projectDetails ?? "").trim()
  if (!source) return null
  const cleaned = source.replace(/\s+/g, " ").trim()
  return cleaned.length > 90 ? `${cleaned.slice(0, 90)}…` : cleaned
}

export default async function LeadChatsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getSession()
  if (!session?.user) redirect("/auth/signin")

  const data = await getDashboardData()
  if (!data?.portfolio) redirect("/onboarding")

  const { id } = await params

  const [lead] = await db
    .select()
    .from(agentLeads)
    .where(and(eq(agentLeads.portfolioId, data.portfolio.id), eq(agentLeads.id, id)))
    .orderBy(desc(agentLeads.createdAt))
    .limit(1)

  if (!lead) notFound()

  const formattedLead: LeadDetailData = {
    id: lead.id,
    name: lead.name,
    email: lead.email,
    budget: lead.budget,
    confidence: lead.confidence,
    projectDetails: lead.projectDetails,
    conversationSummary: lead.conversationSummary ?? null,
    status: lead.status ?? "new",
    isRead: lead.isRead ?? false,
    createdAt: lead.createdAt.toISOString(),
    subject: subjectFromLead({
      conversationSummary: lead.conversationSummary,
      projectDetails: lead.projectDetails,
    }),
  }

  return <ChatsClient lead={formattedLead} />
}
