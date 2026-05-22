export interface KnowledgeSource {
  id: string;
  title: string;
  content: string;
  type: string;
  fileUrl: string | null;
  fileSize: number | null;
  mimeType: string | null;
  status: string;
  chunkCount: number;
}

export interface KnowledgeListResponse {
  sources: KnowledgeSource[];
}

export interface CreateKnowledgeInput {
  title: string;
  content?: string;
  fileUrl?: string;
  mimeType?: string;
  fileSize?: number;
  type?: string;
}

export interface UpdateKnowledgeInput {
  id: string;
  title: string;
  content: string;
}

export interface ScrapeWebsiteInput {
  url: string;
}

export interface ScrapeWebsiteResponse {
  success: boolean;
  text: string;
  error?: string;
}

export interface UploadedKnowledgeFile {
  fileUrl: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
}
