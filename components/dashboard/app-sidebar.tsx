"use client";

import * as React from "react";
import {
  BookText,
  Bot,
  LifeBuoy,
  Send,
  LayoutDashboard,
  Briefcase,
  Users,
  BarChart3,
  BrainCircuit,
  CreditCard,
  Globe,
} from "lucide-react";

import { NavMain } from "@/components/dashboard/nav-main";
import { NavProjects } from "@/components/dashboard/nav-projects";
import { NavSecondary } from "@/components/dashboard/nav-secondary";
import { NavUser } from "@/components/dashboard/nav-user";
import { PortfolioSwitcher } from "./portfolio-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePortfolioStore } from "@/lib/stores/portfolio-store";
import { usePathname } from "next/navigation";

interface AppSidebarProps {
  credits: number;
  plan: "free" | "pro" | "business";
  userName: string;
  userEmail: string;
  userImage?: string | null;
}

export function AppSidebar({ credits, plan, userName, userEmail, userImage }: AppSidebarProps) {
  const pathname = usePathname();
  const portfolios = usePortfolioStore((s) => s.portfolios);

  const data = {
    user: {
      name: userName,
      email: userEmail,
      avatar: userImage,
      plan: plan,
    },
    navMain: [
      {
        title: "Overview",
        url: "/dashboard",
        icon: LayoutDashboard,
        isActive: pathname === "/dashboard",
      },
      {
        title: "Portfolio",
        url: "/dashboard/portfolio",
        icon: Briefcase,
        isActive: pathname.startsWith("/dashboard/portfolio"),
      },
      {
        title: "Agent",
        url: "/dashboard/agent",
        icon: Bot,
        isActive: pathname.startsWith("/dashboard/agent"),
      },
      {
        title: "Leads",
        url: "/dashboard/leads",
        icon: Users,
        isActive: pathname.startsWith("/dashboard/leads"),
      },
      {
        title: "Analytics",
        url: "/dashboard/analytics",
        icon: BarChart3,
        isActive: pathname.startsWith("/dashboard/analytics"),
      },
      {
        title: "Insights",
        url: "/dashboard/insights",
        icon: BrainCircuit,
        isActive: pathname.startsWith("/dashboard/insights"),
      },
      {
        title: "Knowledge",
        url: "/dashboard/knowledge",
        icon: BookText,
        isActive: pathname.startsWith("/dashboard/knowledge"),
      },
      {
        title: "Domains",
        url: "/dashboard/domains",
        icon: Globe,
        isActive: pathname.startsWith("/dashboard/domains"),
      },
    ],
    projects: portfolios.map((p) => ({
      name: p.name,
      url: `/dashboard/portfolio/${p.id}`,
      icon: Briefcase,
    })),
    navSecondary: [
      // {
      //   title: "Support",
      //   url: "#",
      //   icon: LifeBuoy,
      // },
      {
        title: "Feedback",
        url: "mailto:atharva@gmail.com",
        icon: Send,
      },
      {
        title: "Pricing",
        url: "/dashboard/pricing",
        icon: CreditCard,
      },
    ],
  };

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <PortfolioSwitcher plan={plan} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter> */}
    </Sidebar>
  );
}
