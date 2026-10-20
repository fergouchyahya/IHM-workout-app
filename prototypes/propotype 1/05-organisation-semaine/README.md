# Organiser ma semaine — Prototype 1

**État :** proposition validée le 8 octobre 2026, implémentation de l’aperçu de répartition uniquement.

## Objectif et tâches

Composer une semaine lisible avec des séances nommées et des jours de repos. L’écran répond à T1.2.1 (placer séances et repos) et T1.2.4 (déplacer/copier) de [l’arbre commun](../../../docs/04-analyse-taches/tache.md). Pour Greg, la semaine de référence prépare la répétition du cycle ; pour Thomas et Mireille, les jours et actions restent explicites.

Entrées : « Créer le programme » pour une semaine ou un mésocycle, ou réouverture depuis Mes entraînements. Une séance seule conserve son récapitulatif actuel.

## Composition et décisions IHM

1. Retour « Mes entraînements », nom et titre « Organiser ma semaine ».
2. Aide courte : séances nommées et repos uniquement, exercices à une étape ultérieure.
3. Résumé du nombre de séances, repos et jours à définir ; fréquence initiale comme repère facultatif.
4. Sept cartes verticales, lundi à dimanche. Chaque carte est un bouton avec jour, contenu et action « Configurer » ou « Modifier ».
5. Pour un mésocycle : action explicite pour reproduire la semaine sur sa durée, puis état de cette répétition.
6. Retour principal « Terminer » ; état de brouillon conservé ; contenu des séances accessible depuis chaque jour d’entraînement.

La liste verticale évite un calendrier miniature difficile à lire sur mobile. Les états utilisent des mots et des bordures, pas uniquement des couleurs. Cibles tactiles de 44 px minimum, focus visible, champs étiquetés et messages près de la saisie. Une boîte de dialogue native concentre la configuration d’un jour et permet l’annulation au clavier.

## Actions et conservation

| Action | Effet |
| --- | --- |
| Configurer un jour | Choisir Séance, Repos ou À définir ; aucun repos implicite |
| Choisir une catégorie | Préremplir un nom modifiable ; aucune fréquence ni placement imposé |
| Enregistrer | Conserver le jour et actualiser le résumé |
| Déplacer / Dupliquer une séance | Choisir le jour de destination ; remplacement d’un contenu existant explicitement confirmé |
| Déplacer | Le jour d’origine devient À définir |
| Dupliquer | Créer une séance indépendante, avec le même nom |
| Annuler / Échap | Fermer sans appliquer la saisie du dialogue |
| Terminer | Retrouver la répartition depuis Mes entraînements dans ce navigateur |
| Répéter sur le cycle | Copier la semaine de référence sur toutes les semaines ; une nouvelle répétition demande confirmation si elle remplace la précédente |

Une modification de la semaine de référence ne change pas les copies déjà répétées. Un message signale qu’une nouvelle répétition est nécessaire. Les adaptations individuelles des semaines seront conçues ultérieurement.

## États et limites

Au départ : sept jours À définir. Nom de séance obligatoire lorsque Séance est choisi ; erreur locale avec focus sur le champ. Un décalage entre fréquence prévue et séances placées est un repère, pas une erreur bloquante. Le brouillon peut rester partiel.

Le bouton « Configurer les exercices » ouvre désormais [l’écran de configuration de séance](../06-configuration-seance/README.md), dans un dossier distinct. Renommer conserve le contenu ; déplacer le transporte ; dupliquer en crée une copie indépendante. Passer à Repos/À définir demande confirmation si des exercices sont présents. Pas de résultats, recommandations de récupération ou démarrage de séance dans cet écran. Les semaines sont des structures sans dates. La répartition et le contenu des séances sont conservés dans le stockage local du navigateur.

## Vérification de base

Syntaxe JavaScript et essai court : configurer séance/repos, déplacer/copier avec remplacement explicite, revenir et rouvrir, répéter un mésocycle. Contrôle mobile et clavier si le navigateur est disponible. Pas de campagne de tests approfondie pour cette étape.

## Évolution validée — calendrier daté

Choix confirmés dans l’échange : le calendrier devient l’accueil de Mes entraînements, avec vues Mois et Semaine, dates réelles, navigation et retour à aujourd’hui. En vue Semaine mobile, un bandeau de sept dates sélectionne le jour dont les cartes complètes apparaissent dessous. La vue Mois montre un repère de séance et le nombre de séances supplémentaires ; les noms complets sont dans les détails du jour sélectionné. Les séances sont rouges et le repos vert, avec libellés explicites ; les jours vides restent vides.

Sous le calendrier, une liste repliable regroupe les entraînements enregistrés et les favoris. Choisir un jour propose une séance enregistrée, une création ou un repos. Plusieurs séances sont possibles le même jour. Créer depuis un jour reprend sa date ; créer depuis la liste conserve une séance non planifiée. Seuls les entraînements enregistrés sont proposés par le sélecteur.

Un appui sur une séance ouvre son aperçu détaillé ; Adapter active les champs dans les cartes. Chaque occurrence contient une copie indépendante. L’enregistrement concerne cette date ; les mésocycles identifiés proposent aussi les prochaines occurrences du même type dans le même cycle. Déplacer par glisser-déposer est complété par un formulaire Déplacer / Dupliquer utilisable au clavier et sur écran tactile. Retirer une occurrence conserve l’entraînement enregistré.

Planifier une semaine ou un mésocycle demande le lundi de départ. Le cycle reprend automatiquement son nombre de semaines et sa répartition (ou les semaines déjà configurées). Les jours À définir ne génèrent rien. On peut aussi copier ou déplacer une semaine datée ; copier permet plusieurs répétitions. Chaque copie reste indépendante. Un repos ne remplace jamais silencieusement des séances : un remplacement de repos par séance demande une confirmation dans le panneau courant. Remplacer des séances par un repos reste explicite.

Le calendrier est conservé localement avec le reste du prototype. Les placements historiques sans dates restent visibles dans la liste repliable pour être planifiés explicitement. La préparation rejoint désormais l’écran T2, dont les saisies restent séparées des cibles ; le bilan et les résultats validés restent hors périmètre.

Vérification du calendrier : syntaxe JavaScript ; parcours Chromium (création depuis une date, création non planifiée depuis la liste, ajout depuis Découvrir et les entraînements enregistrés, objectifs indépendants, duplication, glisser-déposer, repos et conflits, retrait/annulation, cycle de trois semaines, copie répétée et déplacement de semaine, restauration après rechargement). Les vues Mois et Semaine ont été contrôlées à 320, 390 et 1280 px sans débordement horizontal. Gestionnaires tactiles vérifiés par événements simulés ; geste sur téléphone physique non vérifié.

## Lien avec T1.3 et l’entrée dans T2

Les nouveaux mésocycles planifiés reçoivent un `cycleId` propre à chaque placement, un `templateDay`, une date de début et de fin. Ces repères permettent d’étendre une adaptation aux seules dates correspondantes encore à venir. La préparation indique le nom du cycle et la semaine. Les anciennes occurrences sans ces repères sont conservées comme placements indépendants, sans regroupement supposé ; replanifier un mésocycle crée les liens nécessaires. Copier une séance ou une semaine crée des occurrences indépendantes ; déplacer hors des bornes du cycle détache le placement.

Les brouillons de préparation et d’exécution n’écrasent pas les objectifs d’autres dates. Les séances déjà commencées dans T2 et les dates avec un autre brouillon de préparation sont exclues de la propagation. Le détail de la sauvegarde et des différences conservées se trouve dans [Préparer ou adapter une séance](../06-configuration-seance/README.md).

## Simplification ergonomique validée

Le panneau d’ajout réunit recherche des entraînements enregistrés, création et repos. Choisir une séance seule l’ajoute directement au jour choisi ; les programmes conservent leurs réglages de planification. « Placer sur plusieurs jours » duplique explicitement une séance sur les dates cochées de la semaine. Les placements gardent des objectifs indépendants.

Les ajouts, repos, déplacements et duplications ponctuels proposent Annuler ; les opérations de remplacement et de bloc restent explicites. Une occurrence commencée affiche Reprendre directement dans l’agenda. Le profil retrouve vue Mois/Semaine, date sélectionnée, état de la liste, recherche et position de défilement. Le glisser-déposer garde son alternative Déplacer / Dupliquer au clavier ou au toucher.
