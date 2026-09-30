"use client";

import Image from "next/image";
import { useId, useMemo, useState, type FormEvent } from "react";
import { Icon } from "../shared/Icon";
import { pesos } from "../shared/utils";
import { categorias, productorPorId, productores, productos, type CategoriaId } from "./data";
import { useMercado } from "./store";
import { Estrellas, IconoCategoria, Logo, Stepper, display, foco } from "./ui";

const nav = [
  ["productos", "Productos"],
  ["productores", "Productores"],
  ["zonas", "Zonas de entrega"],
  ["como-funciona", "Cómo funciona"],
] as const;

export function Header() {
  const { cantidad, setCarritoAbierto, irA } = useMercado();
  return (
    <header className="sticky top-0 z-40 border-b border-(--dv-linea) bg-(--dv-papel)/92 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:h-[4.5rem] sm:px-6 lg:px-8">
        <a href="#inicio" className={`rounded-lg text-(--dv-verde) ${foco}`}>
          <Logo />
          <span className="sr-only">, inicio</span>
        </a>
        <nav aria-label="Secciones" className="hidden lg:block">
          <ul className="flex items-center gap-1 text-[0.95rem] font-medium">
            {nav.map(([id, label]) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    irA(id);
                  }}
                  className={`rounded-full px-3.5 py-2 text-(--dv-tinta)/80 transition hover:bg-(--dv-verde)/8 hover:text-(--dv-verde) ${foco}`}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <button
          type="button"
          onClick={() => setCarritoAbierto(true)}
          className={`group relative inline-flex items-center gap-2 rounded-full bg-(--dv-verde) py-2.5 pl-4 pr-3 text-sm font-semibold text-(--dv-papel) shadow-[0_2px_0_#0F2E18] transition hover:bg-(--dv-verde2) active:translate-y-px ${foco}`}
          aria-label={`Tu pedido, ${cantidad} ${cantidad === 1 ? "producto" : "productos"}`}
        >
          <Icon name="basket" size={19} stroke={1.9} />
          <span className="hidden sm:inline">Tu pedido</span>
          <span
            className={`grid min-w-6 place-items-center rounded-full px-1.5 py-0.5 text-xs font-bold tabular-nums ${
              cantidad ? "bg-(--dv-mostaza) text-(--dv-tinta)" : "bg-white/15 text-white/80"
            }`}
          >
            {cantidad}
          </span>
        </button>
      </div>
    </header>
  );
}

const busquedasPopulares = ["miel", "masa madre", "queso de cabra", "tomates", "frambua"];

export function Hero() {
  const { setQ, setCategoria, irA } = useMercado();
  const [texto, setTexto] = useState("");
  const id = useId();

  function buscar(valor: string) {
    setQ(valor.trim());
    setCategoria("todas");
    irA("productos");
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    buscar(texto);
  }

  return (
    <section id="inicio" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-10 sm:px-6 sm:pt-14 lg:grid-cols-[1.02fr_1fr] lg:gap-14 lg:px-8 lg:pb-24 lg:pt-16">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-(--dv-verde)/20 bg-(--dv-crema) px-3 py-1.5 text-[0.8rem] font-semibold text-(--dv-verde)">
            <span className="size-2 rounded-full bg-(--dv-brote) shadow-[0_0_0_3px_rgba(156,203,110,0.3)]" />
            Pedidos abiertos hasta el lunes a las 20 h
          </p>
          <h1 className={`${display} mt-5 text-[clamp(2.55rem,7.4vw,4.9rem)] font-medium leading-[0.98] tracking-[-0.025em] text-(--dv-verde)`}>
            Lo que se cosecha esta semana,{" "}
            <span className="relative whitespace-nowrap italic text-(--dv-tomate)">
              directo
              <svg viewBox="0 0 200 16" className="absolute -bottom-2 left-0 h-3 w-full" preserveAspectRatio="none" aria-hidden="true">
                <path d="M3 11c40-8 90-10 194-4" stroke="#E3A72F" strokeWidth="5" fill="none" strokeLinecap="round" />
              </svg>
            </span>{" "}
            de quien lo hace.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-(--dv-gris)">
            Quesos, miel, verduras agroecológicas, dulces, pan y vino de productores de Córdoba. Armás un solo pedido y
            cada uno te entrega lo suyo.
          </p>

          <form onSubmit={onSubmit} role="search" className="mt-8 max-w-xl">
            <label htmlFor={id} className="sr-only">
              Buscar productos o productores
            </label>
            <div className="mr-1 flex items-center gap-2 rounded-2xl border-2 border-(--dv-verde) bg-(--dv-crema) p-1.5 shadow-[4px_4px_0_#1F4D2B] sm:mr-0 transition focus-within:shadow-[2px_2px_0_#1F4D2B]">
              <Icon name="search" size={22} className="ml-2.5 shrink-0 text-(--dv-verde)" />
              <input
                id={id}
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                placeholder="Buscá miel, quesos, pan…"
                className="min-w-0 flex-1 bg-transparent py-2.5 text-base text-(--dv-tinta) outline-none placeholder:text-(--dv-gris)/70"
              />
              <button
                type="submit"
                className={`shrink-0 rounded-xl bg-(--dv-verde) px-4 py-3 text-sm font-semibold text-(--dv-papel) transition hover:bg-(--dv-verde2) sm:px-6 ${foco}`}
              >
                Buscar
              </button>
            </div>
          </form>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-(--dv-gris)">Lo más buscado:</span>
            {busquedasPopulares.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => {
                  setTexto(b);
                  buscar(b);
                }}
                className={`rounded-full border border-(--dv-linea) bg-(--dv-crema)/70 px-3 py-1 text-(--dv-tinta) transition hover:border-(--dv-verde) hover:bg-(--dv-crema) ${foco}`}
              >
                {b}
              </button>
            ))}
          </div>

          <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-(--dv-linea) pt-6">
            {[
              ["34", "productores de la provincia"],
              ["7", "zonas con entrega"],
              ["82 %", "de lo que pagás va al productor"],
            ].map(([n, t]) => (
              <div key={t}>
                <dt className="sr-only">{t}</dt>
                <dd className={`${display} text-3xl font-semibold text-(--dv-verde) sm:text-4xl`}>{n}</dd>
                <dd className="mt-1 text-[0.82rem] leading-snug text-(--dv-gris)">{t}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <div className="relative mr-1.5 overflow-hidden rounded-[2rem] border-2 border-(--dv-verde) bg-(--dv-papel2) shadow-[5px_5px_0_#1F4D2B] sm:mr-0 sm:shadow-[8px_8px_0_#1F4D2B]">
            <Image
              src="/demos/marketplaces/productores/hero-puesto.webp"
              alt="Puesto de mercado repleto de frutas y verduras frescas: zapallos, morrones, tomates, hojas verdes y cítricos"
              width={1600}
              height={1100}
              priority
              sizes="(min-width: 1280px) 600px, (min-width: 1024px) 46vw, 100vw"
              className="h-auto w-full"
            />
          </div>
          <div className="absolute -top-6 right-0 grid size-28 rotate-12 place-items-center rounded-full bg-(--dv-mostaza) text-center text-(--dv-tinta) shadow-[3px_3px_0_#1F4D2B] sm:-right-5 sm:size-32">
            <p className={`${display} px-3 text-[0.95rem] font-semibold leading-tight sm:text-lg`}>
              Cosechado el lunes,
              <br />
              <span className="italic">en tu mesa el martes</span>
            </p>
          </div>
          <div className="absolute -bottom-6 left-4 flex max-w-[16rem] items-center gap-3 rounded-2xl border border-(--dv-linea) bg-(--dv-crema) p-3 pr-4 shadow-[0_12px_30px_-12px_rgba(29,42,31,0.35)] sm:left-8">
            <Image
              src="/demos/marketplaces/productores/producto-panal-de-miel.webp"
              alt=""
              width={56}
              height={56}
              sizes="56px"
              className="size-14 rounded-xl"
            />
            <div className="text-sm leading-tight">
              <p className="text-[0.7rem] font-bold uppercase tracking-wider text-(--dv-tomate)">Nuevo esta semana</p>
              <p className="mt-1 font-semibold text-(--dv-tinta)">Panal de miel</p>
              <p className="text-(--dv-gris)">Apiario La Quebrada</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Categorias() {
  const { categoria, setCategoria, setQ, irA } = useMercado();
  const cuenta = useMemo(() => {
    const c: Partial<Record<CategoriaId, number>> = {};
    for (const p of productos) c[p.categoria] = (c[p.categoria] ?? 0) + 1;
    return c;
  }, []);
  return (
    <section aria-labelledby="cat-titulo" className="border-y border-(--dv-linea) bg-(--dv-crema)">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="cat-titulo" className={`${display} text-3xl font-medium text-(--dv-verde) sm:text-4xl`}>
            Recorré el mercado
          </h2>
          <p className="max-w-sm text-(--dv-gris)">Seis rubros, un mismo pedido. Tocá uno para ver qué hay esta semana.</p>
        </div>
        <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {categorias.map((c) => {
            const activa = categoria === c.id;
            return (
              <li key={c.id}>
                <button
                  type="button"
                  aria-pressed={activa}
                  onClick={() => {
                    setCategoria(c.id);
                    setQ("");
                    irA("productos");
                  }}
                  className={`group flex h-full w-full flex-col items-start gap-3 rounded-2xl border p-4 text-left transition ${foco} ${
                    activa
                      ? "border-(--dv-verde) bg-(--dv-verde) text-(--dv-papel)"
                      : "border-(--dv-linea) bg-(--dv-papel) hover:-translate-y-0.5 hover:border-(--dv-verde)/60 hover:shadow-[0_10px_24px_-14px_rgba(31,77,43,0.5)]"
                  }`}
                >
                  <span className={`grid size-14 place-items-center rounded-full ${activa ? "bg-(--dv-papel)" : "bg-(--dv-crema)"} transition group-hover:rotate-[-6deg]`}>
                    <IconoCategoria id={c.id} size={36} />
                  </span>
                  <span>
                    <span className={`${display} block text-xl font-medium`}>{c.nombre}</span>
                    <span className={`mt-1 block text-[0.82rem] leading-snug ${activa ? "text-(--dv-papel)/80" : "text-(--dv-gris)"}`}>
                      {c.bajada}
                    </span>
                  </span>
                  <span className={`mt-auto text-xs font-semibold ${activa ? "text-(--dv-mostaza)" : "text-(--dv-verde)"}`}>
                    {cuenta[c.id] ?? 0} productos
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export function Productores() {
  const { setTiendita } = useMercado();
  return (
    <section id="productores" aria-labelledby="prod-titulo" className="scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-(--dv-tomate)">Productores destacados</p>
            <h2 id="prod-titulo" className={`${display} mt-2 text-4xl font-medium leading-tight text-(--dv-verde) sm:text-5xl`}>
              Conocé a quienes lo hacen
            </h2>
          </div>
          <p className="max-w-md text-(--dv-gris)">
            Cada productor tiene su tiendita: su historia, lo que ofrece esta semana y hasta dónde entrega.
          </p>
        </div>
        <ul className="-mx-4 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:thin] md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 lg:grid-cols-3">
          {productores.map((p) => {
            const cat = categorias.find((c) => c.id === p.categoria);
            return (
              <li key={p.id} className="w-[84%] shrink-0 snap-start sm:w-[60%] md:w-auto">
                <article className="group flex h-full flex-col overflow-hidden rounded-[1.6rem] border border-(--dv-linea) bg-(--dv-crema) transition hover:-translate-y-1 hover:shadow-[0_22px_40px_-24px_rgba(31,77,43,0.55)]">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={p.imagen}
                      alt={p.alt}
                      fill
                      sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, 84vw"
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-(--dv-crema)/95 px-2.5 py-1 text-xs font-semibold text-(--dv-verde)">
                      <IconoCategoria id={p.categoria} size={18} />
                      {cat?.nombre}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className={`${display} text-2xl font-medium leading-tight text-(--dv-verde)`}>{p.nombre}</h3>
                      <Estrellas valor={p.rating} />
                    </div>
                    <p className="mt-1 text-sm text-(--dv-gris)">
                      {p.persona} · {p.lugar}
                    </p>
                    <p className={`${display} mt-4 text-[1.05rem] italic leading-snug text-(--dv-tinta)/85`}>“{p.cita}”</p>
                    <p className="mt-4 flex items-center gap-2 text-[0.82rem] text-(--dv-gris)">
                      <Icon name="truck" size={17} className="text-(--dv-verde)" />
                      Envío {pesos(p.envio)} · gratis desde {pesos(p.envioGratisDesde)}
                    </p>
                    <button
                      type="button"
                      onClick={() => setTiendita(p.id)}
                      className={`mt-5 inline-flex items-center justify-between gap-2 rounded-xl border-2 border-(--dv-verde) px-4 py-2.5 text-sm font-semibold text-(--dv-verde) transition hover:bg-(--dv-verde) hover:text-(--dv-papel) ${foco}`}
                    >
                      Entrar a la tiendita
                      <Icon name="arrowRight" size={18} className="transition group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

type Orden = "destacados" | "menor" | "mayor";

export function Catalogo() {
  const { q, setQ, categoria, setCategoria, carrito, agregar, cambiar, setTiendita } = useMercado();
  const [orden, setOrden] = useState<Orden>("destacados");
  const idBuscar = useId();
  const idOrden = useId();

  const lista = useMemo(() => {
    const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
    const t = norm(q);
    const r = productos.filter((p) => {
      if (categoria !== "todas" && p.categoria !== categoria) return false;
      if (!t) return true;
      const prod = productorPorId[p.productorId];
      return norm(`${p.nombre} ${p.descripcion} ${prod?.nombre ?? ""} ${p.etiquetas.join(" ")}`).includes(t);
    });
    if (orden === "menor") r.sort((a, b) => a.precio - b.precio);
    else if (orden === "mayor") r.sort((a, b) => b.precio - a.precio);
    else r.sort((a, b) => Number(!!b.destacado) - Number(!!a.destacado));
    return r;
  }, [q, categoria, orden]);

  const chip = (activo: boolean) =>
    `shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${foco} ${
      activo ? "border-(--dv-verde) bg-(--dv-verde) text-(--dv-papel)" : "border-(--dv-linea) bg-(--dv-crema) text-(--dv-tinta) hover:border-(--dv-verde)/60"
    }`;

  return (
    <section id="productos" aria-labelledby="catalogo-titulo" className="scroll-mt-16 bg-(--dv-papel2)/60">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-(--dv-tomate)">Semana del 29 de septiembre</p>
            <h2 id="catalogo-titulo" className={`${display} mt-2 text-4xl font-medium text-(--dv-verde) sm:text-5xl`}>
              Esta semana en el mercado
            </h2>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-(--dv-linea) bg-(--dv-crema) p-3 sm:p-4 lg:flex-row lg:items-center">
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-(--dv-linea) bg-white/70 px-3 focus-within:border-(--dv-verde)">
            <Icon name="search" size={19} className="shrink-0 text-(--dv-gris)" />
            <label htmlFor={idBuscar} className="sr-only">
              Buscar en el catálogo
            </label>
            <input
              id={idBuscar}
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar producto o productor"
              className="min-w-0 flex-1 bg-transparent py-2.5 text-[0.95rem] outline-none placeholder:text-(--dv-gris)/70"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor={idOrden} className="flex items-center gap-1.5 text-sm text-(--dv-gris)">
              <Icon name="sort" size={17} />
              Ordenar
            </label>
            <div className="relative">
              <select
                id={idOrden}
                value={orden}
                onChange={(e) => setOrden(e.target.value as Orden)}
                className={`appearance-none rounded-xl border border-(--dv-linea) bg-white/70 py-2.5 pl-3 pr-9 text-sm font-medium ${foco}`}
              >
                <option value="destacados">Destacados primero</option>
                <option value="menor">Menor precio</option>
                <option value="mayor">Mayor precio</option>
              </select>
              <Icon name="chevronDown" size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-(--dv-gris)" />
            </div>
          </div>
        </div>

        <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Filtrar por categoría">
          <button type="button" aria-pressed={categoria === "todas"} onClick={() => setCategoria("todas")} className={chip(categoria === "todas")}>
            Todo
          </button>
          {categorias.map((c) => (
            <button key={c.id} type="button" aria-pressed={categoria === c.id} onClick={() => setCategoria(c.id)} className={chip(categoria === c.id)}>
              {c.nombre}
            </button>
          ))}
        </div>

        <p className="mt-6 text-sm text-(--dv-gris)" aria-live="polite">
          {lista.length === 1 ? "1 producto" : `${lista.length} productos`}
          {q && (
            <>
              {" "}
              para <strong className="text-(--dv-tinta)">“{q}”</strong>
            </>
          )}
        </p>

        {lista.length === 0 ? (
          <div className="mt-6 grid place-items-center rounded-3xl border-2 border-dashed border-(--dv-linea) bg-(--dv-crema) px-6 py-16 text-center">
            <IconoCategoria id="verduras" size={56} />
            <p className={`${display} mt-4 text-2xl text-(--dv-verde)`}>No encontramos eso esta semana</p>
            <p className="mt-2 max-w-sm text-(--dv-gris)">Probá con otra palabra o mirá todo lo que hay en el mercado.</p>
            <button
              type="button"
              onClick={() => {
                setQ("");
                setCategoria("todas");
              }}
              className={`mt-6 rounded-xl bg-(--dv-verde) px-5 py-3 text-sm font-semibold text-(--dv-papel) ${foco}`}
            >
              Ver todos los productos
            </button>
          </div>
        ) : (
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
            {lista.map((p) => {
              const prod = productorPorId[p.productorId];
              const cant = carrito[p.id] ?? 0;
              return (
                <li key={p.id}>
                  <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-(--dv-linea) bg-(--dv-crema) transition hover:shadow-[0_18px_36px_-22px_rgba(31,77,43,0.55)]">
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={p.imagen}
                        alt={p.alt}
                        fill
                        sizes="(min-width: 1280px) 300px, (min-width: 768px) 33vw, 50vw"
                        className="object-cover transition duration-500 group-hover:scale-[1.04]"
                      />
                      <div className="absolute left-2 top-2 flex flex-col items-start gap-1 sm:left-3 sm:top-3">
                        {p.ultimas && (
                          <span className="rounded-full bg-(--dv-tomate) px-2 py-0.5 text-[0.7rem] font-bold text-white">Últimas unidades</span>
                        )}
                        {p.etiquetas[0] && (
                          <span className="rounded-full bg-(--dv-crema)/95 px-2 py-0.5 text-[0.7rem] font-semibold text-(--dv-verde)">
                            {p.etiquetas[0]}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-3 sm:p-4">
                      <button
                        type="button"
                        onClick={() => setTiendita(p.productorId)}
                        className={`self-start rounded text-left text-[0.78rem] font-semibold text-(--dv-tomate) underline decoration-(--dv-tomate)/30 underline-offset-2 hover:decoration-(--dv-tomate) ${foco}`}
                      >
                        {prod?.nombre}
                      </button>
                      <h3 className={`${display} mt-1 text-[1.12rem] font-medium leading-snug text-(--dv-tinta) sm:text-[1.22rem]`}>{p.nombre}</h3>
                      <p className="mt-0.5 text-[0.8rem] text-(--dv-gris)">{p.unidad}</p>
                      <p className="mt-2 hidden text-sm leading-snug text-(--dv-gris) sm:block">{p.descripcion}</p>
                      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
                        <p className="text-lg font-bold tabular-nums text-(--dv-verde)">{pesos(p.precio)}</p>
                        {cant > 0 ? (
                          <Stepper cant={cant} nombre={p.nombre} chico onCambiar={(n) => cambiar(p.id, n)} />
                        ) : (
                          <button
                            type="button"
                            onClick={() => agregar(p.id)}
                            className={`inline-flex items-center gap-1.5 rounded-full bg-(--dv-verde) py-2 pl-3 pr-3.5 text-sm font-semibold text-(--dv-papel) transition hover:bg-(--dv-verde2) active:scale-95 ${foco}`}
                            aria-label={`Agregar ${p.nombre} al pedido`}
                          >
                            <Icon name="plus" size={16} stroke={2.2} />
                            Agregar
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
