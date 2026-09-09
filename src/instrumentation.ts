import * as Sentry from "@sentry/nextjs";

// Next calls register() once per runtime at start, and onRequestError for
// every error a request hits, server components and actions included.

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("../sentry.edge.config");
  }
}

export const onRequestError = Sentry.captureRequestError;
