# Layouts

Cap: 300 words. The breakpoints and the two shells, as numbers.

## Breakpoints

Tailwind defaults. `md` at 768 px is where the app shell goes from stacked to sidebar. `lg` at 1024 px is where auth forms can sit beside a photograph.

## The auth shell

`src/components/auth/auth-shell.tsx`. A 480 px sheet centred on the page with the product name above it. On a phone the sheet fills the width with 20 px gutters. A product with a photograph puts it behind the sheet on a phone and beside it at `lg`.

## The app shell

`src/components/app/shell.tsx`. A 240 px sidebar beside up to 1200 px of content. On a phone the sidebar becomes a header with the navigation in a row. Tone separates the sidebar from the page, never a border.

## Content widths

Forms are 480 px wide. Reading columns are 640 px. Lists and tables take the full 1200 px.

## Product layouts

Anything this product adds, with a sketch or a screenshot.
