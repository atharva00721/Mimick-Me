"use client";

import { MessageSquare, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface TestimonialsSectionProps {
    editMode: boolean; // Kept for prop compatibility
    content: Array<{
        quote: string;
        author: string;
        role: string;
    }> | null;
    onUpdate: (index: number, field: string, value: string) => void;
    onAdd: () => void;
    onRemove: (index: number) => void;
    isVisible: boolean;
    onVisibilityChange?: (visible: boolean) => void;
}

export function TestimonialsSection({
    content,
    onUpdate,
    onAdd,
    onRemove,
    isVisible,
    onVisibilityChange,
}: TestimonialsSectionProps) {
    return (
        <div className="space-y-6">
            <div className={cn("space-y-6 transition-opacity", !isVisible && "opacity-50")}>
                <div className="flex justify-end">
                    <Button size="sm" variant="outline" onClick={onAdd} className="h-8 rounded-full px-4">
                        <Plus className="size-3.5 mr-1.5" />
                        Add Testimonial
                    </Button>
                </div>

                <div className="grid gap-5">
                    {content?.map((t, i) => (
                        <div key={i} className="group relative bg-background/50 border border-primary/10 p-5 rounded-xl flex flex-col gap-4 focus-within:border-primary/30 transition-all shadow-sm">
                            <Button
                                size="icon"
                                variant="destructive"
                                className="absolute -top-3 -right-3 size-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
                                onClick={() => onRemove(i)}
                            >
                                <Trash2 className="size-3.5" />
                            </Button>

                            <div className="space-y-1.5 relative">
                                <Label className="text-xs font-normal text-muted-foreground uppercase tracking-wider">Quote</Label>
                                <div className="relative">
                                    <Textarea
                                        value={t.quote}
                                        onChange={(e) => onUpdate(i, "quote", e.target.value)}
                                        placeholder="Enter the testimonial quote here..."
                                        rows={3}
                                        className="resize-none bg-transparent border border-border/50 focus-visible:ring-1 focus-visible:ring-primary/20 italic pl-8"
                                    />
                                    <MessageSquare className="absolute left-2.5 top-2.5 size-4 text-primary/30" />
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-normal text-muted-foreground uppercase tracking-wider">Author Name</Label>
                                    <Input
                                        value={t.author}
                                        onChange={(e) => onUpdate(i, "author", e.target.value)}
                                        placeholder="e.g. Jane Doe"
                                        className="font-medium bg-transparent border-0 border-b border-border/50 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-normal text-muted-foreground uppercase tracking-wider">Role or Company</Label>
                                    <Input
                                        value={t.role}
                                        onChange={(e) => onUpdate(i, "role", e.target.value)}
                                        placeholder="e.g. CEO at Tech Corp"
                                        className="font-medium bg-transparent border-0 border-b border-border/50 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    {(!content || content.length === 0) && (
                        <div className="py-12 text-center border-2 border-dashed border-primary/20 rounded-xl bg-primary/5">
                            <MessageSquare className="size-8 mx-auto text-muted-foreground/50 mb-3" />
                            <p className="text-sm font-medium">No testimonials added yet</p>
                            <p className="text-xs text-muted-foreground mb-4">Build trust by adding client reviews.</p>
                            <Button size="sm" onClick={onAdd} className="rounded-full">
                                <Plus className="size-3.5 mr-1.5" />
                                Add Testimonial
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
