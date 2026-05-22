import { getSession } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { getDashboardData } from "../_lib/get-dashboard-data";
import { AgentClient } from "./agent-client";

export default async function AgentPage() {
  const session = await getSession();
  if (!session?.user) redirect("/auth/signin");

  const data = await getDashboardData();

  const portfolioHandle = data?.portfolio?.handle ?? "";
  const hasContent = !!data?.portfolio?.content;
  const isPortfolioPublished = !!data?.portfolio?.isPublished;

  return (
    <AgentClient
      agent={data?.agent ?? null}
      agentId={data?.agent?.id ?? null}
      plan={data?.plan ?? "free"}
      portfolioHandle={portfolioHandle}
      hasContent={hasContent}
      isPortfolioPublished={isPortfolioPublished}
    />
  );
}
