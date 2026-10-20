'use strict';

window.Ergonomie = {
  normalize(value) { return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('fr'); },
  number(input) { return input.value.trim() === '' ? null : Number(input.value.trim().replace(',','.')); },
  numeric(input) { return input.type === 'number' || input.dataset.numeric === 'true'; },
  validateNumber(input) {
    input.setCustomValidity('');
    if (!this.numeric(input)) return input.validity.valid;
    const value = this.number(input), step = input.getAttribute('step');
    if (input.value.trim() === '') return input.validity.valid;
    const valid = Number.isFinite(value) && /^-?\d+(?:[.,]\d+)?$/.test(input.value.trim()) && (!input.hasAttribute('min') || value >= Number(input.min)) && (!input.hasAttribute('max') || value <= Number(input.max)) && (!step || step === 'any' || Math.abs((value-Number(input.min || 0))/Number(step)-Math.round((value-Number(input.min || 0))/Number(step))) < 1e-8);
    if (!valid) input.setCustomValidity('Indique un nombre valide dans les limites indiquées.');
    return input.validity.valid;
  },
  bind() {
    document.querySelectorAll('input[type="number"],input[data-numeric="true"]').forEach(input => {
      input.dataset.numeric = 'true';
      const decimal = ['any','0.5'].includes(input.getAttribute('step'));
      input.inputMode = decimal ? 'decimal' : 'numeric';
      if (decimal) { const raw = input.getAttribute('value') || ''; input.type = 'text'; input.value = raw; }
      input.enterKeyHint = 'next';
    });
  },
  confirm(title,message,action,label = 'Confirmer') {
    let dialog = document.querySelector('#action-confirmation');
    if (!dialog) { dialog = document.createElement('dialog'); dialog.id = 'action-confirmation'; document.body.append(dialog); }
    dialog.setAttribute('aria-labelledby','action-confirmation-title');
    dialog.innerHTML = `<h2 id="action-confirmation-title">${window.Parcours.escape(title)}</h2><p>${window.Parcours.escape(message)}</p><div class="week-actions"><button type="button" class="primary-action" id="confirm-action">${window.Parcours.escape(label)}</button><button type="button" class="landing-button" id="cancel-action">Annuler</button></div>`;
    dialog.querySelector('#cancel-action').onclick = () => dialog.close();
    dialog.querySelector('#confirm-action').onclick = () => { dialog.close(); action(); };
    dialog.showModal();
  }
};

document.addEventListener('input',event => {
  const input = event.target;
  if (input instanceof HTMLInputElement && window.Ergonomie.numeric(input)) {
    const valid = window.Ergonomie.validateNumber(input);
    input.setAttribute('aria-invalid',String(!valid));
  }
},true);
document.addEventListener('focusin',event => {
  if (event.target instanceof HTMLInputElement && window.Ergonomie.numeric(event.target)) {
    event.target.select();
    const input = event.target;
    requestAnimationFrame(() => {
      if (!input.isConnected || input.closest('dialog')) return;
      const footer = document.querySelector('.preparation-footer, .training-navigation');
      const viewport = window.visualViewport?.height || window.innerHeight;
      const top = footer?.getBoundingClientRect().top;
      const limit = top > 0 && top < viewport ? top : viewport;
      const bottom = input.getBoundingClientRect().bottom;
      if (bottom+12 > limit) window.scrollBy(0,bottom+12-limit);
    });
  }
});
document.addEventListener('focusout',event => {
  const input = event.target;
  if (!(input instanceof HTMLInputElement) || !window.Ergonomie.numeric(input)) return;
  const valid = window.Ergonomie.validateNumber(input);
  input.setAttribute('aria-invalid',String(!valid));
  const error = (input.getAttribute('aria-describedby') || '').split(' ').map(id => document.getElementById(id)).find(element => element?.classList.contains('error'));
  if (error && !valid) { error.hidden = false; error.textContent = input.validationMessage; }
});
document.addEventListener('keydown',event => {
  if (event.key !== 'Enter' || !(event.target instanceof HTMLInputElement) || !window.Ergonomie.numeric(event.target)) return;
  event.preventDefault();
  if (!window.Ergonomie.validateNumber(event.target)) { event.target.reportValidity(); return; }
  const fields = [...document.querySelectorAll('#landing-page input')].filter(input => window.Ergonomie.numeric(input) && !input.disabled && input.getClientRects().length);
  fields[fields.indexOf(event.target)+1]?.focus();
});
