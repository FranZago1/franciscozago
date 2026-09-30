"use client";

import { useEffect, useRef, useState } from "react";
import { Dialog } from "../shared/Dialog";
import { Icon } from "../shared/Icon";
import { pesos, pesosCorto } from "../shared/util";
import { totalPedido, type EstadoMesa, type Mesa, type Pago } from "./data";
import { useBrasa } from "./context";
import { btn, cond, ESTADO_MESA, minutos } from "./ui";

const ESTADO_COCINA = {
  nuevo: { t: "En cola", c: "bg-[#EFE7DA] text-[#5D5047]" },
  preparacion: { t: "En el fuego", c: "bg-[#FBE0CF] text-[#A5360B]" },
  listo: { t: "Listo para servir", c: "bg-[#DDEBCF] text-[#3F6420]" },
  entregado: { t: "Servido", c: "bg-[#F1ECE4] text-[#726559]" },
} as const;

export function Salon() {
  const { state, now, mesaSel, setMesaSel } = useBrasa();
  const panel = useRef<HTMLDivElement>(null);
  const sel = state.mesas.find((m) => m.id === mesaSel) ?? null;

  const cuenta = (e: EstadoMesa) => state.mesas.filter((m) => m.estado === e).length;
  const comensales = state.mesas.reduce((a, m) => a + (m.estado === "libre" ? 0 : m.comensales), 0);
  const lugares = state.mesas.reduce((a, m) => a + m.lugares, 0);
  const abiertas = state.pedidos.filter((p) => p.origen.tipo === "mesa" && !p.cobrado).reduce((a, p) => a + totalPedido(p), 0);

  useEffect(() => {
    if (!mesaSel || !panel.current) return;
    if (window.matchMedia("(max-width: 1023px)").matches) {
      panel.current.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    }
  }, [mesaSel]);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[#726559]">Turno noche · {state.mesas.length} mesas</p>
          <h1 className={`${cond} text-4xl font-bold uppercase leading-none tracking-wide`}>Salón</h1>
        </div>
        <dl className="flex flex-wrap gap-2">
          {(Object.keys(ESTADO_MESA) as EstadoMesa[]).map((e) => (
            <div key={e} className="flex items-center gap-2 rounded-full border border-[#E4D8C6] bg-[#FFFCF7] py-1 pl-1.5 pr-3">
              <span className="size-4 rounded-full border" style={{ background: ESTADO_MESA[e].fill, borderColor: ESTADO_MESA[e].stroke }} aria-hidden="true" />
              <dt className="text-xs font-bold">{ESTADO_MESA[e].nombre}</dt>
              <dd className={`${cond} text-base font-bold`}>{cuenta(e)}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
        <Dato k="Ocupación" v={`${Math.round((comensales / lugares) * 100)}%`} s={`${comensales} de ${lugares} lugares`} />
        <Dato k="Mesas abiertas" v={String(state.mesas.length - cuenta("libre"))} s={`${cuenta("cuenta")} esperan la cuenta`} />
        <Dato k="En mesas" v={pesosCorto(abiertas)} s="consumo sin cobrar" />
      </div>

      <div className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="overflow-hidden rounded-3xl border border-[#E4D8C6] bg-[#FFFCF7] p-2 shadow-[0_2px_0_#E4D8C6] sm:p-3">
          <Plano mesas={state.mesas} sel={mesaSel} onSel={(id) => setMesaSel(id === mesaSel ? null : id)} now={now} />
          <div className="grid grid-cols-7 gap-1.5 px-1 pt-3 lg:hidden" role="group" aria-label="Acceso rápido a mesas">
            {[...state.mesas].sort((a, b) => a.numero - b.numero).map((m) => (
              <button
                key={m.id}
                type="button"
                aria-pressed={mesaSel === m.id}
                aria-label={`Mesa ${m.numero}, ${ESTADO_MESA[m.estado].nombre}`}
                onClick={() => setMesaSel(m.id === mesaSel ? null : m.id)}
                className={`${cond} grid h-10 place-items-center rounded-xl text-lg font-bold ${mesaSel === m.id ? "ring-3 ring-[#D9480F] ring-offset-1" : ""}`}
                style={{ background: ESTADO_MESA[m.estado].fill, color: ESTADO_MESA[m.estado].texto, boxShadow: `inset 0 0 0 2px ${ESTADO_MESA[m.estado].stroke}` }}
              >
                {m.numero}
              </button>
            ))}
          </div>
          <p className="px-2 pb-1 pt-2 text-xs text-[#726559]">Tocá una mesa para ver su estado, tomar el pedido o cobrar. También podés recorrerlas con Tab.</p>
        </div>
        <div ref={panel} className="scroll-mt-20">
          {sel ? <PanelMesa key={sel.id} m={sel} /> : <SinSeleccion />}
        </div>
      </div>
    </div>
  );
}

function Dato({ k, v, s }: { k: string; v: string; s: string }) {
  return (
    <div className="rounded-2xl border border-[#E4D8C6] bg-[#FFFCF7] px-3 py-2.5 sm:px-4 sm:py-3">
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#726559] sm:text-xs">{k}</p>
      <p className={`${cond} mt-0.5 truncate text-2xl font-bold sm:text-3xl`}>{v}</p>
      <p className="truncate text-[11px] text-[#726559] sm:text-xs">{s}</p>
    </div>
  );
}

function SinSeleccion() {
  return (
    <div className="flex h-full min-h-48 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[#E0D3C0] p-6 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-[#EFE5D6] text-[#D9480F]"><Icon name="table" /></span>
      <p className="mt-3 font-bold">Elegí una mesa</p>
      <p className="mt-1 max-w-60 text-sm text-[#726559]">Vas a ver los comensales, lo que pidieron y cuánto van consumiendo.</p>
    </div>
  );
}

function Plano({ mesas, sel, onSel, now }: { mesas: Mesa[]; sel: string | null; onSel: (id: string) => void; now: number }) {
  return (
    <svg viewBox="0 0 1000 640" className="h-auto w-full select-none" role="group" aria-label="Plano del salón y la vereda">
      <style>{`
        @keyframes br-pulse { 0%,100% { opacity: .1 } 50% { opacity: .55 } }
        .br-pulse { animation: br-pulse 1.6s ease-in-out infinite }
        @media (prefers-reduced-motion: reduce) { .br-pulse { animation: none; opacity: .3 } }
        .br-mesa:focus-visible .br-foco { stroke: #D9480F; stroke-width: 4; stroke-dasharray: 6 4 }
      `}</style>
      <defs>
        <pattern id="br-piso" width="40" height="40" patternUnits="userSpaceOnUse">
          <rect width="40" height="40" fill="#F7F0E4" />
          <path d="M0 40L40 0" stroke="#EFE4D3" strokeWidth="1" />
        </pattern>
        <pattern id="br-vereda" width="24" height="24" patternUnits="userSpaceOnUse">
          <rect width="24" height="24" fill="#EDE7DD" />
          <rect x="1" y="1" width="22" height="22" fill="none" stroke="#DDD3C3" />
        </pattern>
      </defs>
      {/* Salón */}
      <rect x="10" y="10" width="660" height="620" rx="22" fill="url(#br-piso)" stroke="#DCCDB8" strokeWidth="2" />
      <text x="34" y="606" fontSize="15" fontWeight="700" fill="#A8977F" letterSpacing="3">SALÓN</text>
      {/* Ventanal */}
      <line x1="670" y1="330" x2="670" y2="620" stroke="#9DB7C2" strokeWidth="6" strokeLinecap="round" />
      {/* Parrilla */}
      <g>
        <rect x="690" y="10" width="300" height="190" rx="22" fill="#2A221E" />
        <text x="712" y="42" fontSize="15" fontWeight="700" fill="#C9B9A5" letterSpacing="3">PARRILLA</text>
        <rect x="720" y="62" width="240" height="96" rx="10" fill="#15110F" />
        {Array.from({ length: 11 }, (_, i) => (
          <line key={i} x1={736 + i * 21} y1="70" x2={736 + i * 21} y2="150" stroke="#6B5E53" strokeWidth="3" />
        ))}
        {[[760, 128], [810, 118], [870, 132], [920, 120]].map(([x, y], i) => (
          <ellipse key={i} cx={x} cy={y} rx="18" ry="10" fill="#8A3B1C" />
        ))}
        <circle cx="760" cy="95" r="7" fill="#F0B24A" opacity=".8" />
        <circle cx="900" cy="92" r="6" fill="#D9480F" opacity=".8" />
        <text x="840" y="186" fontSize="13" textAnchor="middle" fill="#9C8B79">brasas de quebracho</text>
      </g>
      {/* Barra */}
      <g>
        <rect x="690" y="222" width="300" height="60" rx="16" fill="#B98B5E" />
        <rect x="700" y="232" width="280" height="40" rx="10" fill="#C99E71" />
        <text x="840" y="258" fontSize="14" fontWeight="700" textAnchor="middle" fill="#6E4B2C" letterSpacing="3">BARRA</text>
        {Array.from({ length: 6 }, (_, i) => (
          <circle key={i} cx={718 + i * 49} cy="300" r="10" fill="#E4D8C6" stroke="#C9B9A5" strokeWidth="2" />
        ))}
      </g>
      {/* Vereda */}
      <rect x="690" y="330" width="300" height="300" rx="22" fill="url(#br-vereda)" stroke="#DCCDB8" strokeWidth="2" />
      <text x="712" y="360" fontSize="15" fontWeight="700" fill="#A8977F" letterSpacing="3">VEREDA</text>
      <circle cx="966" cy="350" r="14" fill="#7FA35A" /><circle cx="958" cy="342" r="9" fill="#9BBF74" />
      {/* Entrada */}
      <g>
        <rect x="300" y="614" width="110" height="16" rx="4" fill="#F5EEE3" />
        <text x="355" y="606" fontSize="12" fontWeight="700" textAnchor="middle" fill="#A8977F" letterSpacing="2">ENTRADA</text>
      </g>

      {mesas.map((m) => (
        <MesaSvg key={m.id} m={m} activa={sel === m.id} onSel={onSel} now={now} />
      ))}
    </svg>
  );
}

function MesaSvg({ m, activa, onSel, now }: { m: Mesa; activa: boolean; onSel: (id: string) => void; now: number }) {
  const e = ESTADO_MESA[m.estado];
  const w = m.forma === "rect" ? (m.lugares >= 8 ? 190 : 150) : 78;
  const h = m.forma === "rect" ? 74 : 78;
  const sillas: [number, number][] = [];
  if (m.forma === "redonda") {
    for (let i = 0; i < m.lugares; i++) {
      const a = (i / m.lugares) * Math.PI * 2 - Math.PI / 2 + (m.lugares === 2 ? 0 : Math.PI / 4);
      sillas.push([Math.cos(a) * 54, Math.sin(a) * 54]);
    }
  } else {
    const porLado = m.forma === "rect" ? m.lugares / 2 : 2;
    for (let i = 0; i < porLado; i++) {
      const x = -w / 2 + (w / porLado) * (i + 0.5);
      sillas.push([x, -h / 2 - 15], [x, h / 2 + 15]);
    }
  }
  const mins = m.desde && m.estado !== "libre" ? minutos(now - Date.parse(m.desde)) : null;
  const etiqueta = `Mesa ${m.numero}, ${m.zona}, ${m.lugares} lugares, ${e.nombre}${m.estado !== "libre" ? `, ${m.comensales} comensales` : ""}${mins !== null ? `, hace ${mins} minutos` : ""}`;

  return (
    <g
      className="br-mesa cursor-pointer outline-none"
      transform={`translate(${m.x} ${m.y})`}
      role="button"
      tabIndex={0}
      aria-pressed={activa}
      aria-label={etiqueta}
      onClick={() => onSel(m.id)}
      onKeyDown={(ev) => {
        if (ev.key === "Enter" || ev.key === " ") {
          ev.preventDefault();
          onSel(m.id);
        }
      }}
    >
      {sillas.map(([x, y], i) => (
        <rect key={i} x={x - 11} y={y - 11} width="22" height="22" rx="7" fill={m.estado === "libre" ? "#E9DFD0" : "#C9B9A5"} />
      ))}
      {m.estado === "pidiendo" || m.estado === "cuenta" ? (
        m.forma === "redonda" ? (
          <circle className="br-pulse" r="52" fill={e.fill} />
        ) : (
          <rect className="br-pulse" x={-w / 2 - 12} y={-h / 2 - 12} width={w + 24} height={h + 24} rx="22" fill={e.fill} />
        )
      ) : null}
      {m.forma === "redonda" ? (
        <circle className="br-foco" r="40" fill={e.fill} stroke={activa ? "#D9480F" : e.stroke} strokeWidth={activa ? 5 : 2.5} />
      ) : (
        <rect className="br-foco" x={-w / 2} y={-h / 2} width={w} height={h} rx="14" fill={e.fill} stroke={activa ? "#D9480F" : e.stroke} strokeWidth={activa ? 5 : 2.5} />
      )}
      <text y={mins !== null ? -2 : 9} textAnchor="middle" fontSize="28" fontWeight="700" fill={e.texto} style={{ fontFamily: "var(--font-brasa-cond)" }}>
        {m.numero}
      </text>
      {mins !== null ? (
        <text y="20" textAnchor="middle" fontSize="13" fontWeight="600" fill={e.texto} opacity=".85" aria-hidden="true">
          {m.comensales}p · {mins}′
        </text>
      ) : null}
    </g>
  );
}

function PanelMesa({ m }: { m: Mesa }) {
  const { now, pedidosMesa, setEstadoMesa, tomarPedido, cobrarMesa, setMesaSel } = useBrasa();
  const pedidos = pedidosMesa(m.id);
  const total = pedidos.reduce((a, p) => a + totalPedido(p), 0);
  const [comensales, setComensales] = useState(Math.min(2, m.lugares));
  const [cobrar, setCobrar] = useState(false);
  const [pago, setPago] = useState<Pago>("Efectivo");
  const [propina, setPropina] = useState(10);
  const e = ESTADO_MESA[m.estado];

  return (
    <section aria-labelledby="pm-titulo" className="overflow-hidden rounded-3xl border border-[#E4D8C6] bg-[#FFFCF7] shadow-[0_2px_0_#E4D8C6]">
      <header className="flex items-start gap-3 border-b border-[#EFE5D6] p-4">
        <span className={`${cond} grid size-14 shrink-0 place-items-center rounded-2xl text-3xl font-bold`} style={{ background: e.fill, color: e.texto, boxShadow: `inset 0 0 0 2px ${e.stroke}` }}>
          {m.numero}
        </span>
        <div className="min-w-0 flex-1">
          <h2 id="pm-titulo" className={`${cond} text-2xl font-bold uppercase leading-tight`}>Mesa {m.numero}</h2>
          <p className="text-sm text-[#726559]">{m.zona} · {m.lugares} lugares · mozo {m.mozo}</p>
          <span className={`mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${e.chip}`}>
            {e.nombre}
            {m.desde && m.estado !== "libre" ? ` · hace ${minutos(now - Date.parse(m.desde))} min` : ""}
          </span>
        </div>
        <button type="button" className={btn.icono} onClick={() => setMesaSel(null)} aria-label="Cerrar panel de mesa">
          <Icon name="x" />
        </button>
      </header>

      {m.estado === "libre" ? (
        <div className="p-4">
          <p className="text-sm font-bold">¿Cuántos se sientan?</p>
          <div className="mt-2 flex items-center gap-2">
            <button type="button" className={`${btn.suave} size-11 px-0`} onClick={() => setComensales((c) => Math.max(1, c - 1))} aria-label="Uno menos">
              <Icon name="minus" />
            </button>
            <output className={`${cond} w-12 text-center text-3xl font-bold`} aria-live="polite">{comensales}</output>
            <button type="button" className={`${btn.suave} size-11 px-0`} onClick={() => setComensales((c) => Math.min(m.lugares + 2, c + 1))} aria-label="Uno más">
              <Icon name="plus" />
            </button>
            <span className="text-sm text-[#726559]">de {m.lugares} lugares</span>
          </div>
          <div className="mt-4 grid gap-2">
            <button type="button" className={btn.carbon} onClick={() => setEstadoMesa(m.id, "ocupada", comensales)}>
              <Icon name="users" className="size-4" /> Sentar clientes
            </button>
            <button type="button" className={btn.brasa} onClick={() => { setEstadoMesa(m.id, "ocupada", comensales); tomarPedido({ tipo: "mesa", mesaId: m.id }); }}>
              <Icon name="plus" className="size-4" strokeWidth={2.4} /> Sentar y tomar pedido
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="max-h-[340px] overflow-y-auto p-4">
            {pedidos.length ? (
              <ul className="space-y-3">
                {pedidos.map((p) => (
                  <li key={p.id} className="rounded-2xl border border-[#EFE5D6] bg-white p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`${cond} text-lg font-bold`}>Comanda #{p.numero}</p>
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${ESTADO_COCINA[p.estado].c}`}>{ESTADO_COCINA[p.estado].t}</span>
                    </div>
                    <ul className="mt-1.5 space-y-1 text-sm">
                      {p.lineas.map((l) => (
                        <li key={l.id} className="flex gap-2">
                          <span className="w-6 shrink-0 font-bold">{l.cant}×</span>
                          <span className="min-w-0 flex-1">
                            {l.nombre}
                            {l.mods.length ? <span className="block text-xs text-[#726559]">{l.mods.join(" · ")}</span> : null}
                          </span>
                          <span className="tabular-nums text-[#5D5047]">{pesos(l.precio * l.cant)}</span>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-2xl bg-[#F5EEE3] p-4 text-center text-sm text-[#5D5047]">
                {m.comensales} comensal{m.comensales === 1 ? "" : "es"} sentado{m.comensales === 1 ? "" : "s"}. Todavía no pidieron.
              </p>
            )}
          </div>
          <div className="border-t border-[#EFE5D6] p-4">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-bold text-[#5D5047]">Consumo</span>
              <span className={`${cond} text-3xl font-bold tabular-nums`}>{pesos(total)}</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button type="button" className={`${btn.brasa} col-span-2`} onClick={() => tomarPedido({ tipo: "mesa", mesaId: m.id })}>
                <Icon name="plus" className="size-4" strokeWidth={2.4} /> Tomar pedido
              </button>
              {m.estado !== "pidiendo" ? (
                <button type="button" className={btn.suave} onClick={() => setEstadoMesa(m.id, "pidiendo")}>Llama al mozo</button>
              ) : (
                <button type="button" className={btn.suave} onClick={() => setEstadoMesa(m.id, "ocupada")}>Ya fue atendida</button>
              )}
              {m.estado !== "cuenta" ? (
                <button type="button" className={btn.suave} onClick={() => setEstadoMesa(m.id, "cuenta")}>Pidió la cuenta</button>
              ) : (
                <button type="button" className={btn.carbon} onClick={() => setCobrar(true)}>
                  <Icon name="cash" className="size-4" /> Cobrar
                </button>
              )}
              {m.estado === "cuenta" ? null : (
                <button type="button" className={`${btn.suave} col-span-2`} onClick={() => setCobrar(true)} disabled={total === 0}>
                  <Icon name="receipt" className="size-4" /> Cobrar y liberar
                </button>
              )}
              {total === 0 ? (
                <button type="button" className="col-span-2 py-1 text-sm font-semibold text-[#726559] underline-offset-4 hover:underline" onClick={() => setEstadoMesa(m.id, "libre", 0)}>
                  Liberar mesa sin consumo
                </button>
              ) : null}
            </div>
          </div>
        </>
      )}

      <Dialog
        open={cobrar}
        onClose={() => setCobrar(false)}
        titulo={`Cuenta · Mesa ${m.numero}`}
        subtitulo={<p className="text-sm text-[#726559]">{m.comensales} comensales · mozo {m.mozo}</p>}
        panelClassName="max-h-[94dvh] w-full rounded-t-3xl bg-[#FBF7F0] text-[#1F1A17] shadow-2xl sm:max-w-md sm:rounded-3xl"
        overlayClassName="bg-[#1F1A17]/60"
        headerClassName="px-5 pb-2 pt-5"
        tituloClassName={`${cond} text-2xl font-bold uppercase`}
        cerrarClassName="-mr-2 rounded-lg hover:bg-[#EFE5D6]"
        footerClassName="border-t border-[#E4D8C6] p-4"
        footer={
          <button type="button" className={`${btn.brasa} w-full py-3 text-base`} onClick={() => { cobrarMesa(m.id, pago); setCobrar(false); setMesaSel(null); }}>
            <Icon name="check" className="size-5" strokeWidth={2.4} /> Cobrar {pesos(total + Math.round((total * propina) / 100))} y liberar mesa
          </button>
        }
      >
        <div className="px-5 pb-5">
          <div className="rounded-2xl bg-white p-4 font-mono text-[13px] shadow-[0_1px_0_#E4D8C6] [font-family:ui-monospace,monospace]">
            <p className="text-center font-bold tracking-widest">PARRILLA LA BRASA</p>
            <p className="text-center text-[11px] text-[#726559]">Documento no válido como factura · demo</p>
            <div className="my-3 border-t border-dashed border-[#C9B9A5]" />
            {pedidos.flatMap((p) => p.lineas).map((l) => (
              <p key={l.id} className="flex justify-between gap-3">
                <span className="min-w-0 truncate">{l.cant} {l.nombre}</span>
                <span className="tabular-nums">{pesos(l.precio * l.cant)}</span>
              </p>
            ))}
            <div className="my-3 border-t border-dashed border-[#C9B9A5]" />
            <p className="flex justify-between"><span>Subtotal</span><span>{pesos(total)}</span></p>
            <p className="flex justify-between"><span>Propina sugerida ({propina}%)</span><span>{pesos(Math.round((total * propina) / 100))}</span></p>
            <p className="mt-1 flex justify-between text-base font-bold"><span>TOTAL</span><span>{pesos(total + Math.round((total * propina) / 100))}</span></p>
            {m.comensales > 1 ? <p className="mt-1 text-right text-[11px] text-[#726559]">{pesos(Math.round((total * (1 + propina / 100)) / m.comensales))} por persona</p> : null}
          </div>
          <fieldset className="mt-4">
            <legend className="mb-2 text-sm font-bold">Propina</legend>
            <div className="grid grid-cols-4 gap-1.5">
              {[0, 5, 10, 15].map((v) => (
                <label key={v} className={`cursor-pointer rounded-xl border py-2 text-center text-sm font-bold has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-[#D9480F] ${propina === v ? "border-[#1F1A17] bg-[#1F1A17] text-[#F5EEE3]" : "border-[#E0D3C0] bg-white"}`}>
                  <input type="radio" name="propina" className="sr-only" checked={propina === v} onChange={() => setPropina(v)} />
                  {v ? `${v}%` : "Sin"}
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset className="mt-4">
            <legend className="mb-2 text-sm font-bold">Medio de pago</legend>
            <div className="grid grid-cols-3 gap-1.5">
              {(["Efectivo", "Transferencia", "Tarjeta"] as Pago[]).map((v) => (
                <label key={v} className={`cursor-pointer rounded-xl border py-2 text-center text-sm font-bold has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-[#D9480F] ${pago === v ? "border-[#D9480F] bg-[#FDE8DC] text-[#A5360B]" : "border-[#E0D3C0] bg-white"}`}>
                  <input type="radio" name="pago" className="sr-only" checked={pago === v} onChange={() => setPago(v)} />
                  {v}
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      </Dialog>
    </section>
  );
}
