import { MODELS } from "./agent-config";
import type { AgentConfigState } from "./types";

interface AgentStatusCardsProps {
  config: AgentConfigState;
  isPortfolioPublished: boolean;
}

export function AgentStatusCards({ config, isPortfolioPublished }: AgentStatusCardsProps) {
  const activeModel = MODELS.find((m) => m.value === config.model);

  return (
    <div className="mb-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex items-center gap-4 rounded-xl border border-primary/5 bg-background p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className={`p-2 rounded-lg ${config.isEnabled ? "bg-emerald-500/10 text-emerald-600" : "bg-muted-foreground/10 text-muted-foreground"}`}>
          <div className={`h-3 w-3 rounded-full ${config.isEnabled ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground/40"}`} />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">Status</span>
          <span className="text-sm font-bold tracking-tight">{config.isEnabled ? "Enabled & Active" : "Disabled"}</span>
        </div>
      </div>

      <div className="flex items-center gap-4 rounded-xl border border-primary/5 bg-background p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600">
          <div className={`h-3 w-3 rounded-full ${isPortfolioPublished ? "bg-blue-500" : "bg-blue-500/30"}`} />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">Portfolio</span>
          <span className="text-sm font-bold tracking-tight">{isPortfolioPublished ? "Published" : "Draft"}</span>
        </div>
      </div>

      <div className="flex items-center gap-4 rounded-xl border border-primary/5 bg-background p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600">
          <div className="h-3 w-3 rounded-full bg-purple-500" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">Model</span>
          <span className="text-sm font-bold tracking-tight truncate max-w-[140px]">{activeModel?.label ?? "Unknown"}</span>
        </div>
      </div>

      <div className="flex items-center gap-4 rounded-xl border border-primary/5 bg-background p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="p-2 rounded-lg bg-orange-500/10 text-orange-600">
          <div className="h-3 w-3 rounded-full bg-orange-500" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">Mode</span>
          <span className="text-sm font-bold tracking-tight capitalize">{config.strategyMode}</span>
        </div>
      </div>
    </div>
  );
}
