'use strict';

window.Calendrier = {
  mode:'month',
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
    return [session.duration ? `≈ ${session.duration} min` : '',`${(session.exercises || []).length} exercices`,session.group || (session.groups || []).join(', '),session.equipment].filter(Boolean).join(' · ');
  },
  render() {
    const p = window.Parcours;
    if (!this.selected) { this.selected = p.state.ui.selectedDate || this.today(); this.mode = p.state.ui.calendarMode || 'month'; } this.cursor ||= this.selected;
    const first = this.mode === 'month' ? `${this.cursor.slice(0,7)}-01` : this.monday(this.cursor);
    const start = this.monday(first);
    const last = new Date(this.date(first).getFullYear(),this.date(first).getMonth()+1,0,12);
    const count = this.mode === 'month' ? Math.ceil((((this.date(first).getDay()+6)%7)+last.getDate())/7)*7 : 7;
    const title = this.mode === 'month' ? this.label(first,{month:'long',year:'numeric'}) : `${this.label(start,{day:'numeric',month:'short'})} – ${this.label(this.plus(start,6),{day:'numeric',month:'short',year:'numeric'})}`;
    const selected = this.entries(this.selected);
    return `<div class="calendar-heading"><div><p class="calendar-eyebrow">MON PLANNING</p><h1 tabindex="-1">Calendrier</h1></div><button type="button" id="calendar-add" class="primary-action">+ Ajouter</button></div>
      <div class="calendar-toolbar"><div class="calendar-switch" aria-label="Vue du calendrier"><button type="button" data-mode="month" aria-pressed="${this.mode === 'month'}">Mois</button><button type="button" data-mode="week" aria-pressed="${this.mode === 'week'}">Semaine</button></div><button type="button" class="text-action" id="calendar-today">Aujourd’hui</button></div>
      <div class="calendar-period"><h2>${title}</h2><div><button type="button" class="landing-button" data-period="-1" aria-label="Période précédente">‹</button><button type="button" class="landing-button" data-period="1" aria-label="Période suivante">›</button></div></div>
      <div class="calendar-grid ${this.mode === 'week' ? 'is-week' : ''}" aria-label="${p.escape(title)}">${['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'].map(day => `<span class="calendar-weekday">${day}</span>`).join('')}${Array.from({length:count},(_,index) => {
        const date = this.plus(start,index), entries = this.entries(date);
        return `<div class="calendar-cell ${date.slice(0,7) !== this.cursor.slice(0,7) && this.mode === 'month' ? 'is-outside' : ''} ${date === this.selected ? 'is-selected' : ''}" data-drop-date="${date}"><button class="calendar-date" type="button" data-date="${date}" aria-label="${this.label(date)}${entries.length ? `, ${entries.map(entry => entry.type === 'rest' ? 'Repos' : p.escape(entry.session.name)).join(', ')}` : ''}" aria-pressed="${date === this.selected}" ${date === this.today() ? 'aria-current="date"' : ''}><span>${this.date(date).getDate()}</span></button><div class="calendar-markers">${entries.slice(0,1).map(entry => `<span class="calendar-chip is-${entry.type}" aria-label="${p.escape(entry.type === 'rest' ? 'Repos' : entry.session.name)} · ${this.label(date)}"><span>${entry.type === 'rest' ? 'Repos' : p.escape(entry.session.name)}</span></span>`).join('')}${entries.length > 1 ? `<span class="calendar-overflow">+${entries.length-1}</span>` : ''}</div></div>`;
      }).join('')}</div>
      <div class="calendar-legend"><span class="legend-session">Séance</span><span class="legend-rest">Repos</span></div>
      <section class="calendar-selected" aria-labelledby="selected-date-title"><div class="landing-row"><div><p class="calendar-eyebrow">${this.selected === this.today() ? 'AUJOURD’HUI' : 'JOUR SÉLECTIONNÉ'}</p><h2 id="selected-date-title">${this.label(this.selected)}</h2></div><button type="button" class="landing-button" id="day-add" aria-label="Ajouter au jour sélectionné">+</button></div><div class="calendar-agenda">${selected.length ? selected.map(entry => `<div class="agenda-row"><button type="button" class="agenda-card is-${entry.type}" data-entry="${entry.id}" draggable="true"><span class="agenda-symbol" aria-hidden="true">${entry.type === 'rest' ? '☾' : '▥'}</span><span><small>${entry.type === 'rest' ? 'RÉCUPÉRATION' : 'SÉANCE PRÉVUE'}</small><strong>${entry.type === 'rest' ? 'Repos' : p.escape(entry.session.name)}</strong>${entry.type === 'session' ? `<span>${p.escape(this.meta(entry.session))}</span><small>Voir les exercices et les objectifs →</small>` : '<span>Une journée pour récupérer.</span>'}</span></button>${entry.type === 'session' && p.state.trainingDrafts[entry.id] ? `<button class="resume-workout landing-button" type="button" data-resume="${entry.id}">En cours · Reprendre</button>` : ''}</div>`).join('') : '<p class="calendar-empty">Rien de prévu pour ce jour.<br>Ajoute une séance ou un jour de repos.</p>'}</div></section>
      <button type="button" class="text-action calendar-week-action" id="calendar-copy-week">Copier / déplacer cette semaine</button>
      <dialog id="calendar-dialog" class="calendar-dialog" aria-labelledby="calendar-dialog-title"><h2 id="calendar-dialog-title"></h2><div id="calendar-dialog-content"></div></dialog>`;
  },
  refresh(focus) {
    window.Parcours.state.ui.selectedDate = this.selected; window.Parcours.state.ui.calendarMode = this.mode;
    window.Parcours.route('mine');
    if (focus) document.querySelector(focus)?.focus({preventScroll:true});
  },
  bind() {
    document.querySelector('#calendar-add').onclick = () => this.choose(this.selected);
    document.querySelector('#day-add').onclick = () => this.choose(this.selected);
    document.querySelector('#calendar-today').onclick = () => { this.selected = this.cursor = this.today(); this.refresh('#calendar-today'); };
    document.querySelector('#calendar-copy-week').onclick = () => this.copyWeek();
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
    if (!entry || !date) return;
    if (this.conflicts([{...entry,date}],new Set([id]))) {
      document.querySelectorAll('.is-drop-target').forEach(cell => cell.classList.remove('is-drop-target'));
      window.Parcours.notify('Retire le repos ou les séances en conflit avant de déplacer.'); return;
    }
    const previous = structuredClone(entry);
    entry.date = date;
    if (entry.cycleId && (date < entry.cycleStart || date > entry.cycleEnd)) this.detachCycle(entry);
    this.selected = this.cursor = date;
    this.refresh(`[data-entry="${id}"]`); this.undoPlacement([previous],[id],'Séance déplacée');
  },
  click(event) {
    const resume = event.target.closest('[data-resume]');
    if (resume) { const item = window.Parcours.state.calendar.find(item => item.id === resume.dataset.resume); window.ConfigurationSeance.open(item.session,null,item.id); window.Entrainement.open(item.session,item.id,item.date); return true; }
    const mode = event.target.closest('[data-mode]'), period = event.target.closest('[data-period]'), date = event.target.closest('[data-date]'), entry = event.target.closest('[data-entry]'), schedule = event.target.closest('[data-schedule]');
    if (mode) { this.mode = mode.dataset.mode; this.cursor = this.selected; this.refresh(`[data-mode="${this.mode}"]`); }
    else if (period) {
      const step = Number(period.dataset.period);
      if (this.mode === 'month') { const next = this.date(`${this.cursor.slice(0,7)}-01`); next.setMonth(next.getMonth()+step); this.cursor = this.key(next); }
      else this.cursor = this.plus(this.cursor,step*7);
      this.selected = this.cursor; this.refresh(`[data-period="${step}"]`);
    }
    else if (date) { this.selected = date.dataset.date; this.refresh(`[data-date="${this.selected}"]`); if (!this.entries(this.selected).length) this.choose(this.selected); }
    else if (entry) this.open(entry.dataset.entry);
    else if (schedule) this.schedule(window.Parcours.state.saved.find(item => item.id === schedule.dataset.schedule));
    return !!(mode || period || date || entry || schedule);
  },
  dialog(title,content) {
    document.querySelector('#calendar-dialog-title').textContent = title;
    document.querySelector('#calendar-dialog-content').innerHTML = content;
    const dialog = document.querySelector('#calendar-dialog');
    document.querySelector('#calendar-cancel').onclick = () => dialog.close();
    if (!dialog.open) dialog.showModal();
    return dialog;
  },
  undoPlacement(removed,added,message) {
    const p = window.Parcours;
    p.notify(message,() => {
      p.state.calendar = p.state.calendar.filter(entry => !added.includes(entry.id) && !removed.some(old => old.id === entry.id));
      p.state.calendar.push(...structuredClone(removed)); this.refresh('#day-add');
    });
  },
  choose(date) {
    const p = window.Parcours; this.selected = this.cursor = date;
    this.dialog(`Ajouter · ${this.label(date)}`,`<label>Rechercher dans mes entraînements<input id="calendar-workout-search" type="search" placeholder="Nom de séance ou programme"></label><div id="calendar-saved-results" class="picker-results"></div><details class="expert-tools"><summary>Placer sur plusieurs jours</summary><fieldset class="batch-days"><legend>Jours de cette semaine</legend>${window.Semaine.days.map((name,index) => { const value = this.plus(this.monday(date),index); return `<label><input type="checkbox" name="placement-date" value="${value}" ${value === date ? 'checked' : ''}>${name.slice(0,3)} ${this.date(value).getDate()}</label>`; }).join('')}</fieldset></details><div class="calendar-choices"><button type="button" id="calendar-create" class="landing-button">Créer une séance</button><button type="button" id="calendar-rest" class="landing-button">☾ Marquer comme repos</button><p id="calendar-error" class="error" role="alert"></p><button type="button" id="calendar-cancel" class="text-action">Fermer</button></div>`);
    const refresh = () => {
      const search = window.Ergonomie.normalize(document.querySelector('#calendar-workout-search').value);
      const saved = p.state.saved.filter(item => window.Ergonomie.normalize(item.name).includes(search));
      document.querySelector('#calendar-saved-results').innerHTML = saved.length ? saved.map(item => `<button type="button" class="picker-result" data-pick="${item.id}"><span><strong>${p.escape(item.name)}</strong><small>${p.escape(item.organization)} · Enregistré</small></span><span>${item.organization === 'Séance seule' ? '+ Ajouter' : 'Planifier'}</span></button>`).join('') : '<p>Aucun entraînement trouvé. Crée une séance ci-dessous ou enregistre-en une depuis Découvrir.</p>';
    };
    document.querySelector('#calendar-workout-search').oninput = refresh;
    document.querySelector('#calendar-saved-results').onclick = event => {
      const button = event.target.closest('[data-pick]'); if (!button) return;
      const source = p.state.saved.find(item => item.id === button.dataset.pick);
      if (source.organization !== 'Séance seule') { this.schedule(source,date); return; }
      const dates = [...document.querySelectorAll('[name="placement-date"]:checked')].map(input => input.value);
      if (!dates.length) { document.querySelector('#calendar-error').textContent = 'Sélectionne au moins un jour.'; return; }
      this.quickAdd(source,dates);
    };
    document.querySelector('#calendar-create').onclick = () => {
      const create = () => { this.creationDate = date; p.state.creationDraft = {...(p.state.creationDraft || {}),organization:'Séance seule'}; document.querySelector('#calendar-dialog').close(); p.route('create'); };
      const rests = this.entries(date).filter(entry => entry.type === 'rest');
      if (rests.length) window.Ergonomie.confirm('Remplacer le repos ?',`Créer une séance le ${this.label(date)} remplace le repos.`,() => { this.creationRestIds = rests.map(entry => entry.id); create(); },'Remplacer et créer'); else create();
    };
    document.querySelector('#calendar-rest').onclick = () => {
      const removed = structuredClone(this.entries(date));
      const apply = () => {
        p.state.calendar = p.state.calendar.filter(entry => entry.date !== date);
        const rest = {id:crypto.randomUUID(),date,type:'rest'}; p.state.calendar.push(rest);
        document.querySelector('#calendar-dialog').close(); this.refresh('#day-add'); this.undoPlacement(removed,[rest.id],'Jour marqué comme repos');
      };
      if (removed.some(entry => entry.type === 'session')) window.Ergonomie.confirm('Remplacer les séances par du repos ?',`${removed.filter(entry => entry.type === 'session').length} séance(s) et leurs objectifs seront retirés du ${this.label(date)}.`,apply,'Remplacer par du repos'); else apply();
    };
    refresh();
  },
  quickAdd(source,dates) {
    const p = window.Parcours, rests = p.state.calendar.filter(entry => dates.includes(entry.date) && entry.type === 'rest');
    const apply = () => {
      p.state.calendar = p.state.calendar.filter(entry => !rests.includes(entry));
      const added = dates.map(date => this.addSession(source,date).id);
      document.querySelector('#calendar-dialog')?.close(); this.selected = this.cursor = dates[0]; this.refresh('#day-add');
      this.undoPlacement(rests,added,`${source.name} ajouté · ${dates.map(date => this.label(date,{day:'numeric',month:'short'})).join(', ')}`);
    };
    if (rests.length) window.Ergonomie.confirm('Remplacer le repos par cette séance ?',`Repos concerné : ${rests.map(entry => this.label(entry.date)).join(', ')}.`,apply,'Remplacer et ajouter'); else apply();
  },
  conflicts(proposed,excluded = new Set()) {
    const all = [...window.Parcours.state.calendar.filter(entry => !excluded.has(entry.id)),...proposed];
    return proposed.some(entry => all.some(other => other.date === entry.date && other.type !== entry.type));
  },
  schedule(source,date = this.selected) {
    const p = window.Parcours, program = source.organization !== 'Séance seule';
    const start = program ? this.monday(date) : date;
    const dialog = this.dialog(program ? 'Planifier le programme' : 'Planifier la séance',`<form id="calendar-schedule"><p class="landing-hint">${p.escape(source.name)}${program ? ' · La répartition est répétée automatiquement ; chaque date reste modifiable.' : ''}</p><label>${program ? 'Lundi de départ' : 'Date'}<input name="date" type="date" value="${start}" required></label>${program ? `<label>Nombre de semaines<input name="weeks" type="number" min="1" max="104" step="1" value="${source.weeks || 1}" required></label>` : ''}<p class="error" id="calendar-error" role="alert"></p><div class="week-actions"><button type="submit" class="primary-action">Ajouter au calendrier</button><button type="button" id="calendar-cancel" class="text-action">Annuler</button></div></form>`);
    document.querySelector('#calendar-schedule').onsubmit = event => {
      event.preventDefault(); const form = event.target, date = form.elements.date.value, proposed = [];
      const cycleId = source.organization === 'Mésocycle' ? crypto.randomUUID() : null;
      if (program && this.monday(date) !== date) { document.querySelector('#calendar-error').textContent = 'Choisis un lundi pour conserver la répartition de la semaine.'; return; }
      if (program) {
        for (let week=0; week<Number(form.elements.weeks.value); week++) {
          const days = source.cycleWeeks?.[week] || source.days || [];
          days.forEach((day,index) => {
            if (day.type === 'undefined') return;
            proposed.push({id:crypto.randomUUID(),date:this.plus(date,week*7+index),type:day.type,sourceId:source.id,...(cycleId ? {cycleId,templateDay:index,cycleStart:date,cycleEnd:this.plus(date,Number(form.elements.weeks.value)*7-1)} : {}),...(day.type === 'session' ? {session:this.snapshot({...day,equipment:source.equipment,group:source.group})} : {})});
          });
        }
      } else proposed.push({id:crypto.randomUUID(),date,type:'session',sourceId:source.id,session:this.snapshot(source)});
      if (!proposed.length) { document.querySelector('#calendar-error').textContent = 'Configure au moins une séance ou un repos dans cette semaine avant de la planifier.'; return; }
      if (this.conflicts(proposed)) { document.querySelector('#calendar-error').textContent = 'Un repos et une séance seraient placés le même jour. Retire les éléments en conflit avant de réessayer.'; return; }
      // Un deuxième repos sur une même date n’apporte aucune information.
      const rests = new Set(p.state.calendar.filter(entry => entry.type === 'rest').map(entry => entry.date));
      p.state.calendar.push(...proposed.filter(entry => { if (entry.type !== 'rest') return true; if (rests.has(entry.date)) return false; rests.add(entry.date); return true; }));
      this.selected = this.cursor = date; dialog.close(); this.refresh('#day-add'); p.notify('Planning ajouté au calendrier');
    };
  },
  open(id) {
    const entry = window.Parcours.state.calendar.find(item => item.id === id);
    if (!entry) return;
    this.selected = this.cursor = entry.date;
    if (entry.type === 'session') { window.ConfigurationSeance.open(entry.session,null,id); return; }
    this.dialog(`Repos · ${this.label(entry.date)}`,`<p class="landing-section">Journée de récupération.</p><div class="week-actions"><button id="calendar-remove" type="button" class="landing-button">Retirer le repos</button><button id="calendar-cancel" type="button" class="text-action">Fermer</button></div>`);
    document.querySelector('#calendar-remove').onclick = () => { window.Parcours.state.calendar = window.Parcours.state.calendar.filter(item => item.id !== id); document.querySelector('#calendar-dialog').close(); this.refresh('#day-add'); this.undoPlacement([entry],[],'Repos retiré'); };
  },
  transfer(id) {
    const p = window.Parcours, entry = p.state.calendar.find(item => item.id === id);
    const dialog = document.querySelector('#exercise-dialog');
    document.querySelector('#exercise-title').textContent = 'Déplacer ou dupliquer la séance';
    document.querySelector('#exercise-fields').innerHTML = `<form id="calendar-transfer"><label>Date de destination<input name="date" type="date" value="${entry.date}" required></label>${p.select('Action','action',[['move','Déplacer'],['copy','Dupliquer']])}<p id="calendar-error" class="error" role="alert"></p><div class="week-actions"><button type="submit" class="primary-action">Enregistrer</button><button id="cancel-transfer" type="button" class="text-action">Annuler</button></div></form>`;
    document.querySelector('#cancel-transfer').onclick = () => dialog.close();
    document.querySelector('#calendar-transfer').onsubmit = event => {
      event.preventDefault(); const form = event.target, date = form.elements.date.value;
      const previous = structuredClone(entry);
      const proposed = {...structuredClone(entry),date};
      delete proposed.newWorkout;
      if (this.conflicts([proposed],new Set([id]))) { document.querySelector('#calendar-error').textContent = 'Retire le repos sur ce jour avant de placer une séance.'; return; }
      if (entry.newWorkout) delete entry.newWorkout;
      if (form.elements.action.value === 'copy') { proposed.id = crypto.randomUUID(); this.detachCycle(proposed); p.state.calendar.push(proposed); }
      else { entry.date = date; if (entry.cycleId && (date < entry.cycleStart || date > entry.cycleEnd)) this.detachCycle(entry); }
      this.selected = this.cursor = date; dialog.close(); this.refresh('#day-add'); this.undoPlacement(form.elements.action.value === 'copy' ? [] : [previous],[form.elements.action.value === 'copy' ? proposed.id : id],'Calendrier mis à jour');
    };
    dialog.showModal();
  },
  copyWeek() {
    const p = window.Parcours, start = this.monday(this.selected), end = this.plus(start,7);
    const entries = p.state.calendar.filter(entry => entry.date >= start && entry.date < end);
    const dialog = this.dialog('Copier / déplacer la semaine',`<form id="calendar-week-copy"><p class="landing-hint">Semaine du ${this.label(start)} · ${entries.length} élément(s). Les copies auront leurs propres objectifs.</p>${p.select('Action','action',[['copy','Copier et répéter'],['move','Déplacer la semaine']])}<label>Lundi de destination<input name="date" type="date" value="${this.plus(start,7)}" required></label><label id="repeat-count">Nombre de copies hebdomadaires<input name="count" type="number" min="1" max="104" step="1" value="1" required></label><p id="calendar-error" class="error" role="alert"></p><div class="week-actions"><button type="submit" class="primary-action">Appliquer</button><button id="calendar-cancel" type="button" class="text-action">Annuler</button></div></form>`);
    const form = document.querySelector('#calendar-week-copy');
    form.elements.action.onchange = () => { const move = form.elements.action.value === 'move'; document.querySelector('#repeat-count').hidden = move; form.elements.count.disabled = move; };
    form.onsubmit = event => {
      event.preventDefault(); const date = form.elements.date.value, move = form.elements.action.value === 'move';
      const count = move ? 1 : Number(form.elements.count.value);
      if (!entries.length) { document.querySelector('#calendar-error').textContent = 'Cette semaine est vide.'; return; }
      if (this.monday(date) !== date) { document.querySelector('#calendar-error').textContent = 'Choisis un lundi.'; return; }
      if (!move && date <= start && this.plus(date,(count-1)*7) >= start) { document.querySelector('#calendar-error').textContent = 'Les copies doivent être en dehors de la semaine d’origine.'; return; }
      const proposed = Array.from({length:count},(_,week) => entries.map(entry => ({...structuredClone(entry),id:move ? entry.id : crypto.randomUUID(),date:this.plus(date,week*7+(this.date(entry.date).getDay()+6)%7)}))).flat();
      proposed.forEach(entry => { if (!move || entry.cycleId && (entry.date < entry.cycleStart || entry.date > entry.cycleEnd)) this.detachCycle(entry); });
      const excluded = new Set(move ? entries.map(entry => entry.id) : []);
      if (this.conflicts(proposed,excluded)) { document.querySelector('#calendar-error').textContent = 'Un repos et une séance seraient placés le même jour. Retire les éléments en conflit.'; return; }
      p.state.calendar = p.state.calendar.filter(entry => !excluded.has(entry.id));
      const rests = new Set(p.state.calendar.filter(entry => entry.type === 'rest').map(entry => entry.date));
      p.state.calendar.push(...proposed.filter(entry => { if (entry.type !== 'rest') return true; if (rests.has(entry.date)) return false; rests.add(entry.date); return true; }));
      this.selected = this.cursor = date; dialog.close(); this.refresh('#day-add'); p.notify(move ? 'Semaine déplacée' : 'Semaine répétée');
    };
  }
};
