import fs from 'node:fs';
import assert from 'node:assert/strict';
import {chromium} from 'playwright-core';
import {storyAssets} from './story-assets.mjs';
const board=storyAssets(),dialogues=JSON.parse(fs.readFileSync('src/dialogues.json','utf8'));
const script=fs.readFileSync('src/story-presentation.js','utf8');
const css=['ui','campaign','mobile','story-presentation'].map(name=>fs.readFileSync(`src/${name}.css`,'utf8')).join('\n');
fs.mkdirSync('test-results',{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const reports=[],errors=[];
let currentPage;
try{
  const page=await browser.newPage({viewport:{width:1280,height:800}});currentPage=page;page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/story-qa',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><div id="ck"><div id="modal"></div></div></body></html>'}));
  await page.goto('http://127.0.0.1:3100/story-qa');await page.addStyleTag({content:css});await page.addScriptTag({content:script});
  await page.evaluate(({board,dialogues})=>{
    const signal=new AbortController().signal;window.storyQA=createStoryPresentation({ui:document.querySelector('#ck'),modal:document.querySelector('#modal'),story:board,dialogues,sceneId:'Prolog',signal});
    window.qaShow=(lines,index)=>window.storyQA.render({lines,index,text:lines[index][1],auto:false,age:3,onNext:()=>{},onSkip:()=>{},onAuto:()=>{}});
  },{board,dialogues});
  const assets=await page.evaluate(async assets=>{
    const result=[];for(const[id,asset]of Object.entries(assets)){const image=new Image();image.src=asset.url;await image.decode();result.push({id,width:image.naturalWidth,height:image.naturalHeight});}return result;
  },board.assets);
  assert.equal(assets.length,35);assert.ok(assets.every(a=>a.width>0&&a.height>0));reports.push('All 35 illustration/portrait files decode in the browser');
  async function show(lines,index,art){
    await page.evaluate(({lines,index})=>window.qaShow(lines,index),{lines,index});
    await page.waitForFunction(art=>window.storyQA.snapshot().art===art,art);await page.waitForTimeout(550);
    const box=page.locator('.story-dialog'),side=await box.getAttribute('data-side');
    if(side!=='none'){
      await box.locator('.speaker-portrait img').evaluate(img=>img.decode());
      const portrait=await box.locator('.speaker-portrait').boundingBox(),text=await box.locator('.dialog-content').boundingBox();
      assert.ok(side==='right'?portrait.x>=text.x+text.width-1:portrait.x+portrait.width<=text.x+1,`Portrait ${side} placement`);
    }
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    return side;
  }
  for(const[key,sequence]of Object.entries(board.sequences)){
    for(const[index,art]of sequence)await show(dialogues[key],index,art);
  }
  for(const[name,text]of Object.entries(dialogues.flashbacks))await show([['Ingatan Candra Kirana',text],['Serat '+name,'Kemampuan baru terbuka.']],0,'serat-'+name.toLowerCase());
  reports.push('Every authored storyboard beat and seven Serat flashbacks select the correct illustration');
  for(const[width,height]of [[1280,800],[844,390],[568,320]]){
    await page.setViewportSize({width,height});await page.evaluate(mobile=>document.querySelector('#ck').classList.toggle('mobile-ui',mobile),width<1000);
    for(const[key,index,art,label]of [['jati',0,'garden','jati'],['jati',1,'garden','kirana'],['kilisuci',0,'cave','kilisuci'],['putriEnd',0,'princess','putri'],['samarEnd',4,'remembered','samar']]){
      await show(dialogues[key],index,art);
      for(const id of ['next-dialog','auto-dialog','skip-dialog']){
        const button=page.locator('#'+id);await button.scrollIntoViewIfNeeded();const b=await button.boundingBox();assert.ok(b.height>=44&&b.x>=0&&b.x+b.width<=width+1,id+' touch target');
      }
      if(['jati','kirana'].includes(label))await page.screenshot({path:`test-results/story-${label}-${width}.png`});
    }
  }
  await page.evaluate(()=>window.storyQA.hide());await page.waitForFunction(()=>window.storyQA.snapshot().images===0);
  assert.equal(await page.locator('.story-image').count(),0);assert.equal(await page.locator('#story-stage').evaluate(el=>Number(getComputedStyle(el).opacity)),0);
  reports.push('Player right/NPC left; controls remain reachable at desktop and two phone sizes; hidden art is released');
  await page.emulateMedia({reducedMotion:'reduce'});await show(dialogues.portal,1,'portal');
  assert.equal(await page.locator('.story-image').evaluate(el=>getComputedStyle(el).transitionDuration),'0s');reports.push('Reduced-motion preference disables fades');
  await page.close();

  const game=await browser.newPage({viewport:{width:1280,height:800}});currentPage=game;game.on('pageerror',e=>errors.push(e.message));
  const artRequests=[];game.on('request',r=>{if(r.url().includes('/story/'))artRequests.push(r.url());});
  await game.goto('http://127.0.0.1:3100');await game.locator('#start').waitFor();assert.equal(artRequests.length,0,'story assets are lazy, not startup preloads');
  await game.locator('#start').click();await game.locator('#next-dialog').waitFor();assert.equal(await game.locator('#skip-dialog').isDisabled(),true);
  const before=await game.evaluate(()=>window.__cahaya.snapshot());
  await game.keyboard.press('ArrowRight');await game.keyboard.press('KeyZ');await game.waitForTimeout(200);
  const after=await game.evaluate(()=>window.__cahaya.snapshot());assert.equal(after.mode,'dialog');assert.equal(after.x,before.x);assert.equal(after.y,before.y);
  await game.waitForFunction(()=>window.__cahaya.snapshot().story.art==='library');
  assert.equal(await game.locator('.story-dialog').getAttribute('data-side'),'right');
  const progress=await game.locator('.dialog-progress').innerText();await game.locator('#auto-dialog').click();
  await game.waitForFunction(progress=>document.querySelector('.dialog-progress')?.textContent!==progress,progress,{timeout:18000});
  await game.locator('#skip-dialog').click();await game.waitForFunction(()=>window.__cahaya.snapshot().mode==='play');await game.waitForFunction(()=>window.__cahaya.snapshot().story.images===0);
  assert.equal(await game.locator('.story-image').count(),0);reports.push('Actual game: intro art, paused physics, two-second skip, Auto advances, skip returns to play, lazy loading');
  assert.deepEqual(errors,[]);fs.writeFileSync('test-results/story-report.json',JSON.stringify({assets:assets.length,reports,errors},null,2));console.log('PASS',reports);
}catch(error){if(currentPage&&!currentPage.isClosed())await currentPage.screenshot({path:'test-results/story-failure.png'});throw error;}finally{await browser.close();}
