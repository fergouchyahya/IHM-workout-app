'use strict';

// Petit catalogue de démonstration, commun à la recherche et au remplacement.
window.catalogueExercices = [
  {id:'presse-jambes',name:'Presse à cuisses',group:'Jambes',equipment:'Salle équipée',instruction:'Repère le réglage du siège et les consignes de la machine avant de commencer.'},
  {id:'flexion-jambes',name:'Flexion des jambes sur machine',group:'Jambes',equipment:'Salle équipée',instruction:'Repère le réglage du siège et du rouleau sur la machine.'},
  {id:'squat',name:'Squat au poids du corps',group:'Jambes',equipment:'Sans matériel',instruction:'Observe le mouvement et choisis une amplitude adaptée à tes repères.'},
  {id:'pont',name:'Pont fessier',group:'Jambes',equipment:'Sans matériel',instruction:'Installe-toi au sol, pieds posés, et repère le mouvement du bassin.'},
  {id:'presse-pectoraux',name:'Presse à pectoraux',group:'Pectoraux',equipment:'Salle équipée',instruction:'Repère la hauteur du siège et la position des poignées.'},
  {id:'couche',name:'Développé couché',group:'Pectoraux',equipment:'Salle équipée',instruction:'Repère la position du banc et les réglages du rack.'},
  {id:'developpe-halteres',name:'Développé avec haltères',group:'Pectoraux',equipment:'Haltères à la maison',instruction:'Prépare les haltères et note la position du banc utilisée.'},
  {id:'pompes',name:'Pompes inclinées',group:'Pectoraux',equipment:'Sans matériel',instruction:'Choisis un support stable et repère la position des mains.'},
  {id:'tirage-assis',name:'Tirage assis',group:'Dos',equipment:'Salle équipée',instruction:'Repère les appuis et la poignée utilisée.'},
  {id:'tirage-haltere',name:'Tirage avec haltère',group:'Dos',equipment:'Haltères à la maison',instruction:'Repère les appuis et réalise le mouvement de chaque côté.'},
  {id:'tractions',name:'Tractions',group:'Dos',equipment:'Salle équipée',instruction:'Repère la prise et une éventuelle assistance.'},
  {id:'elevations',name:'Élévations latérales',group:'Épaules',equipment:'Haltères à la maison',instruction:'Repère la position de départ et le mouvement des bras.'},
  {id:'curl',name:'Curl avec haltères',group:'Bras',equipment:'Haltères à la maison',instruction:'Repère la position des coudes et le mouvement des avant-bras.'},
  {id:'triceps',name:'Extension des triceps',group:'Bras',equipment:'Salle équipée',instruction:'Repère la poignée et le réglage de la poulie.'},
  {id:'genoux',name:'Relevé de genoux',group:'Abdominaux',equipment:'Sans matériel',instruction:'Repère la position de départ et le mouvement des genoux.'}
];

window.catalogueExercices.forEach(exercise => { exercise.image = `../06-configuration-seance/images/${exercise.id}.svg`; });
