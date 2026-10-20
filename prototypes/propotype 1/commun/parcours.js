'use strict';

window.Parcours = {
  defaults() { return { name:'', profile:{}, saved:[], favorites:[], week:[], filters:{}, source:'starter', search:'', scroll:0, customExercises:[], trackingDefaults:{feeling:true}, exerciseDefaults:{}, identity:'', onboardingComplete:false, creationDraft:null, calendar:[], preparationDraft:null, preparationDrafts:{}, sharingDrafts:{}, reviewPoints:[], trainingDrafts:{}, ui:{scroll:{}} }; },
  state:null,
  profiles:{},
  view:'discover',
  storageStatus(message = '') { const status = document.querySelector('#storage-status'); if (status) { status.textContent = message; status.classList.toggle('has-error',!!message); } },
  persist() {
    try {
      localStorage.setItem('ihm-prototype-1',JSON.stringify(this.state));
      if (this.state.identity) {
        this.profiles[this.state.identity] = {state:structuredClone(this.state),sharing:window.Partages?.data || {items:[]}};
        localStorage.setItem('ihm-prototype-1-profiles',JSON.stringify(this.profiles));
      }
      this.storageFailed = false; this.storageStatus();
      return true;
    } catch {
      this.storageFailed = true;
      this.storageStatus('Sauvegarde indisponible · garde cette page ouverte pour conserver ta saisie.');
      return false;
    }
  },
  restore() {
    try {
      this.profiles = JSON.parse(localStorage.getItem('ihm-prototype-1-profiles') || '{}');
      const stored = JSON.parse(localStorage.getItem('ihm-prototype-1') || 'null');
      if (stored && Array.isArray(stored.saved) && Array.isArray(stored.customExercises)) this.state = {...this.defaults(),...stored};
      if (this.state.preparationDraft) { this.state.preparationDrafts[this.state.preparationDraft.key] = this.state.preparationDraft; this.state.preparationDraft = null; }
      window.catalogueExercices.push(...this.state.customExercises);
    } catch { this.storageStatus('Les données locales n’ont pas pu être relues.'); }
  },
  switchIdentity(identity) {
    if (identity === this.state.identity) return;
    this.persist();
    const oldIds = new Set(this.state.customExercises.map(item => item.id));
    window.catalogueExercices = window.catalogueExercices.filter(item => !oldIds.has(item.id));
    const stored = this.profiles[identity];
    this.state = stored ? {...this.defaults(),...structuredClone(stored.state)} : this.defaults();
    this.state.identity = identity;
    window.catalogueExercices.push(...this.state.customExercises);
    if (window.Partages) { window.Partages.data = structuredClone(stored?.sharing || {items:[]}); window.Partages.stage = 'list'; window.Partages.draft = null; window.Partages.editing = false; window.Partages.source = null; }
    window.Calendrier.selected = window.Calendrier.cursor = null;
    window.Entrainements.listOpen = false;
    clearTimeout(this.noticeTimer);
    this.view = ''; this.undoAction = null; document.querySelector('#landing-notice')?.replaceChildren();
  },
  escape(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
  },
  select(label, name, options, value = '', extra = '') {
    const escape = this.escape;
    return `<label>${label}<select name="${name}" ${extra}>${options.map(([key,text]) => `<option value="${escape(key)}" ${key === value ? 'selected' : ''}>${escape(text)}</option>`).join('')}</select></label>`;
  },
  icon(name) {
    const paths = {discover:'<circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/>',mine:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4m8-4v4"/>',sharing:'<circle cx="5" cy="12" r="3"/><circle cx="18" cy="5" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8 10 7-4M8 14l7 4"/>',progress:'<path d="M4 20V10m8 10V4m8 16v-7"/>'};
    return `<svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true">${paths[name]}</svg>`;
  },
  greeting() {
    return this.state.name ? `<p class="landing-greeting">Bonjour ${this.escape(this.state.name)}</p>` : '';
  },
  notify(message,undo = null) {
    const notice = document.querySelector('#landing-notice');
    notice.replaceChildren(document.createTextNode(message));
    this.undoAction = undo;
    clearTimeout(this.noticeTimer);
    if (undo) {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'text-action'; button.textContent = 'Annuler';
      button.onclick = () => { undo(); this.undoAction = null; notice.replaceChildren(); this.persist(); };
      notice.append(button);
    } else this.noticeTimer = setTimeout(() => { notice.replaceChildren(); },3500);
  },
  openPreferences() {
    let dialog = document.querySelector('#preference-dialog');
    if (!dialog) { dialog = document.createElement('dialog'); dialog.id = 'preference-dialog'; document.body.append(dialog); }
    const definitions = [['Niveau','level',0],['Objectif','goal',1],['Matériel','equipment',2]];
    dialog.innerHTML = `<h2>Mes préférences</h2><p>Les changements conservent tes entraînements.</p>${definitions.map(([name,key,index]) => `<button class="picker-result" type="button" data-preference="${index}"><strong>${name}</strong><span>${this.escape(this.state.profile[key] || 'Non renseigné')}</span></button>`).join('')}<button class="text-action" type="button" id="close-preferences">Fermer</button><button class="text-action" type="button" id="switch-profile">Changer de profil de démonstration</button>`;
    dialog.querySelector('#close-preferences').onclick = () => dialog.close();
    dialog.querySelector('#switch-profile').onclick = () => { dialog.close(); this.persist(); document.querySelector('#landing-page').hidden = true; document.querySelector('#landing-navigation').hidden = true; document.querySelector('#access-page').hidden = false; document.querySelector('#login-identifier').focus(); };
    dialog.querySelectorAll('[data-preference]').forEach(button => { button.onclick = () => { dialog.close(); document.querySelector('#landing-page').hidden = true; document.querySelector('#landing-navigation').hidden = true; window.QuestionsRapides.start({name:this.state.name,reset:false,answers:this.state.profile,field:Number(button.dataset.preference),returnToLogin:() => { document.querySelector('#questions-page').hidden = true; document.querySelector('#landing-page').hidden = false; this.route('mine'); },editing:true}); }; });
    dialog.showModal();
  },
  ensureCopy(workout) {
    let copy = this.state.saved.find(item => item.sourceId === workout.id);
    if (!copy) {
      copy = { ...structuredClone(workout), id:crypto.randomUUID(), sourceId:workout.id, organization:'Séance seule', kind:'copy' };
      this.state.saved.push(copy);
    }
    return copy;
  },
  route(view) {
    const same = this.view === view;
    this.state.ui ||= {scroll:{}}; this.state.ui.scroll ||= {};
    if (this.view) this.state.ui.scroll[this.view] = window.scrollY;
    this.persist();
    if (this.view === 'discover') this.state.scroll = window.scrollY;
    this.view = view;
    const page = document.querySelector('#landing-page');
    page.onclick = null;
    const labels = { discover:'Découvrir', mine:'Calendrier', create:'Créer un entraînement', week:'Organiser ma semaine', workout:'Préparer une séance', training:'Entraînement', progress:'Progrès', sharing:'Partages' };
    document.title = `${labels[view]} — Propotype 1`;
    document.querySelector('#demo-screen').textContent = `Prototype`;
    page.classList.toggle('has-calendar',view === 'mine');
    page.innerHTML = view === 'discover' ? window.Decouverte.render()
      : view === 'mine' ? window.Entrainements.render()
      : view === 'create' ? window.Entrainements.renderCreate()
      : view === 'week' ? window.Semaine.render()
      : view === 'workout' ? window.ConfigurationSeance.render()
      : view === 'training' ? window.Entrainement.render()
      : view === 'sharing' ? window.Partages.render()
      : '<h1 tabindex="-1">Progrès</h1><p class="landing-lead">Tes séances terminées et leurs résultats apparaîtront ici.</p><p class="landing-hint">Aucun résultat dans cette démonstration.</p>';
    if (view === 'discover') window.Decouverte.bind();
    else if (view === 'mine') window.Entrainements.bind();
    else if (view === 'create') window.Entrainements.bindCreate();
    else if (view === 'week') window.Semaine.bind();
    else if (view === 'workout') window.ConfigurationSeance.bind();
    else if (view === 'training') window.Entrainement.bind();
    else if (view === 'sharing') window.Partages.bind();
    const nav = document.querySelector('#landing-navigation');
    nav.hidden = view === 'create' || view === 'week' || view === 'workout' || view === 'training';
    nav.innerHTML = [['discover','Découvrir','⌕'],['mine','Calendrier','▦'],['sharing','Partages','↗'],['progress','Progrès','▥']].map(([id,label,icon]) => `<button type="button" data-page="${id}" ${view === id ? 'aria-current="page"' : ''}><span aria-hidden="true">${this.icon(id)}</span>${label}</button>`).join('');
    window.Ergonomie.bind();
    if (!same) page.querySelector('h1').focus({preventScroll:true});
    window.scrollTo(0,this.state.ui.scroll[view] || 0);
  },
  start({name, answers, reset}) {
    if (reset) {
      this.state.saved = []; this.state.favorites = []; this.state.week = []; this.state.calendar = []; this.state.preparationDraft = null; this.state.preparationDrafts = {}; this.state.reviewPoints = []; this.state.trainingDrafts = {};
      const customIds = new Set(this.state.customExercises.map(item => item.id));
      window.catalogueExercices = window.catalogueExercices.filter(item => !customIds.has(item.id));
      this.state.creationDraft = null; this.state.customExercises = []; this.state.exerciseDefaults = {}; this.state.trackingDefaults = {feeling:true};
    }
    this.state.onboardingComplete = true;
    this.state.name = name;
    this.state.profile = { ...answers };
    if (reset || !Object.keys(this.state.filters).length) this.state.filters = { level:answers.level || '', group:'', equipment:answers.equipment || '', duration:'' };
    if (reset) { this.state.source = 'starter'; this.state.search = ''; this.state.ui = {scroll:{}}; }
    document.querySelector('#questions-page').hidden = true;
    document.querySelector('#landing-page').hidden = false;
    this.view = '';
    this.route(answers.level === 'Avancé' ? 'mine' : 'discover');
  }
};

document.querySelector('#landing-navigation').addEventListener('click', event => {
  const button = event.target.closest('[data-page]');
  if (button) window.Parcours.route(button.dataset.page);
});

window.Parcours.state = window.Parcours.defaults();
window.Parcours.restore();
