# Auth

Cap: 400 words. Better Auth as configured here, and the two hooks that
keep tenancy true.

## Files

| File | What |
| --- | --- |
| `src/lib/auth/server.ts` | The instance. Email and password, the organization plugin, `nextCookies` last. |
| `src/lib/auth/organisations.ts` | `createPersonalOrganisation()` and `firstOrganisationFor()`. |
| `src/lib/auth/session.ts` | `getSession()`, `requireSession()`, `requireOrganisation()`. The real checks. |
| `src/lib/auth/client.ts` | The browser client with the organization plugin. |
| `src/proxy.ts` | The optimistic redirect on `/app/**`. Cookie presence only. |
| `src/app/api/auth/[...all]/route.ts` | The handler. |

## The two hooks

**Sign up creates a personal organisation.** `databaseHooks.user.create.after`
inserts an organisation named after the person and an owner membership.
Nobody is ever without one, which is what lets every query be scoped.

**Every session starts with an active organisation.** `databaseHooks.session.create.before`
sets `activeOrganizationId` to the person's first membership.
`requireOrganisation()` heals a session that somehow has none rather than
showing an error.

## Checks

The proxy redirects a request with no session cookie. It does not validate
the cookie. Every page and action under `/app` calls `requireOrganisation()`,
which validates the session and loads the organisation row. That is the
check that counts. Role checks for owner and admin actions go in the action
before the scoped call, using the member role from
`auth.api.getActiveMember`.

## Flows

Sign in and sign up post from client components through `authClient` and
then `router.push(next)`. `next` is sanitised by `safeNext()` so it is
always a local path. Reset asks for an email, always says the same thing,
and the mail carries a link back to `/reset?token=`. Invitations are created
on the organisation page, mailed with a link to `/invite/[id]`, and accepted
by a signed in person whose email matches.

## Session cache

The session is cached in the cookie for five minutes to save a database
read per request. A role or organisation change takes up to that long to
show in a page that only reads the cookie. Actions that must be current
read the database.

## Environment

`BETTER_AUTH_SECRET` signs everything. `BETTER_AUTH_URL` is the origin the
handler trusts, and production sets it to the real domain.

## Regenerating the schema

`pnpm auth:generate` after any change to the plugins or additional fields.
Node 22 or later. Then push or migrate as `data.md` says.
