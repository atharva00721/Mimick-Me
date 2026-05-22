"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ApiError } from "@/lib/http/fetch-json";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  File,
  Loader2,
  AlertCircle,
  Search,
  Type,
  Trash2,
  Edit2,
  Database,
  ExternalLink,
  Layout,
  Save,
} from "lucide-react";
import { AddKnowledgeModal } from "./_components/add-knowledge-modal";
import { useKnowledgeMutations } from "./_hooks/use-knowledge-mutations";
import { useKnowledgeQuery } from "./_hooks/use-knowledge-query";
import { KnowledgeSource } from "./types";

function formatFileSize(bytes: number | null) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function KnowledgeClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [editing, setEditing] = useState<KnowledgeSource | null>(null);

  const { data, isLoading, isError, error } = useKnowledgeQuery();
  const { addMutation, deleteMutation, editMutation, scrapeMutation } = useKnowledgeMutations();

  const sources = useMemo(() => data?.sources ?? [], [data]);
  const filteredSources = useMemo(() => {
    if (!searchQuery.trim()) return sources;
    const query = searchQuery.toLowerCase();
    return sources.filter(
      (source) => source.title.toLowerCase().includes(query) || (source.content && source.content.toLowerCase().includes(query)),
    );
  }, [sources, searchQuery]);

  const stats = useMemo(() => {
    return {
      total: sources.length,
      pdf: sources.filter((source) => source.type === "pdf").length,
      text: sources.filter((source) => source.type === "text").length,
      processing: sources.filter((source) => source.status === "processing" || source.status === "pending").length,
    };
  }, [sources]);

  const handleAddText = async ({ title, content }: { title: string; content: string }) => {
    await addMutation.mutateAsync({ title, content, type: "text" });
  };

  const handleAddFile = async ({
    title,
    file,
  }: {
    title: string;
    file: { fileUrl: string; mimeType: string; fileSize: number };
  }) => {
    await addMutation.mutateAsync({
      title,
      fileUrl: file.fileUrl,
      mimeType: file.mimeType,
      fileSize: file.fileSize,
      type: "pdf",
    });
  };

  const handleAddWebsite = async ({ title, url }: { title: string; url: string }) => {
    const scraped = await scrapeMutation.mutateAsync({ url });
    if (!scraped.success) {
      throw new Error(scraped.error || "Scrape failed");
    }

    const finalTitle = title || `Website: ${url.replace(/^https?:\/\//, "")}`;
    await addMutation.mutateAsync({
      title: finalTitle,
      content: scraped.text,
      type: "text",
    });
  };

  const apiStatus = error instanceof ApiError ? error.status : null;
  const apiMessage = error instanceof Error ? error.message : null;

  const getStatusBadge = (sourceStatus: string) => {
    switch (sourceStatus) {
      case "processing":
        return (
          <Badge
            variant="secondary"
            className="flex items-center gap-1.5 px-2 py-0 h-5 bg-blue-500/10 text-blue-500 border-none font-medium text-[10px] uppercase tracking-wider"
          >
            <Loader2 className="h-2.5 w-2.5 animate-spin" />
            Processing
          </Badge>
        );
      case "failed":
        return (
          <Badge
            variant="secondary"
            className="flex items-center gap-1.5 px-2 py-0 h-5 bg-red-500/10 text-red-500 border-none font-medium text-[10px] uppercase tracking-wider"
          >
            <AlertCircle className="h-2.5 w-2.5" />
            Failed
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="secondary"
            className="px-2 py-0 h-5 bg-yellow-500/10 text-yellow-500 border-none font-medium text-[10px] uppercase tracking-wider"
          >
            Pending
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 pb-10">
      {isError && (
        <Card className="border-red-500/20 bg-red-500/5">
          <CardHeader>
            <CardTitle className="text-red-500 flex items-center gap-2 font-normal">
              <AlertCircle className="h-5 w-5" />
              {apiStatus === 401 ? "Sign in required" : "Unable to load knowledge base"}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground font-normal">
              {apiStatus === 401 ? "Your session expired. Please sign in again." : apiMessage ?? "Request failed."}
            </p>
            {apiStatus === 401 ? (
              <Button asChild variant="outline" className="w-fit rounded-full font-normal">
                <Link href="/auth/signin">Sign in</Link>
              </Button>
            ) : null}
          </CardContent>
        </Card>
      )}

      <Card className="border-primary/5 bg-background/50 backdrop-blur-md">
        <CardHeader className="space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl tracking-tight font-normal">Knowledge Command Center</h1>
              <p className="text-sm text-muted-foreground max-w-2xl font-normal">
                Feed your AI agent with documentation, websites, and data to make it smarter and more helpful.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="h-7 px-3 rounded-full border-primary/20 bg-primary/5 font-normal">
                {stats.processing > 0 ? (
                  <span className="flex items-center gap-1.5 font-normal">
                    <Loader2 className="h-3 w-3 animate-spin text-primary" />
                    {stats.processing} processing
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 font-normal">
                    <Database className="h-3 w-3 text-primary" />
                    System Active
                  </span>
                )}
              </Badge>
              <AddKnowledgeModal
                onAddText={handleAddText}
                onAddFile={handleAddFile}
                onAddWebsite={handleAddWebsite}
                isPending={addMutation.isPending}
                isScraping={scrapeMutation.isPending}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-4">
            <div className="rounded-xl border border-primary/5 bg-background/70 p-4 shadow-sm">
              <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Total Sources</p>
              <p className="mt-1 text-2xl font-normal tracking-tight">{stats.total}</p>
            </div>
            <div className="rounded-xl border border-primary/5 bg-background/70 p-4 shadow-sm">
              <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">PDF Documents</p>
              <p className="mt-1 text-2xl font-normal tracking-tight">{stats.pdf}</p>
            </div>
            <div className="rounded-xl border border-primary/5 bg-background/70 p-4 shadow-sm">
              <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Text Snippets</p>
              <p className="mt-1 text-2xl font-normal tracking-tight">{stats.text}</p>
            </div>
            <div className="rounded-xl border border-primary/5 bg-background/70 p-4 shadow-sm">
              <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Status</p>
              <div className="mt-1 flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                <p className="text-sm font-normal">Ready to serve</p>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <Layout className="h-4 w-4" />
            </div>
            <h2 className="text-xl font-normal tracking-tight">Managed Information</h2>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search sources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background/50 border-primary/10 rounded-full h-9 text-xs focus-visible:ring-primary/20 font-normal"
            />
          </div>
        </div>

        <Card className="border-primary/5 shadow-2xl shadow-primary/5 bg-background/40 backdrop-blur-sm border-2 overflow-hidden">
          <CardContent className="p-0">
            <ScrollArea className="h-[700px]">
              {isLoading ? (
                <div className="p-6 space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-primary/5 bg-background/50">
                      <Skeleton className="h-10 w-10 rounded-xl" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                  ))}
                </div>
              ) : filteredSources.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                  <div className="size-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                    <Search className="h-8 w-8 text-muted-foreground/30" />
                  </div>
                  <h3 className="text-lg font-normal tracking-tight">No results found</h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-[250px] font-normal">
                    {searchQuery ? `No sources matching "${searchQuery}"` : "Your knowledge base is currently empty. Add your first source with Add Knowledge."}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-primary/5">
                  {filteredSources.map((source) => (
                    <div key={source.id} className="group p-5 flex items-start justify-between gap-4 hover:bg-primary/[0.02] transition-colors">
                      <div className="flex items-start gap-4">
                        <div
                          className={`mt-0.5 p-2.5 rounded-xl border ${
                            source.type === "pdf" ? "bg-red-500/5 border-red-500/10 text-red-500" : "bg-primary/5 border-primary/10 text-primary"
                          }`}
                        >
                          {source.type === "pdf" ? <FileText className="h-5 w-5" /> : <Type className="h-5 w-5" />}
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-sm font-normal tracking-tight leading-none group-hover:text-primary transition-colors">{source.title}</h3>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-muted-foreground font-normal">
                            <span className="flex items-center gap-1 capitalize font-normal">{source.type} Source</span>
                            {source.fileSize && (
                              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-muted/50 font-normal">{formatFileSize(source.fileSize)}</span>
                            )}
                            <span className="flex items-center gap-1 font-normal">
                              <Database className="h-3 w-3" />
                              {source.chunkCount} active chunks
                            </span>
                            {source.status !== "complete" && getStatusBadge(source.status)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {source.type === "text" && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setEditing(source)}
                                className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-xl rounded-2xl border-primary/10 bg-background/95 backdrop-blur-xl">
                              <DialogHeader>
                                <DialogTitle className="font-normal tracking-tight">Edit Material</DialogTitle>
                                <CardDescription className="font-normal">Update the title or content of this knowledge source.</CardDescription>
                              </DialogHeader>
                              <div className="space-y-5 py-4">
                                <div className="space-y-2">
                                  <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground ml-1">Source Title</p>
                                  <Input
                                    value={editing?.id === source.id ? editing.title : source.title}
                                    onChange={(event) => setEditing((prev) => (prev ? { ...prev, title: event.target.value } : prev))}
                                    className="rounded-xl border-primary/10 bg-muted/30 font-normal"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground ml-1">Content Body</p>
                                  <Textarea
                                    className="h-[400px] rounded-xl border-primary/10 bg-muted/30 text-sm leading-relaxed font-normal resize-none"
                                    value={editing?.id === source.id ? editing.content : source.content}
                                    onChange={(event) => setEditing((prev) => (prev ? { ...prev, content: event.target.value } : prev))}
                                  />
                                </div>
                              </div>
                              <div className="flex justify-end gap-3 pt-2">
                                <Button
                                  variant="outline"
                                  onClick={() => setEditing(null)}
                                  className="rounded-full px-6 h-10 text-xs border-primary/10 font-normal"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={() => editing && editMutation.mutate({ id: editing.id, title: editing.title, content: editing.content })}
                                  disabled={editMutation.isPending}
                                  className="rounded-full px-8 h-10 text-xs shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 font-normal"
                                >
                                  {editMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" /> : <Save className="h-3.5 w-3.5 mr-2" />}
                                  Apply Changes
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={deleteMutation.isPending}
                          onClick={() => {
                            if (confirm("Are you sure you want to remove this source?")) {
                              deleteMutation.mutate(source.id);
                            }
                          }}
                          className="h-8 w-8 rounded-full text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
            <div className="p-4 bg-muted/5 border-t text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-normal flex items-center justify-center gap-2">
                <ExternalLink className="size-3" />
                Processed by Vector Intelligence Engine
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
