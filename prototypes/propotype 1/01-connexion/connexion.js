'use strict';

const loginForm = document.querySelector('#login-form');
const signupForm = document.querySelector('#signup-form');
const recoveryForm = document.querySelector('#recovery-form');
const tabs = [...document.querySelectorAll('[role="tab"]')];
const recoveryDialog = document.querySelector('#recovery-dialog');
const emailFormat = document.createElement('input');
emailFormat.type = 'email';
emailFormat.required = true;
let previousIdentity = null;

function validEmail(value) {
  emailFormat.value = value.trim();
  return emailFormat.validity.valid;
}

function validationMessage(input) {
  const value = input.value.trim();
  if (input.name === 'password') return input.value ? '' : 'Saisis ton mot de passe.';
  if (input.name === 'identifier') {
    if (!value) return 'Saisis ton e-mail ou ton nom d’utilisateur.';
    return value.includes('@') && !validEmail(value) ? 'Saisis une adresse e-mail valide.' : '';
  }
  if (input.name === 'username') return value ? '' : 'Choisis un nom d’utilisateur.';
  if (input.name === 'email') return validEmail(value) ? '' : 'Saisis une adresse e-mail valide.';
  return '';
}

function showFieldError(input, message) {
  const error = document.querySelector(`#${input.id}-error`);
  error.textContent = message;
  error.hidden = !message;
  if (message) input.setAttribute('aria-invalid', 'true');
  else input.removeAttribute('aria-invalid');
}

function validateForm(form) {
  let firstInvalid = null;
  for (const input of form.querySelectorAll('input')) {
    const message = validationMessage(input);
    showFieldError(input, message);
    if (message && !firstInvalid) firstInvalid = input;
  }
  if (firstInvalid) firstInvalid.focus();
  return !firstInvalid;
}

function clearFormErrors(form) {
  for (const input of form.querySelectorAll('input')) showFieldError(input, '');
}

function clearPasswords() {
  for (const toggle of document.querySelectorAll('[data-password]')) {
    const input = document.getElementById(toggle.dataset.password);
    input.value = '';
    input.type = 'password';
    toggle.textContent = 'Afficher';
    toggle.setAttribute('aria-label', 'Afficher le mot de passe');
    toggle.setAttribute('aria-pressed', 'false');
  }
}

function selectMode(tab) {
  if (tab.getAttribute('aria-selected') === 'true') return;
  const identifier = loginForm.elements.identifier;
  if (tab.id === 'signup-tab') {
    const field = identifier.value.includes('@') ? signupForm.elements.email : signupForm.elements.username;
    if (!field.value) field.value = identifier.value;
  } else if (!identifier.value) {
    identifier.value = signupForm.elements.email.value || signupForm.elements.username.value;
  }
  clearPasswords();
  clearFormErrors(loginForm);
  clearFormErrors(signupForm);
  for (const option of tabs) {
    const selected = option === tab;
    option.setAttribute('aria-selected', String(selected));
    option.tabIndex = selected ? 0 : -1;
    document.getElementById(option.getAttribute('aria-controls')).hidden = !selected;
  }
}

for (const tab of tabs) {
  tab.addEventListener('click', () => selectMode(tab));
  tab.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? tabs[0] : event.key === 'End' ? tabs[1] : tabs[(tabs.indexOf(tab) + 1) % tabs.length];
    selectMode(next);
    next.focus();
  });
}

for (const toggle of document.querySelectorAll('[data-password]')) {
  // Garder le focus de saisie lors d'un appui tactile ou souris sur Afficher.
  toggle.addEventListener('pointerdown', event => event.preventDefault());
  toggle.addEventListener('click', () => {
    const input = document.getElementById(toggle.dataset.password);
    const selection = [input.selectionStart, input.selectionEnd];
    const visible = input.type === 'password';
    input.type = visible ? 'text' : 'password';
    input.setSelectionRange(...selection);
    // Chromium peut remettre la sélection à zéro après le changement de type.
    requestAnimationFrame(() => input.setSelectionRange(...selection));
    toggle.textContent = visible ? 'Masquer' : 'Afficher';
    toggle.setAttribute('aria-label', visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe');
    toggle.setAttribute('aria-pressed', String(visible));
  });
}

function openQuestions(mode) {
  const identifier = (mode === 'signup' ? signupForm.elements.username.value : loginForm.elements.identifier.value).trim();
  const isEmail = mode !== 'signup' && identifier.includes('@');
  const identity = `${isEmail ? 'email' : 'username'}:${isEmail ? identifier.toLowerCase() : identifier}`;
  const reset = identity !== previousIdentity;
  previousIdentity = identity;
  clearPasswords();
  loginForm.reset();
  signupForm.reset();
  document.querySelector('#access-page').hidden = true;
  document.querySelector('#demo-screen').textContent = 'Prototype · Questions rapides';
  window.QuestionsRapides.start({
    name: isEmail ? identifier.split('@')[0] : identifier,
    reset,
    returnToLogin: () => returnToLogin(identifier)
  });
}

function returnToLogin(identifier = '') {
  clearPasswords();
  selectMode(tabs[0]);
  clearFormErrors(loginForm);
  document.querySelector('#access-page').hidden = false;
  document.title = 'Connexion — Propotype 1';
  document.querySelector('#demo-screen').textContent = 'Prototype · Connexion';
  loginForm.elements.identifier.value = identifier;
  loginForm.elements.identifier.focus();
  window.scrollTo(0, 0);
}

for (const [form, mode] of [[loginForm, 'login'], [signupForm, 'signup']]) {
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (validateForm(form)) openQuestions(mode);
  });
}

document.querySelector('#forgot-password').addEventListener('click', () => {
  recoveryForm.reset();
  clearFormErrors(recoveryForm);
  recoveryForm.hidden = false;
  document.querySelector('#recovery-confirmation').hidden = true;
  const identifier = loginForm.elements.identifier.value;
  recoveryForm.elements.email.value = validEmail(identifier) ? identifier.trim() : '';
  recoveryDialog.showModal();
});

recoveryForm.addEventListener('submit', event => {
  event.preventDefault();
  if (!validateForm(recoveryForm)) return;
  recoveryForm.reset();
  recoveryForm.hidden = true;
  document.querySelector('#recovery-confirmation').hidden = false;
  document.querySelector('#close-recovery').focus();
});

document.querySelector('#close-recovery').addEventListener('click', () => recoveryDialog.close());
recoveryDialog.addEventListener('close', () => {
  recoveryForm.reset();
  document.querySelector('#forgot-password').focus();
});

document.addEventListener('input', event => {
  const input = event.target;
  if (input instanceof HTMLInputElement && input.getAttribute('aria-invalid') === 'true') {
    showFieldError(input, validationMessage(input));
  }
});

// Point d'entrée isolé pour relire les questions sans saisir un compte de démo.
function openStandaloneQuestions() {
  if (location.hash !== '#questions') return;
  document.querySelector('#access-page').hidden = true;
  document.querySelector('#demo-screen').textContent = 'Prototype · Questions rapides';
  window.QuestionsRapides.start({ name: '', reset: true, returnToLogin });
}
window.addEventListener('hashchange', openStandaloneQuestions);
openStandaloneQuestions();
