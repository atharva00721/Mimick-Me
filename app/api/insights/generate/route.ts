import { db } from "@/lib/db";
import { chatMessages, chatSessions, conversionInsights } from "@/lib/schema";
import { eq, gte, and, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";
import { generateConversionInsights } from "@/lib/ai/conversion-insights";
import { consumeCredits, getCredits } from "@/lib/credits";
import { requireUserId } from "@/lib/api/route-helpers";

const CREDIT_COST = 1;

export async function POST(req: Request) {
    const authResult = await requireUserId();
    if (!authResult.ok) {
        return authResult.response;
    }

    try {
        const body = await req.json();
        const { portfolioId } = body;

        if (!portfolioId) {
            return NextResponse.json({ error: "portfolioId is required" }, { status: 400 });
        }

        // Guardrail: check if recently generated (last 24 hours)
        const recentInsight = await db.query.conversionInsights.findFirst({
            where: and(
                eq(conversionInsights.portfolioId, portfolioId),
                gte(conversionInsights.generatedAt, new Date(Date.now() - 24 * 60 * 60 * 1000))
            ),
        });

        if (recentInsight) {
            return NextResponse.json({
                message: "Insights recently generated. Try again later.",
                insight: recentInsight.insightJson
            });
        }

        // Fetch last 7 days of chat logs
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const sessions = await db.query.chatSessions.findMany({
            where: and(
                eq(chatSessions.portfolioId, portfolioId),
                gte(chatSessions.createdAt, sevenDaysAgo)
            )
        });

        if (sessions.length < 5) {
            return NextResponse.json({
                error: "Insufficient data. At least 5 sessions required in the last 7 days to generate insights.",
                code: "INSUFFICIENT_DATA"
            }, { status: 400 });
        }

        const sessionIds = sessions.map(s => s.id);
        const messages = await db.query.chatMessages.findMany({
            where: inArray(chatMessages.sessionId, sessionIds),
            orderBy: (messages, { asc }) => [asc(messages.createdAt)]
        });

        if (messages.length === 0) {
            return NextResponse.json({ error: "No messages found for recent sessions.", code: "NO_MESSAGES" }, { status: 400 });
        }

        // Format logs for AI
        const logsBySession = messages.reduce((acc, msg) => {
            if (!acc[msg.sessionId]) acc[msg.sessionId] = [];
            acc[msg.sessionId].push(`${msg.role === 'user' ? 'Visitor' : 'Agent'}: ${msg.content}`);
            return acc;
        }, {} as Record<string, string[]>);

        let formattedLogs = "";
        Object.entries(logsBySession).forEach(([, msgs], index) => {
            formattedLogs += `--- Session ${index + 1} ---\n`;
            formattedLogs += msgs.join('\n') + '\n\n';
        });

        const currentCredits = await getCredits(authResult.userId);
        if (currentCredits < CREDIT_COST) {
            return NextResponse.json({ error: "Not enough credits" }, { status: 402 });
        }

        // Generate insights
        const startTime = Date.now();
        const insights = await generateConversionInsights(formattedLogs);
        const latencyMs = Date.now() - startTime;
        console.log(`Generated conversion insights in ${latencyMs}ms for portfolio ${portfolioId}`);

        const creditsConsumed = await consumeCredits(authResult.userId, CREDIT_COST);
        if (!creditsConsumed) {
            return NextResponse.json({ error: "Not enough credits" }, { status: 402 });
        }

        // Save to database
        const [inserted] = await db.insert(conversionInsights)
            .values({
                id: crypto.randomUUID(),
                portfolioId,
                insightJson: insights,
            })
            .returning();

        return NextResponse.json({ success: true, insight: inserted, latencyMs });

    } catch (error: unknown) {
        console.error("Failed to generate insights:", error);
        const details = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: "Internal Server Error", details }, { status: 500 });
    }
}
