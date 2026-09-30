# Créditos de imágenes

## Estado actual

Las fotos de las demos son **placeholders generados** (`scripts/placeholders.mjs`): en el entorno donde se armó el sitio no había acceso a Unsplash.
Las capturas de las tarjetas del home (`captura.webp`) son capturas reales de cada demo (`scripts/capturas-demos.mjs`).

## Cómo reemplazarlas

1. Buscar cada foto en [Unsplash](https://unsplash.com) (licencia Unsplash, uso libre) con las búsquedas sugeridas de abajo, respetando la orientación.
2. Convertir a WebP con lado mayor de 2000 px como máximo, por ejemplo:
   `cwebp -q 80 -resize 2000 0 original.jpg -o foto-02.webp` para horizontales, `-resize 0 2000` para verticales y cuadradas (o Squoosh, o cualquier conversor).
3. Guardarla con el mismo nombre en `/public/demos/fotografia/<estilo>/`.
4. Completar autor y URL en la tabla correspondiente.
5. Cuando estén todas las de una demo, poner `placeholder: false` en `src/content/demos.ts` (así el `alt` pasa a describir la foto) y regenerar las capturas con `node scripts/capturas-demos.mjs`.

Orientaciones: vertical 4:5, horizontal 3:2, cuadrada 1:1.

## Editorial (`/public/demos/fotografia/editorial/`)

Estilo: Blanco, mucho aire y fotos en una grilla asimétrica. Elegante y calmo.

| Archivo | Orientación | Búsqueda sugerida | Autor | URL |
|---|---|---|---|---|
| foto-01.webp | vertical | retrato de mujer con luz de ventana | TODO | TODO |
| foto-02.webp | horizontal | novios caminando en un campo al atardecer | TODO | TODO |
| foto-03.webp | cuadrada | detalle de manos con anillos | TODO | TODO |
| foto-04.webp | vertical | ramo de flores blancas sobre una mesa | TODO | TODO |
| foto-05.webp | vertical | retrato de hombre en blanco y negro | TODO | TODO |
| foto-06.webp | horizontal | ceremonia al aire libre bajo árboles | TODO | TODO |
| foto-07.webp | vertical | vestido de novia colgado junto a una ventana | TODO | TODO |
| foto-08.webp | cuadrada | pareja riendo abrazada | TODO | TODO |
| foto-09.webp | vertical | retrato de perfil con fondo neutro | TODO | TODO |
| foto-10.webp | horizontal | mesa de banquete con velas | TODO | TODO |
| foto-11.webp | vertical | novia mirando por la ventana | TODO | TODO |
| foto-12.webp | cuadrada | zapatos y detalles de la boda | TODO | TODO |
| foto-13.webp | horizontal | pareja bailando de noche | TODO | TODO |
| foto-14.webp | vertical | retrato de mujer mayor sonriendo | TODO | TODO |
| foto-15.webp | horizontal | salida de la ceremonia con pétalos | TODO | TODO |

## Cinemático (`/public/demos/fotografia/cinematico/`)

Estilo: Fondo negro y fotos a sangre, una tras otra. Impacto y drama.

| Archivo | Orientación | Búsqueda sugerida | Autor | URL |
|---|---|---|---|---|
| foto-01.webp | horizontal | modelo con luz dura y sombras marcadas | TODO | TODO |
| foto-02.webp | vertical | retrato en clave baja con fondo negro | TODO | TODO |
| foto-03.webp | horizontal | moda urbana de noche con luces de neón | TODO | TODO |
| foto-04.webp | horizontal | silueta a contraluz | TODO | TODO |
| foto-05.webp | vertical | detalle de tela en movimiento | TODO | TODO |
| foto-06.webp | horizontal | modelo en escalera de hormigón | TODO | TODO |
| foto-07.webp | vertical | retrato con humo y luz lateral | TODO | TODO |
| foto-08.webp | horizontal | editorial de moda en blanco y negro | TODO | TODO |
| foto-09.webp | horizontal | figura caminando en un pasillo oscuro | TODO | TODO |
| foto-10.webp | vertical | rostro parcialmente iluminado | TODO | TODO |
| foto-11.webp | horizontal | moda en paisaje desértico | TODO | TODO |
| foto-12.webp | cuadrada | manos con joyas sobre fondo negro | TODO | TODO |
| foto-13.webp | horizontal | modelo reflejado en un vidrio | TODO | TODO |
| foto-14.webp | vertical | retrato con luz roja | TODO | TODO |

## Documental cálido (`/public/demos/fotografia/documental/`)

Estilo: Colores cálidos y luminosos, galería tipo mosaico. Cercano y espontáneo.

| Archivo | Orientación | Búsqueda sugerida | Autor | URL |
|---|---|---|---|---|
| foto-01.webp | horizontal | familia jugando en el pasto | TODO | TODO |
| foto-02.webp | cuadrada | bebé recién nacido durmiendo | TODO | TODO |
| foto-03.webp | vertical | niña riendo con el pelo al viento | TODO | TODO |
| foto-04.webp | vertical | padre levantando a su hijo en brazos | TODO | TODO |
| foto-05.webp | horizontal | cumpleaños infantil con torta y velas | TODO | TODO |
| foto-06.webp | cuadrada | manos de bebé sobre la mano de la madre | TODO | TODO |
| foto-07.webp | horizontal | hermanos saltando en la cama | TODO | TODO |
| foto-08.webp | vertical | abuela y nieta cocinando | TODO | TODO |
| foto-09.webp | horizontal | familia caminando en la playa | TODO | TODO |
| foto-10.webp | vertical | niño con globo en una plaza | TODO | TODO |
| foto-11.webp | vertical | madre amamantando con luz de ventana | TODO | TODO |
| foto-12.webp | horizontal | perro y niños en el jardín | TODO | TODO |
| foto-13.webp | cuadrada | pies de bebé con mantita tejida | TODO | TODO |
| foto-14.webp | horizontal | festejo familiar alrededor de una mesa | TODO | TODO |
| foto-15.webp | vertical | niña soplando un diente de león | TODO | TODO |
| foto-16.webp | horizontal | familia abrazada al atardecer | TODO | TODO |
