# Arbre commun des tâches — Suivre son entraînement de musculation

**Auteur :** Sami · **Reviewer :** toute l’équipe  
**Statut :** tâches validées le 2 octobre 2026 ; arbre consolidé à relire le 9 octobre 2026.

## Périmètre

Ce document rassemble T1–T5 dans un seul arbre à partir des modèles par persona et des synthèses validés. Il décrit les tâches ; les écrans et les gestes seront définis dans le prototype. Il sert de base au modèle K-MADe commun.

U = utilisateur ; S = système ; U/S = utilisateur avec le système. Un programme désigne une séance, un bloc ou un cycle. Les variantes de profil partagent les mêmes tâches : Mireille reprend principalement le parcours guidé de Thomas, avec des visuels simplifiés.

## Arbre consolidé

```text
T0 Gérer et suivre sa pratique de la musculation [U/S]
├── T1 Préparer et organiser l’entraînement [U/S]
│   ├── T1.1 Créer ou acquérir un programme
│   │   ├── T1.1.1 Définir objectif, niveau, durée et disponibilités [U]
│   │   ├── T1.1.2 Créer une séance ou une semaine type [U]
│   │   ├── T1.1.3 Choisir un programme prédéfini ou importer un programme partagé [U/S]
│   │   ├── T1.1.4 Reprendre une séance ou un cycle existant [U/S]
│   │   └── T1.1.5 Définir exercices, séries, répétitions, charges, RPE et champs utiles [U]
│   ├── T1.2 Organiser le calendrier
│   │   ├── T1.2.1 Placer les séances et les jours de repos [U/S]
│   │   ├── T1.2.2 Reproduire une semaine sur la durée du cycle [U/S]
│   │   ├── T1.2.3 Faire évoluer les cibles et placer les échéances [U]
│   │   └── T1.2.4 Déplacer ou copier une séance ou un bloc [U/S]
│   └── T1.3 Préparer ou adapter la séance à réaliser
│       ├── T1.3.1 Retrouver la séance et les points à revoir issus de T3 [U/S]
│       ├── T1.3.2 Adapter les exercices ou les cibles au contexte [U]
│       ├── T1.3.3 Choisir si la modification concerne cette séance ou le programme type [U]
│       └── T1.3.4 Vérifier exercices, consignes, cibles et réglages avant T2 [U]
├── T2 Réaliser et documenter la séance [U/S]
│   ├── T2.1 Comprendre et préparer l’effort
│   │   ├── T2.1.1 Repérer l’exercice, la série et l’objectif prévus [U]
│   │   ├── T2.1.2 Consulter la consigne, les réglages et le résultat précédent [U/S]
│   │   ├── T2.1.3 Apprécier son état et choisir l’effort du jour [U]
│   │   └── T2.1.4 Adapter la série si nécessaire en conservant la cible initiale [U/S]
│   ├── T2.2 Réaliser et consigner les séries
│   │   ├── T2.2.1 Réaliser la série [U]
│   │   ├── T2.2.2 Noter charge, répétitions et ressenti ou RPE réels [U/S]
│   │   ├── T2.2.3 Indiquer une série adaptée, interrompue ou non faite [U/S]
│   │   ├── T2.2.4 Vérifier et corriger une saisie sans perdre les autres résultats [U/S]
│   │   └── T2.2.5 Conserver le résultat pour la série concernée [S]
│   ├── T2.3 Enrichir la séance si utile
│   │   ├── T2.3.1 Noter sommeil, fatigue, douleur ou raison d’une adaptation [U/S]
│   │   ├── T2.3.2 Ajouter une remarque technique, un réglage ou un rappel [U/S]
│   │   └── T2.3.3 Associer une photo ou une vidéo [U/S]
│   └── T2.4 Terminer la séance
│       ├── T2.4.1 Vérifier les résultats et les séries non réalisées [U]
│       ├── T2.4.2 Formuler un ressenti global et un rappel éventuel [U/S]
│       └── T2.4.3 Conserver le bilan pour T3 [S]
├── T3 Analyser et évaluer les résultats [U/S]
│   ├── T3.1 Consulter le passé
│   │   ├── T3.1.1 Choisir séance, exercice et période [U]
│   │   ├── T3.1.2 Retrouver les résultats comparables ou constater leur absence [U/S]
│   │   └── T3.1.3 Retrouver les notes, réglages et médias associés [U/S]
│   ├── T3.2 Évaluer la progression
│   │   ├── T3.2.1 Comparer charges, répétitions et RPE disponibles [U/S]
│   │   ├── T3.2.2 Repérer les records et l’évolution sur plusieurs séances [U/S]
│   │   └── T3.2.3 Examiner les indicateurs et le contexte utiles au profil [U]
│   └── T3.3 Conclure la revue
│       ├── T3.3.1 Comprendre le progrès, la stabilité ou les limites de comparaison [U]
│       └── T3.3.2 Conserver un point à revoir lors de la prochaine préparation T1 [U/S]
├── T4 Partager un programme et suivre les retours [U/S]
│   ├── T4.1 Choisir et vérifier le contenu
│   │   ├── T4.1.1 Sélectionner une séance, un bloc ou un cycle existant [U]
│   │   └── T4.1.2 Vérifier les informations incluses et exclure le suivi personnel [U/S]
│   ├── T4.2 Présenter le programme et choisir son public
│   │   ├── T4.2.1 Renseigner titre, niveau et zone ciblée [U/S]
│   │   ├── T4.2.2 Ajouter une description ou une demande de conseils si utile [U]
│   │   ├── T4.2.3 Choisir contacts ou publication publique [U]
│   │   └── T4.2.4 Autoriser ou fermer les commentaires [U]
│   ├── T4.3 Confirmer le partage
│   │   ├── T4.3.1 Contrôler l’aperçu et la visibilité [U]
│   │   └── T4.3.2 Confirmer puis vérifier l’état de publication [U/S]
│   └── T4.4 Suivre le contenu partagé si utile
│       ├── T4.4.1 Lire les commentaires et répondre si souhaité [U/S]
│       └── T4.4.2 Mettre à jour ou retirer une publication [U/S]
└── T5 Accéder aux informations et préserver les données [U/S]
    ├── T5.1 Accéder à l’information recherchée
    │   ├── T5.1.1 Définir ce que l’on cherche [U]
    │   ├── T5.1.2 Chercher un accès par navigation, recherche ou raccourci [U/S]
    │   ├── T5.1.3 Consulter le contenu trouvé [U]
    │   └── T5.1.4 Vérifier qu’il convient et reprendre la recherche si nécessaire [U]
    └── T5.2 Préserver les données d’entraînement
        ├── T5.2.1 Conserver localement
        │   ├── T5.2.1.1 Enregistrer les changements sans dépendre du réseau [S]
        │   └── T5.2.1.2 Confirmer la conservation [S]
        └── T5.2.2 Synchroniser si le réseau est disponible
            ├── T5.2.2.1 Transmettre les changements conservés [S]
            ├── T5.2.2.2 Confirmer la synchronisation et rendre son état visible [S]
            └── T5.2.2.3 Signaler un échec et permettre la reprise [U/S]
```

## Relations temporelles et variantes

| Branche | Déroulement |
| --- | --- |
| T1 | Créer, choisir, importer ou reprendre constituent des alternatives. Organiser ensuite les séances si nécessaire, puis vérifier celle à réaliser. La préparation peut être reprise après T3. |
| T2 | Comprendre → adapter si nécessaire → réaliser → consigner et vérifier ; répéter pour chaque série et exercice, puis terminer. Notes et médias sont facultatifs et peuvent être ajoutés lorsque disponibles. |
| T3 | Retrouver → comparer si les données le permettent → examiner l’évolution et le contexte → conclure. La modification du programme relève de T1. |
| T4 | Sélectionner → vérifier → présenter et choisir les options, sans ordre imposé entre les champs → aperçu → confirmation. Le suivi est facultatif et répétable. Importer relève de T1. |
| T5 | Navigation et préservation sont transverses à T1–T4. Enregistrer localement avant de transmettre ; confirmer l’envoi lorsqu’il aboutit. Rechercher de nouveau si le contenu ne convient pas. |

| Persona | Variante principale |
| --- | --- |
| Thomas | Programme prédéfini, vocabulaire simple, consignes et bilan compréhensible. |
| Camille | Reprise rapide d’une séance, comparaison récente, correction et conservation fiables. |
| Greg | Cycles, cibles et résultats distincts, RPE, réglages, contexte et revue à long terme. |
| Mireille | Parcours guidé proche de Thomas ; images explicatives et visuels simplifiés, avec une progression lisible liée à ses objectifs. Pas de branche supplémentaire dédiée. |

## Règles communes et revue finale

- Les données prévues et réalisées restent distinctes. Une série non faite n’obtient aucun résultat inventé.
- La correction conserve les autres séries. Le programme type et la séance ponctuelle sont distingués lors d’une modification.
- Une comparaison tient compte de l’exercice, du matériel et des conditions de réalisation ; un record doit désigner la mesure améliorée. Sans historique comparable, aucune progression n’est annoncée.
- Les résultats, records, notes privées et données personnelles de contexte sont exclus du partage. Le contenu visible est contrôlé avant confirmation.
- Les préférences de suivi et les seuils d’adaptation restent propres à l’utilisateur ; les tendances ne prouvent pas une cause.

La revue du 9 octobre porte sur la cohérence de cet arbre consolidé et sa transcription K-MADe. Les précisions de conception restantes — champs obligatoires, critères exacts de comparaison et de record, options de partage et copies importées, erreurs ou modifications concurrentes de synchronisation — seront traitées dans cette revue, sans rouvrir les questionnaires des modèles sources. Le prototype sera aligné séparément par Yahya et Marie.

## Sources

- [Validation du 2 octobre](../../reunions/2026-10-02-validation-des-taches.md).
- [T1](T1/T1-finalized.md), [T2](T2/T2-finalized.md), [T3](T3/T3-finalized.md), [T4](T4/T4-finalized.md), [T5](T5/T5-finalized.md) et leurs modèles sources.
- [Arbre T5 existant](../../assets/diagrammes/arbre-taches-t5.png).
- [Personas](../02-utilisateurs-personas/README.md) et [scénarios](../03-scenarios/README.md).
