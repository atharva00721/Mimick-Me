import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, AlertCircle, Globe, Activity, Users, TrendingUp, RefreshCw } from "lucide-react";
import Link from "next/link";
import { CopyButton } from "@/components/dashboard/copy-button";
import { redirect } from "next/navigation";
import { getDashboardOverviewData } from "./_lib/dashboard-overview-service";



export default async function OverviewPage() {
  const overview = await getDashboardOverviewData();
  if (!overview.session?.user?.id) redirect("/auth/signin");

  if (!overview.data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <AlertCircle className="size-12 text-muted-foreground" />
        <h2 className="text-xl">No Portfolio Found</h2>
        <p className="text-muted-foreground text-center max-w-sm">
          You need to complete onboarding first to set up your portfolio and AI agent.
        </p>
        <Button asChild>
          <Link href="/onboarding">Start Onboarding</Link>
        </Button>
      </div>
    );
  }

  const { data, profile, hasContent, modelLabel, newLeads, portfolioLink, totalLeads, analytics7d, dailyAnalytics, session } = overview;
  const { portfolio, agent } = data;

  const appBaseUrl = (process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const normalizedPortfolioLink = portfolioLink.startsWith("/") ? portfolioLink : `/${portfolioLink}`;
  const fullPortfolioUrl = `${appBaseUrl}${normalizedPortfolioLink}`;

  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Welcome Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Overview
        </h1>
        <p className="text-muted-foreground text-lg">
          Welcome back, <span className="font-medium text-foreground">{profile?.name || session.user.name || "there"}!</span> Here&apos;s your dashboard at a glance.
        </p>
      </div>

      {/* Warning banners */}
      {!hasContent && (
        <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4 flex items-start gap-3">
          <div>
            <p className="text-sm font-medium">Portfolio content not generated yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Head to the Portfolio page to generate your content with AI before publishing.
            </p>
            <Button variant="outline" size="sm" className="mt-2" asChild>
              <Link href="/dashboard/portfolio">Generate Content</Link>
            </Button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Portfolio */}
        <div className="flex items-center gap-3 rounded-lg border border-border bg-transparent px-4 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <Globe className="size-4" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">Portfolio</span>
              <span className="text-xs text-muted-foreground">
                {portfolio?.isPublished ? "Published" : "Draft"}
              </span>
            </div>
            <span className="text-xs text-muted-foreground capitalize mt-0.5">
              Template: {portfolio?.template}
            </span>
          </div>
        </div>

        {/* AI Agent */}
        <div className="flex items-center gap-3 rounded-lg border border-border bg-transparent px-4 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <Activity className="size-4" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">AI Agent</span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className={`h-1.5 w-1.5 rounded-full ${agent?.isEnabled ? "bg-emerald-500" : "bg-muted-foreground/40"}`} />
                {agent?.isEnabled ? "Enabled" : "Disabled"}
              </span>
            </div>
            <span className="text-xs text-muted-foreground truncate max-w-[120px] mt-0.5">
              {modelLabel}
            </span>
          </div>
        </div>

        {/* Total Leads */}
        <div className="flex items-center gap-3 rounded-lg border border-border bg-transparent px-4 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <Users className="size-4" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">Total Leads</span>
            </div>
            <span className="text-sm font-semibold text-foreground mt-0.5">
              {totalLeads}
            </span>
          </div>
        </div>

        {/* New Leads */}
        <div className="flex items-center gap-3 rounded-lg border border-border bg-transparent px-4 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <TrendingUp className="size-4" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">New Leads</span>
              <span className="text-[10px] text-muted-foreground bg-muted/50 px-1.5 rounded">7d</span>
            </div>
            <span className="text-sm font-semibold text-foreground mt-0.5">
              {newLeads}
            </span>
          </div>
        </div>
      </div>

      {/* Minimal analytics (7d) */}
      <Card className="border-muted/60 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="flex flex-col gap-1">
            <CardTitle className="text-base font-semibold">Analytics Overview</CardTitle>
            <CardDescription>Performance metrics for the last 7 days</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-1 md:grid-cols-3 divide-y md:divide-y-0 rounded-lg p-1">
            <div className="flex flex-col items-center justify-center p-4 text-center group transition-colors hover:bg-muted/50 rounded-md">
              <p className="text-3xl font-bold tracking-tight">{analytics7d?.totalPageViews.toLocaleString() ?? 0}</p>
              <p className="text-sm text-muted-foreground mt-1 font-medium">Page views</p>
            </div>
            <div className="flex flex-col items-center justify-center p-4 text-center group transition-colors hover:bg-muted/50 rounded-md">
              <p className="text-3xl font-bold tracking-tight">{analytics7d?.totalChatSessions.toLocaleString() ?? 0}</p>
              <p className="text-sm text-muted-foreground mt-1 font-medium">Chat sessions</p>
            </div>
            <div className="flex flex-col items-center justify-center p-4 text-center group transition-colors hover:bg-muted/50 rounded-md">
              <p className="text-3xl font-bold tracking-tight">{analytics7d?.uniqueVisitors.toLocaleString() ?? 0}</p>
              <p className="text-sm text-muted-foreground mt-1 font-medium">Unique visitors</p>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" asChild>
              <Link href="/dashboard/analytics">
                View detailed analytics <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Agent info */}
      {agent && (
        <Card className="border-muted/60 shadow-sm">
          <CardHeader className="bg-muted/10 border-b">
            <div>
              <CardTitle className="text-base font-semibold">Agent Configuration</CardTitle>
              <CardDescription>Current AI agent settings at a glance</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-1.5 p-3 rounded-lg bg-muted/20 border border-muted/50 transition-colors hover:bg-muted/40">
                <p className="text-xs text-muted-foreground font-medium">Model</p>
                <p className="text-sm font-semibold truncate" title={modelLabel}>{modelLabel}</p>
              </div>
              <div className="space-y-1.5 p-3 rounded-lg bg-muted/20 border border-muted/50 transition-colors hover:bg-muted/40">
                <p className="text-xs text-muted-foreground font-medium">Behavior</p>
                <p className="text-sm font-semibold capitalize truncate">
                  {agent.behaviorType || "Custom"} · {agent.strategyMode || "consultative"}
                </p>
              </div>
              <div className="space-y-1.5 p-3 rounded-lg bg-muted/20 border border-muted/50 transition-colors hover:bg-muted/40">
                <p className="text-xs text-muted-foreground font-medium">Temperature</p>
                <p className="text-sm font-semibold">{agent.temperature.toFixed(1)}</p>
              </div>
              <div className="space-y-1.5 p-3 rounded-lg bg-muted/20 border border-muted/50 transition-colors hover:bg-muted/40">
                <p className="text-xs text-muted-foreground font-medium">Status</p>
                <div className="flex items-center gap-2">
                  <div className={`size-2 rounded-full ${agent.isEnabled ? 'bg-emerald-500' : 'bg-muted-foreground'}`} />
                  <p className="text-sm font-semibold">{agent.isEnabled ? "Active" : "Disabled"}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-muted/60 shadow-sm flex flex-col h-full">
          <CardHeader>
            <CardTitle className="text-base font-semibold mb-1">Public Portfolio</CardTitle>
            <CardDescription>Share your unique portfolio link with prospects</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-end">
            <div className="flex flex-col gap-3">
              <div className="relative aspect-video rounded-lg border bg-linear-to-br from-muted/50 to-muted/30 overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-blue-500/5" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-sm font-medium text-muted-foreground">Portfolio Preview</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">Live at your public link</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-1.5 bg-muted/50 rounded-lg border border-muted">
                <div className="flex-1 min-w-0 px-3 py-2 rounded-md text-sm truncate font-mono bg-background border shadow-sm select-all">
                  {fullPortfolioUrl}
                </div>
                <CopyButton text={fullPortfolioUrl} />
              </div>
              <Button variant="outline" className="w-full bg-background" asChild>
                <a href={fullPortfolioUrl} target="_blank" rel="noopener noreferrer">
                  Open in new tab <ArrowRight className="ml-2 size-4" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-muted/60 shadow-sm flex flex-col h-full">
          <CardHeader>
            <CardTitle className="text-base font-semibold mb-1">Quick Actions</CardTitle>
            <CardDescription>Jump straight to key sections of your dashboard</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-end">
            <div className="grid gap-2 sm:grid-cols-1">
              <Button variant="outline" className="justify-between h-12 bg-background hover:bg-muted/50 transition-colors group" asChild>
                <Link href="/dashboard/portfolio">
                  <span className="font-medium">Edit Portfolio</span>
                  <ArrowRight className="size-4 text-muted-foreground group-hover:text-foreground transition-colors group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button variant="outline" className="justify-between h-12 bg-background hover:bg-muted/50 transition-colors group" asChild>
                <Link href="/dashboard/agent">
                  <span className="font-medium">Configure Agent</span>
                  <ArrowRight className="size-4 text-muted-foreground group-hover:text-foreground transition-colors group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button variant="outline" className="justify-between h-12 bg-background hover:bg-muted/50 transition-colors group" asChild>
                <Link href="/dashboard/portfolio">
                  <span className="font-medium">Sync from Website</span>
                  <RefreshCw className="size-4 text-muted-foreground group-hover:text-foreground transition-colors group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button variant="outline" className="justify-between h-12 bg-background hover:bg-muted/50 transition-colors group" asChild>
                <Link href="/dashboard/leads">
                  <span className="font-medium">View Leads</span>
                  <ArrowRight className="size-4 text-muted-foreground group-hover:text-foreground transition-colors group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
