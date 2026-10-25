import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {storyArt} from './story-art.mjs';

export function storyAssets(){
  const board=JSON.parse(fs.readFileSync('src/storyboard.json','utf8'));
  board.assets={};
  for(const[id,item]of Object.entries(storyArt)){
    const file=`assets/story/${id}.webp`,report=`assets/story/${id}.verified.json`;
    if(!fs.existsSync(file)||!fs.existsSync(report))throw new Error('Story art not ready: '+id);
    const verified=JSON.parse(fs.readFileSync(report,'utf8'));
    if(createHash('sha256').update(fs.readFileSync(file)).digest('hex')!==verified.sha256)throw new Error('Story art changed: '+id);
    board.assets[id]={title:item.title,kind:item.kind,url:`story/${id}.webp`};
  }
  for(const id of [...Object.values(board.chapters),...Object.values(board.portraits),...Object.values(board.sequences).flatMap(seq=>seq.map(([,id])=>id))])if(!board.assets[id])throw new Error('Unknown storyboard asset: '+id);
  return board;
}
export function exportStoryAssets(destination){
  const board=storyAssets(),dir=path.join(destination,'story');fs.mkdirSync(dir,{recursive:true});
  for(const id of Object.keys(board.assets))fs.copyFileSync(`assets/story/${id}.webp`,path.join(dir,`${id}.webp`));
  return Object.keys(board.assets).length;
}
