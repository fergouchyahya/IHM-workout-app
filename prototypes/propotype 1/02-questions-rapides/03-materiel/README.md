# Écran 02.3 — Matériel

**Date :** 2026-10-03 · **Responsables :** Yahya et Marie<br>
**État :** documentation validée ; écran implémenté et vérifié.<br>
**Persona :** Thomas · **Tâche :** T1.1.1, définir les repères du programme.

## Objectif et entrée

La sélection de l’objectif principal.

Présélection du matériel dans la découverte si renseigné. Les détails d’équipement seront vérifiés dans la fiche et les adaptations de séance.

La progression, les interactions et le style suivent les [règles communes](../README.md). Chaque réponse est un choix unique, pas un champ libre ni une sélection multiple.

## Contenu et disposition

De haut en bas :

1. Flèche de retour à gauche ; « Passer le reste » à droite.
2. « Question 3 sur 3 » puis trois segments de progression, avec 3 segment(s) marqué(s).
3. Ne pas répéter la salutation. Le choix de matériel termine le parcours et conserve les autres repères.
4. Titre « Quel matériel as-tu ? ».
5. Trois choix empilés dans l’ordre ci-dessous, visibles simultanément.
6. Aide « Choisis une réponse pour continuer. ».

| Choix affiché | Signification pour la conception |
| --- | --- |
| Salle équipée | Accès général à une salle et son matériel, sans inventaire des machines. |
| Haltères à la maison | Accès à des haltères dans un contexte domestique. |
| Sans matériel | Choix de séances réalisables sans matériel spécialisé. |

Les significations du tableau expliquent les choix dans la documentation ; elles ne deviennent pas des paragraphes affichés sous chaque réponse. L’interface garde les trois libellés courts pour rester lisible sans défilement.

## Actions et destinations

| Action | Effet | Destination | Conservation |
| --- | --- | --- | --- |
| Choisir une réponse | Enregistrer ou remplacer ce repère ; avancer directement | Page correspondant au niveau, sans écran de validation intermédiaire. | Nom et autres réponses données |
| Activer la réponse déjà sélectionnée après un retour | Garder le choix ; avancer | Page correspondant au niveau, sans écran de validation intermédiaire. | Toutes les réponses données |
| Flèche de retour | Revenir à la question 2, objectif, avec le choix précédent visible. | Question 2 | Toutes les réponses pour cette identité durant la visite |
| Passer le reste | Garder les réponses existantes ; laisser les autres non renseignées | Page correspondant au niveau | Nom et réponses déjà données |

Un nouvel écran commence sans réponse choisie ; après retour, le choix enregistré apparaît explicitement sélectionné. Aucun bouton Continuer, Valider ou de confirmation n’est ajouté.

## Style et justification

Fond `#FEF2F2`, texte `#111827`, progression active et focus `#B91C1C`, accent discret `#F87171`. Les options gardent la même taille, le même contour et le même alignement que les autres questions. Le choix sélectionné est marqué par une bordure et un repère explicite.

Trois réponses textuelles courtes limitent la densité. Le passage direct retire une action répétitive ; l’aide explique ce comportement et le retour permet une correction. Le numéro 3/3 indique clairement la position ; l’accès pour passer demeure visible même sans réponse.

L’objectif de mise en page reste de montrer la progression, les trois réponses et le passage à 320 × 568 px sans défilement, à taille de texte normale. Les réglages de texte agrandi doivent conserver l’accès au contenu même si un défilement devient nécessaire.

## Vérification prévue

- Vérifier le titre, l’ordre des trois réponses et « Question 3 sur 3 ».
- Activer chacun des choix dans un parcours distinct ; vérifier la valeur retenue et la destination.
- Revenir puis corriger ; vérifier que les autres réponses ne sont pas effacées.
- Passer sans répondre puis avec des réponses existantes ; vérifier leur conservation.
- Vérifier la visibilité simultanée des choix et du passage sur mobile, ainsi que l’accès au clavier.




## Code

[materiel.js](materiel.js) définit le titre et les trois options de cet écran. La structure, les styles et les interactions sont partagés dans le [parcours commun](../README.md#code-ouverture-et-vérification).
