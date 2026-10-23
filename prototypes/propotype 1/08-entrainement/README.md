# Écran d’entraînement — réaliser, documenter et conserver une séance (T2)

## Repères par série pour mésocycle et semaine répétée — 22 octobre 2026

Pour ces occurrences, chaque série présente « Précédente » avec sa charge et ses répétitions réalisées, sous la date de la dernière séance correspondante. Il n’est plus nécessaire de sélectionner chaque série pour voir son résultat précédent. Les nouvelles saisies restent vides. Le réglage effectivement utilisé précédemment reste consultable lorsqu’il diffère du réglage prévu.

La référence utilise le même groupe de répétition et une seule séance terminée avant la date courante et le début de l’exécution ; elle ne mélange pas des séries de dates différentes et n’emprunte pas celles d’un autre programme comportant le même exercice. Les manques restent des tirets, les statuts particuliers restent nommés. La clé de répétition est conservée dans l’archive ; les résultats et la référence restent séparés après rechargement. Hors répétition, le rappel comparable antérieur de la série sélectionnée conserve son fonctionnement.


## État actuel — affichage selon le niveau

Débutant ou niveau absent : lignes de résultats limitées à charge et répétitions ; le ressenti global reste facultatif. RPE masqué dans les cibles, l’historique comparable, l’adaptation de série, les résultats et la correction du bilan. Les valeurs avancées déjà enregistrées sont conservées et redeviennent visibles avec un niveau compatible. Les détails sommeil/fatigue/douleur restent masqués sauf erreur existante à corriger. Une ancienne saisie brute RPE invalide peut être explicitement ignorée depuis l’entraînement, sans effacer son dernier résultat valide. Les autres règles de T2, minuteur, conservation et clôture restent inchangées.

Cette section décrit la dernière décision utilisateur ; elle remplace les règles antérieures incompatibles ci-dessous. Les contrôles sont consignés dans le [compte rendu des ajustements](../../../docs/07-evaluation/audit-ergonomie-cours5-6.md#16-ajustements-demandés-après-la-clôture--22-octobre-2026).

**État :** T2.1 à T2.4 implémentés, jusqu’à la frontière de T3, avec décisions de portée confirmées le 20 octobre 2026, depuis [l’aperçu de préparation](../06-configuration-seance/README.md). Référence : arbre T2 fourni et [synthèse T2](../../../docs/04-analyse-taches/T2/T2-finalized.md).

## Périmètre de cette étape

Un exercice à la fois avec navigation entre mouvements, illustration, consignes et réglages immédiatement visibles. Les cibles préparées sont distinguées des résultats réels. Les séries prévues donnent des lignes de saisie Charge (kg), Répétitions et RPE lorsque choisi. Si aucun nombre de séries n’est prévu, aucune série n’est inventée : Ajouter une série reste disponible. Une charge vide reste non renseignée ; une série n’est déclarée non faite que par choix explicite. 0 kg signifie sans charge ajoutée. Les valeurs invalides sont signalées, restent visibles pour correction et ne remplacent pas le dernier résultat valide.

Les saisies et la position sont conservées directement dans `Parcours.state.trainingDrafts`, par occurrence de calendrier ou séance personnelle. Quitter et reprendre retrouve le même état. Les objectifs sont copiés au démarrage et restent séparés des résultats ; modifier ensuite une préparation ne réécrit pas une exécution commencée. Les brouillons des autres dates et les résultats des autres exercices restent conservés.

La séance peut maintenant être vérifiée puis conservée par T2.4. Quitter pendant la saisie reste une sortie sans terminer ; la confirmation finale crée un bilan distinct et consultable. L’analyse des progrès, records et comparaisons est portée par [T3 dans les bilans](../09-analyse/README.md). La substitution d’exercice pendant l’effort reste hors de cette version.

## Organisation et fichiers

Retour vers la préparation ; nom/date ; sélecteur d’exercice ; consignes et cibles ; séries réelles ; Ajouter une série ; exercice précédent/suivant. `entrainement.js` gère les brouillons et interactions ; `styles.css` la présentation mobile. Les vues reprennent palette, images et composants du prototype. Le routeur commun ajoute la destination `training` ; l’écran masque la navigation principale comme la préparation.

## Vérifié

Parcours Chromium : entrée depuis une préparation incomplète, absence de séries inventées, séries prévues reprises, ajout de série, charge 0 kg, répétitions et RPE conservés, valeur invalide refusée sans écraser la dernière saisie valide, distinction Faite / Non renseignée, navigation entre exercices avec résultats indépendants, sortie/reprise et rechargement. Vérifié également depuis une copie de Découvrir. Cibles et résultats restent séparés.

Contrôle à 320, 390 et 1280 px sans débordement horizontal ; syntaxe JavaScript vérifiée. Les vérifications des étapes suivantes, dont médias et bilan, sont détaillées plus bas ; l’analyse T3 reste hors périmètre. Les gestes sur téléphone physique n’ont pas été testés.

## Simplification ergonomique validée

Le calendrier propose Reprendre sur une séance commencée. L’aperçu permet de commencer directement, sans écran Séance prête supplémentaire. Dans T2, le contexte et l’image sont compacts, le sélecteur indique Exercice X/Y et les premières saisies remontent dans la zone visible sur mobile. Les consignes et réglages restent visibles.

Une action explicite reprend le résultat de la série précédente ; aucune série future n’est renseignée automatiquement. Les virgules décimales, le clavier numérique, la sélection du nombre courant et Entrée vers le champ suivant sont pris en charge. Les saisies brutes invalides survivent à la navigation et au rechargement ; le retour de sauvegarde distingue correction attendue et stockage indisponible. Les champs focalisés sont remontés au-dessus du pied de page.

## T2.1 — décisions et interactions

| Branche | Comportement |
| --- | --- |
| T2.1.1 | Exercice X/Y et série X/Y regroupés ; la série active est repérée dans sa carte. Toucher sa légende ou saisir son résultat actualise ce repère. |
| T2.1.2 | Consigne du mouvement, consigne personnelle et réglage immédiatement visibles. Le dernier résultat enregistré pour le même exercice est associé au numéro de série actif ; absence d’historique explicite. Un réglage précédent différent est rappelé. |
| T2.1.3 | État et effort facultatifs pour toute la séance, modifiables ensuite. En forme/Fatigué/Gêne, puis Plus léger/Habituel/Plus soutenu ; aucun choix initial ni suggestion de charge automatique. Un second appui retire un choix. Contexte textuel facultatif. |
| T2.1.4 | Adapter cette série ouvre les champs dans sa carte : charge, répétitions fixes ou plage, effort visé et raison facultative. Appliquer concerne uniquement cette série, sans propagation. Cible initiale et cible adaptée restent distinctes ; résultats réels et programme sont conservés. Rétablir la cible initiale propose Annuler. |

Les adaptations sont appliquées explicitement ; Annuler ferme le formulaire sans modifier la cible. Les choix du jour et les adaptations appliquées sont conservés par exécution et après rechargement. Les champs numériques utilisent le clavier adapté, la virgule décimale et Entrée vers la saisie numérique suivante. Ouvrir une adaptation initialise uniquement ses propres champs et conserve les résultats déjà tapés, y compris une valeur à corriger.

Les repères et consignes ne nécessitent aucun panneau supplémentaire. Une adaptation demande deux actions hors saisie : Adapter puis Appliquer. Le choix du jour n’ajoute aucun écran obligatoire. L’en-tête et l’historique sont compacts ; une vérification à 390 × 844 px avec historique et cible adaptée place la première ligne numérique au-dessus de la navigation. Un contenu plus long reste défilable et un champ focalisé est remonté au-dessus du pied de page.

### Données de préparation pendant l’exécution

Dans `trainingDrafts[clé]`, `session` conserve la cible initiale ; `results` contient uniquement les résultats réels. `adaptations["exercice:série"]` conserve `load`, `minReps`, `maxReps`, `rpe`, `reason`. `dayState` contient `feeling`, `effort`, `note` pour toute la séance ; `activeSets` conserve le numéro de série actif par exercice. Les anciens brouillons sont complétés à l’ouverture sans perte de résultats ni de saisies brutes.

### Contrat du résultat précédent

`Parcours.state.completedSessions` est réservé aux séances terminées. Chaque entrée contient `id`, `status: "completed"`, `workoutId`, `date` (YYYY-MM-DD), `completedAt` (ISO), `session` (instantané des exercices et réglages) et `results` (tableaux exercice puis série). L’exécution courante conserve `startedAt` et `workoutId`.

L’affichage choisit le dernier résultat antérieur au démarrage, daté au plus tard du jour consulté, pour le même `exerciseId`. Des mouvements répétés sont distingués par `slotId` dans le même entraînement ; une correspondance ambiguë dans un autre entraînement n’est pas supposée. Seules les séries avec charge valide et répétitions positives sont montrées, sans décaler les numéros des séries manquantes. 0 kg est accepté. Une différence de contexte ne produit aucune conclusion automatique de progression.

La confirmation finale T2.4 alimente désormais ce tableau. Avant une première séance conservée, le profil affiche l’absence d’historique. Aucun brouillon n’est présenté comme une performance passée validée et aucun historique fictif n’est ajouté au profil. Les données d’historique des essais navigateur sont injectées uniquement dans le profil de test.

### Vérification de T2.1

`node tests/training-preparation.test.cjs` : sept tests sur la migration des brouillons, l’isolation cible initiale/adaptation/résultat réel, 0 kg et valeurs vides, validation numérique, rétablissement, sélection du dernier historique terminé et distinction des mouvements répétés. Les 17 tests précédents restent valides, soit 24 vérifications ciblées au total.

Dans Chromium : état global facultatif et modifiable, adaptation d’une seule série, répétitions fixes, virgules décimales, aucune propagation, annulation, rétablissement et Annuler, historique associé à la série active, résultats préservés à l’ouverture du formulaire, reprise et rechargement. Valeurs négatives et plage inversée refusées ; Entrée passe au champ suivant. Écran, état du jour et formulaire contrôlés à 320, 390 et 1280 px sans débordement horizontal. Le téléphone physique, la fin de T2 et T3 restent hors de ces essais.

## T2.2 — réaliser et consigner les séries

| Branche | Comportement livré |
| --- | --- |
| T2.2.1 | La carte et le repère de série active accompagnent la réalisation ; aucun bouton de démarrage ou de validation obligatoire n’est ajouté. |
| T2.2.2 | Charge, répétitions et RPE si choisi dans T1 ; sinon ressenti facultatif Facile/Modéré/Difficile. Saisie directe et conservation à chaque modification. |
| T2.2.3 | Cas particulier propose Faite, Interrompue ou Non faite, effort adapté et raison facultative. L’adaptation de cible T2.1 reste distincte. |
| T2.2.4 | Correction dans les champs, sans réécrire les autres séries/exercices. Une valeur invalide reste visible et ne remplace pas la dernière valeur valide. Recopie et changement de statut proposent Annuler. |
| T2.2.5 | Résultats associés à l’exercice et au numéro de série dans le brouillon local ; retrouvés après navigation, sortie/reprise et rechargement. Un échec du stockage reste signalé. |

### Statuts et absence de résultats inventés

Le chemin courant n’ajoute aucune validation : charge valide et répétitions positives affichent Faite. Une saisie partielle reste Saisie partielle ; une carte vide reste Non renseignée. Le ressenti et le RPE sont facultatifs. Les répétitions réelles acceptent zéro, pour conserver une tentative interrompue ; zéro ne déclenche jamais automatiquement Faite. Les répétitions cibles de T1/T2.1 restent des entiers positifs ou vides.

Le volet Cas particulier, replié par défaut, contient les choix explicites. Faite peut être déclarée sans valeurs : l’interface affiche alors « Faite · résultats à compléter ». Interrompue garde les résultats partiels. Non faite désactive les champs et met les anciennes valeurs de côté sans les effacer ; elles ne sont pas des résultats réalisés sous ce statut. Reprendre la saisie réactive les valeurs et leurs éventuelles erreurs brutes. Un second appui sur un statut revient au statut déduit de la saisie. Les états sont nommés, avec couleurs complémentaires.

Effort adapté pendant cette série est un repère facultatif pour un changement intervenu lors de l’effort. Il n’invente aucune nouvelle cible ni charge réelle. Une cible préparée dans T2.1 reste indiquée séparément ; la raison du cas particulier est liée à cette série.

### Recopie et correction rapides

Même résultat que série précédente recopie charge, répétitions et ressenti/RPE d’une série faite, avec valeurs complètes et valides. Une série interrompue, non faite, incomplète ou avec une erreur brute n’est pas recopiée. La cible, les raisons et l’indication d’adaptation propres à la destination restent conservées. La recopie est désactivée pour une destination Non faite : reprendre d’abord sa saisie.

Annuler restaure les valeurs, leurs chaînes brutes (dont virgules décimales), les erreurs et le statut précédents de la série concernée. Les corrections des autres séries sont préservées. La navigation avec Entrée et les claviers numériques existants restent disponibles ; les volets secondaires mémorisent leur ouverture par exercice/série.

### Données et limites

Les résultats peuvent contenir, en plus de `load`, `reps`, `rpe`, `feeling`, un `outcome` explicite (`completed`, `interrupted`, `skipped` ou `null`), `adapted` et `outcomeReason`. Sans `outcome`, l’état est calculé depuis les valeurs et leurs erreurs ; les anciens brouillons sont compatibles. `outcomeDetails` ne conserve que l’ouverture du volet. Les erreurs brutes d’une série Non faite sont archivées avec celle-ci et redeviennent actives en reprenant sa saisie.

Le bilan T2.4 conserve ces statuts et distingue réalisation et complétude des valeurs. L’affichage de résultat précédent n’utilise pas les valeurs d’une série marquée interrompue ou non faite comme référence complète. Aucun brouillon n’est ajouté à `completedSessions` par T2.2. T2.3 et T2.4 sont décrits ci-dessous ; l’analyse T3 reste à construire.

### Vérifications T2.2

`node tests/training-results.test.cjs` ajoute huit tests déterministes : statut courant sans validation, déclarations sans valeurs inventées, zéro répétition, non-réalisation/reprise avec erreur archivée, correction isolée, recopie filtrée, annulation complète et filtrage des statuts dans la référence historique. Avec les tests précédents : **32 tests ciblés réussis**.

Parcours Chromium : saisie avec ressenti puis RPE, virgules décimales, statut Faite automatique, statuts explicites, adaptation signalée, raison, non-réalisation/reprise, conservation d’une erreur brute, correction isolée, recopie/annulation, passage entre exercices, sortie/reprise et rechargement. Une indisponibilité du stockage a été simulée : alerte persistante, état en mémoire conservé et aucune annonce de sauvegarde réussie après navigation. Écrans et volets contrôlés à 320, 390 et 1280 px sans débordement horizontal. Téléphone physique non testé.

## T2.3 — enrichir la séance si utile, 21 octobre 2026

| Branche | Comportement |
| --- | --- |
| T2.3.1 | Un seul contexte général, avec sommeil, fatigue et douleur/gêne comme précisions facultatives dans Avant la séance. Tout reste facultatif et distinct des raisons par série T2.1/T2.2. |
| T2.3.2 | Remarque technique, réglage réellement utilisé et rappel par exercice. Accès rapide Notes dans l’en-tête, ou volet Notes, réglage et médias après les séries. Saisie conservée sans validation supplémentaire. |
| T2.3.3 | Ajout de photos/vidéos locales, aperçu, légende, association à l’exercice ou à une série, téléchargement, retrait et annulation. Aucun envoi ni publication automatique. |

Le sommeil accepte 0 à 24 heures par demi-heure, avec virgule décimale. Une saisie invalide reste visible après navigation/rechargement, sans écraser la dernière valeur valide. Le lien de correction rouvre le contexte et place le focus sur le champ. Fatigue (Faible/Moyenne/Forte) et douleur/gêne (Aucune/Légère/Modérée/Importante) restent des déclarations personnelles ; aucun ajustement de charge ou conseil automatique n’est produit.

Les notes, réglages et rappels acceptent 500 caractères. Ils sont associés à la position stable de l’exercice dans cette exécution, y compris pour plusieurs occurrences d’un même mouvement. Le réglage utilisé est rappelé à côté des consignes prévues, sans remplacer les réglages T1. Le résultat précédent peut afficher ce réglage réel lorsqu’il est conservé avec le bilan. Les rappels restent des notes de séance ; leur transformation en points à revoir relève de T3.

### Médias et conservation

Formats acceptés : JPEG, PNG, WebP, MP4, WebM et MOV. Limites affichées : 20 Mo par fichier, 6 médias par exercice et 60 Mo par séance. Les fichiers sont validés avant conservation. Une légende peut contenir 200 caractères ; l’association à une série reste facultative. La vidéo possède ses commandes natives et ne démarre pas automatiquement. Si le navigateur ne sait pas décoder le format, le téléchargement reste accessible.

Les références, légendes et liens sont conservés avec le brouillon dans `enrichment.exercises[slotId].media`. Les fichiers Blob sont stockés dans IndexedDB (`ihm-prototype-1-media`, magasin `media`), avec une clé distincte pour profil, exécution et média. Ils ne sont pas encodés dans le stockage texte des profils. Les URL temporaires d’aperçu sont libérées lors d’une navigation ou d’une reconstruction de la liste. Les aperçus asynchrones vérifient encore leur profil, exécution et exercice avant d’être affichés.

Le retrait supprime le fichier et sa référence ; Annuler peut restaurer les deux tant que cette action reste disponible. Si un fichier local a disparu, une indication remplace son aperçu et permet de retirer sa référence ou de l’ajouter à nouveau. Une erreur de stockage de média ne crée pas de faux aperçu et ne supprime pas les résultats de série. Les échecs de sauvegarde des références utilisent aussi l’alerte de stockage commune : conserver alors la page ouverte. Effacer les données du navigateur supprime les médias locaux ; aucun service de sauvegarde ou synchronisation n’est simulé.

Les contextes, remarques, réglages réels, rappels et médias restent exclus des instantanés publics de programme. Un média choisi reste local au profil de démonstration courant. Cette isolation est une séparation de données dans le prototype, sans authentification serveur.

### Données et prochaine étape

`enrichment` contient `context` (`sleepHours`, `fatigue`, `pain`, `adaptationReason`), `rawFields`, `errors` et `exercises`. Chaque position d’exercice conserve `note`, `setting`, `reminder`, `media` et l’ouverture de son volet. Une référence de média contient `id`, `name`, `type`, `size`, `caption`, `row` (ou `null`) et `createdAt`.

`enrichissement.js` gère ces champs et les médias ; `entrainement.js` les intègre à T2.1/T2.2. Aucun objectif prévu, résultat réel ni programme enregistré n’est réécrit par un enrichissement. Le bilan T2.4 conserve désormais ces informations et leurs références pour T3 ; la saisie d’un enrichissement ne termine pas à elle seule la séance.

### Vérification T2.3

`node tests/training-enrichment.test.cjs` ajoute huit tests : conservation des anciennes données, validation du contexte, isolation des mouvements répétés, limites des médias, clés de profil/exécution, exclusion du partage, libération des aperçus et reprise du réglage réel dans un historique terminé. Avec les tests précédents : **40 tests ciblés réussis**.

Dans Chromium : contexte avec virgule et erreur conservée, accès rapide aux notes, réglage réel distinct de T1, ajout de vrais fichiers PNG/WebM, lecture des aperçus, légende et série, retrait/annulation, changement d’exercice et rechargement avec restauration. Les fichiers non pris en charge, une indisponibilité du stockage média et un fichier manquant ont été simulés. Notes et résultats restent conservés. Écran et volets contrôlés à 320, 390 et 1280 px sans débordement horizontal. Appareil photo, codecs MOV/MP4 selon navigateur et gestes sur téléphone physique non testés.

## T2.4 — terminer et conserver le bilan, 21 octobre 2026

| Branche | Comportement livré |
| --- | --- |
| T2.4.1 | Terminer est accessible depuis chaque exercice ; Vérifier le bilan remplace Suivant au dernier exercice. La revue présente chaque série, ses valeurs, son statut, sa cible initiale et l’adaptation éventuelle. Corriger cette série ouvre directement ses champs ; Revenir au bilan retrouve la revue. |
| T2.4.2 | Ressenti global Bien/Mitigé/Difficile, note et rappel facultatifs ; choix et textes sont conservés sans validation intermédiaire. |
| T2.4.3 | Une seule confirmation finale conserve un instantané complet, retire l’exécution des brouillons et ouvre le bilan consultable. Aucun écran d’analyse T3 n’est ajouté. |

Les séries non renseignées restent distinctes des séries déclarées non faites. Le bilan indique les omissions et les séries déclarées faites avec des valeurs manquantes, puis permet de les conserver explicitement sans inventer de résultats. Marquer non faite agit sur une série depuis la revue et propose Annuler. Une valeur numérique invalide ou une erreur de contexte bloque la confirmation avec un accès ciblé au champ à corriger. Les séries non faites gardent leurs anciennes valeurs à part, sans être des performances réalisées.

### Conservation et accès au bilan

`bilan.js` crée un enregistrement dans `Parcours.state.completedSessions`, avec un identifiant propre, `executionKey` (clé d’exécution utilisée pour ses médias), `workoutId`, date, `completedAt`, `status: "completed"`, instantané de `session`, `results`, `adaptations`, `dayState`, `enrichment` et `completion`. Ce dernier contient ressenti final, note et rappel. Les cibles prévues, cibles adaptées et valeurs réellement saisies restent séparées. Les noms des mouvements, consignes et matériels sont conservés avec l’instantané ; les champs de navigation ne sont pas des données de bilan.

Les médias restent dans leur stockage local existant, avec leurs références et la même clé d’exécution. La confirmation attend la fin d’une écriture de média. En cas d’échec de sauvegarde, le bilan n’est pas annoncé comme confirmé et le brouillon en mémoire est rétabli pour réessayer. Une répétition de la confirmation ne crée pas de doublon. Les autres brouillons et les programmes sont conservés.

Une occurrence datée terminée affiche Voir le bilan au lieu de Reprendre ; sa réouverture ne démarre pas une deuxième exécution. Elle est exclue des extensions de cibles dans le mésocycle. Une séance personnelle peut être réalisée à nouveau : elle repart avec des résultats vides et conserve les bilans précédents indépendamment.

L’onglet auparavant réservé à Progrès est intitulé Bilans. Il donne une liste de bilans et leur consultation en lecture seule. Depuis le 23 octobre, [T3](../09-analyse/README.md) ajoute dans le bilan les comparaisons, records définis et points à revoir ; aucune recommandation automatique ne modifie le programme. Notes, réglages prévus/utilisés, contexte, rappels et médias restent consultables. Les performances complètes des séances terminées peuvent maintenant servir de référence dans T2.1 ; une série interrompue, non faite ou non renseignée n’est pas présentée comme une performance complète.

### Frontière de T3

T2 est couvert dans le prototype local. Les données de résultat et de contexte sont utilisées en lecture seule par [T3](../09-analyse/README.md) pour analyser, comparer et conserver volontairement un point à revoir. Un rappel du bilan reste un rappel ; il n’est pas transformé automatiquement en point T3 ni en modification du programme T1. Les bilans et médias restent privés au profil local et exclus des publications de programme.

### Vérifications de clôture

`node tests/training-completion.test.cjs` : neuf tests couvrent les compteurs et statuts, l’instantané indépendant, les omissions sans résultats inventés, le blocage des erreurs, l’échec de stockage avec reprise, l’absence de doublon, les médias en cours d’écriture et la réutilisation d’un vrai résultat antérieur. Un test de préparation supplémentaire vérifie l’exclusion des occurrences terminées de la propagation au mésocycle. Avec les tests précédents : **50 tests ciblés réussis**.

Parcours Chromium : revue et correction numérique/contexte, marquage non faite et annulation, conservation d’une série non renseignée, ressenti/note/rappel, écriture de média en attente, échec de stockage simulé puis nouvelle tentative, bilan en lecture seule avec photo conservée, accès calendrier/Bilans et restauration après rechargement. Les exécutions personnelles répétées gardent des identifiants indépendants ; la séance suivante retrouve la vraie performance et le réglage utilisé, avec des champs réels vides. Revues et bilans contrôlés à 320, 390 et 1280 px sans débordement horizontal. Tests sur téléphone physique et synchronisation hors appareil non réalisés.

## Ergonomie — premier lot Cours 5/6

Toutes les séries restent affichées. La cible commune apparaît une fois par exercice ; une adaptation garde sa cible initiale et sa cible modifiée sur sa série. Les champs réels et les actions secondaires sont rapprochés ; les mentions personnelles vides et l’absence d’historique ne prennent plus de place répétitive. La revue regroupe aussi la cible commune et conserve chaque résultat, statut, correction et exception.

Sommeil/fatigue/douleur choisis en préparation apparaissent dans le volet initial ouvert ; les autres sont accessibles dans Autres informations facultatives. Notes choisies ouvrent initialement leur volet et ressenti final choisi ouvre le bilan facultatif. Les fermetures/ouvertures explicites sont conservées ; une modification de priorité n’efface pas les données. RPE conserve son rôle de choix entre RPE et ressenti par série.

Entrée suit les champs utiles du formulaire actif, y compris Ressenti, puis soumet un formulaire terminé avec validation native. Tab et les textareas gardent leur comportement. Après une reconstruction de vue, le contrôle et le curseur sont restaurés lorsque possible ; Précédent/Suivant focalisent l’exercice. Quitter retourne au calendrier, où l’encart Séances en cours retrouve aussi les exécutions personnelles sans placement. Bilans propose le même accès aux brouillons.

Le bilan reste en lecture seule. Programmer une nouvelle séance à partir de celui-ci demande un placement indépendant, sans changer l’archive. Les vérifications du lot totalisent **56 tests ciblés** et les parcours Chromium décrits dans le [rapport](../../../docs/07-evaluation/audit-ergonomie-cours5-6.md). Sur le cas témoin 390 × 844 : premier champ 655 → 526 px, hauteur T2 2 251 → 1 803 px, revue 2 427 → 1 960 px. Ce sont des mesures de disposition, pas des temps d’usage. Aucun écran d’analyse T3 ajouté.

## Deuxième lot ergonomique — 22 octobre 2026

Les messages numériques précisent désormais le champ et ses limites ; une saisie inachevée reste conservée et bloque la clôture jusqu’à correction. La reprise après connexion au même profil restaure T2 ou la revue encore disponible, avec ses résultats. Retour/Suivant ne crée pas une étape par saisie ou par changement de série.

Un bilan ouvert depuis Bilans revient à la même liste et à sa position ; depuis Calendrier, il revient au calendrier. Le même bilan peut être restauré après rechargement. Les textes visibles n’emploient plus le code de tâche T3 et ne promettent pas une analyse inexistante. Le détail reste en lecture seule.

Les neuf suites totalisent **66 tests ciblés réussis**. Navigation, reprise, correction, retour de bilan et défilement sont vérifiés dans Chromium ; limites et preuves dans le [rapport du deuxième lot](../../../docs/07-evaluation/audit-ergonomie-cours5-6.md#12-deuxième-lot-livré--22-octobre-2026).


## Troisième lot ergonomique — 22 octobre 2026

Focus/sélection en bleu et série sélectionnée nommée ainsi restent distincts des statuts de réalisation et des erreurs. Les outils de série ont au moins 44 × 44 px. Les nombres affichés/préremplis utilisent la virgule française ; les saisies brutes sont conservées, 0 kg et vide restent distincts. L’aide précise RPE : effort ressenti de 1 à 10 ; les quantités se pluralisent sans « (s) ». Les préférences sont accessibles depuis Bilans et y reviennent. Les règles de clôture restent celles de T2.4.

Vérification : 77 tests ciblés et parcours Chromium à 320, 390 et 1280 px ; détails et limites dans l’[audit](../../../docs/07-evaluation/audit-ergonomie-cours5-6.md#13-troisième-lot-livré--22-octobre-2026).


## Quatrième lot ergonomique — 22 octobre 2026

Le bilan d’avancement par exercice distingue faites, interrompues, non faites, partielles, non renseignées et invalides. Série suivante focalise la ligne suivante sans résultat ni statut implicite. Avant la séance distingue état initial/effort prévu ; un seul texte de contexte accepte 1 000 caractères. Les anciens textes sont réunis sans répétition ; les raisons par série restent propres à leur série. Sommeil/fatigue/douleur sont des précisions dépliables ; Après la séance nomme le ressenti final.

Renseigner ou modifier le réglage utilisé ouvre directement ce champ ; Notes ouvre toujours la remarque. Les réglages prévus/précédents ne sont pas copiés automatiquement dans le réglage réel.

Les ajouts de médias affichent état par fichier, progression, réussite et Réessayer ce fichier. Un échec partiel conserve les succès sans doublon ; une référence non sauvegardée reprend le même identifiant. Les fichiers en échec restent disponibles pendant la visite ; après rechargement, les fichiers non ajoutés doivent être choisis à nouveau. Une opération complète, y compris lecture/retrait/restauration, empêche la clôture pendant son exécution. Retrait échoué conserve fichier et référence. Annuler reste visible pendant l’attente et réessayable après échec.

Terminer et conserver garde un libellé stable. Les omissions sont averties à côté du bouton, les compteurs à zéro sont masqués et les statuts restent visibles par série. Aucune série vide n’est convertie en Non faite. Les erreurs numériques restent bloquantes ; les omissions autorisées peuvent être archivées explicitement.

Vérification : 92 tests ciblés et parcours Chromium aux trois largeurs ; [preuves et limites](../../../docs/07-evaluation/audit-ergonomie-cours5-6.md#14-quatrième-lot-livré--22-octobre-2026).


## Dernier lot ergonomique — 22 octobre 2026

Charge seule · série N recopie uniquement la charge réelle précédente valide, dont 0 kg. Répétitions, effort, statut, raison et cible ne sont pas remplis ; une source Non faite ou une charge invalide est refusée. Annuler ne restaure que la charge et sa saisie/erreur : les répétitions renseignées depuis restent conservées, et une charge modifiée depuis est protégée. La complétude continue à dépendre des valeurs réelles déjà présentes.

Repos… ouvre un minuteur facultatif lié à l’exercice/série. Démarrer est explicite ; durée de 5 à 3600 secondes, préréglages, pause/reprise, réinitialisation et Fermer et arrêter. L’échéance est conservée dans l’exécution, les rafraîchissements sont libérés en quittant l’écran et le temps restant est recalculé au retour/rechargement. Aucun son, notification ni résultat créé. Le minuteur et les volets de correction ne sont pas archivés.

Corriger ici ouvre les champs réels dans la revue, autosauvegardés avec valeurs brutes et validation ; cibles et autres séries restent conservées. Compteurs, omissions et autorisation de clôture sont actualisés sans reconstruire les champs. Entrée ferme le volet, sans terminer la séance. Une saisie inachevée reste bloquante et reprise au rechargement. Ouvrir dans l’entraînement reste disponible pour les cas avancés, avec retour à la ligne exacte. Les bilans archivés restent en lecture seule.

Bilans propose recherche du nom de séance, regroupement par date et tri récentes/anciennes. Retour du détail et rechargement conservent recherche, tri et défilement. Aucun classement de performance ni analyse T3 n’est ajouté.

Vérification : 104 tests ciblés et parcours Chromium à 320, 390 et 1280 px ; [preuves, compromis et évaluations restantes](../../../docs/07-evaluation/audit-ergonomie-cours5-6.md#15-dernier-lot-livré--22-octobre-2026).
