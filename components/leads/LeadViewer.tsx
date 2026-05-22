import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import type { LeadDetailData, LeadStatus } from "./types"
import { LeadHeader } from "./LeadHeader"
import { LeadBody } from "./LeadBody"

export function LeadViewer({
  lead,
  onStatusChange,
}: {
  lead: LeadDetailData | null
  onStatusChange: (status: LeadStatus) => void
}) {
  if (!lead) {
    return (
      <div className="h-full flex items-center justify-center border border-dashed rounded-lg bg-muted/20">
        <p className="text-sm text-muted-foreground">Select a lead to view details</p>
      </div>
    )
  }

  return (
    <div className="h-full min-h-0 flex flex-col border rounded-lg bg-background overflow-hidden">
      <ScrollArea className="h-full min-h-0 flex-1">
        <div className="p-4 md:p-5">
          <LeadHeader lead={lead} onStatusChange={onStatusChange} />
          <Separator className="my-4" />
          <LeadBody lead={lead} />
        </div>
      </ScrollArea>
    </div>
  )
}
