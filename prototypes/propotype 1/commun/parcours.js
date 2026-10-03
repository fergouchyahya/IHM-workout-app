'use strict';

window.Parcours = {
  state: { name:'', profile:{}, saved:[], favorites:[], week:[], filters:{}, source:'starter', search:'', scroll:0 },
  view:'discover',
  escape(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
  },
  select(label, name, options, value = '', extra = '') {
    const escape = this.escape;
    return `<label>${label}<select name="${name}" ${extra}>${options.map(([key,text]) => `<option value="${escape(key)}" ${key === value ? 'selected' : ''}>${escape(text)}</option>`).join('')}</select></label>`;
  },
  greeting() {
    return this.state.name ? `<p class="landing-greeting">Bonjour ${this.escape(this.state.name)}</p>` : '';
  },
  notify(message) {
    const notice = document.querySelector('#landing-notice');
    notice.textContent = message;
    clearTimeout(this.noticeTimer);
    this.noticeTimer = setTimeout(() => { notice.textContent = ''; },3500);
  },
  ensureCopy(workout) {
    let copy = this.state.saved.find(item => item.sourceId === workout.id);
    if (!copy) {
      copy = { ...structuredClone(workout), id:crypto.randomUUID(), sourceId:workout.id, organization:'Séance seule', kind:'copy' };
      this.state.saved.push(copy);
    }
    return copy;
  },
  route(view) {
    if (this.view === 'discover') this.state.scroll = window.scrollY;
    this.view = view;
    const page = document.querySelector('#landing-page');
    page.onclick = null;
    const labels = { discover:'Découvrir', mine:'Mes entraînements', create:'Créer un entraînement', progress:'Progrès' };
    document.title = `${labels[view]} — Propotype 1`;
    document.querySelector('#demo-screen').textContent = `Prototype · ${labels[view]}`;
    page.innerHTML = view === 'discover' ? window.Decouverte.render()
      : view === 'mine' ? window.Entrainements.render()
      : view === 'create' ? window.Entrainements.renderCreate()
      : '<h1 tabindex="-1">Progrès</h1><p class="landing-lead">Tes séances terminées et leurs résultats apparaîtront ici.</p><p class="landing-hint">Aucun résultat dans cette démonstration.</p>';
    if (view === 'discover') window.Decouverte.bind();
    else if (view === 'mine') window.Entrainements.bind();
    else if (view === 'create') window.Entrainements.bindCreate();
    const nav = document.querySelector('#landing-navigation');
    nav.hidden = view === 'create';
    nav.innerHTML = [['discover','Découvrir','◈'],['mine','Mes entraînements','▤'],['progress','Progrès','↗']].map(([id,label,icon]) => `<button type="button" data-page="${id}" ${view === id ? 'aria-current="page"' : ''}><span aria-hidden="true">${icon}</span>${label}</button>`).join('');
    page.querySelector('h1').focus({ preventScroll:true });
    window.scrollTo(0,view === 'discover' ? this.state.scroll : 0);
  },
  start({name, answers, reset}) {
    if (reset) { this.state.saved = []; this.state.favorites = []; this.state.week = []; }
    this.state.name = name;
    this.state.profile = { ...answers };
    this.state.filters = { level:answers.level || '', group:'', equipment:answers.equipment || '', duration:'' };
    this.state.source = 'starter';
    this.state.search = '';
    this.state.scroll = 0;
    document.querySelector('#questions-page').hidden = true;
    document.querySelector('#landing-page').hidden = false;
    this.view = '';
    this.route(answers.level === 'Avancé' ? 'mine' : 'discover');
  }
};

document.querySelector('#landing-navigation').addEventListener('click', event => {
  const button = event.target.closest('[data-page]');
  if (button) window.Parcours.route(button.dataset.page);
});
