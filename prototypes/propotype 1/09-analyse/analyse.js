'use strict';

window.AnalyseResultats = {
  exerciseKey(record,index) {
    const exercise = record.session.exercises[index];
    return JSON.stringify([exercise?.exerciseId,exercise?.slotId || index]);
  },
  point(record,index) {
    const exercise = record.session.exercises[index];
    return (window.Parcours.state.reviewPoints || []).find(point => point.recordId === record.id && point.exerciseId === exercise?.exerciseId && point.slotId === exercise?.slotId);
  },
  selection(record) {
    const ui = window.Parcours.state.ui;
    ui.analysis ||= {};
    const selection = ui.analysis[record.id] ||= {index:0,start:'',end:record.date,referenceId:'',text:this.point(record,0)?.text || ''};
    if (!record.session.exercises[selection.index]) selection.index = 0;
    selection.drafts ||= {};
    return selection;
  },
  switchExercise(record,index) {
    if (!record.session.exercises[index]) return false;
    const selection = this.selection(record);
    if (selection.index === index) return true;
    selection.drafts[this.exerciseKey(record,selection.index)] = {text:selection.text,referenceId:selection.referenceId};
    selection.index = index;
    const draft = selection.drafts[this.exerciseKey(record,index)];
    selection.text = draft?.text ?? this.point(record,index)?.text ?? '';
    selection.referenceId = draft?.referenceId || '';
    return true;
  },
  match(record, current, index) {
    const exercise = current.session.exercises[index];
    const matches = record.session.exercises.map((item,i) => ({exercise:item,index:i})).filter(item => item.exercise.exerciseId === exercise.exerciseId);
    if (record.workoutId && record.workoutId === current.workoutId && exercise.slotId) {
      const exact = matches.find(item => item.exercise.slotId === exercise.slotId);
      if (exact) return exact;
    }
    // Deux occurrences du même mouvement ne sont pas interchangeables sans slot fiable.
    return matches.length === 1 && current.session.exercises.filter(item => item.exerciseId === exercise.exerciseId).length === 1 ? matches[0] : null;
  },
  conditions(record, index) {
    const exercise = record.session.exercises[index];
    const setting = record.enrichment?.exercises?.[exercise.slotId || `exercise-${index}`]?.setting || exercise.setting || '';
    return {equipment:window.Ergonomie.normalize(exercise.equipment || ''),setting:window.Ergonomie.normalize(setting)};
  },
  compatible(record,index,current,currentIndex) {
    const a = this.conditions(record,index), b = this.conditions(current,currentIndex);
    return !!a.equipment && a.equipment === b.equipment && a.setting === b.setting;
  },
  valid(record,index,row) {
    const result = record.results?.[index]?.[row];
    return !!result && (!result.outcome || result.outcome === 'completed') && !result.adapted && !record.adaptations?.[`${index}:${row}`]
      && !window.Entrainement.rowInvalid(record,index,row) && Number.isFinite(result.load) && result.load >= 0 && Number.isInteger(result.reps) && result.reps > 0;
  },
  history(current,index,start = '',end = current.date) {
    return window.Parcours.state.completedSessions.filter(record => record.status === 'completed' && record.date >= start && record.date <= end &&
      (record.date < current.date || record.date === current.date && String(record.completedAt || '') <= String(current.completedAt || '')))
      .map(record => ({record,match:this.match(record,current,index)})).filter(item => item.match)
      .sort((a,b) => b.record.date.localeCompare(a.record.date) || String(b.record.completedAt || '').localeCompare(String(a.record.completedAt || '')) || String(a.record.id).localeCompare(String(b.record.id)));
  },
  compare(current,index,previous,previousIndex) {
    if (!this.compatible(previous,previousIndex,current,index)) return [];
    return (current.results[index] || []).map((result,row) => {
      const before = previous.results?.[previousIndex]?.[row];
      if (!this.valid(current,index,row) || !this.valid(previous,previousIndex,row)) return null;
      const load = result.load-before.load, reps = result.reps-before.reps;
      const conclusion = load === 0 && reps === 0 ? 'Stable' : load >= 0 && reps >= 0 ? 'Charge ou répétitions en hausse' : load <= 0 && reps <= 0 ? 'Charge ou répétitions en baisse' : 'Évolution mixte · pas de conclusion unique';
      return {row,load,reps,conclusion,rpe:Number.isFinite(result.rpe) && result.rpe >= 1 && result.rpe <= 10 && Number.isFinite(before.rpe) && before.rpe >= 1 && before.rpe <= 10 ? result.rpe-before.rpe : null};
    }).filter(Boolean);
  },
  records(current,index) {
    // Record de charge à répétitions identiques ; première mesure = référence, jamais un record.
    const earlier = this.history(current,index).filter(item => item.record.id !== current.id && this.compatible(item.record,item.match.index,current,index));
    return (current.results[index] || []).flatMap((result,row) => {
      if (!this.valid(current,index,row)) return [];
      const previous = earlier.flatMap(({record,match}) => (record.results[match.index] || []).filter((value,r) => this.valid(record,match.index,r) && value.reps === result.reps).map(value => value.load));
      return previous.length && result.load > Math.max(...previous) ? [{row,reps:result.reps,load:result.load,previous:Math.max(...previous)}] : [];
    });
  },
  reference(record,index,previous,referenceId) {
    return previous.find(item => item.record.id === referenceId) || previous.find(item => this.compare(record,index,item.record,item.match.index).length) || null;
  },
  setPeriod(record,preset) {
    const selection = this.selection(record);
    selection.start = preset === 'all' ? '' : new Date(Date.parse(`${record.date}T00:00:00Z`)-(Number(preset)*7-1)*86400000).toISOString().slice(0,10);
    selection.end = record.date;
    selection.periodPreset = preset; selection.periodError = ''; delete selection.periodRaw;
    selection.referenceId = '';
  },
  applyPeriod(record,start,end) {
    const selection = this.selection(record), last = end || record.date;
    const validDate = value => !value || /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(`${value}T00:00:00Z`)) && new Date(`${value}T00:00:00Z`).toISOString().slice(0,10) === value;
    selection.periodRaw = {start,end};
    selection.periodError = !validDate(start) || !validDate(last) || start > last || last > record.date ? 'Période non appliquée : choisis des dates valides, dans l’ordre, au plus tard à la date de ce bilan.' : '';
    if (selection.periodError) return false;
    Object.assign(selection,{start,end:last,periodPreset:'custom',referenceId:''}); delete selection.periodRaw;
    return true;
  },
  savePoint(record,index,text) {
    const p = window.Parcours, trimmed = text.trim(), exercise = record.session.exercises[index];
    if (!exercise || !trimmed || trimmed.length > 500) return {error:'Écris un point à revoir (1 à 500 caractères).'};
    const before = p.state.reviewPoints || [], existing = this.point(record,index), now = new Date().toISOString();
    const point = {...existing,id:existing?.id || crypto.randomUUID(),recordId:record.id,workoutId:record.workoutId,exerciseId:exercise.exerciseId,slotId:exercise.slotId,text:trimmed,createdAt:existing?.createdAt || now,updatedAt:now,resolvedAt:null};
    p.state.reviewPoints = [...before.filter(item => item !== existing),point];
    if (!p.persist()) { p.state.reviewPoints = before; return {error:'Point non confirmé. Garde ton texte et réessaie la sauvegarde.'}; }
    return {point};
  },
  updatePoint(id,changes) {
    const p = window.Parcours, before = p.state.reviewPoints, existing = before.find(point => point.id === id);
    if (!existing) return {error:'Ce point n’est plus disponible.'};
    if (Object.hasOwn(changes,'text') && (!changes.text.trim() || changes.text.trim().length > 500)) return {error:'Écris un point à revoir (1 à 500 caractères).'};
    const point = {...existing,...changes,...(Object.hasOwn(changes,'text') ? {text:changes.text.trim()} : {}),updatedAt:new Date().toISOString()};
    // Mettre à jour uniquement les copies du texte enregistré, sans écraser un brouillon différent.
    const selection = p.state.ui.analysis?.[point.recordId], synced = [];
    const record = p.state.completedSessions.find(record => record.id === point.recordId);
    if (selection && record && Object.hasOwn(changes,'text')) {
      const index = record.session.exercises.findIndex(exercise => exercise.exerciseId === point.exerciseId && exercise.slotId === point.slotId);
      const draft = selection.drafts?.[this.exerciseKey(record,index)];
      for (const target of [selection.index === index ? selection : null,draft]) {
        if (target?.text === existing.text) { synced.push(target); target.text = point.text; }
      }
    }
    p.state.reviewPoints = before.map(item => item === existing ? point : item);
    if (!p.persist()) {
      p.state.reviewPoints = before; synced.forEach(target => { target.text = existing.text; });
      return {error:'Modification non confirmée. Réessaie la sauvegarde.'};
    }
    return {point,previous:existing};
  },
  resolvePoint(id,refresh) {
    const result = this.updatePoint(id,{resolvedAt:new Date().toISOString()});
    const p = window.Parcours;
    if (result.error) { p.notify(result.error); return false; }
    refresh();
    p.notify('Point marqué résolu',() => {
      const current = p.state.reviewPoints.find(point => point.id === id);
      if (current !== result.point) { p.notify('Ce point a changé depuis. Il est conservé.'); return false; }
      const restored = this.updatePoint(id,{resolvedAt:result.previous.resolvedAt || null});
      if (restored.error) { p.notify(restored.error); return false; }
      refresh(); return true;
    });
    return true;
  },
  historyMarkup(record,index,history) {
    const p = window.Parcours;
    return history.map(({record:past,match}) => `<article><h3>${p.escape(past.date)} · ${p.escape(past.session.name)}</h3>
      ${!this.compatible(past,match.index,record,index) ? '<p>Matériel inconnu ou matériel/réglage différent : hors comparaison.</p>' : ''}
      <ul>${(past.results[match.index] || []).map((result,row) => `<li>Série ${row+1} · ${p.escape(window.Entrainement.resultState(result,window.Entrainement.rowInvalid(past,match.index,row)).label)} : ${result.outcome === 'skipped' ? 'sans résultat réalisé' : p.escape(window.BilanSeance.resultText(result))}${past.adaptations?.[`${match.index}:${row}`] || result.adapted ? ' · adaptée' : ''}</li>`).join('') || '<li>Aucune série renseignée.</li>'}</ul>
      ${window.BilanSeance.contextMarkup(past).replace('<details ',`<details data-summary-panel="analysis-context-${p.escape(past.id)}" `)}
      ${past.completion?.feeling ? `<p>Ressenti final : ${p.escape(past.completion.feeling)}</p>` : ''}
      <button type="button" class="text-action" data-analysis-bilan="${p.escape(past.id)}" data-analysis-index="${match.index}">Ouvrir cet exercice et ses notes/médias</button></article>`).join('') || '<p>Aucun résultat dans cette période.</p>';
  },
  render(record) {
    const p = window.Parcours, e = window.Ergonomie, selection = this.selection(record), index = selection.index;
    if (!record.session.exercises.length) return '<section><h2>Analyse des résultats</h2><p>Aucun exercice conservé à comparer.</p></section>';
    const history = this.history(record,index,selection.start,selection.end);
    const previous = history.filter(item => item.record.id !== record.id && this.compatible(item.record,item.match.index,record,index));
    const reference = this.reference(record,index,previous,selection.referenceId);
    const comparisons = reference ? this.compare(record,index,reference.record,reference.match.index) : [];
    const records = this.records(record,index), number = value => e.formatNumber(value), delta = value => `${value > 0 ? '+' : ''}${number(value)}`;
    const option = (value,label,selected) => `<option value="${p.escape(value)}" ${selected ? 'selected' : ''}>${p.escape(label)}</option>`;
    const point = this.point(record,index), raw = selection.periodRaw || selection;
    return `<section class="review-exercise analysis-results" aria-labelledby="analysis-title">
      <h2 id="analysis-title">Analyse des résultats</h2>
      <p class="analysis-intro"><strong>Une lecture simple de ta séance.</strong> On compare seulement les séries réellement faites dans des conditions comparables. Une première séance est déjà un repère utile.</p>
      <label>Exercice à comparer<select id="analysis-exercise">${record.session.exercises.map((exercise,i) => option(i,`${i+1}. ${exercise.name || window.catalogueExercices.find(item => item.id === exercise.exerciseId)?.name || 'Exercice personnel'}`,i === index)).join('')}</select></label>
      <p class="analysis-reference">${reference ? `Comparaison du ${p.escape(record.date)} avec le ${p.escape(reference.record.date)}` : 'Aucune séance précédente comparable avec des séries utilisables dans cette période. Première séance ou données insuffisantes : aucune progression déduite.'}</p>
      ${comparisons.length ? `<ul class="analysis-comparisons">${comparisons.map(item => {
        const current = record.results[index][item.row], before = reference.record.results[reference.match.index][item.row];
        return `<li><strong>Série ${item.row+1}</strong><div class="analysis-values"><span>Précédente : ${number(before.load)} kg × ${before.reps}</span><span>Cette séance : ${number(current.load)} kg × ${current.reps}</span></div><p>${delta(item.load)} kg · ${delta(item.reps)} répétition(s)${!p.isBeginner() && item.rpe !== null ? ` · RPE ${delta(item.rpe)}` : ''}. ${item.conclusion}.</p></li>`;
      }).join('')}</ul>` : reference ? '<p>Aucune paire de séries complètes comparable ; les omissions ne sont pas des zéros.</p>' : ''}
      ${records.length ? `<p><strong>Record(s) de charge à répétitions identiques</strong></p><ul>${records.map(item => `<li>Série ${item.row+1} : ${number(item.load)} kg × ${item.reps}, ancien maximum ${number(item.previous)} kg à ${item.reps} répétitions.</li>`).join('')}</ul>` : '<p>Aucun nouveau record de charge établi à répétitions identiques dans l’historique comparable disponible.</p>'}
      <div class="analysis-periods" role="group" aria-label="Période analysée">${[['4','4 semaines'],['12','12 semaines'],['all','Tout l’historique']].map(([value,label]) => `<button type="button" class="landing-button" data-analysis-period="${value}" aria-pressed="${(selection.periodPreset || 'all') === value}">${label}</button>`).join('')}</div>
      <p class="form-help">Période appliquée : ${p.escape(selection.start || 'début de l’historique')} → ${p.escape(selection.end)} · ${history.length} séance(s).</p>
      <details data-summary-panel="analysis-period"><summary>Période personnalisée et séance de référence</summary>
        <div class="training-result-fields"><label>Depuis le<input id="analysis-start" type="date" max="${p.escape(record.date)}" value="${p.escape(raw.start)}" aria-describedby="analysis-period-error" aria-invalid="${!!selection.periodError}"></label><label>Jusqu’au<input id="analysis-end" type="date" max="${p.escape(record.date)}" value="${p.escape(raw.end)}" aria-describedby="analysis-period-error" aria-invalid="${!!selection.periodError}"></label></div>
        ${previous.length ? `<label>Séance de référence<select id="analysis-reference">${option('','Dernière référence utilisable',!selection.referenceId)}${previous.map(item => option(item.record.id,`${item.record.date} · ${item.record.session.name}${this.compare(record,index,item.record,item.match.index).length ? '' : ' · sans séries comparables'}`,item.record.id === selection.referenceId)).join('')}</select></label>` : ''}
      </details>
      <p id="analysis-period-error" class="error" role="alert">${p.escape(selection.periodError || '')}</p>
      <details data-summary-panel="analysis-rules"><summary>Pourquoi cette comparaison ?</summary><p>Même exercice, matériel et réglage conservés. Les conditions non saisies restent inconnues ; vérifie-les dans les bilans. Les séries adaptées, interrompues, non faites, invalides ou incomplètes sont exclues des écarts et records.</p><p>Les écarts décrivent les résultats ; ils ne prouvent ni une cause ni un besoin de modifier la difficulté. Le nombre de séances indique la régularité, pas un gain de capacité. Les records utilisent tout l’historique comparable disponible jusqu’à cette séance, indépendamment de la période affichée.</p></details>
      <details data-summary-panel="analysis-history"><summary>Évolution, contexte et limites par séance</summary>${this.historyMarkup(record,index,history)}</details>
      <form id="analysis-point-form"><label>Mon interprétation / point à revoir en préparation T1 (facultatif)<textarea id="analysis-point" maxlength="500" rows="2">${p.escape(selection.text)}</textarea></label>
        <button id="analysis-save-point" class="landing-button" type="submit">${point ? point.resolvedAt ? 'Rouvrir et conserver le point' : 'Mettre à jour le point' : 'Conserver le point à revoir'}</button>
        ${point && !point.resolvedAt ? '<button class="text-action" type="button" id="analysis-resolve-point">Marquer résolu</button>' : ''}
        <p id="analysis-save-status" role="status">${point ? point.resolvedAt ? 'Point résolu · conservé dans l’historique.' : 'Point déjà conservé pour T1.' : ''}</p>
      </form><p class="form-help">Les points sont retrouvables dans la préparation T1 ; tes cibles restent sous ton contrôle.</p>
    </section>`;
  },
  bind(record) {
    const p = window.Parcours, selection = this.selection(record);
    const refresh = () => { p.persist(); p.route('summary'); };
    document.querySelector('#analysis-exercise')?.addEventListener('change',event => { this.switchExercise(record,Number(event.target.value)); refresh(); });
    document.querySelectorAll('[data-analysis-period]').forEach(button => { button.onclick = () => { this.setPeriod(record,button.dataset.analysisPeriod); refresh(); }; });
    for (const id of ['analysis-start','analysis-end']) document.getElementById(id)?.addEventListener('change',() => {
      const start = document.getElementById('analysis-start'), end = document.getElementById('analysis-end');
      let applied = false;
      if (start.validity.badInput || end.validity.badInput) { selection.periodRaw = {start:start.value,end:end.value}; selection.periodError = 'Période non appliquée : complète ou efface la date signalée.'; }
      else applied = this.applyPeriod(record,start.value,end.value);
      if (!applied || selection.periodError) {
        document.getElementById('analysis-period-error').textContent = selection.periodError;
        start.setAttribute('aria-invalid','true'); end.setAttribute('aria-invalid','true'); p.persist(); return;
      }
      refresh();
    });
    document.querySelector('#analysis-reference')?.addEventListener('change',event => { selection.referenceId = event.target.value; refresh(); });
    document.querySelectorAll('[data-analysis-bilan]').forEach(button => { button.onclick = () => window.BilanSeance.open(button.dataset.analysisBilan,Number(button.dataset.analysisIndex)); });
    document.querySelector('#analysis-point')?.addEventListener('input',event => { selection.text = event.target.value; p.persist(); });
    document.querySelector('#analysis-point-form')?.addEventListener('submit',event => {
      event.preventDefault(); const result = this.savePoint(record,selection.index,selection.text);
      if (result.error) document.querySelector('#analysis-save-status').textContent = result.error;
      else { refresh(); document.querySelector('#analysis-save-status').textContent = 'Point conservé pour la préparation T1 · cibles inchangées.'; }
    });
    document.querySelector('#analysis-resolve-point')?.addEventListener('click',() => this.resolvePoint(this.point(record,selection.index).id,refresh));
  }
};
