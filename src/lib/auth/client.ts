import { createAuthClient } from "better-auth/react";
import { organizationClient } from "better-auth/client/plugins";

// The browser side. Sign in, sign up, reset and organisation calls from
// client components go through this.

export const authClient = createAuthClient({
  plugins: [organizationClient()],
});
