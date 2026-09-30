"use client";

import { useNumeroAnimado } from "../shared/hooks";
import { Sparkline } from "../shared/Sparkline";
import { IcoBajada, IcoSubida } from "./Iconos";

export function Kpi({
  etiqueta,
  valor,
  formato,
  variacion,
  textoVariacion,
  comparacion,
  serie,
  icono,
}: {
  etiqueta: string;
  valor: number;
  formato: (v: number) => string;
  variacion: number;
  textoVariacion: string;
  comparacion: string;
  serie: number[];
  icono: React.ReactNode;
}) {
  const animado = useNumeroAnimado(valor);
  const sube = variacion >= 0;
  return (
    <article className="group relative flex flex-col justify-between gap-3 rounded-2xl border border-[#e8eaee] bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-shadow hover:shadow-[0_4px_16px_-6px_rgba(16,24,40,0.12)] sm:p-5">
      <div className="flex items-center gap-2 text-[13px] font-medium text-[#475467]">
        <span className="grid size-7 place-items-center rounded-lg bg-[#f2f5fa] text-[#2a5ea8]">{icono}</span>
        <h2 className="whitespace-nowrap">{etiqueta}</h2>
        <Sparkline valores={serie} color="#2a78d6" className="ml-auto hidden w-[72px] shrink-0 sm:block 2xl:w-[88px]" alto={28} />
      </div>
      <div className="flex flex-col gap-3">
        <div className="min-w-0">
          <p className="text-[22px] leading-none font-semibold tracking-[-0.02em] text-[#101828] sm:text-[28px]">
            {formato(animado)}
          </p>
          <p className="mt-2.5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[12px] text-[#667085]">
            <span
              className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-semibold ${
                sube ? "bg-[#ecfdf3] text-[#067647]" : "bg-[#fef3f2] text-[#b42318]"
              }`}
            >
              {sube ? <IcoSubida className="size-3" /> : <IcoBajada className="size-3" />}
              <span className="sr-only">{sube ? "Sube" : "Baja"}</span>
              {textoVariacion}
            </span>
            <span className="hidden sm:inline">{comparacion}</span>
          </p>
        </div>
        <Sparkline valores={serie} color="#2a78d6" className="w-full sm:hidden" alto={30} />
      </div>
    </article>
  );
}
