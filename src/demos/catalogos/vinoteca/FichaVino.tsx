"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { Dialogo } from "../shared/Dialogo";
import { ars } from "../shared/formato";
import { MARIDAJES, REGIONES, imagenVino, type Vino } from "./datos";
import { IconoMaridaje, Radar } from "./graficos";
import { Cantidad, IcCaja, IcX } from "./ui";

const serif = "[font-family:var(--font-cava-serif)]";

export function FichaVino({
  vino,
  onCerrar,
  onAgregar,
  onCaja,
  cajaLlena,
}: {
  vino: Vino | null;
  onCerrar: () => void;
  onAgregar: (v: Vino, cantidad: number, nota: string) => void;
  onCaja: (v: Vino) => void;
  cajaLlena: boolean;
}) {
  const uid = useId();
  return (
    <Dialogo
      abierto={!!vino}
      onCerrar={onCerrar}
      labelledBy={`${uid}-t`}
      className="m-auto max-h-[calc(100dvh-16px)] w-[min(1080px,calc(100%-16px))] max-w-none overflow-y-auto overscroll-contain border border-[#3A2C2C] bg-[#120C0D] text-[#EFE6D6] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8)] backdrop:bg-black/75 backdrop:backdrop-blur-[3px] [font-family:var(--font-cava-sans)] sm:max-h-[calc(100dvh-48px)]"
    >
      {vino ? (
        <Contenido
          key={vino.id}
          v={vino}
          tituloId={`${uid}-t`}
          onCerrar={onCerrar}
          onAgregar={onAgregar}
          onCaja={onCaja}
          cajaLlena={cajaLlena}
        />
      ) : null}
    </Dialogo>
  );
}

function Contenido({
  v,
  tituloId,
  onCerrar,
  onAgregar,
  onCaja,
  cajaLlena,
}: {
  v: Vino;
  tituloId: string;
  onCerrar: () => void;
  onAgregar: (v: Vino, cantidad: number, nota: string) => void;
  onCaja: (v: Vino) => void;
  cajaLlena: boolean;
}) {
  const [cantidad, setCantidad] = useState(1);
  const [nota, setNota] = useState("");
  const [hecho, setHecho] = useState<"" | "lista" | "caja">("");
  const region = REGIONES.find((r) => r.id === v.region)!;
  const notaId = useId();

  return (
    <div className="grid md:grid-cols-[0.9fr_1.1fr]">
      <div className="relative flex min-h-[380px] items-end justify-center overflow-hidden bg-[radial-gradient(ellipse_at_50%_85%,#4A1220_0%,#1A0F10_55%,#120C0D_100%)] pt-10 md:sticky md:top-0 md:h-[min(820px,calc(100dvh-48px))] md:self-start">
        <div
          className="absolute inset-x-10 bottom-[12%] h-px bg-gradient-to-r from-transparent via-[#C9A55A]/50 to-transparent"
          aria-hidden="true"
        />
        <div className="relative h-[360px] w-[160px] md:h-[80%] md:w-[62%]">
          <Image
            src={imagenVino(v.id)}
            alt={`Botella de ${v.nombre} ${v.cepa} ${v.anio}, etiqueta de ${v.bodega}`}
            fill
            sizes="(min-width: 768px) 220px, 140px"
            className="object-contain object-bottom motion-safe:animate-[cava-subir_0.7s_cubic-bezier(.2,.8,.2,1)]"
          />
        </div>
        {v.destacado ? (
          <p className="absolute top-5 left-5 border border-[#C9A55A]/50 px-2.5 py-1 text-[10.5px] tracking-[0.2em] text-[#E3C88A] uppercase">
            {v.destacado}
          </p>
        ) : null}
        <button
          type="button"
          onClick={onCerrar}
          aria-label="Cerrar ficha"
          className="absolute top-3 right-3 grid size-10 place-items-center text-[#EFE6D6] hover:text-[#E3C88A] focus-visible:outline-1 focus-visible:outline-[#C9A55A] md:hidden"
        >
          <IcX className="size-5" />
        </button>
      </div>

      <div className="relative px-5 py-8 sm:px-10 sm:py-10">
        <button
          type="button"
          onClick={onCerrar}
          aria-label="Cerrar ficha"
          className="absolute top-5 right-5 hidden size-10 place-items-center text-[#A8998A] transition hover:text-[#E3C88A] focus-visible:outline-1 focus-visible:outline-[#C9A55A] md:grid"
        >
          <IcX className="size-5" />
        </button>
        <p className="text-[11px] tracking-[0.32em] text-[#C9A55A] uppercase">{v.bodega}</p>
        <h2 id={tituloId} className={`${serif} mt-3 text-[42px] leading-[1] sm:text-[54px]`}>
          {v.nombre}
        </h2>
        <p className="mt-3 text-[15px] text-[#CFC3B3]">
          {v.cepa} · {region.nombre}, {region.provincia} · {v.anio}
        </p>
        <p className={`${serif} mt-4 text-[28px] text-[#E3C88A]`}>{v.precio ? ars(v.precio) : "Precio a consultar"}</p>

        <div className="mt-8 grid gap-8 border-t border-[#3A2C2C] pt-8 sm:grid-cols-[1fr_200px] sm:items-center">
          <dl className="space-y-4">
            {(
              [
                ["Vista", v.notas.vista],
                ["Nariz", v.notas.nariz],
                ["Boca", v.notas.boca],
              ] as const
            ).map(([k, t]) => (
              <div key={k}>
                <dt className="text-[10.5px] tracking-[0.28em] text-[#C9A55A] uppercase">{k}</dt>
                <dd className="mt-1 text-[15px] leading-relaxed text-[#E6DCCC]">{t}</dd>
              </div>
            ))}
          </dl>
          <figure>
            <Radar perfil={v.perfil} className="mx-auto h-auto w-full max-w-[240px]" />
            <figcaption className="mt-1 text-center text-[10.5px] tracking-[0.24em] text-[#A8998A] uppercase">Perfil de cata</figcaption>
          </figure>
        </div>

        <div className="mt-8 border-t border-[#3A2C2C] pt-6">
          <p className="text-[10.5px] tracking-[0.28em] text-[#C9A55A] uppercase">Maridaje sugerido</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {v.maridajes.map((m) => (
              <li key={m} className="inline-flex items-center gap-2 border border-[#3A2C2C] px-3 py-2 text-[13.5px] text-[#E6DCCC]">
                <IconoMaridaje id={m} className="size-5 text-[#E3C88A]" />
                {MARIDAJES.find((x) => x.id === m)?.nombre}
              </li>
            ))}
          </ul>
          <dl className="mt-6 grid grid-cols-1 gap-4 text-[13.5px] sm:grid-cols-3">
            {(
              [
                ["Crianza", v.crianza],
                ["Alcohol", v.alcohol],
                ["Servir a", v.servicio],
              ] as const
            ).map(([k, t]) => (
              <div key={k}>
                <dt className="text-[#A8998A]">{k}</dt>
                <dd className="mt-0.5 text-[#EFE6D6]">{t}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-8 border-t border-[#3A2C2C] pt-6">
          <label htmlFor={notaId} className="text-[10.5px] tracking-[0.28em] text-[#C9A55A] uppercase">
            Nota <span className="tracking-normal text-[#A8998A] normal-case">(opcional)</span>
          </label>
          <textarea
            id={notaId}
            rows={2}
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            placeholder="Ej.: es para regalo, ¿lo pueden envolver?"
            className="mt-2 w-full resize-none border border-[#3A2C2C] bg-[#0E0B0B] px-4 py-3 text-[14px] text-[#EFE6D6] placeholder:text-[#7E7064] focus:border-[#C9A55A] focus:outline-none"
          />
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Cantidad valor={cantidad} onChange={setCantidad} etiqueta="Cantidad de botellas" />
            <button
              type="button"
              onClick={() => {
                onAgregar(v, cantidad, nota);
                setHecho("lista");
              }}
              className="h-11 flex-1 bg-[#C9A55A] px-6 text-[13px] font-medium tracking-[0.14em] text-[#130D0E] uppercase transition hover:bg-[#E3C88A] focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#C9A55A] sm:flex-none"
            >
              {hecho === "lista" ? "Agregado a tu selección" : "Agregar a mi selección"}
            </button>
            <button
              type="button"
              disabled={cajaLlena}
              onClick={() => {
                onCaja(v);
                setHecho("caja");
              }}
              className="inline-flex h-11 items-center gap-2 border border-[#C9A55A]/60 px-4 text-[13px] tracking-[0.12em] text-[#E3C88A] uppercase transition hover:border-[#C9A55A] hover:bg-[#C9A55A]/10 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#C9A55A]"
            >
              <IcCaja className="size-4.5" /> {cajaLlena ? "Caja completa" : hecho === "caja" ? "Sumada a la caja" : "Sumar a la caja"}
            </button>
          </div>
          <p className="mt-3 text-[12px] text-[#7E7064]">Venta solo a mayores de 18 años. Beber con moderación.</p>
        </div>
      </div>
    </div>
  );
}
