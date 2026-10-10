'use strict';

window.ConfigurationSeance = {
  trackingOptions:[['rpe','Effort ressenti (RPE), par série'],['feeling','Ressenti global, en fin de séance'],['sleep','Sommeil'],['energy','Énergie / fatigue'],['pain','Douleur'],['notes','Notes personnelles']],
  open(base,dayIndex = null) {
    this.base = base;
    this.dayIndex = dayIndex;
    this.session = dayIndex === null ? base : base.days[dayIndex];
    if (!this.session.exercises) this.session.exercises = [];
    if (!this.session.tracking) this.session.tracking = {...window.Parcours.state.trackingDefaults};
    window.Parcours.route('workout');
  },
  changed(message) {
    if (this.base.cycleWeeks) this.base.cycleNeedsUpdate = true;
    window.Parcours.persist();
    if (message) window.Parcours.notify(message);
  },
  summary(exercise) {
    if (!exercise.sets) return 'Objectifs à définir';
    return `${exercise.sets} séries · ${exercise.minReps}–${exercise.maxReps} répétitions${exercise.load !== null ? ` · ${exercise.load} kg` : ''}${exercise.rpe !== null ? ` · RPE ${exercise.rpe}` : ''}`;
  },
  render() {
    const p = window.Parcours;
    const exercises = this.session.exercises;
    return `<button id="workout-back" class="text-action" type="button">← ${this.dayIndex === null ? 'Mes entraînements' : 'Ma semaine'}</button><p class="week-heading">${this.dayIndex === null ? 'Séance seule' : window.Semaine.days[this.dayIndex]} · ${p.escape(this.session.name)}</p><h1 tabindex="-1">Configurer une séance</h1><div class="landing-row"><h2>Exercices (${exercises.length})</h2></div><button id="add-exercise" type="button" class="primary-action session-add" aria-haspopup="dialog">+ Ajouter un exercice</button>${exercises.length ? `<ol class="session-exercises">${exercises.map((exercise,index) => { const item = window.catalogueExercices.find(item => item.id === exercise.exerciseId); return `<li class="session-card"><button type="button" class="exercise-edit" data-edit="${index}" aria-haspopup="dialog"><strong>${index + 1}. ${p.escape(item.name)}</strong><span>${p.escape(this.summary(exercise))}</span><small>Configurer les objectifs</small></button><div class="exercise-actions"><button class="landing-button" type="button" data-up="${index}" ${index === 0 ? 'disabled' : ''} aria-label="Monter ${p.escape(item.name)}">↑ Monter</button><button class="landing-button" type="button" data-down="${index}" ${index === exercises.length - 1 ? 'disabled' : ''} aria-label="Descendre ${p.escape(item.name)}">↓ Descendre</button><button class="text-action" type="button" data-replace="${index}" aria-label="Remplacer ${p.escape(item.name)}">Remplacer</button><button class="text-action" type="button" data-remove="${index}" aria-label="Retirer ${p.escape(item.name)}">Retirer</button></div></li>`; }).join('')}</ol>` : '<p class="empty-content">Ajoute ton premier exercice.</p>'}<section class="landing-section"><h2>Informations à suivre</h2><div class="tracking-choices">${this.trackingOptions.slice(0,2).map(option => this.checkbox(option)).join('')}<details><summary>Options complémentaires</summary>${this.trackingOptions.slice(2).map(option => this.checkbox(option)).join('')}</details></div><p id="tracking-status" class="landing-hint" role="status"></p></section><button id="workout-done" class="primary-action landing-section" type="button">Terminer</button><dialog id="exercise-dialog" class="exercise-dialog" aria-labelledby="exercise-title"><h2 id="exercise-title"></h2><div id="exercise-fields"></div></dialog>`;
  },
  checkbox([key,label]) {
    return `<label class="tracking-choice"><input type="checkbox" data-tracking="${key}" ${this.session.tracking[key] ? 'checked' : ''}>${label}</label>`;
  },
  bind() {
    const back = () => window.Parcours.route(this.dayIndex === null ? 'mine' : 'week');
    document.querySelector('#workout-back').onclick = back;
    document.querySelector('#workout-done').onclick = () => { back(); window.Parcours.notify('Séance conservée'); };
    document.querySelector('#add-exercise').onclick = () => this.library();
    for (const [attribute,action] of [['edit',i => this.edit(i)],['replace',i => this.library(i)],['remove',i => this.remove(i)],['up',i => this.reorder(i,-1)],['down',i => this.reorder(i,1)]]) {
      document.querySelectorAll(`[data-${attribute}]`).forEach(button => { button.onclick = () => action(Number(button.dataset[attribute])); });
    }
    document.querySelectorAll('[data-tracking]').forEach(input => {
      input.onchange = () => {
        this.session.tracking[input.dataset.tracking] = input.checked;
        window.Parcours.state.trackingDefaults = {...this.session.tracking};
        this.changed();
        document.querySelector('#tracking-status').textContent = 'Choix de suivi conservés.';
      };
    });
  },
  reorder(index,direction) {
    const target = index + direction;
    if (target < 0 || target >= this.session.exercises.length) return;
    const exercises = this.session.exercises;
    [exercises[index],exercises[target]] = [exercises[target],exercises[index]];
    this.changed();
    window.Parcours.route('workout');
    document.querySelector(`[data-edit="${target}"]`).focus();
  },
  remove(index) {
    const name = window.catalogueExercices.find(item => item.id === this.session.exercises[index].exerciseId).name;
    document.querySelector('#exercise-title').textContent = 'Retirer cet exercice ?';
    document.querySelector('#exercise-fields').innerHTML = `<p class="landing-section">${window.Parcours.escape(name)} et ses objectifs seront retirés de cette séance.</p><div class="week-actions"><button id="confirm-remove" class="primary-action" type="button">Retirer l’exercice</button><button id="cancel-exercise" class="landing-button" type="button">Annuler</button></div>`;
    const dialog = document.querySelector('#exercise-dialog');
    document.querySelector('#confirm-remove').onclick = () => { this.session.exercises.splice(index,1); dialog.close(); this.changed('Exercice retiré'); window.Parcours.route('workout'); };
    document.querySelector('#cancel-exercise').onclick = () => dialog.close();
    dialog.showModal();
  },
  normalize(value) {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
  },
  choose(exerciseId,replaceIndex) {
    const remembered = window.Parcours.state.exerciseDefaults[exerciseId];
    const exercise = {exerciseId,sets:null,minReps:null,maxReps:null,load:null,rpe:null,note:'',setting:'',...remembered};
    const index = replaceIndex === null ? this.session.exercises.length : replaceIndex;
    if (replaceIndex === null) this.session.exercises.push(exercise);
    else this.session.exercises[index] = exercise;
    document.querySelector('#exercise-dialog').close();
    this.changed();
    window.Parcours.route('workout');
    this.edit(index);
  },
  library(replaceIndex = null,query = '') {
    const p = window.Parcours;
    const original = replaceIndex === null ? null : window.catalogueExercices.find(item => item.id === this.session.exercises[replaceIndex].exerciseId);
    document.querySelector('#exercise-title').textContent = original ? 'Remplacer un exercice' : 'Ajouter un exercice';
    document.querySelector('#exercise-fields').innerHTML = `<form id="exercise-choice"><div class="exercise-picker"><div class="exercise-picker-controls"><label for="exercise-search">Recherche par nom<input id="exercise-search" type="search" value="${p.escape(query)}" placeholder="Ex. Développé couché" autocomplete="off"></label><label for="exercise-select">Exercice<select id="exercise-select" required></select></label><p id="exercise-count" class="landing-hint" role="status"></p></div><figure class="exercise-preview"><img id="exercise-image" alt="" width="160" height="140"><figcaption id="exercise-meta"></figcaption></figure></div><p id="exercise-instruction" class="landing-hint"></p>${original ? '<p class="landing-hint">Les objectifs du remplacement restent modifiables.</p>' : ''}<div class="week-actions"><button id="choose-exercise" class="primary-action" type="submit">${original ? 'Remplacer et configurer' : 'Ajouter et configurer'}</button><button id="new-exercise" class="landing-button" type="button">+ Créer un exercice</button><button id="cancel-exercise" class="text-action" type="button">Annuler</button></div></form>`;
    const select = document.querySelector('#exercise-select');
    const preview = () => {
      const item = window.catalogueExercices.find(item => item.id === select.value);
      const image = document.querySelector('#exercise-image');
      image.hidden = !item;
      if (item) { image.src = item.image || '../06-configuration-seance/images/personal.svg'; image.alt = `Illustration : ${item.name}`; }
      document.querySelector('#exercise-meta').textContent = item ? [item.group,item.equipment].filter(Boolean).join(' · ') : '';
      document.querySelector('#exercise-instruction').textContent = item?.instruction || '';
      document.querySelector('#choose-exercise').disabled = !item;
    };
    const refresh = () => {
      const name = this.normalize(document.querySelector('#exercise-search').value);
      const previous = select.value;
      const items = window.catalogueExercices.filter(item => (!original || item.id !== original.id) && this.normalize(item.name).includes(name));
      if (original) items.sort((a,b) => Number(b.group === original.group) - Number(a.group === original.group));
      select.innerHTML = items.length ? items.map(item => `<option value="${p.escape(item.id)}">${p.escape(item.name)}</option>`).join('') : '<option value="">Aucun exercice trouvé</option>';
      if (items.some(item => item.id === previous)) select.value = previous;
      document.querySelector('#exercise-count').textContent = items.length ? '' : 'Crée cet exercice pour l’ajouter à ta liste.';
      preview();
    };
    document.querySelector('#exercise-search').oninput = refresh;
    select.onchange = preview;
    document.querySelector('#exercise-choice').onsubmit = event => { event.preventDefault(); if (select.value) this.choose(select.value,replaceIndex); };
    document.querySelector('#new-exercise').onclick = () => this.createExercise(replaceIndex,document.querySelector('#exercise-search').value);
    document.querySelector('#cancel-exercise').onclick = () => document.querySelector('#exercise-dialog').close();
    refresh();
    document.querySelector('#exercise-dialog').showModal();
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
  },
  edit(index) {
    const p = window.Parcours;
    const exercise = this.session.exercises[index];
    const item = window.catalogueExercices.find(item => item.id === exercise.exerciseId);
    document.querySelector('#exercise-title').textContent = item.name;
    const numberField = (key,label,min,step = '1',max = '') => `<label for="target-${key}">${label}<input id="target-${key}" name="${key}" type="number" min="${min}" step="${step}" ${max ? `max="${max}"` : ''} value="${exercise[key] ?? ''}" aria-describedby="error-${key}"></label><p id="error-${key}" class="error" hidden></p>`;
    document.querySelector('#exercise-fields').innerHTML = `<form id="exercise-targets" class="create-form" novalidate><h3>Objectifs prévus</h3>${numberField('sets','Nombre de séries',1)}<div class="reps-range">${numberField('minReps','Répétitions minimum',1)}${numberField('maxReps','Répétitions maximum',1)}</div><details ${exercise.load !== null || exercise.rpe !== null || exercise.note || exercise.setting ? 'open' : ''}><summary>Réglages facultatifs</summary>${numberField('load','Charge cible, en kg',0,'any')}<p class="form-help">0 kg : sans charge ajoutée</p>${numberField('rpe','Effort visé (RPE), de 1 à 10',1,'0.5',10)}<p class="form-help">1 : très facile · 10 : maximal</p><label>Consigne personnelle<textarea name="note" maxlength="500" rows="3">${p.escape(exercise.note)}</textarea></label><label>Réglage du matériel<textarea name="setting" maxlength="500" rows="2" placeholder="Ex. Siège position 3">${p.escape(exercise.setting)}</textarea></label></details><div class="week-actions"><button class="primary-action" type="submit">Enregistrer les objectifs</button><button id="cancel-exercise" class="text-action" type="button">Annuler</button></div></form>`;
    const form = document.querySelector('#exercise-targets');
    form.oninput = event => {
      const error = document.querySelector(`#error-${event.target.name}`);
      if (error) { error.hidden = true; event.target.removeAttribute('aria-invalid'); }
    };
    form.onsubmit = event => {
      event.preventDefault();
      const values = {};
      const errors = [];
      for (const key of ['sets','minReps','maxReps','load','rpe']) {
        const input = form.elements[key];
        const optional = key === 'load' || key === 'rpe';
        const value = input.value.trim();
        values[key] = value === '' ? null : Number(value);
        if ((!optional && value === '') || !input.validity.valid) errors.push([key,optional ? 'Indique une valeur valide ou laisse ce champ vide.' : 'Indique un nombre entier positif.']);
      }
      if (values.minReps !== null && values.maxReps !== null && values.maxReps < values.minReps) errors.push(['maxReps','Le maximum doit être supérieur ou égal au minimum.']);
      if (errors.length) {
        for (const [key,message] of errors) { const error = document.querySelector(`#error-${key}`); error.textContent = message; error.hidden = false; form.elements[key].setAttribute('aria-invalid','true'); }
        form.elements[errors[0][0]].focus();
        return;
      }
      Object.assign(exercise,values,{note:form.elements.note.value.trim(),setting:form.elements.setting.value.trim()});
      const {exerciseId,...objectives} = exercise;
      p.state.exerciseDefaults[exerciseId] = {...objectives};
      document.querySelector('#exercise-dialog').close();
      this.changed('Objectifs conservés');
      window.Parcours.route('workout');
    };
    document.querySelector('#cancel-exercise').onclick = () => document.querySelector('#exercise-dialog').close();
    document.querySelector('#exercise-dialog').showModal();
  }
};
