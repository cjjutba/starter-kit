import * as schema from "./schema";

// Every table in the schema belongs to exactly one of these lists, and
// tests/rules/tenancy.test.ts fails the build when one is missing.
//
// Tenant tables carry organisation_id and are only reachable through the
// scoped layer. Shared tables are either owned by Better Auth, which scopes
// member and invitation itself, or are infrastructure with no tenant data.

export const tenantTables = {
  notes: schema.notes,
} as const;

export const sharedTables = {
  user: schema.user,
  session: schema.session,
  account: schema.account,
  verification: schema.verification,
  organization: schema.organization,
  member: schema.member,
  invitation: schema.invitation,
  rateLimits: schema.rateLimits,
  mailLog: schema.mailLog,
} as const;
