import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { features } from "@/config";
import { getSession } from "@/lib/auth/session";
import { safeNext } from "@/lib/safe-next";

export const metadata: Metadata = { title: "Create an account" };

const leads = {
  open: "You get a personal space straight away. Invite people to it, or accept an invitation to theirs.",
  invited: "This product is by invitation. Use the address your invitation was sent to, and it opens here once you confirm it.",
};

export default async function SignUpPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const next = safeNext((await searchParams).next);
  if (await getSession()) redirect(next);
  return (
    <AuthShell title="Create an account" lead={features.openSignUp ? leads.open : leads.invited}>
      <SignUpForm next={next} />
    </AuthShell>
  );
}
