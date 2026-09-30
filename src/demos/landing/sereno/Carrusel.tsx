"use client";

import { useRef, useState } from "react";
import { Icono } from "../shared/Icono";
import { testimonios } from "./datos";

const serif = "[font-family:var(--font-ac-serif)]";

/** Carrusel accesible de testimonios: botones, puntos, flechas del teclado y gesto de deslizar. Sin autoplay. */
export function Carrusel() {
  const [i, setI] = useState(0);
  const inicioX = useRef<number | null>(null);
  const total = testimonios.length;
  const ir = (n: number) => setI((n + total) % total);

  return (
    <section
      aria-roledescription="carrusel"
      aria-label="Testimonios de clientas y clientes"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") ir(i + 1);
        if (e.key === "ArrowLeft") ir(i - 1);
      }}
      className="relative"
    >
      <div
        className="overflow-hidden"
        onPointerDown={(e) => (inicioX.current = e.clientX)}
        onPointerUp={(e) => {
          if (inicioX.current === null) return;
          const dx = e.clientX - inicioX.current;
          if (Math.abs(dx) > 50) ir(i + (dx < 0 ? 1 : -1));
          inicioX.current = null;
        }}
      >
        <div
          className="flex touch-pan-y transition-transform duration-700 ease-[cubic-bezier(.2,.7,.2,1)] motion-reduce:transition-none"
          style={{ transform: `translateX(-${i * 100}%)` }}
          aria-live="polite"
        >
          {testimonios.map((t, n) => (
            <div
              key={t.nombre}
              role="group"
              aria-roledescription="testimonio"
              aria-label={`${n + 1} de ${total}`}
              aria-hidden={n !== i}
              inert={n !== i}
              className="w-full shrink-0 px-1"
            >
              <figure>
                <blockquote className={`${serif} text-[clamp(1.6rem,3.6vw,2.75rem)] leading-[1.25] font-light text-[#26302A]`}>
                  <span aria-hidden="true" className="mr-1 text-[#8F7FA3]">
                    “
                  </span>
                  {t.texto}
                  <span aria-hidden="true" className="text-[#8F7FA3]">
                    ”
                  </span>
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-4">
                  <span aria-hidden="true" className={`${serif} flex size-12 items-center justify-center rounded-full bg-[#E5E9E1] text-lg text-[#3E4C43] italic`}>
                    {t.nombre[0]}
                  </span>
                  <span>
                    <span className="block text-[#26302A]">{t.nombre}</span>
                    <span className="block text-sm text-[#3E4C43]/80">{t.tratamiento}</span>
                  </span>
                </figcaption>
              </figure>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          {testimonios.map((t, n) => (
            <button
              key={t.nombre}
              type="button"
              onClick={() => ir(n)}
              aria-label={`Ver testimonio ${n + 1}`}
              aria-current={n === i ? "true" : undefined}
              className="group flex h-8 items-center"
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-500 ${
                  n === i ? "w-10 bg-[#3E4C43]" : "w-4 bg-[#3E4C43]/20 group-hover:bg-[#3E4C43]/40"
                }`}
              />
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-[#3E4C43]/80 tabular-nums" aria-hidden="true">
            {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <button
            type="button"
            onClick={() => ir(i - 1)}
            aria-label="Testimonio anterior"
            className="flex size-12 items-center justify-center rounded-full border border-[#3E4C43]/25 text-[#3E4C43] transition-colors hover:border-[#3E4C43] hover:bg-[#3E4C43] hover:text-[#F6F4EE]"
          >
            <Icono nombre="flechaIzq" grosor={1.4} className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => ir(i + 1)}
            aria-label="Testimonio siguiente"
            className="flex size-12 items-center justify-center rounded-full border border-[#3E4C43]/25 text-[#3E4C43] transition-colors hover:border-[#3E4C43] hover:bg-[#3E4C43] hover:text-[#F6F4EE]"
          >
            <Icono nombre="flecha" grosor={1.4} className="size-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
