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
      const value = window.Parcours.profiles[window.Parcours.state.identity]?.sharing || JSON.parse(localStorage.getItem(this.key) || 'null');
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
    catch { window.Parcours.storageFailed = true; window.Parcours.storageStatus('Sauvegarde des partages indisponible · garde cette page ouverte.'); return false; }
    return window.Parcours.persist();
  },
  esc(value) { return window.Parcours.escape(value); },
  sourceItems() { return window.Parcours.state.saved || []; },
  cleanProgram(source) {
    const plan = source.sharedPlan || window.Programmes.snapshot(source);
    return window.Programmes.sessions(plan).map(session => ({name:session.name,exercises:session.exercises}));
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
    if (this.stage === 'list') return `${window.Parcours.storageFailed ? '<p class="draft-status">Sauvegarde indisponible · changements conservés pour cette visite</p>' : ''}${this.renderList()}`;
    if (this.stage === 'select') return this.renderSelect();
    if (this.stage === 'verify') return this.renderForm();
    if (this.stage === 'form') return this.renderForm();
    if (this.stage === 'preview') return this.renderPreview();
    if (this.stage === 'detail') return this.renderDetail();
    return `<h1 tabindex="-1">Partages</h1><button class="text-action" data-a="list">Retour aux partages</button>`;
  },
  renderList() {
    const items = this.data.items.map(item => `<article class="t4-card"><h2>${this.esc(item.title)}</h2><p>${this.esc(item.visibility === 'public' ? 'Communauté' : 'Mes contacts')} · ${this.esc(item.level)} · ${this.esc(item.status === 'published' ? 'Publié' : 'Retiré')}</p><button class="landing-button full" data-a="open" data-id="${item.id}">Gérer cette publication</button></article>`).join('');
    const drafts = Object.entries(window.Parcours.state.sharingDrafts || {}).map(([key,draft]) => `<button class="picker-result" data-a="resume-share" data-id="${key}"><span><strong>${this.esc(draft.fields.title || 'Partage en préparation')}</strong><small>Brouillon conservé · ${draft.editing ? 'Modification' : 'Nouveau partage'}</small></span><span>Reprendre</span></button>`).join('');
    return `${window.Parcours.greeting()}<h1 tabindex="-1">Partages</h1><p class="landing-lead">Choisis un entraînement déjà préparé, vérifie ce qui sera visible, puis confirme avant publication.</p><button class="primary-action" data-a="start">Partager un programme</button>${drafts ? `<section class="landing-section"><h2>Brouillons</h2>${drafts}</section>` : ''}${items ? `<section class="landing-section"><h2>Mes publications</h2><div class="landing-stack">${items}</div></section>` : '<div class="empty-content"><h2>Aucune publication</h2><p>Tes programmes restent privés tant que tu ne confirmes pas leur partage.</p></div>'}`;
  },
  renderSelect() {
    const sources = this.sourceItems();
    return `<button class="text-action" data-a="list">← Partages</button><h1 tabindex="-1">Choisir un programme</h1><p class="landing-lead">Sélectionne une séance, une semaine ou un cycle que tu as préparé dans Mes entraînements.</p>${sources.length ? `<div class="landing-stack">${sources.map(source => `<article class="t4-card"><h2>${this.esc(source.name)}</h2><p>${this.esc(source.organization || 'Séance seule')} · ${source.kind === 'base' ? 'Programme personnel' : 'Copie personnelle'}</p><button class="landing-button full" data-a="choose" data-id="${source.id}">Choisir ce programme</button></article>`).join('')}</div>` : '<div class="empty-content"><h2>Rien à partager pour le moment</h2><p>Crée d’abord une séance ou un bloc dans Mes entraînements.</p><button class="landing-button" data-a="mine">Mes entraînements</button></div>'}`;
  },
  renderForm() {
    const d = this.draft || {}, warning = this.readiness(this.source);
    const content = this.cleanProgram(this.source).map(session => `<li><strong>${this.esc(session.name)}</strong><ul>${session.exercises.map(exercise => `<li>${this.esc(exercise.name)}</li>`).join('')}</ul></li>`).join('');
    return `<button class="text-action" data-a="select">← Choisir le programme</button><h1 tabindex="-1">${this.editing ? 'Modifier la publication' : 'Nouveau partage'}</h1><p class="draft-status" role="status" id="sharing-draft-status">Brouillon · rien n’est publié avant confirmation</p><section class="sharing-content"><h2>${this.esc(this.source.name)}</h2><ol>${content}</ol><p>Résultats réels, notes personnelles et identifiants restent privés.</p>${warning ? `<p class="error" role="alert">${this.esc(warning)}</p>` : ''}</section><p class="landing-lead">Ces informations accompagnent le programme dans ${d.visibility === 'contacts' ? 'tes contacts' : 'la communauté'}.</p><form id="t4-form" class="create-form" novalidate><label for="t4-title">Titre<input id="t4-title" name="title" maxlength="100" required value="${this.esc(d.title || this.source.name)}"></label><label for="t4-level">Niveau<select id="t4-level" name="level" required><option value="">Choisir un niveau</option>${['Débutant','Intermédiaire','Avancé'].map(level => `<option ${d.level === level ? 'selected' : ''}>${level}</option>`).join('')}</select></label><label for="t4-zone">Zone ciblée<select id="t4-zone" name="zone"><option value="">Non précisée</option>${['Corps entier','Haut du corps','Jambes','Pectoraux','Dos','Épaules','Bras','Abdominaux'].map(zone => `<option ${d.zone === zone ? 'selected' : ''}>${zone}</option>`).join('')}</select></label><label for="t4-description">Description <span>(objectif et public visé)</span><textarea id="t4-description" name="description" maxlength="500" required>${this.esc(d.description || '')}</textarea></label><fieldset class="t4-fieldset"><legend>Audience</legend><label><input type="radio" name="visibility" value="public" ${d.visibility === 'contacts' ? '' : 'checked'}> Communauté</label><label><input type="radio" name="visibility" value="contacts" ${d.visibility === 'contacts' ? 'checked' : ''}> Mes contacts</label></fieldset><label class="t4-check"><input type="checkbox" name="feedback" ${d.feedback ? 'checked' : ''}>Demander des conseils sur ce programme</label><label class="t4-check"><input type="checkbox" name="commentsAllowed" ${d.commentsEnabled !== false ? 'checked' : ''}>Autoriser les commentaires</label><p id="t4-form-error" class="t4-error" role="alert"></p><button class="primary-action landing-section" type="submit" ${warning ? 'disabled' : ''}>Vérifier avant publication</button><button type="button" class="text-action" id="discard-share-draft">Abandonner ce brouillon</button></form>`;
  },
  renderPreview() {
    const d = this.draft;
    const sessions = this.cleanProgram(this.source);
    return `<button class="text-action" data-a="form">← Modifier la présentation</button><h1 tabindex="-1">${this.editing ? 'Vérifier les modifications' : 'Aperçu avant publication'}</h1><p class="landing-lead">Voici ce que ${d.visibility === 'public' ? 'la communauté' : 'tes contacts'} verra.</p><article class="t4-preview"><p class="landing-tag">${this.esc(d.level)}${d.zone ? ` · ${this.esc(d.zone)}` : ''}</p><h2>${this.esc(d.title)}</h2><p>${this.esc(d.description)}</p>${d.feedback ? '<p><strong>Demande de conseils</strong></p>' : ''}<p>${d.commentsEnabled ? 'Commentaires autorisés' : 'Commentaires fermés'}</p><h3>${this.esc(this.source.name)}</h3>${window.Programmes.scheduleSummary(this.source.sharedPlan || window.Programmes.snapshot(this.source))}<ol class="t4-program">${sessions.map(session => `<li><strong>${this.esc(session.name)}</strong><ul>${session.exercises.map(exercise => `<li>${this.esc(exercise.name)}${exercise.sets ? ` · ${exercise.sets} séries` : ''}${exercise.minReps ? ` · ${exercise.minReps}${exercise.maxReps && exercise.maxReps !== exercise.minReps ? `–${exercise.maxReps}` : ''} répétitions` : ''}${exercise.load != null ? ` · ${exercise.load} kg` : ''}${exercise.rpe != null ? ` · RPE ${exercise.rpe}` : ''}${exercise.instruction ? ` · ${this.esc(exercise.instruction)}` : ''}</li>`).join('')}</ul></li>`).join('')}</ol><p class="t4-privacy-note">Les résultats réels et les notes personnelles ne sont pas inclus.</p></article><label class="t4-check"><input id="t4-confirm" type="checkbox">${this.editing ? 'Je confirme la mise à jour de cette publication.' : `Je confirme la publication vers ${d.visibility === 'public' ? 'la communauté' : 'mes contacts'}.`}</label><button class="primary-action landing-section" data-a="publish">${this.editing ? 'Confirmer les modifications' : 'Confirmer la publication'}</button>`;
  },
  renderDetail() {
    const item = this.data.items.find(entry => entry.id === this.activeId);
    if (!item) return '<h1 tabindex="-1">Publication introuvable</h1><button data-a="list" class="landing-button">Retour</button>';
    const program = (item.program || []).map(session => `<li><strong>${this.esc(session.name)}</strong><ul>${session.exercises.map(exercise => `<li>${this.esc(exercise.name)}${exercise.sets ? ` · ${exercise.sets} séries` : ''}${exercise.minReps ? ` · ${exercise.minReps}${exercise.maxReps && exercise.maxReps !== exercise.minReps ? `–${exercise.maxReps}` : ''} répétitions` : ''}${exercise.load != null ? ` · ${exercise.load} kg` : ''}${exercise.rpe != null ? ` · RPE ${exercise.rpe}` : ''}${exercise.instruction ? ` · ${this.esc(exercise.instruction)}` : ''}</li>`).join('')}</ul></li>`).join('');
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
      if (action === 'start') { this.editing = false; this.source = null; this.draft = null; this.activeId = null; this.go('select'); }
      else if (action === 'list') this.go('list');
      else if (action === 'select') this.go('select');
      else if (action === 'mine') window.Parcours.route('mine');
      else if (action === 'choose') { this.source = this.sourceItems().find(item => item.id === button.dataset.id); if (this.source) { this.editing = false; this.activeId = null; const stored = window.Parcours.state.sharingDrafts?.[`new:${this.source.id}`]; this.draft = stored?.fields || {title:this.source.name,level:this.source.level || window.Parcours.state.profile.level || '',zone:this.source.group || '',description:this.source.description || '',visibility:'public',commentsEnabled:true,feedback:false}; this.go('form'); } }
      else if (action === 'verify') this.go('form');
      else if (action === 'form') this.go('form');
      else if (action === 'publish') this.publish();
      else if (action === 'open') { this.activeId = button.dataset.id; this.go('detail'); }
      else if (action === 'edit') { const item = this.active(); if (item) { this.source = this.publicationSource(item); this.editing = true; this.draft = window.Parcours.state.sharingDrafts?.[`edit:${item.id}`]?.fields || this.presentation(item); this.go('form'); } }
      else if (action === 'resume-share') {
        const stored = window.Parcours.state.sharingDrafts[button.dataset.id];
        if (stored) { this.editing = stored.editing; this.activeId = stored.activeId; this.source = stored.editing ? this.publicationSource(this.active()) : this.sourceItems().find(item => item.id === stored.sourceId); this.draft = stored.fields; if (this.source) this.go('form'); }
      }
      else if (action === 'refresh-program') { const item = this.active(), source = this.sourceItems().find(entry => entry.id === item?.sourceId); if (item && source) window.Ergonomie.confirm('Actualiser le contenu partagé ?', 'Le contenu publié sera remplacé par la version enregistrée dans Mes entraînements.',() => { const warning = this.readiness(source); if (warning) { window.Parcours.notify(warning); return; } item.sourceName = source.name; item.program = this.cleanProgram(source); item.plan = window.Programmes.snapshot(source); this.persist(); this.go('detail'); },'Actualiser la publication'); }
      else if (action === 'withdraw') { const item = this.active(); if (item) window.Ergonomie.confirm('Retirer la publication ?',item.title,() => { item.status = 'withdrawn'; this.persist(); this.go('detail'); },'Retirer'); }
      else if (action === 'republish') { const item = this.active(); if (item) window.Ergonomie.confirm('Republier ?',`Audience : ${item.visibility === 'public' ? 'Communauté' : 'Mes contacts'}`,() => { item.status = 'published'; this.persist(); this.go('detail'); },'Confirmer la republication'); }
      else if (action === 'demo-comment') { const item = this.active(); if (item) { item.comments.push({author:'Camille · compte fictif',text:'La structure est claire. Comment as-tu choisi cette répartition ?'}); this.persist(); this.go('detail'); } }
    };
    const form = document.querySelector('#t4-form');
    if (form) {
      const remember = () => {
        this.draft = this.presentation({...Object.fromEntries(new FormData(form)),feedback:form.elements.feedback.checked,commentsEnabled:form.elements.commentsAllowed.checked});
        window.Parcours.state.sharingDrafts ||= {};
        window.Parcours.state.sharingDrafts[this.draftKey()] = {sourceId:this.source.id,editing:this.editing,activeId:this.activeId,fields:{...this.draft}};
        const saved = window.Parcours.persist(); document.querySelector('#sharing-draft-status').textContent = saved ? 'Brouillon conservé · rien n’est publié' : 'Sauvegarde indisponible';
      };
      form.oninput = remember; form.onchange = remember;
      form.querySelectorAll('[required]').forEach(input => { input.onblur = () => { input.setAttribute('aria-invalid',String(!input.validity.valid || !input.value.trim())); if (!input.validity.valid || !input.value.trim()) document.querySelector('#t4-form-error').textContent = 'Renseigne les champs indiqués avant l’aperçu.'; }; });
      document.querySelector('#discard-share-draft').onclick = () => window.Ergonomie.confirm('Abandonner ce brouillon ?', 'La publication existante reste conservée.',() => { delete window.Parcours.state.sharingDrafts[this.draftKey()]; this.draft = null; this.editing = false; this.go('list'); },'Abandonner');
      form.onsubmit = event => {
        event.preventDefault(); remember();
        const first = [...form.querySelectorAll('[required]')].find(input => !input.validity.valid || !input.value.trim());
        if (first) { first.setAttribute('aria-invalid','true'); first.focus(); document.querySelector('#t4-form-error').textContent = 'Renseigne le titre, le niveau et la description.'; return; }
        this.go('preview');
      };
    }
    page.querySelectorAll('[data-reply]').forEach(form => form.onsubmit = event => { event.preventDefault(); const item = this.active(); const comment = item?.comments[Number(form.dataset.reply)]; const reply = new FormData(form).get('reply').trim(); if (comment && reply) { comment.reply = reply; this.persist(); this.go('detail'); } });
  },
  draftKey() { return this.editing ? `edit:${this.activeId}` : `new:${this.source.id}`; },
  presentation(fields) { return {title:fields.title || '',level:fields.level || '',zone:fields.zone || '',description:fields.description || '',visibility:fields.visibility || 'public',feedback:!!fields.feedback,commentsEnabled:fields.commentsEnabled !== false}; },
  publicationSource(item) { return item ? {id:item.sourceId,name:item.sourceName,sharedPlan:item.plan,organization:'Archive',days:(item.program || []).map(session => ({type:'session',name:session.name,exercises:session.exercises}))} : null; },
  active() { return this.data.items.find(item => item.id === this.activeId); },
  publish() {
    const p = window.Parcours;
    if (!document.querySelector('#t4-confirm')?.checked) { p.notify('Coche la confirmation avant de publier.'); return; }
    if (this.editing) { this.saveEdit(); return; }
    const draftKey = this.draftKey(), stored = p.state.sharingDrafts?.[draftKey];
    const record = {id:crypto.randomUUID(),sourceId:this.source.id,sourceName:this.source.name,program:this.cleanProgram(this.source),plan:window.Programmes.snapshot(this.source),...this.draft,status:'published',comments:[],createdAt:new Date().toISOString()};
    this.data.items.unshift(record); delete p.state.sharingDrafts?.[draftKey];
    if (!this.persist()) {
      this.data.items = this.data.items.filter(item => item !== record);
      p.state.sharingDrafts ||= {}; p.state.sharingDrafts[draftKey] = stored || {sourceId:this.source.id,editing:false,activeId:null,fields:{...this.draft}};
      this.persist();
      p.notify('Publication non confirmée · brouillon conservé. Réessaie après avoir rétabli la sauvegarde.'); return;
    }
    this.editing = false; this.activeId = record.id; this.go('detail'); p.notify('Publication confirmée dans cette démonstration.');
  },
  saveEdit() {
    const p = window.Parcours, item = this.active();
    if (!item) return;
    const before = structuredClone(item), draftKey = this.draftKey(), stored = p.state.sharingDrafts?.[draftKey];
    Object.assign(item,this.presentation(this.draft)); delete p.state.sharingDrafts?.[draftKey];
    if (!this.persist()) {
      Object.assign(item,before); p.state.sharingDrafts ||= {}; p.state.sharingDrafts[draftKey] = stored || {sourceId:this.source.id,editing:true,activeId:this.activeId,fields:{...this.draft}};
      this.persist(); p.notify('Modification non confirmée · brouillon conservé. Réessaie après avoir rétabli la sauvegarde.'); return;
    }
    this.editing = false; this.go('detail'); p.notify('Modifications confirmées');
  },
  go(stage) { this.stage = stage; window.Parcours.route('sharing'); },
};
window.Partages.restore();
