# UAN — Remplir un entraînement pendant la séance

Modèle de la tâche T2 complète, du lancement de la séance à l'enregistrement du bilan : commencer la séance, renseigner les séries et leur statut, adapter les cibles, passer d'un exercice à l'autre, vérifier, ajouter son ressenti et terminer. La saisie d'une série est détaillée à part dans l'[UAN de saisie d'une série](uan-saisie-serie.md), qui sert ici de sous-tâche `ConsignerSerie`.

Source : `Cours6.pdf`, diapositives 39–49 (UAN). Le modèle décrit le prototype actuel ([entrainement.js](<../../prototypes/propotype 1/08-entrainement/entrainement.js>), [bilan.js](<../../prototypes/propotype 1/08-entrainement/bilan.js>), [seance.js](<../../prototypes/propotype 1/06-configuration-seance/seance.js>)). Il ne contient aucun résultat expérimental.

## But, départ et arrivée

**But :** faire la séance prévue et garder ce qui a réellement été fait.

**Départ :** une séance préparée existe dans le calendrier (T1), aucune exécution n'est en cours pour elle, le téléphone est en main, sans clavier affiché.

**Arrivée :** un bilan est enregistré dans Bilans avec les résultats réels de chaque série, leur statut, les cibles adaptées et le ressenti éventuel. Les cibles prévues dans T1 n'ont pas changé.

La notation est celle de l'[UAN de saisie d'une série](uan-saisie-serie.md#but-états-et-notation) : `~[X]` amener le doigt au-dessus de X, `Dv`/`D^` poser/lever le doigt (adaptation tactile du `Mv`/`M^` du cours), `ClavierTactile"..."` saisir une valeur sur le clavier du téléphone, `X!` / `X-!` mettre / retirer la mise en évidence, `∀` pour tout, `display(X)` affichage, `OR` alternative, `&` ordre libre, `*` répétition, `{A}` facultatif, `condition : action`, `;` interruption possible. `Activer(X)` signifie `~[X] Dv D^`, c'est-à-dire toucher X. Un élément hors de l'écran est d'abord amené par un glissement (`{Defiler}`), qui n'est pas répété dans les tables.

## Hiérarchie des tâches

Comme dans le cours (diapositives 42 et 44), la tâche principale se présente dans un tableau dont la colonne User Action contient les sous-tâches. Les relations entre sous-tâches utilisent les symboles de la diapositive 43 : séquence `A B`, disjonction `OR` (notée aussi `|`), répétition `*` ou `+`, facultatif `{A}`, interruption `;`.

**Task : RemplirSeance**

| User Action | Interface Feedback | Interface State |
| --- | --- | --- |
| `CommencerSeance`<br>`{RenseignerEtatDuJour}`<br>`(RealiserExercice(e) ;)+`<br>`VerifierEtTerminer` | Voir chaque sous-tâche | Exécution en cours, puis bilan enregistré |

Décomposition des sous-tâches :

```text
RemplirSeance
  CommencerSeance
  {RenseignerEtatDuJour}
  (RealiserExercice(e) ;)+
  VerifierEtTerminer

CommencerSeance
  Activer(seance[jour]) Activer(CommencerLaSeance)
  OR seanceEnCours : Activer(Reprendre[seance])

RealiserExercice(e)
  {ChoisirExercice(e)}
  (TraiterSerie(e,i) ;)*
  {AjouterSerie(e)}
  {AjouterNotes(e)}
  PasserALaSuite(e)

TraiterSerie(e,i)
  {AdapterCible(i)}
  {Repos(i)}
  ConsignerSerie(i) OR DeclarerStatut(i)
  {DeclarerEffortAdapte(i)}
  {Activer(SerieSuivante)}

PasserALaSuite(e)
  e < dernier : Activer(Suivant)
  OR e = dernier : Activer(VerifierEtTerminer)

VerifierEtTerminer
  Activer(VerifierEtTerminer)
  Verifier(bilan)
  (Corriger(i))*
  {AjouterNoteEtRessenti}
  Activer(TerminerEtEnregistrer)
```

`ConsignerSerie(i)` est entièrement décrite dans l'[UAN de saisie d'une série](uan-saisie-serie.md) : saisie au clavier tactile, boutons + et −, recopies et correction. Le `;` après chaque série et chaque exercice indique qu'on peut quitter la séance à ce moment sans rien perdre (voir [Interruption et reprise](#interruption-et-reprise)). Les exercices peuvent être faits dans un autre ordre grâce à `ChoisirExercice`.

## 1. Commencer la séance

**Task : CommencerSeance**

| User Action | Interface Feedback | Interface State |
| --- | --- | --- |
| `Activer(seance[jour])` dans le Calendrier | Écran de préparation de la séance : exercices, cibles et `display("Séance prête")`. Si des cibles manquent : « cibles à compléter, facultatives pour commencer ». | Aucune exécution créée. |
| `Activer(CommencerLaSeance)` | Écran Entraînement : date, nom de la séance, indicateur « En cours · Saisie conservée », exercice 1 avec illustration, consigne, réglage prévu, cible prévue pour chaque série, résultat précédent comparable s'il existe. `serie[1]!`. | Exécution créée pour cette occurrence : une ligne vide par série prévue, cibles copiées depuis T1 et séparées des résultats, date de début enregistrée. |
| `seanceEnCours : Activer(Reprendre[seance])` (Calendrier, Bilans ou bouton « Reprendre la séance » de la préparation) | Écran Entraînement à l'exercice et à la série où l'on s'était arrêté. | Même exécution, saisies retrouvées. Aucune seconde exécution créée. |
| `seanceTerminee : Activer(VoirLeBilan)` | Le bouton de préparation s'appelle « Voir le bilan » et ouvre le bilan existant. | Aucune nouvelle exécution : une séance terminée ne peut pas être recommencée par erreur. |

## 2. Renseigner l'état du jour (facultatif)

**Task : RenseignerEtatDuJour**

| User Action | Interface Feedback | Interface State |
| --- | --- | --- |
| `Activer(AvantLaSeance)` | Volet « Avant la séance · état et effort » ouvert, avec le résumé « Facultatif ». | Aucun changement de données. |
| `Activer(EnForme)` OR `Activer(Fatigue)` OR `Activer(Gene)` | Bouton choisi `aria-pressed` ; résumé du volet mis à jour. | `dayState.feeling` enregistré. |
| `Activer(PlusLeger)` OR `Activer(Habituel)` OR `Activer(PlusSoutenu)` | Idem pour l'effort prévu. | `dayState.effort` enregistré. Les cibles ne changent pas. |
| `Activer(choixDejaPris)` | Le choix est retiré, résumé mis à jour. | Valeur remise à vide. |

Aucun de ces choix n'est obligatoire pour continuer.

## 3. Traiter une série

### Renseigner les valeurs

`ConsignerSerie(i)` : voir l'[UAN de saisie d'une série](uan-saisie-serie.md). En résumé, l'utilisateur saisit la charge et les répétitions (et le RPE ou le ressenti selon son niveau), au clavier tactile, avec les boutons + et −, ou en recopiant la série précédente ou la séance précédente. Le statut « Faite » s'affiche dès que la charge et les répétitions sont complètes. Il n'y a pas de bouton « Valider la série » : chaque valeur est conservée dès qu'elle est saisie.

### Déclarer le statut d'une série

**Task : DeclarerStatut(i)**

| User Action | Interface Feedback | Interface State |
| --- | --- | --- |
| `Activer(CasParticulier[i])` | Volet ouvert : boutons Faite, Interrompue, Non faite ; case « Effort adapté pendant cette série » ; champ « Raison du cas particulier (facultative) ». | Série i active. |
| `Activer(Faite[i])` | `display("Série déclarée faite · aucune valeur inventée")` avec Annuler. Si des valeurs manquent : statut « Faite · résultats à compléter ». | `outcome = completed`, sans valeur ajoutée. |
| `Activer(Interrompue[i])` | `display("Série interrompue · résultats partiels conservés")` avec Annuler. | `outcome = interrupted`. |
| `Activer(NonFaite[i])` | `display("Série déclarée non faite · valeurs conservées")` avec Annuler ; champs désactivés, bouton « Reprendre la saisie ». | `outcome = skipped`. |
| `Activer(statutDejaChoisi[i])` | `display("Statut selon la saisie")` avec Annuler. | Statut explicite retiré ; statut recalculé à partir des valeurs. |
| `{Activer(Raison[i]) ClavierTactile"..."}` | Texte affiché (300 caractères au plus). | `outcomeReason` enregistrée. |

### Déclarer un effort adapté

**Task : DeclarerEffortAdapte(i)**

| User Action | Interface Feedback | Interface State |
| --- | --- | --- |
| `Activer(EffortAdapte[i])` | Case cochée ; statut de la série complété par « · adaptée ». | `adapted = true` ; la cible ne change pas. |

### Passer à la série suivante

**Task : TraiterSerie(e,i), changement de série**

| User Action | Interface Feedback | Interface State |
| --- | --- | --- |
| `Activer(SerieSuivante)` | `serie[i+1]!`, `∀ serie[j] ≠ serie[i+1] : serie[j]-!`, « Série i+1 sur n » ; focus sur le premier champ de la série i+1. Bouton désactivé sur la dernière série. | Série active = i+1 ; aucune donnée modifiée. |
| `Activer(Serie[j])` (titre « Série j ») | `serie[j]!`, `∀ serie[k] ≠ serie[j] : serie[k]-!` ; outils Repos et recopie déplacés près de cette série. | Série active = j. |

### Prendre un repos (facultatif)

**Task : Repos(i)**

| User Action | Interface Feedback | Interface State |
| --- | --- | --- |
| `Activer(Repos[i])` | Volet « Repos facultatif » ouvert avec la durée (90 s par défaut) et « Le minuteur ne modifie aucun résultat ». | Minuteur associé à la série i. |
| `{Activer(30s) OR Activer(60s) OR Activer(90s) OR Activer(120s)}` `Activer(Demarrer)` | Décompte affiché et mis à jour chaque seconde ; « En cours ». | Durée retenue comme réglage par défaut. |
| `Activer(Pause)` OR `Activer(Reinitialiser)` OR `Activer(FermerEtArreter)` | « En pause », retour à la durée de départ, ou volet fermé. | Minuteur suspendu, remis à zéro ou supprimé. |
| Fin du décompte, sans action | `display("Repos terminé")`. | Minuteur à 0. |

## 4. Adapter la cible d'une série

**Task : AdapterCible(i)**

| User Action | Interface Feedback | Interface State |
| --- | --- | --- |
| `Activer(AdapterLaCible[i])` | Formulaire « Adapter la série i uniquement » avec la cible initiale rappelée ; focus sur « Charge cible (kg) ». | Série i active ; aucune cible modifiée. |
| `{Activer(ChargeCible) ClavierTactile(charge)}` | Valeur affichée. | Brouillon du formulaire. |
| `{Activer(ModeRepetitions) (Fixes OR Plage)}` | Fixes : un seul champ « Répétitions ». Plage : « Répétitions minimum » et « Répétitions maximum ». | Brouillon du formulaire. |
| `{Activer(RepetitionsMin) ClavierTactile(min)} {Activer(RepetitionsMax) ClavierTactile(max)}` | Valeurs affichées. | Brouillon du formulaire. |
| `{rpeVisible : Activer(EffortVise) ClavierTactile(rpe)}` `{Activer(Raison) ClavierTactile"..."}` | Valeurs affichées. | Brouillon du formulaire. |
| `Activer(AppliquerACetteSerie)` avec des valeurs valides | `display("Cible de cette série adaptée · programme et résultats conservés")` ; la série affiche « Cible adaptée » et « Initiale : … », et la raison si elle existe. | Adaptation enregistrée pour la série i seulement. Le programme T1 et les résultats réels ne changent pas. |
| `Activer(AppliquerACetteSerie)` avec maximum < minimum | `display("Le maximum doit être supérieur ou égal au minimum.")` ; focus sur le maximum. | Rien n'est enregistré. |
| `Activer(AppliquerACetteSerie)` avec un nombre invalide | Message de validation du champ concerné. | Rien n'est enregistré. |
| `Activer(Annuler)` dans le formulaire | Formulaire fermé ; focus sur « Adapter la cible ». | Rien n'est enregistré. |
| `Activer(RetablirLaCibleInitiale[i])` ; `{Activer(Annuler)}` | `display("Cible initiale rétablie")` avec Annuler. | Adaptation supprimée ; Annuler la remet. |

Si les valeurs saisies sont identiques à la cible initiale et sans raison, l'adaptation n'est pas créée.

## 5. Ajouter une série et des notes

**Task : AjouterSerie(e), AjouterNotes(e)**

| User Action | Interface Feedback | Interface State |
| --- | --- | --- |
| `Activer(AjouterUneSerie)` | Nouvelle ligne « Série n+1 » ; focus dans son premier champ ; `serie[n+1]!`. | Une ligne vide ajoutée à cet exercice ; série active = n+1. |
| `{Activer(Notes[e])}` | Volet « Notes, réglage et médias » de l'exercice : remarque, réglage utilisé, rappel, médias avec légende. | Notes enregistrées pour cet exercice dans l'exécution. |
| `{Activer(RenseignerLeReglageUtilise) ClavierTactile"..."}` | « Réglage utilisé : … » affiché sous le réglage prévu. | Réglage réel enregistré, séparé du réglage prévu. |

## 6. Passer d'un exercice à l'autre

**Task : PasserALaSuite(e), ChoisirExercice(e)**

| User Action | Interface Feedback | Interface State |
| --- | --- | --- |
| `Activer(Suivant)` | Exercice e+1 affiché ; focus sur son titre ; « Exercice e+1 sur n ». | `exerciseIndex = e+1` ; résultats de e conservés. |
| `Activer(Precedent)` | Exercice e−1 affiché ; bouton désactivé sur le premier exercice. | `exerciseIndex = e−1`. |
| `Activer(ListeExercices) Activer(exercice[k])` | Exercice k affiché. | `exerciseIndex = k` ; les exercices peuvent être faits dans un ordre libre. |
| Sur le dernier exercice | Le bouton Suivant est remplacé par « Vérifier et terminer… ». | Aucun changement. |

## 7. Vérifier, ajouter son ressenti et terminer

### Vérifier

**Task : VerifierEtTerminer : vérification**

| User Action | Interface Feedback | Interface State |
| --- | --- | --- |
| `Activer(VerifierEtTerminer)` | Écran « Vérifier avant de terminer », étape « 1. Vérifier et enregistrer » ; nombre de séries faites, interrompues, non faites, non renseignées, à corriger et adaptées ; détail de chaque exercice et de chaque série. | La séance reste en cours : rien n'est encore enregistré comme bilan. |
| Vérification visuelle, sans action motrice | Avertissement si des séries sont non renseignées ou incomplètes : « Tu peux corriger ou conserver ces informations telles quelles ; aucun résultat ne sera inventé. » | Aucun changement. |
| `erreursPresentes :` retour système | Section « À corriger avant conservation » listant chaque erreur ; bouton « Terminer et enregistrer mon bilan » désactivé. | Clôture bloquée tant qu'une erreur existe. |

### Corriger depuis la vérification

**Task : Corriger(i)**

| User Action | Interface Feedback | Interface State |
| --- | --- | --- |
| `Activer(erreur[i])` OR `Activer(OuvrirDansLEntrainement[i])` | Retour à l'écran Entraînement sur l'exercice et la série concernés ; focus sur le champ en erreur. | Position mémorisée pour revenir au même endroit de la vérification. |
| `Activer(CorrigerIci[i])` puis `ConsignerSerie(i)` | Champs de la série ouverts sur place ; `display("Correction conservée · bilan encore en préparation")` ; compteurs et erreurs mis à jour. | Résultat corrigé ; bouton Terminer réactivé quand il n'y a plus d'erreur. |
| `nonRenseignee : Activer(MarquerNonFaite[i])` ; `{Activer(Annuler)}` | `display("Série déclarée non faite")` avec Annuler. | `outcome = skipped`. |
| `Activer(ReprendreLaSeance)` | Retour à l'écran Entraînement. | Séance toujours en cours. |

### Ajouter une note et son ressenti (facultatif)

**Task : AjouterNoteEtRessenti**

| User Action | Interface Feedback | Interface State |
| --- | --- | --- |
| `{Activer(NoteDeSeance) ClavierTactile"..."}` | Texte affiché (500 caractères au plus) ; `display("Bilan en préparation · choix conservés")`. | `completion.note` enregistrée dans le brouillon. |
| `{Activer(RessentiEtRappel)}` | Volet ouvert : boutons Bien, Mitigé, Difficile et champ « À penser pour la prochaine séance ». | Aucun changement. |
| `Activer(Bien)` OR `Activer(Mitige)` OR `Activer(Difficile)` | Bouton choisi `aria-pressed` ; un second appui retire le choix. | `completion.feeling` enregistré ou vidé. |
| `{Activer(Rappel) ClavierTactile"..."}` | Texte affiché. | `completion.reminder` enregistré. |

### Terminer

**Task : VerifierEtTerminer : fin**

| User Action | Interface Feedback | Interface State |
| --- | --- | --- |
| `Activer(TerminerEtEnregistrerMonBilan)` | `display("Séance terminée · bilan conservé")` ; écran « Séance terminée », étape « 2. Bilan conservé », « ✓ Bilan enregistré sur cet appareil », compteurs, ressenti, note et rappel ; boutons « Revenir au calendrier » et « Voir mes bilans ». | Bilan créé avec sa date de fin ; exécution en cours supprimée ; la séance ne peut plus être modifiée depuis l'écran Entraînement. |
| `mediaEnCours :` même action | `display("Attends la fin de l'ajout ou du retrait de média, puis réessaie.")` | Rien n'est enregistré ; séance toujours en cours. |
| `echecStockage :` même action | `display("Le bilan n'a pas pu être confirmé. Ta séance reste en cours, avec ses saisies. Réessaie après avoir rétabli le stockage.")` | Retour à l'état d'avant : aucun bilan partiel, brouillon conservé. |
| `{Activer(RevenirAuCalendrier) OR Activer(VoirMesBilans)}` | Calendrier ou liste des bilans. | Aucun changement ; la suite (comparaison des résultats) relève de T3. |

## Interruption et reprise

**Task : Interruption et reprise (`;`)**

La séance peut être quittée à tout moment marqué `;`, entre deux séries ou deux exercices, et même au milieu d'une saisie.

| User Action | Interface Feedback | Interface State |
| --- | --- | --- |
| `Activer(QuitterSaisieConservee)` | Calendrier ; encart « Séances en cours » avec la séance, sa date et « exercice e sur n ». | Exécution conservée telle quelle, sans bilan. |
| `Activer(Reprendre[seance])` depuis le Calendrier ou Bilans | Écran Entraînement à l'exercice et à la série en cours. | Mêmes valeurs, mêmes erreurs, mêmes adaptations. |
| `echecStockage :` retour système, sans action | `display("Sauvegarde indisponible")` et bouton « Réessayer la sauvegarde » ; aucun faux succès. | Données gardées en mémoire ; rechargement de la page non garanti. |

## Exemple : une séance de deux exercices

Séquence normale pour une séance de deux exercices de deux séries, avec une adaptation et un ressenti :

```text
Activer(seance[jour]) Activer(CommencerLaSeance)
ConsignerSerie(1) Activer(SerieSuivante) ConsignerSerie(2)
Activer(Suivant)
Activer(AdapterLaCible[1]) Activer(ChargeCible) ClavierTactile"40" Activer(AppliquerACetteSerie)
ConsignerSerie(1)
Activer(SerieSuivante) Activer(CasParticulier[2]) Activer(Interrompue[2])
Activer(VerifierEtTerminer)
Activer(RessentiEtRappel) Activer(Bien)
Activer(TerminerEtEnregistrerMonBilan)
```

## Correspondance avec le code

- [seance.js](<../../prototypes/propotype 1/06-configuration-seance/seance.js>) : bouton `start-training` (Commencer / Reprendre / Voir le bilan).
- [entrainement.js](<../../prototypes/propotype 1/08-entrainement/entrainement.js>) : `open`, `resume`, `dayStateMarkup`, `setOutcome`, `setActive`, `openAdaptation`, `adapt`, `restAction`, ajout de série et navigation dans `bind`, `ongoingMarkup`.
- [enrichissement.js](<../../prototypes/propotype 1/08-entrainement/enrichissement.js>) : notes, réglage utilisé et médias.
- [bilan.js](<../../prototypes/propotype 1/08-entrainement/bilan.js>) : `openReview`, `renderReview`, `issues`, `inlineEditor`, `finish`, `renderSummary`.
- Tests : [résultats](../../tests/training-results.test.cjs), [clôture](../../tests/training-completion.test.cjs), [notes et médias](../../tests/training-enrichment.test.cjs), [préparation](../../tests/training-preparation.test.cjs).

## Limites

- Les médias (ajout, retrait, erreurs de lecture) sont seulement cités : leur détail sortirait du cœur de la tâche.
- Le modèle n'attribue aucune durée aux actions ; les temps sont estimés dans l'[analyse Keystroke](keystroke.md).
- Il décrit ce que l'interface affiche, pas ce que l'utilisateur perçoit ou comprend. Cela relève du [protocole utilisateur](protocole-utilisateur.md).
