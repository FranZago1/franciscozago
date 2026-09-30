import type { Metadata } from "next";
import { DemosVertical } from "@/components/DemosVertical";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Demos de reservas online",
  description: "Tres sistemas de turnos de ejemplo: barbería, canchas de pádel y cabañas.",
  alternates: { canonical: "/demos/reservas" },
  // Esta pantalla sí se indexa; las demos individuales siguen con noindex (app/demos/layout.tsx).
  robots: { index: true, follow: true },
};

export default function DemosReservasPage() {
  return (
    <SiteShell>
      <DemosVertical vertical="reservas" />
    </SiteShell>
  );
}
