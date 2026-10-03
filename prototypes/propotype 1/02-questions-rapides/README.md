# Questions rapides — Parcours en trois écrans

**Date :** 2026-10-03 · **Responsables :** Yahya et Marie<br>
**État :** documentation validée dans l’échange du 3 octobre 2026 ; trois questions implémentées et vérifiées.

## Objectif

Après la connexion ou la création de compte, recueillir trois repères pour proposer des séances adaptées : niveau, objectif principal et matériel. Thomas doit comprendre immédiatement la question, choisir rapidement ou passer le reste, sans devoir faire défiler la page pour voir les choix ou les actions.

Les questions préparent [T1.1.1 de l’arbre commun](../../../docs/04-analyse-taches/tache.md), puis le choix d’une séance T1.1.3. Le [persona Thomas](../../../docs/02-utilisateurs-personas/persona-thomas.md) demande guidance et faible charge mentale ; trois choix explicites par écran limitent la quantité d’information à traiter.

## Choix confirmés

- Trois questions, chacune sur son écran : niveau → objectif → matériel.
- Un appui sur une réponse l’enregistre puis avance directement ; aucun bouton Continuer ou Valider supplémentaire.
- Une flèche de retour permet de corriger les réponses précédentes, qui restent conservées.
- « Passer le reste » reste accessible sur les trois écrans : les réponses déjà données sont gardées, les questions sans réponse restent non renseignées.
- Après la troisième réponse ou le passage du reste, destination selon le niveau : Avancé → Mes entraînements ; Débutant, Intermédiaire ou absent → Découvrir.
- Sans aucune réponse, afficher la bibliothèque générale de départ ; ne pas prétendre qu’elle est personnalisée.
- Même palette et même sobriété que la connexion.
- Progression visible avec le numéro de la question et le total.
- Personnalisation par le nom d’utilisateur ; pour une connexion par e-mail seulement, prendre la partie avant `@`. La salutation apparaît uniquement sur la première question.

## Index : un dossier par écran

| Écran | Document | Destination après réponse |
| --- | --- | --- |
| 1. Niveau | [01-niveau/README.md](01-niveau/README.md) | Question 2, objectif |
| 2. Objectif | [02-objectif/README.md](02-objectif/README.md) | Question 3, matériel |
| 3. Matériel | [03-materiel/README.md](03-materiel/README.md) | Page correspondant au niveau |

Les règles communes sont décrites ici ; chaque document d’écran précise son contenu, sa disposition et ses transitions. Les [suggestions](../03-decouverte/README.md) et l’[arrivée avancée](../04-mes-entrainements/README.md) sont documentées, validées et implémentées.

## Transition depuis la connexion

Lors d’une connexion ou inscription valide, afficher directement la question de niveau. La transition prévue remplace le repère de réussite provisoire du [premier écran](../01-connexion/README.md) : pas d’écran de confirmation intermédiaire ni d’action supplémentaire pour entrer dans les questions.

Avant de vider les champs du formulaire, récupérer uniquement le nom d’affichage utile :

| Origine | Nom d’affichage | Exemple |
| --- | --- | --- |
| Connexion par nom d’utilisateur | Identifiant saisi, sans espaces aux extrémités | `thomas.dubois` → « Bonjour thomas.dubois » |
| Connexion par e-mail | Partie de l’adresse avant `@` | `thomas@example.com` → « Bonjour thomas » |
| Création de compte | Nom d’utilisateur, même si un e-mail est aussi présent | `thomas.dubois` → « Bonjour thomas.dubois » |
| Ouverture isolée de la maquette des questions | Salutation générique, sans inventer d’identité | « Bonjour » |

Ne pas inventer un prénom à partir du nom d’utilisateur, afficher l’adresse complète ni transporter le mot de passe. Le nom est rendu comme du texte. S’il est long, le tronquer visuellement sur une ligne pour préserver la composition compacte ; la valeur complète reste accessible aux outils d’assistance.

La connexion capture le nom avant de vider ses champs puis ouvre directement les questions, dans le même document, sans rechargement. Aucun mot de passe ou e-mail complet n’est transmis au contrôleur des questions.

## Composition commune

Une colonne mobile, avec marges latérales de 24 px et largeur maximale autour de 360 px, reprend les alignements de la connexion. De haut en bas :

1. Ligne de navigation : petite flèche à gauche et « Passer le reste » à droite, avec zones tactiles d’au moins 44 px.
2. Texte de progression « Question 1 sur 3 », « Question 2 sur 3 » ou « Question 3 sur 3 ».
3. Barre de progression fine, composée de trois segments ; le segment courant et ceux déjà traversés sont marqués.
4. Sur le premier écran seulement, « Bonjour {nom} » puis la question. Sur les suivants, directement la question.
5. Trois réponses empilées, chacune sur une ligne, dans une zone de sélection pleine largeur.
6. Une aide courte : « Choisis une réponse pour continuer. ».

La barre indique la position dans le parcours, pas le nombre de réponses obligatoirement complétées. Elle est accompagnée du texte numérique : la couleur seule ne porte pas l’information.

Le haut, les choix et « Passer le reste » restent visibles ensemble sur les dimensions mobiles ordinaires visées. Aucun visuel décoratif, grande introduction, illustration, barre des trois onglets ou bouton principal additionnel ne prend leur place.

### Éviter le défilement pour répondre

Objectifs de mise en page à vérifier lors du code : écrans de 320 × 568 px et 390 × 844 px, taille de texte normale. Les trois options, la progression et l’accès pour passer doivent tenir simultanément dans la zone utile.

Prévoir environ 56 px de hauteur par réponse, des intervalles de 12 px et un titre de 24 à 28 px. Sur une faible hauteur, réduire d’abord les marges et intervalles décoratifs ; conserver les libellés, la progression et les zones tactiles. Aucun champ de texte n’ouvre de clavier.

Ne pas bloquer artificiellement le défilement ni couper le contenu : avec une taille de texte fortement agrandie ou une fenêtre exceptionnellement courte, il reste possible de défiler pour accéder à tout. Le confort sans défilement à taille normale ne doit pas supprimer cette accessibilité.

## Interactions et retours

- Les réponses commencent sans sélection ; aucun profil n’est attribué par défaut.
- Un appui ou une activation clavier enregistre une seule valeur pour la question courante, marque brièvement le choix puis affiche la destination. Pas de confirmation à fermer.
- Le changement se fait dans la même continuité visuelle : alignements stables et transition discrète, sans effet voyant. Respecter la préférence de réduction des animations.
- Éviter qu’un double appui rapide sélectionne involontairement une réponse sur l’écran suivant.
- Après changement d’écran, placer le focus sur le titre et annoncer la progression pour que la navigation soit compréhensible au clavier et avec un lecteur d’écran.
- Au retour, la réponse précédente reste visiblement sélectionnée. Choisir une autre réponse la remplace ; activer la réponse sélectionnée permet aussi d’avancer sans nouveau bouton.
- Revenir en arrière ne vide pas les réponses des questions suivantes. Passer le reste ne supprime aucune réponse déjà fournie, même si elle avait été donnée avant ce retour.

Sur la question 1, la flèche revient à la connexion ; sur les questions 2 et 3, elle revient à la question précédente. Pendant cette visite, revenir à la connexion puis reprendre les questions garde les réponses déjà données. Un accès avec une autre identité commence un questionnaire sans les réponses du profil précédent.

## Tableau des transitions communes

| Action | Effet | Destination | Données conservées |
| --- | --- | --- | --- |
| Connexion ou création valide | Extraire le nom d’affichage puis ouvrir le parcours | Question 1, niveau | Nom d’affichage ; aucun mot de passe |
| Choisir le niveau | Enregistrer ou remplacer le niveau | Question 2, objectif | Nom et réponses existantes |
| Choisir l’objectif | Enregistrer ou remplacer l’objectif | Question 3, matériel | Nom et réponses existantes |
| Choisir le matériel | Enregistrer ou remplacer le matériel | Page correspondant au niveau | Nom et réponses existantes |
| Passer le reste, sur n’importe quelle question | Conserver les réponses données ; laisser les autres vides | Page correspondant au niveau | Nom et réponses existantes |
| Retour depuis question 3 | Relire ou corriger l’objectif | Question 2 | Toutes les réponses données |
| Retour depuis question 2 | Relire ou corriger le niveau | Question 1 | Toutes les réponses données |
| Retour depuis question 1 | Revenir au formulaire d’accès | Connexion | Réponses pour cette identité durant la visite ; aucun mot de passe |

La fin ouvre la page correspondant au niveau conservé. Le nom et les réponses sont transmis au parcours commun ; niveau et matériel présélectionnent les filtres de Découvrir lorsqu’ils sont renseignés.

## Réponses et conséquences pour la découverte

| Repère | Valeurs | Effet envisagé |
| --- | --- | --- |
| Niveau | Débutant / Intermédiaire / Avancé | Présélectionner le filtre de niveau lorsqu’il est renseigné |
| Objectif | Gagner en force / Développer mes muscles / Rester actif | Donner un repère pour mettre en avant les séances pertinentes ; le classement précis sera discuté avec Découvrir |
| Matériel | Salle équipée / Haltères à la maison / Sans matériel | Présélectionner le filtre de matériel lorsqu’il est renseigné |

Les réponses non données n’appliquent aucun filtre et ne sont pas devinées. Avec seulement une partie des réponses, utiliser seulement ces repères ; garder les filtres modifiables. Les séances courtes restent prioritaires, conformément au cadrage général. Aucune durée ou disponibilité n’est demandée ici.

## Palette, composants et accessibilité

| Couleur | Rôle dans les questions |
| --- | --- |
| `#FEF2F2` | Fond uni et fond des options au repos |
| `#111827` | Questions, nom, réponses et aides |
| `#B91C1C` | Progression active, bordure de la réponse choisie, focus et accès pour passer |
| `#F87171` | Accent ponctuel léger ; pas de petit texte sur le fond clair |

Police système, comme la connexion. Titre autour de 24–28 px, réponses 16 px et repères 14 px. Options à contour fin, arrondi modéré de 8 px, sans ombres ni images. La réponse sélectionnée dispose d’un contour marqué et d’un repère explicite, pas seulement d’une autre couleur.

Les options sont des actions de choix explicites, accessibles au clavier, sans menu déroulant. La flèche possède le libellé accessible « Revenir à la connexion » ou « Question précédente » selon l’écran. « Passer le reste » explique sa portée sans laisser penser qu’il passe seulement la question courante. Les trois boutons de réponse annoncent leur état sélectionné lors d’un retour.

## Justification et limites

| Décision | Alternative | Pourquoi et limite |
| --- | --- | --- |
| Une question par écran | Tout le formulaire sur une page | Limite la densité et évite le défilement ; la progression rend la longueur prévisible |
| Choix puis passage direct | Choix suivi de Continuer | Retire une action répétée ; l’aide doit rendre le passage automatique prévisible |
| Retour avec réponse conservée | Choix irréversible ou remise à zéro | Permet de corriger une sélection rapide sans refaire tout le parcours |
| Passage permanent du reste | Questionnaire obligatoire | Permet d’atteindre rapidement les séances ; la découverte doit gérer les informations absentes |
| Progression numérique et graphique | Barre seule ou aucun repère | Rend les trois étapes explicites, indépendamment de la couleur |
| Nom sur la première question | Salutation sur chaque écran | Personnalise l’entrée sans répéter un élément qui occupe la hauteur disponible |
| Trois options textuelles sobres | Des cartes illustrées ou des explications longues | Réponses visibles immédiatement et cohérence avec la connexion ; les catégories restent volontairement larges |

La sélection automatique peut provoquer une erreur de choix : le retour est donc nécessaire. La salle équipée ne décrit pas toutes les machines disponibles ; le détail du matériel et les adaptations restent à traiter avec la découverte et la séance. Ces réponses sont des préférences de prototype, pas une évaluation sportive.

## Vérification prévue après validation et code

- Tester connexion par nom d’utilisateur, connexion par e-mail et inscription ; vérifier le nom affiché seulement sur la question 1.
- Vérifier les trois questions et leurs neuf libellés, sans présélection initiale.
- Répondre dans l’ordre ; constater le passage direct et les numéros 1/3, 2/3, 3/3.
- Revenir, changer une réponse, réactiver un choix existant ; vérifier la conservation des autres réponses.
- Passer depuis chacune des questions, y compris après un retour ; vérifier que seuls les repères déjà fournis sont conservés.
- Vérifier que toutes les réponses et « Passer le reste » sont visibles à 320 × 568 et 390 × 844 px, sans défilement à taille de texte normale.
- Vérifier clavier, focus, état choisi, progression annoncée et préférence de réduction des animations.
- Tester un nom long, un double appui rapide et une nouvelle identité ; vérifier que rien n’est coupé ou réutilisé par erreur.
- Vérifier qu’aucun mot de passe ni e-mail complet n’est transmis aux questions.

**Validation reçue :** les règles communes et les trois écrans ont été approuvés avant code. Les deux pages d’arrivée sont documentées séparément et implémentées. Le routage utilise le niveau conservé : Débutant, Intermédiaire ou absent vers Découvrir ; Avancé vers Mes entraînements.


## Code, ouverture et vérification

Ouvrir le [parcours depuis la connexion](../01-connexion/index.html) ou [les questions seules](../01-connexion/index.html#questions) dans un navigateur. Aucun serveur ni installation ne sont requis. La page HTML commune contient la structure ; les contenus des trois questions restent dans leurs dossiers respectifs.

- [questions.js](questions.js) : transitions, sélection, retour, passage et réponses en mémoire.
- [styles.css](styles.css) : composition compacte et états des questions, utilisant la palette de connexion.
- [01-niveau/niveau.js](01-niveau/niveau.js), [02-objectif/objectif.js](02-objectif/objectif.js), [03-materiel/materiel.js](03-materiel/materiel.js) : titre et options propres à chaque écran.

Les réponses sont conservées uniquement en mémoire pendant la visite, sans stockage local ni service distant. Recharger réinitialise ce parcours. La comparaison d’identité reste dans la connexion ; les questions reçoivent seulement le nom d’affichage et l’indication de commencer un nouveau profil si nécessaire.

Vérifications du 3 octobre 2026 : connexion par nom, par e-mail et inscription ; nom personnalisé ; passage direct et progression ; correction par retour ; passage sur les trois étapes et après retour ; maintien des réponses pour une même identité et remise à zéro pour une autre ; protection contre le double appui. Les trois options et « Passer le reste » restent visibles sans défilement à 320 × 568 et 390 × 844 px, taille de texte normale. Nom long, activation clavier, focus et réduction des animations vérifiés. Ouverture directe depuis le disque et accès isolé aux questions vérifiés ; captures relues ; aucune erreur JavaScript ni requête externe observée.
