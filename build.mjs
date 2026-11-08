// Générateur de site statique ultra-léger, sans dépendance. Usage : node build.mjs
import { readFile, writeFile, mkdir, rm, copyFile, access } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { site, nav, services, formules, reviews, partners, faqGeneral, pages, formulesPage } from './src/content.mjs';
import { posts } from './src/posts.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(root, 'dist');
const today = new Date().toISOString().slice(0, 10);
const exists = (p) => access(p).then(() => true, () => false);
const css = (await readFile(path.join(root, 'src/styles.css'), 'utf8')).replace(/\s*\n\s*/g, '').replace(/\/\*.*?\*\//g, '');
const js = (await readFile(path.join(root, 'src/main.js'), 'utf8'));
const imgCfg = JSON.parse(await readFile(path.join(root, 'scripts/image-prompts.json'), 'utf8'));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const abs = (p) => site.url.replace(/\/$/, '') + p;
// Sous-dossier de publication (ex. GitHub Pages : BASE_PATH=/aaction-dem-site). Vide = racine du domaine.
const BASE = (process.env.BASE_PATH || '').replace(/\/+$/, '');
const withBase = (html) => !BASE ? html : html
  .replace(/(\s(?:href|src|action|poster)=")\/(?!\/)/g, `$1${BASE}/`)
  .replace(/(\ssrcset=")([^"]*)"/g, (m, a, v) => a + v.replace(/(^|,\s*)\/(?!\/)/g, `$1${BASE}/`) + '"')
  .replace(/url\((["']?)\/(?!\/)/g, `url($1${BASE}/`)
  .replace(/'\/contact\/#devis'/g, `'${BASE}/contact/#devis'`);

await rm(dist, { recursive: true, force: true });
await mkdir(path.join(dist, 'images'), { recursive: true });
await mkdir(path.join(dist, 'fonts'), { recursive: true });
for (const f of ['anton-latin.woff2', 'montserrat-latin.woff2']) await copyFile(path.join(root, 'src/fonts', f), path.join(dist, 'fonts', f));

// ---------------------------------------------------------------- Images
let hasSips = true;
try { execFileSync('which', ['sips'], { stdio: 'ignore' }); } catch { hasSips = false; }
const imgMeta = {};
const dims = (await exists(path.join(root, 'images/dims.json'))) ? JSON.parse(await readFile(path.join(root, 'images/dims.json'), 'utf8')) : {};
// Illustrations des villes (copie-de-accueil du site actuel)
if (await exists(path.join(root, 'images/villes'))) {
  await mkdir(path.join(dist, 'images/villes'), { recursive: true });
  for (const v of ['knutange', 'metz']) await copyFile(path.join(root, 'images/villes', `${v}.svg`), path.join(dist, 'images/villes', `${v}.svg`));
}
// Logos recyclés du site actuel (scripts/import-site-photos.py)
const logoMeta = {};
if (await exists(path.join(root, 'images/logos'))) {
  await mkdir(path.join(dist, 'images/logos'), { recursive: true });
  for (const [k, v] of Object.entries(dims)) {
    if (!k.startsWith('logos/')) continue;
    await copyFile(path.join(root, 'images', `${k}.webp`), path.join(dist, 'images', `${k}.webp`));
    if (await exists(path.join(root, 'images', `${k}.png`))) await copyFile(path.join(root, 'images', `${k}.png`), path.join(dist, 'images', `${k}.png`));
    logoMeta[k.slice(6)] = { src: `/images/${k}.webp`, w: v[0], h: v[1] };
  }
}
const logoImg = (name, alt, h, cls = '') => { const m = logoMeta[name]; return m ? `<img src="${m.src}" width="${Math.round(m.w * h / m.h)}" height="${h}" alt="${esc(alt)}"${cls ? ` class="${cls}"` : ''} loading="lazy" decoding="async">` : ''; };
for (const im of imgCfg.images) {
  const [w, h] = dims[im.name] || im.size.split('x').map(Number);
  const ext = im.format === 'jpeg' ? 'jpg' : im.format;
  const src = path.join(root, 'images', `${im.name}.${ext}`);
  const meta = { w, h, alt: im.alt };
  if (await exists(src)) {
    await copyFile(src, path.join(dist, 'images', `${im.name}.${ext}`));
    meta.src = `/images/${im.name}.${ext}`;
    // Variante mobile 768px (JPEG) pour le srcset, si macOS « sips » est disponible et l'image opaque
    const pre = path.join(root, 'images', `${im.name}-768.jpg`);   // variante pré-générée (scripts/make-variants.py)
    if (!im.background && w > 900 && im.format !== 'jpeg' && await exists(pre)) {
      await copyFile(pre, path.join(dist, 'images', `${im.name}-768.jpg`));
      meta.small = `/images/${im.name}-768.jpg`;
    } else if (hasSips && !im.background && w > 900 && im.format !== 'jpeg') {
      try {
        const small = path.join(dist, 'images', `${im.name}-768.jpg`);
        execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '72', '--resampleWidth', '768', src, '--out', small], { stdio: 'ignore' });
        meta.small = `/images/${im.name}-768.jpg`;
      } catch {}
    }
  } else {
    // Placeholder SVG en attendant la génération via OpenAI
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1e5b47"/><stop offset="1" stop-color="#fa5b4a"/></linearGradient></defs><rect width="100%" height="100%" fill="${im.background ? 'none' : 'url(#g)'}"/><g fill="#fff" font-family="Arial" text-anchor="middle"><text x="50%" y="48%" font-size="${Math.round(w / 22)}" font-weight="700">${esc(im.name)}</text><text x="50%" y="56%" font-size="${Math.round(w / 45)}">image à générer — scripts/generate-images.mjs</text></g></svg>`;
    await writeFile(path.join(dist, 'images', `${im.name}.svg`), svg);
    meta.src = `/images/${im.name}.svg`;
  }
  imgMeta[im.name] = meta;
}
const img = (name, { cls = '', eager = false, sizes = '(max-width: 860px) 100vw, 50vw', alt } = {}) => {
  const m = imgMeta[name];
  const srcset = m.small ? ` srcset="${m.small} 768w, ${m.src} ${m.w}w" sizes="${sizes}"` : '';
  return `<img src="${m.src}"${srcset} width="${m.w}" height="${m.h}" alt="${esc(alt ?? m.alt)}"${cls ? ` class="${cls}"` : ''} ${eager ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"'}>`;
};
const figure = (name, caption) => `<figure class="figure">${img(name, { sizes: '(max-width: 960px) 100vw, 720px' })}<figcaption>${caption}</figcaption></figure>`;

// ---------------------------------------------------------------- Icons
const ic = {
  medal: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="24" cy="18" r="11"/><path d="M17 27l-5 15 7-3 4 6 4-12M31 27l5 15-7-3-4 6"/><path d="M20 18l3 3 6-6"/></svg>',
  box: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 15l18-8 18 8v19l-18 8-18-8z"/><path d="M6 15l18 8 18-8M24 23v19M15 11l18 8"/></svg>',
  truck: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 12h26v22H3zM29 19h9l7 8v7H29z"/><circle cx="12" cy="36" r="4"/><circle cx="36" cy="36" r="4"/><path d="M1 18h8M1 24h6"/></svg>',
  iso: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M16 10l8-6 8 6M38 22l2 10-9 4M10 22l-2 10 9 4"/><path d="M24 4v10M40 32l-9-5M8 32l9-5"/></svg>',
  wardrobe: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="8" y="5" width="32" height="36" rx="1"/><path d="M24 5v36M20 20v4M28 20v4M10 41v3M38 41v3M8 12h32"/></svg>',
  tools: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M30 6a8 8 0 0 0-7 11L7 33a3 3 0 0 0 4 4l16-16a8 8 0 0 0 11-7l-5 3-4-1-1-4zM28 30l10 10a3 3 0 0 0 4-4L32 26M8 8l8 8M6 12l6-6"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  cathedral: '<svg viewBox="0 0 300 200" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 200V120l30-30 30 30v80M50 90V40l10-30 10 30v50M90 200V100h120v100M150 100V30l12-25 12 25v70M220 200V110l25-25 25 25v90M110 200v-40a15 15 0 0 1 30 0v40M170 200v-40a15 15 0 0 1 30 0v40M100 130h100M240 140h10M30 140h10"/></svg>',
  church: '<svg viewBox="0 0 300 200" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M30 200v-70h60v70M60 130V60l15-40 15 40v70M120 200v-90l40-30 40 30v90M200 200v-60h70v60M150 200v-35a10 10 0 0 1 20 0v35M60 20V5M230 140l-15-20h40l-15 20M140 130h40"/></svg>'
};

// ---------------------------------------------------------------- JSON-LD
const orgId = abs('/#organisation');
const agencyLd = (a) => ({
  '@type': 'MovingCompany', '@id': abs(`/#agence-${a.id}`), name: a.name, url: site.url + '/',
  telephone: site.phone, email: site.email, image: abs(imgMeta['equipe-demenageurs'].src), priceRange: '€€',
  parentOrganization: { '@id': orgId },
  address: { '@type': 'PostalAddress', streetAddress: a.street, postalCode: a.zip, addressLocality: a.city, addressRegion: a.region, addressCountry: 'FR' },
  geo: { '@type': 'GeoCoordinates', latitude: a.geo.lat, longitude: a.geo.lng },
  hasMap: a.maps,
  ...(a.hours.length ? { openingHoursSpecification: a.hours.map((h) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: h.days, opens: h.opens, closes: h.closes })) } : {}),
  areaServed: site.areaServed.map((n) => ({ '@type': 'Place', name: n }))
});
const orgLd = {
  '@type': 'MovingCompany', '@id': orgId, name: site.name, legalName: site.legalName, url: site.url + '/',
  logo: { '@type': 'ImageObject', url: abs('/images/logos/aaction-dem-2026.png'), width: 833, height: 277 }, image: abs(imgMeta['og-image'].src), telephone: site.phone, email: site.email,
  foundingDate: '1990-04', description: 'Déménageur en Moselle et au Luxembourg depuis plus de 30 ans : déménagement de particuliers et d’entreprises, garde-meuble et location de monte-meuble.',
  address: agencyLd(site.agencies[0]).address,
  memberOf: { '@type': 'Organization', name: 'Les Gentlemen du Déménagement' },
  hasCredential: ['ISO 9001', 'ISO 14001'].map((n) => ({ '@type': 'EducationalOccupationalCredential', name: n })),
  areaServed: site.areaServed.map((n) => ({ '@type': 'Place', name: n })),
  subOrganization: site.agencies.map((a) => ({ '@id': abs(`/#agence-${a.id}`) })),
  ...(site.sameAs.length ? { sameAs: site.sameAs } : {})
};
const websiteLd = { '@type': 'WebSite', '@id': abs('/#website'), url: site.url + '/', name: site.name, inLanguage: 'fr-FR', publisher: { '@id': orgId } };
const faqLd = (faq) => ({ '@type': 'FAQPage', mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a.replace(/<[^>]+>/g, '') } })) });
const crumbsLd = (trail) => ({ '@type': 'BreadcrumbList', itemListElement: trail.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.name, item: abs(t.href) })) });

// ---------------------------------------------------------------- Partials
const logo = logoMeta['aaction-dem-2026'] ? logoImg('aaction-dem-2026', 'Aaction Dem – Déménageurs de vies', 58, 'logo__img').replace(' loading="lazy"', ' fetchpriority="high"') : `<span class="logo__mark">Aaction<span>Dem</span></span>`;
const footLogo = logoMeta['aaction-dem-2026'] ? logoImg('aaction-dem-2026', 'Aaction Dem – Déménageurs de vies', 70, 'logo__img') : logo;
const gentLogo = (h) => logoMeta['gentlemen'] ? logoImg('gentlemen', 'Membre du réseau Les Gentlemen du Déménagement', h) : '<span class="logo__net">Les Gentlemen<br>du Déménagement</span>';
const header = (cur) => `
<a class="skip" href="#contenu">Aller au contenu</a>
<header class="header"><div class="wrap header__in">
  <a class="logo" href="/" aria-label="Aaction Dem – accueil">${logo}<span class="logo__net">${gentLogo(40)}</span></a>
  <button class="burger" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="nav"><span></span><span></span><span></span></button>
  <nav class="nav" id="nav" aria-label="Navigation principale"><ul>
    ${nav.map((n) => {
      const active = cur === n.href || (n.children || []).some((c) => c.href === cur);
      if (!n.children) return `<li><a href="${n.href}"${active ? ' aria-current="page"' : ''}>${n.label}</a></li>`;
      return `<li class="has-sub"><a href="${n.href}"${active ? ' aria-current="page"' : ''}>${n.label}<svg class="caret" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.8"/></svg></a>
        <ul class="sub">${n.children.map((c) => `<li><a href="${c.href}"${cur === c.href ? ' aria-current="page"' : ''}>${c.label}</a></li>`).join('')}</ul></li>`;
    }).join('')}
  </ul></nav>
  <div class="header__cta">
    <a class="btn btn--red" href="/contact/">Devis gratuit</a>
    <a class="btn btn--outline-red" href="tel:${site.phone.replace(/\s/g, '')}" data-hours-check>${ic.phone}${site.phoneDisplay}</a>
  </div>
</div></header>`;

const socialIc = {
  Instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
  Facebook: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v8h4v-8h3l1-4h-4V8z"/></svg>',
  LinkedIn: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 9h4v12H4zM6 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM10 9h4v2c.6-1.1 2-2.2 4-2.2 4 0 4.5 2.6 4.5 6V21h-4v-5.5c0-1.5 0-3.3-2-3.3s-2.4 1.6-2.4 3.2V21h-4z"/></svg>'
};
const footer = `
<footer class="footer"><div class="wrap">
  <div class="footer__grid">
    <div class="footer__brand"><a class="logo" href="/" aria-label="Aaction Dem – accueil">${footLogo}</a>
      <p>Depuis plus de 30 ans, Aaction Dem accompagne particuliers et entreprises dans leurs déménagements et leur stockage, en Moselle, au Luxembourg, partout en France et à l’international.</p>
      <ul class="social">${site.social.map((x) => `<li><a href="${x.href}" rel="noopener" target="_blank" aria-label="Aaction Dem sur ${x.name}">${socialIc[x.name]}</a></li>`).join('')}</ul>
      <p class="footer__gent">${gentLogo(56)}</p></div>
    <div><h2>Liens utiles</h2><ul>
      <li><a href="/particulier/">Particulier</a></li><li><a href="/services-demenagement/">Services</a></li>
      <li><a href="/formules-demenagement/">Formules</a></li><li><a href="/avis/">Avis</a></li>
      <li><a href="/faq/">FAQ</a></li><li><a href="/blog/">Conseils</a></li><li><a href="/contact/">Contact</a></li></ul></div>
    <div><h2>Nos villes</h2><ul>
      <li><a href="/demenagement-metz/">Déménageur Metz</a></li><li><a href="/demenagement-thionville/">Déménageur Thionville</a></li>
      <li><a href="/demenagement-knutange/">Déménageur Knutange</a></li><li><a href="/demenagement-longwy/">Déménagement Longwy</a></li><li><a href="/demenagement-luxembourg/">Déménagement Luxembourg</a></li></ul></div>
    <div><h2>Contact</h2><ul class="footer__contact">
      <li><a class="footer__tel" href="tel:${site.phone.replace(/\s/g, '')}">${ic.phone} ${site.phoneDisplay}</a></li>
      <li><a href="mailto:${site.email}">${site.email}</a></li>
      ${site.agencies.map((a) => `<li><strong>${a.city}</strong><br><a href="${a.maps}" rel="noopener" target="_blank">${a.street}, ${a.zip} ${a.city}</a></li>`).join('')}</ul>
      <a class="btn btn--red" href="/contact/">Devis gratuit ${ic.arrow}</a></div>
  </div>
</div>
<div class="footer__bottom"><div class="wrap footer__bottom-in"><ul>
    <li><a href="/politique-de-confidentialite/">Politique de confidentialité</a></li>
    <li><a href="/mentions-legales/">Mentions légales</a></li>
    <li><a href="/conditions-generales-de-vente/">CGV</a></li></ul>
    <span>© ${new Date().getFullYear()} Aaction Dem – Membre du réseau Les Gentlemen du Déménagement</span></div></div>
</footer>
<form name="rappel" method="POST" action="${site.formAction}" data-netlify="true" netlify-honeypot="bot-field" hidden aria-hidden="true"><input type="hidden" name="form-name" value="rappel"><input name="telephone"><input name="page"><input name="reouverture"><input name="bot-field"></form>
<div class="mbar"><a href="tel:${site.phone.replace(/\s/g, '')}" data-hours-check>Appeler</a><a href="/contact/">Devis gratuit</a></div>`;

const crumbsHtml = (trail) => `<nav class="crumbs" aria-label="Fil d’Ariane"><ol>${trail.map((t, i) => i === trail.length - 1 ? `<li aria-current="page">${t.name}</li>` : `<li><a href="${t.href}">${t.name}</a></li>`).join('')}</ol></nav>`;

const faqCats = [['prix', 'Devis et prix'], ['organisation', 'Préparation'], ['jour', 'Le jour J'], ['services', 'Services et formules'], ['assurance', 'Assurance'], ['demarches', 'Démarches et aides'], ['zones', 'Zones et agences']];
const faqHtml = (faq) => `<div class="faq">${faq.map((f) => `<details><summary>${f.q}</summary><div>${f.a}</div></details>`).join('')}</div>`;

const quoteForm = (id = 'devis') => `
<form class="form" name="devis" method="POST" action="${site.formAction}" data-netlify="true" netlify-honeypot="bot-field" data-next="${BASE}/merci/" id="${id}">
  <input type="hidden" name="form-name" value="devis"><input type="hidden" name="langue" value="Français"><input type="hidden" name="_subject" value="Nouvelle demande de devis – site Aaction Dem"><input type="text" name="_gotcha" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
  <p class="hp"><label>Ne pas remplir <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
  <div class="fgrid3">
    <div class="field"><label for="f-dep">Adresse de départ *</label><input id="f-dep" name="adresse_depart" required autocomplete="street-address" placeholder="Ville ou adresse de départ"></div>
    <div class="field"><label for="f-arr">Adresse d’arrivée *</label><input id="f-arr" name="adresse_arrivee" required placeholder="Ville ou adresse d’arrivée"></div>
    <div class="field"><label for="f-date">Période souhaitée</label><input id="f-date" name="date" type="date" data-datepicker></div>
    <div class="field"><label for="f-name">Votre nom *</label><input id="f-name" name="nom" required autocomplete="name" placeholder="Nom et prénom"></div>
    <div class="field"><label for="f-mail">E-mail *</label><input id="f-mail" name="email" type="email" required autocomplete="email" placeholder="vous@exemple.fr"></div>
    <div class="field"><label for="f-tel">Téléphone *</label><div class="tel"><select name="indicatif" aria-label="Indicatif"><option>FR +33</option><option>LU +352</option><option>BE +32</option><option>DE +49</option><option>CH +41</option></select><input id="f-tel" name="telephone" type="tel" required autocomplete="tel-national" placeholder="06 12 34 56 78"></div></div>
    <div class="field field--full"><label for="f-msg">Précisions (étage, ascenseur, objets lourds…)</label><textarea id="f-msg" name="message"></textarea></div>
  </div>
  <label class="consent"><input type="checkbox" name="rgpd" required> <span>J’accepte que mes données soient utilisées pour traiter ma demande de devis, conformément à la <a href="/politique-de-confidentialite/">politique de confidentialité</a>.</span></label>
  <p class="form__cgv">Le devis est gratuit et sans engagement. Nos prestations sont régies par nos <a href="/conditions-generales-de-vente/">conditions générales de vente</a>.</p>
  <button class="btn btn--red" type="submit">Obtenir un devis ${ic.arrow}</button>
</form>`;

// Formulaire compact (page Contact) : mêmes champs que quoteForm pour Netlify, présentation empilée avec icônes
const quoteFormCompact = () => `
<form class="form cfm" name="devis" method="POST" action="${site.formAction}" data-netlify="true" netlify-honeypot="bot-field" data-next="${BASE}/merci/" id="devis">
  <input type="hidden" name="form-name" value="devis"><input type="hidden" name="langue" value="Français"><input type="hidden" name="_subject" value="Nouvelle demande de devis – site Aaction Dem"><input type="text" name="_gotcha" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
  <p class="hp"><label>Ne pas remplir <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
  <div class="field"><label for="c-dep">Adresse de départ *</label><div class="ifield"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5a7 7 0 1 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg><input id="c-dep" name="adresse_depart" required autocomplete="street-address" placeholder="Ville ou adresse de départ"></div></div>
  <div class="field"><label for="c-arr">Adresse d’arrivée *</label><div class="ifield"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5a7 7 0 1 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg><input id="c-arr" name="adresse_arrivee" required placeholder="Ville ou adresse d’arrivée"></div></div>
  <div class="field"><label for="c-date">Période souhaitée</label><div class="ifield"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15.5" rx="1"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg><input id="c-date" name="date" type="date" data-datepicker></div></div>
  <div class="field"><label for="c-name">Nom *</label><div class="ifield"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4.5 20.5c1.2-3.8 4-5.5 7.5-5.5s6.3 1.7 7.5 5.5"/></svg><input id="c-name" name="nom" required autocomplete="name" placeholder="Nom et prénom"></div></div>
  <div class="cfm__row">
    <div class="field"><label for="c-mail">E-mail *</label><div class="ifield"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5.5" width="18" height="13" rx="1"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/></svg><input id="c-mail" name="email" type="email" required autocomplete="email" placeholder="vous@exemple.fr"></div></div>
    <div class="field"><label for="c-tel">Téléphone *</label><div class="ifield ifield--tel"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg><select name="indicatif" aria-label="Indicatif"><option>FR +33</option><option>LU +352</option><option>BE +32</option><option>DE +49</option><option>CH +41</option></select><input id="c-tel" name="telephone" type="tel" required autocomplete="tel-national" placeholder="06 12 34 56 78"></div></div>
  </div>
  <div class="field"><label for="c-msg">Précisions <span>(facultatif)</span></label><textarea id="c-msg" name="message" rows="2" placeholder="Étage, ascenseur, objets lourds…"></textarea></div>
  <label class="consent"><input type="checkbox" name="rgpd" required> <span>J’accepte que mes données soient utilisées pour traiter ma demande, conformément à la <a href="/politique-de-confidentialite/">politique de confidentialité</a> et aux <a href="/conditions-generales-de-vente/">CGV</a>.</span></label>
  <button class="btn btn--red cfm__btn" type="submit">Obtenir un devis gratuit ${ic.arrow}</button>
</form>`;

const quoteSection = `
<section class="quote" aria-labelledby="devis-titre"><div class="wrap">
  <div class="quote__top">
    <div><h2 id="devis-titre">Demandez votre<br>devis gratuit</h2><p>Contactez-nous via ce formulaire. Nous vous recontacterons au plus vite, généralement sous 24 h ouvrées.</p></div>
    ${img('equipe-demenageurs', { sizes: '(max-width: 860px) 100vw, 640px' })}
  </div>
  ${quoteForm()}
</div></section>`;

const band = `<section class="band"><div class="wrap band__in"><h2>Un projet de déménagement ?</h2><div style="display:flex;gap:.8rem;flex-wrap:wrap"><a class="btn btn--white" href="/contact/">Devis gratuit ${ic.arrow}</a><a class="btn btn--ghost" href="tel:${site.phone.replace(/\s/g, '')}">${ic.phone} ${site.phoneDisplay}</a></div></div></section>`;

// ---------------------------------------------------------------- Layout
const layout = ({ path: p, title, description, body, ld = [], ogImage = 'og-image', robots = 'index, follow, max-image-preview:large', preload, current, lang = 'fr', alt }) => {
  const og = imgMeta[ogImage];
  const graph = { '@context': 'https://schema.org', '@graph': [orgLd, websiteLd, ...ld] };
  return `<!doctype html>
<html lang="${lang === 'en' ? 'en' : 'fr-FR'}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="robots" content="${site.indexable ? robots : 'noindex, nofollow'}">
<link rel="canonical" href="${abs(p)}">
${alt ? `<link rel="alternate" hreflang="fr-FR" href="${abs(alt.fr)}">
<link rel="alternate" hreflang="en" href="${abs(alt.en)}">
<link rel="alternate" hreflang="x-default" href="${abs(alt.fr)}">` : `<link rel="alternate" hreflang="fr-FR" href="${abs(p)}">
<link rel="alternate" hreflang="x-default" href="${abs(p)}">`}
<meta name="theme-color" content="#fa5b4a">
<meta name="geo.region" content="FR-57"><meta name="geo.placename" content="Knutange, Metz">
<meta property="og:type" content="website"><meta property="og:locale" content="${lang === 'en' ? 'en_GB' : 'fr_FR'}">${alt ? `<meta property="og:locale:alternate" content="${lang === 'en' ? 'fr_FR' : 'en_GB'}">` : ''}<meta property="og:site_name" content="${site.name}">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${abs(p)}"><meta property="og:image" content="${abs(og.src)}"><meta property="og:image:width" content="${og.w}"><meta property="og:image:height" content="${og.h}"><meta property="og:image:alt" content="${esc(og.alt)}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.ico" sizes="48x48"><link rel="icon" href="/images/icons/icon-32.png" type="image/png" sizes="32x32"><link rel="apple-touch-icon" href="/images/icons/icon-180.png"><link rel="manifest" href="/site.webmanifest">
<link rel="preload" href="/fonts/anton-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/montserrat-latin.woff2" as="font" type="font/woff2" crossorigin>
${preload ? `<link rel="preload" as="image" href="${imgMeta[preload].src}" fetchpriority="high">` : ''}
<style>${css}</style>
<script type="application/ld+json">${JSON.stringify(graph)}</script>
</head>
<body>
${header(current ?? p)}
<main id="contenu">${body}</main>
${footer}
<script>${js}</script>
</body>
</html>`;
};

const outputs = [];
// Cache-busting : /images/x.webp -> /images/x.webp?v=<hash du fichier> (les images sont en cache 1 an)
const assetHash = {};
const versionAssets = async (html) => {
  const urls = [...new Set(html.match(/\/images\/[\w\/.-]+\.(?:webp|jpe?g|png|svg|avif)(?![\w?])/g) || [])];
  for (const u of urls) {
    if (!(u in assetHash)) { try { assetHash[u] = createHash('sha1').update(await readFile(path.join(dist, u))).digest('hex').slice(0, 8); } catch { assetHash[u] = ''; } }
  }
  return urls.reduce((h, u) => assetHash[u] ? h.split(u).join(`${u}?v=${assetHash[u]}`) : h, html);
};
const emit = async (p, html, { priority = '0.7', sitemap = true } = {}) => {
  const file = p === '/404.html' ? path.join(dist, '404.html') : path.join(dist, p, 'index.html');
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, withBase(await versionAssets(html)));
  if (sitemap) outputs.push({ p, priority });
};
const pageBySlug = Object.fromEntries(pages.map((pg) => [pg.slug, pg]));
const extraTitles = { 'formules-demenagement': ['Nos formules de déménagement', 'Mobilier seul, Dynamic +, Comfort, Comfort +'] };
const relatedHtml = (slugs) => `<div class="related">${slugs.map((s) => { const r = pageBySlug[s]; const t = r ? [r.h1, r.kicker] : extraTitles[s]; return `<a href="/${s}/">${t[0]}<small>${t[1]}</small></a>`; }).join('')}</div>`;

// ---------------------------------------------------------------- Accueil
const stats = `<section class="stats" aria-label="Aaction Dem en chiffres"><div class="wrap"><ul>
  <li>${ic.medal}<div><strong>90%</strong><span>Satisfaction client</span></div></li>
  <li>${ic.box}<div><strong>30</strong><span>Années d’expérience</span></div></li>
  <li>${ic.truck}<div><strong>1200</strong><span>Déménagements par an</span></div></li>
  <li>${ic.iso}<div><strong>ISO</strong><span>9001 – 14001</span></div></li>
</ul></div></section>`;

const servicesCards = `<div class="cards">${services.map((s) => `<article class="card">${img(s.img, { sizes: '(max-width: 560px) 100vw, (max-width: 1000px) 50vw, 280px' })}<div class="card__b"><h3>${s.title}</h3><p>${s.text}</p><a class="btn btn--outline-red" href="${s.href}" aria-label="En savoir plus : ${s.title}">Voir plus ${ic.arrow}</a></div></article>`).join('')}</div>`;

const formulesGrid = `<div class="fgrid">${formules.map((f) => `<a class="fcard" href="/formules-demenagement/#${f.id}">${ic[f.icon]}<h3>${f.title}</h3><p>${f.text}</p><span class="more">Voir la formule →</span></a>`).join('')}</div>`;

// Avis : src/data/reviews.json (généré par scripts/fetch-reviews.mjs depuis Google) sinon avis de src/content.mjs
const reviewData = (await exists(path.join(root, 'src/data/reviews.json')))
  ? JSON.parse(await readFile(path.join(root, 'src/data/reviews.json'), 'utf8'))
  : { reviews: reviews.map((r, i) => ({ id: `local-${i}`, name: r.name, rating: 5, text: r.text, date: null, agency: '' })), total: 0, average: 0, updatedAt: null };
const frDate = (d, opts = { month: 'long', year: 'numeric' }) => d ? new Intl.DateTimeFormat('fr-FR', opts).format(new Date(d)) : '';
const agencyName = (id) => site.agencies.find((a) => a.id === id)?.city || '';
const gLogoSm = `<svg viewBox="0 0 48 48" width="14" height="14" aria-hidden="true"><path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h11.8c-.5 2.8-2.1 5.1-4.4 6.7v5.5h7.2c4.2-3.9 6.5-9.6 6.5-16.2z"/><path fill="#34A853" d="M24 46c6 0 11-2 14.6-5.4l-7.2-5.5c-2 1.3-4.5 2.1-7.4 2.1-5.7 0-10.6-3.9-12.3-9.1H4.3v5.7C7.9 41.1 15.4 46 24 46z"/><path fill="#FBBC05" d="M11.7 28.1c-.4-1.3-.7-2.7-.7-4.1s.3-2.8.7-4.1v-5.7H4.3C2.8 17.2 2 20.5 2 24s.8 6.8 2.3 9.8l7.4-5.7z"/><path fill="#EA4335" d="M24 10.8c3.2 0 6.1 1.1 8.4 3.3l6.3-6.3C34.9 4.2 30 2 24 2 15.4 2 7.9 6.9 4.3 14.2l7.4 5.7c1.7-5.2 6.6-9.1 12.3-9.1z"/></svg>`;
const reviewCard = (r) => `<figure class="review"><div class="stars" role="img" aria-label="${r.rating} étoiles sur 5">${'★'.repeat(r.rating)}<span class="stars__off">${'★'.repeat(5 - r.rating)}</span></div><blockquote>${esc(r.text).replace(/\n/g, '<br>')}</blockquote><figcaption><strong>${esc(r.name)}</strong>${r.date || r.agency ? `<span class="review__meta">${[frDate(r.date), r.agency ? 'Agence de ' + agencyName(r.agency) : ''].filter(Boolean).join(' · ')}</span>` : ''}<a class="review__src" href="${esc(r.url || (site.agencies.find((a) => a.id === r.agency) || site.agencies[0]).maps)}" target="_blank" rel="noopener nofollow">${gLogoSm} Voir sur Google<span class="sr-only"> (avis de ${esc(r.name)}, nouvel onglet)</span></a></figcaption></figure>`;
const reviewSummary = reviewData.total ? `<p class="rsum"><span class="rsum__note">${String(reviewData.average).replace('.', ',')}<small>/5</small></span><span class="rsum__stars" aria-hidden="true">★★★★★</span><span>Note moyenne sur <strong>${reviewData.total} avis Google</strong></span></p>` : '';
// Bandeau « note Google » de la page Avis
const gNote = reviewData.total ? String(reviewData.average).replace('.', ',') : '4,7';
const gCount = reviewData.total ? `${reviewData.total} avis clients` : '300+ avis clients';
const gLogo = `<svg viewBox="0 0 48 48" width="56" height="56" aria-hidden="true"><path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h11.8c-.5 2.8-2.1 5.1-4.4 6.7v5.5h7.2c4.2-3.9 6.5-9.6 6.5-16.2z"/><path fill="#34A853" d="M24 46c6 0 11-2 14.6-5.4l-7.2-5.5c-2 1.3-4.5 2.1-7.4 2.1-5.7 0-10.6-3.9-12.3-9.1H4.3v5.7C7.9 41.1 15.4 46 24 46z"/><path fill="#FBBC05" d="M11.7 28.1c-.4-1.3-.7-2.7-.7-4.1s.3-2.8.7-4.1v-5.7H4.3C2.8 17.2 2 20.5 2 24s.8 6.8 2.3 9.8l7.4-5.7z"/><path fill="#EA4335" d="M24 10.8c3.2 0 6.1 1.1 8.4 3.3l6.3-6.3C34.9 4.2 30 2 24 2 15.4 2 7.9 6.9 4.3 14.2l7.4 5.7c1.7-5.2 6.6-9.1 12.3-9.1z"/></svg>`;
const bIc = (d) => `<svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const ratingBand = `<section class="gband" aria-label="Note Google et chiffres clés"><div class="wrap gband__in">
  <div class="gband__g">${gLogo}<p>Avis Google<br>vérifiés</p></div>
  <div class="gband__note"><p class="gband__big">${gNote}<span>/5</span></p><div><p class="gband__stars" role="img" aria-label="Note de ${gNote} sur 5">★★★★★</p><p>${gCount}</p></div></div>
  <ul class="gband__facts">
    <li>${bIc('<circle cx="12" cy="9" r="6"/><path d="M8.5 13.9 7 22l5-3 5 3-1.5-8.1"/>')}<p><strong>30 ans</strong>d’expérience</p></li>
    <li>${bIc('<circle cx="9" cy="7" r="3"/><circle cx="17" cy="8" r="2.5"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M15 14.5c3 0 6 1.8 6 5"/>')}<p><strong>1 200</strong>déménagements / an</p></li>
    <li>${bIc('<path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>')}<p><strong>Knutange,</strong>Metz et environs</p></li>
  </ul>
</div></section>`;
// Badge « note Google » de la section avis de l'accueil (même données que le bandeau de la page Avis)
const gBadge = `<a class="gbadge" href="/avis/" aria-label="Note Google : ${gNote} sur 5, ${gCount} – voir tous les avis">
  <span class="gbadge__g">${gLogo}<span>Avis Google<br>vérifiés</span></span>
  <span class="gbadge__sep" aria-hidden="true"></span>
  <span class="gbadge__note"><strong>${gNote}<small>/5</small></strong><span><span class="gbadge__stars" aria-hidden="true">★★★★★</span><span>${gCount}</span></span></span>
</a>`;
const reviewsHtml = `<div class="reviews"><button class="rnav rnav--prev" aria-label="Avis précédents">‹</button><div class="rtrack" tabindex="0" aria-label="Avis clients">${reviewData.reviews.slice(0, 9).map(reviewCard).join('')}</div><button class="rnav rnav--next" aria-label="Avis suivants">›</button></div>`;

const agenciesHtml = `<section class="agencies" aria-label="Nos agences">${site.agencies.map((a, i) => `
<div class="agency ${i ? 'agency--green' : 'agency--orange'}"><p class="eyebrow">Notre agence de</p><h2>${a.city}</h2>
<address>${a.street}<br>${a.zip} ${a.city}<span>${a.hoursText}</span></address>
<a class="btn btn--white" href="${i ? '/demenagement-metz/' : '/demenagement-knutange/'}">Agence de ${a.city} ${ic.arrow}</a>
<img class="agency__art" src="/images/villes/${a.id}.svg" width="${a.id === 'metz' ? 1066 : 953}" height="${a.id === 'metz' ? 630 : 662}" alt="" aria-hidden="true" loading="lazy" decoding="async"></div>`).join('')}</section>`;

const networkHtml = `<section class="sec" aria-labelledby="reseau"><div class="wrap">
  <div class="net"><div><p class="eyebrow">Aaction Dem,</p><h2 id="reseau">Membre du réseau Les Gentlemen du Déménagement</h2></div>
  <p class="gent">${logoMeta['gentlemen'] ? gentLogo(150) : 'Les Gentlemen<small>du Déménagement</small>'}</p></div>
  <p>Vous recherchez un <strong>déménageur fiable, expérimenté et reconnu</strong> ? Aaction Dem, votre expert du déménagement basé à Knutange, fait partie du réseau <strong>Les Gentlemen du Déménagement</strong>, un groupement national qui regroupe les meilleures entreprises du secteur.</p>
  <div class="points">
    <div class="point"><b class="n">01.</b><p><strong>Un réseau d’excellence :</strong> plus de 70 entreprises triées sur le volet pour leur sérieux, leur expertise et leur sens du service.</p></div>
    <div class="point"><b class="n">02.</b><p><strong>Une couverture nationale et internationale :</strong> nous organisons votre déménagement partout en France et même à l’étranger.</p></div>
    <div class="point"><b class="n">03.</b><p><strong>Une qualité de service garantie :</strong> respect des délais, matériel professionnel, équipes formées, démarches simplifiées.</p></div>
    <div class="point"><b class="n">04.</b><p><strong>Des avantages exclusifs :</strong> tarifs compétitifs, offres groupées, assurance renforcée, services sur mesure.</p></div>
  </div>
  <p><strong>Aaction Dem, la force d’un réseau, la proximité d’un partenaire local.</strong> Nous intervenons régulièrement à <a href="/demenagement-luxembourg/">Luxembourg</a>, <a href="/demenagement-metz/">Metz</a>, <a href="/demenagement-thionville/">Thionville</a> et dans l’ensemble des alentours, avec des services adaptés aux <a href="/particulier/">particuliers</a> et aux <a href="/entreprise/">professionnels</a>.</p>
</div></section>`;

const partnersHtml = `<section class="sec sec--cream" aria-labelledby="partenaires"><div class="wrap partners">
  <div><h2 id="partenaires">Profitez de nos partenariats</h2><p>Client d’un de nos partenaires ? Grâce à notre appartenance aux Gentlemen du Déménagement, bénéficiez de notre meilleur prix.</p></div>
  <ul class="plogos">${partners.map((p) => `<li>${logoMeta[p.logo] ? logoImg(p.logo, p.name, 72) : p.name}</li>`).join('')}</ul>
</div></section>`;

// FAQ courte de l'accueil : réponses résumées, différentes de /faq/ (pas de contenu dupliqué)
const homeFaq = [
  { q: 'Combien coûte un déménagement ?', a: '<p>Tout dépend du volume, de la distance, des accès et de la formule. La visite technique et le devis sont gratuits : <a href="/contact/">demandez le vôtre</a>.</p>' },
  { q: 'Quand réserver son déménageur ?', a: '<p>Un à deux mois avant, et davantage pour l’été ou les fins de mois. Pour une urgence, appelez-nous : nous cherchons toujours une solution.</p>' },
  { q: 'Mes meubles sont-ils assurés ?', a: '<p>Oui, chaque déménagement est couvert par notre responsabilité contractuelle, avec une garantie renforcée possible pour les biens de valeur.</p>' },
  { q: 'Intervenez-vous au Luxembourg et partout en France ?', a: '<p>Oui : la Moselle et le Luxembourg au quotidien, toute la France et l’Europe avec le réseau Les Gentlemen du Déménagement.</p>' }
];
await emit('/', layout({
  path: '/',
  title: 'Déménageur Moselle & Luxembourg | Aaction Dem',
  description: 'Déménageur en Moselle et au Luxembourg depuis 30 ans : particuliers, entreprises, garde-meuble. Agences à Knutange et Metz. Devis gratuit.',
  preload: 'hero-demenageur',
  ld: [{ '@type': 'WebPage', '@id': abs('/#webpage'), url: abs('/'), name: 'Aaction Dem – déménageur en Moselle et au Luxembourg', isPartOf: { '@id': abs('/#website') }, about: { '@id': orgId }, inLanguage: 'fr-FR' }, ...site.agencies.map(agencyLd)],
  body: `
<section class="hero"${dims._heroBg ? ` style="background:${dims._heroBg}"` : ''}><div class="wrap hero__in">
  <div class="hero__txt">
    <h1><span class="sr-only">Déménageur en Moselle et au Luxembourg – </span>Garde tes amis.<br>Fais appel<br>à des pros</h1>
    <p class="hero__kicker">Déménageurs en Moselle et au Luxembourg.</p>
    <p class="hero__lead">Aaction Dem offre un <strong>service complet de déménagement</strong>, d’emballage, de déballage et de stockage pour les déménagements locaux et longue distance.</p>
    <a class="btn btn--white" href="/contact/">Demander un devis gratuit ${ic.arrow}</a>
  </div>
  <div class="hero__img">${img('hero-demenageur', { eager: true, sizes: '(max-width: 860px) 100vw, 600px' })}${dims['hero-demenageur'] ? '' : '<p class="badge30" aria-hidden="true">30 ans<small>d’expérience</small></p>'}</div>
</div></section>
${stats}
<section class="sec sec--pink" aria-labelledby="services"><div class="wrap">
  <div class="sec__head"><h2 id="services">Tout ce qu’il faut pour bouger</h2><p>Un service de déménagement complet pour particuliers et professionnels</p></div>
  ${servicesCards}
  <p class="center"><a class="btn btn--red" href="/services-demenagement/">Voir tous nos services</a></p>
</div></section>
<section class="sec sec--green" aria-labelledby="formules"><div class="wrap formules">
  <div><h2 id="formules">À vous de choisir jusqu’où on vous aide</h2><p>Une formule pour tous les types de déménagement.</p></div>
  ${formulesGrid}
</div></section>
${networkHtml}
<section class="sec sec--pink" aria-labelledby="avis"><div class="wrap">
  <div class="sec__head sec__head--split"><div><h2 id="avis">Vos premiers mots après les cartons</h2><p>Nos clients nous recommandent sans hésiter</p></div>${gBadge}</div>
  ${reviewsHtml}
  <p class="center"><a class="btn btn--red" href="/avis/">Voir tous les avis</a></p>
</div></section>
${agenciesHtml}
${partnersHtml}
<section class="sec" aria-labelledby="faq-home"><div class="wrap">
  <div class="sec__head"><h2 id="faq-home">Questions fréquentes</h2><p>Tout savoir avant de déménager en Moselle ou au Luxembourg</p></div>
  ${faqHtml(homeFaq)}
  <p class="center"><a class="btn btn--outline-red" href="/faq/">Voir toutes les questions</a></p>
</div></section>
${quoteSection}`
}), { priority: '1.0' });

const EN_LUX = '/en/movers-luxembourg/';
// ---------------------------------------------------------------- Pages article
// Avis affichés sur chaque page : avis de l'agence concernée (données Google) ou avis dont le texte
// correspond au sujet de la page ; sinon une sélection différente par page. Aucun avis n'est attribué à tort à une ville.
const reviewKeys = {
  'demenagement-knutange': ['knutange'], 'demenagement-thionville': ['knutange', 'thionville'], 'demenagement-metz': ['metz'],
  'demenagement-luxembourg': ['luxembourg', 'chamonix', 'bretagne'], 'demenagement-longwy': ['longwy', 'chamonix', 'bretagne'],
  'particulier': ['famille', 'chamonix', 'bretagne', 'démontage'], 'entreprise': ['bureau', 'entreprise', 'professionnel'],
  'garde-meuble': ['garde', 'stock', 'soign'], 'monte-meubles-demenagement': ['monte', 'étage', 'escalier'],
  'demenagement-piano': ['piano', 'soign', 'dégât'], 'vente-materiel-demenagement': ['carton', 'conseil']
};
const pageAgency = (pg) => pg.slug === 'demenagement-metz' ? 'metz' : pg.local ? 'knutange' : '';
const pageReviews = (pg, i) => {
  const pool = reviewData.reviews.filter((r) => r.rating >= 4);
  const keys = reviewKeys[pg.slug] || [];
  const score = (r) => (pageAgency(pg) && r.agency === pageAgency(pg) ? 5 : 0) + keys.filter((k) => r.text.toLowerCase().includes(k)).length * 3 + (r.text.length > 90 ? 1 : 0);
  const ranked = pool.map((r, j) => ({ r, s: score(r), o: (j - i * 3 + pool.length * 10) % pool.length })).sort((a, b) => b.s - a.s || a.o - b.o);
  return ranked.slice(0, 3).map((x) => x.r);
};
const aside = (cur) => `<aside class="aside" aria-label="Nos services"><h2>Devis gratuit en 24 h</h2><p>Un conseiller vous rappelle rapidement pour étudier votre projet.</p>
<a class="btn btn--red" href="/contact/">Demander un devis</a><a class="btn btn--outline-red" href="tel:${site.phone.replace(/\s/g, '')}">${ic.phone} ${site.phoneDisplay}</a>
<ul>${pages.filter((p) => p.slug !== cur).map((p) => `<li><a href="/${p.slug}/">${p.service}</a></li>`).join('')}<li><a href="/formules-demenagement/">Nos formules</a></li></ul></aside>`;

for (const [pi, pg] of pages.entries()) {
  const p = `/${pg.slug}/`;
  const inPart = pg.local || pg.parent === 'particulier';
  const parent = pg.slug === 'particulier' ? [] : inPart ? [{ name: 'Particulier', href: '/particulier/' }] : [{ name: 'Services', href: '/services-demenagement/' }];
  const trail = [{ name: 'Accueil', href: '/' }, ...parent, { name: pg.crumb, href: p }];
  const ld = [
    { '@type': 'WebPage', '@id': abs(p + '#webpage'), url: abs(p), name: pg.title, description: pg.description, isPartOf: { '@id': abs('/#website') }, breadcrumb: { '@id': abs(p + '#breadcrumb') }, primaryImageOfPage: abs(imgMeta[pg.img].src), inLanguage: 'fr-FR' },
    { ...crumbsLd(trail), '@id': abs(p + '#breadcrumb') },
    { '@type': 'Service', name: pg.service, serviceType: pg.service, description: pg.description, provider: { '@id': orgId }, areaServed: pg.local ? { '@type': 'City', name: pg.local } : site.areaServed.map((n) => ({ '@type': 'Place', name: n })), url: abs(p) },
    ...(pg.faq?.length ? [faqLd(pg.faq)] : [])
  ];
  await emit(p, layout({
    path: p, title: pg.title, description: pg.description, ld, preload: pg.img, ogImage: pg.img,
    current: p, alt: pg.slug === 'demenagement-luxembourg' ? { fr: p, en: EN_LUX } : undefined,
    body: `
<section class="phero${pg.heroTheme ? ' phero--' + pg.heroTheme : ''}"><div class="wrap phero__in">
  <div>${crumbsHtml(trail)}<p class="hero__kicker">${pg.kicker}</p><h1>${pg.h1}</h1><p>${pg.lead}</p>
  <a class="btn btn--white" href="#devis">Devis gratuit ${ic.arrow}</a>${pg.slug === 'demenagement-luxembourg' ? `<p class="langlink"><a href="${EN_LUX}" hreflang="en" lang="en">Moving in Luxembourg? Read this page in English →</a></p>` : ''}</div>
  <div class="phero__img">${img(pg.img, { eager: true, sizes: '(max-width: 860px) 100vw, 520px' })}</div>
</div></section>
${stats}
<section class="sec"><div class="wrap layout"><article class="prose">${pg.body({ figure, img })}${(() => { const rel = posts.filter((po) => po.related.includes(pg.slug)); return rel.length ? `<div class="readmore"><p class="readmore__t">Nos conseils</p><ul>${rel.map((po) => `<li><a href="/post/${po.slug}/">${po.h1}</a></li>`).join('')}</ul></div>` : ''; })()}</article>${aside(pg.slug)}</div></section>
<section class="sec sec--pink" aria-labelledby="avis-p"><div class="wrap"><div class="sec__head"><h2 id="avis-p">Ils nous ont confié leur déménagement</h2><p>Avis Google de nos clients</p></div>
<div class="rgrid rgrid--3">${pageReviews(pg, pi).map(reviewCard).join('')}</div>
<p class="center"><a class="btn btn--outline-red" href="/avis/">Voir tous les avis</a></p></div></section>
${pg.faq?.length ? `<section class="sec sec--cream" aria-labelledby="faq-p"><div class="wrap"><div class="sec__head"><h2 id="faq-p">Questions fréquentes</h2></div>${faqHtml(pg.faq)}</div></section>` : ''}
<section class="sec" aria-labelledby="voir-aussi"><div class="wrap"><div class="sec__head"><h2 id="voir-aussi">À découvrir aussi</h2></div>${relatedHtml(pg.related)}</div></section>
${quoteSection}`
  }), { priority: pg.local ? '0.9' : '0.8' });
}

// ---------------------------------------------------------------- English : movers Luxembourg
{
  const p = EN_LUX;
  const trail = [{ name: 'Home', href: '/' }, { name: 'Movers in Luxembourg', href: p }];
  const faqEn = [
    { q: 'Do I need customs formalities to move to Luxembourg from France?', a: '<p>No. Luxembourg and France are both in the European Union, so there are no customs formalities for your personal belongings. You will, however, need to register with your new commune (commune de résidence) within 8 days of arrival.</p>' },
    { q: 'How much does a move between France and Luxembourg cost?', a: '<p>The price depends on the volume of furniture, the distance, access at both addresses (floor, lift, parking) and the service level you choose. The pre-move survey and the quote are free: <a href="#devis">request yours</a>.</p>' },
    { q: 'Do I have to book the lift in my Luxembourg residence?', a: '<p>Very often, yes. Many residences ask you to book the lift and protect common areas. We tell you what to ask your building manager (syndic) and protect the lift and hallways on the day.</p>' },
    { q: 'Which areas of Luxembourg do you cover?', a: '<p>The whole Grand Duchy: Luxembourg City (Kirchberg, Gare, Limpertsberg, Belair, Gasperich, Bonnevoie…), Esch-sur-Alzette, Belval, Differdange, Dudelange, Bettembourg, Mondorf-les-Bains and beyond.</p>' },
    { q: 'Can you store our furniture before we get the keys?', a: '<p>Yes. Our secure storage facility in Moselle, just across the border, lets you store your belongings for a few days or several months, usually at a lower cost than storage in Luxembourg.</p>' },
    { q: 'Can you move us from Luxembourg to another country?', a: '<p>Yes. As a member of Les Gentlemen du Déménagement network, we organise moves from Luxembourg to the rest of Europe and further afield, with a single point of contact.</p>' }
  ];
  const formEn = `
<form class="form" name="devis" method="POST" action="${site.formAction}" data-netlify="true" netlify-honeypot="bot-field" data-next="${BASE}/merci/" id="devis">
  <input type="hidden" name="form-name" value="devis"><input type="hidden" name="langue" value="English"><input type="hidden" name="_subject" value="New quote request (English) – Aaction Dem website"><input type="text" name="_gotcha" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
  <p class="hp"><label>Do not fill <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
  <div class="fgrid3">
    <div class="field"><label for="e-dep">Moving from *</label><input id="e-dep" name="adresse_depart" required placeholder="Town or address"></div>
    <div class="field"><label for="e-arr">Moving to *</label><input id="e-arr" name="adresse_arrivee" required placeholder="Town or address"></div>
    <div class="field"><label for="e-date">Preferred date</label><input id="e-date" name="date" type="date" data-datepicker></div>
    <div class="field"><label for="e-name">Your name *</label><input id="e-name" name="nom" required autocomplete="name"></div>
    <div class="field"><label for="e-mail">Email *</label><input id="e-mail" name="email" type="email" required autocomplete="email"></div>
    <div class="field"><label for="e-tel">Phone *</label><div class="tel"><select name="indicatif" aria-label="Country code"><option>LU +352</option><option>FR +33</option><option>BE +32</option><option>DE +49</option><option>GB +44</option></select><input id="e-tel" name="telephone" type="tel" required autocomplete="tel-national"></div></div>
    <div class="field field--full"><label for="e-msg">Details (floor, lift, heavy items, storage…)</label><textarea id="e-msg" name="message"></textarea></div>
  </div>
  <label class="consent"><input type="checkbox" name="rgpd" required> <span>I agree that my data may be used to process my quote request, in accordance with the <a href="/politique-de-confidentialite/" hreflang="fr">privacy policy</a> (in French).</span></label>
  <button class="btn btn--red" type="submit">Get my free quote ${ic.arrow}</button>
</form>`;
  await emit(p, layout({
    path: p, lang: 'en', alt: { fr: '/demenagement-luxembourg/', en: p },
    title: 'Movers in Luxembourg – France ↔ Luxembourg | Aaction Dem',
    description: 'Removal company for Luxembourg and cross-border moves with France. Free survey and quote, packing, storage, international moves. 30+ years of experience.',
    preload: 'demenagement-luxembourg', ogImage: 'demenagement-luxembourg', current: '/demenagement-luxembourg/',
    ld: [crumbsLd(trail), { '@type': 'WebPage', '@id': abs(p) + '#webpage', url: abs(p), name: 'Movers in Luxembourg', inLanguage: 'en' },
      { '@type': 'Service', name: 'Removals to and from Luxembourg', serviceType: 'Moving service', provider: { '@id': orgId }, areaServed: { '@type': 'Country', name: 'Luxembourg' }, availableLanguage: ['fr', 'en'] }, faqLd(faqEn)],
    body: `
<section class="phero"><div class="wrap phero__in">
  <div>${crumbsHtml(trail)}<p class="hero__kicker">France ↔ Luxembourg</p><h1>Movers in Luxembourg</h1><p>Moving to Luxembourg, within the Grand Duchy or back to France? Based just across the border in Moselle, Aaction Dem has handled cross-border removals for more than 30 years.</p>
  <a class="btn btn--white" href="#devis">Free quote ${ic.arrow}</a><p class="langlink"><a href="/demenagement-luxembourg/" hreflang="fr" lang="fr">Version française →</a></p></div>
  <div class="phero__img">${img('demenagement-luxembourg', { eager: true, sizes: '(max-width: 860px) 100vw, 520px', alt: 'Movers carrying boxes into a residential building in Luxembourg City' })}</div>
</div></section>
<section class="stats" aria-label="Aaction Dem in figures"><div class="wrap"><ul>
  <li>${ic.box}<div><strong>30+</strong><span>Years of experience</span></div></li>
  <li>${ic.truck}<div><strong>1,200</strong><span>Moves per year</span></div></li>
  <li>${ic.medal}<div><strong>2</strong><span>Agencies in Moselle</span></div></li>
  <li>${ic.medal}<div><strong>70+</strong><span>Partner movers in the network</span></div></li>
</ul></div></section>
<section class="sec"><div class="wrap prose">
<h2>A removal company that knows both sides of the border</h2>
<p>Every week our crews drive between Moselle and Luxembourg. We move expatriates arriving for a new job, cross-border workers settling in the Grand Duchy, families heading back to France and companies relocating their offices. You get one point of contact from the first call to the last box unpacked.</p>
<h2>What we do</h2>
<ul class="checks">
  <li><strong>Free pre-move survey</strong>, at your home or by video call, to assess the volume and access.</li>
  <li><strong>Detailed written quote</strong> with no hidden costs, including insurance.</li>
  <li><strong>Packing and unpacking</strong> of fragile items, or of your entire home, depending on the service level.</li>
  <li><strong>Dismantling and reassembly</strong> of furniture, protection of the lift and common areas.</li>
  <li><strong>Furniture lift</strong> when items do not fit in the staircase or lift.</li>
  <li><strong>Secure storage</strong> in Moselle while you wait for the keys.</li>
</ul>
<figure class="figure">${img('dechargement-camion', { sizes: '(max-width: 960px) 100vw, 720px', alt: 'Mover unloading protected furniture from a Les Gentlemen du Déménagement truck' })}<figcaption>Careful loading and unloading, whatever the destination.</figcaption></figure>
<h2>Moving within Luxembourg City and the Grand Duchy</h2>
<p>Kirchberg, Gare, Limpertsberg, Belair, Gasperich, Bonnevoie, Merl: we are used to Luxembourg residences, where the lift usually has to be booked, underground car parks have restricted access and common areas must be protected. We also move households in Esch-sur-Alzette, Belval, Differdange, Dudelange, Bettembourg and the rest of the country.</p>
<h2>Cross-border and international moves</h2>
<p>From our head office in Knutange, about 20 minutes from the border, we handle moves between France and Luxembourg in both directions. Through Les Gentlemen du Déménagement network we also organise moves from Luxembourg to the rest of France, Germany, Belgium, the Netherlands and further afield.</p>
<h2>Four service levels</h2>
<p>Choose how much you want to do yourself: <strong>Mobilier seul</strong> (we move the furniture, you pack), <strong>Dynamic +</strong> (furniture and boxes, you pack), <strong>Comfort</strong> (we pack and unpack fragile items) or <strong>Comfort +</strong> (we pack everything). Details are on our <a href="/formules-demenagement/" hreflang="fr">service levels page</a> (in French).</p>
<h2>Contact us</h2>
<p>Call <a href="tel:${site.phone.replace(/\s/g, '')}">+33 3 82 85 49 43</a>, email <a href="mailto:${site.email}">${site.email}</a> or fill in the form below. Our head office is at ${site.agencies[0].street}, ${site.agencies[0].zip} ${site.agencies[0].city}, France.</p>
</div></section>
<section class="sec sec--cream" aria-labelledby="faq-en"><div class="wrap"><div class="sec__head"><h2 id="faq-en">Frequently asked questions</h2></div>${faqHtml(faqEn)}</div></section>
<section class="quote" aria-labelledby="devis-titre"><div class="wrap">
  <div class="quote__top"><div><h2 id="devis-titre">Request your<br>free quote</h2><p>Tell us about your move and we will get back to you as soon as possible.</p></div>
  ${img('equipe-demenageurs', { sizes: '(max-width: 860px) 100vw, 640px', alt: 'The Aaction Dem moving team in front of their trucks' })}</div>
  ${formEn}
</div></section>`
  }), { priority: '0.7' });
}

// ---------------------------------------------------------------- Blog (articles repris de l'ancien site, mêmes URL /post/<slug>)
const frLongDate = (d) => new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(d));
const postCard = (po) => `<a class="pcard" href="/post/${po.slug}/">${img(po.img, { sizes: '(max-width: 860px) 100vw, 420px' })}<span class="pcard__cat">${po.cat}</span><h3>${po.h1}</h3><p>${po.excerpt}</p><span class="more">Lire l’article ${ic.arrow}</span></a>`;
{
  const p = '/blog/';
  const trail = [{ name: 'Accueil', href: '/' }, { name: 'Conseils', href: p }];
  await emit(p, layout({
    path: p, title: 'Conseils déménagement : prix, Metz, Luxembourg | Aaction Dem',
    description: 'Les conseils de nos déménageurs : prix d’un déménagement, déménagement de piano, déménager à Metz ou au Luxembourg.',
    ld: [crumbsLd(trail), { '@type': 'Blog', '@id': abs(p + '#blog'), url: abs(p), name: 'Conseils déménagement Aaction Dem', publisher: { '@id': orgId }, blogPost: posts.map((po) => ({ '@type': 'BlogPosting', headline: po.h1, url: abs(`/post/${po.slug}/`), datePublished: po.date })) }],
    body: `
<section class="phero phero--green"><div class="wrap" style="padding:3.5rem 0">${crumbsHtml(trail)}<h1>Nos conseils déménagement</h1><p style="max-width:44rem">Prix, organisation, déménagement de piano, Metz ou Luxembourg : les réponses de nos équipes pour préparer votre projet.</p></div></section>
<section class="sec sec--cream"><div class="wrap"><div class="pgrid">${posts.map(postCard).join('')}</div></div></section>
${quoteSection}`
  }), { priority: '0.6' });
}
for (const po of posts) {
  const p = `/post/${po.slug}/`;
  const trail = [{ name: 'Accueil', href: '/' }, { name: 'Conseils', href: '/blog/' }, { name: po.h1, href: p }];
  const others = posts.filter((x) => x.slug !== po.slug);
  await emit(p, layout({
    path: p, title: po.title, description: po.description, preload: po.img, ogImage: po.img,
    ld: [crumbsLd(trail), { '@type': 'BlogPosting', '@id': abs(p + '#article'), headline: po.h1, description: po.description, datePublished: po.date, dateModified: po.date, image: abs(imgMeta[po.img].src), author: { '@id': orgId }, publisher: { '@id': orgId }, mainEntityOfPage: abs(p), inLanguage: 'fr-FR' }],
    body: `
<section class="phero"><div class="wrap phero__in">
  <div>${crumbsHtml(trail)}<p class="hero__kicker">${po.cat} · Mis à jour le ${frLongDate(po.date)}</p><h1>${po.h1}</h1><p>${po.excerpt}</p>
  <a class="btn btn--white" href="#devis">Devis gratuit ${ic.arrow}</a></div>
  <div class="phero__img">${img(po.img, { eager: true, sizes: '(max-width: 860px) 100vw, 520px' })}</div>
</div></section>
<section class="sec"><div class="wrap layout"><article class="prose">${po.body}</article>${aside('')}</div></section>
<section class="sec sec--cream" aria-labelledby="a-lire"><div class="wrap"><div class="sec__head"><h2 id="a-lire">À lire aussi</h2></div><div class="pgrid">${others.map(postCard).join('')}</div></div></section>
<section class="sec" aria-labelledby="voir-aussi"><div class="wrap"><div class="sec__head"><h2 id="voir-aussi">Nos services liés</h2></div>${relatedHtml(po.related)}</div></section>
${quoteSection}`
  }), { priority: '0.6' });
}

// Anciennes URL de l'ancien site sans équivalent direct : pages de redirection (meta refresh + canonical, équivalent 301 pour Google)
const redirectStub = async (from, to) => {
  const file = path.join(dist, from, 'index.html');
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, withBase(`<!doctype html><html lang="fr-FR"><head><meta charset="utf-8"><title>Redirection</title><meta name="robots" content="noindex, follow"><link rel="canonical" href="${abs(to)}"><meta http-equiv="refresh" content="0; url=${BASE}${to}"><script>location.replace('${BASE}${to}')</script></head><body><p><a href="${to}">Continuer vers la page</a></p></body></html>`));
};
for (const [from, to] of [['mentions-légales', '/mentions-legales/'], ['politique-de-confidentialité', '/politique-de-confidentialite/'], ['politique-de-cookies', '/politique-de-confidentialite/']]) await redirectStub(from, to);

// ---------------------------------------------------------------- Services (hub)
{
  const p = '/services-demenagement/';
  const trail = [{ name: 'Accueil', href: '/' }, { name: 'Services', href: p }];
  await emit(p, layout({
    path: p, title: 'Nos services de déménagement en Moselle | Aaction Dem',
    description: 'Tous les services Aaction Dem : déménagement de particuliers et d’entreprises, garde-meuble, location de monte-meuble, Luxembourg.',
    ld: [crumbsLd(trail), { '@type': 'ItemList', itemListElement: pages.map((pg, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(`/${pg.slug}/`), name: pg.service })) }],
    body: `
<section class="phero"><div class="wrap" style="padding:3.5rem 0">${crumbsHtml(trail)}<h1>Nos services de déménagement</h1><p style="max-width:44rem">Particuliers, entreprises : un service complet de déménagement, d’emballage, de stockage et de manutention en Moselle, au Luxembourg et partout en France.</p></div></section>
<section class="sec"><div class="wrap prose"><h2>Des services pour chaque étape de votre projet</h2><p>Particulier ou professionnel, Aaction Dem vous accompagne avec des solutions pratiques et sécurisées, du simple transport d’objets encombrants au déménagement clé en main. Parmi nos prestations les plus demandées : la <a href="/monte-meubles-demenagement/">location de monte-meuble avec opérateur</a>, le <a href="/garde-meuble/">garde-meuble sécurisé à Knutange</a> et la <a href="/vente-materiel-demenagement/">vente de matériel de déménagement</a>.</p><p>Service client réactif, tarifs transparents et intervention rapide, aussi bien pour un petit déménagement à <a href="/demenagement-metz/">Metz</a> ou <a href="/demenagement-thionville/">Thionville</a> que pour un transfert d’entreprise ou un déménagement international.</p></div></section>
<section class="sec sec--pink"><div class="wrap">${servicesCards}</div></section>
<section class="sec"><div class="wrap prose">
<h2>Ce que comprend un déménagement Aaction Dem</h2>
<p>Quelle que soit la prestation, la méthode reste la même : une <strong>visite technique gratuite</strong> pour évaluer le volume et les accès, un <strong>devis écrit et détaillé</strong>, puis une équipe dédiée le jour J. Selon la <a href="/formules-demenagement/">formule choisie</a>, nous prenons en charge :</p>
<ul class="checks">
  <li><strong>La protection</strong> du mobilier sous couvertures et housses, et des parties communes.</li>
  <li><strong>Le démontage et le remontage</strong> des meubles, avec l’outillage adapté.</li>
  <li><strong>L’emballage</strong> de la vaisselle et des objets fragiles, ou de l’ensemble de vos affaires.</li>
  <li><strong>Le transport</strong> dans des camions capitonnés, en local comme en longue distance.</li>
  <li><strong>Les démarches</strong> d’autorisation de stationnement auprès des mairies.</li>
</ul>
<h2>Des moyens qui font la différence</h2>
<p>Certains déménagements demandent plus que des bras : un piano à faire passer dans un escalier tournant, un canapé qui ne passe pas la cage d’escalier, des meubles à stocker trois mois entre deux logements. C’est pourquoi nous disposons de nos propres <a href="/monte-meubles-demenagement/">monte-meubles avec opérateur</a>, d’un <a href="/garde-meuble/">garde-meuble sécurisé</a> et de matériel de manutention spécifique pour les <a href="/demenagement-piano/">pianos</a> et les objets lourds.</p>
<h2>Pour les particuliers comme pour les professionnels</h2>
<p>Studio étudiant, appartement familial ou maison avec jardin : nos <a href="/particulier/">déménagements de particuliers</a> s’adaptent à votre budget. Bureaux, commerces et cabinets bénéficient d’un <a href="/entreprise/">transfert d’entreprise</a> planifié pour limiter l’interruption d’activité, y compris en soirée ou le week-end selon nos disponibilités.</p>
</div></section>
<section class="sec sec--cream"><div class="wrap"><div class="sec__head"><h2>Services spécialisés &amp; zones d’intervention</h2></div>${relatedHtml(['entreprise', 'demenagement-piano', 'vente-materiel-demenagement', 'demenagement-metz', 'demenagement-thionville', 'demenagement-knutange', 'demenagement-longwy', 'demenagement-luxembourg', 'formules-demenagement'])}</div></section>
${quoteSection}`
  }), { priority: '0.8' });
}

// ---------------------------------------------------------------- Formules
{
  const p = '/formules-demenagement/';
  const trail = [{ name: 'Accueil', href: '/' }, { name: 'Formules', href: p }];
  // Matrice des formules (✓ inclus, ✗ non inclus, o = en option)
  const feats = [
    ['shield', 'Protection des meubles et de l’électroménager', ['y', 'y', 'y', 'y']],
    ['truck', 'Transport sécurisé', ['y', 'y', 'y', 'y']],
    ['home', 'Remise en place à l’arrivée', ['y', 'y', 'y', 'y']],
    ['boxes', 'Transport des cartons', ['n', 'y', 'y', 'y']],
    ['glass', 'Emballage du fragile', ['n', 'n', 'y', 'y']],
    ['cube', 'Emballage du non-fragile', ['n', 'n', 'n', 'y']],
    ['open', 'Déballage du fragile', ['n', 'n', 'y', 'y']],
    ['open', 'Déballage du non-fragile', ['n', 'n', 'n', 'o']]
  ];
  const fi = {
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
    truck: '<path d="M2 7h12v9H2zM14 10h4l3 3v3h-7z"/><circle cx="6" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
    home: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
    boxes: '<path d="M9 8l6-3 6 3v8l-6 3-6-3z"/><path d="M9 8l6 3 6-3M15 11v8"/><path d="M2 9h4M3 12h3M2 15h4"/>',
    glass: '<path d="M7 3h10l-1 7a4 4 0 0 1-8 0z"/><path d="M12 14v6M8 21h8"/>',
    cube: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M4 7.5l8 4.5 8-4.5M12 12v9"/>',
    open: '<path d="M4 9l8 3 8-3v9l-8 3-8-3z"/><path d="M12 12v9M4 9l3-4 8 3M20 9l-3-4-8 3"/>'
  };
  const svgI = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const mark = {
    y: '<span class="fmark fmark--y" role="img" aria-label="Inclus"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>',
    n: '<span class="fmark fmark--n" role="img" aria-label="Non inclus"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17"/></svg></span>',
    o: '<span class="fmark fmark--o">En option</span>'
  };
  const plans = `<div class="fcomp" role="list">${formules.map((f, i) => {
    const best = i === formules.length - 1;
    return `<article class="fplan${best ? ' fplan--best' : ''}" id="${f.id}" role="listitem">
      ${best ? '<p class="fplan__badge">Le plus complet</p>' : ''}
      <header class="fplan__head">${ic[f.icon]}<h3>${f.title}</h3><p>${f.text}</p></header>
      <ul class="fplan__list">${[...feats].sort((a, b) => ({ y: 0, o: 1, n: 2 })[a[2][i]] - ({ y: 0, o: 1, n: 2 })[b[2][i]]).map(([icon, label, v]) => `<li class="is-${v[i]}">${svgI(fi[icon])}<span>${label}</span>${mark[v[i]]}</li>`).join('')}</ul>
      <a class="btn ${best ? 'btn--red' : 'btn--outline-red'}" href="/contact/">Devis gratuit ${ic.arrow}</a>
    </article>`;
  }).join('')}</div>`;
  await emit(p, layout({
    path: p, title: formulesPage.title, description: formulesPage.description,
    ld: [crumbsLd(trail), ...formules.map((f) => ({ '@type': 'Service', name: `Formule ${f.title}`, description: f.text, provider: { '@id': orgId }, url: abs(p + '#' + f.id) }))],
    current: '/formules-demenagement/',
    body: `
<section class="phero phero--green fhero" aria-labelledby="formules-titre"><div class="wrap">
  ${crumbsHtml(trail)}
  <div class="fhero__head"><p class="hero__kicker">Nos formules de déménagement</p><h1 id="formules-titre">${formulesPage.h1}</h1><p>${formulesPage.lead} Comparez ce qui est inclus dans chaque formule.</p></div>
  ${plans}
  <p class="fcomp__hint" aria-hidden="true">← Faites glisser pour comparer les 4 formules →</p>
</div></section>
<section class="sec" aria-labelledby="choisir"><div class="wrap">
  <div class="sec__head"><p class="eyebrow">Besoin d’aide pour choisir ?</p><h2 id="choisir">Quelle formule pour votre profil ?</h2><p>Votre budget, votre temps et la quantité d’objets fragiles font la différence. Repérez-vous en un coup d’œil.</p></div>
  <ol class="guide">${[
    ['mobilier-seul', 'Budget serré, du temps devant vous', 'Vous emballez et transportez vous-même vos cartons. Nous nous chargeons de tout ce qui est lourd et encombrant : meubles et électroménager.'],
    ['dynamic-plus', 'Vous emballez, nous portons', 'Vous préparez vos cartons à votre rythme. Le jour J, nos déménageurs chargent et transportent tout, meubles comme cartons.'],
    ['comfort', 'Beaucoup de vaisselle et d’objets fragiles', 'Vous gérez le linge, les livres et les vêtements. Nous emballons et déballons le fragile avec du matériel professionnel.'],
    ['comfort-plus', 'Agenda chargé, famille ou mutation', 'Vous n’avez rien à préparer : nous emballons tout et déballons le fragile. Le déballage du reste est disponible en option.']
  ].map(([id, profil, txt], i) => { const f = formules.find((x) => x.id === id); return `<li class="guide__item">
      <span class="guide__n">0${i + 1}.</span>
      <p class="guide__tag">Pour vous si…</p>
      <h3>${profil}</h3>
      <p>${txt}</p>
      <a class="guide__link" href="#${id}">Formule ${f.title} ${ic.arrow}</a>
    </li>`; }).join('')}</ol>
  <ul class="included" aria-label="Inclus dans toutes les formules">
    <li><strong>Inclus dans toutes les formules</strong></li>
    <li>${ic.medal}Devis gratuit et sans engagement</li>
    <li>${ic.box}Matériel de protection professionnel</li>
    <li>${ic.truck}Camions équipés et équipe formée</li>
    <li>${ic.iso}Assurance de vos biens</li>
  </ul>
</div></section>
${quoteSection}`
  }), { priority: '0.8' });
}

// ---------------------------------------------------------------- Avis
{
  const p = '/avis/';
  const trail = [{ name: 'Accueil', href: '/' }, { name: 'Avis clients', href: p }];
  await emit(p, layout({
    path: p, title: 'Avis clients – déménageur Aaction Dem en Moselle',
    description: 'Découvrez les avis de nos clients sur leurs déménagements avec Aaction Dem à Metz, Thionville, Knutange et au Luxembourg.',
    ld: [crumbsLd(trail)], current: '/avis/', preload: 'avis-clients', ogImage: 'avis-clients',
    body: `
<section class="phero phero--green"><div class="wrap phero__in">
  <div>${crumbsHtml(trail)}<p class="hero__kicker">Avis clients</p><h1>Vos premiers mots après les cartons</h1><p>Les avis Google de nos clients de Knutange, Metz et environs. Voici ce qu’ils disent de nous.</p>
  <a class="btn btn--white" href="#tous-les-avis">Lire les avis ${ic.arrow}</a></div>
  <div class="phero__img">${img('avis-clients', { eager: true, sizes: '(max-width: 860px) 100vw, 700px' })}</div>
</div></section>
${ratingBand}
<section class="sec sec--pink" id="tous-les-avis" aria-label="Tous les avis"><div class="wrap"><div class="rgrid">${reviewData.reviews.map(reviewCard).join('')}</div>
<div class="rcta"><p>Vous avez déménagé avec nous ? <strong>Partagez votre expérience sur Google</strong>, cela aide d’autres familles à choisir leur déménageur.</p>
<p>${site.agencies.map((a) => `<a class="btn btn--red" href="${a.maps}" target="_blank" rel="noopener">Avis Google – ${a.city} ${ic.arrow}</a>`).join(' ')}</p>
${reviewData.updatedAt ? `<p class="rcta__upd">Avis 4 et 5 étoiles mis à jour automatiquement le ${frDate(reviewData.updatedAt, { day: 'numeric', month: 'long', year: 'numeric' })}.</p>` : ''}</div></div></section>
${band}`
  }), { priority: '0.6' });
}

// ---------------------------------------------------------------- FAQ
{
  const p = '/faq/';
  const trail = [{ name: 'Accueil', href: '/' }, { name: 'FAQ', href: p }];
  await emit(p, layout({
    path: p, title: 'FAQ déménagement : prix, assurance, délais | Aaction Dem',
    description: 'Prix d’un déménagement en Moselle, délais de réservation, assurance, cartons, garde-meuble, Luxembourg : toutes les réponses de nos déménageurs.',
    ld: [crumbsLd(trail), faqLd(faqGeneral)], current: '/faq/',
    body: `
<section class="phero phero--green faqhero"><div class="wrap faqhero__in">
  <div class="faqhero__txt">${crumbsHtml(trail)}<p class="hero__kicker">FAQ</p><h1>Questions fréquentes sur le déménagement</h1><p>${faqGeneral.length} réponses pour préparer votre projet en toute sérénité : devis, préparation, jour J, assurance, démarches…</p></div>
  <ul class="faqhero__cats">${[
    ['prix', 'Devis et prix', '<circle cx="12" cy="12" r="9.5"/><path d="M15.5 8.6a4.2 4.2 0 1 0 0 6.8M7 10.8h6M7 13.4h6"/>'],
    ['organisation', 'Préparation', '<path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5z"/><path d="M3.5 7.5 12 12l8.5-4.5M12 12v9M7.8 5.2l8.5 4.6"/>'],
    ['jour', 'Jour J', '<path d="M2 6.5h11.5v9.5H2zM13.5 9.5h4.2l3.3 3.6v2.9h-7.5z"/><circle cx="6" cy="17.5" r="1.9"/><circle cx="17" cy="17.5" r="1.9"/>']
  ].map(([id, label, d]) => `<li><a href="#questions" data-faqcat="${id}"><svg viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg><span>${label}</span></a></li>`).join('')}</ul>
</div></section>
<section class="sec sec--cream" id="questions"><div class="wrap">
<div class="ffilter" role="toolbar" aria-label="Filtrer les questions par thème" hidden>${[['all', 'Toutes']].concat(faqCats).map(([id, label]) => `<button type="button" data-cat="${id}" aria-pressed="${id === 'all'}">${label} <span>${id === 'all' ? faqGeneral.length : faqGeneral.filter((f) => f.cat === id).length}</span></button>`).join('')}</div>
<div class="faq faq--filter">${faqGeneral.map((f) => `<details data-cat="${f.cat}"><summary>${f.q}</summary><div>${f.a}</div></details>`).join('')}</div>
</div></section>
${band}`
  }), { priority: '0.7' });
}

// ---------------------------------------------------------------- Devis / contact
{
  const p = '/contact/';
  const trail = [{ name: 'Accueil', href: '/' }, { name: 'Devis gratuit', href: p }];
  await emit(p, layout({
    path: p, title: 'Devis déménagement gratuit en 24 h | Aaction Dem',
    description: 'Demandez votre devis de déménagement gratuit et sans engagement. Réponse sous 24 h. Agences à Knutange et Metz – 03 82 85 49 43.',
    ld: [crumbsLd(trail), { '@type': 'ContactPage', url: abs(p), name: 'Devis gratuit', about: { '@id': orgId } }, ...site.agencies.map(agencyLd)], current: '/contact/',
    body: `
<section class="chero"><div class="wrap chero__in">
  <div class="chero__txt">${crumbsHtml(trail)}<h1>Devis de déménagement gratuit</h1>
    <p class="chero__lead">Décrivez votre projet en quelques clics et recevez un devis personnalisé rapidement, gratuit et sans engagement.</p>
    <ul class="chero__facts"><li><svg viewBox="0 0 48 48" width="40" height="40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="24" cy="27" r="15"/><path d="M24 27V18M20 6h8M24 6v6M36 13l3-3"/></svg><p><strong>Réponse rapide</strong>sous 24 h ouvrées</p></li><li><svg viewBox="0 0 48 48" width="40" height="40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M26 6h14v14L21 39a3 3 0 0 1-4.2 0L9 31.2a3 3 0 0 1 0-4.2z"/><circle cx="33" cy="13" r="2.5"/></svg><p><strong>Devis 100 % gratuit</strong>et personnalisé</p></li><li><svg viewBox="0 0 48 48" width="40" height="40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 22l7-7 8 2 5-3 5 3 8-2 7 7"/><path d="M11 15l-5 13 4 3M37 15l5 13-4 3"/><path d="M14 30l5 5a2.5 2.5 0 0 0 3.5-3.5M19 27l6.5 6.5a2.5 2.5 0 0 0 3.5-3.5L24 25M24 25l-3-3c-1.5-1.5-4-1.5-5.5 0L14 23.5M29 30l1.5 1.5a2.5 2.5 0 0 0 3.5-3.5L28 22"/></svg><p><strong>Sans engagement</strong>de votre part</p></li></ul>
    <p class="chero__call">Vous préférez parler à quelqu’un ? <a href="tel:${site.phone.replace(/\s/g, '')}">${ic.phone} ${site.phoneDisplay}</a></p></div>
  <div class="chero__form">${quoteFormCompact()}</div>
</div></section>
<section class="sec"><div class="wrap"><div class="sec__head"><h2>Venez à notre rencontre</h2><p>Une question, une visite du garde-meuble ou du matériel à récupérer ? Nous vous accueillons dans nos agences de Knutange et de Metz.</p></div>
<div class="contact-grid">
  <div><h3>Par téléphone</h3><p><a href="tel:${site.phone.replace(/\s/g, '')}">${site.phoneDisplay}</a><br>Du lundi au vendredi, 08:45–12:00 et 14:00–17:30</p></div>
  <div><h3>Par e-mail</h3><p><a href="mailto:${site.email}">${site.email}</a><br>Réponse sous 24 h ouvrées</p></div>
  <div><h3>Sur les réseaux</h3><p>${site.social.map((x) => `<a href="${x.href}" target="_blank" rel="noopener">${x.name}</a>`).join(' · ')}</p></div>
</div></div></section>
<section class="sec sec--cream" aria-labelledby="carte"><div class="wrap"><div class="sec__head"><h2 id="carte">Nos agences sur la carte</h2><p>Deux agences en Moselle, à une trentaine de kilomètres l’une de l’autre, pour couvrir le nord mosellan, l’agglomération messine et le Luxembourg.</p></div>
<div class="maps">${site.agencies.map((a) => `
  <article class="mapcard"><div class="mapbox mapbox--on"><iframe src="${a.maps}&amp;output=embed" title="Carte de l’agence Aaction Dem de ${a.city}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div>
    <div class="mapcard__txt"><h3>Agence de ${a.city}${a.id === site.agencies[0].id ? ' <span>(siège)</span>' : ''}</h3><address>${a.street}<br>${a.zip} ${a.city}</address><p>${a.hoursText}</p>
    <p><a href="${a.maps}" target="_blank" rel="noopener">Itinéraire sur Google Maps ↗</a> · <a href="${a.id === 'metz' ? '/demenagement-metz/' : '/demenagement-knutange/'}">Déménageur ${a.city}</a></p></div></article>`).join('')}
</div></div></section>
<section class="sec" aria-labelledby="etapes"><div class="wrap prose"><h2 id="etapes">Que se passe-t-il après votre demande de devis ?</h2>
<ol class="steps">
  <li><strong>Prise de contact</strong> – Un conseiller vous rappelle pour faire le point sur votre projet : adresses, date souhaitée, type de logement et contraintes particulières.</li>
  <li><strong>Visite technique</strong> – Gratuite, à domicile ou en visio, elle permet d’estimer précisément le volume et de repérer les accès (étages, ascenseur, stationnement).</li>
  <li><strong>Devis détaillé</strong> – Vous recevez un devis écrit, avec la formule choisie, les prestations incluses et la déclaration de valeur à compléter.</li>
  <li><strong>Réservation</strong> – Le devis signé, la date est bloquée. Nous vous fournissons les cartons si besoin et pouvons nous occuper de l’autorisation de stationnement.</li>
</ol>
<h2>Une zone d’intervention de la Moselle au Luxembourg</h2>
<p>Depuis Knutange et Metz, nous intervenons au quotidien à <a href="/demenagement-metz/">Metz</a>, <a href="/demenagement-thionville/">Thionville</a>, <a href="/demenagement-knutange/">Knutange</a> et dans la vallée de la Fensch, à <a href="/demenagement-longwy/">Longwy</a> et dans le Pays-Haut, ainsi qu’au <a href="/demenagement-luxembourg/">Luxembourg</a>. Pour les déménagements longue distance, le réseau Les Gentlemen du Déménagement nous permet de vous accompagner partout en France et en Europe.</p>
<p>Vous hésitez entre plusieurs niveaux de service ? Consultez nos <a href="/formules-demenagement/">formules</a> ou les réponses de notre <a href="/faq/">FAQ</a>.</p></div></section>`
  }), { priority: '0.9' });
}

// ---------------------------------------------------------------- Équipe (qui sommes-nous)
{
  const p = '/qui-sommes-nous/';
  const trail = [{ name: 'Accueil', href: '/' }, { name: 'Équipe', href: p }];
  await emit(p, layout({
    path: p, title: 'Aaction Dem, entreprise de déménagement depuis 1990',
    description: 'Fondée en 1990, Aaction Dem est une entreprise familiale de déménagement à Knutange et Metz, membre des Gentlemen du Déménagement.',
    ld: [crumbsLd(trail), { '@type': 'AboutPage', url: abs(p), name: 'Qui sommes-nous', about: { '@id': orgId } }], current: p, ogImage: 'equipe-demenageurs', preload: 'equipe-demenageurs',
    body: `
<section class="phero phero--green"><div class="wrap phero__in">
  <div>${crumbsHtml(trail)}<p class="hero__kicker">Notre histoire depuis 1990</p><h1>Votre déménagement, notre métier depuis plus de 30 ans</h1><p>Particuliers, entreprises, collectivités : une équipe familiale et expérimentée vous accompagne en Moselle, au Luxembourg, partout en France et à l’international.</p>
  <a class="btn btn--white" href="/contact/">Devis gratuit ${ic.arrow}</a></div>
  <div class="phero__img">${img('equipe-demenageurs', { eager: true, sizes: '(max-width: 860px) 100vw, 700px' })}</div>
</div></section>
${stats}
<section class="sec"><div class="wrap layout"><article class="prose">
  <h2>Une entreprise familiale née en 1990</h2>
  <p>Fondée en avril 1990, Aaction Dem s’est construite autour de valeurs familiales fortes et d’un savoir-faire transmis au fil des années. Installée à <a href="/demenagement-thionville/">Knutange</a> et à <a href="/demenagement-metz/">Metz</a>, au plus près du Luxembourg, l’entreprise s’est imposée comme un acteur reconnu du déménagement dans le Grand Est.</p>
  <h2>Une équipe structurée et expérimentée</h2>
  <p>Avec une vingtaine de collaborateurs, nous concilions tradition et organisation. Chaque intervention est préparée avec méthode, de la visite technique jusqu’à la livraison : matériel adapté, procédures précises, respect de vos biens et de vos délais.</p>
  <ul class="checks">
    <li>Déménagements de <a href="/particulier/">particuliers</a> et d’<a href="/entreprise/">entreprises</a>, transferts de bureaux.</li>
    <li>Objets lourds ou sensibles : <a href="/demenagement-piano/">pianos</a>, coffres-forts, œuvres d’art.</li>
    <li><a href="/garde-meuble/">Garde-meuble</a> et solutions de stockage.</li>
    <li>Démarche qualité et environnement ISO 9001 et ISO 14001.</li>
  </ul>
  ${figure('equipe-gentlemen', 'L’équipe Aaction Dem devant un camion Les Gentlemen du Déménagement.')}
  <h2>La force d’un réseau national</h2>
  <p>Membre des <strong>Gentlemen du Déménagement</strong>, un groupement de plus de 70 déménageurs sélectionnés en France, Aaction Dem peut organiser votre déménagement partout en France et à l’international, tout en conservant l’esprit humain et familial qui fait notre identité.</p>
  <h2>Notre engagement</h2>
  <p>Proposer un service de déménagement fiable, clair et adapté à chaque situation. Nous travaillons pour des familles, des professionnels, des collectivités et des entreprises avec la même attention portée à la préparation, à la sécurité et à la coordination.</p>
  <ul class="checks">
    <li><strong>Un interlocuteur unique</strong>, de la visite technique à la livraison.</li>
    <li><strong>Des devis clairs</strong>, gratuits et sans engagement.</li>
    <li><strong>Des équipes fidèles</strong>, formées aux objets lourds et fragiles.</li>
    <li><strong>Une entreprise engagée</strong> : tri et recyclage des emballages, démarche ISO 14001.</li>
  </ul>
  <p>Découvrez ce que nos clients disent de nous sur la page <a href="/avis/">avis clients</a>, ou <a href="/contact/">demandez votre devis gratuit</a>.</p>
</article>${aside('qui-sommes-nous')}</div></section>
${band}`
  }), { priority: '0.6' });
}

// ---------------------------------------------------------------- Pages utilitaires
const simple = (p, title, h1, html, opts = {}) => emit(p, layout({ path: p, title, description: opts.description || title, robots: opts.robots || 'index, follow', body: `<section class="phero phero--green"><div class="wrap" style="padding:3rem 0"><h1>${h1}</h1></div></section><section class="sec"><div class="wrap prose">${html}</div></section>` }), opts);

await simple('/merci/', 'Merci pour votre demande | Aaction Dem', 'Merci !', `<p>Votre demande de devis a bien été envoyée. Un conseiller Aaction Dem vous recontacte sous 24 h ouvrées.</p><p><a href="/">Retour à l’accueil</a></p>`, { robots: 'noindex, follow', sitemap: false });
await simple('/404.html', 'Page introuvable | Aaction Dem', 'Oups, ce carton est vide', `<p>La page que vous cherchez n’existe pas ou a été déplacée.</p><ul><li><a href="/">Accueil</a></li><li><a href="/services-demenagement/">Nos services</a></li><li><a href="/contact/">Devis gratuit</a></li></ul>`, { robots: 'noindex, follow', sitemap: false });
const med = site.legal.mediator;
const mediationHtml = `<p>Conformément aux articles L.611-1 et suivants du Code de la consommation, tout client consommateur peut, en cas de litige avec ${site.name} non résolu par une réclamation écrite préalable auprès de nos services, recourir gratuitement à un médiateur de la consommation :</p>
<p><strong>${med.name}</strong><br>${med.address}<br>Site : <a href="${med.url}" rel="noopener" target="_blank">${med.url.replace('https://', '')}</a> – E-mail : <a href="mailto:${med.email}">${med.email}</a></p>`;
await simple('/mentions-legales/', 'Mentions légales | Aaction Dem', 'Mentions légales', `
<h2>Éditeur du site</h2><p><strong>${site.legalName}</strong>, ${site.legal.form}.<br>Siège social : ${site.agencies[0].street}, ${site.agencies[0].zip} ${site.agencies[0].city}, France.<br>Établissement secondaire : ${site.agencies[1].street}, ${site.agencies[1].zip} ${site.agencies[1].city}.<br>SIRET (siège) : ${site.legal.siret} – ${site.legal.rcs}<br>N° TVA intracommunautaire : ${site.legal.vat} – Code NAF : ${site.legal.naf}<br>Téléphone : ${site.phoneDisplay} – E-mail : <a href="mailto:${site.email}">${site.email}</a></p>
<h2>Directeur de la publication</h2><p>${site.legal.director}.</p>
<h2>Hébergement</h2><p>${site.legal.host.name}, ${site.legal.host.address} – <a href="${site.legal.host.url}" rel="noopener" target="_blank">${site.legal.host.url.replace('https://', '')}</a></p>
<h2>Médiation de la consommation</h2>${mediationHtml}
<h2>Conditions générales de vente</h2><p>Nos prestations sont régies par nos <a href="/conditions-generales-de-vente/">conditions générales de vente</a>.</p>
<h2>Propriété intellectuelle</h2><p>L’ensemble des contenus de ce site (textes, photographies, logos, illustrations) est la propriété de ${site.legalName} ou de ses partenaires. Toute reproduction ou représentation, totale ou partielle, sans autorisation écrite préalable est interdite. Les marques et logos des partenaires cités restent la propriété de leurs titulaires.</p>
<h2>Données personnelles</h2><p>Voir notre <a href="/politique-de-confidentialite/">politique de confidentialité</a>.</p>`, { robots: 'noindex, follow', sitemap: false });
await simple('/conditions-generales-de-vente/', 'Conditions générales de vente | Aaction Dem', 'Conditions générales de vente', `
<p>Les présentes conditions générales de vente (CGV) s’appliquent aux prestations de déménagement réalisées par <strong>${site.legalName}</strong> (${site.legal.rcs}), membre du réseau Les Gentlemen du Déménagement. Elles sont complétées par les conditions particulières figurant sur le devis accepté par le client ; en cas de contradiction, les conditions particulières prévalent.</p>
<h2>1. Devis et informations à fournir</h2><p>Chaque déménagement fait l’objet d’un devis gratuit et détaillé. Le client communique toutes les informations utiles à la bonne exécution de la prestation, au chargement comme à la livraison : accès, étages, stationnement, travaux, objets volumineux ou soumis à une réglementation particulière (alcools, armes…). Des informations manquantes ou inexactes peuvent entraîner des suppléments, dont le client est informé à l’avance.</p>
<h2>2. Déclaration de valeur</h2><p>Le client indique sur le devis la valeur globale de son mobilier et, le cas échéant, la liste valorisée des objets de valeur. Cette déclaration fixe le plafond d’indemnisation. Une garantie complémentaire (assurance dommage) peut être proposée ; son coût est communiqué au client, libre d’y souscrire ou non.</p>
<h2>3. Prix, arrhes et paiement</h2><p>Le prix convenu ne peut être modifié qu’en cas de charges imprévisibles et indépendantes de la volonté de l’entreprise survenant avant le début de l’opération, ou d’un commun accord pour des prestations supplémentaires. Les sommes versées à la commande ont la nature d’arrhes, sauf mention contraire : si le client annule, elles restent acquises à l’entreprise ; si l’entreprise annule, elle les restitue au double, sauf force majeure. Le devis précise les modalités de règlement (arrhes, éventuel acompte, solde).</p>
<h2>4. Contrat conclu hors établissement</h2><p>Lorsque le contrat est signé au domicile du client, celui-ci ne bénéficie pas du droit de rétractation (article L.221-28 du Code de la consommation), la prestation étant datée. Aucun paiement n’est toutefois exigé avant l’expiration d’un délai de sept jours suivant la signature.</p>
<h2>5. Réalisation de la prestation</h2><p>Les prestations sont celles décrites dans le devis et ses annexes. L’entreprise ne transporte ni personnes, ni animaux, ni plantes, ni matières dangereuses ou inflammables, ni bijoux, espèces, titres ou valeurs, sauf accord écrit préalable. Le client, ou une personne qu’il mandate, est présent au chargement et à la livraison et vérifie que rien n’a été oublié. L’entreprise peut confier tout ou partie de l’opération à une entreprise partenaire, sous sa responsabilité, en informant le client au moins 48 heures à l’avance.</p>
<h2>6. Responsabilité et indemnisation</h2><p>L’entreprise est responsable des biens qui lui sont confiés, sauf force majeure, vice propre de la chose ou faute du client. Lorsque le client a emballé lui-même ses cartons, leur contenu n’est indemnisé qu’en cas de dommage prouvé et dans la limite de la déclaration de valeur. Les pertes et avaries donnent lieu à réparation, remplacement ou indemnisation, dans la limite du préjudice matériel prouvé et du plafond déclaré.</p>
<h2>7. Livraison et réserves</h2><p>À la livraison, le client vérifie l’état de son mobilier et signe la déclaration de fin de travaux. En cas de perte ou d’avarie, il formule des réserves écrites, précises et détaillées en présence de l’équipe. À défaut, il dispose de <strong>10 jours calendaires</strong> à compter de la réception pour adresser une protestation motivée par lettre recommandée (article L.224-63 du Code de la consommation). Les actions en justice doivent être engagées dans l’année qui suit la livraison.</p>
<h2>8. Garde-meuble</h2><p>La livraison en garde-meuble, à la demande du client, met fin au contrat de déménagement ; le stockage fait l’objet d’un contrat distinct. Si la livraison est impossible du fait du client (absence, accès impossible), le mobilier peut être placé en garde-meuble à ses frais, après information.</p>
<h2>9. Déménagements en circuit organisé ou en groupage</h2><p>Pour les déménagements longue distance réalisés via le réseau Les Gentlemen du Déménagement, les dates de chargement et de livraison peuvent être ajustées dans les limites précisées sur le devis, et l’exécution confiée à une entreprise membre du réseau, sous la responsabilité de ${site.legalName}.</p>
<h2>10. Clients professionnels</h2><p>Les factures sont payables à 30 jours à compter de leur date d’émission, sans escompte en cas de paiement anticipé. Tout retard entraîne des pénalités de retard et une indemnité forfaitaire pour frais de recouvrement de 40 € (article L.441-10 du Code de commerce).</p>
<h2>11. Médiation de la consommation</h2>${mediationHtml}
<p class="small"><em>Document d’information. Seules font foi les conditions générales remises avec votre devis.</em></p>`, { description: 'Conditions générales de vente des prestations de déménagement Aaction Dem : devis, déclaration de valeur, arrhes, livraison, réserves et médiation.' , priority: '0.3' });
await simple('/politique-de-confidentialite/', 'Politique de confidentialité | Aaction Dem', 'Politique de confidentialité', `
<p>Les données collectées via le formulaire de devis (nom, e-mail, téléphone, adresses, date) sont utilisées uniquement par ${site.name} pour traiter votre demande et établir un devis. Elles ne sont ni vendues ni cédées à des tiers.</p>
<h2>Durée de conservation</h2><p>3 ans à compter du dernier contact pour les prospects ; durée légale pour les clients.</p>
<h2>Vos droits</h2><p>Conformément au RGPD, vous disposez d’un droit d’accès, de rectification, d’effacement, d’opposition et de portabilité. Écrivez-nous à <a href="mailto:${site.email}">${site.email}</a>. Vous pouvez également saisir la CNIL.</p>
<h2>Cookies</h2><p>Ce site n’utilise aucun cookie publicitaire ni outil de mesure d’audience. Les polices sont hébergées localement.</p><p>La page <a href="/contact/">Contact</a> intègre des cartes Google Maps. Leur affichage est susceptible de transmettre des données de navigation à Google (adresse IP, informations techniques) et de déposer des cookies, selon la <a href="https://policies.google.com/privacy" rel="noopener" target="_blank">politique de confidentialité de Google</a>.</p>`, { robots: 'noindex, follow', sitemap: false });

// ---------------------------------------------------------------- Fichiers techniques
await writeFile(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${outputs.map((o) => `  <url><loc>${abs(o.p)}</loc><lastmod>${today}</lastmod><priority>${o.priority}</priority></url>`).join('\n')}
</urlset>
`);
await writeFile(path.join(dist, 'robots.txt'), site.indexable ? `User-agent: *\nAllow: /\nDisallow: /merci/\n\nSitemap: ${abs('/sitemap.xml')}\n` : `# Site en préparation : aucune page ne doit être indexée (balise meta « noindex » sur chaque page)\nUser-agent: *\nAllow: /\n`);
// Favicons (scripts/make-favicon.py) : favicon.ico à la racine + PNG pour iOS / Android
await mkdir(path.join(dist, 'images/icons'), { recursive: true });
for (const f of ['icon-32.png', 'icon-180.png', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'favicon.ico']) await copyFile(path.join(root, 'images/icons', f), path.join(dist, 'images/icons', f));
await copyFile(path.join(root, 'images/icons/favicon.ico'), path.join(dist, 'favicon.ico'));
await writeFile(path.join(dist, 'logo.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 80"><text x="0" y="44" font-family="Impact,Arial Black,sans-serif" font-size="44" fill="#fa5b4a">AACTION</text><text x="2" y="72" font-family="Arial,sans-serif" font-weight="700" letter-spacing="8" font-size="22" fill="#1d1d1f">DEM</text></svg>`);
await writeFile(path.join(dist, 'site.webmanifest'), JSON.stringify({ name: 'Aaction Dem – Déménageur Moselle & Luxembourg', short_name: 'Aaction Dem', lang: 'fr-FR', start_url: '/', display: 'standalone', background_color: '#ffffff', theme_color: '#fa5b4a', icons: [{ src: '/images/icons/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: '/images/icons/icon-512.png', sizes: '512x512', type: 'image/png' }, { src: '/images/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }] }, null, 2).replace(/"\/(?!\/)/g, `"${BASE}/`));
// En-têtes de cache et de sécurité (Netlify / Cloudflare Pages). CSS/JS inline -> 'unsafe-inline' ; carte Google chargée au clic -> frame-src
const csp = ["default-src 'self'", "script-src 'self' 'unsafe-inline'", "style-src 'self' 'unsafe-inline'", "img-src 'self' data:", "font-src 'self'", "connect-src 'self'", "frame-src https://www.google.com https://maps.google.com", `form-action 'self'${/^https?:/.test(site.formAction) ? ' ' + new URL(site.formAction).origin : ''}`, "frame-ancestors 'none'", "base-uri 'self'", "object-src 'none'", "upgrade-insecure-requests"].join('; ');
// En-têtes de cache (Netlify / Cloudflare Pages)
await writeFile(path.join(dist, '_headers'), `/fonts/*\n  Cache-Control: public, max-age=31536000, immutable\n/images/*\n  Cache-Control: public, max-age=31536000, immutable\n/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Strict-Transport-Security: max-age=31536000; includeSubDomains\n  X-Frame-Options: DENY\n  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()\n  Cross-Origin-Opener-Policy: same-origin\n  Content-Security-Policy: ${csp}\n`);

console.log(`✅ ${outputs.length} pages générées (${site.indexable ? 'indexables' : 'toutes en noindex'}) dans dist/ (${Object.values(imgMeta).filter((m) => m.src.endsWith('.svg')).length} images en placeholder)`);
