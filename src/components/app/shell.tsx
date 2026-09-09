import Link from "next/link";
import type { ReactNode } from "react";
import { NavLink } from "@/components/app/nav-link";
import { OrgSwitcher, type OrganisationOption } from "@/components/app/org-switcher";
import { SignOutButton } from "@/components/app/sign-out-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { product } from "@/config";

// The staff side frame. A 240 px sidebar beside up to 1200 px of content on
// a desk, a stacked header on a phone. Tone separates the sidebar from the
// page, never a border.

export function AppShell({
  user,
  organisation,
  organisations,
  canCreate,
  children,
}: {
  user: { name: string; email: string };
  organisation: OrganisationOption;
  organisations: OrganisationOption[];
  /** features.multipleOrganisations. Shows the link to make another. */
  canCreate: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col md:flex-row">
      <aside className="flex w-full flex-col gap-6 p-gutter md:min-h-dvh md:w-sidebar md:shrink-0 md:py-8">
        <Link href="/app" className="text-heading font-medium">
          {product.name}
        </Link>
        <div className="flex flex-col gap-2">
          <OrgSwitcher current={organisation} organisations={organisations} />
          {canCreate ? (
            <Link href="/app/organisation/new" className="text-label font-medium text-text-2 hover:text-text">
              New organisation
            </Link>
          ) : null}
        </div>
        <nav aria-label="Main">
          <ul className="flex gap-1 md:flex-col">
            <li>
              <NavLink href="/app" exact>
                Notes
              </NavLink>
            </li>
            <li>
              <NavLink href="/app/organisation">Organisation</NavLink>
            </li>
            <li>
              <NavLink href="/app/account">Account</NavLink>
            </li>
          </ul>
        </nav>
        <div className="flex flex-col gap-3 md:mt-auto">
          <Link href="/app/account" className="truncate text-small font-medium text-text-2 hover:text-text" title={user.email}>
            {user.name}
          </Link>
          <div className="flex items-center justify-between gap-3">
            <ThemeToggle compact />
            <SignOutButton />
          </div>
        </div>
      </aside>
      <main className="flex-1 px-5 py-6 md:px-8 md:py-8">
        <div className="mx-auto w-full max-w-content">{children}</div>
      </main>
    </div>
  );
}
