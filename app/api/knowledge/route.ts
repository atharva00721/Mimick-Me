import { NextResponse } from "next/server";
import { parseJsonBody, requireUserId } from "@/lib/api/route-helpers";
import { getUserAgent, listKnowledgeSourcesByAgentId } from "@/lib/db/knowledge";
import { createKnowledgeSource, createKnowledgeSourceFromFile } from "@/lib/knowledge/service";
import { parseKnowledgeInput } from "@/lib/validation/knowledge";
import { getActivePortfolio } from "@/lib/active-portfolio";

export async function GET() {
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

  const rows = await listKnowledgeSourcesByAgentId(agent.id);
  return NextResponse.json({ sources: rows });
}

export async function POST(request: Request) {
  const auth = await requireUserId();
  if (!auth.ok) return auth.response;

  const json = await parseJsonBody<Record<string, unknown>>(request);
  if (!json.ok) return json.response;

  const parsed = parseKnowledgeInput(json.body);
  if (!parsed) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const portfolio = await getActivePortfolio(auth.userId);
  if (!portfolio) {
    return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
  }

  const agent = await getUserAgent(auth.userId, portfolio.id);
  if (!agent) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  let created;

  if (parsed.type === "pdf") {
    created = await createKnowledgeSourceFromFile({
      agentId: agent.id,
      title: parsed.title,
      fileUrl: parsed.fileUrl,
      mimeType: parsed.mimeType,
      fileSize: parsed.fileSize,
    });
  } else {
    created = await createKnowledgeSource({
      agentId: agent.id,
      title: parsed.title,
      content: parsed.content,
    });
  }

  if (!created.ok) {
    return NextResponse.json({ error: created.error }, { status: 400 });
  }

  return NextResponse.json({ success: true, id: created.sourceId }, { status: 201 });
}
