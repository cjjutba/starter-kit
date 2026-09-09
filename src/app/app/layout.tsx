import type { ReactNode } from "react";
import { AppShell } from "@/components/app/shell";
import { features } from "@/config";
import { membershipsFor } from "@/lib/auth/organisations";
import { requireOrganisation } from "@/lib/auth/session";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const { session, organisation } = await requireOrganisation();
  // Every membership with its role. The switcher shows itself when there is
  // more than one, which an invitation can cause whatever the flag says.
  const memberships = await membershipsFor(session.user.id);

  return (
    <AppShell
      user={{ name: session.user.name, email: session.user.email }}
      organisation={{ id: organisation.id, name: organisation.name, slug: organisation.slug, role: organisation.role }}
      memberships={memberships}
      canCreate={features.multipleOrganisations}
    >
      {children}
    </AppShell>
  );
}
