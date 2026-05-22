"use client";

import { Share2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { SocialLink, SocialPlatform } from "@/lib/validation/portfolio-schema";

interface SocialLinksSectionProps {
    editMode: boolean; // Kept for compatibility
    availablePlatforms: Array<{
        platform: SocialPlatform;
        label: string;
    }>;
    getSocialLink: (platform: SocialPlatform) => SocialLink | undefined;
    onUpdate: (platform: SocialPlatform, field: "enabled" | "url", value: boolean | string) => void;
    isVisible: boolean; // Added for unified consistency
    onVisibilityChange?: (visible: boolean) => void; // Added for unified consistency
}

export function SocialLinksSection({
    availablePlatforms,
    getSocialLink,
    onUpdate,
    isVisible,
    onVisibilityChange,
}: SocialLinksSectionProps) {
    return (
        <div className="space-y-6">
            <div className={cn("space-y-4 transition-opacity", !isVisible && "opacity-50")}>
                {availablePlatforms.map(({ platform, label }) => {
                    const socialLink = getSocialLink(platform);
                    const isEnabled = socialLink?.enabled || false;
                    const url = socialLink?.url || "";

                    return (
                        <div key={platform} className="bg-background/50 border border-primary/10 p-5 rounded-xl space-y-4 focus-within:border-primary/30 transition-all shadow-sm">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm font-normal">{label}</Label>
                                <Switch
                                    checked={isEnabled}
                                    onCheckedChange={(checked) => onUpdate(platform, "enabled", checked)}
                                    className="data-[state=checked]:bg-primary"
                                />
                            </div>

                            <div className={cn("transition-all duration-300 overflow-hidden", isEnabled ? "opacity-100 h-auto mt-4" : "opacity-0 h-0 m-0 pointer-events-none")}>
                                <Label className="text-xs font-normal text-muted-foreground uppercase tracking-wider mb-1.5 block">Profile URL</Label>
                                <Input
                                    value={url}
                                    onChange={(e) => onUpdate(platform, "url", e.target.value)}
                                    placeholder={`https://${platform}.com/yourprofile`}
                                    className="bg-primary/5 border-primary/10 focus:border-primary/30 transition-colors"
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
