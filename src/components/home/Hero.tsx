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

const pop = (i: number) => ({ className: "pop-in block", style: { "--i": i } as React.CSSProperties });

export function Hero() {
  const th = getTrabajo("trendahaus");
  const bs = getTrabajo("benicioshop");

  return (
    <>
      {/* Lienzo con el wordmark y los stickers arrastrables */}
      <section aria-label="Presentación" className="relative overflow-hidden">
        <InvertCursor />
        <div className="wrap relative flex min-h-[560px] flex-col items-center justify-center pt-24 pb-36 md:min-h-[640px] md:pt-20 md:pb-24">
          <p className="label-mono text-[13px] text-muted md:text-sm">
            <span className="text-accent">(00)</span> {hero.saludo}
          </p>

          <SelectionFrame nombre="francisco-zago" medida="Hug × Hug" className="mt-8" padding="px-3 pt-2 pb-4 md:px-6 md:pt-3 md:pb-6">
            <Wordmark className="text-[clamp(2.9rem,9.5vw,7.25rem)] text-ink" />
          </SelectionFrame>

          <p className="label-mono mt-12 flex items-center gap-2.5 text-sm md:text-base">
            <span aria-hidden className="size-3 rounded-full bg-accent" />
            {hero.disponible}
          </p>

          {/* Stickers: decorativos, se pueden arrastrar */}
          {th ? (
            <Draggable rotate={-4} className="absolute top-[2%] left-[0%] hidden lg:block">
              <span {...pop(0)}>
                <Polaroid src={th.media.desktop} alt="" epigrafe="trendahaus.com" className="w-52" />
              </span>
            </Draggable>
          ) : null}
          {bs ? (
            <Draggable rotate={3} className="absolute top-[3%] right-[0%] hidden lg:block">
              <span {...pop(1)}>
                <Polaroid src={bs.media.desktop} alt="" epigrafe="benicioshop.com" className="w-48" />
              </span>
            </Draggable>
          ) : null}
          <Draggable rotate={-3} className="absolute top-[3%] left-0 md:top-[66%] md:left-[6%]">
            <span {...pop(2)}>
              <Cinta color={st.rol.color}>{st.rol.texto}</Cinta>
            </span>
          </Draggable>
          <Draggable rotate={3} className="absolute top-[11%] right-0 md:top-[62%] md:right-[6%]">
            <span {...pop(3)}>
              <Cinta color={st.lugar.color}>{st.lugar.texto}</Cinta>
            </span>
          </Draggable>
          <Draggable className="absolute bottom-[10%] left-[4%] md:bottom-[13%] md:left-[27%]">
            <span {...pop(4)}>
              <CursorTag color={st.cursorIzq.color}>{st.cursorIzq.texto}</CursorTag>
            </span>
          </Draggable>
          <Draggable className="absolute right-[4%] bottom-[3%] md:right-[26%] md:bottom-[17%]">
            <span {...pop(5)}>
              <CursorTag color={st.cursorDer.color} lado="der">
                {st.cursorDer.texto}
              </CursorTag>
            </span>
          </Draggable>
          <Draggable rotate={-2} className="absolute right-[9%] bottom-[5%] hidden md:block">
            <span {...pop(6)}>
              <Cinta color={st.dato.color}>{st.dato.texto}</Cinta>
            </span>
          </Draggable>
          <p className="label-mono pointer-events-none absolute bottom-2 left-5 hidden text-[11px] text-muted md:block">
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
