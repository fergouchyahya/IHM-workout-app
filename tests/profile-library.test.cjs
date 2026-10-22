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
test('unknown and beginner levels use the simple interface; RPE needs a nonbeginner level and explicit tracking',()=>{
 const {p}=app();for(const level of ['', 'Débutant']){p.state.profile.level=level;assert.equal(p.isBeginner(),true);assert.equal(p.showRpe({tracking:{rpe:true}}),false);}
 for(const level of ['Intermédiaire','Avancé']){p.state.profile.level=level;assert.equal(p.isBeginner(),false);assert.equal(p.showRpe({tracking:{rpe:true}}),true);assert.equal(p.showRpe({tracking:{}}),false);}assert.equal(p.isAdvanced(),true);
});
test('calendar and personal library render independently with a single calendar add entry',()=>{
 const {p,w}=app();p.state.saved=[{id:'personal',name:'My session',organization:'Séance seule',exercises:[]}];const calendar=w.Entrainements.render(),library=w.Entrainements.renderLibrary();assert.equal(calendar.includes('saved-workout-search'),false);assert.equal(calendar.includes('create-workout'),false);assert.equal(calendar.includes('day-add'),false);assert.equal((calendar.match(/id="calendar-add"/g)||[]).length,1);assert.equal(library.includes('calendar-grid'),false);assert.match(library,/saved-workout-search/);assert.match(library,/data-delete-saved="personal"/);
});
test('beginner RPE is absent in preparation, training, review and public previews without clearing existing targets',()=>{
 const {p,w,t,b,draft}=app();p.state.profile.level='Débutant';draft.session.tracking.rpe=true;draft.session.exercises[0].rpe=8;draft.results[0][0].rpe=9;const editor=w.ConfigurationSeance;editor.stage='edit';editor.session=draft.session;editor.rawFields={};const before=JSON.stringify(draft);assert.equal(editor.card(draft.session.exercises[0],0).includes('RPE'),false);assert.equal(t.render().includes('RPE'),false);assert.equal(b.renderReview().includes('RPE'),false);assert.equal(w.Programmes.exerciseSummary(draft.session.exercises[0]).includes('RPE'),false);assert.equal(draft.session.exercises[0].rpe,8);assert.equal(draft.results[0][0].rpe,9);p.state.profile.level='Avancé';assert.match(editor.card(draft.session.exercises[0],0),/RPE/);assert.match(t.render(),/RPE/);assert.match(b.renderReview(),/RPE/);
});
test('milestones are visible only for the advanced profile and remain saved when hidden',()=>{
 const {p,w}=app();p.state.milestones=[{id:'m',date:'2026-10-22',title:'Objectif'}];assert.equal(w.Calendrier.milestones('2026-10-22').length,0);assert.equal(w.Calendrier.render().includes('Échéance'),false);p.state.profile.level='Avancé';assert.equal(w.Calendrier.milestones('2026-10-22').length,1);assert.match(w.Calendrier.render(),/Échéance/);p.state.profile.level='Débutant';assert.equal(p.state.milestones.length,1);
});
test('removing a workout or cycle preserves dated snapshots, running executions and completed records and can be undone',()=>{
 for(const organization of ['Séance seule','Mésocycle']){const {p,w}=app();const base={id:'base',name:'Personal',organization,days:[],exercises:[]};p.state.saved=[base];p.state.calendar=[{id:'dated',sourceId:'base',date:'2026-10-22',session:{name:'Independent'}}];p.state.trainingDrafts['base:single']={session:{name:'Running'}};p.state.completedSessions=[{id:'record',session:{name:'Completed'}}];p.state.preparationDrafts={'base:single':{session:{name:'Draft'}},dated:{session:{name:'Date draft'}}};const dated=JSON.stringify(p.state.calendar),running=JSON.stringify(p.state.trainingDrafts),records=JSON.stringify(p.state.completedSessions);assert.equal(w.Entrainements.removeSaved('base'),true);assert.equal(p.state.saved.length,0);assert.equal(JSON.stringify(p.state.calendar),dated);assert.equal(JSON.stringify(p.state.trainingDrafts),running);assert.equal(JSON.stringify(p.state.completedSessions),records);assert.equal(p.state.preparationDrafts['base:single'],undefined);assert.equal(p.state.preparationDrafts.dated.session.name,'Date draft');p.undo();assert.equal(p.state.saved[0].id,'base');assert.equal(p.state.preparationDrafts['base:single'].session.name,'Draft');}
});
test('a name alone creates a reusable personal exercise and normalized duplicate names reuse its identity',()=>{
 const {w,p}=app(),editor=w.ConfigurationSeance;assert.equal(editor.createNamedExercise('   '),null);const exercise=editor.createNamedExercise('  Élévation personnelle  ');assert.equal(exercise.name,'Élévation personnelle');assert.equal(exercise.group,'');assert.equal(p.state.customExercises.length,1);assert.equal(editor.createNamedExercise('elevation personnelle').id,exercise.id);assert.equal(p.state.customExercises.length,1);editor.session={exercises:[]};assert.equal(editor.addExercises([exercise.id]),1);assert.equal(editor.session.exercises[0].exerciseId,exercise.id);assert.equal(editor.session.exercises[0].sets,null);
});
test('the personal library is a restorable navigation destination for the same identity',()=>{
 const {p}=app();assert.equal(p.restoreLocation({view:'library',identity:p.state.identity,scroll:200}),true);assert.equal(p.view,'library');assert.equal(p.restoreLocation({view:'library',identity:'other'}),false);
});
