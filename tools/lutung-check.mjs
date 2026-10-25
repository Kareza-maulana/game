import fs from 'node:fs';
import assert from 'node:assert/strict';
import {chromium} from 'playwright-core';
import {newCampaign} from '../src/campaign-model.mjs';

const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const errors=[],reports=[];fs.mkdirSync('test-results',{recursive:true});
let page;
const snap=()=>page.evaluate(()=>window.__cahaya.snapshot());
async function dialogs(){for(let i=0;i<40;i++){if((await snap()).mode!=='dialog')return;await page.locator('#next-dialog').click();await page.waitForTimeout(35);}throw Error('Dialog did not finish');}
function fixture({started=false,dock=false}={}){
  const s=newCampaign();s.scene='Pasar';s.visited=['Prolog','Pasar'];s.checkpoint=dock?2:1;s.quests.books=[0,1,2];s.quests.marketStarted=true;s.quests.orders=started?[0,1,2]:[0,1];s.quests.chase=started;return s;
}
async function open(s,mobile=false){
  const context=await browser.newContext({viewport:mobile?{width:844,height:390}:{width:960,height:540},isMobile:mobile,hasTouch:mobile});
  page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(s=>localStorage.setItem('cahayakadiri_save',JSON.stringify(s)),s);
  await page.goto('http://127.0.0.1:3100');await page.locator('#continue').click();await page.waitForFunction(()=>window.__cahaya?.snapshot().scene==='Pasar');await dialogs();return context;
}
async function move(target,jump=false){
  await page.evaluate(({target,jump})=>new Promise((resolve,reject)=>{
    const start=performance.now(),get=()=>window.__cahaya.snapshot(),sign=target>get().x?1:-1,key=sign>0?'ArrowRight':'ArrowLeft';
    const event=(type,code)=>window.dispatchEvent(new KeyboardEvent(type,{code,bubbles:true,cancelable:true}));
    event('keydown',key);if(jump){event('keydown','KeyZ');requestAnimationFrame(()=>event('keyup','KeyZ'));}
    function frame(){const s=get();if((target-s.x)*sign<4){event('keyup',key);resolve();return;}if(performance.now()-start>8000||s.mode!=='play'){event('keyup',key);reject(Error('Cannot reach '+target+' at '+s.x));return;}requestAnimationFrame(frame);}requestAnimationFrame(frame);
  }),{target,jump});
  await page.waitForTimeout(40);assert.ok(Math.abs((await snap()).x-target)<25);
}
async function jumpTo(target){await move(target,true);await page.waitForFunction(()=>window.__cahaya.snapshot().onFloor,null,{timeout:4000});await page.waitForTimeout(65);}
try{
  let context=await open(fixture());assert.equal((await snap()).lutung.visible,false,'Target is hidden before theft');
  await move(928);await jumpTo(820);await move(762);await page.keyboard.press('KeyC');await page.waitForFunction(()=>window.__cahaya.snapshot().mode==='dialog');await dialogs();
  let a=await snap();assert.equal(a.state.quests.chase,true);assert.ok(a.lutung.visible&&a.lutung.x>a.x&&a.lutung.x<a.x+160);
  const initial=a.lutung;await page.waitForTimeout(450);a=await snap();assert.ok(a.lutung.x>initial.x,'Actual sprite moves after third order');
  await page.screenshot({path:'test-results/lutung-start.png'});
  await page.keyboard.press('Escape');await page.locator('#resume').waitFor();const paused=(await snap()).lutung;await page.waitForTimeout(350);assert.deepEqual((await snap()).lutung,paused);await page.locator('#resume').click();
  await page.evaluate(()=>{window.chaseSamples=[];window.sampleChase=true;function frame(){if(!sampleChase)return;const s=window.__cahaya.snapshot();if(s.mode==='play'&&s.lutung?.visible)chaseSamples.push({x:s.x,target:s.lutung.x,y:s.lutung.y,jumping:s.lutung.jumping,visible:s.lutung.x>s.camera.x-240&&s.lutung.x<s.camera.x+240});requestAnimationFrame(frame);}frame();});
  for(let i=0;i<17;i++){const start=896+i*256;await move(start-98);await jumpTo(start-4);if(i%5===0)console.log('ROOF',i,Math.round((await snap()).lutung.x));}
  await jumpTo(5280);await move(5360);
  await page.waitForFunction(()=>window.__cahaya.snapshot().lutung.arrived);a=await snap();assert.equal(a.state.checkpoint,2);assert.equal(a.lutung.feet,544);
  if(a.y<490){await page.keyboard.down('ArrowDown');await page.keyboard.press('KeyZ',{delay:60});await page.waitForTimeout(1000);await page.keyboard.up('ArrowDown');}
  await page.keyboard.press('KeyC');await page.locator('[data-choice="0"]').waitFor();await page.locator('[data-choice="0"]').click();await dialogs();a=await snap();assert.ok(a.state.serat.includes('Asih'));assert.equal(a.state.quests.chaseWon,true);
  await page.screenshot({path:'test-results/lutung-fed.png'});
  const samples=await page.evaluate(()=>{sampleChase=false;return chaseSamples;});assert.ok(samples.some(s=>s.jumping));assert.ok(samples.filter(s=>s.visible).length/samples.length>.9,'Visible moving target throughout most of the chase');
  reports.push({thirdOrderTriggers:true,fullRoofRoute:true,samples:samples.length,targetVisibleFraction:samples.filter(s=>s.visible).length/samples.length,foodGrantsAsih:true,pauseFreezes:true});await context.close();
  context=await open(fixture({started:true}));
  const retry=await page.evaluate(()=>new Promise((resolve,reject)=>{let last=window.__cahaya.snapshot().chaseTime;const start=performance.now();function frame(){const s=window.__cahaya.snapshot();if(s.chaseTime<last-.5){resolve(s);return;}last=s.chaseTime;if(performance.now()-start>10000){reject(Error('No checkpoint retry'));return;}requestAnimationFrame(frame);}frame();}));
  assert.ok(Math.abs(retry.x-992)<4);assert.ok(retry.lutung.visible&&retry.lutung.x>retry.x&&retry.lutung.x<retry.x+160);reports.push({failedChaseResetsTarget:true});await context.close();
  context=await open(fixture({started:true,dock:true}));a=await snap();assert.equal(a.lutung.arrived,true);await page.keyboard.press('Escape');await page.locator('#return-damar').click();assert.ok((await snap()).x>5200,'Dock retry does not return to start');await move(5356);await page.keyboard.press('KeyC');await page.locator('[data-choice="0"]').waitFor();reports.push({dockResume:true,dockRetry:true});await context.close();
  context=await open(fixture({started:true}),true);const before=(await snap()).lutung.x;const right=await page.locator('.touch-right').boundingBox();await page.mouse.move(right.x+right.width/2,right.y+right.height/2);await page.mouse.down();await page.waitForTimeout(400);await page.mouse.up();a=await snap();assert.ok(a.lutung.x>before&&a.lutung.visible);await page.screenshot({path:'test-results/lutung-mobile.png'});reports.push({mobileMovingTarget:true});await context.close();
  assert.deepEqual(errors,[]);fs.writeFileSync('test-results/lutung-report.json',JSON.stringify({reports,errors},null,2));console.log('PASS lutung chase:',reports);
}catch(error){if(page&&!page.isClosed())await page.screenshot({path:'test-results/lutung-failure.png'});throw error;}finally{await browser.close();}
