---
name: plan
description: Fills the product docs in order, in conversation, within each file's word cap, and ends with a feature list where every feature has a "done means" line and a review depth. Use before building feature one, or when docs/product/brief.md is still a template. Refuses to start a feature until the docs exist.
---

# plan

The step agents skip. A feature built without a brief is a feature nobody
asked for. This runs before `/feature F1` and every doc it writes has a cap,
because length is not detail. The cap is a test now, so an overrun fails
the build rather than the reader.

Apply the `unslop` skill to every line written. No dashes as punctuation.

## Order

1. `docs/product/brief.md`
2. `docs/product/users.md`
3. `docs/product/scope.md`
4. `docs/product/roadmap.md`, because what scope leaves out of v1 is what the roadmap holds
5. `docs/product/glossary.md`
6. `docs/product/features.md`
7. `docs/product/data-model.md`
8. `docs/product/roles.md`
9. `docs/product/privacy.md`, and `src/content/privacy.ts` to match
10. `docs/design/pages.md`, and `src/content/routes.ts` to match
11. `docs/design/screens.md`, because the workflow designs the screen before it breaks into features
12. `docs/design/direction.md`, if the product changes the template's taste. The four knobs, accent, ground, shape and typeface, follow "Making it yours" in `DESIGN.md`, and the tests decide whether the result holds.

One file at a time. Read the file. It has a cap on its first line and a
prompt under each heading. Ask the person what the prompt asks, in
conversation, not as a form. Write the section. Read the whole file back and
count words. Over the cap means cut, not exceed.

## Rules

- Ask about what is missing. Do not ask what the repo already says. Read `src/config.ts`, `AGENTS.md`, `docs/product/decisions.md` and any existing docs first. Setup already settled the product's shape, the flags and the design knobs.
- Every feature in `features.md` gets a "done means" line a stranger could check, and a review depth from `docs/workflow.md`. Mark the checkpoint after which the product goes in front of a real person, and say that `docs/engineering/launch.md` runs there.
- Every choice that closes a door goes in `docs/product/decisions.md` as a dated entry with the alternatives.
- The glossary decides names. Once a term is in it, code uses that word.
- If the person wants to skip a doc, say which decisions that leaves open and let them choose. Do not silently skip.

## Ends when

Every file in the order is written within its cap, the feature list has
its "done means" lines, `routes.ts` matches `pages.md` and `pnpm test` is
green. Say so, list the features with their depth, and point at
`/feature F1`.
