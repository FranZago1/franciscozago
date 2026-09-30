"use client";

import { useMemo, useState } from "react";
import { Dialog } from "../shared/Dialog";
import { Icon } from "../shared/Icon";
import { hora, ordenar, pesos, useSort } from "../shared/util";
import { REPARTIDORES, totalPedido, type Pedido } from "./data";
import { useBrasa } from "./context";
import { btn, cond, minutos } from "./ui";

type Etapa = "cocina" | "despachar" | "camino" | "entregado";
const ETAPA: Record<Etapa, { t: string; c: string; orden: number }> = {
  cocina: { t: "En cocina", c: "bg-[#EFE7DA] text-[#5D5047]", orden: 1 },
  despachar: { t: "Listo para salir", c: "bg-[#DDEBCF] text-[#3F6420]", orden: 0 },
  camino: { t: "En camino", c: "bg-[#FDE8DC] text-[#A5360B]", orden: 2 },
  entregado: { t: "Entregado", c: "bg-[#F1ECE4] text-[#726559]", orden: 3 },
};

function etapaDe(p: Pedido): Etapa {
  if (p.delivery?.estado === "entregado") return "entregado";
  if (p.delivery?.estado === "en_camino") return "camino";
  if (p.estado === "listo") return "despachar";
  return "cocina";
}

type Col = "numero" | "cliente" | "etapa" | "total" | "hora";

export function Delivery() {
  const { state, now, tomarPedido, despachar, entregarDelivery } = useBrasa();
  const [filtro, setFiltro] = useState<"activos" | Etapa | "todos">("activos");
  const sort = useSort<Col>("etapa", "asc");
  const [aviso, setAviso] = useState<Pedido | null>(null);
  const [rep, setRep] = useState<Record<string, string>>({});

  const deliveries = useMemo(() => state.pedidos.filter((p) => p.origen.tipo === "delivery"), [state.pedidos]);
  const filas = useMemo(() => {
    const base = deliveries.filter((p) => {
      const e = etapaDe(p);
      return filtro === "todos" ? true : filtro === "activos" ? e !== "entregado" : e === filtro;
    });
    return ordenar(
      base,
      (p) => {
        switch (sort.key) {
          case "numero": return p.numero;
          case "cliente": return p.origen.tipo === "delivery" ? p.origen.cliente : "";
          case "etapa": return ETAPA[etapaDe(p)].orden * 1e13 + Date.parse(p.creado);
          case "total": return totalPedido(p);
          case "hora": return Date.parse(p.creado);
        }
      },
      sort.dir,
    );
  }, [deliveries, filtro, sort.key, sort.dir]);

  const cuenta = (e: Etapa) => deliveries.filter((p) => etapaDe(p) === e).length;
  const entregados = deliveries.filter((p) => p.delivery?.llegada);
  const promedio = entregados.length ? Math.round(entregados.reduce((a, p) => a + (Date.parse(p.delivery!.llegada!) - Date.parse(p.creado)), 0) / entregados.length / 60000) : 0;
  const facturado = deliveries.reduce((a, p) => a + totalPedido(p), 0);

  const COLS: { id: Col; label: string }[] = [
    { id: "numero", label: "Pedido" },
    { id: "cliente", label: "Cliente y dirección" },
    { id: "etapa", label: "Estado" },
    { id: "hora", label: "Tiempo" },
    { id: "total", label: "Total" },
  ];

  const acciones = (p: Pedido) => {
    const e = etapaDe(p);
    const r = rep[p.id] ?? REPARTIDORES[p.numero % REPARTIDORES.length]!;
    if (e === "despachar")
      return (
        <div className="flex flex-wrap items-center gap-1.5">
          <label htmlFor={`rep-${p.id}`} className="sr-only">Repartidor para #{p.numero}</label>
          <select id={`rep-${p.id}`} value={r} onChange={(ev) => setRep({ ...rep, [p.id]: ev.target.value })} className="h-9 min-w-0 flex-1 rounded-lg border border-[#E0D3C0] bg-white px-2 text-sm font-semibold">
            {REPARTIDORES.map((x) => <option key={x}>{x}</option>)}
          </select>
          <button type="button" className={`${btn.brasa} py-2`} onClick={() => despachar(p.id, r)}>
            <Icon name="bike" className="size-4" /> Despachar
          </button>
        </div>
      );
    if (e === "camino")
      return (
        <div className="flex flex-wrap gap-1.5">
          <button type="button" className={`${btn.suave} py-2`} onClick={() => setAviso(p)}>
            <Icon name="chat" className="size-4" /> Avisar
          </button>
          <button type="button" className={`${btn.carbon} py-2`} onClick={() => entregarDelivery(p.id)}>
            <Icon name="check" className="size-4" strokeWidth={2.4} /> Entregado
          </button>
        </div>
      );
    if (e === "cocina") return <span className="text-sm text-[#726559]">{p.estado === "nuevo" ? "Esperando cocina" : "En el fuego"}</span>;
    return <span className="text-sm text-[#726559]">Llegó {hora(p.delivery!.llegada!)}</span>;
  };

  const tiempo = (p: Pedido) => {
    const fin = p.delivery?.llegada ? Date.parse(p.delivery.llegada) : now;
    const m = minutos(fin - Date.parse(p.creado));
    return (
      <span className={`${cond} text-xl font-bold tabular-nums ${!p.delivery?.llegada && m >= 40 ? "text-[#C4301C]" : ""}`}>
        {m}′ <span className="text-xs font-semibold text-[#726559] [font-family:var(--font-brasa)]">desde {hora(p.creado)}</span>
      </span>
    );
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[#726559]">Pedidos a domicilio de hoy</p>
          <h1 className={`${cond} text-4xl font-bold uppercase leading-none tracking-wide`}>Delivery</h1>
        </div>
        <button type="button" className={btn.brasa} onClick={() => tomarPedido({ tipo: "delivery" })}>
          <Icon name="plus" className="size-4" strokeWidth={2.4} /> Nuevo delivery
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
        <Kpi k="Listos para salir" v={String(cuenta("despachar"))} alerta={cuenta("despachar") > 0} />
        <Kpi k="En camino" v={String(cuenta("camino"))} />
        <Kpi k="Tiempo promedio" v={`${promedio} min`} />
        <Kpi k="Vendido en delivery" v={pesos(facturado)} />
      </div>

      <div className="mt-5 overflow-hidden rounded-3xl border border-[#E4D8C6] bg-[#FFFCF7]">
        <div className="overflow-x-auto border-b border-[#EFE5D6] p-3">
          <div role="group" aria-label="Filtrar por estado" className="flex w-max gap-1.5">
            {([["activos", "Activos"], ["despachar", "Para salir"], ["cocina", "En cocina"], ["camino", "En camino"], ["entregado", "Entregados"], ["todos", "Todos"]] as const).map(([k, t]) => (
              <button key={k} type="button" aria-pressed={filtro === k} onClick={() => setFiltro(k)} className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-bold transition ${filtro === k ? "bg-[#1F1A17] text-[#F5EEE3]" : "text-[#5D5047] ring-1 ring-[#E4D8C6] hover:ring-[#C9B9A1]"}`}>
                {t}
                <span className="ml-1.5 opacity-60">
                  {k === "activos" ? deliveries.length - cuenta("entregado") : k === "todos" ? deliveries.length : cuenta(k)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {filas.length === 0 ? (
          <div className="p-10 text-center">
            <Icon name="bike" className="mx-auto size-10 text-[#C9B9A5]" />
            <p className="mt-2 font-bold">No hay deliveries en esta vista</p>
            <p className="text-sm text-[#726559]">Probá con otro filtro o cargá un pedido nuevo.</p>
          </div>
        ) : (
          <>
            <table className="hidden w-full text-sm lg:table">
              <caption className="sr-only">Pedidos de delivery. Los encabezados ordenan la tabla.</caption>
              <thead>
                <tr className="border-b border-[#EFE5D6] text-left">
                  {COLS.map((c) => (
                    <th key={c.id} scope="col" aria-sort={sort.aria(c.id)} className={`px-4 py-3 first:pl-5 ${c.id === "total" ? "text-right" : ""}`}>
                      <button type="button" onClick={() => sort.toggle(c.id)} className={`inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.08em] ${sort.key === c.id ? "text-[#A5360B]" : "text-[#726559] hover:text-[#1F1A17]"}`}>
                        {c.label}
                        <Icon name={sort.key === c.id ? (sort.dir === "asc" ? "arrow-up" : "arrow-down") : "sort"} className={`size-3.5 ${sort.key === c.id ? "" : "opacity-40"}`} strokeWidth={2.2} />
                      </button>
                    </th>
                  ))}
                  <th scope="col" className="px-4 py-3 pr-5 text-left text-xs font-bold uppercase tracking-[0.08em] text-[#726559]">Acción</th>
                </tr>
              </thead>
              <tbody>
                {filas.map((p) => {
                  if (p.origen.tipo !== "delivery") return null;
                  const e = etapaDe(p);
                  return (
                    <tr key={p.id} className="border-b border-[#F3EBDF] align-top last:border-0">
                      <td className="py-3.5 pl-5 pr-4">
                        <p className={`${cond} text-2xl font-bold text-[#A5360B]`}>#{p.numero}</p>
                        <p className="text-xs text-[#726559]">{p.lineas.reduce((a, l) => a + l.cant, 0)} ítems · {p.origen.pago}</p>
                      </td>
                      <td className="max-w-[320px] px-4 py-3.5">
                        <p className="font-bold">{p.origen.cliente}</p>
                        <p className="flex items-center gap-1 text-[#5D5047]"><Icon name="pin" className="size-3.5 shrink-0" />{p.origen.direccion}</p>
                        <p className="text-xs text-[#726559]">{p.origen.telefono}{p.nota ? ` · “${p.nota}”` : ""}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ${ETAPA[e].c}`}>{ETAPA[e].t}</span>
                        {p.delivery?.repartidor && e !== "despachar" ? <p className="mt-1 text-xs text-[#726559]">{p.delivery.repartidor}</p> : null}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5">{tiempo(p)}</td>
                      <td className={`${cond} whitespace-nowrap px-4 py-3.5 text-right text-xl font-bold tabular-nums`}>{pesos(totalPedido(p))}</td>
                      <td className="px-4 py-3.5 pr-5">{acciones(p)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="flex items-center gap-2 border-b border-[#EFE5D6] px-4 py-2 lg:hidden">
              <label htmlFor="dl-sort" className="text-xs font-bold text-[#726559]">Ordenar</label>
              <select id="dl-sort" className="h-8 flex-1 rounded-lg border border-[#E0D3C0] bg-white px-2 text-sm font-semibold" value={`${sort.key}:${sort.dir}`} onChange={(ev) => { const [key, dir] = ev.target.value.split(":") as [Col, "asc" | "desc"]; sort.setSort({ key, dir }); }}>
                <option value="etapa:asc">Por estado (urgentes primero)</option>
                <option value="hora:desc">Más recientes</option>
                <option value="hora:asc">Más antiguos</option>
                <option value="total:desc">Mayor total</option>
              </select>
            </div>
            <ul className="divide-y divide-[#F3EBDF] lg:hidden">
              {filas.map((p) => {
                if (p.origen.tipo !== "delivery") return null;
                const e = etapaDe(p);
                return (
                  <li key={p.id} className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className={`${cond} text-2xl font-bold leading-none text-[#A5360B]`}>#{p.numero}</p>
                        <p className="mt-1 font-bold">{p.origen.cliente}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold ${ETAPA[e].c}`}>{ETAPA[e].t}</span>
                        <p className={`${cond} mt-1 text-xl font-bold`}>{pesos(totalPedido(p))}</p>
                      </div>
                    </div>
                    <p className="mt-1 flex items-start gap-1 text-sm text-[#5D5047]"><Icon name="pin" className="mt-0.5 size-3.5 shrink-0" />{p.origen.direccion}</p>
                    <p className="text-xs text-[#726559]">{p.origen.telefono} · {p.origen.pago}{p.delivery?.repartidor ? ` · ${p.delivery.repartidor}` : ""}</p>
                    <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
                      {tiempo(p)}
                      {acciones(p)}
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>

      <Dialog
        open={!!aviso}
        onClose={() => setAviso(null)}
        titulo="Así le llegaría el aviso"
        subtitulo={<p className="text-sm text-[#726559]">Vista previa: en la demo no se envía ningún mensaje.</p>}
        panelClassName="w-full rounded-t-3xl bg-[#FBF7F0] text-[#1F1A17] shadow-2xl sm:max-w-md sm:rounded-3xl"
        overlayClassName="bg-[#1F1A17]/55"
        headerClassName="px-5 pb-3 pt-5"
        tituloClassName={`${cond} text-2xl font-bold uppercase`}
        cerrarClassName="-mr-2 rounded-lg hover:bg-[#EFE5D6]"
        footerClassName="border-t border-[#E4D8C6] p-4"
        footer={<button type="button" className={`${btn.carbon} w-full`} onClick={() => setAviso(null)}>Entendido</button>}
      >
        {aviso && aviso.origen.tipo === "delivery" ? (
          <div className="px-5 pb-5">
            <div className="rounded-3xl bg-[#E6DDD0] p-4">
              <div className="ml-auto max-w-[88%] rounded-2xl rounded-tr-sm bg-[#DCF3D0] px-3.5 py-2.5 text-[15px] leading-snug text-[#1F2A18] shadow-sm">
                ¡Hola {aviso.origen.cliente.split(" ")[0]}! Tu pedido #{aviso.numero} de Parrilla La Brasa ya salió con {aviso.delivery?.repartidor ?? "nuestro repartidor"}. Llega en unos 15–20 minutos a {aviso.origen.direccion}. Total: {pesos(totalPedido(aviso))} ({aviso.origen.pago.toLowerCase()}). ¡Que lo disfrutes!
                <span className="mt-1 block text-right text-[11px] text-[#5E7A4E]">{hora(new Date(now).toISOString())}</span>
              </div>
            </div>
          </div>
        ) : null}
      </Dialog>
    </div>
  );
}

function Kpi({ k, v, alerta }: { k: string; v: string; alerta?: boolean }) {
  return (
    <div className={`rounded-2xl border px-4 py-3 ${alerta ? "border-[#D9480F] bg-[#FDE8DC]" : "border-[#E4D8C6] bg-[#FFFCF7]"}`}>
      <p className={`text-xs font-bold uppercase tracking-[0.08em] ${alerta ? "text-[#A5360B]" : "text-[#726559]"}`}>{k}</p>
      <p className={`${cond} mt-0.5 truncate text-3xl font-bold`}>{v}</p>
    </div>
  );
}
