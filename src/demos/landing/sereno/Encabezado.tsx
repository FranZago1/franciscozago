"use client";

import { useEffect, useRef, useState } from "react";
import { Icono } from "../shared/Icono";

const serif = "[font-family:var(--font-ac-serif)]";

const links = [
  ["#tratamientos", "Tratamientos"],
  ["#resultados", "Resultados"],
  ["#equipo", "Equipo"],
  ["#experiencia", "Experiencia"],
  ["#ubicacion", "Ubicación"],
] as const;

export function Logo({ claro = false }: { claro?: boolean }) {
  const c = claro ? "#F6F4EE" : "#3E4C43";
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg viewBox="0 0 32 32" aria-hidden="true" className="size-8">
        <circle cx="16" cy="16" r="15" fill="none" stroke={c} strokeWidth="1.2" />
        <path d="M20 7.5a9 9 0 1 0 0 17 10.5 10.5 0 0 1 0-17z" fill="#C3B6CF" />
        <path d="M16 22c0-4 2-7 6-8" fill="none" stroke={c} strokeWidth="1.2" strokeLinecap="round" />
      </svg>
      <span className={`${serif} text-[1.45rem] leading-none tracking-[-0.01em]`} style={{ color: c }}>
        Alma <em className="font-light">Clara</em>
      </span>
    </span>
  );
}

export function Encabezado() {
  const [abierto, setAbierto] = useState(false);
  const [solido, setSolido] = useState(false);
  const boton = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const on = () => setSolido(window.scrollY > 16);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    if (!abierto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAbierto(false);
        boton.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    panel.current?.querySelector<HTMLElement>("a")?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [abierto]);

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,box-shadow] duration-500 ${
        solido || abierto ? "bg-[#F6F4EE]/85 shadow-[0_1px_0_rgba(62,76,67,0.1)] backdrop-blur-lg" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-[1240px] items-center justify-between gap-6 px-5 sm:px-8">
        <a href="#inicio" aria-label="Alma Clara, ir al inicio">
          <Logo />
        </a>
        <nav aria-label="Secciones" className="hidden lg:block">
          <ul className="flex items-center gap-9 text-[15px] text-[#3E4C43]">
            {links.map(([href, label]) => (
              <li key={href}>
                <a href={href} className="relative py-1 transition-colors hover:text-[#26302A] after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-500 hover:after:scale-x-100">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <a
            href="#turno"
            className="hidden rounded-full bg-[#3E4C43] px-5 py-2.5 text-[15px] text-[#F6F4EE] transition-colors hover:bg-[#26302A] sm:inline-flex"
          >
            Pedí tu turno
          </a>
          <button
            ref={boton}
            type="button"
            aria-expanded={abierto}
            aria-controls="ac-menu"
            onClick={() => setAbierto((v) => !v)}
            className="inline-flex size-11 items-center justify-center rounded-full text-[#3E4C43] ring-1 ring-[#3E4C43]/20 transition-colors hover:bg-[#3E4C43]/5 lg:hidden"
          >
            <span className="sr-only">{abierto ? "Cerrar menú" : "Abrir menú"}</span>
            <Icono nombre={abierto ? "cruz" : "menu"} grosor={1.4} className="size-5" />
          </button>
        </div>
      </div>
      <div id="ac-menu" ref={panel} hidden={!abierto} className="lg:hidden">
        <nav aria-label="Secciones (menú)" className="mx-auto max-w-[1240px] px-5 pt-2 pb-8 sm:px-8">
          <ul className="divide-y divide-[#3E4C43]/10 border-y border-[#3E4C43]/10">
            {links.map(([href, label]) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={() => setAbierto(false)}
                  className={`${serif} flex items-center justify-between py-4 text-[1.7rem] font-light text-[#26302A]`}
                >
                  {label}
                  <Icono nombre="flecha" grosor={1.2} className="size-5 text-[#3E4C43]/50" />
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#turno"
            onClick={() => setAbierto(false)}
            className="mt-6 flex justify-center rounded-full bg-[#3E4C43] px-5 py-3.5 text-[#F6F4EE]"
          >
            Pedí tu turno
          </a>
        </nav>
      </div>
    </header>
  );
}
