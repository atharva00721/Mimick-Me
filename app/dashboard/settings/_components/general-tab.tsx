"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { User, Upload, Loader2, AlertTriangle, Globe, CheckCircle2 } from "lucide-react";
import { useState, RefObject } from "react";

interface GeneralTabProps {
    user: {
        email: string;
        name: string;
        image: string | null;
    };
    portfolio: {
        handle: string;
    };
    name: string;
    setName: (name: string) => void;
    handle: string;
    handleHandleChange: (handle: string) => void;
    image: string;
    setImage: (image: string) => void;
    handleError: string;
    isPending: boolean;
    isUploading: boolean;
    uploadProgress: number;
    fileInputRef: RefObject<HTMLInputElement | null>;
    handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSaveProfile: () => void;
    canSave: boolean;
}

export function GeneralTab({
    user,
    portfolio,
    name,
    setName,
    handle,
    handleHandleChange,
    image,
    setImage,
    handleError,
    isPending,
    isUploading,
    uploadProgress,
    fileInputRef,
    handleFileSelect,
    handleSaveProfile,
    canSave,
}: GeneralTabProps) {
    const [hasError, setHasError] = useState(false);


    return (
        <div className="space-y-6 pt-4">
            <Card className="border-none p-6 shadow-none bg-transparent">
                <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-xl flex items-center gap-2">
                        <User className="size-5 text-primary" />
                        Profile Information
                    </CardTitle>
                    <CardDescription>
                        Update your personal details and how you appear across the platform.
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-0 space-y-8">
                    {/* Avatar Section */}
                    <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-x-12 gap-y-4">
                        <div className="space-y-1">
                            <Label className="text-sm font-semibold flex items-center gap-2">
                                Profile Picture
                            </Label>
                            <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                                This will be displayed on your portfolio and AI agents.
                            </p>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="relative group">
                                <div className="size-24 rounded-2xl overflow-hidden border-2 border-border bg-muted flex items-center justify-center relative transition-all group-hover:border-primary/50">
                                    {(image && !hasError) ? (
                                        <img
                                            src={image}
                                            alt="Avatar"
                                            className="size-full object-cover"
                                            onLoad={() => setHasError(false)}
                                            onError={() => setHasError(true)}
                                        />
                                    ) : (
                                        <User className="size-10 text-muted-foreground/40" />
                                    )}
                                    {isUploading && (
                                        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
                                            <Loader2 className="size-6 animate-spin text-primary" />
                                        </div>
                                    )}
                                </div>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="icon"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isPending || isUploading}
                                    className="absolute -bottom-2 -right-2 size-8 rounded-full border shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Upload Image"
                                >
                                    <Upload className="size-3.5" />
                                </Button>
                            </div>
                            <div className="space-y-3 flex-1 max-w-sm">
                                <div className="flex gap-2">
                                    <Input
                                        value={image}
                                        onChange={(e) => setImage(e.target.value)}
                                        placeholder="https://your-avatar-url.com/image.png"
                                        disabled={isPending || isUploading}
                                        className="text-sm h-9 bg-background"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isPending || isUploading}
                                        className="shrink-0 h-9"
                                    >
                                        Browse
                                    </Button>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                                {isUploading && (
                                    <div className="space-y-1">
                                        <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary transition-all duration-300"
                                                style={{ width: `${uploadProgress}%` }}
                                            />
                                        </div>
                                        <p className="text-[10px] text-muted-foreground text-right font-medium">{uploadProgress}% uploaded</p>
                                    </div>
                                )}
                                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                                    Allowed JPG, PNG or WEBP. Max size of 5MB.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-border/60" />

                    {/* Name Section */}
                    <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-x-12 gap-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="name" className="text-sm font-semibold flex items-center gap-2">
                                Display Name
                            </Label>
                            <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                                The name that will be shown to your visitors.
                            </p>
                        </div>
                        <div className="max-w-md w-full">
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" />
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. John Doe"
                                    disabled={isPending}
                                    className="pl-9 h-10 bg-background"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-border/60" />

                    {/* Email Section */}
                    <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-x-12 gap-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="email" className="text-sm font-semibold flex items-center gap-2">
                                Email Address
                            </Label>
                            <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                                Your primary account email. Used for billing and login.
                            </p>
                        </div>
                        <div className="max-w-md w-full">
                            <div className="relative">
                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" />
                                <Input id="email" value={user.email} disabled className="pl-9 h-10 bg-muted/30" />
                            </div>
                            <p className="mt-2 text-[10px] text-muted-foreground font-medium">To change your email, please contact support.</p>
                        </div>
                    </div>



                    <div className="h-px bg-border/60" />

                    {/* Handle Section */}
                    <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-x-12 gap-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="handle" className="text-sm font-semibold flex items-center gap-2">
                                Public Handle
                            </Label>
                            <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                                Your unique portfolio identifier and custom URL.
                            </p>
                        </div>
                        <div className="max-w-md w-full space-y-2">
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground/60">@</span>
                                <Input
                                    id="handle"
                                    value={handle}
                                    onChange={(e) => handleHandleChange(e.target.value)}
                                    className={`pl-8 h-10 bg-background ${handleError ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                    placeholder="your-handle"
                                    disabled={isPending}
                                />
                            </div>
                            {handleError ? (
                                <p className="text-xs text-destructive font-medium flex items-center gap-1.5">
                                    <AlertTriangle className="size-3" />
                                    {handleError}
                                </p>
                            ) : (
                                <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/5 border border-primary/10">
                                    <div className="p-1 rounded bg-primary/10 text-primary">
                                        <Globe className="size-3" />
                                    </div>
                                    <p className="text-xs text-primary/80 font-medium">
                                        {process.env.NEXT_PUBLIC_APP_URL}/{handle}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="px-0 py-6 border-t mt-8 flex justify-end gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            setName(user.name);
                            handleHandleChange(portfolio.handle);
                            setImage(user.image || "");
                        }}
                        disabled={isPending}
                        className="h-9 px-4"
                    >
                        Reset
                    </Button>
                    <Button
                        onClick={handleSaveProfile}
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
    );
}
