'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

import { ChevronRight, Shield, Cloud, Cpu } from 'lucide-react'
import { Vercel } from '@/components/ui/svgs/vercel'
import { Supabase } from '@/components/ui/svgs/supabase'
import { Linear } from '@/components/ui/svgs/linear'
import { Slack } from '@/components/ui/svgs/slack'
import { Firebase } from '@/components/ui/svgs/firebase'
import { ClerkIconDark as Clerk } from '@/components/ui/svgs/clerk'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { cn } from '@/lib/utils'

type Feature = 'seamless-integrations' | 'real-time-sync' | 'developer-first' | 'enterprise-ready'

export default function Features() {
    const [feature, setFeature] = useState<Feature>('seamless-integrations')
    return (
        <section className="bg-background @container py-24">
            <div className="@2xl:grid-cols-2 mx-auto grid max-w-3xl gap-6 px-6">
                <div>
                    <div>
                        <h2 className="text-balance font-serif text-4xl font-medium">Built for independent consultants and coaches</h2>
                        <p className="text-muted-foreground mb-6 mt-4 text-balance">Position premium services, qualify high-intent leads, and convert profile traffic into discovery calls with an always-on AI rep.</p>
                        <Button
                            variant="secondary"
                            size="sm"
                            asChild
                            className="gap-1 pr-1.5">
                            <Link href="/auth/signup" title="Get started">
                                Get started
                                <ChevronRight aria-hidden="true" />
                            </Link>
                        </Button>
                    </div>
                    <div className="mt-16 *:w-full *:cursor-pointer">
                        <button
                            onClick={() => setFeature('seamless-integrations')}
                            data-selected={feature === 'seamless-integrations'}
                            className="not-data-[selected=true]:hover:text-foreground not-data-[selected=true]:text-muted-foreground flex items-center gap-3 py-2 text-sm">
                            <span className="text-xs font-mono tracking-widest text-muted-foreground/50 mr-2 group-data-[selected=true]:text-foreground/80">01</span>
                            <span className="in-data-[selected=true]:text-shadow-[0.2px_0_0_currentColor]">Always Available</span>
                        </button>
                        <button
                            onClick={() => setFeature('real-time-sync')}
                            data-selected={feature === 'real-time-sync'}
                            className="group not-data-[selected=true]:hover:text-foreground not-data-[selected=true]:text-muted-foreground flex items-center gap-3 py-3 text-sm transition-colors border-b border-border/40">
                            <span className="text-xs font-mono tracking-widest text-muted-foreground/50 mr-2 group-data-[selected=true]:text-foreground/80">02</span>
                            <span className="in-data-[selected=true]:text-shadow-[0.2px_0_0_currentColor]">Lead Generation</span>
                        </button>
                        <button
                            onClick={() => setFeature('developer-first')}
                            data-selected={feature === 'developer-first'}
                            className="group not-data-[selected=true]:hover:text-foreground not-data-[selected=true]:text-muted-foreground flex items-center gap-3 py-3 text-sm transition-colors border-b border-border/40">
                            <span className="text-xs font-mono tracking-widest text-muted-foreground/50 mr-2 group-data-[selected=true]:text-foreground/80">03</span>
                            <span className="in-data-[selected=true]:text-shadow-[0.2px_0_0_currentColor]">Personality Matching</span>
                        </button>
                        <button
                            onClick={() => setFeature('enterprise-ready')}
                            data-selected={feature === 'enterprise-ready'}
                            className="group not-data-[selected=true]:hover:text-foreground not-data-[selected=true]:text-muted-foreground flex items-center gap-3 py-3 text-sm transition-colors border-b border-border/40">
                            <span className="text-xs font-mono tracking-widest text-muted-foreground/50 mr-2 group-data-[selected=true]:text-foreground/80">04</span>
                            <span className="in-data-[selected=true]:text-shadow-[0.2px_0_0_currentColor]">Knowledge Base</span>
                        </button>
                    </div>
                </div>
                <div className="@max-xl:-mx-6 not-dark:bg-linear-to-b not-dark:via-muted relative flex items-center overflow-hidden rounded-3xl *:w-full min-h-[220px]">
                    <div
                        aria-hidden
                        className={cn('*:bg-linear-to-r not-dark:opacity-50 mask-y-from-65% *:to-muted dark:*:to-foreground/2 absolute inset-0 grid grid-cols-4 duration-300', feature === 'seamless-integrations' && '*:bg-linear-to-t grid-cols-1 grid-rows-12', feature === 'developer-first' && '*:bg-linear-to-l grid-cols-2 dark:opacity-50', feature === 'real-time-sync' && '*:opacity-35')}>
                        <div />
                        <div />
                        <div />
                        <div />
                    </div>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={feature}
                            initial={{ opacity: 0, y: 10, filter: "blur(2px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, y: -10, filter: "blur(2px)" }}
                            transition={{ duration: 0.2 }}
                            className="absolute inset-0 flex items-center justify-center w-full h-full"
                        >
                            <div className="w-full">
                                {feature === 'seamless-integrations' && <IntegrationsIllustration />}
                                {feature === 'real-time-sync' && <RealTimeIllustration />}
                                {feature === 'developer-first' && <DeveloperIllustration />}
                                {feature === 'enterprise-ready' && <EnterpriseIllustration />}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    )
}

const IntegrationsIllustration = () => {
    return (
        <div
            aria-hidden
            className="**:fill-foreground flex h-44 flex-col justify-between pt-8">
            <div className="relative flex h-10 items-center gap-12 px-6">
                <div className="bg-border absolute inset-0 my-auto h-px"></div>

                <div className="bg-card shadow-black/6.5 ring-border relative flex h-8 items-center rounded-full px-3 shadow-sm ring">
                    <Vercel className="size-3.5" />
                </div>
                <div className="bg-card shadow-black/6.5 ring-border relative flex h-8 items-center rounded-full px-3 shadow-sm ring">
                    <Slack className="size-3.5" />
                </div>
            </div>
            <div className="pl-17 relative flex h-10 items-center justify-between gap-12 pr-6">
                <div className="bg-border absolute inset-0 my-auto h-px"></div>

                <div className="bg-card shadow-black/6.5 ring-border relative flex h-8 items-center rounded-full px-3 shadow-sm ring">
                    <Clerk className="size-3.5" />
                </div>
                <div className="bg-card shadow-black/6.5 ring-border relative flex h-8 items-center rounded-full px-3 shadow-sm ring">
                    <Linear className="size-3.5" />
                </div>
            </div>
            <div className="relative flex h-10 items-center gap-20 px-8">
                <div className="bg-border absolute inset-0 my-auto h-px"></div>

                <div className="bg-card shadow-black/6.5 ring-border relative flex h-8 items-center rounded-full px-3 shadow-sm ring">
                    <Supabase className="size-3.5" />
                </div>
                <div className="bg-card shadow-black/6.5 ring-border relative flex h-8 items-center rounded-full px-3 shadow-sm ring">
                    <Firebase className="size-3.5" />
                </div>
            </div>
        </div>
    )
}

const RealTimeIllustration = () => {
    return (
        <div
            aria-hidden
            className="relative h-44 translate-y-6">
            <div className="bg-foreground/15 absolute inset-0 mx-auto w-px"></div>
            <div className="absolute -inset-x-16 top-6 aspect-square rounded-full border"></div>
            <div className="border-primary mask-l-from-50% mask-l-to-90% mask-r-from-50% mask-r-to-50% absolute -inset-x-16 top-6 aspect-square rounded-full border"></div>
            <div className="absolute -inset-x-8 top-24 aspect-square rounded-full border"></div>
            <div className="mask-r-from-50% mask-r-to-90% mask-l-from-50% mask-l-to-50% absolute -inset-x-8 top-24 aspect-square rounded-full border border-lime-500"></div>
        </div>
    )
}

const EnterpriseIllustration = () => {
    return (
        <div
            aria-hidden
            className="relative flex size-44 items-center justify-center">
            <Shield className="absolute inset-0 size-full stroke-[0.1px] opacity-15" />
            <Shield className="fill-card dark:fill-foreground/10 drop-shadow-black/3 stroke-border size-32 stroke-[0.2px] drop-shadow-xl" />
        </div>
    )
}

const DeveloperIllustration = () => {
    return (
        <div
            aria-hidden
            className="*:bg-foreground/15 flex h-44 justify-between pb-6 pt-12 *:h-full *:w-px">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div className="bg-primary!"></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div className="bg-primary!"></div>
            <div></div>
            <div></div>
            <div></div>
            <div className="bg-primary!"></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div className="bg-primary!"></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div className="bg-primary!"></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div className="bg-primary!"></div>
        </div>
    )
}
