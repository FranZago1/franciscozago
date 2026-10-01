"use client";

import Image from "next/image";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Dialog } from "../shared/Dialog";
import { copiarTexto, usePersistentState, useReducedMotion } from "../shared/hooks";
import {
  AMBIENTES,
  AMBIENTES_SUGERIDOS,
  ESTADOS,
  EXTRAS_INFO,
  NIVELES,
  PAREDES,
  PISOS,
  PRECIOS,
  TIPOS,
  ZONAS,
  calcular,
  crearCotizacion,
  esCotizacion,
  m2De,
  nuevoAmbiente,
  num,
  pesos,
  validarPaso,
  type AmbienteTipo,
  type Cotizacion,
  type Errores,
  type Resultado,
} from "./calculo";
import { Cinta, DibujoObra, LogoObraFina, MuestraPared, MuestraPiso, SimboloNivel } from "./visuals";

const PASOS = ["Tipo de obra", "Ambientes", "Terminaciones", "Extras", "Tus datos"] as const;
const mono = "font-[family-name:var(--font-of-mono)]";
const cond = "font-[family-name:var(--font-of-sans)] [font-stretch:78%]";
const NUMERO = "OF-2026-0147";

/* ---------------- Utilidades de UI ---------------- */

function useNumeroAnimado(valor: number) {
  const reducir = useReducedMotion();
  const [mostrado, setMostrado] = useState(valor);
  const desde = useRef(valor);
  useEffect(() => {
    if (reducir) {
      desde.current = valor;
      setMostrado(valor);
      return;
    }
    const inicio = performance.now();
    const origen = desde.current;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - inicio) / 420);
      const e = 1 - Math.pow(1 - p, 3);
      const v = origen + (valor - origen) * e;
      desde.current = v;
      setMostrado(v);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [valor, reducir]);
  return mostrado;
}

function Etiqueta({ children }: { children: React.ReactNode }) {
  return <span className={`${mono} text-[11px] font-medium uppercase tracking-[0.12em] text-[#6B6962]`}>{children}</span>;
}

function ErrorCampo({ id, msg }: { id: string; msg?: string }) {
  if (!msg) return null;
  return (
    <p id={id} className={`${mono} mt-2 flex items-start gap-1.5 text-[12.5px] font-medium text-[#B42318]`}>
      <svg viewBox="0 0 16 16" className="mt-px size-3.5 shrink-0" aria-hidden="true">
        <path d="M8 1.5 15 14H1Z" fill="#B42318" />
        <path d="M8 6v3.5M8 11.4v.1" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      {msg}
    </p>
  );
}

const inputBase = `w-full border-2 border-[#1A1A18] bg-[#FBFAF7] px-3 py-2.5 text-[15px] text-[#1A1A18] outline-none transition placeholder:text-[#9A978F] focus:bg-white focus:shadow-[4px_4px_0_#FFC700]`;
const inputError = "border-[#B42318] bg-[#FFF4F2]";

/* ---------------- App ---------------- */

export function CotizadorApp() {
  const [c, setC, resetC] = usePersistentState<Cotizacion>("fz-demo-cotizador-v1", crearCotizacion, esCotizacion);
  const [errores, setErrores] = useState<Errores>({});
  const [intento, setIntento] = useState(false);
  const [detalleMovil, setDetalleMovil] = useState(false);
  const [wa, setWa] = useState(false);
  const [confirmarReset, setConfirmarReset] = useState(false);
  const [anuncio, setAnuncio] = useState("");
  const tituloRef = useRef<HTMLHeadingElement>(null);
  const resumenErrRef = useRef<HTMLDivElement>(null);
  const r = useMemo(() => calcular(c), [c]);
  const reducir = useReducedMotion();

  const upd = (f: (x: Cotizacion) => Cotizacion) => {
    setC(f);
  };

  // Revalidar en vivo después del primer intento fallido.
  useEffect(() => {
    if (intento) setErrores(validarPaso(c, c.paso));
  }, [c, intento]);

  const irA = (paso: number) => {
    setC((x) => ({ ...x, paso }));
    setErrores({});
    setIntento(false);
    setAnuncio(paso < PASOS.length ? `Paso ${paso + 1} de ${PASOS.length}: ${PASOS[paso]}` : "Presupuesto listo");
    requestAnimationFrame(() => {
      document.getElementById("of-wizard")?.scrollIntoView({ behavior: reducir ? "auto" : "smooth", block: "start" });
      tituloRef.current?.focus({ preventScroll: true });
    });
  };

  const siguiente = () => {
    const e = validarPaso(c, c.paso);
    if (Object.keys(e).length) {
      setErrores(e);
      setIntento(true);
      requestAnimationFrame(() => resumenErrRef.current?.focus());
      return;
    }
    // Al entrar a ambientes por primera vez, sugerimos los típicos del tipo de obra.
    if (c.paso === 0 && c.ambientes.length === 0 && c.tipo) {
      setC((x) => ({ ...x, ambientes: AMBIENTES_SUGERIDOS[x.tipo!].map(([t, m]) => nuevoAmbiente(t, m)) }));
    }
    irA(c.paso + 1);
  };

  const restablecer = () => {
    resetC();
    setErrores({});
    setIntento(false);
    setConfirmarReset(false);
    setAnuncio("La demo volvió a empezar.");
  };

  const enResumen = c.paso >= PASOS.length;
  const progreso = enResumen ? 100 : Math.round((c.paso / PASOS.length) * 100);

  return (
    <div
      data-demo="cotizador"
      style={{ ["--of-y" as string]: "#FFC700" }}
      className="min-h-dvh bg-[#D9D7D1] text-[#1A1A18] font-[family-name:var(--font-of-sans)] [&_:focus-visible]:outline-[3px] [&_:focus-visible]:outline-offset-2 [&_:focus-visible]:outline-[#1A1A18] print:bg-white"
    >
      <Concreto />
      <h1 className="sr-only">Obra Fina — Cotizador online de reformas</h1>
      <p className="sr-only" aria-live="polite">
        {anuncio}
      </p>

      {/* Encabezado */}
      <header className="relative bg-[#1A1A18] text-[#EFEEEA] print:hidden">
        <div className="mx-auto flex max-w-[1240px] items-center gap-3 px-4 py-3.5 sm:px-6">
          <LogoObraFina className="h-9 w-9 shrink-0 ring-1 ring-[#EFEEEA]/20" />
          <div className="min-w-0">
            <p className={`${cond} text-[21px] font-extrabold uppercase leading-none tracking-[0.02em]`}>Obra Fina</p>
            <p className={`${mono} mt-1 truncate text-[11px] uppercase tracking-[0.14em] text-[#A8A59C]`}>Reformas y construcción · Córdoba</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className={`${mono} hidden border border-[#EFEEEA]/25 px-2 py-1 text-[11px] uppercase tracking-[0.12em] text-[#CFCCC4] md:inline`}>
              Cotizador online
            </span>
            {confirmarReset ? (
              <div className="flex items-center gap-2 text-[13px]" role="group" aria-label="Confirmar reinicio">
                <span className="hidden sm:inline">¿Borrar todo y empezar de nuevo?</span>
                <button type="button" onClick={restablecer} className="bg-[#FFC700] px-3 py-1.5 font-semibold text-[#1A1A18] hover:bg-[#FFD640]">
                  Sí
                </button>
                <button type="button" onClick={() => setConfirmarReset(false)} className="px-2 py-1.5 text-[#CFCCC4] hover:text-white">
                  No
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmarReset(true)}
                className={`${mono} flex items-center gap-1.5 border border-[#EFEEEA]/30 px-2.5 py-1.5 text-[11.5px] uppercase tracking-[0.1em] text-[#EFEEEA] transition hover:border-[#FFC700] hover:text-[#FFC700] [&:focus-visible]:outline-[#FFC700]`}
              >
                <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden="true">
                  <path d="M2.5 8a5.5 5.5 0 1 0 1.7-4L2.5 5.6M2.5 2v3.6h3.6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="sm:hidden">Reiniciar</span>
                <span className="hidden sm:inline">Restablecer demo</span>
              </button>
            )}
          </div>
        </div>
        <Cinta className="h-2" />
      </header>

      {/* Stepper */}
      <div id="of-wizard" className="relative mx-auto max-w-[1240px] scroll-mt-2 px-4 pt-5 sm:px-6 sm:pt-8 print:hidden">
        <Stepper paso={c.paso} progreso={progreso} irA={irA} />
      </div>

      {enResumen ? (
        <Resumen c={c} r={r} editar={() => irA(PASOS.length - 1)} nuevo={restablecer} whatsapp={() => setWa(true)} tituloRef={tituloRef} />
      ) : (
        <div className="relative mx-auto grid max-w-[1240px] gap-6 px-4 pb-10 pt-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_372px] lg:gap-8 lg:pt-6">
          {/* Total compacto en mobile */}
          <div className="sticky top-0 z-30 -mx-4 lg:hidden">
            <div className="border-y-2 border-[#1A1A18] bg-[#1A1A18] text-[#EFEEEA]">
              <button
                type="button"
                onClick={() => setDetalleMovil((v) => !v)}
                aria-expanded={detalleMovil}
                aria-controls="of-panel-movil"
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left"
              >
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#FFC700] opacity-60 motion-reduce:hidden" />
                  <span className="relative inline-flex size-2 rounded-full bg-[#FFC700]" />
                </span>
                <span className={`${mono} text-[11px] uppercase tracking-[0.12em] text-[#A8A59C]`}>Total estimado</span>
                <TotalAnimado valor={r.total} className={`${cond} ml-auto text-[22px] font-bold tabular-nums`} />
                <svg viewBox="0 0 16 16" className={`size-4 transition-transform ${detalleMovil ? "rotate-180" : ""}`} aria-hidden="true">
                  <path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" />
                </svg>
                <span className="sr-only">{detalleMovil ? "Ocultar detalle" : "Ver detalle"}</span>
              </button>
            </div>
            {detalleMovil && (
              <div id="of-panel-movil" className="max-h-[60vh] overflow-y-auto border-b-2 border-[#1A1A18] bg-[#EFEEEA] shadow-[0_12px_24px_-12px_rgba(0,0,0,0.4)]">
                <PanelVivo c={c} r={r} compacto />
              </div>
            )}
          </div>

          <main className="min-w-0">
            <section
              aria-labelledby="of-paso-titulo"
              className="relative border-2 border-[#1A1A18] bg-[#EFEEEA] shadow-[6px_6px_0_#1A1A18]"
            >
              <div className="flex items-center justify-between gap-3 border-b-2 border-[#1A1A18] px-4 py-3 sm:px-6">
                <Etiqueta>
                  Paso {String(c.paso + 1).padStart(2, "0")} / {String(PASOS.length).padStart(2, "0")}
                </Etiqueta>
                <Etiqueta>{PASOS[c.paso]}</Etiqueta>
              </div>
              <div className="px-4 py-6 sm:px-8 sm:py-8">
                {Object.keys(errores).length > 0 && (
                  <div
                    ref={resumenErrRef}
                    tabIndex={-1}
                    role="alert"
                    className="mb-6 border-2 border-[#B42318] bg-[#FFF4F2] p-4 outline-none"
                  >
                    <p className="flex items-center gap-2 text-[15px] font-bold text-[#B42318]">
                      <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true">
                        <path d="M8 1.5 15 14H1Z" fill="#B42318" />
                        <path d="M8 6v3.5M8 11.4v.1" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                      {Object.keys(errores).length === 1 ? "Falta un dato para seguir" : `Faltan ${Object.keys(errores).length} datos para seguir`}
                    </p>
                    <ul className="mt-2 space-y-1 pl-6 text-[14px] text-[#7A1A10]">
                      {Object.entries(errores).map(([k, v]) => (
                        <li key={k} className="list-disc">
                          <button
                            type="button"
                            className="text-left underline underline-offset-2 hover:no-underline"
                            onClick={() => document.getElementById(`campo-${k}`)?.focus()}
                          >
                            {v}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {c.paso === 0 && <PasoTipo c={c} upd={upd} errores={errores} tituloRef={tituloRef} />}
                {c.paso === 1 && <PasoAmbientes c={c} upd={upd} errores={errores} tituloRef={tituloRef} r={r} />}
                {c.paso === 2 && <PasoTerminaciones c={c} upd={upd} errores={errores} tituloRef={tituloRef} />}
                {c.paso === 3 && <PasoExtras c={c} upd={upd} tituloRef={tituloRef} />}
                {c.paso === 4 && <PasoDatos c={c} upd={upd} errores={errores} tituloRef={tituloRef} />}
              </div>

              <div className="flex items-center justify-between gap-3 border-t-2 border-[#1A1A18] bg-[#E4E2DC] px-4 py-3.5 sm:px-6">
                <button
                  type="button"
                  onClick={() => irA(c.paso - 1)}
                  disabled={c.paso === 0}
                  className={`${mono} flex items-center gap-2 px-3 py-2.5 text-[13px] font-medium uppercase tracking-[0.08em] transition hover:bg-[#1A1A18]/5 disabled:invisible`}
                >
                  <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true">
                    <path d="M13 8H3M7 4 3 8l4 4" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                  Atrás
                </button>
                <button
                  type="button"
                  onClick={siguiente}
                  className={`${mono} group flex items-center gap-2.5 border-2 border-[#1A1A18] bg-[#FFC700] px-4 py-2.5 text-[13px] font-semibold uppercase tracking-[0.08em] shadow-[3px_3px_0_#1A1A18] transition hover:-translate-y-px hover:shadow-[4px_4px_0_#1A1A18] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none sm:px-5`}
                >
                  {c.paso === PASOS.length - 1 ? "Ver presupuesto" : "Siguiente"}
                  <svg viewBox="0 0 16 16" className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                </button>
              </div>
            </section>
          </main>

          <aside className="hidden lg:block" aria-label="Cálculo en vivo">
            <div className="sticky top-6 border-2 border-[#1A1A18] bg-[#EFEEEA] shadow-[6px_6px_0_#1A1A18]">
              <PanelVivo c={c} r={r} />
            </div>
          </aside>
        </div>
      )}

      <footer className="relative mx-auto max-w-[1240px] px-4 pb-6 sm:px-6 print:hidden">
        <p className={`${mono} border-t border-[#1A1A18]/20 pt-4 text-[11.5px] uppercase tracking-[0.1em] text-[#5E5C55]`}>
          Demo con contenido ficticio · Obra Fina es un negocio inventado · Precios de referencia sin validez comercial
        </p>
      </footer>

      <WhatsAppPreview abierto={wa} cerrar={() => setWa(false)} c={c} r={r} />

      <style>{`
        @media print {
          @page { size: A4; margin: 12mm; }
          html, body { background: #fff !important; }
          [aria-label="Aviso de demo"] { display: none !important; }
          main:has([data-demo="cotizador"]) { padding: 0 !important; }
        }
        @keyframes of-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
}

function Concreto() {
  // Textura de hormigón: ruido SVG muy sutil fijo detrás de todo.
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 opacity-[0.35] mix-blend-multiply print:hidden"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .45 0 0 0 0 .44 0 0 0 0 .41 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\"), linear-gradient(to right, rgba(26,26,24,.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(26,26,24,.05) 1px, transparent 1px)",
        backgroundSize: "220px 220px, 48px 48px, 48px 48px",
      }}
    />
  );
}

function TotalAnimado({ valor, className }: { valor: number; className?: string }) {
  const v = useNumeroAnimado(valor);
  return (
    <span className={className}>
      <span aria-hidden="true">{pesos(v)}</span>
      <span className="sr-only">{pesos(valor)}</span>
    </span>
  );
}

function Stepper({ paso, progreso, irA }: { paso: number; progreso: number; irA: (p: number) => void }) {
  return (
    <nav aria-label="Pasos del presupuesto">
      <div className="mb-3 flex items-end justify-between gap-4">
        <div>
          <Etiqueta>Presupuesto de reforma</Etiqueta>
          <p className={`${cond} mt-1 text-[30px] font-extrabold uppercase leading-[0.95] tracking-tight sm:text-[44px]`}>
            Cotizá tu obra <span className="bg-[#FFC700] px-1.5 [box-decoration-break:clone]">en 5 pasos</span>
          </p>
        </div>
        <p className={`${mono} shrink-0 text-[12px] tabular-nums text-[#4A4843]`} aria-hidden="true">
          {progreso} %
        </p>
      </div>
      <div
        className="relative h-3 border-2 border-[#1A1A18] bg-[#EFEEEA]"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progreso}
        aria-label="Avance del presupuesto"
      >
        <div
          className="h-full bg-[#FFC700] transition-[width] duration-500 ease-out"
          style={{
            width: `${progreso}%`,
            backgroundImage: "repeating-linear-gradient(135deg, transparent 0 8px, rgba(26,26,24,.18) 8px 10px)",
          }}
        />
        {[20, 40, 60, 80].map((x) => (
          <span key={x} className="absolute top-0 h-full w-0.5 bg-[#1A1A18]/25" style={{ left: `${x}%` }} aria-hidden="true" />
        ))}
      </div>
      <ol className="mt-3 grid grid-cols-5 gap-1.5">
        {PASOS.map((p, i) => {
          const hecho = i < paso;
          const actual = i === paso;
          const contenido = (
            <>
              <span
                className={`${mono} grid size-6 shrink-0 place-items-center border-2 text-[11px] font-semibold ${
                  actual ? "border-[#1A1A18] bg-[#1A1A18] text-[#FFC700]" : hecho ? "border-[#1A1A18] bg-[#FFC700]" : "border-[#8C8981] text-[#6B6962]"
                }`}
              >
                {hecho ? (
                  <svg viewBox="0 0 12 12" className="size-3" aria-hidden="true">
                    <path d="m2 6.5 2.5 2.5L10 3" fill="none" stroke="currentColor" strokeWidth="2" />
                  </svg>
                ) : (
                  i + 1
                )}
              </span>
              <span className={`hidden text-left text-[13px] leading-tight md:block ${actual ? "font-bold" : hecho ? "font-medium" : "text-[#6B6962]"}`}>{p}</span>
            </>
          );
          return (
            <li key={p} aria-current={actual ? "step" : undefined} className="min-w-0">
              {hecho ? (
                <button type="button" onClick={() => irA(i)} className="flex w-full items-center gap-2 py-1 hover:underline" aria-label={`Volver al paso ${i + 1}: ${p}`}>
                  {contenido}
                </button>
              ) : (
                <div className="flex items-center gap-2 py-1">
                  {contenido}
                  <span className="sr-only md:hidden">{`Paso ${i + 1}: ${p}${actual ? " (actual)" : ""}`}</span>
                </div>
              )}
            </li>
          );
        })}
      </ol>
      <p className="mt-1 text-[13px] font-semibold md:hidden" aria-hidden="true">
        {paso < PASOS.length ? `${paso + 1}. ${PASOS[paso]}` : "Presupuesto listo"}
      </p>
    </nav>
  );
}

type PasoProps = {
  c: Cotizacion;
  upd: (f: (x: Cotizacion) => Cotizacion) => void;
  errores?: Errores;
  tituloRef: React.RefObject<HTMLHeadingElement | null>;
};

function TituloPaso({ tituloRef, children, bajada }: { tituloRef: PasoProps["tituloRef"]; children: React.ReactNode; bajada: string }) {
  return (
    <div className="mb-6">
      <h2 id="of-paso-titulo" ref={tituloRef} tabIndex={-1} className={`${cond} text-[30px] font-extrabold uppercase leading-none tracking-tight outline-none sm:text-[38px]`}>
        {children}
      </h2>
      <p className="mt-2 max-w-[56ch] text-[15px] leading-relaxed text-[#4A4843]">{bajada}</p>
    </div>
  );
}

const opcionCard =
  "relative flex cursor-pointer border-2 border-[#1A1A18] bg-[#FBFAF7] transition hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#1A1A18] has-[:checked]:bg-white has-[:checked]:shadow-[4px_4px_0_#FFC700,4px_4px_0_2px_#1A1A18] has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#1A1A18]";

function Tilde() {
  return (
    <span className="absolute right-2.5 top-2.5 hidden size-6 place-items-center border-2 border-[#1A1A18] bg-[#FFC700] [label:has(:checked)_&]:grid" aria-hidden="true">
      <svg viewBox="0 0 12 12" className="size-3">
        <path d="m2 6.5 2.5 2.5L10 3" fill="none" stroke="#1A1A18" strokeWidth="2" />
      </svg>
    </span>
  );
}

function PasoTipo({ c, upd, errores = {}, tituloRef }: PasoProps) {
  const uid = useId();
  return (
    <div className="motion-safe:animate-[of-in_300ms_ease-out]">
      <div className="mb-6 flex items-center gap-5">
        <div className="min-w-0 flex-1">
          <TituloPaso tituloRef={tituloRef} bajada="Elegí lo que más se parece a tu obra. Después ajustamos ambientes, metros y terminaciones.">
            ¿Qué querés reformar?
          </TituloPaso>
        </div>
        <Image
          src="/demos/web-apps/cotizador/plano-isometrico.webp"
          alt="Ilustración isométrica de un ambiente en obra con andamio y baldes"
          width={360}
          height={315}
          sizes="180px"
          className="hidden h-auto w-[180px] shrink-0 sm:block"
          priority
        />
      </div>
      <fieldset aria-describedby={errores.tipo ? `${uid}-err` : undefined}>
        <legend className="sr-only">Tipo de obra</legend>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {TIPOS.map((t, i) => (
            <label key={t.id} className={`${opcionCard} flex-row items-center gap-4 p-4 sm:flex-col sm:items-stretch sm:gap-0 ${errores.tipo ? "border-[#B42318]" : ""}`}>
              <input
                type="radio"
                name="tipo"
                id={i === 0 ? "campo-tipo" : undefined}
                className="sr-only"
                checked={c.tipo === t.id}
                onChange={() => upd((x) => ({ ...x, tipo: t.id, ambientes: x.tipo === t.id ? x.ambientes : [] }))}
              />
              <Tilde />
              <DibujoObra tipo={t.id} className="h-12 w-auto shrink-0 self-center text-[#1A1A18] sm:h-16 sm:self-start" />
              <span className="min-w-0 pr-7 sm:mt-3 sm:pr-0">
                <span className="block text-[16px] font-bold leading-tight">{t.nombre}</span>
                <span className="mt-1 block text-[13.5px] leading-snug text-[#5E5C55]">{t.bajada}</span>
              </span>
            </label>
          ))}
        </div>
        <ErrorCampo id={`${uid}-err`} msg={errores.tipo} />
      </fieldset>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Segmentado
          legend="Estado actual del inmueble"
          name="estado"
          valor={c.estado}
          opciones={ESTADOS}
          onChange={(v) => upd((x) => ({ ...x, estado: v }))}
        />
        <Segmentado legend="Ubicación de la obra" name="zona" valor={c.zona} opciones={ZONAS} onChange={(v) => upd((x) => ({ ...x, zona: v }))} />
      </div>
    </div>
  );
}

function Segmentado<T extends string>({
  legend,
  name,
  valor,
  opciones,
  onChange,
}: {
  legend: string;
  name: string;
  valor: T;
  opciones: { id: T; nombre: string; detalle: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2">
        <Etiqueta>{legend}</Etiqueta>
      </legend>
      <div className="grid grid-cols-3 border-2 border-[#1A1A18] bg-[#FBFAF7]">
        {opciones.map((o, i) => (
          <label
            key={o.id}
            className={`cursor-pointer px-2 py-2.5 text-center transition has-[:checked]:bg-[#1A1A18] has-[:checked]:text-[#EFEEEA] hover:bg-[#1A1A18]/5 has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#1A1A18] ${
              i > 0 ? "border-l-2 border-[#1A1A18]" : ""
            }`}
          >
            <input type="radio" name={name} className="sr-only" checked={valor === o.id} onChange={() => onChange(o.id)} />
            <span className="block text-[13.5px] font-bold leading-tight">{o.nombre}</span>
            <span className={`${mono} mt-0.5 block text-[10.5px] uppercase tracking-[0.06em] opacity-70`}>{o.detalle}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function PasoAmbientes({ c, upd, errores = {}, tituloRef, r }: PasoProps & { r: Resultado }) {
  const [agregarTipo, setAgregarTipo] = useState<AmbienteTipo>("dormitorio");
  const cambiarM2 = (id: string, m2: string) => upd((x) => ({ ...x, ambientes: x.ambientes.map((a) => (a.id === id ? { ...a, m2 } : a)) }));
  const paso = (id: string, delta: number) =>
    upd((x) => ({
      ...x,
      ambientes: x.ambientes.map((a) => (a.id === id ? { ...a, m2: String(Math.max(0, Math.round((m2De(a) + delta) * 10) / 10)) } : a)),
    }));
  return (
    <div className="motion-safe:animate-[of-in_300ms_ease-out]">
      <TituloPaso tituloRef={tituloRef} bajada="Cargá cada ambiente con sus metros cuadrados de piso. Si no los sabés, multiplicá largo por ancho: con una aproximación alcanza.">
        Ambientes y metros
      </TituloPaso>

      {errores.ambientes && (
        <p id="campo-ambientes" tabIndex={-1} className="mb-4">
          <ErrorCampo id="err-ambientes" msg={errores.ambientes} />
        </p>
      )}

      <ul className="space-y-3">
        {c.ambientes.map((a, i) => {
          const err = errores[`m2-${a.id}`];
          const nombre = AMBIENTES.find((x) => x.id === a.tipo)!.nombre;
          return (
            <li key={a.id} className="border-2 border-[#1A1A18] bg-[#FBFAF7] p-3 sm:p-4">
              <div className="flex flex-wrap items-end gap-3">
                <span className={`${mono} grid size-10 shrink-0 place-items-center bg-[#1A1A18] text-[13px] font-semibold text-[#FFC700]`} aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-[150px] flex-1">
                  <label htmlFor={`tipo-${a.id}`} className="mb-1 block">
                    <Etiqueta>Ambiente</Etiqueta>
                  </label>
                  <select
                    id={`tipo-${a.id}`}
                    value={a.tipo}
                    onChange={(e) =>
                      upd((x) => ({ ...x, ambientes: x.ambientes.map((y) => (y.id === a.id ? { ...y, tipo: e.target.value as AmbienteTipo } : y)) }))
                    }
                    className={`${inputBase} py-2`}
                  >
                    {AMBIENTES.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-[176px]">
                  <label htmlFor={`campo-m2-${a.id}`} className="mb-1 block">
                    <Etiqueta>Superficie</Etiqueta>
                  </label>
                  <div className="flex">
                    <button
                      type="button"
                      onClick={() => paso(a.id, -1)}
                      className="grid w-10 shrink-0 place-items-center border-2 border-r-0 border-[#1A1A18] bg-[#E4E2DC] text-[18px] font-bold hover:bg-[#FFC700]"
                      aria-label={`Restar 1 m² a ${nombre}`}
                    >
                      −
                    </button>
                    <div className="relative min-w-0 flex-1">
                      <input
                        id={`campo-m2-${a.id}`}
                        inputMode="decimal"
                        value={a.m2}
                        onChange={(e) => cambiarM2(a.id, e.target.value.replace(/[^\d.,]/g, ""))}
                        className={`${inputBase} ${mono} py-2 pr-9 text-right tabular-nums ${err ? inputError : ""}`}
                        aria-invalid={!!err}
                        aria-describedby={err ? `err-m2-${a.id}` : undefined}
                        placeholder="0"
                      />
                      <span className={`${mono} pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[12px] text-[#6B6962]`}>m²</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => paso(a.id, 1)}
                      className="grid w-10 shrink-0 place-items-center border-2 border-l-0 border-[#1A1A18] bg-[#E4E2DC] text-[18px] font-bold hover:bg-[#FFC700]"
                      aria-label={`Sumar 1 m² a ${nombre}`}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => upd((x) => ({ ...x, ambientes: x.ambientes.filter((y) => y.id !== a.id) }))}
                  className={`${mono} ml-auto flex h-[44px] items-center gap-1.5 px-2 text-[12px] uppercase tracking-[0.08em] text-[#6B6962] hover:text-[#B42318] sm:ml-0`}
                  aria-label={`Quitar ${nombre} ${i + 1}`}
                >
                  <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true">
                    <path d="M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5l.6 8.5h5.8l.6-8.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                  Quitar
                </button>
              </div>
              <ErrorCampo id={`err-m2-${a.id}`} msg={err} />
            </li>
          );
        })}
      </ul>

      <div className="mt-4 flex flex-wrap items-end gap-2 border-2 border-dashed border-[#1A1A18]/50 p-3">
        <div className="min-w-[160px] flex-1">
          <label htmlFor="of-agregar-tipo" className="mb-1 block">
            <Etiqueta>Agregar ambiente</Etiqueta>
          </label>
          <select id="of-agregar-tipo" value={agregarTipo} onChange={(e) => setAgregarTipo(e.target.value as AmbienteTipo)} className={`${inputBase} py-2`}>
            {AMBIENTES.map((o) => (
              <option key={o.id} value={o.id}>
                {o.nombre}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={() => {
            const nuevo = nuevoAmbiente(agregarTipo);
            upd((x) => ({ ...x, ambientes: [...x.ambientes, nuevo] }));
            requestAnimationFrame(() => document.getElementById(`campo-m2-${nuevo.id}`)?.focus());
          }}
          className={`${mono} flex h-[46px] items-center gap-2 border-2 border-[#1A1A18] bg-[#1A1A18] px-4 text-[12.5px] font-semibold uppercase tracking-[0.08em] text-[#FFC700] transition hover:bg-[#33332F]`}
        >
          <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true">
            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" />
          </svg>
          Agregar
        </button>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t-2 border-[#1A1A18] pt-4">
        <p>
          <Etiqueta>Superficie total</Etiqueta>
          <span className={`${cond} ml-2 text-[26px] font-extrabold tabular-nums`}>{num(r.m2)} m²</span>
        </p>
        <p>
          <Etiqueta>Ambientes</Etiqueta>
          <span className={`${cond} ml-2 text-[26px] font-extrabold tabular-nums`}>{c.ambientes.length}</span>
        </p>
      </div>
    </div>
  );
}

function PasoTerminaciones({ c, upd, errores = {}, tituloRef }: PasoProps) {
  return (
    <div className="motion-safe:animate-[of-in_300ms_ease-out]">
      <TituloPaso tituloRef={tituloRef} bajada="Elegí materiales y el nivel de terminación. El precio de los materiales cambia según el nivel.">
        Terminaciones
      </TituloPaso>

      <fieldset aria-describedby={errores.piso ? "err-piso" : undefined}>
        <legend className="mb-3 flex items-center gap-3">
          <span className={`${cond} text-[22px] font-extrabold uppercase`}>Pisos</span>
          <span className="h-0.5 w-10 bg-[#1A1A18]" aria-hidden="true" />
        </legend>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
          {PISOS.map((p, i) => (
            <label key={p.id} className={`${opcionCard} flex-col ${errores.piso ? "border-[#B42318]" : ""}`}>
              <input
                type="radio"
                name="piso"
                id={i === 0 ? "campo-piso" : undefined}
                className="sr-only"
                checked={c.piso === p.id}
                onChange={() => upd((x) => ({ ...x, piso: p.id }))}
              />
              <span className="block aspect-[5/3] overflow-hidden border-b-2 border-[#1A1A18]">
                <MuestraPiso piso={p.id} />
              </span>
              <Tilde />
              <span className="px-3 pb-3 pt-2.5">
                <span className="block text-[14.5px] font-bold leading-tight">{p.nombre}</span>
                <span className="mt-0.5 block text-[12.5px] text-[#5E5C55]">{p.detalle}</span>
                {p.mat > 0 && <span className={`${mono} mt-1.5 block whitespace-nowrap text-[11px] text-[#4A4843]`}>{pesos(p.mat + p.mo)}/m²</span>}
              </span>
            </label>
          ))}
        </div>
        <ErrorCampo id="err-piso" msg={errores.piso} />
      </fieldset>

      <fieldset className="mt-8" aria-describedby={errores.pared ? "err-pared" : undefined}>
        <legend className="mb-3 flex items-center gap-3">
          <span className={`${cond} text-[22px] font-extrabold uppercase`}>Paredes</span>
          <span className="h-0.5 w-10 bg-[#1A1A18]" aria-hidden="true" />
        </legend>
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {PAREDES.map((p, i) => (
            <label key={p.id} className={`${opcionCard} flex-col ${errores.pared ? "border-[#B42318]" : ""}`}>
              <input
                type="radio"
                name="pared"
                id={i === 0 ? "campo-pared" : undefined}
                className="sr-only"
                checked={c.pared === p.id}
                onChange={() => upd((x) => ({ ...x, pared: p.id }))}
              />
              <span className="block aspect-[5/3] overflow-hidden border-b-2 border-[#1A1A18]">
                <MuestraPared pared={p.id} />
              </span>
              <Tilde />
              <span className="px-3 pb-3 pt-2.5">
                <span className="block text-[14.5px] font-bold leading-tight">{p.nombre}</span>
                <span className="mt-0.5 block text-[12.5px] text-[#5E5C55]">{p.detalle}</span>
              </span>
            </label>
          ))}
        </div>
        <ErrorCampo id="err-pared" msg={errores.pared} />
      </fieldset>

      <fieldset className="mt-8">
        <legend className="mb-3 flex items-center gap-3">
          <span className={`${cond} text-[22px] font-extrabold uppercase`}>Nivel de terminación</span>
          <span className="h-0.5 w-10 bg-[#1A1A18]" aria-hidden="true" />
        </legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {NIVELES.map((n) => (
            <label key={n.id} className={`${opcionCard} flex-col p-4`}>
              <input type="radio" name="nivel" className="sr-only" checked={c.nivel === n.id} onChange={() => upd((x) => ({ ...x, nivel: n.id }))} />
              <Tilde />
              <SimboloNivel nivel={n.id} />
              <span className="mt-2 text-[16px] font-bold">{n.nombre}</span>
              <span className="mt-1 text-[13px] leading-snug text-[#5E5C55]">{n.detalle}</span>
              <span className={`${mono} mt-2 text-[11px] uppercase tracking-[0.06em] text-[#4A4843]`}>
                {n.factor === 1 ? "Precio base" : `Materiales +${Math.round((n.factor - 1) * 100)} %`}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}

function PasoExtras({ c, upd, tituloRef }: PasoProps) {
  const toggles = ["demolicion", "electrica", "sanitaria", "limpieza", "direccion"] as const;
  const cantidades = [
    ["aberturas", 12, 1],
    ["muebles", 20, 0.5],
    ["aires", 6, 1],
  ] as const;
  const precioToggle: Record<(typeof toggles)[number], string> = {
    demolicion: `${pesos(PRECIOS.demolicionM2)}/m² + volquetes`,
    electrica: `${pesos(PRECIOS.electricaM2)}/m²`,
    sanitaria: `${pesos(PRECIOS.sanitariaAmbiente)} por ambiente húmedo`,
    limpieza: `${pesos(PRECIOS.limpiezaM2)}/m²`,
    direccion: "7 % del total",
  };
  const precioCant = { aberturas: `${pesos(PRECIOS.abertura)} c/u`, muebles: `${pesos(PRECIOS.muebleMl)}/m`, aires: `${pesos(PRECIOS.aire)} c/u` };
  return (
    <div className="motion-safe:animate-[of-in_300ms_ease-out]">
      <TituloPaso tituloRef={tituloRef} bajada="Sumá lo que haga falta. Todo es opcional y el total se actualiza al instante.">
        Extras
      </TituloPaso>

      <fieldset>
        <legend className="sr-only">Trabajos adicionales</legend>
        <div className="grid gap-3 md:grid-cols-2">
          {toggles.map((k) => {
            const info = EXTRAS_INFO[k];
            const forzado = k === "demolicion" && c.estado === "demoler";
            return (
              <label key={k} className={`${opcionCard} items-start gap-3 p-4 ${forzado ? "cursor-default opacity-90" : ""}`}>
                <input
                  type="checkbox"
                  checked={c.extras[k] || forzado}
                  disabled={forzado}
                  onChange={(e) => upd((x) => ({ ...x, extras: { ...x.extras, [k]: e.target.checked } }))}
                  className="peer sr-only"
                />
                <span
                  className="mt-0.5 grid size-6 shrink-0 place-items-center border-2 border-[#1A1A18] bg-white peer-checked:bg-[#FFC700] [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100"
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 12 12" className="size-3.5">
                    <path d="m2 6.5 2.5 2.5L10 3" fill="none" stroke="#1A1A18" strokeWidth="2" />
                  </svg>
                </span>
                <span className="min-w-0">
                  <span className="block text-[15px] font-bold leading-tight">{info.nombre}</span>
                  <span className="mt-1 block text-[13px] leading-snug text-[#5E5C55]">
                    {forzado ? "Incluida porque el inmueble está para demoler." : info.detalle}
                  </span>
                  <span className={`${mono} mt-1.5 block text-[11px] text-[#4A4843]`}>{precioToggle[k]}</span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {cantidades.map(([k, max, stepN]) => {
          const info = EXTRAS_INFO[k];
          const v = c.extras[k];
          const set = (nv: number) => upd((x) => ({ ...x, extras: { ...x.extras, [k]: Math.min(max, Math.max(0, Math.round(nv * 2) / 2)) } }));
          return (
            <div key={k} className={`border-2 border-[#1A1A18] p-4 ${v > 0 ? "bg-white shadow-[4px_4px_0_#FFC700,4px_4px_0_2px_#1A1A18]" : "bg-[#FBFAF7]"}`}>
              <p className="text-[15px] font-bold leading-tight" id={`lbl-${k}`}>
                {info.nombre}
              </p>
              <p className="mt-1 text-[13px] leading-snug text-[#5E5C55]">{info.detalle}</p>
              <p className={`${mono} mt-1.5 text-[11px] text-[#4A4843]`}>{precioCant[k]}</p>
              <div className="mt-3 flex items-center" role="group" aria-labelledby={`lbl-${k}`}>
                <button
                  type="button"
                  onClick={() => set(v - stepN)}
                  disabled={v <= 0}
                  className="grid size-10 place-items-center border-2 border-[#1A1A18] bg-[#E4E2DC] text-[18px] font-bold hover:bg-[#FFC700] disabled:opacity-40 disabled:hover:bg-[#E4E2DC]"
                  aria-label={`Menos ${info.nombre.toLowerCase()}`}
                >
                  −
                </button>
                <output className={`${mono} grid h-10 min-w-16 flex-1 place-items-center border-y-2 border-[#1A1A18] bg-white text-[15px] font-semibold tabular-nums`} aria-live="polite">
                  {num(v)} {info.unidad}
                </output>
                <button
                  type="button"
                  onClick={() => set(v + stepN)}
                  disabled={v >= max}
                  className="grid size-10 place-items-center border-2 border-[#1A1A18] bg-[#E4E2DC] text-[18px] font-bold hover:bg-[#FFC700] disabled:opacity-40"
                  aria-label={`Más ${info.nombre.toLowerCase()}`}
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 max-w-md">
        <Segmentado
          legend="Plazo de ejecución"
          name="plazo"
          valor={c.plazo}
          opciones={[
            { id: "normal", nombre: "Normal", detalle: "Cronograma estándar" },
            { id: "urgente", nombre: "Urgente", detalle: "−25 % tiempo · +15 % MO" },
          ]}
          onChange={(v) => upd((x) => ({ ...x, plazo: v }))}
        />
      </div>
    </div>
  );
}

function PasoDatos({ c, upd, errores = {}, tituloRef }: PasoProps) {
  const set = (k: keyof Cotizacion["datos"], v: string) => upd((x) => ({ ...x, datos: { ...x.datos, [k]: v } }));
  const campo = (
    k: keyof Cotizacion["datos"],
    label: string,
    props: React.InputHTMLAttributes<HTMLInputElement> & { opcional?: boolean; ayuda?: string } = {},
  ) => {
    const { opcional, ayuda, ...rest } = props;
    const err = errores[k];
    const desc = [err ? `err-${k}` : "", ayuda ? `ayuda-${k}` : ""].filter(Boolean).join(" ") || undefined;
    return (
      <div>
        <label htmlFor={`campo-${k}`} className="mb-1.5 flex items-baseline justify-between gap-2">
          <span className="text-[14px] font-bold">{label}</span>
          {opcional && <span className={`${mono} text-[10.5px] uppercase tracking-[0.08em] text-[#6B6962]`}>Opcional</span>}
        </label>
        <input
          id={`campo-${k}`}
          value={c.datos[k]}
          onChange={(e) => set(k, e.target.value)}
          className={`${inputBase} ${err ? inputError : ""}`}
          aria-invalid={!!err}
          aria-describedby={desc}
          {...rest}
        />
        {ayuda && !err && (
          <p id={`ayuda-${k}`} className="mt-1.5 text-[12.5px] text-[#6B6962]">
            {ayuda}
          </p>
        )}
        <ErrorCampo id={`err-${k}`} msg={err} />
      </div>
    );
  };
  return (
    <div className="motion-safe:animate-[of-in_300ms_ease-out]">
      <TituloPaso tituloRef={tituloRef} bajada="Con estos datos armamos el presupuesto a tu nombre. En la demo no se envía nada: todo queda en tu navegador.">
        Tus datos
      </TituloPaso>
      <div className="grid gap-5 sm:grid-cols-2">
        {campo("nombre", "Nombre y apellido", { autoComplete: "name", placeholder: "Ej.: Mariana Quiroga" })}
        {campo("telefono", "Teléfono", { autoComplete: "tel", inputMode: "tel", placeholder: "351 555 0142", ayuda: "Con código de área, sin 0 ni 15." })}
        {campo("email", "Email", { autoComplete: "email", inputMode: "email", placeholder: "nombre@correo.com", opcional: true })}
        {campo("barrio", "Barrio o localidad de la obra", { placeholder: "Ej.: Güemes, Villa Allende" })}
        {campo("inicio", "¿Cuándo te gustaría empezar?", { type: "date", opcional: true })}
      </div>
      <div className="mt-5">
        <label htmlFor="campo-comentarios" className="mb-1.5 flex items-baseline justify-between gap-2">
          <span className="text-[14px] font-bold">Comentarios</span>
          <span className={`${mono} text-[10.5px] uppercase tracking-[0.08em] text-[#6B6962]`}>Opcional</span>
        </label>
        <textarea
          id="campo-comentarios"
          value={c.datos.comentarios}
          onChange={(e) => set("comentarios", e.target.value)}
          rows={3}
          maxLength={400}
          placeholder="Contanos lo que quieras: accesos, horarios, si vivís en la casa durante la obra…"
          className={`${inputBase} resize-y`}
        />
      </div>
    </div>
  );
}

/* ---------------- Panel en vivo ---------------- */

function PanelVivo({ c, r, compacto = false }: { c: Cotizacion; r: Resultado; compacto?: boolean }) {
  const max = Math.max(1, ...r.rubros.map((x) => x.total));
  const pctMat = r.subtotal ? (r.materiales / r.subtotal) * 100 : 50;
  return (
    <div>
      {!compacto && (
        <div className="border-b-2 border-[#1A1A18] bg-[#1A1A18] px-5 py-4 text-[#EFEEEA]">
          <div className="flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#FFC700] opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex size-2 rounded-full bg-[#FFC700]" />
            </span>
            <span className={`${mono} text-[11px] uppercase tracking-[0.14em] text-[#A8A59C]`}>Cálculo en vivo</span>
            <span className={`${mono} ml-auto text-[11px] text-[#A8A59C]`}>{NUMERO}</span>
          </div>
          <p className={`${mono} mt-3 text-[11px] uppercase tracking-[0.12em] text-[#A8A59C]`}>Total estimado</p>
          <TotalAnimado valor={r.total} className={`${cond} block text-[44px] font-extrabold leading-none tabular-nums text-[#FFC700]`} />
          <p className={`${mono} mt-1.5 text-[11px] text-[#A8A59C]`}>IVA incluido · valores ficticios</p>
        </div>
      )}

      <div className="px-5 py-4">
        {!c.tipo ? (
          <div className="py-6 text-center">
            <DibujoObra tipo="integral" className="mx-auto h-14 w-auto text-[#8C8981]" />
            <p className="mt-3 text-[14px] font-semibold">Elegí el tipo de obra para empezar a calcular.</p>
            <p className="mt-1 text-[13px] text-[#5E5C55]">El presupuesto se arma solo a medida que avanzás.</p>
          </div>
        ) : (
          <>
            <dl className={`${mono} grid grid-cols-3 gap-2 text-[11px] uppercase tracking-[0.06em]`}>
              <div className="border border-[#1A1A18]/25 px-2 py-1.5">
                <dt className="text-[#6B6962]">Obra</dt>
                <dd className="mt-0.5 truncate font-semibold normal-case tracking-normal text-[#1A1A18]">{TIPOS.find((t) => t.id === c.tipo)?.nombre.split(" ")[0]}</dd>
              </div>
              <div className="border border-[#1A1A18]/25 px-2 py-1.5">
                <dt className="text-[#6B6962]">Superficie</dt>
                <dd className="mt-0.5 font-semibold normal-case tracking-normal text-[#1A1A18] tabular-nums">{num(r.m2)} m²</dd>
              </div>
              <div className="border border-[#1A1A18]/25 px-2 py-1.5">
                <dt className="text-[#6B6962]">Plazo</dt>
                <dd className="mt-0.5 font-semibold normal-case tracking-normal text-[#1A1A18] tabular-nums">
                  {r.semanas} {r.semanas === 1 ? "semana" : "semanas"}
                </dd>
              </div>
            </dl>

            <h3 className={`${mono} mb-2 mt-5 text-[11px] uppercase tracking-[0.12em] text-[#6B6962]`}>Subtotales por rubro</h3>
            {r.rubros.length === 0 ? (
              <p className="text-[13px] text-[#5E5C55]">Cargá ambientes y terminaciones para ver el detalle.</p>
            ) : (
              <ul className="space-y-2.5">
                {r.rubros.map((x) => (
                  <li key={x.rubro}>
                    <div className="flex items-baseline justify-between gap-3 text-[13.5px]">
                      <span className="font-semibold">{x.rubro}</span>
                      <span className={`${mono} tabular-nums`}>{pesos(x.total)}</span>
                    </div>
                    <div className="mt-1 h-1.5 bg-[#1A1A18]/10">
                      <div className="h-full bg-[#1A1A18] transition-[width] duration-500" style={{ width: `${(x.total / max) * 100}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <h3 className={`${mono} mb-2 mt-5 text-[11px] uppercase tracking-[0.12em] text-[#6B6962]`}>Materiales y mano de obra</h3>
            <div className="flex h-3 border-2 border-[#1A1A18]" role="img" aria-label={`Materiales ${Math.round(pctMat)} por ciento, mano de obra ${100 - Math.round(pctMat)} por ciento`}>
              <div className="h-full bg-[#FFC700] transition-[width] duration-500" style={{ width: `${pctMat}%` }} />
              <div className="h-full flex-1 bg-[#1A1A18]" />
            </div>
            <dl className="mt-2 space-y-1 text-[13.5px]">
              <div className="flex justify-between gap-3">
                <dt className="flex items-center gap-2">
                  <span className="size-2.5 border border-[#1A1A18] bg-[#FFC700]" aria-hidden="true" /> Materiales
                </dt>
                <dd className={`${mono} tabular-nums`}>{pesos(r.materiales)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="flex items-center gap-2">
                  <span className="size-2.5 bg-[#1A1A18]" aria-hidden="true" /> Mano de obra
                </dt>
                <dd className={`${mono} tabular-nums`}>{pesos(r.manoObra)}</dd>
              </div>
            </dl>

            <dl className="mt-4 space-y-1 border-t-2 border-dashed border-[#1A1A18]/40 pt-3 text-[13.5px]">
              <div className="flex justify-between gap-3">
                <dt>Subtotal</dt>
                <dd className={`${mono} tabular-nums`}>{pesos(r.subtotal)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>
                  IVA 21 % <span className="text-[#6B6962]">(ficticio)</span>
                </dt>
                <dd className={`${mono} tabular-nums`}>{pesos(r.iva)}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-3 border-t-2 border-[#1A1A18] pt-2 text-[16px] font-bold">
                <dt>Total</dt>
                <dd className={`${mono} tabular-nums`}>{pesos(r.total)}</dd>
              </div>
            </dl>
          </>
        )}
        <p className="mt-4 text-[12px] leading-snug text-[#6B6962]">
          Estimación orientativa con precios ficticios. El valor final se confirma después de la visita técnica.
        </p>
      </div>
    </div>
  );
}

/* ---------------- Resumen tipo documento ---------------- */

function fechaLarga(d: Date) {
  return d.toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });
}

function Resumen({
  c,
  r,
  editar,
  nuevo,
  whatsapp,
  tituloRef,
}: {
  c: Cotizacion;
  r: Resultado;
  editar: () => void;
  nuevo: () => void;
  whatsapp: () => void;
  tituloRef: React.RefObject<HTMLHeadingElement | null>;
}) {
  const hoy = new Date();
  const vence = new Date(hoy);
  vence.setDate(vence.getDate() + 15);
  const tipo = TIPOS.find((t) => t.id === c.tipo);
  const piso = PISOS.find((p) => p.id === c.piso);
  const pared = PAREDES.find((p) => p.id === c.pared);
  const nivel = NIVELES.find((n) => n.id === c.nivel);
  const btn = `${mono} flex items-center justify-center gap-2 border-2 border-[#1A1A18] px-4 py-2.5 text-[12.5px] font-semibold uppercase tracking-[0.08em] shadow-[3px_3px_0_#1A1A18] transition hover:-translate-y-px active:translate-x-[2px] active:translate-y-[2px] active:shadow-none`;

  return (
    <div className="relative mx-auto max-w-[1000px] px-4 pb-12 pt-6 sm:px-6 print:max-w-none print:p-0">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between print:hidden">
        <div>
          <Etiqueta>Listo</Etiqueta>
          <h2 id="of-paso-titulo" ref={tituloRef} tabIndex={-1} className={`${cond} mt-1 text-[34px] font-extrabold uppercase leading-none outline-none`}>
            Tu presupuesto
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          <button type="button" onClick={whatsapp} className={`${btn} col-span-2 bg-[#FFC700]`}>
            <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true">
              <path d="M2.5 13.5 3.3 11A5.7 5.7 0 1 1 5.4 13Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
            Compartir por WhatsApp
          </button>
          <button type="button" onClick={() => window.print()} className={`${btn} bg-[#EFEEEA]`}>
            <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true">
              <path d="M4 6V2h8v4M4 12H2.5V6.5h11V12H12M4 9.5h8V14H4Z" fill="none" stroke="currentColor" strokeWidth="1.4" />
            </svg>
            Imprimir
          </button>
          <button type="button" onClick={editar} className={`${btn} bg-[#EFEEEA]`}>
            Editar
          </button>
        </div>
      </div>

      <article
        id="presupuesto-doc"
        aria-label="Documento del presupuesto"
        className="relative overflow-hidden border-2 border-[#1A1A18] bg-white shadow-[8px_8px_0_#1A1A18] motion-safe:animate-[of-in_400ms_ease-out] print:border-0 print:shadow-none"
      >
        <Cinta className="h-2.5 print:[print-color-adjust:exact]" />
        <div className="px-5 py-6 sm:px-10 sm:py-9">
          <header className="flex flex-col gap-5 border-b-2 border-[#1A1A18] pb-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-3">
              <LogoObraFina className="h-12 w-12 print:[print-color-adjust:exact]" />
              <div>
                <p className={`${cond} text-[26px] font-extrabold uppercase leading-none`}>Obra Fina</p>
                <p className={`${mono} mt-1 text-[11px] uppercase tracking-[0.12em] text-[#6B6962]`}>Reformas y construcción</p>
                <p className="mt-1 text-[12px] text-[#6B6962]">Av. Ficticia 1234, Córdoba · obrafina.demo</p>
              </div>
            </div>
            <div className="sm:text-right">
              <p className={`${cond} text-[30px] font-extrabold uppercase leading-none`}>Presupuesto</p>
              <p className={`${mono} mt-1.5 text-[13px] font-semibold`}>N.º {NUMERO}</p>
              <p className={`${mono} text-[12px] text-[#4A4843]`}>Emitido: {fechaLarga(hoy)}</p>
              <p className={`${mono} text-[12px] text-[#4A4843]`}>Válido hasta: {fechaLarga(vence)}</p>
            </div>
          </header>

          <section className="grid gap-5 border-b border-[#1A1A18]/20 py-6 sm:grid-cols-2" aria-label="Datos">
            <div>
              <Etiqueta>Cliente</Etiqueta>
              <p className="mt-1 text-[16px] font-bold">{c.datos.nombre}</p>
              <p className="text-[14px] text-[#4A4843]">
                Tel. {c.datos.telefono}
                {c.datos.email && ` · ${c.datos.email}`}
              </p>
              <p className="text-[14px] text-[#4A4843]">
                Obra en {c.datos.barrio} · {ZONAS.find((z) => z.id === c.zona)?.nombre}
              </p>
            </div>
            <div>
              <Etiqueta>Trabajo</Etiqueta>
              <p className="mt-1 text-[16px] font-bold">
                {tipo?.nombre} · {num(r.m2)} m²
              </p>
              <p className="text-[14px] text-[#4A4843]">
                {c.ambientes.map((a) => `${AMBIENTES.find((x) => x.id === a.tipo)?.nombre} (${num(m2De(a))} m²)`).join(", ")}
              </p>
              <p className="text-[14px] text-[#4A4843]">
                Pisos: {piso?.nombre.toLowerCase()} · Paredes: {pared?.nombre.toLowerCase()} · Nivel {nivel?.nombre.toLowerCase()}
              </p>
            </div>
          </section>

          <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
            <table className="mt-6 w-full border-collapse sm:min-w-[560px] text-[13.5px]">
              <caption className="sr-only">Detalle del presupuesto por rubro</caption>
              <thead>
                <tr className={`${mono} border-b-2 border-[#1A1A18] text-left text-[10.5px] uppercase tracking-[0.1em] text-[#4A4843]`}>
                  <th scope="col" className="py-2 pr-3 font-medium">Concepto</th>
                  <th scope="col" className="px-3 py-2 text-right font-medium">Cant.</th>
                  <th scope="col" className="hidden px-3 py-2 text-right font-medium sm:table-cell">Materiales</th>
                  <th scope="col" className="hidden px-3 py-2 text-right font-medium sm:table-cell">Mano de obra</th>
                  <th scope="col" className="py-2 pl-3 text-right font-medium">Importe</th>
                </tr>
              </thead>
              {r.rubros.map((rb) => (
                <tbody key={rb.rubro} className="break-inside-avoid">
                  <tr>
                    <th colSpan={2} scope="colgroup" className={`${cond} pb-1 pt-4 text-left text-[16px] font-extrabold uppercase`}>
                      {rb.rubro}
                    </th>
                    <td className="hidden sm:table-cell" />
                    <td className="hidden sm:table-cell" />
                    <td className={`${mono} pb-1 pt-4 text-right text-[12px] font-semibold tabular-nums`}>{pesos(rb.total)}</td>
                  </tr>
                  {r.lineas
                    .filter((l) => l.rubro === rb.rubro)
                    .map((l, i) => (
                      <tr key={i} className="border-b border-[#1A1A18]/10 align-top">
                        <td className="py-1.5 pr-3 text-[#2B2B28]">{l.concepto}</td>
                        <td className={`${mono} whitespace-nowrap px-3 py-1.5 text-right tabular-nums text-[#4A4843]`}>
                          {num(l.cantidad)} {l.unidad}
                        </td>
                        <td className={`${mono} hidden whitespace-nowrap px-3 py-1.5 text-right tabular-nums text-[#4A4843] sm:table-cell`}>{l.materiales ? pesos(l.materiales) : "—"}</td>
                        <td className={`${mono} hidden whitespace-nowrap px-3 py-1.5 text-right tabular-nums text-[#4A4843] sm:table-cell`}>{l.manoObra ? pesos(l.manoObra) : "—"}</td>
                        <td className={`${mono} whitespace-nowrap py-1.5 pl-3 text-right tabular-nums`}>{pesos(l.materiales + l.manoObra)}</td>
                      </tr>
                    ))}
                </tbody>
              ))}
            </table>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-[1fr_320px]">
            <div className="text-[13px] leading-relaxed text-[#4A4843]">
              <Etiqueta>Condiciones</Etiqueta>
              <ul className="mt-2 space-y-1.5">
                <li>
                  <strong className="text-[#1A1A18]">Plazo estimado:</strong> {r.semanas} {r.semanas === 1 ? "semana" : "semanas"} desde el inicio
                  {c.datos.inicio && ` (inicio deseado: ${fechaLarga(new Date(`${c.datos.inicio}T12:00:00`))})`}.
                </li>
                <li>
                  <strong className="text-[#1A1A18]">Forma de pago:</strong> 40 % al firmar, 40 % a mitad de obra y 20 % contra entrega.
                </li>
                <li>
                  <strong className="text-[#1A1A18]">Incluye:</strong> materiales, mano de obra, seguros del personal y retiro de sobrantes.
                </li>
                <li>
                  <strong className="text-[#1A1A18]">Validez:</strong> 15 días. Precios sujetos a visita técnica.
                </li>
                {c.datos.comentarios && (
                  <li>
                    <strong className="text-[#1A1A18]">Tus comentarios:</strong> {c.datos.comentarios}
                  </li>
                )}
              </ul>
            </div>
            <dl className="self-start border-2 border-[#1A1A18] text-[14px]">
              <div className="flex justify-between gap-3 px-4 py-2">
                <dt>Materiales</dt>
                <dd className={`${mono} tabular-nums`}>{pesos(r.materiales)}</dd>
              </div>
              <div className="flex justify-between gap-3 px-4 py-2">
                <dt>Mano de obra</dt>
                <dd className={`${mono} tabular-nums`}>{pesos(r.manoObra)}</dd>
              </div>
              <div className="flex justify-between gap-3 border-t border-[#1A1A18]/20 px-4 py-2">
                <dt>Subtotal</dt>
                <dd className={`${mono} tabular-nums`}>{pesos(r.subtotal)}</dd>
              </div>
              <div className="flex justify-between gap-3 px-4 py-2">
                <dt>IVA 21 % (ficticio)</dt>
                <dd className={`${mono} tabular-nums`}>{pesos(r.iva)}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-3 bg-[#1A1A18] px-4 py-3 text-[#EFEEEA] print:[print-color-adjust:exact]">
                <dt className={`${cond} text-[18px] font-extrabold uppercase`}>Total</dt>
                <dd className={`${cond} text-[26px] font-extrabold tabular-nums text-[#FFC700]`}>{pesos(r.total)}</dd>
              </div>
            </dl>
          </div>

          <footer className="mt-10 grid gap-8 sm:grid-cols-2">
            <div>
              <div className="h-12 border-b border-[#1A1A18]" />
              <p className={`${mono} mt-1.5 text-[11px] uppercase tracking-[0.1em] text-[#6B6962]`}>Arq. Julieta Barrionuevo · Obra Fina</p>
            </div>
            <div>
              <div className="h-12 border-b border-[#1A1A18]" />
              <p className={`${mono} mt-1.5 text-[11px] uppercase tracking-[0.1em] text-[#6B6962]`}>Conformidad del cliente</p>
            </div>
          </footer>
          <p className={`${mono} mt-8 border-t border-dashed border-[#1A1A18]/30 pt-3 text-center text-[10.5px] uppercase tracking-[0.1em] text-[#6B6962]`}>
            Documento de demostración · Contenido y precios ficticios
          </p>
        </div>
      </article>

      <div className="mt-6 text-center print:hidden">
        <button type="button" onClick={nuevo} className={`${mono} text-[12.5px] uppercase tracking-[0.08em] underline underline-offset-4 hover:no-underline`}>
          Empezar un presupuesto nuevo
        </button>
      </div>
    </div>
  );
}

/* ---------------- Vista previa de WhatsApp ---------------- */

function mensajeWhatsApp(c: Cotizacion, r: Resultado) {
  const tipo = TIPOS.find((t) => t.id === c.tipo)?.nombre ?? "Obra";
  const nombre = c.datos.nombre.split(" ")[0] || "";
  const lineas = [
    `¡Hola, Obra Fina! Soy ${nombre}.`,
    `Armé el presupuesto ${NUMERO} en la web:`,
    "",
    `• ${tipo}, ${num(r.m2)} m² en ${c.datos.barrio}`,
    `• Pisos: ${PISOS.find((p) => p.id === c.piso)?.nombre}. Paredes: ${PAREDES.find((p) => p.id === c.pared)?.nombre}`,
    `• Nivel ${NIVELES.find((n) => n.id === c.nivel)?.nombre.toLowerCase()}, plazo estimado ${r.semanas} ${r.semanas === 1 ? "semana" : "semanas"}`,
    `• Total estimado: ${pesos(r.total)} (IVA incl.)`,
    "",
    "¿Podemos coordinar la visita técnica? ¡Gracias!",
  ];
  return lineas.join("\n");
}

function WhatsAppPreview({ abierto, cerrar, c, r }: { abierto: boolean; cerrar: () => void; c: Cotizacion; r: Resultado }) {
  const [copiado, setCopiado] = useState(false);
  const texto = mensajeWhatsApp(c, r);
  const hora = new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
  return (
    <Dialog
      abierto={abierto}
      onClose={() => {
        setCopiado(false);
        cerrar();
      }}
      labelledBy="of-wa-titulo"
      describedBy="of-wa-desc"
      overlayClassName="bg-[#1A1A18]/60 p-0 sm:p-6"
      className="flex max-h-[92dvh] w-full flex-col overflow-hidden border-2 border-[#1A1A18] bg-[#EFEEEA] font-[family-name:var(--font-of-sans)] text-[#1A1A18] shadow-[8px_8px_0_#FFC700] outline-none sm:max-w-[460px] [&_:focus-visible]:outline-[3px] [&_:focus-visible]:outline-offset-2 [&_:focus-visible]:outline-[#1A1A18]"
    >
      <div className="flex items-center justify-between gap-3 border-b-2 border-[#1A1A18] px-5 py-3.5">
        <h2 id="of-wa-titulo" className={`${cond} text-[22px] font-extrabold uppercase`}>
          Así te llegaría el pedido
        </h2>
        <button type="button" onClick={cerrar} className="grid size-9 place-items-center hover:bg-[#1A1A18]/10" aria-label="Cerrar">
          <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true">
            <path d="M3 3l10 10M13 3 3 13" stroke="currentColor" strokeWidth="1.8" />
          </svg>
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="flex items-center gap-3 bg-[#1F3A33] px-4 py-2.5 text-white">
          <LogoObraFina className="h-9 w-9 rounded-full" />
          <div>
            <p className="text-[14.5px] font-semibold leading-tight">Obra Fina</p>
            <p className="text-[12px] text-white/70">Cuenta de empresa</p>
          </div>
        </div>
        <div
          className="px-4 py-5"
          style={{
            background: "#E9E2D6",
            backgroundImage: "radial-gradient(rgba(26,26,24,.06) 1px, transparent 1px)",
            backgroundSize: "14px 14px",
          }}
        >
          <div className="ml-auto max-w-[88%] rounded-lg rounded-tr-none bg-[#D9F6C8] px-3 py-2 text-[14px] leading-snug text-[#1A1A18] shadow-[0_1px_1px_rgba(0,0,0,0.12)]">
            <p className="whitespace-pre-wrap break-words">{texto}</p>
            <p className="mt-1 text-right text-[11px] text-[#5E6B58]">
              {hora}
              <svg viewBox="0 0 18 12" className="ml-1 inline size-3.5 align-[-2px]" aria-hidden="true">
                <path d="m1 6.5 3 3L10 3M7.5 9.5 14 3" fill="none" stroke="#3B8FD9" strokeWidth="1.6" />
              </svg>
            </p>
          </div>
        </div>
        <p id="of-wa-desc" className="px-5 pt-4 text-[13px] leading-snug text-[#4A4843]">
          En la demo no se abre WhatsApp ni se envía nada. En tu versión, este botón le manda el mensaje directo al número del negocio.
        </p>
      </div>
      <div className="flex flex-wrap gap-2 px-5 pb-5 pt-4">
        <button
          type="button"
          onClick={async () => setCopiado(await copiarTexto(texto))}
          className={`${mono} flex flex-1 items-center justify-center gap-2 border-2 border-[#1A1A18] bg-[#FFC700] px-4 py-2.5 text-[12.5px] font-semibold uppercase tracking-[0.08em] shadow-[3px_3px_0_#1A1A18]`}
        >
          {copiado ? "Copiado" : "Copiar mensaje"}
        </button>
        <button
          type="button"
          onClick={cerrar}
          className={`${mono} border-2 border-[#1A1A18] px-4 py-2.5 text-[12.5px] font-semibold uppercase tracking-[0.08em]`}
        >
          Cerrar
        </button>
        <p className="sr-only" aria-live="polite">
          {copiado ? "Mensaje copiado al portapapeles" : ""}
        </p>
      </div>
    </Dialog>
  );
}
