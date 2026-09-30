import { DemoBar } from "@/components/demos/DemoBar";
import { AsistenteApp } from "@/demos/web-apps/asistente/AsistenteApp";

export default function AsistenteDemo() {
  return (
    <main className="min-h-dvh bg-[#0B1012] pb-28 sm:pb-24">
      <AsistenteApp />
      <DemoBar
        minimizada
        estilo="Asistente"
        mensaje="Hola Fran, vi la demo Asistente y quiero algo así para mi negocio."
        otrosHref="/demos/web-apps"
        pregunta="¿Querés uno así?"
      />
    </main>
  );
}
