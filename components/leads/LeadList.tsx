import { ScrollArea } from "@/components/ui/scroll-area"
import type { LeadListItemData } from "./types"
import { LeadListItem } from "./LeadListItem"

export function LeadList({
  leads,
  selectedLeadId,
  onSelectLead,
}: {
  leads: LeadListItemData[]
  selectedLeadId: string | null
  onSelectLead: (id: string) => void
}) {
  return (
    <div className="flex h-full min-h-0 min-w-0 flex-col">
      {/* <div className="px-4 py-3 border-b">
        <h2 className="text-sm font-semibold">Leads</h2>
        <p className="text-xs text-muted-foreground">
          {leads.length} lead{leads.length === 1 ? "" : "s"}
        </p>
      </div> */}

      <ScrollArea className="flex-1 min-h-0 min-w-0 overflow-x-hidden">
        <div className="p-2 pr-3 min-w-0 max-w-full overflow-hidden">
          {leads.length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground border border-dashed rounded-xl text-center">
              No leads match your filters yet.
            </div>
          ) : (
            leads.map((lead) => (
              <LeadListItem
                key={lead.id}
                lead={lead}
                selected={lead.id === selectedLeadId}
                onSelect={() => onSelectLead(lead.id)}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
