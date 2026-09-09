"use client";

import Link from "next/link";
import { useActionState } from "react";
import { InputField, TextareaField } from "@/components/primitives/field";
import { Pill } from "@/components/primitives/pill";
import { createNote, updateNote, type NoteFormState } from "@/app/app/notes/actions";

const initial: NoteFormState = {};

export interface EditableNote {
  id: string;
  title: string;
  body: string;
  /** ISO. The version the form opened with, sent back so a newer save is not overwritten. */
  updatedAt: string;
}

export function NoteForm({ note }: { note?: EditableNote }) {
  const [state, action, pending] = useActionState(note ? updateNote : createNote, initial);
  return (
    <form action={action} className="flex flex-col gap-5">
      {note ? <input type="hidden" name="id" value={note.id} /> : null}
      {note ? <input type="hidden" name="updatedAt" value={note.updatedAt} /> : null}
      <InputField label="Title" name="title" defaultValue={note?.title} required autoFocus on="page" error={state.fieldErrors?.title} />
      <TextareaField label="Note" name="body" defaultValue={note?.body} hint="Optional" on="page" rows={8} error={state.fieldErrors?.body} />
      {state.error ? (
        <p role="alert" className="text-small text-error">
          {state.error}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-3">
        <Pill type="submit" loading={pending} loadingLabel="Saving">
          {note ? "Save changes" : "Save note"}
        </Pill>
        <Pill asChild variant="text">
          <Link href="/app">Cancel</Link>
        </Pill>
      </div>
    </form>
  );
}
