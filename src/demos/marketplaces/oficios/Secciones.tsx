"use client";

import Image from "next/image";
import { useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Icon } from "../shared/Icon";
import { oficios, profesionalPorId, profesionales, sugerencias, type OficioId } from "./data";
import { useOficios } from "./store";
import { Estrellas, Logo, Verificado, ancho, cinta, foco, mono } from "./ui";

const nav = [
  ["como-funciona", "Cómo funciona"],
  ["profesionales", "Profesionales"],
  ["sumate", "Sumate como profesional"],
] as const;

export function Header() {
  const { irA } = useOficios();
  return (
    <header className="sticky top-0 z-40 border-b border-(--ma-linea) bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a href="#inicio" className={`rounded-md ${foco}`} aria-label="ManoAmiga, inicio">
          <Logo />
        </a>
        <nav aria-label="Secciones" className="hidden md:block">
          <ul className="flex items-center gap-1 text-[0.95rem] font-semibold text-(--ma-tinta)/80">
            {nav.map(([id, label]) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    irA(id);
                  }}
                  className={`rounded-md px-3 py-2 transition hover:bg-(--ma-fondo) hover:text-(--ma-azul) ${foco}`}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <button
          type="button"
          onClick={() => {
            irA("inicio");
            window.setTimeout(() => document.getElementById("ma-buscar")?.focus({ preventScroll: true }), 350);
          }}
          className={`whitespace-nowrap rounded-lg bg-(--ma-azul) px-3.5 py-2.5 text-sm font-bold text-white transition hover:bg-(--ma-azul2) sm:px-4 ${foco}`}
        >
          <span className="sm:hidden">Presupuesto</span>
          <span className="hidden sm:inline">Pedir presupuesto</span>
        </button>
      </div>
    </header>
  );
}

const claves: [RegExp, OficioId][] = [
  [/agua|canilla|ca[ñn]o|ca[ñn]er|inodoro|ba[ñn]o|p[eé]rdida|destap|termotanque|grifer/, "plomeria"],
  [/luz|enchufe|t[eé]rmica|toma|cable|tablero|disyuntor|l[aá]mpara|electric/, "electricidad"],
  [/gas|calef[oó]n|estufa|horno|cocina a gas|hornalla|gasista/, "gas"],
  [/pint|humedad|pared|revoque|mancha|durlock|techo/, "pintura"],
  [/puerta|mueble|madera|placard|caj[oó]n|bisagra|carpinter|mesa/, "carpinteria"],
  [/aire|split|fr[ií]o|enfr[ií]a|refrigera|calor/, "aire"],
];

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function Hero() {
  const { setFiltro, setProblema, irA } = useOficios();
  const [texto, setTexto] = useState("");
  const [abierto, setAbierto] = useState(false);
  const [activo, setActivo] = useState(-1);
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const opciones = useMemo(() => {
    const t = norm(texto.trim());
    if (!t) return sugerencias.slice(0, 6);
    return sugerencias.filter((s) => norm(s.texto).includes(t) || norm(oficios.find((o) => o.id === s.oficio)!.nombre).includes(t)).slice(0, 6);
  }, [texto]);

  function elegir(textoProblema: string, oficio: OficioId | null) {
    setTexto(textoProblema);
    setProblema(textoProblema);
    setFiltro("oficio", oficio);
    setAbierto(false);
    setActivo(-1);
    irA("profesionales");
  }

  function buscar() {
    const op = activo >= 0 ? opciones[activo] : undefined;
    if (op) return elegir(op.texto, op.oficio);
    const t = norm(texto);
    const encontrado = claves.find(([re]) => re.test(t));
    elegir(texto.trim(), encontrado ? encontrado[1] : null);
  }

  function onKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setAbierto(true);
      setActivo((a) => (a + 1) % Math.max(1, opciones.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActivo((a) => (a <= 0 ? opciones.length - 1 : a - 1));
    } else if (e.key === "Escape") {
      if (abierto) {
        e.preventDefault();
        setAbierto(false);
        setActivo(-1);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      buscar();
    }
  }

  const mostrarLista = abierto && opciones.length > 0;
  const diego = profesionalPorId["diego-ferreyra"]!;

  return (
    <section id="inicio" className="relative isolate overflow-hidden bg-(--ma-azul) text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-[0.14] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_at_30%_40%,#000_20%,transparent_75%)]"
      />
      <div aria-hidden="true" className="absolute -right-40 -top-40 -z-10 size-[34rem] rounded-full bg-(--ma-azul3)/40 blur-3xl" />
      <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-20 pt-12 sm:px-6 sm:pt-16 lg:grid-cols-[1.15fr_1fr] lg:gap-10 lg:px-8 lg:pb-28 lg:pt-20">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[0.82rem] font-semibold ring-1 ring-white/15">
            <Icon name="shield" size={16} stroke={2.2} className="text-(--ma-amarillo)" />
            1.240 profesionales con matrícula verificada en Córdoba
          </p>
          <h1 className={`${ancho} mt-6 text-[clamp(2.5rem,6.6vw,4.6rem)] font-extrabold leading-[0.98] tracking-[-0.03em]`}>
            Arreglalo con alguien <span className="relative inline-block text-(--ma-amarillo)">de confianza.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/75">
            Contanos qué pasa y compará plomeros, electricistas, gasistas y más, con reseñas reales y presupuesto sin
            compromiso.
          </p>

          <div className="relative mt-8 max-w-xl">
            <label htmlFor="ma-buscar" className={`${ancho} mb-2 block text-sm font-bold uppercase tracking-[0.12em] text-(--ma-amarillo)`}>
              ¿Qué necesitás arreglar?
            </label>
            <div className="flex items-stretch gap-2 rounded-xl bg-white p-1.5 shadow-[0_18px_40px_-16px_rgba(0,0,0,0.6)] ring-4 ring-transparent transition focus-within:ring-(--ma-amarillo)/60">
              <Icon name="wrench" size={22} className="ml-2.5 shrink-0 self-center text-(--ma-azul3)" />
              <input
                ref={inputRef}
                id="ma-buscar"
                role="combobox"
                aria-expanded={mostrarLista}
                aria-controls={listId}
                aria-autocomplete="list"
                aria-activedescendant={activo >= 0 ? `${listId}-${activo}` : undefined}
                autoComplete="off"
                value={texto}
                onChange={(e) => {
                  setTexto(e.target.value);
                  setAbierto(true);
                  setActivo(-1);
                }}
                onFocus={() => setAbierto(true)}
                onBlur={() => window.setTimeout(() => setAbierto(false), 120)}
                onKeyDown={onKey}
                placeholder="Ej.: pierde agua la canilla"
                className="min-w-0 flex-1 bg-transparent py-3 text-base text-(--ma-tinta) outline-none placeholder:text-(--ma-gris)/70"
              />
              <button
                type="button"
                onClick={buscar}
                className={`shrink-0 rounded-lg bg-(--ma-amarillo) px-4 text-sm font-extrabold text-(--ma-azul) transition hover:bg-(--ma-amarillo2) sm:px-6 ${foco}`}
              >
                Buscar
              </button>
            </div>
            <ul
              id={listId}
              role="listbox"
              aria-label="Problemas frecuentes"
              className={`absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-xl bg-white py-1.5 text-(--ma-tinta) shadow-[0_24px_50px_-20px_rgba(0,0,0,0.55)] ring-1 ring-(--ma-linea) ${mostrarLista ? "" : "hidden"}`}
            >
              {!texto && <li className="px-4 pb-1 pt-2 text-xs font-bold uppercase tracking-wider text-(--ma-gris)" role="presentation">Lo más pedido</li>}
              {opciones.map((s, i) => {
                const o = oficios.find((x) => x.id === s.oficio)!;
                return (
                  <li
                    key={s.texto}
                    id={`${listId}-${i}`}
                    role="option"
                    aria-selected={activo === i}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => elegir(s.texto, s.oficio)}
                    onMouseEnter={() => setActivo(i)}
                    className={`flex cursor-pointer items-center gap-3 px-4 py-2.5 ${activo === i ? "bg-(--ma-fondo)" : ""}`}
                  >
                    <span className="grid size-8 shrink-0 place-items-center rounded-md text-white" style={{ background: o.color }}>
                      <Icon name={o.icono} size={17} stroke={2.2} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold">{s.texto}</span>
                      <span className="block text-xs text-(--ma-gris)">{o.nombre}</span>
                    </span>
                    {s.urgente && <span className="rounded bg-(--ma-rojo)/10 px-1.5 py-0.5 text-[0.7rem] font-bold text-(--ma-rojo)">Urgente</span>}
                  </li>
                );
              })}
            </ul>
          </div>

          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Buscar por oficio">
            {oficios.map((o) => (
              <li key={o.id}>
                <button
                  type="button"
                  onClick={() => elegir("", o.id)}
                  className={`inline-flex items-center gap-1.5 rounded-full bg-white/8 px-3 py-1.5 text-sm font-semibold text-white/90 ring-1 ring-white/15 transition hover:bg-white/15 ${foco}`}
                >
                  <Icon name={o.icono} size={15} stroke={2.2} className="text-(--ma-amarillo)" />
                  {o.nombre}
                </button>
              </li>
            ))}
          </ul>

          <ul className="mt-10 grid max-w-xl gap-4 text-sm sm:grid-cols-3">
            {[
              ["shield", "Matrícula verificada", "Controlamos cada matrícula antes de publicar."],
              ["star", "Reseñas reales", "Solo opinan quienes contrataron."],
              ["tag", "Presupuesto sin cargo", "Compará antes de decidir."],
            ].map(([ic, t, d]) => (
              <li key={t} className="flex gap-3 sm:block">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-(--ma-amarillo) text-(--ma-azul)">
                  <Icon name={ic as "shield"} size={19} stroke={2.2} />
                </span>
                <span>
                  <strong className="block sm:mt-3">{t}</strong>
                  <span className="text-white/65">{d}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Maqueta de la app: tarjetas reales con datos ficticios */}
        <div className="relative mx-auto hidden w-full max-w-md lg:block" aria-hidden="true">
          <div className="relative z-10 ml-auto mr-2 w-fit rotate-[3deg] rounded-2xl bg-(--ma-azul2) p-3 shadow-[0_16px_30px_-14px_rgba(0,0,0,0.6)] ring-1 ring-white/15">
            <div className="flex -space-x-3">
              {profesionales.slice(4, 8).map((p) => (
                <Image key={p.id} src={p.imagen} alt="" width={44} height={44} sizes="44px" className="size-11 rounded-full ring-2 ring-(--ma-azul)" />
              ))}
            </div>
            <p className="mt-2 text-xs font-semibold text-white/80">+38 disponibles hoy</p>
          </div>
          <div className="relative -mt-5 ml-6 rounded-2xl bg-white p-5 text-(--ma-tinta) shadow-[0_30px_60px_-24px_rgba(0,0,0,0.7)]">
            <div className="flex gap-4">
              <Image src={diego.imagen} alt="" width={84} height={84} sizes="84px" className="size-[84px] rounded-xl" />
              <div className="min-w-0">
                <p className={`${ancho} text-lg font-extrabold`}>{diego.nombre}</p>
                <p className="text-sm text-(--ma-gris)">Electricista · 18 años</p>
                <div className="mt-1.5 flex items-center gap-1.5 text-sm">
                  <Estrellas valor={diego.rating} size={14} />
                  <strong>4,9</strong>
                  <span className="text-(--ma-gris)">(301)</span>
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Verificado matricula={diego.matricula} chico />
              <span className="inline-flex items-center gap-1.5 rounded-md bg-(--ma-fondo) px-2 py-1 text-[0.72rem] font-semibold text-(--ma-azul)">
                <Icon name="clock" size={14} stroke={2.2} />
                Responde en ~8 min
              </span>
            </div>
            <div className={`mt-5 h-2 rounded-full ${cinta}`} />
            <div className="mt-5 flex gap-2">
              <span className="flex-1 rounded-lg border border-(--ma-linea) py-2.5 text-center text-sm font-bold text-(--ma-azul)">Ver perfil</span>
              <span className="flex-1 rounded-lg bg-(--ma-amarillo) py-2.5 text-center text-sm font-extrabold text-(--ma-azul)">Pedir presupuesto</span>
            </div>
          </div>
          <div className="relative -mt-4 ml-auto mr-[-1rem] w-72 rotate-[2deg] rounded-2xl bg-(--ma-verde) p-4 text-white shadow-[0_24px_40px_-18px_rgba(0,0,0,0.6)]">
            <p className="flex items-center gap-2 text-sm font-bold">
              <span className="grid size-6 place-items-center rounded-full bg-white text-(--ma-verde)">
                <Icon name="check" size={15} stroke={3} />
              </span>
              Presupuesto recibido
            </p>
            <p className="mt-2 text-sm text-white/85">Diego: “Puedo ir hoy a las 16 h. El cambio de térmica sale</p>
            <p className={`${mono} mt-1 text-2xl font-semibold`}>$ 38.000”</p>
          </div>
        </div>
      </div>
      <div className={`h-3 ${cinta}`} aria-hidden="true" />
    </section>
  );
}

export function OficiosGrid() {
  const { setFiltro, irA } = useOficios();
  const reales: Record<OficioId, number> = { plomeria: 312, electricidad: 288, gas: 141, pintura: 236, carpinteria: 118, aire: 145 };
  return (
    <section aria-labelledby="oficios-titulo" className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="oficios-titulo" className={`${ancho} text-3xl font-extrabold tracking-[-0.02em] text-(--ma-azul) sm:text-4xl`}>
            Elegí el oficio
          </h2>
          <p className="text-(--ma-gris)">Seis rubros, todos con profesionales verificados.</p>
        </div>
        <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {oficios.map((o) => (
            <li key={o.id}>
              <button
                type="button"
                onClick={() => {
                  setFiltro("oficio", o.id);
                  irA("profesionales");
                }}
                className={`group flex h-full w-full flex-col items-start rounded-xl border-2 border-(--ma-linea) bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-(--ma-azul) hover:shadow-[6px_6px_0_#0B2A5B] ${foco}`}
              >
                <span className="grid size-12 place-items-center rounded-lg text-white transition group-hover:scale-105" style={{ background: o.color }}>
                  <Icon name={o.icono} size={24} stroke={2.2} />
                </span>
                <span className={`${ancho} mt-4 text-[1.05rem] font-extrabold leading-tight text-(--ma-tinta)`}>{o.nombre}</span>
                <span className="mt-1 text-sm text-(--ma-gris)">
                  <span className={`${mono} font-medium text-(--ma-azul)`}>{reales[o.id]}</span> profesionales
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
