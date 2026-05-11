import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/api/route-helpers";
import { getUserAgent } from "@/lib/db/knowledge";
import { getUploadUrl, MAX_FILE_SIZE } from "@/lib/storage/blob";
import { getActivePortfolio } from "@/lib/active-portfolio";

export async function POST(request: Request) {
  const auth = await requireUserId();
  if (!auth.ok) return auth.response;

  const portfolio = await getActivePortfolio(auth.userId);
  if (!portfolio) {
    return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
  }

  const agent = await getUserAgent(auth.userId, portfolio.id);
  if (!agent) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const fileName = searchParams.get("fileName");
  const mimeType = searchParams.get("mimeType");

  if (!fileName || !mimeType) {
    return NextResponse.json({ error: "Missing fileName or mimeType" }, { status: 400 });
  }

  const allowedMimeTypes = ["application/pdf"];
  if (!allowedMimeTypes.includes(mimeType)) {
    return NextResponse.json({ error: "Invalid file type. Only PDF allowed." }, { status: 400 });
  }

  const maxSizeParam = searchParams.get("maxSize");
  const maxSize = maxSizeParam ? parseInt(maxSizeParam, 10) : MAX_FILE_SIZE;

  try {
    const { uploadUrl, key, publicUrl } = await getUploadUrl(fileName, mimeType, agent.id);

    return NextResponse.json({
      uploadUrl,
      key,
      publicUrl,
      maxSize,
    });
  } catch (error) {
    console.error("Failed to generate upload URL:", error);
    return NextResponse.json({ error: "Failed to generate upload URL" }, { status: 500 });
  }
}
