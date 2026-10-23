const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const {randomUUID} = require('node:crypto');
function app() {
 const messages=[],records=new Map();
 const window={Parcours:{profiles:{},state:{identity:'audit',calendar:[],saved:[],trainingDrafts:{},completedSessions:[],sharingDrafts:{}},persist:()=>true,notify:message=>messages.push(message),route(){}}};
 const context=vm.createContext({window,structuredClone,crypto:{randomUUID},localStorage:{getItem:key=>records.get(key)||null,setItem:(key,value)=>records.set(key,value)},document:{querySelector:()=>({checked:true})}});
 const read=file=>vm.runInContext(fs.readFileSync(path.join(__dirname,'../prototypes/propotype 1',file),'utf8'),context);
 read('06-configuration-seance/exercices.js');read('05-organisation-semaine/calendrier.js');read('06-configuration-seance/seance.js');read('03-decouverte/programmes.js');read('07-partages/partages.js');
 window.Parcours.storageStatus=message=>messages.push(message);
 return {w:window,p:window.Parcours,c:window.Calendrier,s:window.Partages,editor:window.ConfigurationSeance,messages,records};
}
test('started and completed calendar occurrences cannot be moved, ordinary plans remain editable',()=>{
 const {p,c}=app();const ongoing={id:'live',date:'2026-10-21'},done={id:'done',date:'2026-10-20'},planned={id:'next',date:'2026-10-22'};
 p.state.calendar=[ongoing,done,planned];p.state.trainingDrafts.live={results:[[{}]]};p.state.completedSessions=[{executionKey:'done'}];
 assert.equal(c.canChange([planned]),true);assert.equal(c.canChange([planned,done]),false);c.moveTo('live','2026-11-01');c.moveTo('done','2026-11-02');assert.equal(ongoing.date,'2026-10-21');assert.equal(done.date,'2026-10-20');assert.equal(p.state.trainingDrafts.live.results.length,1);
});
test('opening a protected occurrence goes directly to its execution or frozen summary',()=>{
 const {p,c,w}=app();const opened=[];w.Entrainement={resume:key=>opened.push('resume:'+key)};w.BilanSeance={open:id=>opened.push('summary:'+id)};
 p.state.calendar=[{id:'live',type:'session',date:'2026-10-21'},{id:'done',type:'session',date:'2026-10-20'}];p.state.trainingDrafts.live={};p.state.completedSessions=[{id:'receipt',executionKey:'done'}];c.open('live');c.open('done');assert.deepEqual(opened,['resume:live','summary:receipt']);
});
test('preparation cannot overwrite the targets of an execution already begun',()=>{
 const {p,editor}=app();const entry={id:'live',session:{load:20}};p.state.calendar=[entry];p.state.trainingDrafts.live={};editor.calendarId='live';editor.target=entry.session;editor.session={load:99};editor.commit('day','overview');assert.equal(entry.session.load,20);
});
test('multiple exercises keep order, independent slots and blank targets without altering existing exercises',()=>{
 const {editor}=app();editor.session={exercises:[{exerciseId:'curl',slotId:'kept',load:15}]};assert.equal(editor.addExercises(['couche','curl','unknown']),2);const added=editor.session.exercises.slice(1);assert.deepEqual(Array.from(added,x=>x.exerciseId),['couche','curl']);assert.notEqual(added[0].slotId,added[1].slotId);assert.equal(added[0].load,null);assert.equal(added[1].sets,null);added[0].load=25;assert.equal(added[1].load,null);assert.equal(editor.session.exercises[0].load,15);
});
function shareFixture() {
 const a=app();a.s.source={id:'source',name:'Séance',organization:'Séance seule',exercises:[{exerciseId:'couche',sets:3,minReps:8,maxReps:12}]};a.s.draft={title:'Titre',level:'Débutant',description:'Description',visibility:'public'};a.s.stage='preview';a.p.state.sharingDrafts['new:source']={sourceId:'source',fields:{...a.s.draft}};return a;
}
test('failed publication preserves its draft and never announces success, retry produces one publication',()=>{
 const {s,p,messages}=shareFixture();p.persist=()=>false;s.publish();assert.equal(s.data.items.length,0);assert.equal(s.stage,'preview');assert.equal(p.state.sharingDrafts['new:source'].fields.title,'Titre');assert.equal(messages.some(x=>x==='Publication confirmée dans cette démonstration.'),false);p.persist=()=>true;s.publish();assert.equal(s.data.items.length,1);assert.equal(p.state.sharingDrafts['new:source'],undefined);
});
test('failed publication edit restores the old publication and keeps the new fields for retry',()=>{
 const {s,p}=shareFixture();s.data.items=[{id:'published',title:'Ancien',visibility:'contacts'}];s.activeId='published';s.editing=true;p.state.sharingDrafts['edit:published']={fields:{...s.draft}};p.persist=()=>false;s.saveEdit();assert.equal(s.active().title,'Ancien');assert.equal(s.active().visibility,'contacts');assert.equal(p.state.sharingDrafts['edit:published'].fields.title,'Titre');assert.equal(s.editing,true);p.persist=()=>true;s.saveEdit();assert.equal(s.active().title,'Titre');assert.equal(p.state.sharingDrafts['edit:published'],undefined);
});
