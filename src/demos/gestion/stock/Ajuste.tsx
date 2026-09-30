"use client";

import { useState } from "react";
import { Dialog } from "../shared/Dialog";
import { Icon } from "../shared/Icon";
import { diaRelativo, hora, pesos } from "../shared/util";
import { estadoDe, TIPOS, type Producto, type TipoMov } from "./data";
import { useStock } from "./context";
import { BarraStock, btn, CatIcono, EstadoBadge, input, label, mono, TipoBadge } from "./ui";

const OPCIONES: { id: TipoMov; nombre: string; ayuda: string }[] = [
  { id: "ingreso", nombre: "Ingreso", ayuda: "Mercadería que llegó (remito de proveedor)." },
  { id: "venta", nombre: "Venta", ayuda: "Salida por venta en mostrador." },
  { id: "ajuste", nombre: "Conteo", ayuda: "Cargá lo que contaste: se ajusta la diferencia." },
  { id: "rotura", nombre: "Rotura", ayuda: "Pérdida, rotura o vencimiento." },
  { id: "devolucion", nombre: "Devolución", ayuda: "Un cliente devolvió mercadería." },
];

const NOTA_DEFECTO: Record<TipoMov, string> = {
  ingreso: "Ingreso de mercadería",
  venta: "Venta mostrador",
  ajuste: "Conteo físico",
  rotura: "Rotura / pérdida",
  devolucion: "Devolución de cliente",
};

export function Ajuste({ abierto, onClose }: { abierto: { id: string; tipo?: TipoMov } | null; onClose: () => void }) {
  const { producto } = useStock();
  const p = abierto ? producto(abierto.id) : undefined;
  return (
    <Dialog
      open={!!p}
      onClose={onClose}
      titulo="Ajustar stock"
      variante="derecha"
      panelClassName="h-full w-full max-w-[460px] border-l-4 border-[#F26B1D] bg-[#F6F5F2] shadow-[-20px_0_50px_-20px_rgba(0,0,0,.5)]"
      overlayClassName="bg-black/45"
      headerClassName="bg-[#1C1E22] px-4 py-3 text-white"
      tituloClassName="text-sm font-bold uppercase tracking-[0.12em] text-[#F26B1D]"
      cerrarClassName="-mr-1 text-white/70 hover:text-white"
    >
      {p ? <Contenido key={`${p.id}-${abierto?.tipo ?? ""}`} p={p} tipoInicial={abierto?.tipo} onClose={onClose} /> : null}
    </Dialog>
  );
}

function Contenido({ p, tipoInicial, onClose }: { p: Producto; tipoInicial?: TipoMov; onClose: () => void }) {
  const { mover, state, now } = useStock();
  const [tipo, setTipo] = useState<TipoMov>(tipoInicial ?? "ingreso");
  const [cant, setCant] = useState(tipoInicial === "ajuste" ? String(p.stock) : "1");
  const [nota, setNota] = useState("");
  const [err, setErr] = useState("");

  const n = Math.floor(Number(cant));
  const valido = cant !== "" && Number.isFinite(n) && n >= 0;
  const delta = !valido ? 0 : tipo === "ajuste" ? n - p.stock : tipo === "venta" || tipo === "rotura" ? -n : n;
  const final = p.stock + delta;
  const historial = state.movimientos.filter((m) => m.productoId === p.id).slice(0, 6);

  function cambiarTipo(t: TipoMov) {
    setTipo(t);
    setErr("");
    setCant(t === "ajuste" ? String(p.stock) : "1");
  }

  function paso(d: number) {
    const v = Math.max(0, (valido ? n : 0) + d);
    setCant(String(v));
    setErr("");
  }

  function guardar(e: React.FormEvent) {
    e.preventDefault();
    if (!valido) return setErr("Ingresá una cantidad válida (número entero).");
    if (tipo !== "ajuste" && n === 0) return setErr("La cantidad tiene que ser mayor a cero.");
    if (tipo === "ajuste" && delta === 0) return setErr("El conteo coincide con el sistema: no hay nada que ajustar.");
    if (final < 0) return setErr(`No alcanza: hay ${p.stock} en stock.`);
    const r = mover(p.id, tipo, tipo === "ajuste" ? delta : n, nota.trim() || NOTA_DEFECTO[tipo]);
    if (r) return setErr(r);
    onClose();
  }

  const estadoFinal = estadoDe({ ...p, stock: Math.max(0, final) });

  return (
    <form onSubmit={guardar} noValidate className="flex min-h-full flex-col">
      <div className="border-b border-[#D9D6CF] bg-white p-4">
        <div className="flex gap-3">
          <CatIcono c={p.categoria} className="size-14" />
          <div className="min-w-0">
            <p className="font-bold leading-snug">{p.nombre}</p>
            <p className={`${mono} mt-0.5 text-[11px] text-[#6B6860]`}>{p.sku} · EAN {p.ean}</p>
            <p className="mt-1 text-xs text-[#6B6860]">{p.proveedor} · Ubicación <span className={`${mono} font-semibold text-[#1C1E22]`}>{p.ubicacion}</span></p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 border border-[#D9D6CF] text-center">
          <div className="border-r border-[#D9D6CF] p-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#6B6860]">Stock</p>
            <p className={`${mono} text-xl font-bold`}>{p.stock}</p>
          </div>
          <div className="border-r border-[#D9D6CF] p-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#6B6860]">Mínimo</p>
            <p className={`${mono} text-xl font-bold`}>{p.minimo}</p>
          </div>
          <div className="grid place-items-center p-2"><EstadoBadge p={p} /></div>
        </div>
        <p className="mt-2 flex justify-between text-xs text-[#6B6860]">
          <span>Costo <span className={`${mono} font-semibold text-[#1C1E22]`}>{pesos(p.costo)}</span></span>
          <span>Venta <span className={`${mono} font-semibold text-[#1C1E22]`}>{pesos(p.venta)}</span></span>
        </p>
      </div>

      <div className="space-y-4 p-4">
        <fieldset>
          <legend className={label}>Tipo de movimiento</legend>
          <div className="grid grid-cols-3 gap-1 sm:grid-cols-5">
            {OPCIONES.map((o) => (
              <label key={o.id} className={`cursor-pointer border px-1 py-2 text-center text-xs font-bold uppercase tracking-[0.03em] transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-1 has-[:focus-visible]:outline-[#F26B1D] ${tipo === o.id ? "border-[#1C1E22] bg-[#1C1E22] text-white" : "border-[#BDB9B0] bg-white hover:border-[#1C1E22]"}`}>
                <input type="radio" name="tipo" value={o.id} checked={tipo === o.id} onChange={() => cambiarTipo(o.id)} className="sr-only" />
                {o.nombre}
              </label>
            ))}
          </div>
          <p className="mt-1.5 text-xs text-[#6B6860]">{OPCIONES.find((o) => o.id === tipo)!.ayuda}</p>
        </fieldset>

        <div>
          <label htmlFor="aj-cant" className={label}>{tipo === "ajuste" ? "Cantidad contada" : "Cantidad"}</label>
          <div className="flex">
            <button type="button" onClick={() => paso(-1)} className="grid h-12 w-12 shrink-0 place-items-center border border-r-0 border-[#1C1E22] bg-white hover:bg-[#F0EFEB]" aria-label="Restar uno">
              <Icon name="minus" strokeWidth={2.6} />
            </button>
            <input
              id="aj-cant"
              inputMode="numeric"
              value={cant}
              onChange={(e) => { setCant(e.target.value.replace(/[^\d]/g, "")); setErr(""); }}
              aria-invalid={!!err}
              aria-describedby="aj-prev aj-err"
              data-autofocus
              className={`${mono} h-12 w-full min-w-0 border border-[#1C1E22] bg-white text-center text-2xl font-bold focus:outline-none focus:ring-3 focus:ring-[#F26B1D]/40`}
            />
            <button type="button" onClick={() => paso(1)} className="grid h-12 w-12 shrink-0 place-items-center border border-l-0 border-[#1C1E22] bg-white hover:bg-[#F0EFEB]" aria-label="Sumar uno">
              <Icon name="plus" strokeWidth={2.6} />
            </button>
          </div>
          {tipo !== "ajuste" ? (
            <div className="mt-1.5 flex gap-1">
              {[5, 10, 25, 50].map((v) => (
                <button key={v} type="button" onClick={() => paso(v)} className={`${mono} flex-1 border border-[#D9D6CF] bg-white py-1 text-xs font-semibold hover:border-[#1C1E22]`}>+{v}</button>
              ))}
            </div>
          ) : null}
        </div>

        <div id="aj-prev" className={`border-2 p-3 ${final < 0 ? "border-[#C0262D] bg-[#FFF3F3]" : "border-[#1C1E22] bg-white"}`} aria-live="polite">
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#6B6860]">Vista previa</p>
          <p className={`${mono} mt-1 flex items-center gap-2 text-lg font-bold`}>
            {p.stock}
            <Icon name="arrow-right" className="size-4 text-[#9A968D]" />
            <span className={final < 0 ? "text-[#C0262D]" : estadoFinal === "ok" ? "text-[#1F7A3E]" : "text-[#8A5A00]"}>{final}</span>
            <span className={`ml-auto text-sm ${delta > 0 ? "text-[#1F7A3E]" : delta < 0 ? "text-[#B4400C]" : "text-[#9A968D]"}`}>
              {delta > 0 ? "+" : ""}{delta}
            </span>
          </p>
          <div className="mt-2"><BarraStock p={{ ...p, stock: Math.max(0, final) }} ancho="w-full" /></div>
          {final >= 0 && estadoFinal !== "ok" ? <p className="mt-1.5 text-xs font-semibold text-[#8A5A00]">Queda por debajo del mínimo ({p.minimo}).</p> : null}
        </div>

        <div>
          <label htmlFor="aj-nota" className={label}>Nota (opcional)</label>
          <input id="aj-nota" className={input} value={nota} onChange={(e) => setNota(e.target.value)} placeholder={tipo === "ingreso" ? "Ej.: Remito 0003-00012345" : "Ej.: Factura B 1234"} />
        </div>

        <p id="aj-err" role="alert" className="min-h-5 text-sm font-semibold text-[#C0262D]">{err}</p>

        <div className="flex gap-2">
          <button type="button" className={`${btn.secundario} flex-1`} onClick={onClose}>Cancelar</button>
          <button type="submit" className={`${btn.primario} flex-[2]`}>
            <Icon name="check" className="size-4" strokeWidth={2.6} /> Registrar {TIPOS[tipo].nombre.toLowerCase()}
          </button>
        </div>
      </div>

      <div className="mt-auto border-t border-[#D9D6CF] p-4">
        <p className={label}>Últimos movimientos</p>
        {historial.length ? (
          <ul className="mt-2 divide-y divide-[#E2DFD8] border border-[#D9D6CF] bg-white">
            {historial.map((m) => (
              <li key={m.id} className="flex items-center gap-2 px-2.5 py-2 text-xs">
                <span className={`${mono} w-24 shrink-0 text-[#6B6860]`}>{diaRelativo(m.fecha, now)} {hora(m.fecha)}</span>
                <TipoBadge tipo={m.tipo} />
                <span className={`${mono} ml-auto font-bold ${m.cantidad > 0 ? "text-[#1F7A3E]" : "text-[#B4400C]"}`}>{m.cantidad > 0 ? "+" : ""}{m.cantidad}</span>
                <span className={`${mono} w-10 text-right text-[#6B6860]`}>= {m.stockFinal}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-1 text-sm text-[#6B6860]">Sin movimientos registrados.</p>
        )}
      </div>
    </form>
  );
}
