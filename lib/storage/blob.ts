import { put, del, head } from "@vercel/blob";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export interface UploadResult {
  url: string;
  key: string;
  publicUrl: string;
}

export async function uploadToBlob(
  path: string,
  file: Buffer | File,
  contentType: string
): Promise<UploadResult> {
  const { url } = await put(path, file, {
    access: "public",
    contentType,
  });

  return {
    url,
    key: url,
    publicUrl: url,
  };
}

export async function getUploadUrl(
  fileName: string,
  mimeType: string,
  agentId: string
) {
  const key = `knowledge/${agentId}/${Date.now()}-${fileName}`;
  // Vercel Blob client-side uploads use a different pattern (upload),
  // but for simplicity and compatibility with existing server-side logic,
  // we'll keep the function signature and maybe use it for server-side if needed,
  // or refactor the callers to use client-side put from @vercel/blob.
  // Actually, the original code returned an uploadUrl for client-side S3 upload.
  // Vercel Blob has a different approach for client-side uploads.
  return {
    uploadUrl: "/api/upload/blob", // We will create this proxy if needed or refactor
    key,
    publicUrl: ""
  };
}

export async function getPortfolioUploadUrl(
  fileName: string,
  mimeType: string,
  userId: string
) {
  const ext = fileName.includes(".") ? fileName.split(".").pop() : "bin";
  const key = `portfolios/${userId}/${crypto.randomUUID()}.${ext}`;
  return { uploadUrl: "/api/upload/blob", key, publicUrl: "" };
}

export async function getAvatarUploadUrl(
  fileName: string,
  mimeType: string,
  userId: string
) {
  const ext = fileName.includes(".") ? fileName.split(".").pop() : "bin";
  const key = `avatars/${userId}/${crypto.randomUUID()}.${ext}`;
  return { uploadUrl: "/api/upload/blob", key, publicUrl: "" };
}

export async function getDownloadUrl(url: string): Promise<string> {
  return url;
}

export async function getFileBuffer(url: string): Promise<Buffer> {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function deleteFile(url: string): Promise<void> {
  await del(url);
}

export function getKeyFromUrl(url: string): string | null {
  return url;
}

export { MAX_FILE_SIZE };
