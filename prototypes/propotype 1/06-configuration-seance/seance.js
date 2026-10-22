'use strict';

window.ConfigurationSeance = {
  trackingOptions:[['rpe','Effort ressenti (RPE), par série'],['feeling','Ressenti global, en fin de séance'],['sleep','Sommeil'],['energy','Énergie / fatigue'],['pain','Douleur'],['notes','Notes personnelles']],
  normalizeSession(source) {
    const session = window.Calendrier.snapshot(source);
    session.tracking ||= {...window.Parcours.state.trackingDefaults};
    session.exercises.forEach((exercise,index) => { exercise.slotId ||= `slot-${index}`; });
    return session;
  },
  open(base,dayIndex = null,calendarId = null) {
    const p = window.Parcours, key = calendarId || `${base.id}:${dayIndex ?? 'single'}`;
    if (calendarId && window.Calendrier.isLocked(p.state.calendar.find(entry => entry.id === calendarId))) { window.Calendrier.open(calendarId); return; }
    if (p.view !== 'workout') this.origin = p.captureLocation?.();
    p.state.preparationDrafts ||= {};
    const draft = p.state.preparationDrafts[key];
    this.rawFields = draft?.rawFields || {};
    this.selectedSlots = new Set(draft?.selectedSlots || []); this.detailSlots = new Set(draft?.detailSlots || []);
    this.bulkFields = {...draft?.bulkFields}; this.bulkOpen = !!draft?.bulkOpen;
    this.calendarId = calendarId;
    this.base = base; this.dayIndex = dayIndex; this.key = key;
    this.target = dayIndex === null ? base : base.days[dayIndex];
    this.original = this.normalizeSession(this.target);
    this.session = draft?.key === key ? structuredClone(draft.session) : structuredClone(this.original);
    this.stage = draft?.key === key || !this.session.exercises.length || this.entry()?.newWorkout ? 'edit' : 'overview';
    p.route('workout');
  },
  entry() { return window.Parcours.state.calendar.find(item => item.id === this.calendarId); },
  changed() {
    window.Parcours.state.preparationDrafts[this.key] = {key:this.key,session:structuredClone(this.session),rawFields:{...this.rawFields},selectedSlots:[...(this.selectedSlots || [])],detailSlots:[...(this.detailSlots || [])],bulkFields:{...this.bulkFields},bulkOpen:!!this.bulkOpen};
    const saved = window.Parcours.persist();
    const status = document.querySelector('#preparation-draft-status'); if (status) status.textContent = saved ? 'Brouillon conservé · enregistre pour appliquer' : 'Sauvegarde indisponible · garde cette page ouverte';
  },
  dirty() { return JSON.stringify(this.session) !== JSON.stringify(this.original); },
  summary(exercise) {
    return [exercise.sets ? `${exercise.sets} séries` : 'Séries à définir',exercise.minReps && exercise.maxReps ? `${exercise.minReps}–${exercise.maxReps} répétitions` : 'Répétitions à définir',exercise.load != null ? `${exercise.load} kg` : 'Charge cible non renseignée',exercise.rpe != null ? `Effort ${exercise.rpe}/10 (RPE)` : ''].filter(Boolean).join(' · ');
  },
  incomplete(exercise) { return !exercise.sets || !exercise.minReps || !exercise.maxReps; },
  numberField(exercise,index,key,label,min,step = '1',max = '') {
    const missing = ['sets','minReps','maxReps'].includes(key) && !exercise[key];
    return `<label>${label}<input type="${['any','0.5'].includes(step) ? 'text' : 'number'}" data-numeric="true" name="${key}-${index}" data-field="${key}" data-index="${index}" min="${min}" step="${step}" ${max ? `max="${max}"` : ''} value="${window.Parcours.escape(this.rawFields?.[`${exercise.slotId}:${key}`] ?? exercise[key] ?? '')}" class="${missing ? 'is-missing' : ''}" aria-describedby="exercise-error-${index}"></label>`;
  },
  card(exercise,index) {
    const p = window.Parcours, item = window.catalogueExercices.find(item => item.id === exercise.exerciseId);
    const missing = this.incomplete(exercise), editing = this.stage === 'edit';
    return `<li class="session-card preparation-card ${missing ? 'is-incomplete' : ''}" data-card="${index}"><div class="preparation-exercise-heading">${editing ? `<label class="bulk-exercise-check"><input type="checkbox" data-bulk-slot="${p.escape(exercise.slotId)}" ${this.selectedSlots?.has(exercise.slotId) ? 'checked' : ''} aria-label="Sélectionner ${p.escape(item?.name)}"></label>` : ''}<img src="${p.escape(item?.image || '../06-configuration-seance/images/personal.svg')}" alt="Illustration : ${p.escape(item?.name || 'Exercice personnel')}" width="88" height="80"><div><h2>${index+1}. ${p.escape(item?.name || 'Exercice personnel')}</h2><p>${p.escape(item?.group || '')}</p><span class="completion-label">${missing ? 'À compléter' : 'Objectifs renseignés'}</span></div></div>
      <p class="exercise-instruction">${p.escape(item?.instruction || 'Aucune consigne renseignée pour ce mouvement.')}</p>
      ${editing ? `<div class="inline-targets">${this.numberField(exercise,index,'sets','Séries',1)}<label>Répétitions<select data-rep-mode="${index}"><option value="range" ${exercise.repMode !== 'fixed' ? 'selected' : ''}>Plage</option><option value="fixed" ${exercise.repMode === 'fixed' ? 'selected' : ''}>Fixes</option></select></label>${this.numberField(exercise,index,'minReps',exercise.repMode === 'fixed' ? 'Répétitions' : 'Minimum',1)}${exercise.repMode === 'fixed' ? '' : this.numberField(exercise,index,'maxReps','Maximum',1)}${this.numberField(exercise,index,'load','Charge cible (kg)',0,'any')}${this.numberField(exercise,index,'rpe','Effort visé (RPE), facultatif',1,'0.5',10)}</div><p class="form-help">Charge facultative · 0 kg = sans charge ajoutée.</p><details class="preparation-details" data-exercise-details="${p.escape(exercise.slotId)}" ${this.detailSlots?.has(exercise.slotId) ? 'open' : ''}><summary>Consignes et réglage<span data-note-summary="${index}">${p.escape([exercise.note,exercise.setting].filter(Boolean).join(' · ') || 'Facultatifs')}</span></summary><label>Consigne personnelle<textarea data-field="note" data-index="${index}" maxlength="500" rows="2">${p.escape(exercise.note)}</textarea></label><label>Réglage du matériel<textarea data-field="setting" data-index="${index}" maxlength="500" rows="2">${p.escape(exercise.setting)}</textarea></label></details><p id="exercise-error-${index}" class="error" role="alert"></p><div class="exercise-actions"><button type="button" class="landing-button" data-up="${index}" ${index === 0 ? 'disabled' : ''} aria-label="Monter ${p.escape(item?.name)}">↑ Monter</button><button type="button" class="landing-button" data-down="${index}" ${index === this.session.exercises.length-1 ? 'disabled' : ''} aria-label="Descendre ${p.escape(item?.name)}">↓ Descendre</button><button type="button" class="text-action" data-replace="${index}">Remplacer</button><button type="button" class="text-action" data-remove="${index}">Retirer</button></div>` : `<p class="prepared-targets">${p.escape(this.summary(exercise))}</p><dl class="prepared-details"><div><dt>Consigne personnelle</dt><dd>${p.escape(exercise.note || 'Non renseignée')}</dd></div><div><dt>Réglage du matériel</dt><dd>${p.escape(exercise.setting || 'Non renseigné')}</dd></div></dl>`}</li>`;
  },
  reviewPoints() {
    const p = window.Parcours, sourceId = this.entry()?.sourceId || this.base.id;
    const exercises = new Set(this.session.exercises.map(exercise => exercise.exerciseId));
    const points = p.state.reviewPoints.filter(point => point.workoutId === sourceId && (!point.exerciseId || exercises.has(point.exerciseId)));
    if (!points.length) return '<p class="review-empty">Aucun point à revoir pour cette séance.</p>';
    return `<section class="review-points"><h2>Points à revoir</h2>${points.length ? points.map(point => { const item = window.catalogueExercices.find(item => item.id === point.exerciseId); return `<article><p><strong>${p.escape(item?.name || 'Cette séance')}</strong>${point.createdAt ? ` · ${p.escape(point.createdAt.slice(0,10))}` : ''}</p><p>${p.escape(point.text)}</p>${point.note ? `<p>Note : ${p.escape(point.note)}</p>` : ''}${point.setting ? `<p>Réglage : ${p.escape(point.setting)}</p>` : ''}</article>`; }).join('') : '<p>Aucun point à revoir pour cette séance.</p>'}<p class="landing-hint">Les résultats comparables et leur analyse seront disponibles dans Progrès.</p></section>`;
  },
  render() {
    const p = window.Parcours, entry = this.entry(), editing = this.stage === 'edit';
    const program = entry && p.state.saved.find(item => item.id === entry.sourceId);
    const cycleWeek = entry?.cycleId ? Math.floor((Date.parse(entry.date+'T00:00:00Z')-Date.parse(entry.cycleStart+'T00:00:00Z'))/604800000)+1 : null;
    const cycleContext = program?.organization === 'Mésocycle' ? `<p class="preparation-cycle">${p.escape(program.name)}${cycleWeek ? ` · Semaine ${cycleWeek}` : ' · Placement indépendant'}</p>` : '';
    const date = entry ? window.Calendrier.label(entry.date) : this.dayIndex !== null ? window.Semaine.days[this.dayIndex] : 'Séance personnelle';
    return `<button id="workout-back" class="text-action" type="button">← ${this.origin?.view === 'discover' ? 'Découvrir' : entry ? 'Calendrier' : this.dayIndex !== null ? 'Ma semaine' : 'Mes entraînements'}</button><p class="week-heading">${p.escape(date)}</p><h1 tabindex="-1">${editing ? 'Adapter la séance' : p.escape(this.session.name)}</h1><p class="preparation-subtitle">${this.stage === 'overview' ? p.escape(window.Calendrier.meta(this.session)) : p.escape(this.session.name)}</p>
      ${cycleContext}<p class="form-help">${p.escape(window.Disponibilites.summary(program || this.session) || '')}</p>${entry ? window.Disponibilites.warnings({...program,...this.session},entry.date).map(message => `<p class="availability-warning">${p.escape(message)} · tu peux conserver cette séance.</p>`).join('') : ''}${!entry && this.dayIndex === null ? '<button type="button" id="session-availability" class="text-action">Durée et disponibilités</button>' : ''}${this.reviewPoints()}${editing ? '<p id="preparation-draft-status" class="draft-status" role="status">Modifications non appliquées · brouillon conservé lors de la saisie</p>' : `<p class="ready-status">Séance prête${this.session.exercises.some(exercise => this.incomplete(exercise)) ? ' · cibles à compléter, facultatives pour commencer' : ''}</p>`}
      <div class="landing-row preparation-actions"><h2>Exercices (${this.session.exercises.length})</h2>${editing ? '<div class="preparation-add-actions"><button id="add-exercise" class="landing-button" type="button">+ Ajouter</button><button id="add-multiple-exercises" class="text-action" type="button">Ajouter plusieurs</button></div>' : '<button id="adapt-session" class="landing-button" type="button">Adapter</button>'}</div>
      ${editing ? this.bulkControls() : ''}<ol class="session-exercises">${this.session.exercises.map((exercise,index) => this.card(exercise,index)).join('')}</ol>${!this.session.exercises.length ? '<p class="preparation-notice">Aucun exercice préparé. Tu peux compléter la séance maintenant ou ouvrir l’écran d’entraînement.</p>' : ''}
      ${editing ? `<section class="landing-section"><h2>Afficher en priorité pendant l’entraînement</h2><p class="form-help">Les autres informations restent accessibles dans les volets facultatifs. Changer un choix ne supprime aucune saisie.</p><div class="tracking-choices">${this.trackingOptions.map(([key,label]) => `<label class="tracking-choice"><input type="checkbox" data-tracking="${key}" ${this.session.tracking[key] ? 'checked' : ''}>${label}</label>`).join('')}</div></section><div class="preparation-footer"><button id="save-preparation" type="button" class="primary-action">${entry ? `Enregistrer pour le ${window.Calendrier.label(entry.date,{day:'numeric',month:'long'})}` : this.dayIndex !== null ? `Enregistrer pour ${window.Semaine.days[this.dayIndex].toLowerCase()}` : 'Enregistrer la séance personnelle'}</button>${this.futureOccurrences().length ? '<button id="extend-preparation" type="button" class="landing-button">Étendre au mésocycle…</button>' : ''}<button id="discard-preparation" type="button" class="text-action">Revenir à la version enregistrée</button></div>` : `<div class="preparation-footer"><button id="start-training" type="button" class="primary-action">${entry && p.state.completedSessions.some(record => record.executionKey === this.key) ? 'Voir le bilan' : p.state.trainingDrafts[this.key] ? 'Reprendre la séance' : 'Commencer la séance'}</button>${entry ? '<button id="calendar-transfer-session" type="button" class="landing-button">Déplacer / Dupliquer</button><button id="calendar-delete-session" type="button" class="text-action">Retirer du calendrier</button>' : ''}</div>`}
      <dialog id="exercise-dialog" class="exercise-dialog" aria-labelledby="exercise-title"><h2 id="exercise-title"></h2><div id="exercise-fields"></div></dialog>`;
  },
  bind() {
    const p = window.Parcours;
    document.querySelector('#workout-back').onclick = () => { if (this.stage === 'edit' && this.dirty()) this.changed(); p.returnTo(this.origin || {view:this.dayIndex !== null ? 'week' : 'mine',identity:p.state.identity,baseId:this.base.id,scroll:0}); };
    document.querySelector('#adapt-session')?.addEventListener('click',() => { this.stage = 'edit'; p.route('workout'); });
    document.querySelector('#session-ready')?.addEventListener('click',() => { this.stage = 'ready'; p.route('workout'); });
    document.querySelector('#session-availability')?.addEventListener('click',() => { window.Disponibilites.open(this.target); });
    document.querySelector('#start-training')?.addEventListener('click',() => window.Entrainement.open(this.target,this.key,this.entry()?.date));
    document.querySelector('#save-preparation')?.addEventListener('click',() => this.save('overview'));
    document.querySelector('#extend-preparation')?.addEventListener('click',() => this.save('overview',true));
    this.bindBulk();
    document.querySelectorAll('[data-exercise-details]').forEach(details => { details.ontoggle = () => { this.detailSlots ||= new Set(); if (details.open) this.detailSlots.add(details.dataset.exerciseDetails); else this.detailSlots.delete(details.dataset.exerciseDetails); this.changed(); }; });
    document.querySelectorAll('[data-rep-mode]').forEach(select => { select.onchange = () => { const exercise = this.session.exercises[Number(select.dataset.repMode)]; exercise.repMode = select.value; if (select.value === 'fixed') { exercise.maxReps = exercise.minReps; delete this.rawFields[`${exercise.slotId}:maxReps`]; } this.changed(); p.route('workout'); document.querySelector(`[data-rep-mode="${select.dataset.repMode}"]`)?.focus(); }; });
    document.querySelector('#save-ready')?.addEventListener('click',() => this.save('ready'));
    document.querySelector('#discard-preparation')?.addEventListener('click',() => this.discard());
    document.querySelector('#add-exercise')?.addEventListener('click',() => this.library());
    document.querySelector('#add-multiple-exercises')?.addEventListener('click',() => this.library(null,'',true));
    for (const [attribute,action] of [['replace',i => this.library(i)],['remove',i => this.remove(i)],['up',i => this.reorder(i,-1)],['down',i => this.reorder(i,1)]]) {
      document.querySelectorAll(`[data-${attribute}]`).forEach(button => { button.onclick = () => action(Number(button.dataset[attribute])); });
    }
    document.querySelectorAll('[data-field]').forEach(input => {
      input.oninput = () => {
        const exercise = this.session.exercises[Number(input.dataset.index)], key = input.dataset.field;
        const numeric = window.Ergonomie.numeric(input);
        this.rawFields[`${exercise.slotId}:${key}`] = input.value;
        if (numeric) this.readNumbers(Number(input.dataset.index),true);
        else {
          exercise[key] = input.value;
          input.closest('[data-card]').querySelector('[data-note-summary]').textContent = [exercise.note,exercise.setting].filter(Boolean).join(' · ') || 'Facultatifs';
        }
        this.changed();
      };
    });
    if (this.stage === 'edit') this.session.exercises.forEach((_,index) => this.readNumbers(index));
    document.querySelectorAll('[data-tracking]').forEach(input => { input.onchange = () => { this.session.tracking[input.dataset.tracking] = input.checked; this.changed(); }; });
    document.querySelector('#calendar-transfer-session')?.addEventListener('click',() => window.Calendrier.transfer(this.calendarId));
    document.querySelector('#calendar-delete-session')?.addEventListener('click',() => {
      if (!window.Calendrier.canChange([this.entry()])) return;
      this.dialog('Retirer cette occurrence ?', '<p>Cette date et ses objectifs seront retirés. Les autres dates et l’entraînement enregistré sont conservés.</p><div class="week-actions"><button id="confirm-calendar-delete" type="button" class="primary-action">Retirer cette occurrence</button><button id="cancel-exercise" type="button" class="text-action">Annuler</button></div>');
      document.querySelector('#confirm-calendar-delete').onclick = () => { p.state.calendar = p.state.calendar.filter(item => item.id !== this.calendarId); delete p.state.preparationDrafts[this.key]; document.querySelector('#exercise-dialog').close(); p.route('mine'); };
    });
  },
  dialog(title,content) {
    document.querySelector('#exercise-title').textContent = title;
    document.querySelector('#exercise-fields').innerHTML = content;
    document.querySelector('#cancel-exercise').onclick = () => document.querySelector('#exercise-dialog').close();
    window.Ergonomie.bind(document.querySelector('#exercise-dialog'));
    document.querySelector('#exercise-dialog').showModal();
  },
  readNumbers(index,editing = false) {
    const exercise = this.session.exercises[index], card = document.querySelector(`[data-card="${index}"]`);
    const fields = [...card.querySelectorAll('.inline-targets input[data-field]')], values = {}, errors = [];
    for (const input of fields) {
      const valid = window.Ergonomie.validateNumber(input), pending = editing && window.Ergonomie.pendingNumber(input);
      input.setAttribute('aria-invalid',String(!valid && !pending));
      if (valid) values[input.dataset.field] = window.Ergonomie.number(input);
      else if (!pending) errors.push(input.validationMessage);
      input.classList.toggle('is-missing',['sets','minReps','maxReps'].includes(input.dataset.field) && input.value === '');
    }
    const pairValid = 'minReps' in values && (exercise.repMode === 'fixed' || 'maxReps' in values);
    const max = exercise.repMode === 'fixed' ? values.minReps : values.maxReps;
    const badRange = pairValid && values.minReps != null && max != null && max < values.minReps;
    if (badRange) {
      const input = fields.find(input => input.dataset.field === 'maxReps');
      input.setCustomValidity('Le maximum des répétitions doit être supérieur ou égal au minimum.'); input.setAttribute('aria-invalid','true'); errors.push(input.validationMessage);
    }
    for (const key of ['sets','load','rpe']) if (key in values && (values[key] !== null || key in exercise)) exercise[key] = values[key];
    if (pairValid && !badRange) { if (values.minReps !== null || 'minReps' in exercise) exercise.minReps = values.minReps; if (max !== null || 'maxReps' in exercise) exercise.maxReps = max; }
    card.querySelector('.completion-label').textContent = errors.length ? 'Valeur à corriger' : this.incomplete(exercise) ? 'À compléter' : 'Objectifs renseignés';
    card.classList.toggle('is-incomplete',this.incomplete(exercise));
    card.querySelector(`#exercise-error-${index}`).textContent = [...new Set(errors)].join(' ');
    return fields.every(input => input.validity.valid);
  },
  validate() {
    let valid = true;
    this.session.exercises.forEach((_,index) => { if (!this.readNumbers(index)) valid = false; });
    if (!valid) document.querySelector('.preparation-card [aria-invalid="true"]')?.focus();
    return valid;
  },
  discard() {
    const p = window.Parcours, key = this.key;
    const before = {key,session:structuredClone(this.session),rawFields:{...this.rawFields},selectedSlots:[...(this.selectedSlots || [])],detailSlots:[...(this.detailSlots || [])],bulkFields:{...this.bulkFields},bulkOpen:!!this.bulkOpen};
    this.session = structuredClone(this.original); delete p.state.preparationDrafts[key]; this.rawFields = {}; this.selectedSlots = new Set(); this.stage = 'overview'; p.route('workout');
    p.notify('Version enregistrée rétablie · brouillon abandonné',() => {
      if (p.state.preparationDrafts[key] || p.state.trainingDrafts[key] || p.state.completedSessions?.some(record => record.executionKey === key)) { p.notify('Un nouveau travail existe pour cette séance. Il est conservé ; le précédent brouillon ne le remplace pas.'); return false; }
      p.state.preparationDrafts[key] = structuredClone(before);
      if (this.key === key && p.view === 'workout') { this.session = structuredClone(before.session); this.rawFields = {...before.rawFields}; this.selectedSlots = new Set(before.selectedSlots); this.detailSlots = new Set(before.detailSlots); this.bulkFields = {...before.bulkFields}; this.bulkOpen = before.bulkOpen; this.stage = 'edit'; p.route('workout'); }
    });
  },
  futureOccurrences() {
    const p = window.Parcours, entry = this.entry();
    if (!entry?.cycleId || p.state.saved.find(item => item.id === entry.sourceId)?.organization !== 'Mésocycle') return [];
    return p.state.calendar.filter(other => other.id !== entry.id && other.type === 'session' && other.cycleId === entry.cycleId && other.templateDay === entry.templateDay && other.date > entry.date && other.date >= window.Calendrier.today() && !p.state.trainingDrafts[other.id] && !p.state.completedSessions?.some(record => record.executionKey === other.id) && !p.state.preparationDrafts?.[other.id]);
  },
  applyExerciseChanges(target) {
    const before = this.original.exercises, after = this.session.exercises;
    const previous = new Map(before.map(exercise => [exercise.slotId,exercise]));
    const current = new Map(after.map(exercise => [exercise.slotId,exercise]));
    const normalized = this.normalizeSession(target);
    let exercises = normalized.exercises.filter(exercise => !previous.has(exercise.slotId) || current.has(exercise.slotId));
    for (const exercise of after) {
      const old = previous.get(exercise.slotId), index = exercises.findIndex(item => item.slotId === exercise.slotId);
      if (!old) { exercises.splice(after.indexOf(exercise),0,structuredClone(exercise)); continue; }
      if (index === -1) continue; // Une occurrence future ayant retiré ce mouvement le reste.
      if (exercise.exerciseId !== old.exerciseId) exercises[index] = structuredClone(exercise);
      else if (exercises[index].exerciseId === old.exerciseId) {
        for (const key of ['sets','minReps','maxReps','load','rpe','note','setting','repMode']) {
          if (exercise[key] !== old[key]) exercises[index][key] = exercise[key];
        }
      }
    }
    if (before.map(item => item.slotId).join() !== after.filter(item => previous.has(item.slotId)).map(item => item.slotId).join()) {
      const order = new Map(after.map((item,index) => [item.slotId,index]));
      exercises.sort((a,b) => (order.get(a.slotId) ?? after.length) - (order.get(b.slotId) ?? after.length));
    }
    target.exercises = exercises;
  },
  changeSummary() {
    const names = Object.fromEntries((window.catalogueExercices || []).map(item => [item.id,item.name]));
    const before = new Map(this.original.exercises.map(exercise => [exercise.slotId,exercise])), after = new Map(this.session.exercises.map(exercise => [exercise.slotId,exercise]));
    const labels = {sets:'Séries',minReps:'Répétitions min.',maxReps:'Répétitions max.',load:'Charge (kg)',rpe:'Effort visé',note:'Consigne personnelle',setting:'Réglage',repMode:'Mode de répétitions'};
    const show = value => value == null || value === '' ? 'non renseigné' : typeof value === 'number' ? value.toLocaleString('fr-FR') : String(value);
    const changes = [];
    for (const exercise of this.session.exercises) {
      const old = before.get(exercise.slotId), name = names[exercise.exerciseId] || 'Exercice personnel';
      if (!old) changes.push(`${name} : ajouté`);
      else if (old.exerciseId !== exercise.exerciseId) changes.push(`${names[old.exerciseId] || 'Exercice'} remplacé par ${name} ; nouvelles cibles`);
      else for (const [key,label] of Object.entries(labels)) if (exercise[key] !== old[key]) changes.push(`${name} · ${label} : ${show(old[key])} → ${show(exercise[key])}`);
    }
    for (const old of before.values()) if (!after.has(old.slotId)) changes.push(`${names[old.exerciseId] || 'Exercice'} : retiré`);
    if (this.original.exercises.map(item => item.slotId).filter(id => after.has(id)).join() !== this.session.exercises.map(item => item.slotId).filter(id => before.has(id)).join()) changes.push('Ordre des exercices modifié');
    return changes;
  },
  save(nextStage,extend = false) {
    if (!this.validate()) return;
    const future = this.futureOccurrences();
    if (!extend || !this.dirty() || !future.length || !this.changeSummary().length) { this.commit('day',nextStage); return; }
    const entry = this.entry(), eligible = new Set(future.map(item => item.id));
    const excluded = window.Parcours.state.calendar.filter(item => item.id !== entry.id && item.type === 'session' && item.cycleId === entry.cycleId && item.templateDay === entry.templateDay && item.date > entry.date && !eligible.has(item.id));
    this.dialog('Appliquer les adaptations',`<form id="preparation-scope"><h3>Changements à appliquer</h3><ul class="scope-changes">${this.changeSummary().map(change => `<li>${window.Parcours.escape(change)}</li>`).join('')}</ul><label class="tracking-choice"><input type="radio" name="scope" value="day">Cette séance uniquement</label><label class="tracking-choice"><input type="radio" name="scope" value="cycle" checked>Cette séance et ${future.length === 1 ? 'la prochaine séance' : `les ${future.length} prochaines séances`} du même type dans ce mésocycle</label><ul class="affected-dates">${future.map(entry => `<li>${window.Calendrier.label(entry.date)}</li>`).join('')}</ul>${excluded.length ? `<details><summary>${excluded.length} occurrence${excluded.length > 1 ? 's' : ''} exclue${excluded.length > 1 ? 's' : ''}</summary><ul>${excluded.map(item => `<li>${window.Calendrier.label(item.date)} · ${item.date < window.Calendrier.today() ? 'date passée' : window.Parcours.state.trainingDrafts[item.id] ? 'séance commencée' : window.Parcours.state.completedSessions?.some(record => record.executionKey === item.id) ? 'séance terminée' : 'brouillon de préparation'}</li>`).join('')}</ul></details>` : ''}<p class="landing-hint">Les changements d’exercices s’appliquent aux dates indiquées. Les autres cibles, les séances commencées et les autres brouillons sont conservés.</p><div class="week-actions"><button type="submit" class="primary-action" id="confirm-preparation-scope">Enregistrer pour ces ${future.length+1} dates</button><button id="cancel-exercise" type="button" class="text-action">Continuer à modifier</button></div></form>`);
    document.querySelector('#preparation-scope').onchange = event => { document.querySelector('#confirm-preparation-scope').textContent = event.target.value === 'day' ? 'Enregistrer cette date uniquement' : `Enregistrer pour ces ${future.length+1} dates`; };
    document.querySelector('#preparation-scope').onsubmit = event => { event.preventDefault(); const scope = event.target.elements.scope.value; document.querySelector('#exercise-dialog').close(); this.commit(scope,nextStage); };
  },
  commit(scope,nextStage) {
    const p = window.Parcours, entry = this.entry();
    if (entry && !window.Calendrier.canChange([entry])) return;
    if (scope === 'cycle') this.futureOccurrences().forEach(other => this.applyExerciseChanges(other.session));
    Object.assign(this.target,structuredClone(this.session));
    if (entry?.newWorkout) {
      const index = p.state.saved.findIndex(item => item.id === entry.sourceId);
      if (index !== -1) p.state.saved[index] = structuredClone(this.session);
      delete entry.newWorkout;
    }
    if (!entry && this.base.cycleWeeks) this.base.cycleNeedsUpdate = true;
    delete p.state.preparationDrafts[this.key]; this.rawFields = {};
    this.original = structuredClone(this.session); this.stage = nextStage;
    p.route('workout'); p.notify(p.storageFailed ? 'Adaptations appliquées pour cette visite · sauvegarde indisponible' : 'Adaptations enregistrées');
  },
  reorder(index,direction) {
    const target = index+direction, exercises = this.session.exercises;
    if (target < 0 || target >= exercises.length) return;
    [exercises[index],exercises[target]] = [exercises[target],exercises[index]];
    this.changed(); window.Parcours.route('workout');
    document.querySelector(`[data-card="${target}"] button`)?.focus();
  },
  remove(index) {
    const exercise = this.session.exercises.splice(index,1)[0], key = this.key;
    this.changed(); window.Parcours.route('workout');
    window.Parcours.notify('Exercice retiré du brouillon',() => {
      if (this.key === key && this.stage === 'edit') { this.session.exercises.splice(Math.min(index,this.session.exercises.length),0,exercise); this.changed(); window.Parcours.route('workout'); }
      else { const draft = window.Parcours.state.preparationDrafts[key]; if (draft) draft.session.exercises.splice(Math.min(index,draft.session.exercises.length),0,exercise); }
    });
  },
  bulkControls() {
    return `<details class="expert-tools" id="bulk-controls" ${this.bulkOpen ? 'open' : ''}><summary>Appliquer des cibles à plusieurs exercices</summary><p id="bulk-selection-count" role="status">${this.session.exercises.filter(exercise => this.selectedSlots?.has(exercise.slotId)).length} exercice(s) sélectionné(s)</p><button id="select-all-exercises" type="button" class="text-action">Tout sélectionner</button><button id="clear-exercise-selection" type="button" class="text-action">Désélectionner</button><p>Sélectionne les exercices dans les cartes. Seules les valeurs saisies seront copiées ; les charges restent indépendantes.</p><div class="inline-targets"><label>Séries<input id="bulk-sets" type="number" min="1" step="1"></label><label>Répétitions min.<input id="bulk-minReps" type="number" min="1" step="1"></label><label>Répétitions max.<input id="bulk-maxReps" type="number" min="1" step="1"></label></div><button id="apply-bulk" class="landing-button" type="button">Appliquer aux exercices sélectionnés</button><p id="bulk-error" class="error" role="alert"></p></details>`;
  },
  bindBulk() {
    this.selectedSlots ||= new Set(); this.bulkFields ||= {};
    const update = () => { const count = this.session.exercises.filter(exercise => this.selectedSlots.has(exercise.slotId)).length; document.querySelector('#bulk-selection-count').textContent = `${count} exercice${count === 1 ? '' : 's'} sélectionné${count === 1 ? '' : 's'}`; };
    document.querySelectorAll('[data-bulk-slot]').forEach(input => { input.onchange = () => { if (input.checked) this.selectedSlots.add(input.dataset.bulkSlot); else this.selectedSlots.delete(input.dataset.bulkSlot); this.changed(); update(); }; });
    const bulk = document.querySelector('#bulk-controls'); if (!bulk) return;
    bulk.ontoggle = () => { this.bulkOpen = bulk.open; this.changed(); };
    for (const field of ['sets','minReps','maxReps']) { const input = document.querySelector(`#bulk-${field}`); input.value = this.bulkFields[field] || ''; input.oninput = () => { this.bulkFields[field] = input.value; this.changed(); }; }
    for (const [id,select] of [['select-all-exercises',true],['clear-exercise-selection',false]]) document.querySelector(`#${id}`).onclick = () => { this.selectedSlots = new Set(select ? this.session.exercises.map(exercise => exercise.slotId) : []); document.querySelectorAll('[data-bulk-slot]').forEach(input => { input.checked = select; }); this.changed(); update(); };
    update();
    document.querySelector('#apply-bulk')?.addEventListener('click',() => {
      const selected = [...document.querySelectorAll('[data-bulk-slot]:checked')].map(input => input.dataset.bulkSlot), values = {};
      for (const field of ['sets','minReps','maxReps']) { const input = document.querySelector(`#bulk-${field}`); if (!window.Ergonomie.validateNumber(input)) { input.reportValidity(); return; } if (input.value !== '') values[field] = window.Ergonomie.number(input); }
      if (!selected.length || !Object.keys(values).length) { document.querySelector('#bulk-error').textContent = 'Sélectionne au moins un exercice et une cible à appliquer.'; return; }
      const targets = this.session.exercises.filter(exercise => selected.includes(exercise.slotId));
      if (targets.some(exercise => { const next = {...exercise,...values}; return next.minReps && next.maxReps && next.minReps > next.maxReps; })) { document.querySelector('#bulk-error').textContent = 'Le minimum ne peut pas dépasser le maximum.'; return; }
      targets.forEach(exercise => { Object.assign(exercise,values); if ('minReps' in values || 'maxReps' in values) exercise.repMode = exercise.minReps === exercise.maxReps ? 'fixed' : 'range'; for (const key of Object.keys(values)) delete this.rawFields[`${exercise.slotId}:${key}`]; });
      this.changed(); window.Parcours.route('workout'); window.Parcours.notify(`Cibles appliquées à ${targets.length} exercice(s) du brouillon`);
    });
  },
  normalize(value) { return value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim(); },
  newExercise(exerciseId,slotId = crypto.randomUUID()) { return {slotId,exerciseId,sets:null,minReps:null,maxReps:null,load:null,rpe:null,note:'',setting:''}; },
  addExercises(ids) {
    const exercises = ids.filter(id => window.catalogueExercices.some(item => item.id === id)).map(id => this.newExercise(id));
    this.session.exercises.push(...exercises); return exercises.length;
  },
  choose(exerciseId,replaceIndex) {
    const old = replaceIndex === null ? null : this.session.exercises[replaceIndex];
    if (old) for (const key of Object.keys(this.rawFields)) if (key.startsWith(`${old.slotId}:`)) delete this.rawFields[key];
    const exercise = this.newExercise(exerciseId,old?.slotId);
    const index = replaceIndex === null ? this.session.exercises.length : replaceIndex;
    if (replaceIndex === null) this.session.exercises.push(exercise); else this.session.exercises[index] = exercise;
    document.querySelector('#exercise-dialog').close(); this.changed(); window.Parcours.route('workout');
    document.querySelector(`[data-card="${index}"] input`)?.focus();
  },
  library(replaceIndex = null,query = '',multiple = false,selected = []) {
    const p = window.Parcours;
    const original = replaceIndex === null ? null : window.catalogueExercices.find(item => item.id === this.session.exercises[replaceIndex].exerciseId);
    document.querySelector('#exercise-dialog').close();
    this.dialog(original ? 'Remplacer un exercice' : multiple ? 'Ajouter plusieurs exercices' : 'Ajouter un exercice',`<label>Rechercher un exercice<input id="exercise-search" type="search" value="${p.escape(query)}" placeholder="Nom du mouvement"></label>${original ? '<p class="landing-hint">Même muscle en premier · les nouvelles cibles commencent vides.</p>' : ''}${replaceIndex === null ? `<div class="picker-multiple-actions">${multiple ? '<button type="button" id="confirm-multiple-exercises" class="primary-action" disabled>Ajouter les exercices sélectionnés</button><p id="multiple-exercises-count" role="status">0 exercice sélectionné</p>' : '<button type="button" id="multiple-exercises" class="landing-button">Ajouter plusieurs exercices</button>'}</div>` : ''}<div id="exercise-results" class="picker-results"></div><div class="week-actions"><button id="new-exercise" class="landing-button" type="button">Créer un exercice</button><button id="cancel-exercise" class="text-action" type="button">Annuler</button></div>`);
    const refresh = () => {
      const search = this.normalize(document.querySelector('#exercise-search').value);
      const items = window.catalogueExercices.filter(item => item.id !== original?.id && this.normalize(item.name).includes(search));
      if (original) items.sort((a,b) => Number(b.group === original.group)-Number(a.group === original.group));
      document.querySelector('#exercise-results').innerHTML = items.length ? items.map(item => `<button type="button" class="picker-result" data-choose-exercise="${p.escape(item.id)}" ${multiple ? `aria-pressed="${selected.includes(item.id)}"` : ''}><img src="${p.escape(item.image || '../06-configuration-seance/images/personal.svg')}" alt="" width="52" height="48"><span><strong>${p.escape(item.name)}</strong><small>${p.escape(item.group)} · ${p.escape(item.equipment)}</small></span><span aria-hidden="true">${multiple && selected.includes(item.id) ? '✓' : '+'}</span></button>`).join('') : '<p>Aucun exercice trouvé. Tu peux le créer ci-dessous.</p>';
    };
    document.querySelector('#exercise-search').oninput = refresh;
    document.querySelector('#exercise-results').onclick = event => { const button = event.target.closest('[data-choose-exercise]'); if (!button) return; if (!multiple) { this.choose(button.dataset.chooseExercise,replaceIndex); return; } const id = button.dataset.chooseExercise; if (selected.includes(id)) selected.splice(selected.indexOf(id),1); else selected.push(id); refresh(); document.querySelector(`[data-choose-exercise="${id}"]`)?.focus({preventScroll:true}); updateSelection(); };
    document.querySelector('#new-exercise').onclick = () => this.createExercise(replaceIndex,document.querySelector('#exercise-search').value);
    const updateSelection = () => {
      if (!multiple) return;
      const confirm = document.querySelector('#confirm-multiple-exercises'); confirm.disabled = !selected.length; confirm.textContent = `Ajouter ${selected.length} exercice${selected.length === 1 ? '' : 's'}`;
      document.querySelector('#multiple-exercises-count').textContent = `${selected.length} exercice${selected.length === 1 ? '' : 's'} sélectionné${selected.length === 1 ? '' : 's'}`;
    };
    document.querySelector('#multiple-exercises')?.addEventListener('click',() => this.library(null,document.querySelector('#exercise-search').value,true));
    document.querySelector('#confirm-multiple-exercises')?.addEventListener('click',() => {
      const index = this.session.exercises.length, count = this.addExercises(selected);
      document.querySelector('#exercise-dialog').close(); this.changed(); p.route('workout');
      document.querySelector(`[data-card="${index}"] input[data-field=sets]`)?.focus(); p.notifyChange(`${count} exercices ajoutés au brouillon`);
    });
    if (multiple) document.querySelector('#new-exercise').hidden = true;
    refresh(); updateSelection(); document.querySelector('#exercise-search').focus();
  },
  createExercise(replaceIndex,name) {
    const p = window.Parcours;
    document.querySelector('#exercise-title').textContent = 'Nouvel exercice';
    document.querySelector('#exercise-fields').innerHTML = `<form id="new-exercise-form" class="create-form" novalidate><label for="new-exercise-name">Nom<input id="new-exercise-name" name="name" maxlength="100" value="${p.escape(name)}" aria-describedby="new-exercise-error" required></label><p id="new-exercise-error" class="error" role="alert" hidden></p><details><summary>Image et détails, facultatifs</summary><label>Image<input name="image" type="file" accept="image/png,image/jpeg,image/webp"></label><p class="form-help">PNG, JPEG ou WebP · 500 Ko maximum</p>${p.select('Groupe musculaire','group',[['','Non renseigné'],...['Jambes','Pectoraux','Dos','Épaules','Bras','Abdominaux','Corps entier'].map(value => [value,value])])}${p.select('Matériel','equipment',[['','Non renseigné'],...['Salle équipée','Haltères à la maison','Sans matériel'].map(value => [value,value])],this.base.equipment || p.state.profile.equipment || '')}<label>Consigne<textarea name="instruction" maxlength="500" rows="2"></textarea></label></details><div class="week-actions"><button class="primary-action" type="submit">Créer et ajouter</button><button id="cancel-new-exercise" class="text-action" type="button">Retour au choix</button></div></form>`;
    const form = document.querySelector('#new-exercise-form');
    const error = document.querySelector('#new-exercise-error');
    form.onsubmit = async event => {
      event.preventDefault();
      const name = form.elements.name.value.trim();
      if (!name) { error.textContent = 'Donne un nom à cet exercice.'; error.hidden = false; form.elements.name.focus(); return; }
      const existing = window.catalogueExercices.find(item => this.normalize(item.name) === this.normalize(name));
      if (existing) {
        if (replaceIndex !== null && this.session.exercises[replaceIndex].exerciseId === existing.id) { error.textContent = 'Cet exercice est déjà celui à remplacer.'; error.hidden = false; return; }
        this.choose(existing.id,replaceIndex); return;
      }
      const file = form.elements.image.files[0];
      if (file && (!['image/png','image/jpeg','image/webp'].includes(file.type) || file.size > 500000)) { error.textContent = 'Choisis une image PNG, JPEG ou WebP de moins de 500 Ko.'; error.hidden = false; form.elements.image.focus(); return; }
      const submit = form.querySelector('[type="submit"]');
      submit.disabled = true;
      try {
        const image = file ? await new Promise((resolve,reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(file); }) : '';
        if (!document.querySelector('#exercise-dialog').open || !form.isConnected) return;
        const exercise = {id:crypto.randomUUID(),name,group:form.elements.group.value,equipment:form.elements.equipment.value,instruction:form.elements.instruction.value.trim(),image};
        window.catalogueExercices.push(exercise);
        p.state.customExercises.push(exercise);
        this.choose(exercise.id,replaceIndex);
      } catch { error.textContent = 'L’image n’a pas pu être lue. Essaie une autre image.'; error.hidden = false; }
      finally { submit.disabled = false; }
    };
    document.querySelector('#cancel-new-exercise').onclick = () => { document.querySelector('#exercise-dialog').close(); this.library(replaceIndex,form.elements.name.value); };
  }
};
