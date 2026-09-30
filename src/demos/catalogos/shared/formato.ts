const fmt = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });

/** Precio en pesos con separador de miles: "$ 18.500". */
export function ars(n: number): string {
  return `$ ${fmt.format(Math.round(n))}`;
}

export function numero(n: number): string {
  return fmt.format(n);
}

export function plural(n: number, uno: string, varios: string): string {
  return `${n} ${n === 1 ? uno : varios}`;
}

/** Normaliza para búsquedas: minúsculas y sin tildes. */
export function normalizar(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

export function fechaHoy(): string {
  return new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date());
}

/** Copia texto al portapapeles con un fallback para navegadores sin Clipboard API. */
export async function copiarTexto(texto: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(texto);
      return true;
    }
  } catch {
    // sigue con el fallback
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = texto;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}
