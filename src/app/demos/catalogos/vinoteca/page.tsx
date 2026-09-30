import { DemoBar } from "@/components/demos/DemoBar";
import { CavaApp } from "@/demos/catalogos/vinoteca/CavaApp";

const serif = "[font-family:var(--font-cava-serif)]";

// Se pasa como objeto para que funcione con cualquier versión de la barra de demo.
const barra = {
  estilo: "Vinoteca",
  mensaje: "Hola Fran, vi la demo Vinoteca de catálogos y quiero algo así para mi negocio.",
  otrosHref: "/demos/catalogos",
  pregunta: "¿Querés uno así?",
};

export default function VinotecaDemo() {
  return (
    <div className="min-h-dvh bg-[#0E0B0B] pb-32 text-[#EFE6D6] antialiased [font-family:var(--font-cava-sans)] font-light">
      <CavaApp />

      <section id="visita" className="mx-auto mt-24 max-w-[1320px] scroll-mt-24 px-4 sm:mt-32 sm:px-8" aria-labelledby="cava-visita">
        <div className="grid gap-10 border-t border-[#2A1F20] pt-12 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <p className="text-[11px] tracking-[0.42em] text-[#C9A55A] uppercase">Visitanos</p>
            <h2 id="cava-visita" className={`${serif} mt-3 text-[40px] leading-[1.02] sm:text-[52px]`}>
              Degustaciones <em className="text-[#E3C88A]">los jueves.</em>
            </h2>
          </div>
          <div className="text-[15px] leading-relaxed text-[#CFC3B3]">
            <p className="text-[12px] tracking-[0.2em] text-[#A8998A] uppercase">La cava</p>
            <p className="mt-2">Pasaje de los Toneles 140, Córdoba</p>
            <p>Martes a sábados de 11 a 21 h</p>
          </div>
          <div className="text-[15px] leading-relaxed text-[#CFC3B3]">
            <p className="text-[12px] tracking-[0.2em] text-[#A8998A] uppercase">Envíos</p>
            <p className="mt-2">Sin cargo en Córdoba capital desde 6 botellas. Al resto del país, en cajas protegidas.</p>
          </div>
        </div>
      </section>

      <footer className="mx-auto mt-20 max-w-[1320px] px-4 sm:px-8">
        <div className="flex flex-col gap-3 border-t border-[#2A1F20] py-8 text-[12.5px] text-[#7E7064] sm:flex-row sm:justify-between">
          <p>Beber con moderación. Prohibida la venta de bebidas alcohólicas a menores de 18 años.</p>
          <p>Demo con contenido ficticio. Cava Aldea, sus bodegas y precios no existen.</p>
        </div>
      </footer>

      <DemoBar {...barra} />
    </div>
  );
}
