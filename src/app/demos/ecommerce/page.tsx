import type { Metadata } from "next";
import { DemosVertical } from "@/components/DemosVertical";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Demos de tiendas online",
  description: "Tres tiendas online de ejemplo con carrito funcionando: ropa urbana, cosmética natural y electrónica.",
  alternates: { canonical: "/demos/ecommerce" },
  // Esta pantalla sí se indexa; las demos individuales siguen con noindex (app/demos/layout.tsx).
  robots: { index: true, follow: true },
};

export default function DemosEcommercePage() {
  return (
    <SiteShell>
      <DemosVertical vertical="ecommerce" />
    </SiteShell>
  );
}
