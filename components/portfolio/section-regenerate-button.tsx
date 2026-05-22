"use client";

import { RefreshCw, Undo2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

interface SectionRegenerateButtonProps {
    section: string;
    isPrompting: boolean;
    onTogglePrompt: (active: boolean) => void;
    showUndo?: boolean;
    undoTimeLeft?: number;
    onUndo?: () => void;
    isLoading?: boolean;
    className?: string;
}

export function SectionRegenerateButton({
    section,
    isPrompting,
    onTogglePrompt,
    showUndo,
    undoTimeLeft,
    onUndo,
    isLoading,
    className,
}: SectionRegenerateButtonProps) {
    return (
        <div className={cn("relative flex items-center gap-3", className)}>
            {/* Undo State */}
            <AnimatePresence>
                {showUndo && !isPrompting && (
                    <motion.button
                        key="undo-pill"
                        type="button"
                        initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
                        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, x: 20, filter: "blur(10px)" }}
                        onClick={onUndo}
                        className="group flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/5 px-4 py-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 backdrop-blur-md transition-all hover:bg-amber-500/10 active:scale-95"
                    >
                        <Undo2 className="size-3.5 transition-transform group-hover:-rotate-45" />
                        <span>Undo Changes ({undoTimeLeft}s)</span>
                    </motion.button>
                )}
            </AnimatePresence>

            <motion.button
                type="button"
                whileHover={{ scale: 1.05, rotate: isPrompting ? -90 : 15 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onTogglePrompt(!isPrompting)}
                disabled={isLoading}
                className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-muted-foreground shadow-lg backdrop-blur-md transition-all duration-300 hover:border-primary/50 hover:text-primary hover:shadow-primary/20",
                    isPrompting && "border-red-500/50 bg-red-500/10 text-red-500 rotate-0",
                    isLoading && "opacity-50 cursor-not-allowed"
                )}
                aria-label={isPrompting ? "Cancel regeneration" : `Regenerate ${section}`}
            >
                {isPrompting ? <X className="size-4" /> : <RefreshCw className={cn("size-4", isLoading && "animate-spin")} />}
            </motion.button>
        </div>
    );
}
