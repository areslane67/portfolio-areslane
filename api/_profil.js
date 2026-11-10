// Contexte fourni à l'IA : le profil d'Areslane, tel qu'il est publié sur le portfolio.
// L'IA n'a accès qu'à ce texte. Pour qu'elle connaisse un nouveau projet ou une nouvelle
// compétence, il faut l'ajouter ici (et sur le site).
// Aucune donnée personnelle (adresse, date de naissance...) ne doit figurer dans ce fichier.

export const PROFIL = `
# Areslane Haddadi — développeur web full-stack

## Recherche
Alternance en développement web (Île-de-France).

## Formation
- 2024 – 2026 (en cours) : Mastère européen Expert IT – Applications intelligentes et Big Data, ITIC Paris.
- 2023 – 2024 : Bachelor Concepteur Développeur d'Applications (CDA), ITIC Paris.
- 2020 – 2023 : BTS Services Informatiques aux Organisations (SIO), ITIC Paris.
- 2020 : CESS (baccalauréat belge), technicien en comptabilité, Athénée Royal d'Ixelles.

## Compétences
- Front-end : HTML, CSS, SASS, JavaScript, TypeScript, React, Angular.
- Back-end : Node.js, Express, PHP, Java, Spring Boot, API REST.
- Bases de données : MySQL, MongoDB, phpMyAdmin, XAMPP.
- Data et web scraping : Python, Selenium, BeautifulSoup, Pandas, Jupyter, Anaconda.
- Conception : MCD/MLD/MPD (Merise), UML (cas d'utilisation, séquence), zoning, wireframes, maquettes Figma, Canva.
- Outils et méthodes : Git, GitHub, VS Code, IntelliJ, Eclipse, Postman, Swagger, Trello, méthode agile Scrum,
  workflow Git en équipe (branches, pull requests, revues de code).
- Langues : français (langue maternelle), anglais C1.

## Projets (identifiant entre crochets)
- [five-cup] ITIC Five Cup (2026) : site de préinscription au tournoi de foot à 5 de l'école. Inscription seul,
  entre amis ou en capitaine d'équipe, espace d'administration sécurisé pour le BDE.
  Technologies : React (Vite), Node.js, Express, MySQL, authentification JWT. Site en ligne.
- [brainburst] BrainBurst (2025, Mastère, équipe de 3, 3 semaines) : application de quiz par thème et par niveau,
  avec score et mode « hardcore ». Rôle : maquettes Figma, développement d'interfaces et de l'API,
  organisation du projet. Technologies : React, TypeScript, Figma, GitHub, Trello. Site en ligne.
- [extraction-donnees] Extraction de données web (2025, Mastère, équipe de 3, 2 semaines) : automatisation de la
  récupération de données sur des sites web et intégration dans une base MySQL. Rôle : scripts d'extraction et
  configuration de la base. Technologies : Python, Selenium, BeautifulSoup, Jupyter, MySQL.
- [budget-tracker] Budget Tracker (2026, TP React) : gestion de budget (revenus, dépenses, solde, statistiques,
  filtres, sauvegarde dans le navigateur). Technologies : React, TypeScript, localStorage.
- [intranet-mdl] Intranet collaborateurs (2023, BTS SIO) : plateforme interne avec inscription, connexion,
  annuaire en cartes et modification du profil, mots de passe hachés. Technologies : PHP orienté objet, MySQL, HTML, CSS.
- [personnel-m2l] Gestion du personnel des ligues (2023, BTS SIO, en équipe) : application Java avec trois niveaux
  de droits, base de données via JDBC, tests unitaires, interface graphique, développement en itérations.
  Technologies : Java, JDBC, MySQL.
- [tp-web] TP web (2020 – 2024) : reproductions de pages (Google, Instagram, Gmail, Amazon), slider, blog,
  site vitrine ; HTML, CSS, JavaScript, PHP.

## Expériences
- Stage technicien informatique, AGILITE IT (nov. – déc. 2022) : remplacement et mise en place de postes de
  travail, sauvegarde et transfert de données, installation du matériel et du système.
- Stage informatique, Paris Business & Leisure (mai – juil. 2021) : interfaces HTML/CSS, évolution du site web,
  déploiement de postes sous Linux, maintenance du matériel.
- Serveur et barman, Brasserie Le Magnolia (2022 – 2024) : service, caisse, gestion des stocks.
- Stage en comptabilité, Refresh, Bruxelles (2020) : saisie comptable (logiciel Ciel), classement des factures.
`.trim();

// Identifiants de projets autorisés dans la réponse de l'IA (le site les transforme en liens).
export const PROJETS = ['five-cup', 'brainburst', 'extraction-donnees', 'budget-tracker', 'intranet-mdl', 'personnel-m2l', 'tp-web'];
