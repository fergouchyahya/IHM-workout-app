# Groupe 6 — présentation finale

Présentation française en HTML/CSS/JavaScript : **17 slides principales et 27 annexes**, palette crème, bleu nuit, violet et corail, format 16:9. Le fil conducteur est **Thomas**. Les informations nécessaires sont dans les slides et annexes ; aucun lien Git ni pied de page de sources n'est affiché.

- [Présentation interactive](index.html) · [PDF G6.pdf](../../output/pdf/G6.pdf).
- [Réunion de finalisation](../../reunions/2026-11-05-finalisation-soutenance.md).
- [Registre et audit](preuves-et-sources.md) · [Précisions du groupe sur les personnes et tests](retours-et-participants.md).
- [Démonstration de Thomas](demonstration.md) · [Aperçu](../../output/pdf/G6-apercu.png) · [Vérification](verification.json).
- [Script oral en points clés](script-oral.md) : chaque slide, annexes associées et appréciation de la couverture de la grille. Les mêmes repères s'affichent avec **N** dans la présentation.

## Ouvrir et présenter

À la racine du dépôt :

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Ouvrir `http://127.0.0.1:8765/docs/08-presentation-finale/`. Les slides seules fonctionnent aussi par ouverture directe de `index.html` ; servir par HTTP pour essayer l'application.

- Flèches, Page Up/Down, Espace : naviguer.
- **O** : sommaire ; **A** : annexes / retour ; **N** : notes ; **F** : plein écran.
- Home / End : introduction / conclusion. L'avance principale s'arrête à la conclusion.
- Cliquer une image pour l'agrandir. **Zoom / ajuster** ouvre les PNG à leur résolution native avec défilement ; Échap ferme le détail.

Les images des arbres viennent de `assets/diagrammes/` ; leurs pieds de page documentaires ont été retirés lorsqu'ils étaient présents. Toutes les branches restent entières ; A24–A27 donnent les gros plans T2.1–T2.4 lisibles dans le PDF. Le fil de fer est extrait de la page 8 du PDF `Training App-1.pdf` fourni par le groupe.

Budget : **13 min 35 de contenu**, dont 90 s pour une démonstration ou un extrait vidéo, et **1 min 25 de réserve**. Ce budget doit être répété par les intervenants.

## Film T1 / T2

Les slides de tests et de démonstration proposent **Voir le test filmé T1 / T2**. Au premier clic, choisir la vidéo sur l'ordinateur ; elle s'ouvre dans un lecteur local avec pause, déplacement et volume. Elle n'est pas envoyée sur un service externe. Les clics suivants rouvrent la même vidéo pendant cette visite ; un rechargement demande de la choisir à nouveau.

Le fichier d'enregistrement n'a pas été remis dans le dossier : le chemin communiqué pour la vidéo était celui de l'arbre T2 en PNG. Le sélecteur est donc prêt à recevoir le bon fichier. Aucun faux enregistrement humain n'est inclus. Le contrôle technique du lecteur utilise seulement un clip généré temporaire, absent du livrable.

La vidéo ne se lit pas dans un PDF. Le PDF conserve les captures et la description du parcours filmé. Préparer l'extrait avant l'oral et choisir **soit** l'extrait, **soit** la démonstration complète pour tenir le temps.

## Modifier et exporter

`slides.js` porte le contenu, les durées et les notes ; `presentation.css` la mise en page et l'impression ; `presentation.js` les commandes, zooms et lecture locale du film. Les noms de sources dans les métadonnées servent au registre documentaire, sans être affichés dans les slides.

Après modification, régénérer `G6.pdf`. Dans Chromium : **PDF / imprimer**, toutes les pages, marges nulles, arrière-plans activés, en-têtes et pieds de page du navigateur désactivés. Les styles `@page` fixent le format et impriment toutes les slides, même si une seule est affichée à l'écran.

Avec Playwright CLI et Chromium disponibles dans l'environnement de contrôle, ouvrir une session dédiée puis, depuis la racine :

```sh
playwright-cli -s=g6 open http://127.0.0.1:8765/docs/08-presentation-finale/
playwright-cli -s=g6 run-code "$(cat docs/08-presentation-finale/verifier-exporter.browser.js)"
```

Le contrôle vérifie les 44 slides, les images, les liens internes, l'absence de liens externes et de sources en pied de page, la navigation, les annexes, les zooms, les contrôles vidéo et la géométrie. Il exporte `output/pdf/G6.pdf`. Inspecter ensuite le rendu des pages avec `pdftoppm`.

## Captures et faits rapportés

Les captures de démonstration de Thomas sont faites en mode Débutant, avec charge et répétitions sans RPE. Elles couvrent Entrée, recopie, annulation protégée, correction, reprise/recharge et une archive unique sur l'ancienne et l'actuelle interface. Les révisions et empreintes sont conservées dans `visuels/provenance.json`, sans apparaître à l'oral.

Les informations humaines de la présentation viennent des précisions du groupe du 5 novembre : noms anonymisés, échanges après le fil de fer puis les prototypes, une participante filmée sur T1/T2, un autre test complet sans film et des retours similaires. La dernière version n'a pas eu de nouvelle vérification humaine. Le KLM et les essais automatisés ne sont pas les temps des participants.

L'email n'est pas envoyé par la génération du livrable. La réunion comprend la vérification du PDF, le choix de l'extrait et la confirmation d'envoi de **G6.pdf avant 20 h Paris**.
