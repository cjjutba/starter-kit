import * as Sentry from "@sentry/nextjs";

// The same as the server config, for anything Next runs on its edge
// runtime. The proxy runs on Node here, so this is rarely loaded.

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn,
  enabled: Boolean(dsn),
  environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
  tracesSampleRate: 0,
  sendDefaultPii: false,
});
