import { Eyebrow } from "@/components/canvas/Eyebrow";
import { Icon } from "@/components/canvas/Icons";
import { stack } from "@/content/stack";

/** El stack presentado como el panel de capas de un editor de diseño. */
export function Stack() {
  return (
    <section id="stack" aria-labelledby="stack-titulo" className="wrap mt-32 md:mt-44">
      <Eyebrow n="06" className="mb-4">Herramientas</Eyebrow>
      <h2 id="stack-titulo" className="text-[clamp(2.2rem,5vw,3.6rem)] leading-none font-medium tracking-[-0.035em]">
        Stack
      </h2>

      <div className="mt-10 overflow-hidden rounded-[12px] border-[1.5px] border-ink bg-white">
        <div className="label-mono flex items-center gap-4 border-b-[1.5px] border-ink px-4 py-2.5 text-[13px]">
          <span className="font-medium">Capas</span>
          <span className="text-muted">{stack.reduce((n, f) => n + f.items.length, 0)} elementos</span>
        </div>
        <div className="gap-0 p-2 md:columns-2 lg:columns-3">
          {stack.map((fila) => (
            <dl key={fila.categoria} className="mb-2 break-inside-avoid">
              <dt className="flex items-center gap-2 rounded-[6px] px-2 py-1.5 text-[15px] font-semibold">
                <Icon name="frame" className="size-4 text-accent" />
                {fila.categoria}
              </dt>
              {fila.items.map((item) => (
                <dd
                  key={item}
                  className="flex items-center gap-2 rounded-[6px] py-1 pr-2 pl-8 text-[15px] text-muted transition-colors hover:bg-[#EAF4F4] hover:text-ink"
                >
                  <Icon name="texto" className="size-3.5 shrink-0" />
                  {item}
                </dd>
              ))}
            </dl>
          ))}
        </div>
      </div>
    </section>
  );
}
