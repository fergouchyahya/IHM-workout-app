# T3 — Analyser et évaluer les résultats : Thomas

**Responsable :** Yahya · **État :** modèle validé par toute l’équipe le 2 octobre 2026.

## But et limites

Thomas veut voir ce qu'il a accompli et comprendre s'il progresse. T3 commence après la conservation de « Jambes » (T2). Préparer la prochaine séance relève de T1.

## Sources et concepts du domaine

- [Réunion du 18 septembre](../../../reunions/2026-09-18-arbre-des-taches.md) : historique et PR.
- [Persona de Thomas](../../02-utilisateurs-personas/persona-thomas.md) et [scénario](../../03-scenarios/scenario-thomas.md) : nouveau record annoncé après « Jambes », envie de voir les progrès des dernières semaines.

**Concepts :** séance, exercice, date, charge et répétitions réelles, résultat précédent, PR, évolution dans le temps.

## Hiérarchie des tâches (composition)

```text
T3 Analyser et évaluer les résultats
├── T3.1 Consulter le passé
│   ├── T3.1.1 Retrouver la séance terminée
│   └── T3.1.2 Retrouver un résultat précédent du même exercice
├── T3.2 Évaluer la progression
│   ├── T3.2.1 Comparer les résultats réalisés
│   ├── T3.2.2 Vérifier si un nouveau record personnel est atteint
│   └── T3.2.3 Situer le résultat dans l'évolution des dernières semaines
└── T3.3 Comprendre le bilan
    └── T3.3.1 Exprimer ce qui a progressé ou reste incertain
```

T3.3 distingue voir un chiffre et comprendre son sens. Cette conclusion est intégrée au modèle commun.

## Procédure et relations temporelles

1. Thomas retrouve sa séance et, s'il existe, un résultat précédent du même exercice.
2. Il compare charge et répétitions. Si un PR est annoncé, il cherche à comprendre ce qui a battu son ancien résultat. Avec plusieurs séances, il regarde l'évolution sur quelques semaines.
3. Il retient ce qui a progressé ou ce qui reste incertain. Lors d'une première séance, il doit pouvoir comprendre pourquoi aucune comparaison fiable n'est encore possible.

**Ordre :** retrouver → comparer → comprendre le record éventuel → regarder l'évolution. Le record repose sur des résultats comparables, selon les règles de [tache.md](../tache.md).

## Décoration des tâches

| Tâche | Précondition → résultat | Acteur / fréquence | Repère de conception |
| --- | --- | --- | --- |
| T3.1.1 Retrouver la séance | Séance conservée → résultat du jour connu | Thomas et outil, après séance | Accès simple |
| T3.1.2 Retrouver un précédent | Historique disponible → résultat comparable ou absence repérée | Thomas et outil, si historique | Première séance |
| T3.2.1 Comparer | Deux résultats connus → différence de charge et répétitions comprise | Thomas, après séance | Séries différentes |
| T3.2.2 Vérifier le PR | Résultats comparables → record éventuel compris | Thomas et outil, si PR annoncé | Définition claire |
| T3.2.3 Voir l'évolution | Plusieurs séances datées → tendance repérée | Thomas, de temps en temps | Nombre de séances utile |
| T3.3.1 Comprendre | Comparaison faite → progrès ou incertitude compris | Thomas, après revue | Éviter un retour trompeur |

## Essai sur le scénario

| Situation du [scénario](../../03-scenarios/scenario-thomas.md) | Tâches | Résultat attendu |
| --- | --- | --- |
| Thomas finit « Jambes » | T3.1.1 | Résultat du jour retrouvé |
| Un PR est annoncé | T3.1.2, T3.2.1–T3.2.2 | Comparaison et record compris |
| Il regarde ses progrès | T3.2.3, T3.3.1 | Évolution lisible sur plusieurs semaines |
| Première séance, sans historique | T3.1.2, T3.3.1 | Absence de comparaison expliquée |
