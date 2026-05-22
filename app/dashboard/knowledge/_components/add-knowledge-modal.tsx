"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload, UploadedFilePreview } from "@/components/knowledge/file-upload";
import { FileText, Globe, Info, Loader2, Plus, Type } from "lucide-react";
import { UploadedKnowledgeFile } from "../types";

const MAX_CONTENT_CHARS = 20_000;

interface AddKnowledgeModalProps {
  onAddText: (input: { title: string; content: string }) => Promise<void>;
  onAddFile: (input: { title: string; file: UploadedKnowledgeFile }) => Promise<void>;
  onAddWebsite: (input: { title: string; url: string }) => Promise<void>;
  isPending: boolean;
  isScraping: boolean;
}

export function AddKnowledgeModal({
  onAddText,
  onAddFile,
  onAddWebsite,
  isPending,
  isScraping,
}: AddKnowledgeModalProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [uploadedFile, setUploadedFile] = useState<UploadedKnowledgeFile | null>(null);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setWebsiteUrl("");
    setUploadedFile(null);
  };

  const handleAddText = async () => {
    if (!title.trim() || !content.trim()) return;
    await onAddText({ title: title.trim(), content: content.trim() });
    resetForm();
    setOpen(false);
  };

  const handleAddFile = async () => {
    if (!uploadedFile) return;
    const fileTitle = uploadedFile.fileName.replace(/\.pdf$/i, "");
    const finalTitle = title.trim() || fileTitle;
    await onAddFile({ title: finalTitle, file: uploadedFile });
    resetForm();
    setOpen(false);
  };

  const handleScrapeWebsite = async () => {
    if (!websiteUrl.trim()) return;
    await onAddWebsite({ title: title.trim(), url: websiteUrl.trim() });
    resetForm();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full px-6 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 h-9 text-xs font-normal">
          <Plus className="h-3.5 w-3.5 mr-2" />
          Add Knowledge
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl rounded-2xl border-primary/10 bg-background/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="font-normal tracking-tight">Add Knowledge</DialogTitle>
          <CardDescription className="text-xs font-normal">Expand your agent&apos;s brain with new information.</CardDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground ml-1">Title</p>
            <Input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g., Company Policy, FAQ, Service Details"
              className="bg-background/50 border-primary/10 focus-visible:ring-primary/20 rounded-xl font-normal"
            />
          </div>

          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-muted/40 p-1 rounded-xl mb-4 h-11">
              <TabsTrigger value="text" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm font-normal text-xs gap-2">
                <Type className="h-3.5 w-3.5" />
                Text
              </TabsTrigger>
              <TabsTrigger value="file" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm font-normal text-xs gap-2">
                <FileText className="h-3.5 w-3.5" />
                PDF
              </TabsTrigger>
              <TabsTrigger value="website" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm font-normal text-xs gap-2">
                <Globe className="h-3.5 w-3.5" />
                Web
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <Textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="Paste or type content here..."
                className="h-[260px] bg-background/50 border-primary/10 rounded-xl text-sm font-normal leading-relaxed resize-none"
                maxLength={MAX_CONTENT_CHARS}
              />
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2 flex-1 max-w-[150px]">
                  <Progress value={(content.length / MAX_CONTENT_CHARS) * 100} className="h-1 bg-muted" />
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap font-normal">
                    {content.length.toLocaleString()}/{MAX_CONTENT_CHARS.toLocaleString()}
                  </span>
                </div>
                <Button
                  onClick={handleAddText}
                  disabled={isPending || !title.trim() || !content.trim()}
                  className="rounded-full px-6 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 h-9 text-xs font-normal"
                >
                  {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" /> : <Plus className="h-3.5 w-3.5 mr-2" />}
                  Save Material
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="file" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <FileUpload onUploadComplete={(result) => setUploadedFile(result)} disabled={isPending} />
              {uploadedFile && (
                <div className="space-y-3 p-1">
                  <UploadedFilePreview
                    fileName={uploadedFile.fileName}
                    fileSize={uploadedFile.fileSize}
                    status="ready"
                    onRemove={() => setUploadedFile(null)}
                  />
                  <Button
                    onClick={handleAddFile}
                    disabled={isPending}
                    className="w-full rounded-full shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 h-10 text-xs font-normal"
                  >
                    {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" /> : <FileText className="h-3.5 w-3.5 mr-2" />}
                    Process PDF
                  </Button>
                  <p className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground mt-2 font-normal">
                    <Info className="h-3 w-3" />
                    AI will analyze and chunk the document for better retrieval.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="website" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="space-y-2">
                <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground ml-1 text-center">Enter Website URL</p>
                <Input
                  value={websiteUrl}
                  onChange={(event) => setWebsiteUrl(event.target.value)}
                  placeholder="https://example.com/about"
                  className="bg-background/50 border-primary/10 rounded-xl font-normal"
                />
              </div>
              <Button
                onClick={handleScrapeWebsite}
                disabled={isScraping || isPending || !websiteUrl.trim()}
                className="w-full rounded-full shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 h-10 text-xs font-normal"
              >
                {isScraping || isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Scraping Content...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Globe className="h-3.5 w-3.5" />
                    Import from Web
                  </span>
                )}
              </Button>
              <p className="text-[10px] text-muted-foreground text-center px-4 leading-relaxed font-normal">
                We&apos;ll extract the main text content and add it to your knowledge base.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
