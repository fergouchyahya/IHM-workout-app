'use strict';

window.Parcours = {
  defaults() { return { name:'', profile:{}, saved:[], favorites:[], week:[], filters:{}, source:'starter', search:'', scroll:0, customExercises:[], trackingDefaults:{feeling:true}, exerciseDefaults:{}, identity:'', onboardingComplete:false, creationDraft:null, milestones:[], calendar:[], preparationDraft:null, preparationDrafts:{}, sharingDrafts:{}, reviewPoints:[], completedSessions:[], trainingDrafts:{}, ui:{scroll:{}} }; },
  state:null,
  profiles:{},
  view:'discover',
  storageStatus(message = '') {
    const status = document.querySelector('#storage-status');
    if (!status) return;
    status.textContent = message; status.classList.toggle('has-error',!!message);
    if (message && typeof document.createElement === 'function') {
      const retry = document.createElement('button'); retry.type = 'button'; retry.className = 'text-action'; retry.textContent = 'Réessayer la sauvegarde';
      retry.onclick = () => { const saved = window.Partages ? window.Partages.persist() : this.persist(); if (saved) this.notify('Données enregistrées sur cet appareil'); };
      status.append(retry);
    }
  },
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
    this.view = ''; this.location = null; this.undoAction = null; document.querySelector('#landing-notice')?.replaceChildren();
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
  notifyChange(message,undo = null) {
    const saved = this.persist();
    this.notify(saved ? message : 'Modification appliquée pour cette visite · sauvegarde indisponible',undo);
    return saved;
  },
  notify(message,undo = null) {
    const notice = document.querySelector('#landing-notice');
    notice.replaceChildren(document.createTextNode(message));
    this.undoAction = undo;
    clearTimeout(this.noticeTimer);
    if (undo) {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'text-action'; button.textContent = 'Annuler';
      button.setAttribute('aria-label',`Annuler : ${message}`);
      const identity = this.state.identity;
      button.onclick = async () => {
        if (button.disabled || this.state.identity !== identity) return;
        button.disabled = true;
        try {
          const result = await undo();
          if (result !== false && this.undoAction === undo) { this.undoAction = null; notice.replaceChildren(); }
          this.persist();
        } catch { this.notify('L’action n’a pas pu être annulée. Réessaie.'); }
        finally { button.disabled = false; }
      };
      notice.append(button);
    } else this.noticeTimer = setTimeout(() => { notice.replaceChildren(); },3500);
  },
  openPreferences() {
    let dialog = document.querySelector('#preference-dialog');
    if (!dialog) { dialog = document.createElement('dialog'); dialog.id = 'preference-dialog'; document.body.append(dialog); }
    const definitions = [['Niveau','level',0],['Objectif','goal',1],['Matériel','equipment',2]];
    dialog.innerHTML = `<h2>Mes préférences</h2><p>Les changements conservent tes entraînements.</p>${definitions.map(([name,key,index]) => `<button class="picker-result" type="button" data-preference="${index}"><strong>${name}</strong><span>${this.escape(this.state.profile[key] || 'Non renseigné')}</span></button>`).join('')}<button class="picker-result" type="button" id="open-availability"><strong>Durée et disponibilités</strong><span>${this.escape(window.Disponibilites.summary(this.state.profile) || 'Non renseignées')}</span></button><button class="text-action" type="button" id="close-preferences">Fermer</button><button class="text-action" type="button" id="switch-profile">Changer de profil de démonstration</button>`;
    dialog.querySelector('#open-availability').onclick = () => { dialog.close(); window.Disponibilites.open(); };
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
  locationKey(location) {
    return JSON.stringify([location.view,location.calendarId || location.baseId || location.key || location.recordId || '',location.dayIndex ?? '',location.view === 'sharing' ? location.stage : '']);
  },
  captureLocation() {
    const location = {view:this.view,identity:this.state.identity,scroll:window.scrollY || 0};
    const editor = window.ConfigurationSeance;
    if (this.view === 'discover') Object.assign(location,{search:this.state.search,filters:{...this.state.filters},source:this.state.source});
    if (this.view === 'mine') Object.assign(location,{date:window.Calendrier.selected,mode:window.Calendrier.mode,cursor:window.Calendrier.cursor});
    if (this.view === 'workout') Object.assign(location,{baseId:editor.base?.id,calendarId:editor.calendarId,dayIndex:editor.dayIndex,key:editor.key,stage:editor.stage,origin:editor.origin});
    if (this.view === 'week') Object.assign(location,{baseId:window.Semaine.base?.id,origin:window.Semaine.origin});
    if (this.view === 'training' || this.view === 'review') location.key = window.Entrainement.key;
    if (this.view === 'summary') Object.assign(location,{recordId:window.BilanSeance.activeId,origin:window.BilanSeance.origin});
    if (this.view === 'create') Object.assign(location,{creationDate:window.Calendrier.creationDate,creationRestIds:window.Calendrier.creationRestIds});
    if (this.view === 'sharing') Object.assign(location,{stage:window.Partages.stage,sourceId:window.Partages.source?.id,activeId:window.Partages.activeId,editing:window.Partages.editing});
    return location;
  },
  restoreLocation(saved,{replace = true} = {}) {
    if (!saved || saved.identity !== this.state.identity) return false;
    const location = structuredClone(saved), p = this.state, editor = window.ConfigurationSeance;
    if (!['discover','mine','workout','week','create','training','review','summary','progress','sharing'].includes(location.view)) return false;
    if (location.view === 'discover') { p.search = location.search || ''; p.filters = {...location.filters}; p.source = location.source || 'starter'; }
    if (location.view === 'mine') { window.Calendrier.selected = location.date || window.Calendrier.today(); window.Calendrier.cursor = location.cursor || window.Calendrier.selected; window.Calendrier.mode = location.mode || p.ui.calendarMode || 'week'; }
    if (location.view === 'week') { const base = p.saved.find(item => item.id === location.baseId); if (!base?.days) return false; window.Semaine.base = base; window.Semaine.origin = location.origin; }
    if (location.view === 'workout') {
      const entry = p.calendar.find(item => item.id === location.calendarId), base = entry?.session || p.saved.find(item => item.id === location.baseId);
      if (location.calendarId && (!entry || entry.type !== 'session')) return false;
      if (!base) return false;
      if (entry && window.Calendrier.isLocked(entry)) return this.restoreLocation({view:'mine',identity:p.identity,date:entry.date,scroll:0},{replace});
      const target = location.dayIndex == null ? base : base.days?.[location.dayIndex]; if (!target || location.dayIndex != null && target.type !== 'session') return false;
      Object.assign(editor,{base,dayIndex:location.dayIndex ?? null,calendarId:location.calendarId || null,key:location.key,target,origin:location.origin});
      editor.original = editor.normalizeSession(target); const draft = p.preparationDrafts[location.key];
      editor.session = structuredClone(draft?.session || editor.original); editor.rawFields = {...draft?.rawFields}; editor.stage = draft ? 'edit' : location.stage || 'overview';
      editor.selectedSlots = new Set(draft?.selectedSlots || []); editor.detailSlots = new Set(draft?.detailSlots || []); editor.bulkFields = {...draft?.bulkFields}; editor.bulkOpen = !!draft?.bulkOpen;
    }
    if (location.view === 'training' || location.view === 'review') {
      const draft = p.trainingDrafts[location.key];
      if (!draft) { const record = p.completedSessions.find(item => item.executionKey === location.key); if (!record) return false; location.view = 'summary'; location.recordId = record.id; }
      else { window.Entrainement.key = location.key; window.Entrainement.initialize(draft); }
    }
    if (location.view === 'summary') { if (!p.completedSessions.some(item => item.id === location.recordId)) return false; window.BilanSeance.activeId = location.recordId; window.BilanSeance.origin = location.origin || {view:'progress',identity:p.identity,scroll:0}; }
    if (location.view === 'create') { window.Calendrier.creationDate = location.creationDate || null; window.Calendrier.creationRestIds = location.creationRestIds || null; }
    if (location.view === 'sharing') {
      const share = window.Partages; share.stage = location.stage || 'list'; share.activeId = location.activeId; share.editing = !!location.editing;
      share.source = share.editing ? share.publicationSource(share.active()) : p.saved.find(item => item.id === location.sourceId);
      const draftKey = share.editing ? `edit:${share.activeId}` : `new:${location.sourceId}`;
      share.draft = p.sharingDrafts[draftKey]?.fields || (share.editing && share.active() ? share.presentation(share.active()) : null);
      if (['form','verify','preview'].includes(share.stage) && (!share.source || !share.draft)) share.stage = 'list';
      if (share.stage === 'detail' && !share.active()) share.stage = 'list';
    }
    this.route(location.view,{restored:location,replace}); return true;
  },
  returnTo(location) {
    if (location && this.location?.back && this.locationKey(location) === this.locationKey(this.location.back) && window.history?.state?.ihmLocation?.entryId === this.location.entryId) { window.history.back(); return; }
    if (!this.restoreLocation(location,{replace:false})) this.route('mine');
  },
  route(view,{restored = null,replace = false} = {}) {
    window.EnrichissementSeance?.releaseUrls();
    const same = this.view === view;
    const previous = this.location ? {...this.location,scroll:window.scrollY || 0} : null;
    if (!restored && previous && window.history?.state?.ihmLocation?.entryId === previous.entryId) window.history.replaceState({ihmLocation:previous},'');
    const active = document.activeElement;
    const focusAttributes = ['id','name','data-result','data-result-key','data-field','data-index','data-page','data-a','data-id','data-up','data-down','data-replace','data-remove','data-rep-mode','data-bulk-slot','data-completion-feeling','data-review-fix','data-review-skip','data-date','data-mode','data-period'];
    const focusSelector = same && active?.closest('#landing-page') ? focusAttributes.filter(name => active.hasAttribute(name)).map(name => `[${name}="${CSS.escape(active.getAttribute(name))}"]`).join('') : '';
    const selection = active && ['text','search'].includes(active.type) ? [active.selectionStart,active.selectionEnd] : null;
    this.state.ui ||= {scroll:{}}; this.state.ui.scroll ||= {};
    if (this.view) this.state.ui.scroll[this.view] = window.scrollY;
    this.persist();
    if (this.view === 'discover') this.state.scroll = window.scrollY;
    this.view = view;
    const page = document.querySelector('#landing-page');
    page.onclick = null;
    const labels = { discover:'Découvrir', mine:'Calendrier', create:'Créer un entraînement', week:'Organiser ma semaine', workout:'Préparer une séance', training:'Entraînement', progress:'Bilans', review:'Vérifier le bilan', summary:'Bilan conservé', sharing:'Partages' };
    document.title = `${labels[view]} — Propotype 1`;
    document.querySelector('#demo-screen').textContent = `Prototype`;
    page.classList.toggle('has-calendar',view === 'mine');
    page.innerHTML = view === 'discover' ? window.Decouverte.render()
      : view === 'mine' ? window.Entrainements.render()
      : view === 'create' ? window.Entrainements.renderCreate()
      : view === 'week' ? window.Semaine.render()
      : view === 'workout' ? window.ConfigurationSeance.render()
      : view === 'training' ? window.Entrainement.render()
      : view === 'review' ? window.BilanSeance.renderReview()
      : view === 'summary' ? window.BilanSeance.renderSummary()
      : view === 'progress' ? window.BilanSeance.renderHistory()
      : view === 'sharing' ? window.Partages.render()
      : '<h1 tabindex="-1">Progrès</h1><p class="landing-lead">Tes séances terminées et leurs résultats apparaîtront ici.</p><p class="landing-hint">Aucun résultat dans cette démonstration.</p>';
    if (view === 'discover') window.Decouverte.bind();
    else if (view === 'mine') window.Entrainements.bind();
    else if (view === 'create') window.Entrainements.bindCreate();
    else if (view === 'week') window.Semaine.bind();
    else if (view === 'workout') window.ConfigurationSeance.bind();
    else if (view === 'training') window.Entrainement.bind();
    else if (view === 'sharing') window.Partages.bind();
    else if (view === 'review') window.BilanSeance.bindReview();
    else if (view === 'summary') window.BilanSeance.bindSummary();
    else if (view === 'progress') window.BilanSeance.bindHistory();
    const nav = document.querySelector('#landing-navigation');
    nav.hidden = view === 'create' || view === 'week' || view === 'workout' || view === 'training' || view === 'review';
    nav.innerHTML = [['discover','Découvrir','⌕'],['mine','Calendrier','▦'],['sharing','Partages','↗'],['progress','Bilans','▥']].map(([id,label,icon]) => `<button type="button" data-page="${id}" ${view === id ? 'aria-current="page"' : ''}><span aria-hidden="true">${this.icon(id)}</span>${label}</button>`).join('');
    window.Ergonomie.bind();
    const focus = focusSelector && page.querySelector(focusSelector);
    (focus || page.querySelector('h1'))?.focus({preventScroll:true});
    if (focus && selection && typeof focus.setSelectionRange === 'function') focus.setSelectionRange(...selection);
    window.scrollTo(0,restored?.scroll ?? this.state.ui.scroll[view] ?? 0);
    const next = this.captureLocation(), samePage = previous && this.locationKey(previous) === this.locationKey(next);
    next.entryId = restored?.entryId || (samePage ? previous.entryId : crypto.randomUUID());
    if (restored) next.back = restored.back;
    else if (samePage) next.back = previous.back;
    else if (previous) { const {back,...parent} = previous; next.back = parent; }
    this.location = next; this.state.ui.navigation = next;
    if (window.history) window.history[replace || restored || samePage || !previous ? 'replaceState' : 'pushState']({ihmLocation:next},'',`#${view}`);
    this.persist();
  },
  start({name, answers, reset}) {
    if (reset) {
      this.state.saved = []; this.state.favorites = []; this.state.week = []; this.state.calendar = []; this.state.milestones = []; this.state.preparationDraft = null; this.state.preparationDrafts = {}; this.state.reviewPoints = []; this.state.completedSessions = []; this.state.trainingDrafts = {};
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
    if (!reset && this.state.ui.navigation) {
      const saved = structuredClone(this.state.ui.navigation);
      if (window.history?.state?.ihmLocation?.entryId !== saved.entryId) delete saved.back;
      if (this.restoreLocation(saved)) return;
    }
    this.route(answers.level === 'Avancé' ? 'mine' : 'discover',{replace:true});
  }
};

document.querySelector('#landing-navigation').addEventListener('click', event => {
  const button = event.target.closest('[data-page]');
  if (button) window.Parcours.route(button.dataset.page);
});

window.Parcours.state = window.Parcours.defaults();
window.Parcours.restore();

window.addEventListener?.('popstate',event => {
  const p = window.Parcours;
  if (document.querySelector('#landing-page').hidden) return;
  document.querySelectorAll('dialog[open]').forEach(dialog => dialog.close());
  if (!p.restoreLocation(event.state?.ihmLocation)) p.route('mine',{replace:true});
});
window.addEventListener?.('pagehide',() => {
  const p = window.Parcours;
  if (!p.location || document.querySelector('#landing-page').hidden) return;
  p.location = {...p.location,scroll:window.scrollY}; p.state.ui.navigation = p.location; p.persist();
  window.history.replaceState({ihmLocation:p.location},'');
});

if (window.history) window.history.scrollRestoration = 'manual';
