"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { casos, IMG } from "./datos";

const serif = "[font-family:var(--font-ac-serif)]";

/**
 * Comparador antes/después: se arrastra con mouse o dedo, o se mueve con el teclado
 * (flechas, Re Pág/Av Pág, Inicio/Fin) desde el tirador, que tiene rol de slider.
 */
export function AntesDespues() {
  const [caso, setCaso] = useState(0);
  const [pos, setPos] = useState(50);
  const [arrastrando, setArrastrando] = useState(false);
  const marco = useRef<HTMLDivElement>(null);
  const tirador = useRef<HTMLDivElement>(null);
  const c = casos[caso]!;

  const desdePuntero = useCallback((clientX: number) => {
    const r = marco.current?.getBoundingClientRect();
    if (!r) return;
    const p = ((clientX - r.left) / r.width) * 100;
    setPos(Math.round(Math.min(100, Math.max(0, p)) * 10) / 10);
  }, []);

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setArrastrando(true);
    desdePuntero(e.clientX);
    tirador.current?.focus({ preventScroll: true });
  }

  function onKeyDown(e: React.KeyboardEvent) {
    const paso = e.shiftKey ? 10 : 2;
    const mapa: Record<string, number> = {
      ArrowLeft: pos - paso,
      ArrowDown: pos - paso,
      ArrowRight: pos + paso,
      ArrowUp: pos + paso,
      PageDown: pos - 10,
      PageUp: pos + 10,
      Home: 0,
      End: 100,
    };
    if (e.key in mapa) {
      e.preventDefault();
      setPos(Math.min(100, Math.max(0, mapa[e.key]!)));
    }
  }

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
      <div className="lg:col-span-7">
        <div
          ref={marco}
          onPointerDown={onPointerDown}
          onPointerMove={(e) => arrastrando && desdePuntero(e.clientX)}
          onPointerUp={() => setArrastrando(false)}
          onPointerCancel={() => setArrastrando(false)}
          className={`relative aspect-[4/3] touch-pan-y overflow-hidden rounded-[32px] select-none ${arrastrando ? "cursor-grabbing" : "cursor-ew-resize"}`}
        >
          <Image
            key={`a-${c.id}`}
            src={`${IMG}/piel-caso-${c.id}-antes.webp`}
            alt={`Antes: ilustración de piel con ${c.titulo.toLowerCase()}`}
            fill
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="pointer-events-none object-cover"
            draggable={false}
          />
          <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
            <Image
              key={`d-${c.id}`}
              src={`${IMG}/piel-caso-${c.id}-despues.webp`}
              alt={`Después: la misma piel, pareja y luminosa, tras ${c.tratamiento.toLowerCase()}`}
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="pointer-events-none object-cover"
              draggable={false}
            />
          </div>

          <span className="pointer-events-none absolute top-4 left-4 rounded-full bg-[#26302A]/70 px-3 py-1 text-xs tracking-[0.18em] text-[#F6F4EE] uppercase backdrop-blur-sm">
            Antes
          </span>
          <span className="pointer-events-none absolute top-4 right-4 rounded-full bg-[#F6F4EE]/85 px-3 py-1 text-xs tracking-[0.18em] text-[#26302A] uppercase backdrop-blur-sm">
            Después
          </span>

          <div className="pointer-events-none absolute inset-y-0 w-px bg-[#F6F4EE]" style={{ left: `${pos}%` }}>
            <div
              ref={tirador}
              role="slider"
              tabIndex={0}
              aria-label="Comparar antes y después"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(pos)}
              aria-valuetext={`${Math.round(100 - pos)} % de la imagen muestra el después`}
              aria-orientation="horizontal"
              onKeyDown={onKeyDown}
              className={`pointer-events-auto absolute top-1/2 left-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#F6F4EE] text-[#3E4C43] shadow-[0_10px_30px_-8px_rgba(38,48,42,0.55)] transition-transform duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F6F4EE] ${
                arrastrando ? "scale-95" : "hover:scale-105"
              }`}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 7l-5 5 5 5M15 7l5 5-5 5" />
              </svg>
            </div>
          </div>
        </div>
        <p className="mt-4 text-sm text-[#F6F4EE]/60">
          Arrastrá el círculo o usá las flechas del teclado. Ilustraciones con fines demostrativos: los resultados varían en cada piel.
        </p>
      </div>

      <div className="lg:col-span-5">
        <div role="tablist" aria-label="Casos" className="flex flex-col gap-2">
          {casos.map((k, i) => {
            const activo = i === caso;
            return (
              <button
                key={k.id}
                id={`ac-caso-${k.id}`}
                type="button"
                role="tab"
                aria-selected={activo}
                aria-controls="ac-caso-panel"
                tabIndex={activo ? 0 : -1}
                onClick={() => {
                  setCaso(i);
                  setPos(50);
                }}
                onKeyDown={(e) => {
                  if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
                  e.preventDefault();
                  const n = (i + (e.key === "ArrowDown" ? 1 : casos.length - 1)) % casos.length;
                  setCaso(n);
                  setPos(50);
                  document.getElementById(`ac-caso-${casos[n]!.id}`)?.focus();
                }}
                className={`flex items-center justify-between gap-4 rounded-2xl px-5 py-4 text-left transition-colors duration-300 ${
                  activo ? "bg-[#F6F4EE] text-[#26302A]" : "text-[#F6F4EE]/80 ring-1 ring-[#F6F4EE]/15 hover:bg-[#F6F4EE]/[0.06]"
                }`}
              >
                <span>
                  <span className={`${serif} block text-xl`}>{k.titulo}</span>
                  <span className={`block text-sm ${activo ? "text-[#3E4C43]/70" : "text-[#F6F4EE]/55"}`}>{k.tratamiento}</span>
                </span>
                <span className={`${serif} text-sm italic ${activo ? "text-[#6E5D84]" : "text-[#F6F4EE]/40"}`}>0{i + 1}</span>
              </button>
            );
          })}
        </div>
        <div id="ac-caso-panel" role="tabpanel" aria-labelledby={`ac-caso-${c.id}`} className="mt-8 border-t border-[#F6F4EE]/15 pt-8">
          <p className="text-xs tracking-[0.2em] text-[#C3B6CF] uppercase">{c.sesiones}</p>
          <p className="mt-3 text-lg leading-relaxed text-[#F6F4EE]/85">{c.texto}</p>
        </div>
      </div>
    </div>
  );
}
