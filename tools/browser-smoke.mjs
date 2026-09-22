import {chromium} from 'playwright-core';
import fs from 'node:fs';
fs.mkdirSync('test-results',{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--disable-gpu-sandbox']});
const page=await browser.newPage({viewport:{width:1440,height:900}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('/favicon.ico'))errors.push(r.status()+' '+r.url());});
try{
  await page.goto('http://127.0.0.1:3100');
  await page.getByRole('button',{name:'Masuki taman'}).waitFor({timeout:25000});
  await page.screenshot({path:'test-results/title.png'});
  await page.getByRole('button',{name:'Masuki taman'}).click();
  await page.getByRole('button',{name:'Lewati',exact:true}).click();
  await page.waitForTimeout(400);
  console.log('START',await page.evaluate(()=>window.__cahaya.snapshot()));
  await page.keyboard.down('ArrowRight');await page.waitForTimeout(620);await page.keyboard.up('ArrowRight');
  await page.keyboard.press('KeyC');
  await page.getByRole('button',{name:'Lewati',exact:true}).waitFor({timeout:3000});
  await page.screenshot({path:'test-results/ki-jati-dialog.png'});
  await page.getByRole('button',{name:'Lewati',exact:true}).click();
  await page.keyboard.press('KeyZ');await page.waitForTimeout(300);
  console.log('JUMP',await page.evaluate(()=>window.__cahaya.snapshot()));
  await page.waitForTimeout(900);
  await page.screenshot({path:'test-results/gameplay.png'});
  await page.keyboard.press('KeyJ');await page.getByRole('button',{name:'Kadiri',exact:true}).click();
  await page.screenshot({path:'test-results/journal.png'});
  console.log('ERRORS',errors);if(errors.length)throw new Error(errors.join('\n'));
}catch(error){console.log('ERRORS',errors);console.log((await page.locator('body').innerText()).slice(0,1000));await page.screenshot({path:'test-results/failure.png'});throw error;}finally{await browser.close();}
