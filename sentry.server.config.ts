import * as Sentry from "@sentry/nextjs";

// Error reports from the server, and nothing else: no traces, no profiles,
// no personal data. An empty DSN means the SDK stays off, which is every
// environment until a product sets one in Vercel.

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn,
  enabled: Boolean(dsn),
  environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
  tracesSampleRate: 0,
  sendDefaultPii: false,
});
