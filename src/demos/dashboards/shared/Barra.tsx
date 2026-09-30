import type { ComponentType } from "react";
import { DemoBar } from "@/components/demos/DemoBar";

/**
 * Barra de demo con los textos de la vertical de dashboards.
 * `DemoBar` acepta `mensaje`, `otrosHref` y `pregunta` (ver docs/demos-brief.md); el tipo se declara
 * acá para que la demo compile también contra versiones anteriores del componente compartido.
 */
const Bar = DemoBar as unknown as ComponentType<{
  estilo: string;
  mensaje?: string;
  otrosHref?: string;
  pregunta?: string;
}>;

export function BarraDashboards({ estilo, nombre }: { estilo: string; nombre: string }) {
  return (
    <Bar
      estilo={estilo}
      mensaje={`Hola Fran, vi la demo ${nombre} y quiero algo así para mi negocio.`}
      otrosHref="/demos/dashboards"
      pregunta="¿Querés uno así?"
    />
  );
}
