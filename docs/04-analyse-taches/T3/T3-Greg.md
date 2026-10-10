# T3 — Analyser et évaluer les résultats : Greg

**Responsable :** Yahya · **État :** modèle validé par toute l’équipe le 2 octobre 2026.

## But et limites

Greg compare ses résultats de powerlifting, cherche des tendances sur plusieurs séances et décide ce qui mérite d'être revu. T3 commence quand la séance est conservée (T2). Modifier le programme relève de T1.

## Sources et concepts du domaine

- [Réunion du 18 septembre](../../../reunions/2026-09-18-arbre-des-taches.md) : historique, progression et liens possibles entre fatigue et performance.
- [Persona de Greg](../../02-utilisateurs-personas/persona-greg.md) et [scénario squat](../../03-scenarios/scenario-greg.md) : PR, cycles, notes, séance adaptée après trois heures de sommeil.
- Jeu de rôle : Greg compare d'abord la dernière séance de squat comparable, puis regarde les tendances à long terme.

**Concepts :** séance comparable, charge, répétitions, RPE, PR, cycle, macrocycle, sommeil, fatigue, douleur, technique, note, vidéo, interprétation.

## Hiérarchie des tâches (composition)

```text
T3 Analyser et évaluer les résultats
├── T3.1 Consulter le passé
│   ├── T3.1.1 Choisir l'exercice et la période à examiner
│   ├── T3.1.2 Retrouver la dernière séance comparable et d'autres résultats pertinents
│   └── T3.1.3 Retrouver les notes et médias liés aux résultats
├── T3.2 Évaluer la progression
│   ├── T3.2.1 Comparer les charges, répétitions et RPE réels
│   ├── T3.2.2 Repérer les PR et l'évolution dans le cycle
│   └── T3.2.3 Examiner sommeil, fatigue, douleur et technique avec les performances
└── T3.3 Conclure la revue
    ├── T3.3.1 Formuler une interprétation avec ses incertitudes
    └── T3.3.2 Déterminer un point à revoir avant la prochaine planification
```

T3.3 prolonge l'arbre de la réunion d'après le scénario de Greg ; cette conclusion est intégrée au modèle commun. Notes et médias sont facultatifs.

## Procédure et relations temporelles

1. Greg choisit un exercice et retrouve d'abord la dernière séance comparable. Il peut élargir la revue au cycle et relire ses notes ou vidéos.
2. Il compare charges, répétitions et RPE, puis regarde les PR et la tendance sur plusieurs séances. Il examine aussi fatigue, sommeil, douleur et technique quand ces données existent.
3. Il formule une hypothèse prudente. Une mauvaise séance ne prouve pas que le programme échoue. Si la fatigue est élevée, qu'un exercice fait mal à chaque séance ou qu'il ne progresse plus, il note ce qu'il veut revoir avant de modifier le programme dans T1.

**Ordre :** retrouver → comparer → examiner le contexte → interpréter → préparer la suite. Les règles communes de comparaison et de record figurent dans [tache.md](../tache.md).

## Décoration des tâches

| Tâche | Précondition → résultat | Acteur / fréquence | Repère de conception |
| --- | --- | --- | --- |
| T3.1.1 Choisir | Historique disponible → exercice et période fixés | Greg, à chaque revue | Période utile |
| T3.1.2 Retrouver | Périmètre fixé → dernière séance comparable et autres résultats trouvés | Greg et outil, à chaque revue | Comparabilité |
| T3.1.3 Relire le contexte | Notes ou médias disponibles → contexte retrouvé | Greg et outil, si utile | Usage des vidéos |
| T3.2.1 Comparer | Résultats trouvés → écarts de charge, répétitions et RPE connus | Greg, à chaque revue | Cibles différentes |
| T3.2.2 Voir la tendance | Résultats datés → PR et évolution repérés | Greg et outil, à chaque revue | Définition du PR |
| T3.2.3 Examiner le contexte | Résultats et notes disponibles → facteurs possibles repérés | Greg, si données présentes | Données manquantes |
| T3.3.1 Interpréter | Comparaisons faites → hypothèse et incertitudes formulées | Greg, après revue | Éviter une conclusion hâtive |
| T3.3.2 Préparer la suite | Hypothèse formulée → point à revoir avant T1 identifié | Greg, si besoin | Seuil de décision |

## Essai sur le scénario

| Situation du [scénario](../../03-scenarios/scenario-greg.md) | Tâches | Résultat attendu |
| --- | --- | --- |
| Greg retrouve le squat fatigué et une séance comparable | T3.1.1–T3.1.2 | Charges, répétitions et RPE retrouvés |
| Il relit la raison de l'adaptation | T3.1.3 | Contexte rattaché à la bonne séance |
| Il juge sa progression | T3.2.1–T3.2.3 | Tendance et contexte examinés |
| Il pense à la suite du cycle | T3.3.1–T3.3.2 | Hypothèse prudente, point à revoir dans T1 |
