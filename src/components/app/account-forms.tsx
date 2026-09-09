"use client";

import { useActionState } from "react";
import { Outcome } from "@/components/forms/outcome";
import { InputField } from "@/components/primitives/field";
import { Pill } from "@/components/primitives/pill";
import { changeEmail, changePassword, updateName, type AccountFormState } from "@/app/app/account/actions";

const initial: AccountFormState = {};

export function NameForm({ name }: { name: string }) {
  const [state, action, pending] = useActionState(updateName, initial);
  return (
    <form action={action} className="flex flex-col gap-5">
      <InputField label="Name" name="name" autoComplete="name" defaultValue={name} required error={state.fieldErrors?.name} />
      <Outcome state={state} />
      <div>
        <Pill type="submit" size="sm" loading={pending} loadingLabel="Saving">
          Save
        </Pill>
      </div>
    </form>
  );
}

export function EmailForm({ email }: { email: string }) {
  const [state, action, pending] = useActionState(changeEmail, initial);
  return (
    <form action={action} className="flex flex-col gap-5">
      <InputField
        label="New email"
        name="newEmail"
        type="email"
        autoComplete="email"
        required
        helper={`Currently ${email}. The change is approved from there and confirmed from the new address.`}
        error={state.fieldErrors?.newEmail}
      />
      <Outcome state={state} />
      <div>
        <Pill type="submit" size="sm" loading={pending} loadingLabel="Sending">
          Change email
        </Pill>
      </div>
    </form>
  );
}

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePassword, initial);
  return (
    <form action={action} className="flex flex-col gap-5">
      <InputField
        label="Current password"
        name="currentPassword"
        type="password"
        autoComplete="current-password"
        required
        error={state.fieldErrors?.currentPassword}
      />
      <InputField
        label="New password"
        name="newPassword"
        type="password"
        autoComplete="new-password"
        minLength={10}
        required
        helper="At least 10 characters. Every other session is signed out."
        error={state.fieldErrors?.newPassword}
      />
      <Outcome state={state} />
      <div>
        <Pill type="submit" size="sm" loading={pending} loadingLabel="Changing">
          Change password
        </Pill>
      </div>
    </form>
  );
}
