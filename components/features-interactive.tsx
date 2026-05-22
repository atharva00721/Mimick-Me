'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    Linkedin,
    Github,
    Globe,
    Twitter,
    Briefcase,
    Calendar,
    Mail,
    FileText,
    Dribbble
} from 'lucide-react';
import { cn } from '@/lib/utils';

// --- Shared Styles ---
const CARD_BG = "bg-muted/50"; // Deeper cream/beige to match FH better
const CARD_ROUNDED = "rounded-[1.5rem]";
const ACCENT_COLOR = "#D36746";

// --- Card 01: Knowledge Sources (Calendar Grid Style) ---
const KnowledgeSourcesCard = () => {
    const [selected, setSelected] = useState(1);
    const sources = [
        { id: 0, label: 'LNKD', icon: <Linkedin className="size-3.5" /> },
        { id: 1, label: 'WEB', icon: <Globe className="size-3.5" /> },
        { id: 2, label: 'GITH', icon: <Github className="size-3.5" /> },
        { id: 3, label: 'TWTR', icon: <Twitter className="size-3.5" /> },
        { id: 4, label: 'DBBL', icon: <Dribbble className="size-3.5" /> },
        { id: 5, label: 'BLOG', icon: <FileText className="size-3.5" /> },
    ];

    return (
        <div className={cn("flex flex-col h-full p-10", CARD_BG, CARD_ROUNDED)}>
            <div className="text-center mb-10">
                <span className="text-[11px] font-bold text-primary tracking-[0.2em] mb-4 block uppercase font-mono">01</span>
                <h3 className="font-serif text-3xl text-foreground mb-3 tracking-tight">Knowledge Ingestion</h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed max-w-[220px] mx-auto">
                    Instantly train your agent on your existing professional footprint.
                </p>
            </div>

            <div className="flex-1 flex flex-col justify-center">
                <div className="grid grid-cols-3 gap-2 px-2">
                    {sources.map((s, idx) => (
                        <button
                            key={s.id}
                            onClick={() => setSelected(idx)}
                            className={cn(
                                "flex flex-col items-center justify-center aspect-square rounded-xl transition-all duration-300 border border-border",
                                selected === idx
                                    ? "bg-primary text-white shadow-xl shadow-primary/20 border-transparent"
                                    : "bg-background/80 hover:bg-background text-muted-foreground"
                            )}
                        >
                            <span className="text-[9px] font-bold tracking-tighter mb-1 opacity-60 uppercase">{s.label}</span>
                            <span className="font-serif text-lg">{idx + 1}</span>
                        </button>
                    ))}
                </div>

                <div className="mt-8 flex justify-center gap-6">
                    <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                        <span className="text-primary mr-2">●</span> 12.4K Tokens
                    </div>
                    <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                        <span className="text-primary mr-2">●</span> Ingested
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Card 02: Lead Qualification (Range Chart Style) ---
const PersonalityRangeCard = () => {
    return (
        <div className={cn("flex flex-col h-full p-10", CARD_BG, CARD_ROUNDED)}>
            <div className="text-center mb-10">
                <span className="text-[11px] font-bold text-primary tracking-[0.2em] mb-4 block uppercase font-mono">02</span>
                <h3 className="font-serif text-3xl text-foreground mb-3 tracking-tight">Lead Qualification</h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed max-w-[220px] mx-auto">
                    Automatically score and filter incoming opportunities.
                </p>
            </div>

            <div className="flex-1 flex flex-col justify-center">
                <div className="relative h-40 w-full pl-20 mb-6">
                    {/* Range Markers */}
                    <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between py-2 text-[8px] font-bold text-muted-foreground tracking-[0.2em] uppercase items-end pr-4 border-r border-border w-20">
                        <span className="text-right">High Intent</span>
                        <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-right">Qualified</span>
                        <span className="text-right">Low Match</span>
                    </div>

                    {/* Chart Structure */}
                    <div className="absolute inset-0 left-20 pb-2">
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 300 120" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.2" />
                                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
                                </linearGradient>
                            </defs>

                            {/* Dotted Target Line */}
                            <line x1="0" y1="60" x2="300" y2="60" stroke="var(--color-primary)" strokeOpacity="0.1" strokeDasharray="4 4" />

                            {/* Area Fill */}
                            <motion.path
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                                d="M0,80 C50,80 80,40 120,45 C160,50 180,90 220,70 C260,50 280,30 300,40 L300,120 L0,120 Z"
                                fill="url(#chartGradient)"
                            />

                            {/* The Data Path */}
                            <motion.path
                                initial={{ pathLength: 0 }}
                                whileInView={{ pathLength: 1 }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                                d="M0,80 C50,80 80,40 120,45 C160,50 180,90 220,70 C260,50 280,30 300,40"
                                fill="none"
                                stroke="var(--color-primary)"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />

                            {/* Range Data Points */}
                            {[120, 220, 280].map((x, i) => (
                                <motion.circle
                                    key={i}
                                    initial={{ opacity: 0, scale: 0 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.5 + i * 0.2 }}
                                    cx={x}
                                    cy={i === 0 ? 45 : i === 1 ? 70 : 40}
                                    r="4"
                                    fill="var(--color-primary)"
                                />
                            ))}

                            {/* Current Active Node */}
                            <motion.g
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.5 }}
                            >
                                <circle cx="120" cy="45" r="8" fill="var(--color-primary)" fillOpacity="0.2" className="animate-pulse" />
                                <text x="120" y="30" textAnchor="middle" className="text-[10px] font-bold fill-primary">98% Match</text>
                            </motion.g>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Card 03: Automated Workflows (Minimal List Style) ---
const ResponseProtocolCard = () => {
    const [activeStep, setActiveStep] = React.useState(0);

    const protocols = [
        { label: 'Lead Captured', desc: 'Securely parsing contact details' },
        { label: 'Scope Gathered', desc: 'Identifying project requirements' },
        { label: 'Meeting Booked', desc: 'Syncing with Google Calendar' },
    ];

    React.useEffect(() => {
        const interval = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % protocols.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [protocols.length]);

    return (
        <div className={cn("flex flex-col h-full p-10", CARD_BG, CARD_ROUNDED)}>
            <div className="text-center mb-10">
                <span className="text-[11px] font-bold text-primary tracking-[0.2em] mb-4 block uppercase font-mono">03</span>
                <h3 className="font-serif text-3xl text-foreground mb-3 tracking-tight">Automated Workflows</h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed max-w-[220px] mx-auto">
                    Your agent handles the busywork so you can build.
                </p>
            </div>

            <div className="flex-1 flex flex-col justify-center gap-6 px-4">
                {protocols.map((p, idx) => {
                    const isActive = idx === activeStep;
                    const isPast = idx < activeStep;

                    return (
                        <div
                            key={idx}
                            className={cn(
                                "flex flex-col gap-2 transition-all duration-700 font-sans",
                                isActive ? "opacity-100" : isPast ? "opacity-40" : "opacity-20"
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <div className="relative flex items-center justify-center size-2.5">
                                    <div className={cn(
                                        "absolute inset-0 rounded-full transition-colors duration-700",
                                        isActive ? "bg-primary" : isPast ? "bg-primary/40" : "bg-muted"
                                    )} />
                                    {isActive && (
                                        <motion.div
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 3, opacity: 0 }}
                                            transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                                            className="absolute inset-0 rounded-full bg-primary"
                                        />
                                    )}
                                </div>
                                <h4 className={cn(
                                    "text-[11px] font-sans font-semibold tracking-widest uppercase transition-colors duration-700",
                                    isActive ? "text-primary" : "text-muted-foreground"
                                )}>
                                    {p.label}
                                </h4>
                            </div>

                            <div className="overflow-hidden pl-6.5">
                                <AnimatePresence mode="wait">
                                    {isActive && (
                                        <motion.p
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                            className="text-xs text-muted-foreground font-light mt-1 ml-[26px]"
                                        >
                                            {p.desc}
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// --- Main Page Component ---
export default function FeaturesInteractive() {
    return (
        <section className="bg-background py-32 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col items-center text-center mb-24 space-y-6">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="font-serif text-2xl md:text-3xl lg:text-5xl text-foreground tracking-tight leading-[1.1]"
                    >
                        Lead generation on <span className="italic font-normal">autopilot</span>
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-8xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <KnowledgeSourcesCard />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
                    >
                        <PersonalityRangeCard />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                    >
                        <ResponseProtocolCard />
                    </motion.div>
                </div>

                {/* <div className="mt-24 flex flex-col md:flex-row items-center justify-center gap-6">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="h-16 px-12 rounded-full bg-primary text-white font-bold text-sm transition-all hover:bg-[#b05234] shadow-2xl shadow-primary/30"
                        >
                            Build your agent
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="h-16 px-12 rounded-full border border-primary text-primary font-bold text-sm transition-all hover:bg-primary/5"
                        >
                            How it works
                        </motion.button>
                    </div> */}
            </div>
        </section>
    );
}
