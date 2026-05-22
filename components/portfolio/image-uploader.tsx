"use client";

import { useRef, useState, useEffect } from "react";
import { UploadCloud, X, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

interface ImageUploaderProps {
    /** Existing URL from saved content — shown as current photo */
    currentUrl?: string;
    /** Called with the final public S3 URL once upload is confirmed, or "" when cleared */
    onUploadSuccess: (url: string) => void;
    label?: string;
    hint?: string;
    className?: string;
}

export function ImageUploader({
    currentUrl,
    onUploadSuccess,
    label = "Upload Image",
    hint = "JPG, PNG, WEBP or GIF · max 8 MB",
    className,
}: ImageUploaderProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadState, setUploadState] = useState<"idle" | "uploading" | "done" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl ?? null);

    // Keep preview in sync if the parent loads saved content asynchronously
    useEffect(() => {
        setPreviewUrl(currentUrl ?? null);
    }, [currentUrl]);

    const reset = () => {
        setUploadState("idle");
        setErrorMsg(null);
    };

    const handleFile = async (file: File) => {
        // ── Client-side validation ────────────────────────────────────────────────
        if (!ALLOWED_TYPES.includes(file.type)) {
            setErrorMsg("Only JPG, PNG, WEBP, GIF, or AVIF images are accepted.");
            setUploadState("error");
            return;
        }
        if (file.size > MAX_BYTES) {
            setErrorMsg(`Image is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max is 8 MB.`);
            setUploadState("error");
            return;
        }

        reset();
        setUploadState("uploading");

        // Instant local preview (object URL) while uploading
        const blobUrl = URL.createObjectURL(file);
        setPreviewUrl(blobUrl);

        try {
            // ── Step 1: Get a pre-signed S3 PUT URL from our API ───────────────────
            const params = new URLSearchParams({
                fileName: file.name,
                mimeType: file.type,
                fileSize: String(file.size),
            });
            const signRes = await fetch(`/api/upload/portfolio?${params}`, { method: "POST" });

            if (!signRes.ok) {
                const body = await signRes.json().catch(() => ({}));
                throw new Error(body?.error ?? `Server error ${signRes.status}`);
            }

            const { uploadUrl, publicUrl } = (await signRes.json()) as {
                uploadUrl: string;
                publicUrl: string;
            };

            // ── Step 2: PUT the binary directly to S3 (no auth header needed) ──────
            // The Content-Type header MUST match what we signed for, otherwise S3
            // will return 403 SignatureDoesNotMatch.
            const putRes = await fetch(uploadUrl, {
                method: "PUT",
                headers: {
                    "Content-Type": file.type,
                    // Do NOT send Authorization here — the presigned URL encodes credentials
                },
                body: file,
            });

            if (!putRes.ok) {
                throw new Error(`S3 upload failed: ${putRes.status} ${putRes.statusText}`);
            }

            // ── Step 3: Swap blob preview for real CDN URL ─────────────────────────
            URL.revokeObjectURL(blobUrl);
            setPreviewUrl(publicUrl);
            setUploadState("done");
            onUploadSuccess(publicUrl);
        } catch (err) {
            console.error("[ImageUploader]", err);
            setErrorMsg(err instanceof Error ? err.message : "Upload failed. Please try again.");
            setUploadState("error");
            // Revert to the last confirmed remote URL (don't leave a dangling blob)
            URL.revokeObjectURL(blobUrl);
            setPreviewUrl(currentUrl ?? null);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    };

    const clearImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreviewUrl(null);
        reset();
        onUploadSuccess("");
        if (inputRef.current) inputRef.current.value = "";
    };

    const isUploading = uploadState === "uploading";

    return (
        <div className={cn("space-y-2", className)}>
            {/* ── Drop zone ─────────────────────────────────────────────────────── */}
            <div
                role="button"
                tabIndex={0}
                aria-label={label}
                className={cn(
                    "relative flex flex-col items-center justify-center gap-3 rounded-xl",
                    "border-2 border-dashed transition-all duration-200 cursor-pointer select-none",
                    "bg-muted/30 hover:bg-muted/60 hover:border-primary/50",
                    isDragging && "border-primary bg-primary/5 scale-[1.015] shadow-lg shadow-primary/10",
                    previewUrl ? "h-52" : "h-44",
                    uploadState === "error" && !previewUrl && "border-destructive/50 bg-destructive/5",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                )}
                onClick={() => !isUploading && inputRef.current?.click()}
                onKeyDown={(e) => e.key === "Enter" && !isUploading && inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
            >
                {previewUrl ? (
                    <>
                        <img
                            src={previewUrl}
                            alt="Profile preview"
                            className="w-full h-full object-cover rounded-[10px]"
                        />
                        {/* Hover overlay */}
                        {!isUploading && (
                            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-[10px] flex items-center justify-center">
                                <span className="text-white text-xs font-semibold tracking-wide flex items-center gap-2">
                                    <UploadCloud className="size-4" /> Click to replace
                                </span>
                            </div>
                        )}
                        {/* Remove button */}
                        {!isUploading && (
                            <button
                                type="button"
                                aria-label="Remove image"
                                onClick={clearImage}
                                className="absolute top-2 right-2 z-10 bg-white/90 dark:bg-zinc-900/90 text-zinc-600 dark:text-zinc-300 rounded-full p-1.5 shadow-md hover:bg-red-50 hover:text-red-500 transition-colors"
                            >
                                <X className="size-3.5" />
                            </button>
                        )}
                        {/* Upload progress overlay */}
                        {isUploading && (
                            <div className="absolute inset-0 bg-black/60 rounded-[10px] flex flex-col items-center justify-center gap-3">
                                <Loader2 className="size-8 text-white animate-spin" />
                                <span className="text-white text-xs font-semibold">Uploading to S3…</span>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        {isUploading ? (
                            <Loader2 className="size-9 text-primary animate-spin" />
                        ) : uploadState === "error" ? (
                            <AlertCircle className="size-9 text-destructive/70" />
                        ) : (
                            <div className="flex flex-col items-center gap-2">
                                <UploadCloud className="size-9 text-muted-foreground" />
                                <div className="text-center px-4">
                                    <p className="text-sm font-semibold text-muted-foreground">
                                        {isDragging ? "Drop to upload" : label}
                                    </p>
                                    <p className="text-xs text-muted-foreground/60 mt-1">{hint}</p>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* ── Browse link (when no image) ── */}
            {!previewUrl && !isUploading && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground/70">
                    <span>or</span>
                    <button
                        type="button"
                        className="font-medium underline underline-offset-2 hover:text-primary transition-colors"
                        onClick={() => inputRef.current?.click()}
                    >
                        browse files
                    </button>
                </div>
            )}

            {/* ── Error message ── */}
            {uploadState === "error" && errorMsg && (
                <p className="flex items-center gap-1.5 text-xs text-destructive font-medium">
                    <AlertCircle className="size-3 shrink-0" /> {errorMsg}
                </p>
            )}

            {/* ── Success confirmation ── */}
            {uploadState === "done" && (
                <p className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                    <CheckCircle2 className="size-3.5" /> Photo uploaded! Hit &quot;Save Changes&quot; to apply it.
                </p>
            )}

            {/* ── Hidden file input ── */}
            <input
                ref={inputRef}
                type="file"
                accept={ALLOWED_TYPES.join(",")}
                className="sr-only"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                    // Reset so the same file can be re-selected
                    e.target.value = "";
                }}
                aria-label="Image file input"
            />
        </div>
    );
}
