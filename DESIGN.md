# Design system

Three parts, kept apart on purpose. **Method** holds for any product and
does not change. **Taste** is this template's point of view, and a product
with a different one changes it in one place. **Values** are the numbers.
Mixing them is how design systems rot: a taste rule gets enforced like a
method rule, and the first branded project has to fight it.

The sheet at `/design` renders everything below in both themes. Judge a
change there before it reaches a screen.

## Method

These hold whatever the product looks like.

- Tokens are CSS variables in `src/app/globals.css`. Never a hex value in a component. A test fails the build on one.
- Hierarchy comes from weight and colour, not size. One family, a small fixed scale.
- Dark mode is the same token names with a second set of values, applied as a class on `<html>`. No component does dark specific work.
- Four pixel base. The steps are 4, 8, 12, 16, 24, 32, 48 and 64. Nothing in between.
- Focus is always visible on keyboard focus. A 2 px ring in `--focus` with a 2 px offset, on every interactive element.
- Every list has an empty state. Every screen handles empty, loading, error, full and overflowing before it is done. See `docs/design/states.md`.
- Status is never carried by colour alone. A label, an icon or a strike through goes with it.
- Contrast passes WCAG AA. The table at the bottom is checked when a value changes.
- Motion answers an action. Nothing animates on entry. Everything respects `prefers-reduced-motion`.
- Sentence case everywhere. No letterspaced caps, no display face, no italics.
- Names wrap. A name that needs two lines gets two lines. Never truncate a person's name with an ellipsis.
- Touch targets are at least 44 px. Mobile first.

## Taste

The template's point of view. Kalinga settled it against generated boards
on 2026-09-05, and the reasoning is in that project's `docs/design/direction.md`.
Change it here and in `globals.css` together.

Near white and near black. A soft grey page, white sheets and cards, no
borders and no shadows, so surfaces are told apart by tone alone. Pill
buttons with a near black primary. One pale blue tint reserved for featured
content. Geist for everything. Warmth, when the product needs it, comes from
photography or illustration, never from an accent hue.

Rules that follow from it.

- An input is always one step of tone away from what it sits on. On a sheet it is `--field`. On the page it is `--sheet`. It never has a border.
- Text links are `--text` at medium weight. No underline at rest, no blue.
- `--tint` is for cards that show featured content. It never colours a button, a status or text. Text on a tint card is always `--text`, because `--text-2` on the tint fails AA for small text and axe catches it.
- `--error` never fills anything. A red ring on the field and one line of helper text is the whole treatment. The danger pill is a secondary pill with red text.
- The one shadow allowed is on a floating card over a photograph, because it sits on an image rather than a surface.
- Photographs and illustrations are the only saturated things on any screen.

## Values

### Colour

| Token | Use | Light | Dark |
| --- | --- | --- | --- |
| `--page` | Page background | `#F5F5F7` | `#0A0A0A` |
| `--sheet` | Sheets, cards, inputs on the page | `#FFFFFF` | `#161618` |
| `--field` | Inputs and guide cards on a sheet | `#F2F2F4` | `#1F1F22` |
| `--text` | Primary text, icons, links | `#0A0A0A` | `#F5F5F7` |
| `--text-2` | Secondary text | `#6B6B70` | `#9A9AA1` |
| `--text-3` | Placeholder only, never content | `#A0A0A6` | `#6B6B70` |
| `--divider` | Rare. Table rows in dense views | `#E5E5EA` | `#26262A` |
| `--action` | Primary pill background | `#0A0A0A` | `#F5F5F7` |
| `--on-action` | Text on the primary pill | `#FFFFFF` | `#0A0A0A` |
| `--action-pressed` | Primary pill pressed | `#262626` | `#D9D9DE` |
| `--pill-2` | Secondary pill background | `#EBEBEE` | `#26262A` |
| `--tint` | Featured content cards only | `#D9E5F5` | `#1B2A40` |
| `--error` | Field ring and helper text only | `#D92D20` | `#F97066` |
| `--focus` | Focus ring | `#0A0A0A` | `#F5F5F7` |

The shadcn variables in `globals.css` point at these, so a generated
component takes the system without edits. A product that needs a status
palette adds its tokens in the same file and documents them here, with a
cue beyond colour for each.

### Shape

| Element | Radius |
| --- | --- |
| Sheet | 24 px |
| Card | 20 px |
| Guide card | 16 px |
| Input | 14 px |
| Small tag | 8 px |
| Button | Full |

### Type

Geist Sans and Geist Mono through `next/font`, self hosted. One family,
three weights: 400 for body, 500 for anything that needs to lead, 700 for a
wordmark and nothing else.

| Size | Line height | Utility | Use |
| --- | --- | --- | --- |
| 28 px | 1.2 | `text-title` | Page title, medium weight |
| 20 px | 1.25 | `text-heading` | Card title, medium weight |
| 17 px | 1.4 | `text-body` | Body, inputs, buttons |
| 15 px | 1.4 | `text-small` | Secondary text, helper copy |
| 13 px | 1.3 | `text-label` | Field labels, tags, helper text |

The utilities are named so they cannot collide with a colour. Numbers in
columns use `tabular`. Geist Mono, through `font-mono`, is for references,
identifiers and code.

### Spacing and layout

Phone controls are 52 px pills and 48 px inputs, with 20 px gutters. The
auth sheet is 480 px wide. The app runs at up to 1200 px of content beside a
240 px sidebar. `docs/design/layouts.md` has the breakpoints.

### Motion

Almost none. State changes ease over 150 ms. Nothing animates on entry
inside the app. Every transition is removed under `prefers-reduced-motion`,
in `globals.css`, for everything.

### Contrast, as set

| Pair | Ratio |
| --- | --- |
| `--text` on `--page`, light | 18:1 |
| `--text-2` on `--sheet`, light | 5.3:1 |
| `--text-2` on `--sheet`, dark | 6.6:1 |
| `--error` on `--sheet`, light | 4.8:1 |
| `--error` on `--sheet`, dark | 6.6:1 |
| `--text` on `--tint`, light | 15.6:1 |
| `--text-2` on `--tint`, light | 4.2:1, fails AA for small text, which is why tint cards use `--text` only |
| `--text-3` on `--field` | 2.3:1, placeholder only, the label carries the meaning |

## Components

`src/components/primitives/` is the design system as code. `Pill` is the
button. `InputField`, `TextareaField` and `SelectField` own their label,
control, helper and error together, so no screen can ship an input without
a label. `Sheet`, `Card`, `GuideCard` and `Row` are the surfaces.
`src/components/ui/` is the shadcn set for everything else, menus, dialogs,
tables and tabs, already token mapped. `docs/design/components.md` says when
to use which.
