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
with a sentence naming the cause. It loads `.env.local` before it looks,
because the config runs in plain Node rather than through Next, and a check
that cannot see the file it is asking about fails every correctly set up
project.

**A modal now owns the work it starts.** `Modal` and `ConfirmModal` are new
primitives. The confirm pill spins in place, the modal stays open while the
server is working, and it closes only after the promise resolves. A failure
keeps it open and puts the reason inside it, beside the button that caused it,
rather than dropping the person back onto a screen that looks unchanged.
Escape and the overlay are ignored while the work is in flight, so a half
finished action cannot be dismissed into silence, and the close button is
taken away rather than left sitting there looking live while it cannot close
anything.

This is a primitive and not a paragraph because eslint stops anything outside
`src/components/primitives` from importing the dialog, and three Playwright
tests hold the behaviour down in both schemes. There is no second way to open
a modal, so there is no wrong way.

**The tokens are the source of truth for numbers, not just colours.** Layout
had no tokens, so components measured themselves: `text-[13px]` in five files,
`max-w-[480px]` in five more, `h-[52px]` inside the pill that DESIGN.md
describes as 52 px. Sizes and widths are tokens now, `h-control`, `h-input`,
`px-gutter`, `w-sidebar`, `max-w-auth`, `max-w-prose` and `max-w-content`, and
the type scale that already existed is used instead of pixel values.

`tests/rules/no-raw-values.test.ts` fails the build on Tailwind's arbitrary
value syntax for any design axis, outside the shadcn set, which the CLI
regenerates. Variant selectors such as `data-[state=open]` are not design
values and are left alone. One exception is allowlisted with its reason: a
honeypot has to leave the viewport, and no spacing token should exist for
that. A second test fails if the allowlisted file ever disappears, so an
exception cannot outlive what it excused.

Two type sizes moved by a hair on the way. A guide card body and a row title
carried `leading-[1.35]` and `leading-[1.4]` next to their pixel size, and the
type tokens carry their own line height, so both now take the scale's value.

**The app shipped with no security headers.** `next.config.ts` held a
placeholder comment and nothing else, so every response went out without
`Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options`,
`Referrer-Policy` or `Permissions-Policy`. Nothing breaks when those are
missing and no screen shows them, which is why they were still missing. They
are set for every path now and two Playwright tests assert them.

A full content security policy is deliberately still absent. Next needs a
nonce on every inline script for a strict one, and a policy written without
that either breaks the app or is loose enough to be theatre. The frame
ancestors directive is set, because that part needs no nonce. A product that
wants the rest does the nonce work and records the decision.

## 2026-09-07, the primary button had no text

Shipped and live before it was caught, and caused by this version's own token
work. The type scale became `text-body` and friends when the layout tokens went
in, replacing `text-[17px]`. A size named as a word and a colour named as a
word are both "text-" plus a word, so the class merger could not tell them
apart, put them in one group, and dropped whichever came first.

The primary pill sets `text-on-action` in its variant and `text-body` in its
size. The size wins by order, so the white disappeared and the button rendered
black on black with an invisible label. The danger pill lost its red the same
way, which nobody noticed because black text on a grey pill looks deliberate.

`src/lib/utils.ts` now builds `cn` with the scale named, so the merger knows
those five are sizes. Add a size to `globals.css` and add it there in the same
change: `tests/unit/class-merge.test.ts` fails when the two lists drift apart,
and thirteen of its sixteen cases fail if the fix is removed.

The lesson worth keeping is not about this bug. Replacing an arbitrary value
with a token is normally safe, and here it silently changed how another tool
parsed the class name. A token rename deserves a look at everything that reads
class strings, not just everything that renders them.

## 2026-09-07, dependency pass

Five Dependabot pull requests were open and all five failed. They were built
against a main from before the light scheme change, which had a real contrast
failure on the home page and the design sheet, so the failures were the old
code and not the bumps. Rebasing each one onto current main turned them green,
which is worth remembering the next time a batch of them looks broken at once.

`actions/checkout` to v7, `actions/setup-node` to v7 and `pnpm/action-setup`
to v6. The workflow warned that Node 20 was deprecated and the older actions
were being forced onto Node 24, so this stops a warning becoming a break.

`@types/node` went to 24 rather than the 26 Dependabot offered, because
`.node-version` pins Node 24 and the types should describe the runtime the
project actually uses. It was on 20, which was two majors behind the pinned
runtime and nobody had noticed. Dependabot will keep offering 26, and the
answer stays no until `.node-version` moves.

TypeScript to 6.0.3, a major, and it needed no code changes at all. Lint,
typecheck, the unit tests, a build and twenty six Playwright tests all pass
untouched. 7.0.2 exists and was not taken, because Dependabot did not offer it
and a second major in the same pass is how a green suite stops meaning
anything.

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
