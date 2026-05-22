import { DefaultChatTransport } from "ai";
import { useChat } from "@ai-sdk/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { OnboardingData } from "@/lib/onboarding/types";
import { validateFinalOnboardingState } from "@/lib/onboarding/validation";
import { extractPreviewData, INITIAL_GREETING } from "@/app/onboarding/_lib/onboarding-chat-utils";

const CHAT_TRANSPORT = new DefaultChatTransport({
  api: "/api/onboarding/chat",
  credentials: "include",
});

export function useOnboardingChatState() {
  const router = useRouter();
  const hasRedirected = useRef(false);
  const [input, setInput] = useState("");
  const [previewDataFromDraft, setPreviewDataFromDraft] = useState<OnboardingData | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const { messages, sendMessage, status, error } = useChat({
    id: "onboarding-chat",
    transport: CHAT_TRANSPORT,
    messages: [
      {
        id: crypto.randomUUID(),
        role: "assistant",
        parts: [{ type: "text" as const, text: INITIAL_GREETING }],
      },
    ],
  });

  const previewDataFromMessages = useMemo(() => extractPreviewData(messages), [messages]);
  const previewData = previewDataFromMessages ?? previewDataFromDraft;

  useEffect(() => {
    if (previewDataFromMessages || status === "streaming") return;

    const controller = new AbortController();
    fetch("/api/onboarding/draft", { credentials: "include", signal: controller.signal })
      .then((res) => res.json())
      .then((json: { ok?: boolean; state?: Partial<OnboardingData> } | undefined) => {
        const state = json?.state;
        if (!json?.ok || !state || typeof state !== "object") return;
        const parsed = validateFinalOnboardingState(state);
        setPreviewDataFromDraft(parsed.ok ? parsed.value : null);
      })
      .catch((e) => {
        if (e?.name !== "AbortError") console.error("Failed to fetch draft:", e);
      });

    return () => controller.abort();
  }, [previewDataFromMessages, status, messages.length]);

  const handleConfirm = useCallback(async () => {
    if (!previewData || hasRedirected.current) return;
    setIsConfirming(true);
    try {
      const res = await fetch("/api/onboarding-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ state: previewData }),
      });
      const json = (await res.json()) as { ok?: boolean; redirectTo?: string; error?: string };
      if (json.ok && json.redirectTo) {
        hasRedirected.current = true;
        router.push(json.redirectTo);
      } else if (json.error) {
        console.error(json.error);
        toast.error(json.error);
        setIsConfirming(false);
      } else {
        toast.error("Unable to complete onboarding right now.");
        setIsConfirming(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Unable to complete onboarding right now.");
      setIsConfirming(false);
    }
  }, [previewData, router]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || status === "submitted" || status === "streaming") return;
    sendMessage({ text });
    setInput("");
  }, [input, sendMessage, status]);

  const refreshDraftFromServer = useCallback(() => {
    if (previewDataFromMessages) return;
    fetch("/api/onboarding/draft", { credentials: "include" })
      .then((res) => res.json())
      .then((json: { ok?: boolean; state?: Partial<OnboardingData> } | undefined) => {
        const state = json?.state;
        if (!json?.ok || !state || typeof state !== "object") return;
        const parsed = validateFinalOnboardingState(state);
        if (parsed.ok) setPreviewDataFromDraft(parsed.value);
      })
      .catch((e) => console.error("Failed to fetch draft:", e));
  }, [previewDataFromMessages]);

  return {
    messages,
    status,
    error,
    input,
    setInput,
    sendMessage,
    handleSubmit,
    previewData,
    isConfirming,
    handleConfirm,
    refreshDraftFromServer,
  };
}
