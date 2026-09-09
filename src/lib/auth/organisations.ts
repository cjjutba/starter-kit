import { and, asc, eq, gt, inArray, sql } from "drizzle-orm";
import { locale } from "../../config";
import { db as defaultDb, type Database } from "../db/client";
import { invitation, member, organization, session, user } from "../db/schema";
import { slugify } from "../slug";

// The helpers that keep every person inside an organisation they belong to.
// The sign up hook creates the personal organisation. requireOrganisation()
// asks organisationForMember() on every request, because the session's
// active organisation is a hint rather than a fact: Better Auth clears it
// only on the session of the person who acted, so a removed member or the
// members of a deleted organisation would otherwise keep a dead id. Every
// function takes the database as a parameter so the PGlite tests can prove
// them without a Neon branch.

export interface CurrentOrganisation {
  id: string;
  name: string;
  slug: string;
  timezone: string | null;
  /** The person's role in it: owner, admin or member. */
  role: string;
}

export async function createPersonalOrganisation(
  person: { id: string; name: string; email: string },
  db: Database = defaultDb,
): Promise<string> {
  const id = crypto.randomUUID();
  const base = slugify(person.name || person.email.split("@")[0]) || "personal";
  await db.insert(organization).values({
    id,
    name: person.name || "Personal",
    slug: `${base}-${id.slice(0, 8)}`,
    createdAt: new Date(),
    timezone: locale.defaultTimezone,
  });
  await db.insert(member).values({
    id: crypto.randomUUID(),
    organizationId: id,
    userId: person.id,
    role: "owner",
    createdAt: new Date(),
  });
  return id;
}

export async function firstOrganisationFor(userId: string, db: Database = defaultDb): Promise<string | null> {
  const rows = await db
    .select({ id: member.organizationId })
    .from(member)
    .where(eq(member.userId, userId))
    .orderBy(asc(member.createdAt))
    .limit(1);
  return rows[0]?.id ?? null;
}

/** The organisation and the person's role in it, or null when they are not a member. */
export async function organisationForMember(
  userId: string,
  organisationId: string,
  db: Database = defaultDb,
): Promise<CurrentOrganisation | null> {
  const rows = await db
    .select({
      id: organization.id,
      name: organization.name,
      slug: organization.slug,
      timezone: organization.timezone,
      role: member.role,
    })
    .from(member)
    .innerJoin(organization, eq(member.organizationId, organization.id))
    .where(and(eq(member.userId, userId), eq(member.organizationId, organisationId)))
    .limit(1);
  return rows[0] ?? null;
}

/**
 * Forgets an organisation on every session that has it active. With a user
 * id, only that person's sessions. Without one, everyone's, which is what a
 * deleted organisation needs.
 */
export async function clearActiveOrganisation(
  userId: string | null,
  organisationId: string,
  db: Database = defaultDb,
): Promise<void> {
  const inOrganisation = eq(session.activeOrganizationId, organisationId);
  await db
    .update(session)
    .set({ activeOrganizationId: null })
    .where(userId ? and(inOrganisation, eq(session.userId, userId)) : inOrganisation);
}

/** True once anyone has an account. The first person is always let in. */
export async function anyUserExists(db: Database = defaultDb): Promise<boolean> {
  const rows = await db.select({ id: user.id }).from(user).limit(1);
  return rows.length > 0;
}

/** True when an unexpired pending invitation names this address, any case. */
export async function pendingInvitationFor(email: string, db: Database = defaultDb): Promise<boolean> {
  const rows = await db
    .select({ id: invitation.id })
    .from(invitation)
    .where(
      and(
        sql`lower(${invitation.email}) = ${email.trim().toLowerCase()}`,
        eq(invitation.status, "pending"),
        gt(invitation.expiresAt, new Date()),
      ),
    )
    .limit(1);
  return rows.length > 0;
}

function isOwner(role: string): boolean {
  return role.split(",").map((part) => part.trim()).includes("owner");
}

/** Every membership row of every organisation this person belongs to. */
async function membershipsAround(userId: string, db: Database) {
  const theirs = db.select({ id: member.organizationId }).from(member).where(eq(member.userId, userId));
  return db
    .select({ organisationId: member.organizationId, userId: member.userId, role: member.role, name: organization.name })
    .from(member)
    .innerJoin(organization, eq(member.organizationId, organization.id))
    .where(inArray(member.organizationId, theirs));
}

/**
 * Names of organisations this person is the only owner of while other
 * people still belong. Deleting the account would strand them, so the
 * deletion is refused until someone else owns it.
 */
export async function organisationsOnlyOwnedBy(userId: string, db: Database = defaultDb): Promise<string[]> {
  const rows = await membershipsAround(userId, db);
  const names = new Map<string, string>();
  for (const row of rows) {
    if (row.userId !== userId || !isOwner(row.role)) continue;
    const others = rows.filter((other) => other.organisationId === row.organisationId && other.userId !== userId);
    if (others.length > 0 && !others.some((other) => isOwner(other.role))) names.set(row.organisationId, row.name);
  }
  return [...names.values()];
}

/** Deletes every organisation this person is the only member of. Returns how many. */
export async function deleteOrganisationsOnlyMemberOf(userId: string, db: Database = defaultDb): Promise<number> {
  const rows = await membershipsAround(userId, db);
  const counts = new Map<string, number>();
  for (const row of rows) counts.set(row.organisationId, (counts.get(row.organisationId) ?? 0) + 1);
  const alone = [...counts.entries()].filter(([, total]) => total === 1).map(([id]) => id);
  if (alone.length === 0) return 0;
  await db.delete(organization).where(inArray(organization.id, alone));
  return alone.length;
}
