import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import * as schema from "./schema";

// The raw database handle. Only src/lib/db, src/lib/auth, src/lib/mail,
// src/lib/guard, scripts and tests may import it, and eslint enforces that.
// Application code goes through the scoped layer in ./scoped.ts, which
// cannot be called without an organisation id.
//
// Without a DATABASE_URL the handle still constructs, so `next build`, the
// rule tests and the Better Auth CLI run. The first query then fails with
// a message that says what to do.

export type Database = PgDatabase<PgQueryResultHKT, typeof schema>;

const missing = "DATABASE_URL is not set. Copy .env.example to .env.local and fill it in.";

function createClient(): NeonQueryFunction<false, false> {
  const url = process.env.DATABASE_URL;
  if (url) return neon(url);
  const placeholder = neon("postgresql://unset:unset@localhost:5432/unset");
  return new Proxy(placeholder, {
    apply() {
      throw new Error(missing);
    },
  });
}

let instance: NeonHttpDatabase<typeof schema> | undefined;

export const db: Database = new Proxy({} as Database, {
  get(_target, property) {
    instance ??= drizzle({ client: createClient(), schema });
    const value = Reflect.get(instance, property, instance);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});
