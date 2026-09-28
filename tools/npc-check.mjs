import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {newCampaign,VALUES} from '../src/campaign-model.mjs';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true}),results=[];
try{for(const [scene,node,count,checkpoint,seratCount,target] of [['Petirtaan','jati',6,0,1,104],['Bukit','kilisuci',10,2,4,520],['Gerbang','guard',6,0,5,84]]){
 const page=await browser.newPage({viewport:{width:1280,height:800}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const s=newCampaign();Object.assign(s,{scene,checkpoint,serat:VALUES.slice(0,seratCount),visited:['Prolog','Pasar','Petirtaan','Bukit','Gerbang'],pelita:scene!=='Petirtaan',sabar:scene!=='Petirtaan',jujur:scene!=='Petirtaan'});
 await page.addInitScript(state=>localStorage.setItem('cahayakadiri_save',JSON.stringify(state)),s);
 await page.goto('http://127.0.0.1:3100');await page.locator('#continue').click();await page.waitForFunction(scene=>window.__cahaya?.snapshot().scene===scene,scene);
 while(await page.locator('#next-dialog').isVisible())await page.locator('#next-dialog').click();
 await page.waitForFunction(()=>window.__cahaya.snapshot().onFloor);
 const samples=await page.evaluate(node=>new Promise(resolve=>{const samples=[],start=performance.now();function tick(){const n=window.__cahaya.snapshot().npcs.find(n=>n.node===node);samples.push(n);if(performance.now()-start>2800)resolve(samples);else requestAnimationFrame(tick);}tick();}),node);
 assert.equal(new Set(samples.map(n=>n.frame)).size,count,scene+' plays every supplied frame');
 assert.ok(samples.some((n,i)=>i&&n.frame<samples[i-1].frame),'loop wraps');
 assert.ok(samples.every(n=>Math.abs(n.y-samples[0].y)<.001&&Math.abs(n.height-samples[0].height)<.001&&Math.abs(n.width-samples[0].width)<.001),'stable canvas and ground anchor');
 await page.evaluate(target=>new Promise(resolve=>{const x=window.__cahaya.snapshot().x,sign=target>x?1:-1,key=sign>0?'ArrowRight':'ArrowLeft',event=type=>window.dispatchEvent(new KeyboardEvent(type,{code:key,bubbles:true}));if(Math.abs(target-x)<3){resolve();return;}event('keydown');function step(){if((target-window.__cahaya.snapshot().x)*sign<3){event('keyup');resolve();}else requestAnimationFrame(step);}step();}),target);
 await page.screenshot({path:`test-results/npc-${scene}.png`});
 await page.keyboard.press('KeyC');await page.waitForFunction(()=>window.__cahaya.snapshot().mode==='dialog');
 assert.match(await page.locator('.dialog').innerText(),new RegExp(scene==='Petirtaan'?'Ki Jati':scene==='Bukit'?'Kilisuci':'Penjaga'));
 while(await page.locator('#next-dialog').isVisible())await page.locator('#next-dialog').click();
 const state=await page.evaluate(()=>window.__cahaya.snapshot().state);
 if(scene==='Petirtaan')assert.ok(state.pelita,'Ki Jati gives Pelita');
 if(scene==='Gerbang')assert.equal(state.quests.guardTalk,1,'Guard dialogue increments clue help');
 assert.deepEqual(errors,[]);results.push({scene,node,frames:count,samples:samples.length,anchorStable:true,interaction:true,errors});console.log('PASS',scene,count,'frames, stable anchor, NPC interaction');await page.close();
}fs.writeFileSync('test-results/npc-report.json',JSON.stringify(results,null,2));}finally{await browser.close();}
