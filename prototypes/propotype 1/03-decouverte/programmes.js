'use strict';

window.Programmes = {
  // Liste blanche : une publication n’emporte ni résultats, ni notes/réglages personnels.
  snapshot(source) {
    const exercise = entry => {
      const item = typeof entry === 'string' ? { name: entry } : entry;
      const catalog = window.catalogueExercices.find(movement => movement.id === item.exerciseId || movement.name === item.name);
      return { name: catalog?.name || item.name || 'Exercice', group: catalog?.group || item.group || '', equipment: catalog?.equipment || item.equipment || '', instruction: catalog?.instruction || item.instruction || '', sets: item.sets ?? null, minReps: item.minReps ?? null, maxReps: item.maxReps ?? null, load: item.load ?? null, rpe: item.rpe ?? null, repMode: item.repMode || 'range' };
    };
    const session = item => ({ type: 'session', name: item.name, duration: item.duration || null, exercises: (item.exercises || []).map(exercise) });
    const days = week => Array.from({ length: 7 }, (_, index) => week?.[index]?.type === 'session' ? session(week[index]) : { type: week?.[index]?.type === 'rest' ? 'rest' : 'undefined', name: '' });
    const plan = { name: source.name, organization: source.organization || 'Séance seule', equipment: source.equipment || '', group: source.group || '', duration: source.duration || null };
    if (plan.organization === 'Séance seule') Object.assign(plan, session(source));
    else { plan.weeks = source.weeks || null; plan.days = days(source.days); if (source.cycleWeeks) plan.cycleWeeks = source.cycleWeeks.map(days); }
    return plan;
  },
  sessions(plan) {
    if (plan.organization === 'Séance seule') return [plan];
    const weeks = plan.cycleWeeks || [plan.days || []];
    return weeks.flatMap((days, index) => days.filter(day => day.type === 'session').map(day => ({ ...day, name: `${plan.cycleWeeks ? `Semaine ${index + 1} · ` : ''}${day.name}` })));
  },
  scheduleSummary(plan) {
    const weeks = plan.cycleWeeks || (plan.days ? [plan.days] : []), p = window.Parcours;
    return weeks.map((week, index) => `<p class="form-help">${plan.cycleWeeks ? `Semaine ${index + 1} · ` : ''}${week.map((day, i) => `${window.Semaine.days[i]} : ${day.type === 'session' ? p.escape(day.name) : day.type === 'rest' ? 'Repos' : 'À définir'}`).join(' · ')}</p>`).join('');
  },
  entries() {
    const publications = (window.Partages?.data.items || []).filter(item => item.status === 'published' && item.plan).map(item => ({ ...item.plan, id: `publication:${item.id}`, name: item.title, description: item.description, level: item.level, source: 'community', author: 'Publication locale de démonstration' }));
    return [...window.catalogueProgrammes, ...publications];
  },
  import(plan) {
    const p = window.Parcours, existing = p.state.saved.find(item => item.importId === plan.id);
    if (existing) return existing;
    const copy = this.snapshot(plan);
    const convert = session => {
      session.exercises = session.exercises.map((exercise, index) => {
        let catalog = window.catalogueExercices.find(item => window.Ergonomie.normalize(item.name) === window.Ergonomie.normalize(exercise.name));
        if (!catalog) {
          catalog = { id: crypto.randomUUID(), name: exercise.name, group: exercise.group, equipment: exercise.equipment, instruction: exercise.instruction };
          window.catalogueExercices.push(catalog); p.state.customExercises.push(structuredClone(catalog));
        }
        return { slotId: `slot-${index}`, exerciseId: catalog.id, sets: exercise.sets, minReps: exercise.minReps, maxReps: exercise.maxReps, load: exercise.load, rpe: exercise.rpe, repMode: exercise.repMode, note: '', setting: '' };
      });
      session.tracking = { rpe: session.exercises.some(exercise => exercise.rpe !== null) };
    };
    if (copy.organization === 'Séance seule') convert(copy);
    else { copy.days.filter(day => day.type === 'session').forEach(convert); copy.cycleWeeks?.forEach(week => week.filter(day => day.type === 'session').forEach(convert)); }
    Object.assign(copy, { id: crypto.randomUUID(), importId: plan.id, kind: 'copy', structure: [], description: plan.description || '', level: plan.level || '' });
    p.state.saved.push(copy); p.persist(); return copy;
  },
  open(id) {
    const plan = this.entries().find(item => item.id === id); if (!plan) return;
    const p = window.Parcours;
    let dialog = document.querySelector('#program-import-dialog');
    if (!dialog) { dialog = document.createElement('dialog'); dialog.id = 'program-import-dialog'; document.body.append(dialog); }
    const sessions = this.sessions(plan);
    dialog.setAttribute('aria-labelledby', 'program-import-title');
    dialog.innerHTML = `<h2 id="program-import-title" tabindex="-1" autofocus>${p.escape(plan.name)}</h2><p>${p.escape(plan.organization)}${plan.weeks ? ` · ${plan.weeks} semaines` : ''}</p><p>${p.escape(plan.description || '')}</p>${this.scheduleSummary(plan)}<ol class="import-sessions">${sessions.map(session => `<li><strong>${p.escape(session.name)}</strong><ul>${session.exercises.map(exercise => `<li>${p.escape(exercise.name)} · ${exercise.sets ?? '—'} séries · ${exercise.minReps ?? '—'}–${exercise.maxReps ?? '—'} répétitions${exercise.load != null ? ` · ${exercise.load} kg` : ''}${exercise.rpe != null ? ` · RPE ${exercise.rpe}` : ''}</li>`).join('')}</ul></li>`).join('')}</ol><p>Une copie indépendante sera ajoutée à Mes entraînements. Aucune date ne sera planifiée automatiquement.</p><div class="week-actions"><button id="import-program" type="button" class="primary-action">${p.state.saved.some(item => item.importId === id) ? 'Ouvrir ma copie' : 'Importer dans Mes entraînements'}</button><button id="cancel-import" type="button" class="text-action">Fermer</button></div>`;
    dialog.querySelector('#cancel-import').onclick = () => dialog.close();
    dialog.querySelector('#import-program').onclick = () => { const copy = this.import(plan); dialog.close(); window.Entrainements.openDraft(copy); p.notifyChange('Copie personnelle disponible · source conservée'); };
    dialog.showModal(); dialog.scrollTop = 0; dialog.querySelector('#program-import-title').focus({ preventScroll: true });
  },
  cards() {
    const p = window.Parcours;
    const plans = this.entries().filter(item => item.source === p.state.source && window.Ergonomie.normalize(item.name).includes(window.Ergonomie.normalize(p.state.search)) && (!p.state.filters.level || item.level === p.state.filters.level) && (!p.state.filters.equipment || item.equipment === p.state.filters.equipment) && (!p.state.filters.group || this.sessions(item).some(session => session.exercises.some(exercise => exercise.group === p.state.filters.group))) && (!p.state.filters.duration || this.sessions(item).every(session => session.duration && session.duration <= Number(p.state.filters.duration))));
    return `<section class="landing-section"><h2>Programmes complets</h2><p class="form-help">Semaines et mésocycles à consulter puis importer. Les publications locales actives apparaissent dans Communauté.</p><div class="landing-stack">${plans.map(plan => `<button type="button" class="landing-card" data-import-program="${p.escape(plan.id)}"><h3>${p.escape(plan.name)}</h3><p>${p.escape(plan.organization)}${plan.weeks ? ` · ${plan.weeks} semaines` : ''} · ${p.escape(plan.level)}</p><p>${p.escape(plan.author || 'Bibliothèque de démonstration')}</p><p>Voir la répartition et les cibles →</p></button>`).join('') || '<p>Aucun programme complet avec ces critères.</p>'}</div></section>`;
  }
};

// Exemples fictifs d’interface, sans prescription ni résultat d’entraînement.
{
  const exercise = (id, load) => { const item = window.catalogueExercices.find(item => item.id === id); return { name: item.name, group: item.group, equipment: item.equipment, sets: 3, minReps: 8, maxReps: 12, load, rpe: 7 }; };
  const days = Array.from({ length: 7 }, (_, index) => [0, 3].includes(index) ? { type: 'session', name: index === 0 ? 'Séance A' : 'Séance B', duration: 30, exercises: [exercise('presse-jambes', null), exercise('tirage-assis', null)] } : { type: 'rest', name: '' });
  const base = { id: 'starter-week', name: 'Semaine découverte · 2 séances', organization: 'Semaine type', days, source: 'starter', level: 'Débutant', equipment: 'Salle équipée', description: 'Répartition fictive pour essayer l’import d’une semaine complète. Les cibles sont modifiables.' };
  window.catalogueProgrammes = [base, { ...structuredClone(base), id: 'community-cycle', name: 'Mésocycle découverte · 3 semaines', organization: 'Mésocycle', weeks: 3, source: 'community', author: 'Camille · auteur fictif', cycleWeeks: Array.from({ length: 3 }, (_, index) => days.map(day => day.type === 'session' ? { ...structuredClone(day), exercises: day.exercises.map(exercise => ({ ...exercise, minReps: 8 + index, maxReps: 12 + index })) } : structuredClone(day))) }];
}
