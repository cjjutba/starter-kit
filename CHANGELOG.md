# Changelog

The template's own history. A product made from it keeps its decisions in
`docs/product/decisions.md`, which starts empty. This file is about the
template.

## 2026-09-07, second version

Everything here came from running `/setup` end to end on a real product,
Settled, and hitting each of these in order.

**Light mode turned white side up.** The page was a soft grey with white
sheets. It is now a white page with grey sheets. Light mode has always been
two tones that alternate, so `--field` moved with the other two: a field on a
sheet was grey on white and is now white on grey. Leave `--field` where it was
and every input on a sheet sits three points of tone away from it and
disappears. `--page` is `#FFFFFF`, `--sheet` is `#F5F5F7`, `--field` is
`#FFFFFF`. Dark mode is untouched, because it runs a ladder rather than two
tones and has nothing to swap. Kalinga should decide for itself rather than
follow.

Two things read the old tones directly. The design sheet outlined the swatches
that would otherwise be white on a white page, and it outlined `--page` and
`--sheet` only, so the now white `--field` rendered as an invisible rectangle
above its own label. The theme toggle's active segment was white against its
`--pill-2` track and became one step off it, so it now takes `--page`, which
is the tone the track is furthest from in both schemes.

**A hardcoded grey hid inside a data URI for a whole version.** The select
chevron was an svg background with `stroke=%23656569` written into it. The
raw colour test looks for `#` and a data URI writes it as `%23`, so the rule
never saw it, and the chevron stayed light mode's secondary grey on a near
black field in dark mode. An svg background cannot read `currentColor`, so the
fix is a real `ChevronDown` element with `text-text-2` over a relative wrapper.
The test now matches `%23` as well as `#`.

**A new product's production database had no tables.** Setup wrote the `dev`
branch string into `.env.local`, pushed the schema and seeded, then pointed
production at the `main` branch, which nothing had ever touched. The first
production deploy met an empty database. Step 5 now pushes and seeds against
`main` too.

**Setup no longer promises a domain it cannot know.** `vercel link` connects
the GitHub repository by itself, and the production alias is not knowable
until a deployment exists, because Vercel suffixes the name when the plain one
is taken. `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` are now set after the
first deploy, and the step says sign in stays broken until they are.
`NEXT_PUBLIC_CONTACT_EMAIL` publishes an address on the privacy page, so the
step says to ask before setting one.

Setup also rewrites `README.md` now, which shipped describing the template, so
a product that kept it told readers to create a repository from starter-kit.
Its placeholder replacement skips `.claude/skills/`, because the setup skill
names `{{PRODUCT}}` and friends as text and a blind replace corrupts it.

**Two projects can run at once.** `.claude/launch.json` dropped its hardcoded
`--port 3000` and took `autoPort`, and setup renames the entry to the slug so
two open projects do not collide by name.

**The axe run says what is actually wrong.** Run it without
`BETTER_AUTH_SECRET` and Better Auth throws while rendering, the auth pages
fall back to the error boundary, and axe reports four colour contrast failures
on elements that are not the problem. `playwright.config.ts` now stops first
with a sentence naming the cause.

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
