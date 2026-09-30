"use client";

import { useEffect, useRef, useState } from "react";
import { Icono } from "../shared/Icono";

const links = [
  ["#funciones", "Funciones"],
  ["#calculadora", "Calculadora"],
  ["#precios", "Precios"],
  ["#clientes", "Clientes"],
  ["#faq", "Preguntas"],
] as const;

export function Logo({ claro = false }: { claro?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      <svg viewBox="0 0 28 28" aria-hidden="true" className="size-7">
        <rect width="28" height="28" rx="8" fill="#4F46E5" />
        <path d="M19.5 9.2A7 7 0 1 0 19.5 18.8" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M11 14.2l2.2 2.2 4.3-4.6" fill="none" stroke="#6EE7B7" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className={`text-[1.15rem] font-semibold tracking-[-0.03em] ${claro ? "text-white" : "text-slate-900"}`}>cuentaclara</span>
    </span>
  );
}

export function Encabezado() {
  const [abierto, setAbierto] = useState(false);
  const [solido, setSolido] = useState(false);
  const boton = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const on = () => setSolido(window.scrollY > 8);
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
      className={`sticky top-0 z-40 border-b transition-colors duration-300 ${
        solido || abierto ? "border-slate-200/80 bg-white/80 backdrop-blur-xl" : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-6 px-5 sm:px-8">
        <a href="#inicio" aria-label="Cuentaclara, ir al inicio" className="rounded-lg">
          <Logo />
        </a>
        <nav aria-label="Secciones" className="hidden lg:block">
          <ul className="flex items-center gap-1 text-[14.5px] text-slate-600">
            {links.map(([href, label]) => (
              <li key={href}>
                <a href={href} className="rounded-lg px-3 py-2 transition-colors hover:bg-slate-100 hover:text-slate-900">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <span className="hidden rounded-lg px-3 py-2 text-[14.5px] text-slate-600 sm:inline" title="Demo: no hay inicio de sesión">
            Ingresar
          </span>
          <a
            href="#prueba"
            className="hidden rounded-lg bg-slate-900 px-4 py-2 text-[14.5px] font-medium text-white transition-colors hover:bg-slate-700 sm:inline-flex"
          >
            Probá gratis
          </a>
          <button
            ref={boton}
            type="button"
            aria-expanded={abierto}
            aria-controls="cc-menu"
            onClick={() => setAbierto((v) => !v)}
            className="inline-flex size-10 items-center justify-center rounded-lg text-slate-700 ring-1 ring-slate-200 transition-colors hover:bg-slate-100 lg:hidden"
          >
            <span className="sr-only">{abierto ? "Cerrar menú" : "Abrir menú"}</span>
            <Icono nombre={abierto ? "cruz" : "menu"} grosor={1.8} className="size-5" />
          </button>
        </div>
      </div>
      <div id="cc-menu" ref={panel} hidden={!abierto} className="border-t border-slate-100 lg:hidden">
        <nav aria-label="Secciones (menú)" className="mx-auto max-w-[1200px] px-5 py-4 sm:px-8">
          <ul className="grid grid-cols-1 gap-1">
            {links.map(([href, label]) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={() => setAbierto(false)}
                  className="flex items-center justify-between rounded-lg px-3 py-3 text-base text-slate-800 hover:bg-slate-50"
                >
                  {label}
                  <Icono nombre="flecha" grosor={1.8} className="size-4 text-slate-400" />
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#prueba"
            onClick={() => setAbierto(false)}
            className="mt-3 flex justify-center rounded-xl bg-[#4F46E5] px-4 py-3 font-medium text-white"
          >
            Probá gratis 14 días
          </a>
        </nav>
      </div>
    </header>
  );
}
