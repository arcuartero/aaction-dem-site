// Génère les images du site avec l'API Images d'OpenAI (ChatGPT Images).
// Usage :
//   OPENAI_API_KEY=sk-... node scripts/generate-images.mjs            -> génère les images manquantes
//   OPENAI_API_KEY=sk-... node scripts/generate-images.mjs --force    -> régénère tout
//   OPENAI_API_KEY=sk-... node scripts/generate-images.mjs --only hero-demenageur
// Variables optionnelles : OPENAI_IMAGE_MODEL (défaut gpt-image-1), OPENAI_IMAGE_QUALITY (défaut high)
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'images');
const cfg = JSON.parse(await readFile(path.join(root, 'scripts/image-prompts.json'), 'utf8'));

const key = process.env.OPENAI_API_KEY;
if (!key) { console.error('❌ Définissez OPENAI_API_KEY dans votre terminal.'); process.exit(1); }
const model = process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1';
const quality = process.env.OPENAI_IMAGE_QUALITY || 'high';
const force = process.argv.includes('--force');
const onlyIdx = process.argv.indexOf('--only');
const only = onlyIdx > -1 ? process.argv[onlyIdx + 1] : null;

await mkdir(outDir, { recursive: true });
const exists = (p) => access(p).then(() => true, () => false);

for (const img of cfg.images) {
  if (only && img.name !== only) continue;
  if (img.source === 'site') { console.log(`⏭  ${img.name} : photo du site actuel (scripts/import-site-photos.py)`); continue; }
  const ext = img.format === 'jpeg' ? 'jpg' : img.format;
  const file = path.join(outDir, `${img.name}.${ext}`);
  if (!force && await exists(file)) { console.log(`⏭  ${img.name} existe déjà`); continue; }
  console.log(`🎨 Génération ${img.name} (${img.size})…`);
  const body = {
    model, quality, n: 1, size: img.size,
    prompt: `${img.prompt}\n\n${cfg.style}`,
    output_format: img.format,
    ...(img.format !== 'png' ? { output_compression: 82 } : {}),
    ...(img.background ? { background: img.background } : {})
  };
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify(body)
  });
  const json = await res.json();
  if (!res.ok) { console.error(`❌ ${img.name}:`, json.error?.message || json); continue; }
  await writeFile(file, Buffer.from(json.data[0].b64_json, 'base64'));
  console.log(`✅ ${file}`);
}
console.log('\nTerminé. Lancez maintenant : node build.mjs');
