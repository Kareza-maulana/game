import {spawn} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd(),python='C:/Users/po/.codex/skills/sprite-gen/.venv/Scripts/python.exe';
const requests=Object.entries(JSON.parse(fs.readFileSync('assets/prompts/terrain-rich.json','utf8'))).filter(([name])=>!fs.existsSync(`assets/art/${name}.png`));
async function worker(){for(;;){const entry=requests.shift();if(!entry)return;const[name,r]=entry;const prompt=path.resolve(`assets/prompts/${name}.txt`);fs.writeFileSync(prompt,r.prompt);console.log('Generating',name);
 const args=['-X','utf8','-m','sprite_gen.cli','gen','--provider','codex','--model','gpt-5.5','--prompt-file',prompt,'--ref',path.resolve(r.ref),'--out',path.resolve(`assets/art/${name}.png`),'--report',path.resolve(`assets/art/${name}.report.json`)];
 const code=await new Promise(resolve=>{const child=spawn(python,args,{cwd:root,windowsHide:true});let log='';child.stdout.on('data',v=>log+=v);child.stderr.on('data',v=>log+=v);child.on('error',e=>{log+=e.message;resolve(1);});child.on('close',code=>{fs.writeFileSync(`assets/art/${name}.generation.log`,log);resolve(code);});});console.log(code===0?'Ready':'FAILED',name);if(code!==0)process.exitCode=1;
}}
await Promise.all([worker(),worker(),worker()]);
