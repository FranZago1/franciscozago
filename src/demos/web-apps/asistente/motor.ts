/*
 * Motor de respuestas simulado, 100 % local.
 * 1) Normaliza la pregunta y la expande con sinónimos.
 * 2) Puntúa cada fragmento de los documentos (tipo BM25 simplificado).
 * 3) Si la pregunta cae en un tema conocido, usa una respuesta redactada que cita esos fragmentos.
 *    Si no, arma una respuesta con las oraciones más relevantes. Si no hay nada, lo dice.
 */
import { FRAGMENTOS, documento, fragmento } from "./documentos";

export type Respuesta = { texto: string; fuentes: string[]; relacionadas: string[]; tema: string };

const STOP = new Set(
  "a al algo algun alguna como con cual cuales cuando de del desde donde el ella ellas ellos en entre era es esa ese eso esta estan este esto hay la las le les lo los mas me mi mis muy nada ni no nos o otra otro para pero por porque puede pueden puedo que se segun ser si sin sobre son su sus te tengo tiene tienen tu un una uno unos y ya yo hacer hago saber quiero quisiera necesito podes podria cuanto cuanta hasta hola che dia dias buen buenas tarde tardes edificio sale salen cuesta depto departamento".split(
    " ",
  ),
);

export function normalizar(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9ñ\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function raiz(t: string) {
  if (t.length > 5 && t.endsWith("ciones")) return t.slice(0, -5);
  if (t.length > 4 && t.endsWith("es")) return t.slice(0, -2);
  if (t.length > 3 && t.endsWith("s")) return t.slice(0, -1);
  return t;
}

export function tokens(s: string) {
  return normalizar(s)
    .split(" ")
    .filter((t) => t.length > 1 && !STOP.has(t))
    .map(raiz);
}

/** Grupos de sinónimos (ya normalizados). Si aparece uno, se suman los demás con menor peso. */
const SINONIMOS: string[][] = [
  ["perro", "gato", "mascota", "animal", "perrito", "gatito", "cachorro"],
  ["ruido", "musica", "fiesta", "molestia", "silencio", "descanso", "parlante", "volumen"],
  ["obra", "reforma", "albanil", "arreglo", "remodelar", "remodelacion", "construccion", "taladro", "taladrar", "pintar", "martillo", "herramienta"],
  ["sum", "salon", "cumpleano", "evento", "festejo", "reserva", "reservar"],
  ["pileta", "piscina", "solarium", "nadar", "pile"],
  ["cochera", "garage", "garaje", "auto", "estacionar", "estacionamiento", "coche"],
  ["bici", "bicicleta", "bicicletero"],
  ["expensa", "pago", "pagar", "vencimiento", "vence", "cuota", "deuda", "interes", "mora", "atraso"],
  ["basura", "residuo", "reciclaje", "reciclable", "bolsa"],
  ["alquiler", "alquilar", "inquilino", "temporario", "airbnb", "huesped", "turista"],
  ["asamblea", "quorum", "votacion", "votar", "convocatoria"],
  ["mudanza", "mudar", "mudarme", "flete"],
  ["camara", "seguridad", "vigilancia", "grabacion"],
  ["ascensor", "elevador"],
  ["encargado", "portero", "conserje", "porteria"],
  ["terraza", "impermeabilizacion", "filtracion", "techo"],
  ["administracion", "administrador", "contacto", "reclamo", "urgencia"],
  ["consultorio", "oficina", "local", "comercio", "negocio", "emprendimiento", "profesional"],
];

const IDX = (() => {
  const docs = FRAGMENTOS.map((f) => {
    const cuerpo = tokens(`${f.texto} ${f.claves ?? ""}`);
    const titulo = tokens(f.titulo);
    const tf = new Map<string, number>();
    for (const t of cuerpo) tf.set(t, (tf.get(t) ?? 0) + 1);
    for (const t of titulo) tf.set(t, (tf.get(t) ?? 0) + 2);
    return { id: f.id, tf, largo: cuerpo.length };
  });
  const df = new Map<string, number>();
  for (const d of docs) for (const t of d.tf.keys()) df.set(t, (df.get(t) ?? 0) + 1);
  const N = docs.length;
  const prom = docs.reduce((s, d) => s + d.largo, 0) / N;
  return { docs, df, N, prom };
})();

function expandir(q: string[]) {
  const pesos = new Map<string, number>();
  for (const t of q) pesos.set(t, 1);
  for (const t of q) {
    for (const g of SINONIMOS) {
      if (g.some((s) => raiz(s) === t)) for (const s of g) if (!pesos.has(raiz(s))) pesos.set(raiz(s), 0.6);
    }
  }
  return pesos;
}

export function buscar(pregunta: string) {
  const q = expandir(tokens(pregunta));
  const { docs, df, N, prom } = IDX;
  const k1 = 1.2;
  const b = 0.6;
  return docs
    .map((d) => {
      let score = 0;
      for (const [t, w] of q) {
        const f = d.tf.get(t);
        if (!f) continue;
        const idf = Math.log(1 + (N - (df.get(t) ?? 0) + 0.5) / ((df.get(t) ?? 0) + 0.5));
        score += w * idf * ((f * (k1 + 1)) / (f + k1 * (1 - b + (b * d.largo) / prom)));
      }
      return { id: d.id, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b2) => b2.score - a.score);
}

type Tema = { id: string; claves: string[]; fuentes: string[]; texto: string; relacionadas: string[]; prioridad?: number };

/** Respuestas redactadas. Los [n] se refieren al orden de `fuentes`. */
const TEMAS: Tema[] = [
  {
    id: "obras",
    claves: ["obra", "reforma", "albanil", "arreglo", "remodelar", "taladro", "taladrar", "herramienta", "amoladora", "pintar", "escombro", "balcon", "cerramiento", "construccion", "martillo"],
    fuentes: ["R-15", "R-12"],
    texto:
      "Sí, podés hacer obras en tu unidad, pero hay que cumplir algunas reglas:\n\n- **Aviso previo:** tenés que avisar a la administración con **al menos 5 días hábiles** de anticipación, con el tipo de trabajo, cuánto dura y los datos de quienes lo hacen [1].\n- **Horarios:** de **lunes a viernes de 9 a 18** y los **sábados de 9 a 13**. Domingos y feriados no se permiten trabajos [1].\n- **Fachada y estructura:** si la reforma toca fachada, balcones, cerramientos o estructura, necesitás aprobación de la asamblea [1].\n- **Escombros:** van embolsados y se bajan por el ascensor de servicio protegido [1].\n\nTené en cuenta que el horario de descanso (de 22 a 8, y domingos y feriados de 14 a 16) prohíbe usar herramientas [2].",
    relacionadas: ["¿Cómo organizo una mudanza?", "¿Cuáles son los horarios de descanso?"],
  },
  {
    id: "mascotas",
    claves: ["perro", "gato", "mascota", "animal", "perrito", "gatito", "cachorro", "correa"],
    fuentes: ["R-9"],
    texto:
      "Sí, se permiten mascotas: **hasta dos animales domésticos por unidad**, siempre que no molesten a los vecinos [1].\n\nEn los espacios comunes tienen que ir **con correa** y acompañados por un adulto, y **no pueden entrar al SUM, la pileta ni el solárium** [1]. Además, quien las tiene debe levantar sus desechos y se hace cargo de cualquier daño [1].",
    relacionadas: ["¿Qué pasa si un vecino hace ruido de noche?", "¿Cómo reservo el SUM?"],
  },
  {
    id: "ruidos",
    claves: ["ruido", "musica", "fiesta", "molestia", "silencio", "descanso", "siesta", "parlante", "volumen", "multa"],
    fuentes: ["R-12"],
    texto:
      "El horario de descanso es de **22 a 8 todos los días** y, además, de **14 a 16 los domingos y feriados** [1]. En esa franja no se permite música que se escuche desde otras unidades, usar herramientas ni arrastrar muebles [1].\n\nSi un vecino hace ruido de forma reiterada, podés hacer el reclamo a la administración: primero manda un **apercibimiento por escrito** y después puede aplicar una **multa del 10 % de la expensa ordinaria** de esa unidad [1].",
    relacionadas: ["¿Cómo contacto a la administración?", "¿Puedo hacer obras un sábado?"],
  },
  {
    id: "sum",
    claves: ["sum", "salon", "cumpleano", "evento", "festejo", "reserva", "reservar", "reunion"],
    fuentes: ["R-18"],
    texto:
      "Para usar el SUM:\n\n- **Reservalo con 72 horas de anticipación** como mínimo, por la app del consorcio o en la administración [1].\n- **Capacidad:** hasta 30 personas [1].\n- **Horario:** hasta la **01:00** los viernes, sábados y vísperas de feriado; el resto de los días, hasta las **23:30** [1].\n- **Costo:** canon de **$ 18.000** más un depósito de garantía de **$ 40.000** que te devuelven si lo entregás limpio y sin daños [1].\n\nCada unidad puede reservarlo hasta dos veces por mes [1].",
    relacionadas: ["¿Se pueden llevar mascotas al SUM?", "¿Cuáles son los horarios de descanso?"],
  },
  {
    id: "pileta",
    claves: ["pileta", "piscina", "solarium", "nadar", "invitado", "revisacion", "temporada"],
    fuentes: ["R-19", "C-3"],
    texto:
      "Según el reglamento, la temporada de pileta va del **1 de diciembre al 31 de marzo**, de **10 a 20** [1]. Pero ojo: el consejo decidió que este año **se adelanta al 22 de noviembre** si el clima acompaña [2].\n\n- Podés llevar **hasta dos invitados por día**, siempre acompañados por un residente [1].\n- Los menores de 12 entran con un adulto [1].\n- Necesitás la **revisación médica al día**: se hace en portería los sábados de noviembre de 10 a 12 [2].\n- No se puede comer en el borde ni llevar vidrio [1].",
    relacionadas: ["¿Se pueden llevar mascotas a la pileta?", "¿Cómo reservo el SUM?"],
  },
  {
    id: "cocheras",
    claves: ["cochera", "garage", "garaje", "auto", "estacionar", "estacionamiento", "coche", "baulera", "bici", "bicicleta", "bicicletero", "moto"],
    fuentes: ["R-22", "C-4"],
    texto:
      "Las cocheras son **solo para estacionar vehículos**: no se pueden guardar muebles, objetos ni combustibles, y dentro del garaje la velocidad máxima es **10 km/h** [1].\n\nLas bicicletas van en el **bicicletero de planta baja** [1]. El consejo lo amplió a **24 lugares**, que se asignan por orden de pedido; para usarlo tenés que registrar tu bici en la administración [2].",
    relacionadas: ["¿Cómo contacto a la administración?", "¿Hay cámaras en las cocheras?"],
  },
  {
    id: "expensas",
    claves: ["expensa", "pago", "pagar", "vencimiento", "vence", "deuda", "interes", "mora", "atraso", "alias", "transferencia", "debito", "comprobante"],
    fuentes: ["R-25", "E-1", "E-2"],
    texto:
      "Las expensas **vencen el día 10 de cada mes** [1]. La de octubre, para una unidad tipo de dos ambientes, es de **$ 142.500** y vence el **10 de octubre de 2026**; el monto exacto de tu unidad depende de su coeficiente [2].\n\n**Cómo pagar:** por transferencia al alias **TORRE.ALAMEDA.EXPENSAS**, con débito automático o en la administración los martes y jueves de 10 a 13. Si transferís, subí el comprobante en la app [3].\n\nSi pagás tarde, se cobra un **interés del 3 % mensual**, calculado día por día. Las deudas de más de tres meses pasan a gestión judicial [1].",
    relacionadas: ["¿Sigue la cuota extraordinaria de la terraza?", "¿Por qué aumentaron las expensas?"],
  },
  {
    id: "cuota",
    prioridad: 2,
    claves: ["extraordinaria", "terraza", "impermeabilizacion", "filtracion", "techo", "garantia", "aumento", "aumentaron", "aumentan", "subieron", "subio", "paritaria", "seguro"],
    fuentes: ["A-3", "C-5", "E-3"],
    texto:
      "La asamblea de marzo aprobó impermeabilizar la terraza por **$ 18.600.000**, pagados en un 40 % con el fondo de reserva y el resto con una **cuota extraordinaria de $ 45.000 por unidad de abril a julio de 2026** [1].\n\nLa obra **terminó en julio** y tiene **garantía de diez años** [2]. La cuota extraordinaria **ya no se cobra** [3].\n\nSi notaste un aumento en la expensa de octubre, se debe al **aumento paritario del 6 %** del encargado y a la renovación del seguro integral del edificio [3].",
    relacionadas: ["¿Cuándo vencen las expensas?", "¿Qué se votó en la última asamblea?"],
  },
  {
    id: "alquiler",
    claves: ["alquiler", "alquilar", "inquilino", "temporario", "airbnb", "huesped", "turista"],
    fuentes: ["R-31", "A-4"],
    texto:
      "Podés alquilar tu unidad, pero tenés que informar a la administración los datos de los inquilinos y el plazo del contrato [1].\n\nSobre alquileres temporarios hay un cambio importante: el reglamento original los permitía con aviso de 48 horas [1], pero la asamblea de marzo **modificó el artículo 31** y, **desde el 1 de mayo de 2026, están prohibidos los alquileres por menos de 30 días** (29 votos a favor, 7 en contra y 2 abstenciones) [2]. O sea: plataformas tipo alquiler por noche ya no se pueden usar en el edificio.",
    relacionadas: ["¿Puedo tener un consultorio en mi departamento?", "¿Qué se votó en la última asamblea?"],
  },
  {
    id: "asamblea",
    claves: ["asamblea", "quorum", "votacion", "votar", "voto", "convocatoria", "poder", "voto", "decidio", "aprobo", "ultima"],
    fuentes: ["A-1", "A-3", "A-4", "A-5", "R-34"],
    texto:
      "La última asamblea ordinaria fue el **18 de marzo de 2026**, con 38 de las 56 unidades presentes [1]. Se aprobó:\n\n- La **impermeabilización de la terraza**, con una cuota extraordinaria de $ 45.000 de abril a julio [2].\n- La **prohibición de alquileres de menos de 30 días** desde el 1 de mayo [3].\n- La instalación de **seis cámaras** en accesos, cocheras y SUM [4].\n\nLa próxima ordinaria tiene que hacerse en el primer cuatrimestre de 2027 y se convoca con diez días de anticipación. Cada persona puede representar hasta dos unidades con poder firmado [5].",
    relacionadas: ["¿Quiénes forman el consejo de propietarios?", "¿Sigue la cuota extraordinaria de la terraza?"],
  },
  {
    id: "consejo",
    claves: ["consejo", "consejero", "integrante", "honorario", "presidente", "quienes"],
    fuentes: ["A-6"],
    texto:
      "El consejo de propietarios elegido en la asamblea de marzo está formado por **Martina Echenique (7B)**, **Hugo Salvatierra (11C)** y **Paula Rinaldi (2D)** [1]. En esa misma asamblea se aprobó un ajuste del 12 % en los honorarios de la administración desde abril [1].",
    relacionadas: ["¿Qué se votó en la última asamblea?", "¿Cómo contacto a la administración?"],
  },
  {
    id: "residuos",
    claves: ["basura", "residuo", "reciclaje", "reciclable", "bolsa"],
    fuentes: ["R-28"],
    texto:
      "La basura se saca en **bolsas bien cerradas** a los cestos del palier **entre las 19:30 y las 21**, de **domingo a viernes**. Los **sábados no se sacan residuos** [1].\n\nLos reciclables secos se llevan los **miércoles al punto limpio** de planta baja [1].",
    relacionadas: ["¿Cuál es el horario del encargado?", "¿Cómo organizo una mudanza?"],
  },
  {
    id: "mudanza",
    claves: ["mudanza", "mudar", "mudarme", "flete", "mudo"],
    fuentes: ["R-36", "C-1"],
    texto:
      "Las mudanzas se hacen de **lunes a sábado de 8 a 18**, avisando a la administración con **al menos 48 horas** [1]. Se usa solo el **ascensor de servicio**, protegido con mantas y con el encargado presente [1].\n\nUn dato útil: el consejo informó trabajos de modernización en el ascensor 2, así que conviene confirmar con la administración que el ascensor de servicio esté disponible ese día [2].",
    relacionadas: ["¿Cuál es el horario del encargado?", "¿Puedo hacer obras un sábado?"],
  },
  {
    id: "camaras",
    claves: ["camara", "seguridad", "vigilancia", "grabacion", "robo", "imagen"],
    fuentes: ["A-5"],
    texto:
      "Sí. La asamblea de marzo aprobó instalar **seis cámaras** en los accesos, las cocheras y el SUM, con el costo incluido en las expensas ordinarias [1]. Las imágenes se guardan **15 días** y **solo la administración** puede verlas, y únicamente ante una denuncia formal [1].",
    relacionadas: ["¿Qué se votó en la última asamblea?", "¿Cómo contacto a la administración?"],
  },
  {
    id: "ascensor",
    claves: ["ascensor", "elevador"],
    fuentes: ["C-1", "E-4"],
    texto:
      "El mantenimiento de los ascensores pasó a la empresa **Elevar Servicios**. El **ascensor 2** estuvo fuera de servicio del **25 al 29 de agosto** por la modernización de las botoneras [1].\n\nSi un ascensor se detiene fuera de horario, reportalo a la **guardia de 24 horas** desde la app del consorcio [2].",
    relacionadas: ["¿Cuál es el horario del encargado?", "¿Cómo organizo una mudanza?"],
  },
  {
    id: "encargado",
    claves: ["encargado", "portero", "conserje", "porteria"],
    fuentes: ["C-2"],
    texto:
      "El encargado es **Ramón Ledesma** y trabaja de **lunes a viernes de 7 a 15** y los **sábados de 8 a 12** [1]. Fuera de ese horario, las emergencias se atienden por la **guardia de la administración** desde la app [1].",
    relacionadas: ["¿Cómo contacto a la administración?", "¿A qué hora se saca la basura?"],
  },
  {
    id: "destino",
    claves: ["consultorio", "oficina", "local", "comercio", "negocio", "emprendimiento", "profesional", "vender", "venta", "atender"],
    fuentes: ["R-3"],
    texto:
      "Las unidades son de **vivienda**, pero se permiten **actividades profesionales sin atención masiva de público**: por ejemplo un estudio, un consultorio de hasta dos profesionales o trabajo remoto [1].\n\nLo que **no** se permite es el uso comercial con venta al público, poner un local o usar la unidad como depósito de mercadería [1].",
    relacionadas: ["¿Puedo alquilar mi departamento por Airbnb?", "¿Puedo hacer obras un sábado?"],
  },
  {
    id: "administracion",
    claves: ["administracion", "administrador", "contacto", "reclamo", "urgencia", "comunico", "comunicarme", "llamar"],
    fuentes: ["E-4"],
    texto:
      "La administración es **Llanos & Asociados** y atiende consultas de **lunes a viernes de 9 a 17** por la app del consorcio [1]. Para urgencias fuera de horario (agua, gas o ascensores) hay una **guardia las 24 horas** desde la misma app [1].",
    relacionadas: ["¿Cuál es el horario del encargado?", "¿Cómo pago las expensas?"],
  },
  {
    id: "balance",
    claves: ["balance", "cuenta", "ejercicio", "gasto"],
    fuentes: ["A-2"],
    texto:
      "El balance del ejercicio 2025 se aprobó en la asamblea de marzo con **34 votos a favor y 4 abstenciones**, y está a disposición de los propietarios en la administración [1].",
    relacionadas: ["¿Qué se votó en la última asamblea?", "¿Por qué aumentaron las expensas?"],
  },
];

export const SUGERIDAS = [
  "¿Puedo hacer obras un sábado?",
  "¿Se permiten mascotas?",
  "¿Cómo reservo el SUM?",
  "¿Cuándo vencen las expensas?",
  "¿Puedo alquilar mi departamento por Airbnb?",
  "¿Cuándo abre la pileta?",
];

const SALUDO = /^(hola|buen(os|as)? (dia|dias|tarde|tardes|noche|noches)|que tal|buenas)\b/;
const GRACIAS = /\b(gracias|genial|perfecto|buenisimo|joya)\b/;
const AYUDA = /\b(que (podes|sabes|puedes) hacer|ayuda|como funciona|quien sos|que sos)\b/;

export function responder(pregunta: string): Respuesta {
  const n = normalizar(pregunta);
  const qt = tokens(pregunta);

  if (!n) return { texto: "Escribí tu pregunta y la busco en los documentos del edificio.", fuentes: [], relacionadas: SUGERIDAS.slice(0, 3), tema: "vacio" };

  if (AYUDA.test(n)) {
    return {
      texto:
        "Puedo buscar en cuatro documentos del edificio y responderte con citas:\n\n- **Reglamento interno** (obras, mascotas, ruidos, SUM, pileta, cocheras, residuos, alquileres, mudanzas y asambleas).\n- **Acta de la asamblea de marzo 2026** (terraza, cámaras, alquileres temporarios, consejo).\n- **Acta del consejo de agosto 2026** (ascensores, encargado, pileta, bicicletero).\n- **Circular de expensas de octubre** (montos, vencimiento, medios de pago).\n\nHacé click en cualquier número entre corchetes para ver el fragmento original.",
      fuentes: [],
      relacionadas: SUGERIDAS.slice(0, 3),
      tema: "ayuda",
    };
  }

  if (qt.length === 0 || (SALUDO.test(n) && qt.length <= 2)) {
    return {
      texto:
        "¡Hola! Soy el asistente del **Consorcio Torre Alameda**. Respondo preguntas sobre el **reglamento interno**, las **actas** de asamblea y del consejo, y la **circular de expensas**, y siempre te muestro de qué documento sale cada dato.\n\n¿Qué necesitás saber?",
      fuentes: [],
      relacionadas: SUGERIDAS.slice(0, 3),
      tema: "saludo",
    };
  }
  if (GRACIAS.test(n) && qt.length <= 3) {
    return { texto: "¡De nada! Si te surge otra duda sobre el edificio, preguntame.", fuentes: [], relacionadas: SUGERIDAS.slice(2, 5), tema: "gracias" };
  }
  const resultados = buscar(pregunta);
  const puntaje = new Map(resultados.map((r) => [r.id, r.score]));

  // Tema: coincidencia directa de claves + puntaje de sus fragmentos.
  let mejor: { tema: Tema; score: number } | null = null;
  for (const tema of TEMAS) {
    const directas = tema.claves.filter((k) => qt.includes(raiz(k))).length;
    if (!directas) continue;
    const maximo = resultados[0]?.score || 1;
    const frag = (tema.fuentes.reduce((s, f) => s + (puntaje.get(f) ?? 0), 0) / tema.fuentes.length / maximo) * 3;
    const score = directas * 3 + frag + (tema.prioridad ?? 0);
    if (!mejor || score > mejor.score) mejor = { tema, score };
  }
  if (mejor) {
    return { texto: mejor.tema.texto, fuentes: mejor.tema.fuentes, relacionadas: mejor.tema.relacionadas, tema: mejor.tema.id };
  }

  // Sin tema: respuesta armada con las oraciones más relevantes.
  const top = resultados[0];
  if (top && top.score >= 2.2) {
    const elegidos = resultados.filter((r) => r.score >= top.score * 0.6).slice(0, 2);
    const partes = elegidos.map((r, i) => {
      const f = fragmento(r.id)!;
      const oraciones = f.texto.split(/(?<=\.)\s+/);
      const qset = new Set(expandir(qt).keys());
      const mejorOr = oraciones
        .map((o) => ({ o, s: tokens(o).filter((t) => qset.has(t)).length }))
        .sort((a, b) => b.s - a.s)[0]!.o;
      return `- **${documento(f.doc).corto}, ${f.ref.toLowerCase()} (${f.titulo.toLowerCase()}):** ${mejorOr} [${i + 1}]`;
    });
    return {
      texto: `No tengo una respuesta exacta para eso, pero esto es lo más relacionado que encontré en los documentos:\n\n${partes.join("\n")}\n\nSi necesitás una confirmación, consultalo con la administración.`,
      fuentes: elegidos.map((r) => r.id),
      relacionadas: SUGERIDAS.slice(0, 2),
      tema: "aproximada",
    };
  }

  return {
    texto:
      "No encontré información sobre eso en el reglamento, las actas ni la circular que tengo cargados. **Prefiero no inventar una respuesta.**\n\nTe sugiero consultarlo con la administración por la app del consorcio. Si querés, probá con otra pregunta sobre la vida en el edificio: obras, expensas, SUM, pileta, mascotas o alquileres.",
    fuentes: [],
    relacionadas: SUGERIDAS.slice(0, 3),
    tema: "sin-datos",
  };
}
