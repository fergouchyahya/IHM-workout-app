# Problème — V1

**Auteur :** Matthieu  
**Reviewer :** ...  
**Doc :** [reunions/20260911-IDEATION.md](../../reunions/20260911-IDEATION.md)

## Contexte d'usage

Une personne qui pratique la musculation organise ses séances autour d'un programme (choix des exercices, séries, répétitions, charges) qu'elle doit suivre dans la durée pour progresser. Aujourd'hui, ce suivi se fait le plus souvent sur papier, dans un tableur excel, ou dans des applications généralistes peu adaptées, ce qui rend difficile de :

- préparer une séance à l'avance en s'appuyant sur ce qui a été fait précédemment ;
- suivre, pendant la séance, ce qui a réellement été réalisé par rapport à ce qui était prévu ;
- garder une trace fiable de sa progression (records, charges maximales) dans le temps ;
- situer les séances passées et à venir dans un calendrier ou un programme structuré ;
- noter un ressenti (fatigue, difficulté, douleur) sur une séance ou un exercice précis.

L'application visée se limite au suivi de l'entraînement de musculation.

## Problème

Les utilisateurs n'ont pas d'outil simple qui couvre à la fois la préparation d'un programme d'entraînement structuré dans le temps (blocs de plusieurs mois, séances répétées sur un cycle, ex. 7 jours), le suivi en séance de sa réalisation, et la visualisation de la progression (PR/max, historique), sans complexité excessive ni fonctionnalités hors sujet (diététique, réseau social, etc.).

Cette absence d'outil adapté à plusieurs conséquences pour l'utilisateur :

- perte de temps à préparer ou noter ses séances dans des outils non prévus pour ça
- difficulté à savoir si une séance a été suivie comme prévu et pourquoi (charge trop lourde, fatigue, etc.)
- absence de vue claire sur la progression réelle, ce qui limite la motivation et l'ajustement du programme
- programmes et exercices non réutilisables ni partageables facilement d'une séance ou d'un utilisateur à l'autre

## Objectifs utilisateurs

- Pouvoir préparer une séance à l'avance : choisir des exercices, définir séries, répétitions et charges.
- Pouvoir organiser ses séances dans un programme structuré dans le temps (bloc, ex. 6 mois) composé de cycles répétés (sous-bloc, ex. 7 jours).
- Pouvoir suivre, pendant ou après la séance, ce qui a été réalisé par rapport à ce qui était prévu.
- Pouvoir enregistrer ses records/maximums et visualiser sa progression sous forme de graphique.
- Pouvoir situer ses séances dans un calendrier.
- Pouvoir noter un ressenti global sur une séance, ou ciblé sur un exercice précis.
- Pouvoir personnaliser la liste des exercices : afficher, créer, ou s'appuyer sur des exercices/séances/blocs prédéfinis.
- Pouvoir archiver ou supprimer un cycle/programme devenu obsolète.
- Pouvoir, à terme, partager un entraînement avec d'autres utilisateurs.

## Objectifs du projet

## Contraintes et hypothèses

- Cible : application mobile, dédiée uniquement au suivi de l'entraînement de musculation (le volet diététique est explicitement exclu).
- Hypothèse : les utilisateurs ont des niveaux d'expérience très différents (débutant, avancé et confirmé), (cf. personas dans `docs/02-utilisateurs-personas/`).
- Hypothèse : la modification d'une séance doit pouvoir, au choix de l'utilisateur, se répercuter ou non sur les séances suivantes du même cycle.

## Critères de Réussite
