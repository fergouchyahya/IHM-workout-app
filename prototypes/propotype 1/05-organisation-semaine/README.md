# Organiser ma semaine — Prototype 1

**État :** proposition validée le 8 octobre 2026, implémentation de l’aperçu de répartition uniquement.

## Objectif et tâches

Composer une semaine lisible avec des séances nommées et des jours de repos. L’écran répond à T1.2.1 (placer séances et repos) et T1.2.4 (déplacer/copier) de [l’arbre commun](../../../docs/04-analyse-taches/tache.md). Pour Greg, la semaine de référence prépare la répétition du cycle ; pour Thomas et Mireille, les jours et actions restent explicites.

Entrées : « Créer la base » pour une semaine ou un mésocycle, ou réouverture depuis Mes entraînements. Une séance seule conserve son récapitulatif actuel.

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
