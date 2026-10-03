# T2 — Réaliser et documenter une séance : Greg

**Responsable :** Yahya · **État :** modèle validé par toute l’équipe le 2 octobre 2026.

## But et limites

Greg réalise sa séance en adaptant l'effort à son état. Il garde les résultats réels, les écarts au programme et leur raison. T2 commence avec une séance planifiée (T1) et finit quand son bilan est conservé. L'analyse de la progression relève de T3.

## Sources et concepts du domaine

- [Réunion du 18 septembre](../../../reunions/2026-09-18-arbre-des-taches.md) : saisir l'effort et enrichir la séance.
- [Persona de Greg](../../02-utilisateurs-personas/persona-greg.md) et [scénario squat](../../03-scenarios/scenario-greg.md) : RPE, fatigue, adaptation de charge, notes et bilan.

**Concepts :** séance et séries prévues, charge, répétitions et RPE cibles, résultat et RPE réels, séance comparable précédente, sommeil, fatigue, douleur, note, média, bilan.

## Hiérarchie des tâches (composition)

```text
T2 Réaliser et documenter une séance
├── T2.1 Exécuter et consigner l'effort
│   ├── T2.1.1 Consulter l'objectif prévu et le résultat comparable précédent
│   ├── T2.1.2 Apprécier son état et l'effort ressenti
│   ├── T2.1.3 Adapter la série prévue et noter la raison si nécessaire
│   ├── T2.1.4 Réaliser la série
│   ├── T2.1.5 Consigner le résultat réel et le ressenti après la série
│   └── T2.1.6 Corriger une erreur de saisie si nécessaire
├── T2.2 Enrichir la séance
│   ├── T2.2.1 Consigner le contexte utile (sommeil, fatigue, douleur)
│   ├── T2.2.2 Ajouter une remarque technique ou un rappel
│   └── T2.2.3 Associer un média si utile
└── T2.3 Terminer la séance
    ├── T2.3.1 Vérifier les séries réalisées, adaptées ou non réalisées
    ├── T2.3.2 Formuler un ressenti global et un rappel éventuel
    └── T2.3.3 Conserver le bilan de la séance
```

Les feuilles sont des tâches à détailler en actions physiques lorsque l'interface sera définie. Notes et médias sont facultatifs.

## Procédure et relations temporelles

1. Avant l'effort, Greg consulte le RPE prévu et la dernière séance comparable. Il peut noter son état et retrouver un réglage de matériel utile.
2. Pour chaque série : il évalue son état, adapte la charge si besoin en gardant la cible initiale et la raison, réalise la série, puis note le résultat et son ressenti. Il corrige une erreur sur la série courante sans perdre les autres résultats.
3. Il peut ajouter une note ou un média quand l'information est disponible. Une série arrêtée ou sautée doit rester identifiable, sans résultat inventé.
4. À la fin, il vérifie les séries faites et consignées ainsi que le RPE, note son bilan et conserve la séance pour T3.

**Ordre :** consulter → adapter si besoin → réaliser → consigner ; répéter ; vérifier → conserver. Le RPE est consigné pour les séries que Greg souhaite suivre.

## Décoration des tâches

| Tâche | Précondition → résultat | Acteur / fréquence | Repère de conception |
| --- | --- | --- | --- |
| T2.1.1 Consulter | Programme et historique disponibles → cible et dernier résultat connus | Greg, avant exercice ou série | Consultation rapide |
| T2.1.2 Évaluer | Cible et ressenti connus → effort jugé adapté ou non | Greg, avant la série | Critère personnel |
| T2.1.3 Adapter | Cible connue → nouvelle cible et raison notées, cible initiale gardée | Greg, si besoin | Écart au programme traçable |
| T2.1.4 Réaliser | Cible choisie → série faite, arrêtée ou sautée | Greg, chaque série | Statut exact de la série |
| T2.1.5 Consigner | Série effectuée → résultat et ressenti liés à la bonne série | Greg et outil, après la série | RPE réel et temps de saisie |
| T2.1.6 Corriger | Erreur repérée → série courante corrigée, historique gardé | Greg et outil, si besoin | Pas de perte des autres séries |
| T2.2.1 Noter le contexte | État connu → sommeil, fatigue ou douleur liés à la séance | Greg et outil, si utile | Données réellement suivies |
| T2.2.2 Ajouter une note | Observation faite → note liée à l'exercice ou à la séance | Greg et outil, si utile | Moment de saisie |
| T2.2.3 Associer un média | Média disponible → média lié à l'exercice | Greg et outil, si utile | Usage réel |
| T2.3.1 Vérifier | Programme et résultats disponibles → faits et omissions repérés | Greg, fin de séance | Séries et RPE complets |
| T2.3.2 Faire le bilan | Résultats vérifiés → ressenti et rappel éventuel notés | Greg, fin de séance | Contenu utile |
| T2.3.3 Conserver | Bilan prêt → séance retrouvable dans T3 | Greg et outil, fin de séance | Perte de données |

## Essai sur le scénario

| Situation du [scénario](../../03-scenarios/scenario-greg.md) | Tâches | Résultat attendu |
| --- | --- | --- |
| Trois heures de sommeil avant le squat | T2.2.1, T2.1.1 | État du jour et cible connus |
| Top set trop lourd | T2.1.2, T2.1.3 | Charge adaptée, raison et cible initiale gardées |
| Séries et accessoires réalisés | T2.1.4–T2.1.6 | Résultats par série, correction possible |
| Fatigue et technique notées | T2.2.2 | Note liée au bon exercice |
| Séance terminée | T2.3.1–T2.3.3 | Séries et RPE vérifiés, bilan conservé |
