"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { MessageResponse } from "@/components/ai-elements/message";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { ArrowUpIcon, Loader2, MessageSquare } from "lucide-react";
import { embedChatWithAgent } from "./actions";
import { MadeWithBadge } from "@/components/made-with-badge";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

interface EmbedChatClientProps {
  agentId: string;
  agentName?: string;
  avatarUrl?: string | null;
  roleLabel?: string | null;
  intro?: string | null;
  plan?: string | null;
}

function AgentAvatar({ avatarUrl, agentName, size = 32 }: { avatarUrl?: string | null; agentName: string; size?: number }) {
  const initials = agentName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt={agentName}
        width={size}
        height={size}
        style={{ width: size, height: size, borderRadius: "9999px", objectFit: "cover", flexShrink: 0 }}
      />
    );
  }
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: "9999px",
      background: "hsl(var(--primary))",
      color: "hsl(var(--primary-foreground))",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: size * 0.38,
      fontWeight: 600,
      flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

export function EmbedChatClient({ agentId, agentName = "AI Assistant", avatarUrl, roleLabel, intro, plan }: EmbedChatClientProps) {
  const fontUrl = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("font") : null;

  const fontStyle = useMemo(() => {
    if (!fontUrl) return {};
    try {
      const url = new URL(fontUrl);
      const family = url.searchParams.get("family")?.split(":")[0];
      if (family) {
        return { fontFamily: `"${family}", sans-serif` };
      }
    } catch (e) { }
    return {};
  }, [fontUrl]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const sessionIdRef = useRef<string | null>(null);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    const content = input.trim();
    if (!content || loading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setStreamingContent("");

    try {
      const result = await embedChatWithAgent({
        agentId,
        message: content,
        history: messages.slice(-8),
        sessionId: sessionIdRef.current,
      });

      if (result.ok && result.sessionId) {
        sessionIdRef.current = result.sessionId;
      }

      if (!result.ok) {
        throw new Error(result.error);
      }

      const reply = result.reply;

      let streamed = "";
      for (const char of reply) {
        streamed += char;
        setStreamingContent(streamed);
        await new Promise((resolve) => setTimeout(resolve, 8));
      }

      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", content: streamed }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Agent unavailable right now. Please try again."
        }
      ]);
    } finally {
      setLoading(false);
      setStreamingContent("");
    }
  }, [input, loading, messages, agentId]);

  const allMessages = useMemo(() => {
    if (!streamingContent) return messages;
    return [
      ...messages,
      { id: "streaming", role: "assistant" as const, content: streamingContent },
    ];
  }, [messages, streamingContent]);

  return (
    <div className="flex h-screen flex-col bg-background" style={fontStyle}>
      {fontUrl && (
        <link rel="stylesheet" href={fontUrl} />
      )}
      <header className="flex shrink-0 items-center gap-3 border-b px-4 py-3">
        <AgentAvatar avatarUrl={avatarUrl} agentName={agentName} size={36} />
        <div className="flex flex-col min-w-0">
          <span className="font-semibold text-sm truncate">{agentName}</span>
          {roleLabel ? <span className="text-xs text-muted-foreground truncate">{roleLabel}</span> : (
            <span className="flex items-center gap-1 text-xs text-green-500 font-medium">
              <span className="size-1.5 rounded-full bg-green-400 inline-block animate-pulse" />
              Online
            </span>
          )}
        </div>
      </header>

      <Conversation className="flex-1 min-h-0">
        <ConversationContent
          className="gap-4 p-4"
          scrollClassName="[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full"
        >
          {allMessages.length === 0 ? (
            <ConversationEmptyState
              icon={avatarUrl ? (
                <AgentAvatar avatarUrl={avatarUrl} agentName={agentName} size={64} />
              ) : (
                <MessageSquare className="size-12 text-muted-foreground" />
              )}
              title={`Chat with ${agentName}`}
              description={intro || "Ask me anything and I'll help you out"}
            />
          ) : (
            allMessages.map((message) => (
              <Message key={message.id} from={message.role}>
                <MessageContent
                  className="text-sm max-w-[85%] break-words"
                >
                  {message.role === "assistant" ? (
                    <MessageResponse>{message.content}</MessageResponse>
                  ) : (
                    <span>{message.content}</span>
                  )}
                </MessageContent>
              </Message>
            ))
          )}
          {loading && !streamingContent && (
            <Message from="assistant">
              <MessageContent className="text-sm text-muted-foreground">
                <Shimmer>•••</Shimmer>
              </MessageContent>
            </Message>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <form onSubmit={handleSubmit} className="shrink-0 border-t p-4">
        <InputGroup>
          <InputGroupTextarea
            value={input}
            maxLength={2000}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (input.trim() && !loading) {
                  handleSubmit();
                }
              }
            }}
            placeholder="Type your message..."
            disabled={loading}
            className="min-h-[48px] max-h-32 text-sm"
            rows={1}
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              type="submit"
              variant="default"
              size="icon-sm"
              disabled={!input.trim() || loading}
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <ArrowUpIcon className="size-4" />
              )}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </form>
      {plan === "free" && <MadeWithBadge />}
    </div>
  );
}
