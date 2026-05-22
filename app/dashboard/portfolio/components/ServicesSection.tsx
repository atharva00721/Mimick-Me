"use client";

import { Briefcase, Plus, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface ServicesSectionProps {
    editMode: boolean; // Kept for prop compatibility
    content: Array<{
        title: string;
        description: string;
    }> | null;
    onUpdate: (index: number, field: string, value: string) => void;
    onAdd: () => void;
    onRemove: (index: number) => void;
    isVisible: boolean;
    onVisibilityChange?: (visible: boolean) => void;
}

export function ServicesSection({
    content,
    onUpdate,
    onAdd,
    onRemove,
    isVisible,
    onVisibilityChange,
}: ServicesSectionProps) {
    return (
        <div className="space-y-6">
            <div className={cn("space-y-6 transition-opacity", !isVisible && "opacity-50")}>
                <div className="flex justify-end">
                    <Button size="sm" variant="outline" onClick={onAdd} className="h-8 rounded-full px-4">
                        <Plus className="size-3.5 mr-1.5" />
                        Add Service
                    </Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    {content?.map((s, i) => (
                        <div key={i} className="group relative bg-background/50 border border-primary/10 p-5 rounded-xl space-y-4 focus-within:border-primary/30 transition-colors">
                            <Button
                                size="icon"
                                variant="destructive"
                                className="absolute -top-3 -right-3 size-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                onClick={() => onRemove(i)}
                            >
                                <Trash2 className="size-3.5" />
                            </Button>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-normal text-muted-foreground uppercase tracking-wider">Service Title</Label>
                                <Input
                                    value={s.title}
                                    onChange={(e) => onUpdate(i, "title", e.target.value)}
                                    placeholder="e.g. Web Development"
                                    className="font-medium bg-transparent border-0 border-b border-border/50 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-normal text-muted-foreground uppercase tracking-wider">Description</Label>
                                <Textarea
                                    value={s.description}
                                    onChange={(e) => onUpdate(i, "description", e.target.value)}
                                    placeholder="Briefly describe what this service entails..."
                                    rows={3}
                                    className="resize-none bg-transparent border border-border/50 focus-visible:ring-1 focus-visible:ring-primary/20"
                                />
                            </div>
                        </div>
                    ))}

                    {(!content || content.length === 0) && (
                        <div className="sm:col-span-2 py-12 text-center border-2 border-dashed border-primary/20 rounded-xl bg-primary/5">
                            <Briefcase className="size-8 mx-auto text-muted-foreground/50 mb-3" />
                            <p className="text-sm font-medium">No services added yet</p>
                            <p className="text-xs text-muted-foreground mb-4">Add your first service to showcase what you offer.</p>
                            <Button size="sm" onClick={onAdd} className="rounded-full">
                                <Plus className="size-3.5 mr-1.5" />
                                Add Service
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
