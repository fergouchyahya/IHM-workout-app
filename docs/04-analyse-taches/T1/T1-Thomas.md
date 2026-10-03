# T1 — Préparer et organiser l'entraînement : Thomas

**Responsable :** Matthieu · **État :** modèle validé par toute l’équipe le 2 octobre 2026.

## But et limites

Thomas veut un programme clair sans avoir à le concevoir. Il choisit un bloc prédéfini de niveau débutant, le place dans sa semaine et sait chaque jour quelle séance l'attend. T1 va du choix du programme à la séance du jour prête pour T2. La lecture de ses progrès relève de T3.

## Sources et concepts du domaine

- [Réunion du 18 septembre](../../../reunions/2026-09-18-arbre-des-taches.md) : accéder à des blocs prédéfinis par niveau et zone cible, placer une séance dans le temps, déplacer une séance.
- [Persona de Thomas](../../02-utilisateurs-personas/persona-thomas.md) et [scénario](../../03-scenarios/scenario-thomas.md) : bibliothèque dès l'accueil, bloc de 4 semaines, sous-bloc de 7 jours nommé (« Full Body », « Repos », « Jambes »).
- [Analyse de la concurrence](../../../research/analyse-concurrence/analyse-applications-concurrentes.md) : questionnaires d'accueil (objectif, expérience, jours par semaine) qui précèdent le choix d'un programme.

**Concepts :** niveau, objectif, zone ciblée, nombre de séances par semaine, bloc prédéfini, semaine, sous-bloc de 7 jours, séance nommée, jour de repos, exercice, séries, répétitions, charge de départ.

## Hiérarchie des tâches (composition)

```text
T1 Préparer et organiser l'entraînement
├── T1.1 Obtenir un programme adapté
│   ├── T1.1.1 Indiquer son niveau, son objectif et ses disponibilités
│   ├── T1.1.2 Parcourir les blocs proposés
│   ├── T1.1.3 Comprendre le contenu d'un bloc (durée, séances, repos)
│   └── T1.1.4 Choisir et démarrer un bloc
├── T1.2 Placer le programme dans sa semaine
│   ├── T1.2.1 Associer les séances aux jours où il peut venir
│   └── T1.2.2 Déplacer une séance manquée ou empêchée
└── T1.3 Préparer la séance du jour
    ├── T1.3.1 Identifier la séance du jour et sa place dans le bloc
    └── T1.3.2 Consulter les exercices prévus et leurs consignes
```

Thomas ne crée ni ne paramètre de programme : la création de zéro, la périodicité et le choix des champs (T1.1 de la réunion) ne le concernent pas pour l'instant. T1.3.2 décrit la consultation avant la séance ; la consultation pendant l’effort relève de T2.

## Procédure et relations temporelles

1. Au premier usage, Thomas indique son niveau, son objectif et le nombre de jours où il peut venir.
2. Il parcourt quelques blocs débutants, regarde la durée et les séances, puis en démarre un.
3. Les séances sont placées sur ses jours disponibles ; les jours de repos apparaissent nommés.
4. Le jour venu, il voit qu'il est sur « Jambes », semaine 1 sur 4, et consulte les exercices avant de partir. S'il rate une séance, il la décale.

**Ordre :** se décrire → parcourir → choisir → placer ; puis, à chaque séance : identifier → consulter. T1.2.2 est facultatif et peut survenir à tout moment du bloc.

## Décoration des tâches

| Tâche | Précondition → résultat | Acteur / fréquence | Repère de conception |
| --- | --- | --- | --- |
| T1.1.1 Se décrire | Aucun programme → profil connu | Thomas, une fois | Nombre de questions acceptable |
| T1.1.2 Parcourir | Profil connu → blocs adaptés affichés | Thomas et outil, une fois par bloc | Choix limité et compréhensible |
| T1.1.3 Comprendre le bloc | Bloc repéré → durée et séances comprises | Thomas, avant de choisir | Vocabulaire simple |
| T1.1.4 Démarrer | Bloc compris → bloc en cours | Thomas, une fois par bloc | Changer d'avis ensuite |
| T1.2.1 Associer aux jours | Bloc en cours → séances datées | Thomas et outil, début de bloc | Jours fixes ou variables |
| T1.2.2 Déplacer | Séance manquée → séance replacée, repos respecté | Thomas et outil, si besoin | Comprendre l'effet sur le repos |
| T1.3.1 Identifier | Bloc en cours → séance du jour connue | Thomas, chaque séance | Étiquette pédagogique |
| T1.3.2 Consulter | Séance connue → exercices et consignes vus | Thomas, avant la séance | Frontière avec T2 |

## Essai sur le scénario

| Situation du [scénario](../../03-scenarios/scenario-thomas.md) | Tâches | Résultat attendu |
| --- | --- | --- |
| Thomas s'inscrit et ne sait pas quoi faire | T1.1.1–T1.1.4 | Bloc débutant démarré en quelques choix |
| Il consulte son bloc (semaine 1 sur 4) | T1.3.1 | « Full Body », « Repos », « Jambes » visibles |
| Il voit que c'est le jour « Jambes » | T1.3.1–T1.3.2 | Séance du jour et exercices connus avant T2 |
| Il a manqué la séance de lundi | T1.2.2 | Séance décalée sans casser le repos |
