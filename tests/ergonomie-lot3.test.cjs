const test=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const path=require('node:path');
const {randomUUID}=require('node:crypto');
function app(){
 const elements=new Map();
 const element=()=>({textContent:'',hidden:false,setAttribute(){},classList:{toggle(){}},scrollIntoView(){},replaceChildren(){},addEventListener(){}});
 const document={querySelector(selector){if(!elements.has(selector))elements.set(selector,element());return elements.get(selector);},addEventListener(){}};
 const window={scrollY:0};
 const context=vm.createContext({window,document,structuredClone,crypto:{randomUUID},clearTimeout(){},localStorage:{getItem:()=>null,setItem(){}}});
 for(const file of ['commun/ergonomie.js','06-configuration-seance/exercices.js','commun/parcours.js','05-organisation-semaine/calendrier.js','05-organisation-semaine/semaine.js','06-configuration-seance/seance.js','03-decouverte/seances.js','03-decouverte/programmes.js','03-decouverte/decouverte.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'../prototypes/propotype 1',file),'utf8'),context);
 window.Parcours.state.identity='lot3';window.Parcours.persist=()=>true;
 return {w:window,p:window.Parcours,d:window.Decouverte,c:window.Calendrier,programs:window.Programmes,e:window.Ergonomie};
}
test('French presentation distinguishes optional empty, zero, decimals and singular counts',()=>{
 const {e}=app();assert.equal(e.formatNumber(null),'—');assert.equal(e.formatNumber(0),'0');assert.equal(e.formatNumber(22.5),'22,5');assert.equal(e.count(1,'série'),'1 série');assert.equal(e.count(0,'série'),'0 séries');
});
test('a program-only search announces the global total without a misleading empty-session warning',()=>{
 const {p,d}=app();p.state.search='Semaine découverte';const markup=d.results();assert.match(markup,/1 résultat · 0 séances · 1 programme/);assert.equal(markup.includes('Aucune séance'),false);assert.equal(markup.includes('Aucun résultat'),false);
});
test('changing only the sporting goal does not invent a personalization promise',()=>{
 const {p,d}=app();p.state.profile={goal:'Force'};const first=d.results();p.state.profile={goal:'Hypertrophie'};assert.equal(d.results(),first);assert.match(first,/Selon tes filtres/);assert.equal(first.includes('pour toi'),false);p.state.profile.timeBudget=25;assert.match(d.results(),/25 min disponibles/);assert.equal(p.state.filters.duration,undefined);
});
test('duration and equipment filters apply to both sessions and programs',()=>{
 const {p,d,programs}=app();p.state.filters={duration:'20',equipment:'Salle équipée'};assert.equal(d.filtered().length,1);assert.equal(programs.filtered().length,0);p.state.filters.duration='30';assert.equal(programs.filtered().length,1);p.state.filters.equipment='Sans matériel';assert.equal(programs.filtered().length,0);
});
test('saved copy and favourite remain distinct on discovery cards',()=>{
 const {p,d,w}=app(),source=w.catalogueSeances[0];p.state.saved=[{sourceId:source.id}];assert.match(d.card(source),/Déjà enregistré/);assert.equal(d.card(source).includes('★ Favori'),false);p.state.favorites=[source.id];assert.match(d.card(source),/★ Favori/);
});
test('long cycles disclose weeks and actual variations while leaving them collapsed',()=>{
 const {programs,w}=app();const plan=structuredClone(w.catalogueProgrammes[1]);plan.weeks=20;plan.cycleWeeks=Array.from({length:20},()=>structuredClone(plan.days));plan.cycleWeeks[2][0].exercises[0].load=22.5;const markup=programs.scheduleSummary(plan);assert.equal((markup.match(/class="program-week"/g)||[]).length,20);assert.equal(/class="program-week"[^>]*open/.test(markup),false);assert.match(markup,/Identique à la semaine précédente/);assert.match(markup,/Variations par rapport/);assert.match(markup,/22,5 kg/);
});
test('preparation and import previews use French targets and never expose private notes',()=>{
 const {w,programs}=app();const source={name:'A',organization:'Séance seule',exercises:[{exerciseId:'couche',sets:1,minReps:1,maxReps:1,load:22.5,rpe:7.5,note:'PRIVATE NOTE',setting:'PRIVATE SETTING'}]};const plan=programs.snapshot(source);const markup=programs.scheduleSummary(plan);assert.match(markup,/1 série · 1 répétition · 22,5 kg · RPE 7,5\/10/);assert.equal(markup.includes('PRIVATE'),false);assert.match(w.ConfigurationSeance.summary(source.exercises[0]),/22,5 kg/);
});
test('date navigation validates leap days and never creates an event',()=>{
 const {p,c}=app();c.refresh=()=>{};c.selected='2026-10-22';assert.equal(c.jumpTo('2027-02-29'),false);assert.equal(c.selected,'2026-10-22');assert.equal(c.jumpTo('2028-02-29'),true);assert.equal(c.cursor,'2028-02-29');assert.equal(p.state.calendar.length,0);
});
test('preference return retains the source search and the newly chosen effective filter',()=>{
 const {p}=app();p.preferenceOrigin={view:'discover',identity:'lot3',search:'Full',filters:{level:'Débutant',equipment:'Salle équipée'},scroll:240};p.state.filters={level:'Débutant',equipment:'Sans matériel',group:'Dos'};let restored;p.restoreLocation=location=>{restored=location;return true;};p.notifyChange=()=>{};p.returnFromPreferences(true);assert.equal(restored.view,'discover');assert.equal(restored.search,'Full');assert.equal(restored.scroll,240);assert.equal(restored.filters.equipment,'Sans matériel');assert.equal(restored.filters.group,'Dos');
});
test('cancelling preference editing restores its original filters',()=>{
 const {p}=app();p.preferenceOrigin={view:'discover',identity:'lot3',search:'Full',filters:{equipment:'Salle équipée'},scroll:240};let restored;p.restoreLocation=location=>{restored=location;return true;};p.returnFromPreferences();assert.equal(restored.filters.equipment,'Salle équipée');assert.equal(restored.search,'Full');
});

test('live discovery criteria replace the same history entry before leaving the screen',()=>{
 const {p,d,w}=app();p.view='discover';p.location={view:'discover',identity:'lot3',entryId:'entry',filters:{equipment:'Sans matériel'}};p.state.search='Full';p.state.filters={equipment:''};let saved;w.history={replaceState:state=>{saved=state.ihmLocation;}};d.refresh();assert.equal(saved.filters.equipment,'');assert.equal(saved.search,'Full');assert.equal(saved.entryId,'entry');assert.equal(p.state.ui.navigation,saved);
});
