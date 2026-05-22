import { useCallback, useState } from "react";

interface UseSectionRegenerationParams {
  onSectionRegenerated: (data: Record<string, unknown>) => void;
  onAfterRegeneration?: () => void;
}

export function useSectionRegeneration({
  onSectionRegenerated,
  onAfterRegeneration,
}: UseSectionRegenerationParams) {
  const [isSectionRegenerating, setIsSectionRegenerating] = useState(false);
  const [promptingSection, setPromptingSection] = useState<string | null>(null);
  const [regenerationError, setRegenerationError] = useState<string | null>(null);

  const regenerateSection = useCallback(async (section: string, direction: string) => {
    if (!section) return;

    setIsSectionRegenerating(true);
    setRegenerationError(null);

    try {
      const res = await fetch("/api/generate-portfolio/section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, direction: direction.trim() }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error ?? "Failed to regenerate");
      onSectionRegenerated(json.data);
      setPromptingSection(null);
      onAfterRegeneration?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to regenerate";
      setRegenerationError(message);
      console.error("[section-regenerate]", err);
    } finally {
      setIsSectionRegenerating(false);
    }
  }, [onAfterRegeneration, onSectionRegenerated]);

  return {
    isSectionRegenerating,
    promptingSection,
    setPromptingSection,
    regenerationError,
    regenerateSection,
  };
}
