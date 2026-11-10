// Fonction serverless (Vercel) : analyse d'une offre d'emploi par l'IA.
//
// Le site (GitHub Pages) envoie l'offre ici en POST. La clé d'API reste sur le serveur,
// dans la variable d'environnement ANTHROPIC_API_KEY : elle n'est jamais visible dans le
// navigateur ni dans le dépôt GitHub.
//
// GET  /api/analyse  -> { ok, configure } : permet au site de savoir s'il peut afficher l'outil
// POST /api/analyse  { offre, langue } -> { analyse } ou { erreur }

import Anthropic from '@anthropic-ai/sdk';
import { PROFIL } from './_profil.js';
import { PROMPT_SYSTEME, FORMAT_REPONSE } from './_prompt.js';

// Réglages (modifiables dans Vercel sans toucher au code)
const MODELE = process.env.AI_MODEL || 'claude-opus-5-5';
const EFFORT = process.env.AI_EFFORT || 'medium';
const TAILLE_MIN = 80;     // caractères : en dessous, ce n'est pas une offre
const TAILLE_MAX = 6000;   // caractères : limite le coût d'une analyse
const MAX_TOKENS = 8000;   // plafond de la réponse (réflexion comprise)

// Limite d'usage par adresse IP : 5 analyses par tranche de 10 minutes.
// Gardée en mémoire : elle est remise à zéro quand Vercel redémarre la fonction (limite documentée).
const LIMITE_PAR_IP = 5;
const FENETRE_MS = 10 * 60 * 1000;
const demandesParIp = new Map();

// Sites autorisés à appeler cette API (CORS)
const ORIGINES_AUTORISEES = [
  'https://areslane67.github.io',
  ...(process.env.ALLOWED_ORIGINS || '').split(',').map((o) => o.trim()).filter(Boolean),
];

function origineAutorisee(origine) {
  if (!origine) return false;
  if (ORIGINES_AUTORISEES.includes(origine)) return true;
  // Le site de démonstration sur Vercel et le développement en local
  return /^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origine) || /^http:\/\/localhost:\d+$/.test(origine);
}

function envoyer(res, statut, donnees) {
  res.statusCode = statut;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(donnees));
}

function depasseLaLimite(ip) {
  const maintenant = Date.now();
  const recentes = (demandesParIp.get(ip) || []).filter((t) => maintenant - t < FENETRE_MS);
  if (recentes.length >= LIMITE_PAR_IP) {
    demandesParIp.set(ip, recentes);
    return true;
  }
  recentes.push(maintenant);
  demandesParIp.set(ip, recentes);
  return false;
}

// Vercel fournit déjà req.body ; en local, on lit le corps nous-mêmes.
async function lireCorps(req) {
  if (req.body !== undefined) {
    return typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body;
  }
  let texte = '';
  for await (const morceau of req) {
    texte += morceau;
    if (texte.length > TAILLE_MAX * 4) throw new Error('corps trop long');
  }
  return JSON.parse(texte || '{}');
}

export default async function handler(req, res) {
  const origine = req.headers.origin;
  if (origineAutorisee(origine)) {
    res.setHeader('Access-Control-Allow-Origin', origine);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }
  if (req.method === 'GET') {
    return envoyer(res, 200, { ok: true, configure: Boolean(process.env.ANTHROPIC_API_KEY) });
  }
  if (req.method !== 'POST') {
    return envoyer(res, 405, { erreur: 'methode_non_autorisee' });
  }
  if (origine && !origineAutorisee(origine)) {
    return envoyer(res, 403, { erreur: 'origine_non_autorisee' });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return envoyer(res, 503, { erreur: 'service_non_configure' });
  }

  // 1. Vérifier la demande avant d'appeler l'IA (rien n'est facturé si elle est refusée ici)
  let corps;
  try {
    corps = await lireCorps(req);
  } catch {
    return envoyer(res, 400, { erreur: 'requete_invalide' });
  }
  const offre = String(corps?.offre ?? '').trim();
  const langue = corps?.langue === 'en' ? 'en' : 'fr';

  if (offre.length < TAILLE_MIN) return envoyer(res, 400, { erreur: 'offre_trop_courte' });
  if (offre.length > TAILLE_MAX) return envoyer(res, 413, { erreur: 'offre_trop_longue' });

  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'inconnue').split(',')[0].trim();
  if (depasseLaLimite(ip)) return envoyer(res, 429, { erreur: 'trop_de_demandes' });

  // 2. Appeler Claude
  const client = new Anthropic(); // lit ANTHROPIC_API_KEY dans les variables d'environnement
  try {
    const reponse = await client.beta.messages.create({
      model: MODELE,
      max_tokens: MAX_TOKENS,
      // Si les filtres de sécurité du modèle refusent la demande, l'API la relance
      // automatiquement sur un autre modèle (fallback côté serveur).
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      system: [
        {
          type: 'text',
          text: `${PROMPT_SYSTEME}\n\n<profil>\n${PROFIL}\n</profil>`,
          cache_control: { type: 'ephemeral' }, // le prompt ne change pas : il peut être mis en cache
        },
      ],
      messages: [
        {
          role: 'user',
          content: `Langue de la réponse : ${langue === 'en' ? 'anglais' : 'français'}.\n\n<offre>\n${offre}\n</offre>`,
        },
      ],
      output_config: {
        effort: EFFORT,
        format: { type: 'json_schema', schema: FORMAT_REPONSE }, // réponse en JSON au format imposé
      },
    });

    // 3. Vérifier la réponse avant de l'envoyer au site
    if (reponse.stop_reason === 'refusal') {
      return envoyer(res, 422, { erreur: 'refus_ia' });
    }
    if (reponse.stop_reason === 'max_tokens') {
      return envoyer(res, 502, { erreur: 'reponse_incomplete' });
    }
    const bloc = reponse.content.find((b) => b.type === 'text');
    let analyse;
    try {
      analyse = JSON.parse(bloc?.text ?? '');
    } catch {
      return envoyer(res, 502, { erreur: 'format_invalide' });
    }

    console.log(`analyse ok · ${reponse.model} · entrée ${reponse.usage.input_tokens} · sortie ${reponse.usage.output_tokens} tokens`);
    return envoyer(res, 200, { analyse });
  } catch (erreur) {
    // Du plus précis au plus général. L'offre n'est jamais écrite dans les journaux.
    if (erreur instanceof Anthropic.AuthenticationError) {
      console.error('Clé API invalide');
      return envoyer(res, 503, { erreur: 'service_non_configure' });
    }
    if (erreur instanceof Anthropic.RateLimitError) {
      return envoyer(res, 429, { erreur: 'trop_de_demandes' });
    }
    if (erreur instanceof Anthropic.APIError) {
      console.error(`Erreur API ${erreur.status} : ${erreur.message}`);
      return envoyer(res, 502, { erreur: 'erreur_ia' });
    }
    console.error('Erreur inattendue :', erreur);
    return envoyer(res, 500, { erreur: 'erreur_serveur' });
  }
}
