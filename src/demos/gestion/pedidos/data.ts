export type Categoria = "Parrilla" | "Achuras" | "Entradas" | "Guarniciones" | "Ensaladas" | "Postres" | "Bebidas";

export type ModGrupo = {
  id: string;
  nombre: string;
  tipo: "uno" | "varios";
  opciones: { id: string; nombre: string; extra?: number }[];
  /** Opción elegida por defecto (tipo "uno"). */
  defecto?: string;
};

export type ItemMenu = {
  id: string;
  nombre: string;
  cat: Categoria;
  precio: number;
  desc: string;
  mods?: ModGrupo[];
  popular?: boolean;
};

export type EstadoMesa = "libre" | "ocupada" | "pidiendo" | "cuenta";

export type Mesa = {
  id: string;
  numero: number;
  zona: "Salón" | "Vereda";
  forma: "redonda" | "cuadrada" | "rect";
  lugares: number;
  x: number;
  y: number;
  estado: EstadoMesa;
  comensales: number;
  mozo: string;
  desde?: string;
};

export type LineaPedido = {
  id: string;
  itemId: string;
  nombre: string;
  cant: number;
  mods: string[];
  /** Precio unitario final (con extras). */
  precio: number;
  nota: string;
  hecho: boolean;
};

export type EstadoCocina = "nuevo" | "preparacion" | "listo" | "entregado";
export type Pago = "Efectivo" | "Transferencia" | "Tarjeta";

export type Origen =
  | { tipo: "mesa"; mesaId: string }
  | { tipo: "delivery"; cliente: string; telefono: string; direccion: string; pago: Pago }
  | { tipo: "llevar"; cliente: string };

export type Pedido = {
  id: string;
  numero: number;
  origen: Origen;
  lineas: LineaPedido[];
  nota: string;
  estado: EstadoCocina;
  creado: string;
  iniciado?: string;
  listo?: string;
  entregado?: string;
  cobrado?: boolean;
  delivery?: { estado: "esperando" | "en_camino" | "entregado"; repartidor?: string; salida?: string; llegada?: string };
};

export type BrasaState = { mesas: Mesa[]; pedidos: Pedido[]; proximo: number };

export const USUARIO = "Gabriela Ponce";
export const MOZOS = ["Julio", "Mica", "Nahuel"];
export const REPARTIDORES = ["Lautaro (moto)", "Belén (bici)", "Ramiro (moto)"];
export const COSTO_ENVIO = 2500;

const punto: ModGrupo = {
  id: "punto",
  nombre: "Punto de cocción",
  tipo: "uno",
  defecto: "a-punto",
  opciones: [
    { id: "jugoso", nombre: "Jugoso" },
    { id: "a-punto", nombre: "A punto" },
    { id: "cocido", nombre: "Cocido" },
  ],
};
const guarnicion: ModGrupo = {
  id: "guarnicion",
  nombre: "Guarnición",
  tipo: "uno",
  defecto: "sin",
  opciones: [
    { id: "sin", nombre: "Sin guarnición" },
    { id: "fritas", nombre: "Papas fritas", extra: 3900 },
    { id: "pure", nombre: "Puré de calabaza", extra: 3400 },
    { id: "mixta", nombre: "Ensalada mixta", extra: 3200 },
  ],
};

export const MENU: ItemMenu[] = [
  { id: "bife", nombre: "Bife de chorizo", cat: "Parrilla", precio: 18900, desc: "400 g, a las brasas de quebracho.", mods: [punto, guarnicion], popular: true },
  { id: "vacio", nombre: "Vacío", cat: "Parrilla", precio: 17500, desc: "400 g, crocante por fuera.", mods: [punto, guarnicion], popular: true },
  { id: "entrana", nombre: "Entraña", cat: "Parrilla", precio: 19800, desc: "Corte fino y sabroso.", mods: [punto, guarnicion] },
  { id: "tira", nombre: "Asado de tira", cat: "Parrilla", precio: 16200, desc: "Tira ancha, cocción lenta.", mods: [guarnicion] },
  { id: "matambre", nombre: "Matambre a la pizza", cat: "Parrilla", precio: 15400, desc: "De cerdo, con muzzarella y tomate.", mods: [guarnicion] },
  { id: "pollo", nombre: "Pollo deshuesado", cat: "Parrilla", precio: 13900, desc: "Medio pollo con limón y ajo.", mods: [guarnicion] },
  {
    id: "parrillada",
    nombre: "Parrillada para 2",
    cat: "Parrilla",
    precio: 42000,
    desc: "Asado, vacío, chorizo, morcilla, chinchulines y mollejas.",
    mods: [{ id: "extras", nombre: "Agregados", tipo: "varios", opciones: [{ id: "provo", nombre: "+ Provoleta", extra: 7500 }, { id: "fritas", nombre: "+ Papas fritas", extra: 3900 }] }],
    popular: true,
  },
  { id: "chorizo", nombre: "Chorizo", cat: "Achuras", precio: 3900, desc: "Casero, de cerdo y vaca." },
  { id: "morcilla", nombre: "Morcilla", cat: "Achuras", precio: 3600, desc: "Dulce, con nueces." },
  { id: "mollejas", nombre: "Mollejas", cat: "Achuras", precio: 12500, desc: "Con limón.", mods: [{ id: "punto-m", nombre: "Punto", tipo: "uno", defecto: "crocantes", opciones: [{ id: "crocantes", nombre: "Crocantes" }, { id: "tiernas", nombre: "Tiernas" }] }] },
  { id: "chinchu", nombre: "Chinchulines", cat: "Achuras", precio: 7800, desc: "Bien crocantes." },
  { id: "provoleta", nombre: "Provoleta", cat: "Entradas", precio: 8900, desc: "Con orégano y ají molido.", mods: [{ id: "provo-x", nombre: "Agregados", tipo: "varios", opciones: [{ id: "tomate", nombre: "Tomate asado", extra: 1500 }, { id: "rucula", nombre: "Rúcula", extra: 1200 }] }], popular: true },
  { id: "empanada", nombre: "Empanada de carne", cat: "Entradas", precio: 2900, desc: "Cortada a cuchillo, al horno de barro." },
  { id: "choripan", nombre: "Choripán", cat: "Entradas", precio: 6500, desc: "Con chimichurri de la casa." },
  { id: "fritas", nombre: "Papas fritas", cat: "Guarniciones", precio: 6200, desc: "Porción para compartir." },
  { id: "pure", nombre: "Puré de calabaza", cat: "Guarniciones", precio: 5400, desc: "Con manteca y nuez moscada." },
  { id: "provenzal", nombre: "Papas a la provenzal", cat: "Guarniciones", precio: 6900, desc: "Ajo y perejil." },
  { id: "mixta", nombre: "Ensalada mixta", cat: "Ensaladas", precio: 5200, desc: "Lechuga, tomate y cebolla." },
  { id: "rucula", nombre: "Rúcula y parmesano", cat: "Ensaladas", precio: 7400, desc: "Con aceite de oliva." },
  { id: "flan", nombre: "Flan casero", cat: "Postres", precio: 5800, desc: "Receta de la abuela.", mods: [{ id: "con", nombre: "Con", tipo: "uno", defecto: "ddl", opciones: [{ id: "ddl", nombre: "Dulce de leche" }, { id: "crema", nombre: "Crema" }, { id: "mixto", nombre: "Mixto", extra: 800 }] }] },
  { id: "panqueque", nombre: "Panqueque con dulce de leche", cat: "Postres", precio: 6200, desc: "Flambeado al momento." },
  { id: "helado", nombre: "Helado 2 bochas", cat: "Postres", precio: 5500, desc: "Crema americana y chocolate." },
  { id: "agua", nombre: "Agua sin gas 500 ml", cat: "Bebidas", precio: 2800, desc: "Mineral." },
  { id: "gaseosa", nombre: "Gaseosa 500 ml", cat: "Bebidas", precio: 3300, desc: "Cola, lima-limón o naranja.", mods: [{ id: "sabor", nombre: "Sabor", tipo: "uno", defecto: "cola", opciones: [{ id: "cola", nombre: "Cola" }, { id: "lima", nombre: "Lima-limón" }, { id: "naranja", nombre: "Naranja" }] }] },
  { id: "copa", nombre: "Malbec de la casa (copa)", cat: "Bebidas", precio: 5900, desc: "Mendoza." },
  { id: "botella", nombre: "Malbec reserva (botella)", cat: "Bebidas", precio: 19500, desc: "750 ml.", popular: true },
  { id: "pinta", nombre: "Cerveza artesanal (pinta)", cat: "Bebidas", precio: 6400, desc: "Rubia o roja.", mods: [{ id: "estilo", nombre: "Estilo", tipo: "uno", defecto: "rubia", opciones: [{ id: "rubia", nombre: "Rubia" }, { id: "roja", nombre: "Roja" }] }] },
];

export const CATEGORIAS: Categoria[] = ["Parrilla", "Achuras", "Entradas", "Guarniciones", "Ensaladas", "Postres", "Bebidas"];

export const itemDe = (id: string) => MENU.find((m) => m.id === id);

type MesaSemilla = [numero: number, zona: Mesa["zona"], forma: Mesa["forma"], lugares: number, x: number, y: number];

const MESAS: MesaSemilla[] = [
  [1, "Salón", "redonda", 2, 105, 105],
  [2, "Salón", "redonda", 2, 235, 105],
  [3, "Salón", "cuadrada", 4, 375, 105],
  [4, "Salón", "cuadrada", 4, 520, 105],
  [5, "Salón", "rect", 6, 140, 285],
  [6, "Salón", "cuadrada", 4, 350, 285],
  [7, "Salón", "cuadrada", 4, 520, 285],
  [8, "Salón", "rect", 8, 185, 470],
  [9, "Salón", "redonda", 4, 420, 470],
  [10, "Salón", "redonda", 2, 555, 470],
  [11, "Vereda", "redonda", 2, 780, 440],
  [12, "Vereda", "redonda", 2, 905, 440],
  [13, "Vereda", "cuadrada", 4, 780, 565],
  [14, "Vereda", "cuadrada", 4, 905, 565],
];

let n = 0;
function linea(itemId: string, cant: number, mods: string[] = [], nota = "", extra = 0, hecho = false): LineaPedido {
  const it = itemDe(itemId)!;
  return { id: `l${++n}`, itemId, nombre: it.nombre, cant, mods, precio: it.precio + extra, nota, hecho };
}

export function crearSemilla(now: number): BrasaState {
  n = 0;
  const hace = (min: number) => new Date(now - min * 60_000).toISOString();

  const estados: Record<number, [EstadoMesa, number, string, number?]> = {
    2: ["ocupada", 2, "Mica", 35],
    3: ["pidiendo", 3, "Julio", 6],
    4: ["ocupada", 4, "Julio", 28],
    5: ["ocupada", 6, "Nahuel", 42],
    6: ["cuenta", 4, "Mica", 70],
    8: ["ocupada", 7, "Nahuel", 38],
    10: ["pidiendo", 2, "Mica", 3],
    11: ["ocupada", 2, "Julio", 58],
    13: ["cuenta", 3, "Julio", 64],
  };

  const mesas: Mesa[] = MESAS.map(([numero, zona, forma, lugares, x, y]) => {
    const e = estados[numero];
    return {
      id: `m${numero}`,
      numero,
      zona,
      forma,
      lugares,
      x,
      y,
      estado: e?.[0] ?? "libre",
      comensales: e?.[1] ?? 0,
      mozo: e?.[2] ?? MOZOS[numero % 3]!,
      desde: e?.[3] !== undefined ? hace(e[3]!) : undefined,
    };
  });

  const mesa = (num: number): Origen => ({ tipo: "mesa", mesaId: `m${num}` });

  const pedidos: Pedido[] = [
    { id: "o98", numero: 98, origen: { tipo: "delivery", cliente: "Ezequiel Moreno", telefono: "351 555-0190", direccion: "Bv. Ficticio 845, 3º B", pago: "Transferencia" }, lineas: [linea("vacio", 2, ["A punto", "Papas fritas"], "", 3900, true), linea("gaseosa", 2, ["Cola"], "", 0, true)], nota: "", estado: "entregado", creado: hace(95), iniciado: hace(93), listo: hace(78), entregado: hace(76), delivery: { estado: "entregado", repartidor: REPARTIDORES[0], salida: hace(76), llegada: hace(58) } },
    { id: "o99", numero: 99, origen: { tipo: "delivery", cliente: "Julieta Ferraro", telefono: "351 555-0112", direccion: "Calle Supuesta 410", pago: "Efectivo" }, lineas: [linea("parrillada", 1, [], "", 0, true), linea("botella", 1, [], "", 0, true)], nota: "", estado: "entregado", creado: hace(88), iniciado: hace(86), listo: hace(66), entregado: hace(64), delivery: { estado: "entregado", repartidor: REPARTIDORES[2], salida: hace(64), llegada: hace(49) } },
    { id: "o100", numero: 100, origen: { tipo: "delivery", cliente: "Tobías Rinaldi", telefono: "351 555-0171", direccion: "Bv. de Muestra 2210, PB", pago: "Tarjeta" }, lineas: [linea("empanada", 12, [], "", 0, true), linea("gaseosa", 3, ["Lima-limón"], "", 0, true)], nota: "", estado: "entregado", creado: hace(72), iniciado: hace(71), listo: hace(55), entregado: hace(53), delivery: { estado: "entregado", repartidor: REPARTIDORES[0], salida: hace(53), llegada: hace(35) } },
    { id: "o101", numero: 101, origen: mesa(11), lineas: [linea("provoleta", 1, [], "", 0, true), linea("entrana", 2, ["Jugoso", "Sin guarnición"], "", 0, true), linea("copa", 2, [], "", 0, true)], nota: "", estado: "entregado", creado: hace(52), iniciado: hace(50), listo: hace(36), entregado: hace(34) },
    { id: "o102", numero: 102, origen: mesa(6), lineas: [linea("parrillada", 1, [], "", 0, true), linea("fritas", 1, [], "", 0, true), linea("botella", 1, [], "", 0, true)], nota: "", estado: "entregado", creado: hace(66), iniciado: hace(64), listo: hace(45), entregado: hace(44) },
    { id: "o103", numero: 103, origen: mesa(13), lineas: [linea("bife", 1, ["A punto", "Puré de calabaza"], "", 3400, true), linea("pollo", 1, ["Ensalada mixta"], "", 3200, true), linea("agua", 2, [], "", 0, true)], nota: "", estado: "entregado", creado: hace(58), iniciado: hace(57), listo: hace(41), entregado: hace(40) },
    { id: "o104", numero: 104, origen: { tipo: "delivery", cliente: "Martina Suárez", telefono: "351 555-0147", direccion: "Calle Inventada 1520, casa", pago: "Efectivo" }, lineas: [linea("empanada", 6, [], "", 0, true), linea("matambre", 1, ["Papas fritas"], "", 3900, true)], nota: "Tocar timbre 2 veces", estado: "entregado", creado: hace(38), iniciado: hace(37), listo: hace(22), entregado: hace(19), delivery: { estado: "en_camino", repartidor: REPARTIDORES[1], salida: hace(19) } },
    { id: "o105", numero: 105, origen: mesa(5), lineas: [linea("empanada", 6, [], "", 0, true), linea("provoleta", 2, ["Tomate asado"], "", 1500, true), linea("pinta", 4, ["Rubia"], "", 0, true)], nota: "", estado: "entregado", creado: hace(40), iniciado: hace(39), listo: hace(30), entregado: hace(29) },
    { id: "o106", numero: 106, origen: mesa(8), lineas: [linea("parrillada", 2, ["+ Papas fritas"], "", 3900, true), linea("chorizo", 3, [], "", 0, true), linea("mollejas", 1, ["Crocantes"], "", 0), linea("rucula", 2, [], "Sin parmesano en una")], nota: "Cumpleaños: postre con vela", estado: "preparacion", creado: hace(23), iniciado: hace(21) },
    { id: "o107", numero: 107, origen: mesa(2), lineas: [linea("bife", 1, ["Jugoso", "Papas fritas"], "", 3900, true), linea("vacio", 1, ["A punto", "Ensalada mixta"], "", 3200, true)], nota: "", estado: "listo", creado: hace(19), iniciado: hace(18), listo: hace(2) },
    { id: "o108", numero: 108, origen: { tipo: "delivery", cliente: "Hernán Quinteros", telefono: "351 555-0163", direccion: "Pje. Imaginario 77, dpto 4", pago: "Tarjeta" }, lineas: [linea("tira", 2, ["Papas fritas"], "", 3900, true), linea("choripan", 2, [], "Uno sin chimichurri"), linea("flan", 2, ["Dulce de leche"], "")], nota: "", estado: "preparacion", creado: hace(14), iniciado: hace(12), delivery: { estado: "esperando" } },
    { id: "o109", numero: 109, origen: mesa(4), lineas: [linea("entrana", 2, ["Jugoso", "Puré de calabaza"], "", 3400), linea("pollo", 1, ["Sin guarnición"], "Sin sal"), linea("mixta", 1, [])], nota: "", estado: "preparacion", creado: hace(9), iniciado: hace(7) },
    { id: "o110", numero: 110, origen: { tipo: "llevar", cliente: "Paola" }, lineas: [linea("choripan", 3, []), linea("fritas", 1, [])], nota: "Retira en 20 min", estado: "nuevo", creado: hace(4) },
    { id: "o111", numero: 111, origen: mesa(5), lineas: [linea("bife", 2, ["A punto", "Papas fritas"], "", 3900), linea("vacio", 2, ["Cocido", "Sin guarnición"], ""), linea("matambre", 1, ["Puré de calabaza"], "", 3400), linea("provenzal", 1, [])], nota: "Un comensal celíaco: sin pan", estado: "nuevo", creado: hace(2) },
    { id: "o112", numero: 112, origen: { tipo: "delivery", cliente: "Lorena Aguirre", telefono: "351 555-0128", direccion: "Av. de Ejemplo 3300, torre 2, 7º A", pago: "Transferencia" }, lineas: [linea("vacio", 1, ["A punto", "Papas fritas"], "", 3900), linea("empanada", 4, []), linea("helado", 1, [])], nota: "", estado: "nuevo", creado: hace(1), delivery: { estado: "esperando" } },
  ];

  return { mesas, pedidos, proximo: 113 };
}

export function totalPedido(p: Pedido) {
  const sub = p.lineas.reduce((a, l) => a + l.precio * l.cant, 0);
  return sub + (p.origen.tipo === "delivery" ? COSTO_ENVIO : 0);
}

export function etiquetaOrigen(p: Pedido, mesas: Mesa[]) {
  if (p.origen.tipo === "mesa") {
    const id = p.origen.mesaId;
    const m = mesas.find((x) => x.id === id);
    return `Mesa ${m?.numero ?? "?"}`;
  }
  if (p.origen.tipo === "delivery") return `Delivery · ${p.origen.cliente.split(" ")[0]}`;
  return `Para llevar · ${p.origen.cliente}`;
}
