import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/server";
import { put } from "@vercel/blob";

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

    const { url } = await put(key, buffer, {
      access: "public",
      contentType: file.type,
    });

    console.log(`[resume-upload] Uploaded to Vercel Blob: ${key} (${buffer.length} bytes)`);

    return NextResponse.json({ key: url, publicUrl: url });
  } catch (error) {
    console.error("[resume-upload] Vercel Blob upload failed:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
