# CLAUDE.md — Portfolio de Francisco Zago

## 0. Cómo trabajamos

- Trabajás por **fases** (sección 11). Al terminar cada fase: frenás, resumís qué hiciste, me decís cómo probarlo (comandos copy-paste) y esperás mi OK antes de seguir.
- Antes de codear algo no trivial, explicá en 3–5 líneas qué vas a hacer y por qué.
- No agregues dependencias fuera del stack (sección 2) sin preguntarme.
- Si un dato falta, **no lo inventes**: dejá un `TODO:` visible en el archivo de contenido y avisame.
- Todo el contenido del sitio va en español rioplatense, con voseo ("escribime", "elegí", "mirá").

---

## 1. Objetivo del sitio

Un portfolio personal con **dos trabajos a la vez**:

1. **Mostrar trabajos reales** (hoy: 2 sitios en producción + 1 proyecto académico técnico).
2. **Captar clientes**: que un dueño de negocio, emprendedor o fotógrafo entienda en 10 segundos qué le puedo construir y me escriba.

**Audiencia principal:** clientes no técnicos (pymes, marcas, profesionales, fotógrafos) de Córdoba y Argentina.
**Audiencia secundaria:** gente técnica (otros devs, empresas). Lo técnico existe, pero va más abajo y dentro de los casos.

Regla de copy: en el home se habla del **resultado para el cliente**, no de la tecnología. El detalle técnico vive en las páginas de caso.

---

## 2. Stack

- **Next.js 15** (App Router) + **TypeScript** estricto
- **Tailwind CSS 4**
- **Motion** (`motion/react`) para animación
- `next/font` (Google Fonts), `next/image`
- **Resend** para el formulario de contacto + **zod** para validación
- Deploy en **Vercel**
- Sin base de datos ni CMS: todo el contenido en archivos TypeScript tipados dentro de `src/content/`
- Sin librerías de componentes (nada de shadcn, MUI, etc.): componentes propios y chicos
- Gestor de paquetes: npm

---

## 3. Datos personales (centralizar en `src/content/site.ts`)

```ts
nombre: "Francisco Zago"
nombreCorto: "Fran"
rol: "Desarrollador full-stack"
ubicacion: "Córdoba, Argentina"
zonaHoraria: "America/Argentina/Cordoba"
email: "zagofran1@gmail.com"
whatsapp: "5493516822148"            // para links wa.me
github: "https://github.com/FranZago1"
linkedin: "https://www.linkedin.com/in/francisco-zago-ab1829357"
instagram: "TODO: usuario de Instagram"
dominio: "TODO: dominio (si no hay, usar el .vercel.app)"
```

Todos los links de WhatsApp se arman con un helper `waLink(mensaje: string)` que devuelve `https://wa.me/5493516822148?text=<mensaje codificado>`. Nunca hardcodear el número en componentes.

---

## 4. Dirección visual

> **Actualización (pedido de Fran, después del primer deploy):** el sitio pasó a un estilo de
> "lienzo de diseño" más dinámico, inspirado en kushbothra.com pero con look profesional:
> grilla, regla, marcos de selección, stickers arrastrables, proyectos como carpetas con
> pestañas apiladas. Tipografía: Hanken Grotesk + JetBrains Mono (sin serif ni manuscrita).
> Sin fotos personales. Esto reemplaza lo que se oponga en esta sección (columna única de 680 px,
> serif display, y de la lista "NO van": mayúsculas mono, elementos inclinados y numeración).
> Detalle vigente en `docs/tokens.md`.

### Referencias
- **kushbothra.com**: de acá sale el tono editorial. Fondo blanco, titular grande con **imágenes chicas insertadas dentro del texto**, badge de disponibilidad, hora local visible, cierre "Hablemos" grande.
- **sahilcodex.vercel.app**, **ashishgogula.in**, **ratneshc.com**: de acá sale la estructura. **Una sola columna angosta**, texto primero, listas limpias, mucho aire, nada de ruido.

**Síntesis:** estructura de columna única de los tres minimalistas + dos o tres gestos de Kush (hero tipográfico con imágenes inline, badge + hora, CTA final grande). Sin foto personal: el hero es 100% tipográfico.

### Tokens (propuesta inicial; en la Fase 0 me presentás el plan de tokens final antes de codear)
- **Fondo:** blanco puro `#FFFFFF`. Solo modo claro (sin toggle de tema).
- **Texto principal:** negro casi puro (`#111111` o similar, definilo vos).
- **Texto secundario:** un gris medio con contraste AA sobre blanco.
- **Bordes/divisores:** gris muy claro, usados solo cuando separan información real.
- **Un solo acento**, usado con mucha moderación (badge de disponibilidad, estados de foco, link activo). Elegilo pensando en que no sea el default de siempre: nada de verde ácido, terracota ni violeta de SaaS.
- **Tipografía:** máximo dos familias y claramente distintas. Propuesta: una serif display con personalidad solo para el titular del hero y el "Hablemos" final, y una sans de buena legibilidad para todo lo demás. Elegí familias con criterio (no Inter/Geist por inercia) y justificá la elección en el checkpoint.
- **Contenedor:** columna de ~680 px, alineada a la izquierda. Largo de línea < 75 caracteres.
- **Radios:** jerarquía clara (tarjetas grandes vs. chips); no el mismo radio para todo.

### Cosas que NO van (son marcas de sitio genérico)
- Títulos de sección en MAYÚSCULAS con tracking, o en monoespaciada.
- Etiquetas decorativas encima de cada título.
- Una palabra del titular en itálica o en otro color como "acento".
- Flechas "→" pegadas al texto de botones y links.
- Metadatos unidos con puntos medios ("A · B · C") en la UI.
- Tarjetas idénticas con la misma sombra gris y gradientes decorativos.
- Glassmorphism, 3D, cursor custom, loaders de entrada, emojis como íconos.
- Numeración 01/02/03 salvo en el proceso de trabajo (que sí es una secuencia).

### Motion
- **Un solo momento orquestado**: la entrada del hero (el titular y los chips de imagen entrando en secuencia). Nada más se anima solo al cargar.
- Nada de fade-up en cada sección al hacer scroll.
- Sí se anima lo que responde a una acción del usuario: hover sutil en tarjetas de trabajo, apertura del lightbox, estados del formulario.
- Respetar siempre `prefers-reduced-motion` (sin animación de entrada en ese caso).

---

## 5. Rutas

```
/                                   Home
/trabajos/trendahaus                Caso TrendaHaus
/trabajos/benicioshop               Caso BenicioShop
/trabajos/unichat                   Caso UniChat (académico)
/demos/fotografia/editorial         Demo portfolio fotografía (estilo 1)
/demos/fotografia/cinematico        Demo portfolio fotografía (estilo 2)
/demos/fotografia/documental        Demo portfolio fotografía (estilo 3)
/api/contact                        Route Handler del formulario
```

Estructura sugerida:

```
src/
  app/
    (site)/layout.tsx               Layout del portfolio (header + footer)
    (site)/page.tsx
    (site)/trabajos/[slug]/page.tsx
    demos/fotografia/[estilo]/...   Layout propio por demo, SIN header del portfolio
    api/contact/route.ts
  components/
  content/
    site.ts  trabajos.ts  servicios.ts  demos.ts  stack.ts
  lib/
    wa.ts  (helper waLink)
```

---

## 6. Home: secciones en orden

### 6.1 Header
- Izquierda: "Francisco Zago".
- Derecha: badge "Disponible para proyectos" (punto con el color de acento) + **hora actual de Córdoba** (client component; renderizar después del montaje para evitar mismatch de hidratación).
- Navegación mínima por anclas: Trabajos, Servicios, Demos, Contacto. En mobile, que entre en una línea o se simplifique; nada de menú hamburguesa pesado.

### 6.2 Hero (tipográfico, sin foto)
- Saludo corto ("Hola, soy Fran.") + titular grande en la serif display con **2–3 chips de imagen inline** dentro de la frase (estilo Kush). Los chips son miniaturas de mis trabajos reales (TrendaHaus, BenicioShop) o de las demos.
- Propuesta de titular (podés mejorarla y proponerme 2 alternativas): *"Diseño y desarrollo [chip] sitios y sistemas web [chip] para negocios que quieren vender más."*
- Bajada: "Desarrollador full-stack en Córdoba. Landing pages, tiendas online, sistemas de reservas y más, desde la idea hasta el sitio publicado."
- CTA primario: **"Escribime por WhatsApp"** → `waLink("Hola Fran, vi tu portfolio y quiero consultarte por un proyecto.")`
- CTA secundario: **"Ver demos"** → ancla a la sección de demos.

### 6.3 Trabajos
Dos tarjetas grandes (una por fila), con imagen o video corto (mp4 `muted loop playsInline` con `poster`, lazy). Cada una: nombre, tipo de proyecto, año, una línea del problema que resolvió, 3–4 tags, y dos links: "Ver sitio" (externo) y "Ver caso" (página interna).

Contenido (en `trabajos.ts`; usar exactamente estos datos, no inventar métricas):

**TrendaHaus** — `https://www.trendahaus.com`
- Tipo: Plataforma de reservas. Año: 2025. Rol: Desarrollador full-stack (freelance).
- Cliente: multiespacio creativo y estudio fotográfico en Córdoba (estudio con ciclorama, sala creativa, salón de eventos, membresías).
- Qué se hizo: landing animada, sistema de turnos en tiempo real, panel de administración completo.
- Técnico: API REST propia para turnos, precios dinámicos y notas por fecha/servicio; auth por middleware (Basic Auth + token de admin); persistencia serverless con Vercel KV (Redis vía Upstash); animaciones con GSAP y Framer Motion.
- Stack: Next.js 15, React 19, TypeScript, Tailwind CSS 4, Framer Motion, GSAP, Vercel KV, Vercel.

**BenicioShop** — `https://www.benicioshop.com`
- Tipo: E-commerce. Año: 2025. Rol: Desarrollador full-stack (freelance).
- Cliente: marca de ropa vintage.
- Qué se hizo: tienda completa con drops exclusivos con countdown, acceso bloqueado antes del lanzamiento, gestión de stock y panel admin con métricas.
- Técnico: reserva de stock con vencimiento automático a los 2 minutos para evitar sobreventa; cron jobs en Vercel para limpieza; pagos con MercadoPago vía webhooks asincrónicos; panel con KPIs y gestión de pedidos (JWT); emails transaccionales con Resend.
- Stack: Next.js 14, TypeScript, PostgreSQL, Prisma, Tailwind CSS, MercadoPago, Resend, Vercel Blob, JWT, Vercel.

Imágenes: capturas y videos que yo te paso en `/public/trabajos/<slug>/` (desktop y mobile). **No usar iframes** de los sitios. Mientras no estén, placeholder neutro con `TODO`.

### 6.4 Servicios — "Qué puedo construirte"
Lista (no grilla de tarjetas iguales) de 9 tipos de proyecto. Cada ítem: nombre + una línea en lenguaje de cliente. Si hay evidencia, el ítem linkea a ella.

| Servicio | Línea | Link a evidencia |
|---|---|---|
| Landing pages | Una página pensada para que te contacten o te compren. | — |
| E-commerce | Tu tienda propia, con pagos por MercadoPago y stock controlado. | Caso BenicioShop |
| Marketplaces | Una plataforma donde muchos vendedores publican y venden. | — |
| Portfolios | Tu trabajo presentado como se merece. | Sección Demos |
| Web apps | Herramientas a medida que se usan desde el navegador. | Caso UniChat |
| Dashboards | Tus números en un solo lugar, siempre actualizados. | — |
| Sistemas de gestión | Clientes, stock, pedidos o turnos, todo ordenado. | — |
| Reservas | Turnos online con disponibilidad en tiempo real. | Caso TrendaHaus |
| Catálogos | Tus productos online, con consulta directa por WhatsApp. | — |

**Sin precios en ningún lugar del sitio.** Debajo de la lista: "Cada proyecto se presupuesta a medida. Contame qué necesitás y te respondo con una propuesta." + botón de WhatsApp.

### 6.5 Demos — Portfolios de fotografía
- Título tipo: "¿Sos fotógrafo? Elegí un estilo."
- Tres tarjetas con captura de la demo, nombre del estilo, una línea descriptiva y "Ver demo".
- Cada tarjeta lleva una etiqueta visible **"Demo con contenido ficticio"**. Las demos nunca se presentan como trabajo para clientes.
- La sección debe quedar preparada para sumar más verticales en el futuro (ej. demos de catálogo o landing) sin rediseñar: `demos.ts` agrupa por vertical.

### 6.6 Cómo trabajo
Cuatro pasos (acá sí va numeración, porque es una secuencia):
1. **Charlamos**: por WhatsApp o llamada, me contás qué necesitás.
2. **Propuesta**: te paso alcance, plazos y presupuesto.
3. **Diseño y desarrollo**: vas viendo avances y dando feedback.
4. **Publicación**: lo dejamos online y te explico cómo usarlo.

Breve: una línea por paso.

### 6.7 Otros proyectos — UniChat
Una tarjeta, más chica que las de Trabajos, con etiqueta visible **"Proyecto universitario"**.
- Línea en lenguaje de cliente: "Un chat con IA que responde usando tus propios documentos."
- Debajo, lo técnico (esto sí va a la vista, porque es lo que demuestra capacidad): microservicios en Go, RAG, mensajería asincrónica con RabbitMQ, búsqueda vectorial con Apache Solr, respuestas en streaming.
- Link a `/trabajos/unichat`. Link a GitHub: `TODO: repo si es público`.

### 6.8 Stack
Compacto, en filas por categoría, solo texto (sin grilla de logos gigante):
- **Frontend:** React, Next.js, React Native, Tailwind CSS, Framer Motion, GSAP
- **Backend:** Node.js, NestJS, Go (Gin), REST APIs, JWT, RBAC, RabbitMQ
- **Datos:** PostgreSQL, MySQL, MongoDB, Redis, Prisma, Apache Solr
- **Infraestructura:** Vercel, Linux, Docker, MinIO S3, cron jobs
- **IA:** RAG, embeddings, integración de LLMs (OpenAI, Ollama/Llama 3), búsqueda semántica
- **Pagos:** MercadoPago

### 6.9 Contacto — "Hablemos"
- Titular grande en la serif display (el segundo y último uso de esa familia).
- Una línea: "Contame tu idea y te respondo en el día." (si no puedo cumplir "en el día", avisame y lo cambiamos).
- Tres botones de canal: **WhatsApp** (link con mensaje precargado), **Instagram**, **Email** (`mailto:`).
- Formulario: nombre, email o WhatsApp (uno de los dos obligatorio), tipo de proyecto (select con los 9 servicios + "Otro"), mensaje. Ver sección 9.

### 6.10 Footer
© año actual, "Hecho en Córdoba", links a GitHub y LinkedIn. Mínimo.

---

## 7. Páginas de caso (`/trabajos/[slug]`)

Plantilla única, generada desde `trabajos.ts` (`generateStaticParams`):
1. Nombre + una línea de qué es.
2. Ficha: cliente (descripción genérica), tipo, año, rol, stack, link al sitio.
3. **El problema**: qué necesitaba el cliente.
4. **La solución**: funcionalidades, en lenguaje de cliente.
5. **Por dentro**: los detalles técnicos de la sección 6.3 (para UniChat: arquitectura de microservicios, pipeline RAG, RabbitMQ, Solr, streaming SSE, proveedor de IA intercambiable entre local y nube).
6. Capturas (desktop + mobile).
7. CTA final: "¿Querés algo así para tu negocio?" → `waLink("Hola Fran, vi el caso <nombre> y quiero algo parecido.")`

Para UniChat el CTA no aplica igual; usar "¿Te interesa un asistente con IA sobre tus documentos?".

---

## 8. Demos de fotografía

### Reglas comunes a las 3
- **Una sola página con scroll** por demo. Cada una tiene su propio layout, tipografías y colores (fuentes cargadas con `next/font` solo en esa ruta). No hereda el header ni el footer del portfolio.
- Un **fotógrafo ficticio** distinto por demo (nombre inventado, que no coincida con nadie conocido).
- Secciones: hero, galería (12–18 fotos), sobre mí, servicios (sin precios, "Consultar"), contacto (visual; los botones pueden abrir un aviso de que es una demo).
- **Galería con lightbox** propio, compartido entre las 3 demos pero estilizable: teclado (Esc, ←, →), swipe en mobile, foco atrapado mientras está abierto.
- **Barra fija de demo** (componente `DemoBar`, igual en las 3, discreta, abajo): "Esta es una demo de Francisco Zago. ¿Querés uno así?" + botón "Pedilo por WhatsApp" con `waLink("Hola Fran, me interesa un portfolio de fotografía estilo <Nombre del estilo>.")` + link "Volver al portfolio". Se puede minimizar, pero no ocultar del todo.
- **Imágenes:** de Unsplash (licencia libre), descargadas a `/public/demos/fotografia/<estilo>/`, convertidas a WebP con lado mayor de 2000 px como máximo. Registrar autor y URL de cada una en `CREDITS.md`. Si no tenés acceso a red, dejá placeholders y armame la lista de búsquedas sugeridas por estilo.
- `robots: noindex` en las demos, para que no compitan en buscadores con el portfolio.

### Estilo 1 — Editorial
- Para: retrato y bodas.
- Fondo blanco, serif display grande, mucho aire, grilla **asimétrica** (fotos de distintos tamaños con desfasajes intencionales).
- Transmite: elegancia, calma.

### Estilo 2 — Cinemático
- Para: moda y trabajo conceptual.
- Fondo negro (negro real, no gris oscuro tintado), fotos a sangre (full-bleed) una tras otra, sans condensada para títulos, texto mínimo.
- Transmite: impacto, drama.

### Estilo 3 — Documental cálido
- Para: familias, eventos, newborn.
- Paleta cálida y luminosa **sin caer en el combo crema + terracota** (buscá otra combinación cálida y justificala), galería tipo masonry, tipografía humanista y cercana.
- Transmite: cercanía, espontaneidad.

Los tres tienen que diferenciarse **a primera vista**, en una captura chica. Esa es la prueba de éxito de esta fase.

---

## 9. Formulario de contacto

- `POST /api/contact` (Route Handler).
- Validación con **zod** en cliente y servidor. Mensajes de error concretos ("Falta tu email o tu WhatsApp"), sin disculpas.
- **Honeypot** (campo oculto; si viene lleno, responder 200 sin enviar nada).
- Rate limit básico en memoria por IP (aceptado para v1; dejar comentado que en serverless no es global).
- Envío con **Resend**:
  - Variables: `RESEND_API_KEY`, `CONTACT_TO_EMAIL=zagofran1@gmail.com`.
  - `from: "Portfolio <onboarding@resend.dev>"` mientras no haya dominio verificado. Ojo: sin dominio verificado Resend solo envía al email de la cuenta de Resend, que tiene que ser `zagofran1@gmail.com`.
  - `replyTo`: el email del visitante, si lo dejó.
  - Asunto: `Nuevo contacto: <tipo de proyecto> — <nombre>`.
- Estados en UI: enviando, enviado ("Listo, te escribo pronto."), error (qué pasó + alternativa: "Escribime por WhatsApp").
- Crear `.env.example` con las variables.

---

## 10. Calidad

- **SEO:** Metadata API, `lang="es-AR"`, título "Francisco Zago — Desarrollo web en Córdoba", descripción orientada a cliente, imagen OG tipográfica (con `next/og`), `sitemap.ts`, `robots.ts`, JSON-LD tipo `Person`.
- **Performance:** objetivo Lighthouse ≥ 95 en mobile en todas las métricas. `next/image` con `sizes` correctos, videos lazy con poster, fuentes con `display: swap`.
- **Accesibilidad:** contraste AA, foco visible en todo lo interactivo, navegación completa con teclado, `alt` descriptivo en imágenes reales, reduced motion.
- **Responsive:** diseñado primero para mobile (la mayoría de los clientes llega desde Instagram o WhatsApp en el celular).
- Opcional en la última fase: `@vercel/analytics` con eventos en los clics de WhatsApp (para saber desde qué sección o demo me escriben).

---

## 11. Fases

**Fase 0 — Setup y plan visual**
Crear el proyecto, Tailwind 4, estructura de carpetas, archivos de contenido con los datos de este documento. **Presentarme el plan de tokens** (paleta con hex, tipografías con su rol y por qué, escala tipográfica, wireframe ASCII del home) y revisarlo contra la sección 4 antes de codear UI. → Checkpoint.

**Fase 1 — Home estático**
Todas las secciones de la sección 6 con contenido real, sin animaciones. → Checkpoint.

**Fase 2 — Páginas de caso**
Plantilla + los 3 casos. → Checkpoint.

**Fase 3 — Demos**
Primero **solo Editorial** + `DemoBar` + lightbox. → Checkpoint. Después Cinemático → Checkpoint. Después Documental → Checkpoint.

**Fase 4 — Contacto**
Formulario + Route Handler + Resend + `.env.example`. → Checkpoint (probamos un envío real).

**Fase 5 — Detalles**
Animación de entrada del hero con chips inline, hora de Córdoba, badge, hovers. → Checkpoint.

**Fase 6 — Pulido y deploy**
SEO, OG, sitemap, auditoría de accesibilidad y Lighthouse, deploy en Vercel (y dominio si ya está). → Checkpoint final.

---

## 12. Reglas de contenido (no negociables)

- No inventar clientes, métricas, testimonios ni resultados en el portfolio. Los testimonios solo pueden existir **dentro de las demos**, ficticios y en contexto de demo.
- Las demos siempre rotuladas como demo.
- UniChat siempre rotulado como proyecto universitario.
- Sin precios.
- Voseo en todo el sitio.
