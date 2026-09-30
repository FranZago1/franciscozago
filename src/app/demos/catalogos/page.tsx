import type { Metadata } from "next";
import { DemosVertical } from "@/components/DemosVertical";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Demos de catálogos online",
  description: "Tres catálogos de ejemplo con pedido por WhatsApp: deco, mayorista y vinoteca.",
  alternates: { canonical: "/demos/catalogos" },
  // Esta pantalla sí se indexa; las demos individuales siguen con noindex (app/demos/layout.tsx).
  robots: { index: true, follow: true },
};

export default function DemosCatalogosPage() {
  return (
    <SiteShell>
      <DemosVertical vertical="catalogos" />
    </SiteShell>
  );
}
