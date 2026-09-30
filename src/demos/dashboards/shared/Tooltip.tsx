"use client";

import { useLayoutEffect, useRef, useState } from "react";

/**
 * Tooltip de los gráficos. Se posiciona dentro de un contenedor `relative`:
 * centrado sobre `x`, arriba de `y` (o abajo si no entra) y siempre dentro del ancho disponible.
 * Los colores salen de variables CSS de cada tema (--dv-tip-*).
 */
export function Tooltip({
  x,
  y,
  ancho,
  visible,
  children,
  debajo = false,
}: {
  x: number;
  y: number;
  ancho: number;
  visible: boolean;
  children: React.ReactNode;
  /** Preferir abajo del punto (ej. celdas de la primera fila de un mapa de calor). */
  debajo?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [tam, setTam] = useState({ w: 160, h: 60 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const medir = () => setTam({ w: el.offsetWidth, h: el.offsetHeight });
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const left = Math.max(0, Math.min(ancho - tam.w, x - tam.w / 2));
  let top = debajo ? y + 14 : y - tam.h - 12;
  if (top < -8) top = y + 14;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="dv-tip pointer-events-none absolute z-20 w-max min-w-[9rem] max-w-[16rem] rounded-[10px] px-3 py-2.5 text-[12.5px] leading-snug"
      style={{
        left,
        top,
        opacity: visible ? 1 : 0,
        visibility: visible ? "visible" : "hidden",
      }}
    >
      {children}
    </div>
  );
}

/** Fila del tooltip: valor fuerte primero, nombre de la serie después, con una línea de color. */
export function TipFila({
  color,
  valor,
  nombre,
  forma = "linea",
}: {
  color?: string;
  valor: React.ReactNode;
  nombre: React.ReactNode;
  forma?: "linea" | "cuadro";
}) {
  return (
    <div className="flex items-center gap-2 py-[1px]">
      {color ? (
        <span
          aria-hidden="true"
          className={forma === "linea" ? "h-[3px] w-3 shrink-0 rounded-full" : "size-2.5 shrink-0 rounded-[3px]"}
          style={{ background: color, boxShadow: "inset 0 0 0 1px rgb(255 255 255 / 0.25)" }}
        />
      ) : null}
      <span className="font-semibold tabular-nums" style={{ color: "var(--dv-tip-ink)" }}>
        {valor}
      </span>
      <span className="truncate" style={{ color: "var(--dv-tip-ink2)" }}>
        {nombre}
      </span>
    </div>
  );
}

export function TipTitulo({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-1 text-[11.5px] font-medium" style={{ color: "var(--dv-tip-ink2)" }}>
      {children}
    </div>
  );
}
