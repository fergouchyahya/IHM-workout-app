# Squelette global de l'application

**Responsable :** Marie · **État :** proposition à valider par l'équipe · **Prototype :** `prototype-global.html`

## 1. Objectif

Fournir une base commune pour que chaque tâche (T1 à T5) soit prototypée dans la même application, avec la même navigation et les mêmes conventions. Le cours demande une cohérence d'ensemble (« look and feel », critère d'homogénéité) : sans base commune, chaque tâche aurait son propre style.

Le squelette est construit uniquement sur l'arbre de la réunion du 18 septembre (niveaux T1 à T5 et leurs sous-tâches). Il ne dépend pas des arbres détaillés par persona : il sera complété quand ils seront prêts. `prototype-global.html` remplace `prototype-T4.html`, dont le parcours est repris tel quel.

## 2. Interface abstraite globale

| Tâche | Responsable | Espace dans l'application |
| --- | --- | --- |
| T1 Préparer et organiser | Matthieu | Onglet **Programmes** |
| T1.1 Importer un programme d'autres utilisateurs | Matthieu | Onglet **Communauté**, section « Découvrir » |
| T2 Réaliser et documenter | Yahya | Onglet **Séance** |
| T3 Analyser et évaluer | Yahya | Onglet **Progrès** |
| T4.1 à T4.3 Partager un programme | Marie | Parcours en 3 étapes, lancé depuis un programme (onglet Programmes) |
| T4.4 Suivre ce qu'on a partagé | Marie | Onglet **Communauté**, section « Mes partages » |
| T5.1 Accéder rapidement à une page | Sami | Barre du haut : bouton de recherche |
| T5.2 Synchroniser les données | Sami | Barre du haut : état de la synchronisation |

**Lien avec le cours.** T1, T2 et T3 se suivent dans le temps (avant, pendant, après la séance), mais l'utilisateur doit pouvoir aller de l'un à l'autre à tout moment. Pour des tâches sans ordre, le cours ajoute un espace qui donne accès à chacune : ici, la barre d'onglets. Les tâches transverses (T5) sont placées dans la barre du haut pour être présentes dans tous les écrans.

## 3. Conventions communes

1. **Navigation :** quatre onglets en bas (Programmes, Séance, Progrès, Communauté). La recherche (T5.1) et l'état de synchronisation (T5.2) restent en haut.
2. **Parcours en plusieurs étapes :** onglets masqués, indicateur « Étape x sur n », Retour à gauche, action principale à droite.
3. **Boutons :** un seul bouton principal (bleu) par écran. Les actions destructrices sont en rouge.
4. **Verbes :** le verbe du bouton est repris dans la confirmation (Publier, puis « Programme publié »).
5. **Vocabulaire :** programme = séance ou bloc ; « retirer » un contenu partagé ; « partager » ou « publier » selon la visibilité.
6. **Niveaux :** pastille de couleur et texte (vert Débutant, jaune Intermédiaire, rouge Avancé), jamais la couleur seule.
7. **Actions irréversibles ou visibles par d'autres :** feuille de confirmation qui explique la conséquence.
8. **Accessibilité :** cibles tactiles d'au moins 44 px, textes en phrases, pas de majuscules.

## 4. Comment brancher sa tâche

Chaque espace en pointillés dans le prototype est réservé à une tâche. Pour le remplacer :

1. Dans le fichier, repérer la vue de l'onglet (`seance`, `progres`, `programmes`, `decouvrir`) et remplacer le bloc `placeholder(...)` par les écrans de la tâche.
2. Adapter l'entrée correspondante de `NOTES` : tâches couvertes, critères ergonomiques, questions pour l'équipe.
3. Respecter les conventions de la section 3.
4. Pour un parcours en étapes, suivre le modèle de T4 : écrans `check`, `form`, `preview`, onglets masqués pendant le parcours.
5. Tester avec les trois personas (sélecteur « Voir comme »).

**Limite :** si quatre personnes modifient le même fichier HTML dans Git, il y aura des conflits. Dans ce cas, je peux séparer le prototype en un fichier par tâche, plus un fichier commun pour le style et la navigation.

## 5. Hypothèses ajoutées au modèle T4

- **Hors ligne :** une publication faite sans réseau est mise en attente, son état est visible (« En attente de connexion »), puis elle est envoyée au retour du réseau. Cela répond au cas ouvert de T4-Camille (connexion faible) et demande l'avis de Sami (T5.2).
- **Retirer :** nom retenu pour supprimer un contenu partagé, avec explication de ce qui arrive aux copies déjà importées.
- **Visibilité par défaut :** « Tout le monde », car c'est le sens de « communauté ».

## 6. Questions ouvertes

1. Où l'utilisateur démarre-t-il une séance : depuis Programmes ou depuis l'onglet Séance ?
2. Où importe-t-on un programme : section « Découvrir » ou bibliothèque de l'onglet Programmes ?
3. Le bouton « Partager » reste-t-il sur chaque programme ?
4. Les contacts (choix « Mes contacts ») relèvent de qui ?
5. Quatre onglets suffisent-ils quand T1 à T5 seront complets ?
