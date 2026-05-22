import { cn } from "@/lib/utils"
import type { LeadListItemData } from "./types"

function formatShortDate(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return "—"
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(date)
}

export function LeadListItem({
  lead,
  selected,
  onSelect,
}: {
  lead: LeadListItemData
  selected: boolean
  onSelect: () => void
}) {
  const isUnread = lead.isRead === false

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full max-w-full min-w-0 overflow-hidden text-left flex gap-2.5 px-2.5 py-2 rounded-lg transition-colors border-l-2 -ml-px pl-[9px]",
        "border-transparent hover:bg-muted/40",
        selected && "bg-muted/60 border-muted-foreground/30",
        isUnread && "border-primary"
      )}
    >
      <div className="min-w-0 flex-1 overflow-hidden w-0 flex flex-col gap-0.5">
        <div className="flex items-baseline justify-between gap-2 min-w-0">
          <p className={cn("min-w-0 flex-1 truncate text-lg font-serif", isUnread ? "font-medium" : "font-normal text-foreground/90")}>
            {lead.name || "Anonymous"}
          </p>
          <span className="shrink-0 text-[11px] text-muted-foreground tabular-nums">
            {formatShortDate(lead.createdAt)}
          </span>
        </div>
        {/* <p
          className="min-w-0 truncate text-xs text-muted-foreground"
          title={lead.subject || undefined}
        >
          {lead.subject || "No subject"}
        </p> */}
        {(lead.budget ?? lead.confidence != null) && (
          <p
            className="min-w-0 truncate text-[11px] text-muted-foreground/80 mt-0.5"
            title={[lead.budget, lead.confidence != null ? `${Math.round(lead.confidence)}% match` : null].filter(Boolean).join(" · ") || undefined}
          >
            {[lead.budget, lead.confidence != null ? `${Math.round(lead.confidence)}% match` : null]
              .filter(Boolean)
              .join(" · ")}
          </p>
        )}
      </div>
    </button>
  )
}
