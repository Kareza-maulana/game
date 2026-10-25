import fs from 'node:fs';
import assert from 'node:assert/strict';
import {chromium} from 'playwright-core';
import {storyAssets} from './story-assets.mjs';

const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const errors=[],reports=[];
fs.mkdirSync('test-results',{recursive:true});
try{
  for(const [width,height]of [[1280,800],[844,390],[568,320]]){
    const context=await browser.newContext({viewport:{width,height},isMobile:width<1000,hasTouch:width<1000});
    const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
    await page.goto('http://127.0.0.1:3100');await page.locator('#start').click();
    await page.waitForFunction(()=>window.__cahaya?.snapshot().story.text?.revealed>5);
    const initial=await page.evaluate(()=>window.__cahaya.snapshot());
    assert.equal(initial.mode,'dialog');assert.ok(initial.story.text.revealed<initial.story.text.total);
    assert.ok(initial.audio.stats.text>0,'Text has its own sound cue');
    const copy=page.locator('#modal .dialog-copy'),before=await copy.boundingBox();
    const line=await page.locator('.dialog-progress').innerText();
    await page.locator('#auto-dialog').click();await page.waitForTimeout(220);
    const afterToggle=await page.evaluate(()=>window.__cahaya.snapshot());
    assert.ok(afterToggle.story.text.revealed>=initial.story.text.revealed,'Auto toggle never restarts text');
    assert.equal(await page.locator('.dialog-progress').innerText(),line);
    await page.locator('#auto-dialog').click();
    assert.ok(await page.locator('.dialog-glyph:not(.is-revealed)').count()>0);
    await page.screenshot({path:`test-results/text-mask-${width}.png`});
    const partial=await copy.boundingBox();assert.ok(Math.abs(before.height-partial.height)<1,'Partial text keeps full paragraph height');
    assert.ok(Math.abs(before.y-partial.y)<1,'No jumping dialogue box');
    for(const id of ['next-dialog','auto-dialog','skip-dialog']){const b=await page.locator('#'+id).boundingBox();assert.ok(b.height>=44&&b.x>=0&&b.x+b.width<=width+1);}
    if(width===844){
      await page.setViewportSize({width:390,height:844});await page.locator('#rotate-device').waitFor();
      const frozen=await page.evaluate(()=>({text:window.__cahaya.snapshot().story.text.revealed,sounds:window.__cahaya.snapshot().audio.stats.text}));
      await page.waitForTimeout(300);
      assert.deepEqual(await page.evaluate(()=>({text:window.__cahaya.snapshot().story.text.revealed,sounds:window.__cahaya.snapshot().audio.stats.text})),frozen,'Portrait orientation card pauses text and sound');
      await page.setViewportSize({width,height});await page.locator('#rotate-device').waitFor({state:'hidden'});
    }
    await page.locator('#next-dialog').click();
    assert.equal((await page.evaluate(()=>window.__cahaya.snapshot())).story.text.complete,true);
    assert.equal(await page.locator('.dialog-progress').innerText(),line,'First press completes the same line');
    await page.waitForTimeout(180);const full=await copy.boundingBox();assert.ok(Math.abs(before.height-full.height)<1);
    const soundCount=await page.evaluate(()=>window.__cahaya.snapshot().audio.stats.text);await page.waitForTimeout(220);
    assert.equal(await page.evaluate(()=>window.__cahaya.snapshot().audio.stats.text),soundCount,'No typing sound after instant completion');
    await page.keyboard.press('Enter');
    await page.waitForFunction(line=>document.querySelector('.dialog-progress').textContent!==line,line,{timeout:3000});
    assert.notEqual(await page.locator('.dialog-progress').innerText(),line,'Keyboard advances only after completion');
    await page.waitForFunction(()=>window.__cahaya.snapshot().story.text.revealed>2);
    await page.waitForFunction(()=>!document.querySelector('#skip-dialog').disabled);await page.locator('#skip-dialog').click();
    await page.waitForFunction(()=>window.__cahaya.snapshot().mode==='play');
    const stopped=await page.evaluate(()=>window.__cahaya.snapshot().audio.stats.text);await page.waitForTimeout(800);
    assert.equal(await page.evaluate(()=>window.__cahaya.snapshot().audio.stats.text),stopped,'Skip cancels typing and sound');
    reports.push({viewport:{width,height},mask:true,stableLayout:true,textCues:initial.audio.stats.text,completeBeforeAdvance:true,skipCancels:true});
    await context.close();
  }
  // Real game settings: no text cue when muted or when effects volume is zero.
  for(const settings of [{muted:true,effects:.7},{muted:false,effects:0}]){
    const page=await browser.newPage();page.on('pageerror',e=>errors.push(e.message));
    await page.addInitScript(settings=>localStorage.setItem('cahayakadiri_audio',JSON.stringify(settings)),settings);
    await page.goto('http://127.0.0.1:3100');await page.locator('#start').click();
    await page.waitForFunction(()=>window.__cahaya?.snapshot().story.text?.revealed>12);
    assert.equal(await page.evaluate(()=>window.__cahaya.snapshot().audio.stats.text),0);await page.close();
  }
  reports.push({mutedSilent:true,zeroEffectsSilent:true});
  // Isolated narration exercises grapheme boundaries, background tabs and disposal.
  const page=await browser.newPage();page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/text-qa',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><div id="ck"><div id="modal"></div></div>'}));
  await page.goto('http://127.0.0.1:3100/text-qa');
  await page.addStyleTag({content:['ui','campaign','mobile','story-presentation'].map(n=>fs.readFileSync(`src/${n}.css`,'utf8')).join('\n')});
  await page.addScriptTag({content:fs.readFileSync('src/story-presentation.js','utf8')});
  await page.evaluate(board=>{
    window.controller=new AbortController();window.cues=[];
    window.view=createStoryPresentation({ui:document.querySelector('#ck'),modal:document.querySelector('#modal'),story:board,dialogues:{flashbacks:{}},sceneId:'Prolog',signal:controller.signal,onTextSound:who=>cues.push(who)});
    window.lines=[['Narasi','Kisah… kembali, e\u0301ling 👩🏽‍🎨.']];
    window.show=()=>view.render({lines,index:0,text:lines[0][1],auto:false,age:3,onNext:()=>{},onSkip:()=>{},onAuto:()=>{}});show();
  },storyAssets());
  await page.waitForFunction(()=>view.snapshot().text.revealed>3);
  assert.equal(await page.locator('.dialog-full-text').textContent(),'Kisah… kembali, éling 👩🏽‍🎨.');
  assert.equal(await page.locator('.dialog-reveal').getAttribute('aria-hidden'),'true');
  assert.equal(await page.locator('.dialog-glyph').allTextContents().then(chars=>chars.includes('👩🏽‍🎨')&&chars.includes('é')),true,'Combining marks and emoji stay intact');
  const frozen=await page.evaluate(()=>{window.simHidden=true;Object.defineProperty(document,'hidden',{configurable:true,get:()=>simHidden});return {text:view.snapshot().text.revealed,sounds:cues.length};});
  await page.waitForTimeout(400);
  assert.deepEqual(await page.evaluate(()=>({text:view.snapshot().text.revealed,sounds:cues.length})),frozen,'Hidden tab pauses masks and sound');
  await page.evaluate(()=>{simHidden=false;});await page.waitForFunction(()=>view.snapshot().text.complete);
  assert.equal(await page.evaluate(()=>cues.every(who=>who==='Narasi')),true);
  await page.emulateMedia({reducedMotion:'reduce'});
  const reduced=await page.evaluate(()=>{lines=[['Narasi','Narasi langsung terbaca.']];const before=cues.length;show();return {complete:view.snapshot().text.complete,cues:cues.length-before};});
  assert.deepEqual(reduced,{complete:true,cues:0});
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.evaluate(()=>{lines=[['Kirana','Kalimat baru untuk menguji penghentian animasi.']];show();});
  await page.waitForFunction(()=>view.snapshot().text.revealed>3);const disposed=await page.evaluate(()=>{controller.abort();return cues.length;});
  await page.waitForTimeout(250);assert.equal(await page.evaluate(()=>cues.length),disposed);assert.equal(await page.locator('#story-stage').count(),0);
  reports.push({narration:true,graphemes:true,accessibleFullText:true,hiddenTabPauses:true,reducedMotionImmediate:true,abortCancels:true});
  await page.close();assert.deepEqual(errors,[]);
  fs.writeFileSync('test-results/text-report.json',JSON.stringify({reports,errors},null,2));console.log('PASS text masks and sound:',reports);
}finally{await browser.close();}
