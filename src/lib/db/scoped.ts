import { and, desc, eq } from "drizzle-orm";
import { db as defaultDb, type Database } from "./client";
import { notes } from "./schema";

// The only way application code reads or writes a tenant table. Every
// function closes over one organisation id and adds it to every query, so
// a query without a scope cannot be written, and a wrong scope returns
// nothing rather than someone else's rows.
//
// Add a block per tenant table. Keep the functions small and the SQL in
// here; server actions call these and never see drizzle.

export interface NoteInput {
  title: string;
  body: string;
}

export function forOrganisation(organisationId: string, db: Database = defaultDb) {
  if (!organisationId) {
    throw new Error("forOrganisation needs an organisation id.");
  }
  const inScope = eq(notes.organisationId, organisationId);

  return {
    organisationId,
    notes: {
      list: () => db.select().from(notes).where(inScope).orderBy(desc(notes.createdAt)),
      get: async (id: string) => {
        const rows = await db
          .select()
          .from(notes)
          .where(and(inScope, eq(notes.id, id)))
          .limit(1);
        return rows[0] ?? null;
      },
      create: async (input: NoteInput & { authorId: string }) => {
        const rows = await db
          .insert(notes)
          .values({ ...input, organisationId })
          .returning();
        return rows[0];
      },
      update: async (id: string, input: Partial<NoteInput>) => {
        const rows = await db
          .update(notes)
          .set(input)
          .where(and(inScope, eq(notes.id, id)))
          .returning();
        return rows[0] ?? null;
      },
      remove: async (id: string) => {
        const rows = await db
          .delete(notes)
          .where(and(inScope, eq(notes.id, id)))
          .returning({ id: notes.id });
        return rows.length > 0;
      },
    },
  };
}

export type Scoped = ReturnType<typeof forOrganisation>;
