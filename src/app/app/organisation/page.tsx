import type { Metadata } from "next";
import { headers } from "next/headers";
import { InviteForm, OrganisationDetailsForm } from "@/components/app/organisation-forms";
import { Card, Row } from "@/components/primitives/surfaces";
import { auth } from "@/lib/auth/server";
import { requireOrganisation } from "@/lib/auth/session";
import { DEFAULT_TZ } from "@/lib/time";

export const metadata: Metadata = { title: "Organisation" };

export default async function OrganisationPage() {
  const { organisationId, organisation } = await requireOrganisation();
  const full = await auth.api.getFullOrganization({ query: { organizationId: organisationId }, headers: await headers() });
  const members = full?.members ?? [];
  const pending = (full?.invitations ?? []).filter((invitation) => invitation.status === "pending");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-title font-medium">{organisation.name}</h1>
        <p className="mt-1 text-small text-text-2">{organisation.slug}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card as="section" className="flex flex-col gap-4 p-5">
          <h2 className="text-heading font-medium">Details</h2>
          <OrganisationDetailsForm name={organisation.name} timezone={organisation.timezone ?? DEFAULT_TZ} />
        </Card>

        <Card as="section" className="flex flex-col gap-4 p-5">
          <h2 className="text-heading font-medium">Invite someone</h2>
          <InviteForm />
        </Card>
      </div>

      <Card as="section" className="flex flex-col gap-4 p-5">
        <h2 className="text-heading font-medium">People</h2>
        <ul className="flex flex-col gap-2">
          {members.map((item) => (
            <li key={item.id}>
              <Row tone="field" title={item.user.name} secondary={item.user.email} trailing={<span className="text-label text-text-2">{item.role}</span>} />
            </li>
          ))}
          {pending.map((invitation) => (
            <li key={invitation.id}>
              <Row tone="field" title={invitation.email} secondary="Invited, not yet accepted" trailing={<span className="text-label text-text-2">{invitation.role}</span>} />
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
