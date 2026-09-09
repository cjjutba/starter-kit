import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { routeGroups } from "@/content/routes";
import { walk } from "../walk";

// docs/design/pages.md and src/content/routes.ts must agree, and every page
// in src/app must be in both. The doc is what a person reads, the directory
// is what the design sheet and the axe run walk. A page missing from either
// is a page nobody checks. Before this test the two had already drifted by
// one entry.

const pages = walk("src/app")
  .filter((file) => file.endsWith("/page.tsx"))
  .map((file) => {
    const route = file
      .replace(/^src\/app/, "")
      .replace(/\/page\.tsx$/, "")
      .replace(/\/\([^)]+\)/g, "");
    return route === "" ? "/" : route;
  });

const entries = routeGroups.flatMap((group) => group.routes);
const directory = new Set(entries.filter((route) => !route.probe).map((route) => route.href));

const documented = new Set(
  readFileSync("docs/design/pages.md", "utf8")
    .split("\n")
    .filter((line) => line.startsWith("|"))
    .flatMap((line) => [...line.matchAll(/`(\/[^`\s]*)`/g)].map((match) => match[1])),
);

describe("the route directory, the pages doc and the app agree", () => {
  it("has a directory entry for every page in src/app", () => {
    expect(pages.filter((route) => !directory.has(route))).toEqual([]);
  });

  it("documents every directory entry in docs/design/pages.md", () => {
    expect([...directory].filter((route) => !documented.has(route))).toEqual([]);
  });

  it("has a directory entry for every route the pages doc names", () => {
    expect([...documented].filter((route) => !directory.has(route))).toEqual([]);
  });

  it("gives every dynamic route an example the design sheet can link", () => {
    const dynamic = entries.filter((route) => route.href.includes("["));
    expect(dynamic.filter((route) => !route.example).map((route) => route.href)).toEqual([]);
  });
});
