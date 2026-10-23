const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const {randomUUID} = require('node:crypto');

function app() {
  const window = {Parcours:{state:{profile:{timeBudget:20,availableDays:[0,3]},saved:[],customExercises:[],calendar:[],milestones:[]},persist(){},isAdvanced:()=>true,isBeginner:()=>false},Semaine:{days:['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche']},Partages:{data:{items:[]}}};
  const ctx = vm.createContext({window,structuredClone,crypto:{randomUUID},document:{addEventListener(){}}});
  for (const file of ['commun/ergonomie.js','commun/disponibilites.js','06-configuration-seance/exercices.js','05-organisation-semaine/calendrier.js','03-decouverte/programmes.js']) vm.runInContext(fs.readFileSync(path.join(__dirname,'../prototypes/propotype 1',file),'utf8'),ctx);
  return window;
}

test('availability warns about date and time without changing training or imposing rest',() => {
  const w=app(),state=w.Parcours.state;
  assert.equal(w.Disponibilites.warnings({duration:30},'2026-11-03').length,2);
  assert.equal(w.Disponibilites.warnings({duration:15},'2026-11-02').length,0);
  assert.equal(w.Disponibilites.warnings({duration:30,timeBudget:40,availableDays:[]},'2026-11-03').length,0);
  assert.equal(state.calendar.length,0);
});

test('availability accepts blank limits and rejects invalid minute counts',() => {
  const w=app();
  const form=value=>({elements:{timeBudget:{value}},querySelectorAll:()=>[{value:'0'},{value:'3'}]});
  assert.equal(w.Disponibilites.read(form('')).timeBudget,null);
  assert.deepEqual(Array.from(w.Disponibilites.read(form('30')).availableDays),[0,3]);
  for(const value of ['-1','0','1.5','1441','no']) assert.equal(w.Disponibilites.read(form(value)),null);
});

test('full mesocycle import preserves dates structure, rest and changing targets independently',() => {
  const w=app(),plan=w.catalogueProgrammes[1],copy=w.Programmes.import(plan);
  assert.equal(copy.organization,'Mésocycle'); assert.equal(copy.weeks,3);
  assert.equal(copy.days[1].type,'rest');
  assert.equal(copy.cycleWeeks[2][0].exercises[0].minReps,10);
  assert.equal(w.Parcours.state.calendar.length,0);
  assert.equal(w.Programmes.import(plan).id,copy.id);
  assert.equal(w.Parcours.state.saved.length,1);
  copy.cycleWeeks[2][0].exercises[0].load=99;
  assert.equal(plan.cycleWeeks[2][0].exercises[0].load,null);
  assert.equal(copy.days[0].exercises[0].load,null);
});

test('publication plan omits personal fields, preserves all weeks and imports custom movements',() => {
  const w=app(),copy=w.Programmes.import(w.catalogueProgrammes[1]);
  const custom={id:'private-ex',name:'Mouvement personnel',instruction:'Consigne publique',group:'Dos',equipment:'Sans matériel'};
  w.catalogueExercices.push(custom);
  Object.assign(copy.cycleWeeks[2][0].exercises[0],{exerciseId:custom.id,rpe:8,note:'NOTE PRIVÉE',setting:'RÉGLAGE PRIVÉ'});
  copy.availableDays=[0];copy.timeBudget=15;copy.trainingDrafts={private:'RÉSULTAT PRIVÉ'};
  const plan=w.Programmes.snapshot(copy),serialized=JSON.stringify(plan);
  for(const secret of ['NOTE PRIVÉE','RÉGLAGE PRIVÉ','RÉSULTAT PRIVÉ','availableDays','timeBudget']) assert.equal(serialized.includes(secret),false);
  assert.equal(plan.cycleWeeks.length,3); assert.equal(plan.cycleWeeks[2][0].exercises[0].rpe,8);
  w.catalogueExercices=w.catalogueExercices.filter(item=>item.id!==custom.id);
  const imported=w.Programmes.import({...plan,id:'publication:test'});
  const exercise=imported.cycleWeeks[2][0].exercises[0];
  assert.equal(exercise.note,'');assert.equal(exercise.setting,'');assert.equal(exercise.rpe,8);
  assert.equal(w.catalogueExercices.find(item=>item.id===exercise.exerciseId).instruction,'Consigne publique');
});

test('only active structured local publications are offered for import',() => {
  const w=app(),plan=w.Programmes.snapshot(w.catalogueProgrammes[0]);
  w.Partages.data.items=[{id:'yes',status:'published',plan},{id:'withdrawn',status:'withdrawn',plan},{id:'legacy',status:'published',program:[]}];
  const entries=w.Programmes.entries().filter(item=>item.id.startsWith('publication:'));
  assert.equal(entries.length,1);assert.equal(entries[0].id,'publication:yes');
});

test('milestones coexist with rest, validate dates and can be updated independently',() => {
  const w=app(),c=w.Calendrier;
  w.Parcours.state.calendar.push({id:'rest',date:'2026-11-02',type:'rest'});
  assert.equal(c.saveMilestone({title:'',date:'2026-11-02'}),null);
  assert.equal(c.saveMilestone({title:'Fin',date:'2026-02-30'}),null);
  const milestone=c.saveMilestone({title:' Fin de cycle ',date:'2026-11-02',note:'Repère'});
  assert.equal(milestone.title,'Fin de cycle');assert.equal(c.entries(milestone.date).length,1);assert.equal(c.milestones(milestone.date).length,1);
  c.saveMilestone({title:'Fin',date:'2026-11-09'},milestone.id);
  assert.equal(c.milestones('2026-11-02').length,0);assert.equal(c.milestones('2026-11-09').length,1);
  assert.equal(w.Parcours.state.calendar[0].date,'2026-11-02');
});
