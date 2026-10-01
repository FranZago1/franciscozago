"use client";

import { useEffect, useRef, useState } from "react";

const TAM = 200; // lado del cuadrado en px (se recorta a la zona)

/**
 * Cursor del hero: un cuadrado blanco con `mix-blend-mode: difference` que invierte los colores
 * de lo que tiene debajo (sobre blanco se ve negro, sobre el celeste se ve naranja, etc.).
 * Se monta dentro del contenedor que lo usa y escucha los eventos de su elemento padre.
 * Solo con mouse; en pantallas táctiles no se renderiza.
 * Es un elemento fijo sin contenedor con transform: si lo tuviera, el blend dejaría de mezclarse con la página.
 */
export function InvertCursor() {
  const [activo, setActivo] = useState(false);
  const ancla = useRef<HTMLSpanElement>(null);
  const cuadro = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;
    const zona = ancla.current?.parentElement;
    if (!zona) return;
    setActivo(true);
    zona.classList.add("invert-zone");

    const suave = !window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;
    const destino = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };
    let dentro = false;
    let raf = 0;

    const pintar = () => {
      raf = 0;
      const k = suave ? 0.22 : 1;
      pos.x += (destino.x - pos.x) * k;
      pos.y += (destino.y - pos.y) * k;
      const izq = pos.x - TAM / 2;
      const arr = pos.y - TAM / 2;
      const t = `translate3d(${izq}px, ${arr}px, 0)`;
      if (cuadro.current) {
        cuadro.current.style.transform = t;
        // Recorte a la zona: el cuadrado solo invierte lo que está dentro del contenedor.
        const z = zona.getBoundingClientRect();
        const l = z.left - izq;
        const tp = z.top - arr;
        const r = z.right - izq;
        const b = z.bottom - arr;
        cuadro.current.style.clipPath = `polygon(${l}px ${tp}px, ${r}px ${tp}px, ${r}px ${b}px, ${l}px ${b}px)`;
      }
      if (
        dentro &&
        (Math.abs(destino.x - pos.x) > 0.3 || Math.abs(destino.y - pos.y) > 0.3)
      ) {
        raf = requestAnimationFrame(pintar);
      }
    };
    const pedir = () => {
      if (!raf) raf = requestAnimationFrame(pintar);
    };

    const mostrar = (v: boolean) => {
      if (cuadro.current) cuadro.current.style.opacity = v ? "1" : "0";
    };

    const onEnter = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      dentro = true;
      destino.x = pos.x = e.clientX;
      destino.y = pos.y = e.clientY;
      mostrar(true);
      pedir();
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (!dentro) onEnter(e);
      destino.x = e.clientX;
      destino.y = e.clientY;
      pedir();
    };
    const onLeave = () => {
      dentro = false;
      mostrar(false);
    };
    // Al scrollear con la rueda el mouse no se mueve pero la zona sí: se oculta hasta el próximo movimiento.
    const onScroll = () => {
      if (dentro) onLeave();
    };

    zona.addEventListener("pointerenter", onEnter);
    zona.addEventListener("pointermove", onMove);
    zona.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      zona.classList.remove("invert-zone");
      zona.removeEventListener("pointerenter", onEnter);
      zona.removeEventListener("pointermove", onMove);
      zona.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <span ref={ancla} hidden />
      {activo ? (
        <div
          ref={cuadro}
          aria-hidden
          className="pointer-events-none fixed top-0 left-0 z-[9998] bg-white opacity-0 mix-blend-difference transition-opacity duration-200"
          style={{ width: TAM, height: TAM }}
        >
          {/* Handles: sobresalen de las esquinas, así se ven como cuadraditos oscuros. */}
          <span className="absolute -top-2 -left-2 size-4 bg-white" />
          <span className="absolute -top-2 -right-2 size-4 bg-white" />
          <span className="absolute -bottom-2 -left-2 size-4 bg-white" />
          <span className="absolute -right-2 -bottom-2 size-4 bg-white" />
        </div>
      ) : null}
    </>
  );
}
