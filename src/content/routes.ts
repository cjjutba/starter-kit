// Every route, grouped by surface. The design sheet renders this as a
// directory and the axe smoke test walks the public ones. It has to agree
// with docs/design/pages.md and with the pages under src/app, and
// tests/rules/routes.test.ts fails the build when it does not. Protected
// routes need a session and are skipped by the smoke test.

export interface RouteEntry {
  label: string;
  /** The route as written in the app and the pages doc, `[id]` included. */
  href: string;
  note?: string;
  protected?: boolean;
  /** A concrete address the design sheet can link when the route is dynamic. */
  example?: string;
  /** Not a page. An address that should 404, walked so the not found screen is checked. */
  probe?: boolean;
}

export interface RouteGroup {
  title: string;
  routes: RouteEntry[];
}

export const routeGroups: RouteGroup[] = [
  {
    title: "Marketing and legal",
    routes: [
      { label: "Home", href: "/" },
      { label: "Privacy", href: "/privacy" },
      { label: "Deletion request", href: "/privacy/request" },
      { label: "Design sheet", href: "/design" },
      { label: "Not found", href: "/this-page-does-not-exist", probe: true },
    ],
  },
  {
    title: "Auth",
    routes: [
      { label: "Sign in", href: "/sign-in" },
      { label: "Sign up", href: "/sign-up" },
      { label: "Reset password", href: "/reset" },
      { label: "Accept invitation", href: "/invite/[id]", example: "/invite/EXAMPLE", note: "from the invitation mail" },
    ],
  },
  {
    title: "App",
    routes: [
      { label: "Notes", href: "/app", protected: true },
      { label: "New note", href: "/app/notes/new", protected: true },
      { label: "Organisation", href: "/app/organisation", protected: true },
    ],
  },
];

/** The routes a stranger can open. What the smoke test and crawlers see. */
export const publicRoutes: RouteEntry[] = routeGroups
  .flatMap((group) => group.routes)
  .filter((route) => !route.protected && !route.example);
