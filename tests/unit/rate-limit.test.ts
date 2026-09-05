import { describe, expect, it } from "vitest";

// Needs a real database, so it runs in the fresh clone proof and skips in
// CI. The scoped test covers the in-process case.

describe.skipIf(!process.env.DATABASE_URL)("rateLimit", () => {
  it("allows up to the limit in a window and then refuses with a retry time", async () => {
    const { rateLimit } = await import("@/lib/guard/rate-limit");
    const scope = `test-${Date.now()}`;
    expect(await rateLimit(scope, "1.2.3.4", 2, 60)).toEqual({ allowed: true });
    expect(await rateLimit(scope, "1.2.3.4", 2, 60)).toEqual({ allowed: true });
    const third = await rateLimit(scope, "1.2.3.4", 2, 60);
    expect(third.allowed).toBe(false);
    if (!third.allowed) expect(third.retryAfterSeconds).toBeGreaterThan(0);
    expect(await rateLimit(scope, "5.6.7.8", 2, 60)).toEqual({ allowed: true });
  });
});
