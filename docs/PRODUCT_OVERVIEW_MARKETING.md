# Mimick.me — Product Overview for Marketing

A detailed overview of Mimick.me for marketing, sales, and partner materials.

---

## Executive Summary

**Mimick.me** is an AI-powered SaaS platform that lets professionals and businesses create **personal AI representatives** that work 24/7. Users get:

- **AI portfolio sites** — Publish a portfolio (or connect an existing site) and attach a conversational AI agent that represents them.
- **Lead generation & CRM** — The agent qualifies visitors, captures leads, and stores them in a simple CRM with conversation history.
- **Conversion insights** — AI-generated insights on visitor behavior and conversion patterns.
- **Embeddable chat** — Deploy the same agent on a portfolio page or as a standalone embed.

Mimick.me turns a static portfolio or website into a **conversational front door** that answers questions, matches the owner’s tone, and captures qualified leads automatically.

---

## Product Name & Positioning

- **Product name:** Mimick.me  
- **Tagline (current):** *Your 24/7 AI representative.*  
- **One-liner:** Mimick.me helps you build personal AI agents that generate leads and showcase your skills, even when you’re offline.

**Positioning:** Mimick.me is for individuals and small teams (freelancers, consultants, agencies) who want a professional presence that works around the clock—without hiring a sales or support team. The AI agent acts as a representative: it speaks in the user’s voice, uses their knowledge, and qualifies/captures leads for follow-up.

---

## Target Audience

1. **Freelancers & consultants** — Designers, developers, writers, marketers who want a portfolio that engages visitors and captures project inquiries.
2. **Job seekers & students** — People who want to stand out with a dynamic, AI-powered portfolio (supported by the free Starter plan).
3. **Agencies & small teams** — Teams managing multiple portfolios or client sites, with need for lead capture, analytics, and optional custom domains.
4. **Anyone with an existing website** — Users who already have a site and want to add an “Agent Rep only” (chat/lead capture) without rebuilding the whole site.

---

## Core User Flows

### 1. Sign-up and onboarding

- **Sign up:** `/auth/signup` — Email/password or optional OAuth (e.g. GitHub, Google).
- **Onboarding:** `/onboarding` — Conversational, step-by-step setup:
  - **Path choice:** “Agent Rep Only” (existing website + agent) or “Agent Rep + Portfolio” (full portfolio + agent).
  - **Profile:** Name, title, short bio.
  - **Work:** Services (tags), 1–3 projects (title + description).
  - **Existing-site path:** Website URL, target audience, contact preferences, FAQs for the agent.
  - **Preferences:** Tone (Professional, Friendly, Bold, Minimal), then public handle (e.g. `jane-doe`).
- Outcome: One or more **portfolios** and an **agent** linked to each, with optional published portfolio content.

### 2. Public portfolio and chat

- **Portfolio URL:** `/{handle}` (e.g. `Mimick.me.com/jane-doe`).
- **Templates:** Multiple portfolio themes (e.g. Modern, Veil, Bold, Editorial, Landing, Gallery, Minimal, Interactive).
- **Sections:** Hero, About, Services, Projects, Products, History, Testimonials, FAQ, Gallery, Contact/CTA — configurable per portfolio.
- **AI widget:** If the agent is enabled, visitors see a chat widget. The agent:
  - Uses the portfolio (and optional knowledge base) as context.
  - Speaks in the chosen tone and strategy (passive / consultative / sales).
  - Can qualify and capture leads (name, email, budget, project details, etc.) when intent is detected.

### 3. Embed-only agent

- **Embed page:** `/embed/[agentId]` — Full-page chat for the agent (e.g. for iframes or links).
- Same agent model, knowledge, and behavior as on the portfolio; no portfolio layout.

### 4. Dashboard (authenticated)

- **Overview:** `/dashboard` — Portfolio link, agent status, recent leads, credits, 7-day analytics snapshot.
- **Portfolio:** `/dashboard/portfolio` — Edit portfolio content, template, theme, publish.
- **Agent:** `/dashboard/agent` — Enable/disable, model, behavior (Friendly, Professional, Sales, Minimal), **strategy mode** (Passive / Consultative / Sales), custom prompt, temperature, display name, avatar, intro, role label; **Integrations** (e.g. Google Calendar); **Widget** (preview); **Test Chat**.
- **Leads:** `/dashboard/leads` — List of captured leads; click through to lead detail with full conversation and **Warm intro** (AI-generated follow-up email draft).
- **Analytics:** `/dashboard/analytics` — Page views, chat sessions, messages; daily breakdown; period filter.
- **Insights:** `/dashboard/insights` — AI-generated conversion insights (requires enough chat sessions); actionable recommendations.
- **Knowledge:** `/dashboard/knowledge` — Add text, files (e.g. PDF), or scrape a URL to build the agent’s knowledge base.
- **Pricing:** `/dashboard/pricing` — Plan comparison and upgrade.

### 5. Explore and discovery

- **Explore:** `/explore` — Browse published portfolios (creators, designers, developers, etc.) built with Mimick.me.

---

## Key Features (for marketing copy)

### Always-on AI representative

- One or more AI agents that represent the user 24/7 on their portfolio or embed.
- Configurable **personality** (friendly, professional, sales-focused, minimal) and **strategy** (passive, consultative, sales).
- Multiple **models** (e.g. Kimi K2.5, MiniMax M2.1, GLM 4.7, GPT-OSS 120B, Gemini 3 Flash, GPT-5 mini via gateway).

### Lead generation and CRM

- Automatic lead detection and capture (name, email, budget, project details, phone, website, meeting time).
- Lead status: New → Contacted → Closed.
- Full conversation history per lead.
- **Warm intro:** One-click AI-generated follow-up email draft (subject + body) from the lead’s context.

### Personality and strategy control

- **Strategy modes:**
  - **Passive:** Answers only; does not qualify or capture unless asked.
  - **Consultative:** Asks clarifying questions; captures when intent is clear.
  - **Sales:** Actively qualifies budget/timeline and pushes to next step.
- Confidence thresholds and industry tuning (e.g. legal, healthcare, finance, enterprise) so lead capture matches the user’s comfort level.

### Knowledge base

- **Knowledge** in the dashboard: add content via **text**, **file upload** (e.g. PDF), or **URL** (scrape).
- Chunked and used by the agent to answer questions accurately and in the user’s style.
- Supports “train your agent in minutes” messaging (e.g. link GitHub, Figma, Notion — concept reflected in marketing).

### Conversion insights

- AI-generated **Conversion Insights** from recent chat sessions (e.g. last 7 days).
- Requires minimum traffic (e.g. 5+ chat sessions) to generate.
- Summaries and recommendations to improve conversion and engagement.

### Analytics

- **Portfolio analytics:** Page views, chat session starts, chat messages.
- **AI telemetry:** Event types, model, mode, tokens, lead detection, success, latency, credit cost.
- Dashboards and period filters for trend and performance messaging.

### Templates and customization

- **Portfolio templates:** Modern, Veil, Bold, Editorial, Landing, Gallery, Minimal, Interactive.
- **Themes** (e.g. minimal) and **sections** (hero, about, services, projects, etc.) for a “sounds like you” / “match your tone” narrative.

### Integrations (current and messaging)

- **Google Calendar:** Working hours, off days, availability (Pro and above).
- **Embed:** Shareable/embeddable chat via `/embed/[agentId]`.
- **Custom domain** (Pro) — “Custom domain support” on pricing.
- **Webhooks** (Agency) — For power users and integrations.

### Billing and plans

- **Starter (Free):** 1 portfolio, 1 agent, 100 AI messages/month, standard templates.
- **Pro ($19/mo):** 3 portfolios, 3 agents, 1,000 AI messages/month, Google Calendar, Lead Capture & CRM, premium templates, custom domain.
- **Agency ($49/mo):** 10 portfolios, 10 agents, 10,000 AI messages/month, deep AI analytics, webhooks, priority support.

Credits and usage are tracked per user; protected routes and APIs enforce authentication and plan limits.

---

## Technical Differentiators (for technical marketing)

- **Next.js 16** — App Router, server components, modern React.
- **Auth** — Better-auth (credentials + optional OAuth), session-based access control.
- **Database** — Neon Postgres + Drizzle ORM; normalized schema for users, portfolios, agents, leads, knowledge, analytics, insights.
- **AI** — Vercel AI SDK; multiple models and gateways; streaming; lead detection and warm-intro generation.
- **Agent quality** — **Agent eval workflow** (fixtures + thresholds) to gate prompt/model/lead-logic changes and avoid regressions (lead precision/recall, policy adherence, tone).
- **Embeddable** — Public portfolio pages and standalone embed chat for maximum distribution.

---

## Messaging Pillars (for campaigns)

1. **24/7 representative** — “Your AI representative never sleeps. Showcase your skills and capture leads even when you’re offline.”
2. **Sounds like you** — “An agent that matches your tone—professional, friendly, bold, or minimal—and answers from your knowledge.”
3. **Lead generation** — “Qualify visitors and capture leads automatically. Warm intro drafts ready to send.”
4. **From portfolio to pipeline** — “Turn a static portfolio into a conversational front door that works for you.”
5. **Train in minutes** — “Add text, files, or a URL. Your agent learns how you work and what you offer.”
6. **Simple pricing** — “No hidden fees. Starter free; Pro and Agency scale with your business.”

---

## Landing Page Structure (current)

- **Hero:** Headline (“Your 24/7 AI representative.”), subline (build personal AI agents that generate leads and showcase your skills), CTA “Start Building.”
- **Features:** “Let your agent do the talking” — Always Available, Lead Generation, Personality Matching, Knowledge Base (with illustrations).
- **Integrations:** “Train your agent in minutes” — Link GitHub, Figma, Dribbble, Notion; auto knowledge base.
- **Content:** “An agent that sounds like you” — Capture Leads, Answer Questions, Match Your Tone.
- **Pricing:** Starter / Pro / Agency; “Simple, transparent pricing.”
- **Footer:** Standard links and legal.

---

## SEO and Discovery

- **Explore** page: “Discover portfolios built with Ref” — supports long-tail discovery and social proof.
- **Public portfolios:** Each portfolio has metadata (title, description) and canonical URL for SEO.
- **Handle-based URLs:** Clean, shareable links (`Mimick.me.com/jane-doe`).

---

## Summary Table

| Area            | Description |
|-----------------|------------|
| **Product**     | Mimick.me — AI-powered portfolios and 24/7 AI representatives. |
| **Audience**    | Freelancers, consultants, job seekers, agencies, anyone with a site. |
| **Core value**  | Lead generation + professional presence + conversational AI that represents you. |
| **Plans**       | Starter (free), Pro ($19/mo), Agency ($49/mo). |
| **Key features** | AI agent (multi-model, strategy, tone), leads & CRM, warm intro, knowledge base, analytics, conversion insights, embed, templates. |
| **Differentiator** | Strategy modes (passive/consultative/sales), personality matching, agent evals for quality, optional portfolio or agent-only setup. |

Use this document for website copy, sales one-pagers, partner briefs, and ad creative. Update numbers (e.g. message limits, price) from the app and pricing components when they change.
