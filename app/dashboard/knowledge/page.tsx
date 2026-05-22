import { getSession } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { KnowledgeClient } from "./knowledge-client";

export default async function KnowledgePage() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/auth/signin");
  }

  return <KnowledgeClient />;
}
