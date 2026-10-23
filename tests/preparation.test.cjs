const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');

function prototype() {
  const window = {Parcours:{state:{saved:[{id:'program',organization:'Mésocycle'}],calendar:[],trackingDefaults:{feeling:true},trainingDrafts:{}}}};
  const context = vm.createContext({window,structuredClone});
  for (const file of ['05-organisation-semaine/calendrier.js','06-configuration-seance/seance.js']) {
    vm.runInContext(fs.readFileSync(path.join(__dirname,'../prototypes/propotype 1',file),'utf8'),context);
  }
  return {editor:window.ConfigurationSeance,state:window.Parcours.state};
}
const exercise = (overrides = {}) => ({slotId:'bench',exerciseId:'couche',sets:3,minReps:8,maxReps:12,load:20,rpe:null,note:'',setting:'Banc 2',...overrides});
const session = exercises => ({name:'Haut du corps',exercises,tracking:{feeling:true}});
const plain = value => JSON.parse(JSON.stringify(value));

test('a day adaptation remains separate from the saved session until commit',() => {
  const {editor} = prototype();
  const saved = session([exercise()]);
  editor.original = editor.normalizeSession(saved);
  editor.session = structuredClone(editor.original);
  editor.session.exercises[0].load = 0;
  assert.equal(saved.exercises[0].load,20);
  assert.equal(editor.dirty(),true);
  editor.session = structuredClone(editor.original);
  assert.equal(editor.dirty(),false);
  assert.equal(saved.exercises[0].load,20);
});

test('cycle scope selects the same session in this cycle, excludes past and started dates',() => {
  const {editor,state} = prototype();
  const current = {id:'current',type:'session',sourceId:'program',cycleId:'run-1',templateDay:0,date:'2026-12-14'};
  editor.calendarId = current.id;
  state.calendar = [current,
    {...current,id:'past',date:'2026-12-07'},
    {...current,id:'future',date:'2026-12-21'},
    {...current,id:'other-day',templateDay:2,date:'2026-12-16'},
    {...current,id:'other-cycle',cycleId:'run-2',date:'2026-12-21'},
    {...current,id:'started',date:'2026-12-28'}];
  state.trainingDrafts.started = {};
  assert.deepEqual(plain(editor.futureOccurrences().map(item => item.id)),['future']);
  delete current.cycleId;
  assert.equal(editor.futureOccurrences().length,0);
});

test('a changed load preserves different future reps, notes and equipment settings',() => {
  const {editor} = prototype();
  editor.original = session([exercise()]);
  editor.session = session([exercise({load:0})]);
  const future = session([exercise({load:25,minReps:6,maxReps:10,note:'Semaine allégée',setting:'Banc 3'})]);
  editor.applyExerciseChanges(future);
  assert.deepEqual(plain(future.exercises),[exercise({load:0,minReps:6,maxReps:10,note:'Semaine allégée',setting:'Banc 3'})]);
});

test('replacing a movement resets its future slot without clearing unrelated movements',() => {
  const {editor} = prototype();
  const other = exercise({slotId:'row',exerciseId:'tirage-assis',load:40});
  editor.original = session([exercise(),other]);
  const replacement = exercise({exerciseId:'pompes',sets:null,minReps:null,maxReps:null,load:null,note:'',setting:''});
  editor.session = session([replacement,other]);
  const future = session([exercise({load:30}),other]);
  editor.applyExerciseChanges(future);
  assert.deepEqual(plain(future.exercises),[replacement,other]);
  assert.equal(editor.incomplete(future.exercises[0]),true);
});

test('removing one repeated exercise does not remove another slot for the same movement',() => {
  const {editor} = prototype();
  const second = exercise({slotId:'bench-second',load:10});
  editor.original = session([exercise(),second]);
  editor.session = session([second]);
  const future = session([exercise(),second]);
  editor.applyExerciseChanges(future);
  assert.deepEqual(plain(future.exercises),[second]);
});

test('future local replacement is preserved when only the original load was changed',() => {
  const {editor} = prototype();
  editor.original = session([exercise()]);
  editor.session = session([exercise({load:30})]);
  const future = session([exercise({exerciseId:'pompes',load:0})]);
  editor.applyExerciseChanges(future);
  assert.equal(future.exercises[0].exerciseId,'pompes');
  assert.equal(future.exercises[0].load,0);
});

test('cycle scope preserves unsaved preparation drafts on other dates',() => {
  const {editor,state} = prototype();
  const current = {id:'current',type:'session',sourceId:'program',cycleId:'cycle',templateDay:0,date:'2026-12-07'};
  editor.calendarId = current.id;
  state.calendar = [current,{...current,id:'future-draft',date:'2026-12-14'},{...current,id:'future',date:'2026-12-21'}];
  state.preparationDrafts = {'future-draft':{session:{name:'Modifications en cours'}}};
  assert.deepEqual(plain(editor.futureOccurrences().map(item => item.id)),['future']);
});

test('cycle propagation excludes occurrences with a completed execution',() => {
 const {editor,state}=prototype();const current={id:'current',type:'session',sourceId:'program',cycleId:'cycle',templateDay:0,date:'2026-12-07'};editor.calendarId=current.id;
 state.calendar=[current,{...current,id:'completed',date:'2026-12-14'},{...current,id:'future',date:'2026-12-21'}];state.completedSessions=[{executionKey:'completed'}];
 assert.deepEqual(plain(editor.futureOccurrences().map(item=>item.id)),['future']);
});
