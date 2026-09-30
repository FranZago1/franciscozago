"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Dialogo } from "../shared/Dialogo";
import { IcCopa } from "./ui";

const CLAVE = "cava-aldea-mayor-18";
const serif = "[font-family:var(--font-cava-serif)]";

/**
 * Aviso de venta a mayores de 18. Se muestra al entrar y se recuerda la respuesta afirmativa.
 * Si localStorage no está disponible, se vuelve a preguntar en cada visita.
 */
export function EdadGate() {
  const [estado, setEstado] = useState<"cargando" | "preguntar" | "ok" | "menor">("cargando");

  useEffect(() => {
    let ok = false;
    try {
      ok = window.localStorage.getItem(CLAVE) === "si";
    } catch {
      ok = false;
    }
    setEstado(ok ? "ok" : "preguntar");
  }, []);

  const confirmar = () => {
    try {
      window.localStorage.setItem(CLAVE, "si");
    } catch {
      /* sin almacenamiento: se vuelve a preguntar la próxima vez */
    }
    setEstado("ok");
  };

  return (
    <Dialogo
      abierto={estado === "preguntar" || estado === "menor"}
      onCerrar={() => {
        /* No se puede cerrar sin responder. */
      }}
      labelledBy="cava-edad-titulo"
      className="m-0 h-dvh max-h-none w-full max-w-none bg-transparent text-[#EFE6D6] backdrop:bg-[#0B0808]/96 [font-family:var(--font-cava-sans)]"
    >
      <div className="grid h-full place-items-center px-5">
        <div className="relative w-full max-w-[460px] border border-[#C9A55A]/40 bg-[#130D0E] px-7 py-10 text-center shadow-[0_40px_120px_-30px_rgba(110,20,35,0.6)] sm:px-12 sm:py-14">
          <div className="pointer-events-none absolute inset-2 border border-[#C9A55A]/15" aria-hidden="true" />
          <IcCopa className="mx-auto size-8 text-[#C9A55A]" />
          <p className="mt-4 text-[11px] tracking-[0.4em] text-[#C9A55A] uppercase">Cava Aldea</p>
          {estado === "menor" ? (
            <>
              <h2 id="cava-edad-titulo" className={`${serif} mt-4 text-[34px] leading-tight`}>
                Te esperamos más adelante.
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-[#A8998A]">
                La venta de bebidas alcohólicas es solo para mayores de 18 años. Mientras tanto, podés mirar otras demos.
              </p>
              <div className="mt-8 flex flex-col gap-3">
                <Link
                  href="/demos/catalogos"
                  className="inline-flex h-12 items-center justify-center border border-[#C9A55A] text-[14px] tracking-[0.12em] text-[#E3C88A] uppercase transition hover:bg-[#C9A55A] hover:text-[#130D0E] focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#C9A55A]"
                >
                  Ver otras demos
                </Link>
                <button
                  type="button"
                  onClick={() => setEstado("preguntar")}
                  className="text-[13px] text-[#A8998A] underline underline-offset-4 hover:text-[#EFE6D6]"
                >
                  Me equivoqué, soy mayor
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 id="cava-edad-titulo" className={`${serif} mt-4 text-[38px] leading-[1.05] sm:text-[44px]`}>
                ¿Sos mayor de 18&nbsp;años?
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-[#A8998A]">Para entrar a la cava necesitamos confirmar tu edad.</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={confirmar}
                  className="h-12 bg-[#C9A55A] text-[14px] font-medium tracking-[0.12em] text-[#130D0E] uppercase transition hover:bg-[#E3C88A] focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#C9A55A]"
                >
                  Sí, soy mayor
                </button>
                <button
                  type="button"
                  onClick={() => setEstado("menor")}
                  className="h-12 border border-[#4A3A36] text-[14px] tracking-[0.12em] text-[#EFE6D6] uppercase transition hover:border-[#C9A55A] focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#C9A55A]"
                >
                  No
                </button>
              </div>
              <p className="mt-6 text-[11.5px] leading-relaxed text-[#7E7064]">
                Beber con moderación. Prohibida su venta a menores de 18 años. Demo con contenido ficticio.
              </p>
            </>
          )}
        </div>
      </div>
    </Dialogo>
  );
}
