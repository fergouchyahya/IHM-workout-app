# T4 — Partager une séance ou un bloc avec la communauté : Thomas

**Responsable :** Marie · **État :** modèle validé par toute l’équipe le 2 octobre 2026.

## 1. But et limites

Thomas publie une séance ou un bloc (ensemble de séances sur une période) qu'il a créé, pour que d'autres utilisateurs s'en servent comme base. Le partage est un geste d'entraide : il ne contient ni record ni performance, seulement le programme prévu et une description. Thomas peut y demander l'avis des plus expérimentés pour vérifier la construction de ses séances.

T4 commence quand une séance ou un bloc existe (T1) et finit quand il est publié, avec éventuellement la lecture des retours. Importer le programme d'un autre utilisateur relève de T1.1, l'analyse de ses propres résultats de T3, la synchronisation de T5.

**Variante retenue :** Thomas partage surtout une variante adaptée d’un bloc existant pour demander des retours.

## 2. Sources et concepts du domaine

- [Réunion du 18 septembre](../../../reunions/2026-09-18-arbre-des-taches.md) : T4.1 Diffuser son contenu (partager ou publier une séance / un bloc).
- [Persona de Thomas](../../02-utilisateurs-personas/persona-thomas.md) et [scénario](../../03-scenarios/scenario-thomas.md) : débutant intimidé, besoin de se rassurer sur la légitimité de son plan, appréciation des étiquettes pédagogiques (« Jambes », « Full Body »).

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
└── T4.4 Suivre le contenu publié
    ├── T4.4.1 Lire les commentaires reçus
    └── T4.4.2 Modifier ou retirer la publication
```

Les feuilles sont des tâches à détailler en actions physiques quand l'interface sera définie. T4.2.3 et T4.4 sont facultatives. Le suivi T4.4 est repris dans l’arbre commun.

## 4. Procédure et relations temporelles

1. Thomas sélectionne une séance ou un bloc et vérifie que quelqu'un d'autre pourrait le suivre sans explication orale.
2. Il renseigne la présentation : titre, niveau, zone ciblée et description, dans n'importe quel ordre. Il peut ajouter une demande de retours.
3. Il contrôle l'aperçu, puis confirme. Il n'y a pas de publication sans confirmation.
4. Plus tard, il lit les commentaires. Il peut modifier ou retirer la publication, puis republier.

**Ordre :** sélectionner → vérifier → (titre | niveau et zone | description | demande de retours, sans ordre) → aperçu → confirmer ; boucle : lire les retours → modifier.

Les modalités de partage, de connexion et de gestion des copies sont regroupées dans [l’arbre commun](../tache.md).

## 5. Décoration des tâches

| Tâche | Précondition → résultat | Acteur / fréquence | Repère de conception |
| --- | --- | --- | --- |
| T4.1.1 Sélectionner | Séance ou bloc existant → contenu à partager choisi | Thomas, occasionnelle | Accès direct depuis le bloc ou la séance |
| T4.1.2 Vérifier | Contenu choisi → programme jugé complet et clair pour un autre | Thomas, à chaque partage | Critère de « compréhensible » pour un débutant |
| T4.2.1 Titre, niveau, zone | Contenu vérifié → titre, niveau et zone ciblée renseignés | Thomas, à chaque partage | Vocabulaire simple (« Full Body », « Jambes ») |
| T4.2.2 Rédiger la description | Fiche renseignée → description de l'objectif et du public visé | Thomas, à chaque partage | Aide ou exemple de description |
| T4.2.3 Demander des retours | Description en cours → retours sollicités, commentaires autorisés | Thomas, si besoin | Peur du jugement ; l'option doit rester facultative |
| T4.3.1 Contrôler l'aperçu | Présentation prête → aperçu public vu | Thomas et outil, à chaque partage | Pas de notes ni de résultats personnels visibles |
| T4.3.2 Confirmer | Aperçu validé → contenu publié | Thomas et outil, à chaque partage | Confirmation explicite, visibilité claire |
| T4.4.1 Lire les commentaires | Contenu publié → retours lus | Thomas, répétée | Retrouver les retours, gérer les avis contradictoires |
| T4.4.2 Modifier ou retirer | Contenu publié → publication mise à jour ou retirée | Thomas et outil, rare | Effet sur ceux qui l'ont déjà importé |

## 6. Essai sur le scénario

Le scénario actuel de Thomas ne parle pas de partage. **Situation de partage retenue** : après quelques semaines, Thomas a adapté un bloc « Full Body » de la bibliothèque. Il n'est pas sûr que ce soit une bonne séance et veut l'avis d'utilisateurs plus expérimentés.

| Situation | Tâches | Résultat attendu |
| --- | --- | --- |
| Il ouvre son bloc adapté | T4.1.1–T4.1.2 | Bloc choisi, programme jugé compréhensible |
| Il le présente comme « débutant, corps entier » | T4.2.1 | Niveau et zone renseignés |
| Il explique son objectif et demande des conseils | T4.2.2–T4.2.3 | Description rédigée, commentaires autorisés |
| Il vérifie ce que verront les autres, puis publie | T4.3.1–T4.3.2 | Bloc publié, sans notes ni résultats personnels |
| Il consulte les conseils reçus | T4.4.1 | Retours lus |
| Il corrige son bloc | T4.4.2 | Publication mise à jour |

Cet essai montre que T4 est un enchaînement de l’adaptation d’un programme (T1) vers sa publication. Il faut donc un accès direct à « Partager » depuis un bloc ou une séance, et pas seulement depuis un menu communauté.
