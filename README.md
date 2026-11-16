# Aaction Dem: web SEO (francés)

Sitio estático sin dependencias, generado con Node (`node build.mjs` → carpeta `dist/`).

## Estructura
- `src/content.mjs`: todos los textos, servicios, agencias, FAQ y reseñas. **Edita aquí.**
- `src/styles.css`, `src/main.js`: diseño y JS (se insertan inline en cada página).
- `build.mjs`: plantillas, schema.org, sitemap, robots y manifest.
- `scripts/image-prompts.json`: prompts de las 12 imágenes (texto alternativo incluido).
- `scripts/generate-images.mjs`: genera las imágenes con la API de imágenes de OpenAI (ChatGPT Images).

## Tipografías

- Todo el texto: **Montserrat Regular (400) y Bold (700)**, alojada en el sitio (`src/fonts/montserrat-latin.woff2`).
- Única excepción: la frase de la portada «Garde tes amis. Fais appel à des pros» en **Seasalt** (`src/fonts/seasalt-regular.otf`, regla `.hero h1`).
- **Licencia de Seasalt:** el archivo recibido es una «Desktop License» de Nicky Laatz (nickylaatz.com). Para usarla en la web hace falta la licencia web; el cliente debe comprarla antes de la puesta en producción. El repositorio es público: el archivo queda descargable.

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
node scripts/serve.mjs 4321
```

## URLs (idénticas a Wix)

- Todas las páginas se publican **en la misma URL que en Wix**, sin barra final: `/demenagement-metz`, `/post/prix-demenagement-piano`, `/mentions-l%C3%A9gales`… Así ninguna URL cambia al migrar y Google no tiene que seguir ninguna redirección.
- Cada página se genera como `pagina.html`; GitHub Pages y Netlify la sirven sin extensión.
- URLs antiguas redirigidas (tabla `OLD_URLS` en `build.mjs`): `/accueil` → `/`, `/demenagement-metz-thionville` → `/demenagement-metz`, `/vente-de-materiel` → `/vente-materiel-demenagement`. En Netlify, `dist/_redirects` da 301 reales; en GitHub Pages lo hace una página de redirección.
- Una URL con barra final (`/demenagement-metz/`) cae en la 404, que redirige a la versión sin barra.

## Contenido idéntico a Wix

- Las 23 páginas que existían en Wix tienen **los mismos H1, H2, H3 y H4, en el mismo orden, y el mismo texto** que el sitio Wix original.
- Ese contenido está en `src/original/<página>.json` (lista `[etiqueta, html]` en el orden de Wix, con sus enlaces y negritas). `build.mjs` lo pinta con los bloques del diseño nuevo (cifras, formules, opiniones, agencias, preguntas, prestations, presupuesto).
- Para cambiar un texto de esas páginas, editar el JSON correspondiente. Las páginas que no existían en Wix (Knutange, formules, blog, CGV, inglés) siguen usando `src/content.mjs`.
- Páginas legales: texto de Wix + lo legalmente obligatorio que faltaba en Wix (hébergeur, médiateur y lista real de cookies), sin títulos añadidos.

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

## Cookies et traceurs

Bandeau central (fond flouté) : « Tout refuser », « Personnaliser », « Tout accepter ». Rien n’est chargé avant le choix ; il est conservé 6 mois (localStorage `aaction-cookies`) et modifiable via « Gestion des cookies » en pied de page.

- **Google Tag Manager** n’est chargé qu’après accord « Mesure d’audience » ou « Publicité », avec Consent Mode v2 (refus par défaut) et l’événement `cookie_consent_update` (`consent_analytics`, `consent_ads`, `consent_maps`).
- Activer à la mise en ligne : variable de dépôt `GTM_ID=GTM-PF9WCT9C` (conteneur du site actuel). Non défini = aucun traceur (préprod).
- Dans GTM : exiger `analytics_storage` sur la balise Microsoft Clarity et `ad_storage` sur le pixel Meta (« Paramètres de consentement supplémentaires »), sinon un accord partiel déclencherait les deux.
- Les cartes Google Maps (page Contact) ne s’affichent qu’avec l’accord « Cartes Google Maps » (ou le bouton « Afficher la carte »).
