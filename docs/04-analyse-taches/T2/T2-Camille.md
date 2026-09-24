# T2 — Réaliser et documenter une séance : Camille

**Responsable :** Yahya · **État :** modèle provisoire fondé sur le persona.

## But et limites

Camille réalise une séance familière, note vite ses résultats et peut corriger une erreur. T2 va de la séance choisie (T1) au bilan conservé. La comparaison des progrès relève de T3 ; la synchronisation relève de T5.

## Sources et concepts du domaine

- [Réunion du 18 septembre](../../../reunions/20260918-ArbreDeTaches.md) : effort dans T2, synchronisation dans T5.
- [Persona et scénario de Camille](../../02-utilisateurs-personas/persona-camille-intermediaire.md) : séance reprise, dernière charge consultée, saisie entre les séries, correction et connexion faible.

**Concepts :** séance reprise, exercice, série, dernière performance, charge et répétitions réelles, correction, conservation du bilan.

## Hiérarchie des tâches (composition)

```text
T2 Réaliser et documenter une séance
├── T2.1 Déterminer l'effort de l'exercice en cours
│   ├── T2.1.1 Consulter l'objectif et la dernière performance comparable
│   └── T2.1.2 Choisir la charge ou la cible de la série
├── T2.2 Réaliser et suivre les séries
│   ├── T2.2.1 Réaliser la série
│   ├── T2.2.2 Consigner la charge et les répétitions réelles
│   ├── T2.2.3 Corriger une valeur erronée si nécessaire
│   └── T2.2.4 S'assurer que le résultat reste conservé
└── T2.3 Terminer la séance
    ├── T2.3.1 Vérifier les séries et leurs résultats
    └── T2.3.2 Conserver le bilan de la séance
```

La correction est facultative. T2.2.4 exprime le besoin de ne pas perdre une saisie ; la solution technique appartient à T5.

## Procédure et relations temporelles

1. Camille consulte l'objectif et la dernière performance, puis choisit la charge du jour.
2. Elle fait la série et note le résultat, souvent pendant le repos. Elle corrige la valeur si besoin, sans toucher aux autres séries. Ses résultats doivent rester disponibles malgré une connexion faible.
3. Elle répète la séquence, vérifie les séries à la fin et conserve le bilan avant de regarder sa progression dans T3.

**Ordre :** consulter → choisir → réaliser → consigner → corriger si besoin ; répéter ; vérifier → conserver.

## Décoration des tâches

| Tâche | Précondition → résultat | Acteur / fréquence | Point à vérifier |
| --- | --- | --- | --- |
| T2.1.1 Consulter | Historique disponible → objectif et dernière performance connus | Camille, chaque exercice | Accès rapide |
| T2.1.2 Choisir | Repère précédent connu → charge choisie | Camille, avant série | Décision personnelle |
| T2.2.1 Réaliser | Charge choisie → série faite ou arrêtée | Camille, chaque série | Cas d'interruption |
| T2.2.2 Consigner | Série faite → charge et répétitions notées | Camille et outil, chaque série | Saisie rapide |
| T2.2.3 Corriger | Erreur repérée → valeur corrigée, autres résultats gardés | Camille et outil, si besoin | Annulation souhaitée ? |
| T2.2.4 Vérifier la conservation | Résultat saisi → résultat encore disponible | Camille et outil, pendant la séance | Connexion faible ; voir T5 |
| T2.3.1 Vérifier la séance | Résultats disponibles → oubli ou erreur repéré | Camille, fin de séance | Temps de vérification |
| T2.3.2 Conserver | Bilan vérifié → séance retrouvable dans T3 | Camille et outil, fin de séance | Perte de données |

## Essai sur le scénario

| Situation du [scénario](../../02-utilisateurs-personas/persona-camille-intermediaire.md) | Tâches | Résultat attendu |
| --- | --- | --- |
| Camille reprend une séance connue | T2.1.1 | Dernière performance retrouvée |
| Elle choisit sa charge et fait une série | T2.1.2, T2.2.1 | Effort du jour distingué du précédent |
| Elle saisit puis corrige une valeur | T2.2.2–T2.2.3 | Autres séries gardées |
| La connexion est faible | T2.2.4 | Résultats encore disponibles ; voir T5 |
| Elle termine la séance | T2.3.1–T2.3.2 | Bilan conservé pour T3 |

## Questions de validation

Répondre comme Camille, avec un exemple concret.

1. Quelle valeur de la dernière séance regardes-tu avant de choisir ta charge ?
2. Que notes-tu après une série, et combien de temps peux-tu y passer ?
3. Si tu saisis une mauvaise valeur, que veux-tu corriger ou annuler ?
4. Avec une mauvaise connexion, comment sais-tu que ton résultat est gardé ?
5. Que vérifies-tu avant de terminer ?

## Réponses et révisions

**À remplir par l'équipe :** noter le répondant et la date. Confirmer ensuite les réponses auprès d'une pratiquante réelle.
