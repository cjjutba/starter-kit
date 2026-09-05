import { getTableColumns, getTableName, is } from "drizzle-orm";
import { PgTable } from "drizzle-orm/pg-core";
import { describe, expect, it } from "vitest";
import * as schema from "@/lib/db/schema";
import { sharedTables, tenantTables } from "@/lib/db/tables";

// AGENTS.md: every tenant table carries organisation_id and every query is
// scoped. This is the half a test can check. The other half is the eslint
// rule that keeps the raw handle inside the data layer.

const everyTable = Object.entries(schema as Record<string, unknown>).flatMap(([exportName, value]) =>
  is(value, PgTable) ? [{ exportName, tableName: getTableName(value) as string }] : [],
);

const tenantNames = new Set<string>(Object.values(tenantTables).map((table) => getTableName(table)));
const sharedNames = new Set<string>(Object.values(sharedTables).map((table) => getTableName(table)));

describe("tenancy", () => {
  it("classifies every table in the schema exactly once", () => {
    const unclassified = everyTable.filter((t) => !tenantNames.has(t.tableName) && !sharedNames.has(t.tableName));
    expect(unclassified.map((t) => t.exportName), "add each of these to tenantTables or sharedTables in src/lib/db/tables.ts").toEqual([]);

    const both = [...tenantNames].filter((name) => sharedNames.has(name));
    expect(both, "a table cannot be both tenant and shared").toEqual([]);
  });

  it("gives every tenant table a required organisation_id column", () => {
    for (const [name, table] of Object.entries(tenantTables)) {
      const columns = getTableColumns(table);
      const column = columns.organisationId;
      expect(column, `${name} has no organisationId column`).toBeDefined();
      expect(column?.name, `${name}.organisationId must map to organisation_id`).toBe("organisation_id");
      expect(column?.notNull, `${name}.organisation_id must be not null`).toBe(true);
    }
  });

  it("has at least one tenant table, so the pattern is exercised", () => {
    expect(Object.keys(tenantTables).length).toBeGreaterThan(0);
  });
});
