# Contribuer au projet

## Workflow Git

- `main` est la branche stable et ne reçoit pas de travail direct.
- Créer une branche courte par sujet, avec l’un des préfixes suivants :
  - `research/...`
  - `design/...`
  - `prototype/...`
  - `evaluation/...`
  - `docs/...`
- Ouvrir une pull request avant toute fusion dans `main`.
- Pour un artefact important (persona, scénario, arbre de tâches, décision, protocole ou résultat d’évaluation), prévoir un auteur et au moins un reviewer.
- Utiliser des messages de commit clairs, en français ou en anglais, mais rester cohérent au sein de la branche et, si possible, du projet.
- Garder le processus simple : pas de GitFlow complexe, pas de branches longues inutiles.

## Bonnes pratiques documentaires

- Nommer clairement les fichiers et dater les comptes rendus au format `AAAA-MM-JJ`.
- Séparer les faits issus de la recherche, les hypothèses et les décisions.
- Ajouter les liens vers les artefacts Figma dans `prototypes/figma.md` et conserver ici leur contexte de conception.
