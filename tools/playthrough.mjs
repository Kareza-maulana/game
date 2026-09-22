import {chromium} from 'playwright-core';
import fs from 'node:fs';
import assert from 'node:assert/strict';
fs.mkdirSync('test-results',{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const snap=()=>page.evaluate(()=>window.__cahaya.snapshot());
async function move(target,jump=false){
  let a=await snap();const key=target>a.x?'ArrowRight':'ArrowLeft';
  await page.keyboard.down(key);if(jump)await page.keyboard.press('KeyZ');
  const end=Date.now()+14000;let last=a.x,stuck=0;
  while(Date.now()<end){
    await page.waitForTimeout(90);a=await snap();
    if(a.mode!=='play')throw new Error('Unexpected mode '+a.mode);
    if(Math.abs(a.x-target)<9||(key==='ArrowRight'?a.x>=target:a.x<=target))break;
    if(Math.abs(a.x-last)<1)stuck++;else stuck=0;
    if(stuck>=3&&a.onFloor){await page.keyboard.press('KeyZ');stuck=0;}
    last=a.x;
  }
  await page.keyboard.up(key);await page.waitForTimeout(180);
  a=await snap();console.log('MOVE',target,Math.round(a.x),Math.round(a.y));
  assert.ok(Math.abs(a.x-target)<30,'Did not reach '+target+': '+JSON.stringify(a));
}
async function interact(){await page.keyboard.press('KeyC');await page.waitForTimeout(150);}
try{
  await page.goto('http://127.0.0.1:3100');await page.getByRole('button',{name:'Masuki taman'}).click();await page.getByRole('button',{name:'Lewati',exact:true}).click();
  await move(124);await interact();await page.getByRole('button',{name:'Lewati',exact:true}).click();assert.equal((await snap()).state.pelita,true);
  await move(211);await interact();assert.equal((await snap()).state.levers[0],true);
  await move(362);await move(486,true);
  await move(748);await interact();assert.equal((await snap()).state.levers[2],true);
  await move(650);await move(500,true);
  await page.waitForFunction(()=>window.__cahaya.snapshot().mode==='dialog',{timeout:20000});
  await page.getByRole('button',{name:'Lewati',exact:true}).click();assert.equal((await snap()).state.sabar,true);
  await page.screenshot({path:'test-results/serat-sabar.png'});
  await move(362,true);await move(211,true);await interact();assert.equal((await snap()).state.levers[0],false);
  await move(362);await move(486,true);await interact();assert.equal((await snap()).state.levers[1],true);
  await move(748);await interact();assert.equal((await snap()).state.levers[2],false);assert.equal((await snap()).state.drained,true);
  await move(750);await move(877,true);
  await page.keyboard.down('KeyX');await move(916);await move(998,true);await page.screenshot({path:'test-results/pelita-bridge.png'});await move(1120,true);await page.keyboard.up('KeyX');
  await move(1222);await page.keyboard.down('KeyX');await page.waitForTimeout(1600);await page.keyboard.up('KeyX');await interact();
  await page.screenshot({path:'test-results/relief.png'});
  for(const name of ['Putri di Dhaha','Keong keemasan','Pertolongan Mbok','Cahaya yang pulang'])await page.getByRole('button',{name:new RegExp(name)}).click();
  await page.getByRole('button',{name:'Satukan ingatan'}).click();await page.getByRole('button',{name:'Lewati',exact:true}).click();assert.equal((await snap()).state.jujur,true);
  await move(1450);await interact();assert.equal((await snap()).state.completed,true);await page.screenshot({path:'test-results/completed.png'});
  await page.reload();await page.getByRole('button',{name:'Lanjutkan perjalanan',exact:true}).click();const restored=await snap();assert.equal(restored.state.jujur,true);assert.equal(restored.state.completed,true);
  assert.deepEqual(errors,[]);console.log('PASS: real keyboard playthrough, both serat, lamp bridge, relief, ending, save reload.');
}catch(e){console.log('FAIL STATE',await snap().catch(()=>null),'ERRORS',errors);await page.screenshot({path:'test-results/playthrough-failure.png'});throw e;}finally{await browser.close();}
