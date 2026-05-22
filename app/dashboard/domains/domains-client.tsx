"use client";

import { useState, useTransition } from "react";
import { updateSubdomain } from "../actions";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AlertTriangle, Globe, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";

interface DomainsClientProps {
    portfolio: {
        subdomain: string;
    };
    canUseSubdomain: boolean;
}

export function DomainsClient({ portfolio, canUseSubdomain }: DomainsClientProps) {
    const [isPending, startTransition] = useTransition();
    const [subdomain, setSubdomain] = useState(portfolio.subdomain);
    const [subdomainError, setSubdomainError] = useState("");

    const validateSubdomainFormat = (value: string) => {
        if (!value) {
            setSubdomainError("");
            return true;
        }
        if (value.length < 3) {
            setSubdomainError("Must be at least 3 characters");
            return false;
        }
        if (value.length > 30) {
            setSubdomainError("Must be 30 characters or fewer");
            return false;
        }
        if (!/^[a-z0-9-]+$/.test(value)) {
            setSubdomainError("Only lowercase letters, numbers, and hyphens");
            return false;
        }
        setSubdomainError("");
        return true;
    };

    const handleSubdomainChange = (value: string) => {
        const normalized = value.toLowerCase().trim();
        setSubdomain(normalized);
        validateSubdomainFormat(normalized);
    };

    const handleSaveSubdomain = () => {
        if (!validateSubdomainFormat(subdomain)) return;

        startTransition(async () => {
            try {
                if (canUseSubdomain && subdomain !== portfolio.subdomain) {
                    await updateSubdomain(subdomain);
                    toast.success("Subdomain updated successfully");
                }
            } catch (error) {
                const msg = error instanceof Error ? error.message : "Failed to save";
                toast.error(msg);
                setSubdomainError(msg);
            }
        });
    };

    const hasSubdomainChanged = canUseSubdomain && subdomain !== portfolio.subdomain;
    const canSave = hasSubdomainChanged && !subdomainError;

    return (
        <div className="flex flex-col gap-8 max-w-5xl mx-auto font-sans">
            <div className="flex flex-col gap-1.5">
                <h1 className="text-3xl tracking-tight">Domains</h1>
                <p className="text-sm text-muted-foreground font-medium">
                    Manage your custom subdomains for your portfolio.
                </p>
            </div>

            <div className="space-y-6 pt-4">
                <Card className="border p-6 shadow-sm">
                    <CardHeader className="px-0 pt-0">
                        <CardTitle className="text-xl flex items-center gap-2">
                            <Globe className="size-5 text-primary" />
                            Subdomain Configuration
                        </CardTitle>
                        <CardDescription>
                            Set up a branded subdomain for your portfolio to share with your clients.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-0 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-x-12 gap-y-4">
                            <div className="space-y-1">
                                <Label htmlFor="subdomain" className="text-sm font-semibold flex items-center gap-2">
                                    Portfolio Subdomain
                                </Label>
                                <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                                    Use a branded subdomain like <span className="font-semibold">yourname</span>.{process.env.NEXT_PUBLIC_ROOT_DOMAIN || "yourdomain.com"}.
                                    Available on Pro and Agency plans.
                                </p>
                            </div>
                            <div className="max-w-md w-full space-y-4">
                                <div className="space-y-2">
                                    <Input
                                        id="subdomain"
                                        value={subdomain}
                                        onChange={(e) => handleSubdomainChange(e.target.value)}
                                        className={`h-10 bg-background ${subdomainError ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                        placeholder="your-subdomain"
                                        disabled={isPending || !canUseSubdomain}
                                    />
                                    {!canUseSubdomain ? (
                                        <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                                            <AlertTriangle className="size-4 text-amber-600 mt-0.5 shrink-0" />
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-amber-800 dark:text-amber-500">Upgrade Required</p>
                                                <p className="text-xs text-amber-700/80 dark:text-amber-500/80">
                                                    Custom subdomains are only available on Pro and Agency plans.
                                                </p>
                                                <Button asChild variant="link" className="h-auto p-0 text-xs text-amber-600 dark:text-amber-500 underline">
                                                    <Link href="/dashboard/pricing">View plans</Link>
                                                </Button>
                                            </div>
                                        </div>
                                    ) : subdomainError ? (
                                        <p className="text-xs text-destructive font-medium flex items-center gap-1.5">
                                            <AlertTriangle className="size-3" />
                                            {subdomainError}
                                        </p>
                                    ) : subdomain ? (
                                        <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/5 border border-primary/10">
                                            <div className="p-1 rounded bg-primary/10 text-primary">
                                                <CheckCircle2 className="size-3" />
                                            </div>
                                            <p className="text-xs text-primary/80 font-medium">
                                                https://{subdomain}.{(process.env.NEXT_PUBLIC_ROOT_DOMAIN || process.env.NEXT_PUBLIC_APP_URL || "localhost:3000").replace(/^https?:\/\//, "").replace(/^www\./, "")}
                                            </p>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="px-0 py-6 border-t mt-8 flex justify-end gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                handleSubdomainChange(portfolio.subdomain || "");
                            }}
                            disabled={isPending || !canUseSubdomain}
                            className="h-9 px-4"
                        >
                            Reset
                        </Button>
                        <Button
                            onClick={handleSaveSubdomain}
                            disabled={isPending || !canSave}
                            size="sm"
                            className="h-9 px-6 shadow-sm shadow-primary/20"
                        >
                            {isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : <CheckCircle2 className="size-4 mr-2" />}
                            {isPending ? "Saving changes..." : "Save Changes"}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
