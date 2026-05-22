"use client";

import { Megaphone, Plus, Trash2, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface ProjectsSectionProps {
    editMode: boolean; // Kept for prop compatibility
    content: Array<{
        title: string;
        description: string;
        result: string;
    }> | null;
    onUpdate: (index: number, field: string, value: string) => void;
    onAdd: () => void;
    onRemove: (index: number) => void;
    isVisible: boolean;
    onVisibilityChange?: (visible: boolean) => void;
}

export function ProjectsSection({
    content,
    onUpdate,
    onAdd,
    onRemove,
    isVisible,
    onVisibilityChange,
}: ProjectsSectionProps) {
    return (
        <div className="space-y-6">
            <div className={cn("space-y-6 transition-opacity", !isVisible && "opacity-50")}>
                <div className="flex justify-end">
                    <Button size="sm" variant="outline" onClick={onAdd} className="h-8 rounded-full px-4">
                        <Plus className="size-3.5 mr-1.5" />
                        Add Project
                    </Button>
                </div>

                <div className="grid gap-5">
                    {content?.map((p, i) => (
                        <div key={i} className="group relative bg-background/50 border border-primary/10 p-5 rounded-xl flex flex-col md:flex-row gap-6 focus-within:border-primary/30 transition-all shadow-sm">
                            <Button
                                size="icon"
                                variant="destructive"
                                className="absolute -top-3 -right-3 size-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
                                onClick={() => onRemove(i)}
                            >
                                <Trash2 className="size-3.5" />
                            </Button>

                            <div className="flex-1 space-y-4">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-normal text-muted-foreground uppercase tracking-wider">Project Title</Label>
                                    <Input
                                        value={p.title}
                                        onChange={(e) => onUpdate(i, "title", e.target.value)}
                                        placeholder="e.g. E-Commerce Platform Redesign"
                                        className="text-base font-medium bg-transparent border-0 border-b border-border/50 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-xs font-normal text-muted-foreground uppercase tracking-wider">Description</Label>
                                    <Textarea
                                        value={p.description}
                                        onChange={(e) => onUpdate(i, "description", e.target.value)}
                                        placeholder="Describe the project, your role, and the challenges faced..."
                                        rows={3}
                                        className="resize-none bg-transparent border border-border/50 focus-visible:ring-1 focus-visible:ring-primary/20"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-xs font-normal text-primary uppercase tracking-wider flex items-center gap-1.5">
                                        Key Result
                                    </Label>
                                    <Input
                                        value={p.result}
                                        onChange={(e) => onUpdate(i, "result", e.target.value)}
                                        placeholder="e.g. Increased conversion rate by 25%"
                                        className="bg-primary/5 border-primary/20 text-sm focus-visible:ring-primary/20"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    {(!content || content.length === 0) && (
                        <div className="py-12 text-center border-2 border-dashed border-primary/20 rounded-xl bg-primary/5">
                            <Megaphone className="size-8 mx-auto text-muted-foreground/50 mb-3" />
                            <p className="text-sm font-medium">No projects added yet</p>
                            <p className="text-xs text-muted-foreground mb-4">Showcase your past work to build trust.</p>
                            <Button size="sm" onClick={onAdd} className="rounded-full">
                                <Plus className="size-3.5 mr-1.5" />
                                Add Project
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
