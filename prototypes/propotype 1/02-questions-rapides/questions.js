'use strict';

// Les réponses restent en mémoire pour cette visite, sans stocker d'identifiants.
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
  let nextTimer;
  let guardUntil = 0;
  let newProfile = true;

  function cancelAdvance() {
    clearTimeout(nextTimer);
    nextTimer = null;
  }

  function render() {
    cancelAdvance();
    questionPanel.hidden = false;
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
    back.setAttribute('aria-label', current === 0 ? 'Revenir à la connexion' : 'Question précédente');
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
    title.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }

  function finish() {
    cancelAdvance();
    window.Parcours.start({name, answers, reset:newProfile});
    newProfile = false;
  }

  choices.addEventListener('click', event => {
    const button = event.target.closest('[data-choice]');
    // Un double appui ne doit pas répondre à deux questions à la même position.
    if (!button || nextTimer || event.detail > 1 || performance.now() < guardUntil) return;
    guardUntil = performance.now() + 350;
    answers[window.questionsDefinitions[current].field] = button.dataset.choice;
    choices.querySelectorAll('button').forEach(option => {
      const selected = option === button;
      option.setAttribute('aria-pressed', String(selected));
      option.querySelector('.answer-mark').textContent = selected ? '✓' : '';
    });
    nextTimer = setTimeout(() => {
      nextTimer = null;
      if (current === 2) finish();
      else { current++; render(); }
    }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 120);
  });

  back.addEventListener('click', () => {
    cancelAdvance();
    guardUntil = 0;
    if (current === 0) {
      page.hidden = true;
      returnToLogin();
    } else { current--; render(); }
  });
  document.querySelector('#skip-questions').addEventListener('click', finish);

  return {
    start(options) {
      if (options.reset) answers = {};
      newProfile = options.reset;
      name = options.name || '';
      returnToLogin = options.returnToLogin;
      current = 0;
      guardUntil = 0;
      page.hidden = false;
      document.querySelector('#landing-page').hidden = true;
      document.querySelector('#landing-navigation').hidden = true;
      document.querySelectorAll('dialog[open]').forEach(dialog => dialog.close());
      render();
    }
  };
})();
