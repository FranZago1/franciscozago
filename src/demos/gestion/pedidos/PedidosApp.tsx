"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Dialog } from "../shared/Dialog";
import { Icon, type IconName } from "../shared/Icon";
import { usePersistentState, useNow, uid } from "../shared/store";
import { ToastProvider, useToast } from "../shared/Toasts";
import { normalizar, pesos } from "../shared/util";
import { crearSemilla, etiquetaOrigen, REPARTIDORES, totalPedido, USUARIO, type BrasaState, type Pedido } from "./data";
import { Ctx, type BrasaCtx, type Vista } from "./context";
import { Cocina } from "./Cocina";
import { Delivery } from "./Delivery";
import { NuevoPedido } from "./NuevoPedido";
import { Salon } from "./Salon";
import { btn, cond } from "./ui";

export function PedidosApp() {
  return (
    <ToastProvider
      className="inset-x-3 top-3 items-center sm:inset-x-auto sm:bottom-28 sm:left-5 sm:top-auto sm:items-start lg:left-28"
      render={(t, cerrar) => (
        <div className="flex w-full max-w-sm items-center gap-3 rounded-2xl bg-[#1F1A17] py-2.5 pl-3 pr-2 text-sm text-[#F5EEE3] shadow-[0_14px_36px_-10px_rgba(31,26,23,.7)] ring-1 ring-white/10">
          <span className={`grid size-7 shrink-0 place-items-center rounded-full ${t.tono === "error" ? "bg-[#C4301C]" : t.tono === "alerta" ? "bg-[#E8A33D] text-[#1F1A17]" : "bg-[#D9480F]"}`}>
            <Icon name={t.tono === "ok" ? "check" : t.tono === "info" ? "flame" : "alert"} className="size-4" strokeWidth={2.4} />
          </span>
          <span className="min-w-0 flex-1 font-semibold">{t.texto}</span>
          {t.accion ? (
            <button type="button" onClick={() => { t.accion!.fn(); cerrar(); }} className="rounded-lg px-2 py-1 font-bold text-[#F0B24A] hover:bg-white/10">
              {t.accion.label}
            </button>
          ) : null}
          <button type="button" onClick={cerrar} aria-label="Cerrar aviso" className="grid size-7 place-items-center rounded-lg text-white/50 hover:bg-white/10 hover:text-white">
            <Icon name="x" className="size-4" />
          </button>
        </div>
      )}
    >
      <App />
    </ToastProvider>
  );
}

const NAV: { id: Vista; label: string; icon: IconName }[] = [
  { id: "salon", label: "Salón", icon: "table" },
  { id: "cocina", label: "Cocina", icon: "flame" },
  { id: "nuevo", label: "Nuevo pedido", icon: "plus" },
  { id: "delivery", label: "Delivery", icon: "bike" },
];

function App() {
  const { state, update, reset } = usePersistentState<BrasaState>("demo-gestion-pedidos", 1, crearSemilla, "elapsed");
  const now = useNow(1000);
  const toast = useToast();
  const [vista, setVistaRaw] = useState<Vista>("salon");
  const [mesaSel, setMesaSel] = useState<string | null>(null);
  const [preOrigen, setPreOrigen] = useState<BrasaCtx["preOrigen"]>(null);
  const [menu, setMenu] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    try {
      const v = window.localStorage.getItem("demo-gestion-pedidos-vista") as Vista | null;
      if (v && NAV.some((n) => n.id === v)) setVistaRaw(v);
    } catch {
      /* nada */
    }
  }, []);

  const setVista = useCallback((v: Vista) => {
    setVistaRaw(v);
    setMenu(false);
    try {
      window.localStorage.setItem("demo-gestion-pedidos-vista", v);
    } catch {
      /* nada */
    }
    window.scrollTo({ top: 0 });
  }, []);

  // `now` cambia cada segundo: el contexto de acciones no depende de él para no recrearlas.
  const acciones = useMemo(() => {
    if (!state) return null;
    const setPedido = (id: string, fn: (p: Pedido) => Pedido) => update((s) => ({ ...s, pedidos: s.pedidos.map((p) => (p.id === id ? fn(p) : p)) }));
    const iso = () => new Date().toISOString();
    const mesa = (id: string) => state.mesas.find((m) => m.id === id);

    const avanzar = (id: string) => {
      const p = state.pedidos.find((x) => x.id === id);
      if (!p) return;
      const et = etiquetaOrigen(p, state.mesas);
      if (p.estado === "nuevo") {
        setPedido(id, (x) => ({ ...x, estado: "preparacion", iniciado: iso() }));
        toast(`#${p.numero} en preparación · ${et}`, { tono: "info", accion: { label: "Deshacer", fn: () => retroceder(id) } });
      } else if (p.estado === "preparacion") {
        setPedido(id, (x) => ({ ...x, estado: "listo", listo: iso(), lineas: x.lineas.map((l) => ({ ...l, hecho: true })) }));
        toast(`#${p.numero} listo para ${p.origen.tipo === "mesa" ? "servir" : p.origen.tipo === "delivery" ? "despachar" : "retirar"}`, { accion: { label: "Deshacer", fn: () => retroceder(id) } });
      } else if (p.estado === "listo") {
        const rep = REPARTIDORES[p.numero % REPARTIDORES.length]!;
        setPedido(id, (x) => ({
          ...x,
          estado: "entregado",
          entregado: iso(),
          delivery: x.origen.tipo === "delivery" ? { estado: "en_camino", repartidor: x.delivery?.repartidor ?? rep, salida: iso() } : x.delivery,
        }));
        toast(p.origen.tipo === "delivery" ? `#${p.numero} salió con ${p.delivery?.repartidor ?? rep}` : `#${p.numero} entregado · ${et}`, { accion: { label: "Deshacer", fn: () => retroceder(id) } });
      }
    };

    const retroceder = (id: string) =>
      setPedido(id, (x) => {
        if (x.estado === "preparacion") return { ...x, estado: "nuevo", iniciado: undefined };
        if (x.estado === "listo") return { ...x, estado: "preparacion", listo: undefined };
        if (x.estado === "entregado")
          return { ...x, estado: "listo", entregado: undefined, delivery: x.origen.tipo === "delivery" ? { estado: "esperando", repartidor: x.delivery?.repartidor } : x.delivery };
        return x;
      });

    return {
      mesa,
      pedidosMesa: (mesaId: string) => state.pedidos.filter((p) => p.origen.tipo === "mesa" && p.origen.mesaId === mesaId && !p.cobrado),
      avanzar,
      retroceder,
      toggleLinea: (pid: string, lid: string) => setPedido(pid, (x) => ({ ...x, lineas: x.lineas.map((l) => (l.id === lid ? { ...l, hecho: !l.hecho } : l)) })),
      crearPedido: ((origen, lineas, nota) => {
        const numero = state.proximo;
        const ahora = iso();
        const pedido: Pedido = {
          id: uid("o"),
          numero,
          origen,
          lineas: lineas.map((l) => ({ ...l, id: uid("l"), hecho: false })),
          nota,
          estado: "nuevo",
          creado: ahora,
          delivery: origen.tipo === "delivery" ? { estado: "esperando" } : undefined,
        };
        update((s) => ({
          proximo: s.proximo + 1,
          pedidos: [...s.pedidos, pedido],
          mesas:
            origen.tipo === "mesa"
              ? s.mesas.map((m) => (m.id === origen.mesaId ? { ...m, estado: m.estado === "cuenta" ? "cuenta" : "ocupada", comensales: Math.max(1, m.comensales), desde: m.desde ?? ahora } : m))
              : s.mesas,
        }));
        toast(`Comanda #${numero} enviada a cocina`);
        return numero;
      }) as BrasaCtx["crearPedido"],
      setEstadoMesa: ((id, estado, comensales) => {
        const m = mesa(id);
        update((s) => ({
          ...s,
          mesas: s.mesas.map((x) =>
            x.id === id
              ? {
                  ...x,
                  estado,
                  comensales: comensales ?? x.comensales,
                  desde: estado === "libre" ? undefined : x.desde ?? iso(),
                }
              : x,
          ),
        }));
        if (m) toast(`Mesa ${m.numero}: ${estado === "ocupada" ? "ocupada" : estado === "pidiendo" ? "quiere pedir" : estado === "cuenta" ? "pidió la cuenta" : "libre"}`, { tono: estado === "cuenta" ? "alerta" : "info" });
      }) as BrasaCtx["setEstadoMesa"],
      cobrarMesa: ((id, pago) => {
        const m = mesa(id);
        const total = state.pedidos.filter((p) => p.origen.tipo === "mesa" && p.origen.mesaId === id && !p.cobrado).reduce((a, p) => a + totalPedido(p), 0);
        update((s) => ({
          ...s,
          pedidos: s.pedidos.map((p) => (p.origen.tipo === "mesa" && p.origen.mesaId === id ? { ...p, cobrado: true } : p)),
          mesas: s.mesas.map((x) => (x.id === id ? { ...x, estado: "libre", comensales: 0, desde: undefined } : x)),
        }));
        if (m) toast(`Mesa ${m.numero} cobrada: ${pesos(total)} (${pago.toLowerCase()})`);
      }) as BrasaCtx["cobrarMesa"],
      despachar: (id: string, repartidor: string) => {
        const p = state.pedidos.find((x) => x.id === id);
        setPedido(id, (x) => ({ ...x, estado: "entregado", entregado: x.entregado ?? iso(), delivery: { estado: "en_camino", repartidor, salida: iso() } }));
        if (p) toast(`#${p.numero} salió con ${repartidor}`);
      },
      entregarDelivery: (id: string) => {
        const p = state.pedidos.find((x) => x.id === id);
        setPedido(id, (x) => ({ ...x, cobrado: true, delivery: { ...x.delivery!, estado: "entregado", llegada: iso() } }));
        if (p) toast(`#${p.numero} entregado a ${p.origen.tipo === "delivery" ? p.origen.cliente : "cliente"}`);
      },
    };
  }, [state, update, toast]);

  const tomarPedido = useCallback(
    (o: BrasaCtx["preOrigen"]) => {
      setPreOrigen(o);
      setVista("nuevo");
    },
    [setVista],
  );

  const ctx = useMemo<BrasaCtx | null>(
    () => (state && now && acciones ? { state, now, vista, setVista, mesaSel, setMesaSel, preOrigen, tomarPedido, ...acciones } : null),
    [state, now, vista, setVista, mesaSel, preOrigen, tomarPedido, acciones],
  );

  const oscuro = vista === "cocina";
  const enCocina = state ? state.pedidos.filter((p) => p.estado === "nuevo" || p.estado === "preparacion").length : 0;
  const deliveryActivos = state ? state.pedidos.filter((p) => p.origen.tipo === "delivery" && p.delivery?.estado !== "entregado").length : 0;
  const badge: Partial<Record<Vista, number>> = { cocina: enCocina, delivery: deliveryActivos };

  const navLista = (compacto: boolean) => (
    <ul className={compacto ? "flex flex-col items-center gap-1.5 py-3" : "space-y-1 px-3 py-3"}>
      {NAV.map((n) => {
        const activo = vista === n.id;
        return (
          <li key={n.id} className={compacto ? "w-full px-2" : ""}>
            <button
              type="button"
              onClick={() => (n.id === "nuevo" ? tomarPedido(null) : setVista(n.id))}
              aria-current={activo ? "page" : undefined}
              className={
                compacto
                  ? `relative flex w-full flex-col items-center gap-1 rounded-2xl py-2.5 text-[11px] font-bold transition ${activo ? "bg-[#D9480F] text-white shadow-[0_8px_20px_-8px_rgba(217,72,15,.9)]" : "text-[#C9B9A5] hover:bg-white/[.06] hover:text-white"}`
                  : `relative flex w-full items-center gap-3 rounded-xl px-3 py-3 text-[15px] font-bold transition ${activo ? "bg-[#D9480F] text-white" : "text-[#E9DCCB] hover:bg-white/[.06]"}`
              }
            >
              <Icon name={n.icon} className={compacto ? "size-6" : "size-5"} strokeWidth={n.id === "nuevo" ? 2.4 : 1.9} />
              <span className={compacto ? "leading-tight" : "flex-1 text-left"}>{compacto && n.id === "nuevo" ? "Nuevo" : n.label}</span>
              {badge[n.id] ? (
                <span className={`${compacto ? "absolute right-1.5 top-1.5" : ""} ${cond} grid min-w-5 place-items-center rounded-full bg-[#F0B24A] px-1 text-[12px] font-bold leading-5 text-[#1F1A17]`}>
                  {badge[n.id]}
                </span>
              ) : null}
            </button>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className={`min-h-dvh [font-family:var(--font-brasa)] transition-colors ${oscuro ? "bg-[#0E0C0B] text-[#FFF7EC]" : "bg-[#F5EEE3] text-[#1F1A17]"}`}>
      <div className="lg:grid lg:grid-cols-[92px_minmax(0,1fr)]">
        <div className="hidden bg-[#1F1A17] lg:block">
          <nav aria-label="Secciones de la parrilla" className="sticky top-0 flex h-dvh flex-col">
            <div className="grid place-items-center border-b border-white/10 py-4">
              <Logo />
            </div>
            {navLista(true)}
            <div className="mt-auto p-2 pb-4">
              <button type="button" onClick={() => setConfirmReset(true)} className="flex w-full flex-col items-center gap-1 rounded-2xl py-2 text-[10px] font-bold text-[#9C8B79] hover:bg-white/[.06] hover:text-white">
                <Icon name="refresh" className="size-5" />
                Restablecer
              </button>
            </div>
          </nav>
        </div>

        <div className="min-w-0">
          <Topbar ctx={ctx} oscuro={oscuro} onMenu={() => setMenu(true)} />
          <main className={`px-3 pb-36 pt-4 sm:px-5 lg:px-7 lg:pt-6`}>
            {ctx ? (
              <Ctx.Provider value={ctx}>
                {vista === "salon" ? <Salon /> : vista === "cocina" ? <Cocina /> : vista === "nuevo" ? <NuevoPedido key={JSON.stringify(preOrigen)} /> : <Delivery />}
                <footer className={`mt-12 flex flex-wrap justify-between gap-2 border-t pt-4 text-xs ${oscuro ? "border-white/10 text-white/40" : "border-[#E4D8C6] text-[#8A7B6C]"}`}>
                  <p>Demo con contenido ficticio · Parrilla La Brasa no existe.</p>
                  <p>Menú, precios, clientes y direcciones inventados.</p>
                </footer>
              </Ctx.Provider>
            ) : (
              <div aria-busy="true" aria-label="Cargando" className="grid animate-pulse gap-4 motion-reduce:animate-none lg:grid-cols-[1fr_340px]">
                <div className="h-[460px] rounded-3xl bg-[#EADFCF]" />
                <div className="h-[460px] rounded-3xl bg-[#EADFCF]" />
              </div>
            )}
          </main>
        </div>
      </div>

      <Dialog
        open={menu}
        onClose={() => setMenu(false)}
        titulo="Menú"
        variante="izquierda"
        panelClassName="h-full w-[80vw] max-w-[290px] bg-[#1F1A17] text-[#F5EEE3] shadow-2xl"
        headerClassName="absolute right-2 top-3 z-10"
        tituloClassName="sr-only"
        cerrarClassName="rounded-lg text-white/70 hover:text-white"
        overlayClassName="bg-black/55"
      >
        <nav aria-label="Secciones de la parrilla" className="flex h-full flex-col">
          <div className="flex items-center gap-3 border-b border-white/10 px-4 py-4">
            <Logo />
            <div>
              <p className={`${cond} text-xl font-bold uppercase leading-none tracking-wide`}>La Brasa</p>
              <p className="text-xs text-[#C9B9A5]">Parrilla · comandas</p>
            </div>
          </div>
          {navLista(false)}
          <div className="mt-auto p-4">
            <p className="text-xs text-[#C9B9A5]">Demo con datos ficticios. Los cambios quedan en este navegador.</p>
            <button type="button" onClick={() => setConfirmReset(true)} className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-[#F0B24A]">
              <Icon name="refresh" className="size-4" /> Restablecer demo
            </button>
          </div>
        </nav>
      </Dialog>

      <Dialog
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        titulo="¿Restablecer la demo?"
        panelClassName="w-full rounded-t-3xl bg-[#FBF7F0] p-6 text-[#1F1A17] shadow-2xl sm:max-w-md sm:rounded-3xl"
        tituloClassName={`${cond} text-2xl font-bold uppercase`}
        cerrarClassName="-mr-2 -mt-1 rounded-lg hover:bg-[#EFE5D6]"
        footerClassName="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"
        footer={
          <>
            <button type="button" className={btn.suave} onClick={() => setConfirmReset(false)}>Cancelar</button>
            <button
              type="button"
              className={btn.brasa}
              onClick={() => {
                reset();
                setConfirmReset(false);
                setMenu(false);
                setMesaSel(null);
                toast("Demo restablecida: salón y cocina como al principio", { tono: "info" });
              }}
            >
              Sí, restablecer
            </button>
          </>
        }
      >
        <p className="mt-2 text-sm text-[#5D5047]">Vuelven las mesas, comandas y deliveries de ejemplo, con los tiempos reiniciados.</p>
      </Dialog>
    </div>
  );
}

function Logo() {
  return (
    <svg viewBox="0 0 48 48" className="size-11" aria-hidden="true">
      <circle cx="24" cy="24" r="23" fill="#D9480F" />
      <path d="M24 38c-6.5 0-10.5-4-10.5-9.5 0-5 3.7-8.3 5.6-12 .8 2.5 2.1 4 3.7 4.8.4-4 2-7.7 5.2-11 .5 4.6 2.3 7.1 4.2 9.8 1.5 2.2 2.3 4.6 2.3 7.1C34.5 33.9 30.2 38 24 38z" fill="#F0B24A" />
      <path d="M24 38c-3 0-5-2-5-4.8 0-2.5 1.8-4.1 2.7-6 .5 1.3 1.1 2 1.9 2.4.2-2 1-3.8 2.5-5.4.3 2.2 1.1 3.5 2 4.8.7 1.1 1.1 2.3 1.1 3.5C29.2 36 27 38 24 38z" fill="#FFF3D6" />
      <path d="M12 41h24" stroke="#1F1A17" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

function Topbar({ ctx, oscuro, onMenu }: { ctx: BrasaCtx | null; oscuro: boolean; onMenu: () => void }) {
  const [q, setQ] = useState("");
  const [abierto, setAbierto] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  const res = useMemo(() => {
    if (!ctx || !q.trim()) return [];
    const n = normalizar(q.trim().replace(/^#/, ""));
    return [...ctx.state.pedidos]
      .reverse()
      .filter((p) => normalizar(`${p.numero} ${etiquetaOrigen(p, ctx.state.mesas)} ${p.origen.tipo === "delivery" ? p.origen.direccion : ""} ${p.lineas.map((l) => l.nombre).join(" ")}`).includes(n))
      .slice(0, 6);
  }, [ctx, q]);

  useEffect(() => {
    const fuera = (e: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setAbierto(false);
    };
    document.addEventListener("mousedown", fuera);
    return () => document.removeEventListener("mousedown", fuera);
  }, []);

  function elegir(p: Pedido) {
    if (!ctx) return;
    if (p.origen.tipo === "mesa") {
      ctx.setMesaSel(p.origen.mesaId);
      ctx.setVista("salon");
    } else if (p.origen.tipo === "delivery") ctx.setVista("delivery");
    else ctx.setVista("cocina");
    setQ("");
    setAbierto(false);
  }

  const reloj = ctx ? new Date(ctx.now).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false }) : "--:--";

  return (
    <header className={`sticky top-0 z-40 border-b backdrop-blur-md ${oscuro ? "border-white/10 bg-[#0E0C0B]/90" : "border-[#E4D8C6] bg-[#F5EEE3]/90"}`}>
      <div className="flex h-16 items-center gap-2 px-3 sm:gap-3 sm:px-5 lg:px-7">
        <button type="button" onClick={onMenu} aria-label="Abrir menú" className={`grid size-10 place-items-center rounded-xl lg:hidden ${oscuro ? "text-white/80 hover:bg-white/10" : "text-[#4A3F37] hover:bg-[#EFE5D6]"}`}>
          <Icon name="menu" />
        </button>
        <div className="hidden leading-none xl:block">
          <p className={`${cond} text-2xl font-bold uppercase tracking-wide`}>La Brasa</p>
          <p className={`text-[11px] font-semibold ${oscuro ? "text-white/50" : "text-[#8A7B6C]"}`}>Parrilla · Turno noche</p>
        </div>
        <div ref={wrap} className="relative min-w-0 flex-1 sm:max-w-sm xl:ml-6">
          <label htmlFor="br-buscar" className="sr-only">Buscar pedido por número, mesa o cliente</label>
          <Icon name="search" className={`pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 ${oscuro ? "text-white/40" : "text-[#A89A8A]"}`} />
          <input
            id="br-buscar"
            type="search"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={abierto && q.length > 0}
            aria-controls="br-res"
            value={q}
            autoComplete="off"
            onChange={(e) => { setQ(e.target.value); setAbierto(true); }}
            onFocus={() => setAbierto(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && res[0]) { e.preventDefault(); elegir(res[0]); }
              if (e.key === "Escape") { setQ(""); setAbierto(false); }
              if (e.key === "ArrowDown") { e.preventDefault(); wrap.current?.querySelector<HTMLButtonElement>("[data-res]")?.focus(); }
            }}
            placeholder="Buscar #pedido, mesa o cliente…"
            className={`h-10 w-full rounded-full border pl-10 pr-4 text-sm transition focus:outline-none focus:ring-3 ${oscuro ? "border-white/15 bg-white/[.06] text-white placeholder:text-white/40 focus:ring-[#D9480F]/40" : "border-[#E0D3C0] bg-[#FFFCF7] placeholder:text-[#A89A8A] focus:border-[#D9480F] focus:ring-[#D9480F]/15"}`}
          />
          {abierto && q.trim() ? (
            <div
              id="br-res"
              className="absolute inset-x-0 top-12 z-50 overflow-hidden rounded-2xl border border-[#E4D8C6] bg-[#FFFCF7] text-[#1F1A17] shadow-[0_18px_40px_-14px_rgba(31,26,23,.45)]"
              onKeyDown={(e) => {
                const items = Array.from(wrap.current?.querySelectorAll<HTMLButtonElement>("[data-res]") ?? []);
                const i = items.indexOf(document.activeElement as HTMLButtonElement);
                if (e.key === "ArrowDown") { e.preventDefault(); items[Math.min(i + 1, items.length - 1)]?.focus(); }
                if (e.key === "ArrowUp") { e.preventDefault(); if (i <= 0) wrap.current?.querySelector("input")?.focus(); else items[i - 1]?.focus(); }
                if (e.key === "Escape") { setAbierto(false); wrap.current?.querySelector("input")?.focus(); }
              }}
            >
              {res.length && ctx ? (
                <ul>
                  {res.map((p) => (
                    <li key={p.id}>
                      <button type="button" data-res onClick={() => elegir(p)} className="flex w-full items-center gap-3 px-3.5 py-2.5 text-left hover:bg-[#F5EEE3] focus:bg-[#F5EEE3] focus:outline-none">
                        <span className={`${cond} w-12 text-lg font-bold text-[#D9480F]`}>#{p.numero}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-bold">{etiquetaOrigen(p, ctx.state.mesas)}</span>
                          <span className="block truncate text-xs text-[#8A7B6C]">{p.lineas.map((l) => `${l.cant}× ${l.nombre}`).join(", ")}</span>
                        </span>
                        <span className="text-xs font-semibold text-[#8A7B6C]">{pesos(totalPedido(p))}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-4 py-4 text-sm text-[#8A7B6C]">No hay pedidos que coincidan.</p>
              )}
            </div>
          ) : null}
        </div>
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <p className={`${cond} hidden text-2xl font-semibold tabular-nums sm:block ${oscuro ? "text-[#F0B24A]" : "text-[#4A3F37]"}`} aria-label={`Hora actual ${reloj}`}>
            {reloj}
          </p>
          <button type="button" onClick={() => ctx?.tomarPedido(null)} className={`${btn.brasa} max-sm:size-10 max-sm:rounded-full max-sm:px-0`}>
            <Icon name="plus" className="size-4" strokeWidth={2.6} />
            <span className="max-sm:sr-only">Nuevo pedido</span>
          </button>
          <div className={`hidden items-center gap-2.5 border-l pl-3 md:flex ${oscuro ? "border-white/10" : "border-[#E4D8C6]"}`}>
            <span className="grid size-9 place-items-center rounded-full bg-[#F0B24A] text-xs font-bold text-[#1F1A17]">GP</span>
            <div className="leading-tight">
              <p className="text-sm font-bold">{USUARIO}</p>
              <p className={`text-xs ${oscuro ? "text-white/50" : "text-[#8A7B6C]"}`}>Encargada de salón</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
