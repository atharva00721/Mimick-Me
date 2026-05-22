import { Message, MessageContent } from "@/components/ai-elements/message";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { OnboardingChatMessageItem } from "@/app/onboarding/_components/onboarding-chat-message-item";
import type { OnboardingSelectedSections } from "@/lib/onboarding/types";
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
  isSavingSections: boolean;
  messages: OnboardingChatMessageLike[];
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

export function OnboardingChatMessageList({ messages, status, ...props }: Props) {
  const isBusy = status === "submitted" || status === "streaming";

  return (
    <>
      {messages.map((message) => (
        <OnboardingChatMessageItem
          key={message.id}
          message={message}
          isLatestAssistantMessage={message.id === messages[messages.length - 1]?.id}
          status={status}
          {...props}
        />
      ))}

      {isBusy && (() => {
        const last = messages[messages.length - 1];
        const hasText =
          last?.role === "assistant" &&
          (((last.parts as MessagePartLike[] | undefined)?.some(
            (p) => p.type === "text" && typeof p.text === "string" && p.text.trim().length > 0,
          ) ?? false) ||
            (typeof last.content === "string" && last.content.trim().length > 0));

        if (hasText) return null;

        return (
          <Message from="assistant">
            <MessageContent className="text-base">
              <Shimmer duration={1.2}>•••</Shimmer>
            </MessageContent>
          </Message>
        );
      })()}
    </>
  );
}
