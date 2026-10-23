'use strict';

window.Disponibilites = {
  fields(value = {}) {
    const p = window.Parcours;
    return `<label>Temps disponible par séance, en minutes (facultatif)<input name="timeBudget" type="number" min="1" max="1440" step="1" value="${p.escape(value.timeBudget ?? '')}"></label><fieldset class="availability-days"><legend>Jours disponibles (facultatif)</legend>${window.Semaine.days.map((day, index) => `<label><input type="checkbox" name="availableDays" value="${index}" ${value.availableDays?.includes(index) ? 'checked' : ''}>${day}</label>`).join('')}</fieldset><p class="form-help">Aucun jour coché : disponibilités non renseignées. Ces repères ne déplacent pas les séances et n’imposent pas de repos.</p>`;
  },
  read(form) {
    const raw = form.elements.timeBudget.value;
    const timeBudget = raw === '' ? null : Number(raw);
    if (timeBudget !== null && (!Number.isInteger(timeBudget) || timeBudget < 1 || timeBudget > 1440)) return null;
    return { timeBudget, availableDays: [...form.querySelectorAll('[name="availableDays"]:checked')].map(input => Number(input.value)) };
  },
  summary(value) {
    return [value.timeBudget ? `${value.timeBudget} min disponibles par séance` : '', value.availableDays?.length ? value.availableDays.map(index => window.Semaine.days[index]).join(', ') : ''].filter(Boolean).join(' · ');
  },
  warnings(source, date) {
    const profile = window.Parcours.state.profile;
    const days = source.availableDays ?? profile.availableDays ?? [];
    const budget = source.timeBudget ?? profile.timeBudget;
    const messages = [];
    if (date && days.length && !days.includes((window.Calendrier.date(date).getDay() + 6) % 7)) messages.push('Jour hors de tes disponibilités');
    if (budget && source.duration && source.duration > budget) messages.push(`Durée prévue ${source.duration} min, pour ${budget} min disponibles`);
    return messages;
  },
  open(source = window.Parcours.state.profile) {
    const origin = window.Parcours.captureLocation();
    let dialog = document.querySelector('#availability-dialog');
    if (!dialog) { dialog = document.createElement('dialog'); dialog.id = 'availability-dialog'; document.body.append(dialog); }
    dialog.setAttribute('aria-labelledby', 'availability-title');
    dialog.innerHTML = `<h2 id="availability-title">Durée et disponibilités</h2><form id="availability-form">${this.fields(source)}<p id="availability-error" class="error" role="alert"></p><div class="week-actions"><button type="submit" class="primary-action">Enregistrer</button><button type="button" id="cancel-availability" class="text-action">Annuler</button></div></form>`;
    dialog.querySelector('#cancel-availability').onclick = () => dialog.close();
    dialog.querySelector('form').onsubmit = event => {
      event.preventDefault(); const value = this.read(event.target);
      if (!value) { dialog.querySelector('#availability-error').textContent = 'Indique un nombre entier de minutes entre 1 et 1440, ou laisse vide.'; return; }
      Object.assign(source, value);
      const editor = window.ConfigurationSeance;
      if (window.Parcours.view === 'workout' && source === editor.target) {
        Object.assign(editor.session, value); Object.assign(editor.original, value);
        const draft = window.Parcours.state.preparationDrafts[editor.key];
        if (draft) Object.assign(draft.session, value);
      }
      window.Parcours.persist(); dialog.close();
      if (!window.Parcours.restoreLocation(origin)) window.Parcours.route('mine');
      window.Parcours.notifyChange('Durée et disponibilités enregistrées · planning conservé');
    };
    window.Ergonomie.bind(dialog);
    dialog.showModal();
  }
};
