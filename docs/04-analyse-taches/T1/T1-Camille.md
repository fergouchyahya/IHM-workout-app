# T1 — Préparer et organiser l'entraînement : Camille

**Responsable :** Matthieu · **État :** modèle validé par toute l’équipe le 2 octobre 2026.

## But et limites

Camille prépare vite une séance à partir de ses exercices habituels et garde une pratique régulière malgré un emploi du temps variable. T1 va de la séance à préparer à la séance prête pour T2. La décision d'augmenter la difficulté se prend dans T3 ; T1 l'applique seulement à la séance suivante.

## Sources et concepts du domaine

- [Réunion du 18 septembre](../../../reunions/2026-09-18-arbre-des-taches.md) : copier une séance, préparer une séance en avance, mettre à jour ponctuellement un entraînement.
- [Persona de Camille](../../02-utilisateurs-personas/persona-camille.md) et [scénario](../../03-scenarios/scenario-camille.md) : duplique sa dernière séance du même type, réutilise la même structure, trois séances par semaine, emploi du temps variable, salle ou domicile.
- [T2 de Camille](../T2/T2-Camille.md) : la séance reprise est le point de départ de T2.

**Concepts :** séance type (structure habituelle), séance reprise, exercice, séries et répétitions prévues, dernière charge, semaine, lieu (salle ou domicile), séance décalée.

## Hiérarchie des tâches (composition)

```text
T1 Préparer et organiser l'entraînement
├── T1.1 Disposer de ses séances types
│   ├── T1.1.1 Créer une séance type à partir de ses exercices habituels
│   └── T1.1.2 Modifier une séance type (exercice ajouté ou retiré)
├── T1.2 Organiser sa semaine
│   ├── T1.2.1 Prévoir les séances de la semaine selon ses disponibilités
│   └── T1.2.2 Décaler ou remplacer une séance prévue
└── T1.3 Préparer la séance du jour
    ├── T1.3.1 Retrouver la dernière séance du même type
    ├── T1.3.2 La reprendre comme base de la séance du jour
    └── T1.3.3 Adapter ponctuellement la séance (lieu, temps disponible)
```

T1.1 n'a lieu qu'au début ou quand Camille change d'habitudes. T1.2 est facultatif : la persona n'indique pas si elle planifie sa semaine ou décide le jour même. Le choix de la charge reste dans T2 (T2.1.2).

## Procédure et relations temporelles

1. Au départ, Camille enregistre ses deux ou trois séances types à partir de ses exercices habituels.
2. Si elle le souhaite, elle répartit ses séances dans la semaine, puis en décale une quand son emploi du temps change.
3. En arrivant à la salle, elle retrouve sa dernière séance du même type et la reprend. Si elle s'entraîne à domicile ou manque de temps, elle retire ou remplace un exercice pour ce jour seulement.
4. La séance reprise passe à T2.

**Ordre :** créer les séances types (rare) → planifier la semaine (facultatif) → retrouver → reprendre → adapter si besoin. T1.3 doit rester très court : elle prépare souvent la séance sur place.

## Décoration des tâches

| Tâche | Précondition → résultat | Acteur / fréquence | Repère de conception |
| --- | --- | --- | --- |
| T1.1.1 Créer la séance type | Exercices habituels connus → séance type enregistrée | Camille, rare | Reprise de ses notes actuelles |
| T1.1.2 Modifier la séance type | Séance type existante → structure mise à jour | Camille, de temps en temps | Distinguer séance type et séance du jour |
| T1.2.1 Prévoir la semaine | Disponibilités connues → séances placées | Camille, chaque semaine si utile | Planification facultative |
| T1.2.2 Décaler | Séance prévue → nouvelle date, régularité gardée | Camille et outil, si besoin | Rappel selon les besoins |
| T1.3.1 Retrouver | Séances passées conservées → dernière séance du même type trouvée | Camille et outil, chaque séance | Accès en quelques secondes |
| T1.3.2 Reprendre | Séance retrouvée → séance du jour prête, valeurs précédentes visibles | Camille et outil, chaque séance | Connexion faible ; voir T5 |
| T1.3.3 Adapter | Séance reprise → exercice retiré ou remplacé, séance type intacte | Camille, si besoin | Modification non propagée |

## Essai sur le scénario

| Situation du [scénario](../../03-scenarios/scenario-camille.md) | Tâches | Résultat attendu |
| --- | --- | --- |
| Camille arrive à la salle | T1.3.1 | Dernière séance du même type retrouvée |
| Elle la duplique | T1.3.2 | Séance du jour prête pour T2 avec les valeurs précédentes |
| Elle s'entraîne exceptionnellement chez elle | T1.3.3 | Exercice remplacé pour ce jour seulement |
| Une réunion tardive la fait rater mercredi | T1.2.2 | Séance décalée, trois séances gardées dans la semaine |
