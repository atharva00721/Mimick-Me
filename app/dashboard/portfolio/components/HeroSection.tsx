"use client";

import { Globe, Pencil } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
    editMode: boolean; // Kept for prop compatibility, but we treat it as always true for editing
    content: {
        headline?: string;
        subheadline?: string;
    } | null;
    onUpdate: (field: string, value: string) => void;
    isVisible: boolean;
    onVisibilityChange?: (visible: boolean) => void;
}

export function HeroSection({ content, onUpdate, isVisible, onVisibilityChange }: HeroSectionProps) {
    return (
        <div className="space-y-6">
            <div className={cn("grid gap-6 transition-opacity", !isVisible && "opacity-50")}>
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Label className="text-sm font-normal tracking-tight">Main Headline</Label>
                        <Pencil className="size-3 text-muted-foreground/50" />
                    </div>
                    <Input
                        value={content?.headline || ""}
                        onChange={(e) => onUpdate("headline", e.target.value)}
                        placeholder="e.g. Building digital products, brands, and experiences."
                        className="h-12 text-lg font-medium bg-background/50 border-primary/10 transition-all focus:border-primary/30"
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Label className="text-sm font-normal tracking-tight">Sub-headline / Intro</Label>
                        <Pencil className="size-3 text-muted-foreground/50" />
                    </div>
                    <Textarea
                        value={content?.subheadline || ""}
                        onChange={(e) => onUpdate("subheadline", e.target.value)}
                        placeholder="A short description of what you do or who you are."
                        rows={4}
                        className="text-base bg-background/50 border-primary/10 transition-all focus:border-primary/30 resize-none"
                    />
                </div>
            </div>
        </div>
    );
}

