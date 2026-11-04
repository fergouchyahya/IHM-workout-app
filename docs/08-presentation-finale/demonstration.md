# Démonstration du prototype

Objectif : montrer une chaîne de tâches cohérente, la différence cible/résultat et la conservation lors d’une correction ou interruption. Il s’agit d’une démonstration sur données fictives, pas d’une expérience utilisateur. La durée doit être mesurée lors d’une répétition ; aucun temps de démo n’est garanti ici.

## Préparation

- Utiliser un profil navigateur neuf dédié. Éviter les données personnelles et les autres onglets du prototype qui pourraient réécrire un ancien état.
- Lancer le serveur selon le README du projet, depuis le dépôt ou l’archive extraite ; ouvrir `prototypes/propotype 1/01-connexion/index.html` via HTTP.
- Vérifier le chargement de la version source, le zoom, le clavier et la taille d’écran de projection. Si le prototype a changé, refaire les captures et vérifier le manifeste.
- Garder les captures 02–05 accessibles pour continuer si le navigateur ou la projection échoue.

Le lien `/__reset` utilisé dans la session de travail est une commodité du serveur local en cours ; il n’existe pas dans un simple `python3 -m http.server`. Pour une démonstration portable, un profil navigateur neuf suffit à repartir sans état.

## Parcours principal

| Étape | Action réelle | Ce qu’il faut faire constater |
| --- | --- | --- |
| Entrer | Essayer sans compte ; Débutant, Rester actif, Salle équipée ; Continuer | Questions facultatives, choix modifiables, pas de formulaire de compte obligatoire |
| Créer | Mes entraînements → Créer ma séance → nom « Séance témoin » → créer | Programme personnel distinct d’une date de calendrier |
| Préparer | Ajouter « Presse à cuisses » ; 2 séries, 10 répétitions, charge cible 20 kg ; enregistrer | Valeurs prévues, aucune série réelle inventée ; consigne et détails facultatifs |
| Planifier | Retour, Calendrier → Ajouter → Aujourd’hui → Séance témoin | Placement explicite d’une occurrence indépendante |
| Commencer | Ouvrir la séance datée, vérifier puis Commencer | Passage de T1 à T2, cible initiale visible |
| Consigner | Première série 20 kg × 10 ; seconde 25 kg × 8 puis correction de charge à 22,5 | Correction locale ; autres série et cible 20 × 10 conservées |
| Interrompre | Quitter · saisie conservée ; reprendre depuis la séance en cours | Quitter ne termine pas ; brouillon retrouvé |
| Vérifier | Vérifier et terminer… ; Corriger ici sur la seconde série, répétitions 9 | La revue reste corrigeable ; résultat 22,5 × 9, cible inchangée |
| Terminer | Terminer et enregistrer mon bilan, puis Voir mes bilans | Confirmation explicite ; une archive, pas de faux record à la première séance |
| Reboucler | Ouvrir la comparaison, conserver « Vérifier le réglage du siège » ; préparer une prochaine séance datée | Point T3 retrouvé dans T1, sans recopier un résultat comme cible automatique |

Si le temps manque, préparer la séance témoin avant le passage et commencer à l’étape Consigner ; expliquer l’état initial. Ne pas simuler une création accomplie en direct si elle a été préparée.

## Variantes à montrer seulement si elles servent l’argument

- Cas particulier → Non faite → Reprendre la saisie : montrer des valeurs exclues de ce statut, mais récupérables.
- Valeur de répétitions invalide : la correction reste visible ; la clôture est bloquée jusqu’à correction.
- Préférences → Intermédiaire, puis suivi RPE dans la préparation : montrer le troisième champ et l’enchaînement Entrée. Revenir Débutant masque le RPE sans l’effacer.
- Préparer un partage : aperçu du programme et audience explicite ; résultats réels/notes/médias personnels exclus. Annoncer la simulation locale.

## Repli et questions probables

| Question | Réponse soutenable / où chercher |
| --- | --- |
| « Avez-vous testé avec des utilisateurs ? » | Retour qualitatif limité rapporté ; protocole expérimental préparé, pas de résultats collectés. Voir registre A/B/C. |
| « Pourquoi plusieurs niveaux ? » | Hypothèse d’adaptation aux besoins de précision ; niveau sportif ne prouve pas aisance numérique. À évaluer. |
| « Où sont les données ? » | État dans localStorage ; médias personnels dans IndexedDB, sur cet appareil ; aucune synchronisation distante réelle. |
| « Les 150 tests prouvent-ils la facilité d’usage ? » | Non. Ils vérifient les contrats fonctionnels et la conservation ; l’expérience humaine reste nécessaire. |
| « Le gain KLM est-il mesuré ? » | Non. Prédiction pour une méthode connue sur ordinateur, avec mêmes états et hypothèses déclarées. |
| « Le projet respecte-t-il T1–T5 ? » | La matrice d’audit relie tâches, code et limites ; préparation/planification peuvent être alternatives ou facultatives. |

Avant la soutenance : rejouer une fois sans assistance et chronométrer la démonstration réelle. En cas d’incident, utiliser les captures en les nommant « scénario technique enregistré », sans prétendre à une observation humaine.
