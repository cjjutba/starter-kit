import { asc, eq } from "drizzle-orm";
import { db as defaultDb, type Database } from "./client";
import { privacyRequests } from "./schema";

// The deletion request record. Shared, no tenant data: the person asking
// may not even have an account. The public action records first and mails
// second, so a request survives the mail purge and a mail provider outage.
// pnpm privacy:requests lists what is open.

export async function recordPrivacyRequest(input: { email: string; message: string }, db: Database = defaultDb): Promise<string> {
  const [row] = await db.insert(privacyRequests).values(input).returning({ id: privacyRequests.id });
  return row.id;
}

export async function listOpenPrivacyRequests(db: Database = defaultDb) {
  return db.select().from(privacyRequests).where(eq(privacyRequests.status, "open")).orderBy(asc(privacyRequests.createdAt));
}

/** Marks a request handled. False when there was no open request with that id. */
export async function markPrivacyRequestDone(id: string, db: Database = defaultDb): Promise<boolean> {
  const rows = await db
    .update(privacyRequests)
    .set({ status: "done", handledAt: new Date() })
    .where(eq(privacyRequests.id, id))
    .returning({ id: privacyRequests.id });
  return rows.length > 0;
}
