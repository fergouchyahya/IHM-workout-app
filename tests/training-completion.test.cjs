const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const {randomUUID}=require('node:crypto');
function app(){
 const window={Parcours:{state:{trainingDrafts:{},completedSessions:[],calendar:[]},persist:()=>true}};
 const ctx=vm.createContext({window,structuredClone,crypto:{randomUUID}});
 for(const file of ['enrichissement.js','entrainement.js','bilan.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'../prototypes/propotype 1/08-entrainement',file),'utf8'),ctx);
 const draft={session:{name:'Séance',exercises:[{exerciseId:'bench',slotId:'bench',sets:4,load:30,minReps:8,maxReps:12,rpe:7}]},workoutId:'program',date:'2026-10-21',results:[[{load:20,reps:8,rpe:7},{load:15,reps:3,rpe:8,outcome:'interrupted'},{load:20,reps:8,rpe:null,outcome:'skipped'},{load:null,reps:null,rpe:null}]],rawFields:{'0:2:load':'-1'},invalidFields:{'0:2:load':'Old skipped value'},adaptations:{'0:0':{load:20,minReps:8,maxReps:12,rpe:7,reason:'Fatigue'}},enrichment:{context:{sleepHours:7},errors:{},exercises:{bench:{note:'Note privée',setting:'Banc 3',reminder:'À revoir',media:[{id:'media-id',row:0}]}}},completion:{feeling:'Bien',note:'Bilan personnel',reminder:'Vérifier le banc'}};
 window.Entrainement.initialize(draft);window.Parcours.state.trainingDrafts.date=draft;return {b:window.BilanSeance,t:window.Entrainement,p:window.Parcours,w:window,draft};
}
test('review counts preserve realized, interrupted, skipped, unknown and adapted distinctions',()=>{
 const {b,draft}=app(),c=b.counts(draft);assert.equal(c.completed,1);assert.equal(c.interrupted,1);assert.equal(c.skipped,1);assert.equal(c.pending,1);assert.equal(c.adapted,1);assert.equal(c.invalid,0);assert.equal(b.issues(draft).length,0);
});
test('completion preserves an independent original/adapted/actual/context/media snapshot and clears only its draft',()=>{
 const {b,p,draft}=app();p.state.trainingDrafts.other={keep:true};const record=b.finish('date').record;
 assert.equal(record.status,'completed');assert.equal(record.executionKey,'date');assert.equal(p.state.trainingDrafts.date,undefined);assert.equal(p.state.trainingDrafts.other.keep,true);assert.equal(record.session.exercises[0].load,30);assert.equal(record.adaptations['0:0'].load,20);assert.equal(record.results[0][0].load,20);assert.equal(record.enrichment.exercises.bench.media[0].id,'media-id');
 draft.results[0][0].load=99;draft.enrichment.exercises.bench.note='Changed';assert.equal(record.results[0][0].load,20);assert.equal(record.enrichment.exercises.bench.note,'Note privée');assert.equal(record.activeSets,undefined);
});
test('unknown sets stay unknown, skipped raw values are archived without becoming actual performances',()=>{
 const {b}=app(),record=b.finish('date').record;assert.equal(record.results[0][3].outcome,undefined);assert.equal(record.results[0][3].load,null);assert.equal(record.results[0][2].outcome,'skipped');assert.equal(record.rawFields['0:2:load'],'-1');assert.equal(b.counts(record).pending,1);
});
test('active numeric and context errors block completion without discarding drafts',()=>{
 const {b,p,draft}=app();draft.invalidFields['0:0:load']='Bad load';assert.ok(b.finish('date').error);delete draft.invalidFields['0:0:load'];draft.enrichment.errors.sleepHours='Bad sleep';assert.ok(b.finish('date').error);assert.equal(p.state.completedSessions.length,0);assert.equal(p.state.trainingDrafts.date,draft);
});
test('failed storage rolls back the completion and keeps all data for retry',()=>{
 const {b,p,draft}=app();p.state.completedSessions=[{id:'existing'}];p.persist=()=>false;const result=b.finish('date');assert.ok(result.error);assert.equal(p.state.trainingDrafts.date,draft);assert.equal(p.state.completedSessions.length,1);assert.equal(p.state.completedSessions[0].id,'existing');p.persist=()=>true;assert.ok(b.finish('date').record);assert.equal(p.state.completedSessions.length,2);
});
test('double completion is idempotent and later personal executions remain independent',()=>{
 const {b,p,draft}=app();const first=b.finish('date').record,again=b.finish('date').record;assert.equal(again.id,first.id);assert.equal(p.state.completedSessions.length,1);const next=structuredClone(draft);delete next.completionId;p.state.trainingDrafts.date=next;const second=b.finish('date').record;assert.notEqual(second.id,first.id);assert.equal(p.state.completedSessions.length,2);
});
test('media writes must finish before the execution can be archived',()=>{
 const {b,w,p}=app();w.EnrichissementSeance.pendingWrites=1;assert.ok(b.finish('date').error);assert.equal(p.state.completedSessions.length,0);w.EnrichissementSeance.pendingWrites=0;assert.ok(b.finish('date').record);
});
test('completed snapshots provide real preceding results and actual settings to a subsequent execution',()=>{
 const {b,t,draft}=app();const record=b.finish('date').record;const next=structuredClone(draft);next.startedAt=new Date(Date.parse(record.completedAt)+1).toISOString();next.date='2026-12-01';t.key='new-key';const previous=t.previousResult(next,0);assert.equal(previous.results[0].load,20);assert.equal(previous.results[1],null);assert.equal(previous.results[2],null);assert.equal(previous.setting,'Banc 3');
});
test('no completed data or missing draft yields no invented record',()=>{
 const {b,p}=app();delete p.state.trainingDrafts.date;assert.equal(b.finish('date').record,undefined);assert.equal(p.state.completedSessions.length,0);
});
