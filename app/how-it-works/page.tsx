'use client'
import Link from 'next/link'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { HeroHeader } from '@/components/header'
import Footer from '@/components/footer-5'
import { ArrowRight, Upload, Palette, Rocket, MessageSquare } from 'lucide-react'

const steps = [
    {
        number: '01',
        icon: Rocket,
        title: 'Sign up & pick a template',
        description:
            'Create your free account in seconds. Choose from our curated portfolio templates that match your style — minimal, creative, or professional. Each template is built to convert visitors into qualified leads.',
    },
    {
        number: '02',
        icon: Upload,
        title: 'Upload your knowledge base',
        description:
            'Drop in your résumé, project case studies, service docs, and FAQs. Mimick.me uses retrieval-augmented generation (RAG) so your agent only answers using facts grounded in your real expertise — no hallucinations, no generic filler.',
    },
    {
        number: '03',
        icon: Palette,
        title: 'Tune your agent\'s personality',
        description:
            'Set the tone, writing style, and persona of your AI. Want it to sound exactly like you? Give it a few writing samples. Prefer a more formal brand voice? Configure it in minutes. Your agent mirrors you authentically.',
    },
    {
        number: '04',
        icon: MessageSquare,
        title: 'Publish & start capturing leads',
        description:
            'Hit publish and your agent goes live at your Mimick.me URL — or connect your own custom domain. Every visitor conversation is logged, scored by intent, and delivered to your dashboard as a ranked lead.',
    },
]

export default function HowItWorksPage() {
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
                        How it works
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance"
                    >
                        From zero to AI-powered portfolio in minutes
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-6 text-lg leading-relaxed text-muted-foreground text-balance max-w-2xl mx-auto"
                    >
                        No code. No complex setup. Just four simple steps to deploy an AI agent that works for you around the clock.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mt-10 flex items-center justify-center gap-4"
                    >
                        <Button asChild size="lg" className="rounded-full px-8 gap-2">
                            <Link href="/auth/signup">
                                Get started free
                                <ArrowRight className="size-4" />
                            </Link>
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* Steps */}
            <section className="py-16 sm:py-24 px-6">
                <div className="mx-auto max-w-5xl">
                    <div className="flex flex-col gap-0">
                        {steps.map((step, i) => {
                            const Icon = step.icon
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-80px' }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    className="group relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start py-16 border-b border-border/40 last:border-b-0"
                                >
                                    {/* Number + Icon */}
                                    <div className="lg:col-span-2 flex items-center gap-4 lg:flex-col lg:items-start lg:gap-3">
                                        <span className="font-mono text-4xl font-light text-muted-foreground/30 leading-none tracking-tighter">
                                            {step.number}
                                        </span>
                                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                            <Icon className="size-5" />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="lg:col-span-10">
                                        <h2 className="font-serif text-2xl font-medium text-foreground tracking-tight mb-4 group-hover:text-primary transition-colors">
                                            {step.title}
                                        </h2>
                                        <p className="text-muted-foreground leading-relaxed text-base max-w-2xl">
                                            {step.description}
                                        </p>
                                    </div>
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
                            Ready to let your agent work for you?
                        </h2>
                        <p className="mt-4 text-muted-foreground text-base leading-relaxed">
                            Start free. No credit card required. Set up in under five minutes.
                        </p>
                        <Button asChild size="lg" className="mt-8 rounded-full px-10 gap-2">
                            <Link href="/auth/signup">
                                Start building
                                <ArrowRight className="size-4" />
                            </Link>
                        </Button>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
