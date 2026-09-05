// The values that change per product, in one place. Setup rewrites the
// first block. The rest are defaults a project changes on purpose.

export const product = {
  name: "Starter Kit",
  slug: "starter-kit",
  oneLine: "A product started from starter-kit.",
  // The canonical origin. Used for metadata and absolute links in mail.
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  // Where privacy and deletion requests go. Shown on the privacy page.
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "privacy@example.com",
} as const;

export const locale = {
  lang: "en-PH",
  // The organisation row carries its own timezone. This is only the value a
  // new organisation starts with.
  defaultTimezone: "Asia/Manila",
} as const;

export const theme = {
  // The browser chrome colour cannot read a CSS variable, so these two hex
  // values live here rather than in a component. Keep them equal to --page.
  light: "#f5f5f7",
  dark: "#0a0a0a",
} as const;

export const features = {
  // Every project has organisations in the schema. This only decides whether
  // people can see and switch between more than one. Single tenant products
  // set it to false and each person keeps their personal organisation.
  showOrganisationSwitcher: true,
} as const;
