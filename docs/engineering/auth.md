# Auth

Cap: 400 words. Better Auth as configured here, and the hooks that keep
tenancy true.

## Files

| File | What |
| --- | --- |
| `src/lib/auth/server.ts` | The instance. `nextCookies` last. |
| `src/lib/auth/organisations.ts` | Membership helpers, each taking the database so PGlite proves them. |
| `src/lib/auth/session.ts` | `requireSession()`, `requireOrganisation()`. The real checks. |
| `src/lib/auth/client.ts` | The browser client. |
| `src/proxy.ts` | Optimistic redirect on `/app/**`, cookie presence only. |

## The hooks

**Sign up creates a personal organisation.** Nobody is ever without one,
so every query can be scoped.

**Every session starts active in the first membership.**

**Membership is checked, not assumed.** `requireOrganisation()` joins the
active id on `member` every call. Better Auth clears the active id only on
the actor's session, so a removed member or the members of a deleted
organisation would keep a dead id. A miss heals to the first membership
or a new personal one.

## Verification

No session until the address is verified. Sign up sends the link and says
where it went. The link signs the person in and lands on `/sign-in`, which
forwards to `next`. An unverified sign in is refused and a fresh link sent.
An existing address gets the same success, and its owner is told by mail.

## Invite only

`features.openSignUp` false means sign up needs a pending invitation for
the address. The first account on an empty database is always allowed,
which is how the seed and a fresh product get their owner.

## Previews

`baseURL` is a host list: the production host from `BETTER_AUTH_URL`,
`*.vercel.app` and localhost. A preview signs in on its own address. Add a
custom preview domain to the list.

## Rate limiting

Better Auth's limiter counts in memory, one counter per serverless
instance. It is routed through the Postgres counter in `src/lib/guard/`.

## Not built, and the trigger

Sessions list: a person asks. Two factor: a paying customer holding money.
Social sign in: a customer whose staff cannot manage a password.

## Flows

Sign in and sign up post through `authClient`. `safeNext()` sanitises
`next`. Reset always says the same thing. Invitations last a week and
are accepted by a verified person whose email matches. Re-inviting cancels the old one.

## Session cache

Five minutes in the cookie, so a role change can lag that long on a page
that only reads it. Actions read the database.

Regenerating the schema after a config change is in `data.md`.
