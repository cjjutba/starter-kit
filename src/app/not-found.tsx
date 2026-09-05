import Link from "next/link";
import { Pill } from "@/components/primitives/pill";
import { Sheet } from "@/components/primitives/surfaces";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col justify-center px-5 py-12">
      <Sheet className="space-y-4 p-6">
        <h1 className="text-heading font-medium">There is nothing here</h1>
        <p className="text-body text-text-2">The address may be mistyped, or the page moved.</p>
        <Pill asChild variant="secondary">
          <Link href="/">Go to the start</Link>
        </Pill>
      </Sheet>
    </main>
  );
}
