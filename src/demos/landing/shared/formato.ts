// Formato de números estable entre servidor y cliente (sin depender del ICU de cada entorno).

/** 1234567 → "1.234.567" */
export function miles(n: number): string {
  const entero = Math.round(Math.abs(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return n < 0 ? `−${entero}` : entero;
}

/** 32000 → "$32.000" */
export function precioARS(n: number): string {
  return `$${miles(n)}`;
}

/** Espera simulada para los formularios de demo. */
export function esperar(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}
