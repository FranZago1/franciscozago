"use client";

import { useMemo, useState } from "react";
import { Dialog } from "../shared/Dialog";
import { Icon } from "../shared/Icon";
import { useToast } from "../shared/Toasts";
import { pesos } from "../shared/util";
import { CATEGORIAS, COSTO_ENVIO, MENU, type Categoria, type ItemMenu, type LineaPedido, type Origen, type Pago } from "./data";
import { useBrasa } from "./context";
import { btn, cond, ESTADO_MESA, input, label, Plato } from "./ui";

type Linea = Omit<LineaPedido, "id" | "hecho"> & { key: string };
type Tipo = "mesa" | "delivery" | "llevar";

export function NuevoPedido() {
  const { state, preOrigen, crearPedido, setVista, setMesaSel } = useBrasa();
  const toast = useToast();
  const [tipo, setTipo] = useState<Tipo>(preOrigen?.tipo === "delivery" ? "delivery" : "mesa");
  const [mesaId, setMesaId] = useState<string>(preOrigen?.tipo === "mesa" ? preOrigen.mesaId : "");
  const [cli, setCli] = useState({ cliente: "", telefono: "", direccion: "", pago: "Efectivo" as Pago });
  const [cat, setCat] = useState<Categoria | "Populares">("Populares");
  const [lineas, setLineas] = useState<Linea[]>([]);
  const [nota, setNota] = useState("");
  const [modal, setModal] = useState<ItemMenu | null>(null);
  const [err, setErr] = useState<Record<string, string>>({});
  const [enviando, setEnviando] = useState(false);
  const [anuncio, setAnuncio] = useState("");

  const items = cat === "Populares" ? MENU.filter((m) => m.popular) : MENU.filter((m) => m.cat === cat);
  const subtotal = lineas.reduce((a, l) => a + l.precio * l.cant, 0);
  const envio = tipo === "delivery" && lineas.length ? COSTO_ENVIO : 0;
  const unidades = lineas.reduce((a, l) => a + l.cant, 0);

  function agregar(l: Omit<Linea, "key">) {
    setLineas((xs) => {
      const i = xs.findIndex((x) => x.itemId === l.itemId && x.mods.join() === l.mods.join() && x.nota === l.nota);
      if (i >= 0) return xs.map((x, j) => (j === i ? { ...x, cant: x.cant + l.cant } : x));
      return [...xs, { ...l, key: `${l.itemId}-${Date.now()}-${xs.length}` }];
    });
    setErr((e) => ({ ...e, lineas: "" }));
    setAnuncio(`${l.cant}× ${l.nombre} agregado a la comanda`);
  }

  function elegir(it: ItemMenu) {
    if (it.mods?.length) setModal(it);
    else agregar({ itemId: it.id, nombre: it.nombre, cant: 1, mods: [], precio: it.precio, nota: "" });
  }

  function enviar() {
    const e: Record<string, string> = {};
    if (tipo === "mesa" && !mesaId) e.mesa = "Elegí la mesa.";
    if (tipo !== "mesa" && cli.cliente.trim().length < 2) e.cliente = "Ingresá el nombre.";
    if (tipo === "delivery") {
      if (cli.telefono.replace(/\D/g, "").length < 8) e.telefono = "Teléfono incompleto.";
      if (cli.direccion.trim().length < 6) e.direccion = "Falta la dirección.";
    }
    if (!lineas.length) e.lineas = "Agregá al menos un plato.";
    setErr(e);
    const primero = Object.keys(e)[0];
    if (primero) {
      document.getElementById(`np-${primero}`)?.focus();
      toast("Revisá la comanda antes de enviarla", { tono: "error" });
      return;
    }
    const origen: Origen =
      tipo === "mesa"
        ? { tipo: "mesa", mesaId }
        : tipo === "delivery"
          ? { tipo: "delivery", cliente: cli.cliente.trim(), telefono: cli.telefono.trim(), direccion: cli.direccion.trim(), pago: cli.pago }
          : { tipo: "llevar", cliente: cli.cliente.trim() };
    setEnviando(true);
    window.setTimeout(() => {
      crearPedido(origen, lineas.map((l) => ({ itemId: l.itemId, nombre: l.nombre, cant: l.cant, mods: l.mods, precio: l.precio, nota: l.nota })), nota.trim());
      if (tipo === "mesa") setMesaSel(mesaId);
      setVista("cocina");
    }, 500);
  }

  const mesasOrden = [...state.mesas].sort((a, b) => a.numero - b.numero);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[#726559]">Comanda #{state.proximo}</p>
          <h1 className={`${cond} text-4xl font-bold uppercase leading-none tracking-wide`}>Nuevo pedido</h1>
        </div>
      </div>

      {/* Resumen fijo en mobile */}
      {lineas.length ? (
        <a href="#np-comanda" className="sticky top-[72px] z-30 mt-3 flex items-center justify-between rounded-2xl bg-[#1F1A17] px-4 py-3 text-sm font-bold text-[#F5EEE3] shadow-lg lg:hidden">
          <span>{unidades} ítem{unidades > 1 ? "s" : ""} · {pesos(subtotal + envio)}</span>
          <span className="flex items-center gap-1 text-[#F0B24A]">Ver comanda <Icon name="arrow-down" className="size-4" /></span>
        </a>
      ) : null}

      <div className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 space-y-5">
          {/* Origen */}
          <section className="rounded-3xl border border-[#E4D8C6] bg-[#FFFCF7] p-4" aria-labelledby="np-origen">
            <h2 id="np-origen" className={`${cond} text-xl font-bold uppercase tracking-wide`}>1 · ¿Para dónde es?</h2>
            <div role="radiogroup" aria-label="Tipo de pedido" className="mt-3 grid grid-cols-3 gap-2">
              {([["mesa", "Mesa", "table"], ["delivery", "Delivery", "bike"], ["llevar", "Para llevar", "bag"]] as const).map(([k, t, ic]) => (
                <button
                  key={k}
                  type="button"
                  role="radio"
                  aria-checked={tipo === k}
                  onClick={() => { setTipo(k); setErr({}); }}
                  className={`flex flex-col items-center gap-1 rounded-2xl border-2 py-3 text-sm font-bold transition sm:flex-row sm:justify-center sm:gap-2 ${tipo === k ? "border-[#D9480F] bg-[#FDE8DC] text-[#A5360B]" : "border-[#E4D8C6] bg-white hover:border-[#C9B9A1]"}`}
                >
                  <Icon name={ic} className="size-5" />
                  {t}
                </button>
              ))}
            </div>

            {tipo === "mesa" ? (
              <div className="mt-4">
                <p className={label} id="np-mesa-l">Mesa *</p>
                <div role="radiogroup" aria-labelledby="np-mesa-l" className="grid grid-cols-7 gap-1.5 sm:grid-cols-[repeat(14,minmax(0,1fr))]">
                  {mesasOrden.map((m, i) => {
                    const e = ESTADO_MESA[m.estado];
                    const activa = mesaId === m.id;
                    return (
                      <button
                        key={m.id}
                        id={i === 0 ? "np-mesa" : undefined}
                        type="button"
                        role="radio"
                        aria-checked={activa}
                        aria-label={`Mesa ${m.numero}, ${e.nombre}`}
                        onClick={() => { setMesaId(m.id); setErr((x) => ({ ...x, mesa: "" })); }}
                        className={`${cond} grid aspect-square place-items-center rounded-xl text-xl font-bold transition ${activa ? "ring-3 ring-[#D9480F] ring-offset-2 ring-offset-[#FFFCF7]" : "hover:scale-105"}`}
                        style={{ background: e.fill, color: e.texto, boxShadow: `inset 0 0 0 2px ${e.stroke}` }}
                      >
                        {m.numero}
                      </button>
                    );
                  })}
                </div>
                {err.mesa ? <p className="mt-1.5 text-sm font-semibold text-[#C4301C]">{err.mesa}</p> : null}
              </div>
            ) : (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="np-cliente" className={label}>Nombre *</label>
                  <input id="np-cliente" className={input} value={cli.cliente} onChange={(e) => { setCli({ ...cli, cliente: e.target.value }); setErr((x) => ({ ...x, cliente: "" })); }} aria-invalid={!!err.cliente} aria-describedby={err.cliente ? "np-cliente-e" : undefined} placeholder="Ej.: Carla Méndez" />
                  {err.cliente ? <p id="np-cliente-e" className="mt-1 text-sm font-semibold text-[#C4301C]">{err.cliente}</p> : null}
                </div>
                {tipo === "delivery" ? (
                  <>
                    <div>
                      <label htmlFor="np-telefono" className={label}>Teléfono *</label>
                      <input id="np-telefono" type="tel" inputMode="tel" className={input} value={cli.telefono} onChange={(e) => { setCli({ ...cli, telefono: e.target.value }); setErr((x) => ({ ...x, telefono: "" })); }} aria-invalid={!!err.telefono} aria-describedby={err.telefono ? "np-telefono-e" : undefined} placeholder="351 555-0000" />
                      {err.telefono ? <p id="np-telefono-e" className="mt-1 text-sm font-semibold text-[#C4301C]">{err.telefono}</p> : null}
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="np-direccion" className={label}>Dirección *</label>
                      <input id="np-direccion" className={input} value={cli.direccion} onChange={(e) => { setCli({ ...cli, direccion: e.target.value }); setErr((x) => ({ ...x, direccion: "" })); }} aria-invalid={!!err.direccion} aria-describedby={err.direccion ? "np-direccion-e" : undefined} placeholder="Calle, número, piso y depto." />
                      {err.direccion ? <p id="np-direccion-e" className="mt-1 text-sm font-semibold text-[#C4301C]">{err.direccion}</p> : null}
                    </div>
                    <fieldset className="sm:col-span-2">
                      <legend className={label}>Paga con</legend>
                      <div className="grid grid-cols-3 gap-1.5">
                        {(["Efectivo", "Transferencia", "Tarjeta"] as Pago[]).map((v) => (
                          <label key={v} className={`cursor-pointer rounded-xl border py-2 text-center text-sm font-bold has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-[#D9480F] ${cli.pago === v ? "border-[#1F1A17] bg-[#1F1A17] text-[#F5EEE3]" : "border-[#E0D3C0] bg-white"}`}>
                            <input type="radio" name="np-pago" className="sr-only" checked={cli.pago === v} onChange={() => setCli({ ...cli, pago: v })} />
                            {v}
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  </>
                ) : null}
              </div>
            )}
          </section>

          {/* Menú */}
          <section aria-labelledby="np-menu">
            <h2 id="np-menu" className={`${cond} text-xl font-bold uppercase tracking-wide`}>2 · Elegí del menú</h2>
            <div className="-mx-3 mt-2 overflow-x-auto px-3 pb-1 sm:mx-0 sm:px-0">
              <div role="tablist" aria-label="Categorías del menú" className="flex w-max gap-1.5">
                {(["Populares", ...CATEGORIAS] as const).map((c) => (
                  <button
                    key={c}
                    type="button"
                    role="tab"
                    aria-selected={cat === c}
                    onClick={() => setCat(c)}
                    className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition ${cat === c ? "bg-[#1F1A17] text-[#F5EEE3]" : "bg-[#FFFCF7] text-[#5D5047] ring-1 ring-[#E4D8C6] hover:ring-[#C9B9A1]"}`}
                  >
                    {c === "Populares" ? "★ Más pedidos" : c}
                  </button>
                ))}
              </div>
            </div>
            <ul role="tabpanel" aria-label={cat} className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((it) => {
                const enComanda = lineas.filter((l) => l.itemId === it.id).reduce((a, l) => a + l.cant, 0);
                return (
                  <li key={it.id}>
                    <button
                      type="button"
                      onClick={() => elegir(it)}
                      className="group flex h-full w-full items-center gap-3 rounded-2xl border border-[#E4D8C6] bg-[#FFFCF7] p-2.5 text-left transition hover:-translate-y-0.5 hover:border-[#D9480F]/50 hover:shadow-[0_10px_24px_-14px_rgba(217,72,15,.6)] active:translate-y-0"
                    >
                      <Plato cat={it.cat} className="size-16 shrink-0 transition group-hover:rotate-6 motion-reduce:transition-none" />
                      <span className="min-w-0 flex-1">
                        <span className="block font-bold leading-snug">{it.nombre}</span>
                        <span className="block truncate text-xs text-[#726559]">{it.desc}</span>
                        <span className={`${cond} mt-0.5 block text-lg font-bold text-[#A5360B]`}>{pesos(it.precio)}</span>
                      </span>
                      <span className={`grid size-9 shrink-0 place-items-center rounded-full transition ${enComanda ? "bg-[#D2460F] text-white" : "bg-[#EFE5D6] text-[#5D5047] group-hover:bg-[#D2460F] group-hover:text-white"}`}>
                        {enComanda ? <span className={`${cond} text-lg font-bold`}>{enComanda}</span> : <Icon name="plus" className="size-4" strokeWidth={2.6} />}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        {/* Comanda */}
        <aside id="np-comanda" className="scroll-mt-24 lg:sticky lg:top-24 lg:self-start" aria-labelledby="np-com-t">
          <div className="overflow-hidden rounded-3xl bg-[#1F1A17] text-[#F5EEE3] shadow-[0_20px_40px_-20px_rgba(31,26,23,.8)]">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <h2 id="np-com-t" className={`${cond} text-2xl font-bold uppercase tracking-wide`}>Comanda</h2>
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-bold">
                {tipo === "mesa" ? (mesaId ? `Mesa ${state.mesas.find((m) => m.id === mesaId)?.numero}` : "Sin mesa") : tipo === "delivery" ? "Delivery" : "Para llevar"}
              </span>
            </div>
            <div className="max-h-[46vh] overflow-y-auto px-4 py-2 lg:max-h-[50vh]">
              {lineas.length ? (
                <ul className="divide-y divide-white/10">
                  {lineas.map((l) => (
                    <li key={l.key} className="flex items-start gap-3 py-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-bold leading-snug">{l.nombre}</p>
                        {l.mods.length ? <p className="text-xs text-[#F0B24A]">{l.mods.join(" · ")}</p> : null}
                        {l.nota ? <p className="text-xs italic text-white/60">“{l.nota}”</p> : null}
                        <p className="mt-0.5 text-xs text-white/50">{pesos(l.precio)} c/u</p>
                      </div>
                      <div className="flex items-center gap-1 rounded-full bg-white/[.08] p-0.5">
                        <button type="button" onClick={() => setLineas((xs) => xs.flatMap((x) => (x.key === l.key ? (x.cant > 1 ? [{ ...x, cant: x.cant - 1 }] : []) : [x])))} className="grid size-7 place-items-center rounded-full hover:bg-white/15" aria-label={`Quitar uno de ${l.nombre}`}>
                          <Icon name={l.cant > 1 ? "minus" : "trash"} className="size-3.5" strokeWidth={2.4} />
                        </button>
                        <span className={`${cond} w-5 text-center text-lg font-bold`}>{l.cant}</span>
                        <button type="button" onClick={() => setLineas((xs) => xs.map((x) => (x.key === l.key ? { ...x, cant: x.cant + 1 } : x)))} className="grid size-7 place-items-center rounded-full hover:bg-white/15" aria-label={`Sumar uno de ${l.nombre}`}>
                          <Icon name="plus" className="size-3.5" strokeWidth={2.4} />
                        </button>
                      </div>
                      <p className={`${cond} w-20 text-right text-lg font-bold tabular-nums`}>{pesos(l.precio * l.cant)}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <div id="np-lineas" tabIndex={-1} className="py-8 text-center outline-none">
                  <Plato cat="Parrilla" className="mx-auto size-16 opacity-40 grayscale" />
                  <p className="mt-2 text-sm text-white/60">Todavía no agregaste nada.</p>
                  {err.lineas ? <p className="mt-1 text-sm font-bold text-[#FF8A6B]">{err.lineas}</p> : null}
                </div>
              )}
            </div>
            <div className="border-t border-white/10 px-4 py-3">
              <label htmlFor="np-nota" className="mb-1 block text-xs font-bold uppercase tracking-[0.08em] text-white/55">Nota para cocina</label>
              <input id="np-nota" value={nota} onChange={(e) => setNota(e.target.value)} placeholder="Ej.: alérgico al maní, cumpleaños…" className="h-10 w-full rounded-xl border border-white/10 bg-white/[.06] px-3 text-sm text-white placeholder:text-white/35 focus:border-[#F0B24A] focus:outline-none" />
            </div>
            <div className="space-y-1 border-t border-white/10 px-4 py-3 text-sm">
              <p className="flex justify-between text-white/70"><span>Subtotal</span><span className="tabular-nums">{pesos(subtotal)}</span></p>
              {tipo === "delivery" ? <p className="flex justify-between text-white/70"><span>Envío</span><span className="tabular-nums">{pesos(envio)}</span></p> : null}
              <p className={`${cond} flex items-baseline justify-between pt-1 text-3xl font-bold`}><span className="text-lg uppercase tracking-wide">Total</span><span className="tabular-nums">{pesos(subtotal + envio)}</span></p>
            </div>
            <div className="p-4 pt-1">
              <button type="button" onClick={enviar} disabled={enviando} className={`${btn.brasa} w-full py-3.5 text-base`}>
                {enviando ? (
                  <><span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white motion-reduce:animate-none" aria-hidden="true" /> Enviando…</>
                ) : (
                  <><Icon name="flame" className="size-5" /> Enviar a cocina</>
                )}
              </button>
              <p className="mt-2 text-center text-[11px] text-white/40">Precios ficticios · demo sin cobro real</p>
            </div>
          </div>
        </aside>
      </div>

      <p className="sr-only" aria-live="polite">{anuncio}</p>
      <Modificadores item={modal} onClose={() => setModal(null)} onAdd={(l) => { agregar(l); setModal(null); }} />
    </div>
  );
}

function Modificadores({ item, onClose, onAdd }: { item: ItemMenu | null; onClose: () => void; onAdd: (l: Omit<Linea, "key">) => void }) {
  return (
    <Dialog
      open={!!item}
      onClose={onClose}
      titulo={item?.nombre ?? ""}
      subtitulo={item ? <p className="text-sm text-[#726559]">{item.desc}</p> : null}
      panelClassName="max-h-[92dvh] w-full rounded-t-3xl bg-[#FBF7F0] text-[#1F1A17] shadow-2xl sm:max-w-md sm:rounded-3xl"
      overlayClassName="bg-[#1F1A17]/55"
      headerClassName="px-5 pb-3 pt-5"
      tituloClassName={`${cond} text-2xl font-bold uppercase leading-tight`}
      cerrarClassName="-mr-2 rounded-lg hover:bg-[#EFE5D6]"
    >
      {item ? <ModForm key={item.id} item={item} onAdd={onAdd} /> : null}
    </Dialog>
  );
}

function ModForm({ item, onAdd }: { item: ItemMenu; onAdd: (l: Omit<Linea, "key">) => void }) {
  const [sel, setSel] = useState<Record<string, string[]>>(() =>
    Object.fromEntries((item.mods ?? []).map((g) => [g.id, g.tipo === "uno" && g.defecto ? [g.defecto] : []])),
  );
  const [cant, setCant] = useState(1);
  const [nota, setNota] = useState("");

  const { extra, nombres } = useMemo(() => {
    let e = 0;
    const n: string[] = [];
    for (const g of item.mods ?? []) {
      for (const id of sel[g.id] ?? []) {
        const o = g.opciones.find((x) => x.id === id);
        if (o) {
          e += o.extra ?? 0;
          n.push(o.nombre);
        }
      }
    }
    return { extra: e, nombres: n };
  }, [item, sel]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onAdd({ itemId: item.id, nombre: item.nombre, cant, mods: nombres, precio: item.precio + extra, nota: nota.trim() });
      }}
    >
      <div className="space-y-5 px-5 pb-4">
        <div className="flex items-center gap-3 rounded-2xl bg-[#F5EEE3] p-3">
          <Plato cat={item.cat} className="size-14" />
          <p className={`${cond} text-2xl font-bold text-[#A5360B]`}>{pesos(item.precio)}</p>
        </div>
        {(item.mods ?? []).map((g) => (
          <fieldset key={g.id}>
            <legend className="mb-2 text-sm font-bold">
              {g.nombre} <span className="font-medium text-[#726559]">{g.tipo === "uno" ? "· elegí uno" : "· opcional"}</span>
            </legend>
            <div className="grid gap-1.5">
              {g.opciones.map((o) => {
                const activo = (sel[g.id] ?? []).includes(o.id);
                return (
                  <label key={o.id} className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-[#D9480F] ${activo ? "border-[#D9480F] bg-[#FDE8DC]" : "border-[#E0D3C0] bg-white hover:border-[#C9B9A1]"}`}>
                    <input
                      type={g.tipo === "uno" ? "radio" : "checkbox"}
                      name={`mod-${g.id}`}
                      checked={activo}
                      onChange={() =>
                        setSel((s) => ({
                          ...s,
                          [g.id]: g.tipo === "uno" ? [o.id] : activo ? (s[g.id] ?? []).filter((x) => x !== o.id) : [...(s[g.id] ?? []), o.id],
                        }))
                      }
                      className="size-4 accent-[#D9480F]"
                    />
                    <span className="flex-1 text-[15px] font-semibold">{o.nombre}</span>
                    {o.extra ? <span className="text-sm font-bold text-[#A5360B]">+{pesos(o.extra)}</span> : null}
                  </label>
                );
              })}
            </div>
          </fieldset>
        ))}
        <div>
          <label htmlFor="mod-nota" className={label}>Aclaración para cocina</label>
          <input id="mod-nota" className={input} value={nota} onChange={(e) => setNota(e.target.value)} placeholder="Ej.: sin sal, bien dorado…" maxLength={60} />
        </div>
      </div>
      <div className="sticky bottom-0 flex items-center gap-3 border-t border-[#E4D8C6] bg-[#FBF7F0] px-5 py-4">
        <div className="flex items-center gap-1 rounded-full bg-white p-1 ring-1 ring-[#E0D3C0]">
          <button type="button" onClick={() => setCant((c) => Math.max(1, c - 1))} className="grid size-9 place-items-center rounded-full hover:bg-[#EFE5D6]" aria-label="Uno menos">
            <Icon name="minus" className="size-4" strokeWidth={2.4} />
          </button>
          <output className={`${cond} w-7 text-center text-2xl font-bold`} aria-live="polite">{cant}</output>
          <button type="button" onClick={() => setCant((c) => Math.min(20, c + 1))} className="grid size-9 place-items-center rounded-full hover:bg-[#EFE5D6]" aria-label="Uno más">
            <Icon name="plus" className="size-4" strokeWidth={2.4} />
          </button>
        </div>
        <button type="submit" className={`${btn.brasa} flex-1 py-3`}>
          Agregar · {pesos((item.precio + extra) * cant)}
        </button>
      </div>
    </form>
  );
}
