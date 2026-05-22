import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/api/route-helpers";
import { getAvatarUploadUrl } from "@/lib/storage/s3";

export async function POST(request: Request) {
    const authResult = await requireUserId();
    if (!authResult.ok) {
        return authResult.response;
    }

    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get("fileName");
    const mimeType = searchParams.get("mimeType");

    if (!fileName || !mimeType) {
        return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    try {
        const result = await getAvatarUploadUrl(fileName, mimeType, authResult.userId);
        return NextResponse.json(result);
    } catch (error) {
        console.error("Error creating upload URL:", error);
        return NextResponse.json({ error: "Failed to create upload URL" }, { status: 500 });
    }
}
