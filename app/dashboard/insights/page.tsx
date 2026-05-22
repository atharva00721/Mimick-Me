import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { conversionInsights, portfolios } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit, AlertTriangle, AlertCircle, HelpCircle, TrendingDown, DollarSign, Lightbulb, ShieldAlert } from "lucide-react";
import type { ConversionInsightResult } from "@/lib/ai/conversion-insights";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { GenerateInsightsButton } from "./_components/generate-insights-button";

export const metadata = {
    title: "Conversion Insights",
};

export default async function InsightsPage() {
    const session = await getSession();
    if (!session?.user?.id) redirect("/auth/signin");

    // Get active portfolio
    const activePortfolio = await db.query.portfolios.findFirst({
        where: eq(portfolios.userId, session.user.id),
        orderBy: [desc(portfolios.updatedAt)],
    });

    if (!activePortfolio) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <AlertCircle className="size-12 text-muted-foreground" />
                <h2 className="text-xl font-semibold">No Portfolio Found</h2>
                <p className="text-muted-foreground text-center max-w-sm">
                    You need to complete onboarding first to set up your portfolio and AI agent.
                </p>
                <Button asChild>
                    <Link href="/onboarding">Start Onboarding</Link>
                </Button>
            </div>
        );
    }

    // Get latest insights
    const latestInsight = await db.query.conversionInsights.findFirst({
        where: eq(conversionInsights.portfolioId, activePortfolio.id),
        orderBy: [desc(conversionInsights.generatedAt)],
    });

    if (!latestInsight) {
        return (
            <div className="flex flex-col gap-6 max-w-4xl mx-auto py-8">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight">Conversion Insights</h1>
                        <p className="text-muted-foreground">AI-powered diagnosis of your visitor interactions.</p>
                    </div>
                </div>

                <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
                    <BrainCircuit className="size-12 text-muted-foreground mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold">No Insights Generated Yet</h3>
                    <p className="text-muted-foreground text-sm max-w-md mt-2 mb-6">
                        We need at least 5 chat sessions in the last 7 days to generate meaningful conversion insights.
                        Once you have enough traffic, click below to generate your first report.
                    </p>
                    <GenerateInsightsButton portfolioId={activePortfolio.id} />
                </Card>
            </div>
        );
    }

    const data = latestInsight.insightJson as ConversionInsightResult;

    return (
        <div className="flex flex-col gap-8 pb-8 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent inline-flex items-center gap-2">
                        <BrainCircuit className="size-8 text-emerald-600" />
                        Conversion Intelligence
                    </h1>
                    <p className="text-muted-foreground">
                        AI-powered diagnosis of your visitor interactions. Generated {formatDistanceToNow(latestInsight.generatedAt)} ago.
                    </p>
                </div>
                <GenerateInsightsButton portfolioId={activePortfolio.id} lastGeneratedAt={latestInsight.generatedAt.toISOString()} />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Drop-off Analysis */}
                <Card className="border-rose-100 bg-rose-50/30 dark:border-rose-900/40 dark:bg-rose-900/10 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-rose-500" />
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2 text-rose-700 dark:text-rose-400">
                            <TrendingDown className="size-5" />
                            Primary Drop-Off Moment
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="font-medium text-foreground">{data.drop_off_analysis.primary_drop_off_moment}</p>
                            <p className="text-sm text-muted-foreground mt-1">{data.drop_off_analysis.reasoning}</p>
                        </div>
                        <div className="bg-background/80 p-3 rounded-lg border border-border/50">
                            <p className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">Fix Suggestion</p>
                            <p className="text-sm leading-relaxed">{data.drop_off_analysis.fix_suggestion}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Pricing Hesitation */}
                <Card className="border-amber-100 bg-amber-50/30 dark:border-amber-900/30 dark:bg-amber-900/10 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
                    <CardHeader className="pb-3 flex flex-row items-start justify-between">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2 text-amber-700 dark:text-amber-500">
                            <DollarSign className="size-5" />
                            Pricing Hesitation
                        </CardTitle>
                        {data.pricing_hesitation_analysis.hesitation_detected && (
                            <Badge variant="destructive" className="bg-amber-500 hover:bg-amber-600 border-none shrink-0 mt-0.5">
                                {data.pricing_hesitation_analysis.percentage_affected}% Affected
                            </Badge>
                        )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="font-medium text-foreground">
                                {data.pricing_hesitation_analysis.hesitation_detected
                                    ? "Pricing is a major friction point."
                                    : "Pricing does not appear to be a major friction point."}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">{data.pricing_hesitation_analysis.context}</p>
                        </div>
                        <div className="bg-background/80 p-3 rounded-lg border border-border/50">
                            <p className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">Recommendation</p>
                            <p className="text-sm leading-relaxed">{data.pricing_hesitation_analysis.recommendation}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Top Objections */}
                <Card className="shadow-sm border-indigo-100 dark:border-indigo-900/30 flex flex-col h-full">
                    <CardHeader className="border-b bg-muted/20 pb-4">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
                            <AlertTriangle className="size-5" />
                            Top Objections
                        </CardTitle>
                        <CardDescription className="text-xs">Main reasons visitors are hesitant to proceed.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 flex-1">
                        <div className="divide-y">
                            {data.top_objections.map((obj, i) => (
                                <div key={i} className="p-5 space-y-3 hover:bg-muted/10 transition-colors">
                                    <div className="flex items-start justify-between gap-4">
                                        <p className="font-semibold text-sm leading-snug text-foreground">{obj.objection}</p>
                                        <Badge variant={obj.severity === 'high' ? 'destructive' : obj.severity === 'medium' ? 'secondary' : 'outline'} className="capitalize shrink-0 text-[10px] px-2 py-0 h-5">
                                            {obj.severity} Severity
                                        </Badge>
                                    </div>
                                    <div className="flex gap-2.5 items-start bg-indigo-50/50 dark:bg-indigo-950/20 p-3 rounded-md border border-indigo-100/50 dark:border-indigo-900/50">
                                        <Lightbulb className="size-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                                        <p className="text-xs text-indigo-900/90 dark:text-indigo-200/90 font-medium leading-relaxed">{obj.recommendation}</p>
                                    </div>
                                </div>
                            ))}
                            {data.top_objections.length === 0 && (
                                <div className="p-8 text-center text-muted-foreground text-sm">
                                    No significant objections detected.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <div className="flex flex-col gap-6">
                    {/* Most Asked Questions */}
                    <Card className="shadow-sm">
                        <CardHeader className="pb-3 border-b bg-muted/10">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <HelpCircle className="size-4 text-sky-500" />
                                Most Asked Questions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-2 pt-0">
                            <Accordion type="single" collapsible className="w-full px-2">
                                {data.most_asked_questions.map((faq, i) => (
                                    <AccordionItem value={`item-${i}`} key={i} className="border-b last:border-0 border-muted/60">
                                        <AccordionTrigger className="text-sm text-left font-medium hover:no-underline hover:text-sky-600 transition-colors py-3">
                                            {faq.question}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-sm text-muted-foreground bg-muted/40 p-3.5 rounded-md mb-3 border border-border/50">
                                            <span className="text-[10px] font-bold block mb-1.5 text-foreground uppercase tracking-wider text-sky-600 dark:text-sky-400">Suggested Answer</span>
                                            {faq.suggested_answer}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                            {data.most_asked_questions.length === 0 && (
                                <p className="text-sm text-muted-foreground p-4">No common questions detected.</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Hidden Trust Gaps */}
                    <Card className="shadow-sm">
                        <CardHeader className="pb-3 border-b bg-muted/10">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <ShieldAlert className="size-4 text-slate-500" />
                                Hidden Trust Gaps
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-5">
                            <ul className="space-y-3">
                                {data.hidden_trust_gaps.map((gap, i) => (
                                    <li key={i} className="flex items-start gap-2.5 text-sm">
                                        <div className="mt-1.5 size-1.5 rounded-full bg-slate-400 shrink-0" />
                                        <span className="leading-relaxed text-muted-foreground">{gap}</span>
                                    </li>
                                ))}
                                {data.hidden_trust_gaps.length === 0 && (
                                    <li className="text-sm text-muted-foreground flex justify-center py-2">No specific trust gaps identified.</li>
                                )}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
