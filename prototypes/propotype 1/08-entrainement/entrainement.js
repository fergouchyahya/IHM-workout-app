'use strict';

window.Entrainement = {
  open(session,key,date) {
    const p = window.Parcours; this.key = key;
    if (!p.state.trainingDrafts[key]) {
      const prepared = window.ConfigurationSeance.normalizeSession(session);
      p.state.trainingDrafts[key] = {session:prepared,date:date || window.Calendrier.today(),exerciseIndex:0,results:prepared.exercises.map(exercise => Array.from({length:exercise.sets || 0},() => ({load:null,reps:null,rpe:null})))};
    }
    p.state.trainingDrafts[key].rawFields ||= {}; p.state.trainingDrafts[key].invalidFields ||= {};
    p.route('training');
  },
  render() {
    const p = window.Parcours, draft = p.state.trainingDrafts[this.key], exercises = draft.session.exercises, index = draft.exerciseIndex;
    const exercise = exercises[index], item = window.catalogueExercices.find(item => item.id === exercise?.exerciseId);
    const invalidExercise = Object.keys(draft.invalidFields)[0]?.split(':')[0];
    return `<button id="training-back" type="button" class="text-action">← Quitter · saisie conservée</button><div class="training-title"><div><p class="week-heading">${window.Calendrier.label(draft.date)}</p><h1 tabindex="-1">${p.escape(draft.session.name)}</h1></div><span class="landing-tag">En cours</span></div><p class="draft-status" id="training-save-status" role="status">Saisie conservée automatiquement</p>${invalidExercise !== undefined ? `<button type="button" class="error invalid-entry-link" data-invalid-exercise="${invalidExercise}">Une saisie est à corriger · exercice ${Number(invalidExercise)+1}</button>` : ''}${exercise ? `${p.select(`Exercice ${index+1} sur ${exercises.length}`,'trainingExercise',exercises.map((exercise,i) => [String(i),`${i+1}. ${window.catalogueExercices.find(item => item.id === exercise.exerciseId)?.name || 'Exercice personnel'}`]),String(index),'id="training-exercise"')}<section class="training-exercise"><div class="training-exercise-heading"><img src="${p.escape(item?.image || '../06-configuration-seance/images/personal.svg')}" alt="Illustration : ${p.escape(item?.name)}" width="72" height="68"><div><h2>${p.escape(item?.name)}</h2><p>${p.escape(window.ConfigurationSeance.summary(exercise))}</p></div></div><p>${p.escape(item?.instruction || 'Consigne non renseignée.')}</p><div class="training-context"><p><strong>Consigne personnelle :</strong> ${p.escape(exercise.note || 'Non renseignée')}</p><p><strong>Réglage :</strong> ${p.escape(exercise.setting || 'Non renseigné')}</p></div></section><div class="landing-row"><h2>Résultats réels</h2><span class="landing-hint">kg · répétitions${draft.session.tracking.rpe ? ' · effort' : ''}</span></div><p class="landing-hint">Vide = non renseigné · 0 kg = sans charge ajoutée.</p><div class="training-series">${draft.results[index].map((result,row) => `<fieldset class="training-set"><legend>Série ${row+1}</legend><div class="training-result-fields">${[['load','Charge (kg)',0,'any'],['reps','Répétitions',1,'1'],...(draft.session.tracking.rpe ? [['rpe','Effort (RPE)',1,'0.5']] : [])].map(([key,label,min,step]) => { const field = `${index}:${row}:${key}`; return `<label>${label}<input type="${['any','0.5'].includes(step) ? 'text' : 'number'}" data-numeric="true" data-result="${row}" data-result-key="${key}" value="${p.escape(draft.rawFields[field] ?? result[key] ?? '')}" min="${min}" step="${step}" ${key === 'rpe' ? 'max="10"' : ''} aria-invalid="${!!draft.invalidFields[field]}" aria-describedby="result-error-${row}"></label>`; }).join('')}</div><div class="set-tools"><p class="set-status" data-set-status="${row}">${this.setStatus(result)}</p>${row ? `<button type="button" class="text-action repeat-result" data-repeat-set="${row}">Même résultat que série ${row}</button>` : ''}</div><p class="error" id="result-error-${row}" role="alert">${p.escape(Object.entries(draft.invalidFields).find(([key]) => key.startsWith(`${index}:${row}:`))?.[1] || '')}</p></fieldset>`).join('')}</div>${!draft.results[index].length ? '<p class="preparation-notice">Aucune série prévue. Ajoute une série pour saisir un résultat.</p>' : ''}<button id="training-add-set" type="button" class="landing-button">+ Ajouter une série</button><div class="training-navigation"><button id="training-previous" type="button" class="landing-button" ${index === 0 ? 'disabled' : ''}>← Précédent</button><button id="training-next" type="button" class="landing-button" ${index === exercises.length-1 ? 'disabled' : ''}>Suivant →</button></div>` : '<p class="preparation-notice">Aucun exercice préparé. Retourne à la préparation pour en ajouter.</p>'}`;
  },
  setStatus(result) { return result.load === null ? 'Non renseignée' : result.reps === null ? 'Charge renseignée · répétitions à compléter' : 'Faite'; },
  bind() {
    const p = window.Parcours, draft = p.state.trainingDrafts[this.key];
    document.querySelector('#training-back').onclick = () => { window.ConfigurationSeance.stage = 'overview'; p.route('workout'); };
    document.querySelector('#training-exercise')?.addEventListener('change',event => { draft.exerciseIndex = Number(event.target.value); p.route('training'); });
    document.querySelector('[data-invalid-exercise]')?.addEventListener('click',event => { draft.exerciseIndex = Number(event.target.dataset.invalidExercise); p.route('training'); document.querySelector('[aria-invalid="true"]')?.focus(); });
    document.querySelectorAll('[data-result]').forEach(input => {
      input.oninput = () => {
        const field = `${draft.exerciseIndex}:${input.dataset.result}:${input.dataset.resultKey}`;
        draft.rawFields[field] = input.value;
        const invalid = !window.Ergonomie.validateNumber(input);
        input.setAttribute('aria-invalid',String(invalid));
        if (invalid) draft.invalidFields[field] = 'Indique un résultat valide, ou laisse le champ vide.'; else delete draft.invalidFields[field];
        document.querySelector(`#result-error-${input.dataset.result}`).textContent = draft.invalidFields[field] || '';
        if (!invalid) {
          const result = draft.results[draft.exerciseIndex][Number(input.dataset.result)];
          result[input.dataset.resultKey] = window.Ergonomie.number(input);
          document.querySelector(`[data-set-status="${input.dataset.result}"]`).textContent = this.setStatus(result);
        }
        const saved = p.persist();
        document.querySelector('#training-save-status').textContent = !saved ? 'Sauvegarde indisponible' : invalid ? 'Saisie à corriger · conservée dans le brouillon' : 'Saisie conservée';
      };
    });
    document.querySelectorAll('[data-repeat-set]').forEach(button => { button.onclick = () => {
      const row = Number(button.dataset.repeatSet), previous = draft.results[draft.exerciseIndex][row-1];
      if (previous.load === null || Object.keys(draft.invalidFields).some(key => key.startsWith(`${draft.exerciseIndex}:${row-1}:`))) { p.notify('Renseigne une série précédente valide avant de la recopier.'); return; }
      const old = structuredClone(draft.results[draft.exerciseIndex][row]);
      draft.results[draft.exerciseIndex][row] = structuredClone(previous);
      for (const key of ['load','reps','rpe']) { delete draft.rawFields[`${draft.exerciseIndex}:${row}:${key}`]; delete draft.invalidFields[`${draft.exerciseIndex}:${row}:${key}`]; }
      p.route('training');
      const index = draft.exerciseIndex;
      p.notify('Résultat de la série précédente recopié',() => { draft.results[index][row] = old; if (p.view === 'training') p.route('training'); });
    }; });
    document.querySelector('#training-add-set')?.addEventListener('click',() => { draft.results[draft.exerciseIndex].push({load:null,reps:null,rpe:null}); p.route('training'); document.querySelector('.training-set:last-child input')?.focus(); });
    document.querySelector('#training-previous')?.addEventListener('click',() => { draft.exerciseIndex--; p.route('training'); document.querySelector('.training-exercise')?.scrollIntoView({block:'nearest'}); });
    document.querySelector('#training-next')?.addEventListener('click',() => { draft.exerciseIndex++; p.route('training'); document.querySelector('.training-exercise')?.scrollIntoView({block:'nearest'}); });
  }
};
