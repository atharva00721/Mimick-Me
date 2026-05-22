"use client";

import { Briefcase, Plus, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { ImageUpload } from "@/components/ui/image-upload";
import Image from "next/image";

interface ProductsSectionProps {
    editMode: boolean; // Kept for prop compatibility
    content: Array<{
        title: string;
        description: string;
        price: string;
        url: string;
        image: string;
    }> | null;
    onUpdate: (index: number, field: string, value: string) => void;
    onAdd: () => void;
    onRemove: (index: number) => void;
    isVisible: boolean;
    onVisibilityChange?: (visible: boolean) => void;
}

export function ProductsSection({
    content,
    onUpdate,
    onAdd,
    onRemove,
    isVisible,
    onVisibilityChange,
}: ProductsSectionProps) {
    return (
        <div className="space-y-6">
            <div className={cn("space-y-6 transition-opacity", !isVisible && "opacity-50")}>
                <div className="flex justify-end">
                    <Button size="sm" variant="outline" onClick={onAdd} className="h-8 rounded-full px-4">
                        <Plus className="size-3.5 mr-1.5" />
                        Add Product
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

                            <div className="w-full md:w-1/3 max-w-sm shrink-0">
                                <Label className="text-xs font-normal text-muted-foreground uppercase tracking-wider mb-2 block">Product Image</Label>
                                <ImageUpload
                                    value={p.image}
                                    onUploadComplete={(url) => onUpdate(i, "image", url)}
                                />
                            </div>

                            <div className="flex-1 space-y-4">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-normal text-muted-foreground uppercase tracking-wider">Product Title</Label>
                                    <Input
                                        value={p.title}
                                        onChange={(e) => onUpdate(i, "title", e.target.value)}
                                        placeholder="e.g. Masterclass Course"
                                        className="text-base font-medium bg-transparent border-0 border-b border-border/50 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-xs font-normal text-muted-foreground uppercase tracking-wider">Description</Label>
                                    <Textarea
                                        value={p.description}
                                        onChange={(e) => onUpdate(i, "description", e.target.value)}
                                        placeholder="Briefly describe this product..."
                                        rows={2}
                                        className="resize-none bg-transparent border border-border/50 focus-visible:ring-1 focus-visible:ring-primary/20"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-normal text-muted-foreground uppercase tracking-wider">Price</Label>
                                        <Input
                                            value={p.price}
                                            onChange={(e) => onUpdate(i, "price", e.target.value)}
                                            placeholder="e.g. $99.00"
                                            className="bg-primary/5 border-primary/10 transition-all focus:border-primary/30 focus-visible:ring-0"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-normal text-muted-foreground uppercase tracking-wider">Link / URL</Label>
                                        <Input
                                            value={p.url}
                                            onChange={(e) => onUpdate(i, "url", e.target.value)}
                                            placeholder="https://..."
                                            className="bg-primary/5 border-primary/10 transition-all focus:border-primary/30 focus-visible:ring-0"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {(!content || content.length === 0) && (
                        <div className="py-12 text-center border-2 border-dashed border-primary/20 rounded-xl bg-primary/5">
                            <Briefcase className="size-8 mx-auto text-muted-foreground/50 mb-3" />
                            <p className="text-sm font-medium">No products added yet</p>
                            <p className="text-xs text-muted-foreground mb-4">Add the products you sell.</p>
                            <Button size="sm" onClick={onAdd} className="rounded-full">
                                <Plus className="size-3.5 mr-1.5" />
                                Add Product
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
