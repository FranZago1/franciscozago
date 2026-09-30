import { DemoBar } from "@/components/demos/DemoBar";
import { CotizadorApp } from "@/demos/web-apps/cotizador/CotizadorApp";

export default function CotizadorDemo() {
  return (
    <main className="min-h-dvh bg-[#D9D7D1] pb-28 print:bg-white print:pb-0">
      <CotizadorApp />
      <DemoBar
        minimizada
        estilo="Cotizador"
        mensaje="Hola Fran, vi la demo Cotizador y quiero algo así para mi negocio."
        otrosHref="/demos/web-apps"
        pregunta="¿Querés uno así?"
      />
    </main>
  );
}
