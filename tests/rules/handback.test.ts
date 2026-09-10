import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { walk } from "../walk";

// AGENTS.md rule 10: the agent stops at the commit. The person pushes,
// opens the pull request and merges, in batches, because every pull
// request runs CI. A skill that tells the agent to push, open or merge is
// the way that rule gets broken quietly, so the build reads the skills.
// Setup makes the one push, after a yes, and it says "push" without the
// command, which is the line this test draws. "vercel deploy" may appear
// only in a sentence that forbids it.

const skills = walk(".claude/skills").filter((file) => file.endsWith(".md"));

const forbidden: [RegExp, string][] = [
  [/\bgit push\b/, "git push"],
  [/\bgh pr (create|merge)\b/, "gh pr create or merge"],
  [/\bgit merge\b/, "git merge"],
];

describe("no skill tells the agent to push, open a pull request or merge", () => {
  for (const file of skills) {
    it(`${file} stops at the commit`, () => {
      const offenders = readFileSync(file, "utf8")
        .split("\n")
        .flatMap((line, index) => {
          const hits = forbidden.filter(([pattern]) => pattern.test(line)).map(([, name]) => name);
          if (/\bvercel deploy\b/.test(line) && !/\bnever\b/i.test(line)) hits.push("vercel deploy outside a sentence that forbids it");
          return hits.map((hit) => `${file}:${index + 1}: ${hit}`);
        });
      expect(offenders).toEqual([]);
    });
  }

  it("finds the skills at all, so the rule is exercised", () => {
    expect(skills.length).toBeGreaterThan(5);
  });
});
