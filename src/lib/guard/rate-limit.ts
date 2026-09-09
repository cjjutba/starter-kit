import { lt, sql } from "drizzle-orm";
import { db } from "../db/client";
import { rateLimits } from "../db/schema";

// A fixed window counter in Postgres, because the free tier has no Redis and
// a public form needs something. One upsert per check: a window that has
// expired restarts at one, otherwise the count goes up.

export type RateLimitResult = { allowed: true } | { allowed: false; retryAfterSeconds: number };

export async function rateLimit(
  scope: string,
  identifier: string,
  max: number,
  windowSeconds: number,
): Promise<RateLimitResult> {
  const key = `${scope}:${identifier}`;
  const now = new Date();
  const windowMs = windowSeconds * 1000;
  const oldestLiveStart = new Date(now.getTime() - windowMs);

  const [row] = await db
    .insert(rateLimits)
    .values({ key, count: 1, windowStart: now })
    .onConflictDoUpdate({
      target: rateLimits.key,
      set: {
        count: sql`case when ${rateLimits.windowStart} < ${oldestLiveStart} then 1 else ${rateLimits.count} + 1 end`,
        windowStart: sql`case when ${rateLimits.windowStart} < ${oldestLiveStart} then ${now} else ${rateLimits.windowStart} end`,
      },
    })
    .returning();

  if (row.count <= max) return { allowed: true };
  const retryAfterSeconds = Math.max(1, Math.ceil((row.windowStart.getTime() + windowMs - now.getTime()) / 1000));
  return { allowed: false, retryAfterSeconds };
}

/** The caller's address as Vercel reports it. "unknown" when nothing is set. */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "unknown";
}

/** Deletes counters whose window started longer ago than this. Returns the count. */
export async function purgeRateLimits(olderThanSeconds: number, database: typeof db = db): Promise<number> {
  const cutoff = new Date(Date.now() - olderThanSeconds * 1000);
  const rows = await database.delete(rateLimits).where(lt(rateLimits.windowStart, cutoff)).returning({ key: rateLimits.key });
  return rows.length;
}
