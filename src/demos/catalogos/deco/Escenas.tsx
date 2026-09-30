"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { ars } from "../shared/formato";
import { ESCENAS, PRODUCTO_POR_ID, imagenProducto, type Hotspot } from "./datos";
import { IcFlecha, IcMas } from "./ui";

const serif = "[font-family:var(--font-nido-serif)]";

function Tarjeta({
  h,
  onVer,
  onAgregar,
  className = "",
}: {
  h: Hotspot;
  onVer: (id: string, v: string) => void;
  onAgregar: (id: string, v: string) => void;
  className?: string;
}) {
  const p = PRODUCTO_POR_ID.get(h.id);
  if (!p) return null;
  const variante = p.variantes.find((x) => x.id === h.v) ?? p.variantes[0]!;
  return (
    <div
      className={`flex gap-3.5 rounded-xl bg-[#FBF8F3] p-3 text-left shadow-[0_18px_40px_-20px_rgba(34,28,23,0.55)] ring-1 ring-[#221C17]/8 ${className}`}
    >
      <div className="relative size-[84px] shrink-0 overflow-hidden rounded-lg bg-[#EDE6DA]">
        <Image src={imagenProducto(p.id, variante.id)} alt="" fill sizes="84px" className="object-cover" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="text-[11px] tracking-[0.14em] text-[#6E6258] uppercase">{p.tipo}</p>
        <p className={`${serif} text-[22px] leading-tight text-[#221C17]`}>{p.nombre}</p>
        <p className="mt-0.5 text-[13px] text-[#6E6258]">
          {variante.nombre} · {p.precio ? ars(p.precio) : "Consultar"}
        </p>
        <div className="mt-auto flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={() => onVer(p.id, variante.id)}
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#2F4538] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4538]"
          >
            Ver ficha <IcFlecha className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onAgregar(p.id, variante.id)}
            aria-label={`Agregar ${p.nombre} a la lista`}
            className="ml-auto grid size-8 place-items-center rounded-full bg-[#2F4538] text-[#F4EFE7] transition hover:bg-[#243629] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4538]"
          >
            <IcMas className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

/** Ambientes ilustrados con puntos clickeables que muestran cada producto. */
export function Escenas({ onVer, onAgregar }: { onVer: (id: string, v: string) => void; onAgregar: (id: string, v: string) => void }) {
  const [i, setI] = useState(0);
  const [activo, setActivo] = useState<string | null>(null);
  const contenedor = useRef<HTMLDivElement>(null);
  const pan = useRef<HTMLDivElement>(null);

  // En pantallas chicas la escena es más ancha que el contenedor: arrancamos centrados.
  useEffect(() => {
    const el = pan.current;
    if (el) el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
  }, [i]);
  const uid = useId();
  const escena = ESCENAS[i]!;
  const hot = escena.hotspots.find((h) => h.id === activo) ?? null;

  useEffect(() => {
    if (!activo) return;
    const fuera = (e: PointerEvent) => {
      if (contenedor.current && !contenedor.current.contains(e.target as Node)) setActivo(null);
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActivo(null);
    };
    document.addEventListener("pointerdown", fuera);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", fuera);
      document.removeEventListener("keydown", esc);
    };
  }, [activo]);

  const moverTab = (dir: number) => {
    const n = (i + dir + ESCENAS.length) % ESCENAS.length;
    setI(n);
    setActivo(null);
    document.getElementById(`${uid}-tab-${n}`)?.focus();
  };

  return (
    <div ref={contenedor}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div role="tablist" aria-label="Ambientes" className="flex gap-1 rounded-full bg-[#EDE6DA] p-1">
          {ESCENAS.map((e, n) => (
            <button
              key={e.id}
              id={`${uid}-tab-${n}`}
              role="tab"
              type="button"
              aria-selected={n === i}
              aria-controls={`${uid}-panel`}
              tabIndex={n === i ? 0 : -1}
              onClick={() => {
                setI(n);
                setActivo(null);
              }}
              onKeyDown={(ev) => {
                if (ev.key === "ArrowRight") moverTab(1);
                if (ev.key === "ArrowLeft") moverTab(-1);
              }}
              className={`rounded-full px-4 py-2 text-[13px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4538] sm:px-5 ${
                n === i ? "bg-[#221C17] text-[#F4EFE7]" : "text-[#4A4039] hover:text-[#221C17]"
              }`}
            >
              {e.nombre}
            </button>
          ))}
        </div>
        <p className="hidden text-[13px] text-[#6E6258] sm:block">Tocá los puntos para ver cada pieza</p>
      </div>

      <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${i}`} className="mt-5">
        <div
          ref={pan}
          className="overflow-x-auto overflow-y-hidden rounded-[18px] bg-[#E8DDCD] [scrollbar-width:none] sm:rounded-[22px] md:overflow-visible [&::-webkit-scrollbar]:hidden"
        >
          <div className="relative aspect-[16/10] w-[175%] overflow-hidden sm:w-[130%] md:w-full">
            {ESCENAS.map((e, n) => (
              <Image
                key={e.id}
                src={`/demos/catalogos/deco/ambiente-${e.id}.webp`}
                alt={n === i ? e.alt : ""}
                aria-hidden={n !== i}
                fill
                priority={n === 0}
                sizes="(min-width: 1280px) 1200px, (min-width: 768px) 100vw, 175vw"
                className={`object-cover transition-opacity duration-500 motion-reduce:transition-none ${n === i ? "opacity-100" : "opacity-0"}`}
              />
            ))}
            {escena.hotspots.map((h) => {
              const p = PRODUCTO_POR_ID.get(h.id);
              if (!p) return null;
              const abierto = activo === h.id;
              return (
                <button
                  key={`${escena.id}-${h.id}`}
                  type="button"
                  onClick={() => setActivo(abierto ? null : h.id)}
                  aria-expanded={abierto}
                  aria-label={`${p.nombre}: ${abierto ? "ocultar" : "ver"} detalle`}
                  style={{ left: `${h.x}%`, top: `${h.y}%` }}
                  className="group absolute z-10 grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <span
                    className={`absolute inset-0 rounded-full bg-white/45 motion-safe:animate-[nido-pulso_2.4s_ease-out_infinite] ${abierto ? "opacity-0" : ""}`}
                    aria-hidden="true"
                  />
                  <span
                    className={`relative grid size-6 place-items-center rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.25)] transition-all duration-200 sm:size-7 ${
                      abierto ? "scale-110 bg-[#2F4538] text-white" : "bg-[#FBF8F3] text-[#221C17] group-hover:scale-110"
                    }`}
                    aria-hidden="true"
                  >
                    <IcMas className={`size-3 transition-transform duration-200 ${abierto ? "rotate-45" : ""}`} />
                  </span>
                </button>
              );
            })}
            {hot ? (
              <div
                className="pointer-events-none absolute z-20 hidden w-[330px] md:block"
                style={{
                  left: `${hot.x}%`,
                  top: `${hot.y}%`,
                  transform: `translate(${hot.x > 58 ? "calc(-100% - 26px)" : "26px"}, ${hot.y > 60 ? "calc(-100% + 30px)" : "-30px"})`,
                }}
              >
                <Tarjeta
                  h={hot}
                  onVer={onVer}
                  onAgregar={onAgregar}
                  className="pointer-events-auto motion-safe:animate-[nido-entrar_0.25s_ease-out]"
                />
              </div>
            ) : null}
          </div>
        </div>
        <p className="mt-2 flex items-center gap-2 text-[12px] text-[#6E6258] md:hidden">
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M8 8l-4 4 4 4M16 8l4 4-4 4M4 12h16" />
          </svg>
          Deslizá la imagen para recorrer el ambiente y tocá los puntos.
        </p>
        {hot ? <Tarjeta h={hot} onVer={onVer} onAgregar={onAgregar} className="mt-3 md:hidden" /> : null}

        <div className="mt-5">
          <p className="text-[11px] tracking-[0.16em] text-[#6E6258] uppercase">En este ambiente</p>
          <ul className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
            {escena.hotspots.map((h) => {
              const p = PRODUCTO_POR_ID.get(h.id)!;
              return (
                <li key={h.id} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => onVer(h.id, h.v)}
                    className="flex items-center gap-2.5 rounded-full border border-[#DCD2C3] bg-[#FBF8F3] py-1 pr-4 pl-1 text-[13px] text-[#221C17] transition hover:border-[#221C17] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4538]"
                  >
                    <span className="relative size-8 overflow-hidden rounded-full bg-[#EDE6DA]">
                      <Image src={imagenProducto(h.id, h.v)} alt="" fill sizes="32px" className="scale-125 object-cover" />
                    </span>
                    {p.nombre}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
