const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

function app() {
  const window = {
    Ergonomie: {
      count: (value, singular) => `${value} ${singular}`,
      formatNumber: value => String(value),
      normalize: value => String(value || '').toLowerCase(),
    },
    Parcours: {
      state: { source: 'community', ui: { favoritesOnly: false }, saved: [], search: '', filters: {} },
      escape: value => String(value || ''),
      isBeginner: () => false,
    },
    Semaine: { days: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'] },
    catalogueExercices: [
      { id: 'presse-jambes', name: 'Presse à jambes', group: 'Jambes', equipment: 'Salle équipée', instruction: '' },
      { id: 'tirage-assis', name: 'Tirage assis', group: 'Dos', equipment: 'Salle équipée', instruction: '' },
    ],
    Partages: { data: { items: [] } },
  };
  const context = vm.createContext({ window, structuredClone, Intl, Date });
  const source = fs.readFileSync(path.join(__dirname, '../prototypes/propotype 1/03-decouverte/programmes.js'), 'utf8');
  vm.runInContext(source, context);
  return window;
}

function publication(id, { visibility = 'public', status = 'published', createdAt = '2026-01-01T00:00:00Z' } = {}) {
  return { id, title: `Publication ${id}`, visibility, status, createdAt, level: 'Débutant', description: 'Description', plan: { organization: 'Séance seule', name: `Plan ${id}`, exercises: [] } };
}

test('community feed shows only active public publications, newest first', () => {
  const w = app();
  w.Partages.data.items = [
    publication('older', { createdAt: '2026-01-01T00:00:00Z' }),
    publication('contacts', { visibility: 'contacts', createdAt: '2026-01-04T00:00:00Z' }),
    publication('withdrawn', { status: 'withdrawn', createdAt: '2026-01-03T00:00:00Z' }),
    publication('newer', { createdAt: '2026-01-02T00:00:00Z' }),
  ];

  const html = w.Programmes.feedCards();
  assert.ok(html.indexOf('Publication newer') < html.indexOf('Publication older'));
  assert.match(html, /data-import-program="publication:newer"/);
  assert.doesNotMatch(html, /Publication contacts|Publication withdrawn/);
});

test('community feed is hidden outside community mode and in favorites mode', () => {
  const w = app();
  w.Partages.data.items = [publication('public')];
  w.Parcours.state.source = 'starter';
  assert.equal(w.Programmes.feedCards(), '');
  w.Parcours.state.source = 'community';
  w.Parcours.state.ui.favoritesOnly = true;
  assert.equal(w.Programmes.feedCards(), '');
});

test('community feed explains when there are no public publications', () => {
  const w = app();
  w.Partages.data.items = [publication('contacts', { visibility: 'contacts' }), publication('withdrawn', { status: 'withdrawn' })];
  assert.match(w.Programmes.feedCards(), /Aucune publication publique avec ces critères pour le moment/);
});

test('community feed honors search and active filters used by discovery counts', () => {
  const w = app();
  w.Partages.data.items = [publication('matching'), publication('other')];
  w.Parcours.state.search = 'matching';
  assert.match(w.Programmes.feedCards(), /Publication matching/);
  assert.doesNotMatch(w.Programmes.feedCards(), /Publication other/);
  w.Parcours.state.filters.level = 'Avancé';
  assert.doesNotMatch(w.Programmes.feedCards(), /data-import-program=/);
  assert.match(w.Programmes.feedCards(), /avec ces critères/);
});
