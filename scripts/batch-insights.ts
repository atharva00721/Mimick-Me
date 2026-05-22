import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { db } from "../lib/db";
import { chatMessages, chatSessions, conversionInsights } from "../lib/schema";
import { eq, gte, and, inArray, sql } from "drizzle-orm";
import { generateConversionInsights } from "../lib/ai/conversion-insights";

async function main() {
    console.log("Starting daily Conversion Insights batch job...");

    try {
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const activePortfoliosQuery = await db
            .select({
                portfolioId: chatSessions.portfolioId,
                count: sql<number>`count(${chatSessions.id})`,
            })
            .from(chatSessions)
            .where(gte(chatSessions.createdAt, sevenDaysAgo))
            .groupBy(chatSessions.portfolioId);

        // Filter to only those with >= 5 sessions
        const activePortfolios = activePortfoliosQuery.filter(p => Number(p.count) >= 5);

        console.log(`Found ${activePortfolios.length} eligible portfolios with >= 5 sessions in last 7 days.`);

        let successCount = 0;
        let skipCount = 0;
        let errorCount = 0;

        for (const { portfolioId } of activePortfolios) {
            if (!portfolioId) continue;

            const recentInsight = await db.query.conversionInsights.findFirst({
                where: and(
                    eq(conversionInsights.portfolioId, portfolioId),
                    gte(conversionInsights.generatedAt, oneDayAgo)
                ),
            });

            if (recentInsight) {
                console.log(`Skipping portfolio ${portfolioId} - recently generated.`);
                skipCount++;
                continue;
            }

            console.log(`Processing portfolio ${portfolioId}...`);

            try {
                const sessions = await db.query.chatSessions.findMany({
                    where: and(
                        eq(chatSessions.portfolioId, portfolioId),
                        gte(chatSessions.createdAt, sevenDaysAgo)
                    )
                });

                const sessionIds = sessions.map(s => s.id);
                const messages = await db.query.chatMessages.findMany({
                    where: inArray(chatMessages.sessionId, sessionIds),
                    orderBy: (msgs, { asc }) => [asc(msgs.createdAt)]
                });

                const logsBySession = messages.reduce((acc, msg) => {
                    if (!acc[msg.sessionId]) acc[msg.sessionId] = [];
                    acc[msg.sessionId].push(`${msg.role === 'user' ? 'Visitor' : 'Agent'}: ${msg.content}`);
                    return acc;
                }, {} as Record<string, string[]>);

                let formattedLogs = "";
                Object.entries(logsBySession).forEach(([_, msgs], index) => {
                    formattedLogs += `--- Session ${index + 1} ---\n`;
                    formattedLogs += msgs.join('\n') + '\n\n';
                });

                const startTime = Date.now();
                const insights = await generateConversionInsights(formattedLogs);
                const latencyMs = Date.now() - startTime;

                console.log(`Generated insights for ${portfolioId} in ${latencyMs}ms`);

                await db.insert(conversionInsights).values({
                    id: crypto.randomUUID(),
                    portfolioId,
                    insightJson: insights,
                });

                successCount++;
            } catch (err: unknown) {
                console.error(`Error processing portfolio ${portfolioId}:`, err);
                errorCount++;
            }
        }

        console.log(`Batch job complete. Success: ${successCount}, Skipped: ${skipCount}, Errors: ${errorCount}`);
        process.exit(0);

    } catch (error: unknown) {
        console.error("Batch Job Failed:", error);
        process.exit(1);
    }
}

main();
