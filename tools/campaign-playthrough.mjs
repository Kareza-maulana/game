import {chromium} from 'playwright-core';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {MANUSCRIPT} from '../src/campaign-model.mjs';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const page=await browser.newPage({viewport:{width:960,height:540}}),errors=[];
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
async function climb(x,y){await move(x);let a=await snap();const key=y<a.y?'ArrowUp':'ArrowDown';await page.keyboard.down(key);const until=Date.now()+7000;while(Date.now()<until){await wait(70);a=await snap();if(key==='ArrowUp'?a.y<=y:a.y>=y)break;}await page.keyboard.up(key);await wait(100);console.log('CLIMB',Math.round(a.x),Math.round(a.y));assert.ok(Math.abs(a.y-y)<30,'Ladder height '+y);}
async function interact(){await press('KeyC');await wait(120);}
async function scene(name){await page.waitForFunction(n=>window.__cahaya?.snapshot().scene===n,name,{timeout:15000});await dialogs();await wait(250);fs.writeFileSync(`test-results/save-${name}.json`,JSON.stringify((await snap()).state,null,2));console.log('SCENE',name);}
async function checkpoint(){await page.keyboard.press('Escape');await page.locator('#return-damar').click();await wait(400);}
async function ring(index){await wait(1100);await page.evaluate(index=>new Promise((resolve,reject)=>{const start=window.__cahaya.snapshot().state.playSeconds;let first=false,second=false;const tap=code=>{window.dispatchEvent(new KeyboardEvent('keydown',{code,bubbles:true}));requestAnimationFrame(()=>window.dispatchEvent(new KeyboardEvent('keyup',{code,bubbles:true})));};tap('KeyC');function frame(){const s=window.__cahaya.snapshot(),t=s.state.playSeconds-start;if(t>.08&&!first){first=true;tap('KeyZ');}if(t>.3&&!second){second=true;tap('KeyZ');}if(s.state.quests.bells.length>index){resolve();return;}if(t>3){reject(Error('Bell '+index+' missed'));return;}requestAnimationFrame(frame);}requestAnimationFrame(frame);}),index);await wait(1000);}
try{
 const resume=process.argv[2];let startScene='Prolog';if(resume){const saved=JSON.parse(fs.readFileSync(`test-results/save-${resume}.json`));startScene=saved.scene;await page.addInitScript(s=>{if(!localStorage.getItem('cahayakadiri_save'))localStorage.setItem('cahayakadiri_save',JSON.stringify(s));},saved);}
 await page.goto('http://127.0.0.1:3100');await page.locator(resume?'#continue':'#start').click();await scene(startScene);
 if((await snap()).scene==='Prolog'){
  await move(170);await interact();await climb(832,347);await move(400);await interact();await climb(832,187);await move(672);await interact();assert.equal((await snap()).state.quests.books.length,3);await move(112);await interact();await dialogs();await scene('Pasar');
 }
 if((await snap()).scene==='Pasar'){
  if(!(await snap()).state.quests.chase){await move(124);await interact();await dialogs();await move(348);await interact();await climb(288,411);await move(490);await interact();await move(688);await climb(688,315);await move(762);await interact();await dialogs();}
  fs.writeFileSync('test-results/save-Pasar-atap.json',JSON.stringify((await snap()).state));const roofStart=(await snap()).x>5200?17:(await snap()).x>900?1:0;
  for(let i=roofStart;i<17;i++){const start=896+i*256;await move(start-98);await jumpTo(start-4);if(i%5===0)console.log('CHASE',i,(await snap()).chaseTime);}
  if((await snap()).x<5200)await jumpTo(5280);await move(5360);fs.writeFileSync('test-results/save-Pasar-dermaga.json',JSON.stringify((await snap()).state));if((await snap()).y<490){await page.keyboard.down('ArrowDown');await press('KeyZ');await wait(1000);await page.keyboard.up('ArrowDown');}await interact();await page.locator('[data-choice="0"]').click();await dialogs();assert.ok((await snap()).state.serat.includes('Asih'));await move(5400);await interact();await scene('Petirtaan');
 }
 if((await snap()).scene==='Petirtaan'){
  if(!(await snap()).state.sabar){await move(124);await interact();await dialogs();await move(211);await interact();await move(362);await jumpTo(486);await move(748);await interact();await move(650);await jumpTo(500);await page.waitForFunction(()=>window.__cahaya.snapshot().mode==='dialog',null,{timeout:20000});await dialogs();assert.ok((await snap()).state.sabar);}
  if(!(await snap()).state.drained){await jumpTo(362);await jumpTo(211);await interact();await move(362);await jumpTo(486);await interact();await move(748);await interact();assert.ok((await snap()).state.drained);}
  fs.writeFileSync('test-results/save-Petirtaan-jembatan.json',JSON.stringify((await snap()).state));await move(748);await jumpTo(877);await page.keyboard.down('KeyX');await jumpTo(950);await jumpTo(1020);await jumpTo(1120);await page.keyboard.up('KeyX');await move(1222);await page.keyboard.down('KeyX');await page.waitForFunction(()=>window.__cahaya.snapshot().mode==='puzzle');await page.keyboard.up('KeyX');
  for(const id of ['putri','kutukan','mbok','pulang'])await page.locator(`[data-relief="${id}"]`).click();await page.locator('#check-relief').click();await dialogs();assert.ok((await snap()).state.jujur);await move(1450);await interact();await scene('Bukit');
 }
 if((await snap()).scene==='Bukit'){
  for(const [edge,x]of [[135,180],[262,306],[390,433]]){await move(edge);await jumpTo(x);}
  await jumpTo(454);await move(644);await page.keyboard.down('KeyX');await jumpTo(700);await jumpTo(768);await jumpTo(817);await interact();await page.keyboard.up('KeyX');await dialogs();assert.ok((await snap()).state.serat.includes('Wani'));
  await checkpoint();await jumpTo(352,true);await jumpTo(230,true);await move(268);await jumpTo(365,true);await jumpTo(560,true);await interact();await dialogs();await move(635);await page.keyboard.down('KeyX');await page.waitForFunction(()=>window.__cahaya.snapshot().state.quests.caveRead);await page.keyboard.up('KeyX');await dialogs();await move(748);await interact();
  for(let i=0;i<5;i++)await page.locator(`[data-choice="${i}"]`).click();await dialogs();assert.ok((await snap()).state.serat.includes('Andhap'));
  await jumpTo(820);assert.ok((await snap()).y<325);await jumpTo(730);assert.ok((await snap()).y<277);await jumpTo(820);assert.ok((await snap()).y<229);await jumpTo(850);assert.ok((await snap()).y<165);assert.ok((await snap()).escapeTime>0);
  for(let i=0;i<14;i++){const start=1024+i*256;await move(start-98);await jumpTo(start-4,true);}
  await move(4490);await interact();await scene('Gerbang');
 }
 if((await snap()).scene==='Gerbang'){
  await jumpTo(170,true);await interact();await move(344);await wait(800);await interact();await dialogs();await jumpTo(480,true);await interact();await dialogs();await jumpTo(610,true);await jumpTo(726,true);await jumpTo(845,true);await wait(1200);await page.keyboard.down('ArrowDown');await page.waitForFunction(()=>window.__cahaya.snapshot().stealthTime>2.1,null,{timeout:10000});await interact();await page.keyboard.up('ArrowDown');assert.ok((await snap()).state.quests.key);
  await move(740);await wait(900);await interact();await dialogs();await move(950);await page.keyboard.down('KeyX');await page.waitForFunction(()=>window.__cahaya.snapshot().state.quests.clues.includes(3));await page.keyboard.up('KeyX');await dialogs();assert.equal((await snap()).state.quests.clues.length,4);
  await jumpTo(710,true);await jumpTo(610,true);await wait(900);await interact();for(const[i,n]of [[0,1],[1,2],[2,2],[3,1]])for(let j=0;j<n;j++)await page.locator(`[data-dial="${i}"]`).click();await page.locator('#gate-check').click();await dialogs();assert.ok((await snap()).state.serat.includes('Setya'));await move(1180);await interact();await scene('Kedaton');
 }
 if((await snap()).scene==='Kedaton'){
  if((await snap()).state.quests.bells.length<3){
  if(!(await snap()).state.quests.tapakTrapped){await move(269);await page.waitForFunction(()=>Math.abs(window.__cahaya.snapshot().footX-272)<80,null,{timeout:10000});await interact();assert.ok((await snap()).state.quests.tapakTrapped);await jumpTo(235,true);await move(300);await jumpTo(449,true);}
  await ring(0);assert.equal((await snap()).state.quests.bells.length,1);
  await move(614);await jumpTo(738,true);await ring(1);assert.equal((await snap()).state.quests.bells.length,2);
  await move(823);await page.keyboard.down('KeyX');await jumpTo(880,true);await jumpTo(950,true);await jumpTo(1016,true);await jumpTo(1090,true);await page.keyboard.up('KeyX');await climb(1088,252);await move(1131);await ring(2);await dialogs();assert.equal((await snap()).state.quests.bells.length,3);
  }
  await move(1200);await jumpTo(1300,true);assert.ok((await snap()).y<180,'Land on the pusaka loft');await interact();await dialogs();await move(1325);await interact();await scene('Bangsal');
 }
 if((await snap()).scene==='Bangsal'){
  await move(170);await page.keyboard.down('KeyX');await interact();await move(219);await jumpTo(278,true);await jumpTo(374,true);await jumpTo(480,true);await interact();await move(609);await interact();await jumpTo(719,true);await jumpTo(817,true);await jumpTo(990,true);await interact();await page.keyboard.up('KeyX');await dialogs();assert.equal((await snap()).state.serat.length,7);
  await move(1052);await interact();for(const i of [1,0,2])await page.locator(`[data-choice="${i}"]`).click();await dialogs();await interact();await scene('Putri');
 }
 if((await snap()).scene==='Putri'){
  await move(397);await interact();for(const m of MANUSCRIPT)await page.locator(`[data-relief="${m.id}"]`).click();await page.locator('#check-relief').click();await dialogs();assert.ok((await snap()).state.quests.manuscript);await move(848);await interact();await scene('Epilog');
 }
 if((await snap()).scene==='Epilog'){
  await move(330);await interact();await dialogs();await move(111);await interact();await dialogs();assert.equal((await snap()).state.completed,true);assert.equal((await snap()).mode,'complete');fs.writeFileSync('test-results/save-completed.json',JSON.stringify((await snap()).state));console.log('PASS: complete campaign through keyboard/pointer interactions.');
 }
 console.log('CURRENT',await snap());assert.deepEqual(errors,[]);await page.screenshot({path:'test-results/campaign-route.png'});
}catch(e){const failure=await snap().catch(()=>null);console.log('FAIL',failure,'ERRORS',errors);if(failure)fs.writeFileSync('test-results/save-failure.json',JSON.stringify(failure.state));await page.screenshot({path:'test-results/campaign-route-failure.png'});throw e;}finally{await browser.close();}
