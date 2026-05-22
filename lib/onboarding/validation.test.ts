import { describe, expect, it } from "bun:test";
import type { OnboardingData } from "@/lib/onboarding/types";
import { validateFinalOnboardingState } from "@/lib/onboarding/validation";

const baseState: Partial<OnboardingData> = {
  setupPath: "build-new",
  name: "Avery Stone",
  selectedSections: {
    hero: true,
    about: true,
    services: false,
    projects: false,
    cta: true,
    socials: false,
  },
  title: "Product Designer",
  bio: "I design practical product experiences for focused software teams.",
  tone: "Friendly",
  handle: "avery-stone",
};

describe("validateFinalOnboardingState", () => {
  it("allows services and projects to be omitted when their sections are disabled", () => {
    const parsed = validateFinalOnboardingState(baseState);

    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;

    expect(parsed.value.services).toEqual([]);
    expect(parsed.value.projects).toEqual([]);
    expect(parsed.value.sections).not.toContain("services");
    expect(parsed.value.sections).not.toContain("projects");
  });

  it("requires services when the services section is enabled", () => {
    const parsed = validateFinalOnboardingState({
      ...baseState,
      selectedSections: {
        ...baseState.selectedSections!,
        services: true,
      },
    });

    expect(parsed).toEqual({ ok: false, message: "Missing onboarding field: services" });
  });
});
