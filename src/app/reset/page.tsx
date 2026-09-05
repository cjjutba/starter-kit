import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { ResetForm } from "@/components/auth/reset-form";

export const metadata: Metadata = { title: "Reset password" };

export default async function ResetPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const token = (await searchParams).token ?? null;
  return (
    <AuthShell
      title={token ? "Choose a new password" : "Reset your password"}
      lead={token ? undefined : "Enter the email address on the account and a link follows."}
    >
      <ResetForm token={token} />
    </AuthShell>
  );
}
