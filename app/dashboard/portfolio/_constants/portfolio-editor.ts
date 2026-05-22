import type { SocialPlatform } from "@/lib/validation/portfolio-schema";

export const PORTFOLIO_EDITOR_TABS = [
  { key: "hero", label: "Hero Section" },
  { key: "about", label: "About Me" },
  { key: "services", label: "My Services" },
  { key: "projects", label: "Projects" },
  { key: "products", label: "Products" },
  { key: "history", label: "Work History" },
  { key: "testimonials", label: "Testimonials" },
  { key: "faq", label: "FAQ / Support" },
  { key: "gallery", label: "Media Gallery" },
  { key: "cta", label: "Call to Action" },
  { key: "socials", label: "Social Links" },
] as const;

export const AVAILABLE_SOCIAL_PLATFORMS: { platform: SocialPlatform; label: string }[] = [
  { platform: "twitter", label: "Twitter/X" },
  { platform: "linkedin", label: "LinkedIn" },
  { platform: "github", label: "GitHub" },
  { platform: "instagram", label: "Instagram" },
  { platform: "youtube", label: "YouTube" },
  { platform: "facebook", label: "Facebook" },
  { platform: "website", label: "Website" },
];
