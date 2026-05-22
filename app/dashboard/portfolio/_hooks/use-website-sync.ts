import { useCallback, useState } from "react";
import type { PortfolioContent } from "../../actions";

interface UseWebsiteSyncParams {
  editedContent: PortfolioContent | null;
  setEditedContent: (content: PortfolioContent | null) => void;
}

export function useWebsiteSync({ editedContent, setEditedContent }: UseWebsiteSyncParams) {
  const [syncUrl, setSyncUrl] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSyncDialog, setShowSyncDialog] = useState(false);

  const closeSyncDialog = useCallback(() => {
    setShowSyncDialog(false);
    setSyncUrl("");
  }, []);

  const syncFromWebsite = useCallback(async () => {
    if (!syncUrl.trim()) return;

    setIsSyncing(true);
    try {
      const scrapeResp = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: syncUrl }),
      });
      const scrapeData = await scrapeResp.json();
      if (!scrapeData.success) throw new Error(scrapeData.error || "Scrape failed");

      const extractResp = await fetch("/api/ai/extract-portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: scrapeData.text }),
      });
      const extractData = await extractResp.json();
      if (!extractData.success) throw new Error(extractData.error || "Extraction failed");

      if (editedContent) {
        setEditedContent({
          ...editedContent,
          ...extractData.data,
          hero: { ...editedContent.hero, ...extractData.data.hero },
          about: { ...editedContent.about, ...extractData.data.about },
        });
        closeSyncDialog();
      }
    } catch (err) {
      console.error("Sync error:", err);
    } finally {
      setIsSyncing(false);
    }
  }, [closeSyncDialog, editedContent, setEditedContent, syncUrl]);

  return {
    syncUrl,
    setSyncUrl,
    isSyncing,
    showSyncDialog,
    setShowSyncDialog,
    closeSyncDialog,
    syncFromWebsite,
  };
}
