# Persona — Thomas, pratiquant débutant

> « Je veux juste arriver à la salle, savoir quoi faire et valider mes séries simplement pour voir que je m'améliore. »

## Statut du persona

**Auteur :** Marie · **Création :** 2026-09-17  
**Statut :** persona fictif validé par toute l’équipe le 2026-10-02.

## Profil

| Caractéristique | Description |
| :--- | :--- |
| Nom fictif | Thomas Dubois |
| Âge | 22 ans |
| Activité | Étudiant |
| Niveau sportif | Débutant (inscrit depuis un mois) |
| Pratique | Musculation sur machines, 2 à 3 séances par semaine |
| Lieu | Salle de sport commerciale |
| Aisance numérique | Excellente (digital native) |

Thomas vient de s'inscrire à la salle de sport mais se sent encore intimidé par l'environnement et le matériel. Il ne sait pas comment structurer un entraînement cohérent. Il cherche avant tout à être pris par la main avec un programme clair et à obtenir des preuves visuelles de ses progrès, tout en assimilant petit à petit les bases de la musculation.

## Objectifs

- Trouver et suivre instantanément des séances prédéfinies de niveau débutant.
- Savoir avec précision quels exercices réaliser, avec combien de séries, de répétitions et de charge.
- Comprendre progressivement la logique de l'entraînement (répartition des groupes musculaires, importance du repos) grâce à une planification claire.
- Valider visuellement que sa force augmente au fil des semaines.

## Besoins

- Une interface ultra-guidée qui élimine la charge mentale de la création de programme.
- Un calendrier sous forme de bloc (ex: cycle de 7 jours) qui nomme explicitement les séances avec des termes simples (« Full Body », « Jambes », « Cardio », « Repos »).
- Un accès rapide à des précisions ou à des visuels sur un exercice pour s'assurer de faire le bon mouvement.
- Une saisie directe des données (pavé numérique) sans boutons fastidieux.
- Une visualisation graphique immédiate et gratifiante de ses nouveaux records (PR).

## Habitudes et contexte d'usage

- Erre souvent quelques minutes dans la salle pour chercher une machine libre qu'il sait utiliser.
- Utilise actuellement l'application « Notes » native de son téléphone pour organiser ses exercices, performances réalisées et ressenti mais se perd constamment car système mal organisé.
- Garde son téléphone en main en permanence entre les séries.
- Est très réceptif aux logiques de gamification, de progression visuelle et d'apprentissage passif (apprendre sans avoir l'impression d'étudier).

## Frustrations

- Les applications concurrentes souvent surchargées d'options (diététique, cycles de force athlétique complexes) qui ne le concernent pas.
- Ne pas comprendre pourquoi il faut parfois reposer un muscle, ce qui le pousse à faire les mêmes exercices à chaque fois.
- L'ergonomie complexe de certaines saisies et le nombre de boutons sur lesquels il faut cliquer pour atteindre un objectif.
- Le sentiment de stagner ou de faire les choses "au hasard" sans retour clair sur son évolution.

## Motivations

- Se rassurer sur sa légitimité à la salle en suivant un "vrai" plan structuré.
- Célébrer les petites victoires (soulever un kilo de plus) pour entretenir sa discipline naissante.
- Comprendre rapidement ce qu'il doit faire sans avoir à faire de multiple recherches fastidieuses.
- Engranger des connaissances de base sur le fitness pour se sentir de plus en plus autonome.

## Comportements représentatifs

- Exécute le programme à la lettre s'il est simple et bien balisé.
- Regarde les intitulés de la semaine pour anticiper ses jours de courbatures (ex: appréhende le jour "Jambes").
- Valide rapidement ses séries une fois terminées pour avoir le sentiment du devoir accompli.

## Scénario principal

Voir le [scénario de Thomas](../03-scenarios/scenario-thomas.md).

## Conséquences pour la conception

1. Mettre en avant une bibliothèque de blocs, séances et exercices prédéfinis dès l'accueil.
2. Afficher les jours de la semaine (sous-blocs de 7 jours) avec des étiquettes pédagogiques (« Jambes », « Haut du corps », « Repos actif ») plutôt que de simples numéros comme « Séance 1 » ou « Séance 2 ».
3. Prévoir une icône d'aide ou d'information cliquable directement depuis la ligne de l'exercice.
4. Implémenter une interface rapide d’utilisation, en quelque clique il doit atteindre son objectif.
5. Déclencher un feedback visuel valorisant (graphique de PR/Max) à la validation finale de la séance pour le conforter dans sa progression et le fait qu'il atteindra ses buts.
