import { DemoBar } from "@/components/demos/DemoBar";
import { TableroApp } from "@/demos/web-apps/tablero/TableroApp";

export default function TableroDemo() {
  return (
    <main className="min-h-dvh bg-[#F6F6F7] pb-28 sm:pb-24">
      <TableroApp />
      <DemoBar
        minimizada
        estilo="Tablero"
        mensaje="Hola Fran, vi la demo Tablero y quiero algo así para mi negocio."
        otrosHref="/demos/web-apps"
        pregunta="¿Querés uno así?"
      />
    </main>
  );
}
