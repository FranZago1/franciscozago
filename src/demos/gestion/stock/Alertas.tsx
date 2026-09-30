"use client";

import { useMemo, useState } from "react";
import { Dialog } from "../shared/Dialog";
import { Icon } from "../shared/Icon";
import { useToast } from "../shared/Toasts";
import { diaRelativo, hora, pesos } from "../shared/util";
import { estadoDe, sugerido, USUARIO, type Producto } from "./data";
import { useStock } from "./context";
import { Titulo } from "./Resumen";
import { BarraStock, btn, CatIcono, EstadoBadge, mono } from "./ui";

type Seleccion = Record<string, { on: boolean; cant: number }>;

export function Alertas() {
  const { state, now, producto, confirmarPedido, recibirPedido, setVista } = useStock();
  const toast = useToast();
  const bajos = useMemo(() => state.productos.filter((p) => estadoDe(p) !== "ok"), [state.productos]);
  const enCamino = useMemo(() => new Set(state.pedidos.filter((x) => x.estado === "enviado").flatMap((x) => x.items.map((i) => i.productoId))), [state.pedidos]);

  const grupos = useMemo(() => {
    const m = new Map<string, Producto[]>();
    for (const p of bajos) m.set(p.proveedor, [...(m.get(p.proveedor) ?? []), p]);
    return [...m.entries()].sort((a, b) => b[1].length - a[1].length);
  }, [bajos]);

  const [sel, setSel] = useState<Seleccion>({});
  const valor = (p: Producto) => sel[p.id] ?? { on: !enCamino.has(p.id), cant: sugerido(p) };
  const [preview, setPreview] = useState<{ proveedor: string; items: { p: Producto; cant: number }[] } | null>(null);
  const [copiado, setCopiado] = useState(false);

  const setV = (p: Producto, v: Partial<{ on: boolean; cant: number }>) => setSel((s) => ({ ...s, [p.id]: { ...valor(p), ...v } }));

  const texto = preview
    ? [
        `ORDEN DE COMPRA Nº ${state.proximoPedido}`,
        `Ferretería El Tornillo · ${new Date(now).toLocaleDateString("es-AR")}`,
        `Para: ${preview.proveedor}`,
        "",
        ...preview.items.map(({ p, cant }) => `${String(cant).padStart(4)} × ${p.nombre} (${p.sku})`),
        "",
        `Total estimado: ${pesos(preview.items.reduce((a, { p, cant }) => a + p.costo * cant, 0))} + IVA`,
        `Pedido por: ${USUARIO}`,
      ].join("\n")
    : "";

  const pendientes = state.pedidos.filter((x) => x.estado === "enviado");
  const recibidos = state.pedidos.filter((x) => x.estado === "recibido").slice(0, 3);

  return (
    <div>
      <Titulo titulo="Alertas de stock" sub={`${bajos.length} productos por debajo del mínimo`} />

      {bajos.length === 0 ? (
        <div className="border-2 border-dashed border-[#BDB9B0] bg-white p-8 text-center">
          <p className="text-lg font-bold uppercase">Todo en orden</p>
          <p className="mt-1 text-sm text-[#6B6860]">No hay productos por debajo del mínimo.</p>
          <button type="button" className={`${btn.secundario} mt-3`} onClick={() => setVista("productos")}>Ver productos</button>
        </div>
      ) : (
        <div className="grid grid-cols-[minmax(0,1fr)] gap-4 xl:grid-cols-2">
          {grupos.map(([prov, prods]) => {
            const elegidos = prods.filter((p) => valor(p).on && valor(p).cant > 0);
            const total = elegidos.reduce((a, p) => a + p.costo * valor(p).cant, 0);
            return (
              <section key={prov} className="flex flex-col border border-[#D9D6CF] bg-white" aria-labelledby={`prov-${prov}`}>
                <header className="flex items-center gap-3 border-b-2 border-[#1C1E22] px-3.5 py-2.5">
                  <span className="grid size-9 place-items-center bg-[#1C1E22] text-[#F26B1D]"><Icon name="truck" className="size-5" strokeWidth={2} /></span>
                  <div className="min-w-0 flex-1">
                    <h2 id={`prov-${prov}`} className="truncate font-bold uppercase tracking-[0.02em]">{prov}</h2>
                    <p className="text-xs text-[#6B6860]">{prods.length} producto{prods.length > 1 ? "s" : ""} para reponer</p>
                  </div>
                </header>
                <ul className="flex-1 divide-y divide-[#EEEDE9]">
                  {prods.map((p) => {
                    const v = valor(p);
                    return (
                      <li key={p.id} className={`flex flex-wrap items-center gap-x-3 gap-y-2 px-3.5 py-2.5 sm:flex-nowrap ${v.on ? "" : "opacity-60"}`}>
                        <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-3">
                          <input type="checkbox" checked={v.on} onChange={(e) => setV(p, { on: e.target.checked })} className="size-4 shrink-0 accent-[#F26B1D]" />
                          <CatIcono c={p.categoria} className="size-8" />
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-semibold">{p.nombre}</span>
                            <span className="mt-0.5 flex items-center gap-2">
                              <EstadoBadge p={p} />
                              <span className={`${mono} text-[11px] text-[#6B6860]`}>{p.stock}/{p.minimo}</span>
                              {enCamino.has(p.id) ? <span className="text-[11px] font-bold uppercase text-[#3C5A8A]">En camino</span> : null}
                            </span>
                          </span>
                        </label>
                        <span className="hidden sm:block"><BarraStock p={p} ancho="w-16" /></span>
                        <div className="ml-auto flex items-center gap-1.5">
                          <label htmlFor={`cant-${p.id}`} className="text-[11px] font-bold uppercase text-[#6B6860]">Pedir</label>
                          <input
                            id={`cant-${p.id}`}
                            inputMode="numeric"
                            value={v.cant}
                            disabled={!v.on}
                            onChange={(e) => setV(p, { cant: Math.min(9999, Number(e.target.value.replace(/\D/g, "")) || 0) })}
                            className={`${mono} h-8 w-16 border border-[#BDB9B0] text-center text-sm font-bold focus:border-[#1C1E22] focus:outline-none focus:ring-2 focus:ring-[#F26B1D]/40`}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <footer className="flex flex-wrap items-center gap-3 border-t border-[#D9D6CF] bg-[#F6F5F2] px-3.5 py-2.5">
                  <p className="text-xs text-[#55524B]">
                    {elegidos.length} ítems · <span className={`${mono} font-bold text-[#1C1E22]`}>{pesos(total)}</span> + IVA
                  </p>
                  <button
                    type="button"
                    disabled={elegidos.length === 0}
                    onClick={() => { setCopiado(false); setPreview({ proveedor: prov, items: elegidos.map((p) => ({ p, cant: valor(p).cant })) }); }}
                    className={`${btn.primario} ml-auto`}
                  >
                    <Icon name="receipt" className="size-4" strokeWidth={2.2} /> Generar pedido al proveedor
                  </button>
                </footer>
              </section>
            );
          })}
        </div>
      )}

      <section className="mt-6" aria-labelledby="oc-titulo">
        <h2 id="oc-titulo" className="mb-2 text-[13px] font-bold uppercase tracking-[0.1em]">Pedidos a proveedores</h2>
        {pendientes.length + recibidos.length === 0 ? (
          <p className="text-sm text-[#6B6860]">Todavía no generaste órdenes de compra.</p>
        ) : (
          <ul className="grid grid-cols-[minmax(0,1fr)] gap-2 lg:grid-cols-2">
            {[...pendientes, ...recibidos].map((oc) => {
              const total = oc.items.reduce((a, i) => a + i.costo * i.cantidad, 0);
              return (
                <li key={oc.id} className={`flex flex-wrap items-center gap-3 border bg-white p-3 ${oc.estado === "enviado" ? "border-[#1C1E22]" : "border-[#D9D6CF]"}`}>
                  <div className={`${mono} grid size-12 shrink-0 place-items-center text-center text-[10px] font-bold leading-tight ${oc.estado === "enviado" ? "bg-[#1C1E22] text-[#F26B1D]" : "bg-[#E3F2E7] text-[#1F7A3E]"}`}>
                    OC<br />{oc.numero}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">{oc.proveedor}</p>
                    <p className="text-xs text-[#6B6860]">
                      {oc.items.length} ítems · <span className={mono}>{pesos(total)}</span> · {oc.estado === "enviado" ? `enviado ${diaRelativo(oc.fecha, now).toLowerCase()} ${hora(oc.fecha)}` : `recibido ${diaRelativo(oc.recibido ?? oc.fecha, now).toLowerCase()}`}
                    </p>
                    <p className="mt-0.5 truncate text-[11px] text-[#6F6C66]">{oc.items.map((i) => `${i.cantidad}× ${producto(i.productoId)?.nombre.split(" ").slice(0, 2).join(" ") ?? "—"}`).join(" · ")}</p>
                  </div>
                  {oc.estado === "enviado" ? (
                    <button type="button" className={`${btn.oscuro} max-sm:w-full`} onClick={() => recibirPedido(oc.id)}>
                      <Icon name="inbox" className="size-4" strokeWidth={2.2} /> Registrar ingreso
                    </button>
                  ) : (
                    <span className="text-xs font-bold uppercase tracking-[0.06em] text-[#1F7A3E]">Recibido</span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <Dialog
        open={!!preview}
        onClose={() => setPreview(null)}
        titulo="Vista previa del pedido"
        subtitulo={<p className="text-xs text-white/60">Así le llegaría al proveedor. En la demo no se envía nada.</p>}
        panelClassName="max-h-[94dvh] w-full bg-[#ECEBE7] shadow-2xl sm:max-w-xl"
        overlayClassName="bg-black/60"
        headerClassName="bg-[#1C1E22] px-4 py-3 text-white"
        tituloClassName="text-sm font-bold uppercase tracking-[0.12em] text-[#F26B1D]"
        cerrarClassName="-mr-1 text-white/70 hover:text-white"
        footerClassName="flex flex-col-reverse gap-2 border-t border-[#D9D6CF] bg-white p-3 sm:flex-row sm:justify-end"
        footer={
          <>
            <button
              type="button"
              className={btn.secundario}
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(texto);
                  setCopiado(true);
                  toast("Texto del pedido copiado");
                } catch {
                  toast("No se pudo copiar en este navegador", { tono: "error" });
                }
              }}
            >
              <Icon name={copiado ? "check" : "copy"} className="size-4" /> {copiado ? "Copiado" : "Copiar texto"}
            </button>
            <button
              type="button"
              className={btn.primario}
              onClick={() => {
                if (!preview) return;
                confirmarPedido(preview.proveedor, preview.items.map(({ p, cant }) => ({ productoId: p.id, cantidad: cant })));
                setSel((s) => {
                  const n = { ...s };
                  for (const { p } of preview.items) n[p.id] = { on: false, cant: sugerido(p) };
                  return n;
                });
                setPreview(null);
              }}
            >
              <Icon name="send" className="size-4" strokeWidth={2.2} /> Confirmar pedido
            </button>
          </>
        }
      >
        {preview ? (
          <div className="p-3 sm:p-5">
            <article className="bg-white p-4 shadow-[0_1px_0_#D9D6CF,0_8px_24px_-12px_rgba(0,0,0,.25)] sm:p-6" aria-label="Orden de compra">
              <div className="flex items-start justify-between gap-3 border-b-2 border-[#1C1E22] pb-3">
                <div>
                  <p className="text-lg font-bold uppercase leading-none">Ferretería El Tornillo</p>
                  <p className="mt-1 text-xs text-[#6B6860]">Av. Ficticia 1234 · Córdoba</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#6B6860]">Orden de compra</p>
                  <p className={`${mono} text-lg font-bold text-[#B4400C]`}>Nº {state.proximoPedido}</p>
                  <p className={`${mono} text-xs`}>{new Date(now).toLocaleDateString("es-AR")}</p>
                </div>
              </div>
              <p className="mt-3 text-sm">
                <span className="text-xs font-bold uppercase tracking-[0.06em] text-[#6B6860]">Proveedor: </span>
                <span className="font-semibold">{preview.proveedor}</span>
              </p>
              <table className="mt-3 w-full text-sm">
                <thead>
                  <tr className="border-b border-[#1C1E22] text-left text-[10px] font-bold uppercase tracking-[0.08em] text-[#6B6860]">
                    <th scope="col" className="py-1.5 pr-2">Cant.</th>
                    <th scope="col" className="py-1.5 pr-2">Artículo</th>
                    <th scope="col" className="py-1.5 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.items.map(({ p, cant }) => (
                    <tr key={p.id} className="border-b border-dashed border-[#D9D6CF] align-top">
                      <td className={`${mono} py-2 pr-2 font-bold`}>{cant}</td>
                      <td className="py-2 pr-2">
                        <span className="block leading-snug">{p.nombre}</span>
                        <span className={`${mono} text-[11px] text-[#6F6C66]`}>{p.sku} · {pesos(p.costo)} c/u</span>
                      </td>
                      <td className={`${mono} whitespace-nowrap py-2 text-right`}>{pesos(p.costo * cant)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={2} className="pt-3 text-right text-xs font-bold uppercase tracking-[0.06em]">Total estimado + IVA</td>
                    <td className={`${mono} whitespace-nowrap pt-3 text-right text-base font-bold`}>{pesos(preview.items.reduce((a, { p, cant }) => a + p.costo * cant, 0))}</td>
                  </tr>
                </tfoot>
              </table>
              <p className="mt-4 text-xs text-[#6B6860]">Pedido por {USUARIO}. Entrega en depósito de lunes a viernes de 8 a 16 h.</p>
            </article>
          </div>
        ) : null}
      </Dialog>
    </div>
  );
}
