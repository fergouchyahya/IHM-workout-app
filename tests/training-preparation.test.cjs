const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');

function app() {
  const window={Parcours:{state:{completedSessions:[],trainingDrafts:{}}}};
  const context=vm.createContext({window,structuredClone});
  vm.runInContext(fs.readFileSync(path.join(__dirname,'../prototypes/propotype 1/08-entrainement/entrainement.js'),'utf8'),context);
  const training=window.Entrainement;training.key='today';
  const exercise={exerciseId:'bench',slotId:'slot-1',sets:2,load:30,minReps:8,maxReps:12,rpe:7,setting:'Banc 2'};
  const draft={workoutId:'workout',date:'2026-11-02',startedAt:'2026-11-02T10:00:00Z',session:{exercises:[exercise]},exerciseIndex:0,results:[[{load:null,reps:null,rpe:null},{load:30,reps:8,rpe:7}]]};
  training.initialize(draft);
  return {training,draft,state:window.Parcours.state};
}
const completed=(draft,overrides={})=>({id:'previous',workoutId:'workout',date:'2026-10-26',completedAt:'2026-10-26T12:00:00Z',status:'completed',session:structuredClone(draft.session),results:[[{load:25,reps:9,rpe:7},{load:25,reps:8,rpe:8}]],...overrides});

test('initializing an older training draft preserves results and raw invalid input',()=>{
 const {training,draft}=app();draft.rawFields={'0:0:load':'-1'};draft.invalidFields={'0:0:load':'Invalid'};
 draft.results[0][0]={load:0,reps:8,rpe:null};
 const before=JSON.stringify(draft.results);training.initialize(draft);
 assert.equal(JSON.stringify(draft.results),before);assert.equal(draft.rawFields['0:0:load'],'-1');assert.equal(draft.invalidFields['0:0:load'],'Invalid');
 assert.equal(draft.dayState.effort,'');
});

test('adapting one set preserves initial targets, other sets and actual results',()=>{
 const {training,draft}=app();const initial=JSON.stringify(draft.session),results=JSON.stringify(draft.results);
 assert.equal(training.adapt(draft,0,0,{load:22.5,minReps:6,maxReps:8,rpe:6.5,reason:'Fatigue'}),true);
 assert.equal(JSON.stringify(draft.session),initial);assert.equal(JSON.stringify(draft.results),results);
 assert.equal(training.target(draft,0,0).load,22.5);assert.equal(training.target(draft,0,1).load,30);
});

test('zero load and blank targets are distinct; invalid adaptations never replace valid targets',()=>{
 const {training,draft}=app();const value={load:0,minReps:null,maxReps:null,rpe:null,reason:''};
 assert.equal(training.adapt(draft,0,0,value),true);assert.equal(training.target(draft,0,0).load,0);
 for(const update of [{load:-1},{minReps:2.5},{minReps:10,maxReps:8},{rpe:11},{rpe:7.3}]){
  assert.equal(training.adapt(draft,0,0,{...value,...update}),false);assert.equal(training.target(draft,0,0).load,0);
 }
});

test('initial targets can be restored without touching results',()=>{
 const {training,draft}=app();training.adapt(draft,0,0,{load:20,minReps:8,maxReps:12,rpe:7,reason:''});
 assert.equal(training.adapt(draft,0,0,{load:30,minReps:8,maxReps:12,rpe:7,reason:''}),true);
 assert.equal(Object.keys(draft.adaptations).length,0);assert.equal(draft.results[0][1].load,30);
});

test('history uses latest completed matching exercise, excludes drafts, future records and other movements',()=>{
 const {training,draft,state}=app();
 state.trainingDrafts.unfinished={...completed(draft),date:'2026-11-01'};
 state.completedSessions=[completed(draft),completed(draft,{id:'draft',status:'draft',completedAt:'2026-11-01T12:00:00Z'}),completed(draft,{id:'future',date:'2026-11-03',completedAt:'2026-11-03T12:00:00Z'}),completed(draft,{id:'other',completedAt:'2026-11-01T12:00:00Z',session:{exercises:[{exerciseId:'squat'}]}})];
 assert.equal(training.previousResult(draft,0).date,'2026-10-26');
 state.completedSessions.push(completed(draft,{id:'latest',date:'2026-10-30',completedAt:'2026-10-30T12:00:00Z'}));
 assert.equal(training.previousResult(draft,0).date,'2026-10-30');
});

test('history preserves set positions, accepts zero load and ignores invalid actual results',()=>{
 const {training,draft,state}=app();state.completedSessions=[completed(draft,{results:[[{load:null,reps:null},{load:0,reps:8}]]})];
 const previous=training.previousResult(draft,0);assert.equal(previous.results[0],null);assert.equal(previous.results[1].load,0);
 state.completedSessions[0].results=[[{load:-1,reps:8},{load:0,reps:0}]];assert.equal(training.previousResult(draft,0),null);
});

test('repeated exercises match a stable slot in the same workout and reject ambiguous other workouts',()=>{
 const {training,draft,state}=app();const record=completed(draft);record.session.exercises.unshift({...record.session.exercises[0],slotId:'other-slot'});record.results.unshift([{load:50,reps:5}]);state.completedSessions=[record];
 assert.equal(training.previousResult(draft,0).results[0].load,25);
 record.workoutId='other-workout';assert.equal(training.previousResult(draft,0),null);
});
