"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { pesos, useAviso, useStoredState } from "../shared/utils";
import { avisos as avisosBase, type Aviso, type CategoriaId, type Estado } from "./data";

export type Filtros = {
  q: string;
  categoria: CategoriaId | null;
  estados: Estado[];
  min: string;
  max: string;
  barrio: string;
  orden: "recientes" | "menor" | "mayor";
  soloFavs: boolean;
};

export const filtrosIniciales: Filtros = { q: "", categoria: null, estados: [], min: "", max: "", barrio: "", orden: "recientes", soloFavs: false };

export type Mensaje = { id: number; de: "yo" | "vendedor"; texto: string; hora: string; oferta?: number };

const esListaTexto = (v: unknown): v is string[] => Array.isArray(v) && v.every((x) => typeof x === "string");
const esListaAvisos = (v: unknown): v is Aviso[] =>
  Array.isArray(v) && v.every((x) => typeof x === "object" && x !== null && "id" in x && "titulo" in x && "precio" in x && "imagenes" in x);

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function hora() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function redondear(n: number) {
  return Math.round(n / 1000) * 1000;
}

/** Respuestas guionadas del vendedor, según lo que escribas. */
function respuesta(a: Aviso, texto: string, oferta?: number): string {
  const nombre = a.vendedor.nombre.split(" ")[0];
  if (oferta !== undefined) {
    if (!a.aceptaOfertas) return `Gracias por la oferta, pero el precio es fijo: ${pesos(a.precio)}. Si te sirve, lo reservo para vos.`;
    if (oferta >= a.precio * 0.9) return `¡Trato hecho! Te lo dejo en ${pesos(oferta)}. ¿Cuándo podés pasar a buscarlo por ${a.barrio}?`;
    if (oferta >= a.precio * 0.75) return `Es un poco bajo… ¿te parece ${pesos(redondear(a.precio * 0.92))}? Y te lo guardo hasta el sábado.`;
    return `Te agradezco, pero es muy poco. Lo mínimo que podría aceptar es ${pesos(redondear(a.precio * 0.85))}.`;
  }
  const t = norm(texto);
  if (/disponible|sigue|todavia|hay/.test(t)) return `¡Hola! Sí, sigue disponible. Soy ${nombre}, cualquier duda preguntame.`;
  if (/envio|envi|mand|moto|correo/.test(t)) return "Puedo mandarlo por moto dentro de Córdoba, el envío lo pagás vos. O lo retirás sin cargo.";
  if (/donde|ver|probar|retir|pasar|direccion/.test(t)) return `Estoy en ${a.barrio}. Podés venir a verlo de lunes a viernes de 18 a 20 h.`;
  if (/precio|rebaj|ultimo|descuento|menos|efectivo/.test(t))
    return a.aceptaOfertas ? `Si lo retirás esta semana y pagás en efectivo, te lo dejo en ${pesos(redondear(a.precio * 0.93))}.` : "El precio es fijo, pero te incluyo todo lo que dice el aviso.";
  if (/foto|medida|detalle|estado|uso/.test(t)) return `Está ${a.estado === "como-nuevo" ? "como nuevo" : a.estado === "muy-bueno" ? "muy bien, con poco uso" : "bien, con los detalles que puse en el aviso"}. Si querés te mando más fotos.`;
  if (/gracias|genial|dale|perfecto|buenisimo/.test(t)) return "¡De nada! Avisame y coordinamos.";
  return "¡Hola! Dale, contame qué necesitás saber y coordinamos para que lo veas.";
}

type Ctx = {
  avisos: Aviso[];
  lista: Aviso[];
  filtros: Filtros;
  setFiltro: <K extends keyof Filtros>(k: K, v: Filtros[K]) => void;
  limpiar: () => void;
  favs: string[];
  toggleFav: (id: string) => void;
  detalle: string | null;
  setDetalle: (id: string | null) => void;
  ofertaPara: string | null;
  setOfertaPara: (id: string | null) => void;
  chatCon: string | null;
  setChatCon: (id: string | null) => void;
  chats: Record<string, Mensaje[]>;
  escribiendo: string | null;
  enviar: (avisoId: string, texto: string, oferta?: number) => void;
  publicar: (a: Aviso) => void;
  aviso: { id: number; texto: string } | null;
  avisar: (t: string) => void;
  irA: (id: string) => void;
};

const UsadosCtx = createContext<Ctx | null>(null);

export function useUsados() {
  const c = useContext(UsadosCtx);
  if (!c) throw new Error("useUsados fuera de UsadosProvider");
  return c;
}

export function UsadosProvider({ children }: { children: ReactNode }) {
  const [favs, setFavs] = useStoredState<string[]>("segundavuelta-favoritos", [], esListaTexto);
  const [mios, setMios] = useStoredState<Aviso[]>("segundavuelta-mis-avisos", [], esListaAvisos);
  const [filtros, setFiltros] = useState<Filtros>(filtrosIniciales);
  const [detalle, setDetalle] = useState<string | null>(null);
  const [ofertaPara, setOfertaPara] = useState<string | null>(null);
  const [chatCon, setChatCon] = useState<string | null>(null);
  const [chats, setChats] = useState<Record<string, Mensaje[]>>({});
  const [escribiendo, setEscribiendo] = useState<string | null>(null);
  const { aviso, avisar } = useAviso(2600);
  const idMsg = useRef(0);

  const avisos = useMemo(() => [...mios, ...avisosBase], [mios]);

  const lista = useMemo(() => {
    const t = norm(filtros.q.trim());
    const min = Number(filtros.min) || 0;
    const max = Number(filtros.max) || Infinity;
    const r = avisos.filter((a) => {
      if (filtros.categoria && a.categoria !== filtros.categoria) return false;
      if (filtros.estados.length && !filtros.estados.includes(a.estado)) return false;
      if (a.precio < min || a.precio > max) return false;
      if (filtros.barrio && a.barrio !== filtros.barrio) return false;
      if (filtros.soloFavs && !favs.includes(a.id)) return false;
      if (t && !norm(`${a.titulo} ${a.descripcion}`).includes(t)) return false;
      return true;
    });
    if (filtros.orden === "menor") r.sort((a, b) => a.precio - b.precio);
    else if (filtros.orden === "mayor") r.sort((a, b) => b.precio - a.precio);
    else r.sort((a, b) => a.minutos - b.minutos);
    return r;
  }, [avisos, filtros, favs]);

  const setFiltro = useCallback(<K extends keyof Filtros>(k: K, v: Filtros[K]) => setFiltros((f) => ({ ...f, [k]: v })), []);
  const limpiar = useCallback(() => setFiltros(filtrosIniciales), []);

  const toggleFav = useCallback(
    (id: string) => {
      const a = avisos.find((x) => x.id === id);
      const esta = favs.includes(id);
      setFavs(esta ? favs.filter((x) => x !== id) : [...favs, id]);
      avisar(esta ? `Quitaste “${a?.titulo ?? "el aviso"}” de favoritos` : `Guardaste “${a?.titulo ?? "el aviso"}” en favoritos`);
    },
    [avisos, favs, setFavs, avisar],
  );

  const enviar = useCallback(
    (avisoId: string, texto: string, oferta?: number) => {
      const a = avisos.find((x) => x.id === avisoId);
      if (!a) return;
      const mio: Mensaje = { id: ++idMsg.current, de: "yo", texto, hora: hora(), oferta };
      setChats((c) => ({ ...c, [avisoId]: [...(c[avisoId] ?? []), mio] }));
      if (a.propio) return;
      window.setTimeout(() => setEscribiendo(avisoId), 500);
      window.setTimeout(() => {
        setEscribiendo((e) => (e === avisoId ? null : e));
        const r: Mensaje = { id: ++idMsg.current, de: "vendedor", texto: respuesta(a, texto, oferta), hora: hora() };
        setChats((c) => ({ ...c, [avisoId]: [...(c[avisoId] ?? []), r] }));
      }, 1900);
    },
    [avisos],
  );

  const publicar = useCallback((a: Aviso) => setMios((m) => [a, ...m].slice(0, 6)), [setMios]);

  const irA = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const reducir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reducir ? "auto" : "smooth", block: "start" });
  }, []);

  const value: Ctx = {
    avisos,
    lista,
    filtros,
    setFiltro,
    limpiar,
    favs,
    toggleFav,
    detalle,
    setDetalle,
    ofertaPara,
    setOfertaPara,
    chatCon,
    setChatCon,
    chats,
    escribiendo,
    enviar,
    publicar,
    aviso,
    avisar,
    irA,
  };

  return <UsadosCtx.Provider value={value}>{children}</UsadosCtx.Provider>;
}
