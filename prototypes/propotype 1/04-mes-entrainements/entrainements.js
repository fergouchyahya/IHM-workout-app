'use strict';

window.Entrainements = {
  render() {
    const p = window.Parcours;
    const cards = p.state.saved.map(item => `<button class="landing-card" type="button" data-personal="${item.id}"><h3>${p.escape(item.name)}</h3><p>${item.organization}${item.weeks ? ` · ${item.weeks} semaines` : ''}</p><p>${item.kind === 'base' ? 'À compléter' : `${item.exercises.length} exercices · copie personnelle`}</p></button>`).join('');
    const favorites = window.catalogueSeances.filter(item => p.state.favorites.includes(item.id));
    const favoriteCards = favorites.map(item => `<button type="button" class="landing-card" data-favorite="${item.id}"><h3>${p.escape(item.name)}</h3><p>★ Favori · environ ${item.duration} min</p></button>`).join('');
    const week = p.state.week.map(item => ({...item,copy:p.state.saved.find(copy => copy.id === item.copyId)}));
    return `${p.greeting()}<h1 tabindex="-1">Mes entraînements</h1><div class="personal-actions"><button id="create-workout" type="button" class="primary-action">+ Créer</button></div>${cards ? `<div class="landing-stack">${cards}</div>` : '<div class="empty-content"><h2>Crée ton premier entraînement</h2><p>Choisis une structure, puis ajoute tes exercices.</p></div>'}<button id="explore-workouts" type="button" class="text-action landing-section">Explorer des séances</button>${favorites.length ? `<section class="landing-section"><h2>Mes favoris</h2><div class="landing-stack landing-section">${favoriteCards}</div></section>` : ''}${week.length ? `<section class="landing-section"><h2>Ma semaine</h2><p class="landing-hint">Placements d’exemple, sans calendrier daté.</p><ul class="saved-list">${week.map(item => `<li><b>${item.day}</b> · ${p.escape(item.copy.name)}</li>`).join('')}</ul></section>` : ''}`;
  },
  bind() {
    document.querySelector('#create-workout').addEventListener('click', () => window.Parcours.route('create'));
    document.querySelector('#explore-workouts').addEventListener('click', () => window.Parcours.route('discover'));
    document.querySelector('#landing-page').onclick = event => {
      const card = event.target.closest('[data-personal]');
      const favorite = event.target.closest('[data-favorite]');
      if (card) {
        const item = window.Parcours.state.saved.find(item => item.id === card.dataset.personal);
        if (item.kind === 'base') this.openDraft(item);
        else window.Decouverte.openRecap(window.catalogueSeances.find(source => source.id === item.sourceId));
      }
      if (favorite) window.Decouverte.openRecap(window.catalogueSeances.find(item => item.id === favorite.dataset.favorite));
    };
  },
  renderCreate() {
    const p = window.Parcours;
    const profile = p.state.profile;
    return `<button id="cancel-create" class="text-action" type="button">← Retour</button><h1 tabindex="-1">Créer un entraînement</h1><p class="landing-lead">Définis la base. Tu organiseras son contenu ensuite.</p><form id="create-base-form" class="create-form" novalidate><label for="base-name">Nom de l’entraînement<input id="base-name" name="name" type="text" maxlength="100" placeholder="Mon bloc haut/bas" required aria-describedby="base-name-error"></label><p class="error" id="base-name-error" hidden></p>${p.select('Organisation','organization',[['','Choisir une organisation'],['Séance seule','Séance seule'],['Semaine type','Semaine type'],['Mésocycle','Mésocycle · plusieurs semaines']],'','id="base-organization" required aria-describedby="base-organization-error"')}<p class="error" id="base-organization-error" hidden></p><div id="program-fields" hidden>${p.select('Gabarit de répartition, facultatif','preset',window.gabaritsEntrainement.map(item => [item.id,item.label || item.id]),'Personnalisé','id="base-preset" aria-describedby="preset-help"')}<p class="form-help" id="preset-help">${window.gabaritsEntrainement[0].help}</p><label>Séances par semaine, facultatif<input id="base-frequency" name="frequency" type="number" min="1" step="1" inputmode="numeric" aria-describedby="base-frequency-error"></label><p class="error" id="base-frequency-error" hidden></p></div><div id="cycle-fields" hidden><label>Durée du mésocycle, en semaines<input id="base-weeks" name="weeks" type="number" min="1" step="1" inputmode="numeric" aria-describedby="base-weeks-error"></label><p class="error" id="base-weeks-error" hidden></p></div>${p.select('Objectif principal, facultatif','goal',[['','Non renseigné'],['Gagner en force','Gagner en force'],['Développer mes muscles','Développer mes muscles'],['Rester actif','Rester actif']],profile.goal || '')}${p.select('Groupe musculaire ou zone, facultatif','group',window.optionsFiltres.group.options.map(([value,text]) => [value,value ? text : 'Non renseigné']))}${p.select('Matériel, facultatif','equipment',window.optionsFiltres.equipment.options.map(([value,text]) => [value,value ? text : 'Non renseigné']),profile.equipment || '')}<button class="primary-action landing-section" type="submit">Créer la base</button></form>`;
  },
  bindCreate() {
    const form = document.querySelector('#create-base-form');
    document.querySelector('#cancel-create').addEventListener('click', () => window.Parcours.route('mine'));
    form.elements.organization.addEventListener('change', () => {
      const organization = form.elements.organization.value;
      document.querySelector('#program-fields').hidden = !organization || organization === 'Séance seule';
      document.querySelector('#cycle-fields').hidden = organization !== 'Mésocycle';
      this.clearError('base-organization');
    });
    form.elements.preset.addEventListener('change', () => {
      document.querySelector('#preset-help').textContent = window.gabaritsEntrainement.find(item => item.id === form.elements.preset.value).help;
    });
    form.addEventListener('input', event => {
      if (event.target.id) this.clearError(event.target.id);
    });
    form.addEventListener('submit', event => {
      event.preventDefault();
      const errors = [];
      const name = form.elements.name.value.trim();
      const organization = form.elements.organization.value;
      const validInteger = value => value.trim() !== '' && Number.isInteger(Number(value)) && Number(value) > 0;
      if (!name) errors.push(['base-name','Donne un nom à ton entraînement.']);
      if (!organization) errors.push(['base-organization','Choisis une organisation.']);
      if (organization === 'Mésocycle' && !validInteger(form.elements.weeks.value)) errors.push(['base-weeks','Indique le nombre de semaines du mésocycle.']);
      if (organization && organization !== 'Séance seule' && form.elements.frequency.value !== '' && !validInteger(form.elements.frequency.value)) errors.push(['base-frequency','Indique un nombre entier positif de séances.']);
      for (const [id,message] of errors) {
        const input = document.getElementById(id);
        const error = document.getElementById(`${id}-error`);
        error.textContent = message; error.hidden = false; input.setAttribute('aria-invalid','true');
      }
      if (errors.length) { document.getElementById(errors[0][0]).focus(); return; }
      const preset = organization === 'Séance seule' ? 'Personnalisé' : form.elements.preset.value;
      const base = {
        id:crypto.randomUUID(), kind:'base', name, organization, preset, status:'À compléter',
        goal:form.elements.goal.value, group:form.elements.group.value, equipment:form.elements.equipment.value,
        weeks:organization === 'Mésocycle' ? Number(form.elements.weeks.value) : null,
        frequency:organization !== 'Séance seule' && form.elements.frequency.value ? Number(form.elements.frequency.value) : null,
        structure:[...window.gabaritsEntrainement.find(item => item.id === preset).structure], exercises:[]
      };
      window.Parcours.state.saved.push(base);
      window.Parcours.route('mine');
      this.openDraft(base);
    });
  },
  clearError(id) {
    const error = document.getElementById(`${id}-error`);
    if (!error) return;
    error.hidden = true; document.getElementById(id).removeAttribute('aria-invalid');
  },
  openDraft(base) {
    const p = window.Parcours;
    document.querySelector('#draft-title').textContent = base.name;
    const facts = [['Organisation',base.organization],['Gabarit',base.preset],['Durée',base.weeks ? `${base.weeks} semaines` : 'Non renseignée'],['Séances par semaine',base.frequency || 'Non renseigné'],['Objectif',base.goal || 'Non renseigné'],['Zone',base.group || 'Non renseignée'],['Matériel',base.equipment || 'Non renseigné']];
    document.querySelector('#draft-facts').innerHTML = facts.map(([label,value]) => `<div><dt>${label}</dt><dd>${p.escape(value)}</dd></div>`).join('');
    document.querySelector('#draft-structure').textContent = base.structure.length ? `Structure à compléter : ${base.structure.join(' / ')}.` : 'Structure personnalisée à compléter.';
    const next = base.organization === 'Séance seule' ? 'Ajouter et organiser les exercices.' : base.organization === 'Semaine type' ? 'Configurer les séances et les jours de repos.' : 'Configurer la semaine de référence, sa répétition et ses adaptations.';
    document.querySelector('#draft-next').textContent = `Prochaine étape de démonstration : ${next}`;
    document.querySelector('#draft-dialog').showModal();
  }
};
document.querySelector('#close-draft').addEventListener('click', () => document.querySelector('#draft-dialog').close());
