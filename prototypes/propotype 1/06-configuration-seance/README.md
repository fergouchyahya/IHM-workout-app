# Configurer une séance

**État :** conception validée le 8 octobre 2026 ; écran implémenté.

## Objectif et contexte

Préparer le contenu d’un jour d’entraînement ou d’une séance seule. Référence : [T1.1.5](../../../docs/04-analyse-taches/tache.md) pour les exercices, séries, répétitions, charges, RPE et champs utiles ; [T1 Greg](../../../docs/04-analyse-taches/T1/T1-Greg.md) pour les réglages et champs de suivi ; [T2](../../../docs/04-analyse-taches/T2/T2-finalized.md) pour distinguer cibles et résultats réels.

Le brouillon de conception a été validé avant code. La réalisation de l’entraînement reste une prochaine étape.

## Entrées, sorties et organisation de l’écran

Depuis une semaine, « Configurer les exercices » ouvre la séance du jour. Une base de type Séance seule ouvre directement cet écran. En haut : retour, jour/nom, titre et explication des objectifs prévus. Puis liste ordonnée d’exercices et bouton « Ajouter un exercice ». En bas : informations à suivre et « Terminer ». Les rappels génériques ont été retirés ; les erreurs et conséquences des actions restent explicites.

Chaque carte montre le nom, les objectifs résumés et une action « Configurer les objectifs ». Les actions Monter, Descendre, Remplacer et Retirer sont accessibles sans glisser-déposer. Le déplacement dans la liste replace le focus sur l’exercice déplacé. Retirer ouvre une confirmation nommant le mouvement et la perte de ses objectifs.

## Choisir ou créer un exercice

Recherche par nom insensible aux accents et à la casse, puis menu déroulant natif des résultats. Une illustration vectorielle du mouvement sélectionné apparaît à côté, avec groupe, matériel et repère court. Les illustrations identifient les mouvements ; elles ne sont pas des démonstrations techniques. Le remplacement propose d’abord le même groupe musculaire.

« Créer un exercice » reprend le nom recherché et propose des détails facultatifs : groupe, matériel, consigne et image PNG/JPEG/WebP (500 Ko maximum). Le matériel connu est prérempli. Sans image, une silhouette neutre est utilisée. Un nom déjà présent réutilise l’exercice existant. Le mouvement personnel rejoint le menu et est conservé localement.

Ajouter ou remplacer ouvre les objectifs. Les derniers objectifs enregistrés pour ce mouvement sont repris et restent modifiables. Sans historique, aucun volume ou charge n’est inventé. Annuler laisse les objectifs inchangés ; un exercice ajouté peut rester à compléter.

## Configuration des objectifs

| Champ | Règle |
| --- | --- |
| Séries | Entier positif requis pour enregistrer les objectifs |
| Répétitions minimum / maximum | Entiers positifs ; maximum ≥ minimum ; même nombre pour une cible fixe |
| Charge cible (kg) | Facultative, positive ou nulle ; 0 = sans charge ajoutée |
| Effort visé (RPE) | Facultatif, de 1 à 10 par demi-point ; aide dans le formulaire |
| Consigne personnelle | Facultative, 500 caractères maximum |
| Réglage du matériel | Facultatif, 500 caractères maximum |

Les valeurs initiales proviennent uniquement des derniers objectifs saisis pour ce mouvement. Les réglages facultatifs sont regroupés dans un panneau dépliable pour limiter la charge visuelle. Erreurs près du champ, focus sur la première erreur, valeurs conservées. Enregistrer met à jour la carte ; fermer ou Échap laisse les objectifs précédents inchangés.

## Informations à suivre pendant l’entraînement

Charge et répétitions réelles toujours disponibles. Cases facultatives : effort ressenti par série et ressenti global final. Ce dernier est proposé au premier usage. Les derniers choix de suivi deviennent les valeurs initiales des nouvelles séances ; les séances déjà configurées conservent leurs propres choix. Sommeil, énergie/fatigue, douleur et notes sont regroupés dans « Options complémentaires ».

Ces cases configurent les futurs champs de T2 ; elles ne saisissent aucun ressenti actuel. Les choix sont conservés dès modification avec un message explicite.

## Justifications IHM

- Liste compacte et éditeur d’un exercice à la fois : conserver la vue d’ensemble sans afficher tous les champs simultanément.
- Recherche et filtres : retrouver un mouvement sans parcourir tout le catalogue.
- Unités et distinction prévu/réalisé : éviter la confusion entre programmation et historique.
- Libellés textuels, boutons d’au moins 44 px, dialogue natif et champs étiquetés : navigation tactile et clavier.
- Répétitions en deux champs, repli vertical sur petit écran : rendre la plage explicite et éviter une saisie ambiguë.
- Possibilité de conserver un brouillon partiel : reprendre la préparation sans imposer de finir immédiatement.

## Conservation et limites

Les exercices et champs de suivi appartiennent à chaque séance. Renommer un jour les conserve ; déplacer transporte le contenu ; dupliquer et répéter le cycle créent des copies indépendantes. Passer un jour contenant des exercices à Repos/À définir demande de confirmer leur retrait. Modifier la semaine de référence signale que les copies du cycle ne sont pas actualisées.

Les séances copiées depuis Découvrir conservent leur récapitulatif existant ; cet écran couvre les bases créées personnellement. Pas de démarrage, résultats, bilan, médias, dates ni adaptations individuelles des semaines du cycle. Conservation dans le stockage local du navigateur : séances, préférences de suivi, derniers objectifs, exercices personnels et formulaire de création. Aucun mot de passe enregistré. Si ce stockage est indisponible ou plein, un message indique que la conservation reste limitée à la visite.

## Organisation du code et vérification

`exercices.js` : catalogue de démonstration et chemins des illustrations SVG locales dans `images/`. `seance.js` : écran, bibliothèque et éditeur des objectifs. `styles.css` : styles propres à cette page. Le routeur commun assure l’entrée et le retour.

Vérification de syntaxe et essai court dans Chromium à 390 px : recherche par nom sans accents, menu, chargement de l’illustration, création d’un exercice personnel avec reprise du nom, réutilisation des objectifs et restauration après rechargement. Aucun débordement horizontal constaté sur l’écran de séance. Pas de suite de tests ajoutée ni dépendance installée.
