// Prévisualisation locale de dist/ comme sur GitHub Pages / Netlify : /demenagement-metz -> demenagement-metz.html
// Usage : node scripts/serve.mjs [port]
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const port = Number(process.argv[2] || 4321);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain', '.webmanifest': 'application/manifest+json' };
const isFile = (f) => stat(f).then((s) => s.isFile(), () => false);

createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.includes('..')) { res.writeHead(400).end(); return; }
  const candidates = p === '/' ? ['index.html'] : [p, p + '.html'];
  for (const c of candidates) {
    const f = path.join(dist, c);
    if (await isFile(f)) { res.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' }); res.end(await readFile(f)); return; }
  }
  res.writeHead(404, { 'Content-Type': types['.html'] }); res.end(await readFile(path.join(dist, '404.html')));
}).listen(port, () => console.log(`http://localhost:${port}`));
