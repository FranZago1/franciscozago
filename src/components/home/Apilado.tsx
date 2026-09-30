"use client";

import { useEffect, useRef } from "react";

/**
 * Carpeta apilada (sticky en desktop). A medida que la siguiente carpeta sube y la tapa,
 * esta se desvanece y se achica levemente. Escribe --fade y --escala en el elemento.
 */
export function Apilado({
  children,
  className = "",
  style,
  labelledBy,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  labelledBy?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    const next = el?.nextElementSibling as HTMLElement | null;
    if (!el || !next) return;
    const desktop = window.matchMedia("(min-width: 768px)");
    let raf = 0;

    const update = () => {
      raf = 0;
      if (!desktop.matches) {
        el.style.removeProperty("--fade");
        el.style.removeProperty("--escala");
        return;
      }
      const vh = window.innerHeight;
      const top = next.getBoundingClientRect().top;
      // 0 cuando la siguiente asoma por abajo, 1 cuando llega arriba y la cubre.
      const p = Math.min(1, Math.max(0, (vh - top) / (vh * 0.85)));
      el.style.setProperty("--fade", String(1 - p * 0.55));
      el.style.setProperty("--escala", String(1 - p * 0.04));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    desktop.addEventListener("change", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      desktop.removeEventListener("change", onScroll);
    };
  }, []);

  return (
    <article ref={ref} aria-labelledby={labelledBy} className={className} style={style}>
      <div className="origin-top opacity-(--fade,1) scale-(--escala,1) will-change-[opacity,transform]">{children}</div>
    </article>
  );
}
