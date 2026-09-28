import fs from 'node:fs';
import {createHash} from 'node:crypto';

const manifestPath='assets/optimized-manifest.json';
const images=fs.existsSync(manifestPath)?JSON.parse(fs.readFileSync(manifestPath,'utf8')).images:{};
const resolved=new Map();
// Resource names remain stable for scene data and generation tools. Only the
// files loaded by GDevelop change. A newly generated PNG overrides an old WebP.
export function assetFile(logical){
  if(resolved.has(logical))return resolved.get(logical);
  const entry=images[logical];let file=logical;
  if(entry&&fs.existsSync(entry.file)){
    const unchanged=!fs.existsSync(logical)||createHash('sha256').update(fs.readFileSync(logical)).digest('hex')===entry.source_sha256;
    if(unchanged)file=entry.file;
  }
  if(!fs.existsSync(file))throw new Error('Required asset missing: '+logical);
  resolved.set(logical,file);return file;
}
export function assetSize(logical){
  const file=assetFile(logical),entry=images[logical];
  if(entry&&file===entry.file)return entry.size;
  const bytes=fs.readFileSync(file);
  if(bytes.toString('ascii',1,4)!=='PNG')throw new Error('Image dimensions absent: '+file);
  return [bytes.readUInt32BE(16),bytes.readUInt32BE(20)];
}
