'use strict';

window.Calendrier = {
  mode:'week',
  // Utiliser les dates locales à midi évite les décalages UTC et les changements d’heure.
  date(value) { return new Date(`${value}T12:00:00`); },
  key(date) { return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`; },
  today() { return this.key(new Date()); },
  plus(value,days) { const date = this.date(value); date.setDate(date.getDate()+days); return this.key(date); },
  monday(value) { return this.plus(value,-((this.date(value).getDay()+6)%7)); },
  label(value,options = {weekday:'long',day:'numeric',month:'long'}) { return this.date(value).toLocaleDateString('fr-FR',options); },
  selected:null,
  cursor:null,
  creationDate:null,
  entries(date) { return window.Parcours.state.calendar.filter(entry => entry.date === date); },
  repeatGroup(entry) {
    if (!entry || entry.type !== 'session') return null;
    return entry.repetitionKey || (entry.cycleId && Number.isInteger(entry.templateDay) ? `${entry.cycleId}:${entry.templateDay}` : null);
  },
  isLocked(entry) {
    const p = window.Parcours;
    return !!entry && (!!p.state.trainingDrafts?.[entry.id] || (p.state.completedSessions || []).some(record => record.executionKey === entry.id));
  },
  canChange(entries) {
    if (!entries.some(entry => this.isLocked(entry))) return true;
    const message = 'Séance commencée ou terminée : reprends-la ou programme une nouvelle séance. Ses dates et résultats sont conservés.';
    const error = document.querySelector('dialog[open] #calendar-error');
    if (error) error.textContent = message;
    else window.Parcours.notify(message);
    return false;
  },
  milestones(date) { if (!window.Parcours.isAdvanced()) return []; return (window.Parcours.state.milestones || []).filter(item => item.date === date); },
  milestoneCards(date) {
    const p = window.Parcours;
    return this.milestones(date).map(item => `<button type="button" class="agenda-card is-milestone" data-milestone="${item.id}"><span class="agenda-symbol" aria-hidden="true">⚑</span><span><small>ÉCHÉANCE</small><strong>${p.escape(item.title)}</strong>${item.workoutId ? `<span>${p.escape(p.state.saved.find(workout => workout.id === item.workoutId)?.name || 'Programme archivé')}</span>` : ''}${item.note ? `<span>${p.escape(item.note)}</span>` : ''}<small>Modifier la date ou l’objectif →</small></span></button>`).join('');
  },
  snapshot(source) {
    const copy = structuredClone(source);
    copy.exercises = (copy.exercises || []).map((exercise,index) => {
      if (typeof exercise !== 'string') return {...exercise,slotId:exercise.slotId || `slot-${index}`};
      const item = window.catalogueExercices.find(item => item.name === exercise);
      return {slotId:`slot-${index}`,exerciseId:item.id,sets:null,minReps:null,maxReps:null,load:null,rpe:null,note:'',setting:''};
    });
    return copy;
  },
  addSession(source,date) {
    const entry = {id:crypto.randomUUID(),date,type:'session',sourceId:source.id,session:this.snapshot(source)};
    window.Parcours.state.calendar.push(entry);
    window.Parcours.persist();
    return entry;
  },
  meta(session) {
    return [session.duration ? `≈ ${session.duration} min` : '',window.Ergonomie.count((session.exercises || []).length,'exercice'),session.group || (session.groups || []).join(', '),session.equipment].filter(Boolean).join(' · ');
  },
  render() {
    const p = window.Parcours;
    if (!this.selected) { this.selected = p.state.ui.selectedDate || this.today(); this.mode = p.state.ui.calendarMode || 'week'; } this.cursor ||= this.selected;
    const first = this.mode === 'month' ? `${this.cursor.slice(0,7)}-01` : this.monday(this.cursor);
    const start = this.monday(first);
    const last = new Date(this.date(first).getFullYear(),this.date(first).getMonth()+1,0,12);
    const count = this.mode === 'month' ? Math.ceil((((this.date(first).getDay()+6)%7)+last.getDate())/7)*7 : 7;
    const title = this.mode === 'month' ? this.label(first,{month:'long',year:'numeric'}) : `${this.label(start,{day:'numeric',month:'short'})} – ${this.label(this.plus(start,6),{day:'numeric',month:'short',year:'numeric'})}`;
    const selected = this.entries(this.selected);
    return `<div class="calendar-heading"><div><p class="calendar-eyebrow">MON PLANNING</p><h1 tabindex="-1">Calendrier</h1></div><button type="button" id="calendar-add" class="primary-action">+ Ajouter</button></div>
      <div class="calendar-toolbar"><div class="calendar-switch" aria-label="Vue du calendrier"><button type="button" data-mode="month" aria-pressed="${this.mode === 'month'}">Mois</button><button type="button" data-mode="week" aria-pressed="${this.mode === 'week'}">Semaine</button></div><button type="button" class="text-action" id="calendar-today">Aujourd’hui</button></div>
      <button type="button" id="calendar-show-day" class="text-action calendar-day-link">Voir ${this.selected === this.today() ? 'la séance du jour' : 'le jour sélectionné'} · ${selected.length} élément${selected.length === 1 ? '' : 's'}</button><div class="calendar-period"><h2><button type="button" id="calendar-jump" aria-label="Choisir une date, ${p.escape(title)}">${title} <span aria-hidden="true">⌄</span></button></h2><div><button type="button" class="landing-button" data-period="-1" aria-label="Période précédente">‹</button><button type="button" class="landing-button" data-period="1" aria-label="Période suivante">›</button></div></div>
      <p class="calendar-keyboard-help">Au clavier : flèches pour parcourir les jours ; Page précédente/suivante pour changer de mois.</p><div class="calendar-grid-scroll"><div class="calendar-grid ${this.mode === 'week' ? 'is-week' : ''}" aria-label="${p.escape(title)}">${['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'].map(day => `<span class="calendar-weekday">${day}</span>`).join('')}${Array.from({length:count},(_,index) => {
        const date = this.plus(start,index), entries = this.entries(date), milestones = this.milestones(date);
        return `<div class="calendar-cell ${date.slice(0,7) !== this.cursor.slice(0,7) && this.mode === 'month' ? 'is-outside' : ''} ${date === this.selected ? 'is-selected' : ''}" data-drop-date="${date}"><button class="calendar-date" type="button" data-date="${date}" tabindex="${date === this.selected ? 0 : -1}" aria-label="${this.label(date)}${entries.length ? `, ${entries.map(entry => entry.type === 'rest' ? 'Repos' : p.escape(entry.session.name)).join(', ')}` : ''}${milestones.length ? `, ${milestones.map(item => p.escape(item.title)).join(', ')}` : ''}" aria-pressed="${date === this.selected}" ${date === this.today() ? 'aria-current="date"' : ''}><span>${this.date(date).getDate()}</span></button><div class="calendar-markers">${entries.slice(0,1).map(entry => `<span class="calendar-chip is-${entry.type}" aria-label="${p.escape(entry.type === 'rest' ? 'Repos' : entry.session.name)} · ${this.label(date)}"><span>${entry.type === 'rest' ? 'Repos' : p.escape(entry.session.name)}</span></span>`).join('')}${milestones.length ? '<span class="milestone-marker" aria-label="Échéance">⚑</span>' : ''}${entries.length > 1 ? `<span class="calendar-overflow">+${entries.length-1}</span>` : ''}</div></div>`;
      }).join('')}</div></div>
      <div class="calendar-legend"><span class="legend-session">Séance</span><span class="legend-rest">Repos</span>${p.isAdvanced() ? '<span class="legend-milestone">Échéance</span>' : ''}</div>
      <section class="calendar-selected" aria-labelledby="selected-date-title"><div class="landing-row"><div><p class="calendar-eyebrow">${this.selected === this.today() ? 'AUJOURD’HUI' : 'JOUR SÉLECTIONNÉ'}</p><h2 id="selected-date-title">${this.label(this.selected)}</h2></div></div><div class="calendar-agenda">${selected.length ? selected.map(entry => `<div class="agenda-row"><button type="button" class="agenda-card is-${entry.type}" data-entry="${entry.id}" ${this.isLocked(entry) ? '' : 'draggable="true"'}><span class="agenda-symbol" aria-hidden="true">${entry.type === 'rest' ? '☾' : '▥'}</span><span><small>${entry.type === 'rest' ? 'RÉCUPÉRATION' : p.state.completedSessions.some(record => record.executionKey === entry.id) ? 'SÉANCE TERMINÉE' : 'SÉANCE PRÉVUE'}</small><strong>${entry.type === 'rest' ? 'Repos' : p.escape(entry.session.name)}</strong>${entry.type === 'session' ? `<span>${p.escape(this.meta(entry.session))}</span><small>${this.isLocked(entry) ? 'Ouvrir la séance →' : 'Voir les exercices et les objectifs →'}</small>` : '<span>Une journée pour récupérer.</span>'}</span></button>${entry.type === 'session' && p.state.completedSessions.some(record => record.executionKey === entry.id) ? `<button class="resume-workout landing-button" type="button" data-completed-entry="${entry.id}">Voir le bilan</button>` : entry.type === 'session' && p.state.trainingDrafts[entry.id] ? `<button class="resume-workout landing-button" type="button" data-resume="${entry.id}">En cours · Reprendre</button>` : ''}</div>`).join('') : this.milestones(this.selected).length ? '' : `<p class="calendar-empty">Rien de prévu pour ce jour.<br>${p.isAdvanced() ? 'Ajoute une séance, un repos ou une échéance.' : 'Ajoute une séance ou un repos.'}</p>`}${this.milestoneCards(this.selected)}</div></section>
      ${!p.isBeginner() ? '<button type="button" class="text-action calendar-week-action" id="calendar-copy-week">Copier / déplacer cette semaine</button>' : ''}
      <dialog id="calendar-dialog" class="calendar-dialog" aria-labelledby="calendar-dialog-title"><h2 id="calendar-dialog-title"></h2><div id="calendar-dialog-content"></div></dialog>`;
  },
  refresh(focus) {
    window.Parcours.state.ui.selectedDate = this.selected; window.Parcours.state.ui.calendarMode = this.mode;
    window.Parcours.route('mine');
    if (focus) document.querySelector(focus)?.focus({preventScroll:true});
  },
  jumpTo(date) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(this.date(date).getTime()) || this.key(this.date(date)) !== date) return false;
    this.selected = this.cursor = date;
    this.refresh(`[data-date="${date}"]`);
    document.querySelector(`[data-date="${date}"]`)?.scrollIntoView({block:'nearest',inline:'nearest'});
    return true;
  },
  bind() {
    document.querySelector('#calendar-jump').onclick = () => {
      const dialog = this.dialog('Choisir une date',`<form id="calendar-jump-form"><label>Date à consulter<input name="date" type="date" value="${this.selected}" required></label><p class="form-help">Consulter une date ne crée ni séance ni repos.</p><div class="week-actions"><button type="submit" class="primary-action">Voir cette date</button><button type="button" id="calendar-cancel" class="text-action">Annuler</button></div></form>`);
      dialog.querySelector('form').onsubmit = event => { event.preventDefault(); const date = event.target.elements.date.value; if (!date) return; dialog.close(); this.jumpTo(date); };
    };
    document.querySelectorAll('[data-date]').forEach(button => { button.onkeydown = event => {
      let date = button.dataset.date;
      if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)) date = this.plus(date,{ArrowLeft:-1,ArrowRight:1,ArrowUp:-7,ArrowDown:7}[event.key]);
      else if (event.key === 'Home') date = this.monday(date);
      else if (event.key === 'End') date = this.plus(this.monday(date),6);
      else if (['PageUp','PageDown'].includes(event.key)) {
        const old = this.date(date), first = new Date(old.getFullYear(),old.getMonth()+(event.key === 'PageUp' ? -1 : 1),1,12);
        const last = new Date(first.getFullYear(),first.getMonth()+1,0,12).getDate();
        first.setDate(Math.min(old.getDate(),last)); date = this.key(first);
      } else return;
      event.preventDefault(); this.jumpTo(date);
    }; });
    document.querySelector('#calendar-show-day').onclick = () => { const heading = document.querySelector('#selected-date-title'); heading.tabIndex = -1; heading.focus(); heading.scrollIntoView({block:'start'}); };
    document.querySelector('#calendar-add').onclick = () => this.choose();
    document.querySelector('#calendar-today').onclick = () => { this.selected = this.cursor = this.today(); this.refresh('#calendar-today'); };
    document.querySelector('#calendar-copy-week')?.addEventListener('click',() => this.copyWeek());
    document.querySelectorAll('[draggable]').forEach(card => {
      // L’appui prolongé laisse le défilement ordinaire disponible sur mobile.
      let timer, active = false;
      const clear = () => { clearTimeout(timer); active = false; card.classList.remove('is-dragging'); };
      card.addEventListener('touchstart',event => {
        if (event.touches.length !== 1) return;
        timer = setTimeout(() => { active = true; card.classList.add('is-dragging'); },300);
      },{passive:true});
      card.addEventListener('touchmove',event => {
        if (!active) { clearTimeout(timer); return; }
        event.preventDefault();
        document.querySelectorAll('.is-drop-target').forEach(cell => cell.classList.remove('is-drop-target'));
        document.elementFromPoint(event.touches[0].clientX,event.touches[0].clientY)?.closest('[data-drop-date]')?.classList.add('is-drop-target');
      },{passive:false});
      card.addEventListener('touchend',event => {
        if (active) {
          event.preventDefault();
          const touch = event.changedTouches[0];
          const cell = document.elementFromPoint(touch.clientX,touch.clientY)?.closest('[data-drop-date]');
          if (cell) this.moveTo(card.dataset.entry,cell.dataset.dropDate);
        }
        document.querySelectorAll('.is-drop-target').forEach(cell => cell.classList.remove('is-drop-target'));
        clear();
      },{passive:false});
      card.addEventListener('touchcancel',clear);
      card.oncontextmenu = event => { event.preventDefault(); };
      card.ondragstart = event => { event.dataTransfer.setData('text/plain',card.dataset.entry); event.dataTransfer.effectAllowed = 'move'; };
    });
    document.querySelectorAll('[data-drop-date]').forEach(cell => {
      cell.ondragover = event => { event.preventDefault(); cell.classList.add('is-drop-target'); };
      cell.ondragleave = () => cell.classList.remove('is-drop-target');
      cell.ondrop = event => {
        event.preventDefault();
        this.moveTo(event.dataTransfer.getData('text/plain'),cell.dataset.dropDate);
      };
    });
  },
  detachCycle(entry) { for (const key of ['cycleId','templateDay','cycleStart','cycleEnd']) delete entry[key]; },
  moveTo(id,date) {
    const entry = window.Parcours.state.calendar.find(item => item.id === id);
    if (!entry || !date || !this.canChange([entry])) return;
    const previous = structuredClone(entry), proposed = {...structuredClone(entry),date};
    if (proposed.cycleId && (date < proposed.cycleStart || date > proposed.cycleEnd)) this.detachCycle(proposed);
    const apply = (accepted,replaced) => {
      const change = this.applyPlacement(accepted,new Set([id]),replaced); if (!change) return;
      document.querySelector('#calendar-dialog')?.close(); this.selected = this.cursor = date;
      this.refresh(`[data-entry="${id}"]`); this.undoPlacement(change.removed,change.added,'Séance déplacée');
    };
    if (this.conflicts([proposed],new Set([id]))) {
      this.dialog('Déplacer cette séance',`<p>${window.Parcours.escape(entry.session?.name || 'Repos')} · ${this.label(previous.date)} → ${this.label(date)}</p><div id="calendar-error" class="error" role="alert"></div><button type="button" id="calendar-cancel" class="text-action">Annuler le déplacement</button>`);
    }
    this.requestPlacement([proposed],new Set([id]),apply);
  },
  click(event) {
    const milestone = event.target.closest('[data-milestone]');
    if (milestone) { this.editMilestone(this.selected,milestone.dataset.milestone); return true; }
    const completed = event.target.closest('[data-completed-entry]');
    if (completed) { window.BilanSeance.open(window.Parcours.state.completedSessions.find(record => record.executionKey === completed.dataset.completedEntry).id); return true; }
    const resume = event.target.closest('[data-resume]');
    if (resume) { window.Entrainement.resume(resume.dataset.resume); return true; }
    const mode = event.target.closest('[data-mode]'), period = event.target.closest('[data-period]'), date = event.target.closest('[data-date]'), entry = event.target.closest('[data-entry]'), schedule = event.target.closest('[data-schedule]');
    if (mode) { this.mode = mode.dataset.mode; this.cursor = this.selected; this.refresh(`[data-mode="${this.mode}"]`); }
    else if (period) {
      const step = Number(period.dataset.period);
      if (this.mode === 'month') { const next = this.date(`${this.cursor.slice(0,7)}-01`); next.setMonth(next.getMonth()+step); this.cursor = this.key(next); }
      else this.cursor = this.plus(this.cursor,step*7);
      this.selected = this.cursor; this.refresh(`[data-period="${step}"]`);
    }
    else if (date) { this.selected = date.dataset.date; this.refresh(`[data-date="${this.selected}"]`); }
    else if (entry) this.open(entry.dataset.entry);
    else if (schedule) this.schedule(window.Parcours.state.saved.find(item => item.id === schedule.dataset.schedule));
    return !!(mode || period || date || entry || schedule);
  },
  dialog(title,content) {
    if (!document.querySelector('#calendar-dialog')) {
      const dialog = document.createElement('dialog'); dialog.id = 'calendar-dialog'; dialog.className = 'calendar-dialog'; dialog.setAttribute('aria-labelledby','calendar-dialog-title');
      dialog.innerHTML = '<h2 id="calendar-dialog-title"></h2><div id="calendar-dialog-content"></div>'; document.querySelector('#landing-page').append(dialog);
    }
    document.querySelector('#calendar-dialog-title').textContent = title;
    document.querySelector('#calendar-dialog-content').innerHTML = content;
    const dialog = document.querySelector('#calendar-dialog');
    document.querySelector('#calendar-cancel').onclick = () => dialog.close();
    window.Ergonomie.bind(dialog);
    dialog.addEventListener('close',() => document.querySelectorAll('.is-drop-target').forEach(cell => cell.classList.remove('is-drop-target')),{once:true});
    if (!dialog.open) dialog.showModal();
    return dialog;
  },
  undoPlacement(removed,added,message) {
    const p = window.Parcours, before = structuredClone(removed);
    const expected = new Map(p.state.calendar.filter(entry => added.includes(entry.id)).map(entry => [entry.id,JSON.stringify(entry)]));
    p.notifyChange(message,() => {
      const current = p.state.calendar.filter(entry => added.includes(entry.id) || before.some(old => old.id === entry.id));
      if (!this.canChange(current)) return false;
      if ([...expected].some(([id,value]) => JSON.stringify(p.state.calendar.find(entry => entry.id === id)) !== value)) { p.notify('Annulation impossible : une séance du lot a été modifiée depuis. Les changements récents sont conservés.'); return false; }
      p.state.calendar = p.state.calendar.filter(entry => !added.includes(entry.id) && !before.some(old => old.id === entry.id));
      p.state.calendar.push(...structuredClone(before)); this.refresh('#calendar-add');
    });
  },
  choose(date = this.today()) {
    const p = window.Parcours;
    this.dialog('Ajouter au calendrier',`<label>Date<input id="calendar-add-date" type="date" value="${date}" required></label><label>Rechercher dans mes entraînements<input id="calendar-workout-search" type="search" placeholder="Nom de séance ou programme"></label><div id="calendar-saved-results" class="picker-results"></div>${!p.isBeginner() ? '<details class="expert-tools"><summary>Placer sur plusieurs jours</summary><fieldset class="batch-days" id="calendar-batch-days"><legend>Jours de cette semaine</legend></fieldset></details>' : ''}<div class="calendar-choices">${p.isAdvanced() ? '<button type="button" id="calendar-milestone" class="landing-button">⚑ Ajouter une échéance</button>' : ''}<button type="button" id="calendar-rest" class="landing-button">☾ Marquer comme repos</button><button type="button" id="calendar-open-library" class="text-action">Mes entraînements</button><p id="calendar-error" class="error" role="alert"></p><button type="button" id="calendar-cancel" class="text-action">Fermer</button></div>`);
    const dateField = document.querySelector('#calendar-add-date');
    const readDate = () => {
      if (!dateField.value || !dateField.validity.valid) { document.querySelector('#calendar-error').textContent = 'Choisis une date valide.'; dateField.focus(); return null; }
      return dateField.value;
    };
    const datesForPlacement = () => p.isBeginner() ? [dateField.value] : [...document.querySelectorAll('[name=placement-date]:checked')].map(input => input.value);
    const refresh = () => {
      const search = window.Ergonomie.normalize(document.querySelector('#calendar-workout-search').value);
      const saved = p.state.saved.filter(item => window.Ergonomie.normalize(item.name).includes(search));
      document.querySelector('#calendar-saved-results').innerHTML = saved.length ? saved.map(item => `<button type="button" class="picker-result" data-pick="${item.id}"><span><strong>${p.escape(item.name)}</strong><small>${p.escape(item.organization)}</small>${datesForPlacement().filter(Boolean).flatMap(date => window.Disponibilites.warnings(item,date).map(message => `<small class="availability-warning">${p.escape(this.label(date,{day:'numeric',month:'short'}))} : ${p.escape(message)}</small>`)).join('')}</span><span>${item.organization === 'Séance seule' ? '+ Ajouter' : 'Planifier'}</span></button>`).join('') : '<p>Aucun entraînement trouvé. Crée-le dans Mes entraînements ou enregistre-en un depuis Découvrir.</p>';
    };
    const updateDays = () => {
      const fieldset = document.querySelector('#calendar-batch-days');
      if (fieldset && dateField.value) {
        fieldset.innerHTML = `<legend>Jours de cette semaine</legend>${window.Semaine.days.map((name,index) => { const value = this.plus(this.monday(dateField.value),index); return `<label><input type="checkbox" name="placement-date" value="${value}" ${value === dateField.value ? 'checked' : ''}>${name.slice(0,3)} ${this.date(value).getDate()}</label>`; }).join('')}`;
        fieldset.onchange = refresh;
      }
      document.querySelector('#calendar-error').textContent = ''; refresh();
    };
    dateField.onchange = updateDays;
    document.querySelector('#calendar-workout-search').oninput = refresh;
    document.querySelector('#calendar-saved-results').onclick = event => {
      const button = event.target.closest('[data-pick]'); if (!button || !readDate()) return;
      const source = p.state.saved.find(item => item.id === button.dataset.pick);
      if (source.organization !== 'Séance seule') { this.schedule(source,dateField.value); return; }
      const dates = datesForPlacement();
      if (!dates.length) { document.querySelector('#calendar-error').textContent = 'Sélectionne au moins un jour.'; return; }
      this.quickAdd(source,dates);
    };
    document.querySelector('#calendar-open-library').onclick = () => { document.querySelector('#calendar-dialog').close(); p.route('library'); };
    document.querySelector('#calendar-milestone')?.addEventListener('click',() => { const date = readDate(); if (date) this.editMilestone(date); });
    document.querySelector('#calendar-rest').onclick = () => {
      const date = readDate(); if (!date || !this.canChange(this.entries(date))) return;
      const removed = structuredClone(this.entries(date));
      const apply = () => {
        p.state.calendar = p.state.calendar.filter(entry => entry.date !== date);
        const rest = {id:crypto.randomUUID(),date,type:'rest'}; p.state.calendar.push(rest);
        document.querySelector('#calendar-dialog').close(); this.selected = this.cursor = date; this.refresh('#calendar-add'); this.undoPlacement(removed,[rest.id],'Jour marqué comme repos');
      };
      if (removed.some(entry => entry.type === 'session')) window.Ergonomie.confirm('Remplacer les séances par du repos ?',`${removed.filter(entry => entry.type === 'session').length} séance(s) et leurs objectifs seront retirés du ${this.label(date)}.`,apply,'Remplacer par du repos'); else apply();
    };
    updateDays();
  },
  quickAdd(source,dates) {
    const p = window.Parcours, rests = p.state.calendar.filter(entry => dates.includes(entry.date) && entry.type === 'rest');
    const apply = () => {
      p.state.calendar = p.state.calendar.filter(entry => !rests.includes(entry));
      const added = dates.map(date => this.addSession(source,date).id);
      document.querySelector('#calendar-dialog')?.close(); this.selected = this.cursor = dates[0]; this.refresh('#calendar-add');
      this.undoPlacement(rests,added,`${source.name} ajouté · ${dates.map(date => this.label(date,{day:'numeric',month:'short'})).join(', ')}`);
    };
    if (rests.length) window.Ergonomie.confirm('Remplacer le repos par cette séance ?',`Repos concerné : ${rests.map(entry => this.label(entry.date)).join(', ')}.`,apply,'Remplacer et ajouter'); else apply();
  },
  saveMilestone(value,id = null) {
    const p = window.Parcours;
    const date = this.date(value.date);
    if (!value.title.trim() || value.title.trim().length > 100 || !/^\d{4}-\d{2}-\d{2}$/.test(value.date) || !Number.isFinite(date.getTime()) || this.key(date) !== value.date || (value.note || '').length > 500) return null;
    const record = {id:id || crypto.randomUUID(),title:value.title.trim(),date:value.date,note:(value.note || '').trim(),workoutId:value.workoutId || ''};
    p.state.milestones ||= [];
    const index = p.state.milestones.findIndex(item => item.id === id);
    if (id && index === -1) return null;
    if (index === -1) p.state.milestones.push(record); else p.state.milestones[index] = record;
    p.persist(); return record;
  },
  editMilestone(date,id = null) {
    const p = window.Parcours;
    const previous = id ? structuredClone(p.state.milestones.find(item => item.id === id)) : null;
    const current = previous || {date,title:'',note:'',workoutId:''};
    const dialog = this.dialog(id ? 'Modifier l’échéance' : 'Ajouter une échéance',`<form id="milestone-form"><label>Objectif ou nom de l’échéance<input name="title" maxlength="100" required value="${p.escape(current.title)}" placeholder="Ex. Fin de cycle, séance de référence"></label><label>Date<input name="date" type="date" required value="${current.date}"></label>${p.select('Programme associé (facultatif)','workoutId',[['','Aucun'],...p.state.saved.map(item => [item.id,item.name]),...(current.workoutId && !p.state.saved.some(item => item.id === current.workoutId) ? [[current.workoutId,'Programme archivé']] : [])],current.workoutId)}<label>Repère ou cible (facultatif)<textarea name="note" maxlength="500" rows="3" placeholder="Ce que tu souhaites vérifier à cette date">${p.escape(current.note)}</textarea></label><p class="form-help">L’échéance est un repère personnel. Elle ne modifie ni les cibles des exercices ni les résultats.</p><p id="milestone-error" class="error" role="alert"></p><div class="week-actions"><button type="submit" class="primary-action">Enregistrer l’échéance</button><button type="button" class="text-action" id="calendar-cancel">Annuler</button>${id ? '<button type="button" id="delete-milestone" class="text-action">Retirer l’échéance</button>' : ''}</div></form>`);
    const undo = () => { p.state.milestones = p.state.milestones.filter(item => item.id !== id); if (previous) p.state.milestones.push(previous); this.refresh('#calendar-add'); };
    document.querySelector('#milestone-form').onsubmit = event => {
      event.preventDefault(); const record = this.saveMilestone(Object.fromEntries(new FormData(event.target)),id);
      if (!record) { document.querySelector('#milestone-error').textContent = 'Renseigne un titre et une date valide.'; return; }
      this.selected = this.cursor = record.date; dialog.close(); this.refresh('#calendar-add');
      p.notifyChange('Échéance enregistrée',() => { p.state.milestones = p.state.milestones.filter(item => item.id !== record.id); if (previous) p.state.milestones.push(previous); this.refresh('#calendar-add'); });
    };
    document.querySelector('#delete-milestone')?.addEventListener('click',() => {
      p.state.milestones = p.state.milestones.filter(item => item.id !== id); dialog.close(); this.refresh('#calendar-add'); p.notifyChange('Échéance retirée',undo);
    });
  },
  conflicts(proposed,excluded = new Set()) {
    return this.conflictDates(proposed,excluded).length > 0;
  },
  conflictDates(proposed,excluded = new Set()) {
    const current = window.Parcours.state.calendar.filter(entry => !excluded.has(entry.id));
    return [...new Set(proposed.map(entry => entry.date))].flatMap(date => {
      const incoming = proposed.filter(entry => entry.date === date);
      const existing = current.filter(entry => entry.date === date && incoming.some(item => item.type !== entry.type));
      return existing.length ? [{date,incoming,existing}] : [];
    });
  },
  duplicateDates(proposed,excluded = new Set()) {
    return [...new Set(proposed.filter(entry => entry.type === 'session' && window.Parcours.state.calendar.some(other => !excluded.has(other.id) && other.type === entry.type && other.sourceId === entry.sourceId && other.date === entry.date)).map(entry => entry.date))];
  },
  applyPlacement(proposed,excluded = new Set(),replace = []) {
    const p = window.Parcours, removeIds = new Set([...excluded,...replace.map(entry => entry.id)]);
    const removed = p.state.calendar.filter(entry => removeIds.has(entry.id));
    if (!this.canChange(removed)) return null;
    const remaining = p.state.calendar.filter(entry => !removeIds.has(entry.id));
    const rests = new Set(remaining.filter(entry => entry.type === 'rest').map(entry => entry.date));
    const added = proposed.filter(entry => { if (entry.type !== 'rest') return true; if (rests.has(entry.date)) return false; rests.add(entry.date); return true; });
    p.state.calendar = [...remaining,...added];
    return {removed:structuredClone(removed),added:added.map(entry => entry.id)};
  },
  clearPlacementResolution() {
    const error = document.querySelector('#calendar-error'); if (!error) return;
    const submit = error.closest('form')?.querySelector('[type="submit"]'); if (submit) submit.disabled = false;
    error.replaceChildren();
  },
  requestPlacement(proposed,excluded,apply,checkDuplicates = false) {
    const p = window.Parcours, error = document.querySelector('#calendar-error');
    const duplicates = checkDuplicates ? this.duplicateDates(proposed,excluded) : [];
    const submit = error?.closest('form')?.querySelector('[type="submit"]');
    if (duplicates.length) {
      if (submit) submit.disabled = true;
      error.innerHTML = `<p>Déjà planifié pour ${duplicates.map(date => p.escape(this.label(date))).join(', ')}. Les séances existantes seront conservées.</p><button type="button" class="landing-button" id="confirm-duplicate-placement">Ajouter quand même une autre séance</button><button type="button" class="text-action" id="cancel-placement-resolution">Garder le planning existant</button>`;
      error.querySelector('#cancel-placement-resolution').onclick = () => this.clearPlacementResolution();
      error.querySelector('#confirm-duplicate-placement').onclick = event => { event.target.disabled = true; this.requestPlacement(proposed,excluded,apply); };
      return;
    }
    const conflicts = this.conflictDates(proposed,excluded);
    if (!conflicts.length) { apply(proposed,[]); return; }
    if (submit) submit.disabled = true;
    error.innerHTML = `<div id="placement-resolutions"><p>Choisis le contenu de chaque date en conflit. Rien n’est remplacé avant confirmation.</p>${conflicts.map(({date,existing}) => `<fieldset><legend>${p.escape(this.label(date))}</legend><p>${existing.map(entry => p.escape(entry.type === 'rest' ? 'Repos' : entry.session.name)).join(' · ')}</p><label class="tracking-choice"><input type="radio" name="resolution-${date}" value="keep" checked>Garder le contenu existant, ignorer l’ajout à cette date</label><label class="tracking-choice"><input type="radio" name="resolution-${date}" value="replace" ${existing.some(entry => this.isLocked(entry)) ? 'disabled' : ''}>Remplacer ce contenu par l’ajout demandé</label>${existing.some(entry => this.isLocked(entry)) ? '<p>Séance commencée ou terminée : son contenu est protégé.</p>' : ''}</fieldset>`).join('')}<button type="button" class="landing-button" id="apply-placement-resolutions">Appliquer ces choix</button><button type="button" class="text-action" id="cancel-placement-resolution">Changer la destination</button></div>`;
    error.querySelector('#cancel-placement-resolution').onclick = () => { const form = error.closest('form'); this.clearPlacementResolution(); if (form) form.querySelector('[name=date]')?.focus(); else document.querySelector('#calendar-dialog').close(); };
    error.querySelector('#apply-placement-resolutions').onclick = event => {
      const skipped = new Set(), replaced = [];
      for (const conflict of conflicts) {
        const choice = error.querySelector(`[name="resolution-${conflict.date}"]:checked`).value;
        if (choice === 'keep') skipped.add(conflict.date); else replaced.push(...conflict.existing);
      }
      const accepted = proposed.filter(entry => !skipped.has(entry.date));
      if (!accepted.length) { this.clearPlacementResolution(); error.textContent = 'Aucun ajout demandé à conserver. Change la destination ou ferme le panneau ; le planning reste intact.'; return; }
      // A partial move keeps the source objects whose destination was skipped.
      const acceptedIds = new Set(accepted.map(entry => entry.id));
      const effectiveExcluded = new Set([...excluded].filter(id => acceptedIds.has(id)));
      if (!this.canChange(replaced)) return;
      event.target.disabled = true; apply(accepted,replaced,effectiveExcluded);
    };
  },
  schedule(source,date = this.today()) {
    const p = window.Parcours, program = source.organization !== 'Séance seule';
    const start = program ? this.monday(date) : date;
    const dialog = this.dialog(program ? 'Planifier le programme' : 'Planifier la séance',`<form id="calendar-schedule"><p class="landing-hint">${p.escape(source.name)}${program ? ' · La répartition est répétée automatiquement ; chaque date reste modifiable.' : ''}</p><label>${program ? 'Lundi de départ' : 'Date'}<input name="date" type="date" value="${start}" required></label>${program ? `<label>Nombre de semaines<input name="weeks" type="number" min="1" max="104" step="1" value="${source.weeks || 1}" required></label>` : ''}<div id="schedule-warnings" role="status"></div><p class="error" id="calendar-error" role="alert"></p><div class="week-actions"><button type="submit" class="primary-action">Ajouter au calendrier</button><button type="button" id="calendar-cancel" class="text-action">Annuler</button></div></form>`);
    const scheduleForm = document.querySelector('#calendar-schedule');
    const warnings = () => {
      const date = scheduleForm.elements.date.value; if (!date) return;
      const messages = new Set();
      if (!program) window.Disponibilites.warnings(source,date).forEach(message => messages.add(message));
      else for (let week=0; week<Math.min(104,Number(scheduleForm.elements.weeks.value)); week++) {
        (source.cycleWeeks?.[week] || source.days || []).forEach((day,index) => {
          if (day.type === 'session') window.Disponibilites.warnings({...source,...day},this.plus(date,week*7+index)).forEach(message => messages.add(`${window.Semaine.days[index]} : ${message}`));
        });
      }
      document.querySelector('#schedule-warnings').innerHTML = [...messages].map(message => `<p class="availability-warning">${p.escape(message)} · planification possible.</p>`).join('');
    };
    scheduleForm.oninput = event => { if (event.target.closest('#calendar-error')) return; this.clearPlacementResolution(); warnings(); }; warnings();
    scheduleForm.onsubmit = event => {
      event.preventDefault(); const form = event.target, date = form.elements.date.value, proposed = [];
      const cycleId = source.organization === 'Mésocycle' ? crypto.randomUUID() : null;
      if (program && this.monday(date) !== date) { document.querySelector('#calendar-error').textContent = 'Choisis un lundi pour conserver la répartition de la semaine.'; return; }
      if (program) {
        for (let week=0; week<Number(form.elements.weeks.value); week++) {
          const days = source.cycleWeeks?.[week] || source.days || [];
          days.forEach((day,index) => {
            if (day.type === 'undefined') return;
            proposed.push({id:crypto.randomUUID(),date:this.plus(date,week*7+index),type:day.type,sourceId:source.id,...(cycleId ? {cycleId,templateDay:index,cycleStart:date,cycleEnd:this.plus(date,Number(form.elements.weeks.value)*7-1)} : {}),...(day.type === 'session' ? {session:this.snapshot({...day,equipment:source.equipment,group:source.group,timeBudget:source.timeBudget,availableDays:source.availableDays})} : {})});
          });
        }
      } else proposed.push({id:crypto.randomUUID(),date,type:'session',sourceId:source.id,session:this.snapshot(source)});
      if (!proposed.length) { document.querySelector('#calendar-error').textContent = 'Configure au moins une séance ou un repos dans cette semaine avant de la planifier.'; return; }
      this.requestPlacement(proposed,new Set(),(accepted,replaced) => {
        const change = this.applyPlacement(accepted,new Set(),replaced); if (!change) return;
        this.selected = this.cursor = accepted[0].date; dialog.close(); this.refresh('#calendar-add'); this.undoPlacement(change.removed,change.added,`Planning ajouté · ${source.name}`);
      },true);
    };
  },
  open(id) {
    const entry = window.Parcours.state.calendar.find(item => item.id === id);
    if (!entry) return;
    this.selected = this.cursor = entry.date;
    if (entry.type === 'session') {
      const record = window.Parcours.state.completedSessions.find(record => record.executionKey === id);
      if (record) window.BilanSeance.open(record.id);
      else if (window.Parcours.state.trainingDrafts[id]) window.Entrainement.resume(id);
      else window.ConfigurationSeance.open(entry.session,null,id);
      return;
    }
    this.dialog(`Repos · ${this.label(entry.date)}`,`<p class="landing-section">Journée de récupération.</p><div class="week-actions"><button id="calendar-remove" type="button" class="landing-button">Retirer le repos</button><button id="calendar-cancel" type="button" class="text-action">Fermer</button></div>`);
    document.querySelector('#calendar-remove').onclick = () => { window.Parcours.state.calendar = window.Parcours.state.calendar.filter(item => item.id !== id); document.querySelector('#calendar-dialog').close(); this.refresh('#calendar-add'); this.undoPlacement([entry],[],'Repos retiré'); };
  },
  transfer(id) {
    const p = window.Parcours, entry = p.state.calendar.find(item => item.id === id);
    if (!entry || !this.canChange([entry])) return;
    const dialog = document.querySelector('#exercise-dialog');
    document.querySelector('#exercise-title').textContent = 'Déplacer ou dupliquer la séance';
    document.querySelector('#exercise-fields').innerHTML = `<form id="calendar-transfer"><label>Date de destination<input name="date" type="date" value="${entry.date}" required></label>${p.select('Action','action',[['move','Déplacer'],['copy','Dupliquer']])}<p id="calendar-error" class="error" role="alert"></p><div class="week-actions"><button type="submit" class="primary-action">Enregistrer</button><button id="cancel-transfer" type="button" class="text-action">Annuler</button></div></form>`;
    document.querySelector('#cancel-transfer').onclick = () => dialog.close();
    document.querySelector('#calendar-transfer').oninput = event => { if (!event.target.closest('#calendar-error')) this.clearPlacementResolution(); };
    document.querySelector('#calendar-transfer').onsubmit = event => {
      event.preventDefault(); const form = event.target, date = form.elements.date.value;
      const previous = structuredClone(entry);
      const proposed = {...structuredClone(entry),date};
      delete proposed.newWorkout;

      const copy = form.elements.action.value === 'copy';
      if (copy) { proposed.id = crypto.randomUUID(); this.detachCycle(proposed); delete proposed.repetitionKey; }
      else if (proposed.cycleId && (date < proposed.cycleStart || date > proposed.cycleEnd)) this.detachCycle(proposed);
      const excluded = new Set(copy ? [] : [id]);
      this.requestPlacement([proposed],excluded,(accepted,replaced) => {
        const change = this.applyPlacement(accepted,excluded,replaced); if (!change) return;
        this.selected = this.cursor = date; dialog.close(); this.refresh('#calendar-add'); this.undoPlacement(change.removed,change.added,copy ? 'Séance dupliquée' : 'Séance déplacée');
      },copy);
    };
    dialog.showModal();
  },
  copyWeek() {
    const p = window.Parcours, start = this.monday(this.selected), end = this.plus(start,7);
    const entries = p.state.calendar.filter(entry => entry.date >= start && entry.date < end);
    const dialog = this.dialog('Copier / déplacer la semaine',`<form id="calendar-week-copy"><p class="landing-hint">Semaine du ${this.label(start)} · ${window.Ergonomie.count(entries.length,'élément')}. Les copies auront leurs propres objectifs.</p>${p.select('Action','action',[['copy','Copier et répéter'],['move','Déplacer la semaine']])}<label>Lundi de destination<input name="date" type="date" value="${this.plus(start,7)}" required></label><label id="repeat-count">Nombre de copies hebdomadaires<input name="count" type="number" min="1" max="104" step="1" value="1" required></label><p id="calendar-error" class="error" role="alert"></p><div class="week-actions"><button type="submit" class="primary-action">Appliquer</button><button id="calendar-cancel" type="button" class="text-action">Annuler</button></div></form>`);
    const form = document.querySelector('#calendar-week-copy');
    form.oninput = event => { if (!event.target.closest('#calendar-error')) this.clearPlacementResolution(); };
    form.elements.action.onchange = () => { const move = form.elements.action.value === 'move'; document.querySelector('#repeat-count').hidden = move; form.elements.count.disabled = move; };
    form.onsubmit = event => {
      event.preventDefault(); const date = form.elements.date.value, move = form.elements.action.value === 'move';
      const count = move ? 1 : Number(form.elements.count.value);
      if (move && !this.canChange(entries)) return;
      if (!entries.length) { document.querySelector('#calendar-error').textContent = 'Cette semaine est vide.'; return; }
      if (this.monday(date) !== date) { document.querySelector('#calendar-error').textContent = 'Choisis un lundi.'; return; }
      if (!move && date <= start && this.plus(date,(count-1)*7) >= start) { document.querySelector('#calendar-error').textContent = 'Les copies doivent être en dehors de la semaine d’origine.'; return; }
      const proposed = Array.from({length:count},(_,week) => entries.map(entry => ({...structuredClone(entry),id:move ? entry.id : crypto.randomUUID(),date:this.plus(date,week*7+(this.date(entry.date).getDay()+6)%7),...(!move && entry.type === 'session' ? {repetitionKey:this.repeatGroup(entry) || entry.id} : {})}))).flat();
      proposed.forEach(entry => { if (!move || entry.cycleId && (entry.date < entry.cycleStart || entry.date > entry.cycleEnd)) this.detachCycle(entry); });
      const excluded = new Set(move ? entries.map(entry => entry.id) : []);
      this.requestPlacement(proposed,excluded,(accepted,replaced,effectiveExcluded = excluded) => {
        const change = this.applyPlacement(accepted,effectiveExcluded,replaced); if (!change) return;
        this.selected = this.cursor = accepted[0].date; dialog.close(); this.refresh('#calendar-add'); this.undoPlacement(change.removed,change.added,move ? 'Semaine déplacée' : 'Semaine répétée');
      },!move);
    };
  }
};
