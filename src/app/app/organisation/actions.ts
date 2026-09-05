"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { auth } from "@/lib/auth/server";
import { requireOrganisation } from "@/lib/auth/session";

export interface OrganisationFormState {
  ok?: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string | undefined>;
}

const timezones = new Set(Intl.supportedValuesOf("timeZone"));

const detailsSchema = z.object({
  name: z.string().trim().min(1, "Give the organisation a name.").max(80, "Keep the name under 80 characters."),
  timezone: z.string().refine((value) => timezones.has(value), "Use an IANA name such as Asia/Manila."),
});

export async function updateOrganisation(_previous: OrganisationFormState, formData: FormData): Promise<OrganisationFormState> {
  const { organisationId } = await requireOrganisation();
  const parsed = detailsSchema.safeParse({ name: formData.get("name"), timezone: formData.get("timezone") });
  if (!parsed.success) {
    const flat = z.flattenError(parsed.error).fieldErrors;
    return { fieldErrors: { name: flat.name?.[0], timezone: flat.timezone?.[0] } };
  }
  try {
    await auth.api.updateOrganization({
      body: { organizationId: organisationId, data: parsed.data },
      headers: await headers(),
    });
  } catch (error) {
    return { error: error instanceof Error ? error.message : "The organisation could not be updated." };
  }
  revalidatePath("/app", "layout");
  return { ok: true, message: "Saved." };
}

const inviteSchema = z.object({
  email: z.email("Enter an email address."),
  role: z.enum(["member", "admin", "owner"]),
});

export async function inviteMember(_previous: OrganisationFormState, formData: FormData): Promise<OrganisationFormState> {
  const { organisationId } = await requireOrganisation();
  const parsed = inviteSchema.safeParse({ email: formData.get("email"), role: formData.get("role") ?? "member" });
  if (!parsed.success) {
    const flat = z.flattenError(parsed.error).fieldErrors;
    return { fieldErrors: { email: flat.email?.[0], role: flat.role?.[0] } };
  }
  try {
    await auth.api.createInvitation({
      body: { email: parsed.data.email, role: parsed.data.role, organizationId: organisationId, resend: true },
      headers: await headers(),
    });
  } catch (error) {
    return { error: error instanceof Error ? error.message : "The invitation could not be sent." };
  }
  revalidatePath("/app/organisation");
  return { ok: true, message: `Invitation sent to ${parsed.data.email}. With MAIL_PROVIDER=log it is in the mail log, not an inbox.` };
}
