import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { walk } from "../walk";

// DESIGN.md: the design system is the source of truth for every number a
// screen renders. Sizes, spacing, radii and type all have tokens in
// globals.css, so a component never measures its own. Tailwind's arbitrary
// value syntax, text-[13px] or max-w-[480px], is how that rule gets broken
// quietly, one component at a time, until nothing can be restyled centrally.
//
// This catches the design axes only. Variant selectors like data-[state=open]
// are not design values and are left alone.

const axes = new Set([
  "text",
  "leading",
  "tracking",
  "font",
  "w",
  "h",
  "size",
  "min-w",
  "min-h",
  "max-w",
  "max-h",
  "basis",
  "p",
  "px",
  "py",
  "pt",
  "pb",
  "pl",
  "pr",
  "m",
  "mx",
  "my",
  "mt",
  "mb",
  "ml",
  "mr",
  "gap",
  "gap-x",
  "gap-y",
  "space-x",
  "space-y",
  "rounded",
  "bg",
  "border",
  "ring",
  "shadow",
  "top",
  "right",
  "bottom",
  "left",
  "inset",
]);

// src/components/ui is the shadcn set. The CLI regenerates those files, so
// their internals are not ours to hold to this rule. Everything that renders
// product surface is.
const vendored = "src/components/ui/";

// One exception, with its reason. A honeypot has to leave the viewport
// without leaving the document, and no spacing token should exist for that.
const allowed = new Map([["src/components/forms/honeypot.tsx", "moves a honeypot off screen, which is a technique and not a design value"]]);

const arbitrary = /([a-z][a-z-]*)-\[/g;

function offendersIn(file: string): string[] {
  const found: string[] = [];
  readFileSync(file, "utf8")
    .split("\n")
    .forEach((line, index) => {
      for (const match of line.matchAll(arbitrary)) {
        const axis = match[1];
        if (!axes.has(axis)) continue;
        const before = line[match.index - 1];
        // A letter before means this is the tail of a longer word, such as
        // the w in group-has-w, and not a utility of its own.
        if (before && /[a-z]/.test(before)) continue;
        found.push(`${file}:${index + 1}: ${axis}-[...] in ${line.trim()}`);
      }
    });
  return found;
}

describe("no raw design values in components", () => {
  it("uses tokens, not arbitrary Tailwind values, for size, spacing and type", () => {
    const offenders = walk("src")
      .filter((file) => file.endsWith(".tsx"))
      .filter((file) => !file.includes(vendored))
      .filter((file) => !allowed.has(file))
      .flatMap(offendersIn);

    expect(offenders).toEqual([]);
  });

  it("keeps the allowlist honest, so an exception cannot outlive its file", () => {
    const missing = [...allowed.keys()].filter((file) => !walk("src").includes(file));
    expect(missing).toEqual([]);
  });
});
