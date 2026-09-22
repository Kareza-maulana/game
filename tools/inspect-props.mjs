import fs from 'node:fs';
import {chromium} from 'playwright-core';
const names=process.argv.slice(2);
const rows=names.map(name=>`<section><h2>${name}</h2>${['.png.raw.png','.png'].map(ext=>{const p=`assets/art/prop-${name}${ext}`;return fs.existsSync(p)?`<img src="data:image/png;base64,${fs.readFileSync(p).toString('base64')}"/>`:'missing';}).join('')}</section>`).join('');
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
try{const page=await browser.newPage({viewport:{width:1200,height:Math.min(2000,names.length*320)}});await page.setContent(`<style>body{background:#243131;color:#eee;font:16px sans-serif}section{height:305px}h2{margin:5px}img{width:560px;height:260px;object-fit:contain;background:#4a5151;margin-right:12px}</style>${rows}`);await page.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(i=>i.decode())));console.log(await page.locator('img').evaluateAll(imgs=>imgs.map(i=>({w:i.naturalWidth,h:i.naturalHeight}))));await page.screenshot({path:'test-results/props-contact.png',fullPage:true});}finally{await browser.close();}
