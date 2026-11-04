# Trame proposée — 12 slides à adapter à la durée imposée

Public : enseignants et étudiants d’IHM. But : montrer la cohérence besoin → tâche → interface → évaluation → itération. Message central : le prototype distingue préparation, réalisation et bilan tout en conservant les données ; ses contrats sont vérifiés, son efficacité auprès des utilisateurs reste à évaluer.

Cette trame est une proposition éditoriale, pas la trace d’une présentation déjà faite. Les chemins sources ci-dessous correspondent à l’archive. La mise en forme des slides et le temps de parole restent à décider.

| Slide | Message à faire passer | Contenu essentiel / preuve | Visuel conseillé | Critère / précaution |
| --- | --- | --- | --- | --- |
| 1 | Préparer, réaliser et retrouver sa séance demandent des informations cohérentes | Problème de suivi et périmètre musculation ; application HTML/CSS/JS locale | Une capture d’accès et un parcours en trois moments | Sujet : présenter le besoin comme hypothèse de cadrage, pas comme absence prouvée d’applications adaptées |
| 2 | Quatre personas rendent visibles des besoins d’interaction différents | Thomas : guidage ; Camille : reprise/correction ; Greg : cycles/RPE ; Mireille : lisibilité/autonomie | Quatre lignes besoin → conséquence, pas quatre biographies complètes | Personas fictifs ; âges/citations ne proviennent pas d’entretiens archivés |
| 3 | Camille doit pouvoir corriger et reprendre sans reconstruire sa séance | Contexte entre deux séries, cible prévue différente du réalisé, interruption et retour | Séquence illustrée en 4 étapes | Scénario de conception, pas observation mesurée ; références Thomas/Greg/Mireille en annexe |
| 4 | T1–T5 définissent des alternatives et une boucle, pas un tunnel obligatoire | Créer OU choisir/importer OU reprendre ; planification facultative ; T2 puis T3 et retour vers T1 ; T5 transversal | Vue globale puis zoom T2 ; éviter de projeter tous les petits libellés d’un coup | Arbre 2,5 points : conserver acteurs, conditions, répétitions ; T5 réseau hors frontend |
| 5 | L’interface sépare programme, occurrence, résultat et bilan | Interface abstraite : objets/actions ; interface concrète : bibliothèque, calendrier, champs et archive | Deux colonnes objet abstrait → contrôle concret ; courte démonstration | Prototype 3,5 points : montrer les états et le feedback, pas seulement l’esthétique |
| 6 | Le guidage et le contrôle explicite orientent les simplifications | Choix par niveau, détails facultatifs, Quitter conserve, Terminer archive, erreurs locales | Deux captures annotées avec 3 critères ; tableau des huit catégories en annexe | Bastien & Scapin : distinction correction fonctionnelle / hypothèse de facilité d’usage |
| 7 | Le KLM compare trois méthodes atteignant le même résultat | Une série 20 kg / 10 répétitions / RPE 7 ; souris 8,65 s, Entrée 4,85 s, recopie 2,65 s | Petit tableau des opérateurs et calcul de la méthode Entrée | **Prédictions**, expert, sans erreur, champs visibles, R ≈ 0 ; recopie seulement si résultat réellement identique |
| 8 | L’UAN explicite les actions, les retours et les états de correction | `~[charge] Mv M^`, saisie clavier, feedback, brouillon ; branche erreur et reprise | Extrait lisible de 3–4 lignes de la table UAN | Ne pas confondre M souris UAN et M mental KLM ; aucun bouton de validation de série inventé |
| 9 | L’expérience est préparée ; les résultats humains restent à recueillir | H1–H4, plan de recrutement, tâches E1–E6, réussite/aide/temps/erreurs/difficulté | Schéma du protocole et une fiche de collecte **vierge** | Expérimentation 3,5 points : ne pas remplacer les participants par les tests automatiques |
| 10 | Les itérations relient un problème précis à une décision vérifiable | Exemples : retour qualitatif création/clôture ; revue experte du raccourci numérique ; correction, tests et limites | Deux chaînes problème → décision → code → vérification → question restante | Démarche 3 points : distinguer retour humain limité et diagnostic expert ; alternatives non testées marquées comme telles |
| 11 | Les contrôles techniques établissent la conservation, pas l’adoption | 150 tests, parcours complet, trois niveaux, largeurs 320–1440 px ; limites appareil réel/lecteur d’écran/usage long | Bilan vérifié avec cible 20 et résultat 22,5 ; liste courte des limites | Aucun pourcentage de satisfaction ou de conformité globale ; pas de note officielle autoattribuée |
| 12 | La prochaine étape est une boucle d’évaluation avec de vrais participants | Pilote, recrutement, collecte, analyse, décisions puis nouvelle vérification | Boucle de conception avec étape suivante indiquée | Conclusion soutenable : ce qui fonctionne techniquement, ce qui reste une hypothèse et comment la vérifier |

## Annexes à préparer selon les questions

- Quatre personas et scénarios complets ; provenance fictive et statut de validation.
- Arbres T1–T4 ; T5 corrigé éditable et différence avec le PNG historique.
- Matrice persona → scénario → tâche → interface → évaluation → itération.
- Huit catégories de Bastien & Scapin avec exemples/code/limites.
- Calculs KLM complets, sensibilité de P, règles de placement de M, limites tactiles.
- UAN complète : de « Commencer la séance » à « Terminer et enregistrer mon bilan » (statuts, adaptation de cible, ressenti), avec la saisie d'une série détaillée à part : saisie invalide, Non faite, reprise, Annuler et échec de stockage.
- Protocole, définitions des mesures et fiche vierge ; futurs résultats réels seulement après collecte.
- Choix de confidentialité du partage : programme/cibles publics, suivi personnel exclu ; diffusion locale simulée.

## Ligne visuelle

Conserver l’identité du prototype. Une conclusion par slide, grande capture ou schéma explicatif, texte limité ; les détails méthodologiques restent en annexe. Sur un format 16:9 éventuel, partir de titres 32–44 pt et corps 18–24 pt, puis vérifier à la projection. Ne pas comprimer l’arbre complet ou l’audit dans une slide illisible. Les captures plein écran gardent leurs proportions ; une découpe doit préserver unités, statut et contexte utiles.
