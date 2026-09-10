# Projet IHM — Suivi d’entraînements sportifs

> Nom provisoire : **SportLog IHM**

## Contexte

Projet universitaire mené par une équipe de quatre personnes. Il porte sur la conception d’une interface homme-machine permettant de suivre et de saisir des entraînements sportifs.

## Objectif

Construire et justifier une proposition d’IHM adaptée aux besoins d’utilisateurs réels. Le livrable central est une démarche de conception documentée, et non une application complète.

## Périmètre

Le projet couvre la recherche utilisateur, la conception, le prototypage et l’évaluation. Une intégration Figma peut compléter les documents versionnés ici. Aucun développement frontend ou backend n’est prévu dans ce dépôt à ce stade.

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
- `prototypes/` : suivi des prototypes externes, notamment Figma.
- `reunions/` : ordres du jour, comptes rendus et actions.

## Outils utilisés

- Markdown et Git pour les documents et les décisions ;
- Figma pour les sketches, wireframes, maquettes et prototypes ;
- un outil de visioconférence ou de prise de notes choisi par l’équipe pour les réunions et évaluations.

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
