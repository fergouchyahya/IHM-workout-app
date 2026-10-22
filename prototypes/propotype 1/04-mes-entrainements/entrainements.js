'use strict';

window.Entrainements = {
  render() {
    const p = window.Parcours;
    return `${p.greeting()}${window.Entrainement.ongoingMarkup()}${window.Calendrier.render()}`;
  },
  bind() {
    window.Calendrier.bind();
    document.querySelector('#landing-page').onclick = event => {
      const ongoing = event.target.closest('[data-ongoing]');
      if (ongoing) window.Entrainement.resume(ongoing.dataset.ongoing);
      else window.Calendrier.click(event);
    };
  },
  renderLibrary() {
    const p = window.Parcours;
    const visible = p.state.saved.filter(item => window.Ergonomie.normalize(item.name).includes(window.Ergonomie.normalize(p.state.ui.savedSearch || '')));
    const cards = visible.map(item => `<div class="saved-workout-row"><button class="landing-card" type="button" data-personal="${item.id}"><h3>${p.escape(item.name)}</h3><p>${item.organization}${item.weeks ? ` · ${item.weeks} semaines` : ''}</p><p>${this.status(item)}</p></button><div class="saved-workout-actions"><button type="button" class="text-action" data-schedule="${item.id}">Planifier</button><button type="button" class="text-action" data-delete-saved="${item.id}" aria-label="Supprimer ${p.escape(item.name)}">Supprimer</button></div></div>`).join('');
    const favorites = window.catalogueSeances.filter(item => p.state.favorites.includes(item.id));
    const favoriteCards = favorites.map(item => `<button type="button" class="landing-card" data-favorite="${item.id}"><h3>${p.escape(item.name)}</h3><p>★ Favori · environ ${item.duration} min</p></button>`).join('');
    const week = p.state.week.map(item => ({...item,copy:p.state.saved.find(copy => copy.id === item.copyId)})).filter(item => item.copy);
    return `${p.greeting()}<h1 tabindex="-1">Mes entraînements</h1><div class="personal-actions"><button id="create-workout" type="button" class="primary-action">+ Créer un entraînement</button></div><label>Rechercher mes entraînements<input id="saved-workout-search" type="search" value="${p.escape(p.state.ui.savedSearch || '')}" placeholder="Nom de séance ou programme"></label>${cards ? `<div class="landing-stack">${cards}</div>` : '<p class="landing-hint">Aucun entraînement enregistré. Crée une séance ou enregistre-la depuis Découvrir.</p>'}<button id="explore-workouts" type="button" class="text-action landing-section">Explorer des séances</button>${favorites.length ? `<section class="landing-section"><h2>Mes favoris</h2><div class="landing-stack landing-section">${favoriteCards}</div></section>` : ''}${week.length ? `<section class="landing-section"><h2>Placements sans date</h2><p class="landing-hint">Choisis une date pour les retrouver dans le calendrier.</p>${week.map(item => `<button type="button" class="landing-button" data-schedule="${item.copy.id}">${p.escape(item.day)} · ${p.escape(item.copy.name)}</button>`).join('')}</section>` : ''}`;
  },
  bindLibrary() {
    document.querySelector('#create-workout').addEventListener('click', () => { window.Calendrier.creationDate = null; window.Parcours.state.ui.fullCreation = true; window.Parcours.route('create'); });
    document.querySelector('#explore-workouts').addEventListener('click', () => window.Parcours.route('discover'));
    document.querySelector('#saved-workout-search').oninput = event => { const value = event.target.value, position = event.target.selectionStart; window.Parcours.state.ui.savedSearch = value; window.Parcours.route('library'); const field = document.querySelector('#saved-workout-search'); field.focus({preventScroll:true}); field.setSelectionRange(position,position); };
    document.querySelector('#landing-page').onclick = event => {
      const ongoing = event.target.closest('[data-ongoing]');
      if (ongoing) { window.Entrainement.resume(ongoing.dataset.ongoing); return; }
      const remove = event.target.closest('[data-delete-saved]');
      if (remove) { this.confirmRemove(remove.dataset.deleteSaved); return; }
      if (window.Calendrier.click(event)) return;
      const card = event.target.closest('[data-personal]');
      const favorite = event.target.closest('[data-favorite]');
      if (card) {
        const item = window.Parcours.state.saved.find(item => item.id === card.dataset.personal);
        this.openDraft(item);
      }
      if (favorite) window.Decouverte.openRecap(window.catalogueSeances.find(item => item.id === favorite.dataset.favorite));
    };
  },
  confirmRemove(id) {
    const p = window.Parcours, item = p.state.saved.find(workout => workout.id === id);
    if (!item) return;
    window.Ergonomie.confirm('Supprimer de mes entraînements ?', `« ${item.name} » sera retiré de ta liste. Les séances déjà placées dans le calendrier, les séances en cours et les bilans sont conservés.`,() => this.removeSaved(id),'Supprimer de ma liste');
  },
  removeSaved(id) {
    const p = window.Parcours, index = p.state.saved.findIndex(item => item.id === id);
    if (index < 0) return false;
    const [item] = p.state.saved.splice(index,1);
    const drafts = Object.fromEntries(Object.entries(p.state.preparationDrafts).filter(([key]) => key.startsWith(`${id}:`)));
    for (const key of Object.keys(drafts)) delete p.state.preparationDrafts[key];
    p.route('library');
    p.notifyChange('Entraînement retiré de ma liste',() => {
      if (p.state.saved.some(workout => workout.id === id)) return false;
      p.state.saved.splice(Math.min(index,p.state.saved.length),0,item);
      for (const [key,draft] of Object.entries(drafts)) if (!p.state.preparationDrafts[key]) p.state.preparationDrafts[key] = draft;
      if (p.view === 'library') p.route('library');
    });
    return true;
  },
  status(item) {
    const sessions = item.organization === 'Séance seule' ? [item] : (item.days || []).filter(day => day.type === 'session');
    const incomplete = !sessions.length || sessions.some(session => !session.exercises?.length || session.exercises.some(exercise => typeof exercise === 'string' || !exercise.sets || !exercise.minReps || !exercise.maxReps));
    const planned = window.Parcours.state.calendar.some(entry => entry.sourceId === item.id);
    return `${incomplete ? 'Objectifs à compléter' : 'Objectifs renseignés'} · ${window.Parcours.storageFailed ? 'Conservé pour cette visite' : 'Enregistré'}${planned ? ' · Planifié' : ''}`;
  },
  renderCreate() {
    const p = window.Parcours;
    const quick = !!window.Calendrier.creationDate && !p.state.ui.fullCreation;
    const profile = quick ? {} : p.state.profile;
    return `<button id="cancel-create" class="text-action" type="button">← Retour</button><h1 tabindex="-1">${quick ? `Nouvelle séance · ${window.Calendrier.label(window.Calendrier.creationDate)}` : 'Créer un entraînement'}</h1><form id="create-base-form" class="create-form ${quick ? 'is-quick-creation' : ''}" novalidate>
      <div class="creation-advanced">${p.select('Organisation','organization',[['','Choisir une organisation'],['Séance seule','Séance seule'],['Semaine type','Semaine type'],['Mésocycle',p.isBeginner() ? 'Programme sur plusieurs semaines' : 'Mésocycle']],'','id="base-organization" required aria-describedby="base-organization-error"')}<p class="error" id="base-organization-error" hidden></p></div>
      <label for="base-name">Nom de l’entraînement<input id="base-name" name="name" type="text" maxlength="100" placeholder="Ex. Haut du corps" required aria-describedby="base-name-error"></label><p class="error" id="base-name-error" hidden></p>
      <div class="creation-advanced"><section id="cycle-foundation"><h2 id="cycle-foundation-title" hidden>1. Structure et objectifs du mésocycle</h2><div id="program-fields" hidden><div ${p.isBeginner() ? 'hidden' : ''}>${p.select('Structure des séances','preset',window.gabaritsEntrainement.map(item => [item.id,item.label || item.id]),'Personnalisé','id="base-preset" aria-describedby="preset-help"')}<p class="form-help" id="preset-help">${window.gabaritsEntrainement[0].help}</p></div><div id="custom-structure-fields" hidden><label>Nom des séances de la structure<input id="base-structure" name="cycleStructure" maxlength="200" placeholder="Ex. Haut du corps, Bas du corps" aria-describedby="base-structure-error"></label><p class="error" id="base-structure-error" hidden></p></div><label><span id="frequency-label">Séances par semaine, facultatif</span><input id="base-frequency" name="frequency" type="number" min="1" step="1" inputmode="numeric" aria-describedby="base-frequency-error"></label><p class="error" id="base-frequency-error" hidden></p></div>
      <div id="cycle-fields" hidden><label>Durée en semaines<input id="base-weeks" name="weeks" type="number" min="1" max="104" step="1" inputmode="numeric" aria-describedby="base-weeks-error"></label><p class="error" id="base-weeks-error" hidden></p></div>
      <div id="cycle-goal-fields" hidden><label>Objectif du mésocycle<input id="base-cycle-goal" name="cycleGoal" maxlength="300" value="${p.escape(profile.goal || '')}" placeholder="Ex. Progresser sur mes exercices de base" aria-describedby="base-cycle-goal-error"></label><p class="error" id="base-cycle-goal-error" hidden></p></div></section>
      <div ${p.isBeginner() ? 'hidden' : ''}><details class="creation-preferences"><summary>Durée et disponibilités</summary>${window.Disponibilites.fields(profile)}</details><details class="creation-preferences"><summary>Objectif et matériel</summary><div id="base-general-goal">${p.select('Objectif principal, facultatif','goal',[['','Non renseigné'],['Gagner en force','Gagner en force'],['Développer mes muscles','Développer mes muscles'],['Rester actif','Rester actif']],profile.goal || '')}</div>${p.select('Groupe musculaire ou zone, facultatif','group',window.optionsFiltres.group.options.map(([value,text]) => [value,value ? text : 'Non renseigné']))}${p.select('Matériel, facultatif','equipment',window.optionsFiltres.equipment.options.map(([value,text]) => [value,value ? text : 'Non renseigné']),profile.equipment || '')}</details></div></div><p id="cycle-next-step" class="form-help" hidden>Tu organiseras ensuite les jours et les exercices à partir de cette structure.</p><button class="primary-action landing-section" type="submit">Créer la séance</button></form>`;
  },
  bindCreate() {
    const form = document.querySelector('#create-base-form');
    const quick = !!window.Calendrier.creationDate && !window.Parcours.state.ui.fullCreation;
    const draft = {...window.Parcours.state.creationDraft,...(quick ? {organization:'Séance seule'} : {})};
    for (const [key,value] of Object.entries(draft)) { if (form.elements[key] && key !== 'availableDays') form.elements[key].value = value; }
    if (draft.availableDays) form.querySelectorAll('[name=availableDays]').forEach(input => { input.checked = draft.availableDays.includes(Number(input.value)); });
    const remember = () => {
      window.Parcours.state.creationDraft = {creationDate:window.Calendrier.creationDate,...Object.fromEntries(new FormData(form)),availableDays:[...form.querySelectorAll('[name=availableDays]:checked')].map(input => Number(input.value))};
      window.Parcours.persist();
    };
    document.querySelector('#expand-creation')?.addEventListener('click',() => { remember(); window.Parcours.state.ui.fullCreation = true; window.Parcours.state.creationDraft.organization = ''; window.Parcours.route('create'); document.querySelector('#base-organization').focus(); });
    form.addEventListener('change',remember);
    form.addEventListener('input',remember);
    document.querySelector('#cancel-create').addEventListener('click', () => { const destination = window.Calendrier.creationDate ? 'mine' : 'library'; window.Calendrier.creationDate = null; window.Calendrier.creationRestIds = null; window.Parcours.route(destination); });
    form.elements.organization.addEventListener('change', () => {
      const organization = form.elements.organization.value;
      form.elements.name.placeholder = organization === 'Séance seule' ? 'Ex. Haut du corps' : 'Ex. Mon programme haut / bas';
      form.querySelector('[type=submit]').textContent = organization === 'Mésocycle' && window.Parcours.isAdvanced() ? 'Enregistrer et organiser les séances' : organization && organization !== 'Séance seule' ? 'Créer le programme' : quick ? 'Créer et choisir les exercices' : 'Créer la séance';
      document.querySelector('#program-fields').hidden = !organization || organization === 'Séance seule';
      document.querySelector('#cycle-fields').hidden = organization !== 'Mésocycle';
      const advancedCycle = organization === 'Mésocycle' && window.Parcours.isAdvanced();
      for (const id of ['cycle-foundation-title','cycle-goal-fields','cycle-next-step']) document.getElementById(id).hidden = !advancedCycle;
      document.querySelector('#base-general-goal').hidden = advancedCycle;
      form.elements.cycleGoal.required = advancedCycle;
      form.elements.frequency.required = advancedCycle;
      document.querySelector('#frequency-label').textContent = advancedCycle ? 'Séances par semaine' : 'Séances par semaine, facultatif';
      form.elements.preset.dispatchEvent(new Event('change'));
      this.clearError('base-organization');
    });
    form.elements.preset.addEventListener('change', () => {
      const preset = window.gabaritsEntrainement.find(item => item.id === form.elements.preset.value);
      const custom = form.elements.organization.value === 'Mésocycle' && window.Parcours.isAdvanced() && preset.id === 'Personnalisé';
      document.querySelector('#custom-structure-fields').hidden = !custom; form.elements.cycleStructure.required = custom;
      document.querySelector('#preset-help').textContent = `${preset.help} ${preset.structure.length ? `Catégories : ${preset.structure.join(' · ')}. ` : ''}Aucun jour, repos, exercice ou objectif n’est rempli automatiquement.`;
    });
    form.elements.organization.dispatchEvent(new Event('change'));
    form.addEventListener('input', event => {
      if (event.target.id) this.clearError(event.target.id);
    });
    form.addEventListener('submit', event => {
      event.preventDefault();
      const errors = [];
      const availability = window.Disponibilites.read(form);
      if (!availability) { form.elements.timeBudget.setCustomValidity('Indique un nombre entier de minutes entre 1 et 1440, ou laisse vide.'); form.elements.timeBudget.reportValidity(); return; }
      const name = form.elements.name.value.trim();
      const organization = form.elements.organization.value;
      const validInteger = value => value.trim() !== '' && Number.isInteger(Number(value)) && Number(value) > 0;
      if (!name) errors.push(['base-name','Donne un nom à ton entraînement.']);
      if (!organization) errors.push(['base-organization','Choisis une organisation.']);
      const advancedCycle = organization === 'Mésocycle' && window.Parcours.isAdvanced();
      const structure = form.elements.preset.value === 'Personnalisé' ? [...new Set(form.elements.cycleStructure.value.split(',').map(name => name.trim()).filter(Boolean))] : [...window.gabaritsEntrainement.find(item => item.id === form.elements.preset.value).structure];
      if (advancedCycle && !structure.length) errors.push(['base-structure','Nomme au moins une séance pour définir la structure.']);
      if (advancedCycle && !form.elements.cycleGoal.value.trim()) errors.push(['base-cycle-goal','Définis l’objectif de ce mésocycle.']);
      if (advancedCycle && !validInteger(form.elements.frequency.value)) errors.push(['base-frequency','Indique le nombre de séances par semaine.']);
      if (organization === 'Mésocycle' && (!validInteger(form.elements.weeks.value) || Number(form.elements.weeks.value) > 104)) errors.push(['base-weeks','Indique le nombre de semaines du mésocycle.']);
      if (organization && organization !== 'Séance seule' && form.elements.frequency.value !== '' && !validInteger(form.elements.frequency.value)) errors.push(['base-frequency','Indique un nombre entier positif de séances.']);
      for (const [id,message] of errors) {
        const input = document.getElementById(id);
        const error = document.getElementById(`${id}-error`);
        error.textContent = message; error.hidden = false; input.setAttribute('aria-invalid','true');
      }
      if (errors.length) { document.getElementById(errors[0][0]).focus(); return; }
      const preset = organization === 'Séance seule' ? 'Personnalisé' : form.elements.preset.value;
      const base = {
        id:crypto.randomUUID(), kind:'base', ...availability, name, organization, preset, status:'À compléter',
        goal:advancedCycle ? form.elements.cycleGoal.value.trim() : form.elements.goal.value, group:form.elements.group.value, equipment:form.elements.equipment.value,
        weeks:organization === 'Mésocycle' ? Number(form.elements.weeks.value) : null,
        frequency:organization !== 'Séance seule' && form.elements.frequency.value ? Number(form.elements.frequency.value) : null,
        structure:organization === 'Séance seule' ? [] : structure, exercises:[]
      };
      window.Parcours.state.creationDraft = null;
      window.Parcours.state.saved.push(base);
      if (window.Calendrier.creationDate && organization === 'Séance seule') {
        if (window.Calendrier.creationRestIds) window.Parcours.state.calendar = window.Parcours.state.calendar.filter(item => !window.Calendrier.creationRestIds.includes(item.id));
        window.Calendrier.creationRestIds = null;
        const entry = window.Calendrier.addSession(base,window.Calendrier.creationDate);
        entry.newWorkout = true;
        window.Calendrier.creationDate = null;
        window.Calendrier.open(entry.id);
        if (quick) window.ConfigurationSeance.library();
      } else {
        if (window.Calendrier.creationDate) base.calendarStart = window.Calendrier.monday(window.Calendrier.creationDate);
        window.Calendrier.creationDate = null;
        window.Parcours.route('library');
        this.openDraft(base);
      }
    });
  },
  clearError(id) {
    const error = document.getElementById(`${id}-error`);
    if (!error) return;
    error.hidden = true; document.getElementById(id).removeAttribute('aria-invalid');
  },
  openDraft(base) {
    if (base.organization !== 'Séance seule') { window.Semaine.open(base); return; }
    window.ConfigurationSeance.open(base);
  }
};
document.querySelector('#close-draft').addEventListener('click', () => document.querySelector('#draft-dialog').close());
