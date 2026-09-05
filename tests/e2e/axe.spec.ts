import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { publicRoutes } from "../../src/content/routes";

// WCAG 2A and 2AA on every public route, in both colour schemes. A route
// missing from src/content/routes.ts is a route nobody checks.

for (const route of publicRoutes) {
  test(`${route.label} at ${route.href} passes axe`, async ({ page }) => {
    await page.goto(route.href);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  });
}
