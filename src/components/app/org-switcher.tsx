"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth/client";
import { cn } from "@/lib/utils";

export interface OrganisationOption {
  id: string;
  name: string;
}

// A native select, because a switcher used twice a week does not need a
// custom menu. Hidden when there is only one organisation to choose from.

export function OrgSwitcher({ current, organisations }: { current: OrganisationOption; organisations: OrganisationOption[] }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  if (organisations.length < 2) {
    return <p className="truncate text-body font-medium">{current.name}</p>;
  }

  async function change(organizationId: string) {
    setPending(true);
    await authClient.organization.setActive({ organizationId });
    router.refresh();
    setPending(false);
  }

  return (
    <select
      aria-label="Organisation"
      value={current.id}
      disabled={pending}
      onChange={(event) => change(event.target.value)}
      className={cn(
        "h-10 w-full rounded-input bg-sheet px-3 text-small font-medium text-text",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-page",
        "disabled:opacity-60",
      )}
    >
      {organisations.map((organisation) => (
        <option key={organisation.id} value={organisation.id}>
          {organisation.name}
        </option>
      ))}
    </select>
  );
}
