"use client";

import { useEffect } from "react";
import { Pill } from "@/components/primitives/pill";
import { Sheet } from "@/components/primitives/surfaces";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-auth flex-col justify-center px-gutter py-12">
      <Sheet className="space-y-4 p-6">
        <h1 className="text-heading font-medium">Something went wrong</h1>
        <p className="text-body text-text-2">The page hit an error it could not recover from.</p>
        {error.digest ? <p className="text-label text-text-3 tabular">Reference {error.digest}</p> : null}
        <Pill onClick={reset}>Try again</Pill>
      </Sheet>
    </main>
  );
}
