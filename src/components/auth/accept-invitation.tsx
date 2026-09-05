"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Pill } from "@/components/primitives/pill";
import { authClient } from "@/lib/auth/client";

export function AcceptInvitation({ invitationId, organisationId }: { invitationId: string; organisationId: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function accept() {
    setPending(true);
    setError(null);
    const result = await authClient.organization.acceptInvitation({ invitationId });
    if (result.error) {
      setError(result.error.message ?? "This invitation could not be accepted.");
      setPending(false);
      return;
    }
    await authClient.organization.setActive({ organizationId: organisationId });
    router.push("/app");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-3">
      <Pill onClick={accept} loading={pending} loadingLabel="Joining">
        Accept and join
      </Pill>
      {error ? (
        <p role="alert" className="text-small text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
