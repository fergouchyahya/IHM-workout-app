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
 for(const file of ['commun/ergonomie.js','06-configuration-seance/exercices.js','commun/parcours.js','05-organisation-semaine/calendrier.js','05-organisation-semaine/semaine.js','06-configuration-seance/seance.js','04-mes-entrainements/gabarits.js','04-mes-entrainements/entrainements.js','08-entrainement/enrichissement.js','08-entrainement/entrainement.js','08-entrainement/bilan.js','03-decouverte/programmes.js','07-partages/partages.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'../prototypes/propotype 1',file),'utf8'),context);
 const p=window.Parcours;p.state.identity='lot4';p.view='mine';p.persist=()=>true;p.route=view=>{p.view=view;};p.notify=(message,undo)=>{p.message=message;p.undo=undo;};p.notifyChange=p.notify.bind(p);
 const draft={session:{name:'A',exercises:[{exerciseId:'couche',slotId:'bench',sets:3,load:20,minReps:8,maxReps:12,setting:'Banc 2'}],tracking:{}},exerciseIndex:0,results:[[{load:null,reps:null},{load:null,reps:null},{load:null,reps:null}]]};window.Entrainement.key='execution';window.Entrainement.initialize(draft);p.state.trainingDrafts.execution=draft;
 return {w:window,p,draft,e:window.EnrichissementSeance,t:window.Entrainement,b:window.BilanSeance,s:window.Semaine,share:window.Partages};
}
const file=(name='photo.png')=>({name,type:'image/png',size:100});
function mediaStore(e){const stored=new Map();e.mediaOperation=async(mode,key,value)=>{if(mode==='get')return stored.get(key);if(mode==='put')stored.set(key,value);if(mode==='delete')stored.delete(key);};return stored;}
function week(a){a.s.base={id:'week',days:Array.from({length:7},()=>({type:'undefined',name:''})),organization:'Mésocycle',weeks:2,structure:[]};a.s.base.days[0]={type:'session',name:'A',exercises:[{slotId:'one',exerciseId:'couche',load:20}]};return a.s.base;}
test('bulk copies are independent, preserve the source and undo only selected days',()=>{
 const a=app(),base=week(a),original=structuredClone(base.days);assert.equal(a.s.applyDays([0,2,4],'copy',0),true);base.days[2].exercises[0].load=25;assert.equal(base.days[0].exercises[0].load,20);assert.equal(base.days[4].exercises[0].load,20);base.days[2].exercises[0].load=20;a.p.undo();assert.deepEqual(JSON.parse(JSON.stringify(base.days)),original);
});
test('bulk replacement undo restores the replaced preparation draft',()=>{
 const a=app(),base=week(a);a.p.state.preparationDrafts['week:0']={session:{name:'Private draft'}};a.s.applyDays([0,1],'rest');assert.equal(a.p.state.preparationDrafts['week:0'],undefined);a.p.undo();assert.equal(base.days[0].name,'A');assert.equal(a.p.state.preparationDrafts['week:0'].session.name,'Private draft');
});
test('bulk undo protects later drafts and never rewrites existing cycle copies',()=>{
 const a=app(),base=week(a);base.cycleWeeks=[structuredClone(base.days)];a.s.applyDays([1,2],'rest');assert.equal(base.cycleWeeks[0][1].type,'undefined');assert.equal(base.cycleNeedsUpdate,true);a.p.state.preparationDrafts['week:1']={session:{name:'New'}};assert.equal(a.p.undo(),false);assert.equal(base.days[1].type,'rest');
});
test('series progress distinguishes empty, partial, interrupted, skipped, done and invalid',()=>{
 const {t,draft:d}=app();d.results[0]=[{load:20,reps:8},{load:20,reps:null},{load:null,reps:null},{outcome:'interrupted'},{outcome:'skipped'},{load:-1,reps:8}];d.invalidFields={'0:5:load':'Charge invalide'};const text=t.progressText(d,0);for(const label of ['1 faite','1 saisie partielle','1 non renseignée','1 interrompue','1 non faite','1 à corriger'])assert.match(text,new RegExp(label));
});
test('changing selected series never declares an outcome or fills another result',()=>{
 const {t,draft:d}=app(),before=JSON.stringify(d.results);t.setActive(d,0,1);assert.equal(d.activeSets[0],1);assert.equal(JSON.stringify(d.results),before);
});
test('one editable context migrates legacy text without repetition or modifying series',()=>{
 const {e,draft:d,b}=app();delete d.enrichment.context.note;d.dayState.note='Nuit courte';d.enrichment.context.adaptationReason='Nuit courte';e.initialize(d);assert.equal(d.enrichment.context.note,'Nuit courte');assert.equal(e.writeContext(d,'note','Matériel différent'),true);const markup=b.contextMarkup(d);assert.match(markup,/Matériel différent/);assert.equal(markup.includes('Nuit courte'),false);assert.equal(d.results[0][0].load,null);
});
test('actual equipment setting stays independent of the plan',()=>{
 const {e,draft:d}=app();e.writeExercise(d,0,'setting','Banc 3');assert.equal(d.session.exercises[0].setting,'Banc 2');assert.equal(e.exercise(d,0).setting,'Banc 3');
});
test('media progress blocks completion during a pending file operation',async()=>{
 const {e,draft:d,p,b}=app();let finishPut;e.mediaOperation=()=>new Promise(resolve=>{finishPut=resolve;});const adding=e.uploadFiles(d,0,'execution',p.state.identity,[file()]);assert.equal(e.busy('execution',p.state.identity),true);assert.match(e.operationStatus('execution',p.state.identity),/en cours/);assert.match(b.finish('execution').error,/Attends/);finishPut();assert.equal(await adding,true);assert.equal(e.busy('execution',p.state.identity),false);assert.equal(e.exercise(d,0).media.length,1);
});
test('retrying one failed media never duplicates the successful files',async()=>{
 const {e,draft:d,p}=app();let failed=true;const stored=mediaStore(e),operation=e.mediaOperation;e.mediaOperation=async(mode,key,value)=>{if(mode==='put'&&value.name==='bad.png'&&failed){failed=false;throw Error('storage');}return operation(mode,key,value);};assert.equal(await e.uploadFiles(d,0,'execution',p.state.identity,[file('good.png'),file('bad.png')]),false);const jobs=e.uploads.get(e.uploadKey(0,'execution',p.state.identity));assert.equal(e.exercise(d,0).media.length,1);assert.equal(jobs[1].status,'error');assert.equal(await e.uploadFiles(d,0,'execution',p.state.identity,[],jobs[1]),true);assert.equal(e.exercise(d,0).media.length,2);assert.equal(stored.size,2);
});
test('retrying a failed metadata save keeps the same blob and reference',async()=>{
 const {e,draft:d,p}=app(),stored=mediaStore(e);p.persist=()=>false;assert.equal(await e.uploadFiles(d,0,'execution',p.state.identity,[file()]),false);const jobs=e.uploads.get(e.uploadKey(0,'execution',p.state.identity));assert.equal(stored.size,1);p.persist=()=>true;assert.equal(await e.uploadFiles(d,0,'execution',p.state.identity,[],jobs[0]),true);assert.equal(stored.size,1);assert.equal(e.exercise(d,0).media.length,1);
});
test('failed asynchronous media undo remains retryable and restores no duplicate reference',async()=>{
 const {e,draft:d,p}=app(),stored=mediaStore(e);await e.uploadFiles(d,0,'execution',p.state.identity,[file()]);const id=e.exercise(d,0).media[0].id;assert.equal(await e.removeMedia(d,0,'execution',p.state.identity,id),true);assert.equal(stored.size,0);const operation=e.mediaOperation;e.mediaOperation=async(mode,key,value)=>{if(mode==='put')throw Error('offline');return operation(mode,key,value);};assert.equal(await p.undo(),false);assert.equal(e.exercise(d,0).media.length,0);assert.equal(typeof p.undo,'function');e.mediaOperation=operation;assert.equal(await p.undo(),true);assert.equal(e.exercise(d,0).media.length,1);assert.equal(stored.size,1);
});
test('failed media removal retains both file and reference',async()=>{
 const {e,draft:d,p}=app(),stored=mediaStore(e);await e.uploadFiles(d,0,'execution',p.state.identity,[file()]);const id=e.exercise(d,0).media[0].id,operation=e.mediaOperation;e.mediaOperation=async(mode,key,value)=>{if(mode==='delete')throw Error('offline');return operation(mode,key,value);};assert.equal(await e.removeMedia(d,0,'execution',p.state.identity,id),false);assert.equal(e.exercise(d,0).media.length,1);assert.equal(stored.size,1);
});
test('completion keeps its stable label and unknown rows remain unknown',()=>{
 const {b,draft:d}=app();const markup=b.renderReview();assert.match(markup,/>Terminer et conserver<\/button>/);assert.equal(markup.includes('0 faites'),false);assert.match(markup,/3 séries non renseignées seront conservées ainsi/);const record=b.finish('execution').record;assert.equal(record.results[0][0].load,null);assert.equal(record.results[0][0].outcome,undefined);
});
test('description is optional while title and level have individual errors',()=>{
 const {share}=app();assert.deepEqual(Object.keys(share.presentationErrors({title:'Mon programme',level:'Débutant',description:''})),[]);const errors=share.presentationErrors({title:' ',level:'',description:''});assert.match(errors.title,/titre/);assert.match(errors.level,/niveau/);assert.equal(errors.description,undefined);
});
test('repairing a share keeps its presentation draft and returns to that draft after saving',()=>{
 const {share,p,w}=app(),source={id:'personal',name:'A',organization:'Séance seule',exercises:[]};p.state.saved=[source];p.state.sharingDrafts['new:personal']={fields:{title:'Titre conservé',level:'Intermédiaire',description:'',visibility:'contacts'}};share.prepare(source);share.completeSource();assert.equal(p.view,'workout');const editor=w.ConfigurationSeance;editor.session.exercises.push({slotId:'new',exerciseId:'couche',sets:null,minReps:null,maxReps:null});let returned;p.returnTo=location=>{returned=location;};editor.commit('day','share');assert.equal(returned.view,'sharing');assert.equal(returned.stage,'form');assert.equal(source.exercises.length,1);assert.equal(p.state.sharingDrafts['new:personal'].fields.title,'Titre conservé');assert.equal(p.state.sharingDrafts['new:personal'].fields.visibility,'contacts');assert.equal(share.data.items.length,0);
});
