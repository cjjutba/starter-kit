import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { walk } from "../walk";

// DESIGN.md: never use a hex value in a component. Tokens live in
// globals.css and the two browser chrome colours live in src/config.ts.
// Everything rendered reads a token.

const hex = /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b/;

describe("no raw colours in components", () => {
  it("uses tokens, not hex values, in every tsx file under src", () => {
    const offenders = walk("src")
      .filter((file) => file.endsWith(".tsx"))
      .flatMap((file) =>
        readFileSync(file, "utf8")
          .split("\n")
          .flatMap((line, index) => (hex.test(line) ? [`${file}:${index + 1}: ${line.trim()}`] : [])),
      );
    expect(offenders).toEqual([]);
  });
});
