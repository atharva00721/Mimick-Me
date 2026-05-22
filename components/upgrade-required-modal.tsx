"use client";

import { CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";

interface UpgradeRequiredModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    featureName?: string;
}

export function UpgradeRequiredModal({
    isOpen,
    onOpenChange,
    featureName = "this feature",
}: UpgradeRequiredModalProps) {
    const proFeatures = [
        "3 AI Portfolios & 3 AI Agents",
        "2,000 AI messages per month",
        "Unlimited lead captures",
        "Google Calendar integration",
        "Custom domain support",
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden border-none shadow-2xl">
                <div className="relative pt-12 pb-8 px-6 bg-accent">
                    <div className="flex flex-col items-center text-center text-foreground">
                        <DialogTitle className="text-2xl tracking-tight mb-2 text-foreground">
                            Upgrade to Pro
                        </DialogTitle>
                        <DialogDescription className="text-foreground/80 text-sm max-w-[280px]">
                            {featureName.charAt(0).toUpperCase() + featureName.slice(1)} is a Pro feature. Level up your portfolio today!
                        </DialogDescription>
                    </div>
                </div>

                <div className="px-8 py-8 space-y-6 bg-background">
                    <div className="space-y-3">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                            Everything in Pro:
                        </p>
                        {proFeatures.map((feature, i) => (
                            <div key={i} className="flex items-center gap-3 text-sm group">
                                <div className="size-5 rounded-full bg-green-500/10 flex items-center justify-center shrink-0 group-hover:bg-green-500/20 transition-colors">
                                    <CheckCircle2 className="size-3.5 text-green-600" />
                                </div>
                                <span className="text-foreground/80 font-medium">{feature}</span>
                            </div>
                        ))}
                    </div>

                    <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border/50">
                        <Button
                            variant="ghost"
                            className="w-full sm:w-auto h-11 text-muted-foreground hover:bg-muted/50 transition-all font-medium"
                            onClick={() => onOpenChange(false)}
                        >
                            Maybe later
                        </Button>
                        <Button
                                className="flex-1 h-11 "
                                asChild
                        >
                            <Link href="/dashboard/pricing">
                                Upgrade Now — $24/mo
                            </Link>
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
