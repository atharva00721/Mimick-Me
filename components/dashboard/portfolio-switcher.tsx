"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { UpgradeRequiredModal } from "@/components/upgrade-required-modal";
import { PLAN_LIMITS, type PlanTier } from "@/lib/plan-limits";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { LogoIcon } from "@/components/logo";
import { Check, ChevronsUpDown, Plus, Briefcase, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePortfolioStore, type PortfolioSummary } from "@/lib/stores/portfolio-store";

// Re-export so DashboardLayout can import the type from one place
export type { PortfolioSummary };

export function PortfolioSwitcher({ plan = "free" }: { plan?: string }) {
    const router = useRouter();
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [isPending, startTransition] = useTransition();

    const portfolios = usePortfolioStore((s) => s.portfolios);
    const activePortfolioId = usePortfolioStore((s) => s.activePortfolioId);
    const isSwitching = usePortfolioStore((s) => s.isSwitching);
    const switchPortfolio = usePortfolioStore((s) => s.switchPortfolio);

    const active = portfolios.find((p) => p.id === activePortfolioId) ?? portfolios[0];

    async function handleSwitch(portfolioId: string) {
        if (portfolioId === activePortfolioId || isSwitching) return;
        await switchPortfolio(portfolioId);
        // Refresh server components so pages re-fetch data for the new active portfolio
        startTransition(() => router.refresh());
    }

    const handleCreateNew = () => {
        const limit = PLAN_LIMITS[plan as PlanTier]?.portfolios ?? 1;
        if (portfolios.length >= limit) {
            setShowUpgradeModal(true);
        } else {
            router.push("/onboarding");
        }
    };

    if (!active) return null;

    const isLoading = isSwitching || isPending;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                    size="lg"
                    className="w-full data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group-data-[collapsible=icon]:!p-0"
                >
                    {/* Logo Icon visible in both states */}
                    <div className="flex size-12 group-data-[collapsible=icon]:size-10 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shrink-0 overflow-hidden">
                        {isLoading ? (
                            <Loader2 className="size-4 animate-spin" />
                        ) : (
                            <LogoIcon className="h-auto w-auto group-data-[collapsible=icon]:size-7" />
                        )}
                    </div>

                    {/* Name + handle hidden when collapsed */}
                    <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                        <span className="truncate font-semibold">{active.name}</span>
                        <span className="truncate text-xs text-muted-foreground">/{active.handle}</span>
                    </div>

                    <ChevronsUpDown className="ml-auto size-4 shrink-0 opacity-50 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className="w-64 rounded-lg"
                align="start"
                side="bottom"
                sideOffset={4}
            >
                <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
                    Your Portfolios
                </DropdownMenuLabel>

                {portfolios.map((portfolio) => {
                    const isActive = portfolio.id === activePortfolioId;
                    const isSwitchingThis = isSwitching && !isActive;

                    return (
                        <DropdownMenuItem
                            key={portfolio.id}
                            onClick={() => handleSwitch(portfolio.id)}
                            disabled={isSwitching}
                            className={cn(
                                "flex items-center gap-3 cursor-pointer my-0.5",
                                isActive && "bg-accent"
                            )}
                        >
                            {/* Mini badge */}
                            {/* <div
                                className={cn(
                                    "flex size-7 items-center justify-center rounded-md border shrink-0",
                                    isActive
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-background border-border"
                                )}
                            >
                                <Briefcase className="size-3.5" />
                            </div> */}

                            <div className="flex-1 overflow-hidden">
                                <p className="truncate text-sm font-medium leading-none">{portfolio.name}</p>
                                <p className="truncate text-xs text-muted-foreground mt-0.5">/{portfolio.handle}</p>
                            </div>

                            {/* Right indicator */}
                            {isSwitchingThis ? (
                                <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" />
                            ) : isActive ? (
                                <Check className="size-4 shrink-0 text-primary" />
                            ) : (
                                <span
                                    title={portfolio.isPublished ? "Published" : "Draft"}
                                    className={cn(
                                        "h-2 w-2 rounded-full shrink-0",
                                        portfolio.isPublished ? "bg-green-500" : "bg-muted-foreground/30"
                                    )}
                                />
                            )}
                        </DropdownMenuItem>
                    );
                })}

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    className="flex items-center gap-3 cursor-pointer text-muted-foreground hover:text-foreground"
                    onClick={handleCreateNew}
                >
                    <div className="flex size-7 items-center justify-center rounded-md border border-dashed bg-background shrink-0">
                        <Plus className="size-3.5" />
                    </div>
                    <span className="text-sm">Add New Portfolio</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
            <UpgradeRequiredModal
                isOpen={showUpgradeModal}
                onOpenChange={setShowUpgradeModal}
                featureName="creating additional portfolios"
            />
        </DropdownMenu >
    );
}
