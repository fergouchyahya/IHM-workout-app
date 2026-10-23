# Analyse des résultats T3 — 23 octobre 2026

Depuis **Bilans**, rechercher une séance puis ouvrir son bilan. L’analyse apparaît directement, sans écran intermédiaire. T2 conserve les résultats et reste en lecture seule ; T3 ajoute une interprétation et un point pour la préparation T1. Références : [synthèse T3](../../../docs/04-analyse-taches/T3/T3-finalized.md) et [règles communes](../../../docs/04-analyse-taches/tache.md#règles-communes-et-revue-finale).

## Comparer et comprendre

- Le premier exercice et la dernière séance compatible sont sélectionnés automatiquement. Exercice, début/fin de période et référence restent modifiables. Les choix et le texte en cours sont conservés par bilan dans le profil local ; aucune entrée d’historique n’est ajoutée par frappe.
- L’historique s’arrête à la date et à l’heure de conservation du bilan consulté. Les séances futures et les exécutions en cours ne servent jamais de référence. La période filtre l’historique et les références ; le bilan courant demeure l’objet analysé même s’il est hors période.
- Un mouvement est identifié par son identifiant. Dans un même entraînement, son slot stable distingue les doublons. Sans correspondance fiable, seuls les mouvements uniques des deux séances peuvent être rapprochés. Matériel connu identique et réglages conservés identiques sont nécessaires. Les conditions non saisies restent inconnues et sont signalées ; une correspondance informatique ne certifie pas la même technique.
- Les écarts de charge et de répétitions comparent la même position de série. RPE disponible seulement hors débutant ; une valeur manquante ne devient pas zéro. Une évolution mixte ne produit pas une conclusion unique. Les séries adaptées, interrompues, non faites, invalides et incomplètes restent consultables mais sont exclues des calculs.
- Un record signifie **charge supérieure à l’ancien maximum pour le même nombre de répétitions**. Il utilise tout l’historique comparable antérieur disponible, indépendamment de la période affichée. La première mesure établit une référence, jamais un record. Aucun 1RM, score global, cause ou recommandation automatique n’est inventé.
- Le volet d’évolution expose chaque séance et série, les limites, le ressenti et le contexte conservé. Un lien ouvre le bilan d’origine pour ses notes, réglages, raisons et médias. Retour du navigateur retrouve le bilan analysé. Le nombre de séances est un repère de régularité, pas une preuve de progression physique ou d’autonomie.

## Conclure et revenir à T1

Le texte d’interprétation est facultatif (500 caractères). **Conserver le point à revoir** crée ou actualise un point pour ce bilan et ce slot, associé au modèle d’entraînement ; une sauvegarde échouée ne confirme pas le point et conserve la saisie pour réessayer. Les points sont visibles dans la préparation T1 du même entraînement et exercice/slot. Ils ne changent aucune cible ni résultat et restent exclus du partage.

**Programmer une nouvelle séance à partir de celle-ci**, déjà présent dans le bilan, revient à la planification T1 avec une copie des objectifs. La personne choisit la date, puis adapte volontairement sa préparation. Les résultats réels ne remplissent pas les cibles.

## Vérification

`node tests/analysis.test.cjs` couvre première mesure, records définis, écarts mixtes, absences/statuts, zéro kg, RPE absent, matériel/réglage, doublons, période, chronologie, invariance des archives et conservation/échec d’un point T1. Les seize suites exécutées individuellement totalisent **132 tests réussis**, dont les 121 tests T1/T2 historiques, 7 tests T3 et 4 tests du fil communautaire. Les modules JavaScript passent le contrôle de syntaxe. Chromium a vérifié sauvegarde/rechargement après réentrée dans le même profil, Retour du navigateur, consultation du contexte et retour à T1 avec point affiché et cibles conservées ; vues à 320, 390 et 1280 px sans débordement horizontal. Le parcours complet T1 → T2 → T3 conserve cibles/résultats séparés. Un message Annuler pouvait couvrir la confirmation T2 : le pied de revue est remis dans le flux et conserve une marge de défilement ; le clic normal de confirmation passe avec ce message aux trois largeurs. Les tests techniques ne remplacent pas les essais utilisateurs, les mesures de temps Keystroke ou la vérification sur téléphone et lecteur d’écran.
