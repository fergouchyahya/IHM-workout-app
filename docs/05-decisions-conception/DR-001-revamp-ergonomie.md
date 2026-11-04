# DR-001 — Revamp ergonomique du prototype

Date : 4 novembre 2026 · Branche : `revamp/ergonomie-interface`.

## Problème

Le prototype couvre déjà les tâches T1–T4, mais sa hiérarchie fait concurrencer création, recherche et consultation. Le calendrier commence par un panneau de création ; le même panneau repousse les résultats de Découvrir. La largeur commune limite l’usage sur ordinateur. Le fond rose généralisé et les petites informations secondaires distinguent mal contenu, action et état.

La conception s’appuie sur les [personas](../02-utilisateurs-personas/README.md), les [scénarios](../03-scenarios/README.md), l’[arbre commun T1–T5](../04-analyse-taches/tache.md), les contrats du [prototype](../../prototypes/propotype%201/README.md) et l’[audit Cours 5/6](../07-evaluation/audit-ergonomie-cours5-6.md). Thomas et Mireille ont besoin de guidage ; Camille de reprise rapide ; Greg de cibles et résultats distincts, sans perdre les fonctions avancées.

## Alternatives

1. Changer uniquement les couleurs : conserve les problèmes de priorité et d’espace.
2. Reconstruire l’application avec un framework : ajoute une migration sans nécessité pour les parcours actuels et augmente le risque de régression des brouillons.
3. Réorganiser les éléments concurrents et appliquer une présentation partagée aux écrans existants : option retenue.

## Décision et justification

| Principe IHM | Application concrète |
| --- | --- |
| Guidage, compatibilité avec la tâche | Calendrier et Mes entraînements ouvrent la navigation. La création personnelle et l’ajout au calendrier sont deux actions explicites dans l’en-tête du planning. Découvrir commence par recherche et critères, avec une action de création compacte toujours accessible en tête. |
| Charge de travail et choix (Hick-Hyman) | Retirer le grand panneau avant la recherche réduit les informations concurrentes. Les options avancées, notes et cas particuliers restent dépliables ; les choix utiles ne sont pas supprimés. Aucun gain de temps n’est présumé. |
| Proximité, similitude et groupement (Gestalt) | Cartes homogènes, libellés/unités près des champs, résultats d’une série dans un même cadre. Salutation et préférences partagent une seule ligne. |
| Acquisition de cible (Fitts) | Actions principales d’au moins 48 px de hauteur ; champs de résultats de 52 px et chiffres de 20 px. Les contrôles existants conservent leurs surfaces tactiles. À 320 px, le calendrier garde son défilement interne pour préserver les jours utilisables. |
| Lisibilité et distinction | Fond neutre, contenu blanc, texte secondaire `#535e5c`, sélection bleue. Séance rouge et repos vert gardent des libellés ; la couleur seule ne porte pas leur signification. |
| Homogénéité et repérage | Même en-tête, boutons, surfaces et navigation sur les cinq espaces. Le détail d’un bilan conserve Bilans actif. |
| Contrôle et prévention des erreurs | Conservation des confirmations, annulations et règles de validation existantes. Vide et zéro restent distincts ; aucune cible ne devient automatiquement un résultat. L’accès clavier au contenu ne modifie pas l’historique des routes. |
| Adaptabilité | Cartes en deux colonnes dès 760 px, saisie en une colonne. Connexion en deux colonnes au-delà de 760 px ; accès sans compte avant le formulaire dans l’ordre du document. Réduction du mouvement respectée. |

`commun/revamp.css` porte la présentation transversale, après les feuilles existantes ; `data-view` limite les variations de largeur aux écrans concernés. Aucun changement de schéma de stockage ni dépendance supplémentaire.

Les références W3C précisent les exigences de [contraste du texte](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) et de [taille des cibles](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html). Les couleurs communes calculées donnent : texte secondaire sur fond 6,16:1 ; blanc sur action principale 7,39:1 ; texte de sélection sur fond bleu 6,22:1 ; bordure commune sur blanc 3,12:1. Ces vérifications ponctuelles ne constituent pas un audit WCAG complet.

## Vérification technique

- Les seize suites Node existantes passent : **147 tests**, couvrant conservation, profils, préparation, calendrier, saisie, clôture, partage et analyse.
- Chromium : création d’une séance personnelle, choix d’un exercice, cibles explicites (1 série, 8 répétitions, 0 kg), enregistrement, démarrage, saisie réelle, rechargement et retour au même profil, vérification et enregistrement du bilan avec note. Résultats et note conservés.
- Les cinq espaces principaux ont été ouverts à **320, 390, 768 et 1440 px** : pas de débordement horizontal du document, repère de navigation actif correct et marge inférieure au moins égale à la hauteur du dock.
- Clavier : Aller au contenu place le focus dans le contenu sans changer de route ; la flèche droite du calendrier sélectionne le jour suivant. Connexion vide : deux erreurs locales et focus sur le premier champ. Accès sans compte visible aux quatre largeurs. Console du navigateur sans erreur pendant les parcours contrôlés.
- Captures de contrôle dans `output/playwright/revamp-*.png` ; elles utilisent exclusivement des données de démonstration. Le [calendrier mobile](../../output/playwright/revamp-calendar-mobile.png) et la [saisie en séance](../../output/playwright/revamp-training-mobile.png) illustrent la hiérarchie.

## Risques et éléments à valider

Ces choix sont des hypothèses de facilité d’usage. Aucun temps de réalisation, taux d’erreur ni score utilisateur n’a été mesuré. L’identification des deux actions de l’en-tête du calendrier demande un essai avec un nouveau pratiquant ; la création reste aussi accessible en tête de Découvrir et Mes entraînements.

Prévoir des essais avec les profils Thomas/Mireille et Camille/Greg : retrouver le jour, préparer, corriger une série, terminer puis retrouver le bilan. Tester sur téléphone physique, avec clavier virtuel et lecteur d’écran. Les 20 combinaisons écran/largeur ne couvrent pas toutes les variantes des formulaires avancés, les médias ou les anciennes archives. Authentification et partage restent des simulations locales.

## Adaptation au retour utilisateur illustré

- Navigation : Créer ma séance remonte dans l’en-tête du calendrier ; le panneau de création placé après le planning est retiré. Les deux intentions, créer et ajouter au calendrier, restent distinctes.
- Interactions : conservation du retrait de focus sur un champ numérique lors du défilement pour empêcher la molette de changer ses répétitions.
- Recherche : conservation de la normalisation des espaces, accents et casse ; une régression supplémentaire couvre Découvrir, Mes entraînements et Bilans avec espaces finaux et répétés.
- Fin de séance : Vérifier et terminer… ouvre une vérification nommée ; deux repères montrent la vérification puis le bilan conservé. La confirmation finale conserve son libellé explicite ; le bilan terminé affiche une confirmation avec texte et coche.

Contrôle Chromium de cette adaptation : création visible à 320, 390 et 1440 px sans débordement ; résultats identiques pour « Premiers pas » et « Premiers pas » suivi d’un espace ; molette réelle sur Répétitions focalisé, valeur 8 conservée ; création, préparation, entraînement, vérification, confirmation et bilan parcourus avec les boutons de l’interface. Captures : `output/playwright/feedback-revamp-{calendar,review,summary}.png`. Le cache du navigateur a été désactivé pour charger tous les modules modifiés.
