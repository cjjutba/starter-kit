"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { InputField } from "@/components/primitives/field";
import { Pill } from "@/components/primitives/pill";
import { Card } from "@/components/primitives/surfaces";
import { authClient } from "@/lib/auth/client";

// A wrong password is one line under the field. An unverified address is a
// refusal with a fresh link already sent, because Better Auth re-sends the
// verification mail on every sign in attempt by an unverified address and
// builds its link from the callback given here.

export function SignInForm({ next }: { next: string }) {
  const router = useRouter();
  const callbackURL = `/sign-in?next=${encodeURIComponent(next)}`;
  const [error, setError] = useState<string | null>(null);
  const [unverified, setUnverified] = useState<string | null>(null);
  const [resent, setResent] = useState(false);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const result = await authClient.signIn.email({
      email,
      password: String(form.get("password") ?? ""),
      callbackURL,
    });
    if (result.error) {
      setPending(false);
      if (result.error.status === 403) {
        setUnverified(email);
        return;
      }
      setError(result.error.message ?? "That email and password do not match.");
      return;
    }
    router.push(next);
    router.refresh();
  }

  async function resend() {
    if (!unverified) return;
    setPending(true);
    await authClient.sendVerificationEmail({ email: unverified, callbackURL });
    setPending(false);
    setResent(true);
  }

  if (unverified) {
    return (
      <Card tone="field" className="flex flex-col gap-4 p-5" role="status">
        <p className="text-heading font-medium">Verify your address first</p>
        <p className="text-body text-text-2">
          A fresh link is on its way to {unverified}. Open it and you are signed in. It stops working after an hour.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Pill variant="secondary" size="sm" onClick={resend} loading={pending} loadingLabel="Sending">
            Send it again
          </Pill>
          <Pill variant="text" size="sm" onClick={() => setUnverified(null)}>
            Back
          </Pill>
          {resent ? <span className="text-small text-text-2">Sent.</span> : null}
        </div>
      </Card>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <InputField label="Email" name="email" type="email" autoComplete="email" required />
      <InputField label="Password" name="password" type="password" autoComplete="current-password" required error={error ?? undefined} />
      <Pill type="submit" block loading={pending} loadingLabel="Signing in">
        Sign in
      </Pill>
      <div className="flex flex-wrap justify-between gap-3 text-small">
        <Link href="/reset" className="font-medium">
          Forgot password?
        </Link>
        <Link href={`/sign-up?next=${encodeURIComponent(next)}`} className="font-medium">
          Create an account
        </Link>
      </div>
    </form>
  );
}
