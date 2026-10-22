# Propotype 1 — Conception écran par écran

**Création :** 2026-10-03 · **Responsables :** Yahya et Marie<br>
**État :** préparation documentaire ; écrans à définir et valider progressivement.

## Objectif et méthode

Concevoir un prototype mobile cliquable avec des données d’exemple, centré d’abord sur Thomas et le parcours **découvrir une séance existante → l’adapter → la réaliser**. Le livrable sert à expliquer et évaluer l’IHM ; il ne vise pas une application fonctionnelle complète.

Pour chaque écran, nous posons les questions nécessaires, rédigeons sa documentation détaillée, puis la faisons valider avant de passer à son implémentation. Aucun code de prototype n’est créé avant validation de la documentation de l’écran. La première page de connexion est documentée, validée et implémentée ; les questions rapides sont documentées, validées et implémentées ; les deux pages d’arrivée sont documentées, validées et implémentées.

Ce document rassemble les choix transverses déjà confirmés et l’index des écrans. Chaque dossier contient la description de son écran ; ses éventuels fichiers de maquette seront ajoutés après validation. Les choix propres à un écran restent dans son document, avec leurs justifications, plutôt que d’être recopiés partout.

## Sources de conception

- [Persona Thomas](../../docs/02-utilisateurs-personas/persona-thomas.md) : besoin de guidance, vocabulaire simple, saisie rapide et repères compréhensibles.
- [Persona Greg](../../docs/02-utilisateurs-personas/persona-greg.md) : préparation personnelle, semaines et cycles pour la variante avancée.
- [Scénario Thomas](../../docs/03-scenarios/scenario-thomas.md) : consultation des consignes, saisie pendant la séance et bilan final.
- [Arbre commun des tâches](../../docs/04-analyse-taches/tache.md) : T1 pour choisir et adapter, T2 pour réaliser et consigner, T3 pour retrouver les résultats, T5 pour l’accès et la conservation.
- [Modèle des décisions de conception](../../docs/05-decisions-conception/README.md) : problème, alternatives, décision, justification, risques et points à valider.

Le parcours de découverte complète le scénario d’une séance déjà planifiée. Les documents de persona, scénario et tâches servent de références ; la présente préparation ne les modifie pas.

## Choix déjà confirmés

### Périmètre et navigation

- Persona prioritaire : Thomas.
- Format mobile ; prototype cliquable avec des données d’exemple.
- Parcours prioritaire : découvrir → adapter → réaliser.
- Espaces principaux : **Découvrir**, **Mes entraînements**, **Partages** (T4) et **Progrès**. Partages réutilise les entraînements créés dans Mes entraînements ; il ne crée ni ne modifie leur contenu.
- Arrivée selon le niveau renseigné : Débutant / Intermédiaire → Découvrir ; Avancé → Mes entraînements ; niveau absent → suggestions de Découvrir. Cette orientation ne bloque pas l’accès aux autres espaces.
- Découvrir : séances personnalisées de la bibliothèque de départ, filtres et accès séparé à la communauté.
- Mes entraînements : copies personnelles enregistrées, à ouvrir, adapter ou démarrer.
- Progrès : séances terminées et résultats.
- Pendant une séance, possibilité de quitter puis reprendre.

### Questions rapides et découverte

- Après la connexion, trois questions courtes, chacune sur son écran : niveau, objectif principal, matériel disponible.
- Possibilité de passer les questions et de modifier les réponses plus tard.
- Pas de question sur la durée à cette étape.
- Séances individuelles proposées en premier ; les plus courtes sont prioritaires.
- Bibliothèque de départ adaptée aux réponses, avec communauté accessible séparément.
- Filtres : niveau, groupe musculaire, matériel et durée, avec recherche par nom de séance ; listes extensibles dans la documentation de Découvrir.
- Choisir une séance ouvre un récapitulatif avec durée, matériel, exercices et explication courte ; possibilité d’ajouter à la semaine, aux favoris ou aux entraînements personnels. Aucun démarrage depuis la page d’arrivée ou ce récapitulatif dans cette étape.

### Adaptation

- Remplacer ou retirer un exercice ; ajuster les séries, la plage de répétitions et une charge cible facultative.
- Remplacement par menu déroulant, avec priorité aux exercices sollicitant les mêmes muscles et objectifs initialement vides.
- La première adaptation enregistrée crée une copie personnelle ; la bibliothèque originale reste disponible.
- Depuis le calendrier, les adaptations concernent cette date. À l’enregistrement, une occurrence de mésocycle propose aussi les suivantes du même type dans ce cycle. Le programme enregistré reste distinct.
- Adaptation pendant la séance prévue pour une étape ultérieure ; les changements concernent les séries à venir, les résultats déjà réalisés restent conservés et corrigibles séparément.

### Réalisation et bilan

- Un exercice à la fois, avec toutes ses séries et un accès aux autres exercices.
- Afficher une plage cible de répétitions ; Thomas saisit le nombre effectivement réalisé, par exemple 7 pour une cible de 6–12.
- Charge renseignée : série faite ; charge vide : série non faite. **0 kg** indique un exercice réalisé sans charge ajoutée.
- Saisies conservées directement ; aucun bouton de validation par série.
- Minuteur de repos facultatif.
- En fin de séance, aperçu complet des résultats et séries non faites, possibilité de correction, ressenti global facultatif et confirmation finale.
- Après confirmation, résumé de la séance ; progression annoncée uniquement si un historique comparable le permet.

Ces choix sont confirmés dans l’échange de conception. Leur présentation concrète et leur évaluation par l’équipe restent à mener écran par écran.

## Index des premiers dossiers

| Dossier et document | Rôle envisagé | État |
| --- | --- | --- |
| [01-connexion/README.md](01-connexion/README.md) | Connexion, création de compte et accès à la récupération | Documentation validée ; [page cliquable](01-connexion/index.html) vérifiée |
| [02-questions-rapides/README.md](02-questions-rapides/README.md) | Règles communes et trois dossiers : niveau, objectif, matériel | Documentation validée ; parcours cliquable vérifié |
| [03-decouverte/README.md](03-decouverte/README.md) | Arrivée débutant/intermédiaire : suggestions, filtres et récapitulatif | Documentation validée ; code vérifié |
| [04-mes-entrainements/README.md](04-mes-entrainements/README.md) | Arrivée avancée : contenu personnel et création par organisation/gabarit | Documentation validée ; code vérifié |
| [05-organisation-semaine/README.md](05-organisation-semaine/README.md) | Calendrier daté Mois / Semaine, séances et repos ; répétition des cycles | Calendrier validé dans l’échange ; implémenté |
| [06-configuration-seance/README.md](06-configuration-seance/README.md) | T1.3 : aperçu, points à revoir, adaptation en ligne, portée et séance prête | Évolution validée ; parcours implémenté |
| [07-partages/README.md](07-partages/README.md) | Partager un programme existant et suivre les retours (T4) | Parcours implémenté ; communauté simulée localement |
| [08-entrainement/README.md](08-entrainement/README.md) | Écran T2 : exercices, cibles et saisie réelle distincte, reprise | Écran implémenté ; arrêt avant bilan et T3 |

Le dossier questions rapides contient un README commun et un sous-dossier avec README pour chaque question. Les trois écrans sont documentés séparément ; leur implémentation suit la validation de ces documents. Les autres dossiers seront ajoutés au fur et à mesure, après discussion du parcours ; aucun écran supplémentaire n’est rempli par anticipation.

## Contenu à rédiger pour chaque écran

Le document de référence d’un écran est son `README.md`. Nous développerons les sections suivantes lors de la discussion de chaque écran.

### 1. Identité, objectif et état

Nom de l’écran, problème qu’il résout pour Thomas, tâche et sous-tâches concernées, situation dans laquelle il arrive, décisions confirmées et questions encore ouvertes. Indiquer ce que Thomas doit pouvoir accomplir avant de poursuivre.

### 2. Entrées et sorties du parcours

Décrire chaque origine possible, les conditions d’accès et les informations conservées à l’arrivée. Pour chaque action, nommer précisément l’écran suivant et expliquer l’effet du retour, de l’annulation, du passage d’une étape et de la reprise si ces possibilités existent. Ajouter un tableau **action → effet → destination → données conservées** et un schéma si utile.

### 3. Informations affichées

Lister les titres, textes, données d’exemple, repères, visuels et messages. Pour chaque information, préciser sa source, son format, son caractère obligatoire ou facultatif et la raison de sa présence. Distinguer ce qui vient du programme, des préférences et des résultats réels.

### 4. Organisation de l’IHM

Décrire l’écran de haut en bas : en-tête, contenu principal, sections, actions et navigation. Préciser l’emplacement de chaque élément, la hiérarchie visuelle, ce qui doit être visible immédiatement et ce qui peut nécessiter un défilement. Décrire les éléments fixes ou contextuels seulement lorsqu’ils ont une utilité pour cet écran.

### 5. Composants et options

Décrire les boutons, champs, listes, filtres, menus et aides effectivement retenus. Préciser leurs libellés, valeurs initiales, choix possibles, contraintes et états. Justifier le type de contrôle choisi et éviter les options inutiles à l’objectif de Thomas.

### 6. Interactions et états

Expliquer les effets d’un appui, d’une saisie ou d’un changement de choix ; la conservation des données ; les confirmations et possibilités de correction. Décrire les états initiaux, renseignés, vides et erronés qui sont pertinents, avec les messages associés. Préciser les conséquences d’une action avant qu’elle soit effectuée.

### 7. Style et accessibilité

Définir couleurs, typographie, tailles relatives, espacements, formes, icônes et visuels. Expliquer leur rôle dans la compréhension et la cohérence. Prévoir la lisibilité mobile, les cibles tactiles, les libellés explicites, le contraste et les états compréhensibles sans dépendre uniquement de la couleur.

### 8. Justification des décisions

Pour chaque choix important, décrire le besoin ou la tâche, les alternatives envisagées, le choix retenu, sa justification et ses limites. Relier le choix à Thomas, au scénario et à l’arbre ; ne pas présenter une préférence graphique comme un résultat d’évaluation utilisateur.

### 9. Données et comportement du prototype

Lister les données fictives nécessaires et les actions qui seront simulées. Préciser ce qui sera cliquable, modifiable ou seulement illustré, ainsi que les limites de cette version. Définir les exemples après les décisions d’interface, sans inventer un service réel.

### 10. Validation avant code

Décrire les parcours à essayer et les résultats observables attendus. Vérifier que chaque action a une destination, que les informations importantes sont présentes et que les états nécessaires sont expliqués. Rassembler les questions restantes et consigner la validation avant d’implémenter l’écran.

## Points à décider progressivement

- Évaluation du [premier écran de connexion](01-connexion/README.md) et des questions rapides.
- Évaluation des [trois questions rapides](02-questions-rapides/README.md) et des deux pages d’arrivée implémentées.
- Relecture des [suggestions et filtres](03-decouverte/README.md) et de la [création avancée](04-mes-entrainements/README.md) ; évaluation de la semaine et de l’éditeur de séance ; évaluation de l’écran T2 ; bilan et analyse T3 à concevoir ensuite.
- Évaluation de la portée proposée à l’enregistrement : cette date ou les prochaines occurrences correspondantes du mésocycle.
- Visuels d’aide aux exercices, présentation des saisies et fonctionnement précis du repos.
- Présentation du bilan, des comparaisons et des éventuels records.
- Style visuel et libellés de chaque écran.

La palette confirmée pour cette première page est `#B91C1C`, `#F87171`, `#111827`, `#FEF2F2`, avec un style très sobre et au plus un petit symbole sportif. Son application concrète est décrite dans le README de connexion. Le nom de l’interface, la durée du repos et les comportements techniques de l’ancienne proposition ne sont pas considérés comme validés ; ils seront décidés lorsque nous traiterons les écrans concernés.

## Mémorisation et simplification

Le prototype conserve localement les préférences, entraînements, exercices personnels et le formulaire de création inachevé. Pour la même identité de démonstration, les questions rapides ne sont pas répétées. Les adaptations sont conservées dans un brouillon séparé jusqu’à l’enregistrement. Les remplacements commencent vides et les modifications ponctuelles ne changent pas les préférences globales. Les saisies de l’écran T2 sont conservées séparément des cibles. Les mots de passe ne sont pas enregistrés.

Le choix d’exercice utilise une recherche par nom et des résultats illustrés directement sélectionnables. Les consignes et réglages sont visibles sur les cartes ; les points conservés par T3 sont présentés lorsqu’ils existent ; les unités, erreurs et conséquences de remplacement restent visibles.

## Vérification de la préparation et de l’entrée T2

Depuis la racine du dépôt, exécuter `node tests/preparation.test.cjs`, `node tests/ergonomie.test.cjs` et `node tests/t1-completion.test.cjs` : dix-huit vérifications T1 ciblent l’isolation des brouillons/profils, la migration, les dates du cycle, la conservation des cibles futures, les remplacements/retraits, les nombres français et l’échec du stockage. Le parcours cliquable reste accessible depuis [la connexion](01-connexion/index.html). Les vérifications navigateur et les limites propres aux écrans sont détaillées dans les dossiers [Préparation](06-configuration-seance/README.md) et [Entraînement](08-entrainement/README.md).

## Améliorations ergonomiques validées — 16 octobre 2026

Les 32 propositions sont intégrées aux parcours existants. Les codes ci-dessous servent de référence à la validation ; ils ne sont pas affichés dans les écrans utilisateur.

| Critère | Référence | Comportement livré |
| --- | --- | --- |
| Guidage | G1 | Reprendre une exécution depuis la carte du calendrier. |
| Guidage | G2 | Contexte date/programme/semaine compact ; exercice X/Y dans T2. |
| Guidage | G3 | Points à revoir absents réduits à une ligne ; vraies consignes visibles. |
| Guidage | G4 | Nouvelle publication et modification explicites ; contexte réinitialisé. |
| Charge de travail | W1 | Panneau d’ajout unique ; choix d’une séance enregistrée directement appliqué. |
| Charge de travail | W2 | Résultats de recherche illustrés directement sélectionnables ; remplacement à blanc. |
| Charge de travail | W3 | Répétitions fixes avec un champ ou fourchette avec deux champs. |
| Charge de travail | W4 | Reprendre explicitement le résultat précédent, sans remplissage automatique. |
| Charge de travail | W5 | Contenu et présentation réunis ; aperçu et confirmation finale maintenus. |
| Contrôle explicite | C1 | Séance prête dans l’aperçu ; démarrage direct. |
| Contrôle explicite | C2 | Enregistrement ponctuel direct ; extension au mésocycle avec dates et confirmation. |
| Contrôle explicite | C3 | Annuler pour les actions ponctuelles réversibles ; confirmations pour suppression et remplacement. |
| Contrôle explicite | C4 | Remplacement d’un repos confirmé dans le panneau courant. |
| Adaptabilité | A1 | Vue/date, liste, recherche, filtres et défilement conservés. |
| Adaptabilité | A2 | Plusieurs brouillons de préparation et de partage indépendants. |
| Adaptabilité | A3 | Une préférence modifiable sans réinitialiser les entraînements. |
| Adaptabilité | A4 | Dates cochées pour placements groupés ; exercices cochés pour séries/répétitions, charges indépendantes. |
| Gestion des erreurs | E1 | Saisies numériques invalides conservées et signalées, plutôt que remplacées silencieusement. |
| Gestion des erreurs | E2 | Échec du stockage visible et persistant ; brouillon distingué de l’application. |
| Gestion des erreurs | E3 | Cibles manquantes rouges non bloquantes ; valeurs invalides à corriger ; champs facultatifs ordinaires. |
| Gestion des erreurs | E4 | Profils locaux séparés, identifiant prérempli, aucun mot de passe conservé. |
| Homogénéité | H1 | Espacements, cartes, typographie et icônes cohérents. |
| Homogénéité | H2 | Dialogues en panneau inférieur sur mobile, centrés sur grand écran. |
| Homogénéité | H3 | Défilement et focus conservés lors des mises à jour. |
| Homogénéité | H4 | Action principale mise en avant ; actions secondaires discrètes et suppressions séparées. |
| Signifiance | S1 | Créer une séance/programme ; mésocycle et effort visé (RPE) expliqués. |
| Signifiance | S2 | État calculé d’après le contenu : À compléter, Enregistré, Planifié, Reprendre. |
| Signifiance | S3 | Favori, copie personnelle et placement distingués ; accès à la copie existante. |
| Compatibilité | K1 | En-tête T2 compact ; premières saisies remontées sur mobile. |
| Compatibilité | K2 | Alternatives tactiles/clavier, cibles agrandies, champ focalisé au-dessus du pied de page. |
| Compatibilité | K3 | Virgule décimale, clavier numérique, sélection du nombre, Entrée vers le champ suivant. |
| Compatibilité | K4 | Réponses en un appui ; passer une question ou toutes les restantes ; suppression du délai global. |

### Réduction des actions sur les parcours concernés

| Parcours | Avant | Après |
| --- | --- | --- |
| Ajouter une séance seule enregistrée au jour sélectionné | 4 appuis | 2 appuis |
| Calendrier vers début de séance | 3 appuis | 2 appuis |
| Enregistrer une adaptation pour cette date | 3 appuis | 1 appui |

Ces comptes décrivent les chemins testés, hors saisie des champs et défilement ; ils ne constituent pas une mesure auprès d’utilisateurs.

### Implémentation et vérification

`commun/ergonomie.js` centralise validation numérique, navigation clavier et confirmations ; `commun/ergonomie.css` harmonise les composants. `commun/parcours.js` conserve l’état actif sous `ihm-prototype-1` et les profils sous `ihm-prototype-1-profiles`. Ces identités de démonstration ne constituent pas une authentification réelle. Un échec du stockage conserve le travail en mémoire pour la visite et affiche une alerte ; la persistance après fermeture n’est alors pas garantie.

Les tests Node couvrent les règles de données sensibles à la régression. Les essais Chromium couvrent ajout direct, reprise, virgule décimale, erreur conservée, plusieurs brouillons, profils séparés, portée du mésocycle, actions groupées, remplacement du repos avec annulation et partage avec aperçu final. Les vues calendrier/préparation/T2 ont été contrôlées à 320, 390 et 1280 px sans débordement horizontal. Le stockage indisponible et la navigation numérique avec Entrée ont été simulés. Le clavier et les gestes sur téléphone physique restent à vérifier. La fin de T2, le bilan et l’analyse T3 restent hors périmètre.

## Clôture fonctionnelle de T1 — 20 octobre 2026

T1 est couvert pour le prototype local, selon les décisions validées. Le prochain périmètre est la suite de T2 ; cette clôture n’implémente ni fin de séance, ni bilan, ni analyse T3.

| Branche | Couverture |
| --- | --- |
| T1.1.1 | Niveau/objectif, budget de temps par séance et jours disponibles, modifiables sans réinitialisation. |
| T1.1.2 | Création d’une séance, semaine type ou mésocycle. |
| T1.1.3 | Choix et import explicite d’une semaine/mésocycle complet ; publications locales importables. |
| T1.1.4 | Réouverture des séances/programmes enregistrés et reprise d’exécution. |
| T1.1.5 | Exercices, séries, répétitions, charge, effort visé et champs utiles. |
| T1.2.1 | Placement daté de séances et repos, plusieurs séances par jour. |
| T1.2.2 | Répétition de la semaine sur le cycle ; conservation de ses variations importées. |
| T1.2.3 | Adaptation des cibles et ajout/modification/retrait d’échéances datées. |
| T1.2.4 | Déplacement/copie de séance ou semaine ; copies indépendantes. |
| T1.3.1 | Séance et points à revoir affichés ; leur production viendra de T3. |
| T1.3.2 | Adaptation des exercices, cibles, consignes et réglages dans les cartes. |
| T1.3.3 | Date seule ou prochaines occurrences du mésocycle, conformément au choix validé ; modification directe de la base possible. |
| T1.3.4 | Aperçu avec consignes, cibles, réglages et accès direct à T2 ; cibles absentes non bloquantes. |

### Vérifications de clôture

Depuis la racine :

```sh
node tests/preparation.test.cjs
node tests/ergonomie.test.cjs
node tests/t1-completion.test.cjs
```

Les 17 tests vérifient les règles de préparation et conservation existantes, puis les contraintes de temps/jours, l’import indépendant d’un mésocycle, les variations par semaine, la copie filtrée pour partage, les mouvements personnels, les publications importables et les échéances. La syntaxe de tous les modules JavaScript et `git diff --check` sont contrôlés.

Parcours Chromium réalisés : préférences ; aperçu fermé sans import ; import et planification de semaine puis mésocycle ; publication et réimport d’un cycle complet ; échéance sur un repos, modification, retrait et annulation ; rechargement ; formulaire de création avec contraintes préremplies, erreur numérique et brouillon ; conservation des contraintes après enregistrement de préparation. Calendrier et dialogues d’échéance/import contrôlés à 320, 390 et 1280 px. Les gestes/claviers sur téléphone physique restent à vérifier.

`commun/disponibilites.js` porte les champs et avertissements ; `03-decouverte/programmes.js` porte les instantanés publics et copies importées ; `calendrier.js` conserve les échéances séparées des séances/repos. Le fonctionnement reste local, avec les alertes de stockage existantes. Les exemples sont fictifs et le partage/import communautaire reste simulé dans le profil courant.

## T2.1 — comprendre et préparer l’effort, 20 octobre 2026

L’écran T2 intègre les repères exercice/série, les consignes et réglages, l’affichage conditionnel du dernier résultat terminé, un état/effort facultatif pour toute la séance et l’adaptation d’une série uniquement. La cible initiale, la cible adaptée et le résultat réel restent séparés ; aucune propagation vers une autre série ou le programme. Le [README T2.1](08-entrainement/README.md#t21--décisions-et-interactions) décrit les choix confirmés, les données, les interactions et le contrat d’historique que la future fin de séance alimentera. T2.2 est décrit ci-dessous ; T2.3 est décrit ci-dessous ; T2.4 est décrit ci-dessous ; la suite à concevoir est T3.

Les 17 vérifications de clôture T1 sont complétées par `node tests/training-preparation.test.cjs` (7 tests), soit 24 tests ciblés. Les parcours Chromium T2.1 couvrent adaptation, conservation des résultats, contexte global, historique injecté pour essai, reprise, rechargement, erreurs et navigation numérique. Les vues ont été contrôlées à 320, 390 et 1280 px ; téléphone physique non testé.

## T2.2 — réaliser et consigner les séries, 20 octobre 2026

La saisie courante conserve charge/répétitions et RPE ou ressenti sans validation supplémentaire. Cas particulier permet de déclarer une série faite, interrompue ou non faite, ainsi qu’un effort adapté et une raison facultative. Les valeurs d’une série Non faite restent récupérables, sans être présentées comme réalisées. La recopie d’une série précédente est filtrée ; Annuler restaure également saisie brute, erreurs et statut. Les autres séries et les cibles restent indépendantes.

Le [README de l’entraînement](08-entrainement/README.md#t22--réaliser-et-consigner-les-séries) décrit les statuts, les interactions et le contrat de données pour le futur bilan. Cette livraison T2.2 est complétée par T2.3 ci-dessous ; T2.4 reste à construire.

Vérifications :

```sh
node tests/preparation.test.cjs
node tests/ergonomie.test.cjs
node tests/t1-completion.test.cjs
node tests/training-preparation.test.cjs
node tests/training-results.test.cjs
```

32 tests ciblés ; syntaxe JavaScript et diff contrôlés. Parcours Chromium avec ressenti/RPE, statuts, correction, recopie et annulation, reprise/rechargement et stockage indisponible ; absence de débordement à 320, 390 et 1280 px. La conservation finale des séances et les essais sur téléphone physique restent à venir.

## T2.3 — contexte, notes et médias, 21 octobre 2026

Les champs facultatifs de contexte (sommeil, fatigue, douleur/gêne, raison générale d’adaptation) complètent État et effort du jour. Chaque exercice conserve remarque technique, réglage réellement utilisé, rappel et photos/vidéos, accessibles depuis Notes dans l’en-tête. Les médias ont un aperçu, une légende et un lien facultatif vers une série ; retrait et annulation restent disponibles.

Le [README T2.3](08-entrainement/README.md#t23--enrichir-la-séance-si-utile-21-octobre-2026) détaille les champs, limites et erreurs. Le nouveau module `08-entrainement/enrichissement.js` conserve les fichiers dans IndexedDB et les références dans le brouillon, par profil et exécution. Les nouvelles données restent privées et ne modifient pas les cibles ou programmes. Le prototype n’envoie aucun média à un serveur.

`node tests/training-enrichment.test.cjs` complète les cinq commandes précédentes : **40 tests ciblés**. Essais Chromium avec photo PNG et vidéo WebM réelles, restauration après rechargement, retrait/annulation, valeurs invalides, erreur de stockage et fichier absent ; absence de débordement à 320, 390 et 1280 px. Téléphone physique et codecs MOV/MP4 non vérifiés. La prochaine étape est T2.4, pour conserver le bilan et ces enrichissements avant T3.

## T2 terminé — frontière de T3, 21 octobre 2026

Le prototype couvre maintenant T2.1 à T2.4. Terminer ouvre la vérification des séries et permet de corriger directement une saisie, de constater les omissions et de noter un ressenti global/rappel facultatif. Une seule confirmation finale conserve un instantané des cibles, résultats, statuts, contexte, notes et références de médias. Les séries vides restent non renseignées, et un échec de stockage conserve le brouillon au lieu d’annoncer un succès.

Les occurrences terminées proposent Voir le bilan ; l’onglet Bilans remplace le repère Progrès et liste les comptes rendus conservés. Cette consultation est la sortie de T2, sans implémenter les analyses T3. La séance suivante peut utiliser les vrais résultats précédents. Les règles, données et limites sont décrites dans le [README T2.4](08-entrainement/README.md#t24--terminer-et-conserver-le-bilan-21-octobre-2026).

La suite est T3 : consulter/analyser les résultats, expliquer les comparaisons et conserver les points à revoir. Aucune progression, aucun record et aucun conseil ne sont produits automatiquement à cette frontière.

Vérification complète :

```sh
node tests/preparation.test.cjs
node tests/ergonomie.test.cjs
node tests/t1-completion.test.cjs
node tests/training-preparation.test.cjs
node tests/training-results.test.cjs
node tests/training-enrichment.test.cjs
node tests/training-completion.test.cjs
```

50 tests ciblés ; syntaxe et diff contrôlés. Parcours Chromium jusqu’au bilan conservé, y compris corrections, omissions, stockage indisponible, média, réouverture et réutilisation des résultats, à 320, 390 et 1280 px. Téléphone physique et synchronisation non testés. Les autres travaux et documents du dépôt sont conservés.

## Audit ergonomique — premier lot livré, 21 octobre 2026

Dix points de l’audit Cours 5/6 sont livrés : R02, R03, R17, R22, R23, R27, R33, R34, R35 et R42. Ils couvrent focus/clavier, feedback de sauvegarde et reprise, protection des occurrences commencées/terminées, accès au jour, ajout multiple, suivi prioritaire et présentation compacte de T2/revue. La [liste de travaux restants et le compte rendu](../../docs/07-evaluation/audit-ergonomie-cours5-6.md) conservent 39 propositions ; les dix livrées en sont retirées.

Vérification : les sept commandes de tests précédentes et `node tests/ergonomie-top10.test.cjs`, soit **56 tests ciblés réussis** ; syntaxe JavaScript et diff contrôlés. Essais Chromium avec stockage indisponible/reprise, clavier/focus, historique protégé, ajout multiple et rechargement ; T2/revue/choix multiple à 320, 390 et 1280 px sans débordement. Téléphone physique et évaluation utilisateur non réalisés. Les anciennes sections datées décrivent leurs livraisons successives ; l’état de ce lot fait foi pour les comportements qu’il modifie.

## Audit ergonomique — deuxième lot livré, 22 octobre 2026

R01, R04, R20, R21, R28, R29, R30, R31, R32 et R45 sont livrés et retirés de la liste restante : **20 propositions terminées, 29 restantes**. Le [compte rendu du deuxième lot](../../docs/07-evaluation/audit-ergonomie-cours5-6.md#12-deuxième-lot-livré--22-octobre-2026) décrit les preuves et limites.

L’historique conserve l’écran, l’objet et sa position pour Retour/Suivant ; après connexion au même profil, un rechargement retrouve l’écran disponible. Les dialogues temporaires et le questionnaire ne constituent pas des entrées de cet historique. Les données d’entraînement restent locales au profil.

Les conflits de calendrier se résolvent sans perdre le formulaire, les replanifications identiques sont signalées et les opérations groupées proposent Annuler. La préparation replie ses textes facultatifs, garde les sélections par slot, valide les nombres/plages sans perdre les saisies et nomme la portée exacte. Le bilan retrouve son espace d’origine. Rien n’est analysé automatiquement au-delà du bilan existant.

Validation : les huit commandes du premier lot, plus `node tests/ergonomie-lot2.test.cjs`, soit **66 tests ciblés réussis** ; syntaxe et diff contrôlés. Essais Chromium de navigation/rechargement, conflits/doublons/annulations, sélection/saisie/portée ; préparation et conflits à 320, 390 et 1280 px sans débordement. Téléphone physique et évaluation utilisateur non réalisés.
