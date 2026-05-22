"use client";

import { Pencil } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ImageUploader } from "@/components/portfolio/image-uploader";

interface AboutSectionProps {
    editMode: boolean;
    content: {
        paragraph?: string;
        avatarUrl?: string;
    } | null;
    onUpdate: (value: string) => void;
    onUpdateImage?: (url: string) => void;
    isVisible: boolean;
    onVisibilityChange?: (visible: boolean) => void;
}

export function AboutSection({ content, onUpdate, onUpdateImage, isVisible }: AboutSectionProps) {
    return (
        <div className="space-y-6">
            <div className={cn("grid gap-6 transition-opacity", !isVisible && "opacity-50")}>

                {/* Profile Photo Uploader */}
                {onUpdateImage && (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Label className="text-sm font-normal tracking-tight">Profile Photo</Label>
                            <span className="text-[10px] text-muted-foreground px-1.5 py-0.5 bg-primary/10 text-primary rounded font-semibold">
                                Used in Personal template
                            </span>
                        </div>
                        <ImageUploader
                            currentUrl={content?.avatarUrl}
                            onUploadSuccess={onUpdateImage}
                            label="Upload your profile photo"
                            hint="PNG, JPG, WEBP up to 10MB. Square image works best."
                        />
                    </div>
                )}

                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Label className="text-sm font-normal tracking-tight">Biography</Label>
                        <Pencil className="size-3 text-muted-foreground/50" />
                    </div>
                    <Textarea
                        value={content?.paragraph || ""}
                        onChange={(e) => onUpdate(e.target.value)}
                        placeholder="Write a brief introduction about yourself, your background, and your goals..."
                        rows={8}
                        className="text-base bg-background/50 border-primary/10 transition-all focus:border-primary/30 resize-none"
                    />
                </div>
            </div>
        </div>
    );
}
