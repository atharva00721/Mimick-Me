import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/server";
import { AppSidebar } from "./app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { getProfileById } from "@/lib/db";
import { getActivePortfolio, getAllPortfolios } from "@/lib/active-portfolio";
import { PortfolioProvider } from "@/lib/providers/portfolio-provider";
import { db } from "@/lib/db";
import { agentLeads } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { NotificationSheet } from "@/components/leads/NotificationSheet";
import { Badge } from "../ui/badge";
import { NavUser } from "./nav-user";

function subjectFromLead(input: { conversationSummary?: string | null; projectDetails?: string | null }) {
  const source = (input.conversationSummary ?? input.projectDetails ?? "").trim();
  if (!source) return null;
  const cleaned = source.replace(/\s+/g, " ").trim();
  return cleaned.length > 90 ? `${cleaned.slice(0, 90)}…` : cleaned;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export async function DashboardLayout({ children }: DashboardLayoutProps) {
  let session = null;
  try {
    session = await getSession();
  } catch {
    redirect("/auth/signin");
  }

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const userId = session.user.id!;

  // Fetch everything in parallel
  const [profile, allPortfolios, activePortfolio] = await Promise.all([
    getProfileById(userId),
    getAllPortfolios(userId),
    getActivePortfolio(userId),
  ]);

  // Serialisable summary shape for the client store
  const portfolioSummaries = allPortfolios.map((p) => ({
    id: p.id,
    name: p.name,
    handle: p.handle,
    isPublished: p.isPublished,
  }));

  const fetchedLeads = activePortfolio
    ? await db
      .select()
      .from(agentLeads)
      .where(eq(agentLeads.portfolioId, activePortfolio.id))
      .orderBy(desc(agentLeads.createdAt))
    : [];

  const formattedLeads = fetchedLeads.map((lead) => ({
    credits: profile?.credits ?? 0,
    id: lead.id,
    name: lead.name,
    email: lead.email,
    budget: lead.budget,
    confidence: lead.confidence,
    isRead: lead.isRead ?? false,
    createdAt: lead.createdAt.toISOString(),
    subject: subjectFromLead({
      conversationSummary: lead.conversationSummary,
      projectDetails: lead.projectDetails,
    }),
  }));

  return (
    <SidebarProvider>
      {/*
        PortfolioProvider hydrates the Zustand store once with server data.
        Any client component inside the dashboard can call usePortfolioStore()
        without any prop drilling.
      */}
      <PortfolioProvider
        portfolios={portfolioSummaries}
        activePortfolioId={activePortfolio?.id ?? ""}
      >
        <AppSidebar
          credits={profile?.credits ?? 0}
          plan={profile?.plan ?? "free"}
          userName={profile?.name ?? "User"}
          userEmail={session.user.email ?? ""}
          userImage={profile?.image}
        />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 " />
            <div className="flex flex-1 items-center justify-end">
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="flex p-4 items-center gap-2">
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-data-[collapsible=icon]:hidden">
                    {profile?.credits ?? 0}
                  </span>
                  <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 group-data-[collapsible=icon]:hidden">
                    Credits
                  </span>
                </Badge>
                <NotificationSheet leads={formattedLeads} />
                <NavUser user={{
                  name: profile?.name ?? "User",
                  email: session.user.email ?? "",
                  avatar: profile?.image,
                  plan: profile?.plan ?? "free",
                }} />
              </div>
            </div>
          </header>
          <main className="min-w-0 flex-1 p-4 md:p-6 lg:p-8 rounded-2xl">
            {children}
          </main>
        </SidebarInset>
      </PortfolioProvider>
    </SidebarProvider>
  );
}
