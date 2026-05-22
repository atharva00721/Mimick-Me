import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/api/route-helpers";
import { getPortfolioUploadUrl } from "@/lib/storage/s3";

const ALLOWED_MIME_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/avif",
]);

// 8 MB hard limit — enforced server-side via S3 conditions too
const MAX_BYTES = 8 * 1024 * 1024;

export async function POST(request: Request) {
    const authResult = await requireUserId();
    if (!authResult.ok) {
        return authResult.response;
    }

    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get("fileName");
    const mimeType = searchParams.get("mimeType");
    const fileSizeStr = searchParams.get("fileSize"); // optional but recommended

    if (!fileName || !mimeType) {
        return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    // ── Mime-type allowlist ──────────────────────────────────────────────────────
    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
        return NextResponse.json(
            { error: `File type not allowed. Allowed types: ${[...ALLOWED_MIME_TYPES].join(", ")}` },
            { status: 415 }
        );
    }

    // ── Optional size pre-check (enforced properly by S3 conditions below) ────
    if (fileSizeStr) {
        const fileSize = Number(fileSizeStr);
        if (Number.isNaN(fileSize) || fileSize > MAX_BYTES) {
            return NextResponse.json(
                { error: `File too large. Maximum size is ${MAX_BYTES / 1024 / 1024}MB.` },
                { status: 413 }
            );
        }
    }

    // Sanitise filename — strip path traversal characters, keep extension
    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);

    try {
        const result = await getPortfolioUploadUrl(safeName, mimeType, authResult.userId);
        return NextResponse.json(result);
    } catch (error) {
        console.error("Error creating portfolio upload URL:", error);
        return NextResponse.json({ error: "Failed to create upload URL" }, { status: 500 });
    }
}
