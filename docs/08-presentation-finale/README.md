# Dossier de préparation de la présentation finale

Polytech Grenoble · projet IHM « Mon entraînement » · dossier préparé le 4 novembre 2026.

Ce dossier rassemble les éléments nécessaires pour construire la présentation : une trame proposée, les sources, les visuels, un parcours de démonstration et les points de vigilance. Il ne constitue pas encore un diaporama mis en page. La durée et le format de soutenance n’ayant pas été fournis, la proposition de 12 slides est ajustable.

## Commencer ici

| Fichier | Utilité |
| --- | --- |
| [trame-presentation.md](trame-presentation.md) | Fil conducteur, message, preuve et visuel pour chaque slide ; annexes utiles |
| [preuves-et-sources.md](preuves-et-sources.md) | Couverture des dix critères du barème et formulations défendables |
| [demonstration.md](demonstration.md) | Préparation et parcours réel à montrer, avec solution de repli |
| [visuels/](visuels/) | Huit captures actuelles, six arbres historiques et source éditable T5 corrigée |
| [sources-projet.zip](sources-projet.zip) | Instantané autonome du code, des tests, de la recherche et des documents de conception/évaluation |
| [manifest-sources.json](manifest-sources.json) | Commit source, liste des fichiers, dimensions des images et empreintes SHA-256 |
| [capturer-visuels.browser.js](capturer-visuels.browser.js) | Scénario technique utilisé pour produire les huit captures, sur un profil vierge |
| [assembler-sources.py](assembler-sources.py) | Reconstruction de l’archive et du manifeste depuis une révision Git choisie |

## Lire les sources hors du dépôt

Copier ce dossier sur une autre machine, puis extraire `sources-projet.zip` dans un dossier `sources-extraites`. L’archive conserve les chemins du dépôt ; les liens entre documents restent utilisables après extraction. Les liens vers les documents canoniques dans les Markdown de préparation sont relatifs au dépôt ; hors dépôt, retrouver leur chemin indiqué dans l’archive.

Depuis `sources-extraites`, lancer :

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Ouvrir ensuite `http://127.0.0.1:8765/prototypes/propotype%201/01-connexion/index.html`. Aucun framework ni serveur applicatif à installer. Utiliser un profil navigateur neuf pour une démonstration sans historique.

L’archive exclut ce dossier pour éviter la récursion, les métadonnées Git et les fichiers non suivis. Les PDF de cours locaux ne sont pas inclus : leurs concepts et références de diapositives sont dans l’audit, le KLM et l’UAN. Ce dossier est un instantané : après de nouvelles expériences ou modifications du prototype, actualiser les preuves et reconstruire l’archive.

## État des preuves à annoncer

- Personas fictifs, validés comme outils de conception par l’équipe ; pas de corpus d’entretiens archivé.
- Prototype et contrats vérifiés techniquement : **150 tests individuels dans 16 fichiers**, plus parcours Chromium ; chiffres liés à la révision source du manifeste.
- KLM : estimations théoriques sur ordinateur, pas des temps de participants.
- Retour qualitatif rapporté le 2 novembre : contexte méthodologique incomplet.
- Protocole expérimental prêt à piloter ; **pas de résultats expérimentaux collectés**. Aucun taux de réussite, SUS ou gain d’adoption à afficher.

L’[audit de grille](../07-evaluation/audit-final-grille.md) reste la référence pour les limites et le statut de chaque critère. La création de ce dossier ne modifie pas ce statut.

## Contrôle avant de fabriquer les slides

1. Confirmer durée, nombre d’intervenants, format et consignes de l’enseignant.
2. Choisir les messages de la trame, avec une preuve lisible par slide ; garder les tableaux exhaustifs en annexe.
3. Conserver les couleurs de l’application : bordeaux `#a51f32`, fond `#f6f5f1`, texte `#242a2b`, secondaire `#535e5c`. Ne pas utiliser uniquement la couleur pour distinguer les états.
4. Étiqueter chaque chiffre : prédiction KLM, contrôle technique ou donnée humaine réellement recueillie. Ne pas présenter une option QOC comme une variante testée si elle ne l’a pas été.
5. Rejouer la démonstration sur le matériel prévu. Les captures sont un repli, pas une preuve d’utilisation réelle.
6. Ajouter les résultats humains uniquement s’ils ont été collectés et analysés ; sinon conserver explicitement « expérimentation à réaliser ».
7. Rendre et relire le futur diaporama à sa taille de projection. Cette vérification de slides ne peut pas être déclarée faite à partir du présent dossier.

## Reconstruction

Depuis la racine du dépôt :

```sh
python3 docs/08-presentation-finale/assembler-sources.py --revision 72cee5a
```

Choisir volontairement une nouvelle révision pour actualiser les sources. Le script remplace seulement les fichiers d’archive/manifeste et les copies des diagrammes de ce dossier ; il ne réinitialise pas les données du navigateur et ne crée pas de résultats expérimentaux.

Les captures peuvent être reproduites avec Playwright CLI, depuis la racine du dépôt, après ouverture du prototype dans une session de navigateur dédiée et vierge :

```sh
playwright-cli run-code "$(cat docs/08-presentation-finale/capturer-visuels.browser.js)"
```

Cette commande rejoue et remplit uniquement le profil navigateur de travail ; ne pas utiliser le profil de démonstration destiné au public. Après une nouvelle capture, vérifier les images, actualiser `visuels/provenance.json` avec la révision réellement utilisée, puis reconstruire le manifeste. Les dimensions PNG du manifeste désignent le document complet, pas seulement le viewport.

## Contrôles effectués sur ce dossier

- Archive ZIP extraite et contrôlée : 175 fichiers sources, 425 liens locaux sans cible manquante, empreintes concordantes.
- Huit captures actuelles inspectées ; six diagrammes historiques et source T5 corrigée fournis avec leurs réserves.
- Scénario de capture exécuté jusqu’au bout : correction/reprise/bilan, RPE, trois niveaux et largeurs 320/390/768/1440 ; aucune erreur de page rapportée.
- Syntaxe du scénario JavaScript et du script Python contrôlée. Aucun diaporama ni résultat expérimental n’est déclaré vérifié par ces contrôles.
