import { getSession } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { getDashboardData } from "../_lib/get-dashboard-data";
import { DomainsClient } from "./domains-client";
import { getProfileById } from "@/lib/db";
import { canUsePortfolioSubdomain } from "@/lib/billing";

export default async function DomainsPage() {
    const session = await getSession();
    if (!session?.user?.id) redirect("/auth/signin");

    const [data, profile, canUseSubdomain] = await Promise.all([
        getDashboardData(),
        getProfileById(session.user.id),
        canUsePortfolioSubdomain(session.user.id),
    ]);

    if (!data?.portfolio) redirect("/onboarding");

    return (
        <DomainsClient
            portfolio={{
                subdomain: data.portfolio.subdomain || "",
            }}
            canUseSubdomain={canUseSubdomain}
        />
    );
}
