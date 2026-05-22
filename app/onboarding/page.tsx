import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/server";
import { OnboardingExpressFlow } from "@/app/onboarding/onboarding-express-flow";
import { checkPortfolioLimit } from "@/lib/billing";

export default async function OnboardingPage() {
  const session = await getSession();
  if (!session?.user?.id) {
    redirect("/auth/signin?callbackUrl=/onboarding");
  }

  // Enforce portfolio limits server-side
  const limitCheck = await checkPortfolioLimit(session.user.id);
  if (!limitCheck.allowed) {
    redirect("/dashboard?error=limit_reached");
  }

  return <OnboardingExpressFlow />;
}
