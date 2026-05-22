import { z } from "zod";
import {
  getDefaultVisibleSections,
  mergeVisibleSections,
  PORTFOLIO_SECTION_REGISTRY,
  type PortfolioSectionKey,
} from "@/lib/portfolio/section-registry";

export type SocialPlatform = "twitter" | "linkedin" | "github" | "instagram" | "youtube" | "facebook" | "website";

export type SocialLink = {
  platform: SocialPlatform;
  enabled: boolean;
  url: string;
};

export type PortfolioContent = {
  name?: string;
  hero: {
    headline: string;
    subheadline: string;
    ctaText: string;
  };
  about: {
    paragraph: string;
    avatarUrl?: string;
  };
  services: {
    title: string;
    description: string;
  }[];
  projects: {
    title: string;
    description: string;
    result: string;
  }[];
  products?: {
    title: string;
    description: string;
    price: string;
    url: string;
    image: string;
  }[];
  history?: {
    role: string;
    company: string;
    period: string;
    description: string;
  }[];
  testimonials?: {
    quote: string;
    author: string;
    role: string;
  }[];
  faq?: {
    question: string;
    answer: string;
  }[];
  gallery?: {
    url: string;
    caption: string;
  }[];
  cta: {
    headline: string;
    subtext: string;
  };
  socialLinks: SocialLink[];
  visibleSections: PortfolioSectionKey[];
};

export const defaultVisibleSections = {
  hero: true,
  about: true,
  services: true,
  projects: true,
  cta: true,
  socials: true,
};

const serviceSchema = z
  .object({
    title: z.string().min(1),
    description: z.string().min(1),
  })
  .strict();

const projectSchema = z
  .object({
    title: z.string().min(1),
    description: z.string().min(1),
    result: z.string().min(1),
  })
  .strict();

const productSchema = z
  .object({
    title: z.string().min(1),
    description: z.string().min(1),
    price: z.string(),
    url: z.string(),
    image: z.string(),
  })
  .strict();

const historySchema = z
  .object({
    role: z.string().min(1),
    company: z.string().min(1),
    period: z.string(),
    description: z.string().min(1),
  })
  .strict();

const testimonialSchema = z
  .object({
    quote: z.string().min(1),
    author: z.string().min(1),
    role: z.string(),
  })
  .strict();

const faqSchema = z
  .object({
    question: z.string().min(1),
    answer: z.string().min(1),
  })
  .strict();

const gallerySchema = z
  .object({
    url: z.string().url(),
    caption: z.string(),
  })
  .strict();


const portfolioSectionKeySchema = z.enum(
  PORTFOLIO_SECTION_REGISTRY.map((section) => section.key) as [
    PortfolioSectionKey,
    ...PortfolioSectionKey[]
  ]
);

const socialLinkSchema = z
  .object({
    platform: z.enum(["twitter", "linkedin", "github", "instagram", "youtube", "facebook", "website"]),
    enabled: z.boolean(),
    url: z.string().url(),
  })
  .strict();

const portfolioContentSchema = z
  .object({
    name: z.string().optional(),
    hero: z
      .object({
        headline: z.string().min(1),
        subheadline: z.string().min(1),
        ctaText: z.string().min(1),
      })
      .strict(),
    about: z
      .object({
        paragraph: z.string().min(1),
        avatarUrl: z.string().optional(),
      })
      .strict(),
    services: z.array(serviceSchema),
    projects: z.array(projectSchema),
    products: z.array(productSchema).optional().default([]),
    history: z.array(historySchema).optional().default([]),
    testimonials: z.array(testimonialSchema).optional().default([]),
    faq: z.array(faqSchema).optional().default([]),
    gallery: z.array(gallerySchema).optional().default([]),
    cta: z
      .object({
        headline: z.string().min(1),
        subtext: z.string().min(1),
      })
      .strict(),
    socialLinks: z.array(socialLinkSchema).default([]),
    visibleSections: z.array(portfolioSectionKeySchema).default(getDefaultVisibleSections()),
  })
  .strict();

export function validatePortfolioContent(data: unknown): PortfolioContent {
  const parsed = portfolioContentSchema.safeParse(data);

  if (!parsed.success) {
    throw new Error(`Invalid portfolio content: ${parsed.error.issues[0]?.message ?? "unknown error"}`);
  }

  return {
    ...parsed.data,
    visibleSections: mergeVisibleSections(parsed.data.visibleSections, getDefaultVisibleSections()),
  };
}
