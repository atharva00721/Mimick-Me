"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, Check, Loader2, XCircle } from "lucide-react";
import { CancelSubscriptionDialog } from "@/components/billingsdk/cancel-subscription-dialog";
import { plans } from "@/lib/billingsdk-config";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface BillingTabProps {
    user: {
        plan: string;
        credits: number;
    };
    loadingPlan: string | null;
    loadingPortal: boolean;
    handleUpgrade: (planId: string) => void;
    handleManageSubscription: () => void;
}

export function BillingTab({ user, loadingPlan, loadingPortal, handleUpgrade, handleManageSubscription }: BillingTabProps) {
    const router = useRouter();

    const handleCancel = async () => {
        try {
            const res = await fetch("/api/billing/cancel", { method: "POST" });
            const data = await res.json();
            if (res.ok) {
                toast.success("Subscription cancelled. You will have access until the end of the billing period.");
                router.refresh();
            } else {
                toast.error(data.error || "Failed to cancel");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    const currentPlanDetails = plans.find(p => p.id === user.plan) || plans[0];

    return (
        <div className="space-y-6 pt-4">
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="flex flex-col">
                    <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                            <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500">
                                <Zap className="size-6" />
                            </div>
                            <Badge variant="secondary" className="capitalize">{user.plan}</Badge>
                        </div>
                        <CardTitle className="text-xl">Plan & Usage</CardTitle>
                        <CardDescription>
                            Your current subscription and credit balance.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-md bg-muted/50 border border-border">
                            <span className="text-sm font-medium text-muted-foreground">Credits Remaining</span>
                            <span className="text-xl font-bold">{user.credits}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="flex flex-col border-primary/20 bg-primary/5">
                    <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                <Check className="size-6" />
                            </div>
                            <Badge variant="default" className="bg-primary">Active</Badge>
                        </div>
                        <CardTitle className="text-xl capitalize">{user.plan} Plan</CardTitle>
                        <CardDescription>
                            You are currently on the {user.plan} plan.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <p className="text-sm text-muted-foreground font-medium">
                            Manage your subscription and billing details via our payment partner.
                        </p>
                    </CardContent>
                    <CardFooter className="bg-primary/5 border-t border-primary/10 mt-auto">
                        <div className="flex flex-col gap-2 w-full">
                            <Button
                                variant="outline"
                                className="w-full bg-background"
                                disabled={user.plan === "free" || loadingPortal}
                                onClick={handleManageSubscription}
                            >
                                {loadingPortal && <Loader2 className="size-4 animate-spin mr-2" />}
                                Manage Subscription
                            </Button>

                            {user.plan !== "free" && (
                                <CancelSubscriptionDialog
                                    title="Cancel Subscription"
                                    description="We're sorry to see you go. You can cancel your subscription below."
                                    plan={currentPlanDetails}
                                    onCancel={handleCancel}
                                    triggerButtonText="Cancel Plan"
                                    className="max-w-4xl"
                                    leftPanelImageUrl="https://framerusercontent.com/images/GWE8vop9hubsuh3uWWn0vyuxEg.webp"
                                />
                            )}
                        </div>
                    </CardFooter>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {[
                    {
                        id: "pro",
                        name: "Pro",
                        price: "$24",
                        description: "For freelancers and creators scaling their pipeline.",
                        features: ["3 Portfolios", "3 AI Agents", "2,000 AI messages/month", "Unlimited lead captures", "Full CRM dashboard", "Google Calendar integration", "Custom domain", "Premium templates", "Message overage ($4/500 msgs)"],
                    },
                    {
                        id: "business",
                        name: "Agency",
                        price: "$79",
                        description: "Built for agencies and consultants managing multiple brands.",
                        features: ["10 Portfolios", "10 AI Agents", "15,000 AI messages/month", "Everything in Pro", "White-label branding", "Deep analytics", "Webhook integrations", "Priority support"],
                    },
                ].map((plan) => (
                    <Card key={plan.id} className={user.plan === plan.id ? "opacity-60 pointer-events-none" : ""}>
                        <CardHeader>
                            <CardTitle className="text-lg">{plan.name}</CardTitle>
                            <CardDescription>{plan.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4">
                                <span className="text-3xl font-bold">{plan.price}</span>
                                <span className="text-muted-foreground ml-1">/month</span>
                            </div>
                            <ul className="space-y-2">
                                {plan.features.map((f) => (
                                    <li key={f} className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                        <Check className="size-3 text-primary shrink-0" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter className="border-t bg-muted/30">
                            <Button
                                className="w-full"
                                variant={plan.id === "pro" ? "default" : "outline"}
                                disabled={user.plan === plan.id || loadingPlan !== null}
                                onClick={() => handleUpgrade(plan.id)}
                            >
                                {loadingPlan === plan.id ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
                                {user.plan === plan.id ? "Active Plan" : `Upgrade to ${plan.name}`}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div >
    );
}
