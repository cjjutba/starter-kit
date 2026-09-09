"use client";

import { useActionState } from "react";
import { Outcome } from "@/components/forms/outcome";
import { InputField, SelectField } from "@/components/primitives/field";
import { Pill } from "@/components/primitives/pill";
import {
  createOrganisation,
  inviteMember,
  updateOrganisation,
  type OrganisationFormState,
} from "@/app/app/organisation/actions";

const initial: OrganisationFormState = {};

// React resets an uncontrolled field to its default once a form action
// completes, and at that moment the default is still the old value. Keying
// each field on the value the server holds remounts it with the new default
// as soon as the page revalidates, so a saved change does not snap back.
export function OrganisationDetailsForm({ name, timezone, timezones }: { name: string; timezone: string; timezones: string[] }) {
  const [state, action, pending] = useActionState(updateOrganisation, initial);
  return (
    <form action={action} className="flex flex-col gap-5">
      <InputField key={name} label="Name" name="name" defaultValue={name} required error={state.fieldErrors?.name} />
      <SelectField
        key={timezone}
        label="Timezone"
        name="timezone"
        defaultValue={timezone}
        options={timezones.map((zone) => ({ value: zone, label: zone }))}
        helper="Every time shown to this organisation uses it."
        error={state.fieldErrors?.timezone}
      />
      <Outcome state={state} />
      <div>
        <Pill type="submit" size="sm" loading={pending} loadingLabel="Saving">
          Save
        </Pill>
      </div>
    </form>
  );
}

export function InviteForm({ canInviteOwner }: { canInviteOwner: boolean }) {
  const [state, action, pending] = useActionState(inviteMember, initial);
  const roles = [
    { value: "member", label: "Member" },
    { value: "admin", label: "Admin" },
    ...(canInviteOwner ? [{ value: "owner", label: "Owner" }] : []),
  ];
  return (
    <form action={action} className="flex flex-col gap-5">
      <InputField label="Email" name="email" type="email" required error={state.fieldErrors?.email} />
      <SelectField label="Role" name="role" defaultValue="member" options={roles} error={state.fieldErrors?.role} />
      <Outcome state={state} />
      <div>
        <Pill type="submit" size="sm" loading={pending} loadingLabel="Sending">
          Send invitation
        </Pill>
      </div>
    </form>
  );
}

export function CreateOrganisationForm({ timezone, timezones }: { timezone: string; timezones: string[] }) {
  const [state, action, pending] = useActionState(createOrganisation, initial);
  return (
    <form action={action} className="flex flex-col gap-5">
      <InputField label="Name" name="name" required autoFocus on="page" error={state.fieldErrors?.name} />
      <SelectField
        label="Timezone"
        name="timezone"
        on="page"
        defaultValue={timezone}
        options={timezones.map((zone) => ({ value: zone, label: zone }))}
        helper="Every time shown to this organisation uses it. You can change it later."
        error={state.fieldErrors?.timezone}
      />
      <Outcome state={state} />
      <div className="flex flex-wrap gap-3">
        <Pill type="submit" loading={pending} loadingLabel="Creating">
          Create organisation
        </Pill>
      </div>
    </form>
  );
}
