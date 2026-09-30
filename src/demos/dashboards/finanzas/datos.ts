import { hash, rng, suma, variacion, type Periodo } from "../shared/datos";
import { DIAS, DIAS_LARGO, HOY, MESES, MESES_LARGO, partes, sumarDias } from "../shared/formato";

/** Datos ficticios de "Taller Ceibo", taller de muebles a medida. Todo determinista. */

export type Tipo = "ingreso" | "egreso";
export type CategoriaId = "materiales" | "sueldos" | "alquiler" | "impuestos" | "fletes" | "otros" | "ventas" | "senas";

export const CATEGORIAS_GASTO: { id: CategoriaId; nombre: string }[] = [
  { id: "materiales", nombre: "Materiales" },
  { id: "sueldos", nombre: "Sueldos y cargas" },
  { id: "alquiler", nombre: "Alquiler y servicios" },
  { id: "impuestos", nombre: "Impuestos" },
  { id: "fletes", nombre: "Fletes y logística" },
  { id: "otros", nombre: "Otros" },
];

export const NOMBRE_CATEGORIA: Record<CategoriaId, string> = {
  materiales: "Materiales",
  sueldos: "Sueldos y cargas",
  alquiler: "Alquiler y servicios",
  impuestos: "Impuestos",
  fletes: "Fletes y logística",
  otros: "Otros",
  ventas: "Ventas",
  senas: "Señas",
};

export type Movimiento = {
  id: string;
  t: number;
  concepto: string;
  contraparte: string;
  categoria: CategoriaId;
  tipo: Tipo;
  monto: number;
  medio: "Transferencia" | "Cheque" | "Efectivo" | "Débito automático" | "Tarjeta";
};

const CLIENTES = [
  "Estudio Arenales",
  "Hotel Paso Serrano",
  "Café La Glorieta",
  "Familia Quiroga",
  "Mueblería Los Robles",
  "Oficinas Nodo 9",
  "Colegio San Aurelio",
  "Paula Medina",
  "Restó Tres Hojas",
  "Joaquín Ledesma",
];
const PROVEEDORES_MADERA = ["Aserradero El Quebracho", "Maderera Río Cuarto Sur", "Tableros del Centro"];
const PROVEEDORES_VARIOS = ["Herrajes Bulonera Sur", "Pinturería Colores del Norte", "Ferretería Industrial Alem"];
const FLETES = ["Fletes Don Tito", "Logística Cruz del Eje"];
const TRABAJOS = [
  "Mesa de comedor en paraíso",
  "Placard a medida",
  "Barra y banquetas",
  "Bibliotecas para sala de profesores",
  "Escritorios para oficina",
  "Cabeceros para 12 habitaciones",
  "Cocina integral en melamina",
  "Deck y bancos exteriores",
  "Mostrador de atención",
  "Sillas de guatambú",
];

const TOTAL_DIAS = 800;

const MOVIMIENTOS: Movimiento[] = (() => {
  const r = rng(1917);
  const out: Movimiento[] = [];
  let n = 0;
  const hechos = new Set<string>();
  const unaVez = (clave: string) => {
    if (hechos.has(clave)) return false;
    hechos.add(clave);
    return true;
  };
  const push = (m: Omit<Movimiento, "id">) => {
    n++;
    out.push({ ...m, monto: Math.round(m.monto / 100) * 100, id: `MV-${String(n).padStart(5, "0")}` });
  };
  for (let d = 0; d < TOTAL_DIAS; d++) {
    const t = sumarDias(HOY, d - (TOTAL_DIAS - 1));
    const p = partes(t);
    const avance = d / (TOTAL_DIAS - 1);
    const precio = 1 + 0.62 * avance;
    const habil = p.semana !== 0 && p.semana !== 6;
    if (!habil) continue;

    // Cobros: 1 o 2 por día hábil, a veces ninguno.
    const cobros = r.next() < 0.05 ? 0 : r.next() < 0.55 ? 1 : 2;
    for (let i = 0; i < cobros; i++) {
      const sena = r.next() < 0.35;
      push({
        t,
        concepto: `${sena ? "Seña" : "Saldo"} · ${r.elegir(TRABAJOS)}`,
        contraparte: r.elegir(CLIENTES),
        categoria: sena ? "senas" : "ventas",
        tipo: "ingreso",
        monto: (sena ? 520_000 : 1_030_000) * precio * (0.72 + r.next() * 0.56),
        medio: r.next() < 0.8 ? "Transferencia" : "Cheque",
      });
    }
    // Materiales: compras frecuentes.
    if (r.next() < 0.55) {
      const madera = r.next() < 0.6;
      push({
        t,
        concepto: madera ? r.elegir(["Tablas de paraíso", "Placas de MDF 18 mm", "Tirantes de pino", "Placas de melamina"]) : r.elegir(["Herrajes y bisagras", "Barnices y lacas", "Tornillería", "Lijas y abrasivos"]),
        contraparte: madera ? r.elegir(PROVEEDORES_MADERA) : r.elegir(PROVEEDORES_VARIOS),
        categoria: "materiales",
        tipo: "egreso",
        monto: (madera ? 640_000 : 210_000) * precio * (0.5 + r.next()),
        medio: r.next() < 0.7 ? "Transferencia" : "Cheque",
      });
    }
    if (r.next() < 0.22) {
      push({
        t,
        concepto: "Entrega a domicilio",
        contraparte: r.elegir(FLETES),
        categoria: "fletes",
        tipo: "egreso",
        monto: 95_000 * precio * (0.6 + r.next()),
        medio: "Transferencia",
      });
    }
    if (r.next() < 0.12) {
      const [concepto, contraparte] = r.elegir([
        ["Mantenimiento de sierra", "Servicio Técnico Aldo"],
        ["Afilado de herramientas", "Servicio Técnico Aldo"],
        ["Seguro del taller", "Seguros Andinos"],
        ["Honorarios contables", "Estudio Contable Ruiz"],
      ] as const);
      push({
        t,
        concepto,
        contraparte,
        categoria: "otros",
        tipo: "egreso",
        monto: 160_000 * precio * (0.6 + r.next()),
        medio: "Transferencia",
      });
    }
    // Fijos del mes (primer día hábil a partir de la fecha).
    if (p.dia >= 4 && p.dia <= 6 && unaVez(`sueldos-${p.anio}-${p.mes}`)) {
      push({ t, concepto: "Sueldos del mes (5 personas)", contraparte: "Personal del taller", categoria: "sueldos", tipo: "egreso", monto: 7_900_000 * precio, medio: "Transferencia" });
      push({ t, concepto: "Cargas sociales", contraparte: "Seguridad social", categoria: "sueldos", tipo: "egreso", monto: 2_150_000 * precio, medio: "Débito automático" });
    }
    if (p.dia >= 10 && p.dia <= 12 && unaVez(`alquiler-${p.anio}-${p.mes}`)) {
      push({ t, concepto: "Alquiler del galpón", contraparte: "Inmobiliaria Barrio Güemes", categoria: "alquiler", tipo: "egreso", monto: 1_650_000 * precio, medio: "Transferencia" });
      push({ t, concepto: "Energía eléctrica trifásica", contraparte: "Distribuidora de energía", categoria: "alquiler", tipo: "egreso", monto: 540_000 * precio * (0.8 + r.next() * 0.4), medio: "Débito automático" });
    }
    if (p.dia >= 18 && p.dia <= 20 && unaVez(`iva-${p.anio}-${p.mes}`)) {
      push({ t, concepto: `IVA de ${MESES_LARGO[(p.mes + 11) % 12]}`, contraparte: "Organismo recaudador", categoria: "impuestos", tipo: "egreso", monto: 2_300_000 * precio * (0.8 + r.next() * 0.4), medio: "Débito automático" });
      push({ t, concepto: "Ingresos brutos", contraparte: "Rentas provincial", categoria: "impuestos", tipo: "egreso", monto: 640_000 * precio * (0.8 + r.next() * 0.4), medio: "Débito automático" });
    }
  }
  return out;
})();

/** Saldo de caja al cierre de hoy (fijo). */
export const SALDO_HOY = 24_600_000;

/** Saldo diario hacia atrás (a partir del saldo de hoy y los movimientos). */
const SALDOS: { t: number; saldo: number }[] = (() => {
  const netoPorDia = new Map<number, number>();
  for (const m of MOVIMIENTOS) netoPorDia.set(m.t, (netoPorDia.get(m.t) ?? 0) + (m.tipo === "ingreso" ? m.monto : -m.monto));
  const out: { t: number; saldo: number }[] = [];
  let saldo = SALDO_HOY;
  for (let d = 0; d < 120; d++) {
    const t = sumarDias(HOY, -d);
    out.unshift({ t, saldo });
    saldo -= netoPorDia.get(t) ?? 0;
  }
  return out;
})();

function rango(periodo: Periodo) {
  if (periodo === "12m") {
    return {
      desde: Date.UTC(2025, 9, 1),
      hasta: HOY,
      desdeAnt: Date.UTC(2024, 9, 1),
      hastaAnt: Date.UTC(2025, 8, 29),
    };
  }
  const k = periodo === "7d" ? 7 : 30;
  return {
    desde: sumarDias(HOY, -(k - 1)),
    hasta: HOY,
    desdeAnt: sumarDias(HOY, -(2 * k - 1)),
    hastaAnt: sumarDias(HOY, -k),
  };
}

export type Balde = { etiqueta: string; eje: string; ingresos: number; egresos: number };

export function finanzas(periodo: Periodo) {
  const { desde, hasta, desdeAnt, hastaAnt } = rango(periodo);
  const movs = MOVIMIENTOS.filter((m) => m.t >= desde && m.t <= hasta);
  const movsAnt = MOVIMIENTOS.filter((m) => m.t >= desdeAnt && m.t <= hastaAnt);
  const tot = (xs: Movimiento[], tipo: Tipo) => suma(xs.filter((m) => m.tipo === tipo).map((m) => m.monto));

  const ingresos = tot(movs, "ingreso");
  const egresos = tot(movs, "egreso");
  const ingresosAnt = tot(movsAnt, "ingreso");
  const egresosAnt = tot(movsAnt, "egreso");

  // Baldes del flujo de caja.
  const baldes: Balde[] = [];
  if (periodo === "12m") {
    for (let i = 0; i < 12; i++) {
      const mes = (9 + i) % 12;
      const anio = i < 3 ? 2025 : 2026;
      const ms = movs.filter((m) => {
        const p = partes(m.t);
        return p.mes === mes && p.anio === anio;
      });
      baldes.push({
        etiqueta: `${MESES_LARGO[mes]} ${anio}${mes === 8 && anio === 2026 ? " (hasta hoy)" : ""}`,
        eje: mes === 0 ? `${MESES[mes]} ${String(anio).slice(2)}` : MESES[mes]!,
        ingresos: tot(ms, "ingreso"),
        egresos: tot(ms, "egreso"),
      });
    }
  } else if (periodo === "7d") {
    for (let i = 0; i < 7; i++) {
      const t = sumarDias(desde, i);
      const p = partes(t);
      const ms = movs.filter((m) => m.t === t);
      baldes.push({
        etiqueta: `${DIAS_LARGO[p.semana]} ${p.dia} de ${MESES_LARGO[p.mes]}`,
        eje: `${DIAS[p.semana]} ${p.dia}`,
        ingresos: tot(ms, "ingreso"),
        egresos: tot(ms, "egreso"),
      });
    }
  } else {
    // 30 días en 10 tramos de 3 días: se leen mejor que 30 barras con los pagos grandes.
    for (let i = 0; i < 10; i++) {
      const t0 = sumarDias(desde, i * 3);
      const t1 = sumarDias(t0, 2);
      const a = partes(t0);
      const b = partes(t1);
      const ms = movs.filter((m) => m.t >= t0 && m.t <= t1);
      baldes.push({
        etiqueta: a.mes === b.mes ? `Del ${a.dia} al ${b.dia} de ${MESES_LARGO[b.mes]}` : `Del ${a.dia} de ${MESES_LARGO[a.mes]} al ${b.dia} de ${MESES_LARGO[b.mes]}`,
        eje: `${a.dia} ${MESES[a.mes]}`,
        ingresos: tot(ms, "ingreso"),
        egresos: tot(ms, "egreso"),
      });
    }
  }

  const gastos = CATEGORIAS_GASTO.map((c) => ({
    ...c,
    valor: suma(movs.filter((m) => m.categoria === c.id).map((m) => m.monto)),
  }));

  // Proyección a 90 días: 30 días reales + 90 proyectados.
  // Con 7 días hay muy pocos movimientos: se usa el ritmo del último mes para no exagerar.
  const dias = periodo === "12m" ? 365 : 30;
  const ventana = MOVIMIENTOS.filter((m) => m.t > sumarDias(HOY, -dias));
  // Ritmo diario de lo variable (sin sueldos, alquiler ni impuestos, que se agendan en su fecha).
  const esFijo = (m: Movimiento) => m.categoria === "sueldos" || m.categoria === "alquiler" || m.categoria === "impuestos";
  const variables = ventana.filter((m) => !esFijo(m));
  const variableDiario = (tot(variables, "ingreso") - tot(variables, "egreso")) / dias;
  const fijos = (t: number) => {
    const p = partes(t);
    const escala = 1.62;
    let v = 0;
    if (p.dia === 5) v -= (7_900_000 + 2_150_000) * escala;
    if (p.dia === 10) v -= (1_650_000 + 540_000) * escala;
    if (p.dia === 18) v -= (2_300_000 + 640_000) * escala;
    return v;
  };
  const r = rng(hash(`proy-${periodo}`));
  const historia = SALDOS.slice(-31);
  const proy: { t: number; medio: number; inf: number; sup: number }[] = [];
  let saldo = SALDO_HOY;
  const sigma = 210_000;
  for (let i = 1; i <= 90; i++) {
    const t = sumarDias(HOY, i);
    saldo += variableDiario * (1 + 0.25 * r.normal()) + fijos(t);
    const ancho = sigma * Math.sqrt(i) * 2.2;
    proy.push({ t, medio: saldo, inf: saldo - ancho, sup: saldo + ancho });
  }
  const COLCHON = 15_000_000;
  const cruce = proy.find((p) => p.medio < COLCHON);

  return {
    periodo,
    movs: [...movs].sort((a, b) => b.t - a.t || (a.id < b.id ? 1 : -1)),
    ingresos,
    egresos,
    neto: ingresos - egresos,
    varIngresos: variacion(ingresos, ingresosAnt),
    varEgresos: variacion(egresos, egresosAnt),
    varNeto: variacion(ingresos - egresos, ingresosAnt - egresosAnt),
    margen: ingresos ? (ingresos - egresos) / ingresos : 0,
    baldes,
    gastos,
    saldoSerie: historia.map((h) => h.saldo),
    proyeccion: { historia, proy, colchon: COLCHON, cruce },
  };
}

// ---------------------------------------------------------------- Cuentas por cobrar y pagar (al día de hoy)

export type Cuenta = { id: string; quien: string; comprobante: string; monto: number; dias: number };

/** `dias` > 0: vence en N días; < 0: vencida hace N días. */
export const POR_COBRAR: Cuenta[] = [
  { id: "c1", quien: "Mueblería Los Robles", comprobante: "Factura A 0004-00001873", monto: 1_120_000, dias: -38 },
  { id: "c2", quien: "Mueblería Los Robles", comprobante: "Factura A 0004-00001891", monto: 690_000, dias: -24 },
  { id: "c3", quien: "Hotel Paso Serrano", comprobante: "Factura A 0004-00001902", monto: 3_480_000, dias: 3 },
  { id: "c4", quien: "Oficinas Nodo 9", comprobante: "Factura A 0004-00001907", monto: 2_150_000, dias: 9 },
  { id: "c5", quien: "Colegio San Aurelio", comprobante: "Factura B 0004-00000611", monto: 1_760_000, dias: 16 },
  { id: "c6", quien: "Restó Tres Hojas", comprobante: "Factura A 0004-00001911", monto: 940_000, dias: 22 },
  { id: "c7", quien: "Estudio Arenales", comprobante: "Factura A 0004-00001866", monto: 410_000, dias: -67 },
];

export const POR_PAGAR: Cuenta[] = [
  { id: "p1", quien: "Organismo recaudador", comprobante: "IVA de septiembre", monto: 3_940_000, dias: 5 },
  { id: "p2", quien: "Aserradero El Quebracho", comprobante: "Factura A 0012-00045120", monto: 1_870_000, dias: 2 },
  { id: "p3", quien: "Tableros del Centro", comprobante: "Factura A 0003-00018877", monto: 1_240_000, dias: -6 },
  { id: "p4", quien: "Herrajes Bulonera Sur", comprobante: "Factura A 0001-00009931", monto: 386_000, dias: 12 },
  { id: "p5", quien: "Personal del taller", comprobante: "Sueldos de septiembre", monto: 12_800_000, dias: 6 },
  { id: "p6", quien: "Inmobiliaria Barrio Güemes", comprobante: "Alquiler de octubre", monto: 2_670_000, dias: 11 },
];

export const TRAMOS = [
  { id: "aldia", nombre: "Al día", test: (d: number) => d >= 0 },
  { id: "30", nombre: "1 a 30 días vencido", test: (d: number) => d < 0 && d >= -30 },
  { id: "60", nombre: "31 a 60 días", test: (d: number) => d < -30 && d >= -60 },
  { id: "mas", nombre: "Más de 60 días", test: (d: number) => d < -60 },
];

export function antiguedad(cuentas: Cuenta[]) {
  return TRAMOS.map((t) => ({ ...t, valor: suma(cuentas.filter((c) => t.test(c.dias)).map((c) => c.monto)) }));
}
