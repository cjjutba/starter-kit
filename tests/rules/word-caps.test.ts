import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { walk } from "../walk";

// docs/README.md: every product and design doc opens with a word cap, and
// /plan refuses to pass it. Length is not detail. A cap that only a skill
// reads is a cap that gets passed by the next session, so the build reads it
// too. The cap line itself is not counted. A doc with no cap line, such as
// the glossary or the decision log, is not held to one.

const docs = ["docs/product", "docs/design", "docs/engineering"]
  .flatMap((dir) => walk(dir))
  .filter((file) => file.endsWith(".md"));

function capAndCount(file: string): { cap: number; words: number } | null {
  const lines = readFileSync(file, "utf8").split("\n");
  const index = lines.findIndex((line) => /^Cap: \d+ words/.test(line));
  if (index < 0) return null;
  const cap = Number(lines[index].match(/^Cap: (\d+) words/)![1]);
  const words = lines
    .slice(index + 1)
    .join(" ")
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
  return { cap, words };
}

describe("every capped doc stays under its cap", () => {
  for (const file of docs) {
    const result = capAndCount(file);
    if (!result) continue;
    it(`${file} is within ${result.cap} words`, () => {
      expect(result.words, `${file} has ${result.words} words against a cap of ${result.cap}. Cut, do not exceed.`).toBeLessThanOrEqual(result.cap);
    });
  }

  it("finds capped docs at all, so the rule is exercised", () => {
    expect(docs.filter((file) => capAndCount(file) !== null).length).toBeGreaterThan(10);
  });
});
