import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.S3_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
  },
  ...(process.env.S3_ENDPOINT && {
    endpoint: process.env.S3_ENDPOINT,
    forcePathStyle: true,
  }),
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || "";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export interface UploadUrlResult {
  uploadUrl: string;
  key: string;
  publicUrl: string;
}

export async function getUploadUrl(
  fileName: string,
  mimeType: string,
  agentId: string
): Promise<UploadUrlResult> {
  const key = `knowledge/${agentId}/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: mimeType,
    // ACL omitted — use bucket policy for public read
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  const publicUrl = `${process.env.S3_PUBLIC_URL || `https://${BUCKET_NAME}.s3.${process.env.S3_REGION || 'us-east-1'}.amazonaws.com`}/${key}`;

  return { uploadUrl, key, publicUrl };
}

export async function getPortfolioUploadUrl(
  fileName: string,
  mimeType: string,
  userId: string
): Promise<UploadUrlResult> {
  // UUID prefix: collision-free, non-guessable keys
  const ext = fileName.includes(".") ? fileName.split(".").pop() : "bin";
  const key = `portfolios/${userId}/${crypto.randomUUID()}.${ext}`;

  // IMPORTANT: Do NOT include ACL here.
  // If ACL is in the command it gets baked into the presigned URL's signature,
  // and then S3 requires `x-amz-acl` in the PUT request — clients often miss it → 400.
  // Instead, configure the bucket with a public-read bucket policy.
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: mimeType,
    // ACL deliberately omitted — use bucket policy for public read
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 }); // 15 min
  const publicUrl = `${process.env.S3_PUBLIC_URL || `https://${BUCKET_NAME}.s3.${process.env.S3_REGION || "us-east-1"}.amazonaws.com`}/${key}`;

  return { uploadUrl, key, publicUrl };
}

export async function getAvatarUploadUrl(
  fileName: string,
  mimeType: string,
  userId: string
): Promise<UploadUrlResult> {
  const ext = fileName.includes(".") ? fileName.split(".").pop() : "bin";
  const key = `avatars/${userId}/${crypto.randomUUID()}.${ext}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: mimeType,
    // ACL omitted — use bucket policy for public read
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 });
  const publicUrl = `${process.env.S3_PUBLIC_URL || `https://${BUCKET_NAME}.s3.${process.env.S3_REGION || "us-east-1"}.amazonaws.com`}/${key}`;

  return { uploadUrl, key, publicUrl };
}

export async function getDownloadUrl(key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn: 3600 });
}

/** Download file from S3 using credentials (works for private objects). */
export async function getFileBuffer(key: string): Promise<Buffer> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  const response = await s3Client.send(command);
  const stream = response.Body;
  if (!stream) throw new Error("Empty S3 response");

  const chunks: Uint8Array[] = [];
  for await (const chunk of stream as AsyncIterable<Uint8Array>) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

export async function deleteFile(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  await s3Client.send(command);
}

export function getKeyFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    // Decode percent-encoded characters (e.g. %20 → space) so the key
    // matches what was actually stored in S3.
    return decodeURIComponent(urlObj.pathname.slice(1));
  } catch {
    return null;
  }
}

export { MAX_FILE_SIZE, s3Client };
