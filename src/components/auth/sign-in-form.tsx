"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { InputField } from "@/components/primitives/field";
import { Pill } from "@/components/primitives/pill";
import { authClient } from "@/lib/auth/client";

export function SignInForm({ next }: { next: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    const result = await authClient.signIn.email({
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
    });
    if (result.error) {
      setError(result.error.message ?? "That email and password do not match.");
      setPending(false);
      return;
    }
    router.push(next);
    router.refresh();
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
