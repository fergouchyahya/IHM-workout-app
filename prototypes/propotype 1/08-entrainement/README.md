# Écran d’entraînement — entrée dans T2

**État :** écran d’arrivée autorisé dans l’échange du 16 octobre 2026, depuis [l’aperçu de préparation](../06-configuration-seance/README.md). Référence : arbre T2 fourni et [synthèse T2](../../../docs/04-analyse-taches/T2/T2-finalized.md).

## Périmètre de cette étape

Un exercice à la fois avec navigation entre mouvements, illustration, consignes et réglages immédiatement visibles. Les cibles préparées sont distinguées des résultats réels. Les séries prévues donnent des lignes de saisie Charge (kg), Répétitions et RPE lorsque choisi. Si aucun nombre de séries n’est prévu, aucune série n’est inventée : Ajouter une série reste disponible. Une charge vide laisse la série non faite ; 0 kg signifie sans charge ajoutée. Les valeurs invalides sont signalées, restent visibles pour correction et ne remplacent pas le dernier résultat valide.

Les saisies et la position sont conservées directement dans `Parcours.state.trainingDrafts`, par occurrence de calendrier ou séance personnelle. Quitter et reprendre retrouve le même état. Les objectifs sont copiés au démarrage et restent séparés des résultats ; modifier ensuite une préparation ne réécrit pas une exécution commencée. Les brouillons des autres dates et les résultats des autres exercices restent conservés.

L’évolution s’arrête à cet écran : pas de confirmation finale, bilan conservé, records, analyse T3, minuteur, téléversement de médias ou adaptation pendant l’effort. Ces branches de l’arbre T2 restent à concevoir. Quitter conserve la saisie et retourne à l’aperçu de préparation ; cela ne termine pas la séance. Les saisies ne sont pas présentées comme un historique validé.

## Organisation et fichiers

Retour vers la préparation ; nom/date ; sélecteur d’exercice ; consignes et cibles ; séries réelles ; Ajouter une série ; exercice précédent/suivant. `entrainement.js` gère les brouillons et interactions ; `styles.css` la présentation mobile. Les vues reprennent palette, images et composants du prototype. Le routeur commun ajoute la destination `training` ; l’écran masque la navigation principale comme la préparation.

## Vérifié

Parcours Chromium : entrée depuis une préparation incomplète, absence de séries inventées, séries prévues reprises, ajout de série, charge 0 kg, répétitions et RPE conservés, valeur invalide refusée sans écraser la dernière saisie valide, distinction Faite / Non renseignée, navigation entre exercices avec résultats indépendants, sortie/reprise et rechargement. Vérifié également depuis une copie de Découvrir. Cibles et résultats restent séparés.

Contrôle à 320, 390 et 1280 px sans débordement horizontal ; syntaxe JavaScript vérifiée. La fin de séance, le bilan, les médias et l’analyse T3 restent hors périmètre. Les gestes sur téléphone physique n’ont pas été testés.

## Simplification ergonomique validée

Le calendrier propose Reprendre sur une séance commencée. L’aperçu permet de commencer directement, sans écran Séance prête supplémentaire. Dans T2, le contexte et l’image sont compacts, le sélecteur indique Exercice X/Y et les premières saisies remontent dans la zone visible sur mobile. Les consignes et réglages restent visibles.

Une action explicite reprend le résultat de la série précédente ; aucune série future n’est renseignée automatiquement. Les virgules décimales, le clavier numérique, la sélection du nombre courant et Entrée vers le champ suivant sont pris en charge. Les saisies brutes invalides survivent à la navigation et au rechargement ; le retour de sauvegarde distingue correction attendue et stockage indisponible. Les champs focalisés sont remontés au-dessus du pied de page.
