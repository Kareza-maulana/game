import {chromium} from 'playwright-core';
import {newCampaign} from '../src/campaign-model.mjs';
const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const p=await b.newPage();p.on('console',m=>{if(m.type()!=='log')console.log(m.type(),m.text().slice(0,700));});p.on('pageerror',e=>console.log('ERROR',e.message));
p.on('response',r=>{if(r.status()>=400)console.log('HTTP',r.status(),r.url());});
const s=newCampaign();s.scene=process.argv[2]||'Prolog';await p.addInitScript(s=>localStorage.setItem('cahayakadiri_save',JSON.stringify(s)),s);
try{await p.goto('http://127.0.0.1:3100');await p.locator('#continue').click();await p.waitForTimeout(1500);console.log('BEFORE',await p.evaluate(()=>window.__cahaya.snapshot()));for(let i=0;i<12&&await p.locator('#next-dialog').isVisible();i++)await p.locator('#next-dialog').click();
await p.keyboard.press('KeyZ',{delay:100});await p.waitForTimeout(300);console.log('AFTER',await p.evaluate(()=>window.__cahaya.snapshot()));console.log('RENDER',await p.evaluate(()=>window.__ckRender()));await p.screenshot({path:'test-results/debug.png'});
}finally{await b.close();}
