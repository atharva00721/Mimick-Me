'use client'
import Link from 'next/link'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { HeroHeader } from '@/components/header'
import Footer from '@/components/footer-5'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { ArrowRight, Mail } from 'lucide-react'

const faqCategories = [
    {
        category: 'Getting started',
        faqs: [
            {
                question: 'What exactly is Mimick.me?',
                answer:
                    'Mimick.me is an AI portfolio and agent platform for freelancers, creators, and boutique agencies. You get a professionally designed portfolio site paired with an AI agent trained on your expertise. The agent answers visitor questions, qualifies leads, and books meetings — 24/7.',
            },
            {
                question: 'Do I need any technical skills to set up my agent?',
                answer:
                    'None at all. If you can fill out a form and upload a document, you can configure your Mimick.me agent. All the AI complexity happens behind the scenes. Most users are live within five minutes of signing up.',
            },
            {
                question: 'Can I try it for free?',
                answer:
                    'Yes — our Starter plan is permanently free. You get one AI portfolio, one AI agent, and a generous number of monthly AI messages and lead captures. No credit card required.',
            },
            {
                question: 'How is Mimick.me different from a regular chatbot on my site?',
                answer:
                    'Generic chatbots answer from a general knowledge base — which means they can hallucinate and give inaccurate responses. Mimick.me agents are trained exclusively on materials you upload, so responses are always grounded in your actual expertise. They also have lead capture, scoring, and scheduling baked in.',
            },
        ],
    },
    {
        category: 'AI agent & knowledge base',
        faqs: [
            {
                question: 'What does "RAG" mean, and why does it matter?',
                answer:
                    'RAG stands for Retrieval-Augmented Generation. When a visitor asks your agent something, it first searches your uploaded documents for relevant facts, then uses those facts to generate an accurate response. This prevents hallucinations and keeps every answer grounded in what you\'ve actually said about yourself.',
            },
            {
                question: 'What files can I upload to the knowledge base?',
                answer:
                    'You can upload PDFs, text files, and plain documents. Great content to include: your résumé, project case studies, service pricing guides, process documents, FAQs you\'ve written, and any other materials that describe your work and how you work.',
            },
            {
                question: 'Can I update my knowledge base after publishing?',
                answer:
                    'Yes. You can add, replace, or remove documents from your knowledge base at any time. Changes take effect within minutes, so your agent is always up to date as your services evolve.',
            },
            {
                question: 'How do I customise my agent\'s personality?',
                answer:
                    'In your dashboard, you can set the tone (formal, casual, friendly), write custom instructions, and even include writing samples so the agent mirrors your actual voice. You can also set boundary rules — topics the agent should not discuss — to keep it fully on-brand.',
            },
        ],
    },
    {
        category: 'Leads & scheduling',
        faqs: [
            {
                question: 'How does lead capture work?',
                answer:
                    'Your agent is configured to collect visitor contact details at natural points in the conversation — when someone expresses interest in working with you, for example. It scores each lead by intent confidence, so you see a ranked list of the most serious prospects in your dashboard.',
            },
            {
                question: 'Can people book meetings directly through the agent?',
                answer:
                    'Yes. On Pro and Agency plans, you can connect Google Calendar or Calendly. When a visitor is ready to move forward, your agent offers them a booking link or embedded scheduler inside the conversation — while they\'re still engaged.',
            },
            {
                question: 'Where do captured leads go?',
                answer:
                    'All leads land in your Mimick.me inbox dashboard with the conversation transcript, contact details, lead score, and timestamp. You can filter, archive, and follow up directly from the dashboard.',
            },
        ],
    },
    {
        category: 'Plans & billing',
        faqs: [
            {
                question: 'Can I use my own domain?',
                answer:
                    'Yes. Pro and Agency plans support custom domain connections. You\'ll point your domain\'s DNS records to Mimick.me and we\'ll handle the rest, including SSL.',
            },
            {
                question: 'What counts as an "AI message"?',
                answer:
                    'Any message sent in a visitor conversation with your agent counts as one AI message. Testing your agent inside the dashboard also counts against your monthly limit, so you can preview it accurately.',
            },
            {
                question: 'Is there a long-term commitment?',
                answer:
                    'No. All paid plans are billed monthly and you can cancel, upgrade, or downgrade at any time from your account settings. There are no annual contracts or lock-in periods.',
            },
            {
                question: 'Can I upgrade or downgrade later?',
                answer:
                    'Absolutely. Plan changes take effect immediately. If you upgrade mid-cycle, you\'ll be charged a prorated amount. Downgrades take effect at the end of the current billing period.',
            },
            {
                question: 'Does the AI collect payment information?',
                answer:
                    'No. Your agent handles conversation, qualification, and scheduling — it does not process payments. For payment links, you\'d share your invoice or checkout URL through the conversation when appropriate.',
            },
        ],
    },
]

export default function FaqPage() {
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
                        FAQ
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance"
                    >
                        Frequently asked questions
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-6 text-lg leading-relaxed text-muted-foreground text-balance max-w-2xl mx-auto"
                    >
                        Everything you need to know about Mimick.me, your AI agent, and how it all works together.
                    </motion.p>
                </div>
            </section>

            {/* FAQ sections */}
            <section className="py-8 sm:py-12 px-6 pb-24">
                <div className="mx-auto max-w-3xl flex flex-col gap-16">
                    {faqCategories.map((category, ci) => (
                        <motion.div
                            key={ci}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-60px' }}
                            transition={{ duration: 0.5, delay: ci * 0.05 }}
                        >
                            <h2 className="font-serif text-xl font-medium text-foreground mb-8 pb-4 border-b border-border/40">
                                {category.category}
                            </h2>
                            <Accordion type="single" collapsible className="w-full">
                                {category.faqs.map((faq, i) => (
                                    <AccordionItem
                                        key={i}
                                        value={`${ci}-${i}`}
                                        className="border-b border-border/40 py-1"
                                    >
                                        <AccordionTrigger className="text-left font-medium text-base hover:text-primary transition-colors py-4">
                                            {faq.question}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-4">
                                            {faq.answer}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Contact CTA */}
            <section className="py-24 px-6 border-t border-border/40">
                <div className="mx-auto max-w-2xl text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mx-auto mb-6">
                            <Mail className="size-6" />
                        </div>
                        <h2 className="font-serif text-2xl font-medium text-foreground text-balance">
                            Still have questions?
                        </h2>
                        <p className="mt-3 text-muted-foreground text-base leading-relaxed max-w-md mx-auto">
                            Can&apos;t find the answer you&apos;re looking for? Reach out and we&apos;ll get back to you within one business day.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                            <Button asChild size="lg" className="rounded-full px-8 gap-2">
                                <Link href="/auth/signup">
                                    Get started free
                                    <ArrowRight className="size-4" />
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
