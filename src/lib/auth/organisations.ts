import { asc, eq } from "drizzle-orm";
import { locale } from "../../config";
import { db } from "../db/client";
import { member, organization } from "../db/schema";
import { slugify } from "../slug";

// The two helpers that keep every person inside an organisation. The sign up
// hook calls the first. requireOrganisation() calls both when a session has
// no active organisation, which should not happen and is healed rather than
// shown as an error.

export async function createPersonalOrganisation(user: { id: string; name: string; email: string }): Promise<string> {
  const id = crypto.randomUUID();
  const base = slugify(user.name || user.email.split("@")[0]) || "personal";
  await db.insert(organization).values({
    id,
    name: user.name || "Personal",
    slug: `${base}-${id.slice(0, 8)}`,
    createdAt: new Date(),
    timezone: locale.defaultTimezone,
  });
  await db.insert(member).values({
    id: crypto.randomUUID(),
    organizationId: id,
    userId: user.id,
    role: "owner",
    createdAt: new Date(),
  });
  return id;
}

export async function firstOrganisationFor(userId: string): Promise<string | null> {
  const rows = await db
    .select({ id: member.organizationId })
    .from(member)
    .where(eq(member.userId, userId))
    .orderBy(asc(member.createdAt))
    .limit(1);
  return rows[0]?.id ?? null;
}
