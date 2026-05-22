import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Copy, Mail, ChevronDown, MessageCircle } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import type { LeadDetailData, LeadStatus } from "./types"

function formatFullDate(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return "—"
  return new Intl.DateTimeFormat(undefined, { year: "numeric", month: "short", day: "numeric" }).format(date)
}

const STATUS_LABEL: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  closed: "Closed",
}

export function LeadHeader({
  lead,
  onStatusChange,
}: {
  lead: LeadDetailData
  onStatusChange: (status: LeadStatus) => void
}) {
  const status = (lead.status ?? "new") as LeadStatus

  const handleCopyEmail = async () => {
    if (!lead.email) return
    try {
      await navigator.clipboard.writeText(lead.email)
      toast.success("Email copied")
    } catch {
      toast.error("Could not copy email")
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-3xl -tracking-wide truncate">{lead.name || "Anonymous"}</h2>
          <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            {lead.email ? (
              <>
                <a
                  href={`mailto:${lead.email}`}
                  className="inline-flex items-center gap-1 truncate max-w-[200px] hover:text-foreground"
                >
                  <Mail className="size-3.5 shrink-0" />
                  <span className="truncate">{lead.email}</span>
                </a>
                <Button type="button" variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={handleCopyEmail} title="Copy email">
                  <Copy className="size-3.5" />
                </Button>
              </>
            ) : (
              <span>—</span>
            )}
          </div>
        </div>
        <span className="shrink-0 text-xs text-muted-foreground">{formatFullDate(lead.createdAt)}</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 text-xs">
              {STATUS_LABEL[status]}
              <ChevronDown className="ml-1 size-3.5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {(Object.keys(STATUS_LABEL) as LeadStatus[]).map((s) => (
              <DropdownMenuItem key={s} onClick={() => onStatusChange(s)} className={s === status ? "bg-muted" : ""}>
                {STATUS_LABEL[s]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline" size="sm" className="h-8 text-xs" asChild>
          <Link href={`/dashboard/leads/${lead.id}/chats`}>
            <MessageCircle className="mr-1.5 size-3.5" />
            Chats
          </Link>
        </Button>

        {(lead.budget || lead.confidence != null) && (
          <span className="text-xs text-muted-foreground">
            {[lead.budget, lead.confidence != null ? `${Math.round(lead.confidence)}%` : null].filter(Boolean).join(" · ")}
          </span>
        )}
      </div>
    </div>
  )
}
