// Playwright CLI run-code input. Serve extracted Git snapshots on port 8876.
// Every context is fresh. These synthetic journeys are technical evidence only.
async (page) => {
  const captures = [];
  const destination = 'docs/08-presentation-finale/visuels/';
  const browser = page.context().browser();
  for (const [version, revision] of [['p1','ec84a28'],['p2','647c6ec'],['p3','703a06e']]) {
    const context = await browser.newContext({viewport:{width:390,height:900}, deviceScaleFactor:2});
    const tab = await context.newPage();
    const errors = [];
    tab.on('pageerror', error => errors.push(error.message));
    // The historic P1 requests Google Fonts. Capture its local fallback offline.
    await tab.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
    const shot = async (name, locator) => {
      const path = `${destination}${version === 'p1' ? '' : 'thomas-'}${version}-${name}.png`;
      const originalViewport = tab.viewportSize();
      await tab.waitForFunction(() => !document.querySelector('#landing-notice')?.textContent || !!document.querySelector('#landing-notice button'));
      if (locator && version !== 'p1') await tab.setViewportSize({width:600,height:1800});
      await tab.evaluate(() => { document.activeElement?.blur(); window.scrollTo(0,0); });
      if (locator) await locator.screenshot({path});
      else await tab.screenshot({path});
      captures.push({file:path.split('/').pop(), revision, version, scenario:name, synthetic:true, viewport:tab.viewportSize()});
      await tab.setViewportSize(originalViewport);
    };
    if (version === 'p1') {
      await tab.setViewportSize({width:1100,height:1100});
      await tab.goto('http://127.0.0.1:8876/p1/prototypes/prototype-global.html');
      await shot('squelette',tab.locator('.phone'));
      await tab.locator('[data-a="tab"][data-v="seance"]').click();
      await shot('t2-reserve',tab.locator('.phone'));
    } else {
      await tab.goto(`http://127.0.0.1:8876/${version}/prototypes/propotype%201/01-connexion/index.html`);
      await tab.locator('#try-demo').click();
      if (await tab.locator('[data-choice]').count()) {
        for (const choice of ['Débutant','Rester actif','Salle équipée']) {
          await tab.locator('[data-choice]').filter({hasText:choice}).click();
          await tab.locator('#question-continue').click();
        }
      } else {
        await tab.locator('#open-preferences').click();
        await tab.locator('[data-preference="0"]').click();
        await tab.locator('[data-choice]').filter({hasText:'Débutant'}).click();
        if (await tab.locator('#question-continue').count()) await tab.locator('#question-continue').click();
        await tab.locator('#landing-page').waitFor({state:'visible'});
      }
      await tab.locator('[data-page="discover"]').click();
      await shot('decouverte');
      await tab.locator('#search-session').fill('Full Body ');
      await shot('recherche');
      await tab.locator('#search-session').fill('');
      await tab.locator('[data-page="library"]').click();
      await tab.locator('#create-workout').click();
      await tab.locator('#base-name').fill('Séance témoin · Thomas');
      if (await tab.locator('#base-organization').count()) await tab.locator('#base-organization').selectOption({label:'Séance seule'});
      await tab.locator('#create-base-form button[type="submit"]').click();
      await tab.locator('#add-exercise').click();
      await tab.locator('#exercise-search').fill('Presse à cuisses');
      await tab.locator('[data-choose-exercise="presse-jambes"]').click();
      for (const [key,value] of [['sets','2'],['minReps','10'],['load','20']]) {
        await tab.locator(`[data-index="0"][data-field="${key}"]`).fill(value);
      }
      await tab.locator('#save-preparation').click();
      await shot('preparation');
      await tab.locator('#start-training').click();
      const field = (row,key) => tab.locator(`[data-result="${row}"][data-result-key="${key}"]`);
      await field(0,'load').fill('20');
      await field(0,'load').press('Enter');
      if (!(await field(0,'reps').evaluate(el => el === document.activeElement))) throw new Error('Enter did not reach repetitions');
      await field(0,'reps').fill('10');
      if (await tab.locator('[data-result-key="rpe"]').count()) throw new Error('Thomas should not see RPE');
      await shot('entrainement');
      await shot('serie',tab.locator('.training-set').first());
      await tab.locator('[data-repeat-set="1"]').click();
      if (await field(1,'reps').inputValue() !== '10') throw new Error('Recopy lost repetitions');
      await shot('recopie',tab.locator('.training-set').nth(1));
      await field(1,'load').fill('22,5');
      await field(1,'reps').fill('8');
      await shot('correction',tab.locator('.training-set').nth(1));
      const changedBeforeUndo = await field(1,'load').inputValue();
      await tab.locator('#landing-notice button').click();
      if (Number((await field(1,'load').inputValue()).replace(',','.')) !== 22.5) throw new Error('Undo erased a later correction');
      if (changedBeforeUndo === '') throw new Error('Missing corrected value');
      await shot('annulation',tab.locator('.training-set').nth(1));
      await tab.locator('#training-back').click();
      await tab.locator('[data-resume], [data-ongoing]').first().click();
      await tab.reload();
      await tab.locator('#try-demo').click();
      if (Number((await field(1,'load').inputValue()).replace(',','.')) !== 22.5) throw new Error('Resume lost correction');
      await tab.locator('[data-review-training]').first().click();
      await shot('verification');
      await tab.locator('#confirm-training-completion').click();
      await shot('bilan');
      const saved = await tab.evaluate(() => ({count:Parcours.state.completedSessions.length,record:Parcours.state.completedSessions[0]}));
      if (saved.count !== 1 || saved.record.results[0][1].load !== 22.5) throw new Error('Final archive mismatch');
    }
    if (errors.length) throw new Error(`${version}: ${errors.join('; ')}`);
    await context.close();
  }
  return {captures, verified:'Thomas beginner: charge/repetitions, no RPE, Enter, recopy, protected undo, correction, resume/reload and one archive on P2/P3'};
}
