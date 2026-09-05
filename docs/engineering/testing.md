# Testing

Cap: 300 words. Three layers, each with a job.

## Rules, in `tests/rules/`

The rules from `AGENTS.md` that a test can check. No hex in a component. No
dashes anywhere. Every table classified, every tenant table scoped. They
run on every `pnpm test` and need no database. Add one when an instruction
gets written twice.

## Unit, in `tests/unit/`

The scoped layer against PGlite, an in-process Postgres, with two
organisations that must never see each other. The time helpers. Anything
that needs a real database, like the rate limiter, reads `DATABASE_URL`
from `.env.local` and skips itself when it is absent, which is what CI
does. Those run in the fresh clone proof.

## End to end, in `tests/e2e/`

axe with the WCAG 2A and 2AA tags on every public route from
`src/content/routes.ts`, in light and dark. Playwright starts the
production build or points at `E2E_BASE_URL`. Add a route to the directory
and it is covered.

## What runs where

| | `pnpm test` | `pnpm test:e2e` | CI | Fresh clone proof |
| --- | --- | --- | --- | --- |
| Rules | yes | | yes | yes |
| Scoped, time | yes | | yes | yes |
| Database gated | if URL | | skipped | yes |
| axe | | yes | yes | yes |

## What is not automated

Signing in, creating a record, sending an invitation. The `verify` skill
drives those the way a person does, and each feature adds its steps. It
runs before every review.
