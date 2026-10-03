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
- Trois espaces : **Découvrir**, **Mes entraînements**, **Progrès**.
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
- Remplacement par menu déroulant, avec priorité aux exercices sollicitant les mêmes muscles.
- La première adaptation enregistrée crée une copie personnelle ; la bibliothèque originale reste disponible.
- Par défaut, les changements concernent la copie enregistrée et ses prochaines séances ; **cette séance uniquement** reste possible.
- Adaptation possible pendant la séance ; les changements concernent les séries à venir, les résultats déjà réalisés restent conservés et corrigibles séparément.

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
- Relecture des [suggestions et filtres](03-decouverte/README.md) et de la [création avancée](04-mes-entrainements/README.md) ; détail de la fiche, de la semaine et de l’éditeur à concevoir ensuite.
- Placement et visibilité des options de portée d’une adaptation.
- Visuels d’aide aux exercices, présentation des saisies et fonctionnement précis du repos.
- Présentation du bilan, des comparaisons et des éventuels records.
- Style visuel et libellés de chaque écran.

La palette confirmée pour cette première page est `#B91C1C`, `#F87171`, `#111827`, `#FEF2F2`, avec un style très sobre et au plus un petit symbole sportif. Son application concrète est décrite dans le README de connexion. Le nom de l’interface, la durée du repos et les comportements techniques de l’ancienne proposition ne sont pas considérés comme validés ; ils seront décidés lorsque nous traiterons les écrans concernés.
