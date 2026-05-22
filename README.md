# Mimick-Me (Next.js 16)

This app now includes:

- **Better Auth** with email/password sign-up/sign-in
- **Neon Postgres** + **Drizzle ORM**
- Per-user portfolios, agents, leads, and knowledge sources
- Public portfolio pages plus an embeddable chat widget

## Required environment variables

Create `.env.local`:

```bash
DATABASE_URL="postgresql://..."
AUTH_SECRET="replace-with-a-long-random-secret"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
TOKEN_ENCRYPTION_KEY="0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
NEBIUS_API_KEY=""

# Optional
NEXT_PUBLIC_ROOT_DOMAIN="localhost:3000"
TRUSTED_ORIGINS="http://localhost:3000"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
TAVILY_API_KEY=""
```

## Setup

```bash
bun install
bun db:push
bun dev
```

## Auth flow

- Sign up at `/auth/signup`
- Sign in at `/auth/signin`
- Most `/dashboard/*` pages and private API routes require authentication.

## Database schema

Defined in `lib/schema.ts`:

- `users` (id, email, name, plan, credits + auth fields)
- `leads` (id, name, email, company, userId, createdAt)
- `portfolios`, `agents`, `knowledgeSources`, `knowledgeChunks`, and related analytics tables
- Better Auth tables: `accounts`, `sessions`, `verifications`

## Agent eval workflow (pre-release gate)

Use the lightweight eval runner to score agent behavior across strategy modes before shipping prompt/model/lead-logic changes.

### Run locally

```bash
# Uses openai/gpt-5-mini by default. Override with EVAL_AGENT_MODEL if needed.
AI_GATEWAY_API_KEY=... bun evals:agent
```

Fixtures live in `lib/ai/evals/fixtures/*.json` and are executed through the same `generateAgentReply` pipeline used by public chat.

### Fixture format

Each fixture defines:

- `niche`: market segment for coverage
- `strategyMode`: one of `passive`, `consultative`, `sales`
- `behaviorType`: expected persona style
- `message` + `history`: representative conversation state
- `expected`: lead label proxy, tone expectation, and policy checks

### Metrics reported

Per strategy mode, the runner reports:

- `leadPrecision`: true-positive leads / predicted leads (proxy)
- `leadRecall`: true-positive leads / expected leads (proxy)
- `policyAdherence`: pass-rate of fixture policy checks
- `toneConsistency`: pass-rate of lightweight tone checks

### Thresholds and regression checks

Threshold configuration is in `lib/ai/evals/thresholds.ts`:

- `minimums`: hard floor for each metric
- `baseline`: expected steady-state score
- `regressionTolerance`: allowed drop from baseline

The eval exits non-zero when any metric misses a minimum OR regresses below `baseline - tolerance`.

### Adding fixtures

1. Add a new JSON file under `lib/ai/evals/fixtures/`.
2. Pick a unique `id` and the relevant `strategyMode`.
3. Set the `expected` lead/tone/policy assertions.
4. Run `bun evals:agent` and inspect per-fixture output for misses.
5. If behavior has intentionally shifted, update `lib/ai/evals/thresholds.ts` with a reviewed baseline/tolerance change.

### CI hook

GitHub Actions workflow `.github/workflows/agent-evals.yml` runs this eval automatically on PRs/pushes that touch prompt builder/reply pipeline/model/lead logic files.
