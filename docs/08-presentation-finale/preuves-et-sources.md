# Preuves, sources et visuels à utiliser

Révision de référence : consulter `manifest-sources.json`. L’archive conserve les chemins ci-dessous. Les liens canoniques fonctionnent dans le dépôt ; hors dépôt, ouvrir le même chemin après extraction.

## Couverture du barème

| Critère | Points | Source canonique / chemin dans l’archive | Place proposée | Limite à annoncer |
| --- | ---: | --- | --- | --- |
| Sujet | 1 | [Problème](../01-probleme/probleme-v1.md), `README.md` | 1 | Hypothèse de cadrage ; portée musculation et frontend local |
| Personas | 1,5 | [Index et quatre fiches](../02-utilisateurs-personas/README.md), `docs/02-utilisateurs-personas/` | 2 + annexe | Fictifs, validés par l’équipe ; pas de verbatim d’entretien réel |
| Scénarios | 1,5 | [Quatre scénarios](../03-scenarios/README.md), `docs/03-scenarios/` | 3 | Situations de conception, pas résultats d’observation |
| Arbre | 2,5 | [Arbre commun](../04-analyse-taches/tache.md), [vues](../04-analyse-taches/arbres-visuels.md), `assets/diagrammes/` | 4 | Hiérarchie textuelle autoritative ; PNG T5 ancien incomplet |
| Prototype | 3,5 | [Prototype](<../../prototypes/propotype 1/README.md>), `prototypes/propotype 1/`, `tests/` | 5 + démo | Authentification, diffusion et synchronisation distante non réelles |
| Critères ergonomiques | 1,5 | [Audit final](../07-evaluation/audit-final-grille.md), audit cours 5/6, DR-001 | 6 | Revue experte ; pas de validation humaine générale |
| Keystroke | 1 | [Analyse KLM](../07-evaluation/keystroke.md) | 7 | Temps prédits sur ordinateur sous hypothèses explicites |
| UAN | 1 | [Séance complète](../07-evaluation/uan-remplir-seance.md) et [saisie d'une série](../07-evaluation/uan-saisie-serie.md) | 8 | Spécification confrontée au code ; perception des retours à observer |
| Expérimentation | 3,5 | [Protocole](../07-evaluation/protocole-utilisateur.md), audit historique §20 | 9 | Protocole prêt ; pas de relevés expérimentaux fournis |
| Processus / itération | 3 | Audit final, DR-001, audit historique §11–20, `reunions/`, `research/` | 10–12 | Réunions et retours non inventés ; boucle empirique à compléter |

Total du barème fourni : 20 points. Ce tableau n’est pas une estimation de note.

## Registre des affirmations

| Affirmation utilisable | Nature et justification | Formulation à éviter |
| --- | --- | --- |
| « Les profils ont des besoins de guidage, reprise et précision différents » | Hypothèse explicitée dans les personas fictifs | « Nos entretiens ont démontré… » |
| « Un retour qualitatif a signalé des difficultés de création, recherche et clôture » | Retour rapporté dans l’audit §20, sans protocole complet | Nombre de participants ou taux de réussite inventés |
| « 150 tests individuels passent dans 16 fichiers » | Contrôle technique de la révision source ; audit de clôture | « 150 utilisateurs ont validé l’application » |
| « Le parcours création → calendrier → résultats → reprise → bilan → historique a été rejoué » | Scénario technique versionné `tests/parcours-final.browser.js` et captures synthétiques | « L’interface est intuitive pour tous » |
| « La méthode Entrée est prédite à 4,85 s pour cette série » | `1M + 1P + 8K + 2H`, soit 1,35 + 1,10 + 1,60 + 0,80 ; R supposé nul | « Les utilisateurs mettent 4,85 s » ou un temps tactile équivalent |
| « La recopie est prédite à 2,65 s sous condition de résultats réels identiques » | `M + P + K`, avec série précédente complète/valide ; même état final | Recopier automatiquement une cible et la déclarer réalisée |
| « Les résultats humains restent à recueillir » | Protocole et fiche vides, registre A/B/C dans l’audit | SUS, satisfaction, gain d’adoption ou baisse d’erreurs fictifs |

Les 8,65 s de saisie souris et 4,85 s de saisie Entrée incluent un retour final à la souris ; ne pas les mélanger avec les exemples historiques qui s’arrêtent au clavier. Les tests et captures prouvent seulement les propriétés effectivement contrôlées, pas une conformité WCAG complète.

## Sélection des figures

Les captures 00–07 sont prises sur la révision source, dans une session Chromium dédiée, avec des données fictives. Elles servent à illustrer l’interaction. Les dimensions exactes et empreintes sont dans le manifeste.

| Fichier dans `visuels/` | Usage / légende suggérée | Attention |
| --- | --- | --- |
| `00-acces.png` | Entrée sans compte, accès au profil simulé facultatif | Aucune authentification réelle |
| `01-decouverte.png` | Bibliothèque de séances et filtres, vue large | Le filtrage n’est pas une personnalisation sportive validée |
| `02-preparation.png` | Deux séries, cible explicite 20 kg × 10 | Cible prévue, aucun résultat réel créé |
| `03-calendrier.png` | Séance placée explicitement aujourd’hui | Dates de la capture synthétique ; ne pas les présenter comme journal utilisateur |
| `04-saisie.png` | Cible 20 × 10, résultats 20 × 10 puis 22,5 × 8 | Une correction en revue fait ensuite passer les 8 répétitions à 9 |
| `05-bilan.png` | Bilan conservé : 20 × 10 et 22,5 × 9 ; cible inchangée | Première séance sans progression inventée ; capture pouvant montrer un rappel ajouté après clôture |
| `06-saisie-rpe.png` | RPE visible au niveau intermédiaire, recopie volontaire | Extrait des séries dans un viewport large ; pas une mesure sur téléphone physique |
| `07-historique.png` | Résultat retrouvé dans Bilans, vue large | Le scénario technique laisse aussi une seconde exécution en cours pour tester la conservation du RPE |
| `arbre-taches-global.png`, `arbre-taches-t1.png` à `t4.png` | Hiérarchie et tâches, puis zoom ciblé | Schémas historiques de conception, pas résultats empiriques |
| `arbre-taches-t5.png` | Comparaison historique si utile | Ancien PNG : nœud T5.2.2.3 absent ; préférer la source corrigée ci-dessous |
| `t5-corrige.mmd` | Source Mermaid de la décomposition T5 corrigée | T5.2.2 est une tâche visée, pas une synchronisation réseau livrée |

Les captures plein document peuvent placer un élément fixe au milieu de l’image. Pour une slide, montrer un détail lisible sans supprimer le contexte qui change son sens ; ne pas conclure à un problème de recouvrement sur la seule capture longue.

## Références théoriques

L’audit `docs/07-evaluation/audit-ergonomie-cours5-6.md` relie les concepts aux diapositives des supports locaux. Le KLM renvoie au Cours 6, diapositives 29–37 ; l’UAN aux diapositives 39–49, notamment les tables 46–47. Les huit catégories de Bastien & Scapin, le guidage, le groupement et le contrôle sont reliés au Cours 5. Les PDF ne sont pas ajoutés à l’archive ; ne pas prétendre que les supports sont fournis par ce dossier.
