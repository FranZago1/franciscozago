"use client";

import { useMemo, useRef, useState } from "react";
import { Icon } from "../shared/Icon";
import { hora, pesos } from "../shared/util";
import { estadoDe, type Producto } from "./data";
import { useStock } from "./context";
import { Titulo } from "./Resumen";
import { BarraStock, btn, CatIcono, EstadoBadge, mono } from "./ui";

type Modo = "venta" | "ingreso" | "consulta";
type Lectura = { id: number; codigo: string; productoId?: string; modo: Modo; cant: number; ok: boolean; fecha: string; msg?: string };

const CODIGO_DESCONOCIDO = "7791234567898";

export function Escaner() {
  const { state, producto, mover, abrirAlta, abrirAjuste } = useStock();
  const [modo, setModo] = useState<Modo>("venta");
  const [mult, setMult] = useState(1);
  const [codigo, setCodigo] = useState("");
  const [lecturas, setLecturas] = useState<Lectura[]>([]);
  const [flash, setFlash] = useState<"ok" | "error" | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const seq = useRef(0);

  const muestras = useMemo(() => {
    const ids = ["p1", "p7", "p11", "p17", "p24", "p30"];
    return ids.map((id) => state.productos.find((p) => p.id === id)).filter(Boolean) as Producto[];
  }, [state.productos]);

  const ultima = lecturas[0];
  const pUltimo = ultima?.productoId ? producto(ultima.productoId) : undefined;

  function leer(raw: string) {
    const cod = raw.replace(/\D/g, "");
    if (!cod) return;
    const p = state.productos.find((x) => x.ean === cod || x.sku.replace(/\D/g, "") === cod);
    const l: Lectura = { id: ++seq.current, codigo: cod, productoId: p?.id, modo, cant: mult, ok: !!p, fecha: new Date().toISOString() };
    if (p && modo !== "consulta") {
      const err = mover(p.id, modo, mult, modo === "venta" ? "Venta con escáner" : "Ingreso con escáner", { silencioso: true });
      if (err) {
        l.ok = false;
        l.msg = err;
      }
    }
    if (!p) l.msg = "Código no registrado";
    setLecturas((xs) => [l, ...xs].slice(0, 12));
    setFlash(l.ok ? "ok" : "error");
    window.setTimeout(() => setFlash(null), 450);
    setCodigo("");
    inputRef.current?.focus();
  }

  return (
    <div>
      <Titulo titulo="Escáner" sub="Lector de código de barras (simulado)" />

      <div className="grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="border border-[#1C1E22] bg-[#1C1E22] p-3 text-white sm:p-4">
          <div role="radiogroup" aria-label="Modo de lectura" className="grid grid-cols-3 gap-px bg-white/15 p-px">
            {([["venta", "Venta −1"], ["ingreso", "Ingreso +1"], ["consulta", "Consulta"]] as const).map(([m, t]) => (
              <button key={m} type="button" role="radio" aria-checked={modo === m} onClick={() => setModo(m)} className={`py-2 text-xs font-bold uppercase tracking-[0.06em] transition ${modo === m ? "bg-[#F26B1D] text-[#1C1E22]" : "bg-[#1C1E22] text-white/70 hover:text-white"}`}>
                {m === "consulta" ? t : t.replace("1", String(mult))}
              </button>
            ))}
          </div>

          <div className={`relative mt-3 grid aspect-[16/9] place-items-center overflow-hidden border-2 transition-colors ${flash === "ok" ? "border-[#2F9E57] bg-[#2F9E57]/15" : flash === "error" ? "border-[#E5484D] bg-[#E5484D]/15" : "border-white/10 bg-[#111214]"}`}>
            <svg viewBox="0 0 320 180" className="absolute inset-0 size-full" aria-hidden="true">
              {[[20, 20, 1, 1], [300, 20, -1, 1], [20, 160, 1, -1], [300, 160, -1, -1]].map(([x, y, sx, sy], i) => (
                <path key={i} d={`M${x} ${y! + 24 * sy!} V${y} H${x! + 24 * sx!}`} stroke="#F26B1D" strokeWidth="3" fill="none" />
              ))}
              <g transform="translate(96 58)" fill="#E9E7E1" opacity=".85">
                {Array.from({ length: 34 }, (_, i) => (
                  <rect key={i} x={i * 3.8} y="0" width={[1, 2, 1, 3, 1, 2][i % 6]} height="56" />
                ))}
              </g>
              <text x="160" y="132" textAnchor="middle" fontSize="10" fill="#9A968D" style={{ fontFamily: "var(--font-stk-mono)" }}>APUNTÁ AL CÓDIGO</text>
            </svg>
            <span className="stk-laser absolute inset-x-6 h-0.5 bg-[#FF3B30] shadow-[0_0_12px_2px_rgba(255,59,48,.8)]" aria-hidden="true" />
            <style>{`
              @keyframes stk-laser { 0%,100% { top: 18% } 50% { top: 80% } }
              .stk-laser { animation: stk-laser 2.2s ease-in-out infinite }
              @media (prefers-reduced-motion: reduce) { .stk-laser { animation: none; top: 50% } }
            `}</style>
          </div>

          <form
            className="mt-3 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              leer(codigo);
            }}
          >
            <label htmlFor="esc-cod" className="sr-only">Código de barras o SKU</label>
            <input
              ref={inputRef}
              id="esc-cod"
              inputMode="numeric"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="Escaneá o tipeá el código y Enter"
              className={`${mono} h-11 min-w-0 flex-1 border border-white/20 bg-white/[.06] px-3 text-base tracking-[0.08em] text-white placeholder:text-sm placeholder:tracking-normal placeholder:text-white/40 focus:border-[#F26B1D] focus:outline-none`}
            />
            <button type="submit" className={`${btn.primario} h-11`}>Leer</button>
          </form>

          {ultima ? (
            <p className={`mt-2 flex items-center gap-2 text-sm font-semibold lg:hidden ${ultima.ok ? "text-[#7DDB9B]" : "text-[#FF8A8A]"}`}>
              <Icon name={ultima.ok ? "check" : "alert"} className="size-4 shrink-0" strokeWidth={2.4} />
              <span className="truncate">
                {pUltimo ? `${pUltimo.nombre} · stock ${pUltimo.stock}` : `${ultima.codigo}: no registrado`}
              </span>
            </p>
          ) : null}

          <div className="mt-3 flex items-center gap-2 text-xs">
            <label htmlFor="esc-mult" className="font-bold uppercase tracking-[0.06em] text-white/60">Unidades por lectura</label>
            <select id="esc-mult" value={mult} onChange={(e) => setMult(Number(e.target.value))} className={`${mono} h-8 border border-white/20 bg-[#1C1E22] px-2 text-sm text-white`}>
              {[1, 2, 5, 10, 12, 25].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.1em] text-white/50">Simular lectura</p>
          <div className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {muestras.map((p) => (
              <button key={p.id} type="button" onClick={() => leer(p.ean)} className="flex items-center gap-2 border border-white/10 bg-white/[.04] px-2.5 py-2 text-left transition hover:border-[#F26B1D] hover:bg-white/[.08]">
                <Icon name="barcode" className="size-4 shrink-0 text-[#F26B1D]" />
                <span className="min-w-0">
                  <span className="block truncate text-xs font-semibold">{p.nombre}</span>
                  <span className={`${mono} text-[10px] text-white/45`}>{p.ean}</span>
                </span>
              </button>
            ))}
            <button type="button" onClick={() => leer(CODIGO_DESCONOCIDO)} className="flex items-center gap-2 border border-dashed border-white/25 px-2.5 py-2 text-left transition hover:border-[#F26B1D] sm:col-span-2">
              <Icon name="alert" className="size-4 shrink-0 text-[#F2C12E]" />
              <span className="text-xs font-semibold">Código desconocido <span className={`${mono} text-white/45`}>{CODIGO_DESCONOCIDO}</span></span>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <section aria-live="polite" aria-label="Última lectura" className="border border-[#D9D6CF] bg-white">
            <header className="border-b border-[#D9D6CF] bg-[#F6F5F2] px-3.5 py-2 text-[13px] font-bold uppercase tracking-[0.08em]">Última lectura</header>
            {!ultima ? (
              <div className="p-6 text-center">
                <Icon name="scan" className="mx-auto size-10 text-[#BDB9B0]" strokeWidth={1.4} />
                <p className="mt-2 text-sm text-[#6B6860]">Escaneá un código o tocá una de las lecturas simuladas.</p>
              </div>
            ) : pUltimo ? (
              <div className="p-4">
                <div className="flex gap-3">
                  <CatIcono c={pUltimo.categoria} className="size-16" />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold leading-snug">{pUltimo.nombre}</p>
                    <p className={`${mono} text-[11px] text-[#6B6860]`}>{pUltimo.sku} · {pUltimo.ubicacion}</p>
                    <div className="mt-1.5 flex items-center gap-2"><EstadoBadge p={pUltimo} /><span className={`${mono} text-sm font-semibold`}>{pesos(pUltimo.venta)}</span></div>
                  </div>
                </div>
                <div className={`mt-3 flex items-center justify-between border-2 p-3 ${ultima.ok ? "border-[#1C1E22]" : "border-[#C0262D] bg-[#FFF3F3]"}`}>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#6B6860]">
                      {ultima.modo === "consulta" ? "Consulta" : ultima.ok ? (ultima.modo === "venta" ? `Venta registrada −${ultima.cant}` : `Ingreso registrado +${ultima.cant}`) : "No se registró"}
                    </p>
                    {ultima.msg ? <p className="text-sm font-semibold text-[#C0262D]">{ultima.msg}</p> : null}
                  </div>
                  <p className={`${mono} text-3xl font-bold ${estadoDe(pUltimo) === "ok" ? "" : "text-[#B4400C]"}`}>{pUltimo.stock}</p>
                </div>
                <div className="mt-2"><BarraStock p={pUltimo} ancho="w-full" /></div>
                <button type="button" className={`${btn.secundario} mt-3 w-full`} onClick={() => abrirAjuste(pUltimo.id)}>
                  <Icon name="edit" className="size-4" /> Ajuste manual
                </button>
              </div>
            ) : (
              <div className="p-4">
                <div className="border-2 border-[#C0262D] bg-[#FFF3F3] p-3">
                  <p className="font-bold uppercase text-[#C0262D]">Código no registrado</p>
                  <p className={`${mono} mt-0.5 text-sm`}>{ultima.codigo}</p>
                </div>
                <button type="button" className={`${btn.primario} mt-3 w-full`} onClick={() => abrirAlta(ultima.codigo)}>
                  <Icon name="plus" className="size-4" strokeWidth={2.6} /> Dar de alta con este código
                </button>
              </div>
            )}
          </section>

          <section className="border border-[#D9D6CF] bg-white">
            <header className="flex items-center justify-between border-b border-[#D9D6CF] bg-[#F6F5F2] px-3.5 py-2">
              <h2 className="text-[13px] font-bold uppercase tracking-[0.08em]">Lecturas de esta sesión</h2>
              <span className={`${mono} text-xs text-[#6B6860]`}>{lecturas.length}</span>
            </header>
            {lecturas.length ? (
              <ul className="divide-y divide-[#EEEDE9]">
                {lecturas.map((l) => {
                  const p = l.productoId ? producto(l.productoId) : undefined;
                  return (
                    <li key={l.id} className="flex items-center gap-2.5 px-3.5 py-2 text-sm">
                      <span className={`grid size-5 shrink-0 place-items-center ${l.ok ? "bg-[#2F9E57] text-white" : "bg-[#C0262D] text-white"}`}>
                        <Icon name={l.ok ? "check" : "x"} className="size-3.5" strokeWidth={3} />
                      </span>
                      <span className={`${mono} w-11 shrink-0 text-xs text-[#6B6860]`}>{hora(l.fecha)}</span>
                      <span className="min-w-0 flex-1 truncate">{p?.nombre ?? <span className={mono}>{l.codigo}</span>}</span>
                      <span className={`${mono} text-xs font-bold ${l.modo === "venta" ? "text-[#B4400C]" : l.modo === "ingreso" ? "text-[#1F7A3E]" : "text-[#6B6860]"}`}>
                        {!l.ok ? "—" : l.modo === "venta" ? `−${l.cant}` : l.modo === "ingreso" ? `+${l.cant}` : "consulta"}
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="p-4 text-sm text-[#6B6860]">Sin lecturas todavía.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
