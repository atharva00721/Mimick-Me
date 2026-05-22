'use client'
import Link from 'next/link'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { HeroHeader } from '@/components/header'
import Footer from '@/components/footer-5'
import { ArrowRight, Target, Lightbulb, Heart, Shield } from 'lucide-react'

const values = [
    {
        icon: Target,
        title: 'Outcomes over features',
        description:
            'We measure success by how many qualified leads you close — not how many buttons we put on the dashboard. Every feature we ship has to move the needle on real business results.',
    },
    {
        icon: Lightbulb,
        title: 'Honest AI',
        description:
            'We believe AI should say "I don\'t know" when it doesn\'t know. RAG-powered responses grounded in your own materials means your agent never fabricates answers or overpromises.',
    },
    {
        icon: Heart,
        title: 'Built for independents',
        description:
            'We\'re not building enterprise software that trickles down. We build specifically for the freelancer, the creator, and the small agency — people who deserve tools as powerful as any Fortune 500 sales team.',
    },
    {
        icon: Shield,
        title: 'Privacy-first',
        description:
            'Your data and your clients\' data stay private. We never train our models on your uploaded content, and visitor conversations are never shared or sold. Full stop.',
    },
]

const stats = [
    { value: '10k+', label: 'Portfolios published' },
    { value: '2M+', label: 'AI messages delivered' },
    { value: '99.9%', label: 'Uptime SLA' },
    { value: '150+', label: 'Countries reached' },
]

export default function AboutPage() {
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
                        About
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance"
                    >
                        We believe great work deserves to be found
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-6 text-lg leading-relaxed text-muted-foreground text-balance max-w-2xl mx-auto"
                    >
                        Mimick.me was built for the freelancers and independent professionals who do exceptional work — but lose business before a single conversation starts.
                    </motion.p>
                </div>
            </section>

            {/* Story */}
            <section className="py-16 sm:py-24 px-6">
                <div className="mx-auto max-w-5xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="lg:col-span-5 lg:sticky lg:top-32"
                        >
                            <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl text-balance">
                                The problem we set out to solve
                            </h2>
                        </motion.div>

                        <div className="lg:col-span-7 flex flex-col gap-10">
                            {[
                                {
                                    number: '01',
                                    text: 'Most freelancers and boutique agencies lose qualified business before a real conversation starts. A potential client visits, skims project thumbnails, can\'t quickly find what they need — and leaves. The contact form feels like friction, the portfolio doesn\'t answer follow-up questions, and the professional is asleep or in deep work.',
                                },
                                {
                                    number: '02',
                                    text: 'We built Mimick.me to fix that. Not with a generic chatbot, but with a personal AI agent trained on your actual expertise. One that sounds like you, knows your work as well as you do, and converts interested visitors into ranked, qualified leads — 24 hours a day.',
                                },
                                {
                                    number: '03',
                                    text: 'The result is a complete conversion system: brand-aligned conversational UX, factual RAG-powered knowledge retrieval, and booking workflows — all in one platform designed specifically for independent professionals who deserve tools as powerful as any enterprise sales team.',
                                },
                            ].map((block, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-60px' }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    className="group relative pl-8 before:absolute before:inset-y-0 before:left-0 before:w-px before:bg-border hover:before:bg-primary/50 before:transition-colors"
                                >
                                    <span className="text-xs font-mono text-muted-foreground/40 tracking-widest block mb-3">
                                        {block.number}
                                    </span>
                                    <p className="text-foreground/80 leading-relaxed text-base">
                                        {block.text}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats
            <section className="py-16 sm:py-20 px-6 bg-muted/20 border-y border-border/40">
                <div className="mx-auto max-w-5xl">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="text-center"
                            >
                                <div className="font-serif text-4xl sm:text-5xl font-medium text-foreground">
                                    {stat.value}
                                </div>
                                <div className="mt-2 text-sm text-muted-foreground">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section> */}

            {/* Values */}
            <section className="py-16 sm:py-24 px-6">
                <div className="mx-auto max-w-5xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center max-w-2xl mx-auto mb-16"
                    >
                        <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl text-balance">
                            How we think
                        </h2>
                        <p className="mt-4 text-muted-foreground text-base leading-relaxed">
                            The principles that guide every decision — from product features to how we handle your data.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        {values.map((val, i) => {
                            const Icon = val.icon
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-60px' }}
                                    transition={{ duration: 0.5, delay: (i % 2) * 0.1 }}
                                >
                                    <Card className="group h-full rounded-3xl p-8 border-border/50 bg-card hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary mb-5 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                            <Icon className="size-5" />
                                        </div>
                                        <h3 className="font-serif text-lg font-medium text-foreground mb-3 tracking-tight">
                                            {val.title}
                                        </h3>
                                        <p className="text-muted-foreground text-sm leading-relaxed">
                                            {val.description}
                                        </p>
                                    </Card>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-6">
                <div className="mx-auto max-w-2xl text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="font-serif text-3xl font-medium text-foreground sm:text-4xl text-balance">
                            Join thousands of independents already using Mimick.me
                        </h2>
                        <p className="mt-4 text-muted-foreground text-base leading-relaxed">
                            Start free. Upgrade anytime. No credit card required.
                        </p>
                        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button asChild size="lg" className="rounded-full px-10 gap-2 w-full sm:w-auto">
                                <Link href="/auth/signup">
                                    Get started free
                                    <ArrowRight className="size-4" />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="rounded-full px-10 w-full sm:w-auto">
                                <Link href="/explore">
                                    Browse portfolios
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
