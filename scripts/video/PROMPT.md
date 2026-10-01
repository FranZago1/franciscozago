# Prompt: video de motion UI para franciscozago.dev

<inputs>
Ya están definidos (no me los pidas, salvo la música si querés proponer otra):
- Estados (12, todos son servicios que ofrezco): botón "Pedí tu web" → loader → check → isla con mi marca "Francisco Zago · Desarrollo web" → tarjeta de producto de e-commerce (agregar al carrito) → calendario de reservas (día + horario) → toggle "Recordatorio por WhatsApp" → tabs de dashboard → gráfico que se dibuja con tooltip → slider de un cotizador (m²) → ⌘K → toast "Sitio publicado" → cierre de marca → vuelta al botón.
- Color: blanco y negro + un solo acento, el teal de mi portfolio #0E6A70.
- Tipografías: las de mi portfolio, Hanken Grotesk (UI y titulares) y JetBrains Mono (rótulos en mayúsculas con tracking). No uses Geist.
- Música: 120 BPM, libre para uso comercial. Si no conseguís una de Mixkit, sintetizala con numpy (bombo en negras, clap en 2 y 4, hats en corcheas, bajo y acordes con sidechain) para no depender de licencias.
</inputs>

<direction>
Motion UI nivel Dribbble para el portfolio de un desarrollador web. Una sola forma, sin cortes: cada estado es el mismo elemento que cambia de tamaño, radio y color, y su contenido se intercambia con un blur corto. Un cursor provoca cada cambio con clics y arrastres reales. Lienzo gris cálido (#ECEAE6), componentes en blanco y negro, el acento solo donde hay una acción o un dato. Springs en todo, como mucho un overshoot mínimo. La cámara hace zoom para que cada estado llene el cuadro. El último cuadro es igual al primero, así loopea.

Tiene que quedar claro que es MI video y no un video de una web: un HUD fijo fuera de la cámara con "FRANCISCO ZAGO" arriba a la izquierda, "DESARROLLO WEB" arriba a la derecha y "franciscozago.dev" abajo a la derecha. Abajo a la izquierda, el nombre del servicio que se está mostrando (BOTÓN · CTA, MARCA, E-COMMERCE, RESERVAS, DASHBOARD, COTIZADOR, WEB APP, PUBLICADO, PORTFOLIO), que cambia con blur. Arriba, una regla de 28 marcas (una por beat) como la regla de mi portfolio, con el beat actual en el acento. El cierre es mi wordmark: "Francisco Zago" grande con un cuadradito del acento pegado al final y, abajo de una línea, "DESARROLLO WEB" y "franciscozago.dev".

Contenido realista y en español rioplatense (voseo): "Pedí tu web", "Agregar al carrito", "Reservá tu turno", "Buscá una acción…". Todo el contenido de los estados es ficticio (producto, turnos, métricas de demo).

Prohibido: easing con rebote, explosiones de partículas, glows, degradés en el chrome de la UI, íconos con trazos distintos entre sí (todos 24×24 con el mismo grosor), tiempo muerto y cualquier cosa que parezca una plantilla.
</direction>

<structure>
120 BPM, 7 compases (28 beats, 14 s), pasa algo en cada beat:
- 0 botón "Pedí tu web" con flecha, el cursor llega · 1 clic: el botón se hunde y se vuelve loader · 2 check sobre el acento · 3 isla negra con mi marca.
- 4 tarjeta de producto (bolso, precio en mono, botón negro) · 5 clic en "Agregar al carrito": el botón pasa al acento con "Agregado" y aparece el badge "1" en el carrito.
- 6 calendario "Reservá tu turno" con 7 días · 7 clic en un día: el indicador se estira hacia el destino (bordes con springs distintos) · 8 clic en un horario · 9 el toggle "Recordatorio por WhatsApp" se prende justo en el beat.
- 10 la perilla del toggle se convierte en el indicador líquido de unas tabs (Ventas / Turnos / Clientes) · 11 clic en "Turnos" · 12 las tabs se abren en un gráfico "Turnos por semana" que se dibuja solo · 13 y 14 el cursor pasa por dos puntos y el tooltip se mueve y cambia el dato.
- 15 se colapsa en el slider de un cotizador ("Superficie a reformar") · 16 el cursor agarra la perilla · 17 llega al máximo · 18 sigue de largo y la barra se estira como goma · 19 suelta y vuelve con un spring.
- 20 ⌘K "Buscá una acción…" con 5 acciones · 21-22 tipea "publ" en corcheas y la lista se filtra hasta "Publicar sitio" (la forma se achica con la lista) · 23 enter.
- 24 toast negro "Sitio publicado" · 25 cierre con mi wordmark · 26 entra la línea "DESARROLLO WEB — franciscozago.dev" · 27 vuelve al botón, con el cursor en la misma posición y velocidad que en el cuadro 0.
</structure>

<build>
1. Un solo archivo HTML, cuadrado de 1440×1440. Todos los estilos se calculan desde el tiempo dentro de seek(t): nada de transiciones CSS, timers ni estado que pase de un cuadro a otro.
2. Los springs son respuestas al escalón en forma cerrada. Un valor que cambia de objetivo muchas veces es la suma de un spring por cambio, así sigue siendo una función pura del tiempo. Para el loop, sumá también la copia de cada cambio desplazada un período (t + T), con el último objetivo como valor inicial: así f(0) = f(T), con la misma velocidad.
3. Los dos bordes del indicador de tabs van en springs distintos: el borde de adelante se estira antes que el de atrás. Lo mismo para la perilla del toggle y el indicador de días.
4. Los arrastres son manipulación directa: mientras el cursor está apretado, el valor sale de su posición. Al soltarlo, vuelve con un spring desde donde quedó.
5. Analizá la música con numpy para sacar la grilla de beats y arrancá en un downbeat (correlacioná la mezcla con el bombo y verificá que los 28 golpes caigan en la grilla). Ubicá cada sonido de UI (clics, pop del badge, whoosh en cada morph, teclas, enter, campanita del toast) alineando su pico medido con el evento.
6. Renderizá con Playwright: 4 subcuadros por cuadro, mezclados con tmix de ffmpeg para el motion blur, a 60 fps. Exportá un master en 1440 y versiones web de 1080 y 720 en H.264 con faststart, más un póster del cuadro 0.
7. Antes del render completo, sacá un cuadro por beat y una hoja de contactos. Corregí lo que esté fuera de la grilla, apretado, cortado por el borde de la forma o difícil de leer.
</build>

<gotchas>
Nunca pongas will-change en algo que la cámara escala, o el texto se ve borroso. El texto que cambia adentro de un contenedor que se transforma necesita sus propios tiempos de entrada y salida, o se superpone. El último cuadro tiene que ser idéntico al primero, cursor y velocidad incluidos, o el loop salta. Lo que se estira (slider, tooltip) tiene que entrar dentro de la forma, porque la forma recorta su contenido. El HUD va fuera de la cámara para que tenga siempre el mismo tamaño.
</gotchas>

<start>
Mostrame la lista de estados sobre la grilla de beats y la hoja de contactos de un cuadro por beat antes del render completo.
</start>
