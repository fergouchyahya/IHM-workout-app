'use strict';

window.Semaine = {
  days:['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'],
  open(base) {
    if (window.Parcours.view !== 'week') this.origin = window.Parcours.captureLocation?.();
    this.base = base;
    if (!base.days) base.days = this.days.map(() => ({type:'undefined', name:''}));
    window.Parcours.route('week');
  },
  render() {
    const p = window.Parcours;
    const base = this.base;
    const sessions = base.days.filter(day => day.type === 'session').length;
    const rest = base.days.filter(day => day.type === 'rest').length;
    return `<button id="week-back" class="text-action" type="button">← ${this.origin?.view === 'sharing' ? 'Mon partage' : this.origin?.view === 'discover' ? 'Découvrir' : 'Mes entraînements'}</button><p class="week-heading">${p.escape(base.name)} · ${p.escape(base.organization)}</p><h1 tabindex="-1">${base.organization === 'Mésocycle' && p.isAdvanced() ? '2. Organiser les séances' : 'Organiser ma semaine'}</h1>${base.goal && p.isAdvanced() ? `<p class="cycle-goal"><strong>Objectif :</strong> ${p.escape(base.goal)}</p><p>${p.escape((base.structure || []).join(' · '))} · ${base.weeks} semaines</p>` : ''}<div class="week-summary"><p>${sessions} séance${sessions !== 1 ? 's' : ''} · ${rest} jour${rest !== 1 ? 's' : ''} de repos · ${7 - sessions - rest} à définir</p>${base.frequency ? `<p class="landing-hint">${sessions} séance${sessions !== 1 ? 's' : ''} placée${sessions !== 1 ? 's' : ''} sur ${base.frequency} prévue${base.frequency > 1 ? 's' : ''}.</p>` : ''}</div>${!p.isBeginner() ? '<button type="button" class="landing-button" id="edit-many-days">Modifier plusieurs jours</button>' : ''}<ol class="week-days">${base.days.map((day,index) => `<li><button type="button" class="week-day is-${day.type}" data-day="${index}" aria-haspopup="dialog"><span><strong>${this.days[index]}</strong><small>${day.type === 'session' ? `Séance · ${p.escape(day.name)}` : day.type === 'rest' ? 'Repos' : 'À définir'}</small></span><span>${day.type === 'undefined' ? 'Configurer' : 'Modifier'}</span></button>${day.type === 'session' ? `<button type="button" class="landing-button full day-exercises" data-workout="${index}">Configurer les exercices${day.exercises?.length ? ` (${day.exercises.length})` : ''}</button>` : ''}</li>`).join('')}</ol>${base.organization === 'Mésocycle' ? `<section class="week-cycle landing-section"><h2>Répéter dans le cycle</h2><p class="landing-hint">Appliquer cette semaine aux ${base.weeks} semaines du cycle.</p><p id="cycle-status" role="status">${!base.cycleWeeks ? 'La semaine n’a pas encore été répétée.' : base.cycleNeedsUpdate ? 'Semaine de référence modifiée. Les copies précédentes sont conservées.' : `Répartition répétée sur ${base.weeks} semaines.`}</p><button id="repeat-week" class="landing-button full" type="button">${base.cycleWeeks ? 'Répéter à nouveau' : `Répéter sur ${base.weeks} semaines`}</button></section>` : ''}${!p.isBeginner() ? `<p class="form-help">${p.escape(window.Disponibilites.summary(base) || 'Durée et disponibilités non renseignées')}</p><button type="button" class="text-action" id="program-availability">Modifier durée et disponibilités</button>` : ''}<button id="plan-program" class="landing-button full landing-section" type="button">Planifier dans le calendrier</button><button id="week-done" class="primary-action landing-section" type="button">Terminer</button><dialog id="day-dialog" class="week-editor" aria-labelledby="day-title"><h2 id="day-title"></h2><div id="day-fields"></div></dialog>`;
  },
  bind() {
    const p = window.Parcours;
    document.querySelector('#edit-many-days')?.addEventListener('click',() => this.editMany());
    document.querySelector('#program-availability')?.addEventListener('click',() => window.Disponibilites.open(this.base));
    document.querySelector('#plan-program').onclick = () => { const base = this.base; window.Parcours.route('mine'); window.Calendrier.schedule(base,base.calendarStart || window.Calendrier.selected); };
    document.querySelector('#week-back').onclick = () => p.returnTo(this.origin || {view:'library',identity:p.state.identity,scroll:0});
    document.querySelector('#week-done').onclick = () => { p.route('library'); p.notifyChange('Répartition conservée'); };
    document.querySelectorAll('[data-day]').forEach(button => {
      button.onclick = () => this.edit(Number(button.dataset.day));
    });
    document.querySelectorAll('[data-workout]').forEach(button => {
      button.onclick = () => window.ConfigurationSeance.open(this.base,Number(button.dataset.workout));
    });
    const repeat = document.querySelector('#repeat-week');
    if (repeat) repeat.onclick = () => {
      if (this.base.cycleWeeks) {
        const dialog = document.querySelector('#day-dialog');
        document.querySelector('#day-title').textContent = 'Répéter la semaine de référence';
        document.querySelector('#day-fields').innerHTML = '<p class="landing-section">Cette action remplacera la répartition de toutes les semaines du cycle.</p><div class="week-actions"><button id="confirm-repeat" class="primary-action" type="button">Remplacer la répartition du cycle</button><button id="cancel-day" class="landing-button" type="button">Annuler</button></div>';
        document.querySelector('#confirm-repeat').onclick = () => { dialog.close(); this.repeat(); };
        document.querySelector('#cancel-day').onclick = () => dialog.close();
        dialog.showModal();
      } else this.repeat();
    };
  },
  applyDays(indices,type,sourceIndex = null) {
    const p = window.Parcours, base = this.base;
    const targets = [...new Set(indices)].filter(index => Number.isInteger(index) && index >= 0 && index < 7 && !(type === 'copy' && index === sourceIndex));
    if (!targets.length || !['rest','undefined','copy'].includes(type) || type === 'copy' && base.days[sourceIndex]?.type !== 'session') return false;
    const before = targets.map(index => ({index,day:structuredClone(base.days[index]),draft:structuredClone(p.state.preparationDrafts[`${base.id}:${index}`])}));
    const needsUpdate = base.cycleNeedsUpdate, cycle = JSON.stringify(base.cycleWeeks);
    for (const index of targets) { base.days[index] = type === 'copy' ? structuredClone(base.days[sourceIndex]) : {type,name:''}; delete p.state.preparationDrafts[`${base.id}:${index}`]; }
    if (base.cycleWeeks) base.cycleNeedsUpdate = true;
    const expected = JSON.stringify(targets.map(index => base.days[index]));
    document.querySelector('#day-dialog').close(); p.route('week');
    p.notifyChange(`${targets.length} jours modifiés dans la semaine de référence`,() => {
      if (JSON.stringify(targets.map(index => base.days[index])) !== expected || JSON.stringify(base.cycleWeeks) !== cycle || targets.some(index => p.state.preparationDrafts[`${base.id}:${index}`])) { p.notify('Un jour ou un brouillon a changé depuis. Les modifications récentes sont conservées.'); return false; }
      for (const item of before) { base.days[item.index] = structuredClone(item.day); if (item.draft) p.state.preparationDrafts[`${base.id}:${item.index}`] = structuredClone(item.draft); }
      base.cycleNeedsUpdate = needsUpdate; if (p.view === 'week' && this.base === base) p.route('week');
    });
    return true;
  },
  editMany() {
    const p = window.Parcours, dialog = document.querySelector('#day-dialog');
    document.querySelector('#day-title').textContent = 'Modifier plusieurs jours';
    document.querySelector('#day-fields').innerHTML = `<form id="many-days-form"><fieldset class="batch-days"><legend>Jours à modifier</legend>${this.days.map((name,index) => `<label><input type="checkbox" name="day" value="${index}">${name}</label>`).join('')}</fieldset>${p.select('Appliquer','action',[['rest','Repos'],['undefined','À définir'],['copy','Copier une séance de cette semaine']])}<div id="many-days-source" hidden>${p.select('Séance à copier','source',[['','Choisir une séance'],...this.base.days.flatMap((day,index) => day.type === 'session' ? [[String(index),`${this.days[index]} · ${day.name}`]] : [])])}</div><p id="many-days-summary" role="status"></p><label class="week-check" id="many-days-replace" hidden><input type="checkbox" name="replace">Remplacer les contenus et brouillons indiqués ci-dessus</label><p class="error" id="many-days-error" role="alert"></p><div class="week-actions"><button type="submit" class="primary-action">Appliquer aux jours sélectionnés</button><button type="button" id="cancel-day" class="text-action">Annuler</button></div></form>`;
    const form = document.querySelector('#many-days-form');
    const selection = () => [...form.querySelectorAll('[name="day"]:checked')].map(input => Number(input.value)).filter(index => !(form.elements.action.value === 'copy' && String(index) === form.elements.source.value));
    const occupied = () => selection().filter(index => this.base.days[index].type !== 'undefined' || p.state.preparationDrafts[`${this.base.id}:${index}`]);
    form.onchange = event => {
      if (event.target.name === 'replace') return;
      const copy = form.elements.action.value === 'copy'; document.querySelector('#many-days-source').hidden = !copy; form.elements.source.required = copy;
      const existing = occupied(); document.querySelector('#many-days-replace').hidden = !existing.length; form.elements.replace.required = !!existing.length; form.elements.replace.checked = false;
      document.querySelector('#many-days-summary').textContent = `${selection().length} jours concernés.${existing.length ? ` Contenus remplacés : ${existing.map(index => `${this.days[index]} (${this.base.days[index].name || (this.base.days[index].type === 'rest' ? 'Repos' : 'À définir')}${p.state.preparationDrafts[`${this.base.id}:${index}`] ? ', brouillon' : ''})`).join(' ; ')}.` : ''} La séance source et les dates du calendrier restent conservées.`;
    };
    form.onsubmit = event => { event.preventDefault(); if (!selection().length) { document.querySelector('#many-days-error').textContent = 'Choisis au moins un jour de destination.'; return; } if (occupied().length && !form.elements.replace.checked) { form.elements.replace.focus(); return; } this.applyDays(selection(),form.elements.action.value,form.elements.source.value === '' ? null : Number(form.elements.source.value)); };
    document.querySelector('#cancel-day').onclick = () => dialog.close(); window.Ergonomie.bind(dialog); dialog.showModal();
  },
  repeat() {
    const base = this.base, before = {cycleWeeks:structuredClone(base.cycleWeeks),cycleNeedsUpdate:base.cycleNeedsUpdate};
    this.base.cycleWeeks = Array.from({length:this.base.weeks}, () => structuredClone(this.base.days));
    this.base.cycleNeedsUpdate = false;
    window.Parcours.route('week');
    const expected = JSON.stringify(base.cycleWeeks);
    window.Parcours.notifyChange('Répartition répétée dans le cycle',() => {
      if (JSON.stringify(base.cycleWeeks) !== expected) { window.Parcours.notify('Le cycle a été modifié depuis. Ces changements sont conservés.'); return false; }
      if (before.cycleWeeks === undefined) delete base.cycleWeeks; else base.cycleWeeks = structuredClone(before.cycleWeeks);
      base.cycleNeedsUpdate = before.cycleNeedsUpdate; if (window.Parcours.view === 'week' && this.base === base) window.Parcours.route('week');
    });
  },
  changed(message) {
    if (this.base.cycleWeeks) this.base.cycleNeedsUpdate = true;
    document.querySelector('#day-dialog').close();
    window.Parcours.route('week');
    window.Parcours.notifyChange(message);
  },
  edit(index) {
    const p = window.Parcours;
    const day = this.base.days[index];
    const dialog = document.querySelector('#day-dialog');
    document.querySelector('#day-title').textContent = this.days[index];
    document.querySelector('#day-fields').innerHTML = `<form id="day-form" novalidate>${p.select('Contenu du jour','type',[['undefined','À définir'],['session','Séance'],['rest','Repos']],day.type)}<div id="session-fields" ${day.type !== 'session' ? 'hidden' : ''}>${this.base.structure.length ? p.select('Catégorie de séance, facultative','category',[['','Choisir ou saisir un nom'],...this.base.structure.map(name => [name,name])]) : ''}<label for="session-name">Nom de la séance<input id="session-name" name="sessionName" maxlength="100" value="${p.escape(day.name)}" placeholder="Ex. Haut du corps" aria-describedby="session-error"></label><p id="session-error" class="error" role="alert" hidden>Donne un nom à cette séance.</p></div>${day.exercises?.length ? '<div id="discard-exercises" hidden><label class="week-check"><input type="checkbox" name="discard">Je confirme le retrait des exercices et objectifs de ce jour.</label></div>' : ''}<div class="week-actions"><button class="primary-action" type="submit">Enregistrer ce jour</button>${day.type === 'session' ? '<button id="move-session" type="button" class="landing-button">Déplacer la séance</button><button id="copy-session" type="button" class="landing-button">Dupliquer la séance</button>' : ''}<button id="cancel-day" class="text-action" type="button">Annuler</button></div></form>`;
    const form = document.querySelector('#day-form');
    form.elements.type.onchange = () => {
      const leavingSession = form.elements.type.value !== 'session';
      document.querySelector('#session-fields').hidden = leavingSession;
      if (form.elements.discard) { document.querySelector('#discard-exercises').hidden = !leavingSession; form.elements.discard.checked = false; }
    };
    if (form.elements.category) form.elements.category.onchange = () => {
      if (form.elements.category.value) form.elements.sessionName.value = form.elements.category.value;
    };
    form.elements.sessionName.oninput = () => {
      document.querySelector('#session-error').hidden = true;
      form.elements.sessionName.removeAttribute('aria-invalid');
    };
    form.onsubmit = event => {
      event.preventDefault();
      const type = form.elements.type.value;
      const name = form.elements.sessionName.value.trim();
      if (type !== 'session' && form.elements.discard && !form.elements.discard.checked) { form.elements.discard.focus(); return; }
      if (type === 'session' && !name) {
        document.querySelector('#session-error').hidden = false;
        form.elements.sessionName.setAttribute('aria-invalid','true');
        form.elements.sessionName.focus();
        return;
      }
      this.base.days[index] = type === 'session' ? {...day,type,name} : {type,name:''};
      this.changed('Jour enregistré');
    };
    document.querySelector('#cancel-day').onclick = () => dialog.close();
    if (day.type === 'session') {
      document.querySelector('#move-session').onclick = () => this.transfer(index,false);
      document.querySelector('#copy-session').onclick = () => this.transfer(index,true);
    }
    dialog.showModal();
  },
  transfer(index,copy) {
    const p = window.Parcours;
    document.querySelector('#day-title').textContent = `${copy ? 'Dupliquer' : 'Déplacer'} · ${this.base.days[index].name}`;
    document.querySelector('#day-fields').innerHTML = `<form id="transfer-form">${p.select('Jour de destination','destination',[['','Choisir un jour'],...this.days.flatMap((name,i) => i === index ? [] : [[String(i),name]])],'','required')}<div id="replace-fields" hidden><p id="replace-description" class="landing-hint landing-section"></p><label class="week-check"><input name="replace" type="checkbox">Je confirme le remplacement de ce jour.</label></div><div class="week-actions"><button class="primary-action" type="submit">${copy ? 'Dupliquer' : 'Déplacer'}</button><button id="cancel-day" type="button" class="text-action">Annuler</button></div></form>`;
    const form = document.querySelector('#transfer-form');
    form.elements.destination.onchange = () => {
      const target = form.elements.destination.value === '' ? null : this.base.days[Number(form.elements.destination.value)];
      const occupied = target && target.type !== 'undefined';
      document.querySelector('#replace-fields').hidden = !occupied;
      form.elements.replace.checked = false;
      form.elements.replace.required = !!occupied;
      document.querySelector('#replace-description').textContent = occupied ? `Ce jour contient ${target.type === 'rest' ? 'un repos' : `la séance « ${target.name} »`}. Son contenu sera remplacé.` : '';
    };
    form.onsubmit = event => {
      event.preventDefault();
      const destination = Number(form.elements.destination.value);
      this.base.days[destination] = structuredClone(this.base.days[index]);
      if (!copy) this.base.days[index] = {type:'undefined',name:''};
      this.changed(copy ? 'Séance dupliquée' : 'Séance déplacée');
    };
    document.querySelector('#cancel-day').onclick = () => document.querySelector('#day-dialog').close();
    form.elements.destination.focus();
  }
};
