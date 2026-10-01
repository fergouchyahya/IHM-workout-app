# T4 — Partager une séance ou un bloc avec la communauté : Camille

**Responsable :** Marie · **État :** modèle provisoire fondé sur le persona, à valider par jeu de rôle.

## 1. But et limites

Camille publie une séance ou un bloc qu'elle a construit et qu'elle réutilise, pour que d'autres utilisateurs s'en servent comme base. Le partage est un geste d'entraide : il ne contient ni résultat, ni charge réelle, ni note personnelle, seulement le programme prévu et une description. Contrairement à Thomas, elle n'a pas besoin d'être validée : elle peut au contraire aider ceux qui commentent ou importent son contenu.

T4 commence quand une séance ou un bloc existe (T1) et finit quand il est publié, avec éventuellement la lecture des retours. Importer le programme d'un autre utilisateur relève de T1.1, la comparaison de ses propres performances de T3, la synchronisation et le fonctionnement hors-ligne de T5.

**Attention :** le persona de Camille ne mentionne pas le partage. Ce modèle est une hypothèse : elle partagerait une structure de séance qu'elle reprend depuis longtemps, à condition que cela lui prenne très peu de temps.

## 2. Sources et concepts du domaine

- [Réunion du 18 septembre](../../../reunions/20260918-ArbreDeTaches.md) : T4.1 Diffuser son contenu (partager ou publier une séance / un bloc).
- [Persona et scénario de Camille](../../02-utilisateurs-personas/persona-camille-intermediaire.md) : intermédiaire autonome, structure de séance réutilisée avec des charges qui varient, saisie abandonnée si elle prend plus de quelques secondes, besoin de ne pas transformer le suivi en tâche administrative, connexion de salle parfois mauvaise.

**Concepts :** séance, bloc, structure réutilisée, programme prévu (exercices, séries, répétitions), données personnelles à exclure (charges réelles, notes), titre, niveau, zone ciblée, description, commentaires, aperçu, publication.

## 3. Hiérarchie des tâches (composition)

```text
T4 Partager une séance ou un bloc avec la communauté
├── T4.1 Choisir le contenu à partager
│   ├── T4.1.1 Sélectionner la séance ou le bloc à partager
│   └── T4.1.2 Vérifier que le programme est complet et sans donnée personnelle
├── T4.2 Présenter le contenu à la communauté
│   ├── T4.2.1 Donner un titre, un niveau et une zone ciblée
│   ├── T4.2.2 Rédiger une description (objectif, public visé)
│   └── T4.2.3 Choisir d'ouvrir ou non les commentaires
├── T4.3 Publier
│   ├── T4.3.1 Contrôler l'aperçu tel que la communauté le verra
│   └── T4.3.2 Confirmer la publication
└── T4.4 Suivre le contenu publié (à valider)
    ├── T4.4.1 Lire et répondre aux commentaires reçus
    └── T4.4.2 Modifier ou retirer la publication
```

Les feuilles sont des tâches à détailler en actions physiques quand l'interface sera définie. T4.2.3 et T4.4 sont facultatives. La réunion ne cite que « Diffuser son contenu » : l'équipe doit décider si T4.4 reste dans T4.

## 4. Procédure et relations temporelles

1. Camille sélectionne la séance qu'elle reprend souvent et vérifie que le programme est partageable : les charges et notes personnelles ne doivent pas apparaître.
2. Elle renseigne la présentation : titre, niveau, zone ciblée et description, dans n'importe quel ordre. Elle choisit si les commentaires sont ouverts.
3. Elle contrôle l'aperçu, puis confirme. Il n'y a pas de publication sans confirmation.
4. Plus tard, elle peut lire les commentaires et y répondre, modifier ou retirer la publication.

**Ordre :** sélectionner → vérifier → (titre | niveau et zone | description | commentaires, sans ordre) → aperçu → confirmer ; boucle : lire les retours → modifier.

Cas ouverts : publication avec une connexion faible (voir T5), séance dupliquée puis modifiée (laquelle partager ?), retrait d'un contenu déjà importé par d'autres, choix de la visibilité (partager avec des contacts ou publier à tous), absent du persona et à valider.

## 5. Décoration des tâches

| Tâche | Précondition → résultat | Acteur / fréquence | Point à vérifier |
| --- | --- | --- | --- |
| T4.1.1 Sélectionner | Séance ou bloc existant → contenu à partager choisi | Camille, occasionnelle | Accès direct depuis la séance qu'elle reprend |
| T4.1.2 Vérifier | Contenu choisi → programme complet, sans charge réelle ni note | Camille et outil, à chaque partage | Exclusion automatique des données personnelles |
| T4.2.1 Titre, niveau, zone | Contenu vérifié → titre, niveau et zone ciblée renseignés | Camille, à chaque partage | Champs préremplis à partir de la séance |
| T4.2.2 Rédiger la description | Fiche renseignée → description de l'objectif et du public visé | Camille, à chaque partage | Durée de saisie, description facultative ? |
| T4.2.3 Ouvrir les commentaires | Description en cours → commentaires ouverts ou fermés | Camille, à chaque partage | Valeur par défaut, charge de modération |
| T4.3.1 Contrôler l'aperçu | Présentation prête → aperçu public vu | Camille et outil, à chaque partage | Aucune donnée personnelle visible |
| T4.3.2 Confirmer | Aperçu validé → contenu publié | Camille et outil, à chaque partage | Connexion faible ; voir T5 |
| T4.4.1 Lire et répondre | Contenu publié → retours lus, réponse éventuelle | Camille, répétée | Temps qu'elle veut y consacrer |
| T4.4.2 Modifier ou retirer | Contenu publié → publication mise à jour ou retirée | Camille et outil, rare | Effet sur ceux qui l'ont déjà importé |

## 6. Essai sur le scénario

Le scénario actuel de Camille ne parle pas de partage. **Prolongement hypothétique** : une collègue débutante lui demande son programme. Camille décide de publier sa séance « Haut du corps », qu'elle duplique chaque semaine, pour que d'autres puissent la reprendre.

| Situation | Tâches | Résultat attendu |
| --- | --- | --- |
| Elle ouvre sa séance habituelle | T4.1.1 | Séance choisie en quelques actions |
| Elle contrôle ce qui sera partagé | T4.1.2 | Programme sans charges ni notes |
| Elle nomme la séance et indique le niveau | T4.2.1–T4.2.2 | Fiche et description rédigées rapidement |
| Elle laisse les commentaires ouverts | T4.2.3 | Choix fait |
| Elle vérifie l'aperçu et publie, depuis chez elle | T4.3.1–T4.3.2 | Séance publiée |
| Elle répond à une question d'un débutant | T4.4.1 | Réponse envoyée |

Cet essai montre que Camille partage plus volontiers à froid, hors de la salle, mais seulement si le geste est court et si les données personnelles sont exclues automatiquement. T4 doit donc partir de la séance existante et préremplir un maximum de champs.

## 7. Questions de validation

Répondre comme Camille, avec un exemple concret.

1. Dans quel cas voudrais-tu partager une de tes séances ou un de tes blocs ? Quand le ferais-tu : à la salle ou chez toi ?
2. Voudrais-tu la donner à quelques personnes (collègues, amis) ou la publier à tout le monde ? Pourquoi ?
3. Combien de temps es-tu prête à y consacrer, et que veux-tu ne pas avoir à saisir ?
4. Qu'est-ce qui ne doit surtout pas être partagé (charges, notes, historique) ?
5. Ouvrirais-tu les commentaires ? Que ferais-tu des questions et des critiques reçues ?
6. Avec une mauvaise connexion, comment saurais-tu que ta publication est bien faite ?
7. Si tu modifies ensuite ta séance, veux-tu que la version publiée change aussi ?

## 8. Réponses et révisions

**À remplir par l'équipe :** noter le répondant et la date. Le jeu de rôle donnera des pistes ; un entretien avec une pratiquante intermédiaire réelle devra les confirmer.
