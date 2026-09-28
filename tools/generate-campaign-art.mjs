import {spawn} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd(),python='C:/Users/po/.codex/skills/sprite-gen/.venv/Scripts/python.exe';
const requests=JSON.parse(fs.readFileSync('assets/prompts/campaign.json','utf8'));
const style='Handcrafted detailed 16-bit pixel art for Cahaya Kadiri, a 2D side-scrolling narrative platformer. Sharp stepped pixel edges, coherent restrained palette, atmospheric diorama lighting. No text, no UI, no labels, no watermark. ';
const entries=Object.entries(requests).filter(([name])=>!fs.existsSync(`assets/art/${name}.png`)&&!fs.existsSync(`assets/art/${name}.webp`)&&!['ki-jati','kilisuci'].includes(name));
fs.mkdirSync('assets/art',{recursive:true});
async function worker(){
  while(entries.length){
    const [name,r]=entries.shift();
    const prompt=style+(r.character?'One static isolated sprite on genuinely transparent background. '+r.character+' No ground plane, no drop shadow; generous transparent margin.':(r.vertical?'Vertical 2:3 composition, 1024x1536. ':'Wide 3:1 composition, 1536x512. ')+r.scene+' No characters. Strict side elevation, not isometric. This is a backdrop; leave midground clear for independently placed gameplay platforms.');
    const promptFile=path.join(root,`assets/prompts/${name}.txt`);
    fs.writeFileSync(promptFile,prompt);
    const args=['-m','sprite_gen.cli','gen','--provider','codex','--model','gpt-5.5','--prompt-file',promptFile,'--out',path.join(root,`assets/art/${name}.png`),'--report',path.join(root,`assets/art/${name}.report.json`)];
    if(r.character)args.push('--transparent','--trim-alpha');
    console.log('Generating',name);
    const code=await new Promise(resolve=>{const child=spawn(python,args,{cwd:root,env:{...process.env,PYTHONUTF8:'1'},windowsHide:true});let output='';child.stdout.on('data',v=>output+=v);child.stderr.on('data',v=>output+=v);child.on('error',e=>{console.log(name,e.message);resolve(1);});child.on('close',code=>{fs.writeFileSync(`assets/art/${name}.generation.log`,output);resolve(code);});});
    console.log(code===0?'Ready':'FAILED',name);if(code!==0)process.exitCode=1;
  }
}
await Promise.all([worker(),worker()]);
