---
name: setup
description: First session in a project made from starter-kit. Names the product, wires Neon and Vercel, seeds, proves sign in, pushes, and confirms the first deploy. Idempotent, every step checks before it acts. Use when a repo still carries the starter-kit defaults, or when an earlier setup stopped partway.
---

# setup

Runs once per project and survives being run again. Every step checks
whether it is already done and skips if so, so a failure at step six
resumes at step six instead of creating a second Neon project.

Apply the `unslop` skill to everything written. Never delete a Neon project,
a Neon branch or a Vercel project. Never run `vercel deploy`. The push deploys.

## Before anything

1. **Check the tools.** Use ToolSearch to confirm the Neon MCP tools (`mcp__neon__create_project`, `mcp__neon__get_connection_string`) and the Vercel MCP are loaded. Run `gh auth status` and `vercel whoami`. If an MCP is down but its CLI works, continue with the CLI. If neither works, stop and give the fix from `docs/engineering/tooling.md`.
2. **Detect what is done.** Read `src/config.ts` (is the name still "Starter Kit"?), `.env.local` (exists? `DATABASE_URL` filled?), `.vercel/project.json`, `.starter-kit`, and whether `docs/product/decisions.md` has an entry. Report a table of steps and their state before doing anything.

## Steps

1. **Ask three things.** Product name, slug, one line. Nothing else. Timezone is a column on the organisation. The switcher is a flag in `config.ts`. Skip the question if the config already carries a real name.
2. **Rename.** The `product` block in `src/config.ts`. `name` in `package.json`. `name` and `short_name` in `public/manifest.webmanifest`. `MAIL_FROM` in `.env.example`. `name` in `.claude/launch.json`, set to the slug, so two projects open at once do not collide. Replace `{{PRODUCT}}`, `{{SLUG}}` and `{{ONE_LINE}}` in every `.md` file **outside `.claude/skills/`**, because this file names those placeholders as text and a blind replace corrupts it.

   Then rewrite `README.md`. It ships describing the template, so a product that keeps it tells a reader to create a repository from starter-kit. One paragraph on what the product is, how to run it locally, and where the docs are. Delete the template's version table and its "start a product" block.
3. **Env.** Copy `.env.example` to `.env.local` if missing. Fill `BETTER_AUTH_SECRET` and `CRON_SECRET` with `openssl rand -base64 32` where empty. Set `SEED_PASSWORD` to a generated value and tell the person where it is.
4. **Neon.** If `DATABASE_URL` is empty: list projects, reuse one named after the slug if it exists, else create it in the region nearest the users (Singapore for the Philippines). Create a `dev` branch if missing. Write the pooled connection string of `dev` into `.env.local`.
5. **Schema and seed.** `pnpm db:push`, then `pnpm db:seed`. The seed skips itself when the person exists.

   Then do both again against the `main` branch, with `DATABASE_URL` set to its connection string for those two commands only. Production reads `main`, `.env.local` points at `dev`, and nothing else ever pushes the schema there. Skip this and the first production deploy meets a database with no tables.
6. **Prove it locally.** Start the `dev` server through the browser preview. Sign in at `/sign-in` with the seed credentials. Expect the empty notes state at `/app`. Open `/design`. Read the console for errors. Fix before going on.

   If the preview refuses to start because another session holds the port, do not kill that server. Push a branch, let Vercel build a preview, and drive that instead. Say in the report that the proof came from a deployment rather than localhost.
7. **Checks.** `pnpm lint`, `pnpm typecheck`, `pnpm test`. All green.
8. **GitHub.** If there is no `origin`: `gh repo create <slug> --private --source=. --remote=origin`. Ask before making it public.
9. **Vercel.** If `.vercel/project.json` is missing: `vercel link --yes --project <slug>`. That connects the GitHub repository on its own when the remote exists, so `vercel git connect` is usually a confirmation rather than a step, and the next push deploys.

   Set env for preview and production now: `DATABASE_URL` (production gets the `main` branch string, preview gets `dev`), `BETTER_AUTH_SECRET` and `CRON_SECRET` (generate a fresh pair for each environment rather than reusing the local ones), `NEXT_PUBLIC_CONTACT_EMAIL`, `MAIL_PROVIDER=log` in both.

   `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` have to wait. The production domain is not known until the first deployment exists, because Vercel suffixes the name when `<slug>.vercel.app` is taken. Deploy, read the production alias from `vercel inspect`, set both to it, and let the next push pick them up. Sign in on production is broken until this is done.

   `NEXT_PUBLIC_CONTACT_EMAIL` appears on the public privacy page, so it publishes whatever address it holds. Ask before setting a personal one, and leave it unset if the answer is not ready.

   Say that production mail stays logged until a Resend key and sender exist.
10. **Record.** `gh api repos/cjjutba/starter-kit/commits/main --jq .sha` and write `.starter-kit` with `template`, `commit` and `date` lines. Append decision 001 to `docs/product/decisions.md`: started from starter-kit at that commit, the name, the slug, the Neon project, the Vercel project.
11. **Commit and push.** `git add -A`, commit as "Start <name> from starter-kit" with the reasoning in the body, push. Watch with `vercel ls` or the Vercel MCP until the production deployment is ready.
12. **Report.** The production URL, where the seed credentials are, and what stays manual: the Resend key, the domain, `MAIL_PROVIDER` in production.

## What the person does next

`/plan` to write the brief and the feature list, then `/feature F1`.
