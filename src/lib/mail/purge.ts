import { lt } from "drizzle-orm";
import { db } from "../db/client";
import { mailLog } from "../db/schema";

/** Deletes logged mail older than the given number of days. Returns the count. */
export async function purgeMailLog(olderThanDays: number): Promise<number> {
  const cutoff = new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000);
  const rows = await db.delete(mailLog).where(lt(mailLog.createdAt, cutoff)).returning({ id: mailLog.id });
  return rows.length;
}
