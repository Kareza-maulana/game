import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
import fs from 'node:fs';
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
 const s=newCampaign();Object.assign(s,{scene:'Bukit',checkpoint:2,serat:['Asih','Sabar','Jujur','Wani','Andhap'],pelita:true,sabar:true,jujur:true,drained:true,visited:['Prolog','Pasar','Petirtaan','Bukit']});Object.assign(s.quests,{caveRead:true,candles:[0,1,2,3,4],escaped:true});
 await page.addInitScript(s=>{if(!localStorage.getItem('cahayakadiri_save'))localStorage.setItem('cahayakadiri_save',JSON.stringify(s));},s);
 async function resume(){await page.locator('#continue').click();await page.waitForFunction(()=>window.__cahaya?.snapshot().scene==='Bukit');await dialogs();await page.waitForFunction(()=>window.__cahaya.snapshot().onFloor);}
 await page.goto('http://127.0.0.1:3100');await resume();await move(544);await wait(800);
 const frames=await page.evaluate(()=>new Promise(resolve=>{
  const frames=[],start=performance.now();let jumps=0,lastFloor=true;
  function frame(){const a=window.__cahaya.snapshot();frames.push({y:a.y,cy:a.camera.y,cx:a.camera.x});if(a.onFloor&&(!lastFloor||jumps===0)&&jumps<3){jumps++;window.dispatchEvent(new KeyboardEvent('keydown',{code:'KeyZ'}));requestAnimationFrame(()=>window.dispatchEvent(new KeyboardEvent('keyup',{code:'KeyZ'})));}lastFloor=a.onFloor;
   if((jumps===3&&a.onFloor&&frames.length>120)||performance.now()-start>12000){resolve(frames);return;}requestAnimationFrame(frame);}frame();
 }));
 assert.ok(Math.max(...frames.map(f=>f.y))-Math.min(...frames.map(f=>f.y))>70,'actual jumps occurred');assert.ok(Math.max(...frames.map(f=>f.cy))-Math.min(...frames.map(f=>f.cy))<=1,'ordinary jumps keep the camera level');
 await wait(1200);let a=await snap();assert.equal(a.audio.context,'running');assert.ok(a.audio.stats.landings>=2);assert.ok(a.audio.stats.music>0&&a.audio.stats.nature>0);assert.equal(a.audio.loops,3);assert.ok(a.audio.rms>0.00001);
 console.log('CAMERA',frames.length,'frames; vertical travel',Math.max(...frames.map(f=>f.cy))-Math.min(...frames.map(f=>f.cy)),'AUDIO',a.audio);
 await page.keyboard.press('Escape');await page.locator('[data-audio="effects"]').evaluate(el=>{el.value='35';el.dispatchEvent(new Event('input',{bubbles:true}));});await page.locator('#sound-toggle').click();await wait(600);assert.ok((await snap()).audio.rms<.00001);assert.equal((await snap()).audio.settings.effects,.35);await page.screenshot({path:'test-results/audio-settings.png'});
 await page.reload();await resume();assert.equal((await snap()).audio.settings.muted,true);assert.equal((await snap()).audio.settings.effects,.35);await page.keyboard.press('Escape');await page.locator('#sound-toggle').click();await page.locator('#resume').click();
 await move(748);await jumpTo(820);await jumpTo(730);await jumpTo(820);await jumpTo(850);
 for(let i=0;i<14;i++){const start=1024+i*256;await move(start-98);await jumpTo(start-4,true);if([1,7,13].includes(i)){await wait(300);await page.screenshot({path:'test-results/escape-scenery-'+i+'.png'});}}
 await move(4490);assert.equal((await snap()).audio.zone,'valley');await press('KeyC');await page.waitForFunction(()=>window.__cahaya.snapshot().scene==='Gerbang');await dialogs();await wait(600);a=await snap();assert.equal(a.audio.zone,'gate');assert.equal(a.audio.loops,3);assert.ok(a.audio.voices<=40);assert.deepEqual(errors,[]);
 fs.writeFileSync('test-results/polish-report.json',JSON.stringify({cameraVerticalTravel:Math.max(...frames.map(f=>f.cy))-Math.min(...frames.map(f=>f.cy)),jumpFrames:frames.length,audio:a.audio,errors},null,2));
 console.log('PASS: repeated jumps, audio output/mute/settings persistence, full escape scenery route and scene audio transition.');
}catch(e){console.log('FAIL',await snap().catch(()=>null),errors);await page.screenshot({path:'test-results/polish-failure.png'});throw e;}finally{await browser.close();}

