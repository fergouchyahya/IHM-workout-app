const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const {randomUUID} = require('node:crypto');
function record(id,date,load = 20,reps = 8) {
  return {id,date,completedAt:`${date}T12:00:00Z`,status:'completed',workoutId:'workout',session:{name:'Jambes',exercises:[{exerciseId:'squat',slotId:'squat-1',equipment:'Barre',name:'Squat'}]},results:[[{load,reps,rpe:7}]],enrichment:{exercises:{}},adaptations:{}};
}
function app(records = []) {
  const window = {Parcours:{state:{ui:{},completedSessions:records,reviewPoints:[]},persist:() => true,escape:value => String(value ?? '').replaceAll('<','&lt;'),isBeginner:() => false},Ergonomie:{normalize:value => String(value).toLowerCase().trim(),formatNumber:String,count:(value,label) => `${value} ${label}`},catalogueExercices:[]};
  const context = vm.createContext({window,structuredClone,crypto:{randomUUID}});
  for (const file of ['08-entrainement/entrainement.js','08-entrainement/bilan.js','09-analyse/analyse.js']) vm.runInContext(fs.readFileSync(path.join(__dirname,'../prototypes/propotype 1',file),'utf8'),context);
  return {w:window,a:window.AnalyseResultats};
}
test('first performance establishes no progress or record; later equal-rep load gain names its measure',() => {
  const first = record('first','2026-10-01'), next = record('next','2026-10-08',25);
  const {a} = app([next,first]);
  assert.equal(a.records(first,0).length,0);
  assert.match(a.render(first),/aucune progression déduite/);
  assert.equal(a.records(next,0)[0].previous,20);
  assert.equal(a.compare(next,0,first,0)[0].load,5);
  next.results[0][0].reps = 6;
  assert.equal(a.records(next,0).length,0);
  assert.match(a.compare(next,0,first,0)[0].conclusion,/mixte/);
});
test('omissions, interrupted, skipped, adapted and invalid series never enter progress or records',() => {
  const first = record('first','2026-10-01'), next = record('next','2026-10-08',25);
  const {a} = app([next,first]);
  for (const change of [{load:null},{reps:0},{load:-1},{load:Infinity},{reps:1.5},{outcome:'skipped'},{outcome:'interrupted'},{adapted:true}]) {
    next.results[0][0] = {load:25,reps:8,...change};
    assert.equal(a.compare(next,0,first,0).length,0);
    assert.equal(a.records(next,0).length,0);
  }
  next.results[0][0] = {load:25,reps:8}; next.invalidFields = {'0:0:load':'invalid'};
  assert.equal(a.records(next,0).length,0);
  delete next.invalidFields; next.adaptations = {'0:0':{load:25}};
  assert.equal(a.records(next,0).length,0);
});
test('zero added load is a valid result and missing RPE stays absent',() => {
  const first = record('first','2026-10-01',0), next = record('next','2026-10-08',0,10);
  const {a} = app([next,first]); next.results[0][0].rpe = null;
  assert.equal(a.compare(next,0,first,0)[0].reps,2);
  assert.equal(a.compare(next,0,first,0)[0].rpe,null);
});
test('equipment, settings and ambiguous duplicates block automatic comparisons',() => {
  const first = record('first','2026-10-01'), next = record('next','2026-10-08',25);
  const {a} = app([next,first]);
  first.session.exercises[0].equipment = 'Machine'; assert.equal(a.compare(next,0,first,0).length,0);
  first.session.exercises[0].equipment = ''; assert.equal(a.records(next,0).length,0);
  first.session.exercises[0].equipment = 'Barre'; first.enrichment.exercises['squat-1'] = {setting:'Banc 3'};
  assert.equal(a.records(next,0).length,0);
  first.session.exercises.push({...first.session.exercises[0],slotId:'squat-2'});
  assert.equal(a.match(first,next,0).index,0);
  first.workoutId = 'different'; assert.equal(a.match(first,next,0),null);
});
test('period, chronology and uncompleted sessions filter history without changing archives',() => {
  const first = record('first','2026-10-01'), next = record('next','2026-10-08'), future = record('future','2026-10-09'), draft = record('draft','2026-10-02'); draft.status = 'ongoing';
  const records = [future,next,draft,first], snapshot = JSON.stringify(records), {a} = app(records);
  assert.equal(a.history(next,0).length,2);
  assert.equal(a.history(next,0,'2026-10-05').length,1);
  assert.equal(a.history(next,0,'2026-10-09','2026-10-01').length,0);
  assert.equal(JSON.stringify(records),snapshot);
});
test('point flows to the T1 workout and failed storage preserves draft text and previous points',() => {
  const current = record('today','2026-10-08'), {a,w} = app([current]);
  assert.ok(a.savePoint(current,0,'').error);
  const point = a.savePoint(current,0,'Revoir le réglage').point;
  assert.equal(point.workoutId,'workout'); assert.equal(point.exerciseId,'squat');
  a.savePoint(current,0,'Vérifier le réglage'); assert.equal(w.Parcours.state.reviewPoints.length,1);
  w.Parcours.state.ui.analysis = {[current.id]:{text:'Mon texte'}};
  w.Parcours.persist = () => false;
  assert.ok(a.savePoint(current,0,'Nouvelle interprétation').error);
  assert.equal(w.Parcours.state.reviewPoints[0].text,'Vérifier le réglage');
  assert.equal(w.Parcours.state.ui.analysis[current.id].text,'Mon texte');
  assert.equal(current.results[0][0].load,20);
});
test('beginner analysis hides RPE without discarding it and escapes personal interpretation',() => {
  const first = record('first','2026-10-01'), next = record('next','2026-10-08',25), {a,w} = app([next,first]);
  w.Parcours.isBeginner = () => true;
  a.selection(next).text = '<script>private</script>';
  assert.doesNotMatch(a.render(next),/RPE|<script>/);
  assert.match(a.render(next),/&lt;script>/);
  assert.equal(next.results[0][0].rpe,7);
});

test('exercise switches preserve independent drafts and references, including duplicate movements and reload',() => {
  const current=record('today','2026-10-23'),{a,w}=app([current]);
  current.session.exercises.push({...current.session.exercises[0],slotId:'squat-2'}); current.results.push([{load:10,reps:8}]);
  a.selection(current).text='First draft'; a.selection(current).referenceId='first-reference';
  a.switchExercise(current,1); assert.equal(a.selection(current).text,'');
  a.selection(current).text='Second draft'; a.switchExercise(current,0);
  assert.equal(a.selection(current).text,'First draft'); assert.equal(a.selection(current).referenceId,'first-reference');
  w.Parcours.state.ui=JSON.parse(JSON.stringify(w.Parcours.state.ui)); a.switchExercise(current,1);
  assert.equal(a.selection(current).text,'Second draft');
});
test('automatic reference skips empty recent results while explicit inspection remains available',() => {
  const current=record('today','2026-10-23',25),empty=record('empty','2026-10-22',null,null),older=record('older','2026-10-20'),{a}=app([current,empty,older]);
  const previous=a.history(current,0).filter(item=>item.record.id!==current.id);
  assert.equal(a.reference(current,0,previous,'').record.id,'older');
  assert.equal(a.reference(current,0,previous,'empty').record.id,'empty');
  assert.ok(a.render(current).indexOf('Cette séance :')<a.render(current).indexOf('Pourquoi cette comparaison'));
});
test('period presets anchor to the archived date and invalid custom dates preserve the applied comparison',() => {
  const current=record('today','2026-03-01'),{a}=app([current]);
  a.setPeriod(current,'4'); assert.equal(a.selection(current).start,'2026-02-02');
  assert.equal(a.applyPeriod(current,'2026-03-02','2026-03-01'),false);
  assert.equal(a.selection(current).start,'2026-02-02'); assert.match(a.selection(current).periodError,/non appliquée/);
  assert.equal(a.applyPeriod(current,'2026-02-30','2026-03-01'),false);
  assert.equal(a.applyPeriod(current,'2026-02-01','2026-03-01'),true);
  assert.equal(a.selection(current).periodError,''); a.setPeriod(current,'all'); assert.equal(a.selection(current).start,'');
});
test('saved points reappear for editing and resolution can be undone without changing targets',() => {
  const current=record('today','2026-10-23'),{a,w}=app([current]); const snapshot=JSON.stringify(current);
  const point=a.savePoint(current,0,'Review setting').point;
  delete w.Parcours.state.ui.analysis;
  assert.equal(a.selection(current).text,'Review setting');
  a.updatePoint(point.id,{text:'Updated setting'}); assert.equal(a.selection(current).text,'Updated setting');
  let undo; w.Parcours.notify=(message,callback)=>{if(callback)undo=callback;};
  a.resolvePoint(point.id,()=>{}); assert.ok(w.Parcours.state.reviewPoints[0].resolvedAt);
  assert.equal(undo(),true); assert.equal(w.Parcours.state.reviewPoints[0].resolvedAt,null);
  a.resolvePoint(point.id,()=>{}); const previousUndo=undo;
  a.updatePoint(point.id,{text:'Later correction'}); assert.equal(previousUndo(),false);
  assert.equal(w.Parcours.state.reviewPoints[0].text,'Later correction'); assert.equal(JSON.stringify(current),snapshot);
});
test('failed point edits or resolution preserve the previous point and unsubmitted interpretation',() => {
  const current=record('today','2026-10-23'),{a,w}=app([current]);
  const point=a.savePoint(current,0,'Saved').point; a.selection(current).text='My unsent draft';
  w.Parcours.persist=()=>false;
  assert.ok(a.updatePoint(point.id,{text:'Replacement'}).error);
  assert.equal(w.Parcours.state.reviewPoints[0].text,'Saved'); assert.equal(a.selection(current).text,'My unsent draft');
  assert.ok(a.updatePoint(point.id,{resolvedAt:'now'}).error); assert.equal(w.Parcours.state.reviewPoints[0].resolvedAt,null);
});

test('point and matching editor copies are persisted together, or both rolled back on failure',()=>{
  const current=record('today','2026-10-23'),{a,w}=app([current]);
  const point=a.savePoint(current,0,'Original').point;const selection=a.selection(current);
  let writes=0;w.Parcours.persist=()=>{writes++;assert.equal(selection.text,'Changed');return true;};
  assert.ok(a.updatePoint(point.id,{text:'Changed'}).point);assert.equal(writes,1);
  w.Parcours.persist=()=>false;assert.ok(a.updatePoint(point.id,{text:'Failed'}).error);
  assert.equal(selection.text,'Changed');assert.equal(w.Parcours.state.reviewPoints[0].text,'Changed');
});
