# Explorations

Generated boards, vector candidates and the prompts that produced them. A
board without its prompt cannot be reproduced, so the two are kept together.
Nothing here is the design system. `../../../DESIGN.md` is. This folder is
the evidence for how it was reached.

The `image` skill files everything here as date, subject and model, beside
a markdown file with the prompt as sent, the model, the price and the
verdict. Prices are read from the fal pricing tool on the day and recorded
because fal changes them without notice.

## Models

Starting points, from what worked on Kalinga on 2026-09-05. The `image`
skill reads this table. Add rows as the product learns.

| Use | Model | Price then | Verdict |
| --- | --- | --- | --- |
| UI boards and mockups | `openai/gpt-image-2`, 2560 by 1440, high | $0.222 | Followed layout rules exactly. The default. |
| Marks, icons, vectors | `fal-ai/recraft/v4/text-to-vector` | $0.08 | Real SVG. Ignored round cap instructions about half the time, so ask for four and pick. |
| UI boards | `fal-ai/nano-banana-pro` | $0.15 | Rejected. Rotated phones to landscape and added titles it was told not to. |
| Photographs | | | Not settled. Fill in when the product needs one. |
| Illustration | | | Not settled. |

## Boards

| File | Model | Price | Verdict |
| --- | --- | --- | --- |

## Marks

| File | What it is | Verdict |
| --- | --- | --- |
