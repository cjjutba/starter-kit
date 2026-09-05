"use client";

import Link from "next/link";
import { useActionState } from "react";
import { InputField, TextareaField } from "@/components/primitives/field";
import { Pill } from "@/components/primitives/pill";
import { createNote, type NoteFormState } from "@/app/app/notes/actions";

const initial: NoteFormState = {};

export function NoteForm() {
  const [state, action, pending] = useActionState(createNote, initial);
  return (
    <form action={action} className="flex flex-col gap-5">
      <InputField label="Title" name="title" required autoFocus on="page" error={state.fieldErrors?.title} />
      <TextareaField label="Note" name="body" hint="Optional" on="page" rows={8} error={state.fieldErrors?.body} />
      {state.error ? (
        <p role="alert" className="text-small text-error">
          {state.error}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-3">
        <Pill type="submit" loading={pending} loadingLabel="Saving">
          Save note
        </Pill>
        <Pill asChild variant="text">
          <Link href="/app">Cancel</Link>
        </Pill>
      </div>
    </form>
  );
}
