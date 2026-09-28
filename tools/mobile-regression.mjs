import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {newCampaign,VALUES} from '../src/campaign-model.mjs';

const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const results=[];
async function device(viewport,api='denied',state=null){
  const context=await browser.newContext({viewport,hasTouch:true,isMobile:true,deviceScaleFactor:1});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  // Deterministic API contract tests; physical rotation still needs a phone.
  await page.addInitScript(({api,state})=>{
    window.__orientationCalls=[];
    Element.prototype.requestFullscreen=async()=>{
      window.__orientationCalls.push('fullscreen');
      if(api==='denied')throw new DOMException('Denied','NotAllowedError');
    };
    Object.defineProperty(screen.orientation,'lock',{configurable:true,value:async direction=>{
      window.__orientationCalls.push(direction);
      if(api==='denied')throw new DOMException('Unsupported','NotSupportedError');
    }});
    if(state)localStorage.setItem('cahayakadiri_save',JSON.stringify(state));
  },{api,state});
  await page.goto('http://127.0.0.1:3100');await page.locator('#start').waitFor({state:'attached'});
  return {context,page,errors};
}
const snap=page=>page.evaluate(()=>window.__cahaya.snapshot());
async function dialogs(page){for(let i=0;i<30&&await page.locator('#next-dialog').isVisible();i++)await page.locator('#next-dialog').tap();}
async function point(page,selector,id){const b=await page.locator(selector).boundingBox();assert.ok(b,selector);return {x:b.x+b.width/2,y:b.y+b.height/2,id};}
async function layout(page){
  const result=await page.evaluate(()=>{
    const boxes=[...document.querySelectorAll('#touch button,.hud-actions button')].filter(b=>b.getClientRects().length).map(b=>{const r=b.getBoundingClientRect();return {name:b.getAttribute('aria-label'),x:r.x,y:r.y,w:r.width,h:r.height};});
    const q=document.querySelector('#objective').getBoundingClientRect();
    return {boxes,quest:{x:q.x,y:q.y,w:q.width,h:q.height},w:innerWidth,h:innerHeight,overflow:document.documentElement.scrollWidth>innerWidth};
  });
  assert.equal(result.overflow,false);
  for(const b of result.boxes){assert.ok(b.w>=44&&b.h>=44,JSON.stringify(b));assert.ok(b.x>=0&&b.y>=0&&b.x+b.w<=result.w+1&&b.y+b.h<=result.h+1,JSON.stringify(b));}
  for(const [i,a] of result.boxes.entries())for(const b of result.boxes.slice(i+1))assert.ok(a.x+a.w<=b.x+.1||b.x+b.w<=a.x+.1||a.y+a.h<=b.y+.1||b.y+b.h<=a.y+.1,`${a.name} overlaps ${b.name}`);
  const a=result.quest;for(const b of result.boxes)assert.ok(a.x+a.w<=b.x+.1||b.x+b.w<=a.x+.1||a.y+a.h<=b.y+.1||b.y+b.h<=a.y+.1,`Quest overlaps ${b.name}`);
  return result;
}
try{
  const {context,page,errors}=await device({width:390,height:844});
  await page.locator('#rotate-device').waitFor({state:'visible'});
  assert.equal(await page.locator('#modal').evaluate(el=>el.inert),true);
  assert.ok((await page.evaluate(()=>window.__orientationCalls)).includes('landscape'),'automatic orientation attempt');
  await page.locator('#landscape-start').tap();
  await page.waitForFunction(()=>document.querySelector('#rotate-note').textContent.includes('aktifkan rotasi'));
  await page.screenshot({path:'test-results/mobile-portrait.png'});
  await page.setViewportSize({width:844,height:390});await page.locator('#rotate-device').waitFor({state:'hidden'});
  await page.locator('#start').tap();await dialogs(page);await page.waitForFunction(()=>window.__cahaya.snapshot().onFloor);
  const cdp=await context.newCDPSession(page),right=await point(page,'.touch-right',1),jump=await point(page,'.touch-jump',2);
  const before=await snap(page);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[right,jump]});
  await page.waitForFunction(({x,y})=>{const a=window.__cahaya.snapshot();return a.x>x+5&&a.y<y-8;},before);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});
  await page.waitForFunction(()=>window.__cahaya.snapshot().onFloor);await page.waitForTimeout(350);
  const stopped=await snap(page);await page.waitForTimeout(250);assert.ok(Math.abs((await snap(page)).x-stopped.x)<1,'pointer cancel releases movement');
  assert.equal(await page.locator('.held').count(),0);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[right]});
  await page.waitForTimeout(100);await page.setViewportSize({width:390,height:844});
  await page.locator('#rotate-device').waitFor({state:'visible'});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});
  const paused=await snap(page);await page.waitForTimeout(300);const still=await snap(page);
  assert.equal(still.mode,'pause');assert.equal(still.x,paused.x);assert.equal(still.y,paused.y);assert.equal(still.state.playSeconds,paused.state.playSeconds);
  await page.setViewportSize({width:844,height:390});await page.locator('#resume').tap();
  await page.waitForTimeout(350);const resumed=await snap(page);await page.waitForTimeout(250);assert.ok(Math.abs((await snap(page)).x-resumed.x)<1,'no stuck key after rotating');
  for(const [width,height]of [[844,390],[667,375],[568,320],[932,430],[1024,768]]){
    await page.setViewportSize({width,height});await page.waitForTimeout(200);await layout(page);
    await page.screenshot({path:`test-results/mobile-${width}x${height}.png`});
    await page.locator('#pause-button').tap();
    await page.locator('#resume').scrollIntoViewIfNeeded();await page.locator('#resume').tap();
  }
  assert.deepEqual(errors,[]);results.push({test:'portrait fallback, multi-touch jump, cancellation, rotation pause, 5 landscape sizes',pass:true});await context.close();

  const s=newCampaign();Object.assign(s,{scene:'Bukit',checkpoint:2,serat:VALUES.slice(0,5),pelita:true,sabar:true,jujur:true,drained:true,visited:['Prolog','Pasar','Petirtaan','Bukit']});s.quests.caveRead=true;
  const advanced=await device({width:844,height:390},'supported',s),p=advanced.page;
  await p.locator('#continue').tap();await p.waitForFunction(()=>window.__cahaya.snapshot().scene==='Bukit');await dialogs(p);await p.waitForFunction(()=>window.__cahaya.snapshot().onFloor);
  const calls=await p.evaluate(()=>window.__orientationCalls);assert.ok(calls.includes('fullscreen')&&calls.includes('landscape'),'gesture requests fullscreen and landscape');
  await layout(p);await p.locator('.touch-light').tap();await p.waitForFunction(()=>window.__cahaya.snapshot().shining);
  const advancedCdp=await advanced.context.newCDPSession(p),a=await snap(p);
  await advancedCdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[await point(p,'.touch-right',1),await point(p,'.touch-jump',2)]});
  await p.waitForFunction(({x,y})=>{const b=window.__cahaya.snapshot();return b.shining&&b.x>x+5&&b.y<y-8;},a);
  await advancedCdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await p.waitForFunction(()=>window.__cahaya.snapshot().onFloor);await p.waitForTimeout(250);
  await p.locator('.touch-light').tap();await p.waitForFunction(()=>!window.__cahaya.snapshot().shining);
  const oil=(await snap(p)).state.oil;
  await p.evaluate(()=>{window.__oilSamples=[];const until=performance.now()+600;function sample(){window.__oilSamples.push(window.__cahaya.snapshot().state.oil);if(performance.now()<until)requestAnimationFrame(sample);}sample();});
  await p.locator('.touch-pulse').tap();await p.waitForTimeout(200);
  assert.ok(Math.min(...await p.evaluate(()=>window.__oilSamples))<oil-3,'Kibas spends oil before the nearby Damar refills it');
  await p.locator('.touch-run').tap();assert.equal(await p.locator('.touch-run').getAttribute('aria-pressed'),'true');
  await p.locator('.touch-light').tap();await p.locator('#journal-button').tap();
  assert.equal(await p.locator('.touch-run').getAttribute('aria-pressed'),'false');assert.equal(await p.locator('.touch-light').getAttribute('aria-pressed'),'false');
  await p.locator('#close-journal').tap();await p.waitForTimeout(100);assert.equal((await snap(p)).shining,false);
  assert.doesNotMatch(await p.locator('#quest').innerText(),/\b[ZXC]\b|Shift/);
  await p.screenshot({path:'test-results/mobile-cave-controls.png'});
  // Every unlocked action still fits the smallest supported landscape viewport.
  await p.setViewportSize({width:568,height:320});await p.waitForTimeout(200);await layout(p);await p.screenshot({path:'test-results/mobile-cave-small.png'});
  assert.deepEqual(advanced.errors,[]);results.push({test:'fullscreen/lock contract, latched light + move + jump, Kibas, run, journal resets, mobile hints',pass:true});await advanced.context.close();
  fs.writeFileSync('test-results/mobile-regression.json',JSON.stringify(results,null,2));console.log('PASS',results);
}finally{await browser.close();}
