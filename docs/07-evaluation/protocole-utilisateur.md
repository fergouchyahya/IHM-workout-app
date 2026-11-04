# Protocole d’évaluation utilisateur — prototype d’entraînement

Version du 4 novembre 2026, **préparée, non exécutée**. Aucune donnée de participant, durée, observation ni score n’est fourni. Objectif : mettre à l’épreuve les hypothèses de conception ; les tests techniques ne constituent pas l’expérience.

## 1. Registre des preuves existantes

| Type | Source | Ce qu’elle permet de dire | Ce qu’elle ne prouve pas |
| --- | --- | --- | --- |
| A — retour humain qualitatif limité | [Audit historique §20](audit-ergonomie-cours5-6.md#20-itération-à-partir-du-retour-utilisateur--2-novembre-2026) | Des difficultés de création, molette, recherche et clôture ont été rapportées, ainsi qu’une préférence pour les notes du téléphone | Protocole, date de passation, recrutement, effectif et mesures absents : pas de taux de réussite ni de conclusion d’adoption |
| B — technique / expert | Tests Node, parcours Chromium, DR-001, KLM/UAN | Contrats fonctionnels, états, disposition et prédictions sous hypothèses | Compréhension, satisfaction et performance de vrais utilisateurs |
| C — à recueillir | Sessions de ce protocole | Résultats descriptifs et observations anonymisées | Aucune conclusion avant collecte |

Les guides de `research/entretiens/` ne contiennent pas de réponses ; `research/observations/` ne contient pas de relevés. La validation d’équipe des personas est une décision de conception.

## 2. Questions, hypothèses et critères observables

| Question / hypothèse à tester | Tâches | Indicateurs et contradiction possible |
| --- | --- | --- |
| H1 : création et placement sont compris comme deux intentions distinctes | E1/E2 | Création sans date involontaire, placement voulu ; confusion ou aide requise contredit l’hypothèse |
| H2 : cible, résultat corrigé et Non faite restent distingués | E3/E4 | Valeur réelle corrigée, cible inchangée, explication correcte du statut ; résultat fictif ou erreur de ligne contredit H2 |
| H3 : quitter et terminer ont des effets distincts compris | E4/E5 | Brouillon repris puis une archive retrouvée ; penser avoir terminé après Quitter contredit H3 |
| H4 : résultat précédent et rappel sont retrouvables et jugés utiles | E6 | Accès au résultat/rappel et explication de leur utilité ; préférence pour les notes recueillie sans présupposer une adoption |

Ces hypothèses sont descriptives. Aucun seuil de réussite ou gain causal n’est fixé après observation. Pas de comparaison avant/après dans ce protocole : il n’y a pas de baseline humaine mesurée.

## 3. Participants, accord et environnement

**Plan de recrutement, pas effectif réalisé :** viser six personnes, deux débutantes, deux intermédiaires, deux avancées, pour diversifier les parcours et repérer des difficultés qualitatives. Recrutement de convenance à déclarer ; effectif réel et écarts au plan à renseigner. Ce petit échantillon ne permet pas de représenter une population ni de prouver un gain statistique. Inclure si possible une personne peu familière des applications pour examiner l’hypothèse Mireille ; ne pas déduire l’aisance numérique de l’âge ou du niveau sportif.

Recueillir l’expérience sportive et l’habitude des applications, sans demander de poids corporel ou données de santé. Donner une explication du projet, demander l’accord pour les notes, rappeler la possibilité de s’arrêter. Enregistrement audio/écran uniquement avec accord distinct. Utiliser des codes P01… ; aucune donnée identifiante dans Git. Décider avec l’équipe où conserver les notes, qui y accède et quand elles sont supprimées, avant recrutement.

Prévoir environ 30 minutes, assis, sans exercice physique ni charges à soulever. Utiliser un téléphone réel pour les tâches principales ; noter modèle, navigateur, taille de viewport, zoom et clavier. Un essai desktop relève d’une condition séparée. Consigner SHA Git exact, date, niveau d’interface et toute assistance technique. Le protocole ne remplace pas un contrôle lecteur d’écran.

## 4. Préparation reproductible par l’observateur

Utiliser un **profil navigateur neuf dédié à l’expérience**, sans données personnelles ni autres onglets du prototype. Ne jamais réinitialiser le navigateur habituel d’un participant. Nouveau profil pour chaque personne : éviter l’effet des brouillons/favoris précédents.

1. À la racine : `python3 -m http.server 8765 --bind 127.0.0.1`, puis ouvrir `http://127.0.0.1:8765/prototypes/propotype%201/01-connexion/index.html`.
2. Essayer sans compte ; choisir Débutant, Rester actif, Salle équipée, avec Continuer à chaque étape. Cette condition initiale est la même pour tous ; un passage avec outils avancés pourra suivre, sans comparaison directe de ses temps à la condition débutante.
3. Dans Mes entraînements, Créer ma séance : nommer **Séance témoin**. Ajouter **Presse à cuisses** via la recherche d’exercice. Dans la préparation : **2 séries, 10 répétitions, 20 kg**. Enregistrer la séance personnelle. Vérifier qu’aucun résultat réel ni date n’existe.
4. Revenir à Découvrir. Le participant commence E1 ici. Ne pas montrer auparavant le chemin de création ; une démonstration entraînerait un apprentissage de la tâche étudiée. L’observateur prépare la fixture avant l’arrivée du participant.
5. Préparer une fiche vierge par tâche. Les valeurs sont fictives pour tester l’interface, sans recommandation d’entraînement. Si le serveur ou le stockage échoue, consigner l’incident séparément.

## 5. Déroulement et tâches

Lire la consigne sans nommer les boutons à chercher. « Nous évaluons l’interface, pas vos compétences. Il n’y a aucun exercice physique à effectuer. » Vérifier que la consigne est comprise, puis lancer le chronomètre au signal de départ. L’observateur ne guide pas le chemin. Questions ouvertes après chaque tâche : « Qu’est-ce qui a changé ? », puis difficulté ressentie de **1 très facile à 7 très difficile** (item descriptif, pas une échelle validée type SUS).

| ID / état de départ | Consigne à lire | Réussite complète vérifiable par l’observateur |
| --- | --- | --- |
| E1 — Découvrir, bibliothèque vide sauf fixture | « Crée une séance nommée Ma séance, avec un exercice de ton choix et une série de 8 répétitions. Garde-la pour plus tard sans choisir de date. » | Programme personnel enregistré avec l’exercice/cibles ; aucune occurrence datée créée |
| E2 — Mes entraînements, Séance témoin disponible | « Prévois Séance témoin pour aujourd’hui, vérifie ce qui est prévu, puis commence-la. » | Une occurrence datée d’aujourd’hui, cibles 20 × 10 et 2 séries ; exécution ouverte pour cette occurrence |
| E3 — séance témoin commencée, résultats vides | « Tu viens de faire 20 kg et 10 répétitions à la première série. À la seconde, tu notes 25 kg et 8 répétitions, puis tu réalises que c’était 22,5 kg. Corrige cette charge. » | Première série 20 × 10 ; seconde 22,5 × 8 ; cible 20 × 10 inchangée ; aucune valeur attribuée à une autre série |
| E4 — mêmes résultats | « Indique que la seconde série n’a finalement pas été faite. Explique ce que tu vois. Reprends ensuite sa saisie, quitte la séance et retrouve-la comme si tu avais fermé l’écran pendant le repos. » | Non faite reconnue comme exclusion, valeurs précédentes récupérables ; reprise même occurrence, résultats conservés, aucune archive ; explication notée séparément du succès technique |
| E5 — séance reprise | « Termine cette séance sans ajouter de note. Retrouve son bilan et explique si elle est encore en cours. » | Confirmation finale effectuée ; une archive, aucun brouillon pour cette exécution ; bilan retrouvé avec 20 × 10 et 22,5 × 8 |
| E6 — bilan conservé | « Garde pour la prochaine préparation ce rappel : Vérifier le réglage du siège. Prépare une séance suivante à partir de ce bilan et retrouve le rappel ainsi que le résultat précédent. » | Point à revoir enregistré dans l’analyse ; nouvelle date choisie et préparation indépendante ; rappel retrouvé ; aucun résultat copié automatiquement comme cible ou résultat réel |

Ordre E1–E6 nécessaire car les états dépendent des étapes précédentes. Si une tâche échoue, arrêter sa mesure puis restaurer son état final attendu pour commencer la suivante ; noter **état fourni par l’observateur**. Ne pas compter cette intervention comme succès de la tâche échouée.

Extension facultative, mesurée séparément : rechercher un nom avec espaces périphériques ; aperçu d’un partage en expliquant données publiques/privées ; interface Avancé avec suivi RPE activé. Ne pas mélanger les temps de tâches différentes.

## 6. Mesures et règles avant collecte

- **Accomplissement :** complet sans aide, complet avec aide, partiel, échec, ou non observé. Expliquer la condition manquante ; une tâche non tentée n’est pas un échec mesuré.
- **Temps :** du signal de départ à la réalisation observable, incluant lecture d’écran et recherche ; arrêt si abandon ou après 5 minutes. Séparer incidents techniques et durée d’usage. Ce seuil est une règle d’arrêt du protocole, pas une durée idéale d’interaction.
- **Aide :** distinguer demande du participant, indice donné, guidage explicite et restauration d’état. L’observateur attend la demande ou l’arrêt, sans sauver silencieusement une tâche.
- **Erreurs :** mauvaise ligne/valeur, mauvais objet/date, mutation non voulue ou confusion d’état verbalisée. Consigner événement et récupération ; ne pas appeler toute navigation exploratoire une erreur.
- **Interactions :** compter séparément activations de boutons/liens, changement de champ, frappes (caractères, corrections, Entrée/Tab) et défilements lorsque la capture le permet. Ne pas réduire une chaîne tapée à un clic.
- **Compréhension :** noter les mots du participant sur cible/résultat, Non faite, Quitter/Terminer et conservation. L’accomplissement technique seul ne suffit pas.
- **Difficulté et valeur perçue :** item 1–7 après chaque tâche ; à la fin, demander ce qui aide ou gêne par rapport à ses notes habituelles. Aucune intention d’adoption n’est interprétée comme usage réel.

Privilégier les questions rétrospectives. Si pensée à voix haute utilisée, noter cette condition : elle peut augmenter les temps. Ne pas comparer directement ses durées à une session silencieuse ou aux prédictions KLM d’un expert.

## 7. Fiche de collecte — vierge

```text
Code participant : ____  Date : ____  SHA : ____  Observateur : ____
Accord notes : ____  Accord capture séparé (si nécessaire) : ____
Expérience sportive : ____  Habitude applications : ____
Appareil / navigateur / viewport / zoom / clavier : ____
Tâche : E__  État initial conforme ou fourni après échec : ____
Début : ____  Fin/arrêt : ____  Durée / incident technique : ____
Accomplissement (catégorie définie ci-dessus) : ____
Demandes d’aide / indices / guidage (moment et nombre) : ____
Erreurs (événement, conséquence, récupération) : ____
Activations / changements de champ / frappes / défilements : ____
Explication de l’état (verbatim réel anonymisé) : ____
Difficulté 1–7 / justification : ____
Fait observé : ____  Interprétation distincte de l’observateur : ____
```

## 8. Résultats et analyse prévus

**Résultats : non recueillis.** Après collecte, renseigner pour chaque tâche le nombre de tentatives, succès sans aide/avec aide/partiels/échecs, incidents, erreurs et difficulté. Calculer taux de réussite = succès sans aide / tâches effectivement tentées et afficher aussi les effectifs bruts. Rapporter durées individuelles puis médiane et étendue si plusieurs tâches comparables sont achevées ; les arrêts à 5 minutes ne sont pas des réussites à intégrer aux temps d’achèvement.

Relier chaque difficulté observée à H1–H4, à un critère ergonomique et à une décision d’itération. Conserver les contre-exemples et l’absence de problème, sans sélectionner uniquement les retours favorables. L’équipe discutera ensuite les corrections ; aucune décision d’itération sur des données encore absentes n’est prise ici.

Limites à rapporter : échantillon de convenance petit, proximité avec l’équipe, expérience numérique variable, apprentissage entre tâches et exposition préalable au prototype, données fictives sans fatigue physique, effet d’observation, environnement calme différent d’une salle, téléphone et navigateur uniques. Un essai réussi ne démontre ni adoption à long terme ni supériorité aux notes du téléphone. Pour comparer deux variantes plus tard, fixer des tâches équivalentes, répartir/alterner l’ordre et préenregistrer les mesures avant collecte.

[Audit et trace de conception](audit-final-grille.md) · [Guide d’entretien existant](../../research/entretiens/questions-entretien-par-profil.md) · [Arbre T1–T5](../04-analyse-taches/tache.md).
