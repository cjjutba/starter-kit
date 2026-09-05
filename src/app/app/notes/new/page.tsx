import type { Metadata } from "next";
import { NoteForm } from "@/components/app/note-form";

export const metadata: Metadata = { title: "New note" };

export default function NewNotePage() {
  return (
    <div className="mx-auto w-full max-w-[480px]">
      <h1 className="text-title font-medium">New note</h1>
      <div className="mt-6">
        <NoteForm />
      </div>
    </div>
  );
}
