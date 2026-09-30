"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Dialog } from "../shared/Dialog";
import { Icon, type IconName } from "../shared/Icon";
import { usePersistentState, useNow, uid } from "../shared/store";
import { ToastProvider, useToast } from "../shared/Toasts";
import { normalizar } from "../shared/util";
import { crearSemilla, estadoDe, TIPOS, USUARIO, type Producto, type StockState, type TipoMov } from "./data";
import { Ctx, type StockCtx, type Vista } from "./context";
import { Ajuste } from "./Ajuste";
import { AltaProducto } from "./AltaProducto";
import { Alertas } from "./Alertas";
import { Escaner } from "./Escaner";
import { Movimientos } from "./Movimientos";
import { Productos } from "./Productos";
import { Resumen } from "./Resumen";
import { btn, mono } from "./ui";

export function StockApp() {
  return (
    <ToastProvider
      className="inset-x-3 top-3 items-center sm:inset-x-auto sm:bottom-28 sm:left-5 sm:top-auto sm:items-start"
      render={(t, cerrar) => (
        <div className="flex w-full max-w-sm items-stretch overflow-hidden rounded-[4px] bg-[#1C1E22] text-sm text-white shadow-[0_10px_30px_-8px_rgba(0,0,0,.5)] ring-1 ring-black">
          <span className={`w-1.5 shrink-0 ${t.tono === "error" ? "bg-[#E5484D]" : t.tono === "alerta" ? "bg-[#F2C12E]" : "bg-[#F26B1D]"}`} aria-hidden="true" />
          <span className="min-w-0 flex-1 px-3 py-2.5 font-semibold">{t.texto}</span>
          {t.accion ? (
            <button type="button" onClick={() => { t.accion!.fn(); cerrar(); }} className="px-3 text-xs font-bold uppercase tracking-[0.06em] text-[#FF9A5C] hover:bg-white/10">
              {t.accion.label}
            </button>
          ) : null}
          <button type="button" onClick={cerrar} aria-label="Cerrar aviso" className="grid w-9 place-items-center text-white/60 hover:bg-white/10 hover:text-white">
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
  { id: "resumen", label: "Resumen", icon: "chart" },
  { id: "productos", label: "Productos", icon: "box" },
  { id: "movimientos", label: "Movimientos", icon: "history" },
  { id: "alertas", label: "Alertas", icon: "alert" },
  { id: "escaner", label: "Escáner", icon: "scan" },
];

function App() {
  const { state, update, reset } = usePersistentState<StockState>("demo-gestion-stock", 1, crearSemilla, "day");
  const now = useNow(60_000);
  const toast = useToast();
  const [vista, setVistaRaw] = useState<Vista>("resumen");
  const [ajuste, setAjuste] = useState<{ id: string; tipo?: TipoMov } | null>(null);
  const [alta, setAlta] = useState<{ open: boolean; ean?: string }>({ open: false });
  const [menu, setMenu] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    try {
      const v = window.localStorage.getItem("demo-gestion-stock-vista") as Vista | null;
      if (v && NAV.some((n) => n.id === v)) setVistaRaw(v);
    } catch {
      /* nada */
    }
  }, []);

  const setVista = useCallback((v: Vista) => {
    setVistaRaw(v);
    setMenu(false);
    try {
      window.localStorage.setItem("demo-gestion-stock-vista", v);
    } catch {
      /* nada */
    }
    window.scrollTo({ top: 0 });
  }, []);

  const ctx = useMemo<StockCtx | null>(() => {
    if (!state || !now) return null;
    const producto = (id: string) => state.productos.find((p) => p.id === id);
    const mover: StockCtx["mover"] = (id, tipo, cantidad, nota = "", opts) => {
      const p = producto(id);
      if (!p) return "Producto inexistente";
      const delta = tipo === "ajuste" ? cantidad : tipo === "venta" || tipo === "rotura" ? -Math.abs(cantidad) : Math.abs(cantidad);
      if (delta === 0) return "La cantidad no puede ser cero.";
      if (p.stock + delta < 0) return `No alcanza: hay ${p.stock} ${p.unidad}${p.stock === 1 ? "" : "s"} en stock.`;
      const final = p.stock + delta;
      const mov = { id: uid("m"), fecha: new Date().toISOString(), productoId: id, tipo, cantidad: delta, stockFinal: final, usuario: USUARIO, nota };
      update((s) => ({
        ...s,
        productos: s.productos.map((x) => (x.id === id ? { ...x, stock: final } : x)),
        movimientos: [mov, ...s.movimientos],
      }));
      if (!opts?.silencioso) {
        const antes = estadoDe(p);
        const despues = estadoDe({ ...p, stock: final });
        const aviso = despues !== "ok" && antes === "ok" ? " · quedó bajo el mínimo" : "";
        toast(`${TIPOS[tipo].nombre}: ${delta > 0 ? "+" : ""}${delta} · ${p.nombre.split(" ").slice(0, 3).join(" ")} → ${final}${aviso}`, {
          tono: despues === "ok" ? "ok" : "alerta",
          accion: {
            label: "Deshacer",
            fn: () =>
              update((s) => ({
                ...s,
                productos: s.productos.map((x) => (x.id === id ? { ...x, stock: x.stock - delta } : x)),
                movimientos: s.movimientos.filter((m) => m.id !== mov.id),
              })),
          },
        });
      }
      return null;
    };
    return {
      state,
      now,
      vista,
      setVista,
      producto,
      mover,
      abrirAjuste: (id, tipo) => setAjuste({ id, tipo }),
      abrirAlta: (ean) => setAlta({ open: true, ean }),
      crearProducto: (p) => {
        const id = uid("p");
        const movs = p.stock > 0
          ? [{ id: uid("m"), fecha: new Date().toISOString(), productoId: id, tipo: "ingreso" as const, cantidad: p.stock, stockFinal: p.stock, usuario: USUARIO, nota: "Stock inicial (alta)" }]
          : [];
        update((s) => ({ ...s, productos: [{ ...p, id }, ...s.productos], movimientos: [...movs, ...s.movimientos] }));
        toast(`Producto ${p.sku} dado de alta`);
      },
      confirmarPedido: (proveedor, items) => {
        const numero = state.proximoPedido;
        update((s) => ({
          ...s,
          proximoPedido: s.proximoPedido + 1,
          pedidos: [
            {
              id: uid("oc"),
              numero,
              proveedor,
              fecha: new Date().toISOString(),
              items: items.map((i) => ({ ...i, costo: s.productos.find((p) => p.id === i.productoId)?.costo ?? 0 })),
              estado: "enviado",
            },
            ...s.pedidos,
          ],
        }));
        toast(`Orden de compra Nº ${numero} registrada (${proveedor})`);
        return numero;
      },
      recibirPedido: (pid) => {
        const ped = state.pedidos.find((x) => x.id === pid);
        if (!ped || ped.estado === "recibido") return;
        const fecha = new Date().toISOString();
        update((s) => {
          let productos = s.productos;
          const movs = ped.items.map((it) => {
            const p = productos.find((x) => x.id === it.productoId);
            const final = (p?.stock ?? 0) + it.cantidad;
            productos = productos.map((x) => (x.id === it.productoId ? { ...x, stock: final } : x));
            return { id: uid("m"), fecha, productoId: it.productoId, tipo: "ingreso" as const, cantidad: it.cantidad, stockFinal: final, usuario: USUARIO, nota: `OC Nº ${ped.numero} · ${ped.proveedor}` };
          });
          return {
            ...s,
            productos,
            movimientos: [...movs.reverse(), ...s.movimientos],
            pedidos: s.pedidos.map((x) => (x.id === pid ? { ...x, estado: "recibido", recibido: fecha } : x)),
          };
        });
        toast(`Mercadería de la OC Nº ${ped.numero} ingresada al stock`);
      },
    };
  }, [state, now, vista, setVista, update, toast]);

  const alertas = state ? state.productos.filter((p) => estadoDe(p) !== "ok").length : 0;

  const sidebar = (
    <nav aria-label="Secciones del inventario" className="flex h-full flex-col bg-[#1C1E22] text-[#D8D5CE]">
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-4">
        <Logo />
        <div className="leading-none">
          <p className="text-[17px] font-bold uppercase tracking-[0.02em] text-white">El Tornillo</p>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#F26B1D]">Ferretería · Stock</p>
        </div>
      </div>
      <ul className="space-y-px py-3">
        {NAV.map((n) => {
          const activo = vista === n.id;
          return (
            <li key={n.id}>
              <button
                type="button"
                onClick={() => setVista(n.id)}
                aria-current={activo ? "page" : undefined}
                className={`relative flex w-full items-center gap-3 px-4 py-2.5 text-[15px] font-semibold uppercase tracking-[0.04em] transition ${activo ? "bg-white/[.07] text-white" : "text-[#A9A59C] hover:bg-white/[.04] hover:text-white"}`}
              >
                {activo ? <span className="absolute inset-y-1 left-0 w-1 bg-[#F26B1D]" aria-hidden="true" /> : null}
                <Icon name={n.icon} className={`size-[18px] ${activo ? "text-[#F26B1D]" : ""}`} strokeWidth={2} />
                <span className="flex-1 text-left">{n.label}</span>
                {n.id === "alertas" && alertas > 0 ? (
                  <span className={`${mono} min-w-6 rounded-[3px] bg-[#F26B1D] px-1.5 text-center text-xs font-bold leading-5 text-[#1C1E22]`}>{alertas}</span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
      <div className="mx-4 border-t border-white/10 pt-4">
        <button type="button" onClick={() => { setMenu(false); setAlta({ open: true }); }} className="flex w-full items-center gap-2 text-sm font-semibold uppercase tracking-[0.04em] text-[#A9A59C] hover:text-white">
          <Icon name="plus" className="size-4" strokeWidth={2.2} /> Alta de producto
        </button>
      </div>
      <div className="mt-auto p-4">
        <div className="border border-dashed border-white/20 p-3">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-white">Demo · datos ficticios</p>
          <p className="mt-1 text-xs leading-relaxed text-[#A9A59C]">Los cambios quedan guardados en este navegador.</p>
          <button type="button" onClick={() => setConfirmReset(true)} className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.06em] text-[#FF9A5C] hover:text-[#FFB88C]">
            <Icon name="refresh" className="size-3.5" strokeWidth={2.2} /> Restablecer demo
          </button>
        </div>
      </div>
    </nav>
  );

  return (
    <div className="min-h-dvh bg-[#ECEBE7] text-[#1C1E22] [font-family:var(--font-stk-sans)]">
      <div className="lg:grid lg:grid-cols-[232px_minmax(0,1fr)]">
        <div className="hidden bg-[#1C1E22] lg:block">
          <aside className="sticky top-0 h-dvh overflow-y-auto">{sidebar}</aside>
        </div>
        <div className="min-w-0">
          <Topbar ctx={ctx} onMenu={() => setMenu(true)} onAlta={() => setAlta({ open: true })} vista={vista} />
          <main className="px-3 pb-36 pt-4 sm:px-5 lg:px-6 lg:pt-5">
            {ctx ? (
              <Ctx.Provider value={ctx}>
                {vista === "resumen" ? <Resumen /> : vista === "productos" ? <Productos /> : vista === "movimientos" ? <Movimientos /> : vista === "alertas" ? <Alertas /> : <Escaner />}
                <footer className="mt-10 flex flex-wrap justify-between gap-2 border-t-2 border-[#1C1E22] pt-3 text-xs font-semibold uppercase tracking-[0.06em] text-[#6B6860]">
                  <p>Demo con contenido ficticio · Ferretería El Tornillo no existe</p>
                  <p>Precios y proveedores inventados</p>
                </footer>
              </Ctx.Provider>
            ) : (
              <div aria-busy="true" aria-label="Cargando" className="grid animate-pulse gap-3 motion-reduce:animate-none sm:grid-cols-4">
                {[0, 1, 2, 3].map((i) => <div key={i} className="h-24 bg-[#DDDBD5]" />)}
                <div className="h-72 bg-[#DDDBD5] sm:col-span-4" />
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
        panelClassName="h-full w-[82vw] max-w-[280px] bg-[#1C1E22] shadow-2xl"
        headerClassName="absolute right-2 top-3 z-10"
        tituloClassName="sr-only"
        cerrarClassName="text-white/70 hover:text-white"
        overlayClassName="bg-black/60"
      >
        {sidebar}
      </Dialog>

      {ctx ? (
        <Ctx.Provider value={ctx}>
          <Ajuste abierto={ajuste} onClose={() => setAjuste(null)} />
          <AltaProducto open={alta.open} ean={alta.ean} onClose={() => setAlta({ open: false })} />
        </Ctx.Provider>
      ) : null}

      <Dialog
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        titulo="¿Restablecer la demo?"
        panelClassName="w-full border-t-4 border-[#F26B1D] bg-white p-5 shadow-2xl sm:max-w-md"
        tituloClassName="text-lg font-bold uppercase tracking-[0.02em]"
        cerrarClassName="-mr-2 -mt-1 hover:bg-[#F0EFEB]"
        footerClassName="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"
        footer={
          <>
            <button type="button" className={btn.secundario} onClick={() => setConfirmReset(false)}>Cancelar</button>
            <button
              type="button"
              className={btn.primario}
              onClick={() => {
                reset();
                setConfirmReset(false);
                setAjuste(null);
                setMenu(false);
                toast("Demo restablecida con el inventario de ejemplo", { tono: "info" });
              }}
            >
              Sí, restablecer
            </button>
          </>
        }
      >
        <p className="mt-2 text-sm text-[#55524B]">Vuelven los productos, movimientos y pedidos de ejemplo. Se pierde lo que cargaste.</p>
      </Dialog>
    </div>
  );
}

function Logo() {
  return (
    <svg viewBox="0 0 40 40" className="size-10 shrink-0" aria-hidden="true">
      <rect width="40" height="40" fill="#F26B1D" />
      <path d="M0 34l6-6h4l-6 6zM8 34l6-6h4l-6 6zM16 34l6-6h4l-6 6zM24 34l6-6h4l-6 6zM32 34l6-6h2v1l-5 5z" fill="#1C1E22" opacity=".9" />
      <path d="M13 7h14l-2 5H15z" fill="#1C1E22" />
      <path d="M17 12h6v11l-3 4-3-4z" fill="#1C1E22" />
      <path d="M17 15l6 1.6M17 18.4l6 1.6" stroke="#F26B1D" strokeWidth="1.4" />
    </svg>
  );
}

function Topbar({ ctx, onMenu, onAlta, vista }: { ctx: StockCtx | null; onMenu: () => void; onAlta: () => void; vista: Vista }) {
  const [q, setQ] = useState("");
  const [abierto, setAbierto] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  const res = useMemo(() => {
    if (!ctx || !q.trim()) return [];
    const n = normalizar(q.trim());
    return ctx.state.productos.filter((p) => normalizar(`${p.nombre} ${p.sku} ${p.ean}`).includes(n)).slice(0, 7);
  }, [ctx, q]);

  useEffect(() => {
    const fuera = (e: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setAbierto(false);
    };
    document.addEventListener("mousedown", fuera);
    return () => document.removeEventListener("mousedown", fuera);
  }, []);

  const elegir = (p: Producto) => {
    ctx?.abrirAjuste(p.id);
    setQ("");
    setAbierto(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b-2 border-[#F26B1D] bg-[#26292E] text-white">
      <div className="flex h-14 items-center gap-2 px-2 sm:gap-3 sm:px-5 lg:px-6">
        <button type="button" onClick={onMenu} aria-label="Abrir menú" className="grid size-10 place-items-center text-white/80 hover:text-white lg:hidden">
          <Icon name="menu" />
        </button>
        <div ref={wrap} className="relative min-w-0 flex-1 sm:max-w-md">
          <label htmlFor="stk-buscar" className="sr-only">Buscar producto por nombre, SKU o código</label>
          <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/50" />
          <input
            id="stk-buscar"
            type="search"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={abierto && q.length > 0}
            aria-controls="stk-res"
            value={q}
            autoComplete="off"
            onChange={(e) => { setQ(e.target.value); setAbierto(true); }}
            onFocus={() => setAbierto(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && res[0]) { e.preventDefault(); elegir(res[0]); }
              if (e.key === "Escape") { setQ(""); setAbierto(false); }
              if (e.key === "ArrowDown") { e.preventDefault(); wrap.current?.querySelector<HTMLButtonElement>("[data-res]")?.focus(); }
            }}
            placeholder="Buscar producto, SKU o código…"
            className="h-9 w-full rounded-[4px] border border-white/15 bg-white/[.06] pl-9 pr-3 text-sm text-white placeholder:text-white/45 focus:border-[#F26B1D] focus:bg-white/10 focus:outline-none"
          />
          {abierto && q.trim() ? (
            <div
              id="stk-res"
              className="absolute inset-x-0 top-11 z-50 border border-[#1C1E22] bg-white text-[#1C1E22] shadow-[0_14px_36px_-10px_rgba(0,0,0,.5)]"
              onKeyDown={(e) => {
                const items = Array.from(wrap.current?.querySelectorAll<HTMLButtonElement>("[data-res]") ?? []);
                const i = items.indexOf(document.activeElement as HTMLButtonElement);
                if (e.key === "ArrowDown") { e.preventDefault(); items[Math.min(i + 1, items.length - 1)]?.focus(); }
                if (e.key === "ArrowUp") { e.preventDefault(); if (i <= 0) wrap.current?.querySelector("input")?.focus(); else items[i - 1]?.focus(); }
                if (e.key === "Escape") { setAbierto(false); wrap.current?.querySelector("input")?.focus(); }
              }}
            >
              {res.length ? (
                <ul>
                  {res.map((p) => (
                    <li key={p.id}>
                      <button type="button" data-res onClick={() => elegir(p)} className="flex w-full items-center gap-3 border-b border-[#EEEDE9] px-3 py-2 text-left last:border-0 hover:bg-[#FFF1E6] focus:bg-[#FFF1E6] focus:outline-none">
                        <span className={`${mono} w-20 shrink-0 text-xs font-semibold text-[#6B6860]`}>{p.sku}</span>
                        <span className="min-w-0 flex-1 truncate text-sm font-semibold">{p.nombre}</span>
                        <span className={`${mono} text-sm font-bold ${estadoDe(p) === "ok" ? "" : "text-[#C0262D]"}`}>{p.stock}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-3 py-4 text-sm text-[#6B6860]">Sin coincidencias para “{q}”.</p>
              )}
            </div>
          ) : null}
        </div>
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => ctx?.setVista("escaner")}
            aria-label="Abrir escáner"
            className={`grid size-10 place-items-center rounded-[4px] transition hover:bg-white/10 ${vista === "escaner" ? "text-[#F26B1D]" : "text-white/80"}`}
          >
            <Icon name="scan" strokeWidth={2} />
          </button>
          <button type="button" onClick={onAlta} className={`${btn.primario} max-sm:size-10 max-sm:px-0`}>
            <Icon name="plus" className="size-4" strokeWidth={2.6} />
            <span className="max-sm:sr-only">Producto</span>
          </button>
          <div className="hidden items-center gap-2.5 border-l border-white/15 pl-3 md:flex">
            <span className={`${mono} grid size-8 place-items-center rounded-[3px] bg-[#F26B1D] text-xs font-bold text-[#1C1E22]`}>RC</span>
            <div className="leading-tight">
              <p className="text-sm font-bold">{USUARIO}</p>
              <p className="text-[11px] uppercase tracking-[0.08em] text-white/55">Encargado de depósito</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
