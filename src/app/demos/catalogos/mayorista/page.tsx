import { DemoBar } from "@/components/demos/DemoBar";
import { Ruta9App } from "@/demos/catalogos/mayorista/Ruta9App";

// Se pasa como objeto para que funcione con cualquier versión de la barra de demo.
const barra = {
  estilo: "Mayorista",
  mensaje: "Hola Fran, vi la demo Mayorista de catálogos y quiero algo así para mi negocio.",
  otrosHref: "/demos/catalogos",
  pregunta: "¿Querés uno así?",
};

const datos = [
  ["Cómo pedir", "Buscá por código o descripción, cargá los bultos y mandá el pedido por WhatsApp. Te confirmamos stock en el día."],
  ["Entregas", "Martes y viernes en Córdoba capital y Gran Córdoba. Pedidos confirmados hasta las 12 h del día anterior."],
  ["Pagos", "Transferencia, cheque a 30 días para clientes con cuenta corriente o efectivo contra entrega."],
] as const;

export default function MayoristaDemo() {
  return (
    <div className="min-h-dvh bg-[#EEF1F5] pb-32 text-[#0F1B2D] antialiased font-[family-name:var(--font-r9-sans)]">
      <Ruta9App />
      <footer className="mx-auto mt-12 max-w-[1600px] px-4 sm:px-6">
        <div className="grid gap-4 rounded-lg border border-[#D8DEE7] bg-white p-5 sm:grid-cols-3 sm:p-6">
          {datos.map(([t, d]) => (
            <div key={t}>
              <h2 className="text-[13px] font-bold tracking-[0.06em] text-[#1747A6] uppercase">{t}</h2>
              <p className="mt-1 text-[14px] leading-relaxed text-[#27344A]">{d}</p>
            </div>
          ))}
        </div>
        <p className="py-6 text-[12.5px] text-[#5B6778]">
          Demo con contenido ficticio. Distribuidora Ruta 9, sus marcas, códigos y precios no existen.
        </p>
      </footer>
      <DemoBar {...barra} />
    </div>
  );
}
