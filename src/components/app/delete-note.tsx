"use client";

import { useState } from "react";
import { ConfirmModal } from "@/components/primitives/modal";
import { Pill } from "@/components/primitives/pill";
import { deleteNote } from "@/app/app/notes/actions";

// Deleting asks. The modal holds while the server works and shows the
// reason when there is one, such as the note already being gone.

export function DeleteNote({ id, title }: { id: string; title: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Pill variant="danger" size="xs" onClick={() => setOpen(true)}>
        Delete
      </Pill>
      <ConfirmModal
        open={open}
        onOpenChange={setOpen}
        title={`Delete "${title}"?`}
        description="This cannot be undone."
        confirmLabel="Delete note"
        pendingLabel="Deleting"
        destructive
        onConfirm={async () => {
          const result = await deleteNote(id);
          return result.error;
        }}
      />
    </>
  );
}
