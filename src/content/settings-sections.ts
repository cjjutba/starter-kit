import { Building2, Users, type LucideIcon } from "lucide-react";

// What an organisation sets up. They are pages, not tabs, and this list is
// what the sidebar's Settings group expands into, so the sections are named
// once. A product adds its own rows here and a page under src/app/app/settings
// for each.

export type SettingsSection = {
  segment: string;
  label: string;
  icon: LucideIcon;
  lead: string;
};

export const settingsSections: SettingsSection[] = [
  { segment: "", label: "Organisation", icon: Building2, lead: "The name, and the timezone every time is shown in." },
  { segment: "people", label: "People", icon: Users, lead: "Who belongs here, what each can do, and who is invited." },
];
