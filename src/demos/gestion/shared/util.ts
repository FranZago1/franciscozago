"use client";

import { useCallback, useState } from "react";

const DAY = 86_400_000;

export const ars = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
export const num = new Intl.NumberFormat("es-AR");

export function pesos(n: number) {
  return ars.format(Math.round(n)).replace(/ /g, " ");
}

export function usd(n: number) {
  return `US$ ${num.format(Math.round(n))}`;
}

/** US$ 1,2 M · US$ 845 k */
export function usdCorto(n: number) {
  if (n >= 1_000_000) return `US$ ${(n / 1_000_000).toLocaleString("es-AR", { maximumFractionDigits: 2 })} M`;
  if (n >= 1_000) return `US$ ${Math.round(n / 1_000).toLocaleString("es-AR")} k`;
  return `US$ ${num.format(n)}`;
}

export function pesosCorto(n: number) {
  if (n >= 1_000_000) return `$ ${(n / 1_000_000).toLocaleString("es-AR", { maximumFractionDigits: 1 })} M`;
  if (n >= 10_000) return `$ ${Math.round(n / 1_000).toLocaleString("es-AR")} k`;
  return pesos(n);
}

export function startOfDay(ms: number) {
  const d = new Date(ms);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function diaDiff(iso: string, now: number) {
  return Math.round((startOfDay(Date.parse(iso)) - startOfDay(now)) / DAY);
}

export function hora(iso: string) {
  return new Date(iso).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false });
}

export function fechaCorta(iso: string) {
  return new Date(iso)
    .toLocaleDateString("es-AR", { day: "numeric", month: "short" })
    .replace(".", "");
}

/** "Hoy", "Ayer", "Mañana", "jue 12 sep" */
export function diaRelativo(iso: string, now: number) {
  const d = diaDiff(iso, now);
  if (d === 0) return "Hoy";
  if (d === -1) return "Ayer";
  if (d === 1) return "Mañana";
  return new Date(iso)
    .toLocaleDateString("es-AR", { weekday: "short", day: "numeric", month: "short" })
    .replace(/\./g, "")
    .replace(",", "");
}

/** "hace 3 días", "en 2 días", "hoy" */
export function haceDias(iso: string, now: number) {
  const d = diaDiff(iso, now);
  if (d === 0) return "hoy";
  if (d === -1) return "ayer";
  if (d === 1) return "mañana";
  if (d < 0) return `hace ${-d} días`;
  return `en ${d} días`;
}

/** Fecha local "YYYY-MM-DD" para inputs type=date. */
export function inputFecha(ms: number) {
  const d = new Date(ms);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function inputHora(ms: number) {
  const d = new Date(ms);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getHours())}:${p(d.getMinutes())}`;
}

/** Combina fecha y hora locales de inputs en ISO. */
export function isoDe(fecha: string, horaTxt: string) {
  const [y, m, d] = fecha.split("-").map(Number);
  const [h, mi] = (horaTxt || "09:00").split(":").map(Number);
  return new Date(y ?? 2026, (m ?? 1) - 1, d ?? 1, h ?? 9, mi ?? 0).toISOString();
}

export function normalizar(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export function iniciales(nombre: string) {
  return nombre
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}

export type Dir = "asc" | "desc";

export function useSort<K extends string>(inicial: K, dirInicial: Dir = "asc") {
  const [sort, setSort] = useState<{ key: K; dir: Dir }>({ key: inicial, dir: dirInicial });
  const toggle = useCallback(
    (key: K) =>
      setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" })),
    [],
  );
  const aria = useCallback(
    (key: K): "ascending" | "descending" | "none" =>
      sort.key === key ? (sort.dir === "asc" ? "ascending" : "descending") : "none",
    [sort],
  );
  return { ...sort, setSort, toggle, aria };
}

export function ordenar<T>(xs: T[], get: (x: T) => string | number, dir: Dir) {
  const f = dir === "asc" ? 1 : -1;
  return [...xs].sort((a, b) => {
    const va = get(a);
    const vb = get(b);
    if (typeof va === "number" && typeof vb === "number") return (va - vb) * f;
    return String(va).localeCompare(String(vb), "es") * f;
  });
}
