"use client";

import { useTheme } from "next-themes";
import { useState, useEffect, useTransition, useSyncExternalStore, useRef } from "react";
import { updateHandle, deleteActivePortfolio, regeneratePortfolio, updateProfile } from "../actions";
import { toast } from "sonner";
import { AnimatedTabs } from "@/components/ui/animated-tabs";

import { GeneralTab } from "./_components/general-tab";
import { BillingTab } from "./_components/billing-tab";
import { AppearanceTab } from "./_components/appearance-tab";
import { DangerZoneTab } from "./_components/danger-zone-tab";

interface SettingsClientProps {
  user: {
    email: string;
    name: string;
    image: string | null;
    plan: string;
    credits: number;
  };
  portfolio: {
    handle: string;
  };
}

export function SettingsClient({ user, portfolio }: SettingsClientProps) {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => { },
    () => true,
    () => false
  );
  const [isPending, startTransition] = useTransition();
  const [handle, setHandle] = useState(portfolio.handle);
  const [name, setName] = useState(user.name);
  const [image, setImage] = useState(user.image || "");
  const [handleError, setHandleError] = useState("");
  const [isDeletingPortfolio, setIsDeletingPortfolio] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isRegenerating, startRegeneratingTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastRegeneratedThemeRef = useRef<string | null>(null);

  useEffect(() => {
    if (!mounted || !theme) return;
    if (lastRegeneratedThemeRef.current === null) {
      lastRegeneratedThemeRef.current = theme;
      return;
    }
    if (theme === lastRegeneratedThemeRef.current) return;

    lastRegeneratedThemeRef.current = theme;
    startRegeneratingTransition(() => {
      regeneratePortfolio()
        .then(() => toast.success("Theme updated and portfolio content regenerated!"))
        .catch((error) => toast.error(error instanceof Error ? error.message : "Failed to regenerate content"));
    });
  }, [theme, mounted]);


  const validateHandleFormat = (value: string) => {
    if (value.length < 3) {
      setHandleError("Must be at least 3 characters");
      return false;
    }
    if (value.length > 30) {
      setHandleError("Must be 30 characters or fewer");
      return false;
    }
    if (!/^[a-z0-9-]+$/.test(value)) {
      setHandleError("Only lowercase letters, numbers, and hyphens");
      return false;
    }
    setHandleError("");
    return true;
  };

  const handleHandleChange = (value: string) => {
    const normalized = value.toLowerCase().trim();
    setHandle(normalized);
    if (normalized) validateHandleFormat(normalized);
    else setHandleError("");
  };


  const handleSaveProfile = () => {
    if (!validateHandleFormat(handle)) return;

    startTransition(async () => {
      try {
        const promises: Promise<unknown>[] = [];

        if (handle !== portfolio.handle) {
          promises.push(updateHandle(handle));
        }

        if (name !== user.name || image !== (user.image || "")) {
          promises.push(updateProfile({ name, image }));
        }

        await Promise.all(promises);
        toast.success("Profile updated successfully");
      } catch (error) {
        const msg = error instanceof Error ? error.message : "Failed to save";
        toast.error(msg);
        setHandleError(msg);
      }
    });
  };

  const handleDeletePortfolio = () => {
    if (!confirm("Are you sure you want to delete this portfolio? This action cannot be undone and will delete all associated agents and leads.")) {
      return;
    }

    setIsDeletingPortfolio(true);
    startTransition(async () => {
      try {
        await deleteActivePortfolio();
        toast.success("Portfolio deleted successfully");
        window.location.href = "/dashboard";
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to delete portfolio");
        setIsDeletingPortfolio(false);
      }
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Instant local preview
    const localUrl = URL.createObjectURL(file);
    setImage(localUrl);

    try {
      const uploadUrlResponse = await fetch(
        `/api/upload/avatar?fileName=${encodeURIComponent(file.name)}&mimeType=${encodeURIComponent(file.type)}`,
        { method: "POST" }
      );

      if (!uploadUrlResponse.ok) throw new Error("Failed to get upload URL");

      const { uploadUrl, publicUrl } = await uploadUrlResponse.json();

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", uploadUrl);
        xhr.setRequestHeader("Content-Type", file.type);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            setUploadProgress(Math.round((event.loaded / event.total) * 100));
          }
        };

        xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject());
        xhr.onerror = () => reject();
        xhr.send(file);
      });

      setImage(publicUrl);
      toast.success("Avatar uploaded! Remember to save changes.");
    } catch {
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const hasHandleChanged = handle !== portfolio.handle;
  const hasProfileChanged = name !== user.name || image !== (user.image || "");
  const canSave = (hasHandleChanged || hasProfileChanged) && !handleError;

  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [loadingPortal, setLoadingPortal] = useState(false);

  const handleManageSubscription = async () => {
    setLoadingPortal(true);
    try {
      const response = await fetch("/api/billing/portal", {
        method: "POST",
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Failed to open billing portal");
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoadingPortal(false);
    }
  };

  const handleUpgrade = async (planId: string) => {
    if (planId === "free") return;

    setLoadingPlan(planId);
    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Failed to start checkout");
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoadingPlan(null);
    }
  };

  const SETTINGS_TABS = [
    { label: "General", value: "general" },
    { label: "Billing", value: "billing" },
    { label: "Appearance", value: "appearance" },
    { label: "Danger Zone", value: "danger-zone" },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto font-sans">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-3xl tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground font-medium">
          Manage your account settings, billing, and dashboard preferences.
        </p>
      </div>

      <AnimatedTabs
        tabs={SETTINGS_TABS}
        renderContent={(tab) => {
          if (tab.value === "general") {
            return (
              <GeneralTab
                user={user}
                portfolio={portfolio}
                name={name}
                setName={setName}
                handle={handle}
                handleHandleChange={handleHandleChange}
                image={image}
                setImage={setImage}
                handleError={handleError}
                isPending={isPending}
                isUploading={isUploading}
                uploadProgress={uploadProgress}
                fileInputRef={fileInputRef}
                handleFileSelect={handleFileSelect}
                handleSaveProfile={handleSaveProfile}
                canSave={canSave}
              />
            );
          }

          if (tab.value === "billing") {
            return (
              <BillingTab
                user={user}
                loadingPlan={loadingPlan}
                loadingPortal={loadingPortal}
                handleUpgrade={handleUpgrade}
                handleManageSubscription={handleManageSubscription}
              />
            );
          }

          if (tab.value === "appearance") {
            return (
              <AppearanceTab
                theme={theme}
                setTheme={setTheme}
                isRegenerating={isRegenerating}
                mounted={mounted}
              />
            );
          }

          if (tab.value === "danger-zone") {
            return (
              <DangerZoneTab
                onDeletePortfolio={handleDeletePortfolio}
                isDeletingPortfolio={isDeletingPortfolio}
                isPending={isPending}
              />
            );
          }
          return null;
        }}
      />
    </div>
  );
}
