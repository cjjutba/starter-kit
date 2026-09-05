import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { nextCookies } from "better-auth/next-js";
import { organization } from "better-auth/plugins";
import { locale, product } from "../../config";
import { db } from "../db/client";
import * as schema from "../db/schema";
import { send } from "../mail";
import { invitationMail, resetPasswordMail } from "../mail/templates";
import { createPersonalOrganisation, firstOrganisationFor } from "./organisations";

// The Better Auth instance. Email and password, organisations, cookies set
// from server actions. Two hooks keep the tenancy rule true for every
// person: sign up creates a personal organisation, and every new session
// starts with an active organisation.
//
// Relative imports on purpose. The Better Auth CLI loads this file without
// the tsconfig path alias.

export const auth = betterAuth({
  appName: product.name,
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, { provider: "pg", schema }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 10,
    sendResetPassword: async ({ user, url }) => {
      await send(resetPasswordMail({ to: user.email, name: user.name, url }));
    },
  },
  session: {
    cookieCache: { enabled: true, maxAge: 5 * 60 },
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
    }),
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
