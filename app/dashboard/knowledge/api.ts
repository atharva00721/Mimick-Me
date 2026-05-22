import { fetchJson } from "@/lib/http/fetch-json";
import {
  CreateKnowledgeInput,
  KnowledgeListResponse,
  ScrapeWebsiteInput,
  ScrapeWebsiteResponse,
  UpdateKnowledgeInput,
} from "./types";

export function fetchKnowledge(): Promise<KnowledgeListResponse> {
  return fetchJson("/api/knowledge");
}

export async function createKnowledge(body: CreateKnowledgeInput): Promise<void> {
  await fetchJson("/api/knowledge", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function deleteKnowledge(id: string): Promise<void> {
  await fetchJson(`/api/knowledge/${id}`, { method: "DELETE" });
}

export async function updateKnowledge({ id, title, content }: UpdateKnowledgeInput): Promise<void> {
  await fetchJson(`/api/knowledge/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content }),
  });
}

export async function scrapeWebsite(body: ScrapeWebsiteInput): Promise<ScrapeWebsiteResponse> {
  return fetchJson("/api/scrape", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
