import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { nextCookies } from "better-auth/next-js";
import { organization } from "better-auth/plugins";
import { features, locale, product } from "../../config";
import { db } from "../db/client";
import * as schema from "../db/schema";
import { rateLimit } from "../guard/rate-limit";
import { send } from "../mail";
import { existingAccountMail, invitationMail, resetPasswordMail, verifyEmailMail } from "../mail/templates";
import {
  anyUserExists,
  clearActiveOrganisation,
  createPersonalOrganisation,
  firstOrganisationFor,
  pendingInvitationFor,
} from "./organisations";

// The Better Auth instance. Email and password with the address verified
// before a session exists, organisations, cookies set from server actions.
// Two hooks keep the tenancy rule true for every person: sign up creates a
// personal organisation, and every new session starts with an active one.
//
// Mail is awaited rather than fired in the background. The log row has to
// exist before the response so the verify skill can read it, and sign up
// already answers an existing address with the same success it gives a new
// one, so the timing gain would guard nothing.
//
// Relative imports on purpose. The Better Auth CLI loads this file without
// the tsconfig path alias.

// Production sets this to its origin. Previews leave it unset and are
// matched by the Vercel wildcard below. Locally it is the dev server.
const productionOrigin = process.env.BETTER_AUTH_URL;

export const auth = betterAuth({
  appName: product.name,
  // The object form resolves the origin per request against a host list, so
  // a preview deployment signs in on its own address while production stays
  // pinned. Every allowed host is also a trusted origin. A custom preview
  // domain is added here.
  baseURL: {
    allowedHosts: [...(productionOrigin ? [new URL(productionOrigin).host] : []), "*.vercel.app", "localhost:*"],
    protocol: "auto",
    fallback: productionOrigin ?? "http://localhost:3000",
  },
  secret: process.env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, { provider: "pg", schema }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 10,
    // No session until the address is verified. Sign up answers an existing
    // address with the same success, and the real owner is told below.
    requireEmailVerification: true,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      await send(resetPasswordMail({ to: user.email, name: user.name, url }));
    },
    onExistingUserSignUp: async ({ user }) => {
      await send(existingAccountMail({ to: user.email, name: user.name }));
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await send(verifyEmailMail({ to: user.email, name: user.name, url }));
    },
    sendOnSignUp: true,
    // Without this an unverified sign in gets the refusal and no mail.
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
    expiresIn: 60 * 60,
  },
  user: {
    // Invite only, when the product asks for it. The first account on an
    // empty database is always allowed, which is how the seed and a fresh
    // product get their owner. After that, sign up needs a pending
    // invitation for the address.
    validateUserInfo: async ({ user, source }) => {
      if (features.openSignUp || source.action !== "create-user") return;
      if (!(await anyUserExists())) return;
      if (user.email && (await pendingInvitationFor(user.email))) return;
      return {
        error: "invitation_required",
        errorDescription: "This product is by invitation. Sign up with the address your invitation was sent to.",
      };
    },
  },
  session: {
    cookieCache: { enabled: true, maxAge: 5 * 60 },
  },
  rateLimit: {
    // Better Auth's own limiter keeps its counters in memory, which on
    // serverless is one counter per instance. This routes it through the
    // same Postgres counter the public forms use. Enabled in production
    // only, which is the default.
    customStorage: {
      consume: async (key, rule) => {
        const result = await rateLimit("auth", key, rule.max, rule.window);
        return result.allowed ? { allowed: true, retryAfter: null } : { allowed: false, retryAfter: result.retryAfterSeconds };
      },
    },
  },
  advanced: {
    // Vercel sets x-real-ip to the caller. Better Auth ignores a chained
    // x-forwarded-for without a proxy list, so it comes second.
    ipAddress: { ipAddressHeaders: ["x-real-ip", "x-forwarded-for"] },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await createPersonalOrganisation(user);
        },
      },
    },
    session: {
      create: {
        before: async (session) => {
          const organisationId = await firstOrganisationFor(session.userId);
          return { data: { ...session, activeOrganizationId: organisationId } };
        },
      },
    },
  },
  plugins: [
    organization({
      // Seconds. A week, because the person invited is often not at a desk.
      invitationExpiresIn: 60 * 60 * 24 * 7,
      requireEmailVerificationOnInvitation: true,
      cancelPendingInvitationsOnReInvite: true,
      schema: {
        organization: {
          additionalFields: {
            timezone: {
              type: "string",
              required: false,
              defaultValue: locale.defaultTimezone,
              input: true,
            },
          },
        },
      },
      sendInvitationEmail: async ({ email, inviter, organization: org, id }) => {
        await send(
          invitationMail({
            to: email,
            inviterName: inviter.user.name,
            organisationName: org.name,
            url: `${product.url}/invite/${id}`,
          }),
        );
      },
      organizationHooks: {
        // Better Auth forgets the active organisation only on the actor's
        // session. These forget it everywhere it no longer holds.
        afterRemoveMember: async ({ member, organization: org }) => {
          await clearActiveOrganisation(member.userId, org.id);
        },
        afterDeleteOrganization: async ({ organization: org }) => {
          await clearActiveOrganisation(null, org.id);
        },
      },
    }),
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
