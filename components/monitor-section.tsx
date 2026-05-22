'use client';

import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const marqueeItems1 = [
    "Venture Capital", "Recruitment", "Freelance Clients", "Partnerships",
    "Consulting", "B2B Sales", "SaaS Prospects", "Design Agencies"
];

const marqueeItems2 = [
    "Angel Investors", "Beta Testers", "Tech Co-founders", "Brand Sponsorships",
    "Media Inquiries", "Podcast Invites", "Speaking Gigs", "Advisors"
];

export default function MonitorSection() {
    return (
        <section className="bg-background py-32 overflow-hidden relative">
            <div className="max-w-full mx-auto px-6 md:px-12 lg:px-20 relative z-10">

                {/* Header Section */}
                <div className="flex flex-col items-center text-center mb-16 space-y-8">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground tracking-tight leading-[1.1] max-w-3xl"
                    >
                        Capture early indications of <br />
                        <span className="italic font-normal text-primary">1000s of opportunities</span>
                    </motion.h2>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 text-[13px] text-foreground/70 font-medium"
                    >
                        <div className="flex items-center gap-2">
                            <CheckCircle2 strokeWidth={1.5} className="size-4 text-primary" />
                            <span>Establish your digital baseline</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 strokeWidth={1.5} className="size-4 text-primary" />
                            <span>Available 24/7/365</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 strokeWidth={1.5} className="size-4 text-primary" />
                            <span>Monitor how your network grows</span>
                        </div>
                    </motion.div>
                </div>

                {/* Marquee & Floating Card Container */}
                <div className="relative mt-24 h-[400px] flex flex-col justify-center gap-12 max-w-[100vw] -mx-6 md:-mx-12 lg:-mx-20 overflow-hidden">

                    {/* Marquee 1 (Left to Right) */}
                    <div className="flex items-center overflow-hidden w-[200vw]">
                        <motion.div
                            animate={{ x: [0, -1000] }}
                            transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
                            className="flex gap-16 items-center whitespace-nowrap px-4"
                        >
                            {[...marqueeItems1, ...marqueeItems1, ...marqueeItems1].map((item, i) => (
                                <div key={i} className="flex items-center gap-16">
                                    <span className="text-xl md:text-2xl text-foreground/30 font-serif tracking-tight">{item}</span>
                                    <span className="size-1 rounded-full bg-foreground/20" />
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Marquee 2 (Right to Left) */}
                    <div className="flex items-center overflow-hidden w-[200vw] -ml-[50vw]">
                        <motion.div
                            animate={{ x: [-1000, 0] }}
                            transition={{ repeat: Infinity, duration: 45, ease: "linear" }}
                            className="flex gap-16 items-center whitespace-nowrap px-4"
                        >
                            {[...marqueeItems2, ...marqueeItems2, ...marqueeItems2].map((item, i) => (
                                <div key={i} className="flex items-center gap-16">
                                    <span className="text-xl md:text-2xl text-foreground/30 font-serif tracking-tight">{item}</span>
                                    <span className="size-1 rounded-full bg-foreground/20" />
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Center Floating Glass Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[480px] h-[320px] bg-background/60 backdrop-blur-2xl border border-border/50 rounded-3xl shadow-xl shadow-black/5 p-8 flex flex-col"
                    >
                        <div className="relative flex-1 w-full pl-16">
                            {/* Y Axis */}
                            <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between py-4 text-[8px] font-bold text-muted-foreground tracking-[0.2em] uppercase items-end pr-4 border-r border-border/60 w-16">
                                <span>High Match</span>
                                <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-right whitespace-nowrap">Qualified</span>
                                <span>Low Intent</span>
                            </div>

                            {/* X Axis */}
                            <div className="absolute left-16 right-0 bottom-0 h-8 flex justify-between items-end text-[8px] font-bold text-muted-foreground uppercase tracking-widest px-8">
                                <span>May 25</span>
                                <span>Oct 25</span>
                                <span>May 26</span>
                            </div>

                            {/* Chart Area */}
                            <div className="absolute inset-0 left-16 bottom-8">
                                <svg className="w-full h-full overflow-visible" viewBox="0 0 300 150" preserveAspectRatio="none">
                                    <defs>
                                        <linearGradient id="monitorGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.2" />
                                            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>

                                    {/* Target Line */}
                                    <line x1="0" y1="105" x2="300" y2="105" stroke="var(--color-border)" strokeDasharray="4 4" strokeWidth="2" />

                                    {/* Path Fill */}
                                    <motion.path
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        transition={{ duration: 1.5 }}
                                        d="M50,130 L150,55 L250,55 L250,150 L50,150 Z"
                                        fill="url(#monitorGradient)"
                                    />

                                    {/* Path Line */}
                                    <motion.path
                                        initial={{ pathLength: 0 }}
                                        whileInView={{ pathLength: 1 }}
                                        transition={{ duration: 1.5, ease: "easeInOut" }}
                                        d="M50,130 L150,55 L250,55"
                                        fill="none"
                                        stroke="var(--color-primary)"
                                        strokeWidth="2.5"
                                    />

                                    {/* Points */}
                                    {[
                                        { cx: 50, cy: 130 },
                                        { cx: 150, cy: 55 },
                                    ].map((pt, i) => (
                                        <motion.circle
                                            key={i}
                                            initial={{ scale: 0 }}
                                            whileInView={{ scale: 1 }}
                                            transition={{ delay: 0.8 + i * 0.2 }}
                                            cx={pt.cx}
                                            cy={pt.cy}
                                            r="4"
                                            fill="var(--color-primary)"
                                        />
                                    ))}

                                    {/* Active Pulse End Node */}
                                    <motion.g
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        transition={{ delay: 1.5 }}
                                    >
                                        <circle cx="250" cy="55" r="20" fill="var(--color-primary)" fillOpacity="0.08" className="animate-pulse" />
                                        <circle cx="250" cy="55" r="10" fill="var(--color-primary)" fillOpacity="0.15" className="animate-pulse" />
                                        <circle cx="250" cy="55" r="4" fill="var(--color-background)" stroke="var(--color-primary)" strokeWidth="2.5" />
                                    </motion.g>
                                </svg>
                            </div>
                        </div>

                    </motion.div>
                </div>
            </div>
        </section>
    );
}
