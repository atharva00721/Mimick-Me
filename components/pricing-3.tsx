import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Check, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { publicPricingTiers } from '@/lib/structured-data'



export default function Pricing() {
    return (
        <section className="bg-background py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl text-balance">Simple, transparent pricing</h2>
                    <p className="mt-4 text-lg text-muted-foreground text-balance">
                        Everything you need to deploy your AI representative and start generating leads.
                    </p>
                </div>

                <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
                    {publicPricingTiers.map((plan) => {
                        const isHighlighted = 'highlighted' in plan && plan.highlighted

                        return (
                            <Card
                                key={plan.name}
                                className={cn(
                                    'flex flex-col justify-between rounded-3xl p-8 xl:p-10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border-border/50',
                                    isHighlighted ? 'bg-primary text-primary-foreground ring-1 ring-primary' : 'bg-card'
                                )}
                            >
                                <div>
                                    <div className="flex items-center justify-between gap-x-4 flex-wrap">
                                        <h3 className={cn("text-lg leading-8", isHighlighted ? "text-primary-foreground" : "text-foreground")}>
                                            {plan.name}
                                        </h3>
                                        {isHighlighted && (
                                            <p className="rounded-full bg-primary-foreground/10 px-2.5 py-1 text-xs font-semibold leading-5 text-primary-foreground whitespace-nowrap">
                                                Most popular
                                            </p>
                                        )}
                                    </div>
                                    <p className={cn("mt-4 text-sm leading-6 min-h-[48px]", isHighlighted ? "text-primary-foreground/80" : "text-muted-foreground")}>
                                        {plan.description}
                                    </p>
                                    <p className="mt-6 flex items-baseline gap-x-1">
                                        <span className={cn("text-4xl tracking-tight font-serif", isHighlighted ? "text-primary-foreground" : "text-foreground")}>{plan.priceDisplay}</span>
                                        <span className={cn("text-sm font-semibold leading-6", isHighlighted ? "text-primary-foreground/80" : "text-muted-foreground")}>{plan.period}</span>
                                    </p>

                                    <Button
                                        asChild
                                        variant={isHighlighted ? 'secondary' : 'default'}
                                        className={cn(
                                            "mt-8 w-full gap-2 rounded-full",
                                            isHighlighted && "bg-background text-foreground hover:bg-background/90"
                                        )}
                                    >
                                        <Link href="/auth/signup" title={`Get started with ${plan.name}`}>
                                            Get Started
                                            <ArrowRight aria-hidden="true" className="size-4" />
                                        </Link>
                                    </Button>

                                    <ul role="list" className={cn("mt-8 space-y-3 text-sm leading-6", isHighlighted ? "text-primary-foreground/90" : "text-muted-foreground")}>
                                        {plan.features.map((feature) => (
                                            <li key={feature} className="flex gap-x-3">
                                                <Check aria-hidden="true" className={cn("h-5 w-5 flex-none", isHighlighted ? "text-primary-foreground" : "text-primary")} />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </Card>
                        )
                    })}
                </div>

                <p className="text-muted-foreground mt-12 text-center text-sm font-medium">
                    No hidden fees. Upgrade, downgrade, or cancel anytime.
                </p>
            </div>
        </section>
    )
}
