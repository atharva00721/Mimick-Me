import { NextRequest, NextResponse } from "next/server";
import { verifySignature } from "@/lib/integrations/calendly";
import { db } from "@/lib/db";
import { agentLeads } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
    const body = await request.text();
    const signature = request.headers.get("calendly-webhook-signature");

    if (!verifySignature(signature, body)) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(body);
    const event = payload.event;
    const data = payload.payload;

    console.log("Calendly Webhook Received:", event);

    if (event === "invitee.created") {
        const email = data.email;

        if (email) {
            const [lead] = await db.select().from(agentLeads).where(eq(agentLeads.email, email)).limit(1);
            if (lead) {
                const isRescheduled = data.rescheduled;
                let meetingNote = isRescheduled
                    ? `\n\n📌 [System Note: The visitor RESCHEDULED their meeting via Calendly]`
                    : `\n\n📌 [System Note: The visitor successfully booked a meeting via Calendly]`;

                if (data.timezone) {
                    meetingNote += `\n- **Timezone:** ${data.timezone}`;
                }

                if (data.questions_and_answers && Array.isArray(data.questions_and_answers) && data.questions_and_answers.length > 0) {
                    meetingNote += `\n\n**Calendly Responses:**\n` + (data.questions_and_answers as Array<{ question: string; answer: string }>).map((qa) => `- **${qa.question}**: ${qa.answer}`).join('\n');
                }

                const newDetails = lead.projectDetails
                    ? lead.projectDetails + meetingNote
                    : meetingNote.trim();

                await db.update(agentLeads)
                    .set({
                        meetingTime: isRescheduled ? "🔄 Rescheduled via Calendly" : "✅ Booked via Calendly",
                        status: "contacted",
                        isRead: false,
                        projectDetails: newDetails,
                        name: lead.name || data.name, // Capture first name or full name if not already set
                    })
                    .where(eq(agentLeads.id, lead.id));
            }
        }
    } else if (event === "invitee.canceled") {
        const email = data.email;
        if (email) {
            const [lead] = await db.select().from(agentLeads).where(eq(agentLeads.email, email)).limit(1);
            if (lead) {
                const reason = data.cancellation?.reason ? ` Reason: "${data.cancellation.reason}"` : "";
                const canceledBy = data.cancellation?.canceled_by ? ` by ${data.cancellation.canceled_by}` : "";
                const meetingNote = `\n\n⚠️ [System Note: The meeting was CANCELED${canceledBy}.${reason}]`;

                const newDetails = lead.projectDetails
                    ? lead.projectDetails + meetingNote
                    : meetingNote.trim();

                await db.update(agentLeads)
                    .set({
                        meetingTime: "❌ Canceled",
                        isRead: false,
                        projectDetails: newDetails
                    })
                    .where(eq(agentLeads.id, lead.id));
            }
        }
    } else if (event === "invitee_no_show.created") {
        const email = data.email || data.invitee_email; // payload varies slightly
        if (email) {
            const [lead] = await db.select().from(agentLeads).where(eq(agentLeads.email, email)).limit(1);
            if (lead) {
                const meetingNote = `\n\n🚨 [System Note: The visitor was marked as a NO-SHOW for their Calendly meeting]`;

                const newDetails = lead.projectDetails
                    ? lead.projectDetails + meetingNote
                    : meetingNote.trim();

                await db.update(agentLeads)
                    .set({
                        meetingTime: "🚫 No Show",
                        isRead: false,
                        projectDetails: newDetails
                    })
                    .where(eq(agentLeads.id, lead.id));
            }
        }
    }

    return NextResponse.json({ success: true });
}
