import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NoteForm } from "@/components/app/note-form";
import { requireOrganisation } from "@/lib/auth/session";
import { forOrganisation } from "@/lib/db/scoped";

export const metadata: Metadata = { title: "Edit note" };

// A note from another organisation is not found rather than forbidden,
// because the scoped layer cannot see it in the first place.

export default async function EditNotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { organisationId } = await requireOrganisation();
  const note = await forOrganisation(organisationId).notes.get(id);
  if (!note) notFound();

  return (
    <div className="mx-auto w-full max-w-auth">
      <h1 className="text-title font-medium">Edit note</h1>
      <div className="mt-6">
        <NoteForm note={{ id: note.id, title: note.title, body: note.body, updatedAt: note.updatedAt.toISOString() }} />
      </div>
    </div>
  );
}
