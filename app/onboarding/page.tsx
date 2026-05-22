import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/server";
import { TraditionalOnboardingFlow } from "@/app/onboarding/traditional-onboarding-flow";
import { checkPortfolioLimit } from "@/lib/billing";

export default async function OnboardingPage() {
  const session = await getSession();
  if (!session?.user?.id) {
    redirect("/auth/signin?callbackUrl=/onboarding");
  }

  // Enforce portfolio limits server-side
  const limitCheck = await checkPortfolioLimit(session.user.id);
  if (!limitCheck.allowed) {
    // If they already have portfolios, redirect to dashboard. 
    // If they have 0, they should be allowed (limitCheck.allowed will be true if limit >= 1).
    redirect("/dashboard?error=limit_reached");
  }

  return <TraditionalOnboardingFlow />;
}
