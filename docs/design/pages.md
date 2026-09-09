# Pages

Cap: 600 words. Every page by surface, with its route and who can reach it. `src/content/routes.ts` is the machine readable version and the two must agree.

## Marketing and legal

| Page | Route | Who |
| --- | --- | --- |
| Home | `/` | Everyone |
| Privacy | `/privacy` | Everyone |
| Deletion request | `/privacy/request` | Everyone, guarded |
| Design sheet | `/design` | Everyone, not indexed |

## Auth

| Page | Route | Who |
| --- | --- | --- |
| Sign in | `/sign-in` | Everyone |
| Sign up | `/sign-up` | Everyone |
| Reset password | `/reset` | Everyone, token from mail |
| Accept invitation | `/invite/[id]` | A signed in person with the invited address |

## App

| Page | Route | Who |
| --- | --- | --- |
| Notes | `/app` | Members |
| New note | `/app/notes/new` | Members |
| Edit note | `/app/notes/[id]` | Members. A note from another organisation is not found. |
| Organisation | `/app/organisation` | Members read. Owners and admins manage people and details. Owners delete. |
| New organisation | `/app/organisation/new` | Members, when `features.multipleOrganisations` is on. Otherwise not found. |
| Account | `/app/account` | The signed in person. Name, email, password, deletion. |

## Not pages

Things that look like pages and are not: mails, the cron, the auth API. One line each on where they live. The kit ships the auth API under `src/app/api/auth`, the purge cron under `src/app/api/jobs`, and robots, the sitemap and the Open Graph image as files beside the root page, all built from the route directory.

## Open questions this list forces

Every product has two or three. Write them here and answer them in `product/decisions.md`.
