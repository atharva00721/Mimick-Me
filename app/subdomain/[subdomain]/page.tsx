import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ModernTemplate } from "@/components/templates/modern-template";
import { VeilTemplate } from "@/components/templates/veil-template";
import { BoldTemplate } from "@/components/templates/bold-template";
import { EditorialTemplate } from "@/components/templates/editorial-template";
import { LandingTemplate } from "@/components/templates/landing-template";
import { GalleryTemplate } from "@/components/templates/gallery-template";
import { MinimalTemplate } from "@/components/templates/minimal-template";
import { InteractiveTemplate } from "@/components/templates/interactive-template";
import { StudioTemplate } from "@/components/templates/studio-template";
import { PersonalTemplate } from "@/components/templates/personal-template";
import { getPublishedPortfolioWithAgentBySubdomain } from "@/lib/db/portfolio";
import { validatePortfolioContent } from "@/lib/validation/portfolio-schema";
import { AgentWidget } from "@/components/agent-widget";
import { AnalyticsTracker } from "@/components/analytics-tracker";
import { MadeWithBadge } from "@/components/made-with-badge";

const SUBDOMAIN_REGEX = /^[a-z0-9-]{3,30}$/;

interface PublicSubdomainPageProps {
  params: Promise<{ subdomain: string }>;
}

export async function generateMetadata({ params }: PublicSubdomainPageProps): Promise<Metadata> {
  const { subdomain } = await params;

  if (!SUBDOMAIN_REGEX.test(subdomain)) {
    return {};
  }

  const portfolio = await getPublishedPortfolioWithAgentBySubdomain(subdomain);
  if (!portfolio || !portfolio.content) {
    return {};
  }

  const content = validatePortfolioContent(portfolio.content);
  const title = content.hero.headline;
  const description = content.about.paragraph.slice(0, 150);
  const baseDomain = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || process.env.NEXT_PUBLIC_APP_URL || "localhost:3000").replace(/^https?:\/\//, "").replace(/^www\./, "");
  const canonical = `https://${subdomain}.${baseDomain}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical,
    },
  };
}

export default async function PublicSubdomainPage({ params }: PublicSubdomainPageProps) {
  const { subdomain } = await params;

  if (!SUBDOMAIN_REGEX.test(subdomain)) {
    notFound();
  }

  const portfolio = await getPublishedPortfolioWithAgentBySubdomain(subdomain);

  if (!portfolio || !portfolio.content) {
    notFound();
  }

  let content;
  try {
    content = validatePortfolioContent(portfolio.content);
  } catch {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background">
      <AnalyticsTracker handle={portfolio.handle} />
      {portfolio.template === "landing" ? (
        <LandingTemplate content={content} />
      ) : portfolio.template === "veil" ? (
        <VeilTemplate content={content} />
      ) : portfolio.template === "bold" ? (
        <BoldTemplate content={content} />
      ) : portfolio.template === "editorial" ? (
        <EditorialTemplate content={content} />
      ) : portfolio.template === "gallery" ? (
        <GalleryTemplate content={content} />
      ) : portfolio.template === "minimal" ? (
        <MinimalTemplate content={content} />
      ) : portfolio.template === "interactive" ? (
        <InteractiveTemplate content={content} />
      ) : portfolio.template === "studio" ? (
        <StudioTemplate content={content} />
      ) : portfolio.template === "personal" ? (
        <PersonalTemplate content={content} />
      ) : (
        <ModernTemplate content={content} />
      )}
      {portfolio.agentIsEnabled ? (
        <AgentWidget
          handle={portfolio.handle}
          agentName={portfolio.agentDisplayName ?? "AI Assistant"}
          avatarUrl={portfolio.agentAvatarUrl ?? null}
          roleLabel={portfolio.agentRoleLabel ?? null}
          intro={portfolio.agentIntro ?? null}
        />
      ) : null}
      {portfolio.plan === "free" && <MadeWithBadge />}
    </main>
  );
}
