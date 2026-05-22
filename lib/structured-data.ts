import { PLAN_LIMITS } from "@/lib/plan-limits";

export const publicPricingTiers = [
  {
    name: "Starter",
    price: 0,
    priceDisplay: "$0",
    period: "",
    description: "Perfect for students and job seekers looking to stand out.",
    features: [
      `${PLAN_LIMITS.free.portfolios} AI Portfolio`,
      `${PLAN_LIMITS.free.agents} AI Agent Clone`,
      `${PLAN_LIMITS.free.aiMessagesPerMonth} AI Messages / mo`,
      `${PLAN_LIMITS.free.leadCapturesPerMonth} lead captures/month`,
      "Standard Templates",
    ],
  },
  {
    name: "Pro",
    price: 24,
    priceDisplay: "$24",
    period: "/month",
    description: "For freelancers and creators scaling their pipeline.",
    features: [
      `${PLAN_LIMITS.pro.portfolios} AI Portfolios`,
      `${PLAN_LIMITS.pro.agents} AI Agents`,
      `${PLAN_LIMITS.pro.aiMessagesPerMonth.toLocaleString()} AI Messages / mo`,
      "Unlimited lead captures",
      "Google Calendar Integration",
      "Custom Domain Support",
    ],
    highlighted: true,
  },
  {
    name: "Agency",
    price: 79,
    priceDisplay: "$79",
    period: "/month",
    description: "Built for agencies and consultants managing multiple brands.",
    features: [
      `${PLAN_LIMITS.business.portfolios} AI Portfolios`,
      `${PLAN_LIMITS.business.agents} AI Agents`,
      `${PLAN_LIMITS.business.aiMessagesPerMonth.toLocaleString()} AI Messages / mo`,
      "Everything in Pro",
      "Priority Support",
    ],
  },
] as const;

export const productFaqs = [
  {
    question: "Can I use my own domain?",
    answer: "Yes! Our Pro and Agency plans allow you to connect a custom domain to your portfolio easily.",
  },
  {
    question: "What counts as an \"AI message\"?",
    answer:
      "Any time a visitor chats with your AI agent, it counts as one message. Testing the chat in your dashboard is also included in your limits.",
  },
  {
    question: "Is there a long-term commitment?",
    answer: "No, all plans are month-to-month and you can cancel anytime from your settings.",
  },
  {
    question: "Does the AI collect secure payment info?",
    answer:
      "No, our AI is trained to handle conversation and scheduling. Payments for your services should be handled via traditional links you provide or integrate.",
  },
  {
    question: "Which plan includes lead capture and CRM tools?",
    answer: "Lead Capture & CRM is included on Pro, and Agency includes everything in Pro plus advanced scale features.",
  },
  {
    question: "Can I upgrade or downgrade my plan later?",
    answer: "Yes. You can upgrade, downgrade, or cancel anytime with no hidden fees.",
  },
] as const;

export const softwareFeatureList = [
  "AI portfolio builder",
  "AI agent cloning",
  "Lead capture and CRM",
  "Google Calendar integration",
  "Custom domain support",
  "Deep AI analytics",
  "Webhook integrations",
] as const;
