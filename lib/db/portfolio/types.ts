export type PortfolioTone = "Professional" | "Friendly" | "Bold" | "Minimal";

export interface PortfolioProjectInput {
  title: string;
  description: string;
}

export interface PortfolioOnboardingData {
  setupPath?: "existing-site" | "build-new";
  name: string;
  title: string;
  bio: string;
  services: string[];
  projects?: PortfolioProjectInput[];
  siteUrl?: string;
  targetAudience?: string;
  contactPreferences?: string;
  faqs?: string[];
  tone: PortfolioTone;
  handle: string;
}

export interface CreatePortfolioInput {
  userId: string;
  handle: string;
  name?: string;
  onboardingData: PortfolioOnboardingData;
}
