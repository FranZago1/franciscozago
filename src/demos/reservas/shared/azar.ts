/**
 * Azar determinista: la misma semilla da siempre el mismo resultado.
 * Sirve para que la "agenda ocupada" sea estable para cada fecha, en cualquier navegador.
 */

/** Hash de 32 bits (FNV-1a con mezcla final). */
export function hash(texto: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  return h >>> 0;
}

/** Generador mulberry32: devuelve una función que da números en [0, 1). */
export function generador(semilla: string): () => number {
  let s = hash(semilla);
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Número en [0, 1) para una semilla puntual. */
export function azar(semilla: string): number {
  return generador(semilla)();
}

/** Código de reserva legible (sin 0/O ni 1/I). Solo en el cliente, en un evento. */
export function codigoReserva(prefijo: string): string {
  const alfabeto = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(5);
  crypto.getRandomValues(bytes);
  return `${prefijo}-${Array.from(bytes, (b) => alfabeto[b % alfabeto.length]).join("")}`;
}
