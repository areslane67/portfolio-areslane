// Analyse d'offre par l'IA (côté navigateur).
// Le texte de l'offre est envoyé à la fonction serverless /api/analyse (hébergée sur Vercel),
// qui appelle l'IA avec la clé d'API gardée côté serveur.

// Adresse de l'API : relative quand le site est servi par Vercel, absolue depuis GitHub Pages.
const API_PAR_DEFAUT = 'https://portfolio-areslane.vercel.app/api/analyse';

function adresseApi() {
  if (location.hostname.endsWith('.vercel.app')) return '/api/analyse';
  // En développement local uniquement : ?api=http://localhost:5600/api/analyse
  const test = new URLSearchParams(location.search).get('api');
  if (location.hostname === 'localhost' && test) return test;
  return API_PAR_DEFAUT;
}

const EN = document.documentElement.lang === 'en';

const TEXTES = EN ? {
  niveaux: { fort: 'Strong match', moyen: 'Partial match', faible: 'Weak match' },
  poste: 'Position',
  pointsForts: 'Strengths for this offer',
  aDevelopper: 'Not (yet) in my profile',
  projets: 'Projects worth a look',
  aucun: 'Nothing to report.',
  chargement: 'Analysing the offer… (10 to 30 seconds)',
  mention: 'AI-generated analysis, based only on this portfolio. It may contain mistakes: feel free to ask me directly.',
  compteur: (n, max) => `${n} / ${max}`,
  contact: 'Contact me',
  pasUneOffre: "This text doesn't look like a job, internship or work-study offer. Paste the offer's description (tasks, required skills…).",
  erreurs: {
    offre_trop_courte: 'The text is too short: paste the full offer (at least a few lines).',
    offre_trop_longue: 'The text is too long (6,000 characters max). Keep only the tasks and required skills.',
    trop_de_demandes: 'Too many analyses in a short time. Please try again in a few minutes.',
    service_non_configure: 'The analysis service is not available at the moment.',
    refus_ia: 'The AI could not process this text. Try with another offer.',
    reseau: 'The analysis service could not be reached. Check your connection and try again.',
    defaut: 'The analysis failed. Please try again, or contact me directly.',
  },
} : {
  niveaux: { fort: 'Correspondance forte', moyen: 'Correspondance partielle', faible: 'Correspondance faible' },
  poste: 'Poste',
  pointsForts: 'Points forts pour cette offre',
  aDevelopper: 'Pas (encore) dans mon profil',
  projets: 'Projets à regarder',
  aucun: 'Rien à signaler.',
  chargement: "Analyse de l'offre en cours… (10 à 30 secondes)",
  mention: "Analyse générée par une IA, uniquement à partir de ce portfolio. Elle peut contenir des erreurs : n'hésitez pas à me poser la question directement.",
  compteur: (n, max) => `${n} / ${max}`,
  contact: 'Me contacter',
  pasUneOffre: "Ce texte ne ressemble pas à une offre d'emploi, de stage ou d'alternance. Collez la description de l'offre (missions, compétences recherchées…).",
  erreurs: {
    offre_trop_courte: "Le texte est trop court : collez l'offre complète (au moins quelques lignes).",
    offre_trop_longue: 'Le texte est trop long (6 000 caractères maximum). Gardez les missions et les compétences demandées.',
    trop_de_demandes: "Trop d'analyses en peu de temps. Réessayez dans quelques minutes.",
    service_non_configure: "Le service d'analyse n'est pas disponible pour le moment.",
    refus_ia: "L'IA n'a pas pu traiter ce texte. Essayez avec une autre offre.",
    reseau: "Impossible de joindre le service d'analyse. Vérifiez votre connexion et réessayez.",
    defaut: "L'analyse n'a pas abouti. Réessayez, ou contactez-moi directement.",
  },
};

// Projets connus : identifiant renvoyé par l'IA -> titre et page du site
const PROJETS = {
  'five-cup': { titre: 'ITIC Five Cup', page: EN ? 'project-five-cup.html' : 'projet-five-cup.html' },
  brainburst: { titre: 'BrainBurst', page: EN ? 'project-brainburst.html' : 'projet-brainburst.html' },
  'budget-tracker': { titre: 'Budget Tracker', page: EN ? 'project-budget-tracker.html' : 'projet-budget-tracker.html' },
  'extraction-donnees': { titre: EN ? 'Web data extraction' : 'Extraction de données web', page: EN ? 'projects.html' : 'projets.html' },
  'world-flags': { titre: 'World Flags Explorer', page: 'https://github.com/areslane67/drap' },
  bibliotheque: { titre: EN ? 'React library app' : 'Bibliothèque React', page: 'https://github.com/areslane67/tp' },
  stocksense: { titre: 'StockSense', page: 'https://github.com/areslane67/Stocksens_back' },
  pizzeria: { titre: 'Pizzeria', page: 'https://github.com/areslane67/pizza' },
  touriste: { titre: EN ? 'Tourism services' : 'Prestations touristiques', page: 'https://github.com/areslane67/touriste' },
  'projet-ny': { titre: 'New York', page: 'https://areslane67.github.io/Projet-NY/index.html' },
  'site-mdl': { titre: EN ? 'Maison des Ligues website' : 'Site de la Maison des Ligues', page: 'https://areslane67.github.io/Web_Project_BTS/index.html' },
  'intranet-mdl': { titre: EN ? 'Employee intranet (PHP)' : 'Intranet collaborateurs (PHP)', page: EN ? 'php-project.html' : 'traveaux2.html' },
  'personnel-m2l': { titre: EN ? 'League staff management (Java)' : 'Personnel des ligues (Java)', page: EN ? 'java-project.html' : 'traveaux1.html' },
  'tp-web': { titre: EN ? 'Web assignments' : 'TP web', page: EN ? 'school-projects.html' : 'traveaux.html' },
};

const EXEMPLE = EN
  ? `Work-study position: Full-stack web developer (2 years)
We are a digital agency building web applications for our clients.
Tasks: develop React interfaces, build REST APIs with Node.js/Express, design and query SQL databases, take part in code reviews and agile ceremonies (Scrum).
Required: React, JavaScript/TypeScript, Node.js, SQL, Git. Nice to have: Docker, AWS, automated tests.
Rhythm: 3 weeks in the company / 1 week at school. Location: Paris.`
  : `Alternance – Développeur web full-stack (H/F) – 2 ans
Agence digitale, nous développons des applications web pour nos clients.
Missions : développer des interfaces en React, créer des API REST avec Node.js/Express, concevoir et interroger des bases de données SQL, participer aux revues de code et aux rituels agiles (Scrum).
Profil : React, JavaScript/TypeScript, Node.js, SQL, Git. Un plus : Docker, AWS, tests automatisés.
Rythme : 3 semaines en entreprise / 1 semaine en école. Lieu : Paris.`;

const TAILLE_MAX = 6000;
const section = document.querySelector('[data-analyse]');

// Petit utilitaire : crée un élément avec du texte (jamais de HTML venant de l'IA)
function el(tag, classe, texte) {
  const e = document.createElement(tag);
  if (classe) e.className = classe;
  if (texte !== undefined) e.textContent = texte;
  return e;
}

function afficherErreur(zone, code) {
  zone.replaceChildren();
  const boite = el('div', 'callout callout-erreur');
  const p = el('p', '', TEXTES.erreurs[code] || TEXTES.erreurs.defaut);
  const lien = el('a', 'analyse-contact', ` ${TEXTES.contact}`);
  lien.href = '#contact';
  p.append(lien);
  boite.append(p);
  zone.append(boite);
}

function liste(titre, elements, classe) {
  const bloc = el('div', `analyse-bloc ${classe}`);
  bloc.append(el('h3', '', titre));
  if (!elements.length) {
    bloc.append(el('p', 'analyse-vide', TEXTES.aucun));
    return bloc;
  }
  const ul = el('ul', 'analyse-liste');
  elements.forEach((item) => ul.append(item));
  bloc.append(ul);
  return bloc;
}

function afficherAnalyse(zone, a) {
  zone.replaceChildren();

  if (!a.est_une_offre) {
    const boite = el('div', 'callout');
    boite.append(el('p', '', TEXTES.pasUneOffre));
    zone.append(boite);
    return;
  }

  const entete = el('div', 'analyse-entete');
  const niveau = ['fort', 'moyen', 'faible'].includes(a.niveau) ? a.niveau : 'faible';
  entete.append(el('span', `analyse-niveau niveau-${niveau}`, TEXTES.niveaux[niveau]));
  if (a.poste) entete.append(el('span', 'analyse-poste', `${TEXTES.poste} : ${a.poste}`));
  zone.append(entete);

  if (a.resume) zone.append(el('p', 'analyse-resume', a.resume));

  const forts = (a.points_forts || []).slice(0, 5).map((p) => {
    const li = el('li');
    li.append(el('strong', '', p.exigence));
    li.append(document.createTextNode(` — ${p.preuve}`));
    return li;
  });
  const manques = (a.a_developper || []).slice(0, 5).map((m) => el('li', '', m));

  const grille = el('div', 'analyse-colonnes');
  grille.append(liste(TEXTES.pointsForts, forts, 'bloc-ok'), liste(TEXTES.aDevelopper, manques, 'bloc-manque'));
  zone.append(grille);

  const projets = (a.projets_a_voir || []).filter((p) => PROJETS[p.projet]).slice(0, 3);
  if (projets.length) {
    const bloc = el('div', 'analyse-bloc');
    bloc.append(el('h3', '', TEXTES.projets));
    const conteneur = el('div', 'analyse-projets');
    projets.forEach((p) => {
      const lien = el('a', 'analyse-projet');
      lien.href = PROJETS[p.projet].page; // chemin relatif à la page actuelle (FR ou en/)
      if (/^https?:/.test(lien.href) && !lien.href.startsWith(location.origin)) { lien.target = '_blank'; lien.rel = 'noopener'; }
      lien.append(el('strong', '', PROJETS[p.projet].titre), el('span', '', p.raison));
      conteneur.append(lien);
    });
    bloc.append(conteneur);
    zone.append(bloc);
  }

  zone.append(el('p', 'analyse-mention', TEXTES.mention));
}

async function verifierService() {
  try {
    const controle = new AbortController();
    const minuteur = setTimeout(() => controle.abort(), 5000);
    const r = await fetch(adresseApi(), { signal: controle.signal });
    clearTimeout(minuteur);
    const etat = await r.json();
    return r.ok && etat.configure === true;
  } catch {
    return false;
  }
}

async function demarrer() {
  if (!section && !document.querySelector('[data-analyse-lien]')) return;
  // L'outil et ses liens n'apparaissent que si le service répond : pas de fonctionnalité cassée en ligne.
  if (!(await verifierService())) return;
  document.querySelectorAll('[data-analyse-lien]').forEach((l) => { l.hidden = false; });
  if (!section) return; // page sans formulaire (accueil) : seul le lien est affiché
  section.hidden = false;

  const form = section.querySelector('form');
  const champ = form.querySelector('textarea');
  const bouton = form.querySelector('button[type="submit"]');
  const compteur = form.querySelector('.analyse-compteur');
  const zone = section.querySelector('.analyse-resultat');

  const majCompteur = () => { compteur.textContent = TEXTES.compteur(champ.value.length, TAILLE_MAX); };
  champ.addEventListener('input', majCompteur);
  majCompteur();

  section.querySelector('[data-exemple]').addEventListener('click', () => {
    champ.value = EXEMPLE;
    majCompteur();
    champ.focus();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const offre = champ.value.trim();
    if (offre.length < 80) return afficherErreur(zone, 'offre_trop_courte');
    if (offre.length > TAILLE_MAX) return afficherErreur(zone, 'offre_trop_longue');

    bouton.disabled = true;
    zone.replaceChildren(el('p', 'analyse-chargement', TEXTES.chargement));
    try {
      const controle = new AbortController();
      const minuteur = setTimeout(() => controle.abort(), 60000);
      const r = await fetch(adresseApi(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offre, langue: EN ? 'en' : 'fr' }),
        signal: controle.signal,
      });
      clearTimeout(minuteur);
      const donnees = await r.json().catch(() => ({}));
      if (!r.ok || !donnees.analyse) return afficherErreur(zone, donnees.erreur);
      afficherAnalyse(zone, donnees.analyse);
    } catch {
      afficherErreur(zone, 'reseau');
    } finally {
      bouton.disabled = false;
    }
  });
}

demarrer();
