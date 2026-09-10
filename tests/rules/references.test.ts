import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// The reference skill files what it learned from a site under
// docs/design/explorations/references/<date>-<host>/. A reference without
// its source cannot be re-run, one without its date cannot be judged stale,
// and one without its row in the explorations index is one the next session
// re-runs. Each of those is a rule in the skill, and a rule that only a skill
// reads is a rule the next session skips, so the build reads them too.

const root = join("docs", "design", "explorations");
const index = readFileSync(join(root, "README.md"), "utf8");
const references = join(root, "references");
const folders = existsSync(references) ? readdirSync(references).filter((name) => /^\d{4}-\d{2}-\d{2}-/.test(name)) : [];

describe("every design reference carries its provenance", () => {
  it("has a references table in the explorations index", () => {
    expect(index).toMatch(/^## References$/m);
  });

  for (const folder of folders) {
    const dir = join(references, folder);
    const date = folder.slice(0, 10);

    it(`${folder} has reference.md with its source, date and why`, () => {
      const file = join(dir, "reference.md");
      expect(existsSync(file), `${file} is missing. The skill writes it in step 5.`).toBe(true);
      const text = readFileSync(file, "utf8");
      expect(text, "no Source: line with a URL").toMatch(/^Source: https?:\/\/\S+$/m);
      expect(text, `Date: line does not say ${date}, which the folder name says`).toMatch(new RegExp(`^Date: ${date}$`, "m"));
      expect(text, "no Why: line. Ask what the person likes about the site before running.").toMatch(/^Why: \S/m);
      expect(text, "no Cap: line, so word-caps.test.ts cannot hold it to one").toMatch(/^Cap: \d+ words/m);
    });

    it(`${folder} keeps data.json beside its screenshots`, () => {
      expect(existsSync(join(dir, "data.json")), "data.json is missing, so the numbers cannot be re-read without a re-run").toBe(true);
      const shots = readdirSync(dir).filter((name) => name.endsWith(".webp"));
      expect(shots.length, "no screenshots, so there is no record of what was looked at").toBeGreaterThan(0);
    });

    it(`${folder} has its row in the explorations index`, () => {
      expect(index, `no row mentioning ${folder} under ## References`).toContain(folder);
    });
  }
});
