import type { Metadata } from "next";
import { DemosVertical } from "@/components/DemosVertical";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Demos de sistemas de gestión",
  description: "Tres sistemas de gestión de ejemplo: clientes, stock y pedidos de restaurante.",
  alternates: { canonical: "/demos/gestion" },
  // Esta pantalla sí se indexa; las demos individuales siguen con noindex (app/demos/layout.tsx).
  robots: { index: true, follow: true },
};

export default function DemosGestionPage() {
  return (
    <SiteShell>
      <DemosVertical vertical="gestion" />
    </SiteShell>
  );
}
