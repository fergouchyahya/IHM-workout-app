const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
function app() {
 const revoked=[], window={};
 const ctx=vm.createContext({window,structuredClone,URL:{revokeObjectURL:url=>revoked.push(url)}});
 const read=file=>vm.runInContext(fs.readFileSync(path.join(__dirname,'../prototypes/propotype 1',file),'utf8'),ctx);
 read('08-entrainement/enrichissement.js');
 const draft={session:{name:'Séance',organization:'Séance seule',exercises:[{slotId:'bench-1',exerciseId:'couche',load:20,setting:'Banc 2'},{slotId:'bench-2',exerciseId:'couche',load:10}]},results:[[{load:20,reps:8,rpe:7}],[{load:null,reps:null,rpe:null}]]};
 const e=window.EnrichissementSeance;e.initialize(draft);return {e,draft,window,read,revoked};
}
test('initialization preserves prepared targets, entered results and existing enrichment',()=>{
 const {e,draft:d}=app(),session=JSON.stringify(d.session),results=JSON.stringify(d.results);
 e.writeContext(d,'sleepHours',7.5);e.writeExercise(d,0,'note','Contrôler la descente');e.initialize(d);
 assert.equal(d.enrichment.context.sleepHours,7.5);assert.equal(e.exercise(d,0).note,'Contrôler la descente');assert.equal(JSON.stringify(d.session),session);assert.equal(JSON.stringify(d.results),results);
});
test('context is optional, bounded and never replaces a valid value on invalid input',()=>{
 const {e,draft:d}=app();assert.equal(e.writeContext(d,'sleepHours',0),true);assert.equal(e.writeContext(d,'sleepHours',24),true);
 for(const value of [-1,25,7.3,NaN])assert.equal(e.writeContext(d,'sleepHours',value),false);
 assert.equal(d.enrichment.context.sleepHours,24);assert.equal(e.writeContext(d,'sleepHours',null),true);
 assert.equal(e.writeContext(d,'fatigue','Forte'),true);assert.equal(e.writeContext(d,'pain','Aucune'),true);assert.equal(e.writeContext(d,'pain','inconnue'),false);assert.equal(e.writeContext(d,'adaptationReason','x'.repeat(501)),false);
});
test('repeated movements keep separate notes, actual settings and reminders without rewriting T1',()=>{
 const {e,draft:d}=app();e.writeExercise(d,0,'setting','Banc 3');e.writeExercise(d,1,'reminder','Comparer la prise');
 assert.equal(e.exercise(d,0).setting,'Banc 3');assert.equal(e.exercise(d,1).setting,'');assert.equal(e.exercise(d,0).reminder,'');assert.equal(d.session.exercises[0].setting,'Banc 2');assert.equal(e.writeExercise(d,0,'load','99'),false);
});
test('media validation rejects unsupported/empty/oversized files before storage and respects counts',()=>{
 const {e,draft:d}=app(),file={type:'video/mp4',size:1024};assert.equal(e.mediaIssue(d,0,file),'');
 for(const invalid of [{type:'image/svg+xml',size:100},{type:'text/html',size:10},{type:'video/mp4',size:0},{type:'video/mp4',size:21*1024*1024}])assert.notEqual(e.mediaIssue(d,0,invalid),'');
 e.exercise(d,0).media=Array.from({length:6},()=>({size:100}));assert.match(e.mediaIssue(d,0,file),/6 médias/);
 e.exercise(d,0).media=[{size:20*1024*1024}];e.exercise(d,1).media=[{size:40*1024*1024}];assert.match(e.mediaIssue(d,0,file),/60 Mo/);
});
test('media storage keys distinguish profile, execution and file even with punctuation',()=>{
 const {e}=app();assert.notEqual(e.mediaKey('alice','a:b','file'),e.mediaKey('alice:a','b','file'));assert.notEqual(e.mediaKey('alice','same','id'),e.mediaKey('bob','same','id'));assert.notEqual(e.mediaKey('alice','one','id'),e.mediaKey('alice','two','id'));
});
test('public snapshot excludes private context, notes, reminders and media references',()=>{
 const {e,draft:d,window:w,read}=app();read('06-configuration-seance/exercices.js');read('03-decouverte/programmes.js');e.writeContext(d,'adaptationReason','PRIVATE-CONTEXT');e.writeExercise(d,0,'note','PRIVATE-NOTE');e.writeExercise(d,0,'reminder','PRIVATE-REMINDER');e.exercise(d,0).media.push({id:'PRIVATE-MEDIA',size:10});
 const source={...d.session,enrichment:d.enrichment},published=JSON.stringify(w.Programmes.snapshot(source));for(const value of ['PRIVATE-CONTEXT','PRIVATE-NOTE','PRIVATE-REMINDER','PRIVATE-MEDIA'])assert.equal(published.includes(value),false);
});
test('changing views releases all media object URLs and invalidates pending previews',()=>{
 const {e,revoked}=app();const generation=e.generation;e.urls.add('blob:one');e.urls.add('blob:two');e.releaseUrls();assert.equal(e.urls.size,0);assert.equal(e.generation,generation+1);assert.deepEqual(revoked,['blob:one','blob:two']);
});

test('previous performance displays the recorded actual setting rather than only the T1 setting',()=>{
 const {draft:d,window:w,read}=app();read('08-entrainement/entrainement.js');
 w.Parcours={state:{completedSessions:[{id:'past',workoutId:'program',date:'2026-10-20',completedAt:'2026-10-20T12:00:00Z',status:'completed',session:structuredClone(d.session),results:structuredClone(d.results),enrichment:{exercises:{'bench-1':{setting:'Siège utilisé 3'}}}}]}};
 d.startedAt='2026-10-21T12:00:00Z';d.date='2026-10-21';d.workoutId='program';
 assert.equal(w.Entrainement.previousResult(d,0).setting,'Siège utilisé 3');
});
