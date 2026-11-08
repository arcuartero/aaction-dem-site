// Étape unique : autoriser l'accès aux avis Google Business Profile et obtenir le « refresh token ».
// Prérequis : un client OAuth « Application de bureau » créé dans Google Cloud (voir README).
// Usage : node --env-file=.env scripts/gbp-auth.mjs
//   (.env doit contenir GBP_CLIENT_ID et GBP_CLIENT_SECRET)
import http from 'node:http';

const clientId = process.env.GBP_CLIENT_ID;
const clientSecret = process.env.GBP_CLIENT_SECRET;
if (!clientId || !clientSecret) {
  console.error('❌ Ajoutez GBP_CLIENT_ID et GBP_CLIENT_SECRET dans le fichier .env');
  process.exit(1);
}
const PORT = 53682;
const redirectUri = `http://127.0.0.1:${PORT}/callback`;
const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' + new URLSearchParams({
  client_id: clientId,
  redirect_uri: redirectUri,
  response_type: 'code',
  scope: 'https://www.googleapis.com/auth/business.manage',
  access_type: 'offline',
  prompt: 'consent'
});

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, redirectUri);
  if (url.pathname !== '/callback') { res.writeHead(404); return res.end(); }
  const code = url.searchParams.get('code');
  if (!code) { res.writeHead(400); res.end('Autorisation refusée.'); return server.close(); }
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri, grant_type: 'authorization_code' })
  });
  const json = await r.json();
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  if (!json.refresh_token) {
    res.end('<p>Pas de refresh token reçu. Consultez le terminal.</p>');
    console.error('❌ Réponse Google :', json);
  } else {
    res.end('<p>C’est fait ✅ Vous pouvez fermer cet onglet et revenir au terminal.</p>');
    console.log('\n✅ Ajoutez cette ligne à votre fichier .env (et aux variables d’environnement de l’hébergeur) :\n');
    console.log(`GBP_REFRESH_TOKEN=${json.refresh_token}\n`);
    console.log('Ensuite : node --env-file=.env scripts/fetch-reviews.mjs --list   (pour trouver les identifiants des fiches)');
  }
  server.close();
});

server.listen(PORT, '127.0.0.1', () => {
  console.log('1. Ouvrez ce lien avec le compte Google qui gère les fiches Aaction Dem :\n');
  console.log(authUrl + '\n');
  console.log('2. Acceptez l’accès. Ce terminal affichera ensuite le refresh token.');
});
