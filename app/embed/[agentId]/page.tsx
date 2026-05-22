import { validate as validateUuid } from "uuid";
import { notFound } from "next/navigation";
import { getPublicAgentById } from "@/lib/db/knowledge";
import { EmbedChatClient } from "./embed-chat-client";

interface EmbedPageProps {
  params: Promise<{ agentId: string }>;
}

export default async function EmbedAgentPage({ params }: EmbedPageProps) {
  const { agentId } = await params;

  if (!validateUuid(agentId)) {
    notFound();
  }

  const agent = await getPublicAgentById(agentId);
  if (!agent || !agent.isEnabled) {
    notFound();
  }

  return (
    <EmbedChatClient
      agentId={agentId}
      agentName={agent.displayName ?? "AI Assistant"}
      avatarUrl={agent.avatarUrl ?? null}
      roleLabel={agent.roleLabel ?? null}
      intro={agent.intro ?? null}
      plan={agent.plan}
    />
  );
}
