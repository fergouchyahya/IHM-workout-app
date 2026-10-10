'use strict';

window.Semaine = {
  days:['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'],
  open(base) {
    this.base = base;
    if (!base.days) base.days = this.days.map(() => ({type:'undefined', name:''}));
    window.Parcours.route('week');
  },
  render() {
    const p = window.Parcours;
    const base = this.base;
    const sessions = base.days.filter(day => day.type === 'session').length;
    const rest = base.days.filter(day => day.type === 'rest').length;
    return `<button id="week-back" class="text-action" type="button">← Mes entraînements</button><p class="week-heading">${p.escape(base.name)} · ${p.escape(base.organization)}</p><h1 tabindex="-1">Organiser ma semaine</h1><div class="week-summary"><p>${sessions} séance${sessions > 1 ? 's' : ''} · ${rest} jour${rest > 1 ? 's' : ''} de repos · ${7 - sessions - rest} à définir</p>${base.frequency ? `<p class="landing-hint">${sessions} séance${sessions > 1 ? 's' : ''} placée${sessions > 1 ? 's' : ''} sur ${base.frequency} prévue${base.frequency > 1 ? 's' : ''}.</p>` : ''}</div><ol class="week-days">${base.days.map((day,index) => `<li><button type="button" class="week-day is-${day.type}" data-day="${index}" aria-haspopup="dialog"><span><strong>${this.days[index]}</strong><small>${day.type === 'session' ? `Séance · ${p.escape(day.name)}` : day.type === 'rest' ? 'Repos' : 'À définir'}</small></span><span>${day.type === 'undefined' ? 'Configurer' : 'Modifier'}</span></button>${day.type === 'session' ? `<button type="button" class="landing-button full day-exercises" data-workout="${index}">Configurer les exercices${day.exercises?.length ? ` (${day.exercises.length})` : ''}</button>` : ''}</li>`).join('')}</ol>${base.organization === 'Mésocycle' ? `<section class="week-cycle landing-section"><h2>Répéter dans le cycle</h2><p class="landing-hint">Appliquer cette semaine aux ${base.weeks} semaines du cycle.</p><p id="cycle-status" role="status">${!base.cycleWeeks ? 'La semaine n’a pas encore été répétée.' : base.cycleNeedsUpdate ? 'Semaine de référence modifiée. Les copies précédentes sont conservées.' : `Répartition répétée sur ${base.weeks} semaines.`}</p><button id="repeat-week" class="landing-button full" type="button">${base.cycleWeeks ? 'Répéter à nouveau' : `Répéter sur ${base.weeks} semaines`}</button></section>` : ''}<button id="week-done" class="primary-action landing-section" type="button">Terminer</button><dialog id="day-dialog" class="week-editor" aria-labelledby="day-title"><h2 id="day-title"></h2><div id="day-fields"></div></dialog>`;
  },
  bind() {
    const p = window.Parcours;
    document.querySelector('#week-back').onclick = () => p.route('mine');
    document.querySelector('#week-done').onclick = () => { p.route('mine'); p.notify('Répartition conservée'); };
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
  repeat() {
    this.base.cycleWeeks = Array.from({length:this.base.weeks}, () => structuredClone(this.base.days));
    this.base.cycleNeedsUpdate = false;
    window.Parcours.route('week');
    window.Parcours.notify('Répartition répétée dans le cycle');
  },
  changed(message) {
    if (this.base.cycleWeeks) this.base.cycleNeedsUpdate = true;
    document.querySelector('#day-dialog').close();
    window.Parcours.route('week');
    window.Parcours.notify(message);
  },
  edit(index) {
    const p = window.Parcours;
    const day = this.base.days[index];
    const dialog = document.querySelector('#day-dialog');
    document.querySelector('#day-title').textContent = this.days[index];
    document.querySelector('#day-fields').innerHTML = `<form id="day-form" novalidate>${p.select('Contenu du jour','type',[['undefined','À définir'],['session','Séance'],['rest','Repos']],day.type)}<div id="session-fields" ${day.type !== 'session' ? 'hidden' : ''}>${this.base.structure.length ? p.select('Catégorie du gabarit, facultatif','category',[['','Choisir ou saisir un nom'],...this.base.structure.map(name => [name,name])]) : ''}<label for="session-name">Nom de la séance<input id="session-name" name="sessionName" maxlength="100" value="${p.escape(day.name)}" placeholder="Ex. Haut du corps" aria-describedby="session-error"></label><p id="session-error" class="error" role="alert" hidden>Donne un nom à cette séance.</p></div>${day.exercises?.length ? '<div id="discard-exercises" hidden><label class="week-check"><input type="checkbox" name="discard">Je confirme le retrait des exercices et objectifs de ce jour.</label></div>' : ''}<div class="week-actions"><button class="primary-action" type="submit">Enregistrer ce jour</button>${day.type === 'session' ? '<button id="move-session" type="button" class="landing-button">Déplacer la séance</button><button id="copy-session" type="button" class="landing-button">Dupliquer la séance</button>' : ''}<button id="cancel-day" class="text-action" type="button">Annuler</button></div></form>`;
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
