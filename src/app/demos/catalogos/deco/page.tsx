import { DemoBar } from "@/components/demos/DemoBar";
import { NidoApp } from "@/demos/catalogos/deco/NidoApp";
import { IcCamion, IcChat, IcLista, IcTaller } from "@/demos/catalogos/deco/ui";

const serif = "[font-family:var(--font-nido-serif)]";

// Se pasa como objeto para que funcione con cualquier versión de la barra de demo.
const barra = {
  estilo: "Deco",
  mensaje: "Hola Fran, vi la demo Deco de catálogos y quiero algo así para mi negocio.",
  otrosHref: "/demos/catalogos",
  pregunta: "¿Querés uno así?",
};

const pasos = [
  { icono: IcLista, titulo: "Armá tu lista", texto: "Elegí piezas, terminaciones y cantidades. Sumá notas con medidas o dudas." },
  { icono: IcChat, titulo: "Consultá por WhatsApp", texto: "Te llega un mensaje ordenado y te respondemos con precio final y plazos." },
  { icono: IcTaller, titulo: "Lo hacemos en el taller", texto: "Fabricamos en Córdoba con madera estacionada y te avisamos cada avance." },
  { icono: IcCamion, titulo: "Te lo llevamos", texto: "Entrega y armado en Córdoba. Al resto del país, por transporte de confianza." },
];

export default function DecoDemo() {
  return (
    <div className="min-h-dvh bg-[#F4EFE7] pb-32 text-[#221C17] antialiased [font-family:var(--font-nido-sans)]">
      <NidoApp />

      <section id="taller" className="mx-auto mt-28 max-w-[1240px] scroll-mt-24 px-4 sm:mt-40 sm:px-8" aria-labelledby="nido-taller">
        <div className="rounded-[24px] bg-[#2F4538] px-6 py-12 text-[#F4EFE7] sm:px-12 sm:py-16">
          <div className="grid gap-8 md:grid-cols-[1fr_1.4fr] md:items-end">
            <h2 id="nido-taller" className={`${serif} text-[44px] leading-[0.95] sm:text-[64px]`}>
              Del taller <em className="text-[#E3B79B]">a tu casa.</em>
            </h2>
            <p className="max-w-lg text-[15px] leading-relaxed text-[#D9D2C3]">
              Somos un equipo chico de carpinteros y tapiceros. Cada pieza sale firmada y con garantía de cinco años en estructura.
            </p>
          </div>
          <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {pasos.map((p, i) => (
              <li key={p.titulo} className="border-t border-[#F4EFE7]/20 pt-5">
                <div className="flex items-center justify-between">
                  <p.icono className="size-6 text-[#E3B79B]" />
                  <span className="text-[12px] tracking-[0.2em] text-[#F4EFE7]/50">0{i + 1}</span>
                </div>
                <h3 className={`${serif} mt-4 text-[26px] leading-tight`}>{p.titulo}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[#D9D2C3]">{p.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <footer className="mx-auto mt-24 max-w-[1240px] px-4 sm:px-8">
        <div className="grid gap-8 border-t border-[#DCD2C3] pt-10 text-[14px] text-[#4A4039] sm:grid-cols-3">
          <div>
            <p className={`${serif} text-[36px] leading-none text-[#221C17]`}>Nido</p>
            <p className="mt-2 text-[13px] tracking-[0.2em] text-[#6E6258] uppercase">muebles y objetos</p>
          </div>
          <div>
            <p className="font-semibold text-[#221C17]">Showroom</p>
            <p className="mt-1">Barrio Güemes, Córdoba</p>
            <p>Martes a sábados de 10 a 19 h</p>
          </div>
          <div>
            <p className="font-semibold text-[#221C17]">Consultas</p>
            <p className="mt-1">Por WhatsApp desde tu lista, con respuesta en el día.</p>
          </div>
        </div>
        <p className="mt-10 border-t border-[#DCD2C3] py-6 text-[12px] text-[#6E6258]">
          Demo con contenido ficticio. Nido, sus productos y precios no existen.
        </p>
      </footer>

      <DemoBar {...barra} />
    </div>
  );
}
