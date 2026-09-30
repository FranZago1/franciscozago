# Plan de tokens — Portfolio

Dirección actual: **lienzo de diseño profesional**. El sitio se presenta como un archivo abierto en
un editor: grilla de fondo, regla con píxeles, marcos de selección con handles, elementos
arrastrables y proyectos como carpetas con pestañas. La tipografía es sobria (grotesca + mono)
para que el color y la interacción aporten la personalidad sin volverlo infantil.

Contrastes calculados con la fórmula WCAG 2.x.

## Paleta

| Token | Hex | Uso | Contraste |
|---|---|---|---|
| `--color-bg` | `#FFFFFF` | Fondo | — |
| `--color-grid` | `#EFEFEF` | Grilla de fondo (132 px) | decorativo |
| `--color-ink` | `#111111` | Texto, bordes de marcos, botones | 18,88:1 sobre blanco |
| `--color-muted` | `#5B5B5B` | Texto secundario, rótulos mono | 6,79:1 sobre blanco |
| `--color-accent` | `#0E6A70` | Color de "selección": marcos, handles, foco, números de sección | blanco sobre petróleo 6,34:1 |
| `--color-mostaza` | `#F2B705` | Stickers, bloques, íconos | tinta sobre mostaza 10,39:1 |
| `--color-menta` | `#8FD6B4` | Stickers, bloques, íconos | tinta sobre menta 11,19:1 |
| `--color-rosa` | `#D6284B` | Stickers, bloques, íconos | blanco sobre rosa 4,92:1 |
| `--color-celeste` | `#7CC8F0` | Stickers, bloques, íconos | tinta sobre celeste 10,23:1 |
| `--color-choco` | `#6B2E1F` | Stickers | blanco sobre choco 10,32:1 |

## Tipografía

| Rol | Familia | Uso |
|---|---|---|
| Sans | **Hanken Grotesk** | Wordmark "Francisco Zago" (600, tracking −0,055 em), titulares (500, tracking −0,035 em) y cuerpo |
| Mono | **JetBrains Mono** 400/500 | Rótulos en mayúsculas, números de sección `(01)`, reloj, regla, etiquetas de carpeta, botones |

Se descartaron la manuscrita (Caveat) y un wordmark de bloques redondeados: daban un tono
infantil. La personalidad la ponen el color, los marcos y la interacción, no la letra.

Escala: cuerpo 17 px; titulares de sección `clamp(2.2rem, 5vw, 3.6rem)`; titulares grandes
`clamp(2.4rem, 5.6vw, 4.6rem)`; wordmark `clamp(2.9rem, 9.5vw, 7.25rem)`.

## Componentes del lienzo (`src/components/canvas/`)

- `Ruler`: regla superior con marcador que sigue al mouse (solo con puntero fino).
- `LiveClock`: hora de Córdoba con segundos.
- `SelectionFrame`: marco con 4 handles, nombre del frame y etiqueta de medidas.
- `Draggable`: arrastre propio con pointer events, limitado al contenedor, sin librerías.
- `Sticker`: `Cinta` (etiqueta de color), `CursorTag` (cursor de colaboración con nombre), `Polaroid` (captura suelta).
- `Icons`: íconos geométricos propios en grilla de 24, de dos colores.
- `Eyebrow`: rótulo de sección `(0N) Nombre`.

## Motion

Un solo momento orquestado: al cargar, entra el nombre y aparecen los stickers en secuencia
(CSS puro). El resto responde al usuario: arrastre, hover (elementos que suben 2 px o se
enderezan), marcador de la regla y apilado de carpetas con `position: sticky`. Con
`prefers-reduced-motion` no hay entrada; el arrastre sigue disponible.

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
