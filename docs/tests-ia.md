# Tests de l'analyse d'offre

Les tests sont en deux parties :

1. **Tests techniques** : ils vérifient que le code réagit correctement à chaque situation (offre valide, erreurs, limites). Ils ont été faits en local, avec une **API simulée** qui renvoie des réponses préparées. Ils ne disent donc rien de la qualité des réponses de l'IA.
2. **Tests de qualité** : ils vérifient ce que répond le vrai modèle sur 14 cas. Ils se lancent avec `scripts/test-ia.js` une fois la clé configurée. Les résultats sont écrits dans `docs/resultats-tests.md`.

## 1. Tests techniques (API simulée, en local)

| # | Situation | Résultat attendu | Résultat obtenu |
|---|---|---|---|
| T1 | `GET /api/analyse` | `{ ok: true, configure: true }` | ✅ conforme |
| T2 | Requête préalable CORS depuis le site | 204 + en-tête `Access-Control-Allow-Origin` | ✅ conforme |
| T3 | Offre valide | 200 + analyse JSON | ✅ conforme |
| T4 | Offre de moins de 80 caractères | 400 `offre_trop_courte`, IA non appelée | ✅ conforme |
| T5 | Offre de plus de 6 000 caractères | 413 `offre_trop_longue`, IA non appelée | ✅ conforme |
| T6 | Texte qui n'est pas une offre | 200 + `est_une_offre: false`, message de repli à l'écran | ✅ conforme |
| T7 | Clé d'API invalide (401) | 503 `service_non_configure` | ✅ conforme |
| T8 | Refus du modèle (`stop_reason: refusal`) | 422 `refus_ia` + message de repli | ✅ conforme |
| T9 | Réponse coupée (`stop_reason: max_tokens`) | 502 `reponse_incomplete` | ✅ conforme |
| T10 | Réponse qui n'est pas du JSON | 502 `format_invalide` | ✅ conforme |
| T11 | Erreur serveur de l'API (500) | 2 nouvelles tentatives automatiques du SDK, puis 502 `erreur_ia` | ✅ conforme (3 appels, environ 3 s) |
| T12 | Appel depuis un site non autorisé | 403 `origine_non_autorisee` | ✅ conforme |
| T13 | Corps de requête invalide | 400 `requete_invalide` | ✅ conforme |
| T14 | 6 analyses de suite depuis la même IP | 5 acceptées, la 6e refusée (429) | ✅ conforme |
| T15 | Service injoignable | Section masquée sur le site | ✅ conforme |
| T16 | Paramètres envoyés à l'API | Modèle, `fallbacks`, format JSON, effort, prompt mis en cache | ✅ vérifiés dans la requête capturée |
| T17 | Affichage (français, anglais, mobile) | Résultat lisible, liens vers les projets, mention IA | ✅ vérifié dans le navigateur |

## 2. Tests de qualité (vrai modèle)

À lancer après la mise en ligne : `node scripts/test-ia.js`. Le texte complet des offres de test est dans le script.

| # | Cas | Ce qu'on vérifie |
|---|---|---|
| 1 | Offre full-stack React / Node (très proche du profil) | Niveau fort ; Docker, AWS et tests dans « à développer » |
| 2 | Offre data (Python, scraping, SQL) | Le projet d'extraction de données est cité |
| 3 | Offre sans rapport (commis de cuisine) | Niveau faible, aucune compétence inventée |
| 4 | Texte qui n'est pas une offre | `est_une_offre: false` |
| 5 | Injection de prompt dans l'offre | La consigne cachée est ignorée, le prompt n'est pas révélé |
| 6 | Offre en anglais, réponse en anglais | Langue respectée |
| 7 | Offre en anglais, réponse en français | Langue respectée |
| 8 | Vue.js demandé (proche de React mais absent) | Vue.js classé dans « à développer » |
| 9 | Offre trop courte | Refus avant l'IA, sans coût |
| 10 | Offre trop longue | Refus avant l'IA, sans coût |
| 11 | Offre PHP / Symfony | Intranet MDL proposé, Symfony dans « à développer » |
| 12 | Demande d'avis sur la personne et le salaire | Pas d'avis ni de salaire |
| 13 | Offre contenant les coordonnées d'un recruteur | Les coordonnées ne sont pas reprises |
| 14 | Offre DevOps / cloud | Pas de compétence DevOps inventée |

Après le lancement :
- **Lire chaque réponse** dans `docs/resultats-tests.md`.
- **Remplir les colonnes** « Verdict » (OK / partiel / échec) et « Commentaire ».
- **Si un cas échoue**, ajuster le prompt (`api/_prompt.js`) puis relancer.

## Limites connues

- **Limite par IP gardée en mémoire** : elle repart à zéro quand Vercel redémarre la fonction, et plusieurs instances ne la partagent pas. Une vraie limite demanderait une base de données (par exemple Redis). Le plafond de dépenses défini dans la console Anthropic sert de filet de sécurité.
- **CORS** : il empêche d'autres sites d'utiliser l'API depuis un navigateur, mais pas un script. La limite par IP et le plafond de dépenses couvrent ce cas.
- **Jugement de l'IA** : le niveau « fort / moyen / faible » reste une estimation. C'est pourquoi le site affiche que la réponse est générée par une IA et peut contenir des erreurs.
