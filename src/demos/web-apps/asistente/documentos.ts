/* Documentos ficticios del Consorcio Torre Alameda. Todo el contenido es inventado para la demo. */

export type Fragmento = {
  id: string;
  doc: string;
  ref: string; // "Art. 15", "Punto 3", etc.
  titulo: string;
  texto: string;
  /** Palabras extra que ayudan a encontrar el fragmento (no se muestran). */
  claves?: string;
};

export type Documento = {
  id: string;
  titulo: string;
  corto: string;
  tipo: string;
  fecha: string;
  paginas: number;
};

export const DOCUMENTOS: Documento[] = [
  { id: "reglamento", titulo: "Reglamento interno de convivencia", corto: "Reglamento", tipo: "Reglamento", fecha: "Texto ordenado 2024", paginas: 18 },
  { id: "asamblea", titulo: "Acta de Asamblea Ordinaria N.º 41", corto: "Acta de asamblea", tipo: "Acta", fecha: "18 de marzo de 2026", paginas: 6 },
  { id: "consejo", titulo: "Acta del Consejo de Propietarios", corto: "Acta del consejo", tipo: "Acta", fecha: "12 de agosto de 2026", paginas: 3 },
  { id: "circular", titulo: "Circular de expensas de octubre", corto: "Circular", tipo: "Circular", fecha: "25 de septiembre de 2026", paginas: 2 },
];

export const FRAGMENTOS: Fragmento[] = [
  // ---------------- Reglamento ----------------
  {
    id: "R-3",
    doc: "reglamento",
    ref: "Art. 3",
    titulo: "Destino de las unidades",
    texto:
      "Las unidades funcionales se destinan a vivienda. Se admite el ejercicio de actividades profesionales sin atención masiva de público, como estudios, consultorios de hasta dos profesionales o trabajo remoto. Queda prohibido el uso comercial con venta al público, la instalación de locales y el depósito de mercadería.",
    claves: "oficina negocio local comercio consultorio trabajar emprendimiento profesional",
  },
  {
    id: "R-9",
    doc: "reglamento",
    ref: "Art. 9",
    titulo: "Animales domésticos",
    texto:
      "Se permite la tenencia de hasta dos animales domésticos por unidad, siempre que no ocasionen molestias a los vecinos ni riesgos para la higiene. En los espacios comunes deben circular con correa y acompañados por una persona adulta. No pueden permanecer en el SUM, la pileta ni el solárium. El responsable del animal debe levantar sus desechos y responde por los daños que cause.",
    claves: "perro perros gato gatos mascota mascotas animal correa",
  },
  {
    id: "R-12",
    doc: "reglamento",
    ref: "Art. 12",
    titulo: "Ruidos y horarios de descanso",
    texto:
      "El horario de descanso es de 22:00 a 8:00 todos los días, y además de 14:00 a 16:00 los domingos y feriados. En esos horarios no se permite música audible desde otras unidades, el uso de herramientas ni el arrastre de muebles. Las reuniones sociales deben mantener un volumen moderado en todo momento. Ante reclamos reiterados, la administración enviará un apercibimiento escrito y podrá aplicar una multa equivalente al 10 % de la expensa ordinaria de la unidad.",
    claves: "ruido ruidos musica fiesta molestia vecino silencio siesta noche multa",
  },
  {
    id: "R-15",
    doc: "reglamento",
    ref: "Art. 15",
    titulo: "Obras y reformas en las unidades",
    texto:
      "Toda obra o reforma debe comunicarse a la administración con al menos cinco días hábiles de anticipación, indicando el tipo de trabajo, la duración estimada y los datos del personal. Los trabajos pueden realizarse de lunes a viernes de 9:00 a 18:00 y los sábados de 9:00 a 13:00. No se permiten trabajos los domingos ni feriados. Las modificaciones en fachada, balcones, cerramientos o estructura requieren aprobación de la asamblea. Los escombros deben retirarse embolsados por el ascensor de servicio, previamente protegido.",
    claves: "obra obras reforma reformas albanil pintar pintura taladro arreglo remodelar construccion escombros balcon cerramiento",
  },
  {
    id: "R-18",
    doc: "reglamento",
    ref: "Art. 18",
    titulo: "Salón de usos múltiples (SUM)",
    texto:
      "El SUM se reserva por la app del consorcio o en la administración con un mínimo de 72 horas de anticipación. La capacidad máxima es de 30 personas. Puede usarse hasta la 01:00 los viernes, sábados y vísperas de feriado, y hasta las 23:30 el resto de los días. El uso tiene un canon de $ 18.000 y un depósito de garantía de $ 40.000 que se reintegra si el salón se entrega limpio y sin daños. Cada unidad puede hacer hasta dos reservas por mes.",
    claves: "sum salon cumpleanos fiesta reserva reservar evento reunion festejo",
  },
  {
    id: "R-19",
    doc: "reglamento",
    ref: "Art. 19",
    titulo: "Pileta y solárium",
    texto:
      "La temporada de pileta va del 1 de diciembre al 31 de marzo, de 10:00 a 20:00. Cada unidad puede invitar hasta dos personas por día, que deben estar acompañadas por un residente. Los menores de 12 años deben ingresar con un adulto. Para usar la pileta es obligatorio tener la revisación médica al día. No se permite comer en el borde ni ingresar envases de vidrio.",
    claves: "pileta piscina solarium nadar invitados verano revisacion medica temporada",
  },
  {
    id: "R-22",
    doc: "reglamento",
    ref: "Art. 22",
    titulo: "Cocheras y bauleras",
    texto:
      "Las cocheras se usan exclusivamente para estacionar vehículos: no se permite guardar muebles, objetos ni combustibles. La velocidad máxima dentro del garaje es de 10 km/h. Las bicicletas se guardan en el bicicletero de planta baja y no en las cocheras ni en los pasillos.",
    claves: "cochera cocheras garage garaje auto autos estacionar estacionamiento baulera bicicleta bici moto",
  },
  {
    id: "R-25",
    doc: "reglamento",
    ref: "Art. 25",
    titulo: "Expensas",
    texto:
      "Las expensas vencen el día 10 de cada mes. Los pagos fuera de término generan un interés punitorio del 3 % mensual, calculado día por día. Se pueden pagar por transferencia a la cuenta del consorcio, por débito automático o en la administración. Las deudas de más de tres períodos se derivan a gestión judicial.",
    claves: "expensa expensas pago pagar vencimiento vence interes deuda atraso mora cuota",
  },
  {
    id: "R-28",
    doc: "reglamento",
    ref: "Art. 28",
    titulo: "Residuos",
    texto:
      "Los residuos se dejan en bolsas bien cerradas en los cestos del palier entre las 19:30 y las 21:00, de domingo a viernes. Los sábados no se sacan residuos. Los reciclables secos se llevan los miércoles al punto limpio de planta baja.",
    claves: "basura residuos reciclaje reciclables bolsa bolsas palier",
  },
  {
    id: "R-31",
    doc: "reglamento",
    ref: "Art. 31",
    titulo: "Alquileres",
    texto:
      "Quien alquile su unidad debe informar a la administración los datos de los inquilinos y el plazo del contrato. Los alquileres temporarios deben informarse con 48 horas de anticipación y los huéspedes deben registrarse en portería.",
    claves: "alquiler alquilar alquileres inquilino inquilinos temporario airbnb huesped huespedes turistas",
  },
  {
    id: "R-34",
    doc: "reglamento",
    ref: "Art. 34",
    titulo: "Asambleas",
    texto:
      "La asamblea ordinaria se realiza una vez por año, dentro del primer cuatrimestre. Las extraordinarias las convoca la administración o el 20 % de los propietarios. La convocatoria se hace con diez días de anticipación. En primera convocatoria el quórum es la mayoría absoluta de las unidades; media hora después se sesiona con los presentes. Cada persona puede representar hasta dos unidades con poder firmado.",
    claves: "asamblea asambleas quorum votar votacion reunion convocatoria poder propietarios",
  },
  {
    id: "R-36",
    doc: "reglamento",
    ref: "Art. 36",
    titulo: "Mudanzas",
    texto:
      "Las mudanzas se hacen de lunes a sábado de 8:00 a 18:00, con aviso a la administración de al menos 48 horas. Se usa únicamente el ascensor de servicio, protegido con mantas, y con el encargado presente.",
    claves: "mudanza mudanzas mudarme mudar flete muebles ascensor",
  },
  // ---------------- Acta de asamblea ----------------
  {
    id: "A-1",
    doc: "asamblea",
    ref: "Apertura",
    titulo: "Asistencia y quórum",
    texto:
      "Con la presencia de 38 de las 56 unidades (67,8 %), se abre la asamblea en primera convocatoria. Preside Martina Echenique (unidad 7B) y actúa como secretario Raúl Benítez (unidad 3A).",
    claves: "asamblea quorum asistencia presentes",
  },
  {
    id: "A-2",
    doc: "asamblea",
    ref: "Punto 1",
    titulo: "Balance del ejercicio 2025",
    texto: "Se aprueba el balance del ejercicio 2025 por mayoría: 34 votos a favor y 4 abstenciones. Queda a disposición de los propietarios en la administración.",
    claves: "balance cuentas ejercicio gastos",
  },
  {
    id: "A-3",
    doc: "asamblea",
    ref: "Punto 2",
    titulo: "Impermeabilización de la terraza",
    texto:
      "Se aprueba el presupuesto de la empresa Techos del Centro por $ 18.600.000 para impermeabilizar la terraza. Se financia en un 40 % con el fondo de reserva y el resto con una cuota extraordinaria de $ 45.000 por unidad durante cuatro meses, de abril a julio de 2026. La obra se prevé para mayo y junio.",
    claves: "terraza impermeabilizacion filtracion humedad techo cuota extraordinaria fondo reserva",
  },
  {
    id: "A-4",
    doc: "asamblea",
    ref: "Punto 3",
    titulo: "Modificación del artículo 31 (alquileres temporarios)",
    texto:
      "Se modifica el artículo 31 del reglamento: desde el 1 de mayo de 2026 quedan prohibidos los alquileres por períodos menores a 30 días. Votación: 29 a favor, 7 en contra y 2 abstenciones.",
    claves: "alquiler temporario airbnb prohibido modificacion articulo 31 dias",
  },
  {
    id: "A-5",
    doc: "asamblea",
    ref: "Punto 4",
    titulo: "Cámaras de seguridad",
    texto:
      "Se aprueba instalar seis cámaras en accesos, cocheras y SUM, con costo incluido en las expensas ordinarias. Las imágenes se conservan 15 días y solo la administración puede acceder a ellas ante una denuncia formal.",
    claves: "camaras camara seguridad vigilancia robo grabacion imagenes",
  },
  {
    id: "A-6",
    doc: "asamblea",
    ref: "Punto 5",
    titulo: "Consejo de propietarios y honorarios",
    texto:
      "Se elige el consejo de propietarios: Martina Echenique (7B), Hugo Salvatierra (11C) y Paula Rinaldi (2D). Se aprueba un ajuste del 12 % en los honorarios de la administración a partir de abril.",
    claves: "consejo consejeros integrantes quienes honorarios administracion",
  },
  // ---------------- Acta del consejo ----------------
  {
    id: "C-1",
    doc: "consejo",
    ref: "Tema 1",
    titulo: "Mantenimiento de ascensores",
    texto:
      "Se cambia la empresa de mantenimiento a Elevar Servicios. El ascensor 2 estará fuera de servicio del 25 al 29 de agosto por la modernización de las botoneras.",
    claves: "ascensor ascensores elevador mantenimiento roto fuera servicio",
  },
  {
    id: "C-2",
    doc: "consejo",
    ref: "Tema 2",
    titulo: "Horario del encargado",
    texto:
      "El encargado, Ramón Ledesma, cumple horario de lunes a viernes de 7:00 a 15:00 y los sábados de 8:00 a 12:00. Fuera de ese horario, las emergencias se atienden por la guardia de la administración desde la app.",
    claves: "encargado portero conserje horario porteria emergencia guardia",
  },
  {
    id: "C-3",
    doc: "consejo",
    ref: "Tema 3",
    titulo: "Apertura de la pileta",
    texto:
      "Si el clima acompaña, la temporada de pileta 2026-2027 se adelanta al 22 de noviembre. La revisación médica se hará en portería los sábados de noviembre de 10:00 a 12:00.",
    claves: "pileta piscina temporada apertura revisacion medica noviembre",
  },
  {
    id: "C-4",
    doc: "consejo",
    ref: "Tema 4",
    titulo: "Bicicletero",
    texto: "El bicicletero se amplía a 24 lugares. Se asignan por orden de pedido y cada bicicleta debe registrarse en la administración.",
    claves: "bicicletero bicicleta bici bicis lugar",
  },
  {
    id: "C-5",
    doc: "consejo",
    ref: "Tema 5",
    titulo: "Obra de la terraza",
    texto: "La impermeabilización de la terraza terminó en julio. La empresa otorga una garantía de diez años sobre el trabajo.",
    claves: "terraza impermeabilizacion obra garantia terminada",
  },
  // ---------------- Circular ----------------
  {
    id: "E-1",
    doc: "circular",
    ref: "Liquidación",
    titulo: "Expensas de octubre",
    texto:
      "La expensa ordinaria de octubre para una unidad tipo de dos ambientes es de $ 142.500 (el monto de cada unidad depende de su coeficiente). Vence el 10 de octubre de 2026.",
    claves: "expensa expensas monto cuanto octubre vencimiento valor",
  },
  {
    id: "E-2",
    doc: "circular",
    ref: "Medios de pago",
    titulo: "Cómo pagar",
    texto:
      "Podés pagar por transferencia al alias TORRE.ALAMEDA.EXPENSAS, adherirte al débito automático o pagar en la administración los martes y jueves de 10:00 a 13:00. Después de transferir, subí el comprobante en la app.",
    claves: "pagar pago transferencia alias debito comprobante",
  },
  {
    id: "E-3",
    doc: "circular",
    ref: "Novedades",
    titulo: "Novedades del mes",
    texto:
      "Este mes la expensa incluye el aumento paritario del 6 % para el encargado y la renovación del seguro integral del edificio. La cuota extraordinaria de la terraza terminó en julio y ya no se cobra.",
    claves: "aumento novedades seguro cuota extraordinaria paritaria",
  },
  {
    id: "E-4",
    doc: "circular",
    ref: "Contacto",
    titulo: "Administración",
    texto:
      "Administración Llanos & Asociados atiende consultas de lunes a viernes de 9:00 a 17:00 por la app del consorcio. Para urgencias fuera de horario (agua, gas, ascensores) hay guardia las 24 horas desde la misma app.",
    claves: "administracion administrador contacto telefono urgencia reclamo consulta horario",
  },
];

export const fragmento = (id: string) => FRAGMENTOS.find((f) => f.id === id);
export const documento = (id: string) => DOCUMENTOS.find((d) => d.id === id)!;
