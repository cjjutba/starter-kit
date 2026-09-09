import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { theme } from "@/config";

// The browser chrome and the manifest cannot read a CSS variable, so the page
// colour is written twice more: theme in config.ts and the two colours in the
// web manifest. The third version swapped the page back to grey and left both
// on white for a whole commit, because nothing compared them. This does.

const css = readFileSync("src/app/globals.css", "utf8");
const manifest = JSON.parse(readFileSync("public/manifest.webmanifest", "utf8")) as {
  background_color: string;
  theme_color: string;
};

function token(selector: string, name: string): string {
  const start = css.indexOf(`${selector} {`);
  const end = css.indexOf("}", start);
  const match = css.slice(start, end).match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`));
  if (!match) throw new Error(`--${name} not found in ${selector}`);
  return match[1].toLowerCase();
}

describe("the colours written outside CSS match the tokens", () => {
  it("theme.light and theme.dark are --page in each scheme", () => {
    expect(theme.light.toLowerCase()).toBe(token(":root", "page"));
    expect(theme.dark.toLowerCase()).toBe(token(".dark", "page"));
  });

  it("theme.ink is light --text, for the Open Graph image", () => {
    expect(theme.ink.toLowerCase()).toBe(token(":root", "text"));
  });

  it("the manifest colours are the light page", () => {
    expect(manifest.background_color.toLowerCase()).toBe(theme.light.toLowerCase());
    expect(manifest.theme_color.toLowerCase()).toBe(theme.light.toLowerCase());
  });
});
