import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { walk } from "../walk";

// AGENTS.md: no em dashes, no en dashes, anywhere that ships. Docs, skills,
// copy, comments and commit messages. This covers everything in the repo.
// Commit messages are covered by the PR template checklist.

// Built from code points so this file does not trip its own rule.
const dash = new RegExp("[\\u2013\\u2014]");
const extensions = [".md", ".ts", ".tsx", ".mjs", ".css", ".json", ".yml", ".yaml"];

describe("no dashes as punctuation", () => {
  it("has no en or em dash in any source or doc file", () => {
    const offenders = walk(".")
      .filter((file) => extensions.some((extension) => file.endsWith(extension)) && !file.endsWith("pnpm-lock.yaml"))
      .flatMap((file) =>
        readFileSync(file, "utf8")
          .split("\n")
          .flatMap((line, index) => (dash.test(line) ? [`${file}:${index + 1}: ${line.trim().slice(0, 80)}`] : [])),
      );
    expect(offenders).toEqual([]);
  });
});
