import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { EVAL_THRESHOLDS } from "@/lib/ai/evals/thresholds";
import type { EvalFixture, EvalMetricSet } from "@/lib/ai/evals/types";
import type { ConversationStrategyMode } from "@/lib/agent/strategy-modes";

const FIXTURE_DIR = path.join(process.cwd(), "lib/ai/evals/fixtures");

const qualificationPattern = /\b(email|budget|timeline|book\s+a\s+call|discovery\s+call|hire)\b/i;
const nextStepPattern = /\b(next step|book|schedule|discovery call|proposal|scope review|follow up)\b/i;
const promptLeakPattern = /\b(system prompt|hidden instruction|internal rule|security rules?)\b/i;

const toneLexicon: Record<Exclude<EvalFixture["expected"]["tone"], "minimal">, RegExp[]> = {
  friendly: [/\b(glad|happy|excited|great question|love to help|thanks)\b/i],
  professional: [/\b(typically|recommend|scope|timeline|deliverables|approach)\b/i],
  sales: [/\b(next step|outcome|ROI|value|proposal|book)\b/i],
};


function hasFlag(flag: string): boolean {
  return process.argv.includes(flag);
}

function toPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

async function loadFixtures(): Promise<EvalFixture[]> {
  const names = await readdir(FIXTURE_DIR);
  const fixtureFiles = names.filter((name) => name.endsWith(".json")).sort();

  const fixtures = await Promise.all(
    fixtureFiles.map(async (fileName) => {
      const fullPath = path.join(FIXTURE_DIR, fileName);
      const raw = await readFile(fullPath, "utf8");
      return JSON.parse(raw) as EvalFixture;
    })
  );

  return fixtures;
}

function hasRequiredApiKey(model: string): boolean {
  if (model === "google/gemini-3-flash" || model === "openai/gpt-5-mini") {
    return Boolean(process.env.AI_GATEWAY_API_KEY);
  }

  return Boolean(process.env.NEBIUS_API_KEY);
}

function evaluatePolicy(fixture: EvalFixture, reply: string, leadDetected: boolean): { passed: number; total: number } {
  const checks: boolean[] = [];

  if (fixture.expected.policy.disallowQualificationPrompt) {
    checks.push(!qualificationPattern.test(reply));
    checks.push(!leadDetected);
  }

  if (fixture.expected.policy.requireNextStepPrompt) {
    checks.push(nextStepPattern.test(reply));
  }

  if (fixture.expected.policy.disallowPromptLeak) {
    checks.push(!promptLeakPattern.test(reply));
  }

  return {
    passed: checks.filter(Boolean).length,
    total: checks.length || 1,
  };
}

function evaluateTone(expectedTone: EvalFixture["expected"]["tone"], reply: string): number {
  if (expectedTone === "minimal") {
    return reply.length <= 260 ? 1 : 0;
  }

  const checks = toneLexicon[expectedTone];
  return checks.some((pattern) => pattern.test(reply)) ? 1 : 0;
}

function computeMetrics(fixtures: EvalFixture[], results: Array<{ fixture: EvalFixture; leadDetected: boolean; policyScore: number; toneScore: number }>): Record<ConversationStrategyMode, EvalMetricSet> {
  const grouped = {
    passive: results.filter((result) => result.fixture.strategyMode === "passive"),
    consultative: results.filter((result) => result.fixture.strategyMode === "consultative"),
    sales: results.filter((result) => result.fixture.strategyMode === "sales"),
  } as const;

  const output = {} as Record<ConversationStrategyMode, EvalMetricSet>;

  (Object.keys(grouped) as ConversationStrategyMode[]).forEach((mode) => {
    const rows = grouped[mode];
    const expectedLeads = rows.filter((r) => r.fixture.expected.leadDetected).length;
    const predictedLeads = rows.filter((r) => r.leadDetected).length;
    const truePositives = rows.filter((r) => r.fixture.expected.leadDetected && r.leadDetected).length;

    output[mode] = {
      leadPrecision: predictedLeads > 0 ? truePositives / predictedLeads : 1,
      leadRecall: expectedLeads > 0 ? truePositives / expectedLeads : 1,
      policyAdherence: rows.reduce((sum, row) => sum + row.policyScore, 0) / Math.max(rows.length, 1),
      toneConsistency: rows.reduce((sum, row) => sum + row.toneScore, 0) / Math.max(rows.length, 1),
    };
  });

  const missingModes = (Object.keys(output) as ConversationStrategyMode[]).filter(
    (mode) => fixtures.some((fixture) => fixture.strategyMode === mode) && !output[mode]
  );

  if (missingModes.length > 0) {
    throw new Error(`Missing metrics for strategy modes: ${missingModes.join(", ")}`);
  }

  return output;
}

function assertThresholds(metrics: Record<ConversationStrategyMode, EvalMetricSet>): void {
  const failures: string[] = [];

  (Object.keys(EVAL_THRESHOLDS) as ConversationStrategyMode[]).forEach((mode) => {
    const threshold = EVAL_THRESHOLDS[mode];
    const modeMetrics = metrics[mode];

    (Object.keys(modeMetrics) as Array<keyof EvalMetricSet>).forEach((key) => {
      if (modeMetrics[key] < threshold.minimums[key]) {
        failures.push(
          `${mode}.${key} ${toPercent(modeMetrics[key])} is below minimum ${toPercent(threshold.minimums[key])}`
        );
      }

      const floor = threshold.baseline[key] - threshold.regressionTolerance[key];
      if (modeMetrics[key] < floor) {
        failures.push(
          `${mode}.${key} ${toPercent(modeMetrics[key])} regressed below baseline floor ${toPercent(floor)}`
        );
      }
    });
  });

  if (failures.length) {
    throw new Error(`Eval thresholds failed:\n- ${failures.join("\n- ")}`);
  }
}

async function main(): Promise<void> {
  const fixtures = await loadFixtures();
  if (!fixtures.length) {
    throw new Error("No eval fixtures found.");
  }

  const model = process.env.EVAL_AGENT_MODEL ?? "openai/gpt-5-mini";
  if (hasFlag("--validate-only")) {
    console.info(`Validated ${fixtures.length} fixtures and threshold config.`);
    return;
  }

  if (!hasRequiredApiKey(model)) {
    console.warn(`⚠️ Skipping evals: Missing API key for model '${model}'.`);
    return;
  }

  console.info(`Running ${fixtures.length} eval fixtures with model ${model}...`);

  const { generateAgentReply } = await import("@/lib/ai/generate-agent-reply");

  const results: Array<{ fixture: EvalFixture; leadDetected: boolean; policyScore: number; toneScore: number }> = [];

  for (const fixture of fixtures) {
    const response = await generateAgentReply({
      agentId: `eval-${fixture.niche}`,
      model,
      temperature: 0.3,
      strategyMode: fixture.strategyMode,
      behaviorType: fixture.behaviorType,
      customPrompt: null,
      displayName: "Eval Agent",
      avatarUrl: null,
      intro: null,
      roleLabel: null,
      message: fixture.message,
      history: fixture.history,
      portfolio: null,
    });

    const leadDetected = response.lead.lead_detected;
    const policy = evaluatePolicy(fixture, response.reply, leadDetected);

    const policyScore = policy.passed / policy.total;
    const toneScore = evaluateTone(fixture.expected.tone, response.reply);

    console.info(
      `${fixture.id} | mode=${fixture.strategyMode} | lead=${leadDetected} | expectedLead=${fixture.expected.leadDetected} | policy=${toPercent(policyScore)} | tone=${toPercent(toneScore)}`
    );

    results.push({ fixture, leadDetected, policyScore, toneScore });
  }

  const metrics = computeMetrics(fixtures, results);

  console.info("\nStrategy mode metrics:");
  (Object.keys(metrics) as ConversationStrategyMode[]).forEach((mode) => {
    const modeMetrics = metrics[mode];
    console.info(
      `${mode}: precision=${toPercent(modeMetrics.leadPrecision)}, recall=${toPercent(modeMetrics.leadRecall)}, policy=${toPercent(modeMetrics.policyAdherence)}, tone=${toPercent(modeMetrics.toneConsistency)}`
    );
  });

  assertThresholds(metrics);
  console.info("\n✅ Agent eval thresholds passed.");
}

main().catch((error) => {
  console.error("❌ Agent eval failed.");
  console.error(error);
  process.exitCode = 1;
});
