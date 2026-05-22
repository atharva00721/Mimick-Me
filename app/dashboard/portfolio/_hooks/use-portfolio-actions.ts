"use client";

import { useCallback, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  regeneratePortfolio,
  togglePublish,
  updateTemplate,
  updatePortfolioContent,
  type PortfolioContent,
} from "../../actions";

export function usePortfolioActions(
  hasContent: boolean,
  initialPublished: boolean,
  /** Optional guard: return an error string to block publishing, or null to allow */
  publishGuard?: () => string | null
) {
  const [isPublished, setIsPublished] = useState(initialPublished);

  const publishMutation = useMutation({
    mutationFn: async (checked: boolean) => togglePublish(checked),
    onSuccess: (_, checked) => {
      toast.success(checked ? "Portfolio is now live!" : "Portfolio hidden from public.");
    },
    onError: (error, checked) => {
      setIsPublished(!checked);
      toast.error(error instanceof Error ? error.message : "Failed to update");
    },
  });

  const templateMutation = useMutation({
    mutationFn: async (value: string) => updateTemplate(value),
    onSuccess: () => toast.success("Template updated"),
    onError: (error) => toast.error(error instanceof Error ? error.message : "Failed to update"),
  });

  const regenerateMutation = useMutation({
    mutationFn: async () => regeneratePortfolio(),
    onSuccess: () => {
      toast.success("Portfolio content regenerated with AI!", {
        description: "Refresh to see the updated content preview.",
      });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Failed to regenerate"),
  });

  const handlePublishChange = useCallback((checked: boolean) => {
    if (checked && !hasContent) {
      toast.error("Generate your portfolio content first before publishing.");
      return;
    }

    // Run optional guard (e.g. template requires images)
    if (checked && publishGuard) {
      const blockReason = publishGuard();
      if (blockReason) {
        toast.error(blockReason, {
          description: "Please complete the required steps before going live.",
          duration: 5000,
        });
        return;
      }
    }

    setIsPublished(checked);
    publishMutation.mutate(checked);
  }, [hasContent, publishGuard, publishMutation]);

  const handleTemplateChange = useCallback((value: string) => {
    templateMutation.mutate(value);
  }, [templateMutation]);

  const handleRegenerate = useCallback(async () => {
    await regenerateMutation.mutateAsync();
  }, [regenerateMutation]);

  return {
    isPending: publishMutation.isPending || templateMutation.isPending,
    isPublished,
    isRegenerating: regenerateMutation.isPending,
    handlePublishChange,
    handleTemplateChange,
    handleRegenerate,
  };
}

export function usePortfolioContent(initialContent: PortfolioContent | null) {
  const [content, setContent] = useState(initialContent);

  const saveMutation = useMutation({
    mutationFn: async (newContent: PortfolioContent) => updatePortfolioContent(newContent),
    onSuccess: (_, newContent) => {
      setContent(newContent);
      toast.success("Content saved successfully!");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to save content");
    },
  });

  const updateContent = useCallback((newContent: PortfolioContent) => {
    setContent(newContent);
  }, []);

  const saveContent = useCallback(async (newContent: PortfolioContent) => {
    await saveMutation.mutateAsync(newContent);
  }, [saveMutation]);

  return { content, updateContent, saveContent, isPending: saveMutation.isPending };
}
