import { getSession } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { getDashboardData } from "../_lib/get-dashboard-data";
import { SettingsClient } from "./settings-client";
import { getProfileById } from "@/lib/db";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/auth/signin");

  const [data, profile] = await Promise.all([
    getDashboardData(),
    getProfileById(session.user.id),
  ]);

  if (!data?.portfolio) redirect("/onboarding");

  return (
    <SettingsClient
      user={{
        email: session.user.email || "",
        name: profile?.name || session.user.name || "",
        image: profile?.image || null,
        plan: profile?.plan || "free",
        credits: profile?.credits ?? 0,
      }}
      portfolio={{
        handle: data.portfolio.handle,
      }}
    />
  );
}
