import type { Metadata } from "next";
import { DemosVertical } from "@/components/DemosVertical";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Demos de portfolios de fotografía",
  description: "Tres estilos de portfolio para fotógrafos: editorial, cinemático y documental. Elegí uno y lo armamos con tus fotos.",
  alternates: { canonical: "/demos/fotografia" },
  // Esta pantalla sí se indexa; las demos individuales siguen con noindex (app/demos/layout.tsx).
  robots: { index: true, follow: true },
};

export default function DemosFotografiaPage() {
  return (
    <SiteShell>
      <DemosVertical vertical="fotografia" servicio="Portfolios" />
    </SiteShell>
  );
}
