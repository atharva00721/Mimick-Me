'use client'
import { motion } from 'motion/react'

export default function Content() {
    return (
        <section className="bg-background py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5 }}
                    className="mx-auto max-w-2xl lg:max-w-none flex flex-col lg:flex-row lg:items-end justify-between gap-8"
                >
                    <div className="max-w-2xl">
                        <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl text-balance">
                            An agent that sounds like you
                        </h2>
                    </div>
                    <div className="max-w-xl">
                        <p className="text-lg leading-relaxed text-muted-foreground">
                            Go beyond a static portfolio. Give visitors a dynamic, conversational experience that accurately reflects your expertise.
                        </p>
                    </div>
                </motion.div>

                <div className="mx-auto mt-16 max-w-2xl sm:mt-24 lg:max-w-none">
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="flex flex-col group"
                        >
                            <div className="mb-6 flex items-center gap-4 border-b border-border pb-6">
                                <span className="text-sm font-medium text-muted-foreground/50 font-mono tracking-wider">01</span>
                                <div className="h-px bg-border flex-1 transition-colors group-hover:bg-primary/50" />
                            </div>
                            <h3 className="mb-4 text-xl font-medium text-foreground tracking-tight">Capture and qualify leads</h3>
                            <p className="text-muted-foreground leading-relaxed flex-1">
                                Mimick.me asks intent-based questions, collects contact details, and assigns lead confidence scores so you can prioritize serious opportunities first. Get a ranked stream of prospects inside your dashboard.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="flex flex-col group"
                        >
                            <div className="mb-6 flex items-center gap-4 border-b border-border pb-6">
                                <span className="text-sm font-medium text-muted-foreground/50 font-mono tracking-wider">02</span>
                                <div className="h-px bg-border flex-1 transition-colors group-hover:bg-primary/50" />
                            </div>
                            <h3 className="mb-4 text-xl font-medium text-foreground tracking-tight">RAG-backed retrieval</h3>
                            <p className="text-muted-foreground leading-relaxed flex-1">
                                Upload your resume, case studies, and service docs. Visitors get factual responses about your process, pricing ranges, and project fit without the hallucinations common in generic chat widgets.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-col group"
                        >
                            <div className="mb-6 flex items-center gap-4 border-b border-border pb-6">
                                <span className="text-sm font-medium text-muted-foreground/50 font-mono tracking-wider">03</span>
                                <div className="h-px bg-border flex-1 transition-colors group-hover:bg-primary/50" />
                            </div>
                            <h3 className="mb-4 text-xl font-medium text-foreground tracking-tight">Book meetings when hot</h3>
                            <p className="text-muted-foreground leading-relaxed flex-1">
                                Connect Calendly or Google Calendar so qualified visitors can schedule directly from the chat flow while they are still engaged. Removing the back-and-forth that usually delays discovery calls.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    )
}
