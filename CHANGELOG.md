# Changelog

The template's own history. A product made from it keeps its decisions in
`docs/product/decisions.md`, which starts empty. This file is about the
template.

## 2026-09-06, first version

Built from Kalinga's design system with Geist in place of Inter, plus the
data layer, auth, mail, guards, rule tests, docs and the five skills.

Proven on a fresh clone into an empty directory against an empty Neon
database. What passed: lint, typecheck, thirteen tests (three rule tests,
the scoped layer in PGlite, the time helpers, the rate limiter against
Neon), a build with no `DATABASE_URL`, sixteen axe checks over eight public
routes in light and dark, sign up, sign in, a wrong password, notes create
and delete, organisation rename and timezone validation, an invitation read
from the mail log and accepted, the switcher, the scope proven across two
organisations from the interface, three deletion requests then a refusal
then a honeypot, a password reset by link, CI green, and two Vercel builds
through the git integration.

Two tokens moved during the proof. Light `--text-2` from `#6B6B70` to
`#656569` and light `--error` from `#D92D20` to `#C4281C`, because axe
measured 4.45 and 4.06 against AA on the secondary pill. `DESIGN.md`
records the ratios. Kalinga has both old values and should take the new
ones.

Pinned: next 16.3.4, react 19.2.8, better-auth 1.7.2, drizzle-orm 0.45.2,
@neondatabase/serverless 1.1.0, tailwindcss 4.3.3, shadcn 4.21.0, geist
1.7.2, typescript 5.9, vitest 4.1.11, playwright 1.63.0. Node 22 or later.
