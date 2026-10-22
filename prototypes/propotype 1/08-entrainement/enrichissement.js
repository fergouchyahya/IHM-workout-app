'use strict';

window.EnrichissementSeance = {
  urls:new Set(), generation:0, uploads:new Map(), tasks:new Set(),
  initialize(draft) {
    draft.enrichment ||= {};
    draft.enrichment.context ||= {sleepHours:null,fatigue:'',pain:'',adaptationReason:''};
    if (!Object.hasOwn(draft.enrichment.context,'note')) draft.enrichment.context.note = [...new Set([draft.dayState?.note,draft.enrichment.context.adaptationReason].filter(Boolean))].join('\n');
    draft.enrichment.exercises ||= {}; draft.enrichment.rawFields ||= {}; draft.enrichment.errors ||= {};
  },
  exercise(draft,index) {
    const key = draft.session.exercises[index].slotId || `exercise-${index}`;
    const value = draft.enrichment.exercises[key] ||= {note:'',setting:'',reminder:'',media:[],open:null};
    value.media ||= []; return value;
  },
  writeContext(draft,key,value) {
    const valid = key === 'sleepHours' ? value === null || Number.isFinite(value) && value >= 0 && value <= 24 && Number.isInteger(value*2)
      : key === 'fatigue' ? ['','Faible','Moyenne','Forte'].includes(value)
      : key === 'pain' ? ['','Aucune','Légère','Modérée','Importante'].includes(value)
      : key === 'note' ? typeof value === 'string' && value.length <= 1000
      : key === 'adaptationReason' ? typeof value === 'string' && value.length <= 500 : false;
    if (!valid) return false;
    draft.enrichment.context[key] = value; return true;
  },
  writeExercise(draft,index,key,value) {
    if (!['note','setting','reminder'].includes(key) || typeof value !== 'string' || value.length > 500) return false;
    this.exercise(draft,index)[key] = value; return true;
  },
  hasErrors(draft) { return Object.keys(draft.enrichment?.errors || {}).length > 0; },
  contextMarkup(draft) {
    const p = window.Parcours, context = draft.enrichment.context, tracking = draft.session.tracking || {};
    const fields = [
      ['sleep', `<label>Sommeil, en heures (facultatif)<input type="text" data-numeric="true" data-context="sleepHours" min="0" max="24" step="0.5" value="${p.escape(draft.enrichment.rawFields.sleepHours ?? context.sleepHours ?? '')}" aria-invalid="${!!draft.enrichment.errors.sleepHours}" aria-describedby="context-sleep-error"></label><p class="error" id="context-sleep-error" role="alert">${p.escape(draft.enrichment.errors.sleepHours || '')}</p>`],
      ['energy', p.select('Préciser la fatigue initiale (facultatif)','fatigue',[['','Non renseignée'],...['Faible','Moyenne','Forte'].map(value => [value,value])],context.fatigue,'data-context="fatigue"')],
      ['pain', p.select('Préciser la douleur ou gêne initiale (facultatif)','pain',[['','Non renseignée'],...['Aucune','Légère','Modérée','Importante'].map(value => [value,value])],context.pain,'data-context="pain"')]
    ];
    return `<div class="training-context-fields"><label>Contexte de cette séance (facultatif)<textarea data-context="note" maxlength="1000" rows="2" placeholder="Ex. Nuit courte ou matériel différent — à noter une seule fois">${p.escape(context.note)}</textarea></label><details class="context-secondary" ${p.isBeginner() && !this.hasErrors(draft) ? 'hidden' : ''} ${this.hasErrors(draft) || fields.some(([key]) => tracking[key]) ? 'open' : ''}><summary>Précisions sur l’état initial (facultatives)</summary>${fields.map(([,markup]) => markup).join('')}</details></div>`;
  },
  openContext() {
    document.querySelector('.training-day-state').open = true;
    document.querySelector('.context-secondary').open = true;
    document.querySelector('[data-context="sleepHours"]').focus();
  },
  errorMarkup(draft) { return `<button type="button" class="text-action error" id="training-context-error" ${this.hasErrors(draft) ? '' : 'hidden'}>Le contexte comporte une saisie à corriger</button>`; },
  exerciseMarkup(draft,index) {
    const p = window.Parcours, value = this.exercise(draft,index);
    const count = [value.note,value.setting,value.reminder].filter(Boolean).length;
    return `<details id="training-enrichment" class="training-enrichment" ${(value.open ?? draft.session.tracking?.notes) ? 'open' : ''}><summary>Notes, réglage et médias <span id="enrichment-summary">${count || value.media.length ? `${count} ${count === 1 ? 'note' : 'notes'} · ${value.media.length} ${value.media.length === 1 ? 'média' : 'médias'}` : 'Facultatif'}</span></summary><p class="form-help">Liés à cet exercice et à cette séance. Les consignes prévues et le programme restent conservés.</p>${[['note','Remarque technique','Ex. Garder un mouvement plus régulier'],['setting','Réglage utilisé','Ex. Siège 3, poignée neutre'],['reminder','Rappel pour la prochaine revue','Ex. Revoir le réglage du banc']].map(([key,label,placeholder]) => `<label>${label} (facultatif)<textarea data-exercise-context="${key}" rows="2" maxlength="500" placeholder="${placeholder}">${p.escape(value[key])}</textarea></label>`).join('')}<div class="training-media-heading"><h3>Photos et vidéos</h3><label class="landing-button media-file-label">+ Ajouter une photo ou vidéo<input id="training-media-files" type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime" multiple></label></div><p class="form-help">Conservés sur cet appareil, sans publication. 20 Mo par fichier, 6 médias par exercice, 60 Mo par séance.</p><p id="training-media-status" role="status" class="${value.mediaError ? 'error' : 'form-help'}">${p.escape(value.mediaError || '')}</p><div id="training-media-jobs" aria-live="polite">${this.uploadMarkup(index,window.Entrainement.key,p.state.identity)}</div><div id="training-media-list">${this.mediaMarkup(draft,index)}</div></details>`;
  },
  mediaMarkup(draft,index) {
    const p = window.Parcours, value = this.exercise(draft,index);
    return value.media.map(media => `<article class="training-media-card" data-media-id="${media.id}"><p><strong>${p.escape(media.name)}</strong> · ${media.type.startsWith('image/') ? 'Photo' : 'Vidéo'}</p><div data-media-preview="${media.id}"><p class="form-help">Chargement du média…</p></div><label>Légende (facultative)<input data-media-caption="${media.id}" maxlength="200" value="${p.escape(media.caption || '')}"></label>${p.select('Associé à','series',[['','Cet exercice'],...draft.results[index].map((_,row) => [String(row),`Série ${row+1}`])],media.row == null ? '' : String(media.row),`data-media-row="${media.id}"`)}<button type="button" class="text-action" data-remove-media="${media.id}">Retirer ce média</button></article>`).join('') || '<p class="form-help">Aucun média associé à cet exercice.</p>';
  },
  mediaIssue(draft,index,file) {
    if (!['image/jpeg','image/png','image/webp','video/mp4','video/webm','video/quicktime'].includes(file.type)) return 'Choisis une photo JPEG, PNG ou WebP, ou une vidéo MP4, WebM ou MOV.';
    if (!file.size || file.size > 20*1024*1024) return 'Choisis un fichier non vide de 20 Mo maximum.';
    if (this.exercise(draft,index).media.length >= 6) return 'Cet exercice contient déjà 6 médias. Retire un média avant d’en ajouter un autre.';
    const total = Object.values(draft.enrichment.exercises).flatMap(value => value.media).reduce((sum,media) => sum+media.size,0);
    if (total+file.size > 60*1024*1024) return 'La séance atteint sa limite de 60 Mo de médias. Retire un média avant de réessayer.';
    return '';
  },
  mediaKey(owner,key,id) { return JSON.stringify([owner,key,id]); },
  async database() {
    if (this.db) return this.db;
    return new Promise((resolve,reject) => {
      const request = indexedDB.open('ihm-prototype-1-media',1);
      request.onupgradeneeded = () => request.result.createObjectStore('media');
      request.onerror = () => reject(request.error);
      request.onblocked = () => reject(new Error('Media storage blocked'));
      request.onsuccess = () => { this.db = request.result; this.db.onversionchange = () => { this.db.close(); this.db = null; }; resolve(this.db); };
    });
  },
  async mediaOperation(mode,key,value) {
    const writing = mode !== 'get'; if (writing) this.pendingWrites = (this.pendingWrites || 0)+1;
    try {
      const db = await this.database();
      return await new Promise((resolve,reject) => {
        const transaction = db.transaction('media',mode === 'get' ? 'readonly' : 'readwrite'), store = transaction.objectStore('media');
        const request = mode === 'get' ? store.get(key) : mode === 'put' ? store.put(value,key) : store.delete(key);
        transaction.oncomplete = () => resolve(request.result);
        transaction.onerror = transaction.onabort = () => reject(transaction.error || new Error('Media storage unavailable'));
      });
    } finally { if (writing) this.pendingWrites--; }
  },
  releaseUrls() { this.generation++; for (const url of this.urls) URL.revokeObjectURL(url); this.urls.clear(); },
  active(draft,index,key,owner) {
    const p = window.Parcours;
    if (p.state.identity !== owner) return false;
    if (p.view === 'summary') return window.BilanSeance.activeId === draft.id && p.state.completedSessions.includes(draft) && draft.executionKey === key;
    const live = p.state.trainingDrafts[key] === draft && window.Entrainement.key === key;
    return live && (p.view === 'review' || p.view === 'training' && draft.exerciseIndex === index);
  },
  async hydrate(draft,index,key,owner) {
    const generation = this.generation;
    const slot = draft.session.exercises[index].slotId || `exercise-${index}`;
    for (const media of draft.enrichment?.exercises?.[slot]?.media || []) {
      let blob;
      try { blob = await this.mediaOperation('get',this.mediaKey(owner,key,media.id)); } catch { /* Le message ci-dessous garde la saisie de la séance disponible. */ }
      if (generation !== this.generation || !this.active(draft,index,key,owner)) return;
      const target = document.querySelector(`[data-media-preview="${media.id}"]`); if (!target) continue;
      target.replaceChildren();
      if (!blob) { target.textContent = 'Média indisponible sur cet appareil. Tu peux retirer sa référence ou l’ajouter à nouveau.'; continue; }
      const url = URL.createObjectURL(blob); this.urls.add(url);
      const preview = document.createElement(media.type.startsWith('image/') ? 'img' : 'video');
      preview.src = url;
      if (media.type.startsWith('image/')) preview.alt = media.caption || media.name;
      else { preview.controls = true; preview.preload = 'metadata'; }
      const fallback = document.createElement('p'); fallback.className = 'form-help'; fallback.hidden = true;
      fallback.textContent = 'Ce navigateur ne peut pas afficher ce média. Utilise le téléchargement pour le consulter.';
      preview.onerror = () => { fallback.hidden = false; };
      const download = document.createElement('a'); download.href = url; download.download = media.name; download.className = 'text-action'; download.textContent = 'Télécharger ce média';
      target.append(preview,fallback,download);
    }
  },
  refreshMedia(draft,index,key,owner) {
    if (!this.active(draft,index,key,owner)) return;
    this.updateOperations(draft,index,key,owner);
    if (window.Parcours.view !== 'training' || draft.exerciseIndex !== index || !document.querySelector('#training-media-list')) return;
    this.releaseUrls(); document.querySelector('#training-media-list').innerHTML = this.mediaMarkup(draft,index);
    this.updateSummary(draft,index); this.bindMedia(draft,index,key,owner); this.hydrate(draft,index,key,owner);
  },
  updateSummary(draft,index) {
    const value = this.exercise(draft,index), count = [value.note,value.setting,value.reminder].filter(Boolean).length;
    document.querySelector('#enrichment-summary').textContent = `${count} ${count === 1 ? 'note' : 'notes'} · ${value.media.length} ${value.media.length === 1 ? 'média' : 'médias'}`;
    const setting = document.querySelector('#training-actual-setting');
    if (setting) { setting.hidden = !value.setting; setting.textContent = `Réglage utilisé : ${value.setting}`; }
  },
  bindMedia(draft,index,key,owner) {
    const p = window.Parcours, value = this.exercise(draft,index);
    document.querySelectorAll('[data-media-caption]').forEach(input => { input.oninput = () => {
      const media = value.media.find(item => item.id === input.dataset.mediaCaption); if (!media) return;
      media.caption = input.value; window.Entrainement.saveStatus(p.persist());
      const preview = document.querySelector(`[data-media-preview="${media.id}"] img`); if (preview) preview.alt = media.caption || media.name;
    }; });
    document.querySelectorAll('[data-media-row]').forEach(select => { select.onchange = () => {
      const media = value.media.find(item => item.id === select.dataset.mediaRow); if (!media) return;
      media.row = select.value === '' ? null : Number(select.value); window.Entrainement.saveStatus(p.persist());
    }; });
    document.querySelectorAll('[data-remove-media]').forEach(button => { button.onclick = () => this.removeMedia(draft,index,key,owner,button.dataset.removeMedia); });
    this.bindRetries(draft,index,key,owner);
  },
  busy(key,owner) { return [...this.tasks].some(task => task.key === key && task.owner === owner); },
  uploadKey(index,key,owner) { return this.mediaKey(owner,key,`upload:${index}`); },
  uploadMarkup(index,key,owner) {
    const p = window.Parcours, jobs = this.uploads.get(this.uploadKey(index,key,owner)) || [];
    return jobs.map(job => `<div class="media-upload-job"><strong>${p.escape(job.file.name)}</strong><p class="${job.status === 'error' ? 'error' : 'form-help'}">${p.escape(job.message)}</p>${job.status === 'error' ? `<button type="button" class="landing-button" data-retry-media="${job.id}" ${this.busy(key,owner) ? 'disabled' : ''}>Réessayer ce fichier</button>` : ''}</div>`).join('');
  },
  operationStatus(key,owner) {
    const errors = [...this.uploads.values()].flat().filter(job => job.key === key && job.owner === owner && job.status === 'error').length;
    const draft = window.Parcours.state.identity === owner ? window.Parcours.state.trainingDrafts[key] : null;
    const failure = Object.values(draft?.enrichment?.exercises || {}).map(value => value.mediaError).find(Boolean) || '';
    return this.busy(key,owner) ? 'Opération média en cours… Attends sa fin avant de terminer la séance.' : errors ? `${errors} fichier${errors === 1 ? '' : 's'} non ajouté${errors === 1 ? '' : 's'}. Reviens aux médias pour réessayer ou choisir un autre fichier.` : failure;
  },
  updateOperations(draft,index,key,owner) {
    if (!this.active(draft,index,key,owner)) return;
    const review = document.querySelector('#review-media-progress');
    if (review) { review.textContent = this.operationStatus(key,owner); const button = document.querySelector('#confirm-training-completion'); if (button) button.disabled = this.busy(key,owner) || window.BilanSeance.issues(draft).length > 0; }
    if (window.Parcours.view !== 'training' || draft.exerciseIndex !== index) return;
    const jobs = document.querySelector('#training-media-jobs'); if (jobs) jobs.innerHTML = this.uploadMarkup(index,key,owner);
    const status = document.querySelector('#training-media-status'); if (status) { status.textContent = this.exercise(draft,index).mediaError || ''; status.className = status.textContent ? 'error' : 'form-help'; }
    const input = document.querySelector('#training-media-files'); if (input) input.disabled = this.busy(key,owner);
    document.querySelectorAll('[data-remove-media]').forEach(button => { button.disabled = this.busy(key,owner); });
    this.bindRetries(draft,index,key,owner);
  },
  bindRetries(draft,index,key,owner) {
    document.querySelectorAll('[data-retry-media]').forEach(button => { button.onclick = () => { const job = (this.uploads.get(this.uploadKey(index,key,owner)) || []).find(item => item.id === button.dataset.retryMedia); if (job) this.uploadFiles(draft,index,key,owner,[],job); }; });
  },
  async uploadFiles(draft,index,key,owner,files,retry = null) {
    const p = window.Parcours; if (p.state.identity !== owner || p.state.trainingDrafts[key] !== draft || this.busy(key,owner)) return false;
    const queueKey = this.uploadKey(index,key,owner), jobs = retry ? [retry] : files.map(file => ({id:crypto.randomUUID(),owner,key,file,status:'queued',message:'En attente'}));
    if (!retry) this.uploads.set(queueKey,[...(this.uploads.get(queueKey) || []),...jobs]);
    const task = {owner,key}; this.tasks.add(task); this.updateOperations(draft,index,key,owner);
    try {
      for (const job of jobs) {
        job.status = 'working'; job.message = `Ajout du fichier ${jobs.indexOf(job)+1} sur ${jobs.length}…`; this.updateOperations(draft,index,key,owner);
        try {
          if (p.state.identity !== owner || p.state.trainingDrafts[key] !== draft) return false;
          const value = this.exercise(draft,index), existing = value.media.find(media => media.id === job.id);
          if (!existing) {
            const issue = this.mediaIssue(draft,index,job.file); if (issue) throw new Error(issue);
            try { await this.mediaOperation('put',this.mediaKey(owner,key,job.id),job.file); } catch { throw new Error('Ce fichier n’a pas pu être conservé sur cet appareil. Réessaie.'); }
            if (p.state.identity !== owner || p.state.trainingDrafts[key] !== draft) { await this.mediaOperation('delete',this.mediaKey(owner,key,job.id)); return false; }
            const afterIssue = this.mediaIssue(draft,index,job.file); if (afterIssue) { await this.mediaOperation('delete',this.mediaKey(owner,key,job.id)); throw new Error(afterIssue); }
            value.media.push({id:job.id,name:job.file.name,type:job.file.type,size:job.file.size,caption:'',row:null,createdAt:new Date().toISOString()});
          }
          if (!p.persist()) throw new Error('Fichier local conservé, référence non enregistrée. Réessaie la sauvegarde en gardant cette page ouverte.');
          job.status = 'saved'; job.message = 'Conservé sur cet appareil';
        } catch (error) { job.status = 'error'; job.message = error.message || 'Ajout impossible. Réessaie ce fichier.'; }
        const value = this.exercise(draft,index);
        value.mediaError = (this.uploads.get(queueKey) || []).some(job => job.status === 'error') ? 'Certains fichiers restent à ajouter ou à sauvegarder. Réessaie chaque fichier ; après rechargement, choisis à nouveau les fichiers en échec.' : '';
        if (p.state.identity === owner && p.state.trainingDrafts[key] === draft) p.persist();
        this.refreshMedia(draft,index,key,owner);
      }
      return jobs.every(job => job.status === 'saved');
    } finally { this.tasks.delete(task); this.updateOperations(draft,index,key,owner); }
  },
  async removeMedia(draft,index,key,owner,id) {
    const p = window.Parcours, value = this.exercise(draft,index), media = value.media.find(item => item.id === id);
    if (!media || p.state.identity !== owner || p.state.trainingDrafts[key] !== draft || this.busy(key,owner)) return false;
    const task = {owner,key}; this.tasks.add(task); this.updateOperations(draft,index,key,owner);
    let position, blob;
    try {
      blob = await this.mediaOperation('get',this.mediaKey(owner,key,id));
      if (p.state.identity !== owner || p.state.trainingDrafts[key] !== draft) return false;
      position = value.media.findIndex(item => item.id === id); if (position === -1) return false;
      value.media.splice(position,1);
      if (!p.persist()) { value.media.splice(position,0,media); throw new Error('Référence non sauvegardée'); }
      try { await this.mediaOperation('delete',this.mediaKey(owner,key,id)); }
      catch (error) {
        const stored = p.state.identity === owner ? p.state.trainingDrafts[key] : p.profiles?.[owner]?.state.trainingDrafts[key];
        if (stored) { const restored = this.exercise(stored,index); if (!restored.media.some(item => item.id === id)) restored.media.splice(Math.min(position,restored.media.length),0,media); p.persist(); }
        throw error;
      }
      value.mediaError = ''; if (p.state.identity === owner && p.state.trainingDrafts[key] === draft) p.persist();
      for (const job of this.uploads.get(this.uploadKey(index,key,owner)) || []) if (job.id === id) { job.status = 'removed'; job.message = 'Retiré de cet exercice'; }
      if (p.state.identity === owner) p.notify('Média retiré',() => this.restoreMedia(draft,index,key,owner,media,blob,position));
      return true;
    } catch {
      value.mediaError = 'Retrait impossible. Le média et sa référence restent conservés ; réessaie.'; if (p.state.identity === owner && p.state.trainingDrafts[key] === draft) p.persist();
      if (this.active(draft,index,key,owner)) { const status = document.querySelector('#training-media-status') || document.querySelector('#review-media-progress'); if (status) status.textContent = 'Retrait impossible. Le média et sa référence restent conservés ; réessaie.'; }
      return false;
    } finally { this.tasks.delete(task); this.refreshMedia(draft,index,key,owner); }
  },
  async restoreMedia(draft,index,key,owner,media,blob,position) {
    const p = window.Parcours;
    if (p.state.identity !== owner || p.state.trainingDrafts[key] !== draft || this.busy(key,owner)) return false;
    const value = this.exercise(draft,index); if (value.media.some(item => item.id === media.id)) return true;
    const task = {owner,key}; this.tasks.add(task); this.updateOperations(draft,index,key,owner);
    try {
      const issue = blob && this.mediaIssue(draft,index,blob); if (issue) throw new Error(issue);
      if (blob) { try { await this.mediaOperation('put',this.mediaKey(owner,key,media.id),blob); } catch { throw new Error('Stockage du média indisponible'); } }
      if (p.state.identity !== owner || p.state.trainingDrafts[key] !== draft) { if (blob) await this.mediaOperation('delete',this.mediaKey(owner,key,media.id)); return false; }
      value.media.splice(Math.min(position,value.media.length),0,media);
      if (!p.persist()) { value.media = value.media.filter(item => item.id !== media.id); if (blob) await this.mediaOperation('delete',this.mediaKey(owner,key,media.id)); throw new Error('Sauvegarde de la référence indisponible'); }
      for (const job of this.uploads.get(this.uploadKey(index,key,owner)) || []) if (job.id === media.id) { job.status = 'saved'; job.message = 'Conservé sur cet appareil'; }
      return true;
    } catch (error) {
      if (p.state.identity === owner) p.notify(`Rétablissement impossible : ${error.message}. Réessaie Annuler.`,() => this.restoreMedia(draft,index,key,owner,media,blob,position));
      return false;
    } finally { this.tasks.delete(task); this.refreshMedia(draft,index,key,owner); }
  },
  openField(draft,index,field) {
    const details = document.querySelector('#training-enrichment'); if (!details) return;
    details.open = true; this.exercise(draft,index).open = true;
    const input = details.querySelector(`[data-exercise-context="${field}"]`); input?.focus(); input?.scrollIntoView({block:'nearest'});
    window.Parcours.persist();
  },
  bind(draft,index,key) {
    const p = window.Parcours, owner = p.state.identity;
    document.querySelectorAll('[data-context]').forEach(input => { input.oninput = () => {
      const name = input.dataset.context;
      if (name === 'sleepHours') draft.enrichment.rawFields.sleepHours = input.value;
      const valid = name !== 'sleepHours' || window.Ergonomie.validateNumber(input);
      const applied = valid && this.writeContext(draft,name,name === 'sleepHours' ? window.Ergonomie.number(input) : input.value);
      if (!applied) draft.enrichment.errors[name] = 'Indique entre 0 et 24 heures, par demi-heure, ou laisse vide.'; else delete draft.enrichment.errors[name];
      input.setAttribute('aria-invalid',String(!applied));
      document.querySelector('#context-sleep-error').textContent = draft.enrichment.errors.sleepHours || '';
      document.querySelector('#training-context-error').hidden = !this.hasErrors(draft); window.Entrainement.saveStatus(p.persist());
    }; });
    document.querySelector('#training-context-error').onclick = () => { this.openContext(); };
    if (!draft.session.exercises[index]) return;
    const value = this.exercise(draft,index), details = document.querySelector('#training-enrichment');
    document.querySelector('#open-training-enrichment').onclick = () => this.openField(draft,index,'note');
    document.querySelector('#training-edit-setting').onclick = () => this.openField(draft,index,'setting');
    details.ontoggle = () => { value.open = details.open; p.persist(); };
    document.querySelectorAll('[data-exercise-context]').forEach(input => { input.oninput = () => {
      this.writeExercise(draft,index,input.dataset.exerciseContext,input.value); this.updateSummary(draft,index); window.Entrainement.saveStatus(p.persist());
    }; });
    document.querySelector('#training-media-files').onchange = event => { const files = [...event.target.files]; event.target.value = ''; this.uploadFiles(draft,index,key,owner,files); };
    this.updateOperations(draft,index,key,owner);
    this.bindMedia(draft,index,key,owner); this.hydrate(draft,index,key,owner);
  }
};
