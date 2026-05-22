import { NextResponse } from "next/server";
import { configureAgentForPortfolio, configureStandaloneAgent } from "@/lib/agent/configure";
import { parseJsonBody, requireUserId } from "@/lib/api/route-helpers";
import { getActivePortfolio } from "@/lib/active-portfolio";

interface ConfigureRequestBody {
  isEnabled?: unknown;
  model?: unknown;
  behaviorType?: unknown;
  strategyMode?: unknown;
  customPrompt?: unknown;
  temperature?: unknown;
  displayName?: unknown;
  avatarUrl?: unknown;
  intro?: unknown;
  roleLabel?: unknown;
  leadEnrichmentEnabled?: unknown;
}

export async function POST(request: Request) {
  const authResult = await requireUserId();
  if (!authResult.ok) {
    return authResult.response;
  }

  const jsonResult = await parseJsonBody<ConfigureRequestBody>(request);
  if (!jsonResult.ok) {
    return jsonResult.response;
  }

  const portfolio = await getActivePortfolio(authResult.userId);

  const input = {
    isEnabled: Boolean(jsonResult.body.isEnabled),
    model: String(jsonResult.body.model ?? ""),
    behaviorType: jsonResult.body.behaviorType ? String(jsonResult.body.behaviorType) : null,
    strategyMode: String(jsonResult.body.strategyMode ?? "consultative"),
    customPrompt: jsonResult.body.customPrompt ? String(jsonResult.body.customPrompt) : null,
    temperature: Number(jsonResult.body.temperature ?? 0.5),
    displayName: jsonResult.body.displayName ? String(jsonResult.body.displayName) : null,
    avatarUrl: jsonResult.body.avatarUrl ? String(jsonResult.body.avatarUrl) : null,
    intro: jsonResult.body.intro ? String(jsonResult.body.intro) : null,
    roleLabel: jsonResult.body.roleLabel ? String(jsonResult.body.roleLabel) : null,
    leadEnrichmentEnabled: Boolean(jsonResult.body.leadEnrichmentEnabled),
  };

  const result = portfolio
    ? await configureAgentForPortfolio(authResult.userId, portfolio.id, input)
    : await configureStandaloneAgent(authResult.userId, input);


  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({ success: true });
}
