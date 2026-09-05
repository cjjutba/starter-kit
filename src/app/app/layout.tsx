import { headers } from "next/headers";
import type { ReactNode } from "react";
import { AppShell } from "@/components/app/shell";
import { features } from "@/config";
import { auth } from "@/lib/auth/server";
import { requireOrganisation } from "@/lib/auth/session";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const { session, organisation } = await requireOrganisation();
  const organisations = features.showOrganisationSwitcher
    ? await auth.api.listOrganizations({ headers: await headers() })
    : [];

  return (
    <AppShell
      user={{ name: session.user.name, email: session.user.email }}
      organisation={{ id: organisation.id, name: organisation.name }}
      organisations={organisations.map((item) => ({ id: item.id, name: item.name }))}
    >
      {children}
    </AppShell>
  );
}
