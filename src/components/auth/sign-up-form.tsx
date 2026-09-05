"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { InputField } from "@/components/primitives/field";
import { Pill } from "@/components/primitives/pill";
import { authClient } from "@/lib/auth/client";

export function SignUpForm({ next }: { next: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    const result = await authClient.signUp.email({
      name: String(form.get("name") ?? "").trim(),
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
    });
    if (result.error) {
      setError(result.error.message ?? "That did not work. Check the details and try again.");
      setPending(false);
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <InputField label="Name" name="name" autoComplete="name" required />
      <InputField label="Email" name="email" type="email" autoComplete="email" required />
      <InputField
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        minLength={10}
        required
        helper="At least 10 characters."
        error={error ?? undefined}
      />
      <Pill type="submit" block loading={pending} loadingLabel="Creating your account">
        Create account
      </Pill>
      <p className="text-small text-text-2">
        Already have one?{" "}
        <Link href={`/sign-in?next=${encodeURIComponent(next)}`} className="font-medium text-text">
          Sign in
        </Link>
      </p>
    </form>
  );
}
