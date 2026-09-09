import { settingsSections } from "@/content/settings-sections";

// The title and lead of a settings page come from the same list the sidebar
// expands into, so a section is named once and reads the same in both places.

export function SettingsHeader({ segment, detail }: { segment: string; detail?: string }) {
  const section = settingsSections.find((item) => item.segment === segment) ?? settingsSections[0];
  return (
    <div>
      <h1 className="text-title font-medium">{section.label}</h1>
      <p className="mt-1 text-small text-text-2">{detail ?? section.lead}</p>
    </div>
  );
}
