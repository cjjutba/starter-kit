import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { AcceptInvitation } from "@/components/auth/accept-invitation";
import { AuthShell } from "@/components/auth/auth-shell";
import { Pill } from "@/components/primitives/pill";
import { auth } from "@/lib/auth/server";
import { getSession } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Invitation" };

// The landing page for the link in an invitation mail. A stranger is asked to
// sign in or sign up and comes back here. A signed in person whose email
// matches sees the organisation and one button.

export default async function InvitePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  const here = `/invite/${id}`;

  if (!session) {
    return (
      <AuthShell title="You have an invitation" lead="Sign in with the address it was sent to, or create an account with that address, and it opens here.">
        <div className="flex flex-wrap gap-3">
          <Pill asChild>
            <Link href={`/sign-in?next=${encodeURIComponent(here)}`}>Sign in</Link>
          </Pill>
          <Pill asChild variant="secondary">
            <Link href={`/sign-up?next=${encodeURIComponent(here)}`}>Create an account</Link>
          </Pill>
        </div>
      </AuthShell>
    );
  }

  const invitation = await auth.api
    .getInvitation({ query: { id }, headers: await headers() })
    .catch(() => null);

  if (!invitation || invitation.status !== "pending") {
    return (
      <AuthShell title="This invitation is not open" lead="It may have expired, been withdrawn, or been sent to a different email address than the one you signed in with.">
        <Pill asChild variant="secondary">
          <Link href="/app">Go to the app</Link>
        </Pill>
      </AuthShell>
    );
  }

  return (
    <AuthShell title={`Join ${invitation.organizationName}`} lead={`${invitation.inviterEmail} invited you as ${invitation.role}.`}>
      <AcceptInvitation invitationId={invitation.id} organisationId={invitation.organizationId} />
    </AuthShell>
  );
}
