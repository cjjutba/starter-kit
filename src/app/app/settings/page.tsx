import type { Metadata } from "next";
import { DeleteOrganisation, LeaveOrganisation } from "@/components/app/members";
import { OrganisationDetailsForm } from "@/components/app/organisation-forms";
import { SettingsHeader } from "@/components/app/settings-header";
import { Card } from "@/components/primitives/surfaces";
import { requireOrganisation } from "@/lib/auth/session";
import { DEFAULT_TZ } from "@/lib/time";

export const metadata: Metadata = { title: "Organisation" };

// The organisation as everyone in it sees it. Members read, owners and admins
// change the details, anyone can leave, and an owner can delete. Better Auth
// enforces every one of those; the page only shows what applies.

function hasRole(role: string, wanted: string): boolean {
  return role.split(",").includes(wanted);
}

export default async function OrganisationSettingsPage() {
  const { organisation } = await requireOrganisation();
  const viewerIsOwner = hasRole(organisation.role, "owner");
  const canManage = viewerIsOwner || hasRole(organisation.role, "admin");

  return (
    <div className="flex flex-col gap-6">
      <SettingsHeader segment="" detail={`${organisation.slug}, you are ${organisation.role}`} />

      <Card as="section" className="flex flex-col gap-4 p-5">
        <h2 className="text-heading font-medium">Details</h2>
        {canManage ? (
          <OrganisationDetailsForm
            name={organisation.name}
            timezone={organisation.timezone ?? DEFAULT_TZ}
            timezones={Intl.supportedValuesOf("timeZone")}
          />
        ) : (
          <p className="text-body text-text-2">
            Times are shown in {organisation.timezone ?? DEFAULT_TZ}. An owner or admin can change the name and timezone.
          </p>
        )}
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
