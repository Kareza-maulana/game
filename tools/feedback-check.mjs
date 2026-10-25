import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {newCampaign,VALUES,SCENES} from '../src/campaign-model.mjs';

fs.mkdirSync('test-results',{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const reports=[];
let activePage=null;
async function dialogs(page){for(let i=0;i<30&&await page.locator('#next-dialog').isVisible();i++)await page.locator('#next-dialog').click();}
async function move(page,target){
  await page.evaluate(target=>new Promise(resolve=>{
    const start=window.__cahaya.snapshot().x,sign=start<target?1:-1,code=sign>0?'ArrowRight':'ArrowLeft';
    const emit=type=>window.dispatchEvent(new KeyboardEvent(type,{code,bubbles:true}));
    emit('keydown');const deadline=performance.now()+6000;
    function frame(){if((target-window.__cahaya.snapshot().x)*sign<3||performance.now()>deadline){emit('keyup');resolve();}else requestAnimationFrame(frame);}frame();
  }),target);
}
async function fixture({mobile=false,golden=false,read=true,storageBlocked=false,networkStatus=201,offline=false}={}){
  const context=await browser.newContext({viewport:mobile?{width:667,height:375}:{width:1280,height:800},hasTouch:mobile,isMobile:mobile});
  const page=await context.newPage(),errors=[],requests=[];activePage=page;page.on('pageerror',e=>errors.push(e.message));
  // Intercept all feedback requests: browser tests never insert real player/test comments.
  await page.route('https://hikhodkteetrfzswklxs.supabase.co/rest/v1/komentar',async route=>{
    if(route.request().method()==='OPTIONS'){await route.fulfill({status:204,headers:{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'apikey,authorization,content-type,prefer','Access-Control-Allow-Methods':'POST,OPTIONS'}});return;}
    requests.push({body:route.request().postDataJSON(),headers:route.request().headers()});
    if(offline){await route.abort('internetdisconnected');return;}
    await new Promise(resolve=>setTimeout(resolve,200));
    await route.fulfill({status:networkStatus,headers:{'Access-Control-Allow-Origin':'*'},body:networkStatus===201?'':JSON.stringify({code:'42501',message:'RLS denied'})});
  });
  const state=newCampaign();Object.assign(state,{scene:'Epilog',visited:SCENES,serat:VALUES,pelita:true,sabar:true,jujur:true,drained:true,kidung:golden?Array.from({length:12},(_,i)=>i+1):[]});state.quests.epilogueRead=read;
  await page.addInitScript(({state,storageBlocked})=>{
    localStorage.setItem('cahayakadiri_save',JSON.stringify(state));
    if(storageBlocked){const set=Storage.prototype.setItem;Storage.prototype.setItem=function(key,value){if(key.startsWith('cahayakadiri_feedback'))throw new DOMException('blocked','QuotaExceededError');return set.call(this,key,value);};}
  },{state,storageBlocked});
  await page.goto('http://127.0.0.1:3100');await page.locator('#continue').click();
  await page.waitForFunction(()=>window.__cahaya?.snapshot().scene==='Epilog');await dialogs(page);await page.waitForFunction(()=>window.__cahaya.snapshot().onFloor);
  return {context,page,errors,requests};
}
try{
  const normal=await fixture(),p=normal.page;
  await move(p,106);await p.keyboard.press('KeyC');
  await p.locator('#feedback-comment').waitFor();assert.equal(await p.evaluate(()=>window.__cahaya.snapshot().state.completed),true);
  assert.equal(await p.locator('#feedback-save').isDisabled(),true);
  const input=p.locator('#feedback-comment');await input.fill('   ');assert.equal(await p.locator('#feedback-save').isDisabled(),true);
  await input.fill('');await input.focus();
  const text='Suka cerita Kirana! C Z X J WASD, spasi dan baris baru.\nRelief bagus.';
  await p.keyboard.type(text);
  assert.equal(await input.inputValue(),text,'game keyboard shortcuts must not swallow text');
  const before=await p.evaluate(()=>window.__cahaya.snapshot());await p.waitForTimeout(200);const after=await p.evaluate(()=>window.__cahaya.snapshot());assert.equal(after.x,before.x);assert.equal(after.y,before.y);assert.equal(after.state.playSeconds,before.state.playSeconds);
  await p.locator('#feedback-save').click();
  await p.waitForFunction(()=>document.querySelector('#feedback-status').textContent.includes('berhasil dikirim'));
  assert.equal(await p.evaluate(()=>JSON.parse(localStorage.getItem('cahayakadiri_feedback')).comment),text);
  await p.waitForFunction(()=>document.querySelector('#feedback-status').textContent.includes('berhasil dikirim'));
  assert.equal(normal.requests.length,1);assert.deepEqual(normal.requests[0].body,{komentar:text});
  assert.equal(normal.requests[0].headers.prefer,'return=minimal');
  assert.ok(normal.requests[0].headers.apikey&&normal.requests[0].headers.authorization.startsWith('Bearer '));
  assert.ok(await p.evaluate(()=>JSON.parse(localStorage.getItem('cahayakadiri_feedback')).sentAt));
  assert.equal(await p.locator('#feedback-save').isDisabled(),true,'do not resend identical text');
  await p.screenshot({path:'test-results/feedback-desktop.png'});
  await p.keyboard.press('Escape');await p.locator('#end-feedback').waitFor();assert.equal(await p.evaluate(()=>window.__cahaya.snapshot().mode),'complete');
  await p.locator('#end-feedback').click();assert.equal(await input.inputValue(),text);
  await input.fill('<img src=x onerror=alert(1)>');await p.locator('#feedback-save').click();await p.waitForFunction(()=>document.querySelector('#feedback-status').textContent.includes('berhasil dikirim'));
  await p.locator('#feedback-later').click();await p.locator('#end-feedback').click();
  assert.equal(await input.inputValue(),'<img src=x onerror=alert(1)>');assert.equal(await p.locator('.feedback-panel img').count(),0);
  // Keyboard focus stays within the popup and returns to its opener on close.
  const home=p.locator('.feedback-panel .home-button');assert.equal(await home.getAttribute('href'),'https://login.ukmpp.or.id');
  await home.focus();await p.keyboard.press('Tab');assert.equal(await p.locator('#feedback-close').evaluate(el=>el===document.activeElement),true);
  await p.keyboard.press('Shift+Tab');assert.equal(await home.evaluate(el=>el===document.activeElement),true);
  await p.locator('#feedback-close').click();assert.equal(await p.locator('#end-feedback').evaluate(el=>el===document.activeElement),true);
  assert.equal(await p.locator('#ukm-link').getAttribute('href'),'https://login.ukmpp.or.id');
  await p.screenshot({path:'test-results/feedback-completion.png'});
  // Intercept navigation to verify the requested destination without contacting it.
  await p.route('https://login.ukmpp.or.id/**',route=>route.fulfill({status:200,contentType:'text/html',body:'Beranda pengujian'}));
  await p.locator('#ukm-link').click();await p.waitForURL('https://login.ukmpp.or.id/');
  assert.deepEqual(normal.errors,[]);reports.push('normal ending: auto popup, keyboard, save/update, safe text, focus, homepage navigation');await normal.context.close();

  const m=await fixture({mobile:true,golden:true}),mp=m.page;
  console.log('PASS desktop; testing golden ending on mobile');
  await move(mp,106);await mp.keyboard.press('KeyC');await mp.waitForFunction(()=>window.__cahaya.snapshot().mode!=='play');await dialogs(mp);await mp.locator('#feedback-comment').waitFor();
  for(const [width,height]of [[667,375],[568,320],[844,390]]){
    await mp.setViewportSize({width,height});await mp.waitForTimeout(150);
    await mp.locator('#feedback-comment').fill(`Tampilan mobile ${width} nyaman.`);
    await mp.locator('#feedback-save').scrollIntoViewIfNeeded();if(!await mp.locator('#feedback-save').isDisabled())await mp.locator('#feedback-save').tap();await mp.waitForFunction(()=>document.querySelector('#feedback-status').textContent.includes('berhasil dikirim'));
    await mp.locator('.feedback-panel .home-button').scrollIntoViewIfNeeded();assert.equal(await mp.locator('.feedback-panel .home-button').isVisible(),true);
    assert.equal(await mp.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    await mp.screenshot({path:`test-results/feedback-mobile-${width}.png`});
  }
  await mp.locator('#feedback-later').tap();assert.match(await mp.locator('.completion').innerText(),/ENDING EMAS/);
  assert.deepEqual(m.errors,[]);reports.push('golden ending and three mobile viewports: form, scrolling, save, completion');await m.context.close();

  const denied=await fixture({storageBlocked:true}),dp=denied.page;
  await move(dp,106);await dp.keyboard.press('KeyC');await dp.locator('#feedback-comment').fill('Masukan tidak boleh hilang.');await dp.locator('#feedback-save').click();
  await dp.waitForFunction(()=>document.querySelector('#feedback-status').textContent.includes('berhasil dikirim'));assert.equal(denied.requests.length,1);assert.equal(await dp.locator('#feedback-comment').inputValue(),'Masukan tidak boleh hilang.');assert.deepEqual(denied.errors,[]);
  reports.push('blocked local storage: remote submission still succeeds');await denied.context.close();

  for(const scenario of [{networkStatus:401},{offline:true}]){
    const f=await fixture(scenario),fp=f.page;await move(fp,106);await fp.keyboard.press('KeyC');
    await fp.locator('#feedback-comment').fill('Draf harus tetap tersedia.');await fp.locator('#feedback-save').click();
    await fp.waitForFunction(()=>!document.querySelector('#feedback-save').disabled);
    assert.match(await fp.locator('#feedback-status').innerText(),scenario.offline?/belum dapat dipastikan/:/belum diizinkan/);
    assert.equal(await fp.evaluate(()=>localStorage.getItem('cahayakadiri_feedback_draft')),'Draf harus tetap tersedia.');
    assert.equal(await fp.evaluate(()=>localStorage.getItem('cahayakadiri_feedback')),null);
    assert.equal(f.requests.length,1,'no automatic retries');
    await fp.locator('#feedback-close').click();await fp.locator('#end-feedback').click();
    assert.equal(await fp.locator('#feedback-comment').inputValue(),'Draf harus tetap tersedia.');
    await f.context.close();reports.push(scenario.offline?'network error retains draft':'RLS rejection retains draft');
  }
  const locked=await fixture({read:false}),lp=locked.page;
  await move(lp,106);await lp.keyboard.press('KeyC');await lp.waitForTimeout(150);
  assert.equal(await lp.locator('#feedback-comment').count(),0);assert.equal(await lp.evaluate(()=>window.__cahaya.snapshot().state.completed),false);assert.deepEqual(locked.errors,[]);
  reports.push('unfinished epilogue cannot trigger completion feedback');await locked.context.close();
  fs.writeFileSync('test-results/feedback-report.json',JSON.stringify(reports,null,2));console.log('PASS',reports);
}catch(error){
  if(activePage&&!activePage.isClosed()){
    console.log('Failure state:',await activePage.evaluate(()=>{const s=window.__cahaya?.snapshot();return {scene:s?.scene,mode:s?.mode,x:s?.x,dialog:document.querySelector('.dialog')?.innerText};}));
    await activePage.screenshot({path:'test-results/feedback-failure.png'});
  }
  throw error;
}finally{await browser.close();}
