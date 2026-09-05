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
  children,
}: {
  user: { name: string; email: string };
  organisation: OrganisationOption;
  organisations: OrganisationOption[];
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col md:flex-row">
      <aside className="flex w-full flex-col gap-6 p-5 md:min-h-dvh md:w-[240px] md:shrink-0 md:py-8">
        <Link href="/app" className="text-heading font-medium">
          {product.name}
        </Link>
        <OrgSwitcher current={organisation} organisations={organisations} />
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
          </ul>
        </nav>
        <div className="flex flex-col gap-3 md:mt-auto">
          <p className="truncate text-small text-text-2" title={user.email}>
            {user.name}
          </p>
          <div className="flex items-center justify-between gap-3">
            <ThemeToggle compact />
            <SignOutButton />
          </div>
        </div>
      </aside>
      <main className="flex-1 px-5 py-6 md:px-8 md:py-8">
        <div className="mx-auto w-full max-w-[1200px]">{children}</div>
      </main>
    </div>
  );
}
