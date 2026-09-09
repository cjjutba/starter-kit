import type { Metadata } from "next";
import { headers } from "next/headers";
import { DeleteOrganisation, InvitationRow, LeaveOrganisation, MemberRow } from "@/components/app/members";
import { InviteForm, OrganisationDetailsForm } from "@/components/app/organisation-forms";
import { Card } from "@/components/primitives/surfaces";
import { auth } from "@/lib/auth/server";
import { requireOrganisation } from "@/lib/auth/session";
import { DEFAULT_TZ } from "@/lib/time";

export const metadata: Metadata = { title: "Organisation" };

// Settings that belong to everyone in the organisation. What each person
// can do here follows their role: members read, admins manage people and
// details, owners also delete. Better Auth enforces it; the page shows it.

function hasRole(role: string, wanted: string): boolean {
  return role.split(",").includes(wanted);
}

export default async function OrganisationPage() {
  const { session, organisationId, organisation } = await requireOrganisation();
  const full = await auth.api.getFullOrganization({ query: { organizationId: organisationId }, headers: await headers() });
  const members = full?.members ?? [];
  const pending = (full?.invitations ?? []).filter((invitation) => invitation.status === "pending");
  const viewerIsOwner = hasRole(organisation.role, "owner");
  const canManage = viewerIsOwner || hasRole(organisation.role, "admin");
  const timezones = Intl.supportedValuesOf("timeZone");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-title font-medium">{organisation.name}</h1>
        <p className="mt-1 text-small text-text-2">
          {organisation.slug}, you are {organisation.role}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card as="section" className="flex flex-col gap-4 p-5">
          <h2 className="text-heading font-medium">Details</h2>
          {canManage ? (
            <OrganisationDetailsForm name={organisation.name} timezone={organisation.timezone ?? DEFAULT_TZ} timezones={timezones} />
          ) : (
            <p className="text-body text-text-2">
              Times are shown in {organisation.timezone ?? DEFAULT_TZ}. An owner or admin can change the name and timezone.
            </p>
          )}
        </Card>

        {canManage ? (
          <Card as="section" className="flex flex-col gap-4 p-5">
            <h2 className="text-heading font-medium">Invite someone</h2>
            <InviteForm canInviteOwner={viewerIsOwner} />
          </Card>
        ) : null}
      </div>

      <Card as="section" className="flex flex-col gap-4 p-5">
        <h2 className="text-heading font-medium">People</h2>
        <ul className="flex flex-col gap-2">
          {members.map((item) => (
            <li key={item.id}>
              <MemberRow
                member={{ id: item.id, name: item.user.name, email: item.user.email, role: item.role }}
                isSelf={item.userId === session.user.id}
                canManage={canManage}
                viewerIsOwner={viewerIsOwner}
              />
            </li>
          ))}
          {pending.map((invitation) => (
            <li key={invitation.id}>
              <InvitationRow invitation={{ id: invitation.id, email: invitation.email, role: invitation.role }} canManage={canManage} />
            </li>
          ))}
        </ul>
      </Card>

      <Card as="section" className="flex flex-col gap-4 p-5">
        <h2 className="text-heading font-medium">Leaving</h2>
        <p className="text-small text-text-2">
          Leaving takes your access away and keeps what you wrote. Deleting takes everything, for everyone.
        </p>
        <div className="flex flex-wrap gap-3">
          <LeaveOrganisation name={organisation.name} />
          {viewerIsOwner ? <DeleteOrganisation name={organisation.name} /> : null}
        </div>
      </Card>
    </div>
  );
}
