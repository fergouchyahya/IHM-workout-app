// Playwright CLI run-code input. Open the deck first; run from repository root.
async (page) => {
  const browserErrors=[],externalRequests=[],failures=[];
  const check=(condition,message)=>{if(!condition) failures.push(message);};
  page.on('pageerror',error=>browserErrors.push(error.message));
  await page.route('**/*',route=>{
    const url=new URL(route.request().url());
    if(url.hostname==='127.0.0.1'||url.protocol==='blob:')return route.continue();
    externalRequests.push(url.href);return route.abort();
  });
  await page.reload();
  await page.waitForFunction(()=>window.presentation?.slides.length===44);
  await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(image=>image.decode().catch(()=>{})));});
  await page.setViewportSize({width:1440,height:900});
  const go=async id=>page.evaluate(id=>presentation.show(presentation.slides.findIndex(slide=>slide.id===id)),id);
  const current=async()=>page.evaluate(()=>presentation.slides[presentation.current].id);
  const structure=await page.evaluate(()=>({
    count:presentation.slides.length,main:presentation.mainCount,
    seconds:presentation.slides.reduce((sum,slide)=>sum+slide.time,0),
    brokenImages:[...document.images].filter(image=>!image.complete||!image.naturalWidth).map(image=>image.src),
    missingLinks:[...document.querySelectorAll('[data-jump]')].filter(link=>!document.getElementById(link.dataset.jump)).map(link=>link.dataset.jump),
    externalLinks:[...document.querySelectorAll('#canvas a[href]')].filter(a=>/^https?:/.test(a.getAttribute('href'))).map(a=>a.href),
    sourceFooters:document.querySelectorAll('.source-line').length,
    bulletNotes:presentation.slides.filter(slide=>slide.notes?.startsWith('<ul>')).length,
    personaPrivacy:document.querySelector('#s03').textContent.includes('Les noms ont été modifiés'),
    klm:document.querySelector('#s13').textContent,
    humanEvidence:document.querySelector('#s09').textContent
  }));
  check(structure.count===44&&structure.main===17,'Slide count');
  check(structure.seconds===815,'Timing budget');
  check(!structure.brokenImages.length,`Broken images: ${structure.brokenImages.join(', ')}`);
  check(!structure.missingLinks.length,'Internal links');
  check(!structure.externalLinks.length&&structure.sourceFooters===0,'No external links or source footers');
  check(structure.personaPrivacy,'Persona anonymisation');
  check(structure.bulletNotes===44,'Bullet speaking notes on every slide');
  check(['6,35','4,45','2,65'].every(value=>structure.klm.includes(value)),'Thomas KLM');
  check(structure.humanEvidence.includes('parcours complet')&&structure.humanEvidence.includes('T1 et T2'),'Human test coverage');
  await go('s01');await page.locator('#next').click();check(await current()==='s02','Next button');
  await page.keyboard.press('ArrowRight');check(await current()==='s03','Keyboard navigation');
  await page.keyboard.press('Home');check(await current()==='s01','Home');
  await page.locator('#overview').click();check(await page.locator('#overview-dialog').isVisible(),'Overview');
  await page.locator('[data-go="13"]').click();check(await current()==='s13','Overview selection');
  await page.locator('#notes').click();check(await page.locator('#speaker-notes').isVisible(),'Notes');
  check(await page.locator('#speaker-notes li').count()>=4,'Speaking cues, appendices and rubric assessment');await page.locator('#notes').click();
  await page.locator('#s13 [data-jump="a10"]').click();check(await current()==='a10','Appendix link');
  await page.locator('#appendices').click();check(await current()==='s13','Return from appendix');
  await go('s05');await page.locator('[data-enlarge-diagram]').click();check(await page.locator('#visual-content img').count()===1,'PNG tree enlargement');
  await page.locator('#zoom-visual').click();check(await page.locator('#visual-content').evaluate(el=>el.scrollWidth>el.clientWidth),'Full resolution diagram zoom');await page.keyboard.press('Escape');
  await go('a23');await page.locator('#a23 [data-enlarge]').first().click();check(await page.locator('#visual-dialog').isVisible(),'Screenshot enlargement');await page.keyboard.press('Escape');
  await go('s09');
  check(await page.locator('[data-video]').count()===2,'Local video launchers');
  check(await page.locator('#video-file').getAttribute('accept')==='video/*','Video file types');
  await go('s16');check(await page.locator('#next').isDisabled(),'Main talk stops at conclusion');
  const appLink=page.locator('#s16 .app-link');
  check(await appLink.isVisible(),'Closing application link visible');
  check(await appLink.getAttribute('href')===await page.locator('.demo-launch').getAttribute('href'),'Closing link opens the demonstrated application');
  const application=await page.request.get(await appLink.evaluate(link=>link.href));
  check(application.ok(),'Closing application link resolves');
  const layout=[],markerIssues=[];
  let markerCount=0;
  for(let i=0;i<44;i++){
    await page.evaluate(index=>presentation.show(index),i);
    const issue=await page.evaluate(()=>{
      const slide=document.querySelector('.slide.active'),body=slide.querySelector('.slide-body'),boundary=body.getBoundingClientRect();
      const outside=[...body.querySelectorAll('p,h3,table,pre,figure,.thesis-band,.clean-list,.persona-focus,.scenario-values')].filter(el=>{
        const box=el.getBoundingClientRect();return box.width&&box.height&&(box.bottom>boundary.bottom+2||box.right>boundary.right+2||box.left<boundary.left-2);
      }).map(el=>el.className||el.tagName);
      const wide=[...slide.querySelectorAll('h1,h3,p,td,th,pre')].filter(el=>el.scrollWidth>el.clientWidth+2).map(el=>el.textContent.slice(0,65));
      const markers=[];
      for(const item of body.querySelectorAll('.clean-list li')){
        const marker=getComputedStyle(item,'::before');
        if(marker.display==='none'||marker.content==='none')continue;
        const walker=document.createTreeWalker(item,NodeFilter.SHOW_TEXT);
        let text;
        while((text=walker.nextNode())&&!text.textContent.trim()){}
        if(!text)continue;
        const range=document.createRange(),offset=text.textContent.search(/\S/);
        range.setStart(text,offset);range.setEnd(text,offset+1);
        const first=range.getBoundingClientRect(),box=item.getBoundingClientRect(),scale=box.width/item.offsetWidth;
        const right=box.left+(parseFloat(marker.left)+parseFloat(marker.width))*scale;
        const centre=box.top+parseFloat(marker.top)*scale;
        const gap=(first.left-right)/scale,verticalError=Math.abs(centre-(first.top+first.height/2))/scale;
        markers.push({gap,verticalError,text:item.textContent.slice(0,50)});
      }
      return {id:slide.id,outside,wide,markers};
    });
    if(issue.outside.length||issue.wide.length)layout.push(issue);
    markerCount+=issue.markers.length;
    for(const marker of issue.markers)if(marker.gap<8||marker.verticalError>6)markerIssues.push({slide:issue.id,...marker});
  }
  check(!layout.length,`Layout: ${JSON.stringify(layout)}`);
  check(markerCount>0&&!markerIssues.length,`Red markers: ${JSON.stringify(markerIssues)}`);
  check(!browserErrors.length,`Browser errors: ${browserErrors.join('; ')}`);
  check(!externalRequests.length,'External runtime requests');
  await go('s01');
  await page.pdf({path:'output/pdf/G6.pdf',preferCSSPageSize:true,printBackground:true,displayHeaderFooter:false});
  const report={structure,layout,redMarkers:{checked:markerCount,issues:markerIssues},browserErrors,externalRequests,failures,pdf:'output/pdf/G6.pdf',humanEvidenceSource:'Team account of iterations and filmed T1/T2 plus unfilmed full test',lastVersionRetested:false,passed:failures.length===0};
  await page.evaluate(report=>{window.lastPresentationVerification=report;},report);
  return report;
}
