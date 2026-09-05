# starter-kit

The repo every new product starts from, so no agent session begins from
scratch. Next.js 16, Postgres on Neon through Drizzle, Better Auth with
organisations, Tailwind v4 with a settled design system, five Claude Code
skills that run the workflow, and a set of rules that fail the build instead
of living in prose.

Real data from the first commit. No mock store, no fixtures driving screens.
One seed that creates one person and their organisation so sign in works.

## Start a product

```bash
gh repo create my-product --template cjjutba/starter-kit --private --clone
cd my-product && claude
```

Private is the default because most products are for a client. Add
`--public` for portfolio work. Then, inside Claude Code:

| Skill | When | What it does |
| --- | --- | --- |
| `/setup` | Once, first session | Names the product, wires Neon and Vercel, seeds, deploys, writes decision 001. Idempotent. |
| `/plan` | Before feature one | Fills the product docs in order and ends with a feature list where each has a "done means" line. |
| `/feature F1` | Per feature | The loop: plan the slice, build, verify, review, fix, PR, merge, production green. |
| `/verify` | Any time | Drives the running app the way a person does. Each feature adds its steps. |
| `/image` | When a board, mark or asset is needed | Writes the prompt from the brief and DESIGN.md, prices it, runs fal, files the result beside its prompt. |

## Run it here

```bash
pnpm install
cp .env.example .env.local   # fill DATABASE_URL and BETTER_AUTH_SECRET
pnpm db:push && pnpm db:seed
pnpm dev
```

Then `/design` for the design sheet, `/sign-in` with the seeded person, and
`/app` for the example feature.

## What is in the box

- **Design system.** Tokens in `globals.css`, the primitives in `src/components/primitives/`, the shadcn set token mapped, Geist self hosted, dark mode as a token remap. `DESIGN.md` explains it and `/design` renders it.
- **Data layer.** A lazy Neon client, a schema where every tenant table carries `organisation_id`, and a scoped query layer that cannot be called without one. The raw handle cannot leave `src/lib/db`, `src/lib/auth`, `src/lib/mail` or `src/lib/guard`.
- **Auth.** Email and password, organisations with invitations, a personal organisation on sign up, an active organisation on every session, route protection in `proxy.ts`, and the real check in every page.
- **Mail, guards, cron.** One `send()` with a log provider for everything but production. A Postgres rate limiter and a honeypot on the one public form. An example cron with a secret.
- **Rules as tests.** No hex in components, no dashes in prose, every table classified and scoped, no raw date arithmetic, no raw database imports. `pnpm test` runs them, CI runs them, and the axe smoke test walks every public route in both themes.
- **Docs.** `AGENTS.md` for every agent, `docs/product/` and `docs/design/` as templates with a word cap and a prompt per section, and `docs/engineering/` for the detail.

## Versions

Pinned to the set that passed the fresh clone proof. Dependabot opens a PR
when any of them moves.

| Package | Version |
| --- | --- |
| next | 16.3.4 |
| react | 19.2.8 |
| better-auth | 1.7.2 |
| drizzle-orm | 0.45.2 |
| @neondatabase/serverless | 1.1.0 |
| tailwindcss | 4.3.3 |
| shadcn | 4.21.0 |
| geist | 1.7.2 |
| typescript | 5.9 |
| vitest | 4.1.11 |
| @playwright/test | 1.63.0 |
| Node | 22 or later. The Better Auth CLI needs it. |

## Keeping it fresh

The template rots at the rate of its dependencies, so the durable parts are
the docs, the tokens and the rules. When a project made from this is a
version behind, run Dependabot's PR on the template first, prove it on a
fresh clone, then bring the project up to it. The `.starter-kit` file in a
project records the template commit it started from.

## Licence

All rights reserved. Readable as evidence of how the author works, not
licensed for reuse.
