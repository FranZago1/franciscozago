"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { Aviso } from "../shared/Aviso";
import { CarritoDrawer } from "../shared/CarritoDrawer";
import { Checkout } from "../shared/Checkout";
import { Dialogo } from "../shared/Dialogo";
import { cuota, fechaHabil, pesos } from "../shared/formato";
import { Estrellas, IconoCerrar, IconoCheck, IconoComparar, IconoDevolucion, IconoEscudo, IconoMas, IconoMenos } from "../shared/Iconos";
import { descuento, EnvioBadge } from "./Catalogo";
import { config, porId, type ProductoTech } from "./datos";
import { alternarComparar, comparadorAbierto, comparar, mono, tema, tienda } from "./tienda";

const foco = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F5BFF]";

export function Capas() {
  return (
    <>
      <Detalle />
      <Comparador />
      <CarritoDrawer tienda={tienda} productos={porId} tema={tema} config={config} trazo={1.8} />
      <Checkout tienda={tienda} productos={porId} tema={{ ...tema, panel: `${tema.panel} md:rounded-2xl` }} config={config} trazo={1.8} />
      <Aviso
        tienda={tienda}
        className="rounded-xl bg-[#16181D] px-4 py-3 text-white shadow-[0_20px_40px_-16px_rgba(0,0,0,0.5)] ring-1 ring-white/10"
        botonClassName="shrink-0 rounded-lg bg-[#2F5BFF] px-3 py-1.5 text-xs font-semibold text-white"
      />
    </>
  );
}

function Detalle() {
  const id = tienda.useTienda((e) => e.detalle);
  const p = id ? porId[id] : undefined;
  return (
    <Dialogo abierto={Boolean(p)} onCerrar={() => tienda.verDetalle(null)} titulo="vt-detalle-titulo" className="rounded-t-2xl bg-white text-[#16181D] sm:max-w-5xl sm:rounded-2xl" overlayClassName={tema.overlay}>
      {p ? <DetalleContenido key={p.id} p={p} /> : null}
    </Dialogo>
  );
}

function DetalleContenido({ p }: { p: ProductoTech }) {
  const [cantidad, setCantidad] = useState(1);
  const [cuotas, setCuotas] = useState(config.cuotasSinInteres);
  const [cp, setCp] = useState("");
  const [envio, setEnvio] = useState<string | null>(null);
  const [hecho, setHecho] = useState(false);
  const enComparar = comparar.use().includes(p.id);
  const uid = useId();
  const off = descuento(p);

  function calcular(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\d{4}$/.test(cp.trim())) {
      setEnvio("error");
      return;
    }
    const capital = cp.trim().startsWith("50") || cp.trim().startsWith("1");
    const dias = capital ? p.entrega : p.entrega + 2;
    setEnvio(`Llega el ${fechaHabil(dias)}${p.precio >= config.envioGratisDesde ? " · Envío gratis" : ` · ${pesos(8999)}`}`);
  }

  return (
    <div className="grid md:grid-cols-2">
      <div className="bg-[#F3F5F8] p-4 sm:p-6">
        <div className="md:sticky md:top-6">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-[#EEF1F5]">
          <Image src={p.imagen} alt={p.alt} fill priority sizes="(min-width: 768px) 480px, 100vw" className="object-cover" />
          {off ? <span className={`${mono} absolute top-3 left-3 rounded-md bg-[#2F5BFF] px-2 py-1 text-xs font-semibold text-white`}>-{off}% OFF</span> : null}
        </div>
        <ul className="mt-4 grid grid-cols-3 gap-2 text-center text-[11px] font-medium text-[#16181D]/70">
          <li className="rounded-lg bg-white p-2">
            <IconoEscudo className="mx-auto mb-1 size-5 text-[#2F5BFF]" /> Garantía oficial
          </li>
          <li className="rounded-lg bg-white p-2">
            <IconoDevolucion className="mx-auto mb-1 size-5 text-[#2F5BFF]" /> 30 días de devolución
          </li>
          <li className="rounded-lg bg-white p-2">
            <IconoCheck className="mx-auto mb-1 size-5 text-[#2F5BFF]" /> Factura A o B
          </li>
        </ul>
        </div>
      </div>

      <div className="relative p-5 pb-8 sm:p-8">
        <button type="button" onClick={() => tienda.verDetalle(null)} className={`absolute top-3 right-3 grid size-10 place-items-center rounded-lg hover:bg-[#16181D]/6 ${foco}`} aria-label="Cerrar detalle">
          <IconoCerrar />
        </button>
        <p className={`${mono} text-xs tracking-[0.12em] text-[#16181D]/62 uppercase`}>
          {p.marca} · {p.categoria} · SKU VT-{p.id.toUpperCase()}
        </p>
        <h2 id="vt-detalle-titulo" className="mt-2 pr-10 text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
          {p.nombre}
        </h2>
        <div className="mt-2 flex items-center gap-2 text-sm text-[#16181D]/62">
          <Estrellas valor={p.rating} colorLleno="#F5A524" colorVacio="#16181D" />
          <span className={mono}>{String(p.rating).replace(".", ",")}</span> · {p.opiniones} opiniones
        </div>

        <div className="mt-5">
          {p.precioAnterior ? <p className="text-sm text-[#16181D]/62 line-through tabular-nums">{pesos(p.precioAnterior)}</p> : null}
          <p className="text-4xl font-bold tracking-[-0.03em] tabular-nums">{pesos(p.precio)}</p>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl bg-[#ECFDF5] p-3 text-sm text-[#0B6B4A]">
          <label htmlFor={`${uid}-cuotas`} className="font-semibold">
            Pagalo en
          </label>
          <select id={`${uid}-cuotas`} value={cuotas} onChange={(e) => setCuotas(Number(e.target.value))} className={`h-9 rounded-lg border border-[#0B6B4A]/25 bg-white px-2 font-semibold ${foco}`}>
            {[1, 3, 6, 12].map((c) => (
              <option key={c} value={c}>
                {c === 1 ? "1 pago" : `${c} cuotas`}
              </option>
            ))}
          </select>
          <span aria-live="polite">
            {cuotas === 1 ? `de ${pesos(p.precio)}` : `sin interés de ${pesos(cuota(p.precio, cuotas))}`}
          </span>
        </div>

        <div className="mt-4">
          <EnvioBadge p={p} />
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <div className="inline-flex h-12 items-center rounded-xl border border-[#16181D]/15" role="group" aria-label="Cantidad">
            <button type="button" onClick={() => setCantidad((c) => Math.max(1, c - 1))} disabled={cantidad <= 1} className={`grid size-12 place-items-center disabled:opacity-35 ${foco}`} aria-label="Restar una unidad">
              <IconoMenos className="size-4" />
            </button>
            <span className={`${mono} w-8 text-center`} aria-live="polite">
              {cantidad}
            </span>
            <button type="button" onClick={() => setCantidad((c) => Math.min(5, c + 1))} disabled={cantidad >= 5} className={`grid size-12 place-items-center disabled:opacity-35 ${foco}`} aria-label="Sumar una unidad">
              <IconoMas className="size-4" />
            </button>
          </div>
          <button
            type="button"
            disabled={!p.stock}
            onClick={() => {
              tienda.agregar(p.id, { cantidad, nombre: cantidad > 1 ? `${cantidad} × ${p.nombre}` : p.nombre });
              setHecho(true);
              window.setTimeout(() => setHecho(false), 1600);
            }}
            className={`inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl px-6 font-semibold text-white transition-colors disabled:bg-[#16181D]/10 disabled:text-[#16181D]/45 ${foco} ${hecho ? "bg-[#0D8259]" : "bg-[#2F5BFF] hover:bg-[#2249E0]"}`}
          >
            {hecho ? (
              <>
                <IconoCheck className="size-5" trazo={2.4} /> Agregado
              </>
            ) : p.stock ? (
              "Agregar al carrito"
            ) : (
              "Sin stock por ahora"
            )}
          </button>
          <button
            type="button"
            aria-pressed={enComparar}
            onClick={() => alternarComparar(p.id)}
            className={`inline-flex min-h-12 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-colors ${foco} ${enComparar ? "border-[#2F5BFF] bg-[#F4F7FF] text-[#2F5BFF]" : "border-[#16181D]/15 hover:bg-[#F3F5F8]"}`}
          >
            <IconoComparar className="size-[18px]" /> {enComparar ? "En comparación" : "Comparar"}
          </button>
        </div>

        <form onSubmit={calcular} className="mt-5 rounded-xl border border-[#16181D]/10 p-4" noValidate>
          <label htmlFor={`${uid}-cp`} className="text-sm font-semibold">
            Calculá cuándo te llega
          </label>
          <div className="mt-2 flex gap-2">
            <input
              id={`${uid}-cp`}
              inputMode="numeric"
              maxLength={4}
              placeholder="Código postal, ej. 5000"
              value={cp}
              onChange={(e) => {
                setCp(e.target.value.replace(/\D/g, ""));
                setEnvio(null);
              }}
              aria-invalid={envio === "error" ? true : undefined}
              aria-describedby={`${uid}-cp-res`}
              className={`${mono} h-11 min-w-0 flex-1 rounded-lg border border-[#16181D]/15 px-3 text-sm outline-none focus:border-[#2F5BFF] focus:ring-4 focus:ring-[#2F5BFF]/15 aria-[invalid=true]:border-[#D92D20]`}
            />
            <button type="submit" className={`h-11 rounded-lg bg-[#16181D] px-4 text-sm font-semibold text-white hover:bg-[#2F5BFF] ${foco}`}>
              Calcular
            </button>
          </div>
          <p id={`${uid}-cp-res`} aria-live="polite" className={`mt-2 min-h-5 text-sm ${envio === "error" ? "text-[#C4231A]" : "font-medium text-[#0D8259]"}`}>
            {envio === "error" ? "Ingresá un código postal de 4 números." : envio ?? ""}
          </p>
        </form>

        <section aria-labelledby="vt-ficha" className="mt-6">
          <h3 id="vt-ficha" className="font-bold">
            Ficha técnica
          </h3>
          <table className="mt-3 w-full text-sm">
            <caption className="sr-only">Especificaciones de {p.nombre}</caption>
            <tbody>
              {p.specs.map(([k, v]) => (
                <tr key={k} className="border-b border-[#16181D]/8 last:border-0">
                  <th scope="row" className="w-2/5 py-2.5 pr-4 text-left font-medium text-[#16181D]/62">
                    {k}
                  </th>
                  <td className={`${mono} py-2.5 text-[13px]`}>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section aria-labelledby="vt-caja" className="mt-6">
          <h3 id="vt-caja" className="font-bold">
            Qué viene en la caja
          </h3>
          <ul className="mt-2 flex flex-wrap gap-2">
            {p.caja.map((c) => (
              <li key={c} className="rounded-lg bg-[#F3F5F8] px-2.5 py-1 text-sm">
                {c}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

function Comparador() {
  const abierto = comparadorAbierto.use();
  const ids = comparar.use();
  const [soloDif, setSoloDif] = useState(false);
  const ps = ids.map((id) => porId[id]).filter((p): p is ProductoTech => Boolean(p));

  const etiquetas: string[] = [];
  for (const p of ps) for (const [k] of p.specs) if (!etiquetas.includes(k)) etiquetas.push(k);
  const valor = (p: ProductoTech, k: string) => p.specs.find(([x]) => x === k)?.[1] ?? "—";
  const filas = etiquetas.map((k) => ({ k, vals: ps.map((p) => valor(p, k)) })).map((f) => ({ ...f, distinta: new Set(f.vals).size > 1 }));
  const visibles = soloDif ? filas.filter((f) => f.distinta) : filas;
  const minPrecio = Math.min(...ps.map((p) => p.precio));
  const maxRating = Math.max(...ps.map((p) => p.rating));

  return (
    <Dialogo abierto={abierto && ps.length > 0} onCerrar={() => comparadorAbierto.set(false)} titulo="vt-comp-titulo" variante="pantalla" className="bg-white text-[#16181D] md:max-w-5xl md:rounded-2xl" overlayClassName={tema.overlay}>
      <div className="p-4 pb-8 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className={`${mono} text-xs tracking-[0.12em] text-[#16181D]/62 uppercase`}>Comparador</p>
            <h2 id="vt-comp-titulo" className="text-2xl font-bold tracking-[-0.02em] sm:text-3xl">
              {ps.length} productos lado a lado
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <label className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium">
              <input type="checkbox" checked={soloDif} onChange={(e) => setSoloDif(e.target.checked)} className="size-4 accent-[#2F5BFF]" />
              Solo diferencias
            </label>
            <button type="button" onClick={() => comparadorAbierto.set(false)} className={`grid size-10 place-items-center rounded-lg hover:bg-[#16181D]/6 ${foco}`} aria-label="Cerrar comparador">
              <IconoCerrar />
            </button>
          </div>
        </div>

        <div className="-mx-4 mt-6 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[560px] table-fixed border-separate border-spacing-0 text-sm">
            <caption className="sr-only">Comparación de especificaciones</caption>
            <colgroup>
              <col className="w-[128px] sm:w-[170px]" />
              {ps.map((p) => (
                <col key={p.id} />
              ))}
            </colgroup>
            <thead>
              <tr>
                <td className="sticky left-0 z-10 bg-white" />
                {ps.map((p) => (
                  <th key={p.id} scope="col" className="px-2 pb-4 text-left align-top font-normal sm:px-3">
                    <div className="relative aspect-square overflow-hidden rounded-xl bg-[#EEF1F5]">
                      <Image src={p.imagen} alt={p.alt} fill sizes="240px" className="object-cover" />
                      <button type="button" onClick={() => alternarComparar(p.id)} className={`absolute top-1.5 right-1.5 grid size-8 place-items-center rounded-lg bg-white/90 hover:bg-white ${foco}`} aria-label={`Quitar ${p.nombre} de la comparación`}>
                        <IconoCerrar className="size-4" />
                      </button>
                    </div>
                    <p className={`${mono} mt-3 text-[11px] tracking-[0.1em] text-[#16181D]/62 uppercase`}>{p.marca}</p>
                    <p className="font-semibold leading-snug">{p.nombre}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row" className="sticky left-0 z-10 border-t border-[#16181D]/8 bg-white py-3 pr-3 text-left font-medium text-[#16181D]/62">
                  Precio
                </th>
                {ps.map((p) => (
                  <td key={p.id} className={`border-t border-[#16181D]/8 px-2 py-3 sm:px-3 ${ps.length > 1 && p.precio === minPrecio ? "bg-[#ECFDF5]" : ""}`}>
                    <span className="text-lg font-bold tabular-nums">{pesos(p.precio)}</span>
                    {ps.length > 1 && p.precio === minPrecio ? <span className="block text-xs font-semibold text-[#0D8259]">El más barato</span> : null}
                  </td>
                ))}
              </tr>
              <tr>
                <th scope="row" className="sticky left-0 z-10 border-t border-[#16181D]/8 bg-white py-3 pr-3 text-left font-medium text-[#16181D]/62">
                  Cuotas
                </th>
                {ps.map((p) => (
                  <td key={p.id} className="border-t border-[#16181D]/8 px-2 py-3 text-[#0D8259] sm:px-3">
                    12 × {pesos(cuota(p.precio, 12))}
                  </td>
                ))}
              </tr>
              <tr>
                <th scope="row" className="sticky left-0 z-10 border-t border-[#16181D]/8 bg-white py-3 pr-3 text-left font-medium text-[#16181D]/62">
                  Puntuación
                </th>
                {ps.map((p) => (
                  <td key={p.id} className={`border-t border-[#16181D]/8 px-2 py-3 sm:px-3 ${ps.length > 1 && p.rating === maxRating ? "bg-[#FFF8E6]" : ""}`}>
                    <span className={`${mono} font-semibold`}>{String(p.rating).replace(".", ",")}</span> <span className="text-[#16181D]/62">/ 5 · {p.opiniones}</span>
                  </td>
                ))}
              </tr>
              {visibles.map((f) => (
                <tr key={f.k}>
                  <th scope="row" className="sticky left-0 z-10 border-t border-[#16181D]/8 bg-white py-3 pr-3 text-left font-medium text-[#16181D]/62">
                    {f.k}
                  </th>
                  {f.vals.map((v, i) => (
                    <td key={i} className={`${mono} border-t border-[#16181D]/8 px-2 py-3 text-[13px] sm:px-3 ${f.distinta ? "bg-[#F4F7FF]" : ""} ${v === "—" ? "text-[#16181D]/62" : ""}`}>
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="sticky left-0 z-10 bg-white" />
                {ps.map((p) => (
                  <td key={p.id} className="px-2 pt-4 sm:px-3">
                    <button
                      type="button"
                      disabled={!p.stock}
                      onClick={() => tienda.agregar(p.id, { nombre: p.nombre })}
                      className={`h-11 w-full rounded-xl bg-[#2F5BFF] px-2 text-sm font-semibold text-white hover:bg-[#2249E0] disabled:bg-[#16181D]/10 disabled:text-[#16181D]/45 ${foco}`}
                    >
                      {p.stock ? "Agregar" : "Sin stock"}
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 flex items-center gap-2 text-xs text-[#16181D]/62">
          <span className="inline-block size-3 rounded bg-[#F4F7FF] ring-1 ring-[#2F5BFF]/30" aria-hidden="true" /> Las filas resaltadas tienen valores distintos entre productos.
        </p>
      </div>
    </Dialogo>
  );
}
