import type { OnboardingData } from "@/lib/onboarding/types";
import { validateFinalOnboardingState } from "@/lib/onboarding/validation";

export const INITIAL_GREETING = "Hey! Let's get your portfolio set up. Do you already have a website you want to import, or are we building from scratch? You can also click the 📎 icon to upload your resume and I'll fill everything in for you!";

const CONFIRM_PHRASES = [
  "is that correct",
  "does that look",
  "should i use",
  "look right",
  "look good",
  "is that right",
  "correct?",
  "looks good?",
  "sound good",
  "does that work",
  "should we go with",
];
type AnyPart = Record<string, any>;

export type MessagePartLike = {
  type?: string;
  text?: string;
  toolName?: string;
  result?: unknown;
  data?: unknown;
};

export type ChatMessageLike = {
  role?: string;
  parts: AnyPart[];
  toolInvocations?: AnyPart[];
};

function isCompletePreviewData(value: unknown): value is OnboardingData {
  if (!value || typeof value !== "object") return false;
  return validateFinalOnboardingState(value as Partial<OnboardingData>).ok;
}

/**
 * Extracts the tool name from a message part.
 * AI SDK v6 uses either:
 *   - type: "tool-<toolName>" (typed tools)
 *   - type: "dynamic-tool" with toolName property
 *   - legacy: type: "tool-invocation" with toolName property
 */
function getToolName(part: AnyPart): string | null {
  if (!part || !part.type) return null;

  // v6 typed tool: type = "tool-save_step", "tool-request_preview"
  if (typeof part.type === "string" && part.type.startsWith("tool-")) {
    return part.type.slice(5); // "tool-request_preview" → "request_preview"
  }

  // v6 dynamic tool
  if (part.type === "dynamic-tool" && typeof part.toolName === "string") {
    return part.toolName;
  }

  // Legacy: type = "tool-invocation" or "tool-result"
  if ((part.type === "tool-invocation" || part.type === "tool-result") && typeof part.toolName === "string") {
    return part.toolName;
  }

  return null;
}

/**
 * Gets the tool output/result from a message part.
 * AI SDK v6 uses `output`, legacy uses `result`.
 */
function getToolOutput(part: AnyPart): unknown {
  // v6 uses "output"
  if (part.output !== undefined) return part.output;
  // Legacy uses "result"
  if (part.result !== undefined) return part.result;
  return undefined;
}

/**
 * Checks if a tool part represents a completed invocation with output.
 */
function isToolComplete(part: AnyPart): boolean {
  return part.state === "output-available" || part.state === "result" || getToolOutput(part) !== undefined;
}

export function lastMessageAsksConfirmation(messages: ChatMessageLike[]): boolean {
  if (messages.length === 0) return false;
  const last = messages[messages.length - 1];
  if (last.role !== "assistant") return false;
  const text = (last.parts || [])
    .filter((p: AnyPart) => p.type === "text" && typeof p.text === "string")
    .map((p: AnyPart) => p.text as string)
    .join(" ")
    .toLowerCase();
  return CONFIRM_PHRASES.some((phrase) => text.includes(phrase));
}

export function userJustConfirmed(messages: ChatMessageLike[]): boolean {
  if (messages.length < 2) return false;
  const last = messages[messages.length - 1];
  if (last.role !== "user") return false;
  const prev = messages[messages.length - 2];
  if (prev.role !== "assistant") return false;
  const prevText = (prev.parts || [])
    .filter((p: AnyPart) => p.type === "text" && typeof p.text === "string")
    .map((p: AnyPart) => p.text as string)
    .join(" ")
    .toLowerCase();
  return CONFIRM_PHRASES.some((phrase) => prevText.includes(phrase));
}

export function extractPreviewData(messages: ChatMessageLike[]): OnboardingData | null {
  // Scan ALL messages (not just last) for the most recent request_preview result
  let latestPreview: OnboardingData | null = null;

  for (const message of messages) {
    if (message.role !== "assistant") continue;

    // Check legacy toolInvocations array
    if (message.toolInvocations) {
      for (const tool of message.toolInvocations) {
        const output = getToolOutput(tool);
        if (
          (tool.toolName === "request_preview" || getToolName(tool) === "request_preview") &&
          output &&
          typeof output === "object" &&
          (output as any).preview &&
          isCompletePreviewData((output as any).data)
        ) {
          latestPreview = (output as any).data as OnboardingData;
        }
      }
    }

    // Check parts array (v6 format)
    for (const part of (message.parts || [])) {
      const toolName = getToolName(part);
      if (toolName !== "request_preview") continue;
      if (!isToolComplete(part)) continue;

      const output = getToolOutput(part);
      if (!output || typeof output !== "object") continue;

      const outputObj = output as any;
      if (outputObj.preview && isCompletePreviewData(outputObj.data)) {
        latestPreview = outputObj.data as OnboardingData;
      }
    }
  }

  return latestPreview;
}
