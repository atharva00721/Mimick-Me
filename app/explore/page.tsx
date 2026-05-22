import type { Metadata } from "next";
import Link from "next/link";
import { getAllPublishedPortfolios } from "@/lib/db/portfolio";
import { Card, CardContent } from "@/components/ui/card";
import { HeroHeader } from "@/components/header";
import { ArrowRight, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Explore Portfolios",
  description: "Discover portfolios built with Mimick.me. Browse creators, designers, developers, and more.",
  alternates: { canonical: "/explore" },
  openGraph: {
    title: "Explore Portfolios",
    description: "Discover portfolios built with Mimick.me. Browse creators, designers, developers, and more.",
    url: "/explore",
    type: "website",
  },
};

export default async function ExplorePage() {
  const portfolios = await getAllPublishedPortfolios();

  const withContent = portfolios.filter((p) => {
    const content = p.content as { hero?: { headline?: string; subheadline?: string }; about?: { paragraph?: string } } | null;
    return content && (content.hero?.headline || content.about?.paragraph);
  });

  return (
    <div className="min-h-screen bg-background">
      <HeroHeader />
      <main className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <div className="mb-16">
          <h1 className="text-balance font-serif text-4xl font-medium sm:text-5xl text-foreground">
            Explore Portfolios
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Discover creators, designers, developers, and professionals showcasing their work with AI-powered portfolios.
          </p>
        </div>

        {withContent.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-16 text-center">
            <Sparkles className="mx-auto size-12 text-muted-foreground/50" />
            <h2 className="mt-4 text-xl font-medium text-foreground">No portfolios yet</h2>
            <p className="mt-2 text-muted-foreground">
              Be the first to publish and share your portfolio with the world.
            </p>
            <Link
              href="/auth/signup"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Get Started
              <ArrowRight className="size-4" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {withContent.map((portfolio) => {
              const content = portfolio.content as {
                hero?: { headline?: string; subheadline?: string };
                about?: { paragraph?: string };
              };
              const headline = content?.hero?.headline ?? content?.about?.paragraph?.slice(0, 60) ?? "Portfolio";
              const subheadline = content?.hero?.subheadline ?? content?.about?.paragraph?.slice(0, 120) ?? "";
              const templateLabel = portfolio.template.charAt(0).toUpperCase() + portfolio.template.slice(1);

              return (
                <Link key={portfolio.handle} href={`/${portfolio.handle}`} className="group block">
                  <Card className="h-full transition-all duration-200 hover:shadow-xl hover:shadow-foreground/5 group-hover:-translate-y-0.5">
                    <CardContent className="p-6">
                      <span className="inline-block rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                        {templateLabel}
                      </span>
                      <h3 className="mt-3 line-clamp-2 font-semibold text-foreground group-hover:text-primary">
                        {headline}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                        {subheadline}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                        View portfolio
                        <ArrowRight className="size-4" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
