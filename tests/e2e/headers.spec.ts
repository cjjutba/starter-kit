import { expect, test } from "@playwright/test";

// Security headers are the easiest thing in the stack to lose, because
// nothing breaks when they go missing and no screen shows them. So they get a
// test rather than a line in a document.
//
// Strict-Transport-Security is not asserted here. Next sets it on the
// response, but a local http run is exactly where a browser would ignore it,
// so checking it against localhost would prove nothing either way.

const expected: [string, string][] = [
  ["x-content-type-options", "nosniff"],
  ["x-frame-options", "DENY"],
  ["content-security-policy", "frame-ancestors 'none'"],
  ["referrer-policy", "strict-origin-when-cross-origin"],
  ["permissions-policy", "camera=(), microphone=(), geolocation=(), browsing-topics=()"],
];

test("every response carries the security headers", async ({ page }) => {
  const response = await page.goto("/");
  expect(response, "the home page did not respond").not.toBeNull();

  const headers = response!.headers();
  for (const [name, value] of expected) {
    expect(headers[name], `${name} is missing or wrong`).toBe(value);
  }
});

test("a route under the app carries them too, not just the root", async ({ page }) => {
  const response = await page.goto("/privacy");
  const headers = response!.headers();
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["x-content-type-options"]).toBe("nosniff");
});
