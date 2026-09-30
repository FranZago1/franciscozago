import Image from "next/image";
import { hero, heroTitular } from "@/content/home";
import { waLink } from "@/lib/wa";
import { Button } from "./Button";

export function HeroChipImage({ src, alt, orden }: { src: string; alt: string; orden?: number }) {
  return (
    <span
      style={orden !== undefined ? ({ "--i": orden } as React.CSSProperties) : undefined}
      className="hero-chip relative mx-[0.12em] inline-block h-[0.78em] w-[1.5em] translate-y-[0.06em] overflow-hidden rounded-chip bg-surface align-baseline">
      <Image src={src} alt={alt} fill sizes="120px" className="object-cover" priority />
    </span>
  );
}

/**
 * Único momento orquestado del sitio: las palabras y los chips del titular entran en secuencia.
 * Es CSS puro (ver globals.css) para que corra en el primer pintado sin esperar a JS y no
 * afecte el LCP. Con prefers-reduced-motion no hay animación.
 */
function TitularAnimado() {
  let orden = 0;
  return heroTitular.map((seg, i) => {
    if (typeof seg !== "string") {
      return (
        <span key={i}>
          <HeroChipImage {...seg.chip} orden={orden++} />{" "}
        </span>
      );
    }
    return seg.split(" ").map((palabra, j) => (
      <span key={`${i}-${j}`}>
        <span className="hero-word inline-block" style={{ "--i": orden++ } as React.CSSProperties}>
          {palabra}
        </span>{" "}
      </span>
    ));
  });
}

export function Hero({ titular }: { titular?: React.ReactNode }) {
  return (
    <section className="col pt-20 md:pt-28" aria-labelledby="hero-titulo">
      <p className="text-lg text-muted">{hero.saludo}</p>
      <h1 id="hero-titulo" className="mt-4 font-display text-display font-normal tracking-[-0.01em]">
        {titular ?? <TitularAnimado />}
      </h1>
      <p className="mt-6 max-w-[34rem] text-lg text-muted">{hero.bajada}</p>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Button href={waLink(hero.ctaPrimario.mensajeWa)} external>
          {hero.ctaPrimario.label}
        </Button>
        <Button href={hero.ctaSecundario.href} variant="secondary">
          {hero.ctaSecundario.label}
        </Button>
      </div>
    </section>
  );
}
