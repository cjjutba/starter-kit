import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "../db/client";
import { organization } from "../db/schema";
import { createPersonalOrganisation, firstOrganisationFor } from "./organisations";
import { auth } from "./server";

// Server side session helpers. The proxy only checks that a cookie exists.
// These are the real checks, and every page and action under /app calls one.

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function requireSession() {
  const session = await getSession();
  if (!session) redirect("/sign-in");
  return session;
}

export interface CurrentOrganisation {
  id: string;
  name: string;
  slug: string;
  timezone: string | null;
}

/** The session, the organisation id every scoped query runs against, and that organisation's row. */
export async function requireOrganisation() {
  const session = await requireSession();
  let organisationId = session.session.activeOrganizationId ?? null;

  if (!organisationId) {
    // Should not happen: sign up creates a personal organisation and every
    // session starts with one active. Heal it rather than dead end.
    organisationId = (await firstOrganisationFor(session.user.id)) ?? (await createPersonalOrganisation(session.user));
    await auth.api
      .setActiveOrganization({ body: { organizationId: organisationId }, headers: await headers() })
      .catch(() => undefined);
  }

  const rows = await db
    .select({ id: organization.id, name: organization.name, slug: organization.slug, timezone: organization.timezone })
    .from(organization)
    .where(eq(organization.id, organisationId))
    .limit(1);
  const current: CurrentOrganisation | undefined = rows[0];
  if (!current) redirect("/sign-in");

  return { session, organisationId, organisation: current };
}
