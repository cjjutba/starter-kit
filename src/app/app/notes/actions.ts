"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireOrganisation } from "@/lib/auth/session";
import { forOrganisation } from "@/lib/db/scoped";

// The pattern for every mutation: require the organisation, validate, then
// call the scoped layer. The action never sees a database handle. Edit
// carries the timestamp the form opened with, and a save that finds a
// newer row says so instead of overwriting it.

export interface NoteFormState {
  error?: string;
  fieldErrors?: { title?: string; body?: string };
}

const noteSchema = z.object({
  title: z.string().trim().min(1, "Give the note a title.").max(120, "Keep the title under 120 characters."),
  body: z.string().max(10000, "Keep the note under 10000 characters.").default(""),
});

function parse(formData: FormData) {
  const parsed = noteSchema.safeParse({ title: formData.get("title"), body: formData.get("body") ?? "" });
  if (parsed.success) return { data: parsed.data };
  const flat = z.flattenError(parsed.error).fieldErrors;
  return { fieldErrors: { title: flat.title?.[0], body: flat.body?.[0] } };
}

export async function createNote(_previous: NoteFormState, formData: FormData): Promise<NoteFormState> {
  const { session, organisationId } = await requireOrganisation();
  const parsed = parse(formData);
  if (!parsed.data) return { fieldErrors: parsed.fieldErrors };
  await forOrganisation(organisationId).notes.create({ ...parsed.data, authorId: session.user.id });
  revalidatePath("/app");
  redirect("/app");
}

export async function updateNote(_previous: NoteFormState, formData: FormData): Promise<NoteFormState> {
  const { organisationId } = await requireOrganisation();
  const id = String(formData.get("id") ?? "");
  const openedAt = new Date(String(formData.get("updatedAt") ?? ""));
  if (!id || Number.isNaN(openedAt.getTime())) return { error: "Reload the page and try again." };
  const parsed = parse(formData);
  if (!parsed.data) return { fieldErrors: parsed.fieldErrors };

  const scoped = forOrganisation(organisationId);
  const saved = await scoped.notes.update(id, parsed.data, openedAt);
  if (!saved) {
    const current = await scoped.notes.get(id);
    return {
      error: current
        ? "This note changed while you were editing. Reload to see the latest, then make your change again."
        : "This note no longer exists.",
    };
  }
  revalidatePath("/app");
  redirect("/app");
}

export async function deleteNote(id: string): Promise<{ error?: string }> {
  const { organisationId } = await requireOrganisation();
  const removed = await forOrganisation(organisationId).notes.remove(id);
  if (!removed) return { error: "The note was already deleted by someone else." };
  revalidatePath("/app");
  return {};
}
