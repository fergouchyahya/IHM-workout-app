# Audit ergonomique du prototype — Cours 5 et 6

Audit initial : 21 octobre 2026. Mise à jour : **22 octobre 2026 — 20 propositions livrées et vérifiées, 29 restantes**. La liste ci-dessous ne contient plus les points terminés. Les identifiants d’origine sont conservés ; les comptes rendus des deux lots figurent en sections 11 et 12.

## 1. Périmètre et méthode

Lecture des **40 pages PDF, soit 79 diapositives**, de `Cours5.pdf` et `Cours6.pdf`, extraction du texte et examen des pages rendues, notamment les schémas Gestalt/ICS, les exemples QOC, Fitts, Keystroke et UAN. Ces deux supports restent locaux et sont désormais exclus par `.gitignore` ; cette synthèse conserve les concepts utiles au projet.

Relecture du code HTML/JS/CSS de tous les écrans existants, des README, des personas Thomas/Greg et de l’arbre commun T1–T5. Le périmètre couvre accès, questions rapides, découverte/import, calendrier, création/semaine/mésocycle, préparation, T2.1–T2.4, consultation des bilans et Partages déjà implémenté. Les comparaisons, records et conclusions T3 restent hors de cet audit de l’existant.

Essais Chromium dans un profil isolé `audit.cours56`, avec des données fictives : parcours jusqu’au bilan, préparation, clavier, préférences, calendrier, création de mésocycle, semaine type, notes et aperçu du partage. Mesures de disposition à 390 × 844 ; calendrier également examiné à 320 et 1280 px. Les données initiales de la séance ont été injectées pour obtenir un cas reproductible, puis les actions ont utilisé les contrôles de l’interface. Les autres profils n’ont pas été nettoyés.

**Nature des conclusions :**

- **C** : constat établi par lecture du code ; nom du module et de la méthode indiqués.
- **V** : constat également reproduit dans le navigateur.
- **H** : hypothèse de conception à éprouver avec des utilisateurs ; le gain n’est pas annoncé comme acquis.
- **P0** : corriger en premier une incohérence de contrôle, de conservation ou de saisie.
- **P1** : amélioration importante sur un parcours fréquent.
- **P2** : amélioration de confort ou variante à comparer avant adoption.

La clôture fonctionnelle de T1/T2 ne constitue pas une validation ergonomique auprès d’utilisateurs. Cet audit précise ce qu’il reste à améliorer ; il ne prétend pas que les fonctions livrées sont toutes défaillantes.

## 2. Ce que les cours apportent à la conception

| Source précise | Application au prototype |
| --- | --- |
| Cours 5, diapositives 2–3 : guidage, incitation, groupement/distinction, feedback, lisibilité | Rendre immédiatement identifiables le jour, l’exercice, la série, la cible, l’état de sauvegarde et l’action suivante. |
| Cours 5, diapositives 4–10 : Gestalt, clôture, similitude, proximité, symétrie, continuité, mouvement parallèle | Grouper cible/résultat/statut d’une même série ; garder des colonnes et composants réguliers ; un déplacement doit faire suivre ensemble l’objet et son feedback. Les décorations seules ne justifient pas un changement. |
| Cours 5, diapositives 11–14 : ICS, structuration de l’affichage | Le regroupement visuel change le regroupement mental. Une ligne par série, avec unités stables, facilite la correspondance entre le prévu et le réalisé ; des cases et menus éloignés imposent davantage de recodage. |
| Cours 5, diapositive 15 : brièveté, actions minimales, densité | Retirer répétitions, états vides et saisies inutiles ; conserver les informations nécessaires à la tâche. Tout replier n’est pas une solution si cela cache les cibles. |
| Cours 5, diapositives 16–18 : contrôle explicite et adaptabilité | Pas de résultat inventé, propagation explicite au mésocycle, sortie/reprise possibles ; voie simple et voie rapide facultative. Un clic supplémentaire peut être justifié par une conséquence importante. |
| Cours 5, diapositives 19–27 : erreurs, cohérence, signifiance, compatibilité | Prévenir l’erreur au bon endroit ; garder les saisies ; employer les mots de l’utilisateur ; organiser selon les tâches, en tenant compte du téléphone et de la fatigue entre séries. |
| Cours 5, diapositives 28–30 : QOC | Documenter la question, les options, leurs critères et le compromis retenu. Une proposition de cet audit n’est pas encore une décision validée. |
| Cours 6, diapositives 3–16 : processeur humain, Fitts, mémoire | Réduire les déplacements, agrandir les cibles pertinentes, présenter les repères plutôt que demander de les mémoriser. Le « 7 ± 2 » présenté en cours n’est pas une règle obligeant toute page à avoir sept éléments. |
| Cours 6, diapositives 17–27 : GOMS | Définir le but, les opérateurs, les méthodes et la règle de sélection. Exemple : saisir manuellement une série différente ; recopier explicitement une série réellement identique. |
| Cours 6, diapositives 28–38 : Keystroke | Comparer des méthodes connues pour un même but, sans erreur, avec opérateurs K/P/H/M/R ; placer M avec les règles d’anticipation. Le modèle ne mesure pas l’apprentissage ou la récupération d’erreur. |
| Cours 6, diapositives 39–49 : UAN | Décrire pour chaque action le feedback et l’état produit, ainsi que les interruptions/reprises. Une réduction de clics n’est valide que si le résultat et le contrôle sont conservés. |

### Bonnes bases à préserver

- Saisies T2 conservées directement, sans bouton de validation par série.
- Cibles initiales, adaptations et résultats réels séparés.
- Zéro et absence distingués ; une série vide n’est pas déclarée non faite.
- Recopie explicite du résultat d’une série faite, avec annulation.
- Modification d’une série limitée à cette série ; extension T1 limitée au mésocycle choisi.
- Recherche d’exercice et choix direct ; alternatives du même groupe en premier ; remplacement avec cibles vides.
- Calendrier principal, dates réelles, plusieurs séances possibles par jour, liste personnelle repliable en bas.
- Reprise des brouillons, profils séparés, médias privés, correction ciblée depuis la revue.
- Aperçu avant publication et confirmation finale avant conservation d’un bilan.

## 3. Constats visuels et comportementaux reproduits

Le cas témoin comporte deux exercices, quatre puis trois séries, avec charge/répétitions/RPE et sans notes personnelles.

| Observation | Résultat | Interprétation limitée à ce cas |
| --- | --- | --- |
| Premier champ de résultat T2, 390 × 844 | Haut à **655 px**, bas à 703 px, champ haut de 48 px | Il est visible sans clavier, très bas pour une saisie avec clavier virtuel. Le comportement réel du clavier mobile reste à tester. |
| Hauteur totale de T2, quatre séries affichées | **2 251 px** | La répétition des cartes et commandes augmente le défilement. Ce n’est pas un temps mesuré. |
| Préparation en édition, deux exercices | **2 638 px** | Les champs facultatifs déployés contribuent fortement à la longueur. |
| Revue, sept séries dont six non renseignées | **2 427 px** | Une présentation condensée mérite comparaison. Les omissions doivent rester apparentes. |
| Début de l’agenda en vue mois, 390 × 844, depuis le haut | **855 px** environ | Le contenu du jour se situe après la première fenêtre, avant même de tenir compte du bas de navigation. |
| Largeur d’une cible de date en vue mois | **39,8 px à 320 px**, **49,8 px à 390 px**, **101,6 px à 1280 px** | La hauteur mesurée est 77 px ; la dimension étroite reste petite à 320 px. Une hauteur minimale ne garantit pas une grande cible dans les deux dimensions. |
| Contrôles de suivi sommeil/fatigue/douleur/notes décochés en préparation | Le contexte et les notes sont tout de même proposés dans T2 | Seule l’option RPE pilote réellement son choix de champ. Les autres cases ne constituent pas actuellement des commandes de visibilité fiables. |
| T2 sans RPE, Entrée depuis Répétitions de série 1 | Focus sur Charge de série 2 | Le menu Ressenti de la même série est sauté. |
| Entrée sur le temps disponible dans le dialogue de disponibilités | Dialogue reste ouvert, champ conserve le focus | Le gestionnaire global intercepte Entrée sans soumettre ce formulaire. La suite doit être définie dans le dialogue actif. |
| Suivant dans T2 | Focus retombe sur `body` après reconstruction | Un utilisateur clavier doit retrouver le contrôle utile. |
| Occurrence terminée, ouverture de la carte principale | Boutons Adapter et Déplacer/Dupliquer encore présents ; CTA Voir le bilan | Les objectifs du calendrier restent modifiables alors que le bilan conserve son instantané indépendant. |
| Navigation et code des préférences | Accès visible dans Calendrier ; retour codé vers Calendrier | Depuis Découvrir, changer de préférence impose d’abord de changer d’espace. L’appel instrumental depuis Découvrir confirme le retour imposé ; ce n’est pas un accès visible supplémentaire. |
| Débordement horizontal | Aucun dans les écrans capturés à 390 px et le calendrier aux trois largeurs | Cela ne valide ni le zoom, ni les lecteurs d’écran, ni le téléphone physique. |
| Console du parcours principal d’audit | Zéro erreur, zéro avertissement | Les difficultés observées sont principalement interactionnelles. |

Une capture pleine page peut montrer une barre fixe au milieu du document ; ce n’est pas, à elle seule, la preuve qu’une information est inaccessible. Les tests à prévoir doivent vérifier le défilement, le focus et le clavier virtuel, pas seulement l’image exportée.

## 4. Les 29 améliorations restantes

### A. Navigation, présentation et conservation transverses

**05 — Vérifier les cibles dans leurs deux dimensions et leur proximité — P1, C/V/H.**

Constat : les boutons ont souvent une hauteur de 44 px, mais les dates à 320 px sont plus étroites ; les liens de série restent petits et nombreux. Proposition : viser des surfaces de commande proches de 44 × 44 px ou plus quand l’espace le permet, élargir les zones de libellé, espacer actions destructive et courante, garder les commandes de saisie près de la ligne. Pour le mois étroit, fournir aussi la vue semaine/agenda et la navigation clavier. Critères : compatibilité ; Fitts. Vérification : dimensions calculées et essais au pouce. **44 px est ici un objectif de conception, pas une mesure issue du cours ni une déclaration de conformité à une norme.**

**06 — Réserver les différences visuelles aux différences de sens — P1, C/V/H.**

Constat : rouge désigne à la fois marque, sélection, série active, cible facultative manquante et erreur ; les nombreux liens rouges attirent tous l’attention. Proposition : conserver les séances rouges et repos verts validés ; ajouter des mots/icônes et des traitements distincts pour actif, incomplet et invalide. Garder les cibles manquantes rouges comme demandé, mais localiser l’accent sur leur état/champ plutôt que rendre chaque carte entière urgente. Critères : groupement/distinction, similitude, signifiance. Vérification : états distinguables sans dépendre seulement de la couleur ; parcours lisible au premier regard.

**07 — Stabiliser vocabulaire, unités et niveau de détail — P1, C/V.**

Constat : kg/RPE, virgule/point, « série(s) », « Mes entraînements », « Calendrier », « Progrès » et « Bilans » ne sont pas encore uniformes partout. Proposition : libellés de tâche courts ; nombres français cohérents ; pluralisation naturelle ; aide locale « RPE : effort ressenti de 1 à 10 ». Les erreurs doivent nommer Charge/Répétitions plutôt que `load/reps`. Critères : signifiance, lisibilité, cohérence. Vérification : préparation, historique précédent, aperçu de partage et bilan affichent tous `22,5 kg` ; aucune clé technique dans une erreur.

**08 — Corriger les contradictions des documents avant la prochaine implémentation — P1, C.**

Constat : le README racine du prototype juxtapose encore « préparation documentaire », arrêt avant bilan, ancienne règle « charge vide = non faite » et clôture T2 ; des textes historiques ne sont pas toujours identifiés comme tels. Proposition : une section d’état actuel faisant foi, historique daté clairement séparé, contrats d’interface et périmètre T3 explicites. Critères : cohérence de la conception et traçabilité QOC. Vérification : README, arbre et comportement ne conduisent pas un futur développement à réintroduire l’ancienne règle de série vide. Ce travail documentaire n’a pas été appliqué dans cet audit, sauf son index.

### B. Accès, questions rapides et découverte

**09 — Ajouter un accès de démonstration sans mot de passe fictif — P2, C/H.**

Constat : le prototype exige un mot de passe non vide sans authentification réelle. Proposition : garder les formulaires pour leur évaluation, et offrir « Essayer avec un profil de démonstration » pour les séances d’évaluation des tâches T1/T2. Ne pas appliquer ce raccourci à une future authentification réelle. Critères : actions minimales, compatibilité. Vérification : un évaluateur atteint le parcours voulu sans saisir de faux secret ; profils isolés. Gain : suppression de la saisie du mot de passe sur ce seul chemin.

**10 — Reprendre les questions inachevées et rendre le retour clair — P2, C/H.**

Constat : les trois réponses sont rapides et facultatives, mais leur brouillon n’est pas conservé au fil de chaque choix comme les autres formulaires ; l’avancement est automatique. Proposition : conserver les réponses partielles par profil, annoncer brièvement le choix, rendre « Réponse précédente » compréhensible. Garder le choix en un appui et les deux possibilités de passer ; ne pas ajouter un bouton Continuer à chaque écran. Critères : feedback, expérience, correction. Vérification : recharge à la deuxième question puis reprise avec la première réponse, sans réinitialiser les séances.

**11 — Rendre les préférences accessibles sans détour par Calendrier — P1, C/V/H.**

Constat : le bouton est dans `Entrainements.render`, et l’édition termine dans `mine`. Proposition : accès compact commun depuis les espaces principaux, puis retour à l’espace et au filtre d’origine. Critères : compatibilité, contrôle, cohérence. Vérification : depuis Découvrir, modifier un seul matériel puis retrouver la même recherche, sans parcourir Calendrier. Le changement ne doit pas réinitialiser les programmes.

**12 — Expliquer la personnalisation réelle — P1, C.**

Constat : « Séances pour toi » dépend de toute valeur du profil ; le filtrage des séances utilise surtout niveau/matériel/filtres, pas l’objectif sportif, et trie par durée. Proposition : dire « Selon tes filtres » et afficher les critères effectifs ; n’annoncer l’usage de l’objectif que lorsqu’un contenu compatible existe. Utiliser le budget temps comme repère ou filtre explicite. Critères : signifiance, guidage, confiance. Vérification : deux profils qui ne diffèrent que par objectif ne reçoivent pas une promesse de personnalisation inexistante.

**13 — Donner un résultat de recherche global cohérent — P1, C/V/H.**

Constat : la recherche annonce séances et programmes mais leurs comptes/états vides sont séparés ; un groupe « aucune séance » peut coexister avec un programme trouvé. Proposition : compteur explicite par type et total ; filtres actifs visibles ; en cas de vide, retirer un filtre précis plutôt qu’effacer obligatoirement toute la recherche. Conserver l’application immédiate des filtres, avec bouton « Voir les résultats ». Critères : feedback, brièveté, correction. Vérification : recherche ne trouvant qu’un programme, puis retrait d’un seul filtre sans perdre le texte.

**14 — Donner un accès direct aux favoris dans Découvrir — P2, C/H.**

Constat : les favoris se retrouvent en bas de la liste personnelle repliée. Proposition : filtre « Favoris » dans Découvrir, sans troisième méthode d’enregistrement ; garder l’état favori distinct de la copie et du placement. Critères : reconnaissance plutôt que rappel, actions minimales. Vérification : favori retrouvé sans changer d’espace ni dérouler la liste personnelle.

**15 — Enregistrer puis préparer sans retour intermédiaire — P1, C/H.**

Constat : un premier enregistrement dans le récapitulatif affiche un message et un accès au calendrier ; réappuyer sur le même bouton permet déjà d’ouvrir la copie. Proposition : après enregistrement, proposer clairement « Préparer ma copie » dans le même panneau, et montrer « Déjà enregistré » sur la carte. Conserver Favori/Enregistrer/Planifier comme effets distincts. Critères : guidage, actions minimales. Vérification : une seule copie, source conservée ; ouverture de l’éditeur sans rechercher à nouveau la séance. Aucun démarrage imposé depuis Découvrir.

**16 — Rendre les grands aperçus de programme progressifs — P1, C/H.**

Constat : `Programmes.open`, l’aperçu et le détail du partage peuvent dérouler toutes les semaines et tous les exercices ; l’action utile est en bas. Proposition : résumé semaine/durée/répartition d’abord, semaines dépliables, variations mises en évidence, action Importer/Publier toujours accessible sans masquer le contenu. Critères : densité, proximité, ICS. Vérification : un cycle long reste inspectable et sa portée est claire ; importer ne planifie toujours aucune date automatiquement.

### C. Calendrier et reprise

**18 — Séparer sélection d’un jour et demande d’ajout — P2, C/V/H.**

Constat : un jour rempli sélectionne ; un jour vide sélectionne puis ouvre immédiatement un panneau. Proposition à comparer : un appui sélectionne toujours, le bouton + du jour ouvre l’ajout ; garder un raccourci explicite « Ajouter ici » si l’accès direct est préféré. Critères : cohérence et contrôle. Cette variante **peut ajouter un appui** sur jour vide : elle n’est à retenir que si elle réduit les ouvertures involontaires et les fermetures. Vérification : tâche « consulter une date vide », puis tâche « ajouter », avec taux d’erreurs.

**19 — Accéder directement à une date éloignée — P1, C/H.**

Constat : seules les flèches de période et Aujourd’hui sont proposées. Proposition : titre mois/année activable avec choix de date ; garder les flèches pour les dates proches. Critères : flexibilité ; règle de sélection GOMS proche/loin. Vérification : atteindre un mois dans six mois sans six changements de période ; conserver la date choisie au retour.

### D. Création et préparation T1

**24 — Alléger la création commencée depuis un jour — P1, C/H.**

Constat : `creationDate` préremplit Séance seule mais laisse le formulaire complet d’organisation. Proposition : mode court « Nouvelle séance · [date] », nom et accès immédiat aux exercices ; lien secondaire pour créer un programme. Garder les autres options pour une création hors calendrier. Critères : brièveté, compatibilité, incitation. Vérification : la date n’est automatiquement choisie que depuis un jour du calendrier ; aucun autre champ n’est rempli par supposition.

**25 — Configurer rapidement les jours d’une semaine — P1, C/H.**

Constat : chaque jour a son dialogue, choix du contenu et sauvegarde ; copie et déplacement existent mais restent individuels. Proposition : mode « Modifier plusieurs jours », sélection puis Repos/À définir ; duplication d’une séance existante vers les jours sélectionnés, avec effet explicite et annulation. Critères : actions minimales, flexibilité. Vérification : plusieurs repos configurés en une opération ; exercices et cibles indépendants après copie ; destination occupée signalée. Garder l’édition individuelle comme méthode simple.

**26 — Clarifier ce que fait un gabarit — P1, C/H.**

Constat : Full Body/Upper-Lower/PPL donnent des catégories pour nommer les jours ; ils ne remplissent pas leur répartition. Ce comportement est documenté « sans jours imposés », donc ce n’est pas un générateur défaillant. Proposition : libellé « Catégories pour nommer mes séances » et aperçu des catégories ; si une répartition suggérée est souhaitée, la proposer séparément avec aperçu et confirmation, jamais automatiquement. Critères : signifiance, incitation. Vérification : l’utilisateur sait ce qu’il obtiendra avant de choisir ; aucun repos ou exercice inventé.

### E. Réalisation et enrichissements T2

**36 — Faciliter la recopie sans généraliser un résultat réel — P2, C/H.**

Constat : « Même résultat que série 1 » recopie explicitement charge, répétitions, RPE/ressenti, ce qui est déjà rapide et annulable. Proposition : garder ce raccourci et offrir, si les essais le justifient, une reprise de charge seule pour les séries dont les répétitions ou l’effort diffèrent. Dire exactement quelles valeurs seront reprises et montrer le statut obtenu. Critères : actions minimales, contrôle. Vérification : reprendre une charge ne marque pas une série faite et ne crée ni répétitions ni RPE ; aucune recopie d’historique antérieur sans action explicite.

**37 — Distinguer série sélectionnée, série renseignée et série réalisée — P1, C/H.**

Constat : le focus définit la série active, et le libellé CSS ajoute « en cours » ; cela peut être lu comme un état d’exécution. Proposition : utiliser « Sélectionnée » pour le focus et une marque/étiquette distincte pour Faite/Interrompue/Non faite/Partielle. Afficher un petit bilan d’avancement de l’exercice et rendre le passage à la série suivante accessible sans déclaration automatique. Critères : signifiance, feedback, contrôle. Vérification : cliquer une ancienne série ne donne pas l’impression de recommencer son effort ; une saisie partielle reste partielle.

**38 — Éviter de demander plusieurs fois le même contexte — P1, C/H.**

Constat : état En forme/Fatigué/Gêne, fatigue, douleur, contexte libre et raison générale d’adaptation se superposent ; RPE, effort choisi et ressenti final sont moins clairement distingués. Proposition : choix global rapide facultatif, puis précisions dépliables ; expliciter « avant séance », « effort réel de cette série », « bilan après séance ». Un seul champ de contexte général ; raisons par série restent liées à leur cas particulier. Critères : brièveté, groupement, signifiance. Vérification : noter une nuit courte ou un matériel différent une seule fois, sans perdre l’information à la revue.

**39 — Modifier un réglage utilisé à côté du réglage affiché — P1, C/H.**

Constat : Notes ouvre le volet et focalise Remarque technique ; pour changer le banc, il faut ensuite atteindre le deuxième champ. Proposition : action « Réglage utilisé » près du réglage, ouvrant et focalisant ce champ ; le bouton Notes garde son rôle général. Proposer le réglage précédent comme référence, pas comme saisie réelle certaine. Critères : proximité, Fitts, actions minimales. Vérification : passer de Banc 2 à Banc 3 sans chercher dans les notes, sans modifier le programme prévu. Calcul section 5.

**40 — Rendre les opérations de médias et leur annulation visibles — P1, C/H.**

Constat : les limites et erreurs existent ; les écritures sont asynchrones, la confirmation finale demande d’attendre, et une annulation média peut se terminer après que l’avis commun a disparu. Proposition : état « Ajout de 2 fichiers… », succès par fichier, Réessayer sur celui en échec ; annulation conservée tant qu’elle échoue ou travaille ; compteurs explicites. Charger l’aperçu à l’ouverture des détails si cela évite du travail inutile, sans promettre un gain non mesuré. Critères : feedback, contrôle, correction. Vérification : média lent/manquant/refusé, fermeture et retour au volet ; aucun faux succès, référence et fichier restent cohérents.

**41 — Proposer un repos chronométré facultatif à portée de la série — P2, C/H.**

Constat : un minuteur facultatif est mentionné dans le README, mais pas livré dans le code T2. Proposition : si retenu, bouton Repos avec durée réutilisable, pause/reprise et fermeture, sans démarrage obligatoire ni changement des résultats ; aucune notification imposée. Critères : compatibilité avec l’activité, contrôle. Vérification : utilisable sans empêcher la saisie ou la consultation de consignes. C’est une petite extension fonctionnelle à valider, pas une correction nécessaire au Keystroke ni une fonction déjà présente.

### F. Revue et consultation du bilan

**43 — Corriger sans perdre l’endroit de la revue — P2, C/H.**

Constat : le lien existant conduit déjà à la bonne série ; revenir à la revue ajoute une navigation et peut obliger à relocaliser la ligne. Proposition : conserver ce chemin et garantir le retour exact ; comparer avec une petite correction en ligne du brouillon avant confirmation, autosauvegardée. Critères : correction, actions minimales. Vérification : modifier une seule répétition conserve les autres séries, la position et les adaptations. Aucun champ modifiable ajouté au bilan déjà archivé par cette proposition.

**44 — Garder une confirmation finale explicite mais concise — P1, C/H.**

Constat : le libellé « Conserver avec 6 série(s) non renseignée(s) » devient long, et les catégories de compteur à zéro occupent de la place. Proposition : bouton stable « Terminer et conserver » avec avertissement adjacent « 6 séries non renseignées seront conservées ainsi » ; montrer les compteurs utiles et garder les distinctions consultables. Erreurs bloquantes et omissions autorisées restent distinctes. Critères : lisibilité, signifiance, contrôle. Vérification : aucune série vide convertie en non faite ; la fin reste une seule confirmation délibérée.

**46 — Préparer une liste de bilans qui reste praticable — P2, C/H.**

Constat : `renderHistory` affiche tous les bilans sans recherche ni regroupement ; pour un seul bilan cela suffit. Proposition : regroupement par date et recherche de séance avec tri explicite ; garder les filtres de comparaison et l’analyse pour la conception T3. Critères : guidage, densité, flexibilité. Vérification : retrouver une séance parmi trente, puis retour conservant la recherche. Pas de gain chiffré sans scénario et test.

### G. Partages déjà présents

**47 — Rendre la description facultative et corriger les erreurs dans leur champ — P1, C.**

Constat : l’arbre commun T4.2.2 prévoit description/demande de conseils si utile, mais `renderForm` impose la description ; l’erreur rassemble titre/niveau/description sans détail local. Proposition : description facultative, repères titre/niveau explicites, erreur par champ avec explication et focus ; effacer le message dès correction. Mettre à jour immédiatement le résumé d’audience lorsque le choix change. Critères : brièveté, protection, feedback, cohérence. Vérification : partager sans description si l’utilisateur le souhaite ; l’aperçu conserve l’audience réellement choisie.

**48 — Supprimer la confirmation redondante de publication si le test confirme sa lisibilité — P2, C/H.**

Constat : aperçu, case « Je confirme » puis bouton « Confirmer la publication ». Proposition : conserver l’aperçu et une action finale explicite « Publier dans la communauté » ou « Partager avec mes contacts », sans case supplémentaire ; mise à jour et republication nommées distinctement. Critères : actions minimales **et** contrôle explicite. Vérification : compréhension de l’audience avant l’action et aucune publication au choix du programme. Si la suppression de la case augmente les publications involontaires, garder la version protégée. Calcul section 5.

**49 — Faciliter le choix et la réparation du contenu à partager — P1, C/H.**

Constat : choisir se fait dans une liste sans recherche ; une séance vide est bloquée ensuite, avec un message mais sans raccourci pour la compléter. Proposition : recherche si la liste grandit, indication « À compléter » sur la source, « Compléter cette séance » puis retour au brouillon de partage. Permettre un accès « Partager » depuis une préparation personnelle enregistrée si cela raccourcit le parcours, en gardant toujours l’aperçu. Critères : guidage, correction, actions minimales. Vérification : compléter le contenu ne perd pas titre/audience/description déjà saisis ; données privées toujours exclues.

## 5. Calculs Keystroke et limites

### Hypothèses communes

Modèle du Cours 6, diapositives 29–37. Utilisateur connaissant la méthode, tâche sans erreur, éléments à choisir déjà repérés, point de départ identique. **Ce sont des prédictions desktop, pas des chronométrages utilisateur ni une conversion des gestes tactiles.**

- `K = 0,20 s` : touche ou activation élémentaire d’un bouton. Convention de comparaison : clic simple représenté par un K ; ne pas mélanger avec une autre convention qui compterait séparément pression et relâchement.
- `P = 1,10 s` pour les exemples centraux, avec sensibilité `0,80–1,50 s` du cours.
- `H = 0,40 s` pour passer de la souris au clavier ou inversement lorsque le scénario le demande.
- `M = 1,35 s` au début d’une méthode connue. Pas de M ajouté avant le clic déjà anticipé après P, ni entre les caractères d’une même valeur.
- `R = max(0, n − t)` ; la différence de réponse système n’a pas été mesurée ici. Les tableaux supposent R commun et négligeable pour **la comparaison**, sans affirmer que l’application répond instantanément.
- Défilement, recherche visuelle, clavier virtuel, sélecteur natif, lecture, fatigue, erreurs et récupération sont décrits séparément. Ne pas leur attribuer arbitrairement la valeur de K, P ou M.
- Pas de D ici : aucune tâche de dessin. Un glisser-déposer ne devient pas automatiquement un K unique ni un dessin D.

### Quatre comparaisons de propositions

| Même but et départ | Méthode actuelle | Méthode proposée | Estimation centrale avant → après | Gain conditionnel |
| --- | --- | --- | --- | --- |
| Ajouter quatre exercices déjà repérés, départ éditeur, cibles non saisies | 4 × (Ajouter + choisir) = `M + 8(P+K)` | Ouvrir le choix multiple + quatre sélections + Ajouter les 4 = `M + 6(P+K)` | **11,75 → 9,15 s** | **2 activations**, soit 25 % ; **2,60 s** théoriques, plage 2,00–3,40 s selon P. Même M : les ouvertures répétées font partie de la méthode anticipée. |
| Démarrer une séance prête, départ agenda du jour visible | Carte → aperçu → Commencer = `M + 2(P+K)` | Bouton secondaire Commencer sur carte, aperçu toujours disponible = `M + (P+K)` | **3,95 → 2,65 s** | **1 activation**, **1,30 s**, plage 1,00–1,70 s. Variante de R17 à tester ; le clic sur la carte principale continue d’ouvrir ses détails. Ne pas proposer ce raccourci si un brouillon de préparation attend l’application de modifications. |
| Modifier le réglage utilisé, départ en-tête exercice, texte de n caractères | Notes focalise Remarque → choisir Réglage → saisir = `M + 2(P+K) + H + nK` | Action Réglage utilisé focalise directement le champ → saisir = `M + (P+K) + H + nK` | **4,35 + 0,20n → 3,05 + 0,20n s** | **1 activation**, **1,30 s** ; défilement supplémentaire actuel exclu du calcul. |
| Confirmer une publication dont l’aperçu et l’audience ont déjà été lus | Cocher puis confirmer = `M + 2(P+K)` | Bouton explicite audience = `M + (P+K)` | **3,95 → 2,65 s** | **1 activation**, **1,30 s** ; bénéfice retenu seulement si la compréhension et le contrôle sont conservés. |

Ces chiffres ne s’additionnent pas en « temps gagné par séance » : ils concernent des buts et fréquences différents. Ils ne prouvent pas que les nouvelles interfaces seront plus rapides à découvrir.

### Gain déjà livré à conserver : recopier une série réellement identique

Départ souris, trois résultats vides, valeurs réalisées `20 kg`, `10 répétitions`, `RPE 7`, champs déjà visibles. La méthode souris passe entre trois champs et alterne saisie et souris cinq fois :

```text
Saisie champ par champ : M + 3P + 8K + 5H = 8,25 s
Recopie explicite       : M +  P +  K      = 2,65 s
```

Les 8 K comprennent trois clics et cinq caractères. Gain prédit **5,60 s** pour une série réellement identique. Ce gain appartient à l’existant, pas aux propositions de cet audit. Enchaîner les champs au clavier réduit déjà ce coût ; il serait incorrect de comparer la recopie uniquement à la méthode manuelle la moins efficace pour tous les utilisateurs. Si charge/répétitions/RPE diffèrent, la recopie intégrale n’atteint plus le même but et ce calcul ne s’applique pas.

### Fitts : exemple de sensibilité, pas chronométrage du téléphone

Le cours présente `T = 0,1 × log2(2D/L)`. Pour une distance **hypothétique** de 200 px :

- cible large de 40 px : `T ≈ 0,332 s` ;
- cible large de 50 px : `T ≈ 0,300 s` ;
- cible large de 80 px : `T ≈ 0,232 s`.

Cela illustre l’intérêt d’une grande cible proche. Les 40/50 px ressemblent aux largeurs de calendrier observées, mais D n’a pas été mesurée pour une main réelle. **Ne pas additionner ce T au P du tableau : ce serait compter deux fois la désignation.** Le modèle historique de pointage ne suffit pas à prédire la fatigue ou les erreurs au pouce.

### Règles de sélection GOMS à conserver dans le futur design

| But | Si… | Méthode proposée |
| --- | --- | --- |
| Noter la série | Résultats différents | Saisie directe, progression clavier. |
| Noter la série | Résultats réellement identiques à la précédente faite | Recopie explicite, puis correction éventuelle et annulation. |
| Placer une séance | Une seule date proche | Ajout direct au jour choisi. |
| Placer une séance | Plusieurs dates | Choix groupé ; aperçu des repos remplacés. |
| Choisir une date | Période voisine | Flèches. |
| Choisir une date | Période éloignée connue | Sélection de date/mois. |
| Modifier une cible | Un jour | Sauvegarde directe pour ce jour. |
| Modifier une cible | Prochaines occurrences du mésocycle voulues | Portée explicite, dates et différences, confirmation. |

## 6. QOC : compromis à valider avant développement

| Question | Options | Critères et recommandation |
| --- | --- | --- |
| Comment réduire la hauteur T2 ? | Tout replier ; une série unique ; lignes de toutes les séries avec détails secondaires | **Premier lot livré : séries compactes et cible commune**, avec toutes les séries accessibles. Comparer densité, lisibilité des cibles et erreurs de ligne ; pas seulement la hauteur. |
| Que fait un appui sur une date vide ? | Ajout immédiat actuel ; sélection puis + | Comparer contrôle/prévisibilité et vitesse. Ne pas décider seulement parce que la deuxième option est plus uniforme. |
| Comment traiter les options de suivi ? | Vraie visibilité ; affichage prioritaire ; suppression des cases sans effet | **Premier lot livré : affichage prioritaire + accès facultatif aux autres champs**, sans perte de données. Le sens des cases doit être explicite. |
| Faut-il le bouton Commencer sur l’agenda ? | Aperçu obligatoire actuel ; raccourci facultatif et aperçu conservé | Recommander un raccourci seulement sur séance prête, sans brouillon non appliqué ; comparer vitesse et erreurs de départ. |
| Faut-il supprimer la case de publication ? | Case + bouton ; bouton final nommant l’audience | Recommander l’essai du bouton explicite, avec aperçu maintenu. Ne le conserver que si les erreurs de diffusion n’augmentent pas. |
| Comment corriger un bilan ? | Correction ciblée T2 actuelle ; édition en ligne avant clôture | Sécuriser d’abord le retour exact actuel. Essayer l’édition en ligne si elle réduit effectivement les détours sans confondre brouillon et archive. |

## 7. UAN : exemples simplifiés action → feedback → état

Ces tableaux reprennent la séparation UAN du cours, sans prétendre transcrire ici toute sa notation formelle. `M` en notation UAN de bouton de souris ne doit pas être confondu avec l’opérateur mental M du calcul Keystroke.

| Action utilisateur | Retour d’interface attendu | État du système |
| --- | --- | --- |
| Ajouter au jour choisi | Date dans le titre, liste personnelle, commandes Créer/Repos | Jour sélectionné ; aucun placement avant choix explicite. |
| Choisir une séance personnelle | Carte ajoutée, annonce nom + date, Annuler | Nouvelle occurrence indépendante ; autres séances intactes. |
| Choisir une date contenant un repos | Repos nommé et choix explicite de remplacement | Aucun retrait avant consentement ; retour sans mutation possible. |
| Annuler le placement | Carte retirée, repos précédent rétabli si remplacé | Inverse de cette seule opération. |
| Saisir une répétition invalide | Valeur brute visible, message local explicite | Dernière valeur valide conservée séparément ; confirmation finale bloquée. |
| Corriger le champ | Message levé, statut cohérent, focus stable | Nouvelle valeur valide, autres séries intactes. |
| Commencer une écriture média | État de travail visible | Confirmation de clôture en attente de fin d’écriture. |
| Confirmer le bilan | Succès seulement après conservation | Instantané indépendant, brouillon courant retiré. |
| Conservation échoue | Message de reprise et Réessayer | Brouillon conservé ; aucun faux bilan terminé. |
| Ouvrir une occurrence terminée | Bilan et Retour à l’origine | Lecture seule ; aucune modification des objectifs historiques par navigation ordinaire. |

## 8. Ordre de réalisation conseillé pour les 29 points restants

Vingt propositions sont livrées ; les deux lots sont décrits en sections 11 et 12.

1. **Lisibilité et cohérence : R05–R08, R11–R13, R15–R16, R19, R24–R26, R37–R40, R44, R47, R49.** Cibles tactiles, codes visuels, vocabulaire, préférences, découverte, préparation et enrichissements.
2. **Variantes à comparer : R09–R10, R14, R18, R36, R41, R43, R46, R48.** R41 ajoute une fonction ; R46 reste à coordonner avec la conception de l’analyse. Leur utilité n’est pas présentée comme déjà démontrée.

## 9. Évaluation nécessaire pour conclure

Pas de test utilisateur réalisé pour cet audit. Les deux lots ont été vérifiés par 66 tests ciblés et des parcours Chromium (sections 11 et 12) ; ces vérifications techniques ne prouvent pas à elles seules l’ergonomie auprès des utilisateurs.

Prévoir un essai comparatif avec profils représentatifs de Thomas et Greg, sur téléphone réel et au clavier. Alterner l’ordre des variantes et proposer des tâches équivalentes pour limiter l’effet d’apprentissage. Mesurer réussite, activations, caractères, défilements, temps total, erreurs/reprises et compréhension de l’effet. Demander une explication du résultat obtenu : moins de clics avec mauvaise compréhension n’est pas une amélioration.

Scénarios prioritaires :

1. Trouver puis reprendre la séance du jour et une séance personnelle non datée.
2. Ajouter quatre exercices, leur donner des cibles puis changer leur ordre.
3. Ajouter/déplacer une séance vers un repos, puis annuler.
4. Modifier une cible pour un jour puis pour trois occurrences du mésocycle ; expliquer les dates touchées.
5. Saisir 20 kg, 10 répétitions, RPE 7 ; noter une série différente, une interrompue, une non faite et une non renseignée.
6. Corriger une valeur invalide depuis le bilan et retrouver sa place.
7. Modifier le réglage, ajouter un média et récupérer après un échec local.
8. Terminer avec une omission explicitement conservée ; rouvrir le bilan sans le modifier.
9. Préparer un partage sans description, reconnaître son audience et confirmer.

Contrôler aussi : zoom et taille de texte, focus visible, annonces utiles au lecteur d’écran, navigation du calendrier sans glissement, petit écran avec clavier virtuel ouvert et noms longs. Les tailles et contrastes doivent être mesurés lors de la future passe visuelle ; aucune conformité d’accessibilité n’est déclarée par cet audit.

## 10. Références au code examiné

Liens relatifs depuis ce document ; les méthodes nommées dans les propositions permettent de retrouver les passages même si les numéros de ligne changent.

| Zone | Sources |
| --- | --- |
| Navigation, conservation, notifications | [parcours.js](<../../prototypes/propotype 1/commun/parcours.js>), [ergonomie.js](<../../prototypes/propotype 1/commun/ergonomie.js>), [ergonomie.css](<../../prototypes/propotype 1/commun/ergonomie.css>) |
| Accès et questions | [connexion.js](<../../prototypes/propotype 1/01-connexion/connexion.js>), [index.html](<../../prototypes/propotype 1/01-connexion/index.html>), [questions.js](<../../prototypes/propotype 1/02-questions-rapides/questions.js>) |
| Découverte et import | [decouverte.js](<../../prototypes/propotype 1/03-decouverte/decouverte.js>), [programmes.js](<../../prototypes/propotype 1/03-decouverte/programmes.js>) |
| Création et liste personnelle | [entrainements.js](<../../prototypes/propotype 1/04-mes-entrainements/entrainements.js>), [gabarits.js](<../../prototypes/propotype 1/04-mes-entrainements/gabarits.js>) |
| Calendrier, disponibilités, semaine | [calendrier.js](<../../prototypes/propotype 1/05-organisation-semaine/calendrier.js>), [calendrier.css](<../../prototypes/propotype 1/05-organisation-semaine/calendrier.css>), [semaine.js](<../../prototypes/propotype 1/05-organisation-semaine/semaine.js>), [disponibilites.js](<../../prototypes/propotype 1/commun/disponibilites.js>) |
| Préparation | [seance.js](<../../prototypes/propotype 1/06-configuration-seance/seance.js>), [styles.css](<../../prototypes/propotype 1/06-configuration-seance/styles.css>) |
| Exécution et bilan | [entrainement.js](<../../prototypes/propotype 1/08-entrainement/entrainement.js>), [enrichissement.js](<../../prototypes/propotype 1/08-entrainement/enrichissement.js>), [bilan.js](<../../prototypes/propotype 1/08-entrainement/bilan.js>) |
| Partage | [partages.js](<../../prototypes/propotype 1/07-partages/partages.js>) |
| Exigences et contexte | [arbre commun](../04-analyse-taches/tache.md), [Thomas](../02-utilisateurs-personas/persona-thomas.md), [Greg](../02-utilisateurs-personas/persona-greg.md), [README du prototype](<../../prototypes/propotype 1/README.md>) |

## 11. Premier lot livré — 21 octobre 2026

Les dix points ci-dessous sont **retirés de la liste restante**, sans renuméroter les autres références. Ce tableau est une trace de livraison, pas une nouvelle liste de travaux à faire.

| Point livré | Comportement vérifié |
| --- | --- |
| R03 — conservation et feedback | Les opérations de calendrier/import signalent une application limitée à la visite en cas d’échec. Une publication ou sa modification non sauvegardée revient au brouillon/aperçu, sans faux succès. Réessayer la sauvegarde conserve les données courantes ; confirmer ensuite ne crée pas de doublon. |
| R22 — occurrences protégées | La carte d’une occurrence commencée reprend T2 ; une occurrence terminée ouvre son bilan. Déplacement, retrait/remplacement par repos, déplacement de semaine et annulation d’un ancien placement ne peuvent retirer une occurrence déjà commencée/terminée. Depuis un bilan, programmer une nouvelle séance crée une occurrence indépendante. |
| R33 — suivi prioritaire | Les cases sont intitulées « Afficher en priorité ». Sommeil/fatigue/douleur choisis apparaissent dans le volet initial ouvert ; les autres restent dans Autres informations facultatives. Notes choisies ouvrent leur volet initialement ; ressenti final choisi ouvre le bilan facultatif. Les ouvertures/fermetures explicites restent respectées et aucune saisie n’est effacée. RPE reste le choix RPE/ressenti par série. |
| R35 — parcours Entrée | Passage vers le prochain champ utile du formulaire/volet actif, y compris le menu Ressenti ; dernier champ d’un formulaire soumis avec la validation native. Pas de déplacement vers la page derrière un dialogue. Tab et les textareas gardent leur comportement. |
| R02 — focus | Reconstruction de la même vue : contrôle et sélection de texte retrouvés si présents, titre en repli. Suivant/Précédent focalisent l’en-tête de l’exercice ; le choix d’exercice garde le focus sur le sélecteur. |
| R17 — accès au jour | Vue Semaine au premier accès ; dernier choix Mois/Semaine toujours conservé. Lien Voir le jour sélectionné en vue Mois également, avec focus/défilement sur sa date. Calendrier principal et liste personnelle en bas conservés. |
| R23 — toutes les séances en cours | Encart de reprise dans Calendrier et Bilans, incluant les séances personnelles non datées et les anciens brouillons dont le placement a disparu. Reprise du même exercice et des mêmes résultats après rechargement. |
| R27 — ajout multiple | Accès direct Ajouter plusieurs depuis l’éditeur ; sélection conservée pendant la recherche, compteur, choix dans l’ordre puis confirmation unique. L’ajout individuel et le remplacement restent directs. Chaque nouvel exercice a son propre slot et des cibles vides. |
| R34 — T2 compact | Cible commune affichée une fois, résultats et actions secondaires regroupés par série. Suppression des mentions personnelles vides et de l’absence d’historique répétée. Consigne utile et toutes les séries visibles ; cible adaptée et cible initiale toujours séparées pour les exceptions. |
| R42 — revue compacte | Cible initiale commune par exercice, puis résultats/statuts et corrections par ligne. Les adaptations montrent leurs deux cibles ; notes/réglages/médias restent dépliables. Omissions et erreurs gardent leur traitement distinct. |

### Mesures comparables à 390 × 844 px

Même cas témoin que la section 3 : deux exercices, quatre puis trois séries, RPE choisi, sans historique préalable ni notes ; une série renseignée à la revue.

| Mesure de disposition | Audit initial | Après premier lot |
| --- | --- | --- |
| Premier champ T2, haut | 655 px | **526 px** |
| Hauteur totale de T2 | 2 251 px | **1 803 px**, environ 20 % de moins |
| Hauteur totale de la revue | 2 427 px | **1 960 px**, environ 19 % de moins |
| Début de l’agenda au premier accès | 855 px en Mois | **579 px en Semaine** ; changement de vue par défaut, pas réduction du même mois |
| Ajouter quatre exercices déjà repérés | 8 activations | **6 activations** via l’accès direct Ajouter plusieurs |

Les mesures sont des positions/hauteurs de page, **pas des temps utilisateur**. Les calculs prédictifs du cours restent en section 5. Les cibles par série adaptées, un historique ou des notes déjà présentes peuvent augmenter la hauteur selon le contenu.

### Vérifications réalisées

- **56 tests ciblés réussis** : les 50 précédents et `node tests/ergonomie-top10.test.cjs` (6). Le nouveau fichier vérifie la protection des occurrences, leur ouverture, le refus d’écrasement d’une exécution commencée, l’indépendance des ajouts multiples, l’échec/reprise de publication et l’échec/reprise de modification de publication.
- Syntaxe de tous les modules JavaScript et `git diff --check` contrôlés.
- Chromium : focus et curseur de recherche ; Entrée vers Ressenti et soumission de disponibilités ; priorités de contexte/notes sans perte ; reprise datée et non datée après rechargement ; archives protégées et nouvelle planification indépendante ; ajout multiple, recherche et quatre ajouts en six activations ; correction ciblée, adaptation et annulation depuis la revue.
- Échecs locaux simulés : publication maintenue en aperçu avec brouillon, reprise sans doublon ; calendrier en mémoire avec message honnête ; bouton Réessayer testé.
- T2, revue et choix multiple vérifiés à 320, 390 et 1280 px sans débordement horizontal. Tests sur téléphone physique, clavier virtuel réel, lecteurs d’écran et évaluation utilisateur non réalisés.

### Conservation des sources et documentation

`/Cours5.pdf` et `/Cours6.pdf` restent exclus par `.gitignore`. Les README des parties concernées décrivent le lot livré. Aucun écran d’analyse T3 ni autre point de la liste restante n’est déclaré terminé par ce lot.


## 12. Deuxième lot livré — 22 octobre 2026

Dix points supplémentaires sont **retirés de la liste restante**. Les points historiques gardent leurs numéros ; il reste 29 propositions sur les 49 initiales.

| Point livré | Comportement et preuve |
| --- | --- |
| R01 — retours et reprise | Historique applicatif pour les écrans existants, avec identifiants d’objet, contexte et défilement ; les mises à jour d’un même écran ne créent pas une entrée par frappe ou par série. Retour/Suivant navigateur et retours visibles retrouvent le bon programme ou la bonne séance. Après connexion au même profil, le rechargement reprend un écran encore disponible ; sinon le calendrier sert de repli. L’identité est vérifiée lors de la restauration. Les dialogues temporaires et l’authentification/questionnaire restent hors de cet historique d’écrans. |
| R04 — annulations groupées | Planification d’un programme, copie/déplacement de semaine et répétition de semaine dans un mésocycle proposent Annuler. L’inverse ne retire que les éléments du lot et restaure les contenus remplacés. Un élément commencé/terminé ou modifié depuis n’est pas écrasé. Il s’agit de la dernière annulation proposée pour la visite, pas d’un historique illimité ou persistant après fermeture. |
| R20 — conflits dans le panneau courant | Planning, transfert et déplacement direct montrent les dates/contenus en conflit. Garder le contenu existant ignore l’ajout à cette date ; Remplacer est explicite et indisponible pour une séance protégée. Les champs du formulaire sont conservés. En déplacement partiel de semaine, les sources des destinations ignorées restent en place. Pendant la résolution, la confirmation initiale est désactivée pour laisser une seule action de validation. |
| R21 — doublons | La replanification d’une même source sur les mêmes dates est signalée avant mutation. Ajouter quand même une autre séance est une action explicite ; plusieurs séances par jour restent autorisées. Les repos identiques ne sont pas multipliés. L’annulation d’un deuxième lot conserve le premier. |
| R28 — préparation compacte | Séries/répétitions/charge restent visibles ; Consignes et réglage se déplie avec un résumé du contenu existant. L’ouverture est conservée par slot. Sur les mêmes données à 390 × 844, comparaison de l’ancien rendu du premier lot et du nouveau : **2 753 → 2 481 px**, soit environ **10 % de hauteur en moins**. Le cas témoin est ici une séance personnelle de deux exercices, et non l’occurrence datée du premier audit ; ne pas mélanger ces deux bases de mesure. |
| R29 — sélection groupée | Les cases cochées, le compteur, les valeurs groupées et l’ouverture du volet sont conservés dans le brouillon par slot. Réordonnancement, changement de mode de répétitions et rechargement ne réinitialisent plus la sélection. Tout sélectionner et Désélectionner sont proposés ; seuls les slots sélectionnés reçoivent les cibles, et les charges restent indépendantes. |
| R30 — erreurs précises | Charge, répétitions et RPE indiquent le champ et ses limites. La paire min/max est validée ensemble en direct et au retour sur le brouillon ; une paire incohérente conserve la dernière paire valide séparément des valeurs brutes. Un nombre inachevé comme `22,` n’est pas annoncé comme erreur pendant sa frappe, mais doit être terminé avant application/archivage. Les valeurs invalides restent signalées après rechargement. |
| R31 — portée explicite | La sauvegarde locale nomme sa date ou sa séance. Étendre au mésocycle présente les champs réellement changés, leurs valeurs avant/après, les dates éligibles et les occurrences exclues avec leur raison. Une charge modifiée conserve les autres répétitions futures ; dates passées, exécutions commencées/terminées et autres brouillons sont exclus. La sauvegarde du jour reste directe. |
| R32 — abandon récupérable | Revenir à la version enregistrée abandonne le brouillon avec Annuler. L’annulation restaure séance, valeurs brutes, sélection, champs groupés et détails. Elle refuse de remplacer un nouveau brouillon ou une exécution créée entre-temps. |
| R45 — retour du bilan | Un bilan ouvert depuis Bilans propose ← Mes bilans et retrouve la liste et sa position ; depuis le calendrier, le retour reste Calendrier. Le bon bilan est restauré après rechargement. Les textes de consultation ne montrent plus le code technique T3 et n’annoncent pas d’analyse inexistante. |

### Vérifications du lot

`node tests/ergonomie-lot2.test.cjs` ajoute **10 tests** : conflits par date et coexistence de séances, inverse d’un remplacement sans toucher aux autres entrées, refus d’écrasement après modification/démarrage, protection lors d’un remplacement, détection des doublons, restauration complète d’un brouillon abandonné, protection d’un nouveau brouillon, différence de portée, exclusion des dates passées et restauration du bon brouillon/profil. Avec les 56 tests précédents : **66 tests ciblés réussis**. Syntaxe de tous les modules JavaScript et `git diff --check` contrôlés.

Parcours Chromium réalisés dans un profil fictif dédié :

- Réordonnancement et application groupée ; sélection, nombres français et volet conservés après rechargement ; correction de plage min/max, erreurs RPE/charge et abandon/annulation.
- Conflit programme/repos résolu dans le panneau, annulation restaurant le repos, avertissement de doublon avant mutation, deuxième séance explicite puis annulation ne touchant pas au premier lot.
- Déplacement partiel de semaine conservant la source ignorée, annulation du déplacement, déplacement direct vers repos avec remplacement puis annulation, transfert conservant la destination saisie.
- Découvrir → import → semaine → Retour/Suivant avec recherche conservée ; Bilans → détail → Retour avec défilement, puis rechargement du même bilan.
- Extension d’une charge à l’occurrence éligible avec préservation de ses répétitions personnalisées et exclusion des trois occurrences commencée, terminée et en brouillon.
- Reprise de T2 après rechargement et Retour/Suivant, conservation des résultats réels et refus d’archiver une saisie numérique inachevée.
- Préparation et panneau de conflit à **320, 390 et 1280 px**, sans débordement horizontal ; comparaison visuelle du même cas avant/après. Aucune erreur ni avertissement console dans le parcours contrôlé.

Téléphone physique, clavier virtuel réel, lecteur d’écran et évaluation auprès d’utilisateurs non réalisés. Aucun écran d’analyse de progression ajouté. Les README des parties concernées décrivent les nouveaux comportements.
