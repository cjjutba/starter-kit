// A field people never see and bots fill in. The form renders it hidden,
// the action rejects anything that arrives with a value.

export const HONEYPOT_FIELD = "website";

export function isBot(formData: FormData): boolean {
  const value = formData.get(HONEYPOT_FIELD);
  return typeof value === "string" && value.trim().length > 0;
}
