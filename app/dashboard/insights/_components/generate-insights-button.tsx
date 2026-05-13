"use client";

import { Button } from "@/components/ui/button";
import { BrainCircuit, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function GenerateInsightsButton({
    portfolioId,
    lastGeneratedAt
}: {
    portfolioId: string;
    lastGeneratedAt?: string
}) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    // Disable if generated in last 24h
    const isCooldown = lastGeneratedAt ? (new Date().getTime() - new Date(lastGeneratedAt).getTime()) < 24 * 60 * 60 * 1000 : false;

    async function handleGenerate() {
        setIsLoading(true);
        try {
            const res = await fetch("/api/insights/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ portfolioId }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || data.message || "Failed to generate insights");
            }

            if (data.message) {
                toast.info(data.message);
            } else {
                toast.success("Insights regenerated successfully!");
                router.refresh();
            }
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Button
            onClick={handleGenerate}
            disabled={isLoading || isCooldown}
            className={isCooldown ? "opacity-70 bg-muted text-muted-foreground hover:bg-muted" : "bg-emerald-600 hover:bg-emerald-700 text-white"}
        >
            {isLoading ? (
                <Loader2 className="size-4 mr-2 animate-spin" />
            ) : (
                <BrainCircuit className="size-4 mr-2" />
            )}
            {isCooldown ? "Generated Recently" : "Generate Insights"}
        </Button>
    );
}
