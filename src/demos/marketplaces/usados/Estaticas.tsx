import { Icon, type IconName } from "../shared/Icon";
import { Logo, caja, display } from "./ui";

const pasos: { t: string; d: string; icon: IconName; color: string }[] = [
  { t: "Encontrá", d: "Filtrá por categoría, estado, precio y barrio. Guardá lo que te gusta con el corazón.", icon: "search", color: "#FFE14D" },
  { t: "Charlá y ofertá", d: "Preguntá lo que quieras por chat o mandá una oferta. El vendedor te responde ahí mismo.", icon: "chat", color: "#FF7AB6" },
  { t: "Coordiná y listo", d: "Se encuentran, lo revisás y pagás en mano. Después calificás al vendedor.", icon: "check", color: "#3DDC97" },
];

const consejos = [
  "Encontrate en lugares públicos y de día.",
  "Revisá el producto antes de pagar.",
  "Nunca transfieras por adelantado.",
  "Desconfiá de precios demasiado bajos.",
];

export function ComoFunciona() {
  return (
    <section aria-labelledby="como-titulo" className="bg-(--sv-fondo)">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <h2 id="como-titulo" className={`${display} max-w-3xl text-4xl font-extrabold leading-[0.95] tracking-[-0.035em] sm:text-6xl`}>
          Comprar usado, <span className="text-(--sv-violeta)">pero tranqui.</span>
        </h2>
        <ol className="mt-10 grid gap-5 md:grid-cols-3">
          {pasos.map((p, i) => (
            <li key={p.t} className={`relative rounded-3xl ${caja} bg-white p-6 ${i === 1 ? "md:translate-y-6" : ""}`}>
              <span className={`${display} absolute -top-5 right-5 text-6xl font-extrabold text-(--sv-negro)/10`} aria-hidden="true">
                0{i + 1}
              </span>
              <span className="grid size-14 place-items-center rounded-2xl border-[2.5px] border-(--sv-negro)" style={{ background: p.color }}>
                <Icon name={p.icon} size={26} stroke={2.4} />
              </span>
              <h3 className={`${display} mt-5 text-2xl font-extrabold tracking-[-0.02em]`}>{p.t}</h3>
              <p className="mt-2 font-medium leading-relaxed text-(--sv-gris)">{p.d}</p>
            </li>
          ))}
        </ol>
        <div className={`mt-16 grid gap-6 rounded-3xl ${caja} bg-(--sv-amarillo) p-6 sm:p-8 lg:grid-cols-[auto_1fr] lg:items-center`}>
          <span className="grid size-16 place-items-center rounded-full border-[2.5px] border-(--sv-negro) bg-white">
            <Icon name="shield" size={32} stroke={2.2} />
          </span>
          <div>
            <p className={`${display} text-2xl font-extrabold tracking-[-0.02em]`}>Cuatro reglas de oro</p>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {consejos.map((c) => (
                <li key={c} className="flex items-start gap-2 font-semibold">
                  <Icon name="check" size={18} stroke={3} className="mt-0.5 shrink-0" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Pie() {
  return (
    <footer className="border-t-[2.5px] border-(--sv-negro) bg-(--sv-negro) text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <span className="inline-block rounded-full bg-(--sv-fondo) px-3 py-2 text-(--sv-negro)">
            <Logo />
          </span>
          <p className="mt-4 max-w-sm text-sm font-medium text-white/65">Compra y venta de usados entre vecinos de Córdoba. Porque todo tiene una segunda vuelta.</p>
        </div>
        <div className="text-sm">
          <p className={`${display} text-lg font-extrabold text-(--sv-amarillo)`}>Explorá</p>
          <ul className="mt-3 space-y-2 font-medium text-white/70">
            <li>Bicis</li>
            <li>Muebles y deco</li>
            <li>Electrónica</li>
            <li>Ropa e instrumentos</li>
          </ul>
        </div>
        <div className="text-sm">
          <p className={`${display} text-lg font-extrabold text-(--sv-amarillo)`}>Ayuda</p>
          <ul className="mt-3 space-y-2 font-medium text-white/70">
            <li>Cómo publicar</li>
            <li>Comprar seguro</li>
            <li>Preguntas frecuentes</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/15">
        <p className="mx-auto max-w-7xl px-4 pb-32 pt-5 text-xs font-medium text-white/55 sm:px-6 lg:px-8">
          Demo con contenido ficticio. Segunda Vuelta, sus avisos, vendedores, precios y conversaciones son inventados.
        </p>
      </div>
    </footer>
  );
}
