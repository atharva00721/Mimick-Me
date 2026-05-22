import nodemailer from "nodemailer";
import type { LeadEnrichment } from "@/lib/ai/enrichment";

const MAIL_SEND_TIMEOUT_MS = 15_000;

export async function sendLeadNotificationEmail(
    toEmail: string,
    leadDetails: {
        name?: string | null;
        email?: string | null;
        phone?: string | null;
        budget?: string | null;
        meetingTime?: string | null;
        projectDetails?: string | null;
        website?: string | null;
    },
    sourceName?: string | null,
    enrichment?: LeadEnrichment | null
) {
    const { EMAIL_USER, EMAIL_PASS } = process.env;

    console.log("[Mail] Preparing lead notification email", {
        toEmail,
        sourceName: sourceName || "N/A",
        hasLeadName: Boolean(leadDetails.name),
        hasLeadEmail: Boolean(leadDetails.email),
        hasProjectDetails: Boolean(leadDetails.projectDetails),
        hasEnrichment: Boolean(enrichment),
    });

    const hasEnrichment = Boolean(
        enrichment && Object.values(enrichment).some((value) => Boolean(value))
    );

    const compactBio = enrichment?.bio
        ? enrichment.bio.split(",")[0]?.trim() ?? enrichment.bio
        : null;

    if (!EMAIL_USER || !EMAIL_PASS) {
        console.error("[Mail] Missing SMTP configuration", {
            hasEmailUser: Boolean(EMAIL_USER),
            hasEmailPass: Boolean(EMAIL_PASS),
        });
        throw new Error("SMTP credentials not configured. Set EMAIL_USER and EMAIL_PASS.");
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS,
        },
        connectionTimeout: 10_000,
        greetingTimeout: 10_000,
        socketTimeout: 15_000,
    });

    const textContent = `
A new lead has been captured by your AI agent!
${sourceName ? `Source: ${sourceName}\n` : ""}
Contact Information:
-----------------------------
Name: ${leadDetails.name || "N/A"}
Email: ${leadDetails.email || "N/A"}
Phone: ${leadDetails.phone || "N/A"}

Additional Details:
-----------------------------
Budget: ${leadDetails.budget || "N/A"}
Website: ${leadDetails.website || "N/A"}
Meeting Time: ${leadDetails.meetingTime || "N/A"}

Project Details:
-----------------------------
${leadDetails.projectDetails || "N/A"}

Log in to your dashboard to view the full conversation and manage this lead.
${hasEnrichment ? `
---
🕵️ SPY INSIGHTS
${enrichment?.linkedInUrl ? `LinkedIn:     ${enrichment.linkedInUrl}\n` : ""}\
${enrichment?.companySize ? `Company Size: ${enrichment.companySize}\n` : ""}\
${enrichment?.recentNews ? `Recent News:  ${enrichment.recentNews}\n` : ""}\
${enrichment?.bio ? `Bio:          ${enrichment.bio}\n` : ""}\
---
` : ""}`;

    const htmlContent = `
    <h2>New Lead Captured - Rep AI</h2>
    <p>A new lead has been captured by your AI agent!</p>
    ${sourceName ? `<h4>Source: <strong>${sourceName}</strong></h4>` : ""}
    <h3>Contact Information:</h3>
    <ul>
      <li><strong>Name:</strong> ${leadDetails.name || "N/A"}</li>
      <li><strong>Email:</strong> ${leadDetails.email || "N/A"}</li>
      <li><strong>Phone:</strong> ${leadDetails.phone || "N/A"}</li>
    </ul>
    <h3>Additional Details:</h3>
    <ul>
      <li><strong>Budget:</strong> ${leadDetails.budget || "N/A"}</li>
      <li><strong>Website:</strong> ${leadDetails.website ? `<a href="${leadDetails.website.startsWith('http') ? leadDetails.website : `https://${leadDetails.website}`}">${leadDetails.website}</a>` : "N/A"}</li>
      <li><strong>Meeting Time:</strong> ${leadDetails.meetingTime || "N/A"}</li>
    </ul>
    <h3>Project Details:</h3>
    <div style="white-space: pre-wrap; line-height: 1.5; padding: 12px; background: #fafafa; border: 1px solid #eaeaea; border-radius: 6px;">${leadDetails.projectDetails || "N/A"}</div>
    ${hasEnrichment ? `
      <div style="background: #f0f4ff; border-left: 4px solid #4f46e5; padding: 12px; margin-top: 16px; border-radius: 6px;">
        <h3 style="margin-top: 0;">🕵️ Spy Insights</h3>
        ${enrichment?.linkedInUrl ? `<p><strong>LinkedIn:</strong> <a href="${enrichment.linkedInUrl}">${enrichment.linkedInUrl}</a></p>` : ""}
        ${enrichment?.companySize ? `<p><strong>Company Size:</strong> ${enrichment.companySize}</p>` : ""}
        ${enrichment?.recentNews ? `<p><strong>Recent News:</strong> ${enrichment.recentNews}</p>` : ""}
        ${enrichment?.bio ? `<p><strong>Bio:</strong> ${enrichment.bio}</p>` : ""}
      </div>
    ` : ""}
    <p><br><em>Log in to your dashboard to view the full conversation and manage this lead.</em></p>
  `;

    const mailOptions = {
        from: `"Rep AI Notification" <${EMAIL_USER}>`,
        to: toEmail,
        subject: hasEnrichment
            ? `🔥 Hot Lead: ${leadDetails.name || leadDetails.email || "Unknown"}${compactBio ? ` (${compactBio})` : ""}`
            : sourceName ? `New Lead Captured from ${sourceName}` : "New Lead Captured - Rep AI",
        text: textContent,
        html: htmlContent,
    };

    console.log("[Mail] Sending email via Nodemailer", {
        service: "gmail",
        from: mailOptions.from,
        to: mailOptions.to,
        subject: mailOptions.subject,
    });

    let timeoutHandle: ReturnType<typeof setTimeout> | null = null;
    const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutHandle = setTimeout(() => {
            reject(new Error(`Email send timed out after ${MAIL_SEND_TIMEOUT_MS}ms`));
        }, MAIL_SEND_TIMEOUT_MS);
        timeoutHandle.unref?.();
    });

    let sendResult;
    try {
        sendResult = await Promise.race([
            transporter.sendMail(mailOptions),
            timeoutPromise,
        ]);
    } finally {
        if (timeoutHandle) {
            clearTimeout(timeoutHandle);
        }
    }

    console.log("[Mail] Lead notification email sent successfully", {
        toEmail,
        messageId: sendResult.messageId,
        accepted: sendResult.accepted,
        rejected: sendResult.rejected,
        response: sendResult.response,
    });
}
