import { Message, MessageContent } from "@/components/ai-elements/message";
import { FileText } from "lucide-react";
import {
  SetupPathSelector,
  ToneSelectorCards,
  ServicesTagSelector,
  TargetAudienceChips,
  ContactPreferencesChips,
  HandleInputWithValidation,
  FAQAccordionEditor,
  ProjectsCardEditor,
  TitleSuggestions,
  SectionSelectorCards,
} from "@/app/onboarding/_components/onboarding-generative-ui";
import { OnboardingMessageResponse } from "@/app/onboarding/_components/onboarding-chat-parts";
import type { OnboardingSelectedSections } from "@/lib/onboarding/types";
import { cn } from "@/lib/utils";
import type { MessagePartLike } from "@/app/onboarding/_lib/onboarding-chat-utils";
import type { OnboardingChatMessageLike } from "@/app/onboarding/_hooks/use-onboarding-selector-visibility";

type Visibility = {
  shouldShowSetupPath: boolean;
  shouldShowTitleSuggestions: boolean;
  shouldShowSectionSelector: boolean;
  shouldShowServicesSelector: boolean;
  shouldShowProjectsEditor: boolean;
  shouldShowTargetAudience: boolean;
  shouldShowContactPreferences: boolean;
  shouldShowFAQsEditor: boolean;
  shouldShowToneSelector: boolean;
  shouldShowHandleInput: boolean;
};

type Props = {
  isLatestAssistantMessage: boolean;
  isSavingSections: boolean;
  message: OnboardingChatMessageLike;
  selectedSections: OnboardingSelectedSections;
  setSelectedSections: (sections: OnboardingSelectedSections) => void;
  setSelectedServices: (services: string[]) => void;
  setSelectedProjects: (projects: { title: string; description: string }[]) => void;
  setHandleValue: (value: string) => void;
  setSelectedFAQs: (faqs: string[]) => void;
  status: "submitted" | "streaming" | "ready" | "error";
  visibility: Visibility;
  onSectionsSubmit: () => void;
  onSetupPathSubmit: (value: string) => void;
  onToneSubmit: (value: string) => void;
  onServicesSubmit: () => void;
  onProjectsSubmit: () => void;
  onHandleSubmit: () => void;
  onTargetAudienceSubmit: (value: string) => void;
  onContactPreferenceSubmit: (value: string) => void;
  onFAQsSubmit: () => void;
  onTitleSubmit: (value: string) => void;
};

const RESUME_PATTERN = /\[Attached Resume:[^\]]*\]\([^\)]+\)/g;

export function OnboardingChatMessageItem({
  isLatestAssistantMessage,
  isSavingSections,
  message,
  onContactPreferenceSubmit,
  onFAQsSubmit,
  onHandleSubmit,
  onProjectsSubmit,
  onSectionsSubmit,
  onServicesSubmit,
  onSetupPathSubmit,
  onTargetAudienceSubmit,
  onTitleSubmit,
  onToneSubmit,
  selectedSections,
  setHandleValue,
  setSelectedFAQs,
  setSelectedProjects,
  setSelectedSections,
  setSelectedServices,
  status,
  visibility,
}: Props) {
  const messageParts = (message.parts || []) as MessagePartLike[];
  const rawText =
    messageParts.find((p): p is { type: "text"; text: string } => p.type === "text" && typeof p.text === "string")?.text ??
    (typeof message.content === "string" ? message.content : "");
  const hasResume = /\[Attached Resume:[^\]]*\]\([^\)]+\)/.test(rawText);

  const renderEnhancedControls = () => {
    if (message.role !== "assistant" || !isLatestAssistantMessage) return null;

    if (visibility.shouldShowSectionSelector) {
      return (
        <div className="mt-3">
          <SectionSelectorCards
            value={selectedSections}
            onChange={setSelectedSections}
            onSubmit={onSectionsSubmit}
            disabled={status === "streaming" || isSavingSections}
          />
        </div>
      );
    }

    if (visibility.shouldShowSetupPath) {
      return (
        <div className="mt-3">
          <SetupPathSelector
            options={[
              { id: "existing-site", label: "Agent Rep Only", value: "I already have a website", description: "Quick 2-min setup • Connect your existing website with an AI agent", icon: "bot", color: "blue" },
              { id: "build-new", label: "Agent Rep + Portfolio", value: "Build me a portfolio + agent", description: "Full portfolio site • AI-powered agent included", icon: "globe", color: "green" },
            ]}
            onSelect={onSetupPathSubmit}
            disabled={status === "streaming"}
          />
        </div>
      );
    }

    if (visibility.shouldShowToneSelector) {
      return (
        <div className="mt-3">
          <ToneSelectorCards
            options={[
              { id: "professional", label: "Professional", value: "Professional", description: '"I help enterprise teams build scalable solutions."', icon: "briefcase" },
              { id: "friendly", label: "Friendly", value: "Friendly", description: '"Hey there! I\'d love to help you with your project."', icon: "smile" },
              { id: "bold", label: "Bold", value: "Bold", description: '"I don\'t just design products—I transform businesses."', icon: "zap" },
              { id: "minimal", label: "Minimal", value: "Minimal", description: '"I design clean, focused solutions."', icon: "minus" },
            ]}
            onSelect={onToneSubmit}
            disabled={status === "streaming"}
          />
        </div>
      );
    }

    if (visibility.shouldShowServicesSelector) {
      return (
        <div className="mt-3">
          <ServicesTagSelector
            presets={["Web Development", "Mobile App Development", "UI/UX Design", "Graphic Design", "Content Writing", "Marketing", "SEO", "Social Media Management", "Consulting", "Data Analytics", "Video Production", "Photography"]}
            onChange={setSelectedServices}
            onSubmit={onServicesSubmit}
            disabled={status === "streaming"}
            max={10}
          />
        </div>
      );
    }

    if (visibility.shouldShowProjectsEditor) {
      return (
        <div className="mt-3">
          <ProjectsCardEditor
            onChange={setSelectedProjects}
            onSubmit={onProjectsSubmit}
            disabled={status === "streaming"}
            maxItems={3}
          />
        </div>
      );
    }

    if (visibility.shouldShowHandleInput) {
      return (
        <div className="mt-3">
          <HandleInputWithValidation
            onChange={setHandleValue}
            onSubmit={onHandleSubmit}
            disabled={status === "streaming"}
          />
        </div>
      );
    }

    if (visibility.shouldShowTargetAudience) {
      return (
        <div className="mt-3">
          <TargetAudienceChips
            onSelect={onTargetAudienceSubmit}
            disabled={status === "streaming"}
          />
        </div>
      );
    }

    if (visibility.shouldShowContactPreferences) {
      return (
        <div className="mt-3">
          <ContactPreferencesChips
            onSelect={onContactPreferenceSubmit}
            disabled={status === "streaming"}
          />
        </div>
      );
    }

    if (visibility.shouldShowFAQsEditor) {
      return (
        <div className="mt-3">
          <FAQAccordionEditor
            onChange={setSelectedFAQs}
            onSubmit={onFAQsSubmit}
            disabled={status === "streaming"}
          />
        </div>
      );
    }

    if (visibility.shouldShowTitleSuggestions) {
      return (
        <div className="mt-3">
          <TitleSuggestions
            suggestions={["Product Designer", "Software Engineer", "Frontend Developer", "Full Stack Developer", "UI/UX Designer", "Marketing Manager", "Consultant", "Freelancer", "Founder", "Data Scientist"]}
            onSelect={onTitleSubmit}
            disabled={status === "streaming"}
          />
        </div>
      );
    }

    return null;
  };

  if (messageParts.length === 0 && typeof message.content === "string") {
    const cleaned = String(message.content).replace(RESUME_PATTERN, "").trim();

    return (
      <Message from={message.role as "user" | "assistant"}>
        <MessageContent className={cn("text-base max-w-2xl", message.role === "assistant" && "text-primary")}>
          {hasResume && message.role === "user" && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
              <FileText className="size-3" />
              <span>resume.pdf</span>
            </div>
          )}
          {cleaned ? <OnboardingMessageResponse>{cleaned}</OnboardingMessageResponse> : null}
          {renderEnhancedControls()}
        </MessageContent>
      </Message>
    );
  }

  const textParts = messageParts.filter((part): part is { type: "text"; text: string } => part.type === "text" && typeof part.text === "string");

  return (
    <Message from={message.role as "user" | "assistant"}>
      <MessageContent className={cn("text-base max-w-2xl", message.role === "assistant" && "text-primary")}>
        {hasResume && message.role === "user" && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
            <FileText className="size-3" />
            <span>resume.pdf</span>
          </div>
        )}

        {textParts.map((part, index) => {
          const displayTxt = part.text.replace(RESUME_PATTERN, "").trim();
          if (!displayTxt) return null;
          return <OnboardingMessageResponse key={`${message.id}-${index}`}>{displayTxt}</OnboardingMessageResponse>;
        })}

        {renderEnhancedControls()}
      </MessageContent>
    </Message>
  );
}
