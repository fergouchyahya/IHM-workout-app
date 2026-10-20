const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');

function app(stored = {}) {
  const records = new Map(Object.entries(stored));
  const element = {textContent:'',classList:{toggle(){}},replaceChildren(){},addEventListener(){}};
  const window = {catalogueExercices:[],Calendrier:{selected:null,cursor:null},Entrainements:{listOpen:false}};
  const storage={getItem:key=>records.get(key)||null,setItem:(key,value)=>records.set(key,value)};
  const context = vm.createContext({window,structuredClone,document:{querySelector(){return element;},addEventListener(){}},localStorage:storage,clearTimeout(){}});
  vm.runInContext(fs.readFileSync(path.join(__dirname,'../prototypes/propotype 1/commun/parcours.js'),'utf8'),context);
  return {p:window.Parcours,window,records,storage};
}

test('switching demo identity preserves each profile and its custom exercise catalog',() => {
  const {p,window} = app();
  p.state.identity='username:alice'; p.state.onboardingComplete=true;
  p.state.saved=[{id:'alice-workout'}]; p.state.customExercises=[{id:'alice-movement'}]; window.catalogueExercices.push({id:'alice-movement'});
  p.switchIdentity('username:bob');
  assert.equal(p.state.saved.length,0);
  assert.equal(window.catalogueExercices.length,0);
  p.state.saved.push({id:'bob-workout'});
  p.switchIdentity('username:alice');
  assert.equal(p.state.saved[0].id,'alice-workout');
  assert.equal(window.catalogueExercices[0].id,'alice-movement');
  p.switchIdentity('username:bob');
  assert.equal(p.state.saved[0].id,'bob-workout');
});

test('old single preparation draft migrates without altering the saved workout',() => {
  const stored={saved:[{id:'saved',exercises:[]}],customExercises:[],preparationDraft:{key:'date-1',session:{name:'Brouillon'}}};
  const {p}=app({'ihm-prototype-1':JSON.stringify(stored)});
  assert.equal(p.state.preparationDrafts['date-1'].session.name,'Brouillon');
  assert.equal(p.state.preparationDraft,null);
  assert.equal(p.state.saved[0].exercises.length,0);
});

test('French decimals, zero and empty optional values remain distinct',() => {
  const context={window:{},document:{addEventListener(){}}};
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(__dirname,'../prototypes/propotype 1/commun/ergonomie.js'),'utf8'),context);
  assert.equal(context.window.Ergonomie.number({value:'22,5'}),22.5);
  assert.equal(context.window.Ergonomie.number({value:'0'}),0);
  assert.equal(context.window.Ergonomie.number({value:''}),null);
});

test('storage failure is reported without losing in-memory workouts',() => {
  const {p,storage}=app(); p.state.saved.push({id:'keep'});
  storage.setItem=()=>{throw new Error('Storage quota exceeded');};
  assert.equal(p.persist(),false);
  assert.equal(p.storageFailed,true);
  assert.equal(p.state.saved[0].id,'keep');
});
