"use client"

import { useMemo, useState } from "react"
import { Loader2, MailPlus, Copy } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { LeadDetailData } from "./types"

interface WarmIntroDraft {
  subject: string
  body: string
}

async function generateDraft(leadId: string): Promise<WarmIntroDraft> {
  const res = await fetch(`/api/leads/${leadId}/warm-intro`, { method: "POST" })
  const payload = (await res.json().catch(() => null)) as
    | { draft?: WarmIntroDraft; error?: string }
    | null

  if (!res.ok || !payload?.draft) {
    throw new Error(payload?.error || "Failed to generate warm intro")
  }

  return payload.draft
}

export function WarmIntroSection({ lead }: { lead: LeadDetailData }) {
  const [isLoading, setIsLoading] = useState(false)
  const [draft, setDraft] = useState<WarmIntroDraft | null>(null)

  const mailToHref = useMemo(() => {
    if (!lead.email || !draft) return null
    const subject = encodeURIComponent(draft.subject)
    const body = encodeURIComponent(draft.body)
    return `mailto:${lead.email}?subject=${subject}&body=${body}`
  }, [draft, lead.email])

  const handleGenerate = async () => {
    setIsLoading(true)
    try {
      const nextDraft = await generateDraft(lead.id)
      setDraft(nextDraft)
      toast.success("Warm intro draft ready")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to generate warm intro")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!draft) return
    const compiled = `Subject: ${draft.subject}\n\n${draft.body}`

    try {
      await navigator.clipboard.writeText(compiled)
      toast.success("Warm intro copied")
    } catch {
      toast.error("Could not copy draft")
    }
  }

  return (
    <section className="border rounded-lg p-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <h3 className="text-sm font-sans font-medium uppercase tracking-wider text-muted-foreground">Warm intro</h3>
        <Button type="button" size="sm" variant="outline" onClick={handleGenerate} disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 size-4 animate-spin" /> : <MailPlus className="mr-2 size-4" />}
          {draft ? "Regenerate" : "Generate draft"}
        </Button>
      </div>
      {draft ? (
        <div className="space-y-3">
          <div>
            <p className="text-[11px] text-muted-foreground mb-1">Subject</p>
            <p className="text-sm font-medium px-2.5 py-1.5 rounded bg-muted/40">{draft.subject}</p>
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground mb-1">Body</p>
            <Textarea value={draft.body} readOnly className="min-h-[140px] resize-y text-sm border-muted/60" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" size="sm" onClick={handleCopy}>
              <Copy className="mr-2 size-4" />
              Copy
            </Button>
            <Button type="button" size="sm" variant="outline" asChild disabled={!mailToHref}>
              <a href={mailToHref ?? "#"}>Open in email</a>
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Generate a personalized follow-up email from this lead’s context and conversation.
        </p>
      )}
    </section>
  )
}
