# Écran 01 — Connexion et création de compte

**Date :** 2026-10-03 · **Responsables :** Yahya et Marie<br>
**État :** documentation validée dans l’échange du 3 octobre 2026 ; première page implémentée et vérifiée.<br>
**Utilisateur de référence :** Thomas · **Support :** mobile.

## 1. Objectif et périmètre

Permettre à Thomas d’entrer dans le parcours avec un formulaire familier et court : se connecter avec son e-mail ou son nom d’utilisateur, ou créer un compte avec e-mail, nom d’utilisateur et mot de passe.

La première page comprend deux modes, Connexion et Créer un compte. Elle donne aussi accès à la récupération du mot de passe. L’objectif est de comprendre les actions et leur destination, sans détour ni éléments promotionnels.

La connexion est un préalable au parcours du prototype ; elle n’est pas une nouvelle branche ajoutée à l’arbre validé. Elle donne accès aux questions rapides qui préparent T1.1.1, puis à la découverte liée à T1.1.3. La lisibilité des accès rejoint T5.1. Thomas étant à l’aise avec le numérique, une interaction familière suffit ; sa priorité reste d’atteindre rapidement les séances.

### Choix confirmés dans l’échange

- Connexion : e-mail **ou** nom d’utilisateur, puis mot de passe.
- Création de compte : e-mail, nom d’utilisateur et mot de passe.
- Présence de « Mot de passe oublié ? ».
- Style très sobre, simple, sans effets voyants ; au plus un petit symbole sportif ou logo.
- Palette : `#B91C1C`, `#F87171`, `#111827`, `#FEF2F2`.
- Libellés français et accès pour afficher ou masquer le mot de passe.
- Après entrée réussie dans ce premier parcours, afficher la première des trois questions rapides.

### Déclinaison validée pour cette page

Connexion affichée par défaut ; deux onglets textuels pour changer de mode ; symbole d’haltère discret ; disposition et dimensions décrites ci-dessous ; récupération dans une petite fenêtre attachée à cette page ; règles de simulation et messages du formulaire.

Ces propositions ne sont pas présentées comme déjà évaluées auprès des utilisateurs.

## 2. Informations affichées

| Élément | Contenu proposé | Présentation et utilité |
| --- | --- | --- |
| Symbole | Petite haltère stylisée | En haut, centrée ; évoque le sport sans occuper l’écran ni inventer un nom de marque |
| Choix du mode | « Connexion » / « Créer un compte » | Deux onglets textuels ; le mode courant est explicite |
| Titre, connexion | « Connexion » | Titre principal, immédiatement identifiable |
| Texte, connexion | « Retrouve tes entraînements. » | Une phrase courte qui rappelle la destination |
| Titre, création | « Créer un compte » | Remplace le titre lorsque le mode change |
| Texte, création | « Prépare ton premier entraînement. » | Indique l’intention, sans promesse ni slogan supplémentaire |
| Champs | Libellés permanents au-dessus des zones de saisie | Restent visibles une fois les champs remplis |
| Aide du mot de passe | « Afficher » puis « Masquer » | Commande textuelle à droite dans le champ ; son rôle est compréhensible sans icône seule |
| Récupération | « Mot de passe oublié ? » | Lien secondaire sous le mot de passe, dans le mode connexion |
| Action principale | « Se connecter » ou « Créer mon compte » | Un seul bouton principal, pleine largeur du formulaire |
| Message d’erreur | Phrase liée au champ concerné | Placée sous le champ ; explique la correction attendue |

Les exemples de saisie ne remplacent jamais les libellés. Aucun compteur, statistiques, record ou donnée d’entraînement n’est affiché ici : ces informations n’aident pas à entrer dans le parcours.

## 3. Organisation de l’IHM

L’écran forme une colonne unique, dans l’ordre suivant :

1. Marge supérieure et petit symbole sportif.
2. Deux onglets Connexion / Créer un compte.
3. Titre du mode courant et sa phrase d’accompagnement.
4. Champs du formulaire, chacun avec son libellé au-dessus.
5. Lien de récupération, seulement en mode connexion.
6. Bouton principal pleine largeur.

Le formulaire est centré horizontalement. Sur un téléphone, il prend la largeur disponible avec des marges latérales de 24 px ; sur une fenêtre large, sa largeur reste limitée à environ 360 px. Son contenu reste proche du haut de l’écran pour laisser de la place au clavier ; il n’est pas centré verticalement de façon rigide.

Le symbole mesure environ 32 px. Une séparation de 24 à 32 px distingue les groupes ; les champs sont espacés de 16 px et leurs libellés de 8 px. Ces valeurs sont une base à vérifier visuellement, pas un résultat d’évaluation.

Le fond reste uni. Le formulaire n’est pas posé dans une carte avec une grosse ombre : l’espace et l’alignement assurent la hiérarchie. Pas de photographie sportive, de grand visuel décoratif, de dégradé ou d’animation d’entrée.

La barre Découvrir / Mes entraînements / Progrès n’apparaît pas avant l’entrée dans le parcours. Aucune action fixe ne doit recouvrir les champs lorsque le clavier mobile s’ouvre ; le document peut défiler si nécessaire.

## 4. Mode Connexion

| Contrôle | Valeur initiale et règles proposées | Pourquoi |
| --- | --- | --- |
| E-mail ou nom d’utilisateur | Vide ; saisie libre obligatoire ; exemple discret « thomas.dubois » | Une seule zone suffit pour les deux identifiants autorisés |
| Mot de passe | Vide ; obligatoire ; masqué initialement | Forme habituelle, avec possibilité de vérifier la saisie |
| Afficher / Masquer | Masqué par défaut ; conserve la valeur et le curseur | Évite une nouvelle saisie lors d’une vérification |
| Mot de passe oublié ? | Toujours accessible sous le champ | Permet de résoudre le blocage sans détour par la création de compte |
| Se connecter | Disponible ; au clic, vérifie les champs puis poursuit | Un bouton disponible permet d’expliquer les champs manquants plutôt qu’un bouton grisé sans raison |

L’identifiant utilise un clavier de texte : imposer le clavier e-mail serait moins adapté à un nom d’utilisateur. La correction automatique et les majuscules automatiques sont désactivées. L’identifiant peut être proposé par l’autocomplétion, sans que le prototype conserve le mot de passe.

Un identifiant contenant `@` est traité comme un e-mail pour la vérification de format ; sinon, il est traité comme un nom d’utilisateur non vide. Le champ de mot de passe ne révèle ni ne transforme la saisie sans action explicite.

## 5. Mode Créer un compte

Les onglets restent à la même place. Le titre, la phrase, les champs et le bouton changent ; il ne s’agit pas d’une navigation vers une nouvelle page.

| Contrôle | Valeur initiale et règles proposées | Pourquoi |
| --- | --- | --- |
| E-mail | Vide ; obligatoire ; format e-mail ; exemple « thomas@example.com » | Identifie le compte et sert au parcours de récupération |
| Nom d’utilisateur | Vide ; obligatoire ; exemple « thomas.dubois » | Fournit l’autre identifiant autorisé pour la connexion |
| Mot de passe | Vide ; obligatoire ; masqué initialement, affichable | Réutilise la même interaction que la connexion |
| Créer mon compte | Vérifie les champs puis ouvre les questions rapides | La création sert à entrer dans le parcours principal |

Le champ e-mail utilise le clavier adapté. Le nom d’utilisateur utilise un clavier de texte, sans majuscules ni correction automatiques.

Cette première maquette n’ajoute pas de champ de confirmation du mot de passe : la commande Afficher permet déjà de vérifier la saisie, et le formulaire reste court. Elle n’introduit pas de politique de mot de passe réelle ou de vérification d’unicité des comptes. Ces règles appartiendraient à un système d’authentification complet, absent de cette version.

Changer de mode garde les valeurs e-mail et nom d’utilisateur en mémoire pour cette visite si elles sont déjà saisies. Le mot de passe est vidé et de nouveau masqué ; les erreurs du mode quitté sont effacées. Aucun champ n’est transmis ou enregistré durablement.

## 6. Mot de passe oublié

**Présentation validée :** petite fenêtre de récupération ouverte au-dessus de la page de connexion. Elle constitue un état de cette page, documenté ici ; aucun écran complet de récupération n’est conçu par anticipation.

Contenu, dans l’ordre :

1. Titre « Réinitialiser le mot de passe ».
2. Phrase « Indique l’e-mail associé à ton compte. ».
3. Champ « E-mail », prérempli seulement si l’identifiant de connexion ressemble à un e-mail valide ; sinon vide.
4. Bouton « Envoyer le lien ».
5. Action secondaire « Revenir à la connexion ».

Le fond de la fenêtre utilise `#FEF2F2`, son texte `#111827` et son action principale `#B91C1C`. Elle reprend les champs du formulaire ; pas de nouveau style décoratif. Le clavier et le défilement ne doivent pas masquer les actions.

Après saisie d’un e-mail valide, la démonstration affiche « Simulation : aucun e-mail n’a été envoyé. » et propose le retour à la connexion. Le parcours de messagerie et le changement effectif du mot de passe ne sont pas simulés au-delà de ce point.

Au retour, l’identifiant et le mot de passe du formulaire de connexion restent inchangés en mémoire. La fenêtre de récupération ne modifie pas ces valeurs ; seul un changement de mode vide le mot de passe. La fermeture ne soumet pas le formulaire principal. Le focus revient au lien qui a ouvert la fenêtre ; celle-ci est également refermable au clavier.

## 7. Actions, transitions et données conservées

| Action | Effet | Destination | Données conservées |
| --- | --- | --- | --- |
| Ouvrir la page | Afficher le formulaire vide de connexion | Mode Connexion | Aucune donnée initiale |
| Choisir Créer un compte | Changer le formulaire, le titre et le bouton | Mode Créer un compte, même page | Identifiants saisis en mémoire ; mot de passe vidé |
| Choisir Connexion | Revenir au formulaire court | Mode Connexion, même page | Identifiants saisis en mémoire ; mot de passe vidé |
| Afficher / Masquer | Changer la visibilité du mot de passe | Même formulaire | Valeur inchangée |
| Soumettre des champs invalides | Afficher les messages ; placer le focus sur le premier champ à corriger | Même formulaire | Saisies conservées pour correction |
| Se connecter avec un formulaire valide | Simuler l’entrée ; vider le mot de passe | Première question : niveau | Seulement le nom de démonstration si nécessaire au parcours |
| Créer mon compte avec un formulaire valide | Simuler la création et l’entrée ; vider le mot de passe | Première question : niveau | Seulement le nom de démonstration si nécessaire au parcours |
| Mot de passe oublié ? | Ouvrir la fenêtre courte de récupération | Fenêtre Réinitialiser le mot de passe | Identifiant de connexion en mémoire |
| Envoyer le lien avec e-mail valide | Afficher le message explicite de simulation | État de confirmation de la fenêtre | Pas d’envoi ni de stockage d’e-mail |
| Revenir à la connexion | Fermer la fenêtre et rendre le focus au lien d’origine | Mode Connexion | Identifiant initial conservé |
| Recharger la page | Revenir au formulaire initial | Mode Connexion | Pas de conservation des identifiants ou mots de passe par le prototype |

Les [trois questions rapides](../02-questions-rapides/README.md) sont documentées et implémentées dans leur propre dossier. Après validation séparée des questions, la réussite ouvre directement la question de niveau, personnalisée avec le nom d’utilisateur ou la partie de l’e-mail avant `@`. Aucun compte réel n’est créé.

## 8. États et messages

- **Initial :** connexion sélectionnée, champs vides, mot de passe masqué, aucune erreur affichée.
- **Saisie :** libellés toujours visibles, focus explicite et valeurs modifiables.
- **Identifiant vide :** « Saisis ton e-mail ou ton nom d’utilisateur. ».
- **E-mail incorrect :** « Saisis une adresse e-mail valide. ».
- **Nom d’utilisateur vide en création :** « Choisis un nom d’utilisateur. ».
- **Mot de passe vide :** « Saisis ton mot de passe. ».
- **Correction :** retirer le message lorsque le champ devient valide ; ne pas effacer les autres champs.
- **Réussite de démonstration :** accès direct à la première question avec le nom personnalisé, sans message de confirmation intermédiaire. Le cadre de démonstration garde la simulation explicite.
- **Récupération :** erreur sur l’e-mail si nécessaire, sinon confirmation de simulation ; retour toujours disponible.

Une bordure et un message identifient les erreurs ; la couleur seule ne suffit pas. La vérification a lieu à la soumission puis lors de la correction d’un champ déjà signalé, pour éviter d’afficher des erreurs avant que Thomas ait pu répondre.

La maquette ne prétend pas vérifier un mot de passe auprès d’un serveur : elle ne présentera donc pas « mot de passe incorrect » après une vérification inexistante.

## 9. Style et accessibilité

### Palette et rôles

| Couleur | Utilisation | Justification |
| --- | --- | --- |
| `#FEF2F2` | Fond de page, surfaces des champs et texte clair du bouton principal | Fond léger et cohérent ; peu de masses colorées |
| `#111827` | Titres, libellés, saisies, textes d’aide et symbole sportif | Rend le contenu prioritaire et lisible |
| `#B91C1C` | Bouton principal, lien de récupération, indicateur du mode actif, focus et messages d’erreur | Réserve la couleur forte aux actions et repères utiles |
| `#F87171` | Accent discret, par exemple petite ligne du symbole ou surface d’un message | Respecte la palette sans créer de grandes zones voyantes |

Les bordures neutres peuvent utiliser `#111827` avec une faible opacité. `#F87171` n’est pas employé seul pour du petit texte sur le fond clair. Calculs sur les couleurs pleines : texte `#111827` sur `#FEF2F2`, contraste 16,22:1 ; `#B91C1C` sur `#FEF2F2`, 5,91:1 ; texte sombre sur `#F87171`, 6,41:1. Le rouge clair sur le fond clair atteint seulement 2,53:1.

### Typographie, dimensions et composants

- Police système sans empattement ; pas de chargement de police externe pour cette première page.
- Titre autour de 28 px, graisse 600 ; corps et saisies 16 px ; aides 14 px, avec un interligne confortable.
- Champs et bouton principal d’environ 48 px de haut ; contours fins, arrondi modéré d’environ 8 px.
- Onglet sélectionné repéré par texte plus marqué, soulignement rouge et état accessible ; pas de gros bouton décoratif supplémentaire.
- Logo discret en trait sombre ; une seule petite touche rouge facultative.
- Pas d’effet lumineux, d’ombre marquée ni de mouvement décoratif.

Les champs sont liés à leurs libellés et les erreurs à leurs champs. La commande Afficher / Masquer annonce son état. Les actions restent accessibles au clavier ; le focus est visible. Les zones tactiles, y compris autour des liens et de la commande du mot de passe, gardent une hauteur utile d’au moins 44 px.

La fenêtre de récupération retient le focus pendant son ouverture et le restitue à la fermeture. À 320 px de largeur, le formulaire doit rester en une colonne sans défilement horizontal ; le défilement vertical reste possible sur un écran court ou avec le clavier ouvert.

## 10. Choix et alternatives

| Choix | Alternative envisagée | Raison du choix et limite |
| --- | --- | --- |
| Un identifiant e-mail ou nom d’utilisateur | Deux champs distincts en connexion | Réduit la saisie et respecte les deux moyens d’accès demandés ; le libellé doit rester explicite |
| Deux modes sur la même page | Deux pages d’entrée indépendantes | Permet de changer facilement sans détour ; l’état du mode doit être visible |
| Connexion par défaut | Création de compte par défaut | Convention simple pour une page d’accès ; l’évaluation dira si Thomas voit immédiatement l’autre mode |
| Trois champs en création | Confirmation du mot de passe, profil et objectifs dès l’inscription | Évite de mélanger compte et préparation de séance ; les objectifs arrivent dans les questions rapides |
| Afficher / Masquer textuel | Icône d’œil seule | Action compréhensible sans reconnaître une icône ; consomme un peu de largeur dans le champ |
| Petite fenêtre de récupération | Page séparée avec navigation supplémentaire | Garde le contexte de connexion ; à revoir si le contenu devient plus long |
| Petit symbole sportif | Photo ou grand visuel promotionnel | Évoque le domaine en conservant l’espace pour le formulaire ; ne remplace pas une identité de marque validée |
| Rouge réservé aux actions | Grand fond rouge ou nombreuses zones d’accent | Hiérarchie plus sobre, conforme à la demande ; une erreur nécessite aussi un texte pour se distinguer de l’action |

## 11. Données et limites du prototype

Exemples fictifs : nom d’utilisateur `thomas.dubois`, e-mail `thomas@example.com`. Le mot de passe est choisi pour la démonstration et n’est pas conservé dans un fichier, le stockage local ou une URL. La connexion et la création sont simulées après contrôle des champs requis et de leur format ; aucune requête d’authentification ou de récupération n’est envoyée.

Pour que la simulation soit compréhensible, une mention de démonstration sera placée dans le cadre de présentation du prototype, distinct du formulaire : utiliser des données fictives, aucune authentification réelle. La récupération reste explicite sur la simulation ; le parcours de questions reste dans le même cadre de démonstration.

Le premier livrable de code est limité à cette page et ses états. Les fichiers de présentation et d’interactions sont dans `01-connexion/`, séparés de la documentation. Les questions ont été conçues et validées séparément ; elles sont désormais reliées à cette page. Les deux pages d’arrivée sont documentées pour validation avant code.





## 13. Code et vérification

Ouvrir [index.html](index.html) dans un navigateur ; aucun serveur ni installation ne sont nécessaires.

- [index.html](index.html) : structure des formulaires, fenêtre de récupération et support des trois questions, dont les contenus et interactions sont dans leur dossier.
- [styles.css](styles.css) : palette, mise en page mobile et états visuels.
- [connexion.js](connexion.js) : changement de mode, validations, affichage du mot de passe, récupération et transition vers les questions avec le nom personnalisé.

Vérifications du 3 octobre 2026 : connexion par e-mail et nom d’utilisateur, inscription, champs requis et correction des erreurs, valeurs conservées entre modes et mots de passe vidés, affichage/masquage avec conservation du curseur, récupération avec préremplissage d’e-mail, fermeture par Échap et retour du focus, messages de simulation. Les onglets ont été vérifiés au clavier ; les trois vues restent sans débordement horizontal à 320, 390 et 1280 px. Captures relues ; aucune erreur JavaScript ni requête externe observée pendant le parcours.

Les [questions rapides](../02-questions-rapides/README.md) sont désormais implémentées après validation de leur documentation ; les pages Découvrir et Mes entraînements sont également implémentées, avec une arrivée selon le niveau. Le retour depuis la première question garde les réponses de la même identité pendant cette visite et revient à la connexion sans mot de passe.
