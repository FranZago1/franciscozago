"use client";

import Image from "next/image";
import { Icon } from "../shared/Icon";
import { pesos } from "../shared/utils";
import { avisos, categorias } from "./data";
import { useUsados } from "./store";
import { Logo, boton, caja, display, foco } from "./ui";

export function Header() {
  const { filtros, setFiltro, favs, irA } = useUsados();
  return (
    <header className="sticky top-0 z-40 border-b-[2.5px] border-(--sv-negro) bg-(--sv-fondo)">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:h-[4.5rem] sm:gap-5 sm:px-6 lg:px-8">
        <a href="#inicio" className={`shrink-0 rounded-full ${foco}`}>
          <Logo />
          <span className="sr-only">, inicio</span>
        </a>
        <form
          role="search"
          className="ml-2 hidden min-w-0 flex-1 md:block"
          onSubmit={(e) => {
            e.preventDefault();
            irA("avisos");
          }}
        >
          <label htmlFor="sv-buscar-header" className="sr-only">
            Buscar avisos
          </label>
          <div className="flex max-w-md items-center gap-2 rounded-full border-[2.5px] border-(--sv-negro) bg-white px-4 focus-within:shadow-[3px_3px_0_#7B5CFF]">
            <Icon name="search" size={19} stroke={2.4} />
            <input
              id="sv-buscar-header"
              type="search"
              value={filtros.q}
              onChange={(e) => setFiltro("q", e.target.value)}
              placeholder="Buscá bicis, sillones, guitarras…"
              className="min-w-0 flex-1 bg-transparent py-2.5 text-[0.95rem] font-medium outline-none placeholder:text-(--sv-gris)/70"
            />
          </div>
        </form>
        <div className="ml-auto flex shrink-0 items-center gap-2 pr-1 sm:gap-3 sm:pr-0">
          <button
            type="button"
            onClick={() => {
              setFiltro("soloFavs", true);
              irA("avisos");
            }}
            className={`${boton} relative size-10 bg-white p-0 sm:size-11`}
            aria-label={`Ver mis favoritos (${favs.length})`}
          >
            <Icon name="heart" size={20} stroke={2.4} filled={favs.length > 0} className={favs.length ? "text-(--sv-rosa)" : ""} />
            {favs.length > 0 && (
              <span className="absolute -right-1.5 -top-1.5 grid min-w-5 place-items-center rounded-full border-2 border-(--sv-negro) bg-(--sv-amarillo) px-1 text-[0.7rem] font-extrabold tabular-nums">
                {favs.length}
              </span>
            )}
          </button>
          <button type="button" onClick={() => irA("publicar")} className={`${boton} bg-(--sv-violeta) px-3 py-2.5 text-sm text-white sm:px-4`}>
            <Icon name="plus" size={17} stroke={2.8} className="hidden min-[400px]:block" />
            <span className="hidden sm:inline">Publicá tu aviso</span>
            <span className="sm:hidden">Publicar</span>
          </button>
        </div>
      </div>
    </header>
  );
}

const frases = ["Vendé lo que no usás", "Comprá con onda", "Sin comisión para particulares", "Chat con el vendedor", "Favoritos que no se pierden", "Todo tiene una segunda vuelta"];

export function Marquesina() {
  const fila = (
    <span className="flex shrink-0 items-center">
      {frases.map((f) => (
        <span key={f} className="flex items-center">
          <span className="px-5">{f}</span>
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2l2.6 6.4L21 11l-6.4 2.6L12 20l-2.6-6.4L3 11l6.4-2.6z" fill="#FFE14D" stroke="#141414" strokeWidth="1.5" />
          </svg>
        </span>
      ))}
    </span>
  );
  return (
    <div className="overflow-hidden border-b-[2.5px] border-(--sv-negro) bg-(--sv-rosa) py-2.5" aria-hidden="true">
      <style>{`@keyframes sv-marquesina{from{transform:translateX(0)}to{transform:translateX(-50%)}}.sv-marquesina{animation:sv-marquesina 38s linear infinite}@media (prefers-reduced-motion: reduce){.sv-marquesina{animation:none}}`}</style>
      <div className={`${display} sv-marquesina flex w-max text-sm font-extrabold uppercase tracking-wide sm:text-base`}>
        {fila}
        {fila}
      </div>
    </div>
  );
}

const collage = [
  { id: "sillon-pana", rot: "-rotate-6", pos: "left-0 top-6 w-[46%]", color: "bg-(--sv-violeta)", precio: "bottom-2 left-2" },
  { id: "bici-urbana", rot: "rotate-3", pos: "right-0 top-0 w-[52%]", color: "bg-(--sv-amarillo)", precio: "top-2 right-2" },
  { id: "camara-analogica", rot: "rotate-6", pos: "left-[6%] bottom-0 w-[42%]", color: "bg-(--sv-amarillo)", precio: "bottom-2 left-2" },
  { id: "guitarra-criolla", rot: "-rotate-3", pos: "right-[4%] bottom-4 w-[46%]", color: "bg-(--sv-celeste)", precio: "bottom-2 right-2" },
];

export function Hero() {
  const { irA, setDetalle } = useUsados();
  return (
    <section id="inicio" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-10 sm:px-6 sm:pt-14 lg:grid-cols-[1.1fr_1fr] lg:px-8 lg:pb-24 lg:pt-16">
        <div>
          <p className={`inline-flex items-center gap-2 rounded-full ${caja} bg-white px-3 py-1 text-sm font-bold shadow-[3px_3px_0_#141414]`}>
            <span className="size-2.5 rounded-full border-2 border-(--sv-negro) bg-(--sv-verde)" />
            238 avisos nuevos hoy en Córdoba
          </p>
          <h1 className={`${display} mt-6 text-[clamp(3rem,9vw,6.4rem)] font-extrabold leading-[0.88] tracking-[-0.045em]`}>
            Todo tiene una{" "}
            <span className="relative mt-2 inline-block -rotate-2 rounded-2xl border-[3px] border-(--sv-negro) bg-(--sv-amarillo) px-3 pb-2 shadow-[6px_6px_0_#141414]">
              segunda vuelta.
            </span>
          </h1>
          <p className="mt-8 max-w-lg text-lg font-medium text-(--sv-gris)">
            Comprá y vendé usados entre vecinos: bicis, muebles, electrónica, ropa e instrumentos. Chateás directo, ofertás y
            coordinás. Sin vueltas (bueno, una sola).
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={() => irA("avisos")} className={`${boton} bg-(--sv-negro) px-6 py-3.5 text-white`}>
              Explorar avisos
              <Icon name="arrowRight" size={18} stroke={2.6} />
            </button>
            <button type="button" onClick={() => irA("publicar")} className={`${boton} bg-(--sv-verde) px-6 py-3.5`}>
              <Icon name="camera" size={18} stroke={2.4} />
              Publicá gratis
            </button>
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold">
            {[
              ["12.400", "avisos activos"],
              ["0 %", "de comisión"],
              ["4,8", "promedio de vendedores"],
            ].map(([n, t]) => (
              <li key={t} className="flex items-baseline gap-1.5">
                <span className={`${display} text-2xl font-extrabold`}>{n}</span>
                <span className="text-(--sv-gris)">{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[34rem]">
          {collage.map((c) => {
            const a = avisos.find((x) => x.id === c.id)!;
            const img = a.imagenes[0]!;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setDetalle(a.id)}
                className={`group absolute ${c.pos} ${c.rot} overflow-hidden rounded-2xl ${caja} bg-white transition hover:z-10 hover:rotate-0 hover:scale-[1.03] ${foco}`}
                aria-label={`Ver aviso: ${a.titulo}, ${pesos(a.precio)}`}
              >
                <Image src={img.src} alt="" width={600} height={600} sizes="(min-width: 1024px) 260px, 45vw" className="aspect-square h-auto w-full" priority={c.id === "bici-urbana"} />
                <span className={`${display} absolute ${c.precio} rounded-full border-2 border-(--sv-negro) ${c.color === "bg-(--sv-amarillo)" ? "bg-white" : c.color} px-2.5 py-0.5 text-sm font-extrabold ${c.color.includes("violeta") ? "text-white" : ""}`}>
                  {pesos(a.precio)}
                </span>
              </button>
            );
          })}
          <span
            aria-hidden="true"
            className={`${display} absolute left-[40%] top-[42%] z-20 grid size-24 rotate-12 place-items-center rounded-full border-[3px] border-(--sv-negro) bg-(--sv-rosa) text-center text-sm font-extrabold uppercase leading-tight shadow-[4px_4px_0_#141414] sm:size-28 sm:text-base`}
          >
            Sin
            <br />
            comisión
          </span>
        </div>
      </div>
    </section>
  );
}

export function Categorias() {
  const { setFiltro, irA, avisos: todos } = useUsados();
  return (
    <section aria-labelledby="cat-titulo" className="border-y-[2.5px] border-(--sv-negro) bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 id="cat-titulo" className={`${display} text-4xl font-extrabold tracking-[-0.03em] sm:text-5xl`}>
          ¿Qué andás buscando?
        </h2>
        <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categorias.map((c, i) => (
            <li key={c.id} className={i === 4 ? "col-span-2 sm:col-span-1" : ""}>
              <button
                type="button"
                onClick={() => {
                  setFiltro("categoria", c.id);
                  irA("avisos");
                }}
                className={`group relative flex h-full w-full flex-col justify-between overflow-hidden rounded-3xl ${caja} p-5 text-left transition hover:-translate-y-1 hover:shadow-[6px_7px_0_#141414] ${foco}`}
                style={{ background: c.color }}
              >
                <span>
                  <span className={`${display} block text-[1.2rem] font-extrabold tracking-[-0.02em] sm:text-2xl`}>{c.nombre}</span>
                  <span className="mt-1 block text-sm font-medium">{c.texto}</span>
                </span>
                <span className="mt-6 flex items-end justify-between">
                  <span className="rounded-full border-2 border-(--sv-negro) bg-white px-2.5 py-0.5 text-xs font-extrabold">
                    {todos.filter((a) => a.categoria === c.id).length} avisos
                  </span>
                  <span className="grid size-10 place-items-center rounded-full border-2 border-(--sv-negro) bg-white transition group-hover:rotate-[-45deg]">
                    <Icon name="arrowRight" size={18} stroke={2.6} />
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
