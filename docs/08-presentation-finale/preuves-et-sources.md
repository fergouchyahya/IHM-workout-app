# Audit et registre de la présentation — révision Thomas

Version du 5 novembre 2026, adaptée aux précisions du groupe et au PDF `Training App-1.pdf`. Les sources sont conservées ici et dans les manifestes ; **aucune citation de cours, référence Git ou ligne de sources n'est affichée dans les slides**. Les informations utiles à l'exposé et aux questions figurent dans les 17 slides principales et les 27 annexes.

## Informations nouvellement confirmées

La déclaration de l'utilisateur du 5 novembre est consignée dans [retours-et-participants.md](retours-et-participants.md). Elle précise l'origine des personas et leur anonymisation, l'existence du fil de fer créé mais non versionné, la succession des échanges et prototypes, le film sur T1/T2, un autre test complet non filmé et l'absence de vérification humaine de la version finale.

Ces précisions sont la source des faits humains nouveaux. L'assistant n'a pas observé ces sessions et ne prétend pas avoir visionné le film. Le chemin fourni comme réponse à la demande de vidéo est celui du PNG de l'arbre T2 : le lecteur local accepte le véritable fichier lorsqu'il sera choisi. Aucun faux film de participant n'est créé.

Les anciens documents de recherche et d'audit décrivaient les personas comme fictifs et les relevés humains comme absents. Leur état historique est conservé ; la présentation tient compte des informations plus récentes du groupe. Le protocole formel de six personnes visées et 30 minutes n'est pas présenté comme la méthode des essais aujourd'hui rapportés.

## Changements appliqués

| Demande | Réponse dans le livrable |
| --- | --- |
| Thomas comme fil conducteur | Persona développé, scénario, captures débutantes, démonstration, KLM et UAN adaptés |
| Recherche dans le problème | Une seule slide problème/recherche, sans nouvelle section indépendante |
| Noms modifiés pour anonymat | Une mention simple sur la slide des profils ; aucun autre avertissement sur les fiches |
| Images des arbres | PNG existants, pied de page retiré dans les copies ; global puis T2 ; quatre gros plans T2 en annexe |
| Fil de fer réel | Extraction de la page 8 du PDF fourni, sans mention de reconstruction hypothétique |
| Histoire des tests | Fil de fer → échanges → prototype 1 → échanges → prototype 2 → essais → version finale |
| Présenter les principaux retours | Création, molette, espace final, fin de séance ; distinction du film T1/T2 et du test complet |
| Montrer les améliorations | Deux slides ergonomiques avant/après : création/recherche puis clôture/contrôle ; recherche et saisie en annexes |
| Retirer les commentaires envahissants | Suppression des qualifications et pieds de page demandés ; calculs et états sont directement expliqués |
| Bilan plus humain | Difficultés d'organisation et de captation, diversité des pratiques, utilité des retours pour prioriser |

## Couverture de la grille sur 20 points

Les numéros ci-dessous sont les **pages du parcours principal**, pas les identifiants internes du JavaScript. La couverture ne constitue pas une note attribuée.

| Rubrique | Points | Pages / annexes | Preuve présentée |
| --- | ---: | --- | --- |
| Sujet / présentation | 1 | 1–2, 17 | Groupe, problème/recherche, conclusion |
| Personas | 1,5 | 3 ; A01–A04 | Quatre profils anonymisés puis Thomas |
| Scénario | 1,5 | 4, 12 | Situation, interruption, reprise, correction, bilan |
| Arbre des tâches | 2,5 | 5–6 ; A05–A09, A24–A27 | PNG global, T2, détails des branches |
| Prototype | 3,5 | 7–9, 11–13 | Fil de fer, squelette, version fonctionnelle, version finale |
| Critères ergonomiques | 1,5 | 11, 13 ; A15–A16, A20, A23 | Avant/après reliés aux critères ; huit catégories détaillées |
| Keystroke | 1 | 14 ; A10–A11 | Deux champs, trois méthodes, calculs explicités |
| UAN | 1 | 15 ; A12–A14 | Recopie/annulation, actions, feedback et états |
| Évaluation expérimentale | 3,5 | 10 ; A17–A18 | Film T1/T2, autre test complet, retours qualitatifs |
| Processus / itération | 3 | 7–13, 16–17 ; A19 | Échanges successifs, corrections et dernière version non retestée |

## Registre des affirmations et visuels

| Élément | Source | Nature et portée |
| --- | --- | --- |
| Groupe 6, noms des membres, durée et heure d'envoi | Informations de l'utilisateur et images de consignes | Contraintes de présentation ; email non envoyé par la génération |
| Recherche sur quatre applications | `research/analyse-concurrence/synthese-concurrence.md` | Observations et avis de l'équipe ; ne revendique pas une analyse actualisée du marché |
| Profils et noms anonymisés | Fiches existantes + précision du groupe du 5 novembre | Caractéristiques des fiches conservées ; pas de nouveaux noms réels ou citations supposées |
| Thomas : séance guidée et saisie simple | Fiche et scénario Thomas ; PDF fourni pp. 4–5 | Scénario de démonstration centré sur préparation, interruption et reprise |
| Global T0–T5 et détail T2 | `assets/diagrammes/arbre-taches-*.png` | Copie recadrée uniquement pour retirer le pied de page ; les originaux sont préservés |
| Gros plans T2.1–T2.4 | Recadrages du PNG T2 | Nœuds, libellés, branches et opérateurs conservés dans les parties montrées |
| Fil de fer | `Training App-1.pdf`, page 8 ; existence confirmée par le groupe | Crop de l'artefact fourni, pas une nouvelle maquette inventée |
| Prototypes 1 / 2 / final | États historiques ec84a28, 647c6ec et 703a06e | Captures d'interfaces avec données de démonstration ; pas des captures du test humain |
| Échanges après chaque étape | Déclaration du groupe | Aucun nombre de personnes, date ou résultat par phase ajouté |
| Participante filmée T1/T2 | Déclaration du groupe ; starter pour le premier retour | Couverture du film rapportée ; fichier non disponible pour inspection |
| Autre test complet, retours similaires | Déclaration du groupe | Retour qualitatif, sans mesure ni verbatim créé |
| Quatre problèmes principaux | Audit historique §20, PDF fourni et déclaration du groupe | Difficultés de création, molette, recherche, clôture |
| Corrections apportées | Audit historique, DR-001, code des deux interfaces et captures | Modifications livrées ; dernière validation humaine non revendiquée |
| KLM de Thomas | Variante sans RPE de `keystroke.md`, calcul explicité ci-dessous | Temps modélisés, pas chronométrage des personnes |
| UAN recopie / Annuler | `uan-saisie-serie.md`, comportement de recopie du prototype | Adaptation tactile ; état précédent restauré sans écraser une correction ultérieure |
| Bilan du travail avec les personnes | Retour de l'utilisateur et synthèse éditoriale | Organisation et captation exigeantes, retours utiles pour prioriser ; aucun gain d'adoption mesuré annoncé |

## KLM retenu : une série sans RPE

Même objectif : saisir 20 kg et 10 répétitions dans la série 2. État initial de comparaison : champs vides, série 1 complète avec le même résultat ; main sur la souris. État final : valeurs conservées dans le brouillon, main revenue à la souris. La recopie exige un résultat précédent réellement identique.

| Méthode | Séquence | Calcul | Résultat |
| --- | --- | --- | ---: |
| A — chaque champ à la souris | M + 2P + 6K + 4H | 1,35 + 2×1,10 + 6×0,20 + 4×0,40 | 6,35 s |
| B — progression Entrée | M + P + 6K + 2H | 1,35 + 1,10 + 6×0,20 + 2×0,40 | 4,45 s |
| C — recopie identique | M + P + K | 1,35 + 1,10 + 0,20 | 2,65 s |

Hypothèses du modèle : saisie connue sans erreur, P choisi à 1,10 s, M au début de l'épisode, retour souris-clavier H = 0,40 s, R nul dans le scénario. Le niveau sportif Débutant détermine les champs affichés ; il ne prouve pas une maîtrise initiale de l'interface. Ces détails restent dans le registre et l'annexe de calcul plutôt qu'en commentaire sur la slide principale.

Extension séparée : deux exercices, trois séries chacun, un changement d'exercice P+K = 1,30 s. A = 39,40 s ; B = 28,00 s ; C = 20,80 s (deux saisies puis quatre recopies). Revue et confirmation du bilan exclues. Les anciens totaux avec RPE ou douze séries ne sont pas mélangés à ce calcul.

## Contrôles de livraison

Le contrôle navigateur vérifie 44 slides, 17 principales, budget 815 s, images, liens internes, absence de liens externes et de sources en pied de page, clavier, sommaire, annexes, zoom natif des PNG et géométrie. Les 41 marqueurs rouges des listes sont contrôlés pour leur espacement et leur alignement sur la première ligne. Les 44 slides disposent de notes en puces ; le [script oral](script-oral.md) donne les annexes associées et une appréciation de couverture, sans prédire la note du jury. Le lecteur vidéo est testé séparément avec un clip technique temporaire : il ne représente pas la participante et n'est pas livré.

Le PDF est relu par extraction des titres et inspection des pages rendues. Le rapport actuel est dans [verification.json](verification.json), les captures et empreintes dans [visuels/provenance.json](visuels/provenance.json). Toute retouche après cette vérification nécessite un réexport et un nouveau contrôle des pages affectées.

Restent à la préparation de l'oral : choisir la vraie vidéo ou la démo, répéter avec les quatre membres et envoyer le PDF. Le contrôle de l'assistant ne constitue pas la nouvelle vérification humaine de la version finale que le groupe n'a pas eu le temps de mener.
