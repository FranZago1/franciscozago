"use client";

import { useEffect, useRef } from "react";

const LARGO = 3000;

/**
 * Regla superior con marcas cada 10/50/100 px y un marcador que sigue al mouse.
 * Decorativa: solo aparece en dispositivos con puntero fino (ver clases hidden/[@media(hover:hover)]).
 */
export function Ruler() {
  const marcador = useRef<HTMLDivElement>(null);
  const valor = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let raf = 0;
    let x = -100;
    const pintar = () => {
      raf = 0;
      if (marcador.current) marcador.current.style.transform = `translateX(${x}px)`;
      if (valor.current) valor.current.textContent = String(Math.round(x));
    };
    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      if (!raf) raf = requestAnimationFrame(pintar);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div aria-hidden className="relative hidden h-8 overflow-hidden border-b border-line bg-white [@media(hover:hover)]:block">
      <div className="ruler-ticks absolute inset-x-0 bottom-0 h-2.5" />
      {Array.from({ length: LARGO / 100 }, (_, i) => (
        <span
          key={i}
          className="label-mono absolute top-1 -translate-x-1/2 text-[10px] text-muted"
          style={{ left: i * 100 + (i === 0 ? 6 : 0) }}
        >
          {i * 100}
        </span>
      ))}
      <div ref={marcador} className="absolute inset-y-0 left-0 w-px bg-accent will-change-transform" style={{ transform: "translateX(-100px)" }}>
        <span ref={valor} className="label-mono absolute top-0.5 left-1 rounded-[3px] bg-accent px-1 text-[10px] text-white" />
      </div>
    </div>
  );
}
