const test=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const path=require('node:path');
const {randomUUID}=require('node:crypto');
function app(){
 const node={textContent:'',innerHTML:'',classList:{toggle(){}},replaceChildren(){},addEventListener(){},close(){},focus(){}};
 const document={querySelector:()=>node,querySelectorAll:()=>[],addEventListener(){}};
 const window={scrollY:0};const context=vm.createContext({window,document,structuredClone,crypto:{randomUUID},clearTimeout(){},localStorage:{getItem:()=>null,setItem(){}}});
 for(const file of ['commun/ergonomie.js','commun/disponibilites.js','06-configuration-seance/exercices.js','commun/parcours.js','05-organisation-semaine/calendrier.js','05-organisation-semaine/semaine.js','06-configuration-seance/seance.js','04-mes-entrainements/gabarits.js','04-mes-entrainements/entrainements.js','08-entrainement/enrichissement.js','08-entrainement/entrainement.js','08-entrainement/bilan.js','03-decouverte/seances.js','03-decouverte/programmes.js','03-decouverte/decouverte.js','07-partages/partages.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'../prototypes/propotype 1',file),'utf8'),context);
 const p=window.Parcours;p.state.identity='lot4';p.view='mine';p.persist=()=>true;p.route=view=>{p.view=view;};p.notify=(message,undo)=>{p.message=message;p.undo=undo;};p.notifyChange=p.notify.bind(p);
 const draft={session:{name:'A',exercises:[{exerciseId:'couche',slotId:'bench',sets:3,load:20,minReps:8,maxReps:12,setting:'Banc 2'}],tracking:{}},exerciseIndex:0,results:[[{load:null,reps:null},{load:null,reps:null},{load:null,reps:null}]]};window.Entrainement.key='execution';window.Entrainement.initialize(draft);p.state.trainingDrafts.execution=draft;
 return {w:window,p,draft,e:window.EnrichissementSeance,t:window.Entrainement,b:window.BilanSeance,s:window.Semaine,share:window.Partages};
}
const exercise=(extra={})=>({slotId:'bench',exerciseId:'couche',sets:3,minReps:8,maxReps:12,load:30,rpe:8,...extra});
function repetition(p,extra={}){
 const entry={id:'current',type:'session',sourceId:'program',cycleId:'cycle',templateDay:0,date:'2026-10-19',session:{name:'A',exercises:[exercise()]},...extra};p.state.calendar=[entry];return entry;
}
function record(extra={}){return {id:'archive',executionKey:'past',repetitionKey:'cycle:0',status:'completed',date:'2026-10-12',completedAt:'2026-10-12T12:00:00Z',session:{name:'A',exercises:[exercise()]},results:[[{load:20,reps:10},{load:22.5,reps:8},{load:0,reps:12}]],...extra};}
test('repeated reference is restricted to the same cycle day, excluding unrelated sessions with the same exercise',()=>{
 const {p,t}=app(),entry=repetition(p);p.state.completedSessions=[record({id:'other-cycle',repetitionKey:'other:0',date:'2026-10-17'}),record({id:'other-day',repetitionKey:'cycle:3',date:'2026-10-16'}),record()];assert.equal(t.previousRepeatedSession(entry).id,'archive');assert.equal(t.previousRepeatedSession({...entry,cycleId:null}),null);
});
test('the previous actual session is selected by occurrence date, not late archival order, and never mixes rows from older records',()=>{
 const {p,t}=app(),entry=repetition(p);p.state.completedSessions=[record({id:'older',date:'2026-10-05',completedAt:'2026-10-18T12:00:00Z'}),record({id:'latest',results:[[{load:null,reps:null}]]})];const previous=t.previousRepeatedSession(entry);assert.equal(previous.id,'latest');assert.equal(t.repeatedExercise(previous,entry.session.exercises[0],entry.session.exercises).results.length,1);assert.equal(t.repeatedSet(previous.results[0][0]).load,null);
});
test('pending, same-date, future and post-start archives cannot become the repeated reference',()=>{
 const {p,t}=app(),entry=repetition(p);p.state.completedSessions=[record({status:'draft'}),record({date:entry.date}),record({date:'2026-10-26'}),record({completedAt:'2026-10-19T13:00:00Z'})];assert.equal(t.previousRepeatedSession(entry,'2026-10-19T12:00:00Z'),null);p.state.completedSessions.push(record());assert.equal(t.previousRepeatedSession(entry,'2026-10-19T12:00:00Z').id,'archive');
});
test('week copies find the original archive and later repetitions retain the same lineage after calendar removal',()=>{
 const {p,t}=app(),entry=repetition(p,{cycleId:null,repetitionKey:'original'});p.state.completedSessions=[record({executionKey:'original',repetitionKey:undefined})];assert.equal(t.previousRepeatedSession(entry).id,'archive');p.state.completedSessions.push(record({id:'second',executionKey:'copy-1',repetitionKey:'original',date:'2026-10-16'}));p.state.calendar=[];assert.equal(t.previousRepeatedSession(entry).id,'second');assert.equal(t.previousRepeatedSession({...entry,repetitionKey:'different-original'}),null);
});
test('legacy cycle archives resolve their lineage through their calendar occurrence',()=>{
 const {p,t}=app(),entry=repetition(p);p.state.calendar.push({...entry,id:'past',date:'2026-10-12'});p.state.completedSessions=[record({repetitionKey:undefined})];assert.equal(t.previousRepeatedSession(entry).id,'archive');
});
test('stable exercise slots preserve correct results after reorder and reject replacements, additions and ambiguous duplicates',()=>{
 const {p,t}=app(),entry=repetition(p);const previous=record({session:{exercises:[exercise({slotId:'other'}),exercise()]},results:[[{load:100,reps:1}],[{load:20,reps:8}]]});assert.equal(t.repeatedExercise(previous,entry.session.exercises[0],entry.session.exercises).results[0].load,20);assert.equal(t.repeatedExercise(previous,exercise({exerciseId:'squat'}),[exercise({exerciseId:'squat'})]),null);assert.equal(t.repeatedExercise(previous,exercise({slotId:'new'}),[exercise({slotId:'new'})]),null);assert.equal(t.repeatedExercise(previous,exercise({slotId:undefined}),[exercise({slotId:undefined})]),null);
});
test('old unique exercises without a slot remain comparable without matching a duplicate',()=>{
 const {t}=app(),previous=record({session:{exercises:[exercise({slotId:undefined})]}}),current=exercise();assert.equal(t.repeatedExercise(previous,current,[current]).results[0].load,20);assert.equal(t.repeatedExercise(previous,current,[current,exercise({slotId:'two'})]),null);
});
test('zero and partial actual values stay distinct from missing, invalid and skipped set results',()=>{
 const {t}=app();assert.equal(t.repeatedSet({load:0,reps:8}).load,0);assert.equal(t.repeatedSet({load:20,reps:null}).reps,null);assert.equal(t.repeatedSet({load:-2,reps:2.5}).load,null);assert.equal(t.repeatedSet({load:-2,reps:2.5}).reps,null);const skipped=t.repeatedSet({load:80,reps:10,outcome:'skipped'});assert.equal(skipped.load,null);assert.equal(skipped.reps,null);assert.equal(skipped.label,'Non faite');assert.equal(t.repeatedSet({load:20,reps:0,outcome:'interrupted'}).label,'Interrompue');
});
test('the per-set display is read-only, covers missing extra sets, and is absent from independent planning',()=>{
 const {p,t}=app(),entry=repetition(p);p.state.completedSessions=[record({results:[[{load:22.5,reps:8},{load:90,reps:5,outcome:'skipped'}]]})];const before=JSON.stringify(p.state);const html=t.repeatedHistoryMarkup(entry,entry.session,0);assert.match(html,/22,5 kg/);assert.match(html,/Non faite/);assert.equal(html.includes('90 kg'),false);assert.match(html,/<th scope="row">3/);assert.equal(html.includes('<input'),false);assert.equal(t.repeatedHistoryMarkup({...entry,cycleId:null},entry.session,0),'');assert.equal(JSON.stringify(p.state),before);assert.equal(t.repeatedSetMarkup(p.state.completedSessions[0],entry.session,0,2).includes('—'),true);
});
test('execution and archive preserve repetition lineage without copying previous results or exposing it in a public plan',()=>{
 const {p,t,b,w}=app(),entry=repetition(p);t.open(entry.session,entry.id,entry.date);const draft=p.state.trainingDrafts.current;assert.equal(draft.repetitionKey,'cycle:0');assert.equal(draft.results[0][0].load,null);const archived=b.finish('current').record;assert.equal(archived.repetitionKey,'cycle:0');assert.equal(w.Programmes.snapshot({...entry.session,repetitionKey:archived.repetitionKey}).repetitionKey,undefined);
});
