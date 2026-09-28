import fs from 'node:fs';
import path from 'node:path';
import {gd,loadProject} from 'gdcore-tools';
import {assetFile,assetSize} from './asset-files.mjs';
import {exportGame} from './export-game.mjs';
import {art} from './build-project.mjs';
import levels from '../src/levels.mjs';
import {makeTerrain,TERRAIN_BY_SCENE} from './terrain-art.mjs';
const terrain=makeTerrain();
const prop=name=>`assets/props-ready/prop-${name}.png`;
// Fit display cutouts without resampling assets or moving interaction points.
const propSizes=new Map();
function imageSize(file){if(!propSizes.has(file))propSizes.set(file,assetSize(file));return propSizes.get(file);}
const root=process.cwd();
const npcSheets=JSON.parse(fs.readFileSync('assets/npc/manifest.json','utf8'));
const animatedNpcs={KiJati:'ki-jati',Kilisuci:'kilisuci',Guard:'penjaga'};
const extra=(name,w,h,body)=>{const file=`assets/system/${name}.svg`;fs.writeFileSync(file,`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${body}</svg>`);return file;};
Object.assign(art,{
  Ladder:terrain.library.ladder,
  Spark:extra('spark',4,4,'<path fill="#fff1b6" d="M1 0h2v4H1zM0 1h4v2H0z"/>'),
  Void:extra('void',960,704,'<defs><radialGradient id="g"><stop stop-color="#343046"/><stop offset="1" stop-color="#0c0b19"/></radialGradient></defs><path fill="url(#g)" d="M0 0h960v704H0z"/>')
});
Object.assign(art,Object.fromEntries(Object.entries({Book:'book',Candles:'candles',Bell:'bell',Pillar:'pillar',Crate:'basket',Foot:'foot',Lever:'lever',Damar:'damar',Flower:'flower',Scroll:'scroll',Relief:'relief-water',Exit:'gate-stone',Kunang:'kunang',Vine:'vine'}).map(([name,file])=>[name,prop(file)])));
const slideFrames=Array.from({length:8},(_,i)=>{
  const png=fs.readFileSync(`karakter/East/East${i+1}.png`).toString('base64');
  return extra(`slide-${i+1}`,256,256,`<image href="data:image/png;base64,${png}" x="0" y="93" width="256" height="160" preserveAspectRatio="none"/>`);
});
const draft=gd.ProjectHelper.createNewGDJSProject();const template=draft.insertNewLayout('Template',0);
template.getObjects().insertNewObject(draft,'Sprite','Kirana',0).addNewBehavior(draft,'PlatformBehavior::PlatformerObjectBehavior','Platformer');
template.getObjects().insertNewObject(draft,'Sprite','Stone',1).addNewBehavior(draft,'PlatformBehavior::PlatformBehavior','Platform');
const el=new gd.SerializerElement();draft.serializeTo(el);const data=JSON.parse(gd.Serializer.toJSON(el));el.delete();draft.delete();
const sceneTemplate=data.layouts[0],playerTemplate=sceneTemplate.objects[0],stoneTemplate=sceneTemplate.objects[1],layerTemplate=sceneTemplate.layers[0];
data.layouts=[];data.firstLayout='Prolog';Object.assign(data.properties,{name:'Cahaya Kadiri',description:'Serat Sapta Keteladanan — Prolog sampai Epilog, berdasarkan GDD v2.0.',version:'0.2.0',windowWidth:480,windowHeight:270,adaptGameResolutionAtRuntime:true,scaleMode:'nearest',pixelsRounding:true,antialiasingMode:'none',sizeOnStartupMode:'scaleOuter',packageName:'id.ukmpp.cahayakadiri',minFPS:30,maxFPS:60});
data.properties.loadingScreen.showGDevelopSplash=false;data.properties.watermark.showWatermark=false;
const core=fs.readFileSync('src/model.mjs','utf8').replaceAll('export ','')+'\n'+fs.readFileSync('src/campaign-model.mjs','utf8').replaceAll('export ','')+'\n'+fs.readFileSync('src/camera.mjs','utf8').replaceAll('export ','')+'\n'+fs.readFileSync('src/audio.js','utf8')+'\n'+fs.readFileSync('src/terrain-renderer.js','utf8')+'\n'+fs.readFileSync('src/mobile-controls.js','utf8');
const runtime=fs.readFileSync('src/campaign-runtime.js','utf8'),css=fs.readFileSync('src/ui.css','utf8')+'\n'+fs.readFileSync('src/campaign.css','utf8')+'\n'+fs.readFileSync('src/mobile.css','utf8');
const content={dialogues:JSON.parse(fs.readFileSync('src/dialogues.json','utf8')),history:JSON.parse(fs.readFileSync('src/history.json','utf8')),site:JSON.parse(fs.readFileSync('src/site-config.json','utf8'))};
const resource=name=>{const file=assetFile(name);if(!data.resources.resources.some(r=>r.name===name))data.resources.resources.push({kind:'image',name,file,smoothed:false,userAdded:true});return name;};
let instanceCount=0;
for(const level of levels){
  const material=terrain[TERRAIN_BY_SCENE[level.id]];
  const scene=structuredClone(sceneTemplate);scene.name=level.id;scene.mangledName=level.id;scene.title='Cahaya Kadiri — '+level.name;scene.objects=[];scene.instances=[];scene.r=14;scene.v=28;scene.b=27;
  scene.layers=['L0Sky','L1Mountains','L2Garden','L3Walls','','L5Foreground','L6Atmosphere'].map(name=>({...structuredClone(layerTemplate),name}));
  function sprite(name,sets,behavior=null){
    const obj=structuredClone(behavior==='player'?playerTemplate:behavior?stoneTemplate:{...stoneTemplate,behaviors:[]});obj.name=name;
    obj.animations=sets.map((files,i)=>({name:behavior==='player'?['Idle','Run','Jump','Slide'][i]:'Default',useMultipleDirections:false,directions:[{looping:behavior!=='player'||i!==2,timeBetweenFrames:i===0?.12:.10,sprites:files.map(file=>({image:resource(file),hasCustomCollisionMask:behavior==='player',customCollisionMask:behavior==='player'?[[{x:95,y:i===3?103:16},{x:159,y:i===3?103:16},{x:159,y:248},{x:95,y:248}]]:[],originPoint:{name:'Origin',x:0,y:0},centerPoint:{name:'Center',x:128,y:128,automatic:true},points:[]}))}]}));
    if(behavior==='player')Object.assign(obj.behaviors[0],{gravity:520,jumpSpeed:480,jumpSustainTime:0,maxSpeed:104,acceleration:900,deceleration:1100,maxFallingSpeed:420,ignoreDefaultControls:true,slopeMaxAngle:45});
    else if(behavior==='ladder')obj.behaviors[0].platformType='Ladder';else if(behavior==='jumpthru')obj.behaviors[0].platformType='Jumpthru';
    scene.objects.push(obj);
  }
  sprite('Kirana',[['player.png',...Array.from({length:8},(_,i)=>`player${i+2}.png`)].map(f=>`karakter/IDLE/${f}`),Array.from({length:8},(_,i)=>`karakter/East/East${i+1}.png`),['jump5.png','jump6.png','jump7.png'].map(f=>`karakter/jump/${f}`),slideFrames],'player');
  const interior=['Prolog','Epilog','Kedaton','Putri'].includes(level.id);
  for(const[name,file]of Object.entries(art)){
    const image=name==='Stone'?material.ground:name==='Faded'?material.ghost:name==='Ladder'?material.ladder:name==='Crate'?prop(level.id==='Prolog'?'shelf':'basket'):name==='Relief'?prop(level.id==='Bukit'?'relief-cave':level.id==='Gerbang'?'relief-gate':'relief-water'):name==='Exit'?prop(interior?'door-wood':'gate-stone'):file;
    sprite(name,[[image]],name==='Ladder'?'ladder':['Stone','Faded','Raft','Crate'].includes(name)?'platform':null);
  }
  sprite('StoneFill',[[material.fill]],'platform');sprite('Upper',[[material.upper]],'jumpthru');sprite('Barrier',[[material.fill]],'platform');sprite('Marker',[[art.Book]]);
  for(const[name,file]of Object.entries({LadderArt:'ladder',Lamp:'lamp',Dakon:'dakon',Jug:'jug',Mirror:'mirror',Store:'store',Heirloom:'pusaka',Manuscript:'manuscript',Poster:'poster',Roots:'roots',Passage:'passage',GateDials:'gate-dials'}))sprite(name,[[prop(file)]]);
  const roadTheme=TERRAIN_BY_SCENE[level.id],roadImage=`assets/art/road-${roadTheme}.png`,groundImage=roadTheme==='market'?'assets/art/road-market-quay.png':roadImage;
  function tiled(name,file){scene.objects.push({assetStoreId:'',name,type:'TiledSpriteObject::TiledSprite',texture:resource(file),width:144,height:48,variables:[],effects:[],behaviors:[]});}
  tiled('Road',roadImage);tiled('GroundRoad',groundImage);tiled('RoadFill',groundImage);tiled('FadedRoad',roadImage);
  if(level.id==='Petirtaan')sprite('RaftRoad',[[prop('raft')]]);
  if(level.id==='Gerbang')tiled('BarrierFace',roadImage);
  const characters={Mbok:'mbok',Samar:'ki-samar',Putri:'putri',Lutung:'lutung',Galuh:'putri'};
  for(const[name,file]of Object.entries(characters))sprite(name,[[`assets/art/${file}.png`]]);
  for(const[name,id]of Object.entries(animatedNpcs)){const clip=npcSheets[id];sprite(name,[clip.frames]);const animation=scene.objects.at(-1).animations[0];animation.name='Idle';animation.directions[0].timeBetweenFrames=clip.frameSeconds;}
  sprite('Garden',[[level.background?`assets/art/${level.background}.png`:art.Void]]);
  sprite('MemoryGarden',[['assets/art/palace.png']]);
  if(level.id==='Bukit')sprite('RichValley',[['assets/art/escape-rich.png']]);
  const put=(name,x,y,w,h,layer='',z=0,vars={})=>{const i={name,x,y,zOrder:z,angle:0,layer,customSize:true,width:w,height:h,numberProperties:[],stringProperties:[],initialVariables:Object.entries(vars).map(([name,value])=>({name,type:typeof value==='number'?'number':'string',value})),persistentUuid:`${level.id}-${instanceCount++}`};scene.instances.push(i);return i;};
  const putCutout=(name,x,y,w,h,layer='',z=0,vars={})=>{
    const file=scene.objects.find(o=>o.name===name)?.animations?.[0]?.directions?.[0]?.sprites?.[0]?.image;
    if(file?.startsWith('assets/props-ready/prop-')){const[iw,ih]=imageSize(file),scale=Math.min(w/iw,h/ih),nw=iw*scale,nh=ih*scale;return put(name,x+(w-nw)/2,y+h-nh,nw,nh,layer,z,vars);}
    return put(name,x,y,w,h,layer,z,vars);
  };
  put('Sky',-480,-256,level.width+960,level.height+512,'L0Sky');put('Mountain',-240,0,1920,600,'L1Mountains');
  if(level.backgroundBox)put('Garden',...level.backgroundBox,level.backgroundLayer||'L2Garden');
  else for(let x=-160;x<level.width*.5+480;x+=1536)put('Garden',x,-128,1856,619,'L2Garden');
  if(level.id==='Bangsal')put('MemoryGarden',-160,0,1536,704,'L2Garden',1);
  if(level.id==='Bukit'){
    // The detailed panorama spans the full parallax travel without repeating.
    put('RichValley',-200,-116,1740,580,'L1Mountains',3);
  }
  for(const[x,y,w,h]of level.platforms){if(h<=12){for(let dx=0;dx<w;dx+=32)put('Upper',x+dx,y,Math.min(32,w-dx),h,'',10);}else for(let dx=0;dx<w;dx+=32)for(let dy=0;dy<h;dy+=32)put(dy===0?'Stone':'StoneFill',x+dx,y+dy,Math.min(32,w-dx),Math.min(32,h-dy),'',10);}
  for(const[x,y,w,h]of level.platforms){put(h<=12?'Road':'GroundRoad',x,y-8,w,48,'',12,{roadOffset:x%144});if(h>40)put('RoadFill',x,y+32,w,h-32,'',9,{roadOffset:x%144});}
  for(const[x,y,w,h]of level.faded)for(let dx=0;dx<w;dx+=32){put('Faded',x+dx,y,Math.min(32,w-dx),h,'',10);put('FadedRoad',x+dx,y-8,Math.min(32,w-dx),48,'',12,{roadOffset:(x+dx)%144});}
  for(const[x,y,w,h]of level.ladders)for(let dy=0;dy<h;dy+=32)put('Ladder',x,y+dy,w,Math.min(32,h-dy),'',11);
  for(const[x,y,w,h]of level.ladders)put('LadderArt',x,y,w,h,'',11);
  put('Kirana',...level.checkpoints[0],32,32,'',25);
  for(const[x,y]of level.damars){putCutout('Damar',x,y-40,20,40,'',16);put('Glow',x-38,y-76,96,96,'L6Atmosphere');}
  for(const[x,y]of level.flowers)putCutout('Flower',x,y-16,16,16,'',17);
  for(const[id,x,y]of level.kidung){const o=putCutout('Scroll',x,y,12,16,'',18,{kidung:id});o.y-=(16-o.height)/2;}
  for(const[x,y]of level.levers)put('Lever',x,y,16,24,'',15);
  const types={jati:'KiJati',mbok:'Mbok',kilisuci:'Kilisuci',samar:'Samar',putri:'Putri',lutung:'Lutung',order:'KiJati',guard:'Guard',sleeper:'Guard',relief:'Relief',carving:'Relief',gate:'GateDials',portal:'Book',book:'Book',manuscript:'Manuscript',lastbook:'Book',poster:'Poster',push:'Crate',bell:'Bell',pillar:'Pillar',wani:'Scroll',candles:'Candles',lamp:'Lamp',dakon:'Dakon',jug:'Jug',mirror:'Mirror',moss:'Relief',lost:'Relief',store:'Store',escape:'Exit',pusaka:'Heirloom',trap:'Exit',slide:'Passage'};
  const sizes={Relief:[64,32],Candles:[48,32],Lutung:[28,32],Crate:[32,40],Pillar:[24,64],Exit:[38,64],Dakon:[40,22],Jug:[20,28],Mirror:[24,38],Store:[40,52],Heirloom:[42,56],Manuscript:[56,38],Poster:[28,42],Roots:[32,32],Passage:[52,26],GateDials:[44,28]};
  for(const[name,id]of Object.entries(animatedNpcs)){const c=npcSheets[id];sizes[name]=[c.displayHeight*c.size[0]/c.size[1],c.displayHeight];}
  for(const n of level.nodes){
    const marketGuard=level.id==='Pasar'&&(n.id==='order2'||n.id==='npc4');
    const type=marketGuard?'Guard':types[n.type]||(level.id==='Pasar'?'KiJati':level.id==='Gerbang'?'Roots':'Poster'),[w,h]=sizes[type]||[20,32];
    // Crates retain their exact physical rectangle; wider decorative props center
    // around the existing interaction point without changing quest coordinates.
    const x=type==='Crate'||type==='Relief'||type==='Candles'||type==='Lutung'?n.x:n.x+10-w/2;
    (type==='Crate'?put:putCutout)(type,x,n.y+32-h,w,h,'',18,{node:n.id});
  }
  putCutout('Exit',level.exit[0]-16,level.exit[1]-48,48,80,'',14,{transition:1});
  if(level.id==='Petirtaan'){const[rw,rh]=imageSize(prop('raft')),height=80*rh/rw;put('Raft',320,402,80,12,'',12);put('RaftRoad',320,402-height*.28,80,height,'',13);put('Water',288,410,160,102,'',14);put('Water',608,404,192,108,'',14);put('Kunang',700,340,12,12,'',23);}
  if(level.id==='Bukit'){put('Kunang',380,550,12,12,'',23);put('Foot',320,635,16,8,'',22,{rayap:1});}
  if(level.id==='Gerbang'){put('Barrier',656,224,32,128,'',12);put('BarrierFace',656,224,32,128,'',13);}
  if(level.id==='Kedaton'){put('Foot',16,600,12,8,'',23);put('Galuh',450,416,18,32,'',21);}
  put('Beam',0,0,160,100,'L6Atmosphere',1);put('Glow',0,0,100,100,'L6Atmosphere',2,{playerLight:1});
  for(let i=0;i<24;i++)put('Spark',i*43,150+(i%7)*24,2,2,'L6Atmosphere',4,{particle:i});
  for(let i=0;i<Math.min(16,Math.ceil(level.width/180));i++)put('Mist',i*180,level.checkpoints[0][1]-26+(i%3)*28,200,80,'L6Atmosphere',0);
  if(['Petirtaan','Bukit','Gerbang'].includes(level.id))for(let i=0;i<(level.id==='Bukit'?4:8);i++)put('Vine',i*224-50,32+(i%3)*14,96,160,'L5Foreground');
  scene.objectsFolderStructure={folderName:'__ROOT',children:scene.objects.map(o=>({objectName:o.name}))};
  const inline=`if (!runtimeScene.__ck) {\n${core}\nconst model={setupMobileControls,setupTerrainRendering,followCamera,createSoundscape,SERAT,RELIEF,stepWater,solveRelief,stepOil,isLit,SCENES,VALUES,MANUSCRIPT,ARGUMENTS,newCampaign,awardSerat,canLeave,transition,answerArgument,argumentScore,assembleManuscript};\nruntimeScene.__ck=(${runtime})(runtimeScene,${JSON.stringify(level)},model,${JSON.stringify(css)},${JSON.stringify(content)});\n}\nruntimeScene.__ck.tick();`;
  scene.events=[{type:'BuiltinCommonInstructions::JsCode',inlineCode:inline.split('\n'),parameterObjects:'',useStrict:true,eventsSheetExpanded:true}];data.layouts.push(scene);
}
fs.writeFileSync('cahaya-kadiri.json',JSON.stringify(data,null,2));
const project=await loadProject(path.join(root,'cahaya-kadiri.json'));try{exportGame(project,root);}finally{project.delete();}
console.log(`Campaign built: ${data.layouts.length} scenes, ${instanceCount} instances, ${data.resources.resources.length} resources.`);
