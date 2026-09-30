import { hash, rng, suma, variacion, type Periodo } from "../shared/datos";
import { DIAS, DIAS_LARGO, HOY, MESES, MESES_LARGO, partes, sumarDias } from "../shared/formato";

/** Datos ficticios de "Tienda Almacén Norte". Todo determinista. */

type Dia = { t: number; pedidos: number; ventas: number; visitas: number };

const TOTAL_DIAS = 800;
const ESTACION = [0.86, 0.88, 0.97, 0.98, 1.0, 1.02, 1.06, 1.0, 0.99, 1.03, 1.1, 1.28];
const SEMANA = [0.84, 1.06, 1.0, 0.98, 1.03, 1.14, 0.95];

const HISTORIA: Dia[] = (() => {
  const r = rng(20260929);
  const out: Dia[] = [];
  for (let d = 0; d < TOTAL_DIAS; d++) {
    const t = sumarDias(HOY, d - (TOTAL_DIAS - 1));
    const p = partes(t);
    const avance = d / (TOTAL_DIAS - 1);
    const tendencia = 1 + 0.42 * avance;
    const precio = 1 + 0.55 * avance;
    const ruido = 1 + 0.09 * r.normal();
    const pedidos = Math.max(8, Math.round(58 * tendencia * SEMANA[p.semana]! * ESTACION[p.mes]! * ruido));
    const ticket = 31_800 * precio * (1 + 0.045 * r.normal());
    const conv = 0.0215 + 0.004 * avance + 0.0018 * r.normal() + (p.semana === 5 ? 0.002 : 0);
    out.push({ t, pedidos, ventas: pedidos * ticket, visitas: Math.round(pedidos / Math.max(0.012, conv)) });
  }
  return out;
})();

type Punto = { t: number; pedidos: number; ventas: number; visitas: number; eje: string; etiqueta: string };

function agrupar(dias: Dia[], modo: "dia" | "mes", corto: boolean): Punto[] {
  if (modo === "dia") {
    return dias.map((d) => {
      const p = partes(d.t);
      return {
        ...d,
        eje: corto ? `${DIAS[p.semana]} ${p.dia}` : `${p.dia} ${MESES[p.mes]}`,
        etiqueta: `${DIAS_LARGO[p.semana]} ${p.dia} de ${MESES_LARGO[p.mes]}`,
      };
    });
  }
  const mapa = new Map<string, Punto>();
  for (const d of dias) {
    const p = partes(d.t);
    const k = `${p.anio}-${p.mes}`;
    const m = mapa.get(k);
    if (m) {
      m.pedidos += d.pedidos;
      m.ventas += d.ventas;
      m.visitas += d.visitas;
    } else {
      mapa.set(k, {
        ...d,
        eje: p.mes === 0 ? `${MESES[p.mes]} ${String(p.anio).slice(2)}` : MESES[p.mes]!,
        etiqueta: `${MESES_LARGO[p.mes]} ${p.anio}`,
      });
    }
  }
  return [...mapa.values()];
}

function rangos(periodo: Periodo) {
  const n = HISTORIA.length;
  if (periodo === "12m") {
    // De octubre del año pasado a septiembre de este año (septiembre, hasta hoy).
    const inicioActual = HISTORIA.findIndex((d) => {
      const p = partes(d.t);
      return p.anio === 2025 && p.mes === 9 && p.dia === 1;
    });
    const inicioAnterior = HISTORIA.findIndex((d) => {
      const p = partes(d.t);
      return p.anio === 2024 && p.mes === 9 && p.dia === 1;
    });
    const finAnterior = HISTORIA.findIndex((d) => {
      const p = partes(d.t);
      return p.anio === 2025 && p.mes === 8 && p.dia === 29;
    });
    return {
      actual: agrupar(HISTORIA.slice(inicioActual), "mes", false),
      anterior: agrupar(HISTORIA.slice(inicioAnterior, finAnterior + 1), "mes", false),
    };
  }
  const k = periodo === "7d" ? 7 : 30;
  return {
    actual: agrupar(HISTORIA.slice(n - k), "dia", periodo === "7d"),
    anterior: agrupar(HISTORIA.slice(n - 2 * k, n - k), "dia", periodo === "7d"),
  };
}

export const CATEGORIAS = [
  { id: "almacen", nombre: "Almacén", base: 0.31 },
  { id: "bebidas", nombre: "Bebidas", base: 0.19 },
  { id: "frescos", nombre: "Frescos y lácteos", base: 0.17 },
  { id: "desayuno", nombre: "Desayuno y merienda", base: 0.13 },
  { id: "limpieza", nombre: "Limpieza", base: 0.12 },
  { id: "congelados", nombre: "Congelados", base: 0.08 },
] as const;

const PRODUCTOS = [
  { id: "yerba", nombre: "Yerba mate Sierra Chica 1 kg", cat: "Almacén", precio: 6_950, peso: 1.0 },
  { id: "aceite", nombre: "Aceite de girasol La Posta 1,5 L", cat: "Almacén", precio: 5_400, peso: 0.82 },
  { id: "cafe", nombre: "Café molido Tostadero Norte 500 g", cat: "Desayuno y merienda", precio: 11_900, peso: 0.52 },
  { id: "queso", nombre: "Queso cremoso Tambo Viejo 1 kg", cat: "Frescos y lácteos", precio: 14_800, peso: 0.44 },
  { id: "dulce", nombre: "Dulce de leche Tambo Viejo 400 g", cat: "Desayuno y merienda", precio: 3_650, peso: 0.95 },
  { id: "vino", nombre: "Malbec Finca Los Álamos 750 ml", cat: "Bebidas", precio: 9_200, peso: 0.48 },
  { id: "fideos", nombre: "Fideos secos Don Aldo 500 g", cat: "Almacén", precio: 1_980, peso: 1.35 },
  { id: "detergente", nombre: "Detergente Brillo Sur 750 ml", cat: "Limpieza", precio: 3_100, peso: 0.7 },
] as const;

export const CANALES = [
  { id: "organico", nombre: "Búsqueda orgánica", base: 0.34 },
  { id: "directo", nombre: "Directo", base: 0.24 },
  { id: "redes", nombre: "Redes sociales", base: 0.19 },
  { id: "email", nombre: "Email y newsletter", base: 0.13 },
  { id: "anuncios", nombre: "Anuncios pagos", base: 0.1 },
] as const;

function repartir<T extends { id: string; base: number }>(items: readonly T[], semilla: string, dispersion: number) {
  const r = rng(hash(semilla));
  const pesos = items.map((it) => it.base * (1 + dispersion * r.normal()));
  const total = suma(pesos);
  return pesos.map((p) => p / total);
}

export type Resumen = ReturnType<typeof resumen>;

export function resumen(periodo: Periodo) {
  const { actual, anterior } = rangos(periodo);
  const ventas = suma(actual.map((d) => d.ventas));
  const pedidos = suma(actual.map((d) => d.pedidos));
  const visitas = suma(actual.map((d) => d.visitas));
  const ventasAnt = suma(anterior.map((d) => d.ventas));
  const pedidosAnt = suma(anterior.map((d) => d.pedidos));
  const visitasAnt = suma(anterior.map((d) => d.visitas));

  const conv = pedidos / visitas;
  const convAnt = pedidosAnt / visitasAnt;

  const kpis = {
    ventas: { valor: ventas, var: variacion(ventas, ventasAnt), serie: actual.map((d) => d.ventas) },
    pedidos: { valor: pedidos, var: variacion(pedidos, pedidosAnt), serie: actual.map((d) => d.pedidos) },
    ticket: {
      valor: ventas / pedidos,
      var: variacion(ventas / pedidos, ventasAnt / pedidosAnt),
      serie: actual.map((d) => d.ventas / d.pedidos),
    },
    conversion: { valor: conv, var: conv - convAnt, serie: actual.map((d) => d.pedidos / d.visitas) },
  };

  const shareCat = repartir(CATEGORIAS, `cat-${periodo}`, 0.06);
  const shareCatAnt = repartir(CATEGORIAS, `cat-ant-${periodo}`, 0.06);
  const categorias = CATEGORIAS.map((c, i) => ({
    ...c,
    valor: ventas * shareCat[i]!,
    var: variacion(ventas * shareCat[i]!, ventasAnt * shareCatAnt[i]!),
  })).sort((a, b) => b.valor - a.valor);

  const rp = rng(hash(`prod-${periodo}`));
  const unidadesBase = pedidos * 0.19;
  const productos = PRODUCTOS.map((p) => {
    const unidades = Math.round(unidadesBase * p.peso * (1 + 0.14 * rp.normal()));
    const precio = p.precio * (periodo === "12m" ? 0.86 : 1);
    return {
      ...p,
      unidades,
      ingresos: unidades * precio,
      var: 0.11 * rp.normal() + (periodo === "12m" ? 0.2 : 0.03),
    };
  })
    .sort((a, b) => b.ingresos - a.ingresos)
    .slice(0, 6);

  // Embudo: de visitas a compras.
  const rf = rng(hash(`embudo-${periodo}`));
  const vieron = visitas * (0.56 + 0.02 * rf.normal());
  const carrito = vieron * (0.235 + 0.01 * rf.normal());
  const checkout = carrito * (0.48 + 0.02 * rf.normal());
  const embudo = [
    { id: "visitas", nombre: "Visitas", valor: visitas },
    { id: "producto", nombre: "Vieron un producto", valor: vieron },
    { id: "carrito", nombre: "Agregaron al carrito", valor: carrito },
    { id: "checkout", nombre: "Iniciaron la compra", valor: checkout },
    { id: "compra", nombre: "Compraron", valor: pedidos },
  ];

  const shareCanal = repartir(CANALES, `canal-${periodo}`, 0.08);
  const shareCanalAnt = repartir(CANALES, `canal-ant-${periodo}`, 0.08);
  const canales = CANALES.map((c, i) => ({
    ...c,
    share: shareCanal[i]!,
    valor: ventas * shareCanal[i]!,
    varPp: shareCanal[i]! - shareCanalAnt[i]!,
  }));

  return {
    periodo,
    puntos: actual,
    anterior,
    kpis,
    categorias,
    productos,
    embudo,
    canales,
  };
}

export type EstadoPedido = "entregado" | "en-camino" | "preparando" | "cancelado";

export const PEDIDOS_RECIENTES: {
  id: string;
  cliente: string;
  items: number;
  total: number;
  hace: string;
  estado: EstadoPedido;
}[] = [
  { id: "AN-10482", cliente: "Carla Benítez", items: 7, total: 48_350, hace: "hace 6 min", estado: "preparando" },
  { id: "AN-10481", cliente: "Martín Oviedo", items: 3, total: 21_900, hace: "hace 18 min", estado: "preparando" },
  { id: "AN-10480", cliente: "Julieta Sosa", items: 12, total: 96_420, hace: "hace 42 min", estado: "en-camino" },
  { id: "AN-10479", cliente: "Diego Paredes", items: 5, total: 33_780, hace: "hace 1 h", estado: "en-camino" },
  { id: "AN-10478", cliente: "Rocío Aguirre", items: 2, total: 12_600, hace: "hace 2 h", estado: "cancelado" },
  { id: "AN-10477", cliente: "Nicolás Funes", items: 9, total: 71_050, hace: "hace 3 h", estado: "entregado" },
  { id: "AN-10476", cliente: "Valeria Luna", items: 4, total: 27_480, hace: "hace 4 h", estado: "entregado" },
];
