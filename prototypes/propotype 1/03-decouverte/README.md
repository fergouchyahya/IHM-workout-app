# Page d’arrivée — Découvrir, débutant et intermédiaire

## État actuel — allègement des textes

Recherche, filtres, tri, cartes et bibliothèques gardent leur fonctionnement. Les textes Selon tes filtres, explication du tri, introduction des programmes et Bibliothèque de départ dans les cartes de séances sont retirés. Les repères Favori, Déjà enregistré et auteur communautaire restent visibles. Les aperçus de cibles masquent le RPE au débutant ; les données importées sont conservées.

Cette section décrit la dernière décision utilisateur ; elle remplace les règles antérieures incompatibles ci-dessous. Les contrôles sont consignés dans le [compte rendu des ajustements](../../../docs/07-evaluation/audit-ergonomie-cours5-6.md#16-ajustements-demandés-après-la-clôture--22-octobre-2026).

**Date :** 2026-10-03 · **Responsables :** Yahya et Marie<br>
**État :** documentation validée ; page implémentée et vérifiée.

## 1. Objectif et utilisateurs

Aider Thomas, débutant, à choisir une **séance complète** parmi des suggestions lisibles, puis à consulter son récapitulatif et la conserver pour plus tard. La même page sert au niveau intermédiaire, avec des suggestions et filtres adaptés aux réponses. Sans niveau renseigné, elle présente la bibliothèque générale de départ.

Cette page correspond à T1.1.3, choisir un programme prédéfini, et T5.1, rechercher et consulter. Ajouter à une semaine relève de T1.2.1 ; conserver une copie prépare T1.3. Les [besoins de Thomas](../../../docs/02-utilisateurs-personas/persona-thomas.md) motivent les repères simples ; l’[arbre commun](../../../docs/04-analyse-taches/tache.md) distingue choix, planification et réalisation.

## 2. Choix confirmés

- Niveau Débutant ou Intermédiaire → arrivée dans Découvrir.
- Niveau Avancé → arrivée dans [Mes entraînements](../04-mes-entrainements/README.md).
- Aucun niveau renseigné → arrivée dans les suggestions de Découvrir.
- Séances complètes, pas sélection d’un exercice individuel sur cette page.
- Liste défilante, avec filtres niveau, groupe musculaire, matériel et durée ; recherche par nom.
- Prévoir des listes d’options extensibles, dont les bases sont proposées plus bas.
- Appui sur une séance → récapitulatif ; **aucun bouton Commencer ni démarrage immédiat** sur la liste ou ce récapitulatif.
- Possibilité de conserver une séance dans la semaine ou les favoris.
- Navigation : Découvrir / Calendrier / Partages / Bilans ; Mes entraînements est la liste personnelle sous le calendrier.
- Bibliothèque de départ et communauté restent accessibles séparément ; séances courtes prioritaires.

Les libellés précis, dispositions et comportements détaillés ci-dessous sont des propositions de maquette à relire, pas une évaluation utilisateur déjà effectuée.

## 3. Entrée et données utilisées

Après la dernière question ou « Passer le reste », utiliser le niveau **déjà renseigné**, même si le reste des questions a été passé. Une réponse absente n’est pas remplacée par un niveau supposé.

| Donnée reçue | Utilisation |
| --- | --- |
| Nom d’affichage | Salutation courte facultative en haut ; jamais l’e-mail complet |
| Niveau | Filtre présélectionné s’il est renseigné ; Débutant et Intermédiaire partagent cette page |
| Objectif | Repère conservé dans le profil ; aucun filtrage/classement sportif par objectif dans cette version |
| Matériel | Filtre présélectionné s’il est renseigné |
| Groupe musculaire et durée | Aucune valeur imposée à l’arrivée ; réglages disponibles dans les filtres |

Les filtres restent modifiables. Le niveau décide de l’arrivée, pas d’une restriction : tout utilisateur peut consulter les autres onglets et explorer la bibliothèque. [Le parcours des questions](../02-questions-rapides/README.md) conserve les réponses partielles.

## 4. Composition de la page

De haut en bas :

1. En-tête compact : titre « Découvrir », éventuellement « Bonjour {nom} » en ligne secondaire. Pas de grand visuel.
2. Champ « Rechercher une séance ou un programme », avec exemple « Full Body, jambes… ».
3. Action « Filtres », avec nombre de filtres actifs ; repères actifs visibles sous forme de petites étiquettes retirables.
4. Choix « Pour commencer » / « Communauté », reprenant les deux bibliothèques séparées.
5. Titre « Selon tes filtres » si des repères existent ; « Séances pour commencer » sinon, suivi d’une courte indication « Les plus courtes en premier ».
6. Liste verticale de cartes de séances, défilante, puis nombre de résultats.
7. Barre des trois onglets, avec Découvrir actif.

Contrairement aux trois questions, cette page assume un défilement vertical pour parcourir plusieurs séances. La navigation du bas reste accessible ; ajouter assez d’espace après la dernière carte pour qu’elle ne soit pas cachée. Éviter d’empiler de grandes sections de suggestions qui répètent les mêmes séances.

## 5. Recherche et filtres

La recherche concerne le nom de la **séance ou du programme**, pas le nom d’un exercice. Elle s’applique à la bibliothèque courante avec les filtres actifs. Les filtres de catégories différentes se combinent ; une séance doit satisfaire les choix renseignés.

Le bouton Filtres ouvre un panneau avec les quatre catégories. Proposition : sélection unique par catégorie pour cette première version, avec option « Tous » pour enlever la contrainte. Les changements actualisent les résultats sans bouton de confirmation supplémentaire. Fermer le panneau conserve les réglages ; « Effacer les filtres » retire les contraintes, sans modifier les réponses du questionnaire.

La bibliothèque de départ et la communauté partagent les mêmes filtres ; changer de section ne vide pas la recherche. Si aucun résultat ne correspond, proposer d’élargir les filtres ; ne pas afficher des séances incompatibles comme si elles correspondaient.

### Listes initiales proposées

| Filtre | Options de base | Règle |
| --- | --- | --- |
| Niveau | Tous / Débutant / Intermédiaire / Avancé | Présélection du niveau connu, sinon Tous |
| Groupe musculaire ou zone | Toutes / Corps entier / Haut du corps / Jambes / Pectoraux / Dos / Épaules / Bras / Abdominaux | Catégories lisibles ; pas de présélection |
| Matériel | Tout / Salle équipée / Haltères à la maison / Sans matériel | Reprend les catégories du questionnaire |
| Durée maximum | Toutes / 20 min / 30 min / 45 min / 60 min | Valeur maximum explicite ; pas de question supplémentaire au démarrage |

Une séance peut avoir plusieurs groupes musculaires et équipements. Les résultats doivent suivre les métadonnées renseignées ; l’étiquette « Salle équipée » n’est pas une preuve que chaque machine existe dans la salle de Thomas.

### Liste à enrichir : options et filtres supplémentaires

Ce tableau est l’endroit où ajouter ou ajuster les options avant leur implémentation. Les lignes non renseignées ne deviennent pas des contrôles vides dans la page.

| Catégorie existante ou nouveau filtre | Option à ajouter | Définition et données nécessaires | Pourquoi utile | Validation |
| --- | --- | --- | --- | --- |
| Groupe musculaire | À compléter | À compléter | À compléter | À faire |
| Matériel | À compléter | À compléter | À compléter | À faire |
| Durée | À compléter | À compléter | À compléter | À faire |
| Autre filtre | À compléter | À compléter | À compléter | À faire |

La possibilité d’ajouter porte ici sur l’enrichissement des listes et catégories dans la conception. Un contrôle « Plus de filtres » pourra exposer les catégories supplémentaires une fois définies ; il n’est pas affiché sans contenu. La création de catégories libres par l’utilisateur n’est pas introduite dans cette première proposition.

## 6. Carte d’une séance

Toute la carte ouvre le récapitulatif. Elle contient :

| Information | Présentation | Raison |
| --- | --- | --- |
| Nom | Titre court, visuellement prioritaire | Identifier la séance |
| Durée estimée | Texte « Environ 20 min » | Comparer rapidement sans promettre une durée exacte |
| Niveau | Texte explicite, pas couleur seule | Vérifier l’adéquation au repère choisi |
| Matériel | Libellé court | Éviter d’ouvrir une séance impossible à réaliser avec le matériel disponible |
| Zones travaillées | Une ligne courte ou quelques étiquettes | Situer le contenu |
| Nombre d’exercices | Texte « 3 exercices » | Donner une idée de la taille de la séance |
| Origine | Bibliothèque de départ ou auteur fictif de communauté | Distinguer la provenance du contenu |

Pas de graphique, record personnel, compteur social ou bouton Commencer. Un repère Favori peut apparaître lorsqu’une séance est déjà marquée ; les actions détaillées restent dans le récapitulatif pour garder les cartes sobres.

### Exemples fictifs de base

| Nom | Durée estimée | Niveau | Matériel | Zones | Exercices |
| --- | --- | --- | --- | --- | --- |
| Premiers pas · Full Body | 20 min | Débutant | Salle équipée | Corps entier | 3 |
| Bouger sans matériel | 15 min | Débutant | Sans matériel | Corps entier | 3 |
| Haut du corps · Mes repères | 30 min | Intermédiaire | Haltères à la maison | Pectoraux, dos, épaules | 4 |

Ces lignes définissent des exemples de données pour les cartes. Le détail des exercices sera précisé avec la fiche ; aucune liste manquante ne doit être présentée comme déjà complète.

## 7. Récapitulatif et conservation

Choisir une séance ouvre une vue de récapitulatif avec retour à la liste. Afficher le nom, l’explication courte, les métadonnées de la carte et la liste ordonnée des exercices, avec leurs cibles prévues lorsqu’elles sont disponibles. Aucune valeur prévue n’est présentée comme un résultat réalisé.

La liste conserve recherche, filtres et position de défilement lorsque Thomas revient. La structure complète de la fiche sera documentée à son étape ; les destinations et actions suivantes sont proposées ici pour assurer un parcours cohérent.

| Action proposée dans le récapitulatif | Effet | Portée |
| --- | --- | --- |
| Ajouter au calendrier | Choisir une date, puis confirmer le placement | Créer une séance planifiée liée à une copie personnelle ; ne pas modifier la bibliothèque |
| Ajouter aux favoris / Retirer des favoris | Marquer ou retirer un repère de consultation | Ne planifie pas une séance et ne crée pas de résultat |
| Ajouter à mes entraînements | Conserver une copie personnelle à réutiliser | Ne planifie aucun jour automatiquement |
| Retour | Revenir à la bibliothèque telle qu’elle était | Conserver recherche, filtres et position |

Les trois actions ne sont pas équivalentes ; leurs libellés doivent expliquer la conséquence. Ajouter au calendrier propose une date avant de confirmer, sans écraser une séance déjà prévue. Si une copie existe déjà, la réutiliser plutôt que la dupliquer silencieusement. Une confirmation courte indique le résultat et permet d’ouvrir l’élément ajouté.

Favoris, copies personnelles et semaine sont des propositions concrètes pour le « favori ou autre » ; leur présentation et les cas de doublon sont à valider avec cette documentation. Les exercices et séries ne sont pas édités sur la page d’arrivée.

## 8. Transitions et états

| Action | Destination | Informations conservées |
| --- | --- | --- |
| Terminer ou passer les questions avec niveau Débutant, Intermédiaire ou absent | Cette page Découvrir | Nom d’affichage et réponses existantes |
| Modifier recherche ou filtres | Résultats de cette page | Réglages courants |
| Choisir une carte | Récapitulatif de la séance | Référence de séance et état de la liste |
| Ajouter au calendrier depuis le récapitulatif | Choix d’une date puis confirmation | Copie personnelle et placement choisi |
| Ajouter aux favoris | Même récapitulatif, état favori mis à jour | Référence de la séance |
| Ajouter à mes entraînements | Même récapitulatif, copie confirmée | Copie personnelle ; accès possible à Mes entraînements |
| Choisir Mes entraînements | [Espace personnel](../04-mes-entrainements/README.md) | Préférences et éléments conservés |
| Choisir Bilans | Liste et détails des bilans conservés | Résultats archivés en lecture seule, sans analyse de progression |

États à représenter : suggestions avec réponses complètes ou partielles, bibliothèque générale sans réponses, filtre actif, résultats vides, contenu favori ou déjà enregistré, retour depuis une fiche. Les repères sont toujours modifiables ; l’absence de réponses n’empêche pas l’accès aux séances.

## 9. Style et justifications

Palette commune : `#FEF2F2` pour le fond, `#111827` pour les textes, `#B91C1C` pour actions et onglet actif, `#F87171` en accent discret. Police système, textes de saisie et cartes autour de 16 px, métadonnées 14 px, titres autour de 24–28 px. Contours fins, arrondis de 8 px, pas de grand visuel ou d’ombre marquée.

Les cartes utilisent d’abord du texte. Une icône sportive discrète peut accompagner les données sans devenir indispensable à leur compréhension. Recherche, filtres et actions sont accessibles au clavier ; les zones tactiles restent d’au moins 44 px et les résultats actualisés sont annoncés sans déplacer le focus à chaque saisie.

| Choix | Alternative | Justification et limite |
| --- | --- | --- |
| Séances complètes | Liste d’exercices isolés | Réduit l’effort d’organisation pour Thomas ; l’adaptation se fait ensuite |
| Suggestions avec filtres | Questionnaire supplémentaire obligatoire | Utilise les réponses déjà données et permet d’affiner sans bloquer l’entrée |
| Cartes avec métadonnées | Titres seuls | Rend le choix explicable avant de consulter le détail |
| Récapitulatif avant toute réalisation | Bouton de démarrage sur la liste | Permet de comprendre et conserver le contenu ; conforme à la demande actuelle |
| Favori, copie et planification distincts | Une action Ajouter ambiguë | Évite de confondre repère, entraînement personnel et séance datée |
| Défilement pour la bibliothèque | Nombre fixe de suggestions | Permet d’explorer ; les contrôles restent compacts et le retour garde la position |

## 10. Validation avant code

À relire : listes de filtres, contenu exact des cartes, entrée du récapitulatif, trois actions de conservation et conséquences. Les listes à compléter restent dans ce Markdown.

Après validation, vérifier le routage pour débutant, intermédiaire et niveau absent ; les filtres et la recherche combinés ; le cas sans résultat ; l’ouverture d’une séance sans la démarrer ; le retour à la même position ; favoris, copie personnelle et placement dans la semaine sans écrasement. Le détail de la fiche et du calendrier doit être validé à son tour avant une implémentation complète.

**Validation reçue :** documentation et limites approuvées avant implémentation.


## Code et vérification

Ouvrir le [parcours depuis la connexion](../01-connexion/index.html). [decouverte.js](decouverte.js) gère la bibliothèque, les filtres, les récapitulatifs, les favoris et le placement daté ; [seances.js](seances.js) contient les exemples fictifs et les options de filtres. Les transitions et styles communs sont dans [parcours.js](../commun/parcours.js) et [styles.css](../commun/styles.css).

Vérifié dans le navigateur : arrivée selon le niveau, recherche et filtres combinés, priorité aux séances courtes, communauté séparée, résultats vides, retour conservant le défilement, favoris, copies sans doublons et placement sans écrasement.

Les copies personnelles et leurs placements datés sont conservés localement. Le récapitulatif reste limité aux informations de séance et aux noms des exercices ; ouvrir une occurrence depuis le calendrier ou sa copie depuis Mes entraînements donne accès à l’aperçu, à l’adaptation en ligne et au repère Séance prête intégré à l’aperçu et au démarrage direct de T2. Les adaptations de l’occurrence restent séparées de la bibliothèque originale. Plusieurs séances peuvent partager une date ; un repos peut être remplacé après confirmation explicite dans le panneau courant, avec Annuler ensuite.

## Simplification ergonomique validée

La recherche ignore accents et casse. Les filtres restent conservés dans le profil. Favori désigne un repère, Enregistré une copie personnelle et Planifié une occurrence datée. Si une copie existe, « Ouvrir la séance enregistrée » la retrouve au lieu de proposer une nouvelle copie.

## Complément T1.1.3 — programmes complets

La section Programmes complets de Découvrir présente une semaine prédéfinie et un mésocycle communautaire fictif. Recherche et filtres s’appliquent aussi aux programmes ; un filtre de durée exige une estimation connue pour toutes leurs séances. L’aperçu montre jours, repos, semaines et cibles avant l’import explicite. Fermer ne crée rien. Importer ajoute une copie personnelle, sans date ; ouvrir à nouveau retrouve cette copie au lieu de la dupliquer.

`programmes.js` conserve la répartition, les semaines du cycle, exercices, séries, répétitions, charges et RPE. Un mouvement absent du catalogue est recréé dans la bibliothèque personnelle avec sa consigne publique. La copie se modifie et se planifie avec les éditeurs existants, sans modifier sa source. Les notes/réglages personnels et résultats ne sont pas importés.

Les publications locales actives créées avec une structure complète apparaissent dans Communauté pour le profil courant. Retirer une publication la retire de cette liste ; les copies déjà importées restent indépendantes. Une ancienne publication sans structure ne peut pas reconstituer ses jours : utiliser Actualiser depuis Mes entraînements avant de l’importer. Le service communautaire reste une simulation locale, sans échange entre comptes ni import de fichiers.

## Feedback de conservation — premier lot ergonomique

L’enregistrement/placement depuis le récapitulatif et l’import d’un programme distinguent maintenant une conservation réussie d’un changement seulement appliqué pour cette visite lorsque le stockage échoue. L’alerte globale propose Réessayer la sauvegarde ; la copie déjà créée en mémoire reste réutilisée, sans import supplémentaire. Voir le [compte rendu du lot](../../../docs/07-evaluation/audit-ergonomie-cours5-6.md).


## Troisième lot ergonomique — 22 octobre 2026

Le compteur global distingue séances et programmes ; un programme trouvé seul ne provoque plus d’encart Aucune séance. Filtres retirables individuellement et effacement du seul nom permettent de corriger une recherche sans tout recommencer. La présentation annonce les critères réellement utilisés ; objectif sportif conservé sans fausse promesse, budget temps affiché comme repère facultatif. La recherche et les critères actualisent la même entrée de l’historique, pour un retour/rechargement cohérent.

Déjà enregistré distingue une copie du favori. Enregistrer devient Préparer ma copie dans le récapitulatif : accès direct à la même copie, sans nouvelle copie ni entraînement démarré. L’import de programme affiche des semaines repliables, variations et cibles publiques ; ouvrir une semaine révèle directement ses exercices. L’action d’import reste accessible et ne place aucune date. Mes préférences est commun aux espaces principaux, avec retour à la recherche et à sa position.

Les vérifications du lot sont dans l’[audit](../../../docs/07-evaluation/audit-ergonomie-cours5-6.md#13-troisième-lot-livré--22-octobre-2026).


## Dernier lot ergonomique — 22 octobre 2026

Mes favoris affiche les séances favorites des deux bibliothèques tout en conservant nom et filtres explicites. La sélection de bibliothèque est masquée pendant ce mode, puis retrouvée à sa désactivation. Retirer un favori actualise la liste et permet un retour de focus même si la carte disparaît. Le mode Favoris est repris après rechargement ; favori, copie et occurrence restent distincts.

Vérification : 104 tests ciblés et parcours Chromium à 320, 390 et 1280 px ; [preuves, compromis et évaluations restantes](../../../docs/07-evaluation/audit-ergonomie-cours5-6.md#15-dernier-lot-livré--22-octobre-2026).
