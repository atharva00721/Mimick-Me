import { PLAN_LIMITS } from "@/lib/plan-limits";

export interface Plan {
  id: string;
  title: string;
  description: string;
  highlight?: boolean;
  type?: "monthly" | "yearly";
  currency?: string;
  monthlyPrice: string;
  yearlyPrice: string;
  buttonText: string;
  badge?: string;
  features: {
    name: string;
    icon: string;
    iconColor?: string;
  }[];
}

export interface CurrentPlan {
  plan: Plan;
  type: "monthly" | "yearly" | "custom";
  price?: string;
  nextBillingDate: string;
  paymentMethod: string;
  status: "active" | "inactive" | "past_due" | "cancelled";
}

export const plans: Plan[] = [
  {
    id: "free",
    title: "Free",
    description: "Perfect for students and job seekers looking to stand out.",
    currency: "$",
    monthlyPrice: "0",
    yearlyPrice: "0",
    buttonText: "Upgrade to Free",
    features: [
      { name: `${PLAN_LIMITS.free.portfolios} AI Portfolio`, icon: "check", iconColor: "text-green-500" },
      { name: `${PLAN_LIMITS.free.agents} AI Agent Clone`, icon: "check", iconColor: "text-green-500" },
      { name: `${PLAN_LIMITS.free.aiMessagesPerMonth} AI messages/month`, icon: "check", iconColor: "text-green-500" },
      { name: `${PLAN_LIMITS.free.leadCapturesPerMonth} lead captures/month`, icon: "check", iconColor: "text-green-500" },
      { name: "Standard templates", icon: "check", iconColor: "text-green-500" },
    ],
  },
  {
    id: "pro",
    title: "Pro",
    description: "For freelancers and creators scaling their pipeline.",
    currency: "$",
    monthlyPrice: "24",
    yearlyPrice: "240",
    buttonText: "Upgrade to Pro",
    badge: "Most popular",
    highlight: true,
    features: [
      { name: `${PLAN_LIMITS.pro.portfolios} AI Portfolios`, icon: "check", iconColor: "text-green-500" },
      { name: `${PLAN_LIMITS.pro.agents} AI Agents`, icon: "check", iconColor: "text-green-500" },
      { name: `${PLAN_LIMITS.pro.aiMessagesPerMonth.toLocaleString()} AI messages/month`, icon: "check", iconColor: "text-green-500" },
      { name: "Unlimited lead captures", icon: "check", iconColor: "text-green-500" },
      { name: "Google Calendar integration", icon: "check", iconColor: "text-green-500" },
      { name: "Custom domain", icon: "check", iconColor: "text-green-500" },
    ],
  },
  {
    id: "business",
    title: "Agency",
    description: "Built for agencies and consultants managing multiple brands.",
    currency: "$",
    monthlyPrice: "79",
    yearlyPrice: "790",
    buttonText: "Go Agency",
    features: [
      { name: `${PLAN_LIMITS.business.portfolios} AI Portfolios`, icon: "check", iconColor: "text-green-500" },
      { name: `${PLAN_LIMITS.business.agents} AI Agents`, icon: "check", iconColor: "text-green-500" },
      { name: `${PLAN_LIMITS.business.aiMessagesPerMonth.toLocaleString()} AI messages/month`, icon: "check", iconColor: "text-green-500" },
      { name: "Everything in Pro", icon: "check", iconColor: "text-green-500" },
      { name: "Priority support", icon: "check", iconColor: "text-green-500" },
    ],
  },
];
