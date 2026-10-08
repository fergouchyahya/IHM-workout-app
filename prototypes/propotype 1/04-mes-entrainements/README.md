# Page d’arrivée — Mes entraînements, avancé

**Date :** 2026-10-03 · **Responsables :** Yahya et Marie<br>
**État :** documentation validée ; page implémentée et vérifiée.

## 1. Objectif et utilisateurs

Donner à l’utilisateur avancé un espace sobre pour retrouver ses entraînements et créer sa propre organisation. L’entrée principale est son contenu personnel ; les suggestions restent accessibles comme source facultative.

Le [persona Greg](../../../docs/02-utilisateurs-personas/persona-greg.md) organise sa pratique en cycles et souhaite reprendre ou reproduire son programme sans le recréer manuellement. La page correspond à T1.1.2 et T1.1.4 ; la création prépare T1.1.5 et T1.2 dans l’[arbre commun](../../../docs/04-analyse-taches/tache.md). Les besoins de Greg justifient les cycles, sans imposer sa pratique exacte à tous les utilisateurs avancés.

## 2. Choix confirmés

- Niveau Avancé renseigné → arrivée dans Mes entraînements.
- Débutant, Intermédiaire ou niveau absent → arrivée dans [Découvrir](../03-decouverte/README.md).
- Page personnelle simple, avec ses entraînements enregistrés et une action visible « + Créer ».
- État vide permettant de créer une première base.
- Accès secondaire « Explorer des séances » vers Découvrir.
- Après Créer, proposer des informations pour préparer l’entraînement, dont organisation par semaine ou mésocycle.
- Proposer des gabarits de répartition tels que PPL et Upper/Lower, à enrichir.
- Navigation conservée : Découvrir / Mes entraînements / Progrès ; pas de quatrième onglet.

Les champs, bases de gabarits et étapes précises ci-dessous ont été validés avant code. Ils ne constituent pas une programmation sportive prescrite.

## 3. Composition de la page personnelle

De haut en bas :

1. Titre « Mes entraînements », avec une salutation courte facultative.
2. Action principale « + Créer » ; le mot accompagne le symbole pour rendre la fonction explicite.
3. Si du contenu existe, liste de ses séances, semaines types et mésocycles, avec leur type clairement indiqué.
4. Si aucun contenu n’existe, texte court « Crée ton premier entraînement » puis « Choisis une structure, puis ajoute tes exercices. ». La même action Créer reste disponible, sans doublon décoratif.
5. Lien secondaire « Explorer des séances ».
6. Barre des trois onglets, avec Mes entraînements actif.

La page est une liste personnelle, pas un tableau de bord rempli de graphiques. Le défilement est permis lorsqu’il existe plusieurs entraînements. Le bouton Créer reste facile à repérer au début ; il n’est pas remplacé par un bouton flottant qui masque du contenu.

Une carte personnelle montre le nom, le type d’organisation et un repère utile : nombre de séances pour une semaine type, nombre de semaines pour un mésocycle, ou nombre d’exercices pour une séance. Ne pas inventer ces quantités lorsque le brouillon est encore incomplet. Un appui ouvre le récapitulatif personnel ; aucun entraînement ne démarre directement depuis la liste.

## 4. Entrée de création : définir la base

« + Créer » ouvre une vue dédiée « Créer un entraînement », dans la continuité de cet espace. Cette documentation décrit les informations initiales demandées ; l’éditeur d’exercices et le calendrier détaillé seront documentés à leur propre étape.

Présenter d’abord le nom et l’organisation, puis le gabarit et les informations utiles. Éviter de demander d’un seul coup exercices, charges, historique et partage.

| Champ proposé | Obligatoire / facultatif | Présentation et règle |
| --- | --- | --- |
| Nom de l’entraînement | Obligatoire | Saisie courte, exemple « Mon bloc haut/bas » ; aucune identité de programme imposée |
| Organisation | Obligatoire | Séance seule / Semaine type / Mésocycle ; choix explicite, sans présélection cachée |
| Gabarit de répartition | Facultatif | Personnalisé / Full Body / Upper/Lower / PPL ; choix initial Personnalisé, modifiable |
| Objectif principal | Facultatif | Reprendre les repères du questionnaire si donnés ; permettre de les adapter pour cet entraînement |
| Zone ou groupes ciblés | Facultatif | Champ de choix dont les options reprennent la liste de Découvrir |
| Matériel | Facultatif | Reprendre le repère existant ; modifiable pour le nouvel entraînement |
| Séances par semaine | Facultatif, pour semaine ou mésocycle | Nombre prévu, sans imposer une fréquence à partir du niveau |
| Durée du mésocycle | Obligatoire uniquement si Mésocycle | Nombre de semaines entier positif, unité visible ; pas de durée recommandée ou prédéfinie |

Organisation et gabarit sont deux concepts distincts : semaine ou mésocycle décrit la durée et l’échelle ; PPL ou Upper/Lower décrit la répartition. Un mésocycle peut donc reprendre une organisation PPL ou Upper/Lower ; ces choix ne doivent pas être présentés comme exclusifs dans une seule liste.

Pour une séance seule, masquer les champs de fréquence hebdomadaire et de durée du cycle ; les formats de répartition sur plusieurs séances sont proposés dans les organisations Semaine type et Mésocycle. Le titre et les libellés de l’étape s’adaptent au choix.

## 5. Gabarits de départ proposés

Ces gabarits donnent une **structure à compléter**, pas des charges, volumes ou séances obligatoires. Les noms de catégories constituent la base de maquette ; leur répartition dans les jours reste choisie par l’utilisateur.

| Gabarit | Base proposée | Ce qu’il ne remplit pas |
| --- | --- | --- |
| Personnalisé | Structure libre ; l’utilisateur nomme et ajoute ses séances | Aucun exercice ni calendrier généré |
| Full Body | Base de séances orientées corps entier | Aucun nombre de séances, jours, séries ou charges imposés |
| Upper/Lower | Catégories « Haut du corps » et « Bas du corps » | Aucun placement des jours ni rythme imposé |
| PPL — Push / Pull / Legs | Catégories « Push », « Pull », « Legs », avec explication courte en français | Aucun placement des jours, fréquence, exercices ou charges imposés |

Dans la future interface, une aide courte explique le gabarit sélectionné ; inutile d’afficher un paragraphe sous chaque option. Greg peut commencer avec un gabarit, puis changer les noms et la répartition. Choisir un format ne le verrouille pas dans un programme automatique.

### Catalogue à enrichir avant implémentation

| Nouveau gabarit ou variante | Noms des séances / structure | Échelles compatibles | Informations demandées | Justification | Validation |
| --- | --- | --- | --- | --- | --- |
| À compléter | À compléter | Séance / semaine / mésocycle | À compléter | À compléter | À faire |
| À compléter | À compléter | Séance / semaine / mésocycle | À compléter | À compléter | À faire |

### Options complémentaires à préciser

| Information ou option | Valeurs à ajouter | Cas d’utilisation | Validation |
| --- | --- | --- | --- |
| Objectif | À compléter | Préparer une base adaptée à l’intention | À faire |
| Matériel | À compléter | Décrire les contraintes de la séance ou du cycle | À faire |
| Organisation ou variante de cycle | À compléter | Compléter les échelles initiales si nécessaire | À faire |

Ce sont des espaces de rédaction ; aucune option vide n’apparaîtra dans la maquette. Le nom « mésocycle » est accompagné de « plusieurs semaines » pour distinguer sa fonction de la semaine type.

## 6. Après les informations initiales

Action proposée : **« Créer la base »**. Elle vérifie le nom, l’organisation et, si applicable, le nombre de semaines. Elle conserve une base personnelle clairement identifiée comme « À compléter », puis ouvre l’étape suivante de configuration.

| Organisation | Destination proposée après création de la base |
| --- | --- |
| Séance seule | Ajouter et organiser les exercices de cette séance |
| Semaine type | Configurer les séances et jours de repos de la semaine, à partir du gabarit éventuel |
| Mésocycle | Configurer la semaine de référence et sa répétition sur la durée choisie, puis ses adaptations |

Les séries, plages de répétitions, charges cibles et RPE éventuel appartiennent à l’éditeur d’exercices suivant. Les valeurs prévues restent distinctes des résultats réalisés. La base ne contient aucun résultat d’entraînement et n’est pas publiée.

La page d’arrivée et le formulaire initial ne prétendent pas finaliser le programme. Un brouillon peut être retrouvé ensuite dans Mes entraînements ; « À compléter » évite de le présenter comme prêt à réaliser. L’éditeur détaillé et la possibilité de démarrer seront décidés à leur étape.

## 7. Navigation, retours et transitions

| Action | Effet | Destination | Conservation |
| --- | --- | --- | --- |
| Terminer ou passer le reste avec niveau Avancé déjà donné | Donner priorité au contenu personnel | Cette page Mes entraînements | Nom et réponses existantes |
| + Créer | Ouvrir les informations de base | Créer un entraînement | Repères du profil ; aucun programme créé avant confirmation |
| Changer l’organisation | Afficher seulement les champs pertinents | Même formulaire | Valeurs déjà saisies ; seules celles pertinentes sont retenues à la confirmation |
| Choisir un gabarit | Préparer une structure modifiable | Même formulaire | Nom et autres champs |
| Annuler ou retourner avant Créer la base | Revenir sans enregistrer de programme | Mes entraînements | Contenu personnel existant inchangé |
| Créer la base avec champs valides | Enregistrer un brouillon personnel | Configuration adaptée à l’organisation | Nom, organisation, gabarit et informations fournies |
| Ouvrir un entraînement existant | Consulter sa structure | Récapitulatif personnel, à documenter | Référence de l’entraînement |
| Explorer des séances / onglet Découvrir | Accéder à la bibliothèque | [Découvrir](../03-decouverte/README.md) | Préférences et entraînements existants |
| Onglet Progrès | Accéder au suivi | Progrès, à concevoir | Historique disponible |

Le niveau ne bloque pas la navigation : un débutant peut ouvrir Mes entraînements et créer une base ; un avancé peut utiliser une suggestion puis la conserver. Le routage personnalise seulement la première page affichée.

## 8. États et messages

- **Vide :** aucune séance personnelle ; Créer visible et lien Explorer des séances disponible.
- **Avec contenu :** cartes de séances, semaines et cycles ; type et état clairement indiqués.
- **Brouillon :** nom et structure partielle, avec repère « À compléter » ; pas de faux nombre d’exercices ou résultats.
- **Création initiale :** nom vide, organisation à choisir, gabarit Personnalisé ; les autres repères peuvent reprendre les questions.
- **Nom manquant :** « Donne un nom à ton entraînement. ».
- **Organisation manquante :** « Choisis une organisation. ».
- **Durée de cycle manquante ou invalide :** « Indique le nombre de semaines du mésocycle. ».
- **Correction :** messages près des champs, focus sur le premier à corriger ; autres valeurs conservées.
- **Base créée :** message court « Base créée », puis configuration de son contenu, sans prétendre que le programme est complet.

Si une destination de configuration n’est pas encore conçue lors d’une première implémentation, elle est explicitement présentée comme une étape de démonstration. Son interface complète ne sera pas générée sans documentation validée.

## 9. Style et justifications

Reprendre `#FEF2F2`, `#111827`, `#B91C1C`, `#F87171`, la police système et les contours sobres. Le rouge principal distingue Créer et l’onglet actif ; le rouge clair reste un accent. Titres autour de 24–28 px, corps 16 px, aides 14 px. Pas de photographie promotionnelle, de gabarit illustré occupant toute la page ni de tableau complexe dès l’arrivée.

Les libellés accompagnent les symboles. Les types Séance, Semaine type et Mésocycle sont indiqués par texte, pas couleur seule. Les champs conditionnels sont annoncés et accessibles au clavier ; les erreurs sont liées aux champs. La barre des onglets reste accessible sans cacher la fin des listes.

| Choix | Alternative | Justification et limite |
| --- | --- | --- |
| Espace personnel comme arrivée avancée | Suggestions prioritaires pour tous | Donne un accès direct à la préparation du programme ; la bibliothèque reste accessible |
| Créer avec libellé et symbole | Plus seul | Rend l’action compréhensible sans deviner l’icône |
| Informations de base avant exercices | Tout le programme dans un formulaire unique | Clarifie l’échelle de l’entraînement et limite la charge initiale |
| Organisation et répartition séparées | Une seule liste mêlant PPL et mésocycle | Permet d’associer un format à plusieurs semaines sans confusion |
| Gabarits modifiables | Programme automatique figé | Réduit le travail répétitif sans retirer le contrôle à Greg |
| Brouillon À compléter | Présenter la base comme séance terminée | Distingue structure, cibles et résultats ; clarifie le travail restant |

## 10. Validation avant code

À relire : page vide et liste personnelle, bouton Créer, distinction entre semaine/mésocycle et gabarit, champs obligatoires ou facultatifs, catalogue initial et destination après Créer la base.

Après validation, vérifier l’arrivée avec Avancé même si les questions suivantes sont passées ; l’accès aux suggestions ; le formulaire conditionnel ; un nom et une durée de cycle manquants ; la création d’une base sans exercices ou résultats inventés ; le retour avant confirmation sans programme enregistré. Les étapes de configuration doivent être documentées et validées avant leur implémentation complète.

**Validation reçue :** documentation et limites approuvées avant implémentation.


## Code et vérification

Ouvrir le [parcours depuis la connexion](../01-connexion/index.html), choisir Avancé puis terminer ou passer les questions. [entrainements.js](entrainements.js) gère le contenu personnel et la création ; [gabarits.js](gabarits.js) définit les bases Personnalisé, Full Body, Upper/Lower et Push/Pull/Legs.

Vérifié dans le navigateur : état vide, navigation, copies et favoris, création de séance/semaine/mésocycle, champs obligatoires, nombres entiers positifs, annulation sans création et changement d’organisation sans réutiliser les champs masqués. Affichage contrôlé à 320, 390 et 1280 px de largeur.

Les semaines et mésocycles ouvrent maintenant [Organiser ma semaine](../05-organisation-semaine/README.md) : séances nommées, repos, déplacement, duplication et répétition de la répartition. Les jours d’entraînement et les séances seules ouvrent [Configurer une séance](../06-configuration-seance/README.md) pour ajouter des exercices, leurs objectifs et les champs de suivi.

Limites : les bases créées sont marquées « À compléter », sans exercices inventés. La réalisation, le calendrier daté et Progrès restent à concevoir. Le contenu personnel est désormais conservé dans le stockage local du navigateur, avec les préférences et les exercices personnels.

## Simplification du parcours

L’objectif et le matériel connus sont préremplis dans une section repliée « Objectif et matériel ». Le formulaire inachevé est mémorisé pour la reprise. Une connexion de démonstration avec la même identité reprend le profil connu sans redemander les questions rapides. Les mots de passe ne sont jamais conservés.
