import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { agentLeads } from "@/lib/schema";
import { requireUserId } from "@/lib/api/route-helpers";
import { getActivePortfolio } from "@/lib/active-portfolio";
import { getChatsByLeadId } from "@/lib/db/lead-chats";
import { generateWarmIntroDraft } from "@/lib/ai/warm-intro";
import { consumeCredits, getCredits } from "@/lib/credits";

const CREDIT_COST = 1;

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const authResult = await requireUserId();
  if (!authResult.ok) return authResult.response;

  const portfolio = await getActivePortfolio(authResult.userId);
  if (!portfolio) {
    return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
  }

  const { id } = await context.params;

  const lead = await db.query.agentLeads.findFirst({
    where: and(eq(agentLeads.id, id), eq(agentLeads.portfolioId, portfolio.id)),
  });

  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  try {
    const currentCredits = await getCredits(authResult.userId);
    if (currentCredits < CREDIT_COST) {
      return NextResponse.json({ error: "Not enough credits" }, { status: 402 });
    }

    const chats = await getChatsByLeadId(id);
    const draft = await generateWarmIntroDraft({
      recipientName: lead.name,
      recipientEmail: lead.email,
      budget: lead.budget,
      projectSummary: lead.conversationSummary,
      projectDetails: lead.projectDetails,
      recentConversation: chats.map((chat) => ({ role: chat.role, content: chat.content })),
    });

    const creditsConsumed = await consumeCredits(authResult.userId, CREDIT_COST);
    if (!creditsConsumed) {
      return NextResponse.json({ error: "Not enough credits" }, { status: 402 });
    }

    return NextResponse.json({ draft });
  } catch (error) {
    console.error("[warm-intro] failed", error);
    return NextResponse.json({ error: "Failed to generate warm intro email" }, { status: 500 });
  }
}
