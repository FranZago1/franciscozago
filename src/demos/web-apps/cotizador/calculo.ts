/* Modelo y cálculo del cotizador. Todos los precios son ficticios y de referencia. */

export type TipoObra = "cocina" | "bano" | "integral" | "pintura" | "ampliacion";
export type EstadoInmueble = "bueno" | "regular" | "demoler";
export type Zona = "capital" | "gran" | "interior";
export type AmbienteTipo = "cocina" | "bano" | "living" | "dormitorio" | "lavadero" | "exterior";
export type Piso = "mantener" | "ceramico" | "porcelanato" | "flotante" | "microcemento";
export type Pared = "mantener" | "latex" | "revestimiento" | "microcemento";
export type Nivel = "estandar" | "superior" | "premium";
export type Plazo = "normal" | "urgente";

export type Ambiente = { id: string; tipo: AmbienteTipo; m2: string };

export type Cotizacion = {
  version: 1;
  paso: number;
  tipo: TipoObra | null;
  estado: EstadoInmueble;
  zona: Zona;
  ambientes: Ambiente[];
  piso: Piso | null;
  pared: Pared | null;
  nivel: Nivel;
  extras: {
    demolicion: boolean;
    electrica: boolean;
    sanitaria: boolean;
    aberturas: number;
    muebles: number;
    aires: number;
    limpieza: boolean;
    direccion: boolean;
  };
  plazo: Plazo;
  datos: { nombre: string; telefono: string; email: string; barrio: string; inicio: string; comentarios: string };
};

export const TIPOS: { id: TipoObra; nombre: string; bajada: string }[] = [
  { id: "cocina", nombre: "Reforma de cocina", bajada: "Mesadas, revestimientos, instalaciones y muebles." },
  { id: "bano", nombre: "Baño completo", bajada: "Sanitarios, grifería, revestimiento e impermeabilización." },
  { id: "integral", nombre: "Remodelación integral", bajada: "Varios ambientes o la casa entera, llave en mano." },
  { id: "pintura", nombre: "Pintura y terminaciones", bajada: "Enduido, pintura, reparaciones y pisos." },
  { id: "ampliacion", nombre: "Ampliación", bajada: "Metros nuevos: estructura, mampostería y techo." },
];

export const ESTADOS: { id: EstadoInmueble; nombre: string; detalle: string }[] = [
  { id: "bueno", nombre: "Bueno", detalle: "Solo terminaciones" },
  { id: "regular", nombre: "Regular", detalle: "Humedad o fisuras" },
  { id: "demoler", nombre: "Para demoler", detalle: "Se rehace todo" },
];

export const ZONAS: { id: Zona; nombre: string; detalle: string }[] = [
  { id: "capital", nombre: "Córdoba Capital", detalle: "Sin recargo" },
  { id: "gran", nombre: "Gran Córdoba", detalle: "+4 % traslado" },
  { id: "interior", nombre: "Interior provincial", detalle: "+9 % traslado" },
];

export const AMBIENTES: { id: AmbienteTipo; nombre: string; humedo: boolean }[] = [
  { id: "cocina", nombre: "Cocina", humedo: true },
  { id: "bano", nombre: "Baño", humedo: true },
  { id: "living", nombre: "Living comedor", humedo: false },
  { id: "dormitorio", nombre: "Dormitorio", humedo: false },
  { id: "lavadero", nombre: "Lavadero", humedo: true },
  { id: "exterior", nombre: "Patio o galería", humedo: false },
];

export const PISOS: { id: Piso; nombre: string; detalle: string; mat: number; mo: number }[] = [
  { id: "porcelanato", nombre: "Porcelanato", detalle: "60 × 60, rectificado", mat: 38000, mo: 21000 },
  { id: "flotante", nombre: "Piso flotante", detalle: "Símil madera, 8 mm", mat: 29500, mo: 12500 },
  { id: "microcemento", nombre: "Microcemento", detalle: "Continuo, sin juntas", mat: 26000, mo: 31000 },
  { id: "ceramico", nombre: "Cerámico", detalle: "Esmaltado, 35 × 35", mat: 17500, mo: 14500 },
  { id: "mantener", nombre: "Mantener el actual", detalle: "Solo se protege", mat: 0, mo: 0 },
];

export const PAREDES: { id: Pared; nombre: string; detalle: string; mat: number; mo: number }[] = [
  { id: "latex", nombre: "Látex lavable", detalle: "Enduido y dos manos", mat: 2800, mo: 5200 },
  { id: "revestimiento", nombre: "Revestimiento", detalle: "Cerámico en zonas húmedas", mat: 17000, mo: 14000 },
  { id: "microcemento", nombre: "Microcemento", detalle: "Todas las paredes", mat: 13000, mo: 17500 },
  { id: "mantener", nombre: "Mantener", detalle: "Sin trabajos en paredes", mat: 0, mo: 0 },
];

export const NIVELES: { id: Nivel; nombre: string; detalle: string; factor: number }[] = [
  { id: "estandar", nombre: "Estándar", detalle: "Marcas nacionales, buena relación precio y calidad.", factor: 1 },
  { id: "superior", nombre: "Superior", detalle: "Líneas premium nacionales y mejor grifería.", factor: 1.2 },
  { id: "premium", nombre: "Premium", detalle: "Importados, piezas grandes y detalles a medida.", factor: 1.45 },
];

export const PRECIOS = {
  demolicionM2: 9800,
  volquete: 185000,
  electricaM2: 23000,
  sanitariaAmbiente: 680000,
  abertura: 395000,
  muebleMl: 540000,
  aire: 1150000,
  limpiezaM2: 1900,
  direccion: 0.07,
  urgente: 0.15,
  iva: 0.21,
};

export const EXTRAS_INFO = {
  demolicion: { nombre: "Demolición y retiro de escombros", detalle: "Picado, carga y volquetes." },
  electrica: { nombre: "Instalación eléctrica nueva", detalle: "Cableado, tablero y bocas." },
  sanitaria: { nombre: "Instalación sanitaria", detalle: "Agua fría, caliente y desagües por ambiente húmedo." },
  limpieza: { nombre: "Limpieza final de obra", detalle: "Te entregamos listo para usar." },
  direccion: { nombre: "Dirección de obra", detalle: "Arquitecta a cargo, visitas semanales. 7 % del total." },
  aberturas: { nombre: "Aberturas", detalle: "Ventanas o puertas de aluminio, colocadas.", unidad: "u." },
  muebles: { nombre: "Muebles a medida", detalle: "Bajo mesada y alacenas, por metro lineal.", unidad: "m" },
  aires: { nombre: "Aire acondicionado", detalle: "Split frío/calor con instalación.", unidad: "u." },
} as const;

let n = 0;
export const nuevoAmbiente = (tipo: AmbienteTipo, m2 = ""): Ambiente => ({ id: `a${Date.now().toString(36)}${++n}`, tipo, m2 });

export const AMBIENTES_SUGERIDOS: Record<TipoObra, [AmbienteTipo, string][]> = {
  cocina: [["cocina", "12"]],
  bano: [["bano", "5"]],
  integral: [
    ["cocina", "12"],
    ["bano", "5"],
    ["living", "24"],
  ],
  pintura: [
    ["living", "24"],
    ["dormitorio", "12"],
  ],
  ampliacion: [["dormitorio", "14"]],
};

export function crearCotizacion(): Cotizacion {
  return {
    version: 1,
    paso: 0,
    tipo: null,
    estado: "regular",
    zona: "capital",
    ambientes: [],
    piso: null,
    pared: null,
    nivel: "estandar",
    extras: {
      demolicion: false,
      electrica: false,
      sanitaria: false,
      aberturas: 0,
      muebles: 0,
      aires: 0,
      limpieza: true,
      direccion: true,
    },
    plazo: "normal",
    datos: { nombre: "", telefono: "", email: "", barrio: "", inicio: "", comentarios: "" },
  };
}

export function esCotizacion(v: unknown): v is Cotizacion {
  if (!v || typeof v !== "object") return false;
  const c = v as Partial<Cotizacion>;
  return c.version === 1 && typeof c.paso === "number" && Array.isArray(c.ambientes) && !!c.extras && !!c.datos;
}

export const m2De = (a: Ambiente) => {
  const v = Number(a.m2.replace(",", "."));
  return Number.isFinite(v) && v > 0 ? v : 0;
};

export type Rubro = "Demolición" | "Albañilería" | "Pisos" | "Paredes y pintura" | "Instalaciones" | "Carpintería y equipamiento" | "Servicios";

export type Linea = { rubro: Rubro; concepto: string; cantidad: number; unidad: string; materiales: number; manoObra: number };

export type Resultado = {
  lineas: Linea[];
  rubros: { rubro: Rubro; total: number }[];
  materiales: number;
  manoObra: number;
  subtotal: number;
  iva: number;
  total: number;
  m2: number;
  semanas: number;
};

const ORDEN_RUBROS: Rubro[] = ["Demolición", "Albañilería", "Pisos", "Paredes y pintura", "Instalaciones", "Carpintería y equipamiento", "Servicios"];

const ALBANILERIA: Record<TipoObra, Partial<Record<AmbienteTipo, number>> & { resto: number }> = {
  cocina: { cocina: 54000, resto: 18000 },
  bano: { bano: 70000, resto: 18000 },
  integral: { cocina: 54000, bano: 70000, lavadero: 42000, resto: 26000 },
  pintura: { resto: 3600 },
  ampliacion: { resto: 465000 },
};

const redondear = (x: number) => Math.round(x / 100) * 100;

export function calcular(c: Cotizacion): Resultado {
  const lineas: Linea[] = [];
  const ambs = c.ambientes.filter((a) => m2De(a) > 0);
  const m2 = ambs.reduce((s, a) => s + m2De(a), 0);
  const nivel = NIVELES.find((x) => x.id === c.nivel)!.factor;
  const factorEstado = c.estado === "bueno" ? 1 : c.estado === "regular" ? 1.12 : 1.25;
  const humedos = ambs.filter((a) => AMBIENTES.find((x) => x.id === a.tipo)!.humedo);
  const add = (l: Linea) => {
    if (l.materiales + l.manoObra > 0) lineas.push({ ...l, materiales: redondear(l.materiales), manoObra: redondear(l.manoObra) });
  };

  if (c.tipo && m2 > 0) {
    // Demolición
    if (c.extras.demolicion || c.estado === "demoler") {
      add({ rubro: "Demolición", concepto: "Picado y demolición", cantidad: m2, unidad: "m²", materiales: 0, manoObra: m2 * PRECIOS.demolicionM2 * factorEstado });
      const volq = Math.max(1, Math.ceil(m2 / 22));
      add({ rubro: "Demolición", concepto: "Volquetes y retiro de escombros", cantidad: volq, unidad: "u.", materiales: volq * PRECIOS.volquete, manoObra: 0 });
    }

    // Albañilería por ambiente
    const tabla = ALBANILERIA[c.tipo];
    for (const a of ambs) {
      const precio = tabla[a.tipo] ?? tabla.resto;
      const nombre = AMBIENTES.find((x) => x.id === a.tipo)!.nombre;
      const proporcionMat = c.tipo === "ampliacion" ? 0.55 : 0.4;
      const concepto =
        c.tipo === "ampliacion"
          ? `Obra gruesa: ${nombre.toLowerCase()}`
          : c.tipo === "pintura"
            ? `Reparación de fisuras: ${nombre.toLowerCase()}`
            : `Albañilería: ${nombre.toLowerCase()}`;
      add({
        rubro: "Albañilería",
        concepto,
        cantidad: m2De(a),
        unidad: "m²",
        materiales: m2De(a) * precio * proporcionMat,
        manoObra: m2De(a) * precio * (1 - proporcionMat) * factorEstado,
      });
    }

    // Pisos
    const piso = PISOS.find((p) => p.id === c.piso);
    if (piso && piso.id !== "mantener") {
      add({ rubro: "Pisos", concepto: `${piso.nombre} (${piso.detalle.toLowerCase()})`, cantidad: m2, unidad: "m²", materiales: m2 * piso.mat * nivel, manoObra: m2 * piso.mo });
      add({ rubro: "Pisos", concepto: "Carpeta de nivelación", cantidad: m2, unidad: "m²", materiales: m2 * 4200, manoObra: m2 * 5800 * factorEstado });
    }

    // Paredes
    const paredM2 = (a: Ambiente) => m2De(a) * 2.7;
    const latex = PAREDES.find((p) => p.id === "latex")!;
    if (c.pared === "latex") {
      const sup = ambs.reduce((s, a) => s + paredM2(a), 0);
      add({ rubro: "Paredes y pintura", concepto: "Látex lavable, enduido y dos manos", cantidad: Math.round(sup), unidad: "m²", materiales: sup * latex.mat * nivel, manoObra: sup * latex.mo });
    } else if (c.pared === "revestimiento") {
      const rev = PAREDES.find((p) => p.id === "revestimiento")!;
      const supH = humedos.reduce((s, a) => s + paredM2(a) * 0.65, 0);
      const supS = ambs.reduce((s, a) => s + paredM2(a), 0) - supH;
      add({ rubro: "Paredes y pintura", concepto: "Revestimiento cerámico en zonas húmedas", cantidad: Math.round(supH), unidad: "m²", materiales: supH * rev.mat * nivel, manoObra: supH * rev.mo });
      add({ rubro: "Paredes y pintura", concepto: "Látex en el resto de las paredes", cantidad: Math.round(supS), unidad: "m²", materiales: supS * latex.mat * nivel, manoObra: supS * latex.mo });
    } else if (c.pared === "microcemento") {
      const mc = PAREDES.find((p) => p.id === "microcemento")!;
      const sup = ambs.reduce((s, a) => s + paredM2(a), 0);
      add({ rubro: "Paredes y pintura", concepto: "Microcemento en paredes", cantidad: Math.round(sup), unidad: "m²", materiales: sup * mc.mat * nivel, manoObra: sup * mc.mo });
    }

    // Instalaciones
    if (c.extras.electrica)
      add({ rubro: "Instalaciones", concepto: "Instalación eléctrica nueva", cantidad: m2, unidad: "m²", materiales: m2 * PRECIOS.electricaM2 * 0.45, manoObra: m2 * PRECIOS.electricaM2 * 0.55 });
    if (c.extras.sanitaria && humedos.length)
      add({
        rubro: "Instalaciones",
        concepto: "Instalación sanitaria",
        cantidad: humedos.length,
        unidad: "amb.",
        materiales: humedos.length * PRECIOS.sanitariaAmbiente * 0.5 * nivel,
        manoObra: humedos.length * PRECIOS.sanitariaAmbiente * 0.5,
      });
  }

  if (c.tipo) {
    // Carpintería y equipamiento (no dependen de los m²)
    const e = c.extras;
    if (e.aberturas > 0)
      add({ rubro: "Carpintería y equipamiento", concepto: "Aberturas de aluminio colocadas", cantidad: e.aberturas, unidad: "u.", materiales: e.aberturas * PRECIOS.abertura * 0.8 * nivel, manoObra: e.aberturas * PRECIOS.abertura * 0.2 });
    if (e.muebles > 0)
      add({ rubro: "Carpintería y equipamiento", concepto: "Muebles a medida", cantidad: e.muebles, unidad: "m", materiales: e.muebles * PRECIOS.muebleMl * 0.65 * nivel, manoObra: e.muebles * PRECIOS.muebleMl * 0.35 });
    if (e.aires > 0)
      add({ rubro: "Carpintería y equipamiento", concepto: "Aire acondicionado split instalado", cantidad: e.aires, unidad: "u.", materiales: e.aires * PRECIOS.aire * 0.8, manoObra: e.aires * PRECIOS.aire * 0.2 });
    if (e.limpieza && m2 > 0)
      add({ rubro: "Servicios", concepto: "Limpieza final de obra", cantidad: m2, unidad: "m²", materiales: 0, manoObra: m2 * PRECIOS.limpiezaM2 });
  }

  let materiales = lineas.reduce((s, l) => s + l.materiales, 0);
  let manoObra = lineas.reduce((s, l) => s + l.manoObra, 0);

  if (c.plazo === "urgente" && manoObra > 0) {
    const r = manoObra * PRECIOS.urgente;
    add({ rubro: "Servicios", concepto: "Recargo por plazo reducido (+15 % mano de obra)", cantidad: 1, unidad: "gl.", materiales: 0, manoObra: r });
    manoObra += redondear(r);
  }
  const traslado = c.zona === "gran" ? 0.04 : c.zona === "interior" ? 0.09 : 0;
  if (traslado && materiales + manoObra > 0) {
    const r = (materiales + manoObra) * traslado;
    add({ rubro: "Servicios", concepto: `Traslado y logística (${Math.round(traslado * 100)} %)`, cantidad: 1, unidad: "gl.", materiales: r, manoObra: 0 });
    materiales += redondear(r);
  }
  if (c.extras.direccion && materiales + manoObra > 0) {
    const r = (materiales + manoObra) * PRECIOS.direccion;
    add({ rubro: "Servicios", concepto: "Dirección de obra (7 %)", cantidad: 1, unidad: "gl.", materiales: 0, manoObra: r });
    manoObra += redondear(r);
  }

  const rubros = ORDEN_RUBROS.map((rubro) => ({
    rubro,
    total: lineas.filter((l) => l.rubro === rubro).reduce((s, l) => s + l.materiales + l.manoObra, 0),
  })).filter((r) => r.total > 0);

  const subtotal = materiales + manoObra;
  const iva = redondear(subtotal * PRECIOS.iva);
  const base = c.tipo === "ampliacion" ? 6 : c.tipo === "pintura" ? 1 : c.tipo === "integral" ? 4 : 2;
  const semanasRaw = c.tipo ? base + m2 / (c.tipo === "pintura" ? 60 : c.tipo === "ampliacion" ? 8 : 18) : 0;
  const semanas = c.tipo ? Math.max(1, Math.ceil(semanasRaw * (c.plazo === "urgente" ? 0.75 : 1))) : 0;

  return { lineas, rubros, materiales, manoObra, subtotal, iva, total: subtotal + iva, m2, semanas };
}

const fmt = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });
export const pesos = (n: number) => `$ ${fmt.format(Math.round(n))}`;
export const num = (n: number) => new Intl.NumberFormat("es-AR", { maximumFractionDigits: 1 }).format(n);

export type Errores = Record<string, string>;

export function validarPaso(c: Cotizacion, paso: number): Errores {
  const e: Errores = {};
  if (paso === 0 && !c.tipo) e.tipo = "Elegí el tipo de obra para seguir.";
  if (paso === 1) {
    if (c.ambientes.length === 0) e.ambientes = "Agregá al menos un ambiente.";
    for (const a of c.ambientes) {
      const v = Number(a.m2.replace(",", "."));
      if (!a.m2.trim()) e[`m2-${a.id}`] = "Indicá los metros cuadrados.";
      else if (!Number.isFinite(v) || v <= 0) e[`m2-${a.id}`] = "Tiene que ser un número mayor a 0.";
      else if (v < 1.5) e[`m2-${a.id}`] = "El mínimo es 1,5 m².";
      else if (v > 400) e[`m2-${a.id}`] = "Para más de 400 m² escribinos directamente.";
    }
  }
  if (paso === 2) {
    if (!c.piso) e.piso = "Elegí una opción de piso (o «Mantener el actual»).";
    if (!c.pared) e.pared = "Elegí una opción para las paredes (o «Mantener»).";
  }
  if (paso === 4) {
    const d = c.datos;
    if (d.nombre.trim().length < 3) e.nombre = d.nombre.trim() ? "Escribí tu nombre completo." : "¿Cómo te llamás?";
    const tel = d.telefono.replace(/[\s()-]/g, "");
    if (!tel) e.telefono = "Dejanos un teléfono para coordinar la visita.";
    else if (!/^\+?\d{8,14}$/.test(tel)) e.telefono = "Revisá el teléfono: usá solo números, con código de área (ej. 351 555 0142).";
    if (d.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email.trim())) e.email = "El email no parece válido (ej. nombre@correo.com).";
    if (!d.barrio.trim()) e.barrio = "Indicá el barrio o la localidad de la obra.";
    if (d.inicio) {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const [y, m, dd] = d.inicio.split("-").map(Number);
      if (y && m && dd && new Date(y, m - 1, dd) < hoy) e.inicio = "La fecha de inicio no puede ser anterior a hoy.";
    }
  }
  return e;
}
