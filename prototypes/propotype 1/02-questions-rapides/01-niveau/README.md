# Écran 02.1 — Niveau

**Date :** 2026-10-03 · **Responsables :** Yahya et Marie<br>
**État :** documentation validée ; écran implémenté et vérifié.<br>
**Persona :** Thomas · **Tâche :** T1.1.1, définir les repères du programme.

## Objectif et entrée

La connexion ou la création de compte valide ; également le retour depuis la question d’objectif.

Présélection du niveau dans la découverte si Thomas répond ; aucun filtre de niveau s’il passe sans répondre.

La progression, les interactions et le style suivent les [règles communes](../README.md). Chaque réponse est un choix unique, pas un champ libre ni une sélection multiple.

## Contenu et disposition

De haut en bas :

1. Flèche de retour à gauche ; « Passer le reste » à droite.
2. « Question 1 sur 3 » puis trois segments de progression, avec 1 segment(s) marqué(s).
3. Afficher « Bonjour {nom} » au-dessus du titre, sur une seule ligne. Le nom vient du formulaire d’accès selon les règles communes ; aucun prénom n’est inventé.
4. Titre « Quel est ton niveau ? ».
5. Trois choix empilés dans l’ordre ci-dessous, visibles simultanément.
6. Aide « Choisis une réponse pour continuer. ».

| Choix affiché | Signification pour la conception |
| --- | --- |
| Débutant | Découverte de la pratique ; premier repère pour Thomas. |
| Intermédiaire | Pratique régulière avec des repères déjà acquis. |
| Avancé | Pratique expérimentée ; ne pas confondre avec un jugement de valeur. |

Les significations du tableau expliquent les choix dans la documentation ; elles ne deviennent pas des paragraphes affichés sous chaque réponse. L’interface garde les trois libellés courts pour rester lisible sans défilement.

## Actions et destinations

| Action | Effet | Destination | Conservation |
| --- | --- | --- | --- |
| Choisir une réponse | Enregistrer ou remplacer ce repère ; avancer directement | Question 2, objectif principal. | Nom et autres réponses données |
| Activer la réponse déjà sélectionnée après un retour | Garder le choix ; avancer | Question 2, objectif principal. | Toutes les réponses données |
| Flèche de retour | Revenir à la connexion, en conservant les réponses de cette identité pour la visite. | Connexion | Toutes les réponses pour cette identité durant la visite |
| Passer le reste | Garder les réponses existantes ; laisser les autres non renseignées | Découvrir | Nom et réponses déjà données |

Un nouvel écran commence sans réponse choisie ; après retour, le choix enregistré apparaît explicitement sélectionné. Aucun bouton Continuer, Valider ou de confirmation n’est ajouté.

## Style et justification

Fond `#FEF2F2`, texte `#111827`, progression active et focus `#B91C1C`, accent discret `#F87171`. Les options gardent la même taille, le même contour et le même alignement que les autres questions. Le choix sélectionné est marqué par une bordure et un repère explicite.

Trois réponses textuelles courtes limitent la densité. Le passage direct retire une action répétitive ; l’aide explique ce comportement et le retour permet une correction. Le numéro 1/3 indique clairement la position ; l’accès pour passer demeure visible même sans réponse.

L’objectif de mise en page reste de montrer la progression, les trois réponses et le passage à 320 × 568 px sans défilement, à taille de texte normale. Les réglages de texte agrandi doivent conserver l’accès au contenu même si un défilement devient nécessaire.

## Vérification prévue

- Vérifier le titre, l’ordre des trois réponses et « Question 1 sur 3 ».
- Activer chacun des choix dans un parcours distinct ; vérifier la valeur retenue et la destination.
- Revenir puis corriger ; vérifier que les autres réponses ne sont pas effacées.
- Passer sans répondre puis avec des réponses existantes ; vérifier leur conservation.
- Vérifier la visibilité simultanée des choix et du passage sur mobile, ainsi que l’accès au clavier.




## Code

[niveau.js](niveau.js) définit le titre et les trois options de cet écran. La structure, les styles et les interactions sont partagés dans le [parcours commun](../README.md#code-ouverture-et-vérification).
