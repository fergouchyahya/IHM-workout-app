# Partager un programme — T4

**Responsable :** Marie · **Référence :** [T4 validée](../../../docs/04-analyse-taches/T4/T4-finalized.md) · **État :** parcours T4 implémenté dans le prototype.

## But et périmètre

Permettre de présenter à d’autres personnes une séance, une semaine ou un cycle déjà préparé dans **Mes entraînements**. T4 couvre la sélection, la vérification du programme, sa présentation, l’aperçu, la confirmation de publication et le suivi des commentaires ou le retrait. Créer ou importer le programme reste dans T1 ; les résultats et leur analyse restent dans T2/T3 ; la synchronisation reste dans T5.

Le prototype simule le service communautaire dans le navigateur. Il n’envoie rien à un serveur et ne rend pas réellement le contenu visible à d’autres comptes.

## Parcours écran par écran

1. **Partages** — l’onglet de navigation ouvre la liste des publications conservées. « Partager un programme » démarre le parcours ; aucune publication n’est créée avant confirmation.
2. **Choisir un programme** — les séances et blocs déjà présents dans Mes entraînements sont proposés. Le bouton « Vérifier ce programme » démarre T4.1.
3. **Vérifier et présenter** — un même écran affiche les séances/exercices partagés, le rappel des données privées et les champs de présentation. Le titre et le niveau sont requis ; la description et la zone sont facultatives. Audience, demande de conseils et commentaires restent explicites. Une structure vide ou une séance sans exercice bloque la suite.
4. **Aperçu avant publication** — montre la présentation et le contenu prévu comme une fiche destinée à l’audience choisie. L’audience est rappelée et une seule action finale la nomme : Publier dans la communauté ou Partager avec mes contacts. Aucune publication n’est possible avant l’aperçu.
5. **Gérer la publication** — affiche son audience, son état et les commentaires. L’auteur peut modifier sa présentation, retirer ou republier. Les retours peuvent recevoir une réponse. « Simuler un commentaire reçu » ajoute un commentaire fictif pour rendre T4.4 manipulable dans la démonstration.

## Données et confidentialité

La fiche publiée contient une copie des noms de séances et d’exercices, les séries, répétitions, charge cible et RPE disponibles, les consignes publiques du mouvement, ainsi que le titre, le niveau, la zone, la description et les options choisies. Le code construit explicitement cette copie : il ne sérialise pas l’objet complet de l’entraînement. Les résultats réels, les notes de suivi, les données de profil et les identifiants ne sont pas inclus.

Les publications T4 sont archivées par identité dans `ihm-prototype-1-profiles` avec les données du profil ; `ihm-prototype-1-t4` conserve la compatibilité avec la version précédente. Elles restent limitées au navigateur utilisé pour la démonstration.

## Correspondance avec l’arbre T4

| Tâche | Interaction |
| --- | --- |
| T4.1.1–T4.1.2 | Choisir un entraînement existant, inspecter son contenu et vérifier qu’il n’est pas vide. |
| T4.2.1–T4.2.2 | Renseigner le titre, le niveau, la zone et la description. |
| T4.2.3–T4.2.4 | Choisir contacts ou communauté, demander des retours et autoriser les commentaires. |
| T4.3.1–T4.3.2 | Relire l’aperçu et cocher la confirmation explicite. |
| T4.4.1–T4.4.2 | Lire et répondre aux commentaires, modifier la présentation, retirer ou republier. |

## Fichiers

- `partages.js` contient les écrans, la validation, l’aperçu, la copie filtrée du programme et la persistance T4.
- `styles.css` contient les styles propres aux écrans T4.
- `../commun/parcours.js` ajoute la route et l’entrée de navigation.
- `../01-connexion/index.html` charge le module et sa feuille de style dans le prototype.

## Limites de la maquette

L’audience, les publications et les commentaires sont simulés localement. Les contacts ne sont pas sélectionnés individuellement ; « mes contacts » désigne une option d’audience. Les commentaires reçus sont fictifs et ajoutés manuellement pour la démonstration. Mettre à jour une publication modifie sa présentation ; le contenu du programme publié reste l’instantané établi lors de sa création. Aucun mécanisme de synchronisation ou de retrait chez les personnes ayant déjà importé une publication n’est simulé.

## Simplification ergonomique validée

Nouvelle publication et modification sont nommées explicitement. Commencer un nouveau partage efface le contexte de modification, sans modifier la publication précédente. Un brouillon distinct par programme ou publication est conservé dans `sharingDrafts` lors des changements d’onglet et rechargements ; la liste propose Reprendre. L’aperçu précède une action finale explicite nommant l’audience, sans case supplémentaire. Les confirmations de retrait et d’abandon utilisent le dialogue commun.

## Complément T1.1.3 — instantané importable

Les nouvelles publications conservent `plan`, un instantané construit par liste blanche avec organisation, jours/repos, durée estimée, nombre de semaines et variations du mésocycle. L’aperçu final affiche la répartition et les cibles partagées ; les semaines du cycle restent distinguées. La représentation `program` reste disponible pour les fiches et publications précédentes. Modifier la présentation conserve l’instantané ; Actualiser depuis Mes entraînements le remplace explicitement.

Les résultats, notes/réglages personnels, disponibilités et budget de temps du profil restent exclus. Dans Découvrir → Communauté, une publication locale active avec `plan` peut être importée comme copie indépendante. Les anciennes publications nécessitent une actualisation explicite pour devenir importables avec leur répartition. Aucune communication réelle entre comptes n’est ajoutée.

## Conservation — premier lot ergonomique Cours 5/6

Une publication ou une modification n’est annoncée confirmée qu’après conservation réussie. Si le stockage échoue, la publication précédente est restaurée, le brouillon et l’aperçu restent disponibles ; réessayer la confirmation ne crée pas de doublon. Réessayer la sauvegarde dans l’alerte conserve le brouillon courant et ne le publie pas à lui seul.

`tests/ergonomie-top10.test.cjs` vérifie les échecs/reprises de publication et de modification ; Chromium vérifie le maintien de l’aperçu, l’alerte, la reprise puis la confirmation unique. L’aperçu, la case et le bouton de confirmation restent en place : leur simplification est encore une proposition de l’audit.


## Troisième lot ergonomique — 22 octobre 2026

Les programmes sont consultés par semaines repliables avec séances/repos et variations. Ouvrir une semaine révèle ses exercices/cibles sans seconde ouverture obligatoire. Présentation, aperçu et détail réutilisent les seules informations publiques de l’instantané ; les anciennes archives sans plan restent consultables par séances. Dans ce lot daté la case était conservée ; le dernier lot la remplace par une action finale nommant l’audience, dans la même zone accessible. Nombres français et libellés sont partagés avec la préparation/T2. Mes préférences est accessible depuis la liste Partages et y revient.

Vérification : 77 tests ciblés et parcours Chromium à 320, 390 et 1280 px ; détails et limites dans l’[audit](../../../docs/07-evaluation/audit-ergonomie-cours5-6.md#13-troisième-lot-livré--22-octobre-2026).


## Quatrième lot ergonomique — 22 octobre 2026

La sélection des sources offre une recherche et les états À compléter/Prêt à partager. Compléter ce contenu ouvre la préparation personnelle en conservant le brouillon de présentation. Une séance sauvegardée revient directement au partage ; une semaine y revient par Mon partage. Une séance personnelle enregistrée donne aussi un accès Préparer un partage.

Description facultative ; titre et niveau obligatoires avec erreurs locales et focus ciblé. Une correction efface l’erreur du champ ; le résumé d’audience suit immédiatement le choix. Présentation, aperçu et confirmation finale restent distincts. Aucun choix de source ni retour de préparation ne publie le contenu. Les résultats, contexte, notes/réglages personnels et médias restent privés.

Vérification : 92 tests ciblés et parcours Chromium aux trois largeurs ; [preuves et limites](../../../docs/07-evaluation/audit-ergonomie-cours5-6.md#14-quatrième-lot-livré--22-octobre-2026).


## Dernier lot ergonomique — 22 octobre 2026

L’aperçu rappelle l’audience puis propose Publier dans la communauté ou Partager avec mes contacts, sans case supplémentaire. La modification est nommée Mettre à jour pour… ; la republication reste une action distincte. Le code refuse une publication directe avant l’aperçu et vérifie encore la présentation/contenu. Échec de sauvegarde et reprise sans doublon restent couverts. Le retrait d’une activation ne valide pas la compréhension de l’audience ; des essais utilisateur restent nécessaires. Les publications de validation restent une simulation locale sans envoi distant.

Vérification : 104 tests ciblés et parcours Chromium à 320, 390 et 1280 px ; [preuves, compromis et évaluations restantes](../../../docs/07-evaluation/audit-ergonomie-cours5-6.md#15-dernier-lot-livré--22-octobre-2026).
