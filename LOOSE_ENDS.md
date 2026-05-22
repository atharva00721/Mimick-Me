# Loose Ends Review

## Fixed

- `tests/dashboard-structure.test.ts`
  - Updated stale path assertions from the removed `app/(dashboard)/dashboard` layout to the current `app/dashboard` structure.
- `tests/api-knowledge-route.test.ts`
  - Added missing mocks for `getActivePortfolio()` and `createKnowledgeSourceFromFile()`.
  - Updated expectations to match the current `getUserAgent(userId, portfolioId)` call.
- `app/agent.js/route.ts`
  - Fixed the proactive widget path so the launcher always mounts.
  - Removed the runtime dependency on an undeclared `wrapper` reference when badges render.
- `app/api/public-chat/route.ts`
  - Normalized origins before CORS comparison so valid origins do not fail on trailing-slash differences.
- `lib/db/index.ts`
  - Disabled forced SSL for localhost connections while keeping SSL required for remote databases.
- `lib/db/knowledge.ts`
  - Removed embedding/chunk orchestration from the DB layer so it stays a pure persistence module.
- `tests/api-knowledge-route.test.ts`
  - Expanded the service mock so it no longer breaks unrelated tests in the full Bun suite.
- `package.json`
  - Added a `bun test` script so tests are easier to run consistently.
- `.github/workflows/ci.yml`
  - Added a basic Bun CI workflow that runs lint and tests on PRs and `main`.
- `README.md` and `.env.example`
  - Updated auth/docs from old Auth.js wording to Better Auth.
  - Expanded the env example with the main variables used by local setup.
- `test-spy.ts`
  - Added an explicit opt-in guard and replaced hardcoded real emails with env-driven inputs.

## Still Worth Reviewing

- CI coverage
  - There is now a general lint/test workflow, but you may still want path filters or required checks depending on branch policy.
