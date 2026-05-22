import {
  CONVERSATION_STRATEGY_MODES,
  type ConversationStrategyMode,
} from "@/lib/agent/strategy-modes";

export const MODELS = [
  { value: "moonshotai/Kimi-K2.5", label: "Kimi K2.5", description: "Fast & accurate" },
  { value: "MiniMaxAI/MiniMax-M2.1", label: "MiniMax M2.1", description: "Balanced" },
  { value: "zai-org/GLM-4.7-FP8", label: "GLM 4.7", description: "Multi-purpose" },
  { value: "openai/gpt-oss-120b", label: "GPT-OSS 120B", description: "Large & powerful" },
  { value: "google/gemini-3-flash", label: "Gemini 3 Flash", description: "Via Vercel AI Gateway" },
  { value: "openai/gpt-5-mini", label: "GPT-5 mini", description: "Via Vercel AI Gateway" },
] as const;

export const BEHAVIOR_PRESETS = [
  { value: "friendly", label: "Friendly & Welcoming" },
  { value: "professional", label: "Strictly Professional" },
  { value: "sales", label: "Sales & Conversion Focused" },
  { value: "minimal", label: "Minimal & Direct" },
] as const;

export const STRATEGY_MODES = [
  { value: "passive", label: "Passive", helper: CONVERSATION_STRATEGY_MODES.passive.description },
  { value: "consultative", label: "Consultative", helper: CONVERSATION_STRATEGY_MODES.consultative.description },
  { value: "sales", label: "Sales", helper: CONVERSATION_STRATEGY_MODES.sales.description },
] as const satisfies ReadonlyArray<{ value: ConversationStrategyMode; label: string; helper: string }>;

export const AGENT_TABS = [
  { label: "Settings", value: "settings" },
  { label: "Integrations", value: "integrations" },
  { label: "Widget", value: "widget" },
  { label: "Test Chat", value: "test" },
] as const;

export const DAY_LABELS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
