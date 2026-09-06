import { defineConfig } from "@playwright/test";

// The axe smoke test. Points at a running app when E2E_BASE_URL is set,
// otherwise starts the production build on PORT, default 3000.

const port = process.env.PORT ?? "3000";
const baseURL = process.env.E2E_BASE_URL ?? `http://localhost:${port}`;

// Without a secret Better Auth throws while rendering, the auth pages fall back
// to the error boundary, and axe reports four colour contrast failures on
// elements that are not the problem. Fail here instead, where the cause is
// readable. Only when this config starts the server; a deployed target carries
// its own environment.
if (!process.env.E2E_BASE_URL && !process.env.BETTER_AUTH_SECRET) {
  throw new Error(
    "BETTER_AUTH_SECRET is missing, so /sign-in and /sign-up would render the error boundary and axe would blame the wrong elements. Copy .env.example to .env.local and fill it, or export the variable for this run.",
  );
}

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 30_000,
  fullyParallel: true,
  reporter: process.env.CI ? "github" : "list",
  use: { baseURL },
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : { command: `pnpm start --port ${port}`, url: baseURL, reuseExistingServer: !process.env.CI, timeout: 60_000 },
  projects: [
    { name: "light", use: { browserName: "chromium", colorScheme: "light" } },
    { name: "dark", use: { browserName: "chromium", colorScheme: "dark" } },
  ],
});
