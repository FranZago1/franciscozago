# Portfolio de Francisco Zago

Sitio personal: trabajos, servicios, demos de portfolios de fotografía y contacto.
La especificación completa está en [`Portfolio de desarrollo web.md`](./Portfolio%20de%20desarrollo%20web.md)
y el plan visual en [`docs/tokens.md`](./docs/tokens.md).

Stack: Next.js 15 (App Router) + TypeScript + Tailwind CSS 4 + Motion + Resend + zod. Sin base de datos ni CMS.

## Desarrollo

```bash
npm install
cp .env.example .env.local   # completar RESEND_API_KEY
npm run dev                  # http://localhost:3000
```

Chequeos:

```bash
npm run lint
npm run typecheck
npm run build && npm start
```

## Dónde se edita el contenido

Todo está en `src/content/`:

| Archivo | Qué tiene |
|---|---|
| `site.ts` | Datos personales, Instagram, dominio, disponibilidad |
| `home.ts` | Titular del hero (con chips de imagen), bajada y textos de secciones |
| `trabajos.ts` | TrendaHaus, BenicioShop y UniChat (home + páginas de caso) |
| `servicios.ts` | Los 9 servicios y las opciones del formulario |
| `demos.ts` | Demos agrupadas por vertical, fotógrafos ficticios y fotos |
| `stack.ts` | Stack por categoría y pasos de "Cómo trabajo" |

Los links de WhatsApp se arman siempre con `waLink()` de `src/lib/wa.ts`.
Buscá `TODO` en `src/content/` para ver lo que falta completar. En `npm run dev` las imágenes
pendientes muestran una marca amarilla "TODO" (en producción no aparece).

## Imágenes

- **Trabajos:** `public/trabajos/<slug>/desktop.webp` (16:10), `mobile.webp` (390×844 aprox.) y
  opcional `video.mp4` corto sin audio. Al reemplazarlas, poner `placeholder: false` (y `video` si hay)
  en `trabajos.ts`.
- **Demos:** ver [`CREDITS.md`](./CREDITS.md) con la lista de fotos y búsquedas sugeridas en Unsplash.
- `node scripts/placeholders.mjs` regenera los placeholders que falten (no pisa archivos existentes).
- `node scripts/capturas-demos.mjs http://localhost:3000` rehace las capturas de las demos que se
  ven en el home (requiere Playwright instalado globalmente).

## Formulario de contacto

`POST /api/contact` valida con zod (mismo esquema que el cliente), descarta bots con un honeypot,
limita 5 envíos cada 10 minutos por IP (en memoria: en serverless no es global) y envía con Resend.

Variables (en Vercel: Settings → Environment Variables):

| Variable | Valor |
|---|---|
| `RESEND_API_KEY` | API key de Resend |
| `CONTACT_TO_EMAIL` | `zagofran1@gmail.com` |

Mientras no haya dominio verificado en Resend, el remitente es `onboarding@resend.dev` y Resend
solo entrega al email dueño de la cuenta, que tiene que ser `zagofran1@gmail.com`.

## Deploy en Vercel

1. Importar el repo en Vercel (framework: Next.js, sin cambios en build ni output).
2. Cargar `RESEND_API_KEY` y `CONTACT_TO_EMAIL`.
3. Deploy. La URL base para metadata, sitemap y OG se toma de `site.dominio`; si es `null`, de
   `VERCEL_PROJECT_PRODUCTION_URL`.
4. Con dominio propio: agregarlo en Vercel → Domains y completar `dominio` en `src/content/site.ts`.
