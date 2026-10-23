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
 for(const file of ['commun/ergonomie.js','06-configuration-seance/exercices.js','commun/parcours.js','05-organisation-semaine/calendrier.js','05-organisation-semaine/semaine.js','06-configuration-seance/seance.js','04-mes-entrainements/gabarits.js','04-mes-entrainements/entrainements.js','08-entrainement/enrichissement.js','08-entrainement/entrainement.js','08-entrainement/bilan.js','03-decouverte/seances.js','03-decouverte/programmes.js','03-decouverte/decouverte.js','07-partages/partages.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'../prototypes/propotype 1',file),'utf8'),context);
 const p=window.Parcours;p.state.identity='lot4';p.view='mine';p.persist=()=>true;p.route=view=>{p.view=view;};p.notify=(message,undo)=>{p.message=message;p.undo=undo;};p.notifyChange=p.notify.bind(p);
 const draft={session:{name:'A',exercises:[{exerciseId:'couche',slotId:'bench',sets:3,load:20,minReps:8,maxReps:12,setting:'Banc 2'}],tracking:{}},exerciseIndex:0,results:[[{load:null,reps:null},{load:null,reps:null},{load:null,reps:null}]]};window.Entrainement.key='execution';window.Entrainement.initialize(draft);p.state.trainingDrafts.execution=draft;
 return {w:window,p,draft,e:window.EnrichissementSeance,t:window.Entrainement,b:window.BilanSeance,s:window.Semaine,share:window.Partages};
}
test('favorites cover both libraries while preserving separate saved and planned contents',()=>{
 const {p,w}=app();p.state.source='starter';p.state.favorites=['fullbody','community-body'];p.state.ui.favoritesOnly=true;assert.deepEqual(Array.from(w.Decouverte.filtered(),x=>x.id).sort(),['community-body','fullbody']);assert.equal(w.Programmes.filtered().length,0);assert.equal(p.state.saved.length,0);assert.equal(p.state.calendar.length,0);
});
test('favorites still respect deliberately chosen filters',()=>{
 const {p,w}=app();p.state.favorites=['fullbody','community-body'];p.state.ui.favoritesOnly=true;p.state.filters={equipment:'Sans matériel'};assert.deepEqual(Array.from(w.Decouverte.filtered(),x=>x.id),['community-body']);p.state.ui.favoritesOnly=false;p.state.source='starter';assert.equal(w.Decouverte.filtered().some(x=>x.id==='bodyweight'),true);
});
test('consulting an empty calendar day never opens an add panel',()=>{
 const {w}=app(),c=w.Calendrier;let opened=false;c.choose=()=>{opened=true;};c.refresh=()=>{};const target={closest:selector=>selector==='[data-date]'?{dataset:{date:'2027-03-15'}}:null};assert.equal(c.click({target}),true);assert.equal(c.selected,'2027-03-15');assert.equal(opened,false);
});
test('load-only copy preserves actual repetitions, effort, status and unrelated raw errors',()=>{
 const {t,draft:d}=app();d.results[0][0]={load:0,reps:8,rpe:7};d.results[0][1]={load:null,reps:5,rpe:9,outcome:'interrupted',outcomeReason:'Arrêt'};d.rawFields={'0:1:load':'bad','0:1:reps':'5'};d.invalidFields={'0:1:load':'Charge invalide','0:1:rpe':'Effort invalide'};assert.equal(t.repeatLoad(d,0,1),true);assert.equal(d.results[0][1].load,0);assert.equal(d.results[0][1].reps,5);assert.equal(d.results[0][1].rpe,9);assert.equal(d.results[0][1].outcome,'interrupted');assert.equal(d.rawFields['0:1:reps'],'5');assert.equal(d.invalidFields['0:1:rpe'],'Effort invalide');assert.equal(d.invalidFields['0:1:load'],undefined);
});
test('load-only copy does not complete an empty series and refuses skipped or invalid source loads',()=>{
 const {t,draft:d}=app();d.results[0][0].load=20;assert.equal(t.repeatLoad(d,0,1),true);assert.equal(t.resultState(d.results[0][1]).code,'pending');assert.equal(d.results[0][1].reps,null);d.invalidFields['0:0:load']='Charge invalide';assert.equal(t.repeatLoad(d,0,1),false);delete d.invalidFields['0:0:load'];d.results[0][0].outcome='skipped';assert.equal(t.repeatLoad(d,0,1),false);
});
test('rest timer pauses and resumes from elapsed wall time without changing results',()=>{
 const {t,draft:d}=app(),before=JSON.stringify(d.results);assert.equal(t.restAction(d,'duration',60,1000),true);assert.equal(t.restAction(d,'start',null,1000),true);assert.equal(t.restRemaining(d,11000),50000);t.restAction(d,'pause',null,11000);assert.equal(t.restRemaining(d,21000),50000);t.restAction(d,'start',null,21000);assert.equal(t.restRemaining(d,31000),40000);assert.equal(JSON.stringify(d.results),before);
});
test('rest timer bounds, expiry, reset and close are explicit and never create a result',()=>{
 const {t,draft:d,p}=app();assert.equal(t.restAction(d,'duration',4),false);assert.equal(t.restAction(d,'duration',3601),false);t.restAction(d,'duration',30,1000);assert.equal(p.state.ui.restSeconds,30);t.restAction(d,'start',null,1000);assert.equal(t.restAction(d,'duration',60,2000),false);assert.equal(t.restRemaining(d,32000),0);t.restAction(d,'expire',null,32000);assert.equal(d.restTimer.endAt,null);t.restAction(d,'reset',null,32000);assert.equal(t.restRemaining(d,32000),30000);t.restAction(d,'close');assert.equal(d.restTimer,undefined);assert.equal(d.results[0][0].load,null);
});
test('archive excludes timer and inline editor state while keeping real results',()=>{
 const {t,b,draft:d}=app();t.restAction(d,'start',null,1000);d.reviewEditors={'0:0':true};d.reviewReturn={index:0,row:0,scroll:400};const record=b.finish('execution').record;assert.equal(record.restTimer,undefined);assert.equal(record.reviewEditors,undefined);assert.equal(record.reviewReturn,undefined);assert.equal(record.results[0][0].load,null);
});
test('history filters names and orders actual dates while leaving archives unchanged',()=>{
 const {b,p}=app();p.state.completedSessions=[{id:'b',date:'2026-10-20',session:{name:'Jambes'}},{id:'a',date:'2026-10-22',session:{name:'Haut du corps'}},{id:'c',date:'2026-10-21',session:{name:'Haut du corps'}}];const before=JSON.stringify(p.state.completedSessions);p.state.ui.historySearch='HAUT';assert.deepEqual(Array.from(b.filteredHistory(),x=>x.id),['a','c']);p.state.ui.historyOrder='asc';assert.deepEqual(Array.from(b.filteredHistory(),x=>x.id),['c','a']);assert.equal(JSON.stringify(p.state.completedSessions),before);
});
test('history navigation restores its query and date order for the same profile',()=>{
 const {p}=app();assert.equal(p.restoreLocation({view:'progress',identity:'lot4',historySearch:'Jambes',historyOrder:'asc'}),true);assert.equal(p.state.ui.historySearch,'Jambes');assert.equal(p.state.ui.historyOrder,'asc');assert.equal(p.restoreLocation({view:'progress',identity:'another',historySearch:'Other'}),false);assert.equal(p.state.ui.historySearch,'Jambes');
});
test('publication refuses a direct action before preview and needs no redundant checkbox after preview',()=>{
 const {share,p}=app();share.source={id:'source',name:'A',organization:'Séance seule',exercises:[{exerciseId:'couche'}]};share.draft={title:'Titre',level:'Débutant',description:'',visibility:'contacts'};share.stage='form';share.publish();assert.equal(share.data.items.length,0);assert.match(p.message,/aperçu/);share.stage='preview';share.publish();assert.equal(share.data.items.length,1);assert.equal(share.data.items[0].visibility,'contacts');
});
test('inline editing is only offered for a pending review, never on an archived summary',()=>{
 const {b,draft:d,p}=app();const review=b.renderReview();assert.match(review,/data-review-inline="0:0"/);assert.match(review,/data-review-editor="0:0"/);const record=b.finish('execution').record;b.activeId=record.id;const summary=b.renderSummary();assert.equal(summary.includes('data-review-inline'),false);assert.equal(summary.includes('data-review-value'),false);assert.equal(p.state.trainingDrafts.execution,undefined);
});
