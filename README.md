# Projet IHM — Suivi d’entraînements sportifs

> Nom provisoire : **IHM-workout-app**

## Contexte

Projet universitaire. Il porte sur la conception d’une interface homme-machine permettant de suivre et de saisir des entraînements sportifs.

## Objectif

Construire et justifier une proposition d’IHM adaptée aux besoins d’utilisateurs réels. Le livrable central est une démarche de conception documentée, et non une application complète.

## Périmètre

Le projet couvre la recherche utilisateur, la conception, le prototypage et l’évaluation. Un prototype HTML/CSS/JavaScript exécutable localement permet de tester les parcours ; une intégration Figma peut compléter les documents versionnés ici. Il ne comporte ni serveur applicatif ni authentification réelle.

## Méthode de travail

La conception suit la chaîne suivante ; chaque étape alimente la suivante et peut être révisée après une évaluation :

```text
utilisateurs et contexte
→ personas
→ scénarios
→ analyse des tâches
→ arbre des tâches
→ interface abstraite
→ interface concrète
→ prototype
→ évaluation
→ itération
```

Les hypothèses, décisions et résultats sont consignés au plus près de leur étape. Les liens Figma servent de complément : les décisions importantes restent dans Git.

## Organisation du dépôt

- `docs/` : livrables de conception, organisés par étape.
- `research/` : matériaux de recherche (concurrence, entretiens, observations).
- `assets/` : captures, diagrammes et figures réutilisés dans les documents.
- `prototypes/` : prototype navigateur interactif et suivi des prototypes externes.
- `reunions/` : ordres du jour, comptes rendus et actions.

## Outils utilisés

- Markdown et Git pour les documents et les décisions ;
- Figma pour les sketches, wireframes, maquettes et prototypes ;

## Essayer le prototype

Depuis la racine : `python3 -m http.server 8765 --bind 127.0.0.1`, puis ouvrir [le prototype](http://127.0.0.1:8765/prototypes/propotype%201/01-connexion/index.html) et choisir **Essayer sans compte**. Aucun paquet à installer ; Python 3 et un navigateur suffisent. Les données sont conservées dans le navigateur.

L’[audit selon la grille IHM](docs/07-evaluation/audit-final-grille.md) relie les artefacts, les preuves techniques et les évaluations utilisateur encore à réaliser.

Le [dossier de préparation de la présentation finale](docs/08-presentation-finale/README.md) regroupe trame, sources, visuels et démonstration.

Les parcours et commandes de vérification sont décrits dans le [README du prototype](<prototypes/propotype 1/README.md>).

## Fonctionnement de l’équipe

Chaque livrable a un responsable identifié dans son document ou son compte rendu. Les contributions sont relues par au moins une autre personne avant validation. Les décisions transverses sont discutées en réunion et archivées dans `docs/05-decisions-conception/`.

## Convention Git

`main` reste stable. Le travail se fait sur de petites branches par sujet, puis passe par une pull request avant fusion. Voir [CONTRIBUTING.md](CONTRIBUTING.md) pour les règles complètes.

## Étapes prévues

1. Cadrer le problème, le contexte et les utilisateurs.
2. Produire personas, scénarios, analyses et arbres de tâches.
3. Explorer puis documenter les choix d’interface abstraite et concrète.
4. Réaliser et tester un prototype.
5. Itérer à partir des évaluations.
6. Préparer le récit et les supports de présentation finale.
