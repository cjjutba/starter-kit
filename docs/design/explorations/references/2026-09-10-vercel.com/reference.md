# Reference: vercel.com

Source: https://vercel.com/
Date: 2026-09-10
Why: The first outside run of the skill. Vercel is the nearest public site to the template's own taste, so it tests the extractor against a look we already know.
Run: `pnpm design:reference https://vercel.com/`
An independent reading of what the page renders. Not affiliated with or endorsed by the site.

## Overview

Vercel's home page reads as an engineering company that has decided the
product is the decoration. The page is a near white ground, `{colors.page}`,
carrying a near black ink, `{colors.ink}`, with one grey step between them
for everything secondary. There is no brand hue on the page. The single
saturated thing in the chrome is a small blue, `{colors.blue}`, on the
status line in the footer. Everything else that has colour is a partner's
logo or a product mock. The dark scheme follows the system setting and is
true black.

The type is Geist, the company's own face, at 400 to 500 and never bolder.
Display sizes carry negative tracking that grows with the size, so a 64 px
headline sits six percent tighter than its metrics and a 14 px link sits
normal. Hierarchy comes from size and tone more than weight. Geist Mono
does the terminal, the status line and the small labels inside product
mocks.

Depth is tone plus a hairline. The page draws no CSS borders at all. Every
edge is a one pixel ring in `box-shadow`, and there is not one drop shadow
on the page. Surfaces are told apart by `{colors.page}` against
`{colors.sheet}` and the ring, and that is the whole ladder.

Key characteristics:

- Near white page, `{colors.page}` #FAFAFA, with white sheets. True black dark scheme.
- One family, Geist, at 400, 450 and 500. Nothing bolder anywhere.
- Negative tracking that scales with size on display type, normal at 14 px.
- Tone plus a one pixel ring for every edge. No borders, no drop shadows.
- Two radius scales: pills for actions in the body, 6 px for chrome and surfaces.
- Monochrome. One blue, on the status line, and green only for check marks in a terminal.
- A 4 px grid with 2 px and 6 px for chips, 40 px section padding, and a great deal of empty ground.
- The product's own UI, drawn as white mock cards, is the imagery.

## Colours

Light first, dark second. The dark values come from the same run with
`prefers-color-scheme: dark`, which the site honours.

### Brand and accent

- `{colors.blue}` #0070F3, both schemes. The status line in the footer, links inside product mocks, and, by Geist's own token names, "success". It covers almost no area on the page. There is no other hue.
- `{colors.green}` #297A3A light, #62C073 dark. The check marks in the terminal card. Nowhere else.

### Surface

- `{colors.page}` #FAFAFA light, #000000 dark. The page ground and the fill of feature cards. Geist's `--ds-background-200`.
- `{colors.sheet}` #FFFFFF light, #0A0A0A dark. Mock cards, the terminal card, secondary controls in the chrome. Geist's `--ds-background-100`.
- `{colors.ink-surface}` #171717 light, #171717 dark. The dark tile inside a feature card and the primary control fill in light. Geist's `--ds-gray-1000` in light, kept dark in dark.

### Hairlines

- `{colors.ring}` rgba(0, 0, 0, 0.08) light, rgba(255, 255, 255, 0.145) dark. The ring on secondary controls and mock cards. Geist's `--ds-gray-alpha-400`. Tailwind's ring utility emits it with a second, page coloured ring beneath it that does nothing at the same spread.
- `{colors.ring-solid}` #EBEBEB light, #2E2E2E dark. The ring on feature cards and tags, and an inset ring on the terminal card.
- The header, once stuck, takes `{colors.page}` and a bottom hairline in `{colors.ring-solid}`.

### Text

- `{colors.ink}` #171717 light, #EDEDED dark. Headlines, card titles, control labels, footer headings, the first half of a two tone statement.
- `{colors.body}` #4D4D4D light, #A1A1A1 dark. Navigation links, descriptions, footer links, the second half of a two tone statement. It carries more characters than ink does.
- `{colors.muted}` #8F8F8F both schemes. The "Features" label above a list.
- `{colors.faint}` #C9C9C9 both schemes. Placeholder text inside product mocks only.
- `{colors.on-ink}` #FFFFFF light, #0A0A0A dark. Text on the primary pill and on the dark tile.

### Semantic

Not shown on the page. Read from the root custom properties, which carry
the Geist system's full set: `--geist-error` #E00, `--geist-warning`
#F5A623, `--geist-success` #0070F3, each with dark, light and lighter
steps. Success is the same blue as the status line. The greys sit in a
ladder `--ds-gray-100` to `--ds-gray-1000` in HSL with no hue, from 92
percent lightness at 200 down to 9 percent at 1000 in light, inverted in
dark, beside an alpha ladder `--ds-gray-alpha-100` to `-1000` used for
rings and hover fills.

There are 525 custom properties on the root, among them every Tailwind
palette and the older `--accents-1` to `--accents-8` ladder. The page
uses perhaps twelve of them.

## Typography

### Font family

Geist Sans and Geist Mono, both loaded as variable faces from 100 to 900
and used at three weights. Fallbacks are not readable from the computed
style. Both faces are open source under the SIL Open Font License, so a
product can use them as they are, and this template already does.

### Hierarchy

Measured at 1440 wide. Line height and tracking are as computed.

| Token | Size | Weight | Line height | Tracking | Use |
| --- | --- | --- | --- | --- | --- |
| `{typography.display}` | 64 px | 400 | 1.0 | -3.84 px | The h1. One per page. |
| `{typography.headline}` | 56 px | 450 | 1.0 | -3.36 px | Every h2. Section heads and the closing band. |
| `{typography.statement}` | 24 px | 450 | 32 px | -0.96 px | The two tone sentence beside a mock. |
| `{typography.card-title}` | 24 px | 450 | 1.1 | -1.2 px | Feature card titles. |
| `{typography.lead}` | 16 px | 450 | 24 px | -0.32 px | The three line list in the hero. |
| `{typography.button-lg}` | 16 px | 500 | 24 px | 0 | Pills in the body. |
| `{typography.button}` | 14 px | 500 | 21 px | 0 | Chrome buttons and the ticket link. |
| `{typography.list}` | 14 px | 500 | 20 px | 0 | Feature lists and footer headings. |
| `{typography.body}` | 14 px | 400 | 20 px | 0 | Navigation, descriptions, footer links. The most set text on the page. |
| `{typography.tag}` | 11 px | 500 | 20 px | +0.2 px | The "New" tag. |
| `{typography.mono}` | 12 px | 400 | 16 px | 0 | Terminal lines. Geist Mono. |
| `{typography.mono-status}` | 12 px | 500 | 20 px | 0 | The status line, upper case. Geist Mono. |
| `{typography.mono-label}` | 11 px | 400 | 16.5 px | 0 | Small labels inside mocks. Geist Mono. |

### Principles

- Weight stops at 500. Emphasis inside running text is ink against body tone, not bold: "Notion powers millions" in `{colors.ink}` then "of agent conversations daily on Vercel" in `{colors.body}`, one sentence, two tones.
- Tracking scales with size. About minus six percent at 56 and 64, minus five at 32, minus four at 24, minus two at 16, zero at 14, and a touch positive at 11.
- 450 is a real step. The variable face gives a body that leads without becoming a label, and the site uses it for every statement and card title.
- Display line height is 1.0. Headlines set solid, and the tracking is what keeps them from feeling tight.
- Mono means machine. A terminal, a status line, a passport number. Never a heading.
- Sentence case everywhere. The two exceptions are the mono status line and the caps on the dark passport tile.

### Substitutes

None needed. Geist is free, self hostable through `next/font`, and already the template's face.

## Layout

### Spacing system

Base unit 4 px, with 2 px and 6 px admitted for chips and gaps. 69 percent
of the recurring values sit on the 4 px grid, 44 percent on 8 px.

- `{spacing.hair}` 2 px, the padding on a footer link and the gap in an inline list. The most used value on the page by count.
- `{spacing.chip}` 6 px, inner padding on chrome buttons and tags.
- `{spacing.xs}` 4 px. `{spacing.sm}` 8 px. `{spacing.md}` 12 px, the side padding on pills.
- `{spacing.base}` 16 px, terminal card padding. `{spacing.card}` 20 px, feature card padding. `{spacing.lg}` 24 px, the page gutter.
- `{spacing.xl}` 32 px. `{spacing.section}` 40 px, the vertical padding on every full width band and on the footer. `{spacing.touch}` 44 px, the phone menu button.

### Grid and container

- Content caps at 1080 px, with 1024 px and 961 px caps on inner bands and a 673 px prose column. The tablet run capped at 768 px.
- Gutter 24 px at 1440 wide. The hero headline starts at x 24.
- Case study bands are two columns, the mock at about two thirds and the text at one third, and the mock swaps sides band by band.
- "Recently shipped" is a three column grid: one card spanning two columns and two rows, two cards stacked in the third.
- The footer is a twelve track grid showing six columns per row over two rows, then a bottom row with the wordmark, the status line and a theme switcher.

### Whitespace

The hero is about 700 px tall and mostly ground. Bands are separated by
their own 40 px padding and then by margin, so a screen at 900 px tall
often holds one headline and one mock and nothing else. Cards inside a
band sit at 16 to 24 px from each other. The whitespace is the layout's
main instrument, and the site pays for it with a long page.

## Elevation and depth

Tone and a one pixel ring. No level on the page casts a shadow.

| Level | Treatment | Use |
| --- | --- | --- |
| Ground | `{colors.page}` | The page, the footer, the hero. |
| Card on ground | `{colors.page}` plus a 1 px `{colors.ring-solid}` ring, 6 px radius | Feature cards. Same tone as the page, so the ring is the whole edge. |
| Sheet | `{colors.sheet}` plus a 1 px `{colors.ring}` ring, 6 px radius | Mock cards, the terminal, secondary chrome buttons and body pills. |
| Inset | `{colors.sheet}` plus a 1 px `{colors.ring-solid}` ring inset | The terminal card inside a feature card. |
| Ink tile | `{colors.ink-surface}` with no ring | The passport tile inside a feature card. |
| Stuck header | `{colors.page}` with a bottom hairline | The navigation after the first scroll. Transparent at the top. |

Gradients exist, three of them, and none is decorative colour. A linear
fade from `{colors.page}` to transparent masks the bottom of mock cards
and the logo row, and a radial one masks the hero triangle's glow in dark.
One rainbow gradient is inside a product mock and never touches the chrome.

## Shapes

| Token | Value | Use |
| --- | --- | --- |
| `{rounded.tag}` | 4 px | Rare. One element on the page. |
| `{rounded.surface}` | 6 px | Feature cards, mock cards, the terminal, chrome buttons. The workhorse. |
| `{rounded.tile}` | 8 px | The outer corners of the passport tile only, `0 8px 8px 0`. |
| `{rounded.pill}` | 9999 px | Every action in the body, the ticket link, the "New" tag. Twenty two elements. |
| `{rounded.circle}` | 50 percent | The agent avatars in the closing band. |

Two scales, not one. A pill is what you press in the body. Six pixels is
the chrome and anything that holds content. The template's presets tie
the two together, so this look does not come from a preset.

## Components

Built from the tokens above. Heights and padding are as measured.

### Navigation

`top-nav`: 64 px tall, sticky. Transparent over the hero, then
`{colors.page}` with a bottom hairline once stuck. Wordmark triangle at
left, 24 px of `{colors.ink}`. Links in `{typography.body}` and
`{colors.body}`, with a chevron on the two that open menus. At right,
`button-chrome-secondary` twice and `button-chrome-primary` once, 8 px
apart. On the phone the links go behind a 44 px menu button.

`button-chrome-secondary`: `{colors.sheet}`, `{colors.ink}`,
`{typography.button}`, 32 px tall, 12 px sides as drawn, `{rounded.surface}`,
a 1 px `{colors.ring}` ring. "Get a Demo", "Log In".

`button-chrome-primary`: `{colors.ink}` fill, `{colors.on-ink}`,
`{typography.button}`, 32 px, `{rounded.surface}`, no ring. "Sign Up".

`announcement`: one centred line under the nav. `{typography.body}` in
`{colors.body}`, then `link-pill`, a transparent `{rounded.pill}` in
`{typography.button}` and `{colors.ink}` at 32 px with a chevron.

### Hero

`hero`: three columns on desktop. `{typography.display}` at left over two
pills, a 300 px `{colors.ink}` triangle in the centre, a three line list in
`{typography.lead}` at right. On the phone it stacks: triangle, headline
centred, one line of `{typography.mono}` beneath it, then two full width
pills 8 px apart.

`button-primary`: `{colors.ink}` fill, `{colors.on-ink}`,
`{typography.button-lg}`, 40 px tall, 12 px sides plus the label's own
inset, `{rounded.pill}`, no ring. "Deploy now".

`button-secondary`: `{colors.sheet}`, `{colors.ink}`, `{typography.button-lg}`,
40 px, `{rounded.pill}`, a 1 px `{colors.ring}` ring. "Talk to sales".

### Logo row

`logo-row`: seven partner wordmarks in `{colors.ink}`, evenly spaced across
the container, no ring, no card. Fades at both ends with the page coloured
gradient on narrow screens where it scrolls.

### Case study band

`case-study-band`, three on the page: `{typography.headline}` above, then
a `mock-card` at two thirds and a text column at one third. The text
column holds a `statement`, a "Features" label in `{typography.body}` and
`{colors.muted}`, and a list in `{typography.list}` and `{colors.ink}` at a
26 px pitch. The mock swaps sides on each band.

`mock-card`: `{colors.sheet}`, `{rounded.surface}`, a 1 px `{colors.ring}`
ring, no padding. Holds a drawn product UI, edge to edge, masked at the
bottom by the fade.

`statement`: one sentence in `{typography.statement}`. The subject in
`{colors.ink}`, the rest in `{colors.body}`. No bold.

### Recently shipped

`shipped-grid`: a `{typography.headline}` then three `feature-card`s on a
three column grid, the first spanning two columns and two rows.

`feature-card`: `{colors.page}` fill, `{rounded.surface}`, a 1 px
`{colors.ring-solid}` ring, 20 px padding. Title in `{typography.card-title}`
and `{colors.ink}`, description in `{typography.body}` and `{colors.body}`
under it, and an illustration or a tile in the remaining space. The whole
card is a link.

`terminal-card`: `{colors.sheet}`, `{rounded.surface}`, a 1 px
`{colors.ring-solid}` ring inset, 16 px padding. Lines in `{typography.mono}`
and `{colors.ink}`, a heading line in 500, check marks in `{colors.green}`,
the wordmark triangle as a prompt.

`ink-tile`: `{colors.ink-surface}` fill, `{rounded.tile}` on the outer
corners, no ring. `{typography.mono-label}` upper case in `{colors.on-ink}`
at top right, the triangle in white at the bottom.

### Closing band

`cta-band`: a centred `{typography.headline}`, then `button-primary` and
`button-agent` side by side, 12 px apart. No card, no ground change.

`button-agent`: `{colors.sheet}`, `{colors.ink}`, `{typography.button-lg}`,
40 px, `{rounded.pill}`, a 1 px `{colors.ring}` ring, padding 0 8 0 4. Three
overlapping 24 px avatars at left in `{rounded.circle}`, the label, then a
copy icon in `{colors.body}` at right. "Onboard your agent".

### Footer

`footer`: `{colors.page}`, 40 px top and bottom, a twelve track grid showing
six columns per row for two rows, a 28 px link pitch. On the phone the
grid shows four tracks.

`footer-heading`: `{typography.list}` in `{colors.ink}`.

`footer-link`: `{typography.body}` in `{colors.body}`, 2 px padding, 0.1 s
transition on hover.

`tag-new`: `{typography.tag}`, `{colors.body}` on `{colors.ring-solid}`,
`{rounded.pill}`, 6 px sides. Sits 8 px after its link.

`status-line`: a `{colors.blue}` dot then "ALL SYSTEMS NORMAL." in
`{typography.mono-status}` and `{colors.blue}`. Bottom left, beside the
wordmark. The one place the blue appears in the chrome.

`theme-switcher`: three 24 px icon buttons in a row inside a 1 px
`{colors.ring}` ring, bottom right. System, light, dark.

### Inputs

None on this page. The search field and the chat composer are drawn inside
mocks: `{colors.sheet}` with a 1 px `{colors.ring}` ring, `{rounded.surface}`,
and `{colors.faint}` placeholder text. Whether the real product's inputs
match is a known gap.

## Do and do not

Do:

- Keep one family and stop at 500. Carry emphasis with tone, `{colors.ink}` against `{colors.body}`.
- Tighten display type in proportion to its size and set it solid.
- Tell surfaces apart with `{colors.page}` against `{colors.sheet}` and a one pixel ring.
- Give the body pills and the chrome 6 px corners, and keep them apart.
- Keep the page monochrome. Let colour arrive in a mock, a logo or a check mark.
- Make the whole feature card the link.
- Put machine text in mono and nothing else.
- Set the dark scheme on true black and step up to `{colors.sheet}` at #0A0A0A.

Do not:

- Do not draw a border. The ring is the border.
- Do not cast a shadow. Nothing on the page floats.
- Do not add a second hue, and do not put the blue on a button.
- Do not go bold. 500 is the ceiling.
- Do not letterspace caps outside the mono status line and the passport tile.
- Do not colour a background with a gradient. The three gradients are masks.
- Do not let a card take a tone the page does not already have.

## Responsive behaviour

### Breakpoints

Read from the stylesheets the browser could open, by how often each is
switched on, then confirmed by the tablet and phone runs.

| Width | Switches | What changes, as observed |
| --- | --- | --- |
| 600 and 601 px | 78 | The phone line. Below it the hero stacks and centres, the nav collapses to a 44 px menu button, pills go full width. |
| 960 and 961 px | 76 | The desktop line. Above it the hero takes three columns, case studies take two, the footer shows six columns. |
| 768 px | 12 | The tablet cap. Content is capped at 768, the h2 drops to 48 px. |
| 1200 px | 10 | Wide. The container stays at 1080 and the ground grows. |
| 640 and 401 px | 16 | Fine tuning inside mocks and the logo row. |

Type at each width, as computed:

| Style | 1440 | 768 | 390 |
| --- | --- | --- | --- |
| `{typography.display}` | 64 / 400 / -3.84 | 64 / 400 / -3.84 | 48 / 400 / -2.88, line height 56 |
| `{typography.headline}` | 56 / 450 / -3.36 | 48 / 450 / -2.88, line height 56 | 32 / 450 / -1.6, line height 40 |
| `{typography.body}` | 14 / 400 / 20 | same | same |

### Touch targets

- Body pills 40 px tall. Under the template's 44 px rule but padded wide.
- Chrome buttons 32 px. Footer links 24 px. Both under it, and the site accepts that on desktop.
- The phone menu button is 44 px, the one control sized for a thumb.

### What collapses

- Hero: three columns to one, the triangle first, the list to a single mono line.
- Case study bands: mock above text, full width.
- "Recently shipped": three columns to one, the spanning card first.
- Footer: six columns to two, headings kept.
- Logo row: to a fading scroller.

## Onto the four knobs

Accent: none. `{colors.blue}` covers a status dot and nineteen characters.
The template is monochrome on purpose and this site agrees. Keep.

Ground: a grey page with white sheets, the template's default, but paler on
both sides. `{colors.page}` #FAFAFA against `{colors.sheet}` #FFFFFF is a
two percent step, too close to read on its own, which is why every card
and secondary control wears a ring, and why feature cards give up on tone
altogether and are page coloured with a ring. The template's `--page`
#F5F5F7 is dark enough to carry a white sheet with no ring. Keep, and keep
tone only. Rings are the cost of a pale ground, not a feature.

Shape: pill controls, which the template has, over 6 px surfaces, which no
preset gives. The template's Pill preset puts 20 px on a card and 24 px on
a sheet. A product that wants this exact look keeps `--radius-pill` at
full and sets the other five to the Sharp column. Keep the Pill preset
here. It is one scale, and one scale is cheaper to keep honest.

Typeface: Geist, the same face, at the same three weights. Two things
differ. The site has a 450 step between the template's 400 and 500, and it
tracks display type tighter as it grows, where the template keeps tracking
at zero. Both are marketing page instruments. An app has no 64 px line
and its largest step, 28 px, would take minus 1 px at most. Keep.

## Take and leave

Take:

- The two tone statement. Ink then body in one sentence is emphasis without bold, and the template already has both tokens.
- The dark scheme on true black with #0A0A0A sheets. The template's dark ladder starts at #0A0A0A and steps up, which reads greyer. Worth a look on `/design` if a product wants a blacker night.
- 450 as a weight. The variable face is already loaded. A body that leads without becoming a label would take it.
- Mono for machine text, and nothing else. The template says this already. The site shows how far it goes: a status line, a terminal, a passport number.
- The whole card as the link. Fewer targets, bigger targets.

Leave:

- The rings. They exist because the ground is too pale, and the template solved that with the ground.
- Two radius scales. A taste, and the template's one scale is the cheaper one.
- 32 px chrome buttons and 24 px links. The people who pay for a product from this template are on a phone, and 44 px is the floor.
- The blue on success. The template carries status with a label or an icon and no colour, and this site uses the same blue for a link and a good status, which is one hue doing two jobs.
- 525 tokens. A template with thirty does not want to know how.
- The gradient masks. They hide the bottom of a mock so it can be cropped anywhere. An app's content ends where it ends.

## Known gaps

- Hover, focus and pressed states. The run reads the page at rest. Focus rings were not observed.
- Inputs. None on the home page. Sign in and the dashboard were not visited.
- Motion. Durations were read, 0.1 s on 79 links and 0.15 to 0.7 s on a few reveals, but easing and what animates were not. The run sets reduced motion.
- Dark below the fold. The full page stitch is light only. The dark values come from computed styles, not from a look.
- Other pages. Pricing, docs and the blog would show the type scale in prose and the real tables, and were not visited.
- Fallback stacks. The computed style names the loaded face only.
- Breakpoints from third party sheets. Some of the 600 and 960 switches belong to embedded mocks, not the page.

## Verdict

Vercel is the template with a paler ground, sharper cards and a ring to
make up the difference. Nothing moves.
