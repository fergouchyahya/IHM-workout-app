'use strict';

window.Decouverte = {
  current:null,
  filtered() {
    const {filters,search,source} = window.Parcours.state;
    return window.catalogueSeances.filter(workout => workout.source === source
      && (!filters.level || workout.level === filters.level)
      && (!filters.group || workout.groups.includes(filters.group))
      && (!filters.equipment || workout.equipment === filters.equipment)
      && (!filters.duration || workout.duration <= Number(filters.duration))
      && workout.name.toLocaleLowerCase('fr').includes(search.toLocaleLowerCase('fr')))
      .sort((a,b) => a.duration-b.duration);
  },
  card(workout) {
    const p = window.Parcours;
    const favorite = p.state.favorites.includes(workout.id);
    return `<button type="button" class="landing-card" data-workout="${workout.id}"><h3>${p.escape(workout.name)}</h3><p>Environ ${workout.duration} min · ${workout.level} · ${workout.exercises.length} exercices</p><p>${workout.equipment}</p><p>${workout.groups.join(' · ')}</p><p class="card-origin">${workout.source === 'community' ? p.escape(workout.author) : 'Bibliothèque de départ'}${favorite ? ' · ★ Favori' : ''}</p></button>`;
  },
  results() {
    const workouts = this.filtered();
    const profile = window.Parcours.state.profile;
    const personal = Object.values(profile).some(Boolean);
    return `<div class="results-heading"><h2>${personal ? 'Séances pour toi' : 'Séances pour commencer'}</h2><p>Les plus courtes en premier.</p></div><div class="landing-stack">${workouts.length ? workouts.map(workout => this.card(workout)).join('') : '<div class="empty-content"><h2>Aucune séance avec ces critères</h2><p>Essaie d’élargir la recherche ou les filtres.</p><button class="landing-button" type="button" data-clear-search>Effacer recherche et filtres</button></div>'}</div><p class="landing-hint landing-section" role="status">${workouts.length} séance${workouts.length !== 1 ? 's' : ''}</p>`;
  },
  render() {
    const p = window.Parcours;
    return `${p.greeting()}<h1 tabindex="-1">Découvrir</h1><p class="landing-lead">Trouve une séance et garde-la pour plus tard.</p><label for="search-session">Rechercher une séance</label><input id="search-session" type="search" placeholder="Full Body, jambes…" value="${p.escape(p.state.search)}"><div class="filter-toolbar"><button id="open-filters" class="landing-button" type="button" aria-haspopup="dialog">Filtres</button></div><div id="active-filters" class="active-filters"></div><div class="library-sections" aria-label="Bibliothèques"><button type="button" data-source="starter" aria-pressed="${p.state.source === 'starter'}">Pour commencer</button><button type="button" data-source="community" aria-pressed="${p.state.source === 'community'}">Communauté</button></div><div id="library-results">${this.results()}</div>`;
  },
  refresh() {
    const results = document.querySelector('#library-results');
    if (!results) return;
    results.innerHTML = this.results();
    const p = window.Parcours;
    const active = Object.entries(p.state.filters).filter(([,value]) => value);
    document.querySelector('#open-filters').textContent = active.length ? `Filtres (${active.length})` : 'Filtres';
    document.querySelector('#active-filters').innerHTML = active.map(([key,value]) => `<button type="button" data-remove-filter="${key}" aria-label="Retirer le filtre ${p.escape(window.optionsFiltres[key].label)} : ${p.escape(value)}">${p.escape(key === 'duration' ? `${value} min max` : value)} ×</button>`).join('');
  },
  bind() {
    document.querySelector('#search-session').addEventListener('input', event => {
      window.Parcours.state.search = event.target.value;
      this.refresh();
    });
    document.querySelector('#open-filters').addEventListener('click', () => this.openFilters());
    document.querySelector('#landing-page').onclick = event => {
      const card = event.target.closest('[data-workout]');
      const source = event.target.closest('[data-source]');
      const remove = event.target.closest('[data-remove-filter]');
      if (card) this.openRecap(window.catalogueSeances.find(item => item.id === card.dataset.workout));
      if (source) {
        window.Parcours.state.source = source.dataset.source;
        document.querySelectorAll('[data-source]').forEach(button => button.setAttribute('aria-pressed',String(button === source)));
        this.refresh();
      }
      if (remove) { window.Parcours.state.filters[remove.dataset.removeFilter] = ''; this.refresh(); }
      if (event.target.closest('[data-clear-search]')) {
        window.Parcours.state.search = '';
        document.querySelector('#search-session').value = '';
        this.clearFilters();
      }
    };
    this.refresh();
  },
  clearFilters() {
    window.Parcours.state.filters = {level:'',group:'',equipment:'',duration:''};
    this.refresh();
    document.querySelectorAll('#filters-options select').forEach(select => { select.value = ''; });
  },
  openFilters() {
    const p = window.Parcours;
    document.querySelector('#filters-options').innerHTML = Object.entries(window.optionsFiltres).map(([key,definition]) => p.select(definition.label,key,definition.options,p.state.filters[key],'data-filter')).join('');
    document.querySelector('#filters-dialog').showModal();
  },
  openRecap(workout) {
    this.current = workout;
    this.origin = window.Parcours.view;
    this.originScroll = window.scrollY;
    document.querySelector('#recap-title').textContent = workout.name;
    document.querySelector('#recap-meta').textContent = `Environ ${workout.duration} min · ${workout.level} · ${workout.equipment}`;
    document.querySelector('#recap-description').textContent = workout.description;
    document.querySelector('#recap-exercises').replaceChildren(...workout.exercises.map(name => {
      const item = document.createElement('li'); item.textContent = name; return item;
    }));
    document.querySelector('#recap-notice').textContent = '';
    document.querySelector('#week-form').hidden = true;
    document.querySelector('#week-form').reset();
    document.querySelector('#week-day-error').hidden = true;
    document.querySelector('#week-day').removeAttribute('aria-invalid');
    document.querySelector('#recap-open-mine').hidden = true;
    this.updateRecapButtons();
    document.querySelector('#recap-dialog').showModal();
  },
  updateRecapButtons() {
    const p = window.Parcours;
    const favorite = p.state.favorites.includes(this.current.id);
    const saved = p.state.saved.some(item => item.sourceId === this.current.id);
    const button = document.querySelector('#toggle-favorite');
    button.textContent = favorite ? 'Retirer des favoris' : 'Ajouter aux favoris';
    button.setAttribute('aria-pressed',String(favorite));
    document.querySelector('#save-session').textContent = saved ? 'Déjà dans mes entraînements' : 'Ajouter à mes entraînements';
  },
  confirm(message) {
    document.querySelector('#recap-notice').textContent = message;
    this.updateRecapButtons();
    this.refresh();
  }
};

document.querySelector('#filters-options').addEventListener('change', event => {
  if (!event.target.matches('[data-filter]')) return;
  window.Parcours.state.filters[event.target.name] = event.target.value;
  window.Decouverte.refresh();
});
document.querySelector('#clear-filters').addEventListener('click', () => window.Decouverte.clearFilters());
document.querySelector('#close-filters').addEventListener('click', () => document.querySelector('#filters-dialog').close());
document.querySelector('#toggle-favorite').addEventListener('click', () => {
  const favorites = window.Parcours.state.favorites;
  const id = window.Decouverte.current.id;
  const index = favorites.indexOf(id);
  if (index === -1) favorites.push(id);
  else favorites.splice(index,1);
  window.Decouverte.confirm(index === -1 ? 'Séance ajoutée aux favoris.' : 'Séance retirée des favoris.');
});
document.querySelector('#save-session').addEventListener('click', () => {
  window.Parcours.ensureCopy(window.Decouverte.current);
  window.Decouverte.confirm('Copie personnelle conservée.');
  document.querySelector('#recap-open-mine').hidden = false;
});
document.querySelector('#plan-session').addEventListener('click', () => {
  document.querySelector('#week-form').hidden = false;
  document.querySelector('#week-day').focus();
});
document.querySelector('#cancel-week').addEventListener('click', () => { document.querySelector('#week-form').hidden = true; });
document.querySelector('#week-form').addEventListener('submit', event => {
  event.preventDefault();
  const day = document.querySelector('#week-day');
  const error = document.querySelector('#week-day-error');
  if (!day.value) {
    error.hidden = false; day.setAttribute('aria-invalid','true'); day.focus(); return;
  }
  error.hidden = true; day.removeAttribute('aria-invalid');
  const copy = window.Parcours.ensureCopy(window.Decouverte.current);
  const week = window.Parcours.state.week;
  const exists = week.some(item => item.copyId === copy.id && item.day === day.value);
  if (!exists) week.push({copyId:copy.id,day:day.value});
  window.Decouverte.confirm(exists ? 'Cette séance est déjà prévue ce jour-là.' : `Séance ajoutée : ${day.value}.`);
  document.querySelector('#week-form').hidden = true;
  document.querySelector('#recap-open-mine').hidden = false;
  document.querySelector('#plan-session').focus();
});
document.querySelector('#close-recap').addEventListener('click', () => document.querySelector('#recap-dialog').close());
document.querySelector('#recap-open-mine').addEventListener('click', () => {
  document.querySelector('#recap-dialog').close(); window.Parcours.route('mine');
});
document.querySelector('#recap-dialog').addEventListener('close', () => {
  const recap = window.Decouverte;
  if (document.querySelector('#landing-page').hidden || window.Parcours.view !== recap.origin) return;
  if (recap.origin === 'mine') window.Parcours.route('mine');
  else document.querySelector(`[data-workout="${recap.current.id}"]`)?.focus({preventScroll:true});
  // Restaurer après le retour du focus natif de la fenêtre modale.
  requestAnimationFrame(() => window.scrollTo(0,recap.originScroll));
});
