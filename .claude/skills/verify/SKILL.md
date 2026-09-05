---
name: verify
description: Drives the running app the way a person does and reports what worked, with evidence. Pre-filled for what starter-kit ships. Every feature appends its steps under its own heading. Use before any review, before claiming anything works, and whenever the person asks whether the app still works.
---

# verify

Proof from the real app, not from tests passing or code reading. Use the
browser preview tools. Read the page, read the console, read the mail log.
Report each step as pass or fail with what was seen. Never say a step
passed that was not run.

## Setup

1. `.env.local` has `DATABASE_URL`. `pnpm db:push` and `pnpm db:seed` have run.
2. Start the `dev` server through the browser preview. Clear cookies or use a fresh context.
3. Read `SEED_EMAIL` and `SEED_PASSWORD` from `.env.local`.

## F0 Foundation

**Public routes.** Open `/`, `/privacy`, `/privacy/request`, `/design` and a
missing address. Each renders. No console errors. Toggle the theme on
`/design` to dark and back. Fields, pills and surfaces change tone, nothing
gets a border.

**Sign in.** `/app` without a session redirects to `/sign-in?next=/app`.
Sign in with the seed credentials. Land on `/app` with the empty notes state.
A wrong password shows one line under the password field, no banner.

**Notes.** New note with an empty title shows a field error. A note with a
title saves and appears in the list with its date. Delete it. The empty
state returns.

**Organisation.** `/app/organisation` shows the name, slug, the seed person
as owner. Rename it and change the timezone to `Asia/Tokyo`. Save says
"Saved." The sidebar shows the new name. Set the timezone back. An invalid
timezone shows the field error.

**Invitation.** Invite `invitee@example.com` as member. The page lists the
pending invitation. `pnpm mail:log` shows the invitation mail with a link to
`/invite/<id>`. Sign out, sign up as that address, open the link, accept.
Land on `/app` inside the inviting organisation. The switcher shows two
organisations. Switch between them and the notes list changes.

**Reset.** `/reset`, enter the seed email, see the neutral message.
`pnpm mail:log` shows the reset mail. Open its link, set a new password,
sign in with it. Set it back or update `.env.local`.

**Deletion request.** Submit `/privacy/request` with an email and a
message. See the received state. `pnpm mail:log` shows the request
addressed to the contact email. Submit it four times inside an hour from
the same address. The fourth shows the retry message. Fill the hidden
`website` field through the page and submit. Received state, and no new row
in the mail log.

**Proxy.** Delete the session cookie in the browser and open `/app/notes/new`.
Redirected to sign in.

## F1

Added by `/feature F1`. Steps a stranger could follow.
