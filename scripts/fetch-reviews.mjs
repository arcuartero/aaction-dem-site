// Récupère tous les avis Google (API Google Business Profile, gratuite) des fiches Aaction Dem,
// garde ceux de 4 et 5 étoiles avec un commentaire, et écrit src/data/reviews.json.
// build.mjs lit ce fichier ; sans lui, le site garde les avis de src/content.mjs.
//
// Variables d'environnement (fichier .env en local, variables de l'hébergeur en production) :
//   GBP_CLIENT_ID, GBP_CLIENT_SECRET, GBP_REFRESH_TOKEN
//   GBP_LOCATIONS = "accounts/111/locations/222=knutange,accounts/111/locations/333=metz"
//
// Usage :
//   node --env-file=.env scripts/fetch-reviews.mjs --list   -> affiche vos comptes et fiches (pour remplir GBP_LOCATIONS)
//   node --env-file=.env scripts/fetch-reviews.mjs          -> met à jour src/data/reviews.json
// En cas d'erreur, le fichier existant est conservé et le build continue (exit 0).
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(root, 'src/data/reviews.json');
const MIN_STARS = 4;
const STARS = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };

/** Nettoie le texte d'un avis : garde l'original quand Google a ajouté une traduction. */
export function cleanComment(comment = '') {
  let t = String(comment);
  const orig = t.indexOf('(Original)');
  if (orig !== -1) t = t.slice(orig + '(Original)'.length);
  else {
    const tr = t.search(/\n*\(Translated by Google\)/);
    if (tr !== -1) t = t.slice(0, tr);
  }
  return t.replace(/\r/g, '').replace(/\n{3,}/g, '\n\n').trim();
}

/** Transforme un avis brut de l'API en objet simple pour le site. */
export function normalize(raw, agency) {
  return {
    id: raw.reviewId,
    name: raw.reviewer?.isAnonymous ? 'Client Google' : (raw.reviewer?.displayName || 'Client Google'),
    rating: STARS[raw.starRating] || 0,
    text: cleanComment(raw.comment),
    date: raw.createTime || raw.updateTime || null,
    agency,
    reply: raw.reviewReply?.comment ? cleanComment(raw.reviewReply.comment) : null
  };
}

/** Filtre (4-5 étoiles, avec texte), dédoublonne et trie du plus récent au plus ancien. */
export function selectReviews(list) {
  const seen = new Set();
  return list
    .filter((r) => r.rating >= MIN_STARS && r.text.length > 0)
    .filter((r) => (seen.has(r.id) ? false : seen.add(r.id)))
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));
}

async function token() {
  const { GBP_CLIENT_ID, GBP_CLIENT_SECRET, GBP_REFRESH_TOKEN } = process.env;
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: GBP_CLIENT_ID, client_secret: GBP_CLIENT_SECRET, refresh_token: GBP_REFRESH_TOKEN, grant_type: 'refresh_token' })
  });
  const j = await r.json();
  if (!j.access_token) throw new Error('Token OAuth refusé : ' + JSON.stringify(j));
  return j.access_token;
}

async function api(url, at) {
  const r = await fetch(url, { headers: { Authorization: `Bearer ${at}` } });
  const j = await r.json();
  if (!r.ok) throw new Error(`${r.status} ${url}\n${JSON.stringify(j.error || j)}`);
  return j;
}

async function list(at) {
  const { accounts = [] } = await api('https://mybusinessaccountmanagement.googleapis.com/v1/accounts', at);
  for (const a of accounts) {
    console.log(`\nCompte : ${a.accountName} (${a.name})`);
    const { locations = [] } = await api(`https://mybusinessbusinessinformation.googleapis.com/v1/${a.name}/locations?readMask=name,title,storefrontAddress&pageSize=100`, at);
    for (const l of locations) {
      const city = l.storefrontAddress?.locality || '';
      console.log(`  ${a.name}/${l.name}   ${l.title} – ${city}`);
    }
  }
  console.log('\nCopiez les lignes voulues dans GBP_LOCATIONS, par ex. :');
  console.log('GBP_LOCATIONS=accounts/111/locations/222=knutange,accounts/111/locations/333=metz');
}

async function fetchLocation(at, loc) {
  const all = [];
  let pageToken = '';
  let meta = {};
  do {
    const j = await api(`https://mybusiness.googleapis.com/v4/${loc}/reviews?pageSize=50&orderBy=updateTime%20desc${pageToken ? `&pageToken=${pageToken}` : ''}`, at);
    meta = { total: j.totalReviewCount || 0, average: j.averageRating || 0 };
    all.push(...(j.reviews || []));
    pageToken = j.nextPageToken || '';
  } while (pageToken);
  return { reviews: all, ...meta };
}

async function main() {
  const { GBP_CLIENT_ID, GBP_CLIENT_SECRET, GBP_REFRESH_TOKEN, GBP_LOCATIONS } = process.env;
  if (!GBP_CLIENT_ID || !GBP_CLIENT_SECRET || !GBP_REFRESH_TOKEN) {
    console.log('ℹ️  Avis Google : identifiants absents, le site garde les avis actuels.');
    return;
  }
  const at = await token();
  if (process.argv.includes('--list')) return list(at);
  if (!GBP_LOCATIONS) { console.log('ℹ️  GBP_LOCATIONS manquant. Lancez avec --list pour trouver vos fiches.'); return; }

  const locs = GBP_LOCATIONS.split(',').map((s) => s.trim()).filter(Boolean).map((s) => { const [id, agency = ''] = s.split('='); return { id, agency }; });
  let reviews = [], total = 0, weighted = 0;
  for (const { id, agency } of locs) {
    const r = await fetchLocation(at, id);
    reviews.push(...r.reviews.map((x) => normalize(x, agency)));
    total += r.total; weighted += r.average * r.total;
    console.log(`✅ ${agency || id} : ${r.reviews.length} avis récupérés (note ${r.average}/5)`);
  }
  const selected = selectReviews(reviews);
  const data = {
    updatedAt: new Date().toISOString(),
    total,
    average: total ? Math.round((weighted / total) * 10) / 10 : 0,
    reviews: selected
  };
  await mkdir(path.dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(data, null, 1));
  console.log(`✅ ${selected.length} avis 4-5★ écrits dans src/data/reviews.json (sur ${total} avis, moyenne ${data.average}/5)`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error('⚠️  Avis Google non mis à jour (le site garde les avis existants) :\n' + e.message);
  });
}
