import { generateObject } from "ai";
import { z } from "zod";
import { resolveChatModel } from "@/lib/ai/model-provider";

const tavilyApiKey = process.env.TAVILY_API_KEY;

const EnrichmentSchema = z.object({
  linkedInUrl: z.string().url().optional(),
  companySize: z.string().optional(),
  recentNews: z.string().optional(),
  bio: z.string().optional(),
});

export type LeadEnrichment = z.infer<typeof EnrichmentSchema>;

interface TavilyResult {
  title?: string;
  url?: string;
  content?: string;
}

interface TavilyResponse {
  results?: TavilyResult[];
}

function getEmailDomain(email: string): string | null {
  const domain = email.split("@")[1]?.trim().toLowerCase();
  return domain && domain.length > 0 ? domain : null;
}

async function runTavilySearch(searchQuery: string): Promise<TavilyResult[]> {
  if (!tavilyApiKey) {
    throw new Error("Missing required environment variable: TAVILY_API_KEY");
  }

  const res = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: tavilyApiKey,
      query: searchQuery,
      search_depth: "basic",
      max_results: 3,
    }),
  });

  if (!res.ok) {
    throw new Error(`Tavily search failed (${res.status}) for query: ${searchQuery}`);
  }

  const data = (await res.json()) as TavilyResponse;
  return data.results ?? [];
}

export async function enrichLeadData(
  email: string,
  name?: string
): Promise<LeadEnrichment | null> {
  try {
    const domain = getEmailDomain(email);
    if (!domain) {
      return null;
    }

    const isFreeEmail = [
      "gmail.com",
      "yahoo.com",
      "hotmail.com",
      "outlook.com",
      "aol.com",
      "icloud.com",
      "mail.com",
      "protonmail.com",
      "proton.me",
      "zoho.com",
    ].includes(domain.toLowerCase());

    const queries = [
      `${name ?? email} LinkedIn profile`,
    ];

    if (!isFreeEmail) {
      queries.push(`${domain} company size employees`);
      queries.push(`${domain} news 2024 OR 2025`);
    }

    const settled = await Promise.allSettled(queries.map((query) => runTavilySearch(query)));

    const contextParts = settled.flatMap((result, index) => {
      if (result.status === "fulfilled") {
        const lines = result.value.map((item, itemIndex) => {
          return [
            `[${itemIndex + 1}] Title: ${item.title ?? "Unknown"}`,
            `[${itemIndex + 1}] URL: ${item.url ?? "Unknown"}`,
            `[${itemIndex + 1}] Content: ${item.content ?? ""}`,
          ].join("\n");
        });

        return [`Query: ${queries[index]}`, ...lines].filter(Boolean);
      }

      console.error("Tavily search failed:", result.reason);
      return [];
    });

    if (contextParts.length === 0) {
      return null;
    }

    const model = resolveChatModel("google/gemini-3-flash");

    const { object } = await generateObject({
      model,
      schema: EnrichmentSchema,
      system:
        "Extract concise lead intelligence from search results. Return only supported fields. Use URLs only when high confidence.",
      prompt: [
        `Lead name: ${name ?? "Unknown"}`,
        `Lead email: ${email}`,
        isFreeEmail ? "Note: Lead uses a personal email address. Do not try to infer company information." : `Lead company domain: ${domain}`,
        "Search context:",
        contextParts.join("\n\n"),
      ].join("\n"),
    });

    return object;
  } catch (error) {
    console.error("Failed to enrich lead data:", error);
    return null;
  }
}

export { EnrichmentSchema };
