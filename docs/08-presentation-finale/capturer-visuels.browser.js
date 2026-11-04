// Playwright CLI run-code input. Use a fresh, dedicated browser profile and local origin.
// This is a technical regression journey, not an experiment with human participants.
async (page) => {
  // Routing disables the HTTP cache so local edits are actually under test.
  await page.route('**/*',route => route.continue());
  await page.reload();
  const assert = (value,message) => { if (!value) throw new Error(message); };
  const errors = [];
  page.on('pageerror',error => errors.push(error.message));
  assert(await page.evaluate(() => !localStorage.getItem('ihm-prototype-1')), 'Use a fresh dedicated browser profile/origin; this journey never clears existing data.');
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:'docs/08-presentation-finale/visuels/00-acces.png',fullPage:true});
  await page.locator('#try-demo').click();
  for (const choice of ['Débutant','Rester actif','Salle équipée']) {
    await page.locator('[data-choice]').filter({hasText:choice}).click();
    await page.locator('#question-continue').click();
  }
  await page.setViewportSize({width:1440,height:1000});
  await page.screenshot({path:'docs/08-presentation-finale/visuels/01-decouverte.png',fullPage:true});
  await page.setViewportSize({width:390,height:844});
  await page.locator('[data-page="library"]').click();
  await page.locator('#create-workout').click();
  await page.locator('#base-name').fill('Séance témoin');
  await page.locator('#create-base-form button[type="submit"]').click();
  await page.locator('#add-exercise').click();
  await page.locator('#exercise-search').fill('Presse à cuisses');
  await page.locator('[data-choose-exercise="presse-jambes"]').click();
  for (const [key,value] of [['sets','2'],['minReps','10'],['load','20']]) {
    await page.locator(`[data-index="0"][data-field="${key}"]`).fill(value);
  }
  await page.setViewportSize({width:390,height:1400});
  await page.screenshot({path:'docs/08-presentation-finale/visuels/02-preparation.png',fullPage:true});
  await page.setViewportSize({width:390,height:844});
  await page.locator('#save-preparation').click();
  assert(await page.evaluate(() => Parcours.state.calendar.length) === 0,'creation imposed a date');
  await page.locator('#workout-back').click();
  await page.locator('[data-page="mine"]').click();
  await page.locator('#calendar-add').click();
  await page.locator('[data-date-shortcut="today"]').click();
  await page.locator('[data-pick]').filter({hasText:'Séance témoin'}).click();
  await page.setViewportSize({width:390,height:1200});
  await page.screenshot({path:'docs/08-presentation-finale/visuels/03-calendrier.png',fullPage:true});
  await page.setViewportSize({width:390,height:844});
  await page.locator('[data-entry]').filter({hasText:'Séance témoin'}).click();
  await page.locator('#start-training').click();
  const field = (row,key) => page.locator(`[data-result="${row}"][data-result-key="${key}"]`);
  const set = row => page.locator('.training-set').nth(row);
  await set(0).getByRole('button',{name:'Augmenter la charge'}).click();
  assert(await field(0,'load').inputValue() === '', 'empty value turned into an actual result');
  await field(0,'load').fill('20');
  await field(0,'load').press('Enter');
  assert(await field(0,'reps').evaluate(el => el === document.activeElement),'Enter did not advance to repetitions');
  await field(0,'reps').fill('10');
  await field(1,'load').fill('25');
  await field(1,'reps').fill('8');
  await field(1,'load').fill('22,5');
  await field(1,'reps').fill('8.5');
  await set(1).getByRole('button',{name:'Augmenter les répétitions'}).click();
  assert(await field(1,'reps').inputValue() === '8.5','stepper erased invalid visible correction');
  await field(1,'reps').fill('8');
  await page.locator('[data-outcome-details="1"] summary').click();
  await page.locator('[data-outcome-row="1"][data-outcome="skipped"]').click();
  assert(await field(1,'load').isDisabled(),'skipped row still editable');
  assert(await set(1).getByRole('button',{name:'Augmenter la charge'}).isDisabled(),'skipped stepper active');
  await page.locator('[data-resume-set="1"]').click();
  assert(Number((await field(1,'load').inputValue()).replace(',','.')) === 22.5,'resume lost previous value');
  await page.screenshot({path:'docs/08-presentation-finale/visuels/04-saisie.png',fullPage:true});
  await page.locator('#training-back').click();
  await page.locator('[data-resume]').first().click();
  assert(await field(0,'reps').inputValue() === '10','leave/resume lost first result');
  await page.reload();
  await page.locator('#try-demo').click();
  assert(Number((await field(1,'load').inputValue()).replace(',','.')) === 22.5,'reload lost correction');
  await page.locator('[data-review-training]').first().click();
  await page.locator('[data-review-inline="0:1"]').click();
  const correction = page.locator('[data-review-value="0:1"][data-review-key="reps"]');
  await correction.fill('-1');
  assert(await page.locator('#confirm-training-completion').isDisabled(),'invalid result allowed archive');
  await correction.fill('9');
  await page.locator('#confirm-training-completion').click();
  assert(await page.evaluate(() => Parcours.state.completedSessions.length) === 1,'archive count');
  assert(await page.evaluate(() => Object.keys(Parcours.state.trainingDrafts).length) === 0,'completed draft remains');
  const actual = await page.evaluate(() => {
    const r = Parcours.state.completedSessions[0];
    return {target:r.session.exercises[0].load,first:r.results[0][0],second:r.results[0][1]};
  });
  assert(actual.target === 20 && actual.first.reps === 10 && actual.second.load === 22.5 && actual.second.reps === 9,'target/actual or correction corrupted');
  await page.locator('.summary-analysis > summary').click();
  assert((await page.locator('.analysis-reference').textContent()).includes('Aucune séance précédente comparable'),'invented comparison on first result');
  await page.locator('#analysis-point').fill('Vérifier le réglage du siège');
  await page.locator('#analysis-save-point').click();
  await page.locator('.summary-next > summary').click();
  await page.locator('#summary-plan-prepare').click();
  const tomorrow = await page.evaluate(() => Calendrier.plus(Calendrier.today(),1));
  await page.locator('#calendar-schedule [name="date"]').fill(tomorrow);
  await page.locator('#calendar-schedule button[type="submit"]').click();
  assert((await page.locator('#landing-page').textContent()).includes('Vérifier le réglage du siège'),'review point not in next preparation');
  assert(await page.evaluate(() => Object.keys(Parcours.state.trainingDrafts).length) === 0,'preparing next session created actual results');
  await page.locator('#workout-back').click();
  await page.locator('[data-page="progress"]').click();
  await page.locator('#history-search').fill('  Séance   témoin  ');
  assert(await page.locator('[data-open-summary]').count() === 1,'history normalized search');
  await page.locator('[data-open-summary]').click();
  await page.screenshot({path:'docs/08-presentation-finale/visuels/05-bilan.png',fullPage:true});
  await page.locator('[data-page="mine"]').click();
  const levels = [];
  for (const level of ['Intermédiaire','Avancé','Débutant']) {
    await page.locator('#open-preferences').click();
    await page.locator('[data-preference="0"]').click();
    await page.locator('[data-choice]').filter({hasText:level}).click();
    await page.locator('#question-continue').click();
    await page.locator('#calendar-add').click();
    assert(await page.locator('#calendar-milestone').count() === (level === 'Avancé' ? 1 : 0),'milestone visibility');
    await page.locator('#calendar-cancel').click();
    assert(await page.evaluate(() => Parcours.state.completedSessions.length) === 1,'level switch lost archive');
    levels.push(level);
  }
  // Verify the three-field method modeled by KLM and preserve hidden RPE.
  {
 await page.locator('[data-page="mine"]').click();
 await page.locator('#open-preferences').click();
 await page.locator('[data-preference="0"]').click();
 await page.locator('[data-choice]').filter({hasText:'Intermédiaire'}).click();
 await page.locator('#question-continue').click();
 await page.locator('[data-page="library"]').click();
 await page.locator('[data-personal]').filter({hasText:'Séance témoin'}).click();
 await page.locator('#adapt-session').click();
 await page.locator('[data-tracking="rpe"]').check();
 await page.locator('#save-preparation').click();
 await page.locator('#start-training').click();
 const field=key=>page.locator(`[data-result="0"][data-result-key="${key}"]`);
 await field('load').fill('20'); await field('load').press('Enter');
 assert(await field('reps').evaluate(el=>el===document.activeElement),'Enter to reps');
 await field('reps').fill('10'); await field('reps').press('Enter');
 assert(await field('rpe').evaluate(el=>el===document.activeElement),'Enter to RPE');
 await field('rpe').fill('7');
 await page.locator('[data-repeat-set="1"]').click();
 assert(await page.locator('[data-result="1"][data-result-key="rpe"]').inputValue()==='7','actual copy RPE');
 await page.setViewportSize({width:1440,height:1200});
 await page.locator('.training-series').screenshot({path:'docs/08-presentation-finale/visuels/06-saisie-rpe.png'});
 await page.locator('#training-back').click();
 await page.locator('#open-preferences').click();
 await page.locator('[data-preference="0"]').click();
 await page.locator('[data-choice]').filter({hasText:'Débutant'}).click();
 await page.locator('#question-continue').click();
 await page.locator('[data-ongoing]').first().click();
 assert(await page.locator('[data-result-key="rpe"]').count()===0,'RPE not hidden');
 assert(await page.evaluate(()=>Parcours.state.trainingDrafts[Entrainement.key].results[0][0].rpe)===7,'hidden RPE erased');
 await page.locator('#training-back').click();
  }
  const widths = [];
  for (const width of [320,390,768,1440]) {
    await page.setViewportSize({width,height:900});
    for (const view of ['mine','library','discover','sharing','progress']) {
      await page.locator(`[data-page="${view}"]`).click();
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),`${view} overflow at ${width}`);
    }
    widths.push(width);
  }
  await page.screenshot({path:'docs/08-presentation-finale/visuels/07-historique.png',fullPage:true});
  assert(errors.length === 0,errors.join('\n'));
  return {technicalJourney:'passed',actual,levels,widths,pageErrors:errors};
}
