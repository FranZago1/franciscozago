"use client";

import { useSyncExternalStore } from "react";

/**
 * Estado de una tienda demo (carrito + capas de UI), sin contexto ni librerías:
 * un store chico por demo, leído con useSyncExternalStore desde cualquier isla cliente.
 * El carrito se guarda en localStorage (envuelto en try/catch: modo privado, cuota llena, etc.).
 */

export type Linea = {
  /** Clave única de la línea: producto + variante (ej. talle). */
  clave: string;
  id: string;
  variante?: string;
  cantidad: number;
};

export type Capa = "carrito" | "checkout" | null;

export type EstadoTienda = {
  lineas: Linea[];
  capa: Capa;
  /** Producto abierto en el detalle. */
  detalle: string | null;
  /** Último aviso para el lector de pantalla y el toast. `n` cambia en cada aviso. */
  aviso: { texto: string; n: number } | null;
};

const MAX_CANTIDAD = 10;

export function crearTienda(clave: string, idsValidos: readonly string[]) {
  const validos = new Set(idsValidos);
  const vacio: EstadoTienda = { lineas: [], capa: null, detalle: null, aviso: null };
  let estado: EstadoTienda = vacio;
  let cargado = false;
  const subs = new Set<() => void>();

  const emitir = () => subs.forEach((f) => f());

  function leerGuardado(): Linea[] {
    try {
      const raw = window.localStorage.getItem(clave);
      if (!raw) return [];
      const datos: unknown = JSON.parse(raw);
      if (!Array.isArray(datos)) return [];
      return datos.filter(
        (l): l is Linea =>
          typeof l === "object" &&
          l !== null &&
          typeof (l as Linea).clave === "string" &&
          typeof (l as Linea).id === "string" &&
          validos.has((l as Linea).id) &&
          Number.isInteger((l as Linea).cantidad) &&
          (l as Linea).cantidad > 0,
      );
    } catch {
      return [];
    }
  }

  function cargar() {
    if (cargado || typeof window === "undefined") return;
    cargado = true;
    const lineas = leerGuardado();
    if (lineas.length) estado = { ...estado, lineas };
  }

  function guardar() {
    try {
      window.localStorage.setItem(clave, JSON.stringify(estado.lineas));
    } catch {
      // Sin almacenamiento disponible: el carrito sigue funcionando en memoria.
    }
  }

  function set(parcial: Partial<EstadoTienda>, persistir = false) {
    estado = { ...estado, ...parcial };
    if (persistir) guardar();
    emitir();
  }

  function onStorage(e: StorageEvent) {
    if (e.key !== clave) return;
    estado = { ...estado, lineas: leerGuardado() };
    emitir();
  }

  function subscribe(f: () => void) {
    cargar();
    if (subs.size === 0 && typeof window !== "undefined") window.addEventListener("storage", onStorage);
    subs.add(f);
    return () => {
      subs.delete(f);
      if (subs.size === 0 && typeof window !== "undefined") window.removeEventListener("storage", onStorage);
    };
  }

  const getSnapshot = () => {
    cargar();
    return estado;
  };
  const getServerSnapshot = () => vacio;

  let nAviso = 0;
  const avisar = (texto: string) => set({ aviso: { texto, n: ++nAviso } });

  const acciones = {
    agregar(id: string, { variante, cantidad = 1, nombre }: { variante?: string; cantidad?: number; nombre?: string } = {}) {
      const claveLinea = variante ? `${id}::${variante}` : id;
      const existe = estado.lineas.find((l) => l.clave === claveLinea);
      const lineas = existe
        ? estado.lineas.map((l) => (l.clave === claveLinea ? { ...l, cantidad: Math.min(MAX_CANTIDAD, l.cantidad + cantidad) } : l))
        : [...estado.lineas, { clave: claveLinea, id, variante, cantidad: Math.min(MAX_CANTIDAD, cantidad) }];
      set({ lineas }, true);
      avisar(`Agregado al carrito${nombre ? `: ${nombre}${variante ? `, ${variante}` : ""}` : ""}.`);
    },
    /** Agrega varios productos de una vez (ej. una rutina armada). */
    agregarVarios(ids: string[], texto: string) {
      let lineas = estado.lineas;
      for (const id of ids) {
        const existe = lineas.find((l) => l.clave === id);
        lineas = existe
          ? lineas.map((l) => (l.clave === id ? { ...l, cantidad: Math.min(MAX_CANTIDAD, l.cantidad + 1) } : l))
          : [...lineas, { clave: id, id, cantidad: 1 }];
      }
      set({ lineas }, true);
      avisar(texto);
    },
    cambiarCantidad(claveLinea: string, cantidad: number) {
      const c = Math.max(0, Math.min(MAX_CANTIDAD, Math.round(cantidad)));
      const lineas =
        c === 0 ? estado.lineas.filter((l) => l.clave !== claveLinea) : estado.lineas.map((l) => (l.clave === claveLinea ? { ...l, cantidad: c } : l));
      set({ lineas }, true);
    },
    quitar(claveLinea: string, nombre?: string) {
      set({ lineas: estado.lineas.filter((l) => l.clave !== claveLinea) }, true);
      avisar(nombre ? `Quitaste ${nombre} del carrito.` : "Producto quitado del carrito.");
    },
    vaciar() {
      set({ lineas: [] }, true);
    },
    /** Abre el carrito o el checkout (y cierra el detalle si estaba abierto). */
    abrir(capa: Capa) {
      set(capa ? { capa, detalle: null } : { capa });
    },
    verDetalle(id: string | null) {
      set({ detalle: id });
    },
    avisar,
  };

  function useTienda<T>(selector: (e: EstadoTienda) => T): T {
    return useSyncExternalStore(
      subscribe,
      () => selector(getSnapshot()),
      () => selector(getServerSnapshot()),
    );
  }

  return { ...acciones, useTienda, maxCantidad: MAX_CANTIDAD };
}

export type Tienda = ReturnType<typeof crearTienda>;

/** Cantidad total de unidades en el carrito. */
export const unidades = (e: EstadoTienda) => e.lineas.reduce((n, l) => n + l.cantidad, 0);
