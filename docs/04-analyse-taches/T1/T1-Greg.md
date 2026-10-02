# T1 — Préparer et organiser l'entraînement : Greg

**Responsable :** Matthieu · **État :** modèle provisoire fondé sur le persona.

## But et limites

Greg construit un cycle de deux à trois mois dans son macrocycle annuel, le reproduit semaine après semaine et modifie ponctuellement une séance. T1 va de la décision de préparer un cycle à une séance prête pour T2. La lecture des résultats qui motive un changement relève de T3 ; le partage du programme relève de T4.

## Sources et concepts du domaine

- [Réunion du 18 septembre](../../../reunions/20260918-ArbreDeTaches.md) : créer un bloc ou un mésocycle, ajouter une périodicité, choisir des champs, déplacer, copier et éditer une séance.
- [Persona de Greg](../../02-utilisateurs-personas/20260917-persona-tres-avance.md) : macrocycle, cycles de deux à trois mois, reproduction automatique d'une semaine, modification ponctuelle, réglages de matériel.
- [Scénario squat](../../03-scenarios/20260917-scenario-tres-avance.md) : séance planifiée avec charges et RPE cibles, rappel des réglages et message pour la prochaine séance.
- [T3 de Greg](../T3/T3-Greg.md) : point à revoir avant la prochaine planification.

**Concepts :** macrocycle, cycle (mésocycle), semaine type, séance, exercice principal et accessoire, séries, répétitions, charge et RPE cibles, focus du cycle, périodicité, réglage de matériel, compétition, rappel.

## Hiérarchie des tâches (composition)

```text
T1 Préparer et organiser l'entraînement
├── T1.1 Construire le cycle
│   ├── T1.1.1 Fixer le focus et la durée du cycle dans le macrocycle
│   ├── T1.1.2 Reprendre les points à revoir issus de T3
│   ├── T1.1.3 Composer une semaine type (séances, exercices, séries, cibles)
│   ├── T1.1.4 Choisir les champs suivis (RPE, sommeil, douleur…)
│   └── T1.1.5 Associer les réglages de matériel aux exercices accessoires
├── T1.2 Planifier le cycle dans le temps
│   ├── T1.2.1 Reproduire la semaine type sur la durée du cycle
│   ├── T1.2.2 Faire évoluer les cibles d'une semaine à l'autre
│   └── T1.2.3 Placer les échéances (compétition, semaine allégée)
└── T1.3 Ajuster le plan existant
    ├── T1.3.1 Déplacer ou copier une séance
    ├── T1.3.2 Modifier ponctuellement une séance sans changer le cycle
    └── T1.3.3 Vérifier la séance du jour avant de la commencer
```

La bibliothèque et l'import (T1.1 de la réunion) ne figurent pas : Greg écrit sa propre programmation. Il peut toutefois s'inspirer de programmes publiés (voir T4). T1.2.2 reste à confirmer : Greg ajuste-t-il les cibles à l'avance ou séance par séance ?

## Procédure et relations temporelles

1. En fin de cycle, Greg relit les points à revoir notés dans T3, puis fixe le focus et la durée du cycle suivant.
2. Il compose une semaine type : séances, exercices principaux et accessoires, séries, répétitions, charges ou RPE cibles. Il choisit les champs à suivre et rattache les réglages de matériel.
3. Il reproduit la semaine sur la durée du cycle, fait évoluer les cibles et place une éventuelle compétition.
4. Pendant le cycle, il déplace, copie ou modifie une séance isolée (contrainte d'agenda, douleur) sans toucher au reste du cycle.
5. Avant la séance, il vérifie la séance du jour, qui passe alors à T2.

**Ordre :** relire T3 → construire la semaine type → reproduire → ajuster au besoin (répétable) → vérifier. T1.3 peut intervenir à tout moment du cycle.

## Décoration des tâches

| Tâche | Précondition → résultat | Acteur / fréquence | Point à vérifier |
| --- | --- | --- | --- |
| T1.1.1 Fixer le focus | Cycle précédent terminé → focus et durée choisis | Greg, tous les 2–3 mois | Lien avec le macrocycle |
| T1.1.2 Reprendre T3 | Points à revoir notés → points intégrés ou écartés | Greg, début de cycle | Retrouver les rappels |
| T1.1.3 Composer la semaine | Focus connu → semaine type complète | Greg, début de cycle | Temps de saisie vs tableur |
| T1.1.4 Choisir les champs | Besoins de suivi connus → champs disponibles en T2 | Greg, rare | Champs vraiment remplis |
| T1.1.5 Associer les réglages | Matériel connu → réglage rattaché à l'exercice | Greg et outil, rare | Réglage propre à une salle ? |
| T1.2.1 Reproduire | Semaine type prête → cycle rempli | Greg et outil, début de cycle | Aucune ressaisie |
| T1.2.2 Faire évoluer les cibles | Cycle rempli → cibles progressives par semaine | Greg, début de cycle | Calcul automatique non souhaité ? |
| T1.2.3 Placer les échéances | Date connue → compétition ou semaine allégée placée | Greg, si besoin | Date qui bouge |
| T1.3.1 Déplacer ou copier | Séance prévue → séance à une autre date | Greg et outil, si besoin | Effet sur la suite du cycle |
| T1.3.2 Modifier ponctuellement | Séance prévue → séance modifiée, cycle intact | Greg et outil, si besoin | Distinguer séance et semaine type |
| T1.3.3 Vérifier | Séance du jour prévue → séance prête pour T2 | Greg, avant chaque séance | Rappel de la séance précédente |

## Essai sur le scénario

| Situation | Tâches | Résultat attendu |
| --- | --- | --- |
| Greg prépare un cycle squat de 10 semaines | T1.1.1–T1.1.3 | Semaine type composée sans tableur |
| Il veut les mêmes semaines sur tout le cycle | T1.2.1–T1.2.2 | Cycle rempli sans ressaisie |
| Une douleur au genou impose de changer une séance | T1.3.2 | Seule cette séance change |
| Le jour du [scénario squat](../../03-scenarios/20260917-scenario-tres-avance.md), il ouvre sa séance | T1.3.3 | Charges, RPE cibles et réglages prêts pour T2 |
| Le message laissé en fin de séance doit servir | T1.1.2, T1.3.3 | Rappel retrouvé avant la prochaine séance squat |

## Questions de validation

Répondre comme Greg, avec un exemple concret.

1. Comment construis-tu un nouveau cycle aujourd'hui dans Excel ou Notion, et combien de temps cela prend-il ?
2. D'une semaine à l'autre, que changes-tu : charges, RPE, séries ? Le décides-tu à l'avance ?
3. Quand tu modifies une séance, veux-tu que la modification s'applique aux semaines suivantes ?
4. Où notes-tu les réglages de matériel, et changent-ils selon la salle ?
5. Comment prépares-tu une compétition dans ton planning ?

## Réponses et révisions

**À remplir par l'équipe :** noter le répondant et la date. Confirmer ensuite les réponses auprès d'un pratiquant avancé réel.
