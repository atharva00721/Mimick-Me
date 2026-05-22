import { describe, expect, it } from "bun:test";

describe("dashboard structure wiring", () => {
  it("uses the current app/dashboard route paths for route-adjacent imports", async () => {
    const dashboardPage = await Bun.file("app/dashboard/page.tsx").text();
    const portfolioClient = await Bun.file("app/dashboard/portfolio/portfolio-client.tsx").text();
    const agentClient = await Bun.file("app/dashboard/agent/agent-client.tsx").text();

    expect(dashboardPage).toContain('"./_lib/dashboard-overview-service"');
    expect(portfolioClient).toContain('"./_hooks/use-portfolio-actions"');
    expect(agentClient).toContain('"./_hooks/use-agent-actions"');

    expect(dashboardPage).not.toContain('"@/app/(dashboard)/dashboard/');
    expect(portfolioClient).not.toContain('"@/app/(dashboard)/dashboard/');
    expect(agentClient).not.toContain('"@/app/(dashboard)/dashboard/');
  });
});
