---
name: reference
description: Reads a public website's design as numbers, screenshots it in both schemes, maps what it finds onto the four knobs in DESIGN.md, and files the result beside the boards. Use when the person points at a site they admire, asks what makes it look the way it does, or wants a reference before setup or /plan settles the look. Takes a URL, for example "reference https://example.com".
---

# reference

A site someone admires is evidence, not a design. This skill turns it into
numbers the four knobs in `DESIGN.md` can take, says which of them the site
argues for moving, and files the evidence where `docs/design/direction.md`
expects it. The person still decides. The contrast test still decides after
them.

Structure only. Fonts, colours, radii, shadows, spacing, widths and how
controls are styled are fair to learn from. Copy, imagery and the mark are
theirs, and nothing here saves any of it. The screenshots are a record of
what was looked at, never assets.

## 1. Context

Read `DESIGN.md` under "Taste" and "Making it yours", and
`docs/design/direction.md`. Read the references table in
`docs/design/explorations/README.md` so a site is not run twice. If the
person gave no reason for the site, ask what they like about it in one
line before running, because that line decides what to look at.

## 2. Run

```bash
pnpm design:reference https://example.com
```

It opens the page headless at 1440 and 390 wide, in light and dark through
`prefers-color-scheme`, scrolls once so lazy content mounts, and writes
`docs/design/explorations/references/<date>-<host>/` holding five WebP
screenshots and `data.json`. `data.json` carries, per scheme: the fonts by
characters set with their weights and sizes, backgrounds by area covered,
text colours, borders, radii, shadows, the spacing values that recur and
how many sit on a 4 px and an 8 px grid, container widths, the ten most
common control styles, and every custom property declared on the root.

Two things it reports rather than fixes. `darkFollowsSystem` false means
the site has its own toggle and both schemes came out the same, so say
that and screenshot dark by hand through the browser pane if it matters.
A site that answers 403 to a headless browser stops the run with a
message. Open it in the browser pane or in Claude in Chrome, screenshot
both schemes and both widths, and write the reference from what you can
see, saying plainly that the numbers were read by eye.

## 3. Read

Open `data.json` and the screenshots together. The numbers say what, the
screenshots say where. Look for the family and the weights that carry the
page, whether surfaces are told apart by tone, border or shadow, the radius
scale and whether it is one scale or several, the grid share, and what a
primary control looks like against a secondary one. Note what the numbers
miss: rhythm, imagery, the copy's register.

## 4. Map

Write one line per knob. Accent: is there a hue, what is it, and what does
it sit on. Ground: grey page with white sheets, white page with grey
sheets, or borders doing that work. Shape: which preset in the table is
nearest, or none. Typeface: the family and whether it carries hierarchy by
weight or by size. For each, say whether this product should move the knob
and why, against what the brief says the person deciding to pay needs.

## 5. File

Write `reference.md` in the run's folder from the template below. Add the
row to the references table in `docs/design/explorations/README.md`. In a
product, add the one line to "What was tried" in
`docs/design/direction.md`. `tests/rules/references.test.ts` fails the
build on a reference without its source, date, data or row.

```markdown
# Reference: example.com

Cap: 600 words.

Source: https://example.com/
Date: 2026-01-01
Why: the one line the person gave.

## What it is
## As extracted
## Onto the four knobs
## Take
## Leave
## Verdict
```

## 6. Adopt

If a knob moves, do it as "Making it yours" in `DESIGN.md` says, run
`pnpm test` until contrast and theme are green, and look at `/design` in
both schemes before any screen takes it. Record the move in
`direction.md`. A reference that moved nothing is still worth its row,
because the next session will not re-run it.
