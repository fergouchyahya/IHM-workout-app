const test=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const path=require('node:path');
const {randomUUID}=require('node:crypto');
function app(){
 const notice={textContent:'',classList:{toggle(){}},replaceChildren(){},addEventListener(){}};
 const window={};const context=vm.createContext({window,structuredClone,crypto:{randomUUID},clearTimeout(){},document:{querySelector:()=>notice,addEventListener(){}},localStorage:{getItem:()=>null,setItem(){}}});
 const read=file=>vm.runInContext(fs.readFileSync(path.join(__dirname,'../prototypes/propotype 1',file),'utf8'),context);
 read('06-configuration-seance/exercices.js');read('commun/parcours.js');read('05-organisation-semaine/calendrier.js');read('06-configuration-seance/seance.js');read('05-organisation-semaine/semaine.js');
 const p=window.Parcours;p.state.identity='audit';p.persist=()=>true;p.route=view=>{p.view=view;};p.notify=(message,undo)=>{p.message=message;p.undo=undo;};p.notifyChange=p.notify.bind(p);window.Calendrier.refresh=()=>{};
 return {p,c:window.Calendrier,e:window.ConfigurationSeance,w:window,read,context};
}
const ex=(extra={})=>({slotId:'bench',exerciseId:'couche',sets:3,minReps:8,maxReps:12,load:20,rpe:7,note:'',setting:'',...extra});
test('conflicts are grouped by date, allow multiple sessions and retain protected status',()=>{
 const {p,c}=app();p.state.calendar=[{id:'rest',date:'2026-12-07',type:'rest'},{id:'live',date:'2026-12-08',type:'session',session:{name:'A'}}];p.state.trainingDrafts.live={};
 assert.equal(c.conflictDates([{date:'2026-12-07',type:'session'}]).length,1);assert.equal(c.conflictDates([{date:'2026-12-08',type:'session'}]).length,0);const conflict=c.conflictDates([{date:'2026-12-08',type:'rest'}])[0];assert.equal(c.isLocked(conflict.existing[0]),true);
});
test('replacement snapshots only the affected contents and undo leaves unrelated entries intact',()=>{
 const {p,c}=app(),rest={id:'rest',date:'2026-12-07',type:'rest'},other={id:'other',date:'2026-12-09',type:'session'};p.state.calendar=[rest,other];const change=c.applyPlacement([{id:'new',date:rest.date,type:'session'}],new Set(),[rest]);c.undoPlacement(change.removed,change.added,'Ajout');assert.equal(p.state.calendar.length,2);p.state.calendar.push({id:'later',date:'2026-12-10',type:'session'});p.undo();assert.deepEqual(Array.from(p.state.calendar,x=>x.id).sort(),['later','other','rest']);
});
test('undo refuses to overwrite later edits or a started execution',()=>{
 const {p,c}=app();p.state.calendar=[{id:'new',date:'2026-12-07',type:'session',session:{name:'A'}}];c.undoPlacement([],['new'],'Ajout');p.state.calendar[0].session.name='Changed';assert.equal(p.undo(),false);assert.equal(p.state.calendar[0].session.name,'Changed');c.undoPlacement([],['new'],'Ajout');p.state.trainingDrafts.new={};assert.equal(p.undo(),false);assert.equal(p.state.calendar.length,1);
});
test('placement replacement cannot remove a protected execution',()=>{
 const {p,c}=app();const live={id:'live',date:'2026-12-07',type:'session'};p.state.calendar=[live];p.state.trainingDrafts.live={};assert.equal(c.applyPlacement([{id:'rest',date:live.date,type:'rest'}],new Set(),[live]),null);assert.equal(p.state.calendar[0],live);
});
test('duplicate detection matches source and date while another source and another date remain possible',()=>{
 const {p,c}=app();p.state.calendar=[{id:'a',date:'2026-12-07',type:'session',sourceId:'program'}];assert.equal(c.duplicateDates([{date:'2026-12-07',type:'session',sourceId:'program'}]).length,1);assert.equal(c.duplicateDates([{date:'2026-12-07',type:'session',sourceId:'other'}]).length,0);assert.equal(c.duplicateDates([{date:'2026-12-08',type:'session',sourceId:'program'}]).length,0);assert.equal(c.duplicateDates([{date:'2026-12-07',type:'session',sourceId:'program'}],new Set(['a'])).length,0);
});
test('discard undo restores raw input, selected slots and details without changing saved targets',()=>{
 const {p,e}=app();e.key='base:single';e.original={name:'A',exercises:[ex()]};e.session=structuredClone(e.original);e.session.exercises[0].load=25;e.rawFields={'bench:load':'25,0'};e.selectedSlots=new Set(['bench']);e.detailSlots=new Set(['bench']);e.bulkFields={sets:'4'};e.bulkOpen=true;p.view='workout';e.discard();assert.equal(e.session.exercises[0].load,20);p.undo();assert.equal(e.session.exercises[0].load,25);assert.equal(e.rawFields['bench:load'],'25,0');assert.equal(e.selectedSlots.has('bench'),true);assert.equal(e.detailSlots.has('bench'),true);assert.equal(e.bulkFields.sets,'4');assert.equal(e.original.exercises[0].load,20);
});
test('discard undo never replaces a newer preparation or started execution',()=>{
 const {p,e}=app();e.key='base:single';e.original={exercises:[ex()]};e.session=structuredClone(e.original);e.rawFields={};e.discard();p.state.preparationDrafts[e.key]={session:{name:'New'}};assert.equal(p.undo(),false);assert.equal(p.state.preparationDrafts[e.key].session.name,'New');
});
test('scope summary reports changed values without pretending unrelated targets changed',()=>{
 const {e}=app();e.original={exercises:[ex()]};e.session={exercises:[ex({load:22.5})]};const summary=Array.from(e.changeSummary());assert.equal(summary.length,1);assert.match(summary[0],/Charge.*20 → 22,5/);assert.equal(summary[0].includes('Répétitions'),false);
});
test('cycle scope excludes dates already past even when later than the occurrence being edited',()=>{
 const {p,c,e}=app();c.today=()=> '2026-12-15';const current={id:'current',type:'session',sourceId:'program',cycleId:'cycle',templateDay:0,date:'2026-12-01'};e.calendarId='current';p.state.saved=[{id:'program',organization:'Mésocycle'}];p.state.calendar=[current,{...current,id:'past',date:'2026-12-08'},{...current,id:'future',date:'2026-12-22'}];assert.deepEqual(Array.from(e.futureOccurrences(),x=>x.id),['future']);
});
test('restored preparation uses its own draft and rejects another identity',()=>{
 const {p,e}=app();p.state.saved=[{id:'base',name:'Base',exercises:[ex()]}];p.state.preparationDrafts['base:single']={session:{name:'Draft',exercises:[ex({load:25})]},rawFields:{'bench:load':'25,0'},selectedSlots:['bench']};const location={view:'workout',identity:'audit',baseId:'base',dayIndex:null,key:'base:single',stage:'edit'};assert.equal(p.restoreLocation({...location,identity:'someone-else'}),false);assert.equal(p.restoreLocation(location),true);assert.equal(e.session.name,'Draft');assert.equal(e.rawFields['bench:load'],'25,0');assert.equal(e.selectedSlots.has('bench'),true);assert.equal(e.target.exercises[0].load,20);
 assert.equal(p.restoreLocation({...location,calendarId:'removed-occurrence'}),false);assert.equal(e.target.exercises[0].load,20);
 p.state.saved.push({id:'week',days:[{type:'rest'}]});assert.equal(p.restoreLocation({...location,baseId:'week',dayIndex:0}),false);
});
