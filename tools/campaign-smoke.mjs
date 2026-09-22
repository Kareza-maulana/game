import {chromium} from 'playwright-core';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {newCampaign,VALUES,SCENES} from '../src/campaign-model.mjs';
fs.mkdirSync('test-results',{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const errors=[];
try{for(const name of SCENES){
 const page=await browser.newPage({viewport:{width:1280,height:800}});page.on('pageerror',e=>errors.push(name+': '+e.message));page.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('/favicon.ico'))errors.push(r.status()+' '+r.url());});
 const s=newCampaign();s.scene=name;s.visited=SCENES.slice(0,SCENES.indexOf(name)+1);s.serat=VALUES.slice(0,[0,0,1,3,5,6,6,7,7][SCENES.indexOf(name)]);s.pelita=s.serat.length>1;s.sabar=s.serat.includes('Sabar');s.jujur=s.serat.includes('Jujur');s.drained=s.jujur;
 await page.addInitScript(state=>localStorage.setItem('cahayakadiri_save',JSON.stringify(state)),s);
 await page.goto('http://127.0.0.1:3100');await page.getByRole('button',{name:'Lanjutkan perjalanan',exact:true}).click();
 await page.waitForFunction(n=>window.__cahaya?.snapshot().scene===n,name);
 while(await page.locator('#next-dialog').isVisible()){await page.locator('#next-dialog').click();}
 await page.waitForTimeout(300);assert.equal(await page.evaluate(()=>window.__cahaya.snapshot().mode),'play');
 const canvas=await page.locator('canvas').boundingBox();assert.ok(Math.abs(canvas.width-1280)<2&&Math.abs(canvas.height-800)<2,`${name}: canvas must fill window ${JSON.stringify(canvas)}`);
 await page.keyboard.down('ArrowRight');await page.waitForTimeout(150);await page.keyboard.up('ArrowRight');await page.keyboard.press('KeyZ');await page.waitForTimeout(200);
 console.log(name,await page.evaluate(()=>({x:window.__cahaya.snapshot().x,y:window.__cahaya.snapshot().y})));
 await page.screenshot({path:`test-results/campaign-${name}.png`});await page.close();
 }assert.deepEqual(errors,[]);console.log('PASS: nine scenes fill the window, run physics and render without browser errors.');
}finally{console.log('ERRORS',errors);await browser.close();}
