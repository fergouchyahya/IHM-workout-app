'use strict';

/* T4 autonome : les publications de démonstration ont leur propre stockage. */
window.Partages = {
  key:'ihm-prototype-1-t4',
  stage:'list',
  source:null,
  draft:null,
  activeId:null,
  editing:false,
  data:{items:[]},
  restore() {
    try {
      const value = JSON.parse(localStorage.getItem(this.key) || 'null');
      if (value && Array.isArray(value.items)) {
        this.data = value;
        for (const item of this.data.items) {
          // Récupère les anciennes publications où l’option avait remplacé la liste.
          if (typeof item.commentsEnabled !== 'boolean') item.commentsEnabled = typeof item.comments === 'boolean' ? item.comments : true;
          if (!Array.isArray(item.comments)) item.comments = [];
        }
      }
    } catch { /* Le parcours reste disponible pour cette visite. */ }
  },
  persist() {
    try { localStorage.setItem(this.key,JSON.stringify(this.data)); }
    catch { window.Parcours.notify('Stockage local indisponible : les partages ne seront gardés que pendant cette visite.'); }
  },
  esc(value) { return window.Parcours.escape(value); },
  sourceItems() { return window.Parcours.state.saved || []; },
  cleanProgram(source) {
    const exercise = item => {
      if (typeof item === 'string') return {name:item,sets:null,minReps:null,maxReps:null,load:null};
      const catalog = window.catalogueExercices?.find(entry => entry.id === item.exerciseId);
      return {name:item.name || catalog?.name || String(item.exerciseId || 'Exercice'), sets:item.sets ?? null, minReps:item.minReps ?? null, maxReps:item.maxReps ?? null, load:item.load ?? null};
    };
    if (source.organization === 'Séance seule') return [{name:source.name, exercises:(source.exercises || []).map(exercise)}];
    return (source.days || []).filter(day => day.type === 'session').map(day => ({name:day.name || 'Séance',exercises:(day.exercises || []).map(exercise)}));
  },
  readiness(source) {
    const sessions = this.cleanProgram(source);
    if (!sessions.length) return 'Ajoute au moins une séance au programme avant de le partager.';
    if (sessions.some(session => !session.exercises.length)) return 'Chaque séance doit contenir au moins un exercice.';
    if (sessions.some(session => session.exercises.some(item => !item.name))) return 'Vérifie que chaque exercice a un nom compréhensible.';
    return '';
  },
  render() {
    const p = window.Parcours;
    if (this.stage === 'list') return this.renderList();
    if (this.stage === 'select') return this.renderSelect();
    if (this.stage === 'verify') return this.renderVerify();
    if (this.stage === 'form') return this.renderForm();
    if (this.stage === 'preview') return this.renderPreview();
    if (this.stage === 'detail') return this.renderDetail();
    return `<h1 tabindex="-1">Partages</h1><button class="text-action" data-a="list">Retour aux partages</button>`;
  },
  renderList() {
    const items = this.data.items.map(item => `<article class="t4-card"><h2>${this.esc(item.title)}</h2><p>${this.esc(item.visibility === 'public' ? 'Communauté' : 'Mes contacts')} · ${this.esc(item.level)} · ${this.esc(item.status === 'published' ? 'Publié' : 'Retiré')}</p><button class="landing-button full" data-a="open" data-id="${item.id}">Gérer cette publication</button></article>`).join('');
    return `${window.Parcours.greeting()}<h1 tabindex="-1">Partages</h1><p class="landing-lead">Choisis un entraînement déjà préparé, vérifie ce qui sera visible, puis confirme avant publication.</p><button class="primary-action" data-a="start">Partager un programme</button>${items ? `<section class="landing-section"><h2>Mes publications</h2><div class="landing-stack">${items}</div></section>` : '<div class="empty-content"><h2>Aucune publication</h2><p>Tes programmes restent privés tant que tu ne confirmes pas leur partage.</p></div>'}`;
  },
  renderSelect() {
    const sources = this.sourceItems();
    return `<button class="text-action" data-a="list">← Partages</button><h1 tabindex="-1">Choisir un programme</h1><p class="landing-lead">Sélectionne une séance, une semaine ou un cycle que tu as préparé dans Mes entraînements.</p>${sources.length ? `<div class="landing-stack">${sources.map(source => `<article class="t4-card"><h2>${this.esc(source.name)}</h2><p>${this.esc(source.organization || 'Séance seule')} · ${source.kind === 'base' ? 'Programme personnel' : 'Copie personnelle'}</p><button class="landing-button full" data-a="choose" data-id="${source.id}">Vérifier ce programme</button></article>`).join('')}</div>` : '<div class="empty-content"><h2>Rien à partager pour le moment</h2><p>Crée d’abord une séance ou un bloc dans Mes entraînements.</p><button class="landing-button" data-a="mine">Mes entraînements</button></div>'}`;
  },
  renderVerify() {
    const source = this.source;
    const sessions = this.cleanProgram(source);
    const warning = this.readiness(source);
    const summary = sessions.map(session => `<li><strong>${this.esc(session.name)}</strong><ul>${session.exercises.map(item => `<li>${this.esc(item.name)}${item.sets ? ` · ${item.sets} séries` : ''}${item.minReps ? ` · ${item.minReps}${item.maxReps && item.maxReps !== item.minReps ? `–${item.maxReps}` : ''} répétitions` : ''}</li>`).join('')}</ul></li>`).join('');
    return `<button class="text-action" data-a="select">← Changer de programme</button><h1 tabindex="-1">Vérifier le contenu</h1><p class="landing-lead">${this.esc(source.name)} · ${this.esc(source.organization || 'Séance seule')}</p>${warning ? `<p class="t4-error" role="alert">${this.esc(warning)}</p>` : `<p class="t4-ok" role="status">Le programme contient ${sessions.length} séance${sessions.length > 1 ? 's' : ''} et ${sessions.reduce((sum,session) => sum + session.exercises.length,0)} exercice${sessions.reduce((sum,session) => sum + session.exercises.length,0) > 1 ? 's' : ''}.</p>`}<h2>Contenu qui sera partagé</h2><ol class="t4-program">${summary}</ol><section class="t4-privacy"><h2>Ce qui reste privé</h2><ul><li>Résultats et performances réelles</li><li>Notes personnelles et données de suivi</li><li>Identifiants de compte</li></ul></section><label class="t4-check"><input id="t4-checked" type="checkbox" ${warning ? 'disabled' : ''}>J’ai vérifié que le programme est clair pour les autres.</label><button class="primary-action landing-section" data-a="to-form" ${warning ? 'disabled' : ''}>Continuer vers la présentation</button>`;
  },
  renderForm() {
    const d = this.draft || {};
    return `<button class="text-action" data-a="verify">← Vérifier le programme</button><h1 tabindex="-1">Présenter le programme</h1><p class="landing-lead">Ces informations accompagnent le programme dans ${d.visibility === 'contacts' ? 'tes contacts' : 'la communauté'}.</p><form id="t4-form" class="create-form" novalidate><label for="t4-title">Titre<input id="t4-title" name="title" maxlength="100" required value="${this.esc(d.title || this.source.name)}"></label><label for="t4-level">Niveau<select id="t4-level" name="level" required><option value="">Choisir un niveau</option>${['Débutant','Intermédiaire','Avancé'].map(level => `<option ${d.level === level ? 'selected' : ''}>${level}</option>`).join('')}</select></label><label for="t4-zone">Zone ciblée<select id="t4-zone" name="zone"><option value="">Non précisée</option>${['Corps entier','Haut du corps','Jambes','Pectoraux','Dos','Épaules','Bras','Abdominaux'].map(zone => `<option ${d.zone === zone ? 'selected' : ''}>${zone}</option>`).join('')}</select></label><label for="t4-description">Description <span>(objectif et public visé)</span><textarea id="t4-description" name="description" maxlength="500" required>${this.esc(d.description || '')}</textarea></label><fieldset class="t4-fieldset"><legend>Audience</legend><label><input type="radio" name="visibility" value="public" ${d.visibility === 'contacts' ? '' : 'checked'}> Communauté</label><label><input type="radio" name="visibility" value="contacts" ${d.visibility === 'contacts' ? 'checked' : ''}> Mes contacts</label></fieldset><label class="t4-check"><input type="checkbox" name="feedback" ${d.feedback ? 'checked' : ''}>Demander des conseils sur ce programme</label><label class="t4-check"><input type="checkbox" name="commentsAllowed" ${d.commentsEnabled !== false ? 'checked' : ''}>Autoriser les commentaires</label><p id="t4-form-error" class="t4-error" role="alert"></p><button class="primary-action landing-section" type="submit">Voir l’aperçu</button></form>`;
  },
  renderPreview() {
    const d = this.draft;
    const sessions = this.cleanProgram(this.source);
    return `<button class="text-action" data-a="form">← Modifier la présentation</button><h1 tabindex="-1">${this.editing ? 'Vérifier les modifications' : 'Aperçu avant publication'}</h1><p class="landing-lead">Voici ce que ${d.visibility === 'public' ? 'la communauté' : 'tes contacts'} verra.</p><article class="t4-preview"><p class="landing-tag">${this.esc(d.level)}${d.zone ? ` · ${this.esc(d.zone)}` : ''}</p><h2>${this.esc(d.title)}</h2><p>${this.esc(d.description)}</p>${d.feedback ? '<p><strong>Demande de conseils</strong></p>' : ''}<p>${d.commentsEnabled ? 'Commentaires autorisés' : 'Commentaires fermés'}</p><h3>${this.esc(this.source.name)}</h3><ol class="t4-program">${sessions.map(session => `<li><strong>${this.esc(session.name)}</strong><ul>${session.exercises.map(exercise => `<li>${this.esc(exercise.name)}${exercise.sets ? ` · ${exercise.sets} séries` : ''}${exercise.minReps ? ` · ${exercise.minReps}${exercise.maxReps && exercise.maxReps !== exercise.minReps ? `–${exercise.maxReps}` : ''} répétitions` : ''}</li>`).join('')}</ul></li>`).join('')}</ol><p class="t4-privacy-note">Les résultats réels et les notes personnelles ne sont pas inclus.</p></article><label class="t4-check"><input id="t4-confirm" type="checkbox">${this.editing ? 'Je confirme la mise à jour de cette publication.' : `Je confirme la publication vers ${d.visibility === 'public' ? 'la communauté' : 'mes contacts'}.`}</label><button class="primary-action landing-section" data-a="publish">${this.editing ? 'Confirmer les modifications' : 'Confirmer la publication'}</button>`;
  },
  renderDetail() {
    const item = this.data.items.find(entry => entry.id === this.activeId);
    if (!item) return '<h1 tabindex="-1">Publication introuvable</h1><button data-a="list" class="landing-button">Retour</button>';
    const program = (item.program || []).map(session => `<li><strong>${this.esc(session.name)}</strong><ul>${session.exercises.map(exercise => `<li>${this.esc(exercise.name)}${exercise.sets ? ` · ${exercise.sets} séries` : ''}${exercise.minReps ? ` · ${exercise.minReps}${exercise.maxReps && exercise.maxReps !== exercise.minReps ? `–${exercise.maxReps}` : ''} répétitions` : ''}</li>`).join('')}</ul></li>`).join('');
    const comments = item.comments.map((comment,index) => `<article class="t4-comment"><p><strong>${this.esc(comment.author)}</strong></p><p>${this.esc(comment.text)}</p>${comment.reply ? `<p class="t4-reply"><strong>Ta réponse :</strong> ${this.esc(comment.reply)}</p>` : `<form data-reply="${index}" class="t4-reply-form"><label>Répondre<input name="reply" maxlength="300" required></label><button class="landing-button" type="submit">Envoyer la réponse</button></form>`}</article>`).join('');
    const sourceExists = this.sourceItems().some(source => source.id === item.sourceId);
    return `<button class="text-action" data-a="list">← Mes partages</button><h1 tabindex="-1">Gérer la publication</h1><article class="t4-card"><h2>${this.esc(item.title)}</h2><p>${this.esc(item.visibility === 'public' ? 'Communauté' : 'Mes contacts')} · ${item.status === 'published' ? 'Publication active' : 'Publication retirée'}</p><p>${this.esc(item.description)}</p><p>Commentaires ${item.commentsEnabled ? 'autorisés' : 'fermés'} · ${item.feedback ? 'Conseils demandés' : 'Pas de demande de conseils'}</p><h3>${this.esc(item.sourceName)}</h3><ol class="t4-program">${program}</ol><p class="t4-privacy-note">Aucun résultat réel ni note personnelle n’est inclus.</p></article><section class="landing-section"><h2>Retours</h2>${comments || '<p class="empty-content">Aucun commentaire reçu. Les retours apparaîtront ici.</p>'}${item.commentsEnabled && item.status === 'published' ? '<button class="landing-button landing-section" data-a="demo-comment">Simuler un commentaire reçu</button>' : ''}</section><div class="t4-actions"><button class="landing-button" data-a="edit">Modifier la présentation</button>${item.status === 'published' && sourceExists ? '<button class="landing-button" data-a="refresh-program">Actualiser depuis Mes entraînements</button>' : ''}${item.status === 'published' ? '<button class="landing-button" data-a="withdraw">Retirer la publication</button>' : '<button class="landing-button" data-a="republish">Republier</button>'}</div>`;
  },
  bind() {
    const page = document.querySelector('#landing-page');
    page.onclick = event => {
      const button = event.target.closest('[data-a]');
      if (!button) return;
      const action = button.dataset.a;
      if (action === 'start') this.go('select');
      else if (action === 'list') this.go('list');
      else if (action === 'select') this.go('select');
      else if (action === 'mine') window.Parcours.route('mine');
      else if (action === 'choose') { this.source = this.sourceItems().find(item => item.id === button.dataset.id); if (this.source) { this.draft = null; this.go('verify'); } }
      else if (action === 'verify') this.go('verify');
      else if (action === 'to-form') { if (!document.querySelector('#t4-checked').checked) { window.Parcours.notify('Confirme d’abord la vérification du contenu.'); return; } this.draft = {title:this.source.name,visibility:'public',comments:true,feedback:false}; this.go('form'); }
      else if (action === 'form') this.go('form');
      else if (action === 'publish') this.publish();
      else if (action === 'open') { this.activeId = button.dataset.id; this.go('detail'); }
      else if (action === 'edit') { const item = this.active(); this.source = this.sourceItems().find(source => source.id === item?.sourceId) || (item ? {id:item.sourceId,name:item.sourceName,organization:'Archive',days:(item.program || []).map(session => ({type:'session',name:session.name,exercises:session.exercises}))} : null); if (item && this.source) { this.draft = {...item}; this.editing = true; this.go('form'); } }
      else if (action === 'refresh-program') { const item = this.active(); const source = this.sourceItems().find(entry => entry.id === item?.sourceId); if (item && source && window.confirm('Remplacer le programme visible par sa version actuelle dans Mes entraînements ?')) { const warning = this.readiness(source); if (warning) { window.Parcours.notify(warning); return; } item.sourceName = source.name; item.program = this.cleanProgram(source); this.persist(); this.go('detail'); window.Parcours.notify('Programme partagé actualisé'); } }
      else if (action === 'withdraw') { const item = this.active(); if (item && window.confirm('Retirer cette publication ?')) { item.status = 'withdrawn'; this.persist(); this.go('detail'); } }
      else if (action === 'republish') { const item = this.active(); if (item && window.confirm('Confirmer la republication ?')) { item.status = 'published'; this.persist(); this.go('detail'); } }
      else if (action === 'demo-comment') { const item = this.active(); if (item) { item.comments.push({author:'Camille · compte fictif',text:'La structure est claire. Comment as-tu choisi cette répartition ?'}); this.persist(); this.go('detail'); } }
    };
    const form = document.querySelector('#t4-form');
    if (form) {
      form.onsubmit = event => { event.preventDefault(); const fields = Object.fromEntries(new FormData(form)); delete fields.commentsAllowed; const error = document.querySelector('#t4-form-error'); if (!fields.title.trim() || !fields.level || !fields.description.trim()) { error.textContent = 'Renseigne le titre, le niveau et la description.'; return; } this.draft = {...this.draft,...fields,feedback:form.elements.feedback.checked,commentsEnabled:form.elements.commentsAllowed.checked}; this.go('preview'); };
    }
    page.querySelectorAll('[data-reply]').forEach(form => form.onsubmit = event => { event.preventDefault(); const item = this.active(); const comment = item?.comments[Number(form.dataset.reply)]; const reply = new FormData(form).get('reply').trim(); if (comment && reply) { comment.reply = reply; this.persist(); this.go('detail'); } });
  },
  active() { return this.data.items.find(item => item.id === this.activeId); },
  publish() {
    if (!document.querySelector('#t4-confirm')?.checked) { window.Parcours.notify('Coche la confirmation avant de publier.'); return; }
    if (this.editing) { this.saveEdit(); window.Parcours.notify('Modifications confirmées'); return; }
    this.data.items.unshift({id:crypto.randomUUID(),sourceId:this.source.id,sourceName:this.source.name,program:this.cleanProgram(this.source),...this.draft,status:'published',comments:[],createdAt:new Date().toISOString()});
    this.persist(); this.editing = false; this.activeId = this.data.items[0].id; this.go('detail'); window.Parcours.notify('Publication confirmée dans cette démonstration.');
  },
  saveEdit() {
    const item = this.active();
    if (!item) return;
    Object.assign(item,this.draft); this.persist(); this.editing = false; this.go('detail');
  },
  go(stage) { this.stage = stage; window.Parcours.route('sharing'); },
};
window.Partages.restore();
