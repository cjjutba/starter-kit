/** A redirect target from the query string, or the fallback when it is not a local path. */
export function safeNext(value: unknown, fallback = "/app"): string {
  if (typeof value !== "string") return fallback;
  if (!value.startsWith("/") || value.startsWith("//")) return fallback;
  return value;
}
