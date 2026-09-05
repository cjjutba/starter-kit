"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireOrganisation } from "@/lib/auth/session";
import { forOrganisation } from "@/lib/db/scoped";

// The pattern for every mutation: require the organisation, validate, then
// call the scoped layer. The action never sees a database handle.

export interface NoteFormState {
  error?: string;
  fieldErrors?: { title?: string; body?: string };
}

const noteSchema = z.object({
  title: z.string().trim().min(1, "Give the note a title.").max(120, "Keep the title under 120 characters."),
  body: z.string().max(10000, "Keep the note under 10000 characters.").default(""),
});

export async function createNote(_previous: NoteFormState, formData: FormData): Promise<NoteFormState> {
  const { session, organisationId } = await requireOrganisation();
  const parsed = noteSchema.safeParse({
    title: formData.get("title"),
    body: formData.get("body") ?? "",
  });
  if (!parsed.success) {
    const flat = z.flattenError(parsed.error).fieldErrors;
    return { fieldErrors: { title: flat.title?.[0], body: flat.body?.[0] } };
  }
  await forOrganisation(organisationId).notes.create({ ...parsed.data, authorId: session.user.id });
  revalidatePath("/app");
  redirect("/app");
}

export async function deleteNote(formData: FormData) {
  const { organisationId } = await requireOrganisation();
  const id = String(formData.get("id") ?? "");
  if (id) await forOrganisation(organisationId).notes.remove(id);
  revalidatePath("/app");
}
