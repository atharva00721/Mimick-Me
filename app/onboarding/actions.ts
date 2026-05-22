"use server";

import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/server";
import {
  createPortfolio,
  getPortfolioByHandle,
  type PortfolioOnboardingData,
  type PortfolioTone,
} from "@/lib/db/portfolio";
import { validateHandle } from "@/lib/validation/handle";

const allowedTones: PortfolioTone[] = [
  "Professional",
  "Friendly",
  "Bold",
  "Minimal",
];

function parseProjects(formData: FormData) {
  const projects = [1, 2, 3]
    .map((index) => ({
      title: String(formData.get(`projectTitle${index}`) ?? "").trim(),
      description: String(formData.get(`projectDescription${index}`) ?? "").trim(),
    }))
    .filter((project) => project.title || project.description);

  const hasInvalidProject = projects.some(
    (project) => !project.title || !project.description
  );

  return { projects, hasInvalidProject };
}

function onboardingError(message: string) {
  return redirect(`/onboarding?error=${encodeURIComponent(message)}`);
}

export async function submitOnboardingForm(formData: FormData) {
  const session = await getSession();
  if (!session?.user?.id) {
    redirect("/auth/signin?callbackUrl=/onboarding");
  }

  const handleInput = String(formData.get("handle") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const servicesRaw = String(formData.get("services") ?? "");
  const tone = String(formData.get("tone") ?? "") as PortfolioTone;

  const handleValidation = validateHandle(handleInput);
  if (!handleValidation.ok) {
    onboardingError(handleValidation.message);
  }
  const handle = (handleValidation as { ok: true; value: string }).value;

  const services = servicesRaw
    .split(",")
    .map((service) => service.trim())
    .filter(Boolean);

  const { projects, hasInvalidProject } = parseProjects(formData);

  if (
    !name ||
    !title ||
    !bio ||
    services.length === 0 ||
    hasInvalidProject ||
    projects.length < 2 ||
    projects.length > 3 ||
    !allowedTones.includes(tone)
  ) {
    onboardingError("Please complete all required fields correctly.");
  }

  const takenPortfolio = await getPortfolioByHandle(handle);
  if (takenPortfolio) {
    onboardingError("This handle is already taken. Please choose another one.");
  }

  const onboardingData: PortfolioOnboardingData = {
    name,
    title,
    bio,
    services,
    projects,
    tone,
    handle,
  };

  const created = await createPortfolio({
    userId: session.user.id,
    handle,
    onboardingData,
  });

  if (!created.ok && created.reason === "db_error") {
    redirect("/dashboard");
  }

  if (!created.ok) {
    onboardingError("Unable to save onboarding data right now. Please try again.");
  }

  redirect("/dashboard/preview");
}
