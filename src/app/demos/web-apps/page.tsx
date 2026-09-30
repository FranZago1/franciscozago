import type { Metadata } from "next";
import { DemosVertical } from "@/components/DemosVertical";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Demos de web apps",
  description: "Tres herramientas web de ejemplo que se pueden usar: tablero de tareas, cotizador y asistente con IA.",
  alternates: { canonical: "/demos/web-apps" },
  // Esta pantalla sí se indexa; las demos individuales siguen con noindex (app/demos/layout.tsx).
  robots: { index: true, follow: true },
};

export default function DemosWebAppsPage() {
  return (
    <SiteShell>
      <DemosVertical vertical="web-apps" />
    </SiteShell>
  );
}
