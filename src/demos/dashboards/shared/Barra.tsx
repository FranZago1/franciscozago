import { DemoBar } from "@/components/demos/DemoBar";

/** Barra de demo con los textos de la vertical de dashboards. */
export function BarraDashboards({ estilo, nombre }: { estilo: string; nombre: string }) {
  return (
    <DemoBar
        minimizada
      estilo={estilo}
      mensaje={`Hola Fran, vi la demo ${nombre} y quiero algo así para mi negocio.`}
      otrosHref="/demos/dashboards"
      pregunta="¿Querés uno así?"
    />
  );
}
