# AGENTS.md

## Cursor Cloud specific instructions

### Overview

Rep AI is a Next.js 16 SaaS app (TypeScript, App Router, React 19) that generates AI-powered portfolio websites with embedded AI agents. Uses Drizzle ORM with PostgreSQL (Neon), Better Auth for authentication, and Vercel AI SDK for LLM features.

### Package manager

**Always use Bun.** The lockfile is `bun.lock`. Commands: `bun install`, `bun dev`, `bun run build`, `bun run lint`.

### Running the dev server

```
bun dev
```

Starts on port 3000. The server loads environment variables from injected secrets and `.env.local` (secrets take precedence).

### Key commands

See `package.json` scripts for the canonical list. The most common:

- `bun dev` — start dev server
- `bun run build` — production build
- `bun run lint` — ESLint (pre-existing warnings/errors exist in the codebase)
- `bun db:push` — push Drizzle schema to database
- `bun db:generate` — generate Drizzle migrations
- `bun db:seed` — seed test data
- `bun evals:agent` — run AI agent evaluation suite

### Database

PostgreSQL via Neon. The `DATABASE_URL` is provided via injected secrets. Schema is in `lib/schema/`. Use `bun db:push` to sync schema changes. The `lib/db/index.ts` connection uses `ssl: "require"` — this is hardcoded and required for the Neon connection.

### Auth flow

Better Auth with email/password + Google OAuth. Sign up at `/auth/signup`, sign in at `/auth/signin`. Email verification is disabled for dev. No special auth tokens needed beyond the session cookie.

### Gotchas

- The `drizzle.config.ts` imports `dotenv/config` which may conflict with `bun --env-file=.env.local`. When running drizzle-kit commands, prefer the npm scripts (`bun db:push`, `bun db:migrate`) which handle env loading.
- `ssl: "require"` is hardcoded in the DB connection (`lib/db/index.ts`). If using a local PostgreSQL, it must have SSL enabled.
- Pre-existing lint errors exist in the codebase (e.g., `react/no-unescaped-entities`, `@typescript-eslint/no-explicit-any`). These are not regressions.
- The `bun run lint` command exits non-zero due to these pre-existing errors. This is expected.
