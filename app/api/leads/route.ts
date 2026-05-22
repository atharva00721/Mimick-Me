import { NextResponse } from "next/server";
import { saveLead, getLeads, getProfileById } from "@/lib/db";
import { parseJsonBody, requireUserId } from "@/lib/api/route-helpers";
import { extractLeadFromText } from "@/lib/lead-extract";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendLeadNotificationEmail } from "@/lib/mail";
import { enrichLeadData } from "@/lib/ai/enrichment";

interface LeadRequestBody {
  text?: unknown;
}

export async function GET() {
  const authResult = await requireUserId();
  if (!authResult.ok) {
    return authResult.response;
  }

  const leads = await getLeads(authResult.userId);
  return NextResponse.json({ leads });
}

export async function POST(request: Request) {
  const authResult = await requireUserId();
  if (!authResult.ok) {
    return authResult.response;
  }

  const jsonResult = await parseJsonBody<LeadRequestBody>(request);
  if (!jsonResult.ok) {
    return jsonResult.response;
  }

  const text = String(jsonResult.body.text ?? "");

  if (!checkRateLimit(`leads:${authResult.userId}`)) {
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      { status: 429 }
    );
  }

  const lead = extractLeadFromText(text);

  if (!lead.email) {
    return NextResponse.json({ error: "No email found" }, { status: 400 });
  }

  await saveLead({ ...lead, email: lead.email }, authResult.userId);

  // Send an email notification to the portfolio owner, asynchronously
  Promise.resolve().then(async () => {
    try {
      const ownerProfile = await getProfileById(authResult.userId);
      if (ownerProfile?.email && lead.email) {
        let enrichment = null;

        const { getAgentByUserId } = await import("@/lib/agent/configure");
        const { getUserPlan } = await import("@/lib/billing");
        const agent = await getAgentByUserId(authResult.userId);

        if (agent?.leadEnrichmentEnabled) {
          const planLevel = await getUserPlan(authResult.userId);
          if (planLevel !== "free") {
            enrichment = await enrichLeadData(
              lead.email,
              lead.name ?? undefined
            ).catch(() => null);
          }
        }

        await sendLeadNotificationEmail(ownerProfile.email, {
          name: lead.name,
          email: lead.email,
          projectDetails: lead.company, // using company field as extra info if available
        }, undefined, enrichment);
      }
    } catch (e) {
      console.error("Error sending lead email notification:", e);
    }
  });

  return NextResponse.json({ lead }, { status: 201 });
}
