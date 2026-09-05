---
name: image
description: Generates boards, mockups, marks, icons and other assets with fal from the product's own brief and design system, prices every run first, and files the result beside its prompt. Use for any image, board, mockup, logo, icon, illustration or photograph the product needs.
---

# image

The prompt is written from the repo, not from a fresh description. That is
the point of this skill. The brief says who the product is for, the
direction says what was tried, `DESIGN.md` says the palette and type, and
all three are in the prompt before the person adds a word.

## 1. Context

Read `docs/product/brief.md`, `docs/design/direction.md` and `DESIGN.md`.
Read the model table and the existing rows in
`docs/design/explorations/README.md` so nothing is re-run that already lost.

## 2. Prompt

Write the prompt from the context. For a board: the device and size, the
screen and its states, the page and sheet tones, pill buttons, no borders,
no shadows, Geist, sentence case, the one tint and what it is for, and what
the model must not add (titles, captions, extra chrome, a rotated device).
For a mark: the geometry in words, monochrome, the sizes it must survive,
round caps or not, and that the output is SVG. Show the prompt to the person
before running. Save it as sent.

## 3. Model and price

Pick the model from the table by asset type. Boards and mockups use
GPT Image 2. Marks and icons use Recraft V4 text to vector. Photographs and
illustration use whatever the product settled, or ask. Nano Banana Pro is
listed as rejected with the reason and is not retried.

Call the fal pricing tool for the endpoint and state the per image price
before running. Above fifty cents a run, or a dollar for the batch, ask.
After the run, report what it cost. fal changes prices without notice, so
the price is read every time, never remembered.

## 4. Run

Through the fal MCP when its tools are loaded. When they are not, call the
endpoint over HTTP with `FAL_KEY` from the environment, the same model id
and the same parameters. Prefer one comparison run across two models over
many blind runs on one.

## 5. File

Save under `docs/design/explorations/` in `boards/`, `marks/`, `photos/` or
`illustrations/` as `<date>-<subject>-<model>.<ext>`, beside
`<same name>.md` holding the prompt as sent, the model id, the parameters,
the price and a one line verdict. Add the row to the index in
`docs/design/explorations/README.md`. A board without its prompt cannot be
reproduced.

## 6. Adopt

When the person keeps one, copy it to its production home under `public/`
or `public/brand/` with its real name. For a mark, the SVG is the source of
truth from then on and is never redrawn. Note the adoption in
`docs/design/direction.md` and, if it changes a token, in `DESIGN.md`.
