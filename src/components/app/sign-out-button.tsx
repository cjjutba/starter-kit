"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Pill } from "@/components/primitives/pill";
import { authClient } from "@/lib/auth/client";

export function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function signOut() {
    setPending(true);
    await authClient.signOut();
    router.push("/sign-in");
    router.refresh();
  }

  return (
    <Pill variant="secondary" size="xs" onClick={signOut} loading={pending} loadingLabel="Signing out">
      Sign out
    </Pill>
  );
}
