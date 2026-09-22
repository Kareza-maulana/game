import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
import {newCampaign} from '../src/campaign-model.mjs';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const page=await browser.newPage({viewport:{width:1280,height:800}}),errors=[];
page.on('pageerror',e=>errors.push(e.message));
const snap=()=>page.evaluate(()=>window.__cahaya.snapshot()),wait=ms=>page.waitForTimeout(ms),press=key=>page.keyboard.press(key,{delay:70});
async function dialogs(){for(let i=0;i<30;i++){if((await snap()).mode!=='dialog')break;await page.locator('#next-dialog').click();await wait(50);}await wait(100);}
async function move(target,{jump=false,double=false,settle=350}={}){
 // Schedule key release in the renderer's own frame: CDP roundtrip latency on a
 // busy desktop must not turn a short movement into an unintended long hold.
 await page.evaluate(({target,jump,double})=>new Promise(resolve=>{const get=()=>window.__cahaya.snapshot(),start=get(),sign=start.x<target?1:-1,key=sign>0?'ArrowRight':'ArrowLeft',at=performance.now();let last=start.x,stuck=0,second=false;
 const event=(type,code)=>window.dispatchEvent(new KeyboardEvent(type,{code,bubbles:true,cancelable:true}));const tap=code=>{event('keydown',code);requestAnimationFrame(()=>event('keyup',code));};event('keydown',key);if(jump)tap('KeyZ');
 function frame(){const a=get();if(double&&!second&&a.state.playSeconds-start.state.playSeconds>.23){second=true;tap('KeyZ');}if((target-a.x)*sign<5||a.mode!=='play'||performance.now()-at>Math.abs(target-start.x)/80*1000+7000){event('keyup',key);resolve();return;}if(Math.abs(a.x-last)<.1)stuck++;else stuck=0;if(stuck>15&&a.onFloor){tap('KeyZ');stuck=0;}last=a.x;requestAnimationFrame(frame);}requestAnimationFrame(frame);}),{target,jump,double});
 await wait(settle);const a=await snap();console.log('MOVE',a.scene,target,Math.round(a.x),Math.round(a.y));assert.ok(Math.abs(a.x-target)<30,'Unreachable x '+target);return a;}
async function jumpTo(x,double=false){await move(x,{jump:true,double,settle:20});await page.waitForFunction(()=>window.__cahaya.snapshot().onFloor,null,{timeout:8000});await wait(330);const a=await snap();assert.ok(Math.abs(a.x-x)<30,'Jump landing missed '+x);}

try{
 // Explicit resume fixture: reached Kilisuci but missed Wani, as reported.
 const s=newCampaign();Object.assign(s,{scene:'Bukit',checkpoint:2,serat:['Asih','Sabar','Jujur'],pelita:true,sabar:true,jujur:true,drained:true,visited:['Prolog','Pasar','Petirtaan','Bukit']});
 await page.addInitScript(s=>{if(!localStorage.getItem('cahayakadiri_save'))localStorage.setItem('cahayakadiri_save',JSON.stringify(s));},s);
 async function resume(){await page.locator('#continue').click();await page.waitForFunction(()=>window.__cahaya?.snapshot().scene==='Bukit');await dialogs();await page.waitForFunction(()=>window.__cahaya.snapshot().onFloor);}
 await page.goto('http://127.0.0.1:3100');await resume();
 assert.match(await page.locator('#quest').innerText(),/Wani belum diambil.*↓ \+ Z.*Damar Jurang/);
 assert.match(await page.locator('#cave-target').innerText(),/Damar Jurang/);assert.equal(await page.locator('#cave-target').getAttribute('data-offscreen'),'true');
 await page.screenshot({path:'test-results/cave-guide-return.png'});
 await move(648);await page.keyboard.down('KeyX');
 await page.waitForFunction(()=>window.__cahaya.snapshot().state.quests.caveRead&&window.__cahaya.snapshot().mode==='dialog');
 await page.keyboard.up('KeyX');assert.match(await page.locator('.dialog').innerText(),/Air → akar → bunga → bulan → pelita/);await dialogs();
 await page.keyboard.press('KeyC');await page.waitForFunction(()=>window.__cahaya.snapshot().mode==='dialog');await dialogs();
 await page.reload();await resume();assert.ok((await snap()).state.quests.caveRead);assert.equal((await snap()).state.serat.length,3);
 await move(648);await page.keyboard.press('KeyC');await page.waitForFunction(()=>window.__cahaya.snapshot().mode==='dialog');await dialogs();
 // At the left edge of the reading prompt, C must target the relief, not Kilisuci.
 await move(593);await page.keyboard.press('KeyC');await page.waitForFunction(()=>window.__cahaya.snapshot().mode==='dialog');assert.match(await page.locator('.dialog').innerText(),/Pahatan pertapaan/);await dialogs();await move(648);
 for(const [width,height]of [[1440,900],[844,390],[390,844],[1280,800]]){
  await page.setViewportSize({width,height});await wait(500);
  const bounds=await page.locator('canvas').boundingBox();
  assert.ok(Math.abs(bounds.width-width)<2&&Math.abs(bounds.height-height)<2,JSON.stringify(bounds));
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 }
 await page.locator('#fullscreen-button').click();await page.waitForFunction(()=>!!document.fullscreenElement);
 await page.locator('#fullscreen-button').click();await page.waitForFunction(()=>!document.fullscreenElement);
 await page.screenshot({path:'test-results/cave-reading-resume.png'});
 console.log('PASS: missing-Wani hint, automatic reading without C, reread after releasing X, save/reload, four viewport sizes and fullscreen toggle.');
 // Follow the recovery route from Kilisuci using the controls printed in the quest.
 await move(560);await page.keyboard.down('ArrowDown');await press('KeyZ');await page.waitForFunction(()=>{const a=window.__cahaya.snapshot();return a.y>690&&a.onFloor;});await page.keyboard.up('ArrowDown');
 await move(484);await press('KeyC');assert.equal((await snap()).state.oil,100);assert.equal((await snap()).state.checkpoint,1);
 assert.match(await page.locator('#prompt').innerText(),/Damar Jurang.*minyak/);await page.screenshot({path:'test-results/cave-guide-damar.png'});
 await move(644);await page.keyboard.down('KeyX');await jumpTo(700);await jumpTo(768);await jumpTo(817);await press('KeyC');await page.keyboard.up('KeyX');await dialogs();assert.ok((await snap()).state.serat.includes('Wani'));
 await page.keyboard.press('Escape');await page.locator('#return-damar').click();await wait(300);
 await jumpTo(352,true);await jumpTo(230,true);await move(268);await jumpTo(365,true);await jumpTo(560,true);await move(748);await press('KeyC');
 for(let i=0;i<5;i++)await page.locator(`[data-choice="${i}"]`).click();await dialogs();assert.ok((await snap()).state.serat.includes('Andhap'));
 await page.waitForFunction(()=>document.querySelector('#cave-target').dataset.step==='4');await page.screenshot({path:'test-results/cave-guide-candles.png'});
 console.log('PASS: drop from Kilisuci, identify/refill Damar Jurang, cross with X + Z, collect Wani with X + C, return upstairs and complete five candles.');
 // Petirtaan shares the reading handler but awards Jujur only after its puzzle.
 const pond=newCampaign();Object.assign(pond,{scene:'Petirtaan',checkpoint:2,serat:['Asih','Sabar'],pelita:true,sabar:true,drained:true,levers:[false,true,false],visited:['Prolog','Pasar','Petirtaan']});
 await page.evaluate(s=>localStorage.setItem('cahayakadiri_save',JSON.stringify(s)),pond);await page.reload();await page.locator('#continue').click();await page.waitForFunction(()=>window.__cahaya?.snapshot().scene==='Petirtaan');await dialogs();
 await move(1222);await page.keyboard.down('KeyX');await page.waitForFunction(()=>window.__cahaya.snapshot().mode==='puzzle');await page.keyboard.up('KeyX');
 for(const id of ['putri','kutukan','mbok','pulang'])await page.locator(`[data-relief="${id}"]`).click();await page.locator('#check-relief').click();await dialogs();assert.ok((await snap()).state.jujur);
 await page.screenshot({path:'test-results/relief-automatic.png'});assert.deepEqual(errors,[]);console.log('PASS: Petirtaan relief opens automatically and awards Jujur after solving.');
}catch(e){console.log('FAIL',await snap().catch(()=>null));await page.screenshot({path:'test-results/cave-regression-failure.png'});throw e;}finally{await browser.close();}
