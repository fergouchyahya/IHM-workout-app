'use strict';

// Le brouillon appartient au profil local ; aucun mot de passe n’est conservé.
window.QuestionsRapides = (() => {
  const page = document.querySelector('#questions-page');
  const questionPanel = document.querySelector('#question-panel');
  const title = document.querySelector('#question-title');
  const choices = document.querySelector('#question-choices');
  const back = document.querySelector('#question-back');
  let answers = {};
  let current = 0;
  let name = '';
  let returnToLogin;
  let onComplete;
  let nextTimer;
  let editing = false;
  let editingField = null;
  let owner;

  function remember() {
    if (editing || window.Parcours.state.identity !== owner) return true;
    window.Parcours.state.onboardingDraft = {answers:{...answers},current};
    return window.Parcours.persist();
  }

  function cancelAdvance() {
    clearTimeout(nextTimer);
    nextTimer = null;
  }

  function render() {
    cancelAdvance();
    questionPanel.hidden = false;
    document.querySelector('#skip-questions').textContent = editing ? 'Conserver mes réponses' : 'Passer le reste';
    document.querySelector('#skip-one-question').hidden = editing;
    const question = window.questionsDefinitions[current];
    document.title = `Question ${current + 1} sur 3 — Propotype 1`;
    document.querySelector('#question-number').textContent = `Question ${current + 1} sur 3`;
    document.querySelector('#question-progress').setAttribute('aria-valuenow', String(current + 1));
    document.querySelectorAll('#question-progress span').forEach((segment, index) => segment.classList.toggle('active', index <= current));
    const greeting = document.querySelector('#question-greeting');
    greeting.hidden = current !== 0;
    greeting.textContent = name ? `Bonjour ${name}` : 'Bonjour';
    greeting.title = greeting.textContent;
    title.textContent = question.title;
    const backLabel = editing ? 'Annuler la modification' : 'Question précédente';
    back.hidden = !editing && current === 0;
    back.setAttribute('aria-label',backLabel); back.textContent = `← ${backLabel}`;
    choices.replaceChildren();
    for (const choice of question.choices) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'question-choice';
      button.dataset.choice = choice;
      button.setAttribute('aria-pressed', String(answers[question.field] === choice));
      const label = document.createElement('span');
      label.textContent = choice;
      const mark = document.createElement('span');
      mark.className = 'answer-mark';
      mark.setAttribute('aria-hidden', 'true');
      mark.textContent = answers[question.field] === choice ? '✓' : '';
      button.append(label, mark);
      choices.append(button);
    }
    const saved = remember();
    document.querySelector('#question-save-status').textContent = saved ? (answers[question.field] ? `Réponse conservée : ${answers[question.field]}` : '') : 'Sauvegarde indisponible · garde cette page ouverte.';
    title.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }

  function finish() {
    cancelAdvance();
    if (editing) { window.Parcours.state.profile = {...answers}; if (current === 0) window.Parcours.state.filters.level = answers.level || ''; if (current === 2) window.Parcours.state.filters.equipment = answers.equipment || ''; document.querySelector('#questions-page').hidden = true; document.querySelector('#landing-page').hidden = false; if (onComplete) onComplete(); else { window.Parcours.route('mine'); window.Parcours.notifyChange('Préférences enregistrées · entraînements conservés'); } }
    else { delete window.Parcours.state.onboardingDraft; window.Parcours.start({name,answers,reset:false}); }
  }

  choices.addEventListener('click', event => {
    const button = event.target.closest('[data-choice]');
    // Un double appui ne doit pas répondre à deux questions à la même position.
    if (!button || nextTimer || event.detail > 1) return;

    if (window.Parcours.state.identity !== owner) return;
    answers[window.questionsDefinitions[current].field] = button.dataset.choice;
    const saved = remember(); document.querySelector('#question-save-status').textContent = saved ? `Choisi : ${button.dataset.choice}` : 'Sauvegarde indisponible · garde cette page ouverte.';
    choices.querySelectorAll('button').forEach(option => {
      const selected = option === button;
      option.setAttribute('aria-pressed', String(selected));
      option.querySelector('.answer-mark').textContent = selected ? '✓' : '';
    });
    nextTimer = setTimeout(() => {
      nextTimer = null;
      if (editing || current === 2) finish();
      else { current++; render(); }
    }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 120);
  });

  back.addEventListener('click', () => {
    cancelAdvance();
    if (editing) { page.hidden = true; returnToLogin(); return; }
    if (current > 0) { current--; render(); }
  });
  document.querySelector('#skip-questions').addEventListener('click', finish);
  document.querySelector('#skip-one-question').addEventListener('click',() => { cancelAdvance(); if (editing || current === 2) finish(); else { current++; render(); } });

  return {
    start(options) {
      if (options.reset) answers = {};
      editing = !!options.editing;
      editingField = options.field ?? null;
      if (options.answers) answers = {...options.answers};
      owner = window.Parcours.state.identity;
      name = options.name || '';
      returnToLogin = options.returnToLogin;
      onComplete = options.onComplete;
      const draft = !editing && window.Parcours.state.onboardingDraft;
      if (draft) answers = {...draft.answers};
      current = editingField ?? (Number.isInteger(draft?.current) ? Math.max(0,Math.min(2,draft.current)) : 0);

      page.hidden = false;
      document.querySelector('#landing-page').hidden = true;
      document.querySelector('#landing-navigation').hidden = true;
      document.querySelectorAll('dialog[open]').forEach(dialog => dialog.close());
      render();
    }
  };
})();
