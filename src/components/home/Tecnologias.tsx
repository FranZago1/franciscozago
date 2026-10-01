import { stack } from "@/content/stack";

/** Desplegable discreto con tecnologías e integraciones: solo lo abre quien le interesa la parte técnica. */
export function Tecnologias() {
  return (
    <section aria-label="Tecnologías" className="wrap mt-24 md:mt-32">
      <details className="tecnologias group border-y-[1.5px] border-ink">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 [&::-webkit-details-marker]:hidden">
          <span className="text-xl font-medium tracking-tight md:text-2xl">Tecnologías e integraciones</span>
          <span
            aria-hidden
            className="relative grid size-9 shrink-0 place-items-center border-[1.5px] border-ink transition-colors group-hover:bg-ink group-hover:text-white"
          >
            <span className="absolute h-[1.5px] w-3.5 bg-current" />
            <span className="absolute h-3.5 w-[1.5px] bg-current transition-transform duration-300 group-open:rotate-90 group-open:opacity-0" />
          </span>
        </summary>

        <dl className="grid gap-x-10 gap-y-7 pt-3 pb-9 sm:grid-cols-2 lg:grid-cols-4">
          {stack.map((fila) => (
            <div key={fila.categoria}>
              <dt className="label-mono mb-3 text-[12px] text-muted">{fila.categoria}</dt>
              <dd>
                <ul className="flex flex-wrap gap-1.5">
                  {fila.items.map((item) => (
                    <li key={item} className="border border-line bg-white px-2.5 py-1 text-[14px] leading-snug">
                      {item}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </details>
    </section>
  );
}
