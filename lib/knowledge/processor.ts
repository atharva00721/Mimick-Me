import { db } from "@/lib/db";
import { knowledgeSources } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { extractTextFromPdf } from "@/lib/knowledge/extract-pdf";
import { generateEmbeddings } from "@/lib/ai/embeddings";
import { chunkText } from "@/lib/knowledge/chunk-text";
import { insertKnowledgeChunks, deleteKnowledgeChunksBySourceId } from "@/lib/db/knowledge";
import { getKeyFromUrl, getFileBuffer } from "@/lib/storage/blob";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";

const nebius = createOpenAI({
  apiKey: process.env.NEBIUS_API_KEY,
  baseURL: process.env.NEBIUS_BASE_URL ?? "https://api.studio.nebius.com/v1",
});

const MODEL = "Qwen/Qwen2.5-72B-Instruct";

export type ProcessingStatus = "pending" | "processing" | "complete" | "failed";

async function generateTitleFromContent(content: string, originalTitle: string): Promise<string> {
  const preview = content.slice(0, 4000);
  
  const result = await generateText({
    model: nebius.chat(MODEL),
    system: "You are a helpful assistant that generates concise titles for documents. Generate a short, descriptive title (max 100 characters) for the given document content. Return only the title, nothing else.",
    prompt: `Generate a title for this document. Original title hint: "${originalTitle}"\n\nDocument preview:\n${preview}`,
    maxOutputTokens: 100,
  });

  const title = result.text.trim().slice(0, 100);
  return title || originalTitle;
}

export async function updateKnowledgeSourceStatus(
  sourceId: string,
  status: ProcessingStatus,
  error?: string
): Promise<void> {
  await db
    .update(knowledgeSources)
    .set({
      status,
      ...(error && { content: error }),
    })
    .where(eq(knowledgeSources.id, sourceId));
}

export async function processKnowledgeSource(sourceId: string): Promise<{ success: boolean; error?: string }> {
  const [source] = await db
    .select({
      id: knowledgeSources.id,
      agentId: knowledgeSources.agentId,
      title: knowledgeSources.title,
      fileUrl: knowledgeSources.fileUrl,
      mimeType: knowledgeSources.mimeType,
      content: knowledgeSources.content,
    })
    .from(knowledgeSources)
    .where(eq(knowledgeSources.id, sourceId))
    .limit(1);

  if (!source) {
    return { success: false, error: "Source not found" };
  }

  try {
    await updateKnowledgeSourceStatus(sourceId, "processing");

    let content = source.content;
    let title = source.title;

    if (source.fileUrl && source.mimeType === "application/pdf") {
      const s3Key = getKeyFromUrl(source.fileUrl);
      if (!s3Key) {
        throw new Error("Invalid knowledge file URL. Could not derive S3 key.");
      }

      const extraction = await extractTextFromPdf(await getFileBuffer(s3Key));
      content = extraction.text;

      try {
        title = await generateTitleFromContent(content, source.title);
      } catch (error) {
        console.warn("Failed to generate title:", error);
      }

      await db
        .update(knowledgeSources)
        .set({ content, title, updatedAt: new Date() })
        .where(eq(knowledgeSources.id, sourceId));
    }

    await deleteKnowledgeChunksBySourceId(sourceId);

    const chunks = chunkText(content);
    if (chunks.length === 0) {
      await updateKnowledgeSourceStatus(sourceId, "complete");
      return { success: true };
    }

    let embeddings: number[][] = [];
    try {
      embeddings = await generateEmbeddings(chunks);
    } catch (error) {
      console.warn("Failed to generate embeddings:", error);
    }

    await insertKnowledgeChunks({
      sourceId: sourceId,
      agentId: source.agentId,
      chunks: chunks.map((chunk, index) => ({
        text: chunk,
        embedding: embeddings[index] ? `[${embeddings[index].join(",")}]` : null,
      })),
    });

    await updateKnowledgeSourceStatus(sourceId, "complete");
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    await updateKnowledgeSourceStatus(sourceId, "failed", errorMessage);
    return { success: false, error: errorMessage };
  }
}
