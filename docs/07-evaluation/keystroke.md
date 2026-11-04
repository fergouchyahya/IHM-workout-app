# Keystroke — Remplir un entraînement pendant la séance

Date : 24 octobre 2026

Tâche étudiée : saisir les résultats réels des séries pendant un entraînement déjà commencé.

Support : prototype 1, ordinateur avec souris et clavier.

Nature des résultats : estimations KLM, sans chronométrage utilisateur.

## Périmètre principal : une série

La comparaison principale porte sur **une seule série** dont les valeurs connues sont `20 kg`, `10 répétitions` et `RPE 7`. Le scénario de six séries ci-dessous est une extension arithmétique permettant de montrer l’effet cumulé ; il ne constitue pas une nouvelle mesure. Les méthodes sont comparées à état initial et état final identiques, sans erreur, avec un utilisateur connaissant déjà l’interface.

## 1. Définition de la tâche

Après chaque série réalisée, l’utilisateur renseigne la charge, le nombre de répétitions et, si le suivi est activé, son effort ressenti (RPE). Il répète cette saisie pour toutes les séries et passe à l’exercice suivant lorsque nécessaire.

État initial principal : entraînement ouvert, série 2 visible avec Charge, Répétitions et RPE vides ; la série 1 est faite et contient déjà les mêmes résultats réels complets et valides (20 kg, 10 répétitions, RPE 7), condition nécessaire à la méthode C. La main est sur la souris. Les méthodes A et B saisissent le même résultat sans utiliser cette référence.

État final principal : seule la série 2 reçoit 20 kg, 10 répétitions et RPE 7 dans le brouillon ; les autres résultats et les cibles sont conservés. La main revient à la souris ; la séance reste en cours. Pour l’extension de six séries, les résultats sont initialement vides et les premières séries sont saisies avant toute recopie.

Le périmètre se limite à la saisie, à la recopie éventuelle et au passage entre exercices pendant la séance. La préparation, le démarrage, la revue finale du bilan, sa confirmation et le partage sont hors périmètre.

## 2. Scénario et hypothèses

L’extension comporte deux exercices de trois séries, soit six séries à renseigner. Les calculs unitaires des sections 4–6 restent le résultat principal pour une série.

| Exercice | Série 1 réalisée | Série 2 réalisée | Série 3 réalisée |
| --- | --- | --- | --- |
| Exercice A | 20 kg · 10 répétitions · RPE 7 | 20 kg · 10 répétitions · RPE 7 | 20 kg · 10 répétitions · RPE 7 |
| Exercice B | 40 kg · 10 répétitions · RPE 7 | 40 kg · 10 répétitions · RPE 7 | 40 kg · 10 répétitions · RPE 7 |

Les valeurs sont fictives. Les résultats identiques au sein de chaque exercice permettent de comparer les méthodes de saisie et de recopie pour un même résultat final.

- L’utilisateur connaît l’interface et les valeurs à saisir ; il ne commet aucune erreur.
- Son niveau et ses préférences permettent l’affichage du RPE.
- Les contrôles utiles sont visibles au moment de l’action.
- Chaque épisode de saisie débute après une série physique : une nouvelle préparation mentale est comptée.
- Chaque épisode commence et termine avec la main sur la souris, pour comparer les méthodes avec le même état de départ et d’arrivée. Le retour au dispositif après l’effort n’est pas modélisé.
- Les résultats sont sauvegardés au fil des modifications : aucun bouton de validation par série n’est nécessaire.

Le calcul porte sur le temps d’interaction avec l’interface. L’effort physique, le repos, le défilement éventuel et les interruptions restent hors calcul.

## 3. Opérateurs Keystroke

| Opérateur | Signification | Durée |
| --- | --- | ---: |
| `K` | Une touche ou un clic simple | 0,20 s |
| `P` | Pointer un champ ou un bouton à la souris | 1,10 s |
| `H` | Passer la main de la souris au clavier ou inversement | 0,40 s |
| `M` | Préparation mentale d’une séquence connue | 1,35 s |
| `R` | Attente système bloquante | ≈ 0 s (hypothèse) |

```text
T = 0,20 × nK + 1,10 × nP + 0,40 × nH + 1,35 × nM + R
```

Nous supposons `R ≈ 0 s` : les interactions sont traitées localement, sans attente bloquante perceptible dans le scénario retenu. Cette hypothèse n’a pas été chronométrée. Les calculs utilisent donc une contribution nulle de `R`.

Un pointage suivi d’un clic coûte `P + K = 1,30 s`. Entrée compte pour un `K`. Les valeurs `20`, `10` et `7` demandent cinq touches ; les unités ne sont pas saisies. Les valeurs de l’exercice B demandent le même nombre de touches.

On place un `M` au début de chaque épisode après l’effort. Aucun `M` supplémentaire n’est ajouté entre les chiffres, entre les champs d’une saisie préparée ou avant un clic anticipé. Une hésitation, une lecture prolongée ou un nouveau choix demanderait de réviser cette hypothèse. Application des règles du cours (diapositive 33) : insérer M avant la sous-méthode de saisie ; supprimer le M avant un clic déjà anticipé par le pointage ; grouper les chiffres d’une valeur connue. Le passage entre champs est supposé anticipé par un utilisateur entraîné ; un débutant hésitant sort de cette hypothèse. P = 1,10 s est le choix de l’exemple diapositive 34, dans l’intervalle 0,8–1,5 s de la diapositive 31 ; ce n’est pas un temps mesuré sur notre interface.

## 4. Méthode A — Choisir chaque champ à la souris

| Étape | Action | Opérateurs | Temps |
| --- | --- | --- | ---: |
| 1 | Préparer la saisie du résultat réalisé | `M` | 1,35 s |
| 2 | Pointer Charge, cliquer, passer au clavier et saisir 20 | `P + K + H + 2K` | 2,10 s |
| 3 | Revenir à la souris, pointer Répétitions, cliquer, passer au clavier et saisir 10 | `H + P + K + H + 2K` | 2,50 s |
| 4 | Revenir à la souris, pointer Effort (RPE), cliquer, passer au clavier et saisir 7 | `H + P + K + H + K` | 2,30 s |
| 5 | Revenir à la souris pour terminer dans l’état commun | `H` | 0,40 s |
| Total pour une série | | `M + 3P + 8K + 6H` | 8,65 s |

Les huit `K` correspondent à trois clics et cinq chiffres. Les six `H` comprennent les changements de dispositif pendant la saisie et le retour final à la souris.

## 5. Méthode B — Enchaîner les champs avec Entrée

L’utilisateur clique dans Charge, puis utilise Entrée pour passer au champ numérique suivant. Cette progression est disponible dans le prototype.

| Étape | Action | Opérateurs | Temps |
| --- | --- | --- | ---: |
| 1 | Préparer la saisie du résultat réalisé | `M` | 1,35 s |
| 2 | Pointer Charge, cliquer et passer au clavier | `P + K + H` | 1,70 s |
| 3 | Saisir 20 puis appuyer sur Entrée | `2K + K` | 0,60 s |
| 4 | Saisir 10 puis appuyer sur Entrée | `2K + K` | 0,60 s |
| 5 | Saisir 7 | `K` | 0,20 s |
| 6 | Revenir à la souris pour terminer dans l’état commun | `H` | 0,40 s |
| Total pour une série | | `M + P + 8K + 2H` | 4,85 s |

Les huit `K` correspondent à un clic, cinq chiffres et deux appuis sur Entrée. Aucun appui final sur Entrée n’est nécessaire pour sauvegarder le RPE.

Écart prédit : 3,80 s par série par rapport à la méthode A. Deux pointages et quatre changements de dispositif sont évités.

## 6. Méthode C — Recopier une série réellement identique

Après réalisation de la série, l’utilisateur sait que ses résultats sont identiques à ceux de la précédente. Il active Même résultat que série 1, ou le bouton correspondant à la série précédente.

| Étape | Action | Opérateurs | Temps |
| --- | --- | --- | ---: |
| 1 | Préparer la recopie d’un résultat connu comme identique | `M` | 1,35 s |
| 2 | Pointer le bouton de recopie et cliquer | `P + K` | 1,30 s |
| Total pour une série identique | | `M + P + K` | 2,65 s |

La main reste sur la souris. La série précédente doit être faite, complète et valide. La recopie est explicite et annulable ; elle ne remplace pas les cibles prévues.

La première série de chaque exercice est saisie avec la méthode B ; les deux suivantes peuvent être recopiées après leur réalisation. Si les valeurs diffèrent, il faut les saisir réellement : la recopie seule n’atteint plus le même but.

## 7. Passer à l’exercice suivant

Après la troisième série de l’exercice A, l’utilisateur clique sur Suivant → pour afficher l’exercice B.

```text
Pointer Suivant puis cliquer : P + K = 1,30 s
```

Ce passage est anticipé et la main est déjà sur la souris : aucun `M` ou `H` supplémentaire n’est ajouté. Un seul changement d’exercice est nécessaire.

Il n’est pas nécessaire de cliquer sur Série suivante → entre les saisies : les lignes sont directement accessibles et sélectionner un champ active sa série. Les méthodes ci-dessus accèdent donc directement à la ligne à remplir.

## 8. Temps de remplissage de l’entraînement

| Méthode pour les six séries | Calcul | Temps estimé (`R ≈ 0 s`) |
| --- | --- | ---: |
| A — Tout saisir en choisissant les champs à la souris | `6 × 8,65 + 1,30` | 53,20 s |
| B — Tout saisir avec la progression Entrée | `6 × 4,85 + 1,30` | 30,40 s |
| C — Saisir la première série de chaque exercice avec Entrée, puis recopier les deux suivantes identiques | `2 × 4,85 + 4 × 2,65 + 1,30` | 21,60 s |

La progression par Entrée réduit ici le temps modélisé de 22,80 s par rapport à la méthode A. La recopie des séries identiques réduit encore ce temps de 8,80 s par rapport à la méthode B.

Les totaux comprennent six préparations mentales, les saisies ou recopies, les retours à la souris et un passage entre exercices. Ils s’arrêtent au dernier résultat renseigné, sans accès au bilan ni confirmation de fin de séance.

## 9. Variante sans RPE

Pour un débutant, les lignes de résultats affichent uniquement Charge et Répétitions. Avec `20` et `10`, et les mêmes états de départ et d’arrivée :

| Méthode pour une série sans RPE | Séquence | Temps estimé (`R ≈ 0 s`) |
| --- | --- | ---: |
| Choisir les deux champs à la souris | `M + 2P + 6K + 4H` | 6,35 s |
| Enchaîner avec Entrée | `M + P + 6K + 2H` | 4,45 s |

Le ressenti facultatif éventuellement proposé à d’autres profils sans suivi RPE n’est pas rempli dans cette variante.

## Références

- [T2 — Réaliser et documenter une séance](../04-analyse-taches/T2/T2-finalized.md).
- [Écran d’entraînement : saisie et recopie](../../prototypes/propotype%201/08-entrainement/README.md).
- [entrainement.js](../../prototypes/propotype%201/08-entrainement/entrainement.js) : saisie, recopie et navigation entre exercices.
- [ergonomie.js](../../prototypes/propotype%201/commun/ergonomie.js) : progression des champs numériques avec Entrée.
- [Audit ergonomique, section 5](audit-ergonomie-cours5-6.md#5-calculs-keystroke-et-limites) : conventions KLM du projet.
- `Cours6.pdf`, diapositives 28–38 (pages PDF 16–26 selon la pagination du support) : GOMS/Keystroke ; diapositives 29–37 pour les opérateurs et hypothèses de calcul.
- `Cours6.pdf`, diapositives 39–49 (pages PDF 27–36 selon la pagination du support) : UAN, consulté pour la spécification des retours et états.
- Card, Moran et Newell : [table des opérateurs dans le rapport original](https://iiif.library.cmu.edu/file/Newell_box00072_fld05090_doc0005/Newell_box00072_fld05090_doc0005.pdf).
