import { Icon } from "../shared/Icon";
import { Logo, display } from "./ui";

export function BarraAnuncio() {
  return (
    <div className="bg-(--dv-verde) text-(--dv-papel)">
      <p className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-[0.8rem] sm:text-sm">
        <Icon name="truck" size={16} className="hidden shrink-0 text-(--dv-mostaza) sm:block" />
        <span>
          Entregas de martes a sábado en Capital, Sierras Chicas, Punilla, Paravachasca, Calamuchita y el Norte.
        </span>
      </p>
    </div>
  );
}

const pasos = [
  {
    n: "01",
    t: "Armá tu canasta",
    d: "Sumá productos de distintos productores en un mismo pedido. Ves el precio real de cada uno, sin sobreprecios.",
    icon: "basket" as const,
  },
  {
    n: "02",
    t: "Cada uno prepara lo suyo",
    d: "Tu pedido se divide por productor: cada quien cosecha, hornea o envasa y te confirma el día de entrega.",
    icon: "leaf" as const,
  },
  {
    n: "03",
    t: "Recibí o retirá",
    d: "Te llega a tu casa con el envío de cada productor, o lo retirás sin costo en el Punto Del Valle.",
    icon: "truck" as const,
  },
];

export function ComoFunciona() {
  return (
    <section id="como-funciona" aria-labelledby="como-titulo" className="scroll-mt-16 bg-(--dv-verde) text-(--dv-papel)">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr] lg:items-end">
          <h2 id="como-titulo" className={`${display} text-4xl font-medium leading-[1.05] sm:text-6xl`}>
            Un solo pedido,
            <br />
            <span className="italic text-(--dv-mostaza)">muchos productores.</span>
          </h2>
          <p className="max-w-lg text-lg text-(--dv-papel)/80 lg:justify-self-end">
            Del Valle junta la oferta de productores chicos de Córdoba en un solo lugar, sin que pierdan su nombre ni su
            forma de trabajar.
          </p>
        </div>
        <ol className="mt-12 grid gap-4 md:grid-cols-3 md:gap-6">
          {pasos.map((p) => (
            <li key={p.n} className="relative overflow-hidden rounded-[1.6rem] border border-(--dv-papel)/15 bg-(--dv-papel)/[0.06] p-6 sm:p-7">
              <span
                className={`${display} pointer-events-none absolute -right-2 -top-6 text-[7.5rem] font-semibold leading-none text-transparent [-webkit-text-stroke:1.5px_rgba(246,239,223,0.22)]`}
                aria-hidden="true"
              >
                {p.n}
              </span>
              <span className="grid size-12 place-items-center rounded-full bg-(--dv-mostaza) text-(--dv-verde)">
                <Icon name={p.icon} size={24} stroke={1.9} />
              </span>
              <h3 className={`${display} mt-6 text-2xl font-medium`}>{p.t}</h3>
              <p className="mt-2 leading-relaxed text-(--dv-papel)/78">{p.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Manifiesto() {
  return (
    <section aria-label="Testimonio" className="border-b border-(--dv-linea) bg-(--dv-crema)">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:px-8">
        <figure>
          <svg width="46" height="36" viewBox="0 0 46 36" aria-hidden="true" className="text-(--dv-mostaza)">
            <path d="M0 36V20C0 8 6 1 18 0v7c-6 1-9 5-9 11h9v18zm28 0V20c0-12 6-19 18-20v7c-6 1-9 5-9 11h9v18z" fill="currentColor" />
          </svg>
          <blockquote className={`${display} mt-5 text-[clamp(1.7rem,3.6vw,2.7rem)] font-medium leading-[1.15] text-(--dv-verde)`}>
            Antes compraba el queso en el súper. Ahora sé que lo hace Mirta, en Tanti, y que el martes me llega junto con el
            pan de Lucas.
          </blockquote>
          <figcaption className="mt-5 text-(--dv-gris)">
            <strong className="text-(--dv-tinta)">Carolina M.</strong> · compra cada semana desde barrio General Paz
          </figcaption>
        </figure>
        <dl className="grid grid-cols-2 gap-4">
          {[
            ["4,9", "promedio de reseñas"],
            ["2.300", "pedidos por mes"],
            ["48 h", "de la chacra a tu mesa"],
            ["0", "intermediarios"],
          ].map(([n, t]) => (
            <div key={t} className="rounded-2xl border border-(--dv-linea) bg-(--dv-papel) p-5">
              <dt className="sr-only">{t}</dt>
              <dd className={`${display} text-4xl font-semibold text-(--dv-tomate)`}>{n}</dd>
              <dd className="mt-1 text-sm text-(--dv-gris)">{t}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function Pie() {
  return (
    <footer className="bg-(--dv-tinta) text-(--dv-papel)">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <Logo claro />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-(--dv-papel)/70">
            Mercado online de productores de Córdoba. Comprá directo, conocé quién lo hace y recibí todo en un solo pedido.
          </p>
        </div>
        <div className="text-sm">
          <p className="font-semibold text-(--dv-mostaza)">Mercado</p>
          <ul className="mt-3 space-y-2 text-(--dv-papel)/75">
            <li>Productos de la semana</li>
            <li>Productores</li>
            <li>Zonas y días de entrega</li>
            <li>Punto Del Valle, Güemes</li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="font-semibold text-(--dv-mostaza)">¿Producís en Córdoba?</p>
          <p className="mt-3 text-(--dv-papel)/75">
            Sumate con tu tiendita: vos ponés los precios y los días de entrega. Nosotros juntamos los pedidos.
          </p>
        </div>
      </div>
      <div className="border-t border-(--dv-papel)/10">
        <p className="mx-auto max-w-7xl px-4 pb-32 pt-5 text-xs text-(--dv-papel)/55 sm:px-6 lg:px-8">
          Demo con contenido ficticio. Del Valle Mercado, sus productores, productos, precios y reseñas son inventados.
        </p>
      </div>
    </footer>
  );
}
