# UAN — Consigner et corriger une série réelle

Modèle du 4 novembre 2026, T2.2.2/T2.2.4/T2.2.5. Source : `Cours6.pdf`, pages PDF 20–25, diapositives 39–49 ; les tables de notation des diapositives 46–47 ont été lues sur les pages rendues. Ce modèle décrit l’interface actuelle, sans résultat expérimental.

## But, états et notation

But : consigner **20 kg et 10 répétitions réellement effectuées**. Départ : séance commencée, ligne i visible et non déclarée non faite, charge/répétitions vides, main sur souris. Arrivée : valeurs conservées dans le brouillon, autres séries et cibles intactes ; séance toujours en cours. Le RPE est une extension facultative visible selon le profil et le suivi choisi, comme dans l’[analyse KLM](keystroke.md).

| Notation du cours | Sens employé |
| --- | --- |
| `~[X]` | Déplacer le pointeur dans le contexte de l’objet X. |
| `Mv`, `M^` | Enfoncer puis relâcher le bouton de souris M ; **Mv n’est pas un déplacement**. |
| `X"abc"`, `X(valeur)` | Saisir une chaîne littérale ou une valeur via le dispositif X ; ici `Clavier"20"`. |
| `A B`, lignes successives | Séquence A puis B. |
| `OR`, `&`, `*`, `{A}` | Alternative, ordre indépendant, zéro ou plusieurs répétitions, facultatif. |
| `condition : action`, `;` | Action conditionnelle ; point où une interruption est permise, avec effet précisé. |
| `X!`, `display(X)`, `erase(X)` | Mise en évidence, affichage, retrait d’un retour d’interface. |

`Activer(X)` est une sous-tâche définie par `~[X] Mv M^`. Les noms `Saisir`, `Corriger`, etc. sont des sous-tâches du projet, pas de nouveaux opérateurs. M désigne la souris ici, et non l’activité mentale M du KLM.

```text
ConsignerSerie(i)
  (Saisir(charge,i) & Saisir(repetitions,i))
  {rpeVisible : Saisir(rpe,i)}
  Verifier(i)
  (Corriger(champ,i))*

Saisir(champ,i)
  Activer(champ[i])
  Clavier(valeurReelle)
  ;

Corriger(champ,i)
  Activer(champ[i])
  Clavier(valeurCorrigee)
  Verifier(i)
```

L’ordre de saisie charge/répétitions est libre (`&`). La méthode clavier précise ci-dessous choisit charge puis répétitions. À `;`, l’interruption après une frappe conserve la valeur brute et la dernière valeur valide déjà traitées, si le stockage réussit. Elle ne confirme pas la fin de séance. La réalisation physique précède la saisie et reste hors de ce modèle d’interaction.

## Méthode normale : saisie directe et progression clavier

| User Action | Interface Feedback | Interface State |
| --- | --- | --- |
| `~[charge[i]] Mv M^` | `charge[i]!` ; focus et sélection de la valeur éventuelle. | Série i active ; cibles inchangées. |
| `Clavier"20"` | `display("20")` ; indicateur « Saisie conservée » si sauvegarde réussie. | Chaque événement de saisie traite la valeur brute ; résultat charge = 20 après la deuxième frappe. Répétitions restent nulles. |
| `Clavier(Entrée)` | `repetitions[i]!` ; focus sur Répétitions, pas sur les boutons +/−. | Aucune valeur supplémentaire créée. |
| `Clavier"10"` | `display("10")`, statut « Faite » calculé à partir de charge et répétitions complètes. | Résultat i = {charge:20, répétitions:10} dans le brouillon ; aucune archive ni soumission par série. |
| Vérification visuelle, sans opérateur moteur ajouté | Valeurs réelles affichées avec leurs unités ; cible initiale reste distincte. | Séance en cours ; autres lignes inchangées. |

Cette dernière activité de vérification n’est pas un clic « Terminer la série » : ce bouton n’existe pas. Le statut peut aussi être déclaré explicitement dans « Cas particulier », sans inventer de résultat numérique.

## Variantes, erreurs et reprise de la même tâche

| User Action | Interface Feedback | Interface State |
| --- | --- | --- |
| `Activer(charge[i]) Clavier"-1"` | `display("-1")`, `display(erreurLocale)` ; « Saisie à corriger ». | Valeur brute invalide séparée ; dernière charge valide conservée ; clôture bloquée tant que l’erreur active subsiste. |
| `Activer(charge[i]) Clavier"22,5"` | `display("22,5")`, `erase(erreurLocale)` après correction valide. | Charge réelle = 22,5 ; répétitions, autres séries et cible initiale intactes. |
| `Activer(CasParticulier[i]) Activer(NonFaite[i])` | `display("Série déclarée non faite · valeurs conservées")`, champs désactivés. | `outcome = skipped` ; anciennes valeurs gardées pour correction, exclues des résultats utilisés pour ce statut. |
| `Activer(ReprendreLaSaisie[i])` | Champs à nouveau éditables ; valeurs précédemment saisies réaffichées. | Statut explicite retiré ; statut recalculé selon les données réelles. |
| `Activer(QuitterSaisieConservee)` puis `Activer(Reprendre)` depuis la séance en cours | Calendrier, puis entraînement avec exercice/série et saisies retrouvés. | Même brouillon, mêmes valeurs brutes/erreurs ; pas de bilan terminé. Rechargement possible si conservation locale réussie. |
| `Activer(MemeResultatQueSeriePrecedente)` ; `Activer(Annuler)` | Valeurs réelles précédentes recopiées explicitement, message Annuler puis restauration. | Seulement si source complète/valide et réellement identique ; annulation n’écrase pas une correction ultérieure. |
| `échecStockage :` retour système, sans action utilisateur | `display("Sauvegarde indisponible")`, `display(RéessayerLaSauvegarde)` ; aucun faux succès. | État en mémoire conservé ; **rechargement non garanti**. Garder la page ouverte. |
| `Activer(ReessayerLaSauvegarde)` | Succès annoncé uniquement après écriture ; sinon erreur maintenue. | Brouillon courant persisté si possible ; pas de résultat ni d’archive supplémentaire. |

La recopie et le marquage Non faite sont des variantes conditionnelles ; ils ne sont pas requis pour le but nominal. La clôture est une autre tâche T2.4, avec vérification puis confirmation explicite.

## Correspondance et limites

- [entrainement.js](<../../prototypes/propotype 1/08-entrainement/entrainement.js>) : `bind`, `writeResult`, `resultState`, `setOutcome`, `restoreCopiedResult`.
- [ergonomie.js](<../../prototypes/propotype 1/commun/ergonomie.js>) : progression Entrée et nombres français ; [parcours.js](<../../prototypes/propotype 1/commun/parcours.js>) : `persist`, `storageStatus`, reprise de route.
- [Régressions de résultats](../../tests/training-results.test.cjs), [clôture](../../tests/training-completion.test.cjs).

La notification et le focus décrits ne prouvent pas leur perception par les participants. Le modèle n’attribue pas de durée à la lecture, à la récupération d’erreur ou à un geste tactile. Leur évaluation relève du [protocole utilisateur](protocole-utilisateur.md).
