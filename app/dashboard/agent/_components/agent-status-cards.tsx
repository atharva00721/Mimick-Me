import { MODELS } from "./agent-config";
import type { AgentConfigState } from "./types";

interface AgentStatusCardsProps {
  config: AgentConfigState;
  isPortfolioPublished: boolean;
}

export function AgentStatusCards({ config, isPortfolioPublished }: AgentStatusCardsProps) {
  const activeModel = MODELS.find((m) => m.value === config.model);

  return (
    <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="flex items-center gap-3 rounded-lg border border-border bg-transparent px-4 py-3">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">Status</span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className={`h-1.5 w-1.5 rounded-full ${config.isEnabled ? "bg-emerald-500" : "bg-muted-foreground/40"}`} />
              {config.isEnabled ? "Enabled" : "Disabled"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-lg border border-border bg-transparent px-4 py-3">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">Portfolio</span>
            <span className="text-xs text-muted-foreground">{isPortfolioPublished ? "Published" : "Draft"}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-lg border border-border bg-transparent px-4 py-3">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">Model</span>
            <span className="text-xs text-muted-foreground truncate max-w-[120px]">{activeModel?.label ?? "Unknown"}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-lg border border-border bg-transparent px-4 py-3">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">Mode</span>
            <span className="text-xs text-muted-foreground capitalize">{config.strategyMode}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
