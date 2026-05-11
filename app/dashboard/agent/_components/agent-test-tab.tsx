import { Conversation, ConversationContent, ConversationEmptyState, ConversationScrollButton } from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea } from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, ArrowUpIcon, Loader2 } from "lucide-react";
import type { ChatMessage } from "./types";

interface AgentTestTabProps {
  canTest: boolean;
  chatMessages: ChatMessage[];
  chatInput: string;
  isChatLoading: boolean;
  clearChatMessages: () => void;
  setChatInput: (value: string) => void;
  sendTestMessage: (e: React.FormEvent<HTMLFormElement>) => void;
  isAgentEnabled: boolean;
}

export function AgentTestTab({ canTest, chatMessages, chatInput, isChatLoading, clearChatMessages, setChatInput, sendTestMessage, isAgentEnabled }: AgentTestTabProps) {
  return (
    <div className="pt-5">
      <Card className="overflow-hidden flex flex-col h-[700px] shadow-lg border-primary/10">
        <div className="border-b border-border px-6 py-4 flex items-center justify-between bg-muted/30 shrink-0">
          <div>
            <h3 className="text-base font-semibold">Test Agent</h3>
            <p className="text-xs text-muted-foreground mt-0.5 font-medium">Live preview that sends real requests to your configured agent.</p>
          </div>
          {chatMessages.length > 0 && (
            <Button size="sm" variant="ghost" onClick={clearChatMessages} className="font-medium hover:bg-destructive/10 hover:text-destructive">
              Reset Conversation
            </Button>
          )}
        </div>

        <Conversation className="flex-1 min-h-0 border-t-0 bg-background/50 backdrop-blur-sm">
          <ConversationContent className="gap-4 p-6" scrollClassName="[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/40 [&::-webkit-scrollbar-thumb]:rounded-full">
            {!canTest ? (
              <ConversationEmptyState icon={<AlertCircle className="size-12 text-muted-foreground/50" />} title="Agent Unavailable" description={!isAgentEnabled ? "Enable the agent to test it." : "Generate your portfolio content first to test it."} />
            ) : chatMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center"><p className="text-sm font-medium text-muted-foreground">Start chatting to test your agent</p></div>
            ) : (
              chatMessages.map((message, index) => (
                <Message key={index} from={message.role}>
                  <MessageContent className="text-sm max-w-[85%] break-words shadow-sm">{message.role === "assistant" ? <MessageResponse>{message.content}</MessageResponse> : <span>{message.content}</span>}</MessageContent>
                </Message>
              ))
            )}
            {isChatLoading && <Message from="assistant"><MessageContent className="text-sm text-muted-foreground shadow-sm"><Shimmer>•••</Shimmer></MessageContent></Message>}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (canTest && chatInput.trim() && !isChatLoading) {
              sendTestMessage(event);
            }
          }}
          className="shrink-0 border-t border-border p-4 bg-background"
        >
          <InputGroup className="shadow-md border-primary/20 focus-within:border-primary/40 transition-colors rounded-xl overflow-hidden">
            <InputGroupTextarea
              placeholder={canTest ? "Ask something as a visitor..." : "Agent unavailable"}
              className="min-h-[56px] max-h-32 text-sm border-0 focus-visible:ring-0 bg-transparent py-4"
              rows={1}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              disabled={!canTest || isChatLoading}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (canTest && chatInput.trim() && !isChatLoading) {
                    sendTestMessage(e as any);
                  }
                }
              }}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton type="submit" variant="default" size="icon-sm" disabled={!canTest || !chatInput.trim() || isChatLoading}>
                {isChatLoading ? <Loader2 className="size-4 animate-spin" /> : <ArrowUpIcon className="size-4" />}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </form>
      </Card>
    </div>
  );
}
