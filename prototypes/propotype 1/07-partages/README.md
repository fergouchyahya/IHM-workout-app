# Partager un programme — T4

**Responsable :** Marie · **Référence :** [T4 validée](../../../docs/04-analyse-taches/T4/T4-finalized.md) · **État :** parcours T4 implémenté dans le prototype.

## But et périmètre

Permettre de présenter à d’autres personnes une séance, une semaine ou un cycle déjà préparé dans **Mes entraînements**. T4 couvre la sélection, la vérification du programme, sa présentation, l’aperçu, la confirmation de publication et le suivi des commentaires ou le retrait. Créer ou importer le programme reste dans T1 ; les résultats et leur analyse restent dans T2/T3 ; la synchronisation reste dans T5.

Le prototype simule le service communautaire dans le navigateur. Il n’envoie rien à un serveur et ne rend pas réellement le contenu visible à d’autres comptes.

## Parcours écran par écran

1. **Partages** — l’onglet de navigation ouvre la liste des publications conservées. « Partager un programme » démarre le parcours ; aucune publication n’est créée avant confirmation.
2. **Choisir un programme** — les séances et blocs déjà présents dans Mes entraînements sont proposés. Le bouton « Vérifier ce programme » démarre T4.1.
3. **Vérifier le contenu** — affiche les séances et exercices qui seront partagés, puis indique séparément que les résultats réels, notes personnelles et identifiants restent privés. Le parcours bloque une structure vide ou une séance sans exercice. Une case confirme que le programme a été relu et compris.
4. **Présenter le programme** — le titre, le niveau et la description sont requis. La zone ciblée est facultative. L’auteur choisit la communauté ou ses contacts, peut demander des conseils et peut ouvrir ou fermer les commentaires.
5. **Aperçu avant publication** — montre la présentation et le contenu prévu comme une fiche destinée à l’audience choisie. La case de confirmation rappelle cette audience. Sans la cocher, la publication ne peut pas être confirmée.
6. **Gérer la publication** — affiche son audience, son état et les commentaires. L’auteur peut modifier sa présentation, retirer ou republier. Les retours peuvent recevoir une réponse. « Simuler un commentaire reçu » ajoute un commentaire fictif pour rendre T4.4 manipulable dans la démonstration.

## Données et confidentialité

La fiche publiée contient une copie des noms de séances et d’exercices, les séries, répétitions et charge cible disponibles, ainsi que le titre, le niveau, la zone, la description et les options choisies. Le code construit explicitement cette copie : il ne sérialise pas l’objet complet de l’entraînement. Les résultats réels, les notes de suivi, les données de profil et les identifiants ne sont pas inclus.

Les publications T4 sont enregistrées sous la clé locale `ihm-prototype-1-t4`, séparément des données T1 stockées par le routeur. Elles restent limitées au navigateur utilisé pour la démonstration.

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
