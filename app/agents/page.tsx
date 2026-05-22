'use client'
import Link from 'next/link'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { HeroHeader } from '@/components/header'
import Footer from '@/components/footer-5'
import {
    ArrowRight,
    MessageSquare,
    BrainCircuit,
    ShieldCheck,
    Clock,
    Zap,
    Users,
    BookOpen,
    TrendingUp,
} from 'lucide-react'

const capabilities = [
    {
        icon: MessageSquare,
        title: 'Conversational lead qualification',
        description:
            'Your agent asks smart, intent-based questions to separate casual browsers from serious buyers. Every conversation is scored and sent to your dashboard.',
    },
    {
        icon: BrainCircuit,
        title: 'RAG-powered knowledge retrieval',
        description:
            'Trained on your actual materials — résumé, project case studies, service docs, and FAQs — so answers are always grounded in your real expertise.',
    },
    {
        icon: Clock,
        title: '24/7 availability',
        description:
            'Your agent never sleeps, never takes a holiday, and never misses a message. It represents you professionally around the clock, in every timezone.',
    },
    {
        icon: ShieldCheck,
        title: 'Hallucination-free responses',
        description:
            'Unlike generic chatbots, your agent only references facts you\'ve explicitly uploaded. It\'s direct and grounded about what it knows — and honest about what it doesn\'t.',
    },
    {
        icon: Zap,
        title: 'Instant personality matching',
        description:
            'Set the tone, writing style, and persona with just a few instructions. Your agent can sound formal, casual, or exactly like you — however your brand best resonates.',
    },
    {
        icon: TrendingUp,
        title: 'Continuous improvement',
        description:
            'Analyse the questions visitors ask most and update your knowledge base to improve future conversations. The more you tune it, the sharper it gets.',
    },
]

const agentTypes = [
    {
        number: '01',
        title: 'Freelancer Agent',
        description:
            'The essential AI representative for independent professionals. Answers questions about your services, process, availability, and pricing — and captures contact info from interested leads.',
        suited: 'Designers, developers, writers, marketers, consultants',
    },
    {
        number: '02',
        title: 'Creator Agent',
        description:
            'Built for YouTube creators, podcasters, and influencers looking to turn their audience into business partnerships, sponsorships, or product sales — automatically.',
        suited: 'YouTubers, podcasters, newsletter writers, coaches',
    },
    {
        number: '03',
        title: 'Agency Agent',
        description:
            'A white-label AI representative that handles first-line discovery conversations on behalf of your agency. Multiple agents, multiple brands, one unified dashboard.',
        suited: 'Creative agencies, consulting firms, boutique studios',
    },
]

export default function AgentsPage() {
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
                        AI Agents
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance"
                    >
                        Your digital clone, working while you rest
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-6 text-lg leading-relaxed text-muted-foreground text-balance max-w-2xl mx-auto"
                    >
                        A Mimick.me agent isn&apos;t a template chatbot — it&apos;s a bespoke AI trained on your expertise, shaped to your personality, and designed to qualify the leads that matter.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mt-10 flex items-center justify-center gap-4"
                    >
                        <Button asChild size="lg" className="rounded-full px-8 gap-2">
                            <Link href="/auth/signup">
                                Create your agent
                                <ArrowRight className="size-4" />
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="rounded-full px-8">
                            <Link href="/explore">
                                See live examples
                            </Link>
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* Capabilities grid */}
            <section className="py-16 sm:py-24 px-6">
                <div className="mx-auto max-w-7xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="max-w-2xl mb-16"
                    >
                        <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl text-balance">
                            What your agent can do
                        </h2>
                        <p className="mt-4 text-muted-foreground text-base leading-relaxed">
                            Every Mimick.me agent comes with a full suite of capabilities out of the box.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {capabilities.map((cap, i) => {
                            const Icon = cap.icon
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-60px' }}
                                    transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                                    className="group flex flex-col gap-4"
                                >
                                    <div className="flex items-start justify-between border-b border-border/40 pb-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                            <Icon className="size-5" />
                                        </div>
                                    </div>
                                    <h3 className="font-medium text-foreground tracking-tight">{cap.title}</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">{cap.description}</p>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Agent types */}
            <section className="py-16 sm:py-24 px-6 bg-muted/20">
                <div className="mx-auto max-w-5xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center max-w-2xl mx-auto mb-16"
                    >
                        <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl text-balance">
                            Built for every independent professional
                        </h2>
                        <p className="mt-4 text-muted-foreground text-base leading-relaxed">
                            Whether you&apos;re a solo freelancer or running a boutique agency, there&apos;s a Mimick.me agent that fits how you work.
                        </p>
                    </motion.div>

                    <div className="flex flex-col gap-0">
                        {agentTypes.map((type, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-60px' }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="group grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 py-12 border-b border-border/40 last:border-b-0 items-start"
                            >
                                <div className="lg:col-span-1">
                                    <span className="font-mono text-3xl font-light text-muted-foreground/30 leading-none">
                                        {type.number}
                                    </span>
                                </div>
                                <div className="lg:col-span-11">
                                    <h3 className="font-serif text-xl font-medium text-foreground mb-3 tracking-tight group-hover:text-primary transition-colors">
                                        {type.title}
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed text-base mb-4 max-w-2xl">
                                        {type.description}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <Users className="size-3.5 text-muted-foreground/50" />
                                        <span className="text-xs text-muted-foreground/60 italic">{type.suited}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Knowledge base callout */}
            <section className="py-24 px-6">
                <div className="mx-auto max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <Card className="rounded-3xl border border-border/50 bg-muted/40 p-12 md:p-16">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                <div>
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6">
                                        <BookOpen className="size-6" />
                                    </div>
                                    <h2 className="font-serif text-3xl font-medium text-foreground text-balance">
                                        Every answer grounded in your expertise
                                    </h2>
                                    <p className="mt-4 text-muted-foreground text-base leading-relaxed">
                                        Upload your résumé, case studies, and service docs. RAG retrieval ensures your agent only references what you&apos;ve actually said — accurate, honest, and distinctly you.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-4">
                                    {['PDF & document upload', 'Auto-indexed knowledge chunks', 'Real-time retrieval', 'Hallucination-free responses', 'Updatable at any time'].map((feat, i) => (
                                        <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                                            <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                                            {feat}
                                        </div>
                                    ))}
                                    <Button asChild size="sm" className="rounded-full mt-4 w-fit gap-2">
                                        <Link href="/auth/signup">
                                            Try it free
                                            <ArrowRight className="size-3.5" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
