'use strict';

window.BilanSeance = {
  activeId:null,
  rows(draft) {
    return draft.session.exercises.flatMap((exercise,index) => (draft.results[index] || []).map((result,row) => ({index,row,result,exercise,state:window.Entrainement.resultState(result,window.Entrainement.rowInvalid(draft,index,row)),adapted:!!draft.adaptations?.[`${index}:${row}`] || !!result.adapted})));
  },
  counts(draft) {
    const counts = {completed:0,interrupted:0,skipped:0,pending:0,invalid:0,adapted:0,incomplete:0};
    for (const item of this.rows(draft)) {
      counts[item.state.code]++; if (item.adapted) counts.adapted++;
      if (item.state.code === 'completed' && (item.result.load == null || !(item.result.reps > 0))) counts.incomplete++;
    }
    return counts;
  },
  issues(draft) {
    const issues = window.Entrainement.invalidEntries(draft).map(([field,message]) => ({field,message,index:Number(field.split(':')[0]),row:Number(field.split(':')[1])}));
    for (const [field,message] of Object.entries(draft.enrichment?.errors || {})) issues.push({field,message,context:true});
    return issues;
  },
  ensure(draft) { draft.completion ||= {feeling:'',note:'',reminder:''}; },
  finish(key) {
    const p = window.Parcours, draft = p.state.trainingDrafts[key];
    if (!draft) return {record:p.state.completedSessions.find(record => record.executionKey === key)};
    if (this.issues(draft).length) return {error:'Corrige les valeurs signalées avant de conserver le bilan.'};
    if (window.EnrichissementSeance.pendingWrites) return {error:'Attends la fin de l’ajout ou du retrait de média, puis réessaie.'};
    this.ensure(draft); draft.completionId ||= crypto.randomUUID();
    const record = {...structuredClone(draft),id:draft.completionId,executionKey:key,status:'completed',completedAt:new Date().toISOString()};
    record.session.exercises.forEach(exercise => {
      const movement = (window.catalogueExercices || []).find(item => item.id === exercise.exerciseId);
      exercise.name ||= movement?.name || 'Exercice personnel';
      exercise.instruction ||= movement?.instruction || ''; exercise.equipment ||= movement?.equipment || '';
    });
    for (const field of ['activeSets','exerciseIndex','outcomeDetails','dayStateOpen','completionId','reviewing']) delete record[field];
    const before = [...p.state.completedSessions];
    p.state.completedSessions = [record,...before.filter(item => item.id !== record.id)]; delete p.state.trainingDrafts[key];
    if (!p.persist()) {
      p.state.completedSessions = before; p.state.trainingDrafts[key] = draft; p.persist();
      return {error:'Le bilan n’a pas pu être confirmé. Ta séance reste en cours, avec ses saisies. Réessaie après avoir rétabli le stockage.'};
    }
    return {record};
  },
  openReview() {
    const draft = window.Parcours.state.trainingDrafts[window.Entrainement.key];
    if (!draft) return;
    this.ensure(draft); if (!draft.reviewing) window.Parcours.state.ui.scroll.review = 0; draft.reviewing = true; window.Parcours.route('review');
  },
  open(id) { const p = window.Parcours; if (p.view !== 'summary') this.origin = ['mine','progress'].includes(p.view) ? p.captureLocation?.() : {view:'mine',identity:p.state.identity,scroll:0,date:p.state.completedSessions.find(item => item.id === id)?.date}; const changed = this.activeId !== id; this.activeId = id; window.Parcours.route('summary'); if (changed) window.scrollTo(0,0); },
  countsMarkup(draft) {
    const c = this.counts(draft);
    return `<div class="review-counts" aria-label="Bilan des séries">${[['completed','faite','faites'],['interrupted','interrompue','interrompues'],['skipped','non faite','non faites'],['pending','non renseignée','non renseignées']].map(([key,singular,plural]) => `<span>${c[key]} ${c[key] === 1 ? singular : plural}</span>`).join('')}${c.invalid ? `<span class="error">${c.invalid} à corriger</span>` : ''}${c.adapted ? `<span>${c.adapted} adaptation${c.adapted > 1 ? 's' : ''}</span>` : ''}${c.incomplete ? `<span>${c.incomplete} résultat${c.incomplete > 1 ? 's' : ''} incomplet${c.incomplete > 1 ? 's' : ''}</span>` : ''}</div>`;
  },
  resultText(result) {
    const values = [result.load == null ? 'Charge non renseignée' : `${Number(result.load).toLocaleString('fr-FR')} kg`, result.reps == null ? 'Répétitions non renseignées' : `${result.reps} répétitions`, result.rpe != null ? `Effort ${Number(result.rpe).toLocaleString('fr-FR')}/10 (RPE)` : result.feeling || ''];
    return values.filter(Boolean).join(' · ');
  },
  exerciseCards(draft,editable = false) {
    const p = window.Parcours, t = window.Entrainement;
    return draft.session.exercises.map((exercise,index) => {
      const movement = window.catalogueExercices.find(item => item.id === exercise.exerciseId), notes = draft.enrichment?.exercises?.[exercise.slotId || `exercise-${index}`];
      return `<section class="review-exercise"><h2>${p.escape(exercise.name || movement?.name || 'Exercice personnel')}</h2><p class="exercise-common-target"><strong>Cible initiale commune :</strong> ${p.escape(t.targetText(exercise))}</p><ol class="review-results">${(draft.results[index] || []).map((result,row) => {
        const state = t.resultState(result,t.rowInvalid(draft,index,row)), target = draft.adaptations?.[`${index}:${row}`];
        const rawErrors = Object.entries(draft.invalidFields || {}).filter(([field]) => field.startsWith(`${index}:${row}:`));
        return `<li><div class="landing-row"><strong>Série ${row+1}</strong><span class="review-set-status">${p.escape(state.label)}${target || result.adapted ? ' · adaptée' : ''}</span></div>${state.code === 'skipped' ? '<p class="form-help">Déclarée non faite. Les valeurs mises de côté ne sont pas des résultats réalisés.</p>' : `<p>${p.escape(this.resultText(result))}</p>`}${state.code === 'invalid' ? rawErrors.map(([field,message]) => `<p class="error">${p.escape(field.split(':')[2])} : ${p.escape(draft.rawFields[field])} · ${p.escape(message)}</p>`).join('') : ''}${target ? `<p class="form-help">Cible initiale : ${p.escape(t.targetText(exercise))}</p>` : ''}${target ? `<p class="form-help">Cible adaptée : ${p.escape(t.targetText(target))}${target.reason ? ` · ${p.escape(target.reason)}` : ''}</p>` : ''}${result.outcomeReason ? `<p>Raison : ${p.escape(result.outcomeReason)}</p>` : ''}${editable ? `<div class="review-row-actions"><button type="button" class="text-action" data-review-fix="${index}:${row}">Corriger cette série</button>${state.code === 'pending' ? `<button type="button" class="text-action" data-review-skip="${index}:${row}">Marquer non faite</button>` : ''}</div>` : ''}</li>`;
      }).join('') || '<li class="form-help">Aucune série prévue ou renseignée.</li>'}</ol>${exercise.note || exercise.setting || notes && (notes.note || notes.setting || notes.reminder || (notes.media || []).length) ? `<details class="review-notes"><summary>Notes et réglages${notes?.media?.length ? ` · ${notes.media.length} média${notes.media.length > 1 ? 's' : ''}` : ''}</summary>${exercise.note ? `<p><strong>Consigne prévue :</strong> ${p.escape(exercise.note)}</p>` : ''}${exercise.setting ? `<p><strong>Réglage prévu :</strong> ${p.escape(exercise.setting)}</p>` : ''}${[['note','Remarque'],['setting','Réglage utilisé'],['reminder','Rappel']].map(([key,label]) => notes?.[key] ? `<p><strong>${label} :</strong> ${p.escape(notes[key])}</p>` : '').join('')}${(notes?.media || []).map(media => `<article class="training-media-card"><p><strong>${p.escape(media.caption || media.name)}</strong>${media.row != null ? ` · Série ${media.row+1}` : ' · Exercice'}</p><div data-media-preview="${media.id}"><p>Chargement du média…</p></div></article>`).join('')}</details>` : ''}</section>`;
    }).join('');
  },
  contextMarkup(draft) {
    const p = window.Parcours, c = draft.enrichment?.context || {}, day = draft.dayState || {};
    const lines = [day.feeling ? `État initial : ${day.feeling}` : '',day.effort ? `Effort choisi : ${day.effort}` : '',day.note,c.sleepHours != null ? `Sommeil : ${c.sleepHours} h` : '',c.fatigue ? `Fatigue : ${c.fatigue}` : '',c.pain ? `Douleur/gêne : ${c.pain}` : '',c.adaptationReason];
    return lines.some(Boolean) ? `<details class="review-notes"><summary>Contexte de la séance</summary>${lines.filter(Boolean).map(line => `<p>${p.escape(line)}</p>`).join('')}</details>` : '';
  },
  renderReview() {
    const p = window.Parcours, draft = p.state.trainingDrafts[window.Entrainement.key];
    if (!draft) return '<h1 tabindex="-1">Bilan indisponible</h1>';
    this.ensure(draft); const counts = this.counts(draft), issues = this.issues(draft);
    return `<button id="review-back" type="button" class="text-action">← Reprendre la séance</button><h1 tabindex="-1">Vérifier le bilan</h1><p>${p.escape(draft.session.name)} · ${window.Calendrier.label(draft.date)}</p>${this.countsMarkup(draft)}${counts.pending || counts.incomplete ? `<p class="review-warning">${counts.pending ? `${counts.pending} série(s) restent non renseignées. ` : ''}${counts.incomplete ? `${counts.incomplete} série(s) déclarées faites ont des valeurs manquantes. ` : ''}Tu peux corriger ou conserver ces informations telles quelles ; aucun résultat ne sera inventé.</p>` : ''}${issues.length ? `<section class="review-errors"><h2>À corriger avant conservation</h2>${issues.map(issue => `<button type="button" class="text-action error" ${issue.context ? 'data-review-context' : `data-review-fix="${issue.index}:${issue.row}"`}>${p.escape(issue.context ? 'Contexte de séance' : `Exercice ${issue.index+1}, série ${issue.row+1}`)} : ${p.escape(issue.message)}</button>`).join('')}</section>` : ''}${this.exerciseCards(draft,true)}${this.contextMarkup(draft)}<details class="review-final-feeling" ${(draft.session.tracking?.feeling || draft.completion.feeling || draft.completion.note || draft.completion.reminder) ? 'open' : ''}><summary>Ton bilan (facultatif)</summary><div class="day-state-choices" role="group" aria-label="Ressenti global après la séance">${['Bien','Mitigé','Difficile'].map(value => `<button class="landing-button" type="button" data-completion-feeling="${value}" aria-pressed="${draft.completion.feeling === value}">${value}</button>`).join('')}</div><label>Comment s’est passée la séance ?<textarea data-completion="note" rows="2" maxlength="500">${p.escape(draft.completion.note)}</textarea></label><label>Un rappel pour la prochaine revue ?<textarea data-completion="reminder" rows="2" maxlength="500">${p.escape(draft.completion.reminder)}</textarea></label></details><p id="review-save-status" role="status" class="form-help">${p.storageFailed ? 'Sauvegarde indisponible' : 'Bilan en préparation · séance encore en cours'}</p><p id="review-error" class="error" role="alert"></p><div class="review-footer"><p>Cette confirmation termine la séance et conserve ses résultats, ses notes et ses médias.</p><button id="confirm-training-completion" type="button" class="primary-action" ${issues.length ? 'disabled' : ''}>${counts.pending ? `Conserver avec ${counts.pending} série(s) non renseignée(s)` : 'Terminer et conserver le bilan'}</button></div>`;
  },
  renderSummary() {
    const p = window.Parcours, record = p.state.completedSessions.find(item => item.id === this.activeId);
    if (!record) return '<h1 tabindex="-1">Bilan introuvable</h1>';
    return `<button id="summary-calendar" type="button" class="text-action">← ${this.origin?.view === 'progress' ? 'Mes bilans' : 'Calendrier'}</button><h1 tabindex="-1">Séance conservée</h1><p>${p.escape(record.session.name)} · ${window.Calendrier.label(record.date)}</p><p class="ready-status">Terminée · bilan enregistré sur cet appareil</p>${this.countsMarkup(record)}${record.completion?.feeling ? `<p><strong>Ressenti global :</strong> ${p.escape(record.completion.feeling)}</p>` : ''}${record.completion?.note ? `<p>${p.escape(record.completion.note)}</p>` : ''}${record.completion?.reminder ? `<p><strong>Rappel :</strong> ${p.escape(record.completion.reminder)}</p>` : ''}${this.exerciseCards(record)}${this.contextMarkup(record)}<p class="form-help">Résultats, notes et médias conservés pour cette séance.</p><button id="summary-new-session" type="button" class="landing-button">Programmer une nouvelle séance à partir de celle-ci</button><button id="summary-history" type="button" class="landing-button">Mes bilans conservés</button>`;
  },
  renderHistory() {
    const p = window.Parcours;
    return `<h1 tabindex="-1">Bilans conservés</h1>${window.Entrainement.ongoingMarkup()}<p class="form-help">Retrouver les résultats de tes séances terminées. </p><div class="landing-stack">${p.state.completedSessions.map(record => `<button type="button" class="landing-card" data-open-summary="${record.id}"><h2>${p.escape(record.session.name)}</h2><p>${window.Calendrier.label(record.date)}</p><p>${this.counts(record).completed} série(s) faite(s) · ${this.counts(record).interrupted} interrompue(s)</p></button>`).join('') || '<p>Aucune séance terminée. Reprends tes séances en cours depuis Calendrier.</p>'}</div>`;
  },
  bindReview() {
    const p = window.Parcours, key = window.Entrainement.key, draft = p.state.trainingDrafts[key]; if (!draft) return;
    const fix = (index,row,context = false) => {
      if (!context) { draft.exerciseIndex = index; draft.activeSets[index] = row; }
      p.route('training');
      if (context) { window.EnrichissementSeance.openContext(); }
      else { const field = Object.keys(draft.invalidFields).find(field => field.startsWith(`${index}:${row}:`))?.split(':')[2] || 'load'; document.querySelector(`[data-result="${row}"][data-result-key="${field}"]`)?.focus(); }
    };
    document.querySelector('#review-back').onclick = () => p.route('training');
    document.querySelectorAll('[data-review-fix]').forEach(button => { button.onclick = () => fix(...button.dataset.reviewFix.split(':').map(Number)); });
    document.querySelectorAll('[data-review-context]').forEach(button => { button.onclick = () => fix(0,0,true); });
    document.querySelectorAll('[data-review-skip]').forEach(button => { button.onclick = () => {
      const [index,row] = button.dataset.reviewSkip.split(':').map(Number), before = window.Entrainement.resultSnapshot(draft,index,row);
      window.Entrainement.setOutcome(draft,index,row,'skipped'); p.route('review'); p.notify('Série déclarée non faite',() => { window.Entrainement.restoreResult(draft,index,row,before); p.route('review'); });
    }; });
    const saved = () => { document.querySelector('#review-save-status').textContent = p.persist() ? 'Bilan en préparation · choix conservés' : 'Sauvegarde indisponible'; };
    document.querySelectorAll('[data-completion-feeling]').forEach(button => { button.onclick = () => {
      draft.completion.feeling = draft.completion.feeling === button.dataset.completionFeeling ? '' : button.dataset.completionFeeling;
      document.querySelectorAll('[data-completion-feeling]').forEach(choice => choice.setAttribute('aria-pressed',String(choice.dataset.completionFeeling === draft.completion.feeling))); saved();
    }; });
    document.querySelectorAll('[data-completion]').forEach(input => { input.oninput = () => { draft.completion[input.dataset.completion] = input.value; saved(); }; });
    document.querySelector('#confirm-training-completion').onclick = () => {
      const result = this.finish(key);
      if (result.error || !result.record) { document.querySelector('#review-error').textContent = result.error || 'Bilan indisponible.'; return; }
      p.notify('Séance terminée · bilan conservé'); this.open(result.record.id);
    };
    this.hydrate(draft,key);
  },
  hydrate(record,key) {
    // Les références conservent la clé d’exécution utilisée lors de l’ajout des fichiers.
    record.session.exercises.forEach((_,index) => window.EnrichissementSeance.hydrate(record,index,key,window.Parcours.state.identity));
  },
  bindSummary() {
    document.querySelector('#summary-calendar')?.addEventListener('click',() => window.Parcours.returnTo(this.origin));
    document.querySelector('#summary-history')?.addEventListener('click',() => window.Parcours.route('progress'));
    const record = window.Parcours.state.completedSessions.find(item => item.id === this.activeId);
    if (record) {
      this.hydrate(record,record.executionKey);
      document.querySelector('#summary-new-session').onclick = () => { const source = {...structuredClone(record.session),id:record.workoutId,organization:'Séance seule'}; window.Parcours.route('mine'); window.Calendrier.schedule(source); };
    }
  },
  bindHistory() { document.querySelectorAll('[data-ongoing]').forEach(button => { button.onclick = () => window.Entrainement.resume(button.dataset.ongoing); }); document.querySelectorAll('[data-open-summary]').forEach(button => { button.onclick = () => this.open(button.dataset.openSummary); }); }
};
