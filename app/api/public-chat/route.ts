import { NextResponse } from "next/server";
import { handlePublicChat } from "@/lib/ai/public-chat-handler";
import { parsePublicChatRequest } from "@/lib/validation/public-chat";
import { requireUserId } from "@/lib/api/route-helpers";

function normalizeOrigin(value: string | null): string | null {
  if (!value) return null;

  try {
    return new URL(value).origin;
  } catch {
    return value.trim().replace(/\/+$/, "");
  }
}

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

function getCorsHeaders(request: Request): Record<string, string> {
  const origin = normalizeOrigin(request.headers.get("origin"));
  const appOrigin = normalizeOrigin(process.env.NEXT_PUBLIC_APP_URL?.trim() ?? null);

  if (!origin || !appOrigin || origin !== appOrigin) {
    return {};
  }

  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function OPTIONS(request: Request) {
  const corsHeaders = getCorsHeaders(request);
  if (!("Access-Control-Allow-Origin" in corsHeaders)) {
    return new NextResponse(null, { status: 403 });
  }
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(request: Request) {
  let body: Record<string, unknown> | null = null;
  try {
    const text = await request.text();
    body = JSON.parse(text) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = parsePublicChatRequest(body);
  if (!parsed) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const authResult = await requireUserId();
  const userId = authResult.ok ? authResult.userId : null;
  const ip = getClientIp(request);

  const result = await handlePublicChat({
    handle: parsed.handle,
    agentId: parsed.agentId,
    message: parsed.message,
    history: parsed.history,
    sessionId: parsed.sessionId,
    ip,
    userId,
  });

  const corsHeaders = getCorsHeaders(request);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status, headers: corsHeaders });
  }

  return NextResponse.json(
    { reply: result.reply, leadDetected: result.leadDetected, sessionId: result.sessionId },
    { headers: corsHeaders },
  );
}
