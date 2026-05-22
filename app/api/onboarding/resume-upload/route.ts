import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/storage/s3";

const BUCKET_NAME = process.env.S3_BUCKET_NAME || "";
const S3_REGION = process.env.S3_REGION || "us-east-1";
const S3_PUBLIC_URL = process.env.S3_PUBLIC_URL;

export const maxDuration = 30;

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.type !== "application/pdf") {
    return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });
  }

  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File size must be less than 10MB" }, { status: 400 });
  }

  try {
    const key = `knowledge/onboarding-${session.user.id}/${Date.now()}-${file.name}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: file.type,
        ContentLength: buffer.length,
      })
    );

    const publicUrl = S3_PUBLIC_URL
      ? `${S3_PUBLIC_URL}/${key}`
      : `https://${BUCKET_NAME}.s3.${S3_REGION}.amazonaws.com/${key}`;

    console.log(`[resume-upload] Uploaded to S3: ${key} (${buffer.length} bytes)`);

    return NextResponse.json({ key, publicUrl });
  } catch (error) {
    console.error("[resume-upload] S3 upload failed:", error);
    return NextResponse.json({ error: "Upload to S3 failed" }, { status: 500 });
  }
}
