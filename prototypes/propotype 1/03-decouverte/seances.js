/* Catalogue fictif pour les interactions ; les cibles détaillées seront conçues séparément. */
window.catalogueSeances = [
  { id:'fullbody', name:'Premiers pas · Full Body', duration:20, level:'Débutant', equipment:'Salle équipée', groups:['Corps entier','Jambes','Pectoraux','Dos'], source:'starter', description:'Une séance courte pour découvrir trois machines et prendre tes repères.', exercises:['Presse à cuisses','Presse à pectoraux','Tirage assis'] },
  { id:'bodyweight', name:'Bouger sans matériel', duration:15, level:'Débutant', equipment:'Sans matériel', groups:['Corps entier','Jambes','Pectoraux'], source:'starter', description:'Des mouvements simples au poids du corps, avec un support stable pour les pompes inclinées.', exercises:['Squat au poids du corps','Pompes inclinées','Pont fessier'] },
  { id:'upper', name:'Haut du corps · Mes repères', duration:30, level:'Intermédiaire', equipment:'Haltères à la maison', groups:['Haut du corps','Pectoraux','Dos','Épaules'], source:'starter', description:'Une base de séance pour organiser les mouvements du haut du corps.', exercises:['Développé avec haltères','Tirage avec haltère','Élévations latérales','Curl avec haltères'] },
  { id:'legs', name:'Jambes · Les bases', duration:25, level:'Débutant', equipment:'Salle équipée', groups:['Jambes'], source:'starter', description:'Un exemple de séance centrée sur les jambes à consulter et adapter.', exercises:['Presse à cuisses','Flexion des jambes sur machine','Pont fessier'] },
  { id:'strength', name:'Haut du corps · Force', duration:45, level:'Avancé', equipment:'Salle équipée', groups:['Haut du corps','Pectoraux','Dos','Bras'], source:'starter', description:'Une structure d’exemple pour un pratiquant qui dispose déjà de ses propres repères.', exercises:['Développé couché','Tirage assis','Tractions','Extension des triceps'] },
  { id:'community-body', name:'Ma pause active', duration:18, level:'Débutant', equipment:'Sans matériel', groups:['Corps entier','Jambes','Abdominaux'], source:'community', author:'Camille · auteur fictif', description:'Une séance d’exemple proposée dans la section communauté.', exercises:['Squat au poids du corps','Pont fessier','Relevé de genoux'] }
];
window.optionsFiltres = {
  level: { label:'Niveau', options:[['','Tous'],['Débutant','Débutant'],['Intermédiaire','Intermédiaire'],['Avancé','Avancé']] },
  group: { label:'Groupe musculaire ou zone', options:['','Corps entier','Haut du corps','Jambes','Pectoraux','Dos','Épaules','Bras','Abdominaux'].map(value => [value,value || 'Toutes']) },
  equipment: { label:'Matériel', options:[['','Tout'],['Salle équipée','Salle équipée'],['Haltères à la maison','Haltères à la maison'],['Sans matériel','Sans matériel']] },
  duration: { label:'Durée maximum', options:[['','Toutes'],['20','20 min'],['30','30 min'],['45','45 min'],['60','60 min']] }
};
