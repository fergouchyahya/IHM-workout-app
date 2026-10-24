'use strict';

window.AnalyseResultats = {
  selection(record) {
    const ui = window.Parcours.state.ui;
    ui.analysis ||= {};
    const selection = ui.analysis[record.id] ||= {index:0,start:'',end:record.date,referenceId:'',text:''};
    if (!record.session.exercises[selection.index]) selection.index = 0;
    return selection;
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
  savePoint(record,index,text) {
    const p = window.Parcours, trimmed = text.trim(), exercise = record.session.exercises[index];
    if (!exercise || !trimmed || trimmed.length > 500) return {error:'Écris un point à revoir (1 à 500 caractères).'};
    const before = p.state.reviewPoints || [], existing = before.find(point => point.recordId === record.id && point.exerciseId === exercise.exerciseId && point.slotId === exercise.slotId);
    const point = {id:existing?.id || crypto.randomUUID(),recordId:record.id,workoutId:record.workoutId,exerciseId:exercise.exerciseId,slotId:exercise.slotId,text:trimmed,createdAt:new Date().toISOString()};
    p.state.reviewPoints = [...before.filter(item => item !== existing),point];
    if (!p.persist()) { p.state.reviewPoints = before; return {error:'Point non confirmé. Garde ton texte et réessaie la sauvegarde.'}; }
    return {point};
  },
  render(record) {
    const p = window.Parcours, e = window.Ergonomie, selection = this.selection(record), index = selection.index;
    if (!record.session.exercises.length) return '<section><h2>Analyse des résultats</h2><p>Aucun exercice conservé à comparer.</p></section>';
    const history = this.history(record,index,selection.start,selection.end), previous = history.filter(item => item.record.id !== record.id && this.compatible(item.record,item.match.index,record,index));
    const reference = previous.find(item => item.record.id === selection.referenceId) || previous[0];
    const comparisons = reference ? this.compare(record,index,reference.record,reference.match.index) : [];
    const records = this.records(record,index), number = value => e.formatNumber(value), delta = value => `${value > 0 ? '+' : ''}${number(value)}`;
    const option = (value,label,selected) => `<option value="${p.escape(value)}" ${selected ? 'selected' : ''}>${p.escape(label)}</option>`;
    return `<section class="review-exercise analysis-results" aria-labelledby="analysis-title"><h2 id="analysis-title">Analyse des résultats</h2><label>Exercice à comparer<select id="analysis-exercise">${record.session.exercises.map((exercise,i) => option(i,`${i+1}. ${exercise.name || window.catalogueExercices.find(item => item.id === exercise.exerciseId)?.name || 'Exercice personnel'}`,i === index)).join('')}</select></label><div class="training-result-fields"><label>Depuis le<input id="analysis-start" type="date" max="${p.escape(record.date)}" value="${p.escape(selection.start)}"></label><label>Jusqu’au<input id="analysis-end" type="date" max="${p.escape(record.date)}" value="${p.escape(selection.end)}"></label></div><p class="form-help">Même exercice, matériel et réglage conservés. Les conditions non saisies restent inconnues ; vérifie-les dans les bilans. Les séries adaptées, interrompues, non faites, invalides ou incomplètes sont exclues des écarts et records.</p><p role="status">${history.length} séance(s) avec cet exercice dans la période · ${previous.length} référence(s) compatible(s). La régularité indique la présence de séances, pas un gain de capacité.</p>${reference ? `<label>Séance de référence<select id="analysis-reference">${previous.map(item => option(item.record.id,`${item.record.date} · ${item.record.session.name}`,item.record.id === reference.record.id)).join('')}</select></label>` : '<p>Aucune séance précédente comparable dans cette période. Première séance ou conditions différentes : aucune progression déduite.</p>'}${comparisons.length ? `<ul>${comparisons.map(item => `<li>Série ${item.row+1} : ${delta(item.load)} kg · ${delta(item.reps)} répétition(s)${!p.isBeginner() && item.rpe !== null ? ` · RPE ${delta(item.rpe)}` : ''}. ${item.conclusion}.</li>`).join('')}</ul>` : reference ? '<p>Aucune paire de séries complètes comparable ; les omissions ne sont pas des zéros.</p>' : ''}<p>Ces écarts décrivent les résultats ; ils ne prouvent ni une cause ni un besoin de modifier la difficulté.</p>${records.length ? `<p><strong>Record(s) de charge à répétitions identiques</strong> · historique comparable disponible jusqu’à cette séance, toutes périodes.</p><ul>${records.map(item => `<li>Série ${item.row+1} : ${number(item.load)} kg × ${item.reps}, ancien maximum ${number(item.previous)} kg à ${item.reps} répétitions.</li>`).join('')}</ul>` : '<p>Aucun nouveau record de charge établi à répétitions identiques dans l’historique comparable disponible.</p>'}<details><summary>Évolution, contexte et limites par séance</summary><p>Chaque ligne est une série réelle. Les cibles ne sont pas utilisées. Un réglage ou matériel différent empêche la comparaison automatique. Ouvre le bilan pour relire contexte, notes, raisons et médias.</p>${history.map(({record:past,match}) => `<article><h3>${p.escape(past.date)} · ${p.escape(past.session.name)}</h3>${!this.compatible(past,match.index,record,index) ? '<p>Matériel inconnu ou matériel/réglage différent : hors comparaison.</p>' : ''}<ul>${(past.results[match.index] || []).map((result,row) => `<li>Série ${row+1} · ${p.escape(window.Entrainement.resultState(result,window.Entrainement.rowInvalid(past,match.index,row)).label)} : ${result.outcome === 'skipped' ? 'sans résultat réalisé' : p.escape(window.BilanSeance.resultText(result))}${past.adaptations?.[`${match.index}:${row}`] || result.adapted ? ' · adaptée' : ''}</li>`).join('') || '<li>Aucune série renseignée.</li>'}</ul>${window.BilanSeance.contextMarkup(past)}${past.completion?.feeling ? `<p>Ressenti final : ${p.escape(past.completion.feeling)}</p>` : ''}${past.id !== record.id ? `<button type="button" class="text-action" data-analysis-bilan="${p.escape(past.id)}">Ouvrir le bilan et ses notes/médias</button>` : '<p>Notes et médias dans les exercices ci-dessous.</p>'}</article>`).join('') || '<p>Aucun résultat dans cette période.</p>'}</details><form id="analysis-point-form"><label>Mon interprétation / point à revoir en préparation T1 (facultatif)<textarea id="analysis-point" maxlength="500" rows="2">${p.escape(selection.text)}</textarea></label><button class="landing-button" type="submit">Conserver le point à revoir</button><p id="analysis-save-status" role="status"></p></form><p>Le point sera visible dans la prochaine préparation de cette séance. Utilise « Programmer une nouvelle séance à partir de celle-ci » pour revenir à T1 ; les cibles restent à ta main.</p></section>`;
  },
  bind(record) {
    const p = window.Parcours, selection = this.selection(record);
    const refresh = () => { p.persist(); p.route('summary'); };
    document.querySelector('#analysis-exercise')?.addEventListener('change',event => { selection.index = Number(event.target.value); selection.referenceId = ''; selection.text = ''; refresh(); });
    for (const [id,key] of [['analysis-start','start'],['analysis-end','end']]) document.getElementById(id)?.addEventListener('change',event => {
      const value = event.target.value;
      if (!event.target.checkValidity() || value && (key === 'start' ? value > selection.end : value < selection.start)) { event.target.setCustomValidity('Choisis une période chronologique terminant au plus tard à la date de ce bilan.'); event.target.reportValidity(); event.target.setCustomValidity(''); return; }
      selection[key] = value || (key === 'end' ? record.date : ''); selection.referenceId = ''; refresh();
    });
    document.querySelector('#analysis-reference')?.addEventListener('change',event => { selection.referenceId = event.target.value; refresh(); });
    document.querySelectorAll('[data-analysis-bilan]').forEach(button => { button.onclick = () => window.BilanSeance.open(button.dataset.analysisBilan); });
    document.querySelector('#analysis-point')?.addEventListener('input',event => { selection.text = event.target.value; p.persist(); });
    document.querySelector('#analysis-point-form')?.addEventListener('submit',event => {
      event.preventDefault(); const result = this.savePoint(record,selection.index,selection.text);
      document.querySelector('#analysis-save-status').textContent = result.error || 'Point conservé pour la préparation T1 · cibles inchangées.';
    });
  }
};
