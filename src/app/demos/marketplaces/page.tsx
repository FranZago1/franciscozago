import type { Metadata } from "next";
import { DemosVertical } from "@/components/DemosVertical";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Demos de marketplaces",
  description: "Tres marketplaces de ejemplo: productores locales, profesionales de oficios y usados.",
  alternates: { canonical: "/demos/marketplaces" },
  // Esta pantalla sí se indexa; las demos individuales siguen con noindex (app/demos/layout.tsx).
  robots: { index: true, follow: true },
};

export default function DemosMarketplacesPage() {
  return (
    <SiteShell>
      <DemosVertical vertical="marketplaces" />
    </SiteShell>
  );
}
