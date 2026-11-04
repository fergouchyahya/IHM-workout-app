'use strict';

// Search remains local and opens the same objects as their original screens.
window.RechercheRapide = {
  entries() {
    const p = window.Parcours;
    return [
      ...[['mine','Calendrier','Planifier une séance ou un repos'],['library','Mes entraînements','Retrouver et préparer mes programmes'],['discover','Découvrir','Choisir un programme ou une séance'],['progress','Bilans','Consulter mes résultats et mes progrès'],['sharing','Partages','Publier un programme et lire les retours']].map(([view,title,description]) => ({title,description,open:() => p.route(view)})),
      ...p.state.saved.map(session => ({title:session.name,description:'Mon entraînement · préparer ou modifier',open:() => window.Entrainements.openDraft(session)})),
      ...p.state.completedSessions.map(record => ({title:record.session.name,description:`Bilan · ${record.date || ''}`,open:() => window.BilanSeance.open(record.id)}))
    ];
  },
  open() {
    const p = window.Parcours;
    let dialog = document.querySelector('#quick-search-dialog');
    if (!dialog) { dialog = document.createElement('dialog'); dialog.id = 'quick-search-dialog'; document.body.append(dialog); }
    dialog.setAttribute('aria-labelledby','quick-search-title');
    dialog.innerHTML = '<div class="page-heading"><h2 id="quick-search-title">Où veux-tu aller ?</h2><button type="button" class="text-action" id="close-quick-search">Fermer</button></div><label class="landing-section">Rechercher un entraînement, un bilan ou une rubrique<input id="quick-search-input" type="search" autocomplete="off" placeholder="Nom de séance, calendrier, bilans…"></label><p id="quick-search-count" class="form-help" role="status"></p><div id="quick-search-results" class="landing-stack"></div>';
    const input = dialog.querySelector('input'), results = dialog.querySelector('#quick-search-results');
    let matches = [];
    const render = () => {
      const terms = window.Ergonomie.normalize(input.value).split(' ').filter(Boolean);
      const all = this.entries().filter(entry => terms.every(term => window.Ergonomie.normalize(`${entry.title} ${entry.description}`).includes(term)));
      matches = all.slice(0,20);
      dialog.querySelector('#quick-search-count').textContent = all.length ? `${all.length} accès${all.length > 1 ? ' disponibles' : ' disponible'}${all.length > 20 ? ' · précise ta recherche pour voir la suite' : ''}` : 'Aucun résultat. Essaie un autre nom ou ouvre Découvrir.';
      results.innerHTML = matches.map((entry,index) => `<button type="button" class="picker-result" data-quick-result="${index}"><strong>${p.escape(entry.title)}</strong><span>${p.escape(entry.description)}</span></button>`).join('');
      if (!matches.length) results.innerHTML = '<button type="button" class="landing-button" data-quick-discover>Découvrir les programmes</button>';
    };
    results.onclick = event => {
      const button = event.target.closest('[data-quick-result]');
      if (button) { dialog.close(); matches[Number(button.dataset.quickResult)]?.open(); }
      else if (event.target.closest('[data-quick-discover]')) { dialog.close(); p.route('discover'); }
    };
    input.oninput = render;
    input.onkeydown = event => { if (event.key === 'ArrowDown') { event.preventDefault(); results.querySelector('button')?.focus(); } };
    dialog.querySelector('#close-quick-search').onclick = () => dialog.close();
    render(); dialog.showModal(); input.focus();
  }
};
document.addEventListener('keydown',event => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k' && !document.querySelector('#landing-page').hidden && !document.querySelector('dialog[open]')) {
    event.preventDefault(); window.RechercheRapide.open();
  }
});
