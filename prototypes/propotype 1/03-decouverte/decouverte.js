'use strict';

window.Decouverte = {
  current:null,
  filtered() {
    const {filters,search,source} = window.Parcours.state;
    return window.catalogueSeances.filter(workout => (window.Parcours.state.ui.favoritesOnly ? window.Parcours.state.favorites.includes(workout.id) : workout.source === source)
      && (!filters.level || workout.level === filters.level)
      && (!filters.group || workout.groups.includes(filters.group))
      && (!filters.equipment || workout.equipment === filters.equipment)
      && (!filters.duration || workout.duration <= Number(filters.duration))
      && window.Ergonomie.normalize(workout.name).includes(window.Ergonomie.normalize(search)))
      .sort((a,b) => a.duration-b.duration);
  },
  card(workout) {
    const p = window.Parcours;
    const favorite = p.state.favorites.includes(workout.id);
    return `<button type="button" class="landing-card" data-workout="${workout.id}"><h3>${p.escape(workout.name)}</h3><p>Environ ${workout.duration} min · ${workout.level} · ${workout.exercises.length} exercices</p><p>${workout.equipment}</p><p>${workout.groups.join(' · ')}</p><p class="card-origin">${workout.source === 'community' ? p.escape(workout.author) : 'Bibliothèque de départ'}${favorite ? ' · ★ Favori' : ''}${p.state.saved.some(item => item.sourceId === workout.id) ? ' · ✓ Déjà enregistré' : ''}</p></button>`;
  },
  results() {
    const workouts = this.filtered(), plans = window.Programmes.filtered(), p = window.Parcours;
    const total = workouts.length + plans.length, e = window.Ergonomie;
    return `<div class="results-heading"><h2>${p.state.ui.favoritesOnly ? 'Mes favoris · toutes bibliothèques' : 'Selon tes filtres'}</h2><p id="search-results-summary" role="status">${e.count(total,'résultat')} · ${e.count(workouts.length,'séance')} · ${e.count(plans.length,'programme')}</p><p>Tri des séances : durée croissante. ${p.state.profile.timeBudget ? `Repère personnel : ${e.formatNumber(p.state.profile.timeBudget)} min disponibles ; le filtre Durée reste à ton choix.` : 'Niveau, matériel, zone et durée suivent les filtres affichés.'}</p></div>${total ? workouts.length ? `<h2>Séances individuelles</h2><div class="landing-stack">${workouts.map(workout => this.card(workout)).join('')}</div>` : '' : `<div class="empty-content"><h2>Aucun résultat avec ces critères</h2><p>Retire un filtre ci-dessus${p.state.search ? ' ou modifie le nom recherché' : ''}.</p>${p.state.search ? '<button class="landing-button" type="button" data-clear-search-only>Effacer le nom recherché</button>' : ''}<button class="landing-button" type="button" data-clear-search>Tout réinitialiser</button></div>`}`;
  },
  render() {
    const p = window.Parcours;
    return `${p.greeting()}<h1 tabindex="-1">Découvrir</h1><label for="search-session">Rechercher une séance ou un programme</label><input id="search-session" type="search" placeholder="Full Body, jambes…" value="${p.escape(p.state.search)}"><div class="filter-toolbar"><button id="filter-favorites" class="landing-button" type="button" aria-pressed="${!!p.state.ui.favoritesOnly}">★ Mes favoris</button><button id="open-filters" class="landing-button" type="button" aria-haspopup="dialog">Filtres</button></div><p class="form-help">Bibliothèque et critères actifs</p><div id="active-filters" class="active-filters"></div><div id="discovery-libraries" class="library-sections" aria-label="Bibliothèques" ${p.state.ui.favoritesOnly ? 'hidden' : ''}><button type="button" data-source="starter" aria-pressed="${p.state.source === 'starter'}">Pour commencer</button><button type="button" data-source="community" aria-pressed="${p.state.source === 'community'}">Communauté</button></div><div id="library-results">${this.results()}</div><div id="program-results">${window.Programmes.cards()}</div>`;
  },
  refresh() {
    const results = document.querySelector('#library-results');
    if (!results) return;
    results.innerHTML = this.results();
    document.querySelector('#program-results').innerHTML = window.Programmes.cards();
    const p = window.Parcours;
    document.querySelector('#filter-favorites').setAttribute('aria-pressed',String(!!p.state.ui.favoritesOnly));
    document.querySelector('#discovery-libraries').hidden = !!p.state.ui.favoritesOnly;
    const active = Object.entries(p.state.filters).filter(([,value]) => value);
    document.querySelector('#active-filters').setAttribute('aria-label',`Filtres actifs · ${p.state.ui.favoritesOnly ? 'Favoris de toutes les bibliothèques' : p.state.source === 'starter' ? 'Bibliothèque de départ' : 'Communauté'}`);
    document.querySelector('#open-filters').textContent = active.length ? `Filtres (${active.length})` : 'Filtres';
    document.querySelector('#active-filters').innerHTML = active.map(([key,value]) => `<button type="button" data-remove-filter="${key}" aria-label="Retirer le filtre ${p.escape(window.optionsFiltres[key].label)} : ${p.escape(value)}">${p.escape(key === 'duration' ? `${value} min max` : value)} ×</button>`).join('');
    if (p.location?.view === 'discover') {
      const location = {...p.captureLocation(),entryId:p.location.entryId,back:p.location.back};
      p.location = location; p.state.ui.navigation = location;
      window.history?.replaceState({ihmLocation:location},''); p.persist();
    }
  },
  bind() {
    document.querySelector('#search-session').addEventListener('input', event => {
      window.Parcours.state.search = event.target.value;
      this.refresh();
    });
    document.querySelector('#filter-favorites').onclick = () => { window.Parcours.state.ui.favoritesOnly = !window.Parcours.state.ui.favoritesOnly; this.refresh(); };
    document.querySelector('#open-filters').addEventListener('click', () => this.openFilters());
    document.querySelector('#landing-page').onclick = event => {
      const program = event.target.closest('[data-import-program]');
      if (program) { window.Programmes.open(program.dataset.importProgram); return; }
      const card = event.target.closest('[data-workout]');
      const source = event.target.closest('[data-source]');
      const remove = event.target.closest('[data-remove-filter]');
      if (card) this.openRecap(window.catalogueSeances.find(item => item.id === card.dataset.workout));
      if (source) {
        window.Parcours.state.source = source.dataset.source;
        document.querySelectorAll('[data-source]').forEach(button => button.setAttribute('aria-pressed',String(button === source)));
        this.refresh();
      }
      if (remove) { window.Parcours.state.filters[remove.dataset.removeFilter] = ''; this.refresh(); document.querySelector('#open-filters').focus(); }
      if (event.target.closest('[data-clear-search-only]')) { window.Parcours.state.search = ''; document.querySelector('#search-session').value = ''; this.refresh(); document.querySelector('#search-session').focus(); }
      if (event.target.closest('[data-clear-search]')) {
        window.Parcours.state.ui.favoritesOnly = false;
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
    document.querySelector('#week-day-error').textContent = 'Choisis une date avant d’ajouter la séance.';
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
    document.querySelector('#save-session').textContent = saved ? 'Préparer ma copie' : 'Enregistrer dans mes entraînements';
    document.querySelector('#recap-notice').textContent ||= 'Favori : retrouver facilement · Enregistrer : garder une copie · Planifier : choisir une date.';
  },
  confirm(message) {
    const saved = window.Parcours.persist();
    document.querySelector('#recap-notice').textContent = saved ? message : 'Modification appliquée pour cette visite · sauvegarde indisponible';
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
  const existing = window.Parcours.state.saved.find(item => item.sourceId === window.Decouverte.current.id);
  if (existing) { document.querySelector('#recap-dialog').close(); window.ConfigurationSeance.open(existing); return; }
  window.Parcours.ensureCopy(window.Decouverte.current);
  window.Decouverte.confirm('Copie personnelle conservée.');
  document.querySelector('#recap-open-mine').hidden = false;
});
document.querySelector('#plan-session').addEventListener('click', () => {
  document.querySelector('#week-form').hidden = false;
  document.querySelector('#week-day').value = window.Calendrier.selected;
  document.querySelector('#week-day').focus();
});
document.querySelector('#cancel-week').addEventListener('click', () => { document.querySelector('#week-form').hidden = true; });
document.querySelector('#week-form').addEventListener('submit', event => {
  event.preventDefault();
  const day = document.querySelector('#week-day');
  const error = document.querySelector('#week-day-error');
  if (!day.value) {
    error.textContent = 'Choisis une date avant d’ajouter la séance.';
    error.hidden = false; day.setAttribute('aria-invalid','true'); day.focus(); return;
  }
  error.hidden = true; day.removeAttribute('aria-invalid');
  const date = day.value;
  const rests = window.Calendrier.entries(date).filter(item => item.type === 'rest');
  const place = () => {
    const p = window.Parcours;
    p.state.calendar = p.state.calendar.filter(item => !rests.some(rest => rest.id === item.id));
    const copy = p.ensureCopy(window.Decouverte.current);
    const entry = window.Calendrier.addSession(copy,date);
    window.Calendrier.selected = window.Calendrier.cursor = date;
    window.Decouverte.confirm(`Séance ajoutée au calendrier : ${window.Calendrier.label(date)}.`);
    window.Calendrier.undoPlacement(rests,[entry.id],'Séance ajoutée au calendrier');
    document.querySelector('#week-form').hidden = true;
    document.querySelector('#recap-open-mine').hidden = false;
    document.querySelector('#plan-session').focus();
  };
  if (rests.length) window.Ergonomie.confirm('Remplacer le repos ?', 'Cette date est marquée comme repos. La séance remplacera ce repos.',place,'Remplacer par la séance');
  else place();
});
document.querySelector('#close-recap').addEventListener('click', () => document.querySelector('#recap-dialog').close());
document.querySelector('#recap-open-mine').addEventListener('click', () => {
  document.querySelector('#recap-dialog').close(); window.Parcours.route('mine');
});
document.querySelector('#recap-dialog').addEventListener('close', () => {
  const recap = window.Decouverte;
  if (document.querySelector('#landing-page').hidden || window.Parcours.view !== recap.origin) return;
  if (recap.origin === 'mine') window.Parcours.route('mine');
  else (document.querySelector(`[data-workout="${recap.current.id}"]`) || document.querySelector('#filter-favorites'))?.focus({preventScroll:true});
  // Restaurer après le retour du focus natif de la fenêtre modale.
  requestAnimationFrame(() => window.scrollTo(0,recap.originScroll));
});
