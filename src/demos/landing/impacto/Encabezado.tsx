"use client";

import { useEffect, useRef, useState } from "react";
import { Icono } from "../shared/Icono";

const display = "[font-family:var(--font-fn-display)]";

const links = [
  ["#disciplinas", "Disciplinas"],
  ["#horarios", "Horarios"],
  ["#coaches", "Coaches"],
  ["#planes", "Planes"],
  ["#preguntas", "Preguntas"],
] as const;

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 32 32" aria-hidden="true" className="size-8 shrink-0">
        <rect width="32" height="32" fill="#FF4D00" />
        <path d="M7 25V7h5l8 11V7h5v18h-5L12 14v11z" fill="#0A0A0A" />
        <path d="M25 7l-4 0 4-4z" fill="#0A0A0A" />
      </svg>
      <span className={`${display} text-[1.35rem] leading-none tracking-[0.04em] text-[#F2EEE6] uppercase`}>
        Fuerza Norte
      </span>
    </span>
  );
}

export function Encabezado() {
  const [abierto, setAbierto] = useState(false);
  const [solido, setSolido] = useState(false);
  const botonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setSolido(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!abierto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAbierto(false);
        botonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [abierto]);

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,border-color] duration-300 ${
        solido || abierto ? "border-b border-white/10 bg-[#0A0A0A]/92 backdrop-blur-md" : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between gap-6 px-4 sm:px-8 md:h-20">
        <a href="#inicio" aria-label="Fuerza Norte, ir al inicio" className="focus-visible:outline-offset-4">
          <Logo />
        </a>
        <nav aria-label="Secciones" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {links.map(([href, label]) => (
              <li key={href}>
                <a
                  href={href}
                  className="relative text-sm font-semibold tracking-[0.12em] text-white/75 uppercase transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-0 after:bg-[#FF4D00] after:transition-[width] after:duration-300 hover:text-white hover:after:w-full"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <a
            href="#reserva"
            className="hidden items-center gap-2 bg-[#FF4D00] px-5 py-3 text-sm font-bold tracking-wide text-black uppercase transition-colors hover:bg-[#FF6A2B] sm:inline-flex"
          >
            Clase de prueba
            <Icono nombre="flecha" grosor={2.6} cuadrado className="size-4" />
          </a>
          <button
            ref={botonRef}
            type="button"
            aria-expanded={abierto}
            aria-controls="fn-menu"
            onClick={() => setAbierto((v) => !v)}
            className="inline-flex size-11 items-center justify-center border border-white/20 text-[#F2EEE6] transition-colors hover:border-white/50 lg:hidden"
          >
            <span className="sr-only">{abierto ? "Cerrar menú" : "Abrir menú"}</span>
            <Icono nombre={abierto ? "cruz" : "menu"} grosor={2.4} cuadrado className="size-5" />
          </button>
        </div>
      </div>
      <div id="fn-menu" ref={panelRef} hidden={!abierto} className="border-t border-white/10 bg-[#0A0A0A] lg:hidden">
        <nav aria-label="Secciones (menú)" className="mx-auto max-w-[1320px] px-4 py-6 sm:px-8">
          <ul className="space-y-1">
            {links.map(([href, label], i) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={() => setAbierto(false)}
                  className={`${display} flex items-baseline gap-4 py-2 text-4xl text-[#F2EEE6] uppercase transition-colors hover:text-[#FF4D00]`}
                >
                  <span className="text-sm text-[#FF4D00] [font-family:var(--font-fn-sans)] font-bold">0{i + 1}</span>
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#reserva"
            onClick={() => setAbierto(false)}
            className="mt-6 flex items-center justify-between bg-[#FF4D00] px-5 py-4 text-sm font-bold tracking-wide text-black uppercase"
          >
            Reservá tu clase de prueba
            <Icono nombre="flecha" grosor={2.6} cuadrado className="size-5" />
          </a>
        </nav>
      </div>
    </header>
  );
}
