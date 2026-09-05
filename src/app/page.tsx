import Link from "next/link";
import { Pill } from "@/components/primitives/pill";
import { Card } from "@/components/primitives/surfaces";
import { ThemeToggle } from "@/components/theme-toggle";
import { product } from "@/config";

// The placeholder home. It exists so the template renders a real page from
// the first clone. Replace it once docs/product/brief.md says what the
// product is and who it is for.

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[640px] flex-col justify-center gap-8 px-5 py-12">
      <header className="flex items-center justify-between">
        <span className="text-heading font-medium">{product.name}</span>
        <ThemeToggle />
      </header>
      <div className="space-y-3">
        <h1 className="text-title font-medium">{product.oneLine}</h1>
        <p className="text-body text-text-2">
          This is the placeholder home page. It stays until the brief says what goes here.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Pill asChild>
          <Link href="/sign-in">Sign in</Link>
        </Pill>
        <Pill asChild variant="secondary">
          <Link href="/design">Design sheet</Link>
        </Pill>
      </div>
      <Card tone="tint" className="p-5">
        <p className="text-small text-text-2">
          Started from starter-kit. In Claude Code, run /setup to name the product and wire the
          services, then /plan to write the brief.
        </p>
      </Card>
    </main>
  );
}
