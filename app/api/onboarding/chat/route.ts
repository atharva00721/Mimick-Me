import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/server";
import { streamOnboardingChat } from "@/lib/ai/onboarding-agent";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { onboardingDrafts } from "@/lib/schema";
import { withDefaultSelectedSections, type OnboardingData } from "@/lib/onboarding/types";
import type { UIMessage } from "ai";
import { getFileBuffer, getKeyFromUrl } from "@/lib/storage/s3";
import { extractTextFromPdf } from "@/lib/knowledge/extract-pdf";
import { consumeCredits, getCredits } from "@/lib/credits";

export const maxDuration = 60;
const CREDIT_COST = 1;

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const messages = (body.messages ?? body.data ?? []) as UIMessage[];
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json(
      { error: "Messages are required", received: Object.keys(body) },
      { status: 400 }
    );
  }

  let collected: Partial<OnboardingData> = {};
  try {
    const [draft] = await db
      .select()
      .from(onboardingDrafts)
      .where(eq(onboardingDrafts.userId, session.user.id))
      .limit(1);

    collected = withDefaultSelectedSections((draft?.state as Partial<OnboardingData>) ?? {}) ?? {};
  } catch (dbError) {
    console.error("Onboarding draft fetch error (table may not exist):", dbError);
  }

  // ── Resume extraction via knowledge pipeline ──────────────────────────
  let resumeText: string | undefined;

  if (messages.length > 0) {
    const lastIndex = messages.length - 1;
    const lastMessage = messages[lastIndex];

    if (lastMessage.role === "user" && Array.isArray(lastMessage.parts)) {
      const textPartIndex = lastMessage.parts.findIndex(
        (p) =>
          p.type === "text" &&
          typeof p.text === "string" &&
          p.text.includes("[Attached Resume: pdf-url]")
      );

      if (textPartIndex !== -1) {
        const textPart = lastMessage.parts[textPartIndex];
        if (textPart && textPart.type === "text") {
          const resumeMatch = textPart.text.match(
            /\[Attached Resume: pdf-url\]\((https?:\/\/[^\)]+)\)/
          );

          if (resumeMatch) {
            const pdfUrl = resumeMatch[1];
            try {
              // 1. Download PDF buffer (try S3 key first, then public URL)
              let buffer: Buffer | null = null;
              const s3Key = getKeyFromUrl(pdfUrl);

              if (s3Key) {
                try {
                  buffer = await getFileBuffer(s3Key);
                } catch (s3Err) {
                  console.warn("S3 download failed, trying public URL:", s3Err);
                }
              }

              if (!buffer) {
                console.log(`[onboarding] S3 failed, fetching public URL: ${pdfUrl}`);
                const resp = await fetch(pdfUrl);
                if (resp.ok) {
                  buffer = Buffer.from(await resp.arrayBuffer());
                  console.log(`[onboarding] Public URL fetch succeeded, buffer size: ${buffer.length}`);
                } else {
                  console.warn(`[onboarding] Public URL fetch failed: ${resp.status} ${resp.statusText}`);
                }
              }

              // 2. Extract text from PDF using the existing knowledge pipeline
              if (buffer) {
                const extraction = await extractTextFromPdf(buffer);
                resumeText = extraction.text;
                console.log(
                  `[onboarding] Extracted ${resumeText.length} chars from resume (${extraction.pageCount} pages)`
                );
              } else {
                console.warn(`[onboarding] Buffer is null — resume will NOT be passed to the AI!`);
              }

              // 3. Strip the resume marker from the user message
              const newParts = [...lastMessage.parts];
              newParts[textPartIndex] = {
                ...textPart,
                text:
                  textPart.text.replace(resumeMatch[0], "").trim() ||
                  "I uploaded my resume.",
              };
              messages[lastIndex] = {
                ...lastMessage,
                parts: newParts,
              } as UIMessage;
            } catch (e) {
              console.error("Failed to process resume:", e);
            }
          }
        }
      }
    }
  }

  try {
    const currentCredits = await getCredits(session.user.id);
    if (currentCredits < CREDIT_COST) {
      return NextResponse.json({ error: "Not enough credits" }, { status: 402 });
    }

    const result = await streamOnboardingChat({
      userId: session.user.id,
      messages,
      collected,
      resumeText,
    });

    const creditsConsumed = await consumeCredits(session.user.id, CREDIT_COST);
    if (!creditsConsumed) {
      return NextResponse.json({ error: "Not enough credits" }, { status: 402 });
    }

    return result.toUIMessageStreamResponse({
      originalMessages: messages,
      headers: {
        "Transfer-Encoding": "chunked",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Onboarding chat error", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Something went wrong. Please try again.", details: message },
      { status: 500 }
    );
  }
}
