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
 training.initialize(draft);return {window,training,draft,state:window.Parcours.state};
}

test('ordinary input completes only the concerned set, zero kg is valid and blank stays unknown',()=>{
 const {training:t,draft:d}=app();const initial=JSON.stringify(d.session),other=JSON.stringify(d.results[1]);
 assert.equal(t.resultState(d.results[0][0]).code,'pending');
 t.writeResult(d,0,0,'load',0);assert.equal(t.resultState(d.results[0][0]).label,'Saisie partielle');
 t.writeResult(d,0,0,'reps',8);assert.equal(t.resultState(d.results[0][0]).code,'completed');
 assert.equal(d.results[0][1].load,null);assert.equal(JSON.stringify(d.results[1]),other);assert.equal(JSON.stringify(d.session),initial);
});

test('stepper adjustments reject blank values, preserve other rows, and clear stale field errors',()=>{
 const {training:t,draft:d}=app(); d.rawFields['0:0:load']='7,'; d.invalidFields['0:0:load']='Valeur incomplète';
 assert.equal(t.adjustResult(d,0,0,'load',1),false); assert.equal(d.results[0][0].load,null);
 t.writeResult(d,0,0,'load',20); d.rawFields['0:0:load']='20'; d.invalidFields['0:0:load']='stale';
 assert.equal(t.adjustResult(d,0,0,'load',1),20.5); assert.equal(d.results[0][0].load,20.5); assert.equal(d.invalidFields['0:0:load'],undefined);
 d.rawFields['0:0:load']='20,'; d.invalidFields['0:0:load']='Valeur incomplète'; assert.equal(t.adjustResult(d,0,0,'load',1),false); assert.equal(d.results[0][0].load,20.5);
 d.rawFields['0:0:load']='20,5'; delete d.invalidFields['0:0:load']; assert.equal(t.adjustResult(d,0,0,'load',1),21);
 assert.equal(d.results[0][1].load,null); assert.equal(t.adjustResult(d,0,0,'reps',1),false);
});

test('stepper keeps repetitions integral and never edits skipped or unrelated fields',()=>{
 const {training:t,draft:d}=app(); t.writeResult(d,0,0,'reps',8); d.results[0][1].load=12; d.results[0][0].outcome='skipped';
 assert.equal(t.adjustResult(d,0,0,'reps',1),false); assert.equal(d.results[0][0].reps,8);
 d.results[0][0].outcome=null; assert.equal(t.adjustResult(d,0,0,'reps',1),9); assert.equal(Number.isInteger(d.results[0][0].reps),true); assert.equal(d.results[0][1].load,12);
 assert.equal(t.adjustResult(d,0,0,'rpe',1),false);
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

test('undoing a copied series restores only untouched copied fields and retains later raw corrections',()=>{
 const {training:t,draft:d}=app(); Object.assign(d.results[0][0],{load:20,reps:8,rpe:7}); Object.assign(d.results[0][1],{load:10,reps:5,rpe:6,outcomeReason:'Destination note'});
 const before=t.resultSnapshot(d,0,1); t.repeatResult(d,0,1); const copied=t.resultSnapshot(d,0,1);
 t.writeResult(d,0,1,'reps',12); d.rawFields['0:1:reps']='12'; d.rawFields['0:1:rpe']='7,';d.invalidFields['0:1:rpe']='Incomplete';
 assert.equal(t.restoreCopiedResult(d,0,1,before,copied),true);
 assert.equal(d.results[0][1].load,10);assert.equal(d.results[0][1].reps,12);assert.equal(d.results[0][1].rpe,7);
 assert.equal(d.rawFields['0:1:rpe'],'7,');assert.equal(d.invalidFields['0:1:rpe'],'Incomplete');assert.equal(d.results[0][1].outcomeReason,'Destination note');
});
test('copy undo cannot overwrite a later skipped status or a replacement execution',()=>{
 const {training:t,draft:d,state,window:w}=app();Object.assign(d.results[0][0],{load:20,reps:8});
 const before=t.resultSnapshot(d,0,1);t.repeatResult(d,0,1);const copied=t.resultSnapshot(d,0,1);
 t.setOutcome(d,0,1,'skipped');assert.equal(t.restoreCopiedResult(d,0,1,before,copied),false);assert.equal(d.results[0][1].load,20);
 t.key='execution';state.trainingDrafts.execution=d;let undo;w.Parcours.notify=(message,callback)=>{if(callback)undo=callback;};
 t.notifyCopy(d,0,1,before);state.trainingDrafts.execution=structuredClone(d);assert.equal(undo(),false);
});
test('previous-session copy uses complete comparable actual data, not targets, and preserves other context',()=>{
 const {training:t,draft:d,state,window:w}=app();state.calendar=[];
 w.Ergonomie={normalize:value=>String(value).toLowerCase().trim()};w.Calendrier={repeatGroup:()=>null};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../prototypes/propotype 1/09-analyse/analyse.js'),'utf8'),{window:w,structuredClone});
 d.session.exercises[0].equipment='Barre';d.results[0][0].outcomeReason='Private';
 const prior={id:'past',executionKey:'past',workoutId:d.workoutId,status:'completed',date:'2026-10-26',completedAt:'2026-10-26T12:00:00Z',session:structuredClone(d.session),results:[[{load:0,reps:8,rpe:7}],[]]};
 state.completedSessions=[prior];const target=JSON.stringify(d.session),other=JSON.stringify(d.results[1]);
 assert.equal(t.copyPreviousSession(d,0,0),true);assert.equal(d.results[0][0].load,0);assert.equal(d.results[0][0].reps,8);assert.equal(d.results[0][0].outcomeReason,'Private');
 assert.equal(JSON.stringify(d.session),target);assert.equal(JSON.stringify(d.results[1]),other);
 for(const change of [{outcome:'skipped'},{outcome:'interrupted'},{reps:null},{load:-1},{adapted:true},{rpe:7.3}]){
  prior.results[0][0]={load:20,reps:8,rpe:7,...change};assert.equal(t.copyPreviousSession(d,0,0),false);
 }
 prior.results[0][0]={load:20,reps:8};prior.session.exercises[0].equipment='Machine';assert.equal(t.copyPreviousSession(d,0,0),false);
 prior.session.exercises[0].equipment='Barre';prior.completedAt='2026-12-01T12:00:00Z';assert.equal(t.copyPreviousSession(d,0,0),false);
});


test('stepper preserves invalid fractional repetitions and accepts zero without crossing the lower bound',()=>{
 const {training:t,draft:d}=app(); t.writeResult(d,0,0,'reps',8);
 d.rawFields['0:0:reps']='8.5'; d.invalidFields['0:0:reps']='Entier requis';
 const before=JSON.stringify(d); assert.equal(t.adjustResult(d,0,0,'reps',1),false); assert.equal(JSON.stringify(d),before);
 d.rawFields['0:0:reps']='abc'; assert.equal(t.adjustResult(d,0,0,'reps',1),false); assert.equal(d.rawFields['0:0:reps'],'abc');
 t.writeResult(d,0,1,'load',0); assert.equal(t.adjustResult(d,0,1,'load',-1),0); assert.equal(t.adjustResult(d,0,1,'load',1),0.5);
 for(const delta of [0,2,0.5,NaN]) assert.equal(t.adjustResult(d,0,1,'load',delta),false);
});
