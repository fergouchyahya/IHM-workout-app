# T4 — Partager une séance ou un bloc avec la communauté : Thomas

**Responsable :** Marie · **État :** modèle provisoire fondé sur le persona, à valider par jeu de rôle.

## 1. But et limites

Thomas publie une séance ou un bloc (ensemble de séances sur une période) qu'il a créé, pour que d'autres utilisateurs s'en servent comme base. Le partage est un geste d'entraide : il ne contient ni record ni performance, seulement le programme prévu et une description. Thomas peut y demander l'avis des plus expérimentés (« mes séances sont-elles bien construites ? »).

T4 commence quand une séance ou un bloc existe (T1) et finit quand il est publié, avec éventuellement la lecture des retours. Importer le programme d'un autre utilisateur relève de T1.1, l'analyse de ses propres résultats de T3, la synchronisation de T5.

**Attention :** le persona de Thomas ne mentionne pas le partage, et il préfère des programmes prédéfinis à la création. Ce modèle est une hypothèse : Thomas partagerait surtout une variante adaptée d'un bloc existant, pour se faire valider.

## 2. Sources et concepts du domaine

- [Réunion du 18 septembre](../../../reunions/20260918-ArbreDeTaches.md) : T4.1 Diffuser son contenu (partager ou publier une séance / un bloc).
- [Persona et scénario de Thomas](../../02-utilisateurs-personas/PersonaProvisoire_Debutant_ThomasDubois.md) : débutant intimidé, besoin de se rassurer sur la légitimité de son plan, appréciation des étiquettes pédagogiques (« Jambes », « Full Body »).

**Concepts :** séance, bloc, programme prévu (exercices, séries, répétitions), titre, niveau, zone ciblée, description, demande de retours, aperçu, publication, commentaire.

## 3. Hiérarchie des tâches (composition)

```text
T4 Partager une séance ou un bloc avec la communauté
├── T4.1 Choisir le contenu à partager
│   ├── T4.1.1 Sélectionner la séance ou le bloc à partager
│   └── T4.1.2 Vérifier que le programme est complet et compréhensible pour un autre
├── T4.2 Présenter le contenu à la communauté
│   ├── T4.2.1 Donner un titre, un niveau et une zone ciblée
│   ├── T4.2.2 Rédiger une description (objectif, public visé)
│   └── T4.2.3 Demander des retours et autoriser les commentaires
├── T4.3 Publier
│   ├── T4.3.1 Contrôler l'aperçu tel que la communauté le verra
│   └── T4.3.2 Confirmer la publication
└── T4.4 Suivre le contenu publié (à valider)
    ├── T4.4.1 Lire les commentaires reçus
    └── T4.4.2 Modifier ou retirer la publication
```

Les feuilles sont des tâches à détailler en actions physiques quand l'interface sera définie. T4.2.3 et T4.4 sont facultatives. La réunion ne cite que « Diffuser son contenu » : l'équipe doit décider si T4.4 reste dans T4.

## 4. Procédure et relations temporelles

1. Thomas sélectionne une séance ou un bloc et vérifie que quelqu'un d'autre pourrait le suivre sans explication orale.
2. Il renseigne la présentation : titre, niveau, zone ciblée et description, dans n'importe quel ordre. Il peut ajouter une demande de retours.
3. Il contrôle l'aperçu, puis confirme. Il n'y a pas de publication sans confirmation.
4. Plus tard, il lit les commentaires. Il peut modifier ou retirer la publication, puis republier.

**Ordre :** sélectionner → vérifier → (titre | niveau et zone | description | demande de retours, sans ordre) → aperçu → confirmer ; boucle : lire les retours → modifier.

Cas ouverts : bloc jamais terminé, séance contenant des notes personnelles ou des résultats réels (à exclure du partage), retrait d'un contenu déjà importé par d'autres, choix de la visibilité (partager avec des contacts ou publier à tous), absent du persona et à valider.

## 5. Décoration des tâches

| Tâche | Précondition → résultat | Acteur / fréquence | Point à vérifier |
| --- | --- | --- | --- |
| T4.1.1 Sélectionner | Séance ou bloc existant → contenu à partager choisi | Thomas, occasionnelle | Accès direct depuis le bloc ou la séance |
| T4.1.2 Vérifier | Contenu choisi → programme jugé complet et clair pour un autre | Thomas, à chaque partage | Critère de « compréhensible » pour un débutant |
| T4.2.1 Titre, niveau, zone | Contenu vérifié → titre, niveau et zone ciblée renseignés | Thomas, à chaque partage | Vocabulaire simple (« Full Body », « Jambes ») |
| T4.2.2 Rédiger la description | Fiche renseignée → description de l'objectif et du public visé | Thomas, à chaque partage | Quoi écrire ? Aide ou exemple utile ? |
| T4.2.3 Demander des retours | Description en cours → retours sollicités, commentaires autorisés | Thomas, si besoin | Peur du jugement ; l'option doit rester facultative |
| T4.3.1 Contrôler l'aperçu | Présentation prête → aperçu public vu | Thomas et outil, à chaque partage | Pas de notes ni de résultats personnels visibles |
| T4.3.2 Confirmer | Aperçu validé → contenu publié | Thomas et outil, à chaque partage | Confirmation explicite, visibilité claire |
| T4.4.1 Lire les commentaires | Contenu publié → retours lus | Thomas, répétée | Retrouver les retours, gérer les avis contradictoires |
| T4.4.2 Modifier ou retirer | Contenu publié → publication mise à jour ou retirée | Thomas et outil, rare | Effet sur ceux qui l'ont déjà importé |

## 6. Essai sur le scénario

Le scénario actuel de Thomas ne parle pas de partage. **Prolongement hypothétique** : après quelques semaines, Thomas a adapté un bloc « Full Body » de la bibliothèque. Il n'est pas sûr que ce soit une bonne séance et veut l'avis d'utilisateurs plus expérimentés.

| Situation | Tâches | Résultat attendu |
| --- | --- | --- |
| Il ouvre son bloc adapté | T4.1.1–T4.1.2 | Bloc choisi, programme jugé compréhensible |
| Il le présente comme « débutant, corps entier » | T4.2.1 | Niveau et zone renseignés |
| Il explique son objectif et demande des conseils | T4.2.2–T4.2.3 | Description rédigée, commentaires autorisés |
| Il vérifie ce que verront les autres, puis publie | T4.3.1–T4.3.2 | Bloc publié, sans notes ni résultats personnels |
| Il consulte les conseils reçus | T4.4.1 | Retours lus |
| Il corrige son bloc | T4.4.2 | Publication mise à jour |

Cet essai montre que T4 est un enchaînement de la modification d'un bloc (T1.2) vers sa publication. Il faut donc un accès direct à « Partager » depuis un bloc ou une séance, et pas seulement depuis un menu communauté.

## 7. Questions de validation

Répondre comme Thomas, avec un exemple concret.

1. Dans quel cas voudrais-tu partager un de tes blocs ou une de tes séances ? Que veux-tu en retirer ?
2. Voudrais-tu le montrer à quelques personnes (amis, gens de la salle) ou le publier à tout le monde ? Pourquoi ?
3. Qu'est-ce que tu écrirais dans la description pour demander de l'aide ?
4. Qu'est-ce qui te ferait hésiter à publier (peur du jugement, doute sur la qualité) ?
5. Que veux-tu voir avant de publier, pour être sûr de ce que les autres verront ?
6. Comment voudrais-tu retrouver les conseils reçus, et que ferais-tu d'un avis contradictoire ?
7. Si tu regrettes d'avoir publié, que voudrais-tu pouvoir faire ?

## 8. Réponses et révisions

**À remplir par l'équipe :** noter le répondant et la date. Le jeu de rôle donnera des pistes ; un entretien avec un débutant réel devra les confirmer.
