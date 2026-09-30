import { Icon, type IconName } from "../shared/Icon";
import { Logo, ancho, mono } from "./ui";

const pasos: { t: string; d: string; icon: IconName }[] = [
  { t: "Contanos qué pasa", d: "Escribí el problema con tus palabras. Si querés, sumá fotos.", icon: "chat" },
  { t: "Compará perfiles", d: "Mirá matrícula, reseñas, precios de referencia y cuándo pueden ir.", icon: "user" },
  { t: "Recibí presupuestos", d: "Sin cargo y sin compromiso. Te llegan en minutos, no en días.", icon: "tag" },
  { t: "Coordiná y calificá", d: "Acordás la visita y, al terminar, dejás tu reseña para el próximo.", icon: "star" },
];

export function ComoFunciona() {
  return (
    <section id="como-funciona" aria-labelledby="como-titulo" className="scroll-mt-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-2xl">
          <p className={`${mono} text-sm text-(--ma-azul3)`}>Cómo funciona</p>
          <h2 id="como-titulo" className={`${ancho} mt-2 text-4xl font-extrabold tracking-[-0.02em] text-(--ma-azul) sm:text-5xl`}>
            De “se rompió” a “quedó andando” en cuatro pasos.
          </h2>
        </div>
        <ol className="relative mt-12 grid gap-8 md:grid-cols-4 md:gap-6">
          <span aria-hidden="true" className="absolute left-7 top-7 hidden h-0.5 w-[calc(100%-3.5rem)] bg-[repeating-linear-gradient(90deg,#DAE1EC_0_10px,transparent_10px_18px)] md:block" />
          {pasos.map((p, i) => (
            <li key={p.t} className="relative flex gap-4 md:block">
              <span className="relative z-10 grid size-14 shrink-0 place-items-center rounded-2xl bg-(--ma-amarillo) text-(--ma-azul) shadow-[4px_4px_0_#0B2A5B]">
                <Icon name={p.icon} size={26} stroke={2.2} />
              </span>
              <div>
                <p className={`${mono} mt-1 text-sm text-(--ma-gris) md:mt-6`}>Paso {i + 1}</p>
                <h3 className={`${ancho} mt-1 text-xl font-extrabold text-(--ma-tinta)`}>{p.t}</h3>
                <p className="mt-2 leading-relaxed text-(--ma-gris)">{p.d}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-14 grid gap-4 rounded-2xl border-2 border-(--ma-azul) bg-(--ma-fondo) p-6 sm:p-8 lg:grid-cols-[auto_1fr_auto] lg:items-center lg:gap-8">
          <span className="grid size-16 place-items-center rounded-2xl bg-(--ma-azul) text-(--ma-amarillo)">
            <Icon name="shield" size={34} stroke={2} />
          </span>
          <div>
            <p className={`${ancho} text-2xl font-extrabold text-(--ma-azul)`}>Garantía ManoAmiga</p>
            <p className="mt-1 max-w-2xl text-(--ma-gris)">
              Si el trabajo contratado por acá no quedó bien, el profesional vuelve sin cargo dentro de los 30 días. Y si no
              responde, te ayudamos a resolverlo.
            </p>
          </div>
          <ul className="flex flex-wrap gap-2 text-sm font-bold text-(--ma-azul)">
            {["30 días", "Sin letra chica", "Soporte humano"].map((t) => (
              <li key={t} className="rounded-md bg-white px-3 py-1.5 ring-1 ring-(--ma-linea)">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

const testimonios = [
  {
    texto: "Tenía olor a gas un sábado a la noche. En quince minutos Raúl me había respondido y a la hora estaba en casa.",
    autor: "Gabriela T.",
    barrio: "San Vicente",
    oficio: "Gas",
  },
  {
    texto: "Pedí tres presupuestos para pintar el depto y los tuve en el mismo día. Elegí por reseñas y no me equivoqué.",
    autor: "Joaquín R.",
    barrio: "Nueva Córdoba",
    oficio: "Pintura",
  },
  {
    texto: "Lo que más valoro es ver la matrícula antes de dejar entrar a alguien a casa.",
    autor: "Elena V.",
    barrio: "Cerro de las Rosas",
    oficio: "Electricidad",
  },
];

export function Testimonios() {
  return (
    <section aria-labelledby="test-titulo" className="bg-(--ma-fondo)">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="test-titulo" className={`${ancho} text-3xl font-extrabold tracking-[-0.02em] text-(--ma-azul) sm:text-4xl`}>
            Lo que dicen los vecinos
          </h2>
          <p className="flex items-center gap-2 text-(--ma-gris)">
            <span className={`${ancho} text-2xl font-extrabold text-(--ma-azul)`}>4,8</span>
            promedio en 18.400 reseñas
          </p>
        </div>
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {testimonios.map((t) => (
            <li key={t.autor}>
              <figure className="flex h-full flex-col rounded-2xl border-2 border-(--ma-linea) bg-white p-6">
                <div role="img" className="flex gap-0.5 text-(--ma-amarillo2)" aria-label="5 estrellas">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Icon key={i} name="star" size={17} filled stroke={1.2} />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-lg leading-relaxed text-(--ma-tinta)">“{t.texto}”</blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-(--ma-linea) pt-4">
                  <span className="grid size-10 place-items-center rounded-full bg-(--ma-azul) text-sm font-bold text-(--ma-amarillo)">
                    {t.autor.split(" ").map((x) => x[0]).join("")}
                  </span>
                  <span className="text-sm">
                    <strong className="block">{t.autor}</strong>
                    <span className="text-(--ma-gris)">
                      {t.barrio} · contrató {t.oficio.toLowerCase()}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Pie() {
  return (
    <footer className="bg-(--ma-tinta) text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr] lg:px-8">
        <div>
          <Logo claro />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/65">
            Profesionales de oficios verificados en Córdoba. Pedí presupuestos, compará y contratá con confianza.
          </p>
        </div>
        <div className="text-sm">
          <p className="font-bold text-(--ma-amarillo)">Oficios</p>
          <ul className="mt-3 space-y-2 text-white/70">
            <li>Plomería y gas</li>
            <li>Electricidad</li>
            <li>Pintura y carpintería</li>
            <li>Aire acondicionado</li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="font-bold text-(--ma-amarillo)">Ayuda</p>
          <ul className="mt-3 space-y-2 text-white/70">
            <li>Garantía ManoAmiga</li>
            <li>Cómo verificamos matrículas</li>
            <li>Preguntas frecuentes</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-4 pb-32 pt-5 text-xs text-white/50 sm:px-6 lg:px-8">
          Demo con contenido ficticio. ManoAmiga, sus profesionales, matrículas, reseñas y precios son inventados.
        </p>
      </div>
    </footer>
  );
}
