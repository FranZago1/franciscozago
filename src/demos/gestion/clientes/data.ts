export type Etapa = "nuevo" | "contactado" | "visita" | "negociacion" | "cerrado";
export type Operacion = "Compra" | "Alquiler";
export type Prioridad = "alta" | "media" | "baja";
export type Origen = "Web" | "Referido" | "Portal inmobiliario" | "Cartel en obra" | "Instagram";
export type TipoInteraccion = "llamada" | "email" | "whatsapp" | "visita" | "nota" | "etapa" | "alta";
export type TipoTarea = "llamada" | "email" | "whatsapp" | "visita" | "reunion";

export type Interaccion = { id: string; tipo: TipoInteraccion; fecha: string; texto: string; autor: string };

export type Cliente = {
  id: string;
  nombre: string;
  telefono: string;
  email: string;
  operacion: Operacion;
  /** Compra: US$ totales. Alquiler: $ por mes. */
  presupuesto: number;
  zona: string;
  origen: Origen;
  asesor: string;
  etapa: Etapa;
  prioridad: Prioridad;
  creado: string;
  ultimoContacto: string;
  propiedades: string[];
  interacciones: Interaccion[];
  notas: string;
};

export type Tarea = {
  id: string;
  clienteId: string;
  tipo: TipoTarea;
  texto: string;
  fecha: string;
  hecha: boolean;
  hechaEn?: string;
};

export type Propiedad = {
  id: string;
  titulo: string;
  barrio: string;
  tipo: string;
  operacion: Operacion;
  precio: number;
  ambientes: number;
  m2: number;
  img: string;
};

export type CrmState = { clientes: Cliente[]; tareas: Tarea[] };

export const ETAPAS: { id: Etapa; nombre: string; color: string; suave: string }[] = [
  { id: "nuevo", nombre: "Nuevo", color: "#64748B", suave: "#EEF1F5" },
  { id: "contactado", nombre: "Contactado", color: "#2F7DA8", suave: "#E6F1F7" },
  { id: "visita", nombre: "Visita", color: "#0F766E", suave: "#E3F3F1" },
  { id: "negociacion", nombre: "Negociación", color: "#B7791F", suave: "#FBF1DF" },
  { id: "cerrado", nombre: "Cerrado", color: "#15803D", suave: "#E5F4EA" },
];

export const etapaDe = (id: Etapa) => ETAPAS.find((e) => e.id === id)!;

export const ASESORES = ["Lucía Ferreyra", "Martín Olmos", "Carla Benítez"] as const;
export const USUARIO = ASESORES[0];
export const ORIGENES: Origen[] = ["Web", "Referido", "Portal inmobiliario", "Cartel en obra", "Instagram"];
export const ZONAS = [
  "Nueva Córdoba",
  "Cerro de las Rosas",
  "Alberdi",
  "Villa Belgrano",
  "General Paz",
  "Mendiolaza",
  "Centro",
  "Manantiales",
  "Güemes",
  "Arguello",
];

export const TIPOS_TAREA: { id: TipoTarea; nombre: string }[] = [
  { id: "llamada", nombre: "Llamada" },
  { id: "whatsapp", nombre: "WhatsApp" },
  { id: "email", nombre: "Email" },
  { id: "visita", nombre: "Visita" },
  { id: "reunion", nombre: "Reunión" },
];

export const PROPIEDADES: Propiedad[] = [
  { id: "p1", titulo: "Depto 2 amb. con balcón", barrio: "Nueva Córdoba", tipo: "Departamento", operacion: "Compra", precio: 98000, ambientes: 2, m2: 54, img: "propiedad-depto-nueva-cordoba" },
  { id: "p2", titulo: "Casa 4 amb. con jardín", barrio: "Cerro de las Rosas", tipo: "Casa", operacion: "Compra", precio: 265000, ambientes: 4, m2: 190, img: "propiedad-casa-cerro" },
  { id: "p3", titulo: "PH reciclado con terraza", barrio: "Alberdi", tipo: "PH", operacion: "Compra", precio: 124000, ambientes: 3, m2: 96, img: "propiedad-ph-alberdi" },
  { id: "p4", titulo: "Dúplex a estrenar", barrio: "Villa Belgrano", tipo: "Dúplex", operacion: "Compra", precio: 189000, ambientes: 3, m2: 142, img: "propiedad-duplex-villa-belgrano" },
  { id: "p5", titulo: "Loft en ex fábrica", barrio: "General Paz", tipo: "Loft", operacion: "Alquiler", precio: 720000, ambientes: 2, m2: 88, img: "propiedad-loft-general-paz" },
  { id: "p6", titulo: "Casa con pileta y quincho", barrio: "Mendiolaza", tipo: "Casa", operacion: "Compra", precio: 310000, ambientes: 5, m2: 240, img: "propiedad-casa-mendiolaza" },
  { id: "p7", titulo: "Monoambiente luminoso", barrio: "Centro", tipo: "Departamento", operacion: "Alquiler", precio: 430000, ambientes: 1, m2: 34, img: "propiedad-monoambiente-centro" },
  { id: "p8", titulo: "Lote de 600 m² en barrio abierto", barrio: "Manantiales", tipo: "Lote", operacion: "Compra", precio: 58000, ambientes: 0, m2: 600, img: "propiedad-lote-manantiales" },
];

export const propiedadDe = (id: string) => PROPIEDADES.find((p) => p.id === id);

type SemillaCliente = Omit<Cliente, "creado" | "ultimoContacto" | "interacciones"> & {
  creadoHace: number;
  hist: [dias: number, hora: number, tipo: TipoInteraccion, texto: string][];
};

const semilla: SemillaCliente[] = [
  { id: "c01", nombre: "Valentina Quiroga", telefono: "351 555-0142", email: "valen.quiroga@correo.demo", operacion: "Compra", presupuesto: 105000, zona: "Nueva Córdoba", origen: "Portal inmobiliario", asesor: "Lucía Ferreyra", etapa: "nuevo", prioridad: "alta", propiedades: ["p1"], notas: "Primera vivienda. Tiene crédito preaprobado, quiere cochera si es posible.", creadoHace: 1,
    hist: [[-1, 18, "alta", "Consulta desde el portal por el depto de Nueva Córdoba."]] },
  { id: "c02", nombre: "Tomás Echeverría", telefono: "351 555-0187", email: "tomas.eche@correo.demo", operacion: "Alquiler", presupuesto: 450000, zona: "Centro", origen: "Web", asesor: "Martín Olmos", etapa: "nuevo", prioridad: "media", propiedades: ["p7"], notas: "Estudiante de posgrado, garantía de propietario de los padres.", creadoHace: 0,
    hist: [[0, 9, "alta", "Completó el formulario de la web a las 9:12."]] },
  { id: "c03", nombre: "Rocío Albarracín", telefono: "351 555-0119", email: "rocio.alba@correo.demo", operacion: "Compra", presupuesto: 60000, zona: "Manantiales", origen: "Cartel en obra", asesor: "Carla Benítez", etapa: "nuevo", prioridad: "baja", propiedades: ["p8"], notas: "Busca lote para construir en 2 años.", creadoHace: 2,
    hist: [[-2, 16, "alta", "Llamó por el cartel del lote en Manantiales."]] },
  { id: "c04", nombre: "Federico Paz", telefono: "351 555-0164", email: "fede.paz@correo.demo", operacion: "Compra", presupuesto: 195000, zona: "Villa Belgrano", origen: "Referido", asesor: "Lucía Ferreyra", etapa: "contactado", prioridad: "alta", propiedades: ["p4", "p2"], notas: "Lo refirió Sofía Maldonado (cliente 2025). Vende su depto actual para comprar.", creadoHace: 6,
    hist: [[-6, 11, "alta", "Referido por Sofía Maldonado."], [-5, 10, "llamada", "Primera llamada: busca 3 amb. con patio, zona norte."], [-2, 17, "email", "Le envié fichas del dúplex de Villa Belgrano y la casa del Cerro."]] },
  { id: "c05", nombre: "Mariana Sosa", telefono: "351 555-0133", email: "mari.sosa@correo.demo", operacion: "Alquiler", presupuesto: 700000, zona: "General Paz", origen: "Instagram", asesor: "Carla Benítez", etapa: "contactado", prioridad: "media", propiedades: ["p5"], notas: "Diseñadora, trabaja desde casa. Quiere luz natural y espacio abierto.", creadoHace: 4,
    hist: [[-4, 13, "alta", "Escribió por Instagram por el loft."], [-3, 12, "whatsapp", "Le pasé fotos y requisitos de garantía."]] },
  { id: "c06", nombre: "Julián Bustos", telefono: "351 555-0178", email: "julian.bustos@correo.demo", operacion: "Compra", presupuesto: 130000, zona: "Alberdi", origen: "Portal inmobiliario", asesor: "Martín Olmos", etapa: "contactado", prioridad: "media", propiedades: ["p3"], notas: "", creadoHace: 8,
    hist: [[-8, 10, "alta", "Consulta por el PH de Alberdi."], [-7, 15, "llamada", "No atendió. Dejé mensaje."], [-5, 11, "llamada", "Hablamos: quiere verlo con su pareja un sábado."]] },
  { id: "c07", nombre: "Agustina Ledesma", telefono: "351 555-0151", email: "agus.ledesma@correo.demo", operacion: "Compra", presupuesto: 270000, zona: "Cerro de las Rosas", origen: "Web", asesor: "Lucía Ferreyra", etapa: "visita", prioridad: "alta", propiedades: ["p2", "p6"], notas: "Familia con 3 hijos. Prioriza patio grande y cercanía a colegios.", creadoHace: 12,
    hist: [[-12, 9, "alta", "Formulario web: casa 4 amb. zona norte."], [-11, 16, "llamada", "Charla de 20 min, definimos presupuesto."], [-6, 11, "visita", "Visitó la casa del Cerro. Le gustó, duda por el techo."], [-1, 17, "whatsapp", "Pidió coordinar segunda visita con arquitecto."]] },
  { id: "c08", nombre: "Nicolás Ferrero", telefono: "351 555-0126", email: "nico.ferrero@correo.demo", operacion: "Compra", presupuesto: 100000, zona: "Nueva Córdoba", origen: "Instagram", asesor: "Carla Benítez", etapa: "visita", prioridad: "media", propiedades: ["p1"], notas: "Compra para inversión (renta a estudiantes).", creadoHace: 9,
    hist: [[-9, 12, "alta", "Mensaje por Instagram."], [-7, 10, "email", "Le mandé rentabilidad estimada."], [-3, 18, "visita", "Visitó el depto. Pregunta expensas."]] },
  { id: "c09", nombre: "Camila Herrera", telefono: "351 555-0195", email: "cami.herrera@correo.demo", operacion: "Alquiler", presupuesto: 480000, zona: "Güemes", origen: "Portal inmobiliario", asesor: "Martín Olmos", etapa: "visita", prioridad: "baja", propiedades: ["p7"], notas: "Tiene mascota (gato).", creadoHace: 7,
    hist: [[-7, 14, "alta", "Consulta por monoambientes."], [-4, 19, "visita", "Visitó el monoambiente del Centro."]] },
  { id: "c10", nombre: "Ignacio Moyano", telefono: "351 555-0108", email: "nacho.moyano@correo.demo", operacion: "Compra", presupuesto: 320000, zona: "Mendiolaza", origen: "Referido", asesor: "Lucía Ferreyra", etapa: "negociacion", prioridad: "alta", propiedades: ["p6"], notas: "Ofertó US$ 290.000. El propietario pide 305.000. Paga contado.", creadoHace: 21,
    hist: [[-21, 10, "alta", "Referido por el escribano Rivas."], [-18, 11, "visita", "Primera visita a la casa de Mendiolaza."], [-10, 17, "visita", "Segunda visita con su esposa."], [-4, 12, "email", "Oferta formal por US$ 290.000."], [-1, 10, "llamada", "El propietario contraofertó US$ 305.000."]] },
  { id: "c11", nombre: "Lucas Giménez", telefono: "351 555-0172", email: "lucas.gimenez@correo.demo", operacion: "Compra", presupuesto: 185000, zona: "Villa Belgrano", origen: "Web", asesor: "Martín Olmos", etapa: "negociacion", prioridad: "media", propiedades: ["p4"], notas: "Pide que el dúplex se entregue con aire acondicionado.", creadoHace: 16,
    hist: [[-16, 9, "alta", "Formulario web."], [-12, 18, "visita", "Visitó el dúplex."], [-3, 11, "nota", "Reunión en la oficina para revisar condiciones."]] },
  { id: "c12", nombre: "Florencia Ríos", telefono: "351 555-0139", email: "flor.rios@correo.demo", operacion: "Alquiler", presupuesto: 690000, zona: "General Paz", origen: "Instagram", asesor: "Carla Benítez", etapa: "negociacion", prioridad: "media", propiedades: ["p5"], notas: "Quiere contrato por 3 años con ajuste trimestral.", creadoHace: 10,
    hist: [[-10, 15, "alta", "Consulta por el loft."], [-8, 11, "visita", "Visitó el loft."], [-2, 16, "email", "Envié borrador de contrato."]] },
  { id: "c13", nombre: "Sofía Maldonado", telefono: "351 555-0184", email: "sofi.maldonado@correo.demo", operacion: "Compra", presupuesto: 122000, zona: "Alberdi", origen: "Referido", asesor: "Lucía Ferreyra", etapa: "cerrado", prioridad: "baja", propiedades: ["p3"], notas: "Escritura firmada. Muy conforme, nos refirió a Federico Paz.", creadoHace: 45,
    hist: [[-45, 10, "alta", "Referida por un cliente anterior."], [-30, 11, "visita", "Visitó el PH."], [-15, 12, "etapa", "Reserva firmada."], [-7, 10, "etapa", "Escritura firmada. Operación cerrada."]] },
  { id: "c14", nombre: "Diego Carranza", telefono: "351 555-0111", email: "diego.carranza@correo.demo", operacion: "Alquiler", presupuesto: 420000, zona: "Centro", origen: "Web", asesor: "Martín Olmos", etapa: "cerrado", prioridad: "baja", propiedades: ["p7"], notas: "Contrato firmado por 2 años.", creadoHace: 30,
    hist: [[-30, 9, "alta", "Formulario web."], [-25, 17, "visita", "Visitó el monoambiente."], [-12, 11, "etapa", "Contrato firmado."]] },
  { id: "c15", nombre: "Paula Cabrera", telefono: "351 555-0157", email: "pau.cabrera@correo.demo", operacion: "Compra", presupuesto: 240000, zona: "Arguello", origen: "Portal inmobiliario", asesor: "Carla Benítez", etapa: "contactado", prioridad: "media", propiedades: ["p2"], notas: "Busca casa en planta baja (su mamá vive con ella).", creadoHace: 5,
    hist: [[-5, 11, "alta", "Consulta desde el portal."], [-4, 10, "llamada", "Charla inicial. Prioriza una sola planta."]] },
  { id: "c16", nombre: "Martina Olivera", telefono: "351 555-0169", email: "martu.olivera@correo.demo", operacion: "Compra", presupuesto: 92000, zona: "Nueva Córdoba", origen: "Web", asesor: "Lucía Ferreyra", etapa: "visita", prioridad: "media", propiedades: ["p1"], notas: "", creadoHace: 11,
    hist: [[-11, 13, "alta", "Formulario web."], [-9, 12, "llamada", "Coordinamos visita."], [-2, 18, "visita", "Visitó el depto; quiere comparar con otro en Güemes."]] },
];

function isoRel(now: number, dias: number, horaNum: number, min = 0) {
  const d = new Date(now);
  d.setDate(d.getDate() + dias);
  d.setHours(horaNum, min, 0, 0);
  return d.toISOString();
}

type SemillaTarea = [clienteId: string, dias: number, hora: number, min: number, tipo: TipoTarea, texto: string];

const tareasSemilla: SemillaTarea[] = [
  ["c10", 0, 9, 30, "llamada", "Llamar para responder la contraoferta de US$ 305.000"],
  ["c07", 0, 11, 0, "visita", "Segunda visita a la casa del Cerro con el arquitecto"],
  ["c01", 0, 12, 30, "llamada", "Primer contacto: confirmar crédito y fechas de visita"],
  ["c04", 0, 15, 0, "whatsapp", "Preguntar qué le parecieron las fichas enviadas"],
  ["c16", 0, 17, 30, "email", "Enviar comparativa con el depto de Güemes"],
  ["c02", 0, 18, 0, "llamada", "Llamar para coordinar visita al monoambiente"],
  ["c08", -1, 16, 0, "email", "Enviar detalle de expensas y ABL"],
  ["c11", 1, 10, 0, "reunion", "Reunión con el propietario por el aire acondicionado"],
  ["c12", 1, 12, 0, "llamada", "Revisar cambios pedidos al borrador del contrato"],
  ["c05", 2, 16, 30, "visita", "Visita al loft de General Paz"],
  ["c06", 3, 11, 0, "visita", "Visita al PH con la pareja (sábado)"],
  ["c15", 2, 10, 0, "whatsapp", "Enviar opciones de casas en planta baja"],
  ["c09", 4, 11, 0, "llamada", "Seguimiento después de la visita"],
  ["c03", 5, 10, 30, "email", "Mandar plano del loteo y financiación"],
];

export function crearSemilla(now: number): CrmState {
  const clientes: Cliente[] = semilla.map(({ creadoHace, hist, ...c }) => {
    const interacciones: Interaccion[] = hist
      .map(([dias, h, tipo, texto], i) => ({
        id: `${c.id}-i${i}`,
        tipo,
        fecha: isoRel(now, dias, h, (i * 17) % 60),
        texto,
        autor: c.asesor,
      }))
      .reverse();
    return {
      ...c,
      creado: isoRel(now, -creadoHace, 9),
      ultimoContacto: interacciones[0]?.fecha ?? isoRel(now, -creadoHace, 9),
      interacciones,
    };
  });
  const tareas: Tarea[] = tareasSemilla.map(([clienteId, dias, h, m, tipo, texto], i) => ({
    id: `t${i + 1}`,
    clienteId,
    tipo,
    texto,
    fecha: isoRel(now, dias, h, m),
    hecha: false,
  }));
  // Una tarea de hoy ya hecha, para que la vista tenga historia.
  tareas.push({
    id: "t-hecha",
    clienteId: "c13",
    tipo: "llamada",
    texto: "Llamar para pedir reseña y referidos",
    fecha: isoRel(now, 0, 8, 45),
    hecha: true,
    hechaEn: isoRel(now, 0, 8, 52),
  });
  return { clientes, tareas };
}
