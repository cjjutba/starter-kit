import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { pushSchema } from "drizzle-kit/api";
import { eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import * as schema from "@/lib/db/schema";
import { forOrganisation } from "@/lib/db/scoped";

// The scoped layer against an in-process Postgres. Two organisations, two
// people, and every cross-organisation read, update and delete comes back
// empty. This is the test that guards the one bug class that would end a
// multi-tenant product.

const client = new PGlite();
const db = drizzle({ client, schema });

const now = new Date();
const orgA = { id: "org-a", name: "Acme Studio", slug: "acme", createdAt: now };
const orgB = { id: "org-b", name: "Northwind Traders", slug: "northwind", createdAt: now };
const userA = { id: "user-a", name: "Ana", email: "ana@example.com", createdAt: now, updatedAt: now };
const userB = { id: "user-b", name: "Ben", email: "ben@example.com", createdAt: now, updatedAt: now };

beforeAll(async () => {
  // drizzle-kit types its second argument narrower than the instance it accepts at runtime.
  const { apply } = await pushSchema(schema, db as unknown as Parameters<typeof pushSchema>[1]);
  await apply();
  await db.insert(schema.user).values([userA, userB]);
  await db.insert(schema.organization).values([orgA, orgB]);
  await db.insert(schema.member).values([
    { id: "m-a", organizationId: orgA.id, userId: userA.id, role: "owner", createdAt: now },
    { id: "m-b", organizationId: orgB.id, userId: userB.id, role: "owner", createdAt: now },
  ]);
});

afterAll(async () => {
  await client.close();
});

describe("forOrganisation", () => {
  it("refuses an empty organisation id", () => {
    expect(() => forOrganisation("", db)).toThrow();
  });

  it("returns only the organisation's rows", async () => {
    const a = forOrganisation(orgA.id, db);
    const b = forOrganisation(orgB.id, db);
    await a.notes.create({ title: "A's note", body: "", authorId: userA.id });
    await b.notes.create({ title: "B's note", body: "", authorId: userB.id });

    expect((await a.notes.list()).map((n) => n.title)).toEqual(["A's note"]);
    expect((await b.notes.list()).map((n) => n.title)).toEqual(["B's note"]);
  });

  it("cannot read, update or delete another organisation's note by id", async () => {
    const a = forOrganisation(orgA.id, db);
    const b = forOrganisation(orgB.id, db);
    const note = await a.notes.create({ title: "Private", body: "", authorId: userA.id });

    expect(await b.notes.get(note.id)).toBeNull();
    expect(await b.notes.update(note.id, { title: "Taken over" })).toBeNull();
    expect(await b.notes.remove(note.id)).toBe(false);

    const still = await a.notes.get(note.id);
    expect(still?.title).toBe("Private");
  });

  it("stamps the organisation on every insert, whatever the caller passes", async () => {
    const a = forOrganisation(orgA.id, db);
    const note = await a.notes.create({ title: "Stamped", body: "", authorId: userA.id });
    expect(note.organisationId).toBe(orgA.id);
  });

  it("refuses an update when the row changed since the form opened", async () => {
    const a = forOrganisation(orgA.id, db);
    const note = await a.notes.create({ title: "Draft", body: "", authorId: userA.id });
    // The version is a millisecond timestamp, so a save inside the same
    // millisecond as the create would not move it. A person cannot be that
    // fast; a test can.
    await new Promise((resolve) => setTimeout(resolve, 5));

    // The first save with the timestamp the form opened with lands.
    const first = await a.notes.update(note.id, { title: "Draft, edited" }, note.updatedAt);
    expect(first?.title).toBe("Draft, edited");
    expect(first!.updatedAt.getTime()).toBeGreaterThan(note.updatedAt.getTime());

    // A second save still carrying the original timestamp is refused.
    expect(await a.notes.update(note.id, { title: "Stale" }, note.updatedAt)).toBeNull();
    expect((await a.notes.get(note.id))?.title).toBe("Draft, edited");
  });

  it("lists the author's name, and null once they are gone", async () => {
    const a = forOrganisation(orgA.id, db);
    const note = await a.notes.create({ title: "Signed", body: "", authorId: userA.id });
    expect((await a.notes.list()).find((row) => row.id === note.id)?.authorName).toBe("Ana");

    await db.delete(schema.user).where(eq(schema.user.id, userA.id));
    const after = await a.notes.list();
    expect(after.find((row) => row.id === note.id)?.authorName).toBeNull();
  });
});
