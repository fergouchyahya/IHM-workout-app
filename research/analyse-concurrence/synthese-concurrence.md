# Synthèse de l'analyse concurrentielle — à retenir et à éviter

Auteur : Matthieu · Reviewer : toute l'équipe
Statut : à relire lors de la réunion du 9 octobre 2026.

Cette synthèse condense l'[analyse des applications concurrentes](analyse-applications-concurrentes.md) (Hevy, Lyfta, RepCount, Entraînement en salle de sport) en points exploitables pour la conception. Chaque point est relié aux tâches de l'[arbre commun](../../docs/04-analyse-taches/tache.md) et aux [personas](../../docs/02-utilisateurs-personas/README.md).

Nature des sources : *Obs.* = observation directe de l'interface ; *Avis* = tendance relevée dans les avis Google Play. Les avis indiquent ce que des utilisateurs disent, pas ce qu'ils font : les points concernés sont à confirmer en entretien.

## En bref

- Les applications bien notées partagent une interface simple, à trois onglets, et affichent la performance précédente au moment de la série.
- Leurs principaux défauts portent sur l'accès (inscription longue, paiement obligatoire, fonctions clés payantes) et sur la saisie rigide (série validée non modifiable, séance abandonnée perdue, aucun moyen de noter une séance ratée).
- Aucune application observée ne distingue clairement modifier la séance du jour et modifier le programme type, à part la question posée par Hevy en fin de séance. C'est une piste de différenciation pour T1.3.3.

## Points importants à retenir

| # | Constat | Où | Source | Tâches | Personas | Piste pour notre application |
| --- | --- | --- | --- | --- | --- | --- |
| R1 | Navigation par un bandeau en bas de l'écran limité à trois menus | Hevy, RepCount | Obs. | T5.1 | Tous, surtout Mireille | Garder trois ou quatre onglets nommés en toutes lettres, sans second bandeau. |
| R2 | La performance de la séance précédente s'affiche avant chaque série | RepCount | Avis | T2.1.2, T1.3.1 | Camille, Mireille, Thomas | Afficher la dernière charge et les dernières répétitions à côté de la série à faire. |
| R3 | Une routine se prépare à l'avance puis se lance le jour venu | Hevy | Obs. | T1.1.2, T1.3 | Camille, Greg | Séparer la préparation (T1) de la réalisation (T2) ; lancer la séance du jour en un geste. |
| R4 | Après une séance modifiée, l'application propose de mettre à jour la routine ou de garder l'ancienne | Hevy, Entraînement en salle | Obs. | T1.3.3 | Camille, Greg | Demander explicitement si un changement vaut pour cette séance seulement ou pour le programme type. |
| R5 | Programme affiché sur la semaine, chaque jour nommé, jours de repos compris | Entraînement en salle | Obs. | T1.2.1, T1.3.1 | Thomas, Mireille | Vue semaine avec séances nommées (« Jambes », « Repos ») et position dans le bloc. |
| R6 | La génération automatique d'un programme est appréciée | Entraînement en salle | Avis | T1.1.1, T1.1.3 | Thomas, Mireille | Proposer quelques programmes prédéfinis adaptés au profil, sans les imposer aux profils avancés. |
| R7 | Bibliothèque d'exercices avec recherche, explication au clic et exercices personnalisés (avec image chez Lyfta) | Entraînement en salle, Lyfta, Hevy | Obs. + Avis | T1.1.5, T2.1.2 | Mireille, Thomas, Greg | Fiche d'exercice courte et illustrée, accessible depuis la séance ; exercices personnalisés possibles. |
| R8 | Exercices unilatéraux enregistrés séparément, fonction rare et saluée | Lyfta | Avis | T1.1.5, T2.2.2 | Greg | Permettre de suivre gauche et droite séparément lorsque l'exercice s'y prête. |
| R9 | Création de compte facultative et version gratuite jugée suffisante | RepCount | Obs. + Avis | T1.1.1 | Thomas, Mireille | Permettre de commencer sans compte ; demander un compte seulement pour synchroniser ou partager (T4, T5.2). |
| R10 | Note possible sur chaque série ou sur la séance | RepCount, Hevy | Obs. | T2.3.2 | Greg, Mireille | Champ de note facultatif, au niveau de la série et de la séance. |
| R11 | Rapport hebdomadaire simple : nombre de séances, durée totale, volume, historique daté | Entraînement en salle | Obs. | T3.1, T3.2 | Camille, Thomas | Résumé hebdomadaire lisible avant les graphiques détaillés ; repères non limités aux records (Mireille). |
| R12 | Demande récurrente d'un chronomètre par série et de supersets | Lyfta, RepCount | Avis | T2.2, T1.1.2 | Camille, Greg | Prévoir un minuteur de repos et la possibilité de grouper des exercices ; à confirmer en entretien. |

## Défauts à éviter

| # | Défaut | Où | Source | Tâches | Personas | Ce que nous faisons à la place |
| --- | --- | --- | --- | --- | --- | --- |
| D1 | Questionnaire d'accueil long avant toute utilisation : plus de dix questions chez Lyfta et Entraînement en salle, six étapes supplémentaires minimum chez Hevy | Hevy, Lyfta, Entraînement en salle | Obs. | T1.1.1 | Thomas, Mireille, Camille | Trois questions au plus (objectif, niveau, jours disponibles), toutes modifiables plus tard ; le reste devient facultatif. |
| D2 | Saisies inutilement précises ou ludiques à l'accueil : poids à 0,1 kg, règle graduée à faire glisser, IMC affiché sans qu'on le demande | Lyfta, Entraînement en salle | Obs. | T1.1.1 | Mireille, Thomas | Ne demander que ce qui sert au programme, avec des champs simples ; pas de jugement sur le corps. |
| D3 | Paiement obligatoire à l'inscription, statistiques ou routines illimitées réservées à l'abonnement, renouvellement non désiré | Lyfta, RepCount, Hevy | Obs. + Avis | T1.1, T3.2 | Tous | Les tâches de base T1–T3 restent accessibles sans paiement dans nos parcours. |
| D4 | Abandonner une séance efface tout ; impossible d'indiquer une séance ratée | Hevy | Obs. | T1.2.4, T2.2.3, T2.4 | Tous | Conserver ce qui a été fait ; permettre de marquer une séance ratée et de la déplacer. |
| D5 | Série validée non modifiable | Hevy | Obs. | T2.2.4 | Camille, Mireille | Toute saisie reste corrigible sans perdre les autres résultats. |
| D6 | Saisie uniquement après la séance, pas de suivi en direct | RepCount | Obs. | T2.2 | Camille, Greg | Saisie série par série pendant la séance ; la saisie a posteriori reste possible. |
| D7 | Aucun bouton pour clôturer une séance | RepCount | Avis | T2.4 | Tous | Fin de séance explicite avec récapitulatif et séries non faites. |
| D8 | Listes d'exercices et de routines dupliquées (chaque élément apparaît quatre fois) | RepCount | Obs. | T5.1, T1.1.5 | Tous | Bibliothèque sans doublon ; recherche fiable. |
| D9 | Publicités nombreuses, parfois bloquantes | Entraînement en salle | Avis | T2 | Tous | Aucune interruption pendant la séance. |
| D10 | Bugs de réinitialisation (séries déjà cochées), erreurs de connexion, synchronisation peu fiable | Lyfta | Avis | T5.2, T2.2.5 | Camille, Greg | Fonctionnement hors ligne et état de sauvegarde visible ; voir T5. |
| D11 | Traduction française partielle | Lyfta | Avis | T5.1 | Mireille, Thomas | Interface entièrement en français, vocabulaire expliqué (série, répétition, RPE). |
| D12 | Accueil conçu comme un fil de réseau social | Hevy | Obs. | T4, T5.1 | Mireille, Thomas | L'accueil montre d'abord la séance du jour ; la communauté reste dans son onglet (T4). |

## Ce que nous écartons

- Programme strictement et entièrement généré et imposé : utile pour Thomas et Mireille (R6), mais contraire au besoin de Greg et de Camille, qui construisent ou reprennent leurs propres séances (T1.1.2, T1.1.4).

## Limites

- Quatre applications Android seulement, explorées à une date non consignée ; Strong, Jefit et les applications iOS n'ont pas été étudiées.
- L'utilisation de Lyfta n'a pas été observée au-delà de l'inscription, à cause du paiement obligatoire.
