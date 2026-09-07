"use client";

import { useActionState } from "react";
import { InputField } from "@/components/primitives/field";
import { Pill } from "@/components/primitives/pill";
import { controlClass } from "@/components/primitives/field";
import { inviteMember, updateOrganisation, type OrganisationFormState } from "@/app/app/organisation/actions";

const initial: OrganisationFormState = {};

function Outcome({ state }: { state: OrganisationFormState }) {
  if (state.error) {
    return (
      <p role="alert" className="text-small text-error">
        {state.error}
      </p>
    );
  }
  if (state.ok && state.message) {
    return (
      <p role="status" className="text-small text-text-2">
        {state.message}
      </p>
    );
  }
  return null;
}

export function OrganisationDetailsForm({ name, timezone }: { name: string; timezone: string }) {
  const [state, action, pending] = useActionState(updateOrganisation, initial);
  return (
    <form action={action} className="flex flex-col gap-5">
      <InputField label="Name" name="name" defaultValue={name} required error={state.fieldErrors?.name} />
      <InputField
        label="Timezone"
        name="timezone"
        defaultValue={timezone}
        required
        helper="An IANA name such as Asia/Manila. Every time shown to this organisation uses it."
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

export function InviteForm() {
  const [state, action, pending] = useActionState(inviteMember, initial);
  return (
    <form action={action} className="flex flex-col gap-5">
      <InputField label="Email" name="email" type="email" required error={state.fieldErrors?.email} />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="invite-role" className="text-label font-medium text-text">
          Role
        </label>
        <select id="invite-role" name="role" defaultValue="member" className={controlClass("sheet", false, "h-12")}>
          <option value="member">Member</option>
          <option value="admin">Admin</option>
          <option value="owner">Owner</option>
        </select>
      </div>
      <Outcome state={state} />
      <div>
        <Pill type="submit" size="sm" loading={pending} loadingLabel="Sending">
          Send invitation
        </Pill>
      </div>
    </form>
  );
}
