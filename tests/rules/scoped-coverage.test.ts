import { describe, expect, it } from "vitest";
import type { Database } from "@/lib/db/client";
import { forOrganisation } from "@/lib/db/scoped";
import { tenantTables } from "@/lib/db/tables";

// docs/engineering/data.md, adding a table, step 3: add a block to
// forOrganisation() with the queries the product needs. The tenancy test
// proves the column exists. This proves the table is reachable the one
// allowed way, so a tenant table cannot be added and then queried around
// the scope because nobody wrote the block.
//
// The closures are lazy, so an empty object stands in for the database.

describe("every tenant table has a block in the scoped layer", () => {
  it("exposes a key on forOrganisation() for each key of tenantTables", () => {
    const scoped = forOrganisation("coverage", {} as unknown as Database);
    const missing = Object.keys(tenantTables).filter((name) => !(name in scoped));
    expect(missing, "add a block for each of these in src/lib/db/scoped.ts").toEqual([]);
  });
});
