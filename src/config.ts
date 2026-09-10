// The values that change per product, in one place. Setup rewrites the
// first block. The rest are defaults a project changes on purpose.

function vercelOrigin(): string | undefined {
  const host = process.env.VERCEL_BRANCH_URL ?? process.env.VERCEL_URL;
  return host ? `https://${host}` : undefined;
}

export const product = {
  name: "Starter Kit",
  slug: "starter-kit-web",
  oneLine: "A product started from starter-kit-web.",
  // The canonical origin. Used for metadata and absolute links in mail.
  // Production sets NEXT_PUBLIC_APP_URL. A preview leaves it unset and takes
  // the address Vercel gives the branch, so a link in a preview's mail opens
  // the preview. Read on the server; a client component sees localhost.
  url: process.env.NEXT_PUBLIC_APP_URL ?? vercelOrigin() ?? "http://localhost:3000",
  // Where deletion requests are mailed and the address the privacy page
  // shows. Unset until there is one worth publishing: the page then points
  // at the form and requests are only recorded, never mailed to a placeholder.
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || undefined,
} as const;

export const locale = {
  lang: "en-PH",
  // The organisation row carries its own timezone. This is only the value a
  // new organisation starts with.
  defaultTimezone: "Asia/Manila",
} as const;

export const theme = {
  // The browser chrome colour cannot read a CSS variable, so these hex values
  // live here rather than in a component. light and dark are --page in each
  // scheme, ink is light --text and draws the Open Graph image, which cannot
  // read CSS either. tests/rules/theme.test.ts fails when they drift from
  // globals.css or the manifest.
  light: "#f5f5f7",
  dark: "#0a0a0a",
  ink: "#0a0a0a",
} as const;

export const features = {
  // Every project has organisations in the schema. This decides whether
  // people can create more than their personal one. The switcher shows
  // whenever a person belongs to more than one, whatever this says, because
  // an invitation can put them in two. Single tenant products set it false.
  multipleOrganisations: true,
  // True: anyone can create an account and gets a personal organisation.
  // False: after the first account, sign up needs a pending invitation for
  // the address. A client's internal tool sets this to false on day one.
  openSignUp: true,
} as const;
