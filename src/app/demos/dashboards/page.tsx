import type { Metadata } from "next";
import { DemosVertical } from "@/components/DemosVertical";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Demos de dashboards",
  description: "Tres tableros de ejemplo: ventas, ocupación y finanzas de una pyme.",
  alternates: { canonical: "/demos/dashboards" },
  // Esta pantalla sí se indexa; las demos individuales siguen con noindex (app/demos/layout.tsx).
  robots: { index: true, follow: true },
};

export default function DemosDashboardsPage() {
  return (
    <SiteShell>
      <DemosVertical vertical="dashboards" />
    </SiteShell>
  );
}
