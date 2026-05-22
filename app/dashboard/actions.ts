"use server";

import { getSession } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { portfolios } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getActivePortfolio } from "@/lib/active-portfolio";
import {
  getAgentByPortfolioId,
  getAgentByUserId,
  configureAgentForPortfolio,
  configureStandaloneAgent,
  type ConfigureAgentInput,
} from "@/lib/agent/configure";
import { generatePortfolio } from "@/lib/ai/generate-portfolio";
import { validateHandle } from "@/lib/validation/handle";
import { handlePublicChat, type PublicChatResult } from "@/lib/ai/public-chat-handler";
import { sanitizeHistory } from "@/lib/validation/public-chat";
import { validatePortfolioContent, type PortfolioContent as ValidatedPortfolioContent } from "@/lib/validation/portfolio-schema";
import { validateSubdomain } from "@/lib/validation/handle";
import { canUsePortfolioSubdomain } from "@/lib/billing";

import { mergeVisibleSections } from "@/lib/portfolio/section-registry";

export type PortfolioContent = ValidatedPortfolioContent;

async function requireAuth() {
  const session = await getSession();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

export async function getDashboardData() {
  const userId = await requireAuth();

  const portfolio = await getActivePortfolio(userId);

  if (!portfolio) {
    const agent = await getAgentByUserId(userId);
    return { portfolio: null, agent };
  }

  const portfolioAgent = await getAgentByPortfolioId(portfolio.id);
  const agent = portfolioAgent ?? (await getAgentByUserId(userId));

  return { portfolio, agent };
}
export async function togglePublish(publish: boolean) {
  const userId = await requireAuth();
  const portfolio = await getActivePortfolio(userId);
  if (!portfolio) throw new Error("Portfolio not found");

  if (publish) {
    if (!portfolio.content) throw new Error("Generate portfolio content first");
    await db.update(portfolios).set({
      isPublished: true,
      updatedAt: new Date(),
    }).where(eq(portfolios.id, portfolio.id));
  } else {
    await db.update(portfolios).set({
      isPublished: false,
      updatedAt: new Date(),
    }).where(eq(portfolios.id, portfolio.id));
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/portfolio");
}

export async function updateTemplate(template: string) {
  const userId = await requireAuth();
  const portfolio = await getActivePortfolio(userId);
  if (!portfolio) throw new Error("Portfolio not found");

  await db.update(portfolios).set({
    template,
    updatedAt: new Date(),
  }).where(eq(portfolios.id, portfolio.id));

  revalidatePath("/dashboard/portfolio");
}

export async function regeneratePortfolio() {
  const userId = await requireAuth();
  const portfolio = await getActivePortfolio(userId);
  if (!portfolio) throw new Error("Portfolio not found");

  const { consumeCredits, getCredits } = await import("@/lib/credits");
  const { calculateSectionCount } = await import("@/lib/portfolio/section-registry");

  const sectionCount = calculateSectionCount(
    (portfolio.content as { visibleSections?: unknown })?.visibleSections,
    (portfolio.onboardingData as { sections?: unknown })?.sections
  );
  const creditCost = Math.max(1, sectionCount);

  const currentCredits = await getCredits(userId);
  if (currentCredits < creditCost) {
    throw new Error(`Not enough credits. This action requires ${creditCost} credits.`);
  }

  await generatePortfolio(userId, portfolio.id);

  const creditsConsumed = await consumeCredits(userId, creditCost);
  if (!creditsConsumed) {
    throw new Error("Not enough credits to regenerate portfolio.");
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/portfolio");
}

export async function saveAgentConfig(input: ConfigureAgentInput) {
  const userId = await requireAuth();
  const portfolio = await getActivePortfolio(userId);

  const result = portfolio
    ? await configureAgentForPortfolio(userId, portfolio.id, input)
    : await configureStandaloneAgent(userId, input);

  if (!result.ok) {
    throw new Error(result.error);
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/agent");
}

export async function updateHandle(newHandle: string) {
  const userId = await requireAuth();
  const portfolio = await getActivePortfolio(userId);
  if (!portfolio) throw new Error("Portfolio not found");

  const validation = validateHandle(newHandle);
  if (!validation.ok) {
    throw new Error(validation.message);
  }

  const [existing] = await db.select({ id: portfolios.id })
    .from(portfolios)
    .where(eq(portfolios.handle, validation.value))
    .limit(1);

  if (existing && existing.id !== portfolio.id) {
    throw new Error("This handle is already taken");
  }

  await db.update(portfolios).set({
    handle: validation.value,
    updatedAt: new Date(),
  }).where(eq(portfolios.id, portfolio.id));

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
}


export async function updateSubdomain(newSubdomain: string) {
  const userId = await requireAuth();
  const portfolio = await getActivePortfolio(userId);
  if (!portfolio) throw new Error("Portfolio not found");

  const allowed = await canUsePortfolioSubdomain(userId);
  if (!allowed) {
    throw new Error("Subdomains are available on Pro and Agency plans.");
  }

  const normalizedSubdomain = newSubdomain.trim().toLowerCase();

  if (!normalizedSubdomain) {
    await db.update(portfolios).set({
      subdomain: null,
      updatedAt: new Date(),
    }).where(eq(portfolios.id, portfolio.id));

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/settings");
    return;
  }

  const validation = validateSubdomain(normalizedSubdomain);
  if (!validation.ok) {
    throw new Error(validation.message);
  }

  const { isSubdomainAvailable } = await import("@/lib/db/portfolio");
  const available = await isSubdomainAvailable(validation.value, portfolio.id);

  if (!available) {
    throw new Error("This subdomain is already taken");
  }

  await db.update(portfolios).set({
    subdomain: validation.value,
    updatedAt: new Date(),
  }).where(eq(portfolios.id, portfolio.id));

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
}

export async function updatePortfolioName(name: string) {
  const userId = await requireAuth();
  const portfolio = await getActivePortfolio(userId);
  if (!portfolio) throw new Error("Portfolio not found");

  const trimmed = name.trim();
  if (!trimmed || trimmed.length > 80) throw new Error("Invalid portfolio name");

  await db.update(portfolios).set({
    name: trimmed,
    updatedAt: new Date(),
  }).where(eq(portfolios.id, portfolio.id));

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
}

export async function updateProfile(data: { name?: string; image?: string }) {
  const userId = await requireAuth();
  const { users } = await import("@/lib/schema");

  const updateData: { name?: string; image?: string | null } = {};
  if (data.name !== undefined) {
    const trimmedName = data.name.trim();
    if (trimmedName) updateData.name = trimmedName.slice(0, 120);
  }
  if (data.image !== undefined) {
    updateData.image = data.image.trim() || null;
  }

  if (Object.keys(updateData).length === 0) return;

  await db.update(users).set({
    ...updateData,
    updatedAt: new Date(),
  }).where(eq(users.id, userId));

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
}

export async function chatWithAgent(body: {
  handle: string;
  message: string;
  history: { role: "user" | "assistant"; content: string }[];
  sessionId?: string | null;
}): Promise<PublicChatResult> {
  const userId = await requireAuth();
  return handlePublicChat({
    handle: body.handle,
    agentId: null,
    message: body.message,
    history: sanitizeHistory(body.history),
    sessionId: body.sessionId ?? null,
    ip: "dashboard",
    userId,
  });
}

export async function deleteActivePortfolio() {
  const userId = await requireAuth();
  const portfolio = await getActivePortfolio(userId);
  if (!portfolio) throw new Error("Portfolio not found");

  const { deletePortfolioById } = await import("@/lib/db/portfolio");
  const result = await deletePortfolioById(portfolio.id, userId);
  if (!result.ok) throw new Error("Failed to delete portfolio");

  revalidatePath("/dashboard");
}

export async function updatePortfolioContent(content: PortfolioContent) {
  const userId = await requireAuth();
  const portfolio = await getActivePortfolio(userId);
  if (!portfolio) throw new Error("Portfolio not found");

  const normalizedContent = validatePortfolioContent(content);

  await db.update(portfolios).set({
    content: normalizedContent,
    updatedAt: new Date(),
  }).where(eq(portfolios.id, portfolio.id));

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/portfolio");
}
