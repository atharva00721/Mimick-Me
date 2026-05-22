'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { HeroHeader } from './header';
import FeaturesInteractive from './features-interactive';
import MonitorSection from './monitor-section';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1] as const,
        },
    },
};

export default function HeroSectionV2() {
    return (
        <>
            {/* Top Announcement Bar */}
            {/* <div className="bg-[#D36746] py-2 text-center text-[10px] md:text-sm font-medium text-white/90 tracking-wide uppercase">
                Elevate your presence with Mimick.me Agents — Join the Waitlist
            </div> */}

            <HeroHeader />

            <main aria-label="Hero" className="relative min-h-[100svh] w-full overflow-hidden bg-black text-white">
                {/* Immersive Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/image.png"
                        alt=""
                        aria-hidden="true"
                        fill
                        className="object-cover opacity-50 mix-blend-luminosity"
                        priority
                    />
                    {/* Sliced Effect Overlays (Diagonal gradients) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
                </div>

                <section className="relative z-10 mx-auto flex min-h-[calc(100svh-40px)] max-w-[1400px] flex-col justify-end px-6 md:px-12 lg:px-20 pb-12 lg:pb-20">
                    <div className="flex flex-col lg:flex-row items-end justify-between gap-12 w-full">
                        {/* Left Content Column */}
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="flex flex-col items-start text-left space-y-6 md:space-y-8 w-full lg:w-1/2 mb-12 lg:mb-0"
                        >
                            {/* Elite Badge */}
                            <motion.div
                                variants={itemVariants}
                                className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold backdrop-blur-md text-white/80 border border-white/10 uppercase tracking-[0.2em]"
                            >
                                Mimick.me • AI Agents
                            </motion.div>

                            {/* Immersive Headline */}
                            <motion.div variants={itemVariants} className="space-y-4">
                                <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light tracking-tight leading-[1.1]">
                                    Your 24/7 AI <br />
                                    <span className="italic font-normal">representative.</span>
                                </h1>
                                <p className="max-w-md text-sm md:text-base text-white/60 leading-relaxed font-light lowercase tracking-wide">
                                    Helping you build personal AI agents that generate leads and showcase your skills, even when you’re offline.
                                </p>
                            </motion.div>

                            {/* Minimalist CTA */}
                            <motion.div variants={itemVariants} className="pt-2">
                                <Button
                                    asChild
                                    size="lg"
                                    className="h-12 rounded-full bg-white px-8 text-sm font-bold text-black transition-all hover:scale-[1.02] hover:bg-neutral-200 active:scale-[0.98]"
                                >
                                    <Link href="/auth/signup" title="Start building your AI representative">
                                        Start building
                                    </Link>
                                </Button>
                            </motion.div>
                        </motion.div>

                        {/* Bottom Right Features (Function Health Style) */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1, duration: 1 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10 border-t border-white/10 pt-8 w-full lg:w-auto"
                        >
                            <div className="space-y-1">
                                <h3 className="text-base font-sans md:text-lg font-bold tracking-tight">24/7 Availability</h3>
                                <p className="text-[10px] text-white/30 uppercase tracking-widest font-medium">Always Online</p>
                            </div>
                            <div className="space-y-1 md:border-l md:border-white/10 md:pl-6 lg:pl-10">
                                <h3 className="text-base font-sans md:text-lg font-bold tracking-tight">Global Reach</h3>
                                <p className="text-[10px] text-white/30 uppercase tracking-widest font-medium">Any Language</p>
                            </div>
                            <div className="space-y-1 md:border-l md:border-white/10 md:pl-6 lg:pl-10">
                                <h3 className="text-base font-sans md:text-lg font-bold tracking-tight">Verified ROI</h3>
                                <p className="text-[10px] text-white/30 uppercase tracking-widest font-medium">Income Driven</p>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Decorative Slices */}
                <div className="pointer-events-none absolute inset-0 z-0 opacity-20">
                    <div className="absolute top-0 left-1/3 h-full w-[0.5px] bg-gradient-to-b from-transparent via-white/50 to-transparent transform -skew-x-[25deg]" />
                    <div className="absolute top-0 left-2/3 h-full w-[0.5px] bg-gradient-to-b from-transparent via-white/50 to-transparent transform -skew-x-[25deg]" />
                </div>
            </main>
            <FeaturesInteractive />
            <MonitorSection />
        </>
    );
}
