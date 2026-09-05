---
name: feature
description: Runs the build loop for one feature from docs/product/features.md. Plan the slice, build, self check, verify, review at the right depth, fix, screenshot, record, PR, merge, production green. Use for every feature. Takes the feature id, for example "feature F2".
---

# feature

One feature, start to production. The loop is `docs/workflow.md`. This is
the checklist that makes it happen.

Apply the `unslop` skill to commit messages, PR bodies, copy and comments.
Never run `vercel deploy`. The push deploys.

## 1. Read

Read the feature's entry in `docs/product/features.md`, its pages in
`docs/design/pages.md`, and the glossary. If the entry has no "done means"
line, stop and run `/plan`. Say the review depth out loud.

## 2. Plan the slice

Write the plan in three to eight lines: the tables added, the pages added
or changed, the actions, the states. If a table is added, say the tenancy
classification. If a migration is needed, say it ships first. Branch:
`git switch -c feature/<id>-<slug>`.

## 3. Build

Follow `docs/engineering/conventions.md`. A new table goes through the
steps in `docs/engineering/data.md`. A new public write path copies the
pattern in `src/app/privacy/request/actions.ts`. New copy goes in
`src/content/`. A new route goes in `src/content/routes.ts` and
`docs/design/pages.md`.

## 4. Self check

`pnpm lint`, `pnpm typecheck`, `pnpm test`. Start the dev server in the
browser preview and click what was built. Then the five states from
`docs/design/states.md`: empty, loading, error, full, overflowing. Fix what
fails.

## 5. Verify

Add the feature's steps to `.claude/skills/verify/SKILL.md` under a heading
with the feature id. Run `/verify`. It has to pass end to end before review.

## 6. Review

Deep: the `interrogate` skill, or `/code-review` at high effort, looking for
tenancy leaks, permission holes, abuse paths and edge cases. Normal:
`/code-review` at the default. Fix what it finds. Push back with evidence on
what it gets wrong.

## 7. Record

A screenshot of each changed screen into `docs/design/screenshots/` as
`<date>-<page>.png`, taken from the local run. A dated entry in
`docs/product/decisions.md` for anything decided. A row in
`docs/design/states.md` for each new screen.

## 8. Ship

Commit in small steps with reasons in the body. Push. `gh pr create` with
the template filled in. Wait for CI green and the preview to build. If a
migration ships, run `pnpm db:migrate` against production first, as
`docs/engineering/deploy.md` says. Merge. Watch the production deployment
until it is ready.

## 9. Close

Mark the feature done in `docs/product/features.md`. Update
`docs/product/metrics.md` if a number changed. Say what is next.
