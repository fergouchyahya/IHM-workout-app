# Préparer ou adapter une séance — T1.3

**État :** évolution validée dans l’échange du 16 octobre 2026. Le parcours s’arrête à [l’écran d’entraînement T2](../08-entrainement/README.md), avant le bilan et l’analyse T3. Références : [arbre commun des tâches](../../../docs/04-analyse-taches/tache.md), [T1](../../../docs/04-analyse-taches/T1/T1-finalized.md) et [T3](../../../docs/04-analyse-taches/T3/T3-finalized.md).

## Parcours et présentation

Le calendrier ouvre un aperçu de la séance datée. Les créations et bases vides ouvrent directement l’adaptation. Chaque carte blanche affiche illustration, nom, séries, répétitions, charge cible, RPE lorsqu’il est renseigné, consigne du mouvement, consigne personnelle et réglage du matériel. Adapter rend les champs modifiables directement dans les cartes, sans fenêtre d’objectifs. Ajouter, Remplacer, Retirer et Monter/Descendre restent accessibles au clavier.

Le repère Séance prête est intégré à l’aperçu ; Commencer la séance ouvre directement T2, ou Reprendre retrouve une exécution existante. Les séries ou répétitions manquantes donnent une carte et des champs rouges, avec « À compléter ». Cela ne bloque ni l’enregistrement ni l’entrée dans T2. Charge, RPE et texte sont facultatifs ; une valeur saisie invalide reste à corriger (nombre négatif, séries fractionnaires, maximum inférieur au minimum). 0 kg signifie sans charge ajoutée.

## Adaptation et portée à l’enregistrement

Les modifications sont un brouillon séparé de la séance enregistrée. Annuler les modifications restaure celle-ci ; quitter conserve le brouillon pour retrouver la saisie à la réouverture. Ajouter et remplacer ne changent pas la séance enregistrée avant Enregistrer. Les alternatives sollicitant le même muscle sont proposées d’abord. Un remplacement commence avec des objectifs et réglages vides, même si cet exercice a déjà été utilisé.

Par défaut, l’enregistrement concerne cette date uniquement. Pour une occurrence identifiée dans un mésocycle, l’action distincte « Étendre au mésocycle… » ouvre un aperçu des dates concernées avant confirmation. Enregistrer cette séance reste une action directe. Seules les différences d’exercices sont appliquées aux occurrences ultérieures correspondantes de ce cycle planifié : les autres jours, cycles et dates passées restent conservés. Le programme enregistré ne change pas. Les cibles futures non modifiées sont préservées ; remplacer un exercice reprend les nouveaux objectifs, éventuellement vides. Les occurrences déjà commencées dans T2 et celles avec un autre brouillon de préparation sont exclues de la propagation.

Les séances seules, semaines types et anciens placements sans identité de cycle restent limités à cette séance. Aucune correspondance n’est déduite du seul nom. La préparation affiche le nom du mésocycle et la semaine ; un ancien placement apparaît comme indépendant. Replanifier le mésocycle crée les liens nécessaires. Les exercices ont une identité de position stable pour distinguer plusieurs occurrences du même mouvement. Les copies de séance ou semaine deviennent indépendantes du cycle d’origine.

Une création depuis le calendrier conserve son premier contenu dans Mes entraînements lors de l’enregistrement initial. Une adaptation ultérieure de l’occurrence ne modifie plus cet entraînement. Les préférences de suivi et objectifs globaux ne sont pas réécrits par une adaptation ponctuelle. Modifier directement une base personnelle configure cette base ; modifier une date adapte son occurrence.

## Bibliothèque et informations de suivi

Recherche sans accents ni différence de casse, liste de résultats illustrés avec groupe musculaire ; toucher un résultat le choisit directement. Créer un exercice reprend le nom recherché ; groupe, matériel, consigne et image PNG/JPEG/WebP (500 Ko maximum) sont facultatifs. Les nouveaux mouvements rejoignent la bibliothèque personnelle. Annuler la préparation ne supprime pas un mouvement explicitement créé dans cette bibliothèque.

Séries et répétitions acceptent des entiers positifs ou une valeur vide ; maximum ≥ minimum lorsqu’ils sont renseignés. Charge : positive ou nulle, facultative. RPE : de 1 à 10 par demi-point, facultatif. Consigne personnelle et réglage : 500 caractères maximum chacun. Les informations à suivre (RPE par série, ressenti final, sommeil, énergie, douleur, notes) préparent les champs de T2 ; cette évolution n’implémente que la saisie de charge, répétitions et RPE dans l’écran d’entraînement.

## Points à revoir issus de T3

Le panneau reprend T3.3.2 de l’arbre fourni : texte conservé pour la prochaine préparation, date/source, exercice, notes et réglages associés lorsqu’ils existent. Les résultats comparables, leurs limites, les records, tendances et médias relèvent de T3.1/T3.2 et restent hors périmètre. Aucun résultat ou conseil automatique n’est inventé.

Contrat d’entrée : `Parcours.state.reviewPoints` contient `id`, `workoutId` (entraînement enregistré), `exerciseId` facultatif, `text`, `createdAt`, `note` et `setting` facultatifs. Un point lié à un exercice est affiché seulement si le mouvement figure dans la séance. Sans données : « Aucun point à revoir pour cette séance ». L’interface d’analyse et de conservation des points dans T3 reste à implémenter.

## Conservation et fichiers

`seance.js` gère aperçu, adaptation, validation, portée et séance prête ; `exercices.js` reste le catalogue ; `styles.css` définit cartes, champs et états incomplets. `preparationDrafts` conserve une copie indépendante par clé de séance, y compris les saisies brutes à corriger. Ouvrir une autre séance conserve les autres brouillons. L’ancien `preparationDraft` est migré à la lecture. Aucun mot de passe n’est enregistré ; l’échec du stockage utilise le message commun.

## Vérifié

Depuis la racine du dépôt : `node tests/preparation.test.cjs`. Sept tests déterministes couvrent isolation du brouillon, sélection des dates du cycle, conservation des cibles futures et remplacement/retrait de mouvements répétés.

Dans Chromium : aperçu avec consignes/réglages et points T3 de démonstration, alternatives du même muscle, remplacement à blanc, annulation sans modification enregistrée, valeurs négatives refusées, portée date seule puis cycle, conservation des objectifs futurs non modifiés, des dates passées et des autres cycles, restauration du brouillon après rechargement, création personnelle et sauvegarde initiale, réorganisation/retrait/annulation, préparation malgré des cibles manquantes. Aperçu et adaptation contrôlés à 320, 390 et 1280 px sans débordement horizontal.

Les points T3 de vérification sont injectés uniquement dans le profil de test. L’analyse T3, le bilan et les gestes sur téléphone physique ne sont pas vérifiés dans cette évolution.

## Simplification ergonomique validée

Le contexte date/programme/semaine est compact. Sans point T3, une seule ligne reste visible ; les consignes et réglages renseignés sont immédiatement accessibles. Le choix Répétitions fixes n’affiche qu’une valeur ; Fourchette affiche minimum et maximum. Les actions groupées appliquent séries/répétitions aux seuls exercices cochés et gardent leurs charges indépendantes. Retirer un exercice propose Annuler, sans confirmation intermédiaire.

Les virgules décimales sont acceptées pour charge et effort visé (RPE). Le clavier numérique, la sélection du nombre courant et Entrée vers le champ suivant réduisent la saisie. Une valeur invalide est gardée pour correction et distinguée des objectifs simplement manquants. Les champs facultatifs vides restent ordinaires. Le retour du stockage distingue brouillon conservé et modifications appliquées ; un échec local reste visible.
