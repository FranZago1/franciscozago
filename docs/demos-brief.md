# Brief de demos (para quien construya una demo nueva)

Las demos son lo que ve un posible cliente de Francisco Zago antes de escribirle. Tienen que parecer
**sitios reales de agencia**, no plantillas. Cada una es la carta de presentación de un servicio.

## Estructura de archivos (no tocar nada fuera de esto)

- Página: `src/app/demos/<vertical>/<slug>/page.tsx` + `layout.tsx` (fuentes con `next/font/google`
  propias de esa demo, máximo 2 familias, `display: "swap"`, y `metadata` con `title` y `description`).
- Componentes y datos: `src/demos/<vertical>/<slug>/*` (y `src/demos/<vertical>/shared/*` si hace falta
  compartir algo entre las 3 demos de la vertical).
- Imágenes: `public/demos/<vertical>/<slug>/*.webp`, generadas por `scripts/demos/<vertical>.mjs`.
- **No editar** archivos compartidos (`src/components/**`, `src/content/**`, `globals.css`, `package.json`, etc.).
  Si algo compartido hace falta, se resuelve dentro de la demo.
- No se agregan dependencias. Disponibles: React 19, Next 15 (App Router), Tailwind 4, `motion` (motion/react),
  `zod`, y `sharp` para scripts.

## Obligatorio en cada demo

- Al final de la página: `<DemoBar estilo="<Nombre del estilo>" mensaje="Hola Fran, vi la demo <X> y quiero algo así para mi negocio." otrosHref="/demos/<vertical>" pregunta="¿Querés uno así?" />`
  (`import { DemoBar } from "@/components/demos/DemoBar"`). Dejar `padding-bottom` suficiente (~7rem)
  para que la barra fija no tape el final.
- El `robots: noindex` ya lo hereda de `src/app/demos/layout.tsx`: no sobrescribirlo.
- Texto 100 % en español rioplatense con voseo ("reservá", "elegí", "mirá", "escribinos").
- Negocio, personas, productos, reseñas y precios **ficticios**. Nombres inventados que no sean marcas
  reales. Un pie de página que diga "Demo con contenido ficticio".
- Nada de números de WhatsApp o emails reales de negocios. Si hay "pedir por WhatsApp", mostrar una
  vista previa del mensaje en un modal ("Así te llegaría el pedido") en lugar de abrir WhatsApp.
- Formularios: validan, muestran estados (enviando / listo / error) y al final aclaran que es una demo.
  No envían nada a ningún servidor.

## Calidad visual (lo más importante)

- Cada demo con identidad propia: paleta, tipografía, layout y tono distintos entre las 3 del mismo servicio.
  Tienen que distinguirse en una captura chica.
- Nivel de detalle de sitio profesional: jerarquía tipográfica cuidada, espaciado generoso y consistente,
  estados hover/focus/active, microinteracciones, bordes y sombras con criterio, iconografía SVG propia.
- **Sin emojis como íconos.** Íconos en SVG inline, coherentes entre sí.
- **Imágenes:** no hay acceso a bancos de fotos. Crear ilustraciones propias en SVG (productos,
  espacios, comida, personas estilizadas, texturas) y exportarlas a WebP con `sharp` desde
  `scripts/demos/<vertical>.mjs` (nombres de archivo estables y descriptivos, ej. `producto-remera-negra.webp`).
  Pueden ser ilustración plana, isométrica, "producto sobre fondo de color" con sombras suaves, etc.
  Tienen que verse intencionales y lindas, no placeholders grises. También se pueden usar SVG inline
  directamente en componentes cuando convenga (íconos, gráficos, mockups de UI).
  Usar `next/image` para los WebP (con `sizes` correctos). Cada imagen con `alt` descriptivo.
- Mobile primero: tiene que verse impecable a 390 px y a 1440 px. Sin scroll horizontal.

## Interacción

- Al menos una interacción protagonista que funcione de verdad (carrito, filtros, calendario, drag & drop,
  gráficos con tooltip, etc.), con estado en el cliente (y `localStorage` envuelto en try/catch si suma).
- Componentes interactivos como client components chicos; el resto server components.
- Accesibilidad: labels en inputs, foco visible, todo operable con teclado, `aria-live` para cambios
  importantes (ej. "Agregado al carrito"), roles correctos en modales (foco atrapado, Esc cierra).
- Respetar `prefers-reduced-motion`.
- Performance: nada de librerías pesadas; gráficos en SVG propio. Evitar re-renders innecesarios.

## Verificación antes de terminar

1. `npx tsc --noEmit` y `npx eslint <tus archivos>` sin errores.
2. `npx next dev -p <puerto>` y recorrer cada demo con Playwright
   (global en `/opt/node22/lib/node_modules/playwright`, lanzar Chromium con `args: ["--no-proxy-server"]`;
   para curl a localhost usar `--noproxy localhost`).
3. Capturas a 390 px y 1440 px (página completa, scrolleando antes para cargar lo lazy) y **mirarlas**:
   corregir todo lo que se vea desprolijo, desalineado, vacío o poco profesional.
4. Probar la interacción principal con Playwright (clicks, teclado) y revisar que no haya errores en consola
   ni scroll horizontal.
