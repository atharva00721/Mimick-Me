import { useMemo } from "react";
import type { MessagePartLike } from "@/app/onboarding/_lib/onboarding-chat-utils";

export type OnboardingChatMessageLike = {
  id: string;
  role: string;
  parts?: MessagePartLike[];
  content?: string;
};

function getAssistantMessageText(message: OnboardingChatMessageLike): string {
  if (message.role !== "assistant") return "";

  const parts = (message.parts || []) as MessagePartLike[];
  const textFromParts = parts
    .filter((part): part is { type: "text"; text: string } => part.type === "text" && typeof part.text === "string")
    .map((part) => part.text)
    .join(" ");
  const textFromContent = typeof message.content === "string" ? message.content : "";

  return (textFromParts + " " + textFromContent).toLowerCase();
}

export function useOnboardingSelectorVisibility(messages: OnboardingChatMessageLike[]) {
  const detectedStep = useMemo(() => {
    const last = messages[messages.length - 1];
    if (!last || last.role !== "assistant") return null;

    const text = getAssistantMessageText(last);
    if (!text.trim()) return null;
    const hasUserMessage = messages.some((message) => message.role === "user");

    if (
      hasUserMessage &&
      (text.includes("how would you like to get started") ||
        text.includes("already have a website") ||
        text.includes("build me a portfolio"))
    ) {
      return "setup" as const;
    }

    if (text.includes("what services") || text.includes("services or work do you offer")) {
      return "services" as const;
    }

    if (text.includes("tell me about 1-3 projects") || text.includes("projects you'd like to showcase")) {
      return "projects" as const;
    }

    if (text.includes("target audience") || text.includes("who is your target audience")) {
      return "target" as const;
    }

    if (text.includes("how should contacts reach you") || text.includes("reach you")) {
      return "contact" as const;
    }

    if (text.includes("add faqs") || text.includes("frequently asked")) {
      return "faqs" as const;
    }

    if (text.includes("choose your preferred tone") || text.includes("preferred tone")) {
      return "tone" as const;
    }

    if (text.includes("choose your public handle") || text.includes("public handle")) {
      return "handle" as const;
    }

    if (text.includes("which sections") || (text.includes("sections") && text.includes("hero"))) {
      return "sections" as const;
    }

    if (text.includes("professional title") || text.includes("title best describes")) {
      return "title" as const;
    }

    return null;
  }, [messages]);

  const shouldShowSetupPath = detectedStep === "setup";
  const shouldShowTitleSuggestions = detectedStep === "title";
  const shouldShowSectionSelector = detectedStep === "sections";
  const shouldShowServicesSelector = detectedStep === "services";
  const shouldShowProjectsEditor = detectedStep === "projects";
  const shouldShowTargetAudience = detectedStep === "target";
  const shouldShowContactPreferences = detectedStep === "contact";
  const shouldShowFAQsEditor = detectedStep === "faqs";
  const shouldShowToneSelector = detectedStep === "tone";
  const shouldShowHandleInput = detectedStep === "handle";

  const shouldShowAnyEnhancedUI =
    shouldShowSectionSelector ||
    shouldShowSetupPath ||
    shouldShowToneSelector ||
    shouldShowServicesSelector ||
    shouldShowProjectsEditor ||
    shouldShowHandleInput ||
    shouldShowTargetAudience ||
    shouldShowContactPreferences ||
    shouldShowFAQsEditor ||
    shouldShowTitleSuggestions;

  return {
    detectedStep,
    shouldShowSetupPath,
    shouldShowTitleSuggestions,
    shouldShowSectionSelector,
    shouldShowServicesSelector,
    shouldShowProjectsEditor,
    shouldShowTargetAudience,
    shouldShowContactPreferences,
    shouldShowFAQsEditor,
    shouldShowToneSelector,
    shouldShowHandleInput,
    shouldShowAnyEnhancedUI,
  };
}
