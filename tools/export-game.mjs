import fs from 'node:fs';
import path from 'node:path';
import {exportProject} from 'gdcore-tools';

function files(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>{const p=path.join(dir,e.name);if(e.isSymbolicLink())throw new Error('Refusing symlink: '+p);return e.isDirectory()?files(p):[p];});}
export function exportGame(project,root){
  const stage=path.resolve(root,'.build-dist-next'),destination=path.resolve(root,'dist');
  // Both cleanup targets are fixed children of this project, never caller paths.
  for(const dir of [stage,destination])if(path.dirname(dir)!==path.resolve(root)||fs.existsSync(dir)&&fs.lstatSync(dir).isSymbolicLink())throw new Error('Unsafe export directory: '+dir);
  if(fs.existsSync(stage))throw new Error('Previous staging export exists; inspect .build-dist-next before rebuilding.');
  fs.mkdirSync(stage);
  try{
    exportProject(project,stage);
    fs.copyFileSync('src/site-config.json',path.join(stage,'site-config.json'));
    const index=path.join(stage,'index.html');
    fs.writeFileSync(index,fs.readFileSync(index,'utf8').replace('user-scalable=no','user-scalable=no, viewport-fit=cover'));
    for(let i=0;i<9;i++)if(!fs.readFileSync(path.join(stage,`code${i}.js`),'utf8').includes('createCampaignGame'))throw new Error('Missing scene '+i);
    const output=files(stage),bytes=output.reduce((sum,p)=>sum+fs.statSync(p).size,0);
    if(bytes>=100_000_000)throw new Error(`Game exceeds the 100 MB budget: ${bytes} bytes`);
    fs.mkdirSync(destination,{recursive:true});
    const keep=new Set(output.map(p=>path.relative(stage,p))),stale=files(destination).filter(p=>!keep.has(path.relative(destination,p)));
    // Publish the complete export before removing only identified stale files.
    for(const file of output){const target=path.join(destination,path.relative(stage,file));fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(file,target);}
    const removed=stale.map(p=>({file:path.relative(root,p),bytes:fs.statSync(p).size}));
    for(const file of stale){if(!file.startsWith(destination+path.sep))throw new Error('Outside dist');fs.unlinkSync(file);}
    fs.writeFileSync('docs/build-size.json',JSON.stringify({bytes,megabytes:bytes/1e6,limitBytes:100_000_000,files:output.length,staleRemoved:removed},null,2));
    console.log(`Clean export: ${(bytes/1e6).toFixed(2)} MB; ${stale.length} stale files removed; budget <100 MB.`);
  }finally{fs.rmSync(stage,{recursive:true,force:true});}
}
