import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { getSession } from "@/lib/auth/session";
import { safeNext } from "@/lib/safe-next";

export const metadata: Metadata = { title: "Create an account" };

export default async function SignUpPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const next = safeNext((await searchParams).next);
  if (await getSession()) redirect(next);
  return (
    <AuthShell title="Create an account" lead="You get a personal space straight away. Invite people to it, or accept an invitation to theirs.">
      <SignUpForm next={next} />
    </AuthShell>
  );
}
