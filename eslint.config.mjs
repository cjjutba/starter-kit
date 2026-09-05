import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Two rules from AGENTS.md live here instead of in prose, so an agent that
// skims the manual still cannot ship the bug.
//
// 1. The raw database handle never leaves the data layer. Application code
//    goes through @/lib/db/scoped, which cannot be called without an
//    organisation id.
// 2. Only src/lib/time imports date-fns. Every other file uses its helpers,
//    so timezone handling stays in one place.

const rawDatabaseMessage =
  "Import forOrganisation from @/lib/db/scoped instead. The raw handle is only for src/lib/db, src/lib/auth, src/lib/mail, src/lib/guard, scripts and tests.";
const rawDateMessage = "Only src/lib/time imports date-fns. Add a helper there and use it.";

const restrictRawDatabase = {
  paths: [{ name: "@/lib/db/client", message: rawDatabaseMessage }],
  patterns: [
    { group: ["**/db/client", "*/db/client", "../db/client", "../../db/client", "../../../db/client"], message: rawDatabaseMessage },
  ],
};

const restrictRawDates = {
  paths: [
    { name: "date-fns", message: rawDateMessage },
    { name: "@date-fns/tz", message: rawDateMessage },
  ],
};

const dataLayer = ["src/lib/db/**", "src/lib/auth/**", "src/lib/mail/**", "src/lib/guard/**"];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "drizzle/**", "playwright-report/**", "test-results/**"]),
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: [...dataLayer, "src/lib/time/**"],
    rules: {
      "no-restricted-imports": ["error", { ...restrictRawDatabase, paths: [...restrictRawDatabase.paths, ...restrictRawDates.paths] }],
    },
  },
  {
    files: dataLayer,
    rules: { "no-restricted-imports": ["error", restrictRawDates] },
  },
  {
    files: ["src/lib/time/**"],
    rules: { "no-restricted-imports": ["error", restrictRawDatabase] },
  },
]);

export default eslintConfig;
