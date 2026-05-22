import type { LeadDetailData } from "./types"
import { WarmIntroSection } from "@/components/leads/WarmIntroSection"

function cleanText(input: string) {
  return input.replace(/\s+/g, " ").trim()
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">{title}</h3>
      {children}
    </section>
  )
}

export function LeadBody({ lead }: { lead: LeadDetailData }) {
  const summaryRaw = lead.conversationSummary?.trim() || ""
  const detailsRaw = lead.projectDetails?.trim() || ""
  const summary = summaryRaw ? cleanText(summaryRaw) : ""

  const hasMeta = lead.timeline || lead.meetingTime || lead.budget

  return (
    <div className="space-y-6 pt-4">
      <WarmIntroSection lead={lead} />

      <Section title="Summary">
        {summary ? (
          <p className="text-sm leading-relaxed text-foreground/90">{summary}</p>
        ) : detailsRaw ? (
          <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">{detailsRaw}</p>
        ) : (
          <p className="text-sm text-muted-foreground">No summary captured yet.</p>
        )}
        {detailsRaw && summary && (
          <p className="mt-3 text-sm leading-relaxed text-foreground/80 whitespace-pre-wrap">{detailsRaw}</p>
        )}
      </Section>

      {hasMeta && (
        <Section title="Details">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            {lead.timeline && (
              <>
                <dt className="text-muted-foreground">Timeline</dt>
                <dd>{lead.timeline}</dd>
              </>
            )}
            {lead.meetingTime && (
              <>
                <dt className="text-muted-foreground">Meeting</dt>
                <dd>{lead.meetingTime}</dd>
              </>
            )}
            {lead.budget && (
              <>
                <dt className="text-muted-foreground">Budget</dt>
                <dd>{lead.budget}</dd>
              </>
            )}
          </dl>
        </Section>
      )}

      {lead.enrichment && typeof lead.enrichment === 'object' && (
        <Section title="🕵️ Spy Insights">
          <div className="rounded-lg border bg-primary/5 p-4 text-sm space-y-3">
            {lead.enrichment.linkedInUrl && (
              <div>
                <span className="font-semibold text-muted-foreground">LinkedIn: </span>
                <a href={lead.enrichment.linkedInUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  {lead.enrichment.linkedInUrl}
                </a>
              </div>
            )}
            {lead.enrichment.companySize && (
              <div>
                <span className="font-semibold text-muted-foreground">Company Size: </span>
                {lead.enrichment.companySize}
              </div>
            )}
            {lead.enrichment.recentNews && (
              <div>
                <span className="font-semibold text-muted-foreground">Recent News: </span>
                {lead.enrichment.recentNews}
              </div>
            )}
            {lead.enrichment.bio && (
              <div>
                <span className="font-semibold text-muted-foreground">Bio: </span>
                {lead.enrichment.bio}
              </div>
            )}
          </div>
        </Section>
      )}
    </div>
  )
}
