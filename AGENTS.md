# AGENTS.md

The operating manual for {{PRODUCT}}. Read this before writing anything.

`CLAUDE.md` imports this file, so Claude Code and Codex both land here.
`DESIGN.md` owns the design system. `docs/` holds the brief, the features,
the data model, the workflow and the engineering detail. This file stays
short so it is cheap to load every session. When a topic needs more than a
paragraph, it points at a doc instead of growing.

---

## Non-negotiables

1. **Build one feature at a time.** The loop is in `docs/workflow.md` and the `feature` skill runs it. Plan, build small, verify, review, fix, ship, repeat. Do not start a second feature before the first is on production and green.
2. **Ship from feature one.** Not at the end. Every merge to main deploys. A feature is not complete until it is live.
3. **Every tenant table carries `organisation_id`, and every query is scoped.** See Tenancy below and `docs/engineering/data.md`. A test and an eslint rule enforce it. This is the one bug class that would end the product.
4. **Nothing costs money until someone pays.** Free tiers only. No SMS provider, no paid API, no service that bills before revenue.
5. **Development and previews send nothing.** `MAIL_PROVIDER=log` writes every message to a table instead. Only production sets `resend`.
6. **No secrets in the repository, ever.** `.env.example` only. Seed and test data is visibly fictional. No data from any other project.
7. **Write like a person.** No em dashes, no en dashes, no hyphen standing in for a dash. Colons introduce lists, not clauses. Semicolons are almost never right. A test fails the build on a dash. Apply the `unslop` skill to anything that ships, including commit messages.
8. **Rules become code where they can.** A rule that only lives in prose gets skipped. When you write the same instruction twice, turn it into a lint, a test or a type. `tests/rules/` is where they go.

---

## What this is

{{ONE_LINE}}

`docs/product/brief.md` says who it is for and what has to be true. If that
file is still a template, run `/plan` before building anything.

**Audience order.** The person deciding whether to pay, then anyone
evaluating the work. In that order, because a product built to impress
developers is a worse product.

---

## Stack

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | Next.js 16, App Router | Server actions remove the need for a separate API. One deploy target. |
| Language | TypeScript, strict | |
| Database | Postgres on Neon | Free tier scales to zero and wakes on request. |
| ORM | Drizzle | Serverless friendly, no binary engine. |
| Auth | Better Auth | Real organisation and member primitives, which is what tenancy needs. |
| Styling | Tailwind v4, shadcn | Tokens in one CSS file. Components take them without edits. |
| Font | Geist, self hosted | Nothing fetched at runtime. |
| Email | Resend | Free tier. Production only. |
| Hosting | Vercel, free tier | A push deploys. Crons included. |

### Deliberately not used

**Supabase.** Its free tier pauses a project after about a week of inactivity
and needs a manual restore. A previous project died exactly this way. Neon
suspends and resumes itself.

**A separate API service.** Server actions and route handlers are enough for
a solo build. A second service doubles the deploy surface and the failure
modes.

**Any SMS provider.** Every gateway charges per message. Messages are rendered
and logged, and the log is visible. Add SMS when a paying customer asks.

**A payment gateway.** Record a reference number against a record, which is
what small businesses already do with cash and bank transfers. Add a gateway
when the volume justifies its fee.

**A native mobile app.** The client side is mobile-first web, installable as
a PWA. Native happens when a paying customer asks for it.

---

## Architecture

One Next.js application. Marketing at the root, the product under `/app`,
one deploy and one design system.

Server Components by default. `"use client"` only on interactive leaves.
Server actions for mutations, route handlers where a real HTTP endpoint is
needed. Static copy lives as typed data in `src/content/`, not as markup.
Every value that changes between products is in `src/config.ts`.

---

## Tenancy

Every tenant table carries `organisation_id`. No exceptions, and no "this one
is fine because it is only settings".

Application code reaches tenant tables only through `forOrganisation()` in
`src/lib/db/scoped.ts`, which cannot be called without an organisation id.
The raw handle is importable only inside the data layer, and eslint fails
the build otherwise. `tests/rules/tenancy.test.ts` fails when a table lacks
the column or is not classified in `src/lib/db/tables.ts`.

Every person has an organisation from the moment they sign up. Single tenant
products keep that and set `features.multipleOrganisations` to false.
Row level security is deliberately not in v1. It fights Better Auth and a
misconfigured policy is harder to see than a missing argument in code you
can read.

---

## Time

Every timestamp is `timestamptz` in UTC. The organisation row carries a
`timezone` column. Everything a person sees renders in that zone with the
zone labelled.

No raw `Date` arithmetic. `src/lib/time/` is the only module that imports
date-fns, and eslint enforces that. Need something new? Add a helper there.

---

## Public write paths

Anything a stranger can submit follows one pattern, shown in
`src/app/privacy/request/actions.ts`: honeypot, rate limit by IP, validate,
then act. A bot gets a quiet success. A person over the limit is told when
to try again.

---

## Privacy

The product collects names and email addresses. RA 10173, the Data Privacy
Act of 2012, applies to data about people in the Philippines. `/privacy`
ships with v1, the deletion request form works from day one, and
`docs/product/privacy.md` records what is collected and for how long.

---

## Where things live

| Path | What |
| --- | --- |
| `src/app/` | Routes. Marketing at the root, the auth pages, the product under `app/`. |
| `src/components/primitives/` | The design system, including the only modal anything is allowed to open. See `DESIGN.md`. |
| `src/components/ui/` | shadcn components, already token mapped. Add more with `pnpm dlx shadcn add`. |
| `src/lib/db/` | Drizzle client, schema, the table lists and the scoped layer. |
| `src/lib/auth/` | Better Auth config, session helpers, organisation helpers. |
| `src/lib/mail/`, `src/lib/guard/`, `src/lib/time/` | Mail with the log switch, the public form guards, the time helpers. |
| `src/content/` | Typed copy, the privacy notice, the route directory. |
| `src/config.ts` | Product name, slug, timezone default, feature flags, theme colours. |
| `tests/rules/` | The rules that fail the build. |
| `.claude/skills/` | `setup`, `plan`, `feature`, `verify`, `image`. |
| `docs/engineering/` | The detail this file points at. |
| `docs/product/`, `docs/design/` | Brief, features, decisions. Direction, pages, screens, explorations. |

---

## Definition of done

A feature is done when it is merged, on production, green in CI, covered by
`/verify`, and recorded: a decision entry if anything was decided, a
screenshot if a screen changed.

v1 is done when every feature in `docs/product/features.md` is done, the
privacy page is live, and the numbers in `docs/product/metrics.md` are
recorded.

---

## Accessibility

WCAG 2A and 2AA, checked by axe in `pnpm test:e2e` on every public route in
both colour schemes. Respect `prefers-reduced-motion`. Mobile first, because
the people who pay are on a phone.
