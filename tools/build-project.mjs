import fs from 'node:fs';
import path from 'node:path';
import { gd, loadProject, exportProject, gd_internal_logs } from 'gdcore-tools';
import level from '../src/level.mjs';
const root=process.cwd();
fs.mkdirSync('assets/system',{recursive:true});
const svg=(name,w,h,body)=>{
  const file=`assets/system/${name}.svg`;
  fs.writeFileSync(file,`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`); return file;
};
export const art={
  Stone:svg('stone',32,32,'<path fill="#263d37" d="M0 0h32v32H0z"/><path fill="#8fa58a" d="M0 0h32v3H0z"/><path fill="#607b62" d="M0 3h32v3H0z"/><path fill="#182c29" d="M0 16h32v2H0zM15 6h2v10h-2zM5 18h2v14H5zM26 18h2v14h-2z"/><path fill="#496151" d="M2 7h11v2H2zM19 20h9v2h-9zM8 24h6v1H8z"/><path fill="#9eab66" d="M0 0h8v2H0zM18 0h10v2H18zM4 2h2v4H4z"/>'),
  Faded:svg('faded',48,12,'<path fill="#394f58" d="M0 0h48v12H0z"/><path fill="#b2ddcb" d="M0 0h48v3H0z"/><path fill="#6a9691" d="M4 5h8v2H4zM25 6h18v2H25z"/>'),
  Raft:svg('raft',80,12,'<path fill="#382f25" d="M0 0h80v12H0z"/><path fill="#b4965f" d="M0 0h80v3H0z"/><path stroke="#d8bd80" stroke-width="2" d="M8 0v12M70 0v12"/><path stroke="#716040" d="M0 7h80"/>'),
  Lever:svg('lever',16,24,'<path fill="#526f64" d="M1 18h14v6H1z"/><path stroke="#e5c276" stroke-width="3" d="M8 18V5"/><path fill="#b78948" d="M3 2h10v5H3z"/><path fill="#e4dbad" d="M4 2h8v2H4z"/>'),
  Damar:svg('damar',20,40,'<path fill="#47534a" d="M1 34h18v6H1zM4 16h12v18H4z"/><path fill="#b19759" d="M2 14h16v4H2zM6 18h8v2H6z"/><path fill="#c38b43" d="M4 7h12v7H4z"/><path fill="#ffe8a0" d="M8 1h4v9H8zM6 5h8v6H6z"/><path fill="#fff7d2" d="M9 4h2v5H9z"/>'),
  Flower:svg('flower',18,18,'<path stroke="#668c64" stroke-width="2" d="M9 10v8M9 14l-5-2M9 16l5-3"/><path fill="#f2e9bd" d="M7 2h4v4h4v4h-4v4H7v-4H3V6h4z"/><path fill="#d5b879" d="M7 6h4v4H7z"/>'),
  Scroll:svg('scroll',12,16,'<path fill="#a87942" d="M0 0h12v3H0zM0 13h12v3H0z"/><path fill="#ecd8a0" d="M2 3h8v10H2z"/><path stroke="#967847" d="M4 6h4M4 9h4"/>'),
  Relief:svg('relief',64,32,'<path fill="#233c37" stroke="#b2a775" d="M1 1h62v30H1z"/><g stroke="#8c9c72" fill="none"><path d="M16 2v28M32 2v28M48 2v28M5 24l3-14 4 14M21 20q9-15 7 4M37 24V12l7 12M53 24l4-15 4 15"/></g>'),
  Exit:svg('exit',48,80,'<path fill="#293e36" d="M0 12h10v68H0zM38 12h10v68H38zM0 4h48v10H0zM6 0h36v4H6z"/><path stroke="#baa566" fill="none" d="M3 18h4v50H3zM41 18h4v50h-4zM12 9h24"/><path fill="#d7ca8b" d="M22 24h4v25h-4zM17 39h14v4H17z"/>'),
  Kunang:svg('kunang',12,12,'<path fill="#657b9b" d="M1 4h4V2h2v2h4v5H7v2H5V9H1z"/><path fill="#c9e8e1" d="M5 4h2v4H5z"/>'),
  Glow:svg('glow',128,128,'<defs><radialGradient id="g"><stop stop-color="#ffe6a0" stop-opacity=".32"/><stop offset=".35" stop-color="#dfb85f" stop-opacity=".15"/><stop offset="1" stop-color="#d1c47c" stop-opacity="0"/></radialGradient></defs><circle cx="64" cy="64" r="64" fill="url(#g)"/>'),
  Beam:svg('beam',160,100,'<defs><linearGradient id="g"><stop stop-color="#ffe9ab" stop-opacity=".22"/><stop offset="1" stop-color="#dfefb6" stop-opacity="0"/></linearGradient></defs><path fill="url(#g)" d="M0 50L160 0v100z"/>'),
  Mist:svg('mist',128,64,'<defs><radialGradient id="g"><stop stop-color="#b8dcce" stop-opacity=".17"/><stop offset="1" stop-color="#8faead" stop-opacity="0"/></radialGradient></defs><ellipse cx="64" cy="32" rx="64" ry="32" fill="url(#g)"/>'),
  Water:svg('water',128,64,'<path fill="#367d75" fill-opacity=".7" d="M0 0h128v64H0z"/><path stroke="#a8d9be" stroke-opacity=".7" d="M0 1h128M8 6h24M56 10h30M99 4h24M23 29h37M78 39h25"/>'),
  Sky:svg('sky',480,512,'<defs><linearGradient id="g" x2="0" y2="1"><stop stop-color="#102d2d"/><stop offset="1" stop-color="#6b9a8a"/></linearGradient></defs><path fill="url(#g)" d="M0 0h480v512H0z"/>'),
  Mountain:svg('mountain',960,300,'<path fill="#375e57" d="M0 220L110 122l43 25L250 42l95 118 62-40 98 65 81-122 94 77 90-60 95 122 95-26v124H0z"/>'),
  Vine:svg('vine',64,128,'<path stroke="#122c24" stroke-width="3" fill="none" d="M12 0q16 40 0 110M36 0q-8 25 5 62"/><g fill="#18382d"><path d="M10 15L0 7v14l10 5M16 35l16-10-3 18-13 4M12 60L0 49v20l12 1M15 86l14-9-2 18-12 2M37 22l14-8v14l-14 4"/></g>')
};
if(process.argv.includes('--slice')) {
const p=gd.ProjectHelper.createNewGDJSProject();
const s=p.insertNewLayout('Petirtaan',0);
s.getObjects().insertNewObject(p,'Sprite','Kirana',0).addNewBehavior(p,'PlatformBehavior::PlatformerObjectBehavior','Platformer');
s.getObjects().insertNewObject(p,'Sprite','Stone',1).addNewBehavior(p,'PlatformBehavior::PlatformBehavior','Platform');
const el=new gd.SerializerElement(); p.serializeTo(el);
const data=JSON.parse(gd.Serializer.toJSON(el)); el.delete(); p.delete();
const scene=data.layouts[0], playerTemplate=scene.objects[0], stoneTemplate=scene.objects[1];
Object.assign(data.properties,{name:'Cahaya Kadiri',description:'Scene 2 — Air yang Mengingat. Vertical slice berdasarkan GDD v2.0.',version:'0.1.0',windowWidth:480,windowHeight:270,adaptGameResolutionAtRuntime:false,scaleMode:'nearest',pixelsRounding:true,antialiasingMode:'none',sizeOnStartupMode:'',packageName:'id.ukmpp.cahayakadiri',minFPS:30,maxFPS:60});
data.firstLayout='Petirtaan'; data.properties.loadingScreen.showGDevelopSplash=false; data.properties.watermark.showWatermark=false;
scene.r=18;scene.v=39;scene.b=35; scene.title='Cahaya Kadiri — Petirtaan'; scene.objects=[];scene.instances=[];
const layerTemplate=scene.layers[0];
scene.layers=['L0Sky','L1Mountains','L2Garden','L3Walls','','L5Foreground','L6Atmosphere'].map(name=>({...structuredClone(layerTemplate),name}));
const resource=(file)=>{if(!data.resources.resources.some(r=>r.name===file))data.resources.resources.push({kind:'image',name:file,file,smoothed:false,userAdded:true});return file;};
function sprite(name,files,behavior=null){
  const ob=structuredClone(behavior==='player'?playerTemplate:behavior==='platform'?stoneTemplate:{...stoneTemplate,behaviors:[]});
  ob.name=name;
  ob.animations=files.map((set,i)=>({name:behavior==='player'?['Idle','Run','Jump'][i]:'Default',useMultipleDirections:false,directions:[{looping:i!==2,timeBetweenFrames:i===0?.12:.10,sprites:set.map(file=>({image:resource(file),hasCustomCollisionMask:behavior==='player',customCollisionMask:behavior==='player'?[[{x:95,y:16},{x:159,y:16},{x:159,y:248},{x:95,y:248}]]:[],originPoint:{name:'Origin',x:0,y:0},centerPoint:{name:'Center',x:128,y:128,automatic:true},points:[]}))}]}));
  if(behavior==='player')Object.assign(ob.behaviors[0],{gravity:520,jumpSpeed:480,jumpSustainTime:0,maxSpeed:100,acceleration:900,deceleration:1100,maxFallingSpeed:420,ignoreDefaultControls:true,slopeMaxAngle:45});
  scene.objects.push(ob);return ob;
}
sprite('Kirana',[
  ['player.png',...Array.from({length:8},(_,i)=>`player${i+2}.png`)].map(f=>`karakter/IDLE/${f}`),
  Array.from({length:8},(_,i)=>`karakter/East/East${i+1}.png`),
  ['jump5.png','jump6.png','jump7.png'].map(f=>`karakter/jump/${f}`)
],'player');
for(const[name,file]of Object.entries(art))sprite(name,[[file]],['Stone','Faded','Raft'].includes(name)?'platform':null);
const bg='assets/art/petirtaan.png';
if(!fs.existsSync(bg))throw new Error('Latar GPT Petirtaan belum tersedia.');
sprite('Garden',[[bg]]);
if(fs.existsSync('assets/art/ki-jati.png'))sprite('KiJati',[['assets/art/ki-jati.png']]);
else sprite('KiJati',[[art.Damar]]);
let count=0;
const put=(name,x,y,w,h,layer='',z=0,vars={})=>{
  const instance={name,x,y,zOrder:z,angle:0,layer,customSize:true,width:w,height:h,numberProperties:[],stringProperties:[],initialVariables:Object.entries(vars).map(([name,value])=>({name,type:typeof value==='number'?'number':'string',value})),persistentUuid:`ck-instance-${count++}`};scene.instances.push(instance);return instance;
};
put('Sky',-480,-256,2400,1024,'L0Sky');put('Mountain',-240,0,1920,600,'L1Mountains');put('Garden',-160,-128,1856,619,'L2Garden');
for(const[x,y,w,h]of level.platforms)for(let dx=0;dx<w;dx+=32)for(let dy=0;dy<h;dy+=32)put('Stone',x+dx,y+dy,Math.min(32,w-dx),Math.min(32,h-dy),'',10);
for(const[x,y,w,h]of level.faded)put('Faded',x,y,w,h,'',10);
put('Raft',320,402,80,12,'',12);
put('Kirana',56,320,32,32,'',25);
put('KiJati',132,320,18,32,'',24);
for(const[x,y]of level.levers)put('Lever',x,y,16,24,'',15);
for(const[x,y]of level.damars){put('Damar',x,y-40,20,40,'',16);put('Glow',x-38,y-76,96,96,'L6Atmosphere');}
for(const[x,y]of level.flowers)put('Flower',x,y-16,16,16,'',17);
for(const[id,x,y]of level.kidung)put('Scroll',x,y,12,16,'',18,{kidung:id});
put('Relief',...level.relief,64,32,'',16);put('Exit',level.exit[0]-16,level.exit[1]-48,48,80,'',14);
put('Water',288,410,160,102,'',14);put('Water',608,404,192,108,'',14);
put('Kunang',700,340,12,12,'',23);
put('Beam',0,0,160,100,'L6Atmosphere',1);put('Glow',0,0,100,100,'L6Atmosphere',2,{playerLight:1});
for(let i=0;i<9;i++)put('Mist',i*180,294+(i%3)*28,200,80,'L6Atmosphere',0);
for(let i=0;i<8;i++)put('Vine',i*224-50,32+(i%3)*14,96,160,'L5Foreground',0);
scene.objectsFolderStructure={folderName:'__ROOT',children:scene.objects.map(o=>({objectName:o.name}))};
const core=fs.readFileSync('src/model.mjs','utf8').replaceAll('export ','');
const runtime=fs.readFileSync('src/runtime.js','utf8');
const css=fs.readFileSync('src/ui.css','utf8');
const inline=`if (!runtimeScene.__ck) {\n${core}\nconst model = {SERAT,RELIEF,createState,stepWater,solveRelief,stepOil,isLit};\nruntimeScene.__ck = (${runtime})(runtimeScene, ${JSON.stringify(level)}, model, ${JSON.stringify(css)});\n}\nruntimeScene.__ck.tick();`;
scene.events=[{type:'BuiltinCommonInstructions::JsCode',inlineCode:inline.split('\n'),parameterObjects:'',useStrict:true,eventsSheetExpanded:true}];
fs.writeFileSync('cahaya-kadiri.json',JSON.stringify(data,null,2));
const project=await loadProject(path.join(root,'cahaya-kadiri.json'));
fs.mkdirSync('dist',{recursive:true});
exportProject(project,path.join(root,'dist'));
project.delete();
if(!fs.existsSync('dist/index.html'))throw new Error(gd_internal_logs.slice(-5000));
// A build must contain our event; a visually blank export is not accepted.
const codeFiles=fs.readdirSync('dist').filter(f=>/^code\d+\.js$/.test(f));
if(!codeFiles.some(f=>fs.readFileSync(`dist/${f}`,'utf8').includes('function createGame')))throw new Error('GDevelop tidak mengekspor event gameplay.');
console.log(`Built cahaya-kadiri.json and dist/: ${scene.instances.length} editor instances, ${data.resources.resources.length} resources.`);
}
