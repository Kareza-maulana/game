import fs from 'node:fs';
import {chromium} from 'playwright-core';
const entries=fs.readdirSync('assets/story').filter(f=>f.endsWith('.webp'));
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
try{
  for(const kind of ['scene','portrait']){
    const files=entries.filter(f=>f.startsWith('portrait-')===(kind==='portrait'));
    const page=await browser.newPage({viewport:{width:1280,height:900}});
    const items=files.map(f=>`<article><h2>${f}</h2><img src="data:image/webp;base64,${fs.readFileSync('assets/story/'+f).toString('base64')}"></article>`).join('');
    await page.setContent(`<style>body{margin:12px;background:#20372f;color:#f4e4c3;font:12px system-ui;display:grid;grid-template-columns:repeat(4,1fr);gap:12px}article{margin:0}h2{font-size:12px;margin:3px 0}img{width:100%;height:${kind==='portrait'?290:172}px;object-fit:contain;background:#152b24}</style>${items}`);
    await page.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(i=>i.decode())));
    await page.screenshot({path:`test-results/story-contact-${kind}.jpg`,type:'jpeg',quality:88,fullPage:true});await page.close();
  }
}finally{await browser.close();}
