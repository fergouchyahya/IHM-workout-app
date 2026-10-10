# T2 — Réaliser et documenter une séance : Thomas

**Responsable :** Yahya · **État :** modèle validé par toute l’équipe le 2 octobre 2026.

## But et limites

Thomas suit sa séance, comprend les exercices nouveaux et garde une trace des séries réellement faites. T2 commence avec la séance ouverte (T1) et finit quand ses résultats sont conservés. Le retour sur ses progrès relève de T3.

## Sources et concepts du domaine

- [Réunion du 18 septembre](../../../reunions/2026-09-18-arbre-des-taches.md) : réaliser et consigner l'effort.
- [Persona de Thomas](../../02-utilisateurs-personas/persona-thomas.md) et [scénario](../../03-scenarios/scenario-thomas.md) : séance « Jambes », presse à cuisses peu connue, saisie après la série et ressenti final.

**Concepts :** séance, exercice, consigne, séries et valeurs prévues, charge et répétitions réelles, ressenti, bilan.

## Hiérarchie des tâches (composition)

```text
T2 Réaliser et documenter une séance
├── T2.1 Comprendre l'exercice à effectuer
│   ├── T2.1.1 Repérer l'exercice et les séries prévus
│   ├── T2.1.2 Comprendre l'objectif de la prochaine série
│   └── T2.1.3 Consulter une consigne si le mouvement est incertain
├── T2.2 Effectuer et consigner l'effort
│   ├── T2.2.1 Réaliser la série
│   ├── T2.2.2 Consigner les répétitions et la charge réelles
│   └── T2.2.3 Vérifier le résultat saisi avant de poursuivre
└── T2.3 Terminer la séance
    ├── T2.3.1 Vérifier les exercices et séries effectués
    ├── T2.3.2 Formuler un ressenti global
    └── T2.3.3 Conserver le bilan de la séance
```

La consigne n'est utile que si Thomas hésite. Les feuilles restent au niveau des tâches ; les gestes d'interface seront définis plus tard.

## Procédure et relations temporelles

1. Thomas repère l'exercice et la prochaine série. S'il ne connaît pas le mouvement, il consulte la consigne avant de commencer.
2. Il réalise la série, note charge et répétitions réelles, puis vérifie sa saisie. Il répète ces étapes pour les autres séries.
3. À la fin, il vérifie ce qu'il a fait, note son ressenti et conserve la séance. Une série interrompue ou non faite reste identifiable ; une erreur peut être corrigée.

**Ordre :** comprendre → réaliser → consigner et vérifier ; répéter ; faire le bilan → conserver.

## Décoration des tâches

| Tâche | Précondition → résultat | Acteur / fréquence | Repère de conception |
| --- | --- | --- | --- |
| T2.1.1 Repérer | Séance ouverte → exercice et séries connus | Thomas, chaque exercice | Repérage facile |
| T2.1.2 Comprendre | Exercice connu → cible de la série comprise | Thomas, chaque série | Mots compris par un débutant |
| T2.1.3 Lire la consigne | Mouvement incertain → consigne comprise | Thomas et outil, si besoin | Consigne suffisante |
| T2.2.1 Réaliser | Objectif compris → série faite ou arrêtée | Thomas, chaque série | Cas d'interruption |
| T2.2.2 Consigner | Série faite → charge et répétitions liées à la série | Thomas et outil, chaque série | Temps de saisie |
| T2.2.3 Vérifier | Valeurs saisies → erreur éventuelle repérée | Thomas, après saisie | Correction possible |
| T2.3.1 Vérifier la séance | Résultats disponibles → séries faites et manquantes repérées | Thomas, fin de séance | Oubli de série |
| T2.3.2 Noter le ressenti | Séance finie → ressenti lié à la séance | Thomas et outil, fin de séance | Niveau de détail |
| T2.3.3 Conserver | Bilan prêt → séance retrouvable dans T3 | Thomas et outil, fin de séance | Perte de données |

## Essai sur le scénario

| Situation du [scénario](../../03-scenarios/scenario-thomas.md) | Tâches | Résultat attendu |
| --- | --- | --- |
| Thomas ouvre « Jambes » | T2.1.1–T2.1.2 | Prochaine série comprise |
| Il hésite devant la presse à cuisses | T2.1.3 | Consigne consultée avant l'effort |
| Il finit une série et saisit la charge | T2.2.1–T2.2.3 | Résultat lié à la bonne série |
| Il note son ressenti et termine | T2.3.1–T2.3.3 | Bilan conservé pour T3 |
