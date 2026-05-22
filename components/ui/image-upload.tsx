"use client";

import { useState, useRef } from "react";
import { Upload, X, CheckCircle, AlertCircle, Loader2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ImageUploadProps {
    onUploadComplete: (url: string) => void;
    value?: string;
    disabled?: boolean;
    className?: string;
}

export function ImageUpload({ onUploadComplete, value, disabled, className }: ImageUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            await handleFile(files[0]);
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            await handleFile(files[0]);
        }
    };

    const handleFile = async (file: File) => {
        if (!file.type.startsWith("image/")) {
            setError("Only image files are allowed");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("File size must be less than 5MB");
            return;
        }

        setError(null);
        setIsUploading(true);
        setUploadProgress(0);

        try {
            const uploadUrlResponse = await fetch(
                `/api/upload/portfolio?fileName=${encodeURIComponent(file.name)}&mimeType=${encodeURIComponent(file.type)}`,
                { method: "POST" }
            );

            if (!uploadUrlResponse.ok) {
                const errorData = await uploadUrlResponse.json();
                throw new Error(errorData.error || "Failed to get upload URL");
            }

            const { uploadUrl, publicUrl } = await uploadUrlResponse.json();

            const xhr = new XMLHttpRequest();
            xhr.open("PUT", uploadUrl);
            xhr.setRequestHeader("Content-Type", file.type);

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const progress = Math.round((event.loaded / event.total) * 100);
                    setUploadProgress(progress);
                }
            };

            await new Promise<void>((resolve, reject) => {
                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve();
                    } else {
                        reject(new Error(`Upload failed (${xhr.status})`));
                    }
                };
                xhr.onerror = () => reject(new Error("Network error during upload"));
                xhr.send(file);
            });

            onUploadComplete(publicUrl);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Upload failed");
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
            if (inputRef.current) {
                inputRef.current.value = "";
            }
        }
    };

    return (
        <div className={cn("space-y-2", className)}>
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !disabled && !isUploading && inputRef.current?.click()}
                className={cn(
                    "relative aspect-video border-2 border-dashed rounded-xl overflow-hidden group transition-all duration-300",
                    isDragging
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground/20 hover:border-primary/40 hover:bg-muted/50",
                    disabled && "opacity-50 pointer-events-none",
                    !value && "flex flex-col items-center justify-center p-6 text-center"
                )}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={disabled || isUploading}
                />

                {value ? (
                    <>
                        <Image
                            src={value}
                            alt="Uploaded Preview"
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button
                                variant="secondary"
                                size="sm"
                                className="rounded-full h-8 px-3"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    inputRef.current?.click();
                                }}
                            >
                                <Upload className="size-3.5 mr-1.5" />
                                Replace
                            </Button>
                            <Button
                                variant="destructive"
                                size="icon"
                                className="rounded-full h-8 w-8"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onUploadComplete("");
                                }}
                            >
                                <X className="size-4" />
                            </Button>
                        </div>
                    </>
                ) : isUploading ? (
                    <div className="flex flex-col items-center gap-3">
                        <div className="relative size-12 flex items-center justify-center">
                            <Loader2 className="absolute inset-0 size-full animate-spin text-primary opacity-20" />
                            <span className="text-[10px] font-bold text-primary">{uploadProgress}%</span>
                        </div>
                        <p className="text-xs font-medium text-muted-foreground animate-pulse">Uploading Image...</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-3">
                        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <ImageIcon className="size-5 text-primary" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-semibold">Click or drag to upload</p>
                            <p className="text-[10px] text-muted-foreground">PNG, JPG or WebP (Max 5MB)</p>
                        </div>
                    </div>
                )}
            </div>

            {error && (
                <div className="flex items-center gap-2 text-[10px] font-medium text-destructive px-1">
                    <AlertCircle className="size-3" />
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
}
