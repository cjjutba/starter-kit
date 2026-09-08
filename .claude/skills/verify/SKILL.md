---
name: verify
description: Drives the running app the way a person does and reports what worked, with evidence. Pre-filled for what starter-kit-web ships. Every feature appends its steps under its own heading. Use before any review, before claiming anything works, and whenever the person asks whether the app still works.
---

# verify

Proof from the real app, not from tests passing or code reading. Use the
browser preview tools. Read the page, read the console, read the mail log.
Report each step as pass or fail with what was seen. Never say a step
passed that was not run.

## Setup

1. `.env.local` has `DATABASE_URL`. `pnpm db:push` and `pnpm db:seed` have run.
2. Start the `dev` server through the browser preview. Clear cookies or use a fresh context.
3. Read `SEED_EMAIL` and `SEED_PASSWORD` from `.env.local`. The seeded person is already verified.
4. `pnpm mail:log` is the inbox. Every link below is read from it.

## F0 Foundation

**Public routes.** Open `/`, `/privacy`, `/privacy/request`, `/design`,
`/robots.txt`, `/sitemap.xml`, `/opengraph-image` and a missing address.
Each renders. No console errors. Toggle the theme on `/design` to dark and
back. Fields, pills and surfaces change tone, nothing gets a border. The
privacy page shows no contact address while `NEXT_PUBLIC_CONTACT_EMAIL` is
unset and says to use the form.

**Sign up.** Create an account with a new address. The form is replaced by
the "Check your email" card naming the address. No session: `/app` still
redirects to sign in. The mail log has the confirmation link. Open it. It
signs you in and lands on `/app`. Sign up again with the same address: the
same card, and the mail log has the note to the existing owner rather than
a second confirmation.

**Sign in.** `/app` without a session redirects to `/sign-in?next=/app`.
A wrong password shows one line under the field, no banner. Sign up with a
third address, do not open its link, then sign in with it: the "Verify
your address first" card, and a fresh link in the mail log. Open a link a
second time: `/sign-in` shows the expired line.

**Invite only.** Set `features.openSignUp` to false in `src/config.ts`. Sign
up with an address nobody invited: the form shows the invitation line.
Invite that address from the people page as the seed owner, sign up
with it again: the card, the link, signed in inside the inviting
organisation after accepting. Set the flag back to true.

**Notes.** As the seed owner, a note with an empty title shows a field
error. A note with a title saves and appears with its date and "by" the
owner's name. Open it, change the title, save. Open the same note in two
tabs, save in the first, then save in the second: the "changed while you
were editing" line, nothing overwritten. Delete from the list: the modal
asks, spins, closes, the empty state returns. Delete the same note from a
stale tab: the modal stays open and says it was already deleted.

**Shell.** The organisation sits at the top of the sidebar with its
initial. Open it: the menu lists your organisations with your role and a
tick on the current one, and "Create another organisation" when the flag
is on. Settings opens into Organisation and People. The account row at the
bottom opens upward into Appearance, Account, Privacy and Sign out. Below
1024 px the sidebar is a top bar and slides in from the left.

**Organisation.** `/app/settings` shows the name, slug, your role. Rename
it and pick `Asia/Tokyo` from the timezone list. Save says "Saved." and
the sidebar shows the new name. Set the timezone back.

**People.** `/app/settings/people` lists you as owner. Invite
`invitee@example.com` as member. The pending invitation is listed.
Cancel it: gone. Invite again. The mail log has the link to `/invite/<id>`.
Sign out, sign up as that address, open its confirmation link, open the
invitation link, accept. Land on `/app` inside the inviting organisation.
The switcher shows two organisations. Switch between them and the notes
list changes.

As the owner: change the invitee's role to admin, save, the row says admin.
Remove them: the modal asks and the row goes. In the invitee's browser,
reload `/app`: their personal organisation, not the old one. Invite and
accept once more, then try to leave as the owner: the modal stays open and
says to make someone else an owner first. Make the invitee owner, leave:
land in your personal organisation. As the new owner, delete the
organisation after typing its name: everyone lands in their own.

With `multipleOrganisations` true, "Create another organisation" is in the
switcher menu. Create one: it opens as the active organisation with you as
owner. Set the flag false: the item is gone and `/app/organisation/new` is
not found.

**Account.** `/app/account` shows the address. Change the name: the
sidebar updates. Sign in in a second browser context, then change the
password in the first: the second context is signed out on its next
request. Change the email to a new address: two mails in the log, one to
the old address to approve, then one to the new one to confirm. Open both
in order. The account shows the new address. Try to delete the account as
the only owner of an organisation others belong to: the modal stays open
and names it. Make someone else owner, delete: signed out, landed on `/`,
the personal organisation is gone and the shared one remains with the
notes saying "by someone who has left".

**Reset.** `/reset`, enter the seed email, see the neutral message. The
mail log has the reset mail. Open its link, set a new password, sign in
with it. Set it back or update `.env.local`.

**Deletion request.** Submit `/privacy/request` with an email and a
message. See the received state. `pnpm privacy:requests` lists it. Mark it
done with the id. No mail in the log while `NEXT_PUBLIC_CONTACT_EMAIL` is
unset. Submit four times inside an hour from the same address: the fourth
shows the retry message. Fill the hidden `website` field through the page
and submit: received state, no new row.

**Proxy.** Delete the session cookie in the browser and open
`/app/notes/new`. Redirected to sign in.

## F1

Added by `/feature F1`. Steps a stranger could follow.
