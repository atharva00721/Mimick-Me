"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Save, X, RefreshCw, Eye, ArrowLeft, Send, ImageIcon } from "lucide-react";
import { SectionRegenerateButton } from "@/components/portfolio/section-regenerate-button";
import { PromptInput, PromptInputSubmit, PromptInputTextarea, PromptInputBody, PromptInputFooter } from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import Link from "next/link";
import { usePortfolioActions } from "./_hooks/use-portfolio-actions";
import { usePortfolioEditorStore } from "./_hooks/use-portfolio-editor-store";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { PortfolioContent } from "../actions";
import type { SocialLink, SocialPlatform } from "@/lib/validation/portfolio-schema";
import { PORTFOLIO_EDITOR_TABS } from "./_constants/portfolio-editor";
import { usePortfolioContentEditors } from "./_hooks/use-portfolio-content-editors";
import { useSavePortfolioContent } from "./_hooks/use-save-portfolio-content";
import { useWebsiteSync } from "./_hooks/use-website-sync";
import { useSectionRegeneration } from "./_hooks/use-section-regeneration";
import { useUndoWindow } from "./_hooks/use-undo-window";
import { PortfolioTabSections } from "./_components/portfolio-tab-sections";
import {
  isSectionVisible,
  mergeVisibleSections,
  PORTFOLIO_SECTION_REGISTRY,
  type PortfolioSectionKey,
} from "@/lib/portfolio/section-registry";

interface PortfolioClientProps {
  portfolio: {
    handle: string;
    subdomain?: string | null;
    isPublished: boolean;
    template: string;
    updatedAt: string;
  };
  plan?: string;
  content: PortfolioContent | null;
}


export function PortfolioClient({ portfolio, plan = "free", content }: PortfolioClientProps) {
  // ── Publish guard: templates that require images ────────────────────────────
  // We read from editedContent (live state) so the guard reacts to unsaved uploads too.
  // Note: editedContent is declared below — we use a ref-pattern via a callback so
  // it always captures the latest value at call time.
  const editedContentRef = useRef<PortfolioContent | null>(null);

  const publishGuard = useCallback((): string | null => {
    const current = editedContentRef.current;
    if (portfolio.template === "personal" && !current?.about?.avatarUrl) {
      return "The Personal template requires a profile photo. Go to the About tab and upload one first.";
    }
    return null;
  }, [portfolio.template]);

  const {
    isPending,
    isPublished,
    isRegenerating,
    handlePublishChange,
    handleTemplateChange,
    handleRegenerate,
  } = usePortfolioActions(Boolean(content), portfolio.isPublished, publishGuard);

  const { editedContent, setEditedContent, resetFromServer } = usePortfolioEditorStore();
  const [activeTab, setActiveTab] = useState<string>("hero");
  const [undoSnapshot, setUndoSnapshot] = useState<unknown>(null);

  // Keep editedContentRef in sync so publishGuard always reads latest state
  useEffect(() => {
    editedContentRef.current = editedContent;
  }, [editedContent]);

  const saveMutation = useSavePortfolioContent();
  const {
    syncUrl,
    setSyncUrl,
    isSyncing,
    showSyncDialog,
    setShowSyncDialog,
    closeSyncDialog,
    syncFromWebsite,
  } = useWebsiteSync({
    editedContent,
    setEditedContent,
  });
  const { showUndo, undoTimeLeft, startUndoCountdown, dismissUndo } = useUndoWindow();

  const handleSectionRegenerated = useCallback(
    (data: Record<string, unknown>) => {
      if (!editedContent) return;
      setEditedContent({ ...editedContent, ...data } as PortfolioContent);
    },
    [editedContent, setEditedContent]
  );

  const {
    isSectionRegenerating,
    promptingSection,
    setPromptingSection,
    regenerateSection,
  } = useSectionRegeneration({
    onSectionRegenerated: handleSectionRegenerated,
    onAfterRegeneration: startUndoCountdown,
  });

  useEffect(() => {
    resetFromServer(content);
  }, [content, resetFromServer]);

  const handleSave = async () => {
    if (!editedContent) return;
    try {
      await saveMutation.mutateAsync(editedContent);
    } catch (error) {
      console.error("Failed to save:", error);
    }
  };

  const handleCancel = () => {
    setEditedContent(content ? { ...content, visibleSections: mergeVisibleSections(content.visibleSections) } : content);
  };

  const handleSectionRegeneration = async (direction: string) => {
    if (!activeTab || !editedContent) return;
    setUndoSnapshot((editedContent as Record<string, unknown>)[activeTab]);
    await regenerateSection(activeTab, direction);
  };

  const handleUndo = useCallback(() => {
    if (undoSnapshot !== null && activeTab) {
      handleSectionRegenerated({ [activeTab]: undoSnapshot });
    }
    dismissUndo();
    setUndoSnapshot(null);
  }, [undoSnapshot, activeTab, handleSectionRegenerated, dismissUndo]);

  const editors = usePortfolioContentEditors({ editedContent, setEditedContent });
  const { updateVisibleSection } = editors;

  const displayContent = editedContent || content;

  const getSocialLink = (platform: SocialPlatform): SocialLink | undefined => {
    return displayContent?.socialLinks?.find((link) => link.platform === platform);
  };

  const appOrigin = useMemo(() => {
    const configuredOrigin = process.env.NEXT_PUBLIC_APP_URL?.trim();
    if (configuredOrigin) return configuredOrigin.replace(/\/$/, "");
    if (typeof window !== "undefined") return window.location.origin;
    return "";
  }, []);

  const hasProPlan = plan === "pro" || plan === "business" || plan === "agency";

  const portfolioLink = useMemo(() => {
    if (hasProPlan && portfolio.subdomain && appOrigin) {
      try {
        const originUrl = new URL(appOrigin);
        const host = originUrl.host.replace(/^www\./, "");
        return `${originUrl.protocol}//${portfolio.subdomain}.${host}`;
      } catch {
        return `/${portfolio.handle}`;
      }
    }
    return `/${portfolio.handle}`;
  }, [hasProPlan, portfolio.subdomain, portfolio.handle, appOrigin]);

  const displayUrl = useMemo(() => {
    if (hasProPlan && portfolio.subdomain && appOrigin) {
      try {
        const originUrl = new URL(appOrigin);
        const host = originUrl.host.replace(/^www\./, "");
        return `${portfolio.subdomain}.${host}`;
      } catch {
        return `/${portfolio.handle}`;
      }
    }
    return `/${portfolio.handle}`;
  }, [hasProPlan, portfolio.subdomain, portfolio.handle, appOrigin]);

  const hasChanges = JSON.stringify(content) !== JSON.stringify(editedContent) && !!editedContent;
  const visibleSections = mergeVisibleSections(displayContent?.visibleSections);
  const visibleSectionCount = PORTFOLIO_SECTION_REGISTRY.filter((section) =>
    isSectionVisible(visibleSections, section.key)
  ).length;

  const isContentSectionVisible = (section: PortfolioSectionKey) =>
    isSectionVisible(visibleSections, section);

  // For the Personal template: detect when a photo has not been uploaded yet
  const needsAvatarWarning =
    portfolio.template === "personal" && !displayContent?.about?.avatarUrl;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 pb-8">
      <Card className="border-1">
        <CardHeader className="space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="mt-2 text-3xl tracking-tight">Portfolio Command Center</h1>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Redesign, edit, and publish your public portfolio from one place.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isPublished ? (
                <Badge className="bg-green-500 hover:bg-green-600">Live</Badge>
              ) : (
                <Badge variant="secondary">Draft</Badge>
              )}
              <Badge variant="outline">{visibleSectionCount} sections active</Badge>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border bg-background/70 p-4">
              <p className="text-xs text-muted-foreground">Public URL</p>
              <p className="mt-1 truncate font-medium">{displayUrl}</p>
            </div>
            <div className="rounded-xl border bg-background/70 p-4">
              <p className="text-xs text-muted-foreground">Template</p>
              <p className="mt-1 capitalize font-medium">{portfolio.template}</p>
            </div>
            <div className="rounded-xl border bg-background/70 p-4">
              <p className="text-xs text-muted-foreground">Last updated</p>
              <p className="mt-1 font-medium">{new Date(portfolio.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Personal template — photo missing banner */}
      {needsAvatarWarning && (
        <div className="flex items-start gap-4 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-4 text-amber-900 dark:text-amber-100 animate-in fade-in duration-300">
          <div className="mt-0.5 shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-amber-200 dark:bg-amber-800">
            <ImageIcon className="size-4 text-amber-700 dark:text-amber-200" />
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-semibold">Your Personal template looks better with a real photo</p>
            <p className="text-xs text-amber-700 dark:text-amber-300">
              Upload a profile picture in the &lsquo;About&rsquo; tab — it will replace the abstract placeholder in your hero and about sections.
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="shrink-0 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900"
            onClick={() => setActiveTab("about")}
          >
            Upload Photo
          </Button>
        </div>
      )}

      {/* Floating Action Bar */}
      {hasChanges && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 px-4 w-full max-w-2xl animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-background/80 backdrop-blur-xl border border-primary/20 rounded-full p-2 flex items-center justify-between gap-4 ring-1 ring-black/5">
            <div className="flex items-center gap-2 pl-4">
              <div className="size-2 bg-yellow-400 rounded-full animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider">Unsaved Changes</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Button variant="ghost" size="sm" onClick={handleCancel} disabled={saveMutation.isPending} className="rounded-full h-9">
                <X className="size-4 mr-2" />
                Discard
              </Button>
              <Button onClick={handleSave} disabled={saveMutation.isPending} className="rounded-full h-9 px-6 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                {saveMutation.isPending ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Save className="size-4 mr-2" />}
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 px-1">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 group">
            <Switch
              id="publish-toggle"
              checked={isPublished}
              onCheckedChange={handlePublishChange}
              disabled={isPending}
              className="data-[state=checked]:bg-green-500"
            />
            <Label htmlFor="publish-toggle" className="cursor-pointer text-sm font-semibold text-muted-foreground group-data-[state=checked]:text-foreground transition-colors">
              Publicly Live
            </Label>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {content && (
            <Dialog open={showSyncDialog} onOpenChange={setShowSyncDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-2">
                  <RefreshCw className="size-4" />
                  <span className="hidden sm:inline">Sync content</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Sync from Website</DialogTitle>
                  <DialogDescription>
                    Enter a URL to extract your details (Bio, Services, etc.) using AI.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="url">Website URL</Label>
                    <Input
                      id="url"
                      placeholder="https://your-old-site.com"
                      value={syncUrl}
                      onChange={(e) => setSyncUrl(e.target.value)}
                      className="h-10"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={closeSyncDialog}>Cancel</Button>
                  <Button onClick={syncFromWebsite} disabled={isSyncing || !syncUrl.trim()}>
                    {isSyncing ? <Loader2 className="size-4 mr-2 animate-spin" /> : null}
                    Start Sync
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          <Select defaultValue={portfolio.template} onValueChange={handleTemplateChange} disabled={isPending}>
            <SelectTrigger className="w-[140px] h-9 font-medium">
              <SelectValue placeholder="Template" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="landing">Landing</SelectItem>
              <SelectItem value="modern">Modern</SelectItem>
              <SelectItem value="veil">Veil</SelectItem>
              <SelectItem value="bold">Bold</SelectItem>
              <SelectItem value="editorial">Editorial</SelectItem>
              <SelectItem value="gallery">Gallery</SelectItem>
              <SelectItem value="interactive">Interactive</SelectItem>
              <SelectItem value="studio">Studio</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
            </SelectContent>
          </Select>

          {isPublished && (
            <Button variant="outline" size="sm" asChild className="h-9 gap-2">
              <Link href={portfolioLink} target="_blank">
                <Eye className="size-4" />
                <span className="hidden sm:inline">Preview Live</span>
              </Link>
            </Button>
          )}

          <Button size="icon" variant="ghost" onClick={handleRegenerate} disabled={isRegenerating} className="h-9 w-9 text-primary hover:text-primary hover:bg-primary/10">
            {isRegenerating ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
          </Button>
        </div>
      </div>

      {displayContent ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="flex flex-col lg:flex-row gap-8 items-start">
          <Card className="w-full lg:w-72 shrink-0 overflow-hidden border-primary/10 shadow-xl shadow-primary/5 bg-background/50 backdrop-blur-md sticky top-6">
            <div className="p-5 bg-primary/5 border-b">
              <h3 className="text-sm tracking-tight">Command Center</h3>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest mt-0.5">Navigation & Control</p>
            </div>
            <TabsList className="flex flex-col h-auto bg-transparent p-3 gap-1.5 w-full justify-start items-stretch">
              {PORTFOLIO_EDITOR_TABS.map((item) => (
                <div key={item.key} className="flex items-center group">
                  <TabsTrigger
                    value={item.key}
                    className="flex-1 justify-start gap-3 px-4 py-2.5 text-sm font-normal data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 transition-all duration-300 rounded-xl"
                  >
                    <span>{item.label}</span>
                  </TabsTrigger>
                </div>
              ))}
            </TabsList>
            <div className="p-5 bg-muted/30 border-t space-y-3">
              <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                <span>Health Score</span>
                <span className="text-primary">{Math.round((visibleSectionCount / 11) * 100)}%</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-primary transition-all duration-1000 ease-out rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                  style={{ width: `${(visibleSectionCount / 11) * 100}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Aim for 80%+ visibility for the best visitor engagement.
              </p>
            </div>
          </Card>

          <div className="flex-1 min-w-0 w-full animate-in fade-in slide-in-from-right-4 duration-500">
            <Card className="border-primary/10 shadow-2xl shadow-primary/5 min-h-[600px] flex flex-col bg-background/40 backdrop-blur-sm overflow-hidden border-2 border-primary/5">
              <CardHeader className="py-6 px-8 border-b bg-muted/5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl tracking-tight capitalize">{activeTab}</h2>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Per-section regenerate button — hidden for socials */}
                    {activeTab !== "socials" && editedContent && (
                      <SectionRegenerateButton
                        section={activeTab}
                        isPrompting={promptingSection === activeTab}
                        onTogglePrompt={(active) => setPromptingSection(active ? activeTab : null)}
                        isLoading={isSectionRegenerating}
                        showUndo={showUndo}
                        undoTimeLeft={undoTimeLeft}
                        onUndo={handleUndo}
                      />
                    )}
                    <div className="flex items-center gap-3 bg-muted/50 px-3 py-1.5 rounded-full border">
                      <Label htmlFor={`${activeTab}-visibility`} className="text-xs font-normal cursor-pointer">Visible</Label>
                      <Switch
                        id={`${activeTab}-visibility`}
                        checked={activeTab === 'socials' ? true : isContentSectionVisible(activeTab as PortfolioSectionKey)}
                        disabled={activeTab === 'socials'}
                        onCheckedChange={(checked) => updateVisibleSection(activeTab as PortfolioSectionKey, checked)}
                        className="scale-75 data-[state=checked]:bg-primary"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative p-8 flex-1 overflow-hidden min-h-[400px] flex flex-col">
                <AnimatePresence mode="wait">
                  {isSectionRegenerating ? (
                    <motion.div
                      initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                      animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
                      exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                      className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/40 dark:bg-black/40 p-8 text-center"
                    >
                      <div className="relative mb-6">
                        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/20 shadow-2xl shadow-primary/40 backdrop-blur-xl ring-1 ring-white/20">
                          <RefreshCw className="size-8 animate-spin text-primary" />
                        </div>
                      </div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-2"
                      >
                        <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">Regenerating {activeTab}...</h3>
                        <div className="flex justify-center">
                          <Shimmer className="text-sm text-zinc-500 dark:text-zinc-400">Our AI is drafting professional content based on your request.</Shimmer>
                        </div>
                      </motion.div>

                      <div className="mt-12 flex w-full max-w-xs gap-1.5 px-4">
                        {[0, 1, 2, 3].map((i) => (
                          <motion.div
                            key={i}
                            animate={{
                              opacity: [0.3, 1, 0.3],
                              scaleX: [1, 1.5, 1],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              delay: i * 0.2,
                            }}
                            className="h-1 flex-1 rounded-full bg-primary/40"
                          />
                        ))}
                      </div>
                    </motion.div>
                  ) : promptingSection === activeTab ? (
                    <motion.div
                      key="prompting"
                      initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                      className="h-full flex-1 flex flex-col items-center justify-center py-12"
                    >
                      <div className="max-w-xl w-full space-y-8">
                        <div className="space-y-3 text-center">
                          <div className="space-y-1">
                            <h2 className="text-2xl font-bold tracking-tight">Regenerate {activeTab}</h2>
                            <p className="text-muted-foreground">What would you like to change about this section?</p>
                          </div>
                        </div>

                        <PromptInput
                          onSubmit={(msg) => handleSectionRegeneration(msg.text)}
                          className="bg-muted/10 rounded-[28px] border border-primary/20 p-1.5 shadow-2xl ring-1 ring-white/5"
                        >
                          <PromptInputBody>
                            <PromptInputTextarea
                              placeholder={`What should we change about your ${activeTab} section?`}
                              className="min-h-[120px] px-6 pt-5 text-lg"
                              name="message"
                              autoFocus
                            />
                          </PromptInputBody>
                          <PromptInputFooter className="px-4 pb-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              type="button"
                              className="text-muted-foreground hover:text-foreground rounded-full h-10"
                              onClick={() => setPromptingSection(null)}
                            >
                              <ArrowLeft className="mr-2 size-4" />
                              Back
                            </Button>
                            <PromptInputSubmit
                              className="rounded-full bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20"
                            >
                              <Send className=" size-3" />
                            </PromptInputSubmit>
                          </PromptInputFooter>
                        </PromptInput>

                        <div className="flex flex-wrap justify-center gap-2 pt-4 opacity-60">
                          {["More professional", "More technical", "Witty & Fun", "Action oriented"].map((suggestion) => (
                            <button
                              key={suggestion}
                              className="text-[11px] font-medium border rounded-full px-3 py-1 hover:bg-muted transition-colors"
                              onClick={() => {
                                const area = document.querySelector('textarea[name="message"]') as HTMLTextAreaElement;
                                if (area) {
                                  area.value = suggestion;
                                  area.focus();
                                }
                              }}
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="editor"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-full flex-1"
                    >
                      <PortfolioTabSections
                        displayContent={displayContent}
                        editors={editors}
                        isContentSectionVisible={isContentSectionVisible}
                        getSocialLink={getSocialLink}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
              {/* <div className="p-4 bg-muted/5 border-t text-center">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold flex items-center justify-center gap-2">
                    <Layout className="size-3" />
                    Portfolio AI Command Center &copy; 2024
                  </p>
                </div> */}
            </Card>
          </div>
        </Tabs>
      ) : null}

      {/* No content yet */}
      {
        !content && (
          <Card className="border-dashed border-2 border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors">
            <CardContent className="py-20 text-center">
              <h3 className="text-2xl tracking-tight mb-2">No Content Yet</h3>
              <p className="text-muted-foreground max-w-sm mx-auto mb-8">
                Your portfolio is a blank canvas. Let our AI help you generate a professional presence in seconds.
              </p>
              <Button size="lg" onClick={handleRegenerate} disabled={isRegenerating} className="rounded-full px-8 shadow-xl shadow-primary/20">
                {isRegenerating ? <Loader2 className="size-5 mr-2 animate-spin" /> : <RefreshCw className="size-5 mr-2" />}
                Generate My Portfolio
              </Button>
            </CardContent>
          </Card>
        )
      }
    </div>
  );
}
