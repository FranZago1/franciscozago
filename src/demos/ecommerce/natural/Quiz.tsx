"use client";

import Image from "next/image";
import { useState } from "react";
import { Dialogo } from "../shared/Dialogo";
import { pesos } from "../shared/formato";
import { IconoCerrar, IconoCheck, IconoVolver } from "../shared/Iconos";
import { porId, rutinas, type Rutina } from "./datos";
import { agregarRutina, precioRutina, quiz, serif, tienda } from "./tienda";

type Clave = Rutina["id"];
type Opcion = { valor: string; texto: string; ayuda: string; suma: Partial<Record<Clave, number>> };
type Pregunta = { id: string; titulo: string; opciones: Opcion[] };

const PREGUNTAS: Pregunta[] = [
  {
    id: "tarde",
    titulo: "¿Cómo sentís tu piel a media tarde?",
    opciones: [
      { valor: "seca", texto: "Tirante y opaca", ayuda: "Te pide crema a cada rato", suma: { nutricion: 2 } },
      { valor: "mixta", texto: "Con brillo en la zona T", ayuda: "Frente, nariz y mentón", suma: { equilibrio: 2 } },
      { valor: "sensible", texto: "Se irrita o se enrojece fácil", ayuda: "Arde con productos nuevos", suma: { calma: 2 } },
    ],
  },
  {
    id: "objetivo",
    titulo: "¿Qué te gustaría mejorar primero?",
    opciones: [
      { valor: "hidratar", texto: "Hidratación", ayuda: "Sentirla suave y cómoda", suma: { nutricion: 1 } },
      { valor: "brillo", texto: "Brillo y poros", ayuda: "Una piel más pareja", suma: { equilibrio: 1 } },
      { valor: "rojeces", texto: "Rojeces y ardor", ayuda: "Que se calme de una vez", suma: { calma: 1 } },
      { valor: "manchas", texto: "Manchas y luminosidad", ayuda: "Recuperar la luz", suma: { nutricion: 1 } },
    ],
  },
  {
    id: "tiempo",
    titulo: "¿Cuánto tiempo le querés dedicar?",
    opciones: [
      { valor: "corto", texto: "Dos minutos", ayuda: "Tres pasos y listo", suma: {} },
      { valor: "largo", texto: "Cinco minutos o más", ayuda: "Me gusta el ritual", suma: {} },
    ],
  },
];

const EXTRA: Record<Clave, string> = { calma: "tonico", equilibrio: "limpiador", nutricion: "mascarilla" };
const MOTIVO: Record<string, string> = {
  seca: "tu piel se siente tirante",
  mixta: "tenés brillo en la zona T",
  sensible: "tu piel se irrita con facilidad",
  hidratar: "querés más hidratación",
  brillo: "querés controlar el brillo",
  rojeces: "querés calmar las rojeces",
  manchas: "querés emparejar el tono",
};

const foco = "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#4A5634]";

export function BotonQuiz({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <button type="button" onClick={() => quiz.set(true)} className={className}>
      {children}
    </button>
  );
}

export function Quiz() {
  const abierto = quiz.use();
  return (
    <Dialogo abierto={abierto} onCerrar={() => quiz.set(false)} titulo="hb-quiz-titulo" className="rounded-t-[2rem] bg-[#F6F5EF] text-[#2D3524] sm:max-w-2xl sm:rounded-[2rem]" overlayClassName="bg-[#2D3524]/40 backdrop-blur-sm">
      <QuizContenido />
    </Dialogo>
  );
}

function QuizContenido() {
  const [paso, setPaso] = useState(0);
  const [resp, setResp] = useState<Record<string, string>>({});
  const [agregado, setAgregado] = useState<string[]>([]);
  const total = PREGUNTAS.length;
  const pregunta = PREGUNTAS[paso];

  const resultado = (() => {
    if (paso < total) return null;
    const puntos: Record<Clave, number> = { calma: 0, equilibrio: 0, nutricion: 0 };
    for (const p of PREGUNTAS) {
      const op = p.opciones.find((o) => o.valor === resp[p.id]);
      for (const [k, v] of Object.entries(op?.suma ?? {})) puntos[k as Clave] += v ?? 0;
    }
    const ganadora = (Object.keys(puntos) as Clave[]).sort((a, b) => puntos[b] - puntos[a])[0] ?? "calma";
    return rutinas.find((r) => r.id === ganadora) ?? rutinas[0]!;
  })();

  function elegir(valor: string) {
    if (!pregunta) return;
    setResp((r) => ({ ...r, [pregunta.id]: valor }));
  }

  return (
    <div className="p-5 pb-8 sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-[#2D3524]/60">{resultado ? "Tu rutina" : `Pregunta ${paso + 1} de ${total}`}</p>
        <button type="button" onClick={() => quiz.set(false)} className={`grid size-10 place-items-center rounded-full hover:bg-[#2D3524]/8 ${foco}`} aria-label="Cerrar test">
          <IconoCerrar />
        </button>
      </div>
      <div className="mt-3 flex gap-1.5" aria-hidden="true">
        {PREGUNTAS.map((p, i) => (
          <span key={p.id} className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${i < paso || resultado ? "bg-[#6F7A4E]" : i === paso ? "bg-[#B8C4A6]" : "bg-[#2D3524]/10"}`} />
        ))}
      </div>

      {pregunta && !resultado ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (resp[pregunta.id]) setPaso((p) => p + 1);
          }}
        >
          <fieldset className="mt-8">
            <legend id="hb-quiz-titulo" className={`${serif} text-3xl leading-tight sm:text-4xl`}>
              {pregunta.titulo}
            </legend>
            <div className={`mt-6 grid gap-3 ${pregunta.opciones.length === 4 ? "sm:grid-cols-2" : ""}`}>
              {pregunta.opciones.map((o) => {
                const on = resp[pregunta.id] === o.valor;
                return (
                  <label key={o.valor} className={`flex cursor-pointer items-center gap-4 rounded-2xl border bg-white p-4 transition-all has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-[#B8C4A6]/60 ${on ? "border-[#4A5634] ring-1 ring-[#4A5634]" : "border-[#2D3524]/15 hover:border-[#2D3524]/40"}`}>
                    <input type="radio" name={pregunta.id} value={o.valor} checked={on} onChange={() => elegir(o.valor)} className="sr-only" />
                    <span className={`grid size-6 shrink-0 place-items-center rounded-full border transition-colors ${on ? "border-[#4A5634] bg-[#4A5634] text-white" : "border-[#2D3524]/30"}`} aria-hidden="true">
                      {on ? <IconoCheck className="size-3.5" trazo={3} /> : null}
                    </span>
                    <span>
                      <span className="block font-semibold">{o.texto}</span>
                      <span className="block text-sm text-[#2D3524]/60">{o.ayuda}</span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
          <div className="mt-8 flex items-center justify-between gap-3">
            {paso > 0 ? (
              <button type="button" onClick={() => setPaso((p) => p - 1)} className={`inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold hover:bg-[#2D3524]/6 ${foco}`}>
                <IconoVolver className="size-4" /> Atrás
              </button>
            ) : (
              <span />
            )}
            <button type="submit" disabled={!resp[pregunta.id]} className={`min-h-12 rounded-full bg-[#4A5634] px-8 font-semibold text-[#F6F5EF] transition-all hover:bg-[#3A452A] disabled:opacity-40 ${foco}`}>
              {paso === total - 1 ? "Ver mi rutina" : "Siguiente"}
            </button>
          </div>
        </form>
      ) : null}

      {resultado ? (
        <div className="mt-6" aria-live="polite">
          <h2 id="hb-quiz-titulo" className={`${serif} text-3xl leading-tight sm:text-4xl`}>
            Te recomendamos la <em className="text-[#8E4F43]">{resultado.nombre}</em>
          </h2>
          <p className="mt-2 text-[#2D3524]/75">
            Porque {MOTIVO[resp.tarde ?? ""] ?? "así lo contaste"} y {MOTIVO[resp.objetivo ?? ""] ?? "buscás algo simple"}.
          </p>
          <div className="relative mt-5 aspect-[4/3] overflow-hidden rounded-3xl bg-[#E3E6D8]">
            <Image src={resultado.imagen} alt={resultado.alt} fill sizes="(min-width: 640px) 600px, 100vw" className="object-cover" />
          </div>
          <ol className="mt-5 space-y-2">
            {resultado.pasos.map((x, i) => {
              const p = porId[x.id];
              if (!p) return null;
              return (
                <li key={x.id} className="flex items-center gap-3 rounded-2xl bg-white p-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#ECEEE3] text-sm font-semibold">{i + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs text-[#2D3524]/55">{x.momento}</span>
                    <span className="block truncate font-medium">{p.nombre}</span>
                  </span>
                  <span className="text-sm tabular-nums">{pesos(p.precio)}</span>
                </li>
              );
            })}
          </ol>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p>
              <span className="text-sm text-[#2D3524]/60">Total de la rutina</span>
              <span className="block text-2xl font-semibold tabular-nums">{pesos(precioRutina(resultado))}</span>
            </p>
            <button
              type="button"
              onClick={() => {
                agregarRutina(resultado);
                setAgregado((a) => [...a, resultado.id]);
              }}
              className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-7 font-semibold transition-all active:scale-[0.98] ${foco} ${agregado.includes(resultado.id) ? "bg-[#B8C4A6]" : "bg-[#4A5634] text-[#F6F5EF] hover:bg-[#3A452A]"}`}
            >
              {agregado.includes(resultado.id) ? (
                <>
                  <IconoCheck className="size-5" trazo={2.2} /> Rutina en tu carrito
                </>
              ) : (
                "Agregar rutina al carrito"
              )}
            </button>
          </div>
          {resp.tiempo === "largo" ? (
            <Extra id={EXTRA[resultado.id]} agregado={agregado.includes("extra")} onAgregar={() => setAgregado((a) => [...a, "extra"])} />
          ) : null}
          <div className="mt-6 flex flex-wrap gap-3 border-t border-[#2D3524]/10 pt-5">
            <button
              type="button"
              onClick={() => {
                setPaso(0);
                setResp({});
                setAgregado([]);
              }}
              className={`rounded-full px-4 py-2.5 text-sm font-semibold hover:bg-[#2D3524]/6 ${foco}`}
            >
              Volver a empezar
            </button>
            {agregado.length ? (
              <button type="button" onClick={() => tienda.abrir("carrito")} className={`rounded-full border border-[#2D3524]/20 px-4 py-2.5 text-sm font-semibold hover:bg-white ${foco}`}>
                Ver carrito
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Extra({ id, agregado, onAgregar }: { id: string; agregado: boolean; onAgregar: () => void }) {
  const p = porId[id];
  if (!p) return null;
  return (
    <div className="mt-5 flex items-center gap-4 rounded-3xl border border-dashed border-[#2D3524]/25 p-4">
      <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl bg-[#E3E6D8]">
        <Image src={p.imagen} alt={p.alt} fill sizes="64px" className="object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-[#2D3524]/60">Como tenés más tiempo, sumá:</p>
        <p className="font-semibold">
          {p.nombre} · {pesos(p.precio)}
        </p>
      </div>
      <button
        type="button"
        onClick={() => {
          tienda.agregar(p.id, { nombre: p.nombre });
          onAgregar();
        }}
        disabled={agregado}
        className={`shrink-0 rounded-full bg-white px-4 py-2 text-sm font-semibold transition-colors hover:bg-[#4A5634] hover:text-[#F6F5EF] disabled:bg-[#B8C4A6] disabled:text-[#2D3524] ${foco}`}
      >
        {agregado ? "Sumado" : "Sumar"}
      </button>
    </div>
  );
}
