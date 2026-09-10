# Reference: vercel.com

Cap: 600 words.

Source: https://vercel.com/
Date: 2026-09-10
Why: The first outside run of the skill. Vercel is the nearest public site to the template's own taste, so it tests the extractor against a look we already know.
Run: `pnpm design:reference https://vercel.com/`

## What it is

A marketing home page in Geist on a near white ground, with a true black
dark scheme that follows the system setting. Nothing on the page is
saturated except one blue and the partner logos. The site draws no CSS
borders at all. Every hairline is a one pixel ring in `box-shadow`.

## As extracted

| | Light | Dark |
| --- | --- | --- |
| Page | `#FAFAFA` | `#000000` |
| Sheet | `#FFFFFF` | `#0A0A0A` |
| Text | `#171717`, `#4D4D4D`, `#C9C9C9` | `#EDEDED`, `#A1A1A1` |
| Primary control | `#171717` on white, pill, 500 at 16 px | `#EDEDED` on black |
| Secondary control | White pill with a ring | `#0A0A0A` with a ring |
| Ring | `rgba(0,0,0,0.08)` and `#EBEBEB` | `rgba(255,255,255,0.145)` and `#2E2E2E` |

Type: GeistSans and Geist Mono as variable faces, used at 400, 450 and
500. Sizes 11, 14, 16, 24, 56 and 64 px. Body 16 px on a 24 px line.

Shape: pills for calls to action, 6 px on cards and the small chrome
buttons, 4 px once. Two scales, not one.

Spacing: 2, 4, 6, 8, 12, 16, 20, 24, 32, 40 and 44 px recur. 69% of them
sit on the 4 px grid. Containers stop at 673, 961, 1024 and 1080 px.

Tokens: 525 custom properties on the root, among them a grey ladder
`--accents-1` to `--accents-8`, and seven gradients for the hero glow.

## Onto the four knobs

Accent: none. The one blue, `#0070F3`, covers almost no area. Same as the
template. Keep.

Ground: grey page with white sheets, the template's default, but paler on
both. `#FAFAFA` against `#FFFFFF` is too close to read on its own, which
is why every card and secondary button wears the ring. The template's
`#F5F5F7` is dark enough to carry a white sheet without one. Keep, and
keep tone only.

Shape: pill controls, which the template has, over 6 px cards, which no
preset gives. A product that wants this look sets `--radius-pill` to full
and the other five to the Sharp column. Keep the Pill preset here.

Typeface: Geist, the same. Vercel never goes above 500 either. It carries
hierarchy by size where the template carries it by weight, but that is a
marketing page and an app has no 64 px line. Keep.

## Take

- The dark scheme on true black with `#0A0A0A` sheets. The template's dark ladder starts at `#0A0A0A` and steps up, which reads greyer. Worth a look on `/design` if a product wants a blacker night.
- 450 as a weight. On a variable face it is a body that leads without becoming a label. The template has no step between 400 and 500.

## Leave

- The rings. They exist because the ground is too pale, and the template solved that with the ground.
- 6 px cards beside pill buttons. Two radius scales is a taste, and one scale is the cheaper one to keep honest.
- 525 tokens. A template with thirty does not want to know how.
- The hero gradients.

## Verdict

Vercel is the template with a paler ground, sharper cards and a ring to
make up the difference. Nothing moves.
