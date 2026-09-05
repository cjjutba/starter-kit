---
name: plan
description: Fills the product docs in order, in conversation, within each file's word cap, and ends with a feature list where every feature has a "done means" line and a review depth. Use before building feature one, or when docs/product/brief.md is still a template. Refuses to start a feature until the docs exist.
---

# plan

The step agents skip. A feature built without a brief is a feature nobody
asked for. This runs before `/feature F1` and every doc it writes has a cap,
because length is not detail.

Apply the `unslop` skill to every line written. No dashes as punctuation.

## Order

1. `docs/product/brief.md`
2. `docs/product/users.md`
3. `docs/product/scope.md`
4. `docs/product/glossary.md`
5. `docs/product/features.md`
6. `docs/product/data-model.md`
7. `docs/product/roles.md`
8. `docs/product/privacy.md`
9. `docs/design/pages.md`, and update `src/content/routes.ts` to match
10. `docs/design/direction.md`, if the product changes the template's taste

One file at a time. Read the file. It has a cap on its first line and a
prompt under each heading. Ask the person what the prompt asks, in
conversation, not as a form. Write the section. Read the whole file back and
count words. Over the cap means cut, not exceed.

## Rules

- Ask about what is missing. Do not ask what the repo already says. Read `src/config.ts`, `AGENTS.md` and any existing docs first.
- Every feature in `features.md` gets a "done means" line a stranger could check, and a review depth from `docs/workflow.md`. Mark the checkpoint after which the product goes in front of a real person.
- Every choice that closes a door goes in `docs/product/decisions.md` as a dated entry with the alternatives.
- The glossary decides names. Once a term is in it, code uses that word.
- If the person wants to skip a doc, say which decisions that leaves open and let them choose. Do not silently skip.

## Ends when

Every file in the order is written within its cap, the feature list has
its "done means" lines, and `routes.ts` matches `pages.md`. Say so, list the
features with their depth, and point at `/feature F1`.
