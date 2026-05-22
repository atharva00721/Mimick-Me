"use client";

import { Megaphone, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { ImageUpload } from "@/components/ui/image-upload";

interface GallerySectionProps {
    editMode: boolean; // Kept for prop compatibility
    content: Array<{
        url: string;
        caption: string;
    }> | null;
    onUpdate: (index: number, field: string, value: string) => void;
    onAdd: () => void;
    onRemove: (index: number) => void;
    isVisible: boolean;
    onVisibilityChange?: (visible: boolean) => void;
}

export function GallerySection({
    content,
    onUpdate,
    onAdd,
    onRemove,
    isVisible,
    onVisibilityChange,
}: GallerySectionProps) {
    return (
        <div className="space-y-6">
            <div className={cn("space-y-6 transition-opacity", !isVisible && "opacity-50")}>
                <div className="flex justify-end">
                    <Button size="sm" variant="outline" onClick={onAdd} className="h-8 rounded-full px-4">
                        <Plus className="size-3.5 mr-1.5" />
                        Add Image
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {content?.map((g, i) => (
                        <div key={i} className="group relative bg-background/50 border border-primary/10 p-4 rounded-xl flex flex-col gap-4 focus-within:border-primary/30 transition-all shadow-sm">
                            <Button
                                size="icon"
                                variant="destructive"
                                className="absolute -top-3 -right-3 size-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
                                onClick={() => onRemove(i)}
                            >
                                <Trash2 className="size-3.5" />
                            </Button>

                            <div className="w-full">
                                <ImageUpload
                                    value={g.url}
                                    onUploadComplete={(url) => onUpdate(i, "url", url)}
                                />
                            </div>

                            <div className="space-y-1.5 mt-auto">
                                <Label className="text-xs font-normal text-muted-foreground uppercase tracking-wider">Caption</Label>
                                <Input
                                    value={g.caption}
                                    onChange={(e) => onUpdate(i, "caption", e.target.value)}
                                    placeholder="Enter a brief caption..."
                                    className="text-sm bg-transparent border-0 border-b border-border/50 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {(!content || content.length === 0) && (
                    <div className="py-12 text-center border-2 border-dashed border-primary/20 rounded-xl bg-primary/5">
                        <Megaphone className="size-8 mx-auto text-muted-foreground/50 mb-3" />
                        <p className="text-sm font-medium">No images in gallery</p>
                        <p className="text-xs text-muted-foreground mb-4">Add images to showcase your work visually.</p>
                        <Button size="sm" onClick={onAdd} className="rounded-full">
                            <Plus className="size-3.5 mr-1.5" />
                            Add Image
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
