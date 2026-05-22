import { getSession } from "@/lib/auth/server";
import { getProfileById } from "@/lib/db";
import { PricingClient } from "./pricing-client";
import { redirect } from "next/navigation";

export default async function PricingPage() {
    const session = await getSession();
    if (!session?.user?.id) redirect("/auth/signin");

    const profile = await getProfileById(session.user.id);
    const currentPlan = profile?.plan || "free";

    return <PricingClient currentPlan={currentPlan} />;
}

