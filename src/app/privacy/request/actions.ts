"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { clientIp, rateLimit } from "@/lib/guard/rate-limit";
import { isBot } from "@/lib/guard/honeypot";
import { send } from "@/lib/mail";
import { deletionRequestMail } from "@/lib/mail/templates";

// The public write path, and the pattern every other one follows: honeypot,
// rate limit, validate, then act. A bot gets a quiet success and nothing
// happens. A person over the limit is told when to try again.

export interface DeletionRequestState {
  ok: boolean;
  error?: string;
  fieldErrors?: { email?: string; message?: string };
}

const schema = z.object({
  email: z.email("Enter the email address you signed up with."),
  message: z.string().max(2000, "Keep the message under 2000 characters.").default(""),
});

export async function requestDeletion(_previous: DeletionRequestState, formData: FormData): Promise<DeletionRequestState> {
  if (isBot(formData)) return { ok: true };

  const limit = await rateLimit("deletion-request", clientIp(await headers()), 3, 60 * 60);
  if (!limit.allowed) {
    const minutes = Math.ceil(limit.retryAfterSeconds / 60);
    return { ok: false, error: `Too many requests from this address. Try again in ${minutes} minutes.` };
  }

  const parsed = schema.safeParse({
    email: formData.get("email"),
    message: formData.get("message") ?? "",
  });
  if (!parsed.success) {
    const flat = z.flattenError(parsed.error).fieldErrors;
    return { ok: false, fieldErrors: { email: flat.email?.[0], message: flat.message?.[0] } };
  }

  await send(deletionRequestMail(parsed.data));
  return { ok: true };
}
