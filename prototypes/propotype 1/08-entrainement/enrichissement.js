'use strict';

window.EnrichissementSeance = {
  urls:new Set(), generation:0,
  initialize(draft) {
    draft.enrichment ||= {};
    draft.enrichment.context ||= {sleepHours:null,fatigue:'',pain:'',adaptationReason:''};
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
      ['energy', p.select('Fatigue (facultatif)','fatigue',[['','Non renseignée'],...['Faible','Moyenne','Forte'].map(value => [value,value])],context.fatigue,'data-context="fatigue"')],
      ['pain', p.select('Douleur ou gêne (facultatif)','pain',[['','Non renseignée'],...['Aucune','Légère','Modérée','Importante'].map(value => [value,value])],context.pain,'data-context="pain"')]
    ];
    return `<div class="training-context-fields">${fields.filter(([key]) => tracking[key]).map(([,markup]) => markup).join('')}<details class="context-secondary" ${this.hasErrors(draft) ? 'open' : ''}><summary>Autres informations facultatives</summary>${fields.filter(([key]) => !tracking[key]).map(([,markup]) => markup).join('')}<label>Raison générale d’une adaptation (facultative)<textarea data-context="adaptationReason" maxlength="500" rows="2" placeholder="Ex. Nuit courte, fatigue ou matériel différent">${p.escape(context.adaptationReason)}</textarea></label></details></div>`;
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
    return `<details id="training-enrichment" class="training-enrichment" ${(value.open ?? draft.session.tracking?.notes) ? 'open' : ''}><summary>Notes, réglage et médias <span id="enrichment-summary">${count || value.media.length ? `${count} note(s) · ${value.media.length} média(s)` : 'Facultatif'}</span></summary><p class="form-help">Liés à cet exercice et à cette séance. Les consignes prévues et le programme restent conservés.</p>${[['note','Remarque technique','Ex. Garder un mouvement plus régulier'],['setting','Réglage utilisé','Ex. Siège 3, poignée neutre'],['reminder','Rappel pour la prochaine revue','Ex. Revoir le réglage du banc']].map(([key,label,placeholder]) => `<label>${label} (facultatif)<textarea data-exercise-context="${key}" rows="2" maxlength="500" placeholder="${placeholder}">${p.escape(value[key])}</textarea></label>`).join('')}<div class="training-media-heading"><h3>Photos et vidéos</h3><label class="landing-button media-file-label">+ Ajouter une photo ou vidéo<input id="training-media-files" type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime" multiple></label></div><p class="form-help">Conservés sur cet appareil, sans publication. 20 Mo par fichier, 6 médias par exercice, 60 Mo par séance.</p><p id="training-media-status" role="status" class="${value.mediaError ? 'error' : 'form-help'}">${p.escape(value.mediaError || '')}</p><div id="training-media-list">${this.mediaMarkup(draft,index)}</div></details>`;
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
    this.releaseUrls(); document.querySelector('#training-media-list').innerHTML = this.mediaMarkup(draft,index);
    this.updateSummary(draft,index); this.bindMedia(draft,index,key,owner); this.hydrate(draft,index,key,owner);
  },
  updateSummary(draft,index) {
    const value = this.exercise(draft,index), count = [value.note,value.setting,value.reminder].filter(Boolean).length;
    document.querySelector('#enrichment-summary').textContent = `${count} note(s) · ${value.media.length} média(s)`;
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
    document.querySelectorAll('[data-remove-media]').forEach(button => { button.onclick = async () => {
      const id = button.dataset.removeMedia, media = value.media.find(item => item.id === id);
      let position;
      if (!media || button.disabled) return;
      button.disabled = true;
      let blob;
      try { blob = await this.mediaOperation('get',this.mediaKey(owner,key,id)); }
      catch { button.disabled = false; if (this.active(draft,index,key,owner)) document.querySelector('#training-media-status').textContent = 'Le média n’a pas pu être retiré. Réessaie.'; return; }
      if (p.state.identity !== owner || p.state.trainingDrafts[key] !== draft) return;
      position = value.media.findIndex(item => item.id === id);
      if (position === -1) return;
      value.media.splice(position,1);
      const saved = p.persist();
      if (!saved) { value.media.splice(position,0,media); button.disabled = false; window.Entrainement.saveStatus(false); return; }
      try { await this.mediaOperation('delete',this.mediaKey(owner,key,id)); }
      catch { button.disabled = false; value.media.splice(position,0,media); if (p.state.identity === owner) p.persist(); if (this.active(draft,index,key,owner)) { document.querySelector('#training-media-status').textContent = 'Le média n’a pas pu être retiré. Réessaie.'; } return; }
      this.refreshMedia(draft,index,key,owner);
      if (p.state.identity !== owner) return;
      p.notify('Média retiré',async () => {
        await Promise.resolve();
        if (p.state.identity !== owner || p.state.trainingDrafts[key] !== draft) return;
        if (blob && this.mediaIssue(draft,index,blob)) { p.notify('Retire un autre média pour pouvoir rétablir celui-ci.'); return; }
        try { if (blob) await this.mediaOperation('put',this.mediaKey(owner,key,id),blob); }
        catch { p.notify('Le média n’a pas pu être rétabli. Réessaie de l’ajouter.'); return; }
        if (p.state.identity !== owner || p.state.trainingDrafts[key] !== draft) { if (blob) await this.mediaOperation('delete',this.mediaKey(owner,key,id)); return; }
        value.media.splice(Math.min(position,value.media.length),0,media); const restored = p.persist();
        this.refreshMedia(draft,index,key,owner); window.Entrainement.saveStatus(restored);
      });
    }; });
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
    document.querySelector('#open-training-enrichment').onclick = () => { details.open = true; details.scrollIntoView({block:'start'}); details.querySelector('textarea').focus({preventScroll:true}); };
    details.ontoggle = () => { value.open = details.open; p.persist(); };
    document.querySelectorAll('[data-exercise-context]').forEach(input => { input.oninput = () => {
      this.writeExercise(draft,index,input.dataset.exerciseContext,input.value); this.updateSummary(draft,index); window.Entrainement.saveStatus(p.persist());
    }; });
    document.querySelector('#training-media-files').onchange = async event => {
      const input = event.target, files = [...input.files]; input.value = '';
      input.disabled = true; const errors = []; let added = 0;
      for (const file of files) {
        let error = this.mediaIssue(draft,index,file), stored = false;
        if (!error) {
          const id = crypto.randomUUID(), storageKey = this.mediaKey(owner,key,id);
          try {
            await this.mediaOperation('put',storageKey,file);
            if (p.state.identity !== owner || p.state.trainingDrafts[key] !== draft) { await this.mediaOperation('delete',storageKey); break; }
            error = this.mediaIssue(draft,index,file);
            if (error) await this.mediaOperation('delete',storageKey);
            else { value.media.push({id,name:file.name,type:file.type,size:file.size,caption:'',row:null,createdAt:new Date().toISOString()}); added++; stored = true; }
          } catch { error = 'Le média n’a pas pu être conservé sur cet appareil. Réessaie ; les résultats de séance restent disponibles.'; }
        }
        if (error) errors.push(`${file.name} : ${error}`);
        value.mediaError = errors.join(' ');
        if (p.state.identity === owner && p.state.trainingDrafts[key] === draft) {
          const saved = p.persist(); window.Entrainement.saveStatus(saved);
          if (!saved && stored) { errors.push('Fichier conservé, mais sa référence n’a pas pu être enregistrée. Garde cette page ouverte.'); value.mediaError = errors.join(' '); }
        }
        if (this.active(draft,index,key,owner)) {
          const status = document.querySelector('#training-media-status'); status.textContent = value.mediaError || `${added} média(s) conservé(s) sur cet appareil.`; status.className = value.mediaError ? 'error' : 'form-help';
          this.refreshMedia(draft,index,key,owner);
        }
      }
      input.disabled = false;
    };
    this.bindMedia(draft,index,key,owner); this.hydrate(draft,index,key,owner);
  }
};
