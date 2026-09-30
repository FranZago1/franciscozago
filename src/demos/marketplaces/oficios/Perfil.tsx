"use client";

import Image from "next/image";
import { useId } from "react";
import { Dialog } from "../shared/Dialog";
import { Icon } from "../shared/Icon";
import { pesos } from "../shared/utils";
import { dispTexto, fotosTrabajo, franjas, oficioPorId, profesionalPorId } from "./data";
import { useOficios } from "./store";
import { ChipOficio, Estrellas, ancho, cinta, foco, mono } from "./ui";

const DIAS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export function proximosDias(n = 7) {
  const hoy = new Date();
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(hoy);
    d.setDate(hoy.getDate() + i);
    return { corto: i === 0 ? "Hoy" : i === 1 ? "Mañana" : DIAS[d.getDay()]!, numero: d.getDate(), fecha: d };
  });
}

export function Perfil() {
  const { perfil, setPerfil, pedir } = useOficios();
  const p = perfil ? profesionalPorId[perfil] : undefined;
  const id = useId();
  const dias = proximosDias();

  const distribucion = p
    ? [5, 4, 3, 2, 1].map((n) => {
        const base = n === 5 ? 0.82 : n === 4 ? 0.13 : n === 3 ? 0.03 : 0.01;
        const ajuste = p.rating >= 4.9 ? 1.05 : p.rating >= 4.8 ? 1 : 0.9;
        return { n, pct: Math.min(100, Math.round(base * 100 * (n === 5 ? ajuste : 1 / ajuste))) };
      })
    : [];

  return (
    <Dialog
      open={!!p}
      onClose={() => setPerfil(null)}
      labelledBy={id}
      variant="right"
      ancho="max-w-[36rem]"
      panelClassName="bg-white text-(--ma-tinta) [font-family:var(--font-ma-sans)] shadow-[-24px_0_60px_-24px_rgba(0,0,0,0.45)]"
      overlayClassName="bg-(--ma-azul)/55"
    >
      {p && (
        <>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <div className="relative bg-(--ma-azul) px-5 pb-6 pt-5 text-white sm:px-7">
              <div className="flex items-start justify-between">
                <ChipOficio id={p.oficio} claro />
                <button type="button" onClick={() => setPerfil(null)} className={`grid size-10 place-items-center rounded-lg bg-white/10 ring-1 ring-white/20 hover:bg-white/20 ${foco}`} aria-label="Cerrar perfil">
                  <Icon name="close" size={18} stroke={2.2} />
                </button>
              </div>
              <div className="mt-4 flex items-center gap-4">
                <Image src={p.imagen} alt={`Retrato ilustrado de ${p.nombre}`} width={112} height={112} sizes="112px" className="size-24 rounded-2xl ring-4 ring-white/15 sm:size-28" />
                <div className="min-w-0">
                  <h2 id={id} className={`${ancho} text-2xl font-extrabold leading-tight sm:text-3xl`}>
                    {p.nombre}
                  </h2>
                  <p className="text-white/70">
                    {oficioPorId[p.oficio].persona} · {p.anios} años de oficio
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <Estrellas valor={p.rating} size={15} />
                    <strong>{p.rating.toFixed(1).replace(".", ",")}</strong>
                    <span className="text-white/70">({p.resenas})</span>
                  </div>
                </div>
              </div>
            </div>
            <div className={`h-2 ${cinta}`} aria-hidden="true" />

            <div className="space-y-8 px-5 py-6 sm:px-7">
              <div className="rounded-xl border-2 border-(--ma-verde)/25 bg-(--ma-verde)/6 p-4">
                <p className="flex items-center gap-2 font-bold text-(--ma-verde)">
                  <Icon name="shield" size={20} stroke={2.2} />
                  Perfil verificado por ManoAmiga
                </p>
                <ul className="mt-3 grid gap-1.5 text-sm text-(--ma-tinta)/85 sm:grid-cols-2">
                  <li className="flex items-center gap-2">
                    <Icon name="check" size={15} stroke={2.6} className="text-(--ma-verde)" />
                    Matrícula <span className={mono}>{p.matricula}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="check" size={15} stroke={2.6} className="text-(--ma-verde)" />
                    Identidad validada
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="check" size={15} stroke={2.6} className="text-(--ma-verde)" />
                    Seguro de responsabilidad civil
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="check" size={15} stroke={2.6} className="text-(--ma-verde)" />
                    Sin reclamos abiertos
                  </li>
                </ul>
              </div>

              <dl className="grid grid-cols-3 divide-x divide-(--ma-linea) rounded-xl border-2 border-(--ma-linea) text-center">
                {[
                  ["Responde en", `~${p.respuestaMin} min`],
                  ["Trabajos", String(p.trabajos)],
                  ["Visita", p.visita ? pesos(p.visita) : "Sin cargo"],
                ].map(([t, v]) => (
                  <div key={t} className="px-2 py-3">
                    <dt className="text-[0.7rem] font-bold uppercase tracking-wide text-(--ma-gris)">{t}</dt>
                    <dd className={`${mono} mt-1 text-lg font-semibold text-(--ma-azul)`}>{v}</dd>
                  </div>
                ))}
              </dl>

              <section aria-labelledby={`${id}-sobre`}>
                <h3 id={`${id}-sobre`} className={`${ancho} text-lg font-extrabold text-(--ma-azul)`}>
                  Sobre {p.nombre.split(" ")[0]}
                </h3>
                <p className="mt-2 leading-relaxed text-(--ma-tinta)/85">{p.bio}</p>
                <p className="mt-3 flex items-start gap-1.5 text-sm text-(--ma-gris)">
                  <Icon name="pin" size={16} className="mt-0.5 shrink-0" />
                  Trabaja en {p.barrios.join(", ")}.
                </p>
              </section>

              <section aria-labelledby={`${id}-serv`}>
                <h3 id={`${id}-serv`} className={`${ancho} text-lg font-extrabold text-(--ma-azul)`}>
                  Servicios y precios de referencia
                </h3>
                <ul className="mt-3 divide-y divide-(--ma-linea) rounded-xl border-2 border-(--ma-linea)">
                  {p.servicios.map((s) => (
                    <li key={s.nombre} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                      <span className="font-semibold">{s.nombre}</span>
                      <span className="shrink-0 text-(--ma-gris)">
                        desde <span className={`${mono} font-semibold text-(--ma-tinta)`}>{pesos(s.desde)}</span>
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-xs text-(--ma-gris)">El precio final lo define el presupuesto, según lo que haya que hacer.</p>
              </section>

              <section aria-labelledby={`${id}-agenda`}>
                <div className="flex items-baseline justify-between gap-3">
                  <h3 id={`${id}-agenda`} className={`${ancho} text-lg font-extrabold text-(--ma-azul)`}>
                    Disponibilidad
                  </h3>
                  <span className="text-sm font-semibold text-(--ma-verde)">{dispTexto[p.disp]}</span>
                </div>
                <table className="mt-3 w-full table-fixed border-separate border-spacing-1 text-center text-xs">
                  <caption className="sr-only">Franjas libres de los próximos siete días</caption>
                  <thead>
                    <tr>
                      <th scope="col" className="w-14" />
                      {dias.map((d) => (
                        <th key={d.numero} scope="col" className="pb-1 font-semibold text-(--ma-gris)">
                          <span className="block">{d.corto}</span>
                          <span className={`${mono} block text-(--ma-tinta)`}>{d.numero}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {franjas.map((f, fi) => (
                      <tr key={f.id}>
                        <th scope="row" className="pr-1 text-left font-semibold text-(--ma-gris)">
                          {f.nombre}
                        </th>
                        {p.agenda.map((a, di) => (
                          <td key={di} className={`h-8 rounded-md ${a[fi] ? "bg-(--ma-verde)/85" : "bg-(--ma-fondo)"}`}>
                            <span className="sr-only">{a[fi] ? "Libre" : "Ocupado"}</span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>

              <section aria-labelledby={`${id}-fotos`}>
                <h3 id={`${id}-fotos`} className={`${ancho} text-lg font-extrabold text-(--ma-azul)`}>
                  Trabajos recientes
                </h3>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <figure className="overflow-hidden rounded-xl border-2 border-(--ma-linea)">
                    <Image src={fotosTrabajo[p.oficio].src} alt={fotosTrabajo[p.oficio].alt} width={800} height={600} sizes="260px" className="h-auto w-full" />
                    <figcaption className="px-3 py-2 text-xs text-(--ma-gris)">{p.resenasLista[0]?.trabajo} en {p.resenasLista[0]?.barrio}</figcaption>
                  </figure>
                  <div className="grid place-items-center rounded-xl border-2 border-dashed border-(--ma-linea) p-4 text-center text-sm text-(--ma-gris)">
                    <span>
                      <strong className={`${mono} block text-2xl text-(--ma-azul)`}>+{p.trabajos - 1}</strong>
                      trabajos terminados con ManoAmiga
                    </span>
                  </div>
                </div>
              </section>

              <section aria-labelledby={`${id}-res`}>
                <h3 id={`${id}-res`} className={`${ancho} text-lg font-extrabold text-(--ma-azul)`}>
                  Reseñas
                </h3>
                <div className="mt-3 grid grid-cols-[auto_1fr] items-center gap-5 rounded-xl bg-(--ma-fondo) p-4">
                  <div className="text-center">
                    <p className={`${ancho} text-4xl font-extrabold text-(--ma-azul)`}>{p.rating.toFixed(1).replace(".", ",")}</p>
                    <Estrellas valor={p.rating} size={13} />
                    <p className="mt-1 text-xs text-(--ma-gris)">{p.resenas} reseñas</p>
                  </div>
                  <ul className="space-y-1" aria-label="Distribución de puntajes">
                    {distribucion.map((d) => (
                      <li key={d.n} className="flex items-center gap-2 text-xs">
                        <span className={`${mono} w-3 text-(--ma-gris)`}>{d.n}</span>
                        <span className="h-2 flex-1 overflow-hidden rounded-full bg-white">
                          <span className="block h-full rounded-full bg-(--ma-amarillo2)" style={{ width: `${d.pct}%` }} />
                        </span>
                        <span className={`${mono} w-9 text-right text-(--ma-gris)`}>{d.pct}%</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <ul className="mt-4 space-y-4">
                  {p.resenasLista.map((r) => (
                    <li key={r.autor} className="border-b border-(--ma-linea) pb-4 last:border-0">
                      <div className="flex items-center gap-3">
                        <span className="grid size-9 place-items-center rounded-full bg-(--ma-azul3) text-sm font-bold text-white">
                          {r.autor.split(" ").map((x) => x[0]).join("")}
                        </span>
                        <div className="min-w-0 flex-1 text-sm">
                          <p className="font-bold">{r.autor}</p>
                          <p className="text-(--ma-gris)">
                            {r.barrio} · {r.hace}
                          </p>
                        </div>
                        <Estrellas valor={r.rating} size={13} />
                      </div>
                      <p className="mt-2 text-[0.95rem] leading-relaxed text-(--ma-tinta)/85">{r.texto}</p>
                      <span className="mt-2 inline-block rounded bg-(--ma-fondo) px-2 py-0.5 text-xs font-semibold text-(--ma-gris)">{r.trabajo}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
          <div className="flex items-center gap-3 border-t border-(--ma-linea) bg-white px-5 py-4 sm:px-7">
            <div className="hidden min-w-0 flex-1 text-sm sm:block">
              <p className="font-bold">Presupuesto sin cargo</p>
              <p className="text-(--ma-gris)">Responde en ~{p.respuestaMin} min</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setPerfil(null);
                pedir(p.id);
              }}
              className={`flex-1 rounded-lg bg-(--ma-amarillo) px-5 py-3.5 text-sm font-extrabold text-(--ma-azul) shadow-[0_3px_0_#C99400] transition hover:bg-(--ma-amarillo2) sm:flex-none ${foco}`}
            >
              Pedir presupuesto a {p.nombre.split(" ")[0]}
            </button>
          </div>
        </>
      )}
    </Dialog>
  );
}
