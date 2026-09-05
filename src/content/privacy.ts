import { product } from "@/config";

// A starting notice, written for a product that collects a name and an email
// address from people in the Philippines, where RA 10173 applies. It is not
// legal advice. Edit it before launch and keep `updated` honest.

export interface PrivacySection {
  heading: string;
  paragraphs: string[];
}

export const privacyNotice = {
  title: "Privacy notice",
  updated: "2026-09-06",
  intro: `${product.name} collects the minimum it needs to run and keeps it only as long as it is useful to you.`,
  sections: [
    {
      heading: "What is collected",
      paragraphs: [
        "Your name and email address when you create an account, and the password you choose, which is stored as a hash and never readable by anyone.",
        "Whatever you write inside the product. It belongs to the organisation you wrote it in.",
        "The address your requests come from, kept briefly to stop abuse of public forms.",
      ],
    },
    {
      heading: "How it is used",
      paragraphs: [
        "To sign you in, to show you your organisation's data, and to send the messages the product has to send, such as a password reset or an invitation. Nothing is used for advertising and nothing is sold.",
      ],
    },
    {
      heading: "How long it is kept",
      paragraphs: [
        "Account data stays until you delete your account or ask for it to be removed. Sent messages are logged for thirty days and then purged. Abuse counters last an hour.",
      ],
    },
    {
      heading: "Who can see it",
      paragraphs: [
        "The people in your organisation, according to their role. The team that runs the product, when needed to keep it running. Nobody else.",
      ],
    },
    {
      heading: "Your rights",
      paragraphs: [
        `Under the Data Privacy Act of 2012 you can ask what is held about you, ask for it to be corrected, or ask for it to be deleted. Use the deletion request form or write to ${product.contactEmail}. Requests are answered within fifteen working days.`,
      ],
    },
  ] satisfies PrivacySection[],
};
