import { Button } from "@/components/Button";
import { Draggable } from "@/components/canvas/Draggable";
import { InvertCursor } from "@/components/canvas/InvertCursor";
import { SelectionFrame } from "@/components/canvas/SelectionFrame";
import { Cinta, CursorTag, Polaroid } from "@/components/canvas/Sticker";
import { Titular } from "@/components/canvas/Titular";
import { Wordmark } from "@/components/canvas/Wordmark";
import { hero, heroStickers as st } from "@/content/home";
import { getTrabajo } from "@/content/trabajos";
import { waLink } from "@/lib/wa";

/** Envoltorio que hace flotar y rotar suave un sticker (d: duración en s, g: giro en grados, dl: desfase). */
function Flota({ d, g, dl, children }: { d: number; g: number; dl: number; children: React.ReactNode }) {
  const variante = g >= 0 ? (g >= 4 ? "flota-c" : "flota-a") : g <= -4 ? "flota-d" : "flota-b";
  return (
    <span
      className={`flota ${variante} block`}
      style={{ "--d": `${d}s`, "--g": `${g}deg`, "--dl": `${dl}s` } as React.CSSProperties}
    >
      {children}
    </span>
  );
}

const pop = (i: number) => ({ className: "pop-in block", style: { "--i": i } as React.CSSProperties });

export function Hero() {
  const th = getTrabajo("trendahaus");
  const bs = getTrabajo("benicioshop");

  return (
    <>
      {/* Lienzo con el wordmark y los stickers arrastrables */}
      <section aria-label="Presentación" className="relative overflow-hidden">
        <div className="wrap relative flex min-h-[560px] flex-col items-center justify-center pt-24 pb-36 md:min-h-[640px] md:pt-20 md:pb-24">
          <p className="label-mono text-[13px] text-muted md:text-sm">
            <span className="text-accent">(00)</span> {hero.saludo}
          </p>

          <SelectionFrame nombre="francisco-zago" medida="Hug × Hug" className="mt-8" padding="px-3 pt-2 pb-4 md:px-6 md:pt-3 md:pb-6">
            {/* El cursor inversor actúa solo sobre el nombre (su zona es este marco). */}
            <InvertCursor />
            <Wordmark className="text-[clamp(2.9rem,9.5vw,7.25rem)] text-ink" />
          </SelectionFrame>

          <p className="label-mono mt-12 flex items-center gap-2.5 text-sm md:text-base">
            <span aria-hidden className="size-3 rounded-full bg-accent" />
            {hero.disponible}
          </p>

          {/* Stickers: decorativos, se pueden arrastrar y flotan/rotan suave (clase .flota) */}
          {th ? (
            <Draggable rotate={-4} className="absolute top-[7%] left-[0%] hidden lg:block">
              <Flota d={8} g={2.5} dl={-1}>
                <span {...pop(0)}>
                  <Polaroid src={th.media.desktop} alt="" epigrafe="trendahaus.com" className="w-52" />
                </span>
              </Flota>
            </Draggable>
          ) : null}
          {bs ? (
            <Draggable rotate={3} className="absolute top-[8%] right-[0%] hidden lg:block">
              <Flota d={9} g={-2.5} dl={-3}>
                <span {...pop(1)}>
                  <Polaroid src={bs.media.desktop} alt="" epigrafe="benicioshop.com" className="w-48" />
                </span>
              </Flota>
            </Draggable>
          ) : null}
          <Draggable rotate={-3} className="absolute top-[3%] left-0 md:top-[66%] md:left-[6%]">
            <Flota d={7} g={4} dl={-2}>
              <span {...pop(2)}>
                <Cinta color={st.rol.color}>{st.rol.texto}</Cinta>
              </span>
            </Flota>
          </Draggable>
          <Draggable rotate={4} className="absolute top-[12%] right-0 md:top-[46%] md:right-[3%]">
            <Flota d={6.5} g={-5} dl={-4}>
              <span {...pop(3)}>
                <Cinta color={st.portfolios.color}>{st.portfolios.texto}</Cinta>
              </span>
            </Flota>
          </Draggable>
          <Draggable rotate={3} className="absolute right-0 bottom-[21%] md:top-[17%] md:right-[21%] md:bottom-auto">
            <Flota d={8} g={-3.5} dl={-3.2}>
              <span {...pop(9)}>
                <Cinta color={st.estudiante.color}>{st.estudiante.texto}</Cinta>
              </span>
            </Flota>
          </Draggable>
          {/* Espejo de "Estudiante de Ingeniería" del lado izquierdo (solo escritorio). */}
          <Draggable rotate={-3} className="absolute top-[17%] left-[21%] hidden md:block">
            <Flota d={7.6} g={3.5} dl={-1.2}>
              <span {...pop(10)}>
                <Cinta color={st.disenio.color}>{st.disenio.texto}</Cinta>
              </span>
            </Flota>
          </Draggable>
          <Draggable className="absolute bottom-[10%] left-[4%] md:bottom-[13%] md:left-[27%]">
            <Flota d={6} g={-6} dl={-1.5}>
              <span {...pop(4)}>
                <CursorTag color={st.cursorIzq.color}>{st.cursorIzq.texto}</CursorTag>
              </span>
            </Flota>
          </Draggable>
          <Draggable className="absolute right-[4%] bottom-[3%] md:right-[26%] md:bottom-[17%]">
            <Flota d={7.5} g={6} dl={-3.5}>
              <span {...pop(5)}>
                <CursorTag color={st.cursorDer.color} lado="der">
                  {st.cursorDer.texto}
                </CursorTag>
              </span>
            </Flota>
          </Draggable>
          <Draggable className="absolute top-[40%] left-[4%] hidden md:block">
            <Flota d={8.5} g={-4} dl={-5}>
              <span {...pop(6)}>
                <CursorTag color={st.webApps.color}>{st.webApps.texto}</CursorTag>
              </span>
            </Flota>
          </Draggable>
          <Draggable className="absolute right-[9%] bottom-[14%] hidden md:block">
            <Flota d={7} g={5} dl={-2.5}>
              <span {...pop(7)}>
                <CursorTag color={st.dashboards.color} lado="der">
                  {st.dashboards.texto}
                </CursorTag>
              </span>
            </Flota>
          </Draggable>
          <Draggable rotate={-2} className="absolute bottom-[7%] left-[9%] hidden md:block">
            <Flota d={9.5} g={3} dl={-6}>
              <span {...pop(8)}>
                <Cinta color={st.landing.color}>{st.landing.texto}</Cinta>
              </span>
            </Flota>
          </Draggable>
          <p className="label-mono pointer-events-none absolute right-5 bottom-2 hidden text-[11px] text-muted md:block">
            Arrastrá los elementos
          </p>
        </div>
      </section>

      {/* Propuesta */}
      <section aria-labelledby="hero-titulo" className="wrap mt-10 text-center md:mt-16">
        <h1
          id="hero-titulo"
          className="mx-auto max-w-[17ch] text-display font-medium tracking-[-0.035em] text-balance md:max-w-[19ch]"
        >
          <Titular segmentos={hero.titular} />
        </h1>
        <p className="mx-auto mt-6 max-w-[36rem] text-lg text-muted">{hero.bajada}</p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Button href={waLink(hero.ctaPrimario.mensajeWa)} external icono="chat" iconoBg="var(--color-menta)">
            {hero.ctaPrimario.label}
          </Button>
          <Button href={hero.ctaSecundario.href} variant="secondary">
            {hero.ctaSecundario.label}
          </Button>
        </div>
      </section>
    </>
  );
}
