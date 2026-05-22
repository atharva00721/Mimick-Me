"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface CTASectionProps {
    editMode: boolean; // Kept for prop compatibility
    content: {
        headline?: string;
        subtext?: string;
    } | null;
    onUpdate: (field: string, value: string) => void;
    isVisible: boolean;
    onVisibilityChange?: (visible: boolean) => void;
}

export function CTASection({
    content,
    onUpdate,
    isVisible,
    onVisibilityChange,
}: CTASectionProps) {
    return (
        <div className="space-y-6">
            <div className={cn("transition-opacity", !isVisible && "opacity-50")}>
                <div className="bg-background/50 border border-primary/10 p-6 rounded-xl space-y-5 focus-within:border-primary/30 transition-all shadow-sm">
                    <div className="space-y-1.5">
                        <Label className="text-xs font-normal text-muted-foreground uppercase tracking-wider">Headline</Label>
                        <Input
                            value={content?.headline || ""}
                            onChange={(e) => onUpdate("headline", e.target.value)}
                            placeholder="e.g. Ready to start your project?"
                            className="text-lg font-medium bg-transparent border-0 border-b border-border/50 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs font-normal text-muted-foreground uppercase tracking-wider">Subtext</Label>
                        <Textarea
                            value={content?.subtext || ""}
                            onChange={(e) => onUpdate("subtext", e.target.value)}
                            placeholder="Provide some encouraging subtext..."
                            rows={3}
                            className="resize-none bg-transparent border border-border/50 focus-visible:ring-1 focus-visible:ring-primary/20"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
