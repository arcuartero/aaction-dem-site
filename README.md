# Aaction Dem: web SEO (francés)

Sitio estático sin dependencias, generado con Node (`node build.mjs` → carpeta `dist/`).

## Estructura
- `src/content.mjs`: todos los textos, servicios, agencias, FAQ y reseñas. **Edita aquí.**
- `src/styles.css`, `src/main.js`: diseño y JS (se insertan inline en cada página).
- `build.mjs`: plantillas, schema.org, sitemap, robots y manifest.
- `scripts/image-prompts.json`: prompts de las 12 imágenes (texto alternativo incluido).
- `scripts/generate-images.mjs`: genera las imágenes con la API de imágenes de OpenAI (ChatGPT Images).

## Imágenes
Las fotos y logos de la web actual (hero, equipo, guardamuebles, monte-meuble, oficina, visita técnica, logos Aaction Dem / Gentlemen / partners) se reutilizan: los originales están en `src/wix/` y se optimizan con `python3 -I scripts/import-site-photos.py` (las versiones de ChatGPT que sustituyen quedan en `images/chatgpt/`).

Las 12 imágenes de `images/` se generaron con ChatGPT Images a partir de los prompts de `scripts/image-prompts.json`.
Para regenerarlas por API:
```bash
export OPENAI_API_KEY=sk-...
node scripts/generate-images.mjs
node build.mjs
```
Para regenerar solo una: `node scripts/generate-images.mjs --only hero-demenageur --force`.
También puedes crearlas en ChatGPT a mano con los prompts del JSON y guardarlas en `images/` con el nombre indicado (`.webp`, salvo `og-image.jpg`).

## Previsualizar
```bash
python3 -m http.server 4321 -d dist
```

## Publicar (automático)
- Repositorio: https://github.com/arcuartero/aaction-dem-site
- Web pública: https://www.admastr.com/aaction-dem-site/
- Cada `git push` a `main` lanza `.github/workflows/deploy-pages.yml`, que construye la web y la publica en GitHub Pages en 1-2 minutos. También se reconstruye cada día a las 04:15 UTC (avis Google).
- **Indexación:** todas las páginas están en `noindex, nofollow`. Para la puesta en línea definitiva, crea la variable de repositorio `SITE_INDEXABLE = 1` (*Settings › Secrets and variables › Actions › Variables*).
- **Formularios:** GitHub Pages no procesa formularios. Para recibir las solicitudes de presupuesto y de «rappel», crea un formulario en Formspree (u otro servicio) y pon su URL en la variable de repositorio `FORM_ACTION`. En Netlify funcionan tal cual (Netlify Forms).
- Las cabeceras de seguridad de `dist/_headers` solo se aplican en Netlify / Cloudflare Pages.

## Reseñas de Google (automáticas y gratuitas)
La web muestra todas las reseñas de **4 y 5 estrellas** de las fichas de Knutange y Metz, a través de la **API de Google Business Profile** (gratuita). Mientras no esté configurada, se muestran las reseñas de `src/content.mjs`.

**Activación (una sola vez):**
1. En [Google Cloud Console](https://console.cloud.google.com/), crea un proyecto y **solicita acceso a la API de Google Business Profile** (formulario de Google; la aprobación tarda unos días). Usa la cuenta que gestiona las fichas.
2. Una vez aprobado, activa estas APIs en el proyecto: *My Business Account Management API*, *My Business Business Information API* y *Google My Business API*.
3. Crea un **ID de cliente OAuth** de tipo *Aplicación de escritorio*. Copia `.env.example` en `.env` y pon `GBP_CLIENT_ID` y `GBP_CLIENT_SECRET`.
4. `npm run reviews:auth` → abre el enlace, acepta y copia el `GBP_REFRESH_TOKEN` en `.env`.
5. `npm run reviews:list` → copia los identificados de las dos fichas en `GBP_LOCATIONS` (formato `accounts/…/locations/…=knutange,accounts/…/locations/…=metz`).
6. `npm run build:full` → descarga las reseñas a `src/data/reviews.json` y reconstruye la web.

**En producción (GitHub Pages):** añade las 4 claves `GBP_*` como *secrets* del repositorio (*Settings › Secrets and variables › Actions*). El workflow las usa en cada build y en la reconstrucción diaria.

Si la API falla, el build no se rompe: se conservan las últimas reseñas descargadas.

## Seguridad y caché
- `dist/_headers` incluye HSTS, Content-Security-Policy, X-Frame-Options y Permissions-Policy. Si añades un script externo (analítica, chat, WhatsApp…), añade su dominio a la constante `csp` de `build.mjs`.
- Las URLs de imágenes llevan `?v=<hash>` calculado en cada build: si sustituyes una foto con el mismo nombre, los visitantes verán la nueva aunque las imágenes estén en caché un año.

## Datos legales
Están en `site.legal` (`src/content.mjs`): SIRET, RCS, TVA, director de la publicación, hosting y mediador de consumo. Revísalos si cambia el hosting o el mediador.
