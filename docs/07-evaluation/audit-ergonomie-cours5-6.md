# Audit ergonomique du prototype — Cours 5 et 6

Audit initial : 21 octobre 2026. Mise à jour : **22 octobre 2026 — 49 propositions implémentées et vérifiées techniquement, 0 restante à implémenter**. La liste d’implémentation est close ; l’évaluation auprès d’utilisateurs reste à réaliser. Les identifiants d’origine sont conservés ; les comptes rendus des cinq lots figurent en sections 11 à 15.

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

## 4. Liste d’implémentation terminée

**Les 49 propositions sont implémentées. Aucun point ne reste dans la liste de développement.** Les identifiants et preuves des cinq lots restent en sections 11 à 15, sans renumérotation.

Cette clôture concerne le code et ses vérifications techniques. Les gains de temps, la compréhension, les erreurs de manipulation et la préférence pour les variantes R18/R48 ne sont pas validés auprès d’utilisateurs. Les tests nécessaires restent décrits en sections 6 et 9. L’analyse T3 reste hors périmètre.

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

### Quatre comparaisons issues de l’audit initial

| Même but et départ | Méthode lors de l’audit initial | Variante comparée | Estimation centrale avant → après | Gain conditionnel |
| --- | --- | --- | --- | --- |
| Ajouter quatre exercices déjà repérés, départ éditeur, cibles non saisies | 4 × (Ajouter + choisir) = `M + 8(P+K)` | Ouvrir le choix multiple + quatre sélections + Ajouter les 4 = `M + 6(P+K)` | **11,75 → 9,15 s** | **2 activations**, soit 25 % ; **2,60 s** théoriques, plage 2,00–3,40 s selon P. Même M : les ouvertures répétées font partie de la méthode anticipée. |
| Démarrer une séance prête, départ agenda du jour visible | Carte → aperçu → Commencer = `M + 2(P+K)` | Bouton secondaire Commencer sur carte, aperçu toujours disponible = `M + (P+K)` | **3,95 → 2,65 s** | **1 activation**, **1,30 s**, plage 1,00–1,70 s. Variante de R17 à tester ; le clic sur la carte principale continue d’ouvrir ses détails. Ne pas proposer ce raccourci si un brouillon de préparation attend l’application de modifications. |
| Modifier le réglage utilisé, départ en-tête exercice, texte de n caractères | Notes focalise Remarque → choisir Réglage → saisir = `M + 2(P+K) + H + nK` | Action Réglage utilisé focalise directement le champ → saisir = `M + (P+K) + H + nK` | **4,35 + 0,20n → 3,05 + 0,20n s** | **1 activation**, **1,30 s** ; défilement supplémentaire actuel exclu du calcul. |
| Confirmer une publication dont l’aperçu et l’audience ont déjà été lus | Cocher puis confirmer = `M + 2(P+K)` | Bouton explicite audience = `M + (P+K)` | **3,95 → 2,65 s** | **1 activation**, **1,30 s** ; bénéfice retenu seulement si la compréhension et le contrôle sont conservés. |

L’ajout multiple, le réglage direct et la confirmation sans case sont désormais implémentés (lots 1, 4 et 5). Le départ direct depuis une carte d’agenda n’a pas été retenu : la carte conserve son aperçu. Ces chiffres ne s’additionnent pas en « temps gagné par séance » : ils concernent des buts et fréquences différents. Ils ne prouvent pas que les nouvelles interfaces seront plus rapides à découvrir.

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

## 6. QOC : compromis implémentés ou non retenus, validation utilisateur restante

| Question | Options | Critères et recommandation |
| --- | --- | --- |
| Comment réduire la hauteur T2 ? | Tout replier ; une série unique ; lignes de toutes les séries avec détails secondaires | **Premier lot livré : séries compactes et cible commune**, avec toutes les séries accessibles. Comparer densité, lisibilité des cibles et erreurs de ligne ; pas seulement la hauteur. |
| Que fait un appui sur une date vide ? | Ajout immédiat initial ; sélection puis + | **Lot 5 : sélection puis Ajouter ici.** Un appui supplémentaire pour ajouter, mais aucune ouverture à fermer pour consulter. Comparer erreurs/ouvertures involontaires et vitesse auprès d’utilisateurs. |
| Comment traiter les options de suivi ? | Vraie visibilité ; affichage prioritaire ; suppression des cases sans effet | **Premier lot livré : affichage prioritaire + accès facultatif aux autres champs**, sans perte de données. Le sens des cases doit être explicite. |
| Faut-il le bouton Commencer sur l’agenda ? | Aperçu obligatoire actuel ; raccourci facultatif et aperçu conservé | Recommander un raccourci seulement sur séance prête, sans brouillon non appliqué ; comparer vitesse et erreurs de départ. |
| Faut-il supprimer la case de publication ? | Case + bouton ; bouton final nommant l’audience | **Lot 5 : une action finale nommant l’audience**, avec aperçu conservé et publication impossible depuis le formulaire. La compréhension et les activations involontaires restent à mesurer ; les seuls tests techniques ne les valident pas. |
| Comment corriger un bilan ? | Navigation ciblée T2 ; édition sur place avant clôture | **Lot 5 : Corriger ici**, autosauvegardé dans le brouillon, avec accès avancé à la série et retour ciblé. Les archives restent en lecture seule. Comparer compréhension et erreurs en situation réelle. |

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

## 8. Suite : évaluer les usages

Les 49 propositions d’implémentation sont livrées en cinq lots. Aucun nouveau point n’est ajouté artificiellement à la liste. La prochaine étape ergonomique est de réaliser les scénarios utilisateur de la section 9, puis d’ouvrir uniquement les corrections justifiées par leurs résultats.

La conception de l’analyse T3 constitue une étape fonctionnelle distincte ; elle n’est pas déclarée réalisée par la recherche dans les bilans ou leur consultation.

## 9. Évaluation nécessaire pour conclure

Pas de test utilisateur réalisé pour cet audit. Les cinq lots ont été vérifiés par 104 tests ciblés et des parcours Chromium (sections 11 à 15) ; ces vérifications techniques ne prouvent pas à elles seules l’ergonomie auprès des utilisateurs.

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


## 13. Troisième lot livré — 22 octobre 2026

R05–R08, R11–R13, R15–R16 et R19 sont retirés de la liste restante : **30 propositions livrées, 19 restantes sur les 49 initiales**. Le commit `e9e1b25` conserve l’état avant ce troisième lot (T1/T2 et les deux premiers lots).

| Point livré | Comportement vérifié |
| --- | --- |
| R05 — cibles et proximité | Commandes, actions de série et détails ont une surface minimale de 44 × 44 px. Les dates gardent cette largeur à 320 px avec un défilement dans le cadre du calendrier, sans élargir le document. Un seul jour est dans l’ordre de Tab ; flèches, Début/Fin et Page précédente/suivante déplacent sélection et focus, sans ouvrir l’ajout. Les suppressions sont séparées des actions courantes. Les dates/flèches/ajout et outils de préparation/T2 ont été mesurés aux trois largeurs ; l’usage au pouce reste à tester. |
| R06 — codes visuels | Bleu pour focus/sélection, rouge pour séances et erreurs, vert pour repos. Le jour sélectionné est souligné ; la série sélectionnée est nommée ainsi. À compléter reste rouge mais la carte est blanche ; une erreur ajoute message, champ invalide et bordure distincte. Les libellés de réalisation restent séparés. Les actions secondaires ne sont plus toutes rouges. R37 reste ouvert pour l’avancement et le passage à la série suivante. |
| R07 — vocabulaire et nombres | Bilans désigne les résultats conservés ; Mes entraînements reste la liste personnelle du calendrier. Préparation, cibles T2, précédent, revue et aperçu de programme/partage utilisent les décimales françaises, dont 22,5 kg et RPE 7,5/10. Les valeurs brutes de saisie restent séparées. Les quantités usuelles se pluralisent sans « (s) » ; l’aide locale explique RPE : effort ressenti de 1 à 10. Les erreurs nomment le champ. |
| R08 — état documentaire | Le README racine présente l’état actuel, les contrats d’objets/saisie/portée, la sortie T2 et le périmètre T3 restant. Les anciennes annonces d’arrêt avant bilan et de charge vide équivalant à Non faite ne sont plus des règles actives. Les livraisons datées restent tracées dans cet audit ; le minuteur est explicitement non implémenté. Les README concernés décrivent le comportement courant. |
| R11 — préférences sans détour | Accès commun dans Découvrir, Calendrier, Bilans et la liste Partages. Modifier un choix ou durée/disponibilités revient au même espace et à sa position. Recherche, source et filtres non concernés restent conservés ; niveau/matériel modifiés actualisent leur filtre comme auparavant. Annuler retrouve les critères d’origine. Aucun entraînement n’est réinitialisé. |
| R12 — critères réels | « Selon tes filtres » remplace la promesse de personnalisation liée à toute réponse. Bibliothèque et filtres actifs restent visibles ; la durée croissante est annoncée pour les séances. Le budget temps est indiqué comme repère, sans appliquer un filtre silencieux. Deux profils ne différant que par objectif donnent la même présentation et les mêmes résultats. |
| R13 — résultat global | Un compteur total donne séances et programmes. Un programme seul ne coexiste plus avec un encart d’échec des séances. En cas de vide global, chaque filtre peut être retiré séparément et le nom recherché peut être effacé sans perdre les autres critères. La recherche/les critères remplacent le contexte de la même entrée d’historique après chaque changement : le retour de préparation ne rétablit plus un filtre retiré. |
| R15 — copie puis préparation | Une carte porte Déjà enregistré indépendamment de Favori. Après Enregistrer, le bouton du récapitulatif devient Préparer ma copie ; il ouvre la même copie sans chercher dans Calendrier, sans doublon ni démarrage. Cette clarification conserve les deux activations déjà possibles ; aucun gain de temps artificiel n’est attribué au changement de libellé. |
| R16 — aperçus progressifs | Import, présentation/aperçu et détail de partage utilisent la répartition publique du programme. Chaque semaine présente nombre de séances/repos et présence de variations par rapport à la précédente. Déplier une semaine révèle directement ses exercices/cibles ; le contenu des séances y est déjà déplié, sans seconde activation obligatoire. Import et confirmation de publication restent accessibles dans une zone collante ; la case de publication est conservée. Les archives anciennes sans plan utilisent des séances dépliables. Les notes/réglages personnels restent exclus par la liste blanche existante. |
| R19 — date éloignée | Le titre de période ouvre Choisir une date ; Voir cette date sélectionne et focalise le jour sans créer d’entrée ni ouvrir l’ajout. Les flèches/Aujourd’hui restent disponibles. Le clavier conserve le jour du mois si possible et le borne au dernier jour, y compris le 29 février. |

### Contrôles et compromis

- **77 tests ciblés réussis** : les 66 précédents et les 11 de `tests/ergonomie-lot3.test.cjs`. Ils vérifient format/absences, compteur global, objectif sans fausse personnalisation, filtres sur les deux types, copie/favori distincts, cycle long/variations, cibles publiques sans notes privées, dates valides, retour des préférences et mise à jour de l’historique de recherche.
- Syntaxe JavaScript, `git diff --check`, comptage des 49 identifiants et liens locaux des README/audit contrôlés.
- Chromium, profil fictif dédié : recherche ne trouvant qu’un programme, retrait d’un filtre sans perte du nom, préférences et disponibilités revenant dans Découvrir, copie puis préparation et retour avec Déjà enregistré, sans doublon/exécution créée.
- Calendrier : choix d’une date à six mois, flèches, Début/Fin, changement de mois vers le 29 février, absence de création et d’entrée d’historique supplémentaire. Dates et commandes contrôlées : **44 px minimum dans les deux dimensions**, à 320, 390 et 1280 px.
- Cycle fictif de **20 semaines** : consultation progressive avec variations et cibles, import accessible ; partage/ancienne archive consultables. Préparation/T2 : valeurs françaises, correction RPE/charge, états visuels, revue et commandes. Aucun débordement du document aux trois largeurs dans les écrans contrôlés ; la grille étroite défile volontairement dans son cadre.
- Ces changements réduisent détours et défilement ou améliorent les repères. Le choix de date exige son ouverture, la saisie et une confirmation ; une semaine repliée demande une activation pour consultation. La taille accrue des commandes peut augmenter la hauteur. Aucun temps utilisateur ni gain KLM supplémentaire n’est annoncé sans scénario mesuré.

Téléphone physique, clavier virtuel réel, lecteur d’écran et évaluation auprès d’utilisateurs non réalisés. L’analyse T3 reste hors périmètre. Les deux supports de cours restent ignorés par Git.


## 14. Quatrième lot livré — 22 octobre 2026

R24–R26, R37–R40, R44, R47 et R49 sont retirés de la liste restante : **40 propositions livrées et 9 restantes sur les 49 initiales**. Les modifications du troisième lot sont conservées. Aucun écran d’analyse T3 n’est ajouté.

| Point livré | Comportement vérifié |
| --- | --- |
| R24 — création depuis une date | Nouvelle séance affiche la date et le nom à saisir, sans demander l’organisation ni recopier le budget/matériel du profil par supposition. Créer et choisir les exercices ouvre directement le sélecteur après création de l’occurrence. Créer plutôt un programme révèle le formulaire complet. Un brouillon du même contexte peut être repris ; aucune date hors calendrier n’est inventée. |
| R25 — plusieurs jours | Modifier plusieurs jours sélectionne des destinations puis Repos, À définir ou copie d’une séance source. Les contenus et brouillons occupés sont nommés et leur remplacement confirmé. La source reste conservée ; les exercices/cibles copiés sont indépendants. Annuler restaure les seuls jours et brouillons concernés, avec refus d’écraser un travail plus récent. Les copies du mésocycle et le calendrier restent distincts ; un cycle existant est marqué à remettre à jour. |
| R26 — catégories compréhensibles | Catégories pour nommer mes séances remplace Gabarit de répartition. L’aide affiche Full Body, Haut/Bas ou Push/Pull/Legs et dit explicitement qu’aucun jour, repos, exercice ou objectif ne sera rempli. Choisir une catégorie dans un jour reste une action explicite de nommage. |
| R37 — avancement des séries | Un bilan par exercice distingue faites, interrompues, non faites, saisies partielles, non renseignées et invalides ; seules les catégories utiles apparaissent. Série suivante sélectionne et focalise la ligne suivante sans la remplir ni déclarer la précédente faite. Le repère sélectionné reste distinct du statut de réalisation. |
| R38 — contexte unique | Avant la séance distingue état initial et effort prévu. Un seul texte Contexte de cette séance remplace les deux champs généraux ; les anciens textes sont réunis sans doublon et restent consultables. Sommeil/fatigue/douleur sont des précisions facultatives dépliables ; raisons par série conservées. Après la séance nomme le ressenti final. Aucun état choisi n’invente une douleur ou un niveau de fatigue. |
| R39 — réglage au bon endroit | Renseigner ou modifier le réglage utilisé se trouve à côté des consignes/réglages et ouvre directement son champ. Notes continue à focaliser la remarque. Le réglage prévu et le précédent restent des références ; rien n’est copié automatiquement dans le résultat réel. |
| R40 — médias et reprise | Ajout du fichier N sur M, En attente, Conservé et erreurs sont visibles par fichier. Réessayer ce fichier conserve les succès sans doublon ; une référence non sauvegardée se relance avec le même fichier/identifiant. La clôture attend toute l’opération, y compris ses phases asynchrones. Retrait échoué conserve fichier et référence. Annuler affiche Annulation… pendant le travail ; après échec, un bouton Annuler permet une nouvelle tentative. Les fichiers en échec restent disponibles pour réessai pendant la visite ; après rechargement, les fichiers non ajoutés doivent être choisis à nouveau. |
| R44 — clôture concise | Le bouton reste Terminer et conserver, avec avertissement adjacent sur les séries non renseignées ou faites mais incomplètes. Les compteurs à zéro disparaissent ; les statuts restent visibles sur chaque série. Erreur numérique et opération média en cours bloquent la clôture ; une omission autorisée garde son état sans inventer de résultat. |
| R47 — présentation du partage | Description facultative, titre et niveau requis. Erreurs locales liées aux champs, focus sur la première erreur, effacement après correction ; audience résumée immédiatement au changement. Le formulaire valide sans description. Aperçu et confirmation finale restent explicites ; aucune publication au choix du contenu. |
| R49 — choisir et compléter | Recherche dans les sources personnelles, état À compléter/Prêt à partager. Compléter ce contenu ouvre son éditeur et conserve titre, audience, description et options du brouillon. Une séance propose Enregistrer et revenir au partage ; une semaine retrouve le partage par son retour. Préparer un partage est disponible depuis une séance personnelle enregistrée, avec passage obligatoire par présentation et aperçu. Les données privées restent exclues de l’instantané public. |

### Vérifications et limites

- **92 tests ciblés réussis** : 77 précédents et 15 de `tests/ergonomie-lot4.test.cjs`. Copies indépendantes, annulation/restauration des brouillons et protection d’un travail ultérieur ; avancement sans réalisation implicite ; contexte ancien unifié ; réglage prévu distinct ; ajout média en cours, échec partiel/reprise, métadonnées non sauvegardées, retrait échoué et annulation réessayable ; clôture sans conversion des absences ; présentation facultative et réparation d’un partage conservé.
- Syntaxe JavaScript et `git diff --check` contrôlés ; identifiants restants/livrés et liens locaux vérifiés.
- Chromium, profil fictif dédié : création datée sans métadonnées supposées et sélecteur immédiat, sortie vers création complète, catégories sans remplissage des jours ; copies groupées, remplacement de séance par repos avec accord et annulation restaurant les cibles.
- Partage : recherche, signal À compléter, préparation puis retour au titre/audience conservés ; erreurs de titre/niveau, correction ciblée, audience immédiate et aperçu avec description vide. Aucun contenu de test publié.
- T2 : un seul contexte, focus direct sur Réglage utilisé, cible T1 conservée, progression partielle puis faite et sélection de la série suivante vide ; revue et avertissement des omissions.
- Médias : deux PNG locaux, premier ajout ralenti, second refusé ; feedback et clôture bloquée pendant l’attente, reprise du seul échec sans doublon. Retrait puis restauration refusée, nouvelle tentative ralentie avec Annulation… conservé, restauration réussie. Rechargement via le stockage natif puis clôture avec deux fichiers et séries toujours non renseignées. Retrait ralenti puis refusé pendant une navigation à la revue : référence conservée et erreur retrouvée dans la revue puis au retour sur les médias.
- Création courte, panneau de jours groupés, formulaire de partage, semaine, T2 et médias vérifiés à **320, 390 et 1280 px** sans débordement du document. Captures de semaine et revue examinées ; aucune erreur ni avertissement console dans le parcours contrôlé.

Le chemin de création datée évite le choix d’organisation et l’ouverture supplémentaire du sélecteur ; le réglage utilisé évite de focaliser d’abord Remarque puis de chercher le second champ. Les opérations groupées évitent un dialogue complet par jour. Ces réductions de détours ne constituent pas des temps utilisateur mesurés ; le coût de sélection et la confirmation des remplacements restent explicites. Tests sur téléphone physique, clavier virtuel réel, lecteur d’écran et évaluation auprès d’utilisateurs non réalisés.


## 15. Dernier lot livré — 22 octobre 2026

R09, R10, R14, R18, R36, R41, R43, R46 et R48 sont retirés de la liste restante : **49 propositions implémentées, 0 restante à implémenter**. Les lots précédents sont conservés. Les variantes sont livrées pour évaluation ; leur efficacité ergonomique auprès d’utilisateurs n’est pas déclarée prouvée.

| Point livré | Comportement vérifié |
| --- | --- |
| R09 — accès démo | Essayer sans compte ouvre le profil local séparé `demo:local`, sans identifiant ni mot de passe à saisir. Ce profil conserve ses propres données, sans exposer/réinitialiser celles d’un profil nommé. Les formulaires simulés restent disponibles pour leur évaluation. Ce chemin n’est pas une authentification réelle. |
| R10 — questions interrompues | Chaque choix et la position courante sont conservés par profil dans `onboardingDraft`. Après rechargement et retour au même profil, la question et les réponses sont reprises. Réponse précédente est visible ; Passer cette question et Passer le reste restent distincts. Un appui choisit et avance, sans nouveau bouton Continuer. Terminer efface ce brouillon sans réinitialiser les entraînements. Le lien autonome `#questions` utilise un profil de démonstration séparé. |
| R14 — favoris directs | Mes favoris filtre les séances des deux bibliothèques dans Découvrir ; les autres critères explicites restent appliqués. La sélection de bibliothèque est masquée pendant ce filtre puis retrouvée à sa désactivation. Enlever un favori actualise la liste et conserve un focus utile ; copie et planification restent indépendantes. Filtre et résultats sont repris au rechargement. |
| R18 — consulter puis ajouter | Toucher une date sélectionne toujours son jour, vide ou rempli. Ajouter ici et Ajouter ouvrent explicitement le panneau. Consulter une date vide ne déclenche aucune création ni modale. **Ajouter depuis un jour vide coûte un appui supplémentaire** par rapport à l’ouverture automatique initiale ; l’intérêt contre les ouvertures involontaires reste à comparer auprès d’utilisateurs. |
| R36 — charge seule | Charge seule · série N recopie uniquement la charge précédente valide, y compris 0, sans répétitions/RPE/ressenti/statut/raisons/cibles inventés. Une série Non faite et une charge source invalide sont exclues. Annuler restaure uniquement l’ancienne charge et sa saisie/erreur, conserve les répétitions saisies depuis et refuse une charge modifiée entre-temps. Si des répétitions réelles existaient déjà, la complétude suit la règle habituelle ; aucune déclaration Faite n’est écrite par la recopie. La recopie intégrale reste disponible pour des résultats réellement identiques. |
| R41 — repos facultatif | Repos… ouvre un minuteur près des séries ; il ne démarre qu’après Démarrer. Durée réutilisable de 5 à 3600 secondes, préréglages 30/60/90/120, pause/reprise, réinitialisation et Fermer et arrêter. Le temps restant est calculé depuis l’heure de fin, y compris après navigation/rechargement ; aucune notification, son, validation de série ou modification de résultat. La fin est signalée dans le panneau. Le minuteur est un état d’exécution, exclu du bilan archivé. |
| R43 — correction sur place | Corriger ici ouvre les résultats réels dans la ligne de revue, avec autosauvegarde, valeurs brutes séparées et erreurs bloquantes. Compteurs, résultats, omissions et autorisation de clôture s’actualisent sans navigation ni reconstruction des champs. Les autres séries et les cibles restent conservées. Ouvrir dans l’entraînement reste disponible pour les adaptations et cas particuliers ; le retour retrouve la ligne. Entrée ferme la correction, sans terminer la séance. Aucune édition dans un bilan archivé. |
| R46 — retrouver un bilan | Recherche par nom de séance, regroupement par date et tri Plus récentes/Plus anciennes. Le retour d’un bilan et le rechargement retrouvent recherche, tri et défilement. Recherche vide avec récupération explicite. Aucun filtre de performance, comparaison, record ou analyse T3 ajouté. |
| R48 — une confirmation nommée | L’aperçu conserve contenu et audience, puis propose Publier dans la communauté ou Partager avec mes contacts. La case supplémentaire est retirée. Une modification est nommée Mettre à jour pour…, une republication reste distincte. Le code refuse la publication avant l’aperçu et vérifie encore les informations/conditions de contenu. Les échecs de stockage continuent à conserver le brouillon. Le gain d’une activation ne prouve pas la compréhension de l’audience ; cette dernière reste à évaluer. |

### Vérifications réalisées

- **104 tests ciblés réussis** : les 92 précédents et les 12 de `tests/ergonomie-lot5.test.cjs`. Favoris des deux bibliothèques et critères, date vide sans ajout, recopie de charge sans autres valeurs, minuteur à horloge contrôlée (bornes, pause/reprise, expiration, arrêt et absence de résultats modifiés), état du minuteur exclu de l’archive, recherche/tri sans modifier les bilans, restauration de contexte par profil, publication impossible avant aperçu et archive sans champs de correction.
- Syntaxe de tous les modules JavaScript et `git diff --check` contrôlés. Les 49 identifiants sont présents une seule fois dans les cinq tableaux de livraison ; aucun identifiant restant. Liens locaux et ancres des documents modifiés vérifiés ; Cours5/Cours6 restent ignorés par Git.
- Chromium, profil fictif dédié : questionnaire interrompu à la deuxième question, retour à la première réponse, question passée, nouveau rechargement à la troisième, fin conservant un entraînement préexistant. Accès démo sans saisie de mot de passe et retour au profil nommé sans mélange des données.
- Favoris des deux bibliothèques, retrait d’un favori, focus de retour, rechargement du filtre ; date vide consultée sans modale puis ajout explicite.
- Charge seule sur une série vide, nouvelles répétitions puis annulation ne touchant qu’à la charge. Minuteur sans démarrage implicite, pause/reprise/rechargement et fin après avancement contrôlé de l’échéance ; aucune valeur réelle changée. Durée vide rejetée, arrêt du rafraîchissement en quittant T2 et expiration retrouvée au retour.
- Revue : charge négative bloquante, correction française 22,5/7,5 avec compteurs actualisés, autres séries/cibles conservées. Saisie inachevée `22,` conservée après rechargement et bloquante pour l’archivage, sans alerte prématurée pendant la frappe. Retour avancé vers la ligne exacte ; Entrée ferme le volet sans clôture ; archive en lecture seule.
- Trente bilans fictifs : recherche de dix séances Jambes, tri chronologique, détail puis retour à la recherche et au défilement, rechargement du même bilan, récupération d’une recherche vide.
- Simulation locale de partage : audience Contacts visible dans l’aperçu et le bouton, absence de publication avant cette action, publication unique puis mise à jour sans doublon. Aucune publication distante ; le serveur local de test a été relancé après une interruption, puis le scénario a été rejoué avec succès.
- Questionnaire, minuteur, correction de revue, calendrier, historique et aperçu de partage vérifiés à **320, 390 et 1280 px**, sans débordement du document. Captures examinées. Le défilement interne de la grille étroite reste intentionnel.

### Clôture et évaluation restante

La liste de développement est terminée. L’analyse T3 reste à concevoir. Téléphone physique, clavier virtuel réel, lecteur d’écran et tests utilisateur ne sont pas réalisés. Les variantes R18 et R48 doivent notamment être comparées sur compréhension, activations involontaires, erreurs et accomplissement des tâches ; les comptes de clics et tests automatisés ne les remplacent pas. Les autres scénarios utilisateur de la section 9 restent également à exécuter.


## 16. Ajustements demandés après la clôture — 22 octobre 2026

Cette passe applique les demandes visuelles et de navigation formulées après les 49 propositions. Elle ne rouvre pas cette liste ; elle remplace notamment la variante R18 « Ajouter ici » par une seule action globale d’ajout.

| Demande | Comportement livré |
| --- | --- |
| Connexion | Deux textes retirés ; formulaires et Essayer sans compte conservés. |
| Questions | Précédente et Passer cette question alignés sous l’aide avec flèches ; aucun retour à la connexion, aucun texte répétitif de sauvegarde. Réponses/position restent sauvegardées. |
| Découvrir | Textes de suggestion/tri et introduction des programmes retirés ; provenance Bibliothèque de départ retirée des cartes. Filtres, tri, favoris, copie/import et auteur communautaire conservés. |
| Adapter au niveau | Niveau absent et Débutant : essentiels ; Intermédiaire/Avancé : RPE et outils détaillés disponibles. RPE masqué aussi dans entraînement, adaptation, bilan et aperçu public, sans effacer les valeurs existantes. Échéances réservées à Avancé. |
| Séparer calendrier et bibliothèque | Mes entraînements devient une page de navigation autonome : recherche, création, planification et suppression. Calendrier ne contient plus la liste ni le formulaire de création. |
| Un seul ajout au calendrier | + Ajouter en haut ; date initiale aujourd’hui, indépendante de la date consultée, modifiable avant placement. Séances et repos utilisent cette date ; hors débutant, les jours groupés se recalculent après changement. |
| Supprimer un modèle | Confirmation puis suppression de la liste et des seuls brouillons personnels ; Annuler restaure le modèle. Occurrences déjà planifiées, exécutions en cours, bilans et publications conservés. |
| Exercice libre | Nom dans la recherche puis Ajouter : catalogue personnel et brouillon mis à jour. Réutilisation des noms normalisés existants ; détails facultatifs via le formulaire conservé. |
| Mésocycle avancé | Structure, fréquence, durée et objectif avant jours/exercices. Structure personnalisée et objectif non vides requis ; brouillon repris après rechargement, contexte visible à l’étape suivante. |

**Vérifications :** 111 tests ciblés réussis (104 existants adaptés aux nouveaux libellés/niveaux, 7 dans `tests/profile-library.test.cjs`). Ils couvrent séparation des écrans, niveaux, masquage sans effacement, suppression de séance et cycle avec conservation/annulation, nom libre sans doublon normalisé et restauration de navigation.

Parcours Chromium : connexion/démo, navigation des trois questions, retour avec choix conservé, textes retirés, création débutante, exercice par nom retrouvé après rechargement, date initiale aujourd’hui malgré une consultation éloignée puis placement à une date modifiée, suppression/annulation/restauration. Parcours T2 débutant jusqu’au bilan, adaptation de série sans RPE ; mésocycle avancé avec erreurs initiales, structure libre/objectifs repris après rechargement, configuration des jours/exercices, RPE choisi, échéances, planification depuis la bibliothèque et suppression du cycle en conservant l’exécution en cours. Écrans principaux contrôlés à 320, 390 et 1280 px sans débordement du document.

**Effets sur les actions :** une seule entrée évite deux libellés Ajouter concurrents ; créer un exercice inconnu à partir d’un nom ne demande plus d’ouvrir et de soumettre un second formulaire. Créer un mésocycle avancé demande davantage de décisions initiales explicites pour structurer le cycle. Ces changements ne constituent pas une mesure de vitesse : téléphone physique, lecteur d’écran et essais utilisateurs restent à faire ; T3 reste distinct.


## 17. Charges et répétitions de la séance précédente — 22 octobre 2026

Dans la préparation d’une occurrence de mésocycle ou d’une semaine nouvellement répétée, chaque exercice montre la séance précédente correspondante et ses résultats par série : charge et répétitions. Pendant l’entraînement, le même repère apparaît près de chaque ligne de saisie. Aucune action supplémentaire n’est nécessaire pour consulter ces valeurs ; elles ne remplissent ni les cibles ni les résultats du jour.

La comparaison est limitée au même placement de mésocycle et jour de référence, ou à la même séance d’origine d’une répétition de semaine. Les copies hebdomadaires conservent une clé de répétition, y compris dans leurs bilans ; répéter une copie garde la même origine. Une duplication isolée et une planification indépendante ne déclenchent pas le nouveau tableau. Les anciennes copies sans lien fiable ne sont pas regroupées automatiquement.

Une seule séance terminée précédente est retenue par date, sans combler ses omissions avec des résultats plus anciens. Les slots stables évitent les confusions entre exercices identiques et supportent leur réordonnancement. Les séries non faites sont nommées sans afficher leurs anciennes valeurs mises de côté ; zéro kg, répétition zéro, interruption et valeurs absentes restent distincts. Les résultats restent séparés des cibles, de la nouvelle saisie et de la publication.

Vérifications : **121 tests ciblés réussis**, dont 10 nouveaux dans `tests/repeated-session-history.test.cjs` sur portée, dates et référence unique, origine de répétition, anciens bilans, slots/remplacements/doublons, absences/statuts, lecture seule et conservation de la clé hors instantané public. Parcours Chromium : planification d’un mésocycle, saisie et clôture de la première séance, préparation de la suivante, ajout d’une série, repères dans T2, rechargement et passage à la dernière séance terminée sans reprise des résultats plus anciens. Répétition réelle d’une semaine, distinction de deux séances ayant le même exercice, répétition d’une copie et duplication isolée contrôlées également. Vues de préparation et entraînement vérifiées à 320, 390 et 1280 px sans débordement du document. Le test hebdomadaire a reproduit un recouvrement du bouton de répétition par le message Annuler et la navigation fixes ; une marge de défilement supplémentaire en bas du calendrier permet désormais de placer ce bouton au-dessus du message. Le même scénario tactile simulé passe après correction. Téléphone physique et essais utilisateurs restent à réaliser.
