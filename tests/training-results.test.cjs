const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

function app() {
 const window={Parcours:{state:{completedSessions:[],trainingDrafts:{}}}};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../prototypes/propotype 1/08-entrainement/entrainement.js'),'utf8'),{window,structuredClone});
 const training=window.Entrainement;
 const blank=()=>({load:null,reps:null,rpe:null});
 const draft={session:{exercises:[{exerciseId:'bench',slotId:'bench',sets:2,load:30,minReps:8,maxReps:12,rpe:7},{exerciseId:'curl',sets:1}]},date:'2026-11-02',startedAt:'2026-11-02T12:00:00Z',workoutId:'program',exerciseIndex:0,results:[[blank(),blank()],[blank()]]};
 training.initialize(draft);return {training,draft,state:window.Parcours.state};
}

test('ordinary input completes only the concerned set, zero kg is valid and blank stays unknown',()=>{
 const {training:t,draft:d}=app();const initial=JSON.stringify(d.session),other=JSON.stringify(d.results[1]);
 assert.equal(t.resultState(d.results[0][0]).code,'pending');
 t.writeResult(d,0,0,'load',0);assert.equal(t.resultState(d.results[0][0]).label,'Saisie partielle');
 t.writeResult(d,0,0,'reps',8);assert.equal(t.resultState(d.results[0][0]).code,'completed');
 assert.equal(d.results[0][1].load,null);assert.equal(JSON.stringify(d.results[1]),other);assert.equal(JSON.stringify(d.session),initial);
});

test('explicit completed/interrupted/skipped states never invent load or repetitions',()=>{
 const {training:t,draft:d}=app();
 for(const outcome of ['completed','interrupted','skipped']){
  assert.equal(t.setOutcome(d,0,0,outcome),true);assert.equal(d.results[0][0].load,null);assert.equal(d.results[0][0].reps,null);assert.equal(t.resultState(d.results[0][0]).code,outcome);
 }
 t.setOutcome(d,0,0,null);assert.equal(t.resultState(d.results[0][0]).code,'pending');
});

test('zero repetitions are stored as attempted effort but never automatically completed',()=>{
 const {training:t,draft:d}=app();t.writeResult(d,0,0,'load',20);t.writeResult(d,0,0,'reps',0);
 assert.equal(t.resultState(d.results[0][0]).code,'pending');t.setOutcome(d,0,0,'interrupted');assert.equal(t.resultState(d.results[0][0]).code,'interrupted');assert.equal(d.results[0][0].reps,0);
});

test('skipping retains values and raw errors, blocks edits, and resuming restores correction',()=>{
 const {training:t,draft:d}=app();t.writeResult(d,0,0,'load',20);d.rawFields['0:0:load']='-2';d.invalidFields['0:0:load']='Invalid';
 t.setOutcome(d,0,0,'skipped');assert.equal(t.writeResult(d,0,0,'load',99),false);assert.equal(d.results[0][0].load,20);assert.equal(t.invalidEntries(d).length,0);
 t.setOutcome(d,0,0,null);assert.equal(t.invalidEntries(d).length,1);assert.equal(d.rawFields['0:0:load'],'-2');assert.equal(t.resultState(d.results[0][0],true).code,'invalid');
});

test('invalid correction never overwrites the last valid result or other fields',()=>{
 const {training:t,draft:d}=app();t.writeResult(d,0,0,'load',22.5);t.writeResult(d,0,0,'reps',8);
 for(const [key,value] of [['load',-1],['reps',2.5],['reps',-1],['rpe',11],['rpe',7.3],['feeling','unknown']]) assert.equal(t.writeResult(d,0,0,key,value),false);
 assert.equal(d.results[0][0].load,22.5);assert.equal(d.results[0][0].reps,8);
 assert.equal(t.writeResult(d,0,0,'rpe',7.5),true);assert.equal(t.writeResult(d,0,0,'feeling','Difficile'),true);
 t.writeResult(d,0,0,'load',null);assert.equal(t.resultState(d.results[0][0]).code,'pending');
});

test('repeat copies actual values only, preserves target and row-specific context, rejects special cases',()=>{
 const {training:t,draft:d}=app();Object.assign(d.results[0][0],{load:0,reps:8,rpe:7,feeling:'Modéré',adapted:true,outcomeReason:'source'});
 d.results[0][1].outcomeReason='destination';const target=JSON.stringify(t.target(d,0,1));
 assert.equal(t.repeatResult(d,0,1),true);assert.equal(d.results[0][1].load,0);assert.equal(d.results[0][1].adapted,undefined);assert.equal(d.results[0][1].outcomeReason,'destination');assert.equal(JSON.stringify(t.target(d,0,1)),target);
 for(const outcome of ['interrupted','skipped']){d.results[0][0].outcome=outcome;assert.equal(t.repeatResult(d,0,1),false);}
 d.results[0][0].outcome=null;d.invalidFields['0:0:load']='Invalid';assert.equal(t.repeatResult(d,0,1),false);
});

test('undo restores result, raw strings and errors for one set without losing other corrections',()=>{
 const {training:t,draft:d}=app();Object.assign(d.results[0][0],{load:20,reps:8});d.rawFields['0:1:load']='-1';d.invalidFields['0:1:load']='Invalid';d.results[0][1].load=12;
 const snapshot=t.resultSnapshot(d,0,1);assert.equal(t.repeatResult(d,0,1),true);t.writeResult(d,1,0,'load',15);t.restoreResult(d,0,1,snapshot);
 assert.equal(d.results[0][1].load,12);assert.equal(d.rawFields['0:1:load'],'-1');assert.equal(d.invalidFields['0:1:load'],'Invalid');assert.equal(d.results[1][0].load,15);
});

test('skipped and interrupted actual values do not become the previous completed reference',()=>{
 const {training:t,draft:d,state}=app();t.key='today';state.completedSessions=[{id:'past',workoutId:'program',status:'completed',date:'2026-10-26',completedAt:'2026-10-26T12:00:00Z',session:structuredClone(d.session),results:[[{load:20,reps:8,outcome:'skipped'},{load:10,reps:3,outcome:'interrupted'}],[]]}];
 assert.equal(t.previousResult(d,0),null);state.completedSessions[0].results[0][0].outcome='completed';assert.equal(t.previousResult(d,0).results[0].load,20);
});
