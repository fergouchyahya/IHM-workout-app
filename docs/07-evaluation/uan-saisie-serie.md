# UAN — Consigner et corriger une série réelle

Modèle du 4 novembre 2026, T2.2.2/T2.2.4/T2.2.5. Source : `Cours6.pdf`, pages PDF 20–25, diapositives 39–49 ; les tables de notation des diapositives 46–47 ont été lues sur les pages rendues. Ce modèle décrit l’interface actuelle, sans résultat expérimental. Il détaille la sous-tâche `ConsignerSerie` de l'[UAN de la séance complète](uan-remplir-seance.md).

## But, états et notation

But : consigner **20 kg et 10 répétitions réellement effectuées**. Départ : séance commencée, ligne i visible et non déclarée non faite, charge/répétitions vides, téléphone en main, sans clavier affiché. Arrivée : valeurs conservées dans le brouillon, autres séries et cibles intactes ; séance toujours en cours. Le RPE est une extension facultative visible selon le profil et le suivi choisi, comme dans l’[analyse KLM](keystroke.md).

| Notation du cours | Sens employé |
| --- | --- |
| `~[X]` | Amener le doigt au-dessus de l’objet X, sans toucher l’écran. |
| `Dv`, `D^` | Poser puis lever le doigt D sur l’écran. Le cours (diapositive 46) définit `Xv` et `X^` pour tout bouton, touche ou interrupteur X ; on applique cette règle au doigt, à la place de la souris M. **Dv n’est pas un déplacement**. |
| `~[X] Dv (~[x,y])* D^` | Glisser le doigt sans le lever, comme le glisser-déposer de la diapositive 48 ; ici pour faire défiler la page. |
| `X"abc"`, `X(valeur)` | Saisir une chaîne littérale ou une valeur via le dispositif X ; ici `ClavierTactile"20"`, le clavier affiché par le téléphone. |
| `A B`, lignes successives | Séquence A puis B. |
| `OR`, `&`, `*`, `+`, `{A}` | Alternative, ordre indépendant, zéro ou plusieurs répétitions, une ou plusieurs répétitions, facultatif. |
| `condition : action`, `;` | Action conditionnelle ; point où une interruption est permise, avec effet précisé. |
| `X!`, `X-!` | Mettre en évidence X, retirer la mise en évidence (diapositive 47). |
| `∀ X' : X'-!` | Pour tous les autres objets X', retirer la mise en évidence, comme dans l’exemple Sélectionner(objet) de la diapositive 45. |
| `display(X)`, `erase(X)` | Afficher X, effacer X (diapositive 47). |

L’application est utilisée sur téléphone, à l’écran tactile. Le cours note les actions à la souris (`Mv`, `M^`) ; on les remplace par le doigt (`Dv`, `D^`), avec la même signification : contact, puis relâchement. Il n’y a pas de survol sur un écran tactile.

| Sous-tâche du projet | Définition |
| --- | --- |
| `Activer(X)` | `~[X] Dv D^` : toucher X du doigt. |
| `Defiler` | `~[page] Dv (~[x,y])* D^` : faire glisser la page pour amener un élément à l’écran. Toute action `Activer(X)` peut être précédée d’un `{Defiler}` si X n’est pas visible. |
| `Activer(ToucheSuivant)` | `~[ToucheSuivant] Dv D^` : toucher la touche « Suivant » du clavier du téléphone, qui joue le rôle de la touche Entrée. |

Quand un champ numérique reçoit le focus, le téléphone affiche son clavier : pavé numérique pour les répétitions, pavé décimal avec la virgule pour la charge et le RPE. L’application fait défiler la page pour que le champ reste au-dessus du clavier et de la barre de navigation. Les noms `Saisir`, `Corriger`, etc. sont des sous-tâches du projet, pas de nouveaux opérateurs. D désigne le doigt, et non l’activité mentale M du KLM.

```text
ConsignerSerie(i)
  (Renseigner(charge,i) & Renseigner(repetitions,i))
  {rpeVisible : Saisir(rpe,i)}
  Verifier(i)
  (Corriger(champ,i))*

Renseigner(champ,i)
  Saisir(champ,i) OR Recopier(i) OR Ajuster(champ,i)

Saisir(champ,i)
  Activer(champ[i])
  ClavierTactile(valeurReelle)
  ;

Recopier(i)
  i > 1 : Activer(MemeResultatQueSerie[i-1])
  OR i > 1 : Activer(ChargeSeule[i-1])
  OR sourceComparable : Activer(MemeResultatQueSeancePrecedente)

Ajuster(champ,i)
  champ[i] non vide et valide : (Activer(Plus[champ,i]) OR Activer(Moins[champ,i]))*

Corriger(champ,i)
  Activer(champ[i])
  ClavierTactile(valeurCorrigee)
  Verifier(i)

Verifier(i)
  lecture des valeurs et du statut de la ligne i, sans action motrice
```

L’ordre de saisie charge/répétitions est libre (`&`). La méthode au clavier tactile ci-dessous choisit charge puis répétitions. `Verifier` n’a pas d’action physique : c’est une lecture, gardée dans le modèle pour indiquer où l’utilisateur contrôle le retour de l’interface. `ChargeSeule` ne recopie que la charge ; les répétitions restent à renseigner. À `;`, l’interruption après une frappe conserve la valeur brute et la dernière valeur valide déjà traitées, si le stockage réussit. Elle ne confirme pas la fin de séance. La réalisation physique précède la saisie et reste hors de ce modèle d’interaction.

## Méthode normale : saisie directe au clavier tactile

| User Action | Interface Feedback | Interface State |
| --- | --- | --- |
| `~[charge[i]] Dv` | Aucun retour propre à l’application : sur téléphone, le focus n’est donné qu’au relâchement. | |
| `D^` | `charge[i]!` ; focus et sélection de la valeur éventuelle ; `display(pavéDécimal)` et champ remonté au-dessus du clavier ; `serie[i]!`, `∀ serie[j] ≠ serie[i] : serie[j]-!` (cadre « série en cours ») ; position « Série i sur n » mise à jour. | Série active = i ; cibles inchangées. |
| `ClavierTactile"20"` | `display("20")` ; indicateur « Saisie conservée » si sauvegarde réussie. | Chaque événement de saisie traite la valeur brute ; résultat charge = 20 après la deuxième frappe. Répétitions restent nulles. |
| `Activer(ToucheSuivant)` | `repetitions[i]!` ; focus sur Répétitions, pas sur les boutons +/− ; le clavier reste affiché et passe en pavé numérique. | Aucune valeur supplémentaire créée. |
| `ClavierTactile"10"` | `display("10")`, statut « Faite » calculé à partir de charge et répétitions complètes. | Résultat i = {charge:20, répétitions:10} dans le brouillon ; aucune archive ni soumission par série. |
| Vérification visuelle, sans opérateur moteur ajouté | Valeurs réelles affichées avec leurs unités ; cible initiale reste distincte. | Séance en cours ; autres lignes inchangées. |
| `{Activer(ToucheSuivant)}` | Focus sur le champ visible suivant : RPE ou Ressenti s’ils sont affichés, raison du Cas particulier si ce volet est ouvert, sinon charge de la série i+1, qui devient `serie[i+1]!`. Les boutons et les champs masqués sont sautés. | Aucune donnée modifiée ; seule la série active change. |

Cette dernière activité de vérification n’est pas un appui sur un bouton « Terminer la série » : ce bouton n’existe pas. Le statut peut aussi être déclaré explicitement dans « Cas particulier », sans inventer de résultat numérique.

## Méthode alternative : boutons + et −

Chaque champ Charge et Répétitions a deux boutons, `Moins` et `Plus`, de part et d’autre de la valeur. Ils servent à ajuster une valeur déjà présente, par exemple après une recopie. Sur téléphone, chaque appui remet le focus dans le champ, ce qui affiche le clavier tactile s’il était fermé.

| User Action | Interface Feedback | Interface State |
| --- | --- | --- |
| `Activer(Plus[charge,i])` avec charge = 20 | `display("20,5")` ; focus remis dans le champ Charge, clavier tactile affiché. | Charge = 20,5 (pas de 0,5 kg) ; saisie brute et erreur éventuelles du champ effacées. |
| `Activer(Moins[repetitions,i])` avec répétitions = 10 | `display("9")` ; focus dans le champ Répétitions. | Répétitions = 9 (pas de 1) ; jamais en dessous de 0. |
| `Activer(Plus[champ,i])` avec champ vide ou invalide (ex. `-1`) | Aucune nouvelle valeur ; focus placé dans le champ pour le corriger. | État inchangé : la saisie invalide visible n’est pas remplacée par la dernière valeur valide. |
| `Activer(Plus[champ,i])` sur une série déclarée non faite | Bouton désactivé, aucun effet. | Statut et valeurs conservés. |

## Variantes, erreurs et reprise de la même tâche

| User Action | Interface Feedback | Interface State |
| --- | --- | --- |
| `Activer(charge[i]) ClavierTactile"-1"` | `display("-1")`, `display(erreurLocale)` ; « Saisie à corriger ». | Valeur brute invalide séparée ; dernière charge valide conservée ; clôture bloquée tant que l’erreur active subsiste. |
| `Activer(charge[i]) ClavierTactile"22,5"` | `display("22,5")`, `erase(erreurLocale)` après correction valide. | Charge réelle = 22,5 ; répétitions, autres séries et cible initiale intactes. |
| `Activer(CasParticulier[i]) Activer(NonFaite[i])` | `display("Série déclarée non faite · valeurs conservées")`, champs désactivés. | `outcome = skipped` ; anciennes valeurs gardées pour correction, exclues des résultats utilisés pour ce statut. |
| `Activer(CasParticulier[i]) Activer(Interrompue[i])` | `display("Série interrompue · résultats partiels conservés")` avec Annuler ; bouton Interrompue `aria-pressed`. | `outcome = interrupted` ; valeurs partielles gardées, exclues des comparaisons T3. |
| `Activer(Interrompue[i])` une seconde fois | `display("Statut selon la saisie")` avec Annuler. | Statut explicite retiré ; statut recalculé selon les valeurs. |
| `Activer(repetitions[i]) ClavierTactile"0"` | Statut `display("0 répétition · précise le statut")`. | Série ni faite ni non faite : l’interface ne décide pas à la place de l’utilisateur ; il choisit un statut dans Cas particulier. |
| `Activer(ReprendreLaSaisie[i])` | Champs à nouveau éditables ; valeurs précédemment saisies réaffichées ; `display("Statut selon la saisie")` avec Annuler ; focus sur Charge. | Statut explicite retiré ; statut recalculé selon les données réelles. |
| `Activer(QuitterSaisieConservee)` puis `Activer(Reprendre)` depuis la séance en cours | Calendrier, puis entraînement avec exercice/série et saisies retrouvés. | Même brouillon, mêmes valeurs brutes/erreurs ; pas de bilan terminé. Rechargement possible si conservation locale réussie. |
| `Activer(MemeResultatQueSerie[i-1])` ; `{Activer(Annuler)}` | Charge, répétitions, RPE et ressenti de la série i-1 recopiés ; `display("Résultat réel recopié · cibles conservées")` avec Annuler. | Seulement si la série i-1 est faite et valide ; sinon message « Renseigne une série précédente faite et valide avant de la recopier » et rien ne change. Annuler ne restaure que les champs encore identiques à la recopie. |
| `Activer(ChargeSeule[i-1])` ; `{Activer(Annuler)}` | Charge de la série i-1 recopiée ; `display("Charge précédente seule recopiée · répétitions, effort et statut conservés")` avec Annuler. | Seule la charge change. Si la charge a été modifiée entre-temps, Annuler la conserve et l’indique. |
| `Activer(MemeResultatQueSeancePrecedente)` ; `{Activer(Annuler)}` | Bouton visible seulement s’il existe une séance précédente comparable, avec la date et les valeurs dans son libellé ; même message de recopie avec Annuler. | Valeurs réelles de la même série de cette séance recopiées ; cibles inchangées ; même règle d’annulation. |
| `échecStockage :` retour système, sans action utilisateur | `display("Sauvegarde indisponible")`, `display(RéessayerLaSauvegarde)` ; aucun faux succès. | État en mémoire conservé ; **rechargement non garanti**. Garder la page ouverte. |
| `Activer(ReessayerLaSauvegarde)` | Succès annoncé uniquement après écriture ; sinon erreur maintenue. | Brouillon courant persisté si possible ; pas de résultat ni d’archive supplémentaire. |

La recopie et le marquage Non faite sont des variantes conditionnelles ; ils ne sont pas requis pour le but nominal. La clôture est une autre tâche T2.4, avec vérification puis confirmation explicite.

## Correspondance et limites

- [entrainement.js](<../../prototypes/propotype 1/08-entrainement/entrainement.js>) : `bind`, `writeResult`, `resultState`, `setOutcome`, `setActive`, `adjustResult` (boutons + et −), `repeatResult`, `repeatLoad`, `copyPreviousSession`, `restoreCopiedResult`.
- [ergonomie.js](<../../prototypes/propotype 1/commun/ergonomie.js>) : clavier numérique (`inputMode`), touche Suivant (`enterKeyHint`), défilement au-dessus du clavier et nombres français ; [parcours.js](<../../prototypes/propotype 1/commun/parcours.js>) : `persist`, `storageStatus`, reprise de route.
- [Régressions de résultats](../../tests/training-results.test.cjs), [clôture](../../tests/training-completion.test.cjs).

La notification et le focus décrits ne prouvent pas leur perception par les participants. Le modèle n’attribue pas de durée à la lecture, à la récupération d’erreur ou à un geste tactile. Leur évaluation relève du [protocole utilisateur](protocole-utilisateur.md).
