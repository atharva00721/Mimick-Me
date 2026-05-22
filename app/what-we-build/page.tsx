'use client'
import Link from 'next/link'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { HeroHeader } from '@/components/header'
import Footer from '@/components/footer-5'
import {
    ArrowRight,
    Globe,
    Bot,
    BarChart3,
    Inbox,
    CalendarCheck,
    FileText,
    Layers,
    Sparkles,
} from 'lucide-react'

const builds = [
    {
        number: '01',
        icon: Globe,
        title: 'AI Portfolio Sites',
        tag: 'Portfolio',
        description:
            'A beautifully designed portfolio that introduces you, showcases your work, and communicates your value — without you having to be there. Choose from templates built for freelancers, creators, and boutique agencies.',
        highlights: ['Professional templates', 'Custom domain support', 'SEO-ready structure', 'Mobile-first design'],
    },
    {
        number: '02',
        icon: Bot,
        title: 'AI Agent Clones',
        tag: 'Agent',
        description:
            'Your AI clone answers visitor questions about your skills, process, pricing, and availability — 24/7. It\'s grounded in your own materials, so every response accurately reflects your expertise.',
        highlights: ['RAG-powered responses', 'Personality matching', 'Tone & voice configuration', 'Always-on availability'],
    },
    {
        number: '03',
        icon: Inbox,
        title: 'Lead Capture & CRM',
        tag: 'Leads',
        description:
            'Your agent qualifies visitors by asking smart intent-based questions. Serious prospects are captured and scored before they bounce, so you see a ranked pipeline of opportunities — every morning.',
        highlights: ['Intent scoring', 'Contact capture', 'Lead confidence ranking', 'Dashboard inbox'],
    },
    {
        number: '04',
        icon: CalendarCheck,
        title: 'Meeting Scheduling',
        tag: 'Calendar',
        description:
            'Integrate your Google Calendar or Calendly so a qualified visitor can book a discovery call directly inside the chat — while they\'re still engaged. No back-and-forth. No dropped momentum.',
        highlights: ['Google Calendar sync', 'Calendly integration', 'In-chat booking flow', 'Auto-confirmation'],
    },
    {
        number: '05',
        icon: FileText,
        title: 'Knowledge Base',
        tag: 'Knowledge',
        description:
            'Upload your résumé, case studies, service docs, and FAQs. The RAG engine makes sure your agent only references what you\'ve actually said — keeping answers accurate and hallucination-free.',
        highlights: ['PDF & text upload', 'RAG retrieval', 'Auto-indexed chunks', 'Real-time updates'],
    },
    {
        number: '06',
        icon: BarChart3,
        title: 'Analytics & Telemetry',
        tag: 'Analytics',
        description:
            'See exactly how visitors interact with your agent. Track conversation volume, lead conversion rates, and the questions visitors ask most — so you can continuously improve your positioning.',
        highlights: ['Conversation analytics', 'Lead funnel metrics', 'Top visitor questions', 'Session insights'],
    },
]

export default function WhatWeBuildPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <HeroHeader />

            {/* Hero */}
            <section className="pt-40 pb-20 sm:pt-48 sm:pb-28 px-6">
                <div className="mx-auto max-w-3xl text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center rounded-full border border-border/60 bg-muted/60 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-8"
                    >
                        What we build
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance"
                    >
                        Everything you need to convert visitors into clients
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-6 text-lg leading-relaxed text-muted-foreground text-balance max-w-2xl mx-auto"
                    >
                        Mimick.me isn&apos;t one thing — it&apos;s a complete system for independent professionals who want their online presence to actively generate business.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mt-10"
                    >
                        <Button asChild size="lg" className="rounded-full px-8 gap-2">
                            <Link href="/auth/signup">
                                Start building
                                <ArrowRight className="size-4" />
                            </Link>
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* Build cards */}
            <section className="py-16 sm:py-24 px-6">
                <div className="mx-auto max-w-7xl">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {builds.map((item, i) => {
                            const Icon = item.icon
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-60px' }}
                                    transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                                >
                                    <Card className="group flex flex-col h-full rounded-3xl p-8 border-border/50 bg-card hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                                        <div className="flex items-start justify-between mb-6">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                                <Icon className="size-5" />
                                            </div>
                                            <span className="font-mono text-xs text-muted-foreground/40 tracking-widest pt-1">
                                                {item.number}
                                            </span>
                                        </div>

                                        <div className="mb-2">
                                            <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                                                {item.tag}
                                            </span>
                                        </div>

                                        <h3 className="font-serif text-xl font-medium text-foreground mb-3 tracking-tight">
                                            {item.title}
                                        </h3>
                                        <p className="text-muted-foreground text-sm leading-relaxed flex-1 mb-6">
                                            {item.description}
                                        </p>

                                        <ul className="space-y-2">
                                            {item.highlights.map((h, j) => (
                                                <li key={j} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                                                    <Sparkles className="size-3.5 shrink-0 text-primary/70" />
                                                    {h}
                                                </li>
                                            ))}
                                        </ul>
                                    </Card>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section className="py-24 px-6">
                <div className="mx-auto max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <Card className="rounded-3xl border border-border/50 bg-muted/40 p-12 md:p-16 text-center">
                            <div className="inline-flex items-center rounded-full border border-border/60 bg-background px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-6">
                                All in one platform
                            </div>
                            <h2 className="font-serif text-3xl font-medium text-foreground sm:text-4xl text-balance">
                                The full stack for independent professionals
                            </h2>
                            <p className="mt-4 text-muted-foreground text-base leading-relaxed max-w-xl mx-auto">
                                Portfolio. Agent. Leads. Analytics. Scheduling. Everything you need to stop losing qualified business — in a single, beautifully simple platform.
                            </p>
                            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Button asChild size="lg" className="rounded-full px-10 gap-2 w-full sm:w-auto">
                                    <Link href="/auth/signup">
                                        Get started free
                                        <ArrowRight className="size-4" />
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" size="lg" className="rounded-full px-10 w-full sm:w-auto">
                                    <Link href="/how-it-works">
                                        See how it works
                                    </Link>
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
