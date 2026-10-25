import fs from 'node:fs';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {storyArt,storyPrompt} from './story-art.mjs';
const root=process.cwd(),python='C:/Users/po/.codex/skills/sprite-gen/.venv/Scripts/python.exe';
for(const dir of ['assets/story','assets/prompts/story','.tools/story-work'])fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync('assets/prompts/story/manifest.json',JSON.stringify(storyArt,null,2));
const selected=process.argv.slice(2).filter(a=>!a.startsWith('--'));
const queue=Object.entries(storyArt).filter(([id])=>(!selected.length||selected.includes(id))&&!fs.existsSync(`assets/story/${id}.verified.json`));
let halted=false;
async function run(args,log){return new Promise(resolve=>{const child=spawn(python,['-X','utf8',...args],{cwd:root,windowsHide:true});let output='';child.stdout.on('data',v=>output+=v);child.stderr.on('data',v=>output+=v);child.on('error',e=>{output+=e.message;});child.on('close',code=>{if(log)fs.writeFileSync(log,output);else if(output)console.log(output.trim());resolve(code);});});}
async function worker(){while(queue.length&&!halted){
  const[id,item]=queue.shift(),file=`.tools/story-work/${id}.png`,prompt=`assets/prompts/story/${id}.txt`;
  fs.writeFileSync(prompt,storyPrompt(item));console.log('Generating',id);
  const args=['-m','sprite_gen.cli','gen','--provider','codex','--prompt-file',path.resolve(prompt),'--out',path.resolve(file),'--report',path.resolve(`assets/story/${id}.generation.json`)];
  for(const ref of item.refs)args.push('--ref',path.resolve(ref));
  if(item.kind==='portrait')args.push('--transparent','--alpha-mode','native','--trim-alpha');
  let code=await run(args,`assets/story/${id}.generation.log`);
  if(code===0)code=await run(['tools/export-story-art.py',id,item.kind]);
  console.log(code===0?'Ready':'FAILED',id);if(code!==0){process.exitCode=1;halted=true;}
}}
await Promise.all(Array.from({length:4},worker));
