// Additional current-application views for the teacher's visual supplement.
async (page) => {
  const captures=[];
  for(const [device,width] of [['mobile',390],['ordinateur',1440]]){
    const context=await page.context().browser().newContext({viewport:{width,height:900},deviceScaleFactor:2});
    const tab=await context.newPage(),errors=[];
    tab.on('pageerror',error=>errors.push(error.message));
    await tab.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());
    const shot=async(name,title)=>{
      await tab.evaluate(()=>{document.activeElement?.blur();window.scrollTo(0,0);});
      const file=`actuel-${device}-${name}.png`;
      await tab.screenshot({path:`output/playwright/envoi-g6/${file}`});
      captures.push({file,title,device,width,version:'Version finale',synthetic:true});
    };
    await tab.goto('http://127.0.0.1:8877/prototypes/propotype%201/01-connexion/index.html');
    await shot('accueil','Accueil et accès sans compte');
    await tab.locator('#try-demo').click();
    if(await tab.locator('[data-choice]').count()){
      for(const choice of ['Débutant','Rester actif','Salle équipée']){
        await tab.locator('[data-choice]').filter({hasText:choice}).click();
        await tab.locator('#question-continue').click();
      }
    }
    for(const [index,name,title,choice] of [[0,'niveau','Choix du niveau','Débutant'],[1,'objectif','Choix de l’objectif','Rester actif'],[2,'materiel','Choix du matériel','Salle équipée']]){
      await tab.locator('#open-preferences').click();
      await tab.locator(`[data-preference="${index}"]`).click();
      await shot(name,title);
      await tab.locator('[data-choice]').filter({hasText:choice}).click();
      await tab.locator('#question-continue').click();
    }
    for(const [route,name,title] of [['discover','decouverte','Découvrir des séances'],['library','bibliotheque','Mes entraînements'],['mine','calendrier','Calendrier et organisation'],['sharing','partages','Partages'],['progress','bilans','Bilans et suivi']]){
      await tab.locator(`[data-page="${route}"]`).click();
      await shot(name,title);
    }
    await tab.locator('[data-page="library"]').click();
    await tab.locator('#create-workout').click();
    await tab.locator('#base-name').fill('Séance de démonstration · G6');
    await shot('creation','Créer sa séance');
    if(await tab.locator('#base-organization').count())await tab.locator('#base-organization').selectOption({label:'Séance seule'});
    await tab.locator('#create-base-form button[type="submit"]').click();
    await tab.locator('#add-exercise').click();
    await tab.locator('#exercise-search').fill('Presse à cuisses');
    await shot('exercices','Rechercher et choisir un exercice');
    await tab.locator('[data-choose-exercise="presse-jambes"]').click();
    for(const [field,value] of [['sets','2'],['minReps','10'],['load','20']])await tab.locator(`[data-index="0"][data-field="${field}"]`).fill(value);
    await tab.locator('#save-preparation').click();
    await shot('preparation','Préparer les cibles');
    await tab.locator('#start-training').click();
    for(const [row,load,reps] of [[0,'20','10'],[1,'22,5','8']]){
      await tab.locator(`[data-result="${row}"][data-result-key="load"]`).fill(load);
      await tab.locator(`[data-result="${row}"][data-result-key="reps"]`).fill(reps);
    }
    await shot('entrainement','Consigner les résultats réels');
    await tab.locator('[data-review-training]').first().click();
    await shot('verification','Vérifier avant de terminer');
    await tab.locator('#confirm-training-completion').click();
    await shot('bilan','Bilan de la séance terminée');
    if(errors.length)throw new Error(errors.join('; '));
    await context.close();
  }
  return {captures,technicalDemonstration:true};
}
