import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const context=await browser.newContext({viewport:{width:844,height:390},hasTouch:true,isMobile:true,deviceScaleFactor:1});
const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
  await page.goto('http://127.0.0.1:3100');await page.locator('#start').click();while(await page.locator('#next-dialog').isVisible())await page.locator('#next-dialog').click();
  const right=page.getByRole('button',{name:'Bergerak kanan',exact:true});assert.equal(await right.isVisible(),true);
  const pos=await right.boundingBox(),cdp=await context.newCDPSession(page);
  const before=await page.evaluate(()=>window.__cahaya.snapshot());
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:pos.x+pos.width/2,y:pos.y+pos.height/2}]});
  await page.waitForTimeout(900);await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForTimeout(100);
  const after=await page.evaluate(()=>window.__cahaya.snapshot());assert.ok(after.x>before.x+30);
  await page.getByRole('button',{name:'Interaksi',exact:true}).tap();await page.waitForTimeout(150);
  assert.ok((await page.evaluate(()=>window.__cahaya.snapshot())).state.quests.books.includes(0));
  await page.getByRole('button',{name:'Jeda permainan'}).tap();const paused=await page.evaluate(()=>window.__cahaya.snapshot());
  await page.waitForTimeout(400);const pausedLater=await page.evaluate(()=>window.__cahaya.snapshot());assert.equal(pausedLater.x,paused.x);assert.equal(pausedLater.y,paused.y);
  await page.getByRole('button',{name:'Lanjutkan perjalanan'}).tap();
  await page.screenshot({path:'test-results/mobile.png'});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth),false);
  assert.deepEqual(errors,[]);console.log('PASS: touch movement, touch interaction, mobile layout, pause freezes physics.');
}catch(e){await page.screenshot({path:'test-results/mobile-failure.png'});console.log(errors);throw e;}finally{await browser.close();}
