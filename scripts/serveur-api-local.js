// Lance la fonction /api/analyse sur ton ordinateur, sans Vercel.
//
//   PowerShell :  $env:ANTHROPIC_API_KEY = "ta-cle" ; node scripts/serveur-api-local.js
//   Bash       :  ANTHROPIC_API_KEY=ta-cle node scripts/serveur-api-local.js
//
// Puis ouvre le site en local avec ?api=http://localhost:5600/api/analyse
// (ex. http://localhost:5500/index.html?api=http://localhost:5600/api/analyse).

import http from 'node:http';
import handler from '../api/analyse.js';

const PORT = Number(process.env.PORT || 5600);

http
  .createServer((req, res) => {
    if (new URL(req.url, 'http://localhost').pathname === '/api/analyse') return handler(req, res);
    res.statusCode = 404;
    res.end('Not found');
  })
  .listen(PORT, () => console.log(`API locale : http://localhost:${PORT}/api/analyse`));
