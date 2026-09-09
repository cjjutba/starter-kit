import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignInForm } from "@/components/auth/sign-in-form";
import { getSession } from "@/lib/auth/session";
import { safeNext } from "@/lib/safe-next";

export const metadata: Metadata = { title: "Sign in" };

// Also where a verification link lands. A good one arrives with a session
// and goes straight on to next. A bad one arrives with ?error= and is told.

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const params = await searchParams;
  const next = safeNext(params.next);
  if (await getSession()) redirect(next);
  const lead = params.error
    ? "That verification link has expired or was already used. Sign in and a fresh one is sent."
    : undefined;
  return (
    <AuthShell title="Sign in" lead={lead}>
      <SignInForm next={next} />
    </AuthShell>
  );
}
