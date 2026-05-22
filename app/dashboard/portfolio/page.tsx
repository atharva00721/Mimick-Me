import { getSession } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { getDashboardData } from "../_lib/get-dashboard-data";
import { PortfolioClient } from "./portfolio-client";
import type { PortfolioContent } from "../actions";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";

export default async function PortfolioPage() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/auth/signin");

  const data = await getDashboardData();
  if (!data?.portfolio) redirect("/onboarding");

  const { portfolio } = data;

  const userRecord = await db.select({ plan: users.plan }).from(users).where(eq(users.id, session.user.id)).limit(1);
  const plan = userRecord[0]?.plan || "free";

  const content = portfolio.content as PortfolioContent | null;

  return (
    <PortfolioClient
      portfolio={{
        handle: portfolio.handle,
        subdomain: portfolio.subdomain,
        isPublished: portfolio.isPublished,
        template: portfolio.template,
        updatedAt: portfolio.updatedAt.toISOString(),
      }}
      plan={plan}
      content={content}
    />
  );
}
