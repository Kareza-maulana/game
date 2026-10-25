import fs from 'node:fs';
import assert from 'node:assert/strict';
import {chromium} from 'playwright-core';
import {storyAssets} from './story-assets.mjs';

const board=storyAssets(),dialogues=JSON.parse(fs.readFileSync('src/dialogues.json','utf8'));
const script=fs.readFileSync('src/story-presentation.js','utf8');
const css=['ui','campaign','mobile','story-presentation'].map(n=>fs.readFileSync(`src/${n}.css`,'utf8')).join('\n');
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const report=[],errors=[];
try{
  for(const viewport of [{width:1280,height:800},{width:844,height:390}]){
    const page=await browser.newPage({viewport});page.on('pageerror',e=>errors.push(e.message));
    await page.route('**/fade-qa',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><div id="ck"><div id="modal"></div></div>'}));
    await page.goto('http://127.0.0.1:3100/fade-qa');await page.addStyleTag({content:css});await page.addScriptTag({content:script});
    await page.evaluate(async({board,dialogues})=>{
      window.board=board;window.dialogues=dialogues;window.controller=new AbortController();
      window.createView=()=>window.view=createStoryPresentation({ui:document.querySelector('#ck'),modal:document.querySelector('#modal'),story:board,dialogues,sceneId:'Prolog',signal:controller.signal});
      createView();
      window.show=(key,index=0)=>{document.querySelector('#modal').hidden=false;const lines=dialogues[key];view.render({lines,index,text:lines[index][1],auto:false,age:3,onNext:()=>{},onSkip:()=>{},onAuto:()=>{}});};
      window.frames=async(ms,read)=>{const result=[],start=performance.now();do{await new Promise(requestAnimationFrame);result.push({at:performance.now()-start,...read()});}while(performance.now()-start<ms);return result;};
      for(const key of ['library','garden','cave']){const img=new Image();img.src=board.assets[key].url;await img.decode();}
    },{board,dialogues});
    await page.evaluate(()=>show('introProlog'));await page.waitForFunction(()=>view.snapshot().art==='library');await page.waitForTimeout(800);
    const crossfade=await page.evaluate(async()=>{
      show('jati');while(view.snapshot().art!=='garden')await new Promise(requestAnimationFrame);
      return frames(1000,()=>({base:Number(getComputedStyle(document.querySelector('.story-image')).opacity),incoming:Number(getComputedStyle(document.querySelector('.story-image:last-child')).opacity),layers:document.querySelectorAll('.story-image').length}));
    });
    assert.ok(crossfade.filter(f=>f.incoming>.05&&f.incoming<.95).length>=8,'Multiple intermediate opacity frames');
    assert.ok(crossfade.every(f=>f.base>.99),'Opaque base prevents dark dip');
    assert.equal(crossfade.at(-1).layers,1,'Previous plates released after fade');
    assert.ok(crossfade.every((f,i)=>!i||f.incoming>=crossfade[i-1].incoming-.001),'Fade advances continuously');
    // Interrupt a running blend twice; old callbacks must not remove the newest image.
    await page.evaluate(()=>show('kilisuci'));await page.waitForTimeout(120);await page.evaluate(()=>show('introProlog'));await page.waitForTimeout(120);await page.evaluate(()=>show('jati'));
    await page.waitForFunction(()=>view.snapshot().art==='garden'&&view.snapshot().images===1);
    const closing=await page.evaluate(async()=>{
      view.hide();document.querySelector('#modal').hidden=true;
      const ghost=document.querySelector('.story-dialog-exit');
      const result={inert:ghost.inert,ids:ghost.querySelectorAll('[id]').length,samples:await frames(850,()=>({stage:Number(getComputedStyle(document.querySelector('#story-stage')).opacity),dialog:Number(getComputedStyle(ghost).opacity)}))};return result;
    });
    assert.equal(closing.inert,true);assert.equal(closing.ids,0);
    assert.ok(closing.samples.some(f=>f.stage>.1&&f.stage<.9&&f.dialog>.05&&f.dialog<.95));
    assert.equal(await page.locator('.story-dialog-exit,.story-image').count(),0,'Exit cleans up after fade');
    // Reverse the stage fade while closing, then allow its former timer to expire.
    await page.evaluate(()=>show('jati'));await page.waitForTimeout(800);await page.evaluate(()=>view.hide());await page.waitForTimeout(180);await page.evaluate(()=>show('jati'));await page.waitForTimeout(850);
    assert.equal(await page.evaluate(()=>view.snapshot().images),1);
    assert.equal(await page.locator('.story-dialog-exit').count(),0);
    const out=await page.evaluate(async()=>{const duration=view.transitionOut();return {duration,samples:await frames(720,()=>({opacity:Number(getComputedStyle(document.querySelector('#scene-curtain')).opacity)}))};});
    assert.equal(out.duration,650);assert.ok(out.samples.some(f=>f.opacity>.1&&f.opacity<.9));assert.ok(out.samples.at(-1).opacity>.99);
    // Scene handoff keeps the curtain mounted until the next image can be shown.
    const incoming=await page.evaluate(async()=>{
      controller.abort();controller=new AbortController();createView();show('kilisuci');
      return frames(1100,()=>({opacity:Number(getComputedStyle(document.querySelector('#scene-curtain')||document.createElement('div')).opacity),curtain:!!document.querySelector('#scene-curtain')}));
    });
    assert.ok(incoming.some(f=>f.curtain&&f.opacity>.1&&f.opacity<.9));assert.equal(incoming.at(-1).curtain,false);
    await page.emulateMedia({reducedMotion:'reduce'});
    assert.equal(await page.evaluate(()=>view.transitionOut()),0);await page.evaluate(()=>show('jati'));
    await page.waitForFunction(()=>!document.querySelector('#scene-curtain'));
    await page.evaluate(()=>view.hide());await page.waitForFunction(()=>view.snapshot().images===0);
    report.push({viewport,crossfadeFrames:crossfade.length,intermediateFrames:crossfade.filter(f=>f.incoming>.05&&f.incoming<.95).length,rapidNext:true,reopen:true,curtainHandoff:true,reducedMotion:true});
    await page.close();
  }
  assert.deepEqual(errors,[]);fs.mkdirSync('test-results',{recursive:true});fs.writeFileSync('test-results/fade-report.json',JSON.stringify({report,errors},null,2));console.log('PASS smooth fades:',report);
}finally{await browser.close();}
