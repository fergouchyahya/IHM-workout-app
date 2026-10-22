'use strict';

window.Entrainement = {
  initialize(draft) {
    window.EnrichissementSeance?.initialize(draft);
    draft.rawFields ||= {}; draft.invalidFields ||= {}; draft.adaptations ||= {};
    draft.activeSets ||= {}; draft.dayState ||= {feeling:'',effort:'',note:''};
    draft.startedAt ||= new Date().toISOString();
    draft.session.exercises.forEach((exercise,index) => {
      if (draft.activeSets[index] === undefined) {
        const pending = draft.results[index].findIndex(result => this.resultState(result).code === 'pending');
        draft.activeSets[index] = pending === -1 ? 0 : pending;
      }
    });
  },
  resultState(result,invalid = false) {
    if (result.outcome === 'skipped') return {code:'skipped',label:'Non faite'};
    if (invalid) return {code:'invalid',label:'Saisie à corriger'};
    if (result.outcome === 'interrupted') return {code:'interrupted',label:'Interrompue'};
    const complete = Number.isFinite(result.load) && result.load >= 0 && Number.isInteger(result.reps) && result.reps > 0;
    if (result.outcome === 'completed') return {code:'completed',label:complete ? 'Faite' : 'Faite · résultats à compléter'};
    if (complete) return {code:'completed',label:'Faite'};
    return {code:'pending',label:result.reps === 0 ? '0 répétition · précise le statut' : result.load != null || result.reps != null || result.rpe != null || result.feeling ? 'Saisie partielle' : 'Non renseignée'};
  },
  invalidEntries(draft) { return Object.entries(draft.invalidFields || {}).filter(([field]) => { const [index,row] = field.split(':').map(Number); return draft.results[index]?.[row]?.outcome !== 'skipped'; }); },
  rowInvalid(draft,index,row) { return Object.keys(draft.invalidFields || {}).some(key => key.startsWith(`${index}:${row}:`)); },
  rowStatus(draft,index,row) {
    const state = this.resultState(draft.results[index][row],this.rowInvalid(draft,index,row));
    return state.label + (draft.adaptations[`${index}:${row}`] || draft.results[index][row].adapted ? ' · adaptée' : '');
  },
  writeResult(draft,index,row,key,value) {
    const result = draft.results[index]?.[row];
    if (!result || result.outcome === 'skipped') return false;
    const valid = key === 'load' ? value === null || Number.isFinite(value) && value >= 0
      : key === 'reps' ? value === null || Number.isInteger(value) && value >= 0
      : key === 'rpe' ? value === null || Number.isFinite(value) && value >= 1 && value <= 10 && Number.isInteger(value*2)
      : key === 'feeling' ? ['','Facile','Modéré','Difficile'].includes(value) : false;
    if (!valid) return false;
    result[key] = value; return true;
  },
  setOutcome(draft,index,row,outcome) {
    if (!draft.results[index]?.[row] || ![null,'completed','interrupted','skipped'].includes(outcome)) return false;
    draft.results[index][row].outcome = outcome; return true;
  },
  resultSnapshot(draft,index,row) {
    const prefix = `${index}:${row}:`;
    return {result:structuredClone(draft.results[index][row]),raw:Object.fromEntries(Object.entries(draft.rawFields).filter(([key]) => key.startsWith(prefix))),invalid:Object.fromEntries(Object.entries(draft.invalidFields || {}).filter(([key]) => key.startsWith(prefix)))};
  },
  restoreResult(draft,index,row,snapshot) {
    const prefix = `${index}:${row}:`;
    draft.results[index][row] = structuredClone(snapshot.result);
    for (const fields of [draft.rawFields,draft.invalidFields]) for (const key of Object.keys(fields)) if (key.startsWith(prefix)) delete fields[key];
    Object.assign(draft.rawFields,snapshot.raw); Object.assign(draft.invalidFields,snapshot.invalid);
  },
  repeatResult(draft,index,row) {
    const previous = draft.results[index]?.[row-1];
    if (draft.results[index]?.[row]?.outcome === 'skipped' || !previous || this.resultState(previous,this.rowInvalid(draft,index,row-1)).code !== 'completed' || previous.load == null || !Number.isInteger(previous.reps) || previous.reps <= 0) return false;
    Object.assign(draft.results[index][row],{load:previous.load,reps:previous.reps,rpe:previous.rpe ?? null,feeling:previous.feeling || '',outcome:null});
    for (const key of ['load','reps','rpe','feeling']) { delete draft.rawFields[`${index}:${row}:${key}`]; delete draft.invalidFields[`${index}:${row}:${key}`]; }
    return true;
  },
  repeatLoad(draft,index,row) {
    const previous = draft.results[index]?.[row-1], result = draft.results[index]?.[row];
    if (!result || result.outcome === 'skipped' || !previous || previous.outcome === 'skipped' || !Number.isFinite(previous.load) || previous.load < 0 || draft.invalidFields[`${index}:${row-1}:load`]) return false;
    result.load = previous.load; delete draft.rawFields[`${index}:${row}:load`]; delete draft.invalidFields[`${index}:${row}:load`]; return true;
  },
  restRemaining(draft,now = Date.now()) {
    const timer = draft.restTimer; if (!timer) return 0;
    return Math.max(0,timer.endAt == null ? timer.remainingMs ?? timer.duration*1000 : timer.endAt-now);
  },
  restAction(draft,action,value,now = Date.now()) {
    if (action === 'close') { delete draft.restTimer; draft.restOpen = false; return true; }
    const timer = draft.restTimer ||= {duration:window.Parcours.state.ui.restSeconds || 90,remainingMs:null,endAt:null};
    if (action === 'duration') {
      if (timer.endAt != null || !Number.isInteger(value) || value < 5 || value > 3600) return false;
      timer.duration = value; timer.remainingMs = null; window.Parcours.state.ui.restSeconds = value;
    } else if (action === 'start') {
      if (timer.endAt != null) return false;
      timer.endAt = now+(timer.remainingMs > 0 ? timer.remainingMs : timer.duration*1000);
    } else if (action === 'pause') { timer.remainingMs = this.restRemaining(draft,now); timer.endAt = null; }
    else if (action === 'reset') { timer.remainingMs = null; timer.endAt = null; }
    else if (action === 'expire') { timer.remainingMs = 0; timer.endAt = null; }
    else return false;
    return true;
  },
  restText(draft,now = Date.now()) {
    const seconds = Math.ceil(this.restRemaining(draft,now)/1000); return `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;
  },
  releaseTimer() { if (this.restInterval) clearInterval(this.restInterval); this.restInterval = null; },
  restMarkup(draft) {
    if (!draft.restTimer) return '';
    const timer = draft.restTimer, running = timer.endAt != null, p = window.Parcours;
    return `<details id="rest-controls" class="rest-controls" ${draft.restOpen ? 'open' : ''}><summary>Repos facultatif · <span id="rest-summary">${this.restText(draft)}</span></summary><p>Exercice ${(timer.index ?? draft.exerciseIndex)+1} · série ${(timer.row ?? 0)+1}. Le minuteur ne modifie aucun résultat.</p><output id="rest-countdown" aria-label="Repos restant" aria-live="off">${this.restText(draft)}</output><p id="rest-status" role="status"></p><form id="rest-form" novalidate><label>Durée en secondes<input id="rest-duration" name="seconds" type="number" min="5" max="3600" step="1" value="${p.escape(timer.duration)}" ${running ? 'disabled' : ''}></label><div class="rest-presets">${[30,60,90,120].map(seconds => `<button type="button" class="landing-button" data-rest-seconds="${seconds}" ${running ? 'disabled' : ''}>${seconds} s</button>`).join('')}</div><div class="week-actions"><button id="rest-start" type="submit" class="primary-action" ${running ? 'disabled' : ''}>${timer.remainingMs > 0 ? 'Reprendre' : 'Démarrer'}</button><button id="rest-pause" type="button" class="landing-button" ${running ? '' : 'disabled'}>Pause</button><button id="rest-reset" type="button" class="text-action">Réinitialiser</button><button id="rest-close" type="button" class="text-action">Fermer et arrêter</button></div></form></details>`;
  },
  bindRest(draft) {
    this.releaseTimer(); const p = window.Parcours, owner = p.state.identity, key = this.key;
    document.querySelectorAll('[data-rest-set]').forEach(button => { button.onclick = () => {
      draft.restTimer ||= {duration:p.state.ui.restSeconds || 90,remainingMs:null,endAt:null};
      if (draft.restTimer.endAt == null && draft.restTimer.remainingMs == null) Object.assign(draft.restTimer,{index:draft.exerciseIndex,row:Number(button.dataset.restSet)});
      draft.restOpen = true; p.route('training'); document.querySelector(draft.restTimer.endAt != null ? '#rest-pause' : '#rest-start').focus(); document.querySelector('#rest-controls').scrollIntoView({block:'nearest'});
    }; });
    const details = document.querySelector('#rest-controls'); if (!details) return;
    details.ontoggle = () => { draft.restOpen = details.open; p.persist(); };
    const act = (action,value) => { if (!this.restAction(draft,action,value)) return; p.persist(); p.route('training'); };
    document.querySelectorAll('[data-rest-seconds]').forEach(button => { button.onclick = () => act('duration',Number(button.dataset.restSeconds)); });
    document.querySelector('#rest-form').onsubmit = event => { event.preventDefault(); const input = document.querySelector('#rest-duration'); if (!input.value.trim()) { input.setCustomValidity('Indique une durée entre 5 et 3600 secondes.'); input.reportValidity(); return; } if (!window.Ergonomie.validateNumber(input)) { input.reportValidity(); return; } const seconds = Number(input.value); if (seconds !== draft.restTimer.duration && !this.restAction(draft,'duration',seconds)) return; act('start'); };
    for (const action of ['pause','reset','close']) document.querySelector(`#rest-${action}`).onclick = () => act(action);
    const tick = () => {
      if (p.state.identity !== owner || p.state.trainingDrafts[key] !== draft || p.view !== 'training') { this.releaseTimer(); return; }
      if (draft.restTimer.endAt != null && this.restRemaining(draft) === 0) { this.restAction(draft,'expire'); p.persist(); this.releaseTimer(); }
      const text = this.restText(draft); document.querySelector('#rest-summary').textContent = text; document.querySelector('#rest-countdown').textContent = text;
      const running = draft.restTimer.endAt != null;
      document.querySelector('#rest-status').textContent = draft.restTimer.remainingMs === 0 ? 'Repos terminé' : running ? 'En cours' : draft.restTimer.remainingMs > 0 ? 'En pause' : 'Prêt à démarrer';
      document.querySelector('#rest-start').disabled = running; document.querySelector('#rest-pause').disabled = !running; document.querySelector('#rest-duration').disabled = running;
      document.querySelectorAll('[data-rest-seconds]').forEach(button => { button.disabled = running; });
    };
    tick(); if (draft.restTimer.endAt != null) this.restInterval = setInterval(tick,1000);
  },
  outcomeMarkup(draft,index,row) {
    const p = window.Parcours, result = draft.results[index][row], key = `${index}:${row}`;
    return `<details class="set-outcome-tools" data-outcome-details="${row}" ${draft.outcomeDetails?.[key] ? 'open' : ''}><summary>Cas particulier${result.outcome === 'interrupted' ? ' · interrompue' : result.outcome === 'skipped' ? ' · non faite' : result.outcome === 'completed' ? ' · faite déclarée' : ''}</summary><div class="set-outcome-choices" role="group" aria-label="Réalisation de la série ${row+1}">${[['completed','Faite'],['interrupted','Interrompue'],['skipped','Non faite']].map(([value,label]) => `<button type="button" class="landing-button" data-outcome="${value}" data-outcome-row="${row}" aria-pressed="${result.outcome === value}">${label}</button>`).join('')}</div><p class="form-help">Un second appui retire le choix. Vide reste « Non renseignée » ; une série n’est jamais déclarée non faite automatiquement.</p><label class="set-adapted-check"><input type="checkbox" data-actual-adapted="${row}" ${result.adapted ? 'checked' : ''}>Effort adapté pendant cette série</label><label>Raison du cas particulier (facultative)<input type="text" data-outcome-reason="${row}" maxlength="300" value="${p.escape(result.outcomeReason || '')}" placeholder="Ex. Arrêt avant la fin, matériel indisponible"></label></details>`;
  },
  progressText(draft,index) {
    const counts = {completed:0,interrupted:0,skipped:0,partial:0,pending:0,invalid:0};
    for (const [row,result] of (draft.results[index] || []).entries()) { const state = this.resultState(result,this.rowInvalid(draft,index,row)); counts[state.code === 'pending' && state.label !== 'Non renseignée' ? 'partial' : state.code]++; }
    return [['completed','faite','faites'],['interrupted','interrompue','interrompues'],['skipped','non faite','non faites'],['partial','saisie partielle','saisies partielles'],['pending','non renseignée','non renseignées'],['invalid','à corriger','à corriger']].filter(([key]) => counts[key]).map(([key,one,many]) => `${counts[key]} ${counts[key] === 1 ? one : many}`).join(' · ') || 'Aucune série';
  },
  updateProgress(draft,index) {
    const status = document.querySelector('#training-exercise-progress'); if (status) { const text = this.progressText(draft,index); if (status.textContent !== text) status.textContent = text; }
    const next = document.querySelector('#training-next-set'); if (next) next.disabled = (draft.activeSets[index] || 0) >= draft.results[index].length-1;
  },
  updateResultRow(draft,index,row) {
    this.updateProgress(draft,index);
    document.querySelector(`[data-set-status="${row}"]`).textContent = this.rowStatus(draft,index,row);
    document.querySelector(`[data-active-set="${row}"]`).closest('fieldset').dataset.outcome = this.resultState(draft.results[index][row],this.rowInvalid(draft,index,row)).code;
    const errors = Object.entries(draft.invalidFields || {}).filter(([key]) => key.startsWith(`${index}:${row}:`)).map(([,message]) => message);
    document.querySelector(`#result-error-${row}`).textContent = draft.results[index][row].outcome === 'skipped' ? '' : [...new Set(errors)].join(' ');
  },
  target(draft,index,row) {
    const exercise = draft.session.exercises[index];
    return draft.adaptations[`${index}:${row}`] || {load:exercise.load,minReps:exercise.minReps,maxReps:exercise.maxReps,rpe:exercise.rpe};
  },
  targetText(target) {
    const number = value => Number(value).toLocaleString('fr-FR');
    return [target.load == null ? 'Charge libre' : `${number(target.load)} kg`, target.minReps && target.maxReps ? `${target.minReps}${target.minReps === target.maxReps ? '' : `–${target.maxReps}`} ${target.minReps === 1 && target.maxReps === 1 ? 'répétition' : 'répétitions'}` : 'Répétitions libres',target.rpe == null ? '' : `effort ${number(target.rpe)}/10 (RPE)`].filter(Boolean).join(' · ');
  },
  adapt(draft,index,row,value) {
    if (!draft.results[index]?.[row]) return false;
    const validInteger = number => number === null || Number.isInteger(number) && number > 0;
    if (!(value.load === null || Number.isFinite(value.load) && value.load >= 0) || !validInteger(value.minReps) || !validInteger(value.maxReps) || value.minReps !== null && value.maxReps !== null && value.minReps > value.maxReps || !(value.rpe === null || Number.isFinite(value.rpe) && value.rpe >= 1 && value.rpe <= 10 && Number.isInteger(value.rpe*2)) || (value.reason || '').length > 300) return false;
    const target = {load:value.load,minReps:value.minReps,maxReps:value.maxReps,rpe:value.rpe,reason:value.reason || ''};
    const original = draft.session.exercises[index];
    if (['load','minReps','maxReps','rpe'].every(key => target[key] === (original[key] ?? null)) && !target.reason) delete draft.adaptations[`${index}:${row}`];
    else draft.adaptations[`${index}:${row}`] = target;
    return true;
  },
  previousResult(draft,index) {
    const current = draft.session.exercises[index];
    const records = (window.Parcours.state.completedSessions || []).filter(record => record.status === 'completed' && record.id !== this.key && Number.isFinite(Date.parse(record.completedAt)) && Date.parse(record.completedAt) <= Date.parse(draft.startedAt) && record.date <= draft.date).sort((a,b) => Date.parse(b.completedAt)-Date.parse(a.completedAt));
    for (const record of records) {
      const matches = (record.session?.exercises || []).map((exercise,i) => ({exercise,index:i})).filter(({exercise}) => exercise.exerciseId === current.exerciseId);
      const exact = record.workoutId && record.workoutId === draft.workoutId ? matches.find(({exercise}) => exercise.slotId === current.slotId) : null;
      const match = exact || (matches.length === 1 ? matches[0] : null);
      if (!match) continue;
      const results = record.results?.[match.index] || [];
      const valid = results.map(result => result && (!result.outcome || result.outcome === 'completed') && Number.isFinite(result.load) && result.load >= 0 && Number.isInteger(result.reps) && result.reps > 0 ? result : null);
      if (valid.some(Boolean)) return {date:record.date,results:valid,setting:record.enrichment?.exercises?.[match.exercise.slotId || `exercise-${match.index}`]?.setting || match.exercise.setting || ''};
    }
    return null;
  },
  historyMarkup(draft,index) {
    const p = window.Parcours, previous = this.previousResult(draft,index);
    if (!previous) return '';
    const row = draft.activeSets[index] || 0, result = previous.results[row];
    return `<aside class="training-history" aria-label="Résultat précédent"><p><strong>Dernier résultat · ${p.escape(window.Calendrier.label(previous.date,{day:'numeric',month:'short',year:'numeric'}))}</strong></p><p>${result ? `Série ${row+1} : ${Number(result.load).toLocaleString('fr-FR')} kg × ${result.reps} répétitions${Number.isFinite(result.rpe) && result.rpe >= 1 && result.rpe <= 10 ? ` · effort ${Number(result.rpe).toLocaleString('fr-FR')}/10` : ''}` : `Série ${row+1} : aucun résultat renseigné`}</p>${previous.setting && previous.setting !== draft.session.exercises[index].setting ? `<p>Réglage précédent : ${p.escape(previous.setting)}</p>` : ''}</aside>`;
  },
  dayStateSummary(draft) {
    return [draft.dayState.feeling,draft.dayState.effort].filter(Boolean).join(' · ') || 'Facultatif';
  },
  dayStateMarkup(draft) {
    const p = window.Parcours;
    return `<details class="training-day-state" ${(draft.dayStateOpen ?? ['sleep','energy','pain'].some(key => draft.session.tracking[key])) ? 'open' : ''}><summary>Avant la séance · état et effort <span id="day-state-summary">${p.escape(this.dayStateSummary(draft))}</span></summary><p class="form-help">Un repère pour cette séance, modifiable à tout moment. Les cibles restent sous ton contrôle.</p>${[['feeling','État avant la séance',['En forme','Fatigué','Gêne']],['effort','Effort prévu pour cette séance',['Plus léger','Habituel','Plus soutenu']]].map(([key,label,values]) => `<div class="day-state-group" role="group" aria-label="${label}"><p>${label}</p><div class="day-state-choices">${values.map(value => `<button type="button" class="landing-button" data-day-state="${key}" data-value="${value}" aria-pressed="${draft.dayState[key] === value}">${value}</button>`).join('')}</div></div>`).join('')}${window.EnrichissementSeance.contextMarkup(draft)}<p class="form-help">Toucher à nouveau un choix le retire. Aucun choix n’est obligatoire pour continuer.</p></details>`;
  },
  seriesPosition(draft) {
    const index = draft.exerciseIndex, count = draft.results[index]?.length || 0;
    return count ? `Série ${(draft.activeSets[index] || 0)+1} sur ${count}` : 'Aucune série prévue';
  },
  setActive(draft,index,row) {
    draft.activeSets[index] = row;
    this.updateProgress(draft,index);
    document.querySelector('#training-series-position').textContent = this.seriesPosition(draft);
    document.querySelectorAll('[data-active-set]').forEach(button => { const selected = Number(button.dataset.activeSet) === row; button.setAttribute('aria-pressed',String(selected)); button.closest('fieldset').classList.toggle('is-current',selected); });
    document.querySelector('#training-previous-result').innerHTML = this.historyMarkup(draft,index);
  },
  setTargetMarkup(draft,index,row) {
    const p = window.Parcours, original = draft.session.exercises[index], adapted = draft.adaptations[`${index}:${row}`], target = this.target(draft,index,row);
    return `<div class="set-target"><p><strong>${adapted ? 'Cible adaptée' : 'Cible prévue'} :</strong> ${p.escape(this.targetText(target))}</p>${adapted ? `<p class="initial-target">Initiale : ${p.escape(this.targetText(original))}</p>${adapted.reason ? `<p>Raison : ${p.escape(adapted.reason)}</p>` : ''}` : ''}<button type="button" class="text-action" data-adapt-set="${row}">${adapted ? 'Modifier la cible' : 'Adapter cette série'}</button>${adapted ? `<button type="button" class="text-action" data-reset-target="${row}">Rétablir la cible initiale</button>` : ''}</div><div id="set-adaptation-${row}" class="set-adaptation" hidden></div>`;
  },
  openAdaptation(draft,index,row) {
    const p = window.Parcours, target = this.target(draft,index,row), container = document.querySelector(`#set-adaptation-${row}`);
    if (!container.hidden) { container.querySelector('[name=load]').focus(); return; }
    container.hidden = false;
    container.innerHTML = `<form class="set-adaptation-form" novalidate><p><strong>Adapter la série ${row+1} uniquement</strong></p><p class="form-help">Cible initiale : ${p.escape(this.targetText(draft.session.exercises[index]))}. Les résultats réels restent séparés.</p>${p.select('Répétitions','repMode',[['fixed','Fixes'],['range','Plage']],target.minReps && target.minReps === target.maxReps ? 'fixed' : 'range')}<div class="training-result-fields">${[['load','Charge cible (kg)',0,'any'],['minReps','Répétitions minimum',1,'1'],['maxReps','Répétitions maximum',1,'1'],['rpe','Effort visé (RPE), facultatif',1,'0.5']].map(([key,label,min,step]) => `<label>${label}<input type="${step === '1' ? 'number' : 'text'}" data-numeric="true" name="${key}" min="${min}" step="${step}" ${key === 'rpe' ? 'max="10"' : ''} value="${target[key] ?? ''}" aria-describedby="adaptation-error-${row}"></label>`).join('')}</div><label>Raison (facultative)<input type="text" name="reason" maxlength="300" value="${p.escape(target.reason || '')}" placeholder="Ex. Fatigue, réglage ou matériel"></label><p id="adaptation-error-${row}" class="error" role="alert"></p><div class="week-actions"><button type="submit" class="primary-action">Appliquer à cette série</button><button type="button" class="text-action" data-cancel-adaptation>Annuler</button></div></form>`;
    const form = container.querySelector('form');
    const repMode = () => {
      const fixed = form.elements.repMode.value === 'fixed';
      form.elements.maxReps.closest('label').hidden = fixed;
      form.elements.minReps.closest('label').firstChild.textContent = fixed ? 'Répétitions' : 'Répétitions minimum';
    };
    form.elements.repMode.onchange = repMode; repMode();
    form.onsubmit = event => {
      event.preventDefault();
      if (form.elements.repMode.value === 'fixed') form.elements.maxReps.value = form.elements.minReps.value;
      const value = {reason:form.elements.reason.value.trim()};
      for (const key of ['load','minReps','maxReps','rpe']) {
        const input = form.elements[key];
        if (!window.Ergonomie.validateNumber(input)) { input.reportValidity(); return; }
        value[key] = window.Ergonomie.number(input);
      }
      if (!this.adapt(draft,index,row,value)) { container.querySelector('.error').textContent = 'Le maximum doit être supérieur ou égal au minimum.'; form.elements.maxReps.focus(); return; }
      p.route('training'); document.querySelector(`[data-adapt-set="${row}"]`)?.focus({preventScroll:true});
      p.notify('Cible de cette série adaptée · programme et résultats conservés');
    };
    container.querySelector('[data-cancel-adaptation]').onclick = () => { container.hidden = true; document.querySelector(`[data-adapt-set="${row}"]`).focus({preventScroll:true}); };
    window.Ergonomie.bind(container); form.elements.load.focus();
  },
  ongoingMarkup() {
    const p = window.Parcours, drafts = Object.entries(p.state.trainingDrafts);
    if (!drafts.length) return '';
    return `<section class="ongoing-sessions" aria-labelledby="ongoing-title"><h2 id="ongoing-title">Séances en cours</h2>${drafts.map(([key,draft]) => `<button type="button" class="picker-result" data-ongoing="${p.escape(key)}"><span><strong>${p.escape(draft.session.name)}</strong><small>${window.Calendrier.label(draft.date)} · exercice ${Math.min((draft.exerciseIndex || 0)+1,draft.session.exercises.length)} sur ${draft.session.exercises.length}</small></span><span>Reprendre</span></button>`).join('')}</section>`;
  },
  resume(key) {
    const p = window.Parcours, draft = p.state.trainingDrafts[key];
    if (!draft) { p.notify('Cette séance n’est plus en cours.'); return; }
    this.key = key; this.initialize(draft); p.route('training');
  },
  open(session,key,date) {
    const p = window.Parcours; this.key = key;
    const completed = p.state.calendar.some(entry => entry.id === key) && p.state.completedSessions.find(record => record.executionKey === key);
    if (completed) { window.BilanSeance.open(completed.id); return; }
    if (!p.state.trainingDrafts[key]) {
      p.state.ui.scroll.training = 0;
      const prepared = window.ConfigurationSeance.normalizeSession(session);
      p.state.trainingDrafts[key] = {session:prepared,date:date || window.Calendrier.today(),exerciseIndex:0,results:prepared.exercises.map(exercise => Array.from({length:exercise.sets || 0},() => ({load:null,reps:null,rpe:null})))};
    }
    const draft = p.state.trainingDrafts[key];
    draft.workoutId ||= p.state.calendar.find(entry => entry.id === key)?.sourceId || session.id || key;
    this.initialize(draft);
    p.route('training');
  },
  render() {
    const p = window.Parcours, draft = p.state.trainingDrafts[this.key], exercises = draft.session.exercises, index = draft.exerciseIndex;
    const exercise = exercises[index], item = window.catalogueExercices.find(item => item.id === exercise?.exerciseId);
    const invalidExercise = this.invalidEntries(draft)[0]?.[0].split(':')[0];
    return `<div class="training-top-actions"><button id="training-back" type="button" class="text-action">← Quitter · saisie conservée</button><button type="button" class="text-action" data-review-training>${draft.reviewing ? 'Revenir au bilan' : 'Terminer'}</button></div><div class="training-title"><div><p class="week-heading">${window.Calendrier.label(draft.date)}</p><h1 tabindex="-1">${p.escape(draft.session.name)}</h1></div><span class="training-save-indicator">En cours<span id="training-save-status" role="status">${p.storageFailed ? 'Sauvegarde indisponible' : invalidExercise !== undefined || window.EnrichissementSeance.hasErrors(draft) ? 'Saisie à corriger' : 'Saisie conservée'}</span></span></div>${invalidExercise !== undefined ? `<button type="button" class="error invalid-entry-link" data-invalid-exercise="${invalidExercise}">Une saisie est à corriger · exercice ${Number(invalidExercise)+1}</button>` : ''}${this.dayStateMarkup(draft)}${window.EnrichissementSeance.errorMarkup(draft)}${this.restMarkup(draft)}${exercise ? `${p.select(`Exercice ${index+1} sur ${exercises.length} · <span class="training-series-position" id="training-series-position">${p.escape(this.seriesPosition(draft))}</span>`,'trainingExercise',exercises.map((exercise,i) => [String(i),`${i+1}. ${window.catalogueExercices.find(item => item.id === exercise.exerciseId)?.name || 'Exercice personnel'}`]),String(index),'id="training-exercise"')}<section class="training-exercise"><div class="training-exercise-heading"><img src="${p.escape(item?.image || '../06-configuration-seance/images/personal.svg')}" alt="Illustration : ${p.escape(item?.name)}" width="72" height="68"><div><h2 tabindex="-1">${p.escape(item?.name)}</h2></div><button type="button" id="open-training-enrichment" class="text-action enrichment-quick-action" aria-controls="training-enrichment" aria-label="Notes et médias pour ${p.escape(item?.name)}" title="Notes et médias">✎<span>Notes</span></button></div><p>${p.escape(item?.instruction || 'Consigne non renseignée.')}</p>${exercise.note || exercise.setting ? `<div class="training-context">${exercise.note ? `<p><strong>Consigne personnelle :</strong> ${p.escape(exercise.note)}</p>` : ''}${exercise.setting ? `<p><strong>Réglage prévu :</strong> ${p.escape(exercise.setting)}</p>` : ''}</div>` : ''}<button type="button" id="training-edit-setting" class="text-action" aria-controls="training-enrichment">Renseigner ou modifier le réglage utilisé</button><p id="training-actual-setting" class="training-actual-setting" ${window.EnrichissementSeance.exercise(draft,index).setting ? '' : 'hidden'}>Réglage utilisé : ${p.escape(window.EnrichissementSeance.exercise(draft,index).setting)}</p></section><div id="training-previous-result">${this.historyMarkup(draft,index)}</div><p class="exercise-common-target"><strong>Cible prévue pour chaque série :</strong> ${p.escape(this.targetText(exercise))}</p><div class="landing-row"><h2>Résultats réels</h2><span class="landing-hint">kg · répétitions${draft.session.tracking.rpe ? ' · effort' : ''}</span></div><div class="training-progress-row"><p id="training-exercise-progress" role="status">${p.escape(this.progressText(draft,index))}</p><button id="training-next-set" class="landing-button" type="button" ${(draft.activeSets[index] || 0) >= draft.results[index].length-1 ? 'disabled' : ''}>Série suivante →</button></div><div class="training-series compact-series">${draft.results[index].map((result,row) => `<fieldset class="training-set ${draft.activeSets[index] === row ? 'is-current' : ''}" data-outcome="${this.resultState(result,this.rowInvalid(draft,index,row)).code}"><legend><button type="button" class="text-action" data-active-set="${row}" aria-pressed="${draft.activeSets[index] === row}">Série ${row+1}</button></legend>${draft.adaptations[`${index}:${row}`] ? this.setTargetMarkup(draft,index,row) : ''}<div class="training-result-fields">${[['load','Charge (kg)',0,'any'],['reps','Répétitions',0,'1'],...(draft.session.tracking.rpe ? [['rpe','Effort (RPE)',1,'0.5']] : [])].map(([key,label,min,step]) => { const field = `${index}:${row}:${key}`; return `<label>${label}<input type="${['any','0.5'].includes(step) ? 'text' : 'number'}" data-numeric="true" data-result="${row}" data-result-key="${key}" value="${p.escape(draft.rawFields[field] ?? (result[key] == null ? '' : window.Ergonomie.formatNumber(result[key])))}" min="${min}" step="${step}" ${key === 'rpe' ? 'max="10"' : ''} ${result.outcome === 'skipped' ? 'disabled' : ''} aria-invalid="${result.outcome !== 'skipped' && !!draft.invalidFields[field]}" aria-describedby="result-error-${row}"></label>`; }).join('')}${!draft.session.tracking.rpe ? `<label>Ressenti (facultatif)<select data-result="${row}" data-result-key="feeling" ${result.outcome === 'skipped' ? 'disabled' : ''}><option value="">Non renseigné</option>${['Facile','Modéré','Difficile'].map(value => `<option ${result.feeling === value ? 'selected' : ''}>${value}</option>`).join('')}</select></label>` : ''}</div>${result.outcome === 'skipped' ? `<p class="skipped-result-note">Série déclarée non faite. Les anciennes valeurs sont conservées pour correction, exclues des résultats de ce statut.</p><button type="button" class="text-action" data-resume-set="${row}">Reprendre la saisie</button>` : ''}<div class="set-tools"><p class="set-status" data-set-status="${row}">${p.escape(this.rowStatus(draft,index,row))}</p>${row ? `<button type="button" class="text-action repeat-result" data-repeat-set="${row}" ${result.outcome === 'skipped' ? 'disabled' : ''}>Même résultat que série ${row}</button><button type="button" class="text-action" data-repeat-load="${row}" ${result.outcome === 'skipped' ? 'disabled' : ''}>Charge seule · série ${row}</button>` : ''}</div><p class="error" id="result-error-${row}" role="alert">${result.outcome === 'skipped' ? '' : p.escape(Object.entries(draft.invalidFields || {}).find(([key]) => key.startsWith(`${index}:${row}:`))?.[1] || '')}</p>${!draft.adaptations[`${index}:${row}`] ? `<button type="button" class="text-action compact-adapt" data-adapt-set="${row}">Adapter la cible</button><div id="set-adaptation-${row}" class="set-adaptation" hidden></div>` : ''}${this.outcomeMarkup(draft,index,row)}<button type="button" class="text-action rest-set-action" data-rest-set="${row}">Repos…</button></fieldset>`).join('')}</div>${!draft.results[index].length ? '<p class="preparation-notice">Aucune série prévue. Ajoute une série pour saisir un résultat.</p>' : ''}<p class="form-help">Résultats après l’effort · vide = non renseigné · 0 kg = sans charge ajoutée.${draft.session.tracking.rpe ? ' RPE : effort ressenti de 1 à 10.' : ''}</p>${window.EnrichissementSeance.exerciseMarkup(draft,index)}<button id="training-add-set" type="button" class="landing-button">+ Ajouter une série</button><div class="training-navigation"><button id="training-previous" type="button" class="landing-button" ${index === 0 ? 'disabled' : ''}>← Précédent</button>${index === exercises.length-1 ? '<button type="button" class="primary-action" data-review-training>Vérifier le bilan</button>' : '<button id="training-next" type="button" class="landing-button">Suivant →</button>'}</div>` : '<p class="preparation-notice">Aucun exercice préparé. Retourne à la préparation pour en ajouter.</p>'}`;
  },
  saveStatus(saved,invalid = false) {
    const draft = window.Parcours.state.trainingDrafts[this.key];
    invalid ||= !!draft && (this.invalidEntries(draft).length > 0 || window.EnrichissementSeance?.hasErrors(draft));
    const status = document.querySelector('#training-save-status');
    if (status) status.textContent = !saved ? 'Sauvegarde indisponible' : invalid ? 'Saisie à corriger' : 'Saisie conservée';
  },
  setStatus(result) { return this.resultState(result).label; },
  bind() {
    const p = window.Parcours, draft = p.state.trainingDrafts[this.key];
    window.EnrichissementSeance.bind(draft,draft.exerciseIndex,this.key);
    this.bindRest(draft);
    document.querySelectorAll('[data-review-training]').forEach(button => { button.onclick = () => window.BilanSeance.openReview(); });
    document.querySelector('#training-back').onclick = () => p.route('mine');
    document.querySelector('#training-exercise')?.addEventListener('change',event => { draft.exerciseIndex = Number(event.target.value); p.route('training'); document.querySelector('#training-exercise').focus({preventScroll:true}); });
    document.querySelector('[data-invalid-exercise]')?.addEventListener('click',event => { draft.exerciseIndex = Number(event.target.dataset.invalidExercise); p.route('training'); document.querySelector('[aria-invalid="true"]')?.focus(); });
    const dayState = document.querySelector('.training-day-state');
    dayState.ontoggle = () => { draft.dayStateOpen = dayState.open; p.persist(); };
    document.querySelectorAll('[data-day-state]').forEach(button => { button.onclick = () => {
      const key = button.dataset.dayState; draft.dayState[key] = draft.dayState[key] === button.dataset.value ? '' : button.dataset.value;
      document.querySelectorAll(`[data-day-state="${key}"]`).forEach(choice => choice.setAttribute('aria-pressed',String(choice.dataset.value === draft.dayState[key])));
      document.querySelector('#day-state-summary').textContent = this.dayStateSummary(draft);
      this.saveStatus(p.persist());
    }; });
    document.querySelector('#training-next-set')?.addEventListener('click',() => { const index = draft.exerciseIndex, row = (draft.activeSets[index] || 0)+1; if (!draft.results[index][row]) return; this.setActive(draft,index,row); p.persist(); (document.querySelector(`[data-result="${row}"]:not(:disabled)`) || document.querySelector(`[data-active-set="${row}"]`))?.focus(); });
    document.querySelectorAll('[data-active-set]').forEach(button => { button.onclick = () => { this.setActive(draft,draft.exerciseIndex,Number(button.dataset.activeSet)); p.persist(); }; });
    document.querySelectorAll('[data-adapt-set]').forEach(button => { button.onclick = () => { const row = Number(button.dataset.adaptSet); this.setActive(draft,draft.exerciseIndex,row); this.openAdaptation(draft,draft.exerciseIndex,row); }; });
    document.querySelectorAll('[data-reset-target]').forEach(button => { button.onclick = () => {
      const key = `${draft.exerciseIndex}:${button.dataset.resetTarget}`, previous = draft.adaptations[key];
      delete draft.adaptations[key]; p.route('training');
      p.notify('Cible initiale rétablie',() => { draft.adaptations[key] = previous; if (p.view === 'training') p.route('training'); });
    }; });
    document.querySelectorAll('[data-result]').forEach(input => {
      input.onfocus = () => this.setActive(draft,draft.exerciseIndex,Number(input.dataset.result));
      input.oninput = () => {
        const index = draft.exerciseIndex, row = Number(input.dataset.result), key = input.dataset.resultKey, field = `${index}:${row}:${key}`;
        draft.rawFields[field] = input.value;
        const invalid = key !== 'feeling' && !window.Ergonomie.validateNumber(input);
        const applied = !invalid && this.writeResult(draft,index,row,key,key === 'feeling' ? input.value : window.Ergonomie.number(input));
        const pending = key !== 'feeling' && window.Ergonomie.pendingNumber(input);
        input.setAttribute('aria-invalid',String(!applied && !pending));
        if (!applied) draft.invalidFields[field] = input.validationMessage || 'Choisis un ressenti proposé.'; else delete draft.invalidFields[field];
        this.updateResultRow(draft,index,row); if (pending) document.querySelector(`#result-error-${row}`).textContent = ''; this.saveStatus(p.persist(),!applied);
      };
    });
    const changeOutcome = (row,outcome,focusValue = outcome) => {
      const index = draft.exerciseIndex, previous = this.resultSnapshot(draft,index,row);
      this.setOutcome(draft,index,row,outcome); draft.activeSets[index] = row; p.route('training');
      document.querySelector(`[data-outcome-row="${row}"][data-outcome="${focusValue}"]`)?.focus({preventScroll:true});
      p.notify(outcome === 'skipped' ? 'Série déclarée non faite · valeurs conservées' : outcome === 'interrupted' ? 'Série interrompue · résultats partiels conservés' : outcome === 'completed' ? 'Série déclarée faite · aucune valeur inventée' : 'Statut selon la saisie',() => { this.restoreResult(draft,index,row,previous); if (p.view === 'training') p.route('training'); });
    };
    document.querySelectorAll('[data-outcome-row]').forEach(button => { button.onclick = () => {
      const row = Number(button.dataset.outcomeRow), outcome = button.dataset.outcome;
      changeOutcome(row,draft.results[draft.exerciseIndex][row].outcome === outcome ? null : outcome,outcome);
    }; });
    document.querySelectorAll('[data-resume-set]').forEach(button => { button.onclick = () => {
      const row = Number(button.dataset.resumeSet); changeOutcome(row,null); document.querySelector(`[data-result="${row}"][data-result-key=load]`)?.focus();
    }; });
    const outcomeIndex = draft.exerciseIndex;
    document.querySelectorAll('[data-outcome-details]').forEach(details => {
      details.querySelector('summary').onclick = () => this.setActive(draft,outcomeIndex,Number(details.dataset.outcomeDetails));
      details.ontoggle = () => {
        draft.outcomeDetails ||= {}; draft.outcomeDetails[`${outcomeIndex}:${details.dataset.outcomeDetails}`] = details.open; this.saveStatus(p.persist());
      };
    });
    document.querySelectorAll('[data-actual-adapted]').forEach(input => { input.onchange = () => {
      const row = Number(input.dataset.actualAdapted); this.setActive(draft,draft.exerciseIndex,row); draft.results[draft.exerciseIndex][row].adapted = input.checked;
      this.updateResultRow(draft,draft.exerciseIndex,row); this.saveStatus(p.persist());
    }; });
    document.querySelectorAll('[data-outcome-reason]').forEach(input => { input.onfocus = () => this.setActive(draft,draft.exerciseIndex,Number(input.dataset.outcomeReason)); input.oninput = () => {
      draft.results[draft.exerciseIndex][Number(input.dataset.outcomeReason)].outcomeReason = input.value; this.saveStatus(p.persist());
    }; });
    document.querySelectorAll('[data-repeat-load]').forEach(button => { button.onclick = () => {
      const index = draft.exerciseIndex, row = Number(button.dataset.repeatLoad), field = `${index}:${row}:load`, key = this.key;
      const before = {load:draft.results[index][row].load,raw:draft.rawFields[field],invalid:draft.invalidFields[field]};
      if (!this.repeatLoad(draft,index,row)) { p.notify('Renseigne une charge précédente valide, sur une série non déclarée non faite.'); return; }
      const expected = draft.results[index][row].load; p.route('training');
      p.notify('Charge précédente seule recopiée · répétitions, effort et statut conservés',() => {
        if (p.state.trainingDrafts[key] !== draft || draft.results[index][row].load !== expected || Object.hasOwn(draft.rawFields,field)) { p.notify('Cette charge a changé depuis. Elle est conservée.'); return false; }
        draft.results[index][row].load = before.load;
        for (const [fields,value] of [[draft.rawFields,before.raw],[draft.invalidFields,before.invalid]]) { if (value === undefined) delete fields[field]; else fields[field] = value; }
        if (p.view === 'training' && this.key === key) p.route('training');
      });
    }; });
    document.querySelectorAll('[data-repeat-set]').forEach(button => { button.onclick = () => {
      const index = draft.exerciseIndex, row = Number(button.dataset.repeatSet), previous = this.resultSnapshot(draft,index,row);
      if (!this.repeatResult(draft,index,row)) { p.notify('Renseigne une série précédente faite et valide avant de la recopier.'); return; }
      draft.activeSets[index] = row; p.route('training'); document.querySelector(`[data-repeat-set="${row}"]`)?.focus({preventScroll:true});
      p.notify('Résultat précédent recopié · cible conservée',() => { this.restoreResult(draft,index,row,previous); if (p.view === 'training') p.route('training'); });
    }; });
    document.querySelector('#training-add-set')?.addEventListener('click',() => { draft.results[draft.exerciseIndex].push({load:null,reps:null,rpe:null}); draft.activeSets[draft.exerciseIndex] = draft.results[draft.exerciseIndex].length-1; p.route('training'); document.querySelector('.training-set:last-child input')?.focus(); });
    document.querySelector('#training-previous')?.addEventListener('click',() => { draft.exerciseIndex--; p.route('training'); document.querySelector('.training-exercise h2')?.focus(); });
    document.querySelector('#training-next')?.addEventListener('click',() => { draft.exerciseIndex++; p.route('training'); document.querySelector('.training-exercise h2')?.focus(); });
  }
};
