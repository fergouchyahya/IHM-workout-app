'use strict';
(() => {
  const {slides} = window.presentationContent;
  const canvas = document.querySelector('#canvas');
  const mainCount = slides.filter(slide=>!slide.appendix).length;
  canvas.innerHTML = slides.map((slide,index)=>`<section class="slide ${slide.appendix?'appendix':''}" id="${slide.id}" aria-labelledby="title-${slide.id}" data-slide="${index}"><header class="slide-header"><p class="kicker">${slide.kicker}</p><h1 id="title-${slide.id}">${slide.title}</h1></header><div class="slide-body">${slide.body}</div><footer class="slide-footer"><span class="page-number">${slide.appendix?slide.id.toUpperCase():String(index+1).padStart(2,'0')} <span>/ G6</span></span></footer></section>`).join('');
  let current = 0;
  let returnFromAppendix = mainCount-1;
  const overview = document.querySelector('#overview-dialog');
  const visual = document.querySelector('#visual-dialog');
  document.querySelector('#overview-content').innerHTML = `<h3>Présentation · 15 minutes</h3><div class="overview-list">${slides.map((slide,index)=>`${index===mainCount?'</div><h3>Annexes · pour approfondir</h3><div class="overview-list">':''}<button data-go="${index}"><b>${slide.appendix?slide.id.toUpperCase():String(index+1).padStart(2,'0')}</b> ${slide.title}</button>`).join('')}</div>`;

  function resize() {
    const scale = Math.min(window.innerWidth/1440,(window.innerHeight-62)/810);
    canvas.style.transform = `translate(-50%,-50%) scale(${Math.max(.1,scale)})`;
  }
  function show(index, updateHash=true) {
    current = Math.max(0,Math.min(index,slides.length-1));
    document.querySelectorAll('.slide').forEach((el,i)=>{
      el.classList.toggle('active',i===current);
      el.inert = i!==current;
      el.setAttribute('aria-hidden',String(i!==current));
    });
    const slide = slides[current];
    document.querySelector('#counter').textContent = slide.appendix ? `${slide.id.toUpperCase()} · Annexe` : `${current+1} / ${mainCount}`;
    document.querySelector('#previous').disabled = current===0;
    document.querySelector('#next').disabled = current===(slide.appendix?slides.length-1:mainCount-1);
    document.querySelector('#appendices').textContent = slide.appendix ? 'Retour à l’oral A' : 'Annexes A';
    document.querySelector('#speaker-notes').innerHTML = `<b>${slide.appendix?'Annexe':`${slide.time} s prévus`} · ${slide.title}</b><div class="speaker-cues">${slide.notes || 'Détail à mobiliser en réponse aux questions ; ne pas lire pendant le parcours principal.'}</div>`;
    document.title = `G6 · ${slide.title}`;
    if(updateHash) history.replaceState(null,'',`#${slide.id}`);
  }
  function goToHash() {
    const index = slides.findIndex(slide=>`#${slide.id}`===location.hash);
    if(index>=0) show(index,false);
    else show(0);
  }
  function closeDialogs() { for(const dialog of [overview,visual,videoDialog]) if(dialog.open) dialog.close(); }
  function toggleAppendices() {
    if(slides[current].appendix) show(returnFromAppendix);
    else { returnFromAppendix=current; show(mainCount); }
  }
  function next() { if(current < (slides[current].appendix?slides.length-1:mainCount-1)) show(current+1); }
  function openVisual(title, content) {
    document.querySelector('#visual-title').textContent=title;
    document.querySelector('#visual-content').replaceChildren(content);
    visual.showModal();
  }
  let videoUrl;
  const video = document.querySelector('#test-video');
  const videoDialog = document.querySelector('#video-dialog');
  document.querySelector('#video-file').addEventListener('change',event=>{
    const file=event.target.files[0];
    if(!file) return;
    if(videoUrl) URL.revokeObjectURL(videoUrl);
    videoUrl=URL.createObjectURL(file);
    video.src=videoUrl;
    videoDialog.showModal();
  });
  videoDialog.addEventListener('close',()=>video.pause());
  visual.addEventListener('close',()=>document.querySelector('#visual-content').classList.remove('zoomed'));
  document.querySelector('#zoom-visual').onclick=()=>document.querySelector('#visual-content').classList.toggle('zoomed');
  document.querySelector('#previous').onclick=()=>show(current-1);
  document.querySelector('#next').onclick=next;
  document.querySelector('#overview').onclick=()=>overview.showModal();
  document.querySelector('#appendices').onclick=toggleAppendices;
  document.querySelector('#notes').onclick=()=>{document.querySelector('#speaker-notes').hidden=!document.querySelector('#speaker-notes').hidden;};
  document.querySelector('#fullscreen').onclick=async()=>{try { if(document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); } catch { /* The browser may disallow fullscreen in embedded contexts. */ }};
  document.querySelector('#print').onclick=()=>{ closeDialogs(); window.print(); };
  document.addEventListener('click',event=>{
    const close=event.target.closest('[data-close]');
    if(close) close.closest('dialog').close();
    const go=event.target.closest('[data-go]');
    if(go) { if(!slides[current].appendix && slides[Number(go.dataset.go)].appendix) returnFromAppendix=current; closeDialogs(); show(Number(go.dataset.go)); }
    const link=event.target.closest('[data-jump]');
    if(link) {
      event.preventDefault();
      if(!slides[current].appendix) returnFromAppendix=current;
      show(slides.findIndex(slide=>slide.id===link.dataset.jump));
    }
    const image=event.target.closest('[data-enlarge]');
    if(image) openVisual(image.getAttribute('aria-label').replace('Agrandir : ',''),image.querySelector('img').cloneNode(true));
    if(event.target.closest('[data-enlarge-diagram]')) openVisual('T0–T5 · Vue globale',document.querySelector('#s05 img').cloneNode(true));
    if(event.target.closest('[data-compare]')) { const content=document.querySelector('#a23 .comparison-pictures').cloneNode(true); content.querySelectorAll('button').forEach(button=>button.replaceWith(button.querySelector('img'))); openVisual('Avant / après · Prototype final',content); }
    if(event.target.closest('[data-video]')) {
      if(videoUrl) videoDialog.showModal();
      else document.querySelector('#video-file').click();
    }
  });
  document.addEventListener('keydown',event=>{
    if(event.target.matches('input,textarea,select,[contenteditable]') || event.altKey || event.ctrlKey || event.metaKey) return;
    if(overview.open || visual.open || videoDialog.open) return;
    if(['ArrowRight','PageDown'].includes(event.key) || (event.key===' ' && !event.target.closest('button,a'))) { event.preventDefault(); next(); }
    if(['ArrowLeft','PageUp'].includes(event.key)) { event.preventDefault(); show(current-1); }
    if(event.key==='Home') {event.preventDefault();show(0);}
    if(event.key==='End') {event.preventDefault();show(mainCount-1);}
    if(event.key.toLowerCase()==='o') overview.showModal();
    if(event.key.toLowerCase()==='a') toggleAppendices();
    if(event.key.toLowerCase()==='n') document.querySelector('#notes').click();
    if(event.key.toLowerCase()==='f') document.querySelector('#fullscreen').click();
  });
  // Print exposes every slide and every comparison independently of current state.
  window.addEventListener('beforeprint',()=>document.querySelectorAll('.slide').forEach(el=>{el.inert=false;el.removeAttribute('aria-hidden');}));
  window.addEventListener('afterprint',()=>show(current,false));
  window.addEventListener('resize',resize);
  window.addEventListener('hashchange',goToHash);
  goToHash(); resize();
  window.presentation = {show,slides,mainCount,get current(){return current;}};
})();
