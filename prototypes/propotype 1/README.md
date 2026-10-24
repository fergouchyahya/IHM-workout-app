# Prototype 1 — entraînements

## État actuel — 23 octobre 2026

Ce prototype cliquable couvre **T1 : préparer et organiser**, puis **T2 : réaliser, documenter et conserver une séance** et **T3 : analyser les résultats**. Le parcours principal est Découvrir → copie personnelle → préparation → entraînement → vérification → bilan conservé. Le calendrier est l’espace de planification ; **Mes entraînements est une page distincte**, accessible dans la navigation, pour rechercher, créer, préparer, planifier ou supprimer une séance ou un programme. Les autres espaces sont Découvrir, Partages et Bilans.

La liste et la consultation des bilans constituent la sortie de T2. Chaque bilan contient l’analyse T3 : exercice, période, référence comparable, écarts réels, records de charge à répétitions identiques, historique et point à revoir en T1. Voir les [règles de comparaison](09-analyse/README.md). Le partage T4 est simulé localement ; aucune publication distante ni authentification réelle n’est effectuée.

**Ce document et les README des écrans décrivent l’état actuel.** Les comptes rendus datés de l’[audit ergonomique](../../docs/07-evaluation/audit-ergonomie-cours5-6.md) retracent les livraisons successives ; leurs mesures et nombres de tests appartiennent au lot daté. Ils ne remplacent pas les règles ci-dessous. Les anciennes règles « charge vide = série non faite » et « arrêt avant bilan » sont abandonnées. Le minuteur facultatif est désormais livré dans le dernier lot.

## Ouvrir le prototype

Depuis la racine du dépôt :

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Ouvrir `http://127.0.0.1:8765/prototypes/propotype%201/01-connexion/index.html`. Les données d’exemple servent à évaluer l’interface, pas à prescrire un entraînement.

## Contrats à conserver

- **Séparer les objets.** Une source de bibliothèque, une copie enregistrée, une occurrence datée, un brouillon de préparation, une exécution en cours et un bilan terminé sont distincts. La création se fait dans Mes entraînements, sans placement automatique ; les catégories de programme ne remplissent aucun jour. Importer crée une copie sans la planifier ; Favori ne crée aucune copie. Préparer ma copie ne démarre aucune exécution.
- **Planifier explicitement.** Calendrier Mois/Semaine avec dates réelles, séances rouges, repos explicites verts, jours vides et plusieurs séances par jour. Toucher un jour sélectionne. Le seul **+ Ajouter**, en haut, ouvre le choix de date initialisé à aujourd’hui, indépendamment du jour consulté ; on choisit ensuite un entraînement enregistré ou un repos. Les outils groupés sont proposés hors mode débutant ; les échéances sont réservées au niveau Avancé. Répéter une semaine et faire évoluer ses cibles restent explicites ; les conflits et doublons demandent un choix explicite. Annuler inverse la dernière opération proposée de la visite sans écraser un travail ultérieur.
- **Préparer avec peu d’actions.** Saisir un nom inconnu dans le sélecteur puis Ajouter crée un exercice personnel réutilisable sans autre formulaire ; les détails restent facultatifs. Exercices ajoutables individuellement ou par lot ; remplacement avec mêmes muscles prioritaires et nouvelles cibles vides. Le débutant ne voit que séries, répétitions et charge. Les autres niveaux ont aussi fixes/plage, RPE facultatif et outils groupés ; les champs avancés déjà remplis sont conservés lorsqu’ils sont masqués. Consignes et réglages sont dépliables. Sélections, valeurs brutes, détails ouverts et champs groupés restent dans le brouillon par slot, même après réordonnancement ou rechargement.
- **Structurer un mésocycle avancé.** Avant les jours et exercices, définir une structure prédéfinie ou des noms de séances libres, la fréquence, la durée et l’objectif du cycle. Le brouillon est repris après rechargement ; la structure et l’objectif restent visibles à l’étape suivante.
- **Nommer la portée.** Une adaptation de préparation concerne le jour. Une extension volontaire au même mésocycle présente différences, dates et exclusions. Elle propage seulement les champs changés ; les autres cibles futures restent indépendantes. Les dates passées, séances commencées/terminées et autres brouillons sont exclus. Le programme personnel enregistré reste distinct.
- **Retrouver les séries précédentes dans une répétition.** Pour une occurrence de mésocycle ou une nouvelle copie issue de Copier et répéter la semaine, la préparation montre les charges et répétitions réelles de la dernière séance terminée de cette même répétition, série par série. Pendant l’entraînement, chaque ligne garde son repère précédent. Ce rappel ne remplit ni cible ni résultat ; les valeurs absentes restent des tirets et les séries non faites sont nommées. Une séance indépendante ne reçoit pas ce nouveau tableau.
- **Distinguer cible et résultat.** T2 montre un exercice à la fois avec toutes ses séries, consignes, réglages, cibles initiales et résultat précédent comparable lorsqu’il existe. Adapter une cible pendant l’effort ne concerne que cette série et ne remplit pas le résultat réel. Aucune série n’est inventée quand le nombre prévu est vide ; Ajouter une série est explicite.
- **Conserver les absences.** Vide = non renseigné ; **0 kg = sans charge ajoutée**. Une série n’est déclarée Non faite que par une action explicite. Faite, Interrompue, Non faite, Partielle et Non renseignée restent distinctes. Une valeur invalide garde la dernière valeur valide séparée de la saisie brute et bloque l’archivage jusqu’à correction. Une omission autorisée peut être conservée après avertissement.
- **Corriger et enrichir.** Saisie autosauvegardée sans validation par série ; recopie explicite d’un résultat précédent complet et valide, annulable ; charge seule également disponible sans inventer d’autres valeurs. État/effort initial facultatifs ; un seul contexte général, raisons par série, notes, accès direct au réglage utilisé et médias disponibles sans obligation de les remplir. L’avancement distingue les statuts ; Série suivante sélectionne sans déclarer de réalisation. Les médias affichent leurs opérations et proposent un réessai par fichier ; une annulation asynchrone échouée reste réessayable. Les préférences de suivi changent leur visibilité prioritaire, sans supprimer de données. Le RPE est masqué au débutant en préparation, entraînement, adaptation, bilan et aperçu public ; le ressenti global reste facultatif.
- **Terminer délibérément.** Quitter garde l’exécution en cours. Vérifier le bilan permet les corrections ciblées, omissions, ressenti final et rappels. La revue propose une correction réelle sur place, sans modifier les cibles ; son accès avancé retrouve la ligne au retour. La confirmation crée un seul bilan en lecture seule avec notes/médias, puis protège l’occurrence terminée. Bilans propose recherche par nom, regroupement par date et tri, conservés au retour. Un bilan peut servir de référence ou de source pour une nouvelle occurrence indépendante.
- **Revenir au contexte utile.** Retour/Suivant restaure l’écran, son objet et le défilement, sans étape par frappe. Le même profil retrouve un écran encore disponible après rechargement. Les préférences sont accessibles depuis les espaces principaux et reviennent à l’origine avec les critères actifs ; un objet supprimé replie vers Calendrier. Les dialogues et l’accès/questionnaire ne sont pas des entrées de cet historique ; le questionnaire conserve séparément réponses et position par profil. Essayer sans compte ouvre un profil démo isolé, sans mot de passe à saisir. Dans les questions, Précédente et Passer cette question sont alignés sous l’aide ; la première question n’a aucun retour vers la connexion.
- **Présenter les critères réels.** Découvrir filtre par bibliothèque, nom, niveau, matériel, zone et durée ; compte séances et programmes ensemble. L’objectif sportif ne produit pas une personnalisation non implémentée. Mes favoris filtre les séances des deux bibliothèques, avec les critères explicites conservés. Le budget temps ne modifie pas les résultats tant qu’aucun filtre de durée n’est choisi ; les textes explicatifs de tri, de provenance initiale et de suggestion demandés ont été retirés. Les longs programmes se consultent par semaines dépliables avant import/partage.

## Écrans et modules

| Dossier | Rôle actuel |
| --- | --- |
| [01-connexion](01-connexion/README.md) | Accès simulé, création/récupération et choix d’identité locale |
| [02-questions-rapides](02-questions-rapides/README.md) | Niveau, objectif et matériel facultatifs ; modification d’un choix depuis les préférences |
| [03-decouverte](03-decouverte/README.md) | Recherche/filtres, récapitulatif, favoris, copie et import de programmes |
| [04-mes-entrainements](04-mes-entrainements/README.md) | Page personnelle séparée ; création, recherche, planification et suppression annulable |
| [05-organisation-semaine](05-organisation-semaine/README.md) | Calendrier, semaine type, mésocycle, placements et échéances |
| [06-configuration-seance](06-configuration-seance/README.md) | Préparation T1.3, brouillon, cibles, portée et séance prête |
| [07-partages](07-partages/README.md) | Présentation, aperçu, confirmation et gestion de publications locales |
| [08-entrainement](08-entrainement/README.md) | T2.1–T2.4 : préparation de l’effort, saisie, enrichissements, clôture et bilan |
| [09-analyse](09-analyse/README.md) | T3 dans les bilans : comparaisons, records explicites, contexte et point à revoir en T1 |

`commun/parcours.js` porte navigation, identité et sauvegarde ; `commun/ergonomie.js` porte nombres français, validation et clavier ; `commun/disponibilites.js` porte durée/jours disponibles. Aucun framework ni compilation n’est requis.

## Conservation et limites

Les données sont locales à l’appareil et à l’identité de démonstration : état applicatif et profils dans `localStorage`, fichiers de médias dans IndexedDB. Les brouillons sont distincts des bilans dans `trainingDrafts` / `completedSessions`. Le changement de profil conserve et isole les données, dont les brouillons de questions. Le minuteur reste facultatif, avec durée réutilisable, pause/reprise et arrêt ; son échéance survit à une navigation/recharge sans notification et sans modifier les résultats. Une erreur de stockage est visible avec Réessayer ; les changements en mémoire ne sont pas annoncés comme durablement enregistrés. Sans stockage, garder la page ouverte est nécessaire.

Les fichiers partagés sont produits à partir d’une liste blanche : programme/cibles/instructions, sans résultats, notes/réglages personnels, médias ou identifiants. Les publications T4 publiques actives alimentent le fil chronologique sous Découvrir → Communauté ; les partages aux contacts et les contenus retirés en sont exclus. Le fil reprend les données du profil local courant et ne simule pas une diffusion entre comptes. Supprimer de Mes entraînements retire seulement le modèle et ses brouillons de préparation personnels, après confirmation et avec Annuler. Les occurrences datées indépendantes, séances en cours, bilans et publications sont conservés. Les anciennes archives restent consultables. Description de partage facultative, titre et niveau requis ; les erreurs sont locales. Un contenu À compléter revient au brouillon du partage après préparation. L’aperçu précède une action finale nommant l’audience ; aucune case supplémentaire. Les publications et contacts sont fictifs.

Non implémentés : substitution d’exercice pendant l’effort, synchronisation distante et authentification réelle. Téléphone physique, clavier virtuel réel, lecteurs d’écran et évaluation utilisateur restent à tester. Les mesures de page et comptes d’actions dans l’audit ne sont pas des temps utilisateur ni une déclaration de conformité.

## Vérification reproductible

Depuis la racine du dépôt :

```sh
node tests/analysis.test.cjs
node tests/community-feed.test.cjs
node tests/ergonomie.test.cjs
node tests/preparation.test.cjs
node tests/t1-completion.test.cjs
node tests/training-preparation.test.cjs
node tests/training-results.test.cjs
node tests/training-enrichment.test.cjs
node tests/training-completion.test.cjs
node tests/ergonomie-top10.test.cjs
node tests/ergonomie-lot2.test.cjs
node tests/ergonomie-lot3.test.cjs
node tests/ergonomie-lot4.test.cjs
node tests/ergonomie-lot5.test.cjs
node tests/profile-library.test.cjs
node tests/repeated-session-history.test.cjs
```

Les quatorze suites historiques couvrent T1/T2 ; `analysis.test.cjs` et `community-feed.test.cjs` vérifient T3 et l’intégration du fil communautaire. Les 49 propositions sont implémentées ; la liste de développement est close. Les évaluations utilisateur restent à réaliser, notamment pour comparer sélection de date et confirmation de partage. Les ajustements de navigation/niveau et les références de séances répétées sont consignés en sections 16 et 17 de l’[audit ergonomique](../../docs/07-evaluation/audit-ergonomie-cours5-6.md). Les tests vérifient des comportements ; ils ne remplacent pas l’évaluation de l’ergonomie auprès d’utilisateurs.

## Références de conception

- [Persona Thomas](../../docs/02-utilisateurs-personas/persona-thomas.md), priorité à la guidance et à la saisie rapide ; [persona Greg](../../docs/02-utilisateurs-personas/persona-greg.md), préparation des semaines et cycles.
- [Scénario Thomas](../../docs/03-scenarios/scenario-thomas.md) et [arbre commun des tâches](../../docs/04-analyse-taches/tache.md).
- [Décisions de conception](../../docs/05-decisions-conception/README.md) et [audit fondé sur Cours 5/6](../../docs/07-evaluation/audit-ergonomie-cours5-6.md).

Les supports locaux `/Cours5.pdf` et `/Cours6.pdf` sont exclus par `.gitignore`. Les règles propres à un écran restent dans son README ; l’audit conserve les points livrés et la liste restante avec leurs identifiants d’origine.
