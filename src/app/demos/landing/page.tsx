import type { Metadata } from "next";
import { DemosVertical } from "@/components/DemosVertical";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Demos de landing pages",
  description: "Tres landing pages de ejemplo: una deportiva, una de bienestar y una de producto digital.",
  alternates: { canonical: "/demos/landing" },
  // Esta pantalla sí se indexa; las demos individuales siguen con noindex (app/demos/layout.tsx).
  robots: { index: true, follow: true },
};

export default function DemosLandingPage() {
  return (
    <SiteShell>
      <DemosVertical vertical="landing" />
    </SiteShell>
  );
}
