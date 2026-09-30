# Plan de tokens — Portfolio

Revisado contra la sección 4 del brief. Contrastes calculados con la fórmula WCAG 2.x.

## Paleta (solo modo claro)

| Token | Hex | Uso | Contraste sobre `#FFFFFF` |
|---|---|---|---|
| `--color-bg` | `#FFFFFF` | Fondo | — |
| `--color-ink` | `#111111` | Texto principal, titulares, botón primario | 18,88:1 |
| `--color-muted` | `#5B5B5B` | Texto secundario, metadatos | 6,79:1 (AA texto normal) |
| `--color-line` | `#E7E7E7` | Divisores, bordes de tarjetas (solo cuando separan información) | 1,24:1 (decorativo) |
| `--color-surface` | `#F5F5F4` | Fondo de placeholders y de chips de imagen | — |
| `--color-accent` | `#0E6A70` | Punto del badge, anillo de foco, link activo, subrayado en hover | 6,34:1 (AA texto y ≥3:1 no textual) |

**Por qué azul petróleo.** El brief descarta verde ácido, terracota y violeta SaaS. Un azul
petróleo profundo es sobrio, se lee como "tinta" junto al negro, pasa AA incluso como texto
y como anillo de foco, y no se confunde con el azul default de links del navegador. Se usa en
tres lugares y nada más.

## Tipografía (dos familias)

| Rol | Familia | Dónde | Por qué |
|---|---|---|---|
| Display serif | **Newsreader** (Google Fonts, variable con eje óptico) | Solo el titular del hero y "Hablemos" | Serif editorial diseñada para titulares de prensa: contraste alto en tamaños grandes gracias al eje `opsz`, carácter sin ser decorativa. Soporta bien acentos, ñ y ¿¡. Da el tono de kushbothra sin copiar su fuente. |
| Sans de lectura | **Hanken Grotesk** (variable) | Todo lo demás | Grotesca con aperturas amplias y buena legibilidad en tamaños chicos de mobile. Es neutra sin ser genérica (proporciones algo más estrechas y terminaciones más cálidas que las grotescas de sistema) y no es Inter/Geist. |

Ambas con `display: "swap"` y subset `latin` (incluye latin-1: á é í ó ú ñ ¿ ¡).

## Escala tipográfica (base 17 px, razón ≈ 1,25)

| Token | Tamaño | Uso |
|---|---|---|
| `text-sm` | 14 px | Metadatos, etiquetas, footer |
| `text-base` | 17 px | Cuerpo |
| `text-lg` | 19 px | Bajada del hero, líneas destacadas |
| `text-xl` | 22 px | Títulos de tarjeta |
| `text-2xl` | 27 px | Títulos de sección (sans, peso 600, sin mayúsculas) |
| `text-display` | `clamp(2.5rem, 7vw, 4.5rem)` | Hero y "Hablemos" (serif) |

Interlineado: 1,6 cuerpo; 1,1 display. Largo de línea: el contenedor de 680 px con cuerpo de
17 px da ≈ 70 caracteres (< 75).

## Espaciado, contenedor y radios

- Contenedor: `max-width: 680px`, alineado a la izquierda con margen izquierdo que crece en
  desktop (`ml-[max(1.25rem,calc((100vw-1100px)/2))]`), padding lateral 20 px en mobile.
- Separación entre secciones: 96 px mobile / 128 px desktop. Sin divisores entre secciones: el aire separa.
- Radios con jerarquía:
  - `--radius-card` 16 px — tarjetas de trabajo y demo.
  - `--radius-media` 10 px — imágenes sueltas en casos.
  - `--radius-chip` 8 px — chips de imagen dentro del titular.
  - `--radius-pill` 999 px — badge de disponibilidad y botones.

## Motion

Un solo momento orquestado: entrada del hero (línea a línea, chips con escala suave). El
resto solo responde a acciones: hover de tarjetas (la imagen sube 1,5 % de escala), lightbox,
estados del formulario. Con `prefers-reduced-motion` no hay entrada.

## Chequeo contra "cosas que NO van"

- Títulos de sección en sans, caja normal, sin tracking ni mono. ✔
- Sin etiquetas decorativas sobre los títulos (las etiquetas "Demo con contenido ficticio" y
  "Proyecto universitario" son informativas y obligatorias). ✔
- El titular no tiene palabra en itálica ni en otro color. ✔
- Botones y links sin "→". ✔
- Metadatos como lista o separados por espacio/renglón, sin "·". ✔
- Tarjetas sin sombra ni gradiente; el borde aparece solo en la imagen. ✔
- Sin glass, 3D, cursor custom, loader ni emojis. ✔
- Numeración solo en "Cómo trabajo". ✔

## Wireframe del home (mobile primero; en desktop la misma columna, alineada a la izquierda)

```
┌──────────────────────────────────────────────┐
│ Francisco Zago        ● Disponible   14:32   │  header
│ Trabajos  Servicios  Demos  Contacto         │  (nav en una línea)
├──────────────────────────────────────────────┤
│ Hola, soy Fran.                              │
│                                              │
│ Diseño y desarrollo [▣] sitios               │  hero serif
│ y sistemas web [▣] para negocios             │  con chips de imagen
│ que quieren vender más.                      │
│                                              │
│ Desarrollador full-stack en Córdoba. …       │  bajada
│ ( Escribime por WhatsApp )  Ver demos        │  CTAs
├──────────────────────────────────────────────┤
│ Trabajos                                     │
│ ┌──────────────────────────────────────────┐ │
│ │            captura / video               │ │
│ └──────────────────────────────────────────┘ │
│ TrendaHaus                                   │
│ Plataforma de reservas, 2025                 │
│ Sus clientes reservan…                       │
│ Reservas online  Turnos  Panel  Landing      │  tags
│ Ver sitio   Ver caso                         │
│ (BenicioShop, igual)                         │
├──────────────────────────────────────────────┤
│ Qué puedo construirte                        │
│ Landing pages ─ Una página pensada…          │  lista de 9
│ E-commerce ─ Tu tienda propia… (Mirá el caso)│
│ …                                            │
│ Cada proyecto se presupuesta a medida…       │
│ ( Escribime por WhatsApp )                   │
├──────────────────────────────────────────────┤
│ ¿Sos fotógrafo? Elegí un estilo.             │
│ [captura] Editorial   Demo con cont. ficticio│  3 tarjetas apiladas
│ [captura] Cinemático                         │  (2 columnas en desktop
│ [captura] Documental cálido                  │   no: columna única)
├──────────────────────────────────────────────┤
│ Cómo trabajo                                 │
│ 1 Charlamos  2 Propuesta  3 Diseño  4 Public.│  lista numerada
├──────────────────────────────────────────────┤
│ Otros proyectos                              │
│ ┌ UniChat  [Proyecto universitario] ───────┐ │  tarjeta chica
│ │ Un chat con IA… / microservicios en Go…  │ │
│ └──────────────────────────────────────────┘ │
├──────────────────────────────────────────────┤
│ Stack                                        │
│ Frontend   React, Next.js, …                 │  filas de texto
├──────────────────────────────────────────────┤
│ Hablemos                                     │  serif grande
│ Contame tu idea y te respondo en el día.     │
│ ( WhatsApp ) ( Instagram ) ( Email )         │
│ [ formulario ]                               │
├──────────────────────────────────────────────┤
│ © 2026  Hecho en Córdoba   GitHub  LinkedIn  │
└──────────────────────────────────────────────┘
```

## Demos de fotografía (tokens propios, independientes del portfolio)

| Estilo | Fondo | Texto | Acento | Tipografías |
|---|---|---|---|---|
| Editorial | `#FFFFFF` | `#1A1A1A` / `#6B6B6B` | — | Cormorant Garamond (títulos) + Jost (texto) |
| Cinemático | `#000000` | `#FFFFFF` / `#9A9A9A` | — | Anton (títulos, condensada) + Archivo (texto) |
| Documental cálido | `#FCEBDD` (durazno claro) | `#2B1B2E` (ciruela) / `#6B5A6E` | `#F2B233` (girasol, solo fondos) y `#7A4B00` (texto) | Nunito (títulos y texto, humanista redondeada) |

**Documental: por qué durazno + ciruela + girasol.** Lo cálido sale de la luz (durazno
luminoso, amarillo girasol) y no de la tierra (crema + terracota). El ciruela profundo
reemplaza al marrón habitual: mantiene la calidez, da 13,9:1 de contraste y se diferencia
del cliché "boho".
