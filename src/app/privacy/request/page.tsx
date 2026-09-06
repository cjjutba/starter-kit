import type { Metadata } from "next";
import Link from "next/link";
import { DeletionRequestForm } from "@/components/forms/deletion-request-form";
import { product } from "@/config";

export const metadata: Metadata = { title: "Deletion request" };

export default function DeletionRequestPage() {
  return (
    <main className="mx-auto w-full max-w-auth px-gutter py-12">
      <Link href="/privacy" className="text-small font-medium">
        {product.name} privacy
      </Link>
      <h1 className="mt-6 text-title font-medium">Ask for your data to be deleted</h1>
      <p className="mt-2 text-body text-text-2">
        Tell us the email address on the account. Deletion is confirmed by email and finished within fifteen working days.
      </p>
      <div className="mt-8">
        <DeletionRequestForm />
      </div>
    </main>
  );
}
