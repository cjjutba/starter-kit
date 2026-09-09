import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs/config";

// Headers the product should never ship without. A browser applies these on
// every response, which makes them the cheapest protection in the stack and
// the easiest to forget, because nothing breaks when they are missing.
//
// A full content security policy is deliberately not here. Next needs a nonce
// on every inline script for a strict one, and a policy written without that
// either breaks the app or is loose enough to be theatre. Add it with the
// nonce work when a product needs it, and record the decision.
const securityHeaders = [
  // Only reachable over https for two years, subdomains included. Vercel
  // terminates TLS, so this costs nothing and closes the first request gap.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // A response typed text/plain is never executed as a script.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // No framing, so a stolen session cannot be driven by a page over the top.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  // The full path leaks organisation and record ids to whatever a person
  // clicks through to. The origin is enough.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Nothing here needs a camera, a microphone or a location, so nothing gets
  // to ask. A product that needs one removes it from this list on purpose.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

// Sentry wraps the build to wire its instrumentation files in. Source maps
// upload only when a token is set, which is a CI secret a product adds when
// it wants readable stack traces. Without one the build is unchanged and
// quiet.
export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.CI,
  telemetry: false,
  sourcemaps: { disable: !process.env.SENTRY_AUTH_TOKEN },
});
