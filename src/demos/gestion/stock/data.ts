export type Categoria =
  | "Tornillería"
  | "Herramientas"
  | "Eléctricas"
  | "Electricidad"
  | "Plomería"
  | "Pinturería"
  | "Jardín"
  | "Seguridad";

export type Producto = {
  id: string;
  sku: string;
  ean: string;
  nombre: string;
  categoria: Categoria;
  proveedor: string;
  unidad: string;
  ubicacion: string;
  stock: number;
  minimo: number;
  costo: number;
  venta: number;
};

export type TipoMov = "ingreso" | "venta" | "ajuste" | "rotura" | "devolucion";

export type Movimiento = {
  id: string;
  fecha: string;
  productoId: string;
  tipo: TipoMov;
  /** Variación con signo. */
  cantidad: number;
  stockFinal: number;
  usuario: string;
  nota: string;
};

export type PedidoProveedor = {
  id: string;
  numero: number;
  proveedor: string;
  fecha: string;
  items: { productoId: string; cantidad: number; costo: number }[];
  estado: "enviado" | "recibido";
  recibido?: string;
};

export type StockState = { productos: Producto[]; movimientos: Movimiento[]; pedidos: PedidoProveedor[]; proximoPedido: number };

export const CATEGORIAS: Categoria[] = ["Tornillería", "Herramientas", "Eléctricas", "Electricidad", "Plomería", "Pinturería", "Jardín", "Seguridad"];

export const PROVEEDORES = [
  "Fijaciones Mediterránea",
  "Herrajes del Suquía",
  "Distribuidora Voltaje Centro",
  "Pinturas Serranas",
  "Sanitarios La Cañada",
] as const;

export const USUARIO = "Rubén Castaño";
export const USUARIOS = [USUARIO, "Noelia Vera", "Mostrador 2"];

export const TIPOS: Record<TipoMov, { nombre: string; color: string; fondo: string }> = {
  ingreso: { nombre: "Ingreso", color: "#1F7A3E", fondo: "#E3F2E7" },
  venta: { nombre: "Venta", color: "#B4400C", fondo: "#FDEBDD" },
  ajuste: { nombre: "Ajuste", color: "#3C5A8A", fondo: "#E4EAF4" },
  rotura: { nombre: "Rotura", color: "#9F1D1D", fondo: "#F8E1E1" },
  devolucion: { nombre: "Devolución", color: "#6B4FA8", fondo: "#EEE8F8" },
};

type Semilla = [nombre: string, cat: Categoria, prov: number, unidad: string, stock: number, minimo: number, costo: number, margen: number, ubic: string];

const SEMILLA: Semilla[] = [
  ["Tornillo autoperforante 8×1\" (caja ×100)", "Tornillería", 0, "caja", 46, 20, 4200, 0.65, "A1-02"],
  ["Tarugo de nylon Nº 8 (bolsa ×100)", "Tornillería", 0, "bolsa", 12, 25, 2100, 0.7, "A1-03"],
  ["Bulón cabeza hexagonal 3/8×2\"", "Tornillería", 0, "unidad", 380, 150, 240, 0.8, "A1-05"],
  ["Tuerca autofrenante 3/8\"", "Tornillería", 0, "unidad", 90, 120, 95, 0.9, "A1-06"],
  ["Clavo punta París 2\" (kg)", "Tornillería", 1, "kg", 34, 15, 3100, 0.55, "A2-01"],
  ["Martillo carpintero 27 mm mango fibra", "Herramientas", 1, "unidad", 14, 6, 11800, 0.6, "B1-01"],
  ["Destornillador Phillips PH2 × 150 mm", "Herramientas", 1, "unidad", 3, 10, 3900, 0.7, "B1-04"],
  ["Pinza universal 8\" aislada", "Herramientas", 1, "unidad", 11, 6, 9400, 0.6, "B1-06"],
  ["Cinta métrica 5 m × 19 mm", "Herramientas", 1, "unidad", 22, 10, 5600, 0.75, "B2-02"],
  ["Nivel de aluminio 60 cm", "Herramientas", 1, "unidad", 0, 4, 14200, 0.55, "B2-05"],
  ["Taladro percutor 650 W", "Eléctricas", 2, "unidad", 5, 3, 68500, 0.4, "C1-01"],
  ["Amoladora angular 115 mm 850 W", "Eléctricas", 2, "unidad", 2, 3, 74900, 0.4, "C1-02"],
  ["Mecha para hormigón 8 mm", "Eléctricas", 0, "unidad", 48, 20, 2300, 0.8, "C2-03"],
  ["Disco de corte metal 115 mm", "Eléctricas", 0, "unidad", 64, 30, 1450, 0.9, "C2-04"],
  ["Cable unipolar 2,5 mm² (rollo 100 m)", "Electricidad", 2, "rollo", 7, 5, 58200, 0.45, "D1-01"],
  ["Tomacorriente doble 10 A", "Electricidad", 2, "unidad", 31, 20, 3700, 0.7, "D1-04"],
  ["Lámpara LED 12 W luz fría", "Electricidad", 2, "unidad", 18, 30, 2100, 0.85, "D2-01"],
  ["Cinta aisladora 20 m negra", "Electricidad", 2, "unidad", 55, 25, 1250, 0.9, "D2-02"],
  ["Termomagnética bipolar 20 A", "Electricidad", 2, "unidad", 6, 8, 16400, 0.5, "D2-05"],
  ["Caño PPR 20 mm × 4 m", "Plomería", 4, "unidad", 26, 15, 6900, 0.6, "E1-01"],
  ["Codo PPR 20 mm 90°", "Plomería", 4, "unidad", 140, 60, 380, 1, "E1-03"],
  ["Canilla esférica ½\"", "Plomería", 4, "unidad", 9, 8, 7800, 0.6, "E1-06"],
  ["Cinta de teflón ¾\" × 20 m", "Plomería", 4, "unidad", 15, 40, 480, 1.1, "E2-01"],
  ["Látex interior blanco 20 L", "Pinturería", 3, "balde", 8, 6, 72500, 0.4, "F1-01"],
  ["Esmalte sintético negro 1 L", "Pinturería", 3, "lata", 12, 8, 13900, 0.55, "F1-03"],
  ["Rodillo antigota 22 cm", "Pinturería", 3, "unidad", 4, 10, 5200, 0.7, "F1-05"],
  ["Pincel cerda natural Nº 20", "Pinturería", 3, "unidad", 27, 12, 2600, 0.75, "F2-02"],
  ["Manguera reforzada ½\" × 25 m", "Jardín", 4, "rollo", 6, 4, 26800, 0.5, "G1-01"],
  ["Pala punta corazón mango madera", "Jardín", 1, "unidad", 7, 5, 16900, 0.5, "G1-03"],
  ["Guantes de vaqueta (par)", "Seguridad", 1, "par", 38, 20, 3400, 0.8, "H1-01"],
  ["Anteojos de seguridad claros", "Seguridad", 1, "unidad", 5, 15, 2200, 0.9, "H1-02"],
  ["Protector auditivo tipo copa", "Seguridad", 1, "unidad", 10, 6, 7300, 0.65, "H1-04"],
];

const PREFIJO: Record<Categoria, string> = {
  Tornillería: "TOR",
  Herramientas: "HER",
  Eléctricas: "ELE",
  Electricidad: "ELC",
  Plomería: "PLO",
  Pinturería: "PIN",
  Jardín: "JAR",
  Seguridad: "SEG",
};

export function prefijo(c: Categoria) {
  return PREFIJO[c];
}

/** Dígito verificador EAN-13. */
export function eanCheck(doce: string) {
  let s = 0;
  for (let i = 0; i < 12; i++) s += Number(doce[i]) * (i % 2 ? 3 : 1);
  return String((10 - (s % 10)) % 10);
}

export function redondeo(n: number) {
  return n < 1000 ? Math.round(n / 10) * 10 : Math.round(n / 50) * 50;
}

function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function crearSemilla(now: number): StockState {
  const cuenta: Partial<Record<Categoria, number>> = {};
  const productos: Producto[] = SEMILLA.map(([nombre, categoria, prov, unidad, stock, minimo, costo, margen, ubicacion], i) => {
    cuenta[categoria] = (cuenta[categoria] ?? 0) + 1;
    const doce = `779${String(4521000 + i * 137).padStart(7, "0")}${String(10 + i).slice(-2)}`.slice(0, 12);
    return {
      id: `p${i + 1}`,
      sku: `${PREFIJO[categoria]}-${String(100 + cuenta[categoria]! * 7).padStart(4, "0")}`,
      ean: doce + eanCheck(doce),
      nombre,
      categoria,
      proveedor: PROVEEDORES[prov]!,
      unidad,
      ubicacion,
      stock,
      minimo,
      costo,
      venta: redondeo(costo * (1 + margen)),
    };
  });

  // Movimientos de los últimos 7 días, generados de forma determinística.
  const rnd = mulberry32(42);
  const crudos: Omit<Movimiento, "stockFinal">[] = [];
  const hoy0 = new Date(now);
  hoy0.setHours(0, 0, 0, 0);
  const horaActual = new Date(now).getHours();
  let n = 0;
  for (let d = 6; d >= 0; d--) {
    const cantidadDia = d === 0 ? 9 : 7 + Math.floor(rnd() * 6);
    for (let k = 0; k < cantidadDia; k++) {
      const p = productos[Math.floor(rnd() * productos.length)]!;
      const r = rnd();
      const tipo: TipoMov = r < 0.62 ? "venta" : r < 0.86 ? "ingreso" : r < 0.93 ? "ajuste" : r < 0.97 ? "rotura" : "devolucion";
      const base = Math.max(1, Math.round(p.minimo * (0.08 + rnd() * 0.25)));
      const cantidad = tipo === "venta" ? -base : tipo === "ingreso" ? base * 3 : tipo === "ajuste" ? (rnd() < 0.5 ? -1 : 2) : tipo === "rotura" ? -1 : 1;
      // Hoy: solo horas ya pasadas (o de la mañana si es muy temprano).
      const maxHora = d === 0 ? Math.max(9, Math.min(19, horaActual)) : 19;
      const h = 8 + Math.floor(rnd() * Math.max(1, maxHora - 8));
      const fecha = new Date(hoy0);
      fecha.setDate(fecha.getDate() - d);
      fecha.setHours(h, Math.floor(rnd() * 60), 0, 0);
      const notas: Record<TipoMov, string[]> = {
        venta: ["Mostrador", "Factura B", "Cliente cuenta corriente", "Mostrador"],
        ingreso: ["Remito proveedor", "Reposición semanal", "Remito proveedor"],
        ajuste: ["Conteo físico", "Diferencia de inventario"],
        rotura: ["Envase dañado", "Falla de fábrica"],
        devolucion: ["Cliente devolvió sin uso"],
      };
      const opciones = notas[tipo];
      crudos.push({
        id: `m${++n}`,
        fecha: fecha.toISOString(),
        productoId: p.id,
        tipo,
        cantidad,
        usuario: USUARIOS[Math.floor(rnd() * USUARIOS.length)]!,
        nota: opciones[Math.floor(rnd() * opciones.length)]!,
      });
    }
  }
  crudos.sort((a, b) => b.fecha.localeCompare(a.fecha));
  // Stock final de cada movimiento: se reconstruye hacia atrás desde el stock actual.
  const actual: Record<string, number> = Object.fromEntries(productos.map((p) => [p.id, p.stock]));
  const movimientos: Movimiento[] = crudos.flatMap((m) => {
    const final = actual[m.productoId]!;
    // Se descarta si dejaría un stock previo negativo (no tendría sentido).
    if (final - m.cantidad < 0) return [];
    actual[m.productoId] = final - m.cantidad;
    return [{ ...m, stockFinal: final }];
  });

  const ayer = new Date(hoy0);
  ayer.setDate(ayer.getDate() - 1);
  ayer.setHours(17, 20);
  const pedidos: PedidoProveedor[] = [
    {
      id: "oc-1",
      numero: 1047,
      proveedor: "Pinturas Serranas",
      fecha: ayer.toISOString(),
      items: [
        { productoId: "p26", cantidad: 16, costo: 5200 },
        { productoId: "p24", cantidad: 4, costo: 72500 },
      ],
      estado: "enviado",
    },
  ];

  return { productos, movimientos, pedidos, proximoPedido: 1048 };
}

export type Estado = "ok" | "bajo" | "sin";

export function estadoDe(p: Producto): Estado {
  if (p.stock <= 0) return "sin";
  if (p.stock < p.minimo) return "bajo";
  return "ok";
}

/** Sugerido: llegar al doble del mínimo. */
export function sugerido(p: Producto) {
  return Math.max(1, p.minimo * 2 - p.stock);
}
