"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { useAviso, useStoredState } from "../shared/utils";
import { productoPorId, productorPorId, type CategoriaId, type Producto, type Productor, type ZonaId } from "./data";

type Carrito = Record<string, number>;

const esCarrito = (v: unknown): v is Carrito =>
  typeof v === "object" &&
  v !== null &&
  !Array.isArray(v) &&
  Object.entries(v).every(([k, n]) => k in productoPorId && typeof n === "number" && n > 0 && n < 100);

export type Grupo = {
  productor: Productor;
  items: { producto: Producto; cant: number; total: number }[];
  subtotal: number;
  envio: number;
  faltaGratis: number;
};

export function agrupar(carrito: Carrito): Grupo[] {
  const mapa = new Map<string, Grupo>();
  for (const [id, cant] of Object.entries(carrito)) {
    const producto = productoPorId[id];
    if (!producto) continue;
    const productor = productorPorId[producto.productorId];
    if (!productor) continue;
    let g = mapa.get(productor.id);
    if (!g) {
      g = { productor, items: [], subtotal: 0, envio: 0, faltaGratis: 0 };
      mapa.set(productor.id, g);
    }
    g.items.push({ producto, cant, total: cant * producto.precio });
    g.subtotal += cant * producto.precio;
  }
  return [...mapa.values()].map((g) => {
    const gratis = g.subtotal >= g.productor.envioGratisDesde;
    return { ...g, envio: gratis ? 0 : g.productor.envio, faltaGratis: gratis ? 0 : g.productor.envioGratisDesde - g.subtotal };
  });
}

type Ctx = {
  carrito: Carrito;
  cantidad: number;
  grupos: Grupo[];
  agregar: (id: string, n?: number) => void;
  cambiar: (id: string, n: number) => void;
  vaciar: () => void;
  carritoAbierto: boolean;
  setCarritoAbierto: (v: boolean) => void;
  checkoutAbierto: boolean;
  setCheckoutAbierto: (v: boolean) => void;
  tiendita: string | null;
  setTiendita: (id: string | null) => void;
  q: string;
  setQ: (q: string) => void;
  categoria: CategoriaId | "todas";
  setCategoria: (c: CategoriaId | "todas") => void;
  zona: ZonaId;
  setZona: (z: ZonaId) => void;
  aviso: { id: number; texto: string } | null;
  cerrarAviso: () => void;
  irA: (id: string) => void;
};

const MercadoCtx = createContext<Ctx | null>(null);

export function useMercado() {
  const c = useContext(MercadoCtx);
  if (!c) throw new Error("useMercado fuera de MercadoProvider");
  return c;
}

export function MercadoProvider({ children }: { children: ReactNode }) {
  const [carrito, setCarrito] = useStoredState<Carrito>("delvalle-carrito", {}, esCarrito);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [checkoutAbierto, setCheckoutAbierto] = useState(false);
  const [tiendita, setTiendita] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [categoria, setCategoria] = useState<CategoriaId | "todas">("todas");
  const [zona, setZona] = useState<ZonaId>("sierras-chicas");
  const { aviso, avisar, cerrar } = useAviso();

  const agregar = useCallback(
    (id: string, n = 1) => {
      const p = productoPorId[id];
      if (!p) return;
      setCarrito((c) => ({ ...c, [id]: Math.min(99, (c[id] ?? 0) + n) }));
      avisar(`Sumaste ${p.nombre} de ${productorPorId[p.productorId]?.nombre ?? ""} a tu pedido`);
    },
    [setCarrito, avisar],
  );

  const cambiar = useCallback(
    (id: string, n: number) => {
      setCarrito((c) => {
        const next = { ...c };
        if (n <= 0) delete next[id];
        else next[id] = Math.min(99, n);
        return next;
      });
    },
    [setCarrito],
  );

  const vaciar = useCallback(() => setCarrito({}), [setCarrito]);

  const irA = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const reducir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reducir ? "auto" : "smooth", block: "start" });
  }, []);

  const grupos = useMemo(() => agrupar(carrito), [carrito]);
  const cantidad = useMemo(() => Object.values(carrito).reduce((a, b) => a + b, 0), [carrito]);

  const value: Ctx = {
    carrito,
    cantidad,
    grupos,
    agregar,
    cambiar,
    vaciar,
    carritoAbierto,
    setCarritoAbierto,
    checkoutAbierto,
    setCheckoutAbierto,
    tiendita,
    setTiendita,
    q,
    setQ,
    categoria,
    setCategoria,
    zona,
    setZona,
    aviso,
    cerrarAviso: cerrar,
    irA,
  };

  return <MercadoCtx.Provider value={value}>{children}</MercadoCtx.Provider>;
}
