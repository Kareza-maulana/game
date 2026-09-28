gdjs.PetirtaanCode = {};
gdjs.PetirtaanCode.localVariables = [];
gdjs.PetirtaanCode.idToCallbackMap = new Map();
gdjs.PetirtaanCode.GDKiranaObjects1= [];
gdjs.PetirtaanCode.GDStoneObjects1= [];
gdjs.PetirtaanCode.GDFadedObjects1= [];
gdjs.PetirtaanCode.GDRaftObjects1= [];
gdjs.PetirtaanCode.GDLeverObjects1= [];
gdjs.PetirtaanCode.GDDamarObjects1= [];
gdjs.PetirtaanCode.GDFlowerObjects1= [];
gdjs.PetirtaanCode.GDScrollObjects1= [];
gdjs.PetirtaanCode.GDReliefObjects1= [];
gdjs.PetirtaanCode.GDExitObjects1= [];
gdjs.PetirtaanCode.GDKunangObjects1= [];
gdjs.PetirtaanCode.GDGlowObjects1= [];
gdjs.PetirtaanCode.GDBeamObjects1= [];
gdjs.PetirtaanCode.GDMistObjects1= [];
gdjs.PetirtaanCode.GDWaterObjects1= [];
gdjs.PetirtaanCode.GDSkyObjects1= [];
gdjs.PetirtaanCode.GDMountainObjects1= [];
gdjs.PetirtaanCode.GDVineObjects1= [];
gdjs.PetirtaanCode.GDLadderObjects1= [];
gdjs.PetirtaanCode.GDSparkObjects1= [];
gdjs.PetirtaanCode.GDVoidObjects1= [];
gdjs.PetirtaanCode.GDBookObjects1= [];
gdjs.PetirtaanCode.GDCandlesObjects1= [];
gdjs.PetirtaanCode.GDBellObjects1= [];
gdjs.PetirtaanCode.GDPillarObjects1= [];
gdjs.PetirtaanCode.GDCrateObjects1= [];
gdjs.PetirtaanCode.GDFootObjects1= [];
gdjs.PetirtaanCode.GDStoneFillObjects1= [];
gdjs.PetirtaanCode.GDUpperObjects1= [];
gdjs.PetirtaanCode.GDBarrierObjects1= [];
gdjs.PetirtaanCode.GDMarkerObjects1= [];
gdjs.PetirtaanCode.GDLadderArtObjects1= [];
gdjs.PetirtaanCode.GDLampObjects1= [];
gdjs.PetirtaanCode.GDDakonObjects1= [];
gdjs.PetirtaanCode.GDJugObjects1= [];
gdjs.PetirtaanCode.GDMirrorObjects1= [];
gdjs.PetirtaanCode.GDStoreObjects1= [];
gdjs.PetirtaanCode.GDHeirloomObjects1= [];
gdjs.PetirtaanCode.GDManuscriptObjects1= [];
gdjs.PetirtaanCode.GDPosterObjects1= [];
gdjs.PetirtaanCode.GDRootsObjects1= [];
gdjs.PetirtaanCode.GDPassageObjects1= [];
gdjs.PetirtaanCode.GDGateDialsObjects1= [];
gdjs.PetirtaanCode.GDRoadObjects1= [];
gdjs.PetirtaanCode.GDGroundRoadObjects1= [];
gdjs.PetirtaanCode.GDRoadFillObjects1= [];
gdjs.PetirtaanCode.GDFadedRoadObjects1= [];
gdjs.PetirtaanCode.GDRaftRoadObjects1= [];
gdjs.PetirtaanCode.GDMbokObjects1= [];
gdjs.PetirtaanCode.GDSamarObjects1= [];
gdjs.PetirtaanCode.GDPutriObjects1= [];
gdjs.PetirtaanCode.GDLutungObjects1= [];
gdjs.PetirtaanCode.GDGaluhObjects1= [];
gdjs.PetirtaanCode.GDKiJatiObjects1= [];
gdjs.PetirtaanCode.GDKilisuciObjects1= [];
gdjs.PetirtaanCode.GDGuardObjects1= [];
gdjs.PetirtaanCode.GDGardenObjects1= [];
gdjs.PetirtaanCode.GDMemoryGardenObjects1= [];


gdjs.PetirtaanCode.userFunc0x1580890 = function GDJSInlineCode(runtimeScene) {
"use strict";
if (!runtimeScene.__ck) {
const SERAT = [
  ['Asih', 'Welas asih', 'Langkah Cepat'], ['Sabar', 'Kesabaran', 'Pelita: Sorot'],
  ['Jujur', 'Kejujuran', 'Pelita: Baca'], ['Wani', 'Keberanian', 'Pijakan Cahaya'],
  ['Andhap', 'Kerendahan hati', 'Pelita: Kibas'], ['Setya', 'Kesetiaan', 'Terjang Kabut'],
  ['Wicaksana', 'Kebijaksanaan', 'Sorot Jauh']
];
const RELIEF = [
  { id: 'putri', title: 'Putri di Dhaha', text: 'Candra Kirana hidup di lingkungan kedaton.' },
  { id: 'kutukan', title: 'Keong keemasan', text: 'Kutukan mengubah sang putri menjadi keong emas.' },
  { id: 'mbok', title: 'Pertolongan Mbok', text: 'Mbok Rondo menemukan dan merawat keong itu.' },
  { id: 'pulang', title: 'Cahaya yang pulang', text: 'Kebaikan membuka jalan bagi sang putri untuk kembali.' }
];
function createState(saved) {
  const s = { version: 1, scene: 'Petirtaan', pelita: false, serat: ['Asih'], kidung: [],
    levers: [false, false, false], water: 0, waiting: 0, sabar: false, jujur: false,
    drained: false, oil: 100, checkpoint: 0, completed: false, attempts: 0 };
  if (saved && saved.version === 1 && saved.scene === s.scene) {
    s.pelita = saved.pelita === true;
    s.sabar = saved.sabar === true; s.jujur = s.sabar && saved.jujur === true;
    s.drained = s.sabar && saved.drained === true;
    s.serat = ['Asih', ...(s.sabar ? ['Sabar'] : []), ...(s.jujur ? ['Jujur'] : [])];
    s.kidung = Array.isArray(saved.kidung) ? [...new Set(saved.kidung.filter(n => n === 4 || n === 5))] : [];
    s.levers = Array.isArray(saved.levers) && saved.levers.length === 3 ? saved.levers.map(v => v === true) : s.levers;
    s.water = s.sabar ? 1 : 0; s.checkpoint = [0,1,2].includes(saved.checkpoint) ? saved.checkpoint : 0;
    s.oil = Number.isFinite(saved.oil) ? Math.max(25, Math.min(100,saved.oil)) : 100;
    s.completed = s.jujur && saved.completed === true;
  }
  return s;
}
function stepWater(s, dt, stillAtBasin) {
  const filling = s.levers[0] && !s.levers[1] && s.levers[2];
  if (!s.sabar) {
    s.water = Math.max(0, Math.min(1, s.water + (filling ? dt / 8 : -dt / 4)));
    s.waiting = filling && stillAtBasin ? s.waiting + dt : 0;
    if (s.water >= 1 && s.waiting >= 8) {
      s.sabar = true; s.serat.push('Sabar'); s.oil = 100; return 'sabar';
    }
  } else if (!s.levers[0] && s.levers[1] && !s.levers[2]) s.drained = true;
  return null;
}
function solveRelief(s, order) {
  if (!s.sabar || !s.drained) return 'locked';
  if (order.length === 4 && RELIEF.every((r,i) => r.id === order[i])) {
    if (!s.jujur) s.serat.push('Jujur');
    s.jujur = true; s.oil = 100; return 'solved';
  }
  s.attempts++; return 'flood';
}
function stepOil(s, dt, shining, inFog, atDamar) {
  s.oil = Math.max(0, Math.min(100, s.oil + (atDamar ? 48 : -(shining ? 3 : 0) - (inFog ? 7 : 0)) * dt));
  return s.oil;
}
function isLit(px, py, facing, x, y, radius, shining) {
  const dx=x-px, dy=y-py;
  return shining && Math.hypot(dx,dy) <= radius && (Math.abs(dx)<24 || dx*facing >= 0) && Math.abs(dy) < 65;
}

// Pure progression rules shared by all nine GDevelop layouts.
const SCENES=['Prolog','Pasar','Petirtaan','Bukit','Gerbang','Kedaton','Bangsal','Putri','Epilog'];
const VALUES=['Asih','Sabar','Jujur','Wani','Andhap','Setya','Wicaksana'];
const MANUSCRIPT=[
  {id:'Setya',title:'Janji di kedaton',text:'Candra Kirana menjaga janji sebelum perpisahan datang.'},
  {id:'Jujur',title:'Tuduhan yang keliru',text:'Ia tetap memegang kebenaran ketika iri hati mengusirnya.'},
  {id:'Wani',title:'Meninggalkan istana',text:'Sang putri menghadapi jalan asing di luar kedaton.'},
  {id:'Sabar',title:'Di dalam cangkang',text:'Menjadi keong emas, ia menunggu tanpa kehilangan harapan.'},
  {id:'Asih',title:'Tangan Mbok Rondo',text:'Mbok Rondo menemukan keong dan membawanya pulang.'},
  {id:'Andhap',title:'Membalas pertolongan',text:'Putri membantu pekerjaan rumah tanpa menuntut penghormatan.'},
  {id:'Wicaksana',title:'Kisah yang diteruskan',text:'Pertemuan kembali membuka jalan untuk meneruskan kisahnya.'}
];
const ARGUMENTS=[
  {question:'Sebuah kisah diceritakan ulang sampai berubah dari aslinya. Apakah kisah itu masih kisah yang sama?',options:['Tidak. Yang berubah berarti sudah mati.','Ya, selama nilainya bertahan. Bentuk boleh berganti.','Tidak penting. Yang penting ada yang menceritakan.'],aligned:1,value:'Wicaksana'},
  {question:'Versi Bayang Galuh tak pernah didengar. Haruskah kita memberi ruang untuknya?',options:['Dengarkan pengalamannya tanpa membenarkan tindakan yang melukai.','Hapus saja agar kisah sang putri tetap utuh.','Anggap semua tindakannya benar karena ia pernah terluka.'],aligned:0,value:'Asih dan Jujur'},
  {question:'Jika tak seorang pun meminta kisah ini, mengapa kau masih membawanya?',options:['Agar semua orang wajib mengingat versi yang sama.','Supaya namaku lebih dikenal daripada tokoh-tokohnya.','Aku bisa menawarkan cerita dan merawatnya, sambil memberi orang pilihan.'],aligned:2,value:'Setya dan Andhap'}
];
function newCampaign(saved){
  const state={version:2,scene:'Prolog',serat:[],kidung:[],pelita:false,oil:100,checkpoint:0,visited:['Prolog'],completed:false,golden:false,
    levers:[false,false,false],water:0,waiting:0,sabar:false,jujur:false,drained:false,attempts:0,
    quests:{books:[],lamps:[true,true,true],orders:[],marketStarted:false,chase:false,chaseWon:false,dakon:false,
      candles:[],caveRead:false,escaped:false,clues:[],jug:false,key:false,guardTalk:0,gate:false,tapakTrapped:false,bells:[],pusaka:false,
      pillars:[],answers:[],debate:false,manuscript:false,manuscriptAttempts:0,epilogueRead:false},playSeconds:0};
  if(!saved||![1,2].includes(saved.version))return state;
  if(saved.version===1&&saved.scene==='Petirtaan'){
    state.scene='Petirtaan';state.serat=['Asih',...(saved.sabar?['Sabar']:[]),...(saved.sabar&&saved.jujur?['Jujur']:[])];
    state.visited=['Prolog','Pasar','Petirtaan'];state.quests.books=[0,1,2];state.quests.orders=[0,1,2];state.quests.marketStarted=true;state.quests.chaseWon=true;
  }else if(saved.version===2){
    state.scene=SCENES.includes(saved.scene)?saved.scene:'Prolog';
    const owned=new Set(Array.isArray(saved.serat)?saved.serat:[]);for(const name of VALUES){if(!owned.has(name))break;state.serat.push(name);}
    state.visited=SCENES.filter(n=>Array.isArray(saved.visited)&&saved.visited.includes(n));if(!state.visited.includes('Prolog'))state.visited.unshift('Prolog');
    if(saved.quests&&typeof saved.quests==='object')for(const key of Object.keys(state.quests)){
      const original=state.quests[key],v=saved.quests[key];
      if(Array.isArray(original)&&Array.isArray(v))state.quests[key]=key==='lamps'?Array.from({length:3},(_,i)=>v[i]!==false):[...new Set(v.filter(n=>Number.isInteger(n)&&n>=0&&n< (key==='pillars'?5:key==='candles'?5:key==='clues'?4:3)))];
      else if(typeof original==='boolean')state.quests[key]=v===true;
      else if(typeof original==='number'&&Number.isFinite(v))state.quests[key]=Math.max(0,Math.floor(v));
    }
    // Answers may repeat, unlike collectible indices.
    state.quests.answers=Array.isArray(saved.quests?.answers)?saved.quests.answers.slice(0,3).map(n=>[0,1,2].includes(n)?n:0):[];
  }
  state.pelita=saved.pelita===true&&state.serat.includes('Asih');state.sabar=state.serat.includes('Sabar');state.jujur=state.serat.includes('Jujur');
  state.drained=state.sabar&&saved.drained===true;state.water=state.sabar?1:0;
  state.levers=Array.isArray(saved.levers)?Array.from({length:3},(_,i)=>saved.levers[i]===true):state.levers;
  state.oil=Number.isFinite(saved.oil)?Math.max(25,Math.min(100,saved.oil)):100;
  state.checkpoint=Number.isInteger(saved.checkpoint)&&saved.checkpoint>=0&&saved.checkpoint<10?saved.checkpoint:0;
  state.kidung=Array.isArray(saved.kidung)?[...new Set(saved.kidung.filter(n=>Number.isInteger(n)&&n>=1&&n<=12))]:[];
  state.playSeconds=Number.isFinite(saved.playSeconds)?Math.max(0,saved.playSeconds):0;
  state.completed=saved.completed===true&&state.scene==='Epilog'&&state.serat.length===7&&state.quests.manuscript;
  state.golden=state.completed&&state.kidung.length===12;
  return state;
}
function awardSerat(s,name){
  if(s.serat.includes(name))return false;
  if(VALUES[s.serat.length]!==name)return false;
  s.serat.push(name);s.sabar=s.serat.includes('Sabar');s.jujur=s.serat.includes('Jujur');s.oil=100;return true;
}
function canLeave(s,scene){const q=s.quests;return ({Prolog:q.books.length===3,Pasar:q.chaseWon&&s.serat.includes('Asih'),Petirtaan:s.jujur,Bukit:q.escaped&&s.serat.includes('Andhap'),Gerbang:q.gate&&s.serat.includes('Setya'),Kedaton:q.bells.length===3&&q.tapakTrapped&&q.pusaka,Bangsal:q.debate&&s.serat.length===7,Putri:q.manuscript,Epilog:q.epilogueRead})[scene]===true;}
function transition(s,next){const i=SCENES.indexOf(s.scene);if(SCENES[i+1]!==next||!canLeave(s,s.scene))return false;s.scene=next;s.checkpoint=0;s.oil=100;if(!s.visited.includes(next))s.visited.push(next);return true;}
function answerArgument(s,index){if(s.quests.pillars.length<4||s.quests.answers.length>=3||![0,1,2].includes(index))return false;s.quests.answers.push(index);if(s.quests.answers.length===3){s.quests.debate=true;if(!s.quests.pillars.includes(4))s.quests.pillars.push(4);}return true;}
function argumentScore(s){return s.quests.answers.reduce((n,a,i)=>n+(ARGUMENTS[i]?.aligned===a?1:0),0);}
function assembleManuscript(s,ids){if(s.serat.length!==7||!s.quests.debate)return false;if(ids.length===7&&MANUSCRIPT.every((m,i)=>m.id===ids[i])){s.quests.manuscript=true;return true;}s.quests.manuscriptAttempts++;return false;}

// Follow the route, not every jump or change in facing direction.
function followCamera(c, p) {
  const {x,y,onFloor,viewW,viewH,width,height,dt,snap=false}=p;
  const clamp=(v,lo,hi)=>Math.max(lo,Math.min(Math.max(lo,hi),v));
  const hw=viewW/2,hh=viewH/2,focus=y-16;
  if(snap||!Number.isFinite(c.anchorY)){
    c.x=clamp(x+16,hw,width-hw);c.y=clamp(focus,hh,height-hh);c.anchorY=focus;c.airY=focus;
  }
  // A new floor establishes a resting camera height. Ignore one-pixel floor noise.
  if(onFloor&&Math.abs(focus-c.anchorY)>20)c.anchorY=focus;
  if(onFloor)c.airY=c.anchorY;
  const upper=c.y-hh+36,lower=c.y+hh-44;
  if(!onFloor&&y+16<upper)c.airY=Math.min(c.airY,y+16+hh-36);
  if(!onFloor&&y+32>lower)c.airY=Math.max(c.airY,y+32-hh+44);
  const targetY=onFloor?c.anchorY:c.airY;
  // Horizontal dead zone has no facing-based offset, so tapping left/right cannot shake the world.
  const dx=x+16-c.x,dead=Math.min(64,viewW*.14);
  const targetX=c.x+(Math.abs(dx)>dead?dx-Math.sign(dx)*dead:0);
  const blend=1-Math.exp(-5*Math.min(.05,Math.max(0,dt)));
  c.x=clamp(c.x+(targetX-c.x)*blend,hw,width-hw);
  c.y=clamp(c.y+(clamp(targetY,hh,height-hh)-c.y)*blend,hh,height-hh);
  return c;
}

function createSoundscape(){
  let context=null,master=null,buses=null,noise=null,meter=null,loops=[],voices=new Set(),lastZone='',nextNature=0,nextMusic=0,nextStep=0,wasGrounded=true,wasTorch=false,notes=0,lastMode='title';
  let settings={ambience:.65,music:.38,effects:.7,muted:false};
  try{const saved=JSON.parse(localStorage.getItem('cahayakadiri_audio')||'null');if(saved){for(const k of ['ambience','music','effects'])if(Number.isFinite(saved[k]))settings[k]=Math.max(0,Math.min(1,saved[k]));settings.muted=saved.muted===true;}}catch{}
  const stats={cues:0,steps:0,landings:0,nature:0,music:0};
  const persist=()=>{try{localStorage.setItem('cahayakadiri_audio',JSON.stringify(settings));}catch{}};
  function ramp(param,value,time=.18){if(param._ckTarget===value)return;param._ckTarget=value;param.setTargetAtTime(value,context.currentTime,time);}
  function unlock(){
    if(!context){try{
      context=new(window.AudioContext||window.webkitAudioContext)();master=context.createGain();master.gain.value=0;
      const limiter=context.createDynamicsCompressor();limiter.threshold.value=-16;limiter.knee.value=18;limiter.ratio.value=6;meter=context.createAnalyser();meter.fftSize=512;master.connect(limiter);limiter.connect(meter);meter.connect(context.destination);
      buses={};for(const key of ['ambience','music','effects']){buses[key]=context.createGain();buses[key].gain.value=settings[key];buses[key].connect(master);}
      noise=context.createBuffer(1,context.sampleRate*4,context.sampleRate);const data=noise.getChannelData(0);let seed=9731,last=0;
      for(let i=0;i<data.length;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;last=.94*last+.06*(seed/2147483648-1);data[i]=last*3;}
      for(const [frequency,type]of [[340,'lowpass'],[1900,'bandpass'],[4300,'highpass']]){
        const source=context.createBufferSource(),filter=context.createBiquadFilter(),gain=context.createGain();source.buffer=noise;source.loop=true;filter.type=type;filter.frequency.value=frequency;filter.Q.value=.6;gain.gain.value=0;source.connect(filter);filter.connect(gain);gain.connect(buses.ambience);source.start(0,loops.length*.71);loops.push({source,filter,gain});
      }
    }catch{return;}}
    if(context.state==='suspended')context.resume().catch(()=>{});
  }
  function voice(freq,len,amp=.08,{bus='effects',type='sine',to=freq,delay=0,metal=false}={}){
    if(!context||context.state!=='running'||settings.muted||voices.size>40)return;
    const t=context.currentTime+delay,o=context.createOscillator(),g=context.createGain();o.type=type;o.frequency.setValueAtTime(freq,t);o.frequency.exponentialRampToValueAtTime(Math.max(20,to),t+len);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.0002,amp),t+.009);g.gain.exponentialRampToValueAtTime(.0001,t+len);o.connect(g);g.connect(buses[bus]);voices.add(o);o.onended=()=>{o.disconnect();g.disconnect();voices.delete(o);};o.start(t);o.stop(t+len+.02);
    if(metal){voice(freq*2.76,len*.55,amp*.27,{bus,delay});voice(freq*5.4,len*.25,amp*.08,{bus,delay});}
  }
  function rustle(len,amp,frequency=800,bus='effects'){
    if(!context||context.state!=='running'||settings.muted||voices.size>40)return;
    const t=context.currentTime,o=context.createBufferSource(),filter=context.createBiquadFilter(),g=context.createGain();o.buffer=noise;filter.type='bandpass';filter.frequency.value=frequency;filter.Q.value=.8;g.gain.setValueAtTime(amp,t);g.gain.exponentialRampToValueAtTime(.0001,t+len);o.connect(filter);filter.connect(g);g.connect(buses[bus]);voices.add(o);o.onended=()=>{o.disconnect();filter.disconnect();g.disconnect();voices.delete(o);};o.start(t,(notes%3)*.37);o.stop(t+len);
  }
  function cue(name,options={}){
    if(!context||settings.muted)return;stats.cues++;
    if(name==='jump'){rustle(.13,.18,900);voice(140,.16,.055,{to:230,type:'triangle'});}
    else if(name==='double'){rustle(.22,.12,1600);voice(440,.3,.065,{to:660});voice(880,.35,.025,{delay:.045});}
    else if(name==='dash'||name==='kibas'){rustle(.3,.36,1100);voice(110,.24,.035,{to:50});}
    else if(name==='land'){stats.landings++;rustle(.12,.2,480);voice(95,.1,.07,{to:45,type:'triangle'});}
    else if(name==='step'){stats.steps++;rustle(.065,.13,lastZone==='library'||lastZone==='palace'?380:1100);voice(105,.04,.023,{type:'triangle',to:70});}
    else if(name==='respawn'){rustle(.7,.23,650);voice(294,.7,.06,{to:147});}
    else if(name==='torch'){rustle(.22,.14,2500);}
    else if(name==='checkpoint'){[294,440,588].forEach((f,i)=>voice(f,.7,.055,{delay:i*.11,metal:true}));}
    else if(name==='reward'){[294,330,440,588].forEach((f,i)=>voice(f,1.6,.065,{delay:i*.13,metal:true}));}
    else voice(options.freq||440,Math.max(.22,options.len||.4),.065,{metal:true});
  }
  function update(p){
    if(!context)return;
    const {scene,x,y,mode,shining,moving,grounded,speed=104,hidden=false,silence=false}=p,t=context.currentTime;
    const zone=scene==='Bukit'?(x<980&&y<500?'cave':'valley'):({Prolog:'library',Epilog:'library',Pasar:'market',Petirtaan:'water',Gerbang:'gate',Kedaton:'palace',Bangsal:'void',Putri:'bedroom'}[scene]||'valley');
    const profiles={library:[.035,.025,.025],market:[.065,.1,.02],water:[.04,.24,.035],cave:[.11,.014,.003],valley:[.19,.06,.012],gate:[.09,.02,.008],palace:[.02,.005,.006],void:[.12,.003,0],bedroom:[.025,.008,.004]};
    const quiet=mode==='play'?1:mode==='dialog'?.6:mode==='title'?0:.18;
    ramp(master.gain,settings.muted||hidden||silence?0:.65,.04);
    for(const key of ['ambience','music','effects'])ramp(buses[key].gain,settings[key]*(key==='effects'?1:quiet),.08);
    if(zone!==lastZone){lastZone=zone;nextNature=t+.5;nextMusic=t+1.2;profiles[zone].forEach((v,i)=>ramp(loops[i].gain.gain,v,1.4));}
    if(!settings.muted&&!hidden&&!silence&&mode==='play'){
      if(grounded&&!wasGrounded&&lastMode==='play')cue('land');
      if(grounded&&moving&&t>nextStep){cue('step');nextStep=t+(speed>130?.23:.34);}
      if(shining&&!wasTorch)cue('torch');
      if(t>nextNature){stats.nature++;nextNature=t+(zone==='cave'?2.5:4)+((notes*7)%9)*.3;
        if(zone==='cave'||zone==='water'){voice(1250,.11,.025,{bus:'ambience',to:620});voice(620,.5,.012,{bus:'ambience',delay:.18});}
        else if(['valley','market','gate'].includes(zone)){voice(1700,.13,.016,{bus:'ambience',to:2450});voice(2100,.2,.013,{bus:'ambience',to:1400,delay:.18});}
        else if(zone==='library')rustle(.35,.025,1700,'ambience');
        else if(zone==='palace'||zone==='bedroom')rustle(.1,.025,3200,'ambience');
      }
      if(t>nextMusic){stats.music++;nextMusic=t+(zone==='void'?6:3.6);const scale=[147,165,196,220,294,220,196,165],f=scale[notes++%scale.length];voice(zone==='void'?f/2:f,2.8,.035,{bus:'music',metal:true});if(notes%4===0)voice(f/2,3.7,.022,{bus:'music',type:'triangle'});}
    }
    wasGrounded=grounded;wasTorch=shining;lastMode=mode;
  }
  function setMix(key,value){if(['ambience','music','effects'].includes(key))settings[key]=Math.max(0,Math.min(1,Number(value)));persist();}
  function setMuted(value){settings.muted=!!value;persist();if(master)ramp(master.gain,settings.muted?0:.65,.02);}
  function rms(){if(!meter)return 0;const samples=new Float32Array(512);meter.getFloatTimeDomainData(samples);return Math.sqrt(samples.reduce((sum,v)=>sum+v*v,0)/samples.length);}
  return {unlock,update,cue,setMix,setMuted,get settings(){return{...settings};},snapshot:()=>({zone:lastZone,context:context?.state||'locked',voices:voices.size,loops:loops.length,master:master?.gain.value||0,rms:rms(),settings:{...settings},stats:{...stats}})};
}

function setupTerrainRendering(scene,level){
  const get=name=>scene.getObjects(name),game=scene.getGame();
  // Collision rectangles stay at their original coordinates and dimensions.
  for(const name of ['Upper','Stone','StoneFill','Faded','Raft','Ladder'])get(name).forEach(o=>o.hide());
  game.__ckRoadFaces??=new Map();
  for(const name of ['Road','GroundRoad','FadedRoad','RoadFill','BarrierFace'])for(const o of get(name)){
    const r=o.getRendererObject();
    const face=name==='RoadFill'||name==='BarrierFace';
    if(face){
      const original=r.texture,key=original.baseTexture.uid;
      if(!game.__ckRoadFaces.has(key)){const y=Math.floor(original.height*.42);game.__ckRoadFaces.set(key,new PIXI.Texture(original.baseTexture,new PIXI.Rectangle(0,y,original.width,original.height-y)));}
      r.texture=game.__ckRoadFaces.get(key);
    }
    // Tile full texture modules; never stretch a single bitmap along the whole road.
    r.tileScale.set(144/r.texture.width,(face?32:48)/r.texture.height);
    r.tilePosition.set(-o.getVariables().get('roadOffset').getAsNumber(),0);
  }
  if(level.id==='Bukit')for(const o of get('Garden')){
    // Fade only the last part of the existing cave painting into the new vista.
    // This is a render-time mask; both original image files remain intact.
    const r=o.getRendererObject();const filter=new PIXI.Filter(undefined,`
      varying vec2 vTextureCoord;
      uniform sampler2D uSampler;
      uniform vec4 inputSize;
      uniform vec4 outputFrame;
      void main(){vec4 color=texture2D(uSampler,vTextureCoord);float x=vTextureCoord.x*inputSize.x/outputFrame.z;gl_FragColor=color*(1.0-smoothstep(0.84,1.0,x));}
    `);r.filters=[filter];
  }
  return ()=>{const colliders=get('Faded');get('FadedRoad').forEach((o,i)=>o.setOpacity(colliders[i]?.getOpacity()??55));get('RaftRoad').forEach(o=>{const raft=get('Raft')[0];o.setPosition(raft.getX(),raft.getY()-o.getHeight()*.28);});get('BarrierFace').forEach(o=>o.hide(get('Barrier')[0].isHidden()));};
}

// Touch input shares the keyboard actions; no separate movement physics.
function setupMobileControls({ui,signal,down,up,clear,onPortrait,canPlay}){
  const touch=ui.querySelector('#touch');
  const media=matchMedia('(any-pointer: coarse)');
  const isMobile=()=>media.matches||navigator.maxTouchPoints>0;
  const icon=name=>({left:'←',right:'→',up:'↑',down:'↓',jump:'↥',use:'✦',light:'◈',run:'»',pulse:'✧'})[name];
  const button=(name,key,label,caption,extra='')=>`<button type="button" class="touch-${name}" data-key="${key}" aria-label="${label}" ${extra}><span aria-hidden="true">${icon(name)}</span><small>${caption}</small></button>`;
  touch.innerHTML=`<div class="touch-movement"><div class="touch-dpad" role="group" aria-label="Arah gerak">
    ${button('up','ArrowUp','Panjat naik','Naik')}${button('left','ArrowLeft','Bergerak kiri','Kiri')}
    <span class="dpad-center" aria-hidden="true">✧</span>${button('right','ArrowRight','Bergerak kanan','Kanan')}
    ${button('down','ArrowDown','Turun atau geser','Turun')}</div>
    ${button('run','ShiftLeft','Lari','Lari','data-toggle aria-pressed="false" hidden')}</div>
    <div class="touch-actions" role="group" aria-label="Aksi Kirana">
    ${button('pulse','KeyV','Kibas pelita','Kibas','hidden')}
    ${button('light','KeyX','Sorot pelita','Pelita','data-toggle aria-pressed="false" disabled')}
    ${button('use','KeyC','Interaksi','Interaksi')}${button('jump','KeyZ','Lompat','Lompat')}</div>`;
  const rotate=document.createElement('section');rotate.id='rotate-device';rotate.hidden=true;
  rotate.setAttribute('role','dialog');rotate.setAttribute('aria-modal','true');rotate.setAttribute('aria-labelledby','rotate-title');
  rotate.innerHTML='<div class="rotate-card"><div class="rotate-phone" aria-hidden="true">↻</div><span class="eyebrow">CAHAYA KADIRI</span><h2 id="rotate-title">Mainkan dengan layar mendatar</h2><p>Miringkan ponsel agar pemandangan dan kontrol lebih leluasa.</p><button class="primary" id="landscape-start">Aktifkan landscape</button><p id="rotate-note">Ketuk untuk mencoba layar penuh dan rotasi otomatis.</p></div>';
  ui.append(rotate);
  let blocked=false,busy=false,gestureAttempted=false;
  const pointers=new Map(),latched=new Set();
  const buttons=[...touch.querySelectorAll('[data-key]')];
  function reset(){pointers.clear();latched.clear();buttons.forEach(b=>{b.classList.remove('held');if(b.hasAttribute('data-toggle'))b.setAttribute('aria-pressed','false');});clear();}
  function viewport(){
    const mobile=isMobile();ui.classList.toggle('mobile-ui',mobile);
    const portrait=mobile&&innerHeight>innerWidth;
    if(portrait&&!blocked){reset();onPortrait();}
    blocked=portrait;rotate.hidden=!portrait;
    // Prevent keyboard focus from reaching controls behind the orientation card.
    [...ui.children].filter(el=>el!==rotate).forEach(el=>el.inert=portrait);
  }
  async function requestLandscape(fullscreen=false){
    if(!isMobile()||busy)return;
    busy=true;
    try{
      if(fullscreen&&!document.fullscreenElement&&document.documentElement.requestFullscreen){
        try{await document.documentElement.requestFullscreen({navigationUI:'hide'});}catch{/* Safari or denied fullscreen: still try orientation. */}
      }
      if(screen.orientation?.lock)await screen.orientation.lock('landscape');
    }catch{/* Portrait guidance remains available when the API is unsupported/denied. */}
    finally{
      busy=false;if(signal.aborted)return;viewport();
      if(blocked)ui.querySelector('#rotate-note').textContent='Jika layar belum berputar, aktifkan rotasi otomatis pada ponsel, lalu pegang mendatar.';
    }
  }
  ui.querySelector('#landscape-start').onclick=()=>requestLandscape(true);
  // A browser may require a user activation for fullscreen. Try on the first
  // menu gesture, not on later taps (which would re-enter after an explicit exit).
  ui.addEventListener('click',e=>{
    if(!isMobile()||gestureAttempted||!e.target.closest('button'))return;
    gestureAttempted=true;void requestLandscape(true);
  },{capture:true,signal});
  for(const b of buttons){
    const code=b.dataset.key;
    b.addEventListener('contextmenu',e=>e.preventDefault(),{signal});
    if(b.hasAttribute('data-toggle')){
      b.addEventListener('click',()=>{
        if(!canPlay()||blocked||b.disabled)return;
        if(latched.has(code)){latched.delete(code);up(code,false);}else{latched.add(code);down(code);}
        b.setAttribute('aria-pressed',String(latched.has(code)));
      },{signal});
      continue;
    }
    b.addEventListener('pointerdown',e=>{
      if(!canPlay()||blocked||b.disabled||e.button!==0)return;
      e.preventDefault();pointers.set(e.pointerId,code);b.setPointerCapture(e.pointerId);b.classList.add('held');down(code);
    },{signal});
    const lift=e=>{
      if(!pointers.has(e.pointerId))return;
      pointers.delete(e.pointerId);
      if(![...pointers.values()].includes(code)){up(code,e.type==='pointerup');b.classList.remove('held');}
    };
    for(const event of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(event,lift,{signal});
  }
  window.addEventListener('resize',viewport,{signal});
  screen.orientation?.addEventListener('change',viewport,{signal});
  media.addEventListener('change',viewport,{signal});
  window.addEventListener('blur',reset,{signal});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)reset();},{signal});
  document.addEventListener('fullscreenchange',()=>{reset();if(document.fullscreenElement)void requestLandscape();viewport();},{signal});
  viewport();void requestLandscape();
  return {
    reset,requestLandscape,get blocked(){return blocked;},get enabled(){return isMobile();},
    update(state){
      const has=name=>state.serat.includes(name),light=touch.querySelector('.touch-light');
      light.disabled=!state.pelita||!has('Sabar')||state.oil<=0;
      light.title=has('Sabar')?'Ketuk untuk menyalakan atau mematikan Sorot':'Terbuka setelah Serat Sabar';
      light.querySelector('small').textContent=latched.has('KeyX')?'Menyala':'Pelita';
      if(light.disabled&&latched.delete('KeyX')){up('KeyX',false);light.setAttribute('aria-pressed','false');}
      touch.querySelector('.touch-run').hidden=!has('Asih');
      touch.querySelector('.touch-pulse').hidden=!has('Andhap');
    }
  };
}

const model={setupMobileControls,setupTerrainRendering,followCamera,createSoundscape,SERAT,RELIEF,stepWater,solveRelief,stepOil,isLit,SCENES,VALUES,MANUSCRIPT,ARGUMENTS,newCampaign,awardSerat,canLeave,transition,answerArgument,argumentScore,assembleManuscript};
runtimeScene.__ck=(function createCampaignGame(scene,level,M,css,content){
  'use strict';
  const game=scene.getGame(),get=name=>scene.getObjects(name),player=get('Kirana')[0],body=player.getBehavior('Platformer');
  const updateTerrain=M.setupTerrainRendering(scene,level);
  const D=content.dialogues,$=id=>document.getElementById(id),keys=new Set(),pressed=new Set(),release=new Set(),abort=new AbortController();
  let s=game.__ckState||M.newCampaign(),q=s.quests,mode='title',active=true,clock=0,facing=1,lastFloor=-10,jumpQueued=-10,doubleUsed=false;
  let shining=false,readTime=0,lampDown=0,pulse=0,repel=0,flash=0,shake=0,dash=0,dashCooldown=0,lastTap={key:'',at:-10},sliding=false;
  let camera={x:240,y:level.checkpoints[0][1]-30},dialog=[],dialogAt=0,dialogDone=null,auto=false,autoTime=0,dialogAge=0;
  let toastEnd=0,hintTime=0,lastProgress='',hudTime=0,chaseTime=0,escapeTime=0,risingFog=level.height,footX=16,trapReady=false;
  let history=[],bellPending=null,stealthTime=0,invulnerable=0,readNode='',saved=null,saveWarning=false,lightHistory=new Set(),lastAnim=0;
  let thinTouched=new Map(),crumbled=new Map(),projectile=null,lastProjectile=-10,previewOrder=[],pendingScene=null,dropUntil=0,mobile=null;
  try{saved=JSON.parse(localStorage.getItem('cahayakadiri_save')||'null');}catch{}
  if(!$('ck-style')){const style=document.createElement('style');style.id='ck-style';style.textContent=css;document.head.append(style);}
  $('ck')?.remove();const ui=document.createElement('div');ui.id='ck';document.body.append(ui);
  ui.innerHTML=`<div id="vignette"></div><div id="flash"></div><header id="hud" hidden><div class="memory"><div id="oil" role="img"><span class="flame">◆</span><span class="lamp">⌣</span></div><div><span class="eyebrow">PELITA INGATAN</span><div id="serat-slots"></div></div></div><div class="chapter"><span class="eyebrow">${level.chapter}</span><span>${level.name}</span></div><div class="hud-actions"><button id="journal-button" aria-label="Buka jurnal">J <span>Jurnal</span></button><button id="pause-button" aria-label="Jeda permainan">Ⅱ</button></div></header><div id="objective" hidden><span class="eyebrow">${level.quest.toUpperCase()}</span><p id="quest"></p></div><div id="prompt" hidden></div><div id="toast" role="status" hidden></div><div id="modal"></div><footer id="legend" hidden><span>← → <b>Gerak</b></span><span>↑ ↓ <b>Tangga</b></span><span>Z <b>Lompat</b></span><span>X <b>Pelita</b></span><span>C <b>Interaksi</b></span></footer><nav id="touch" aria-label="Kontrol sentuh" hidden></nav><div id="build-label">CAHAYA KADIRI · ${level.id.toUpperCase()}</div>`;
  const soundscape=game.__ckSoundscape||(game.__ckSoundscape=M.createSoundscape());game.__ckMuted=soundscape.settings.muted;
  function sound(freq=440,len=.12){if(level.id==='Gerbang'&&q.gate&&clock<game.__ckSilenceUntil)return;soundscape.cue('chime',{freq,len});}
  function resetCamera(){M.followCamera(camera,{x:player.getX(),y:player.getY(),onFloor:true,viewW:game.getGameResolutionWidth(),viewH:game.getGameResolutionHeight(),width:level.width,height:level.height,dt:0,snap:true});}
  window.addEventListener('pointerdown',()=>soundscape.unlock(),{signal:abort.signal});
  window.addEventListener('keydown',()=>soundscape.unlock(),{signal:abort.signal});
  function setMode(next){mode=next;mobile?.reset();keys.clear();pressed.clear();release.clear();shining=false;player.activateBehavior('Platformer',next==='play');next==='play'?player.playAnimation():player.pauseAnimation();$('modal').hidden=next==='play';$('touch').hidden=next!=='play';$('prompt').hidden=true;$('toast').hidden=true;}
  function inputText(text){
    if(!mobile?.enabled)return text;
    return text.replaceAll('↓ + Z','Turun + Lompat').replaceAll('Shift + arah','Lari + arah').replace(/tetap tahan X|Tahan X tetap/gi,'biarkan Pelita menyala').replace(/menahan X/gi,'menyalakan Pelita').replace(/tahan X/gi,'nyalakan Pelita').replace(/Ketuk X/gi,'Ketuk Kibas').replace(/X tahan/gi,'Pelita aktif').replace(/X ketuk/gi,'Kibas').replace(/tahan Shift/gi,'aktifkan Lari').replace(/Z atau Spasi/g,'Lompat').replace(/\bShift\b/g,'Lari').replace(/\bZ\b/g,'Lompat').replace(/\bX\b/g,'Pelita').replace(/\bC\b/g,'Interaksi');
  }
  function toast(text){$('toast').textContent=inputText(text);$('toast').hidden=false;toastEnd=clock+4;}
  function save(){s.scene=level.id;s.playSeconds=Math.max(0,s.playSeconds);game.__ckState=s;try{localStorage.setItem('cahayakadiri_save',JSON.stringify(s));saved=JSON.parse(JSON.stringify(s));}catch{if(!saveWarning){toast('Penyimpanan browser tidak tersedia. Sesi tetap dapat dimainkan.');saveWarning=true;}}}
  function dispose(){active=false;abort.abort();ui.remove();keys.clear();}
  function go(name,{revisit=false,resume=false}={}){
    if(!resume&&!revisit&&!M.transition(s,name)){toast('Masih ada ingatan yang perlu dipulihkan di sini.');return;}
    if(revisit&&!s.visited.includes(name))return;
    if(revisit){s.scene=name;s.checkpoint=0;}if(resume)s.scene=name;
    game.__ckState=s;game.__ckStarted=true;try{localStorage.setItem('cahayakadiri_save',JSON.stringify(s));}catch{}
    pendingScene=name;
  }
  function caveGuide(){
    const x=player.getX(),y=player.getY(),guide=(step,label,at,text)=>({step,label,at,text});
    if(!has('Wani')){
      if(y<600&&(s.checkpoint===2||x<512))return guide(1,'Damar Jurang · di bawah',[490,688],'Wani belum diambil. Dari lantai Kilisuci, tekan ↓ + Z untuk turun menembus lantai. Di teras bawah, dekati obor emas berlabel Damar Jurang. Ikuti penunjuk ke bawah.');
      if(y>760){const at=y>1000?[224,1008]:y>900?[352,912]:y>810?[480,816]:[480,720];return guide(1,'Naik menuju Damar Jurang',at,'Naiki pijakan batu dengan Z menuju Damar Jurang: obor emas di teras sebelum jembatan putus. Penunjuk menandai pijakan berikutnya.');}
      if(x<525)return guide(1,'Damar Jurang',[490,688],'Ini Damar Jurang, obor emas tempat menyimpan perjalanan. Dekati untuk mengisi minyak otomatis; C mengisi penuh. Sesudahnya, jalan ke tepi kanan teras.');
      if(x<660)return guide(1,'Tepi kanan teras',[650,714],'Jalan ke tepi kanan teras. Hadap kanan dan tahan X agar pijakan samar terlihat; tetap tahan X ketika melompat dengan Z.');
      if(x<790)return guide(1,'Pijakan menuju Wani',x<738?[712,674]:[776,642],'Tetap tahan X, hadap kanan, lalu lompat dengan Z dari satu pijakan bercahaya ke pijakan berikutnya. Wani ada di tonjolan paling kanan.');
      return guide(1,'Serat Wani',[826,610],'Dekati gulungan bercahaya. Tetap tahan X lalu tekan C untuk mengambil Serat Wani. Sesudahnya, Z sekali lagi di udara memberi lompatan kedua.');
    }
    if(!has('Andhap')){
      if(y>430||x<512){const at=y<=430?[560,400]:x>650?[640,708]:y>615?[352,624]:y>520?[224,528]:[368,432];return guide(2,'Naik ke ruang Kilisuci',at,'Wani terkumpul. Kembali ke teras kiri, lalu naiki batu menuju Kilisuci. Tekan Z, lalu Z lagi saat di udara untuk melompat lebih tinggi.');}
      if(!q.caveRead)return guide(2,'Pahatan pertapaan',[672,378],'Berdiri di depan pahatan lima simbol di kanan Kilisuci. Diam dan tahan X selama satu detik sampai urutan simbol muncul.');
      return guide(3,'Lima cerukan lilin',[772,376],'Pahatan terbaca. Dekati kelompok lima lilin kecil lalu tekan C. Nyalakan Air → Akar → Bunga → Bulan → Pelita. Setiap lilin memakai 3 minyak.');
    }
    if(q.escaped)return guide(4,'Gerbang Dhaha',level.exit,'Lorong berhasil dilewati. Dekati pintu di ujung kanan dan tekan C untuk menuju Gerbang Dhaha.');
    const at=y>325?[840,336]:y>277?[720,288]:y>229?[824,240]:y>170?[864,176]:level.exit;
    return guide(4,y>170?'Naik ke lorong keluar':'Keluar goa →',at,y>170?'Andhap terkumpul. Naiki batu di kanan lima lilin, lalu ikuti penunjuk ke lorong atas.':'Terus ke kanan melewati celah. Tekan Z lalu Z lagi di udara untuk melompat jauh; tahan Shift untuk berlari.');
  }
  function objective(){switch(level.id){
    case'Prolog':return q.books.length<3?`Kembalikan buku ke tiga lantai · ${q.books.length}/3. Tangga besi berada di kanan.`:'Buka buku Keong Mas di loteng.';
    case'Pasar':return !q.marketStarted?'Temui Mbok penjual di warung.':q.orders.length<3?`Antarkan tiga pesanan · ${q.orders.length}/3.`:!q.chaseWon?'Ikuti lutung melalui atap sampai dermaga.':'Berikan makanan pada lutung, lalu lanjut ke taman.';
    case'Petirtaan':return !s.pelita?'Temui Ki Jati di taman.':!s.sabar?'Buka Hulu dan Akar, tutup Hilir. Diam di damar tengah.':!s.drained?'Tutup Hulu dan Akar, buka Hilir.':!s.jujur?'Sorot pijakan lupa. Diam + X untuk membaca relief.':'Serat Sabar dan Jujur pulih. Lanjut ke Bukit Klotok.';
    case'Bukit':{const g=caveGuide();return `Langkah ${g.step}/4 · ${g.text}`;}
    case'Gerbang':return !q.gate?`Ungkap empat petunjuk · ${q.clues.length}/4. Kendi, cermin, gudang, batu lupa.`:'Gerbang terbuka. Terjang Kabut: ketuk arah dua kali.';
    case'Kedaton':return !q.tapakTrapped?'Pancing Tapak Hampa ke bilik buntu, lalu tutup pintunya.':q.bells.length<3?`Jebak Bayang Galuh di tiga lonceng · ${q.bells.length}/3. C, lalu segera lompat.`:!q.pusaka?'Periksa lemari pusaka di loteng.':'Masuki Bangsal Sunyi.';
    case'Bangsal':return q.pillars.length<2?`Fase Menghapus · nyalakan dua pilar dengan X + C (${q.pillars.length}/2).`:q.pillars.length<4?`Fase Menenggelamkan · nyalakan dua pilar lagi (${q.pillars.length}/4).`:!q.debate?'Dengarkan argumen Ki Samar.':'Nama Ki Samar tersimpan. Temui Tuan Putri.';
    case'Putri':return !q.manuscript?'Susun tujuh serat menurut kronologi kisah, di meja manuskrip.':'Kisah kembali utuh. Pulanglah ke perpustakaan.';
    case'Epilog':return !q.epilogueRead?'Buka kembali buku Keong Mas di meja.':'Baca poster UKM dan teruskan kisah ini.';
  }}
  function hud(){const own=s.serat.join(',');if($('serat-slots').dataset.owned!==own){$('serat-slots').innerHTML=M.SERAT.map(([name])=>`<i class="${s.serat.includes(name)?'filled':''}" title="Serat ${name}" aria-label="${name}: ${s.serat.includes(name)?'terkumpul':'belum'}"></i>`).join('');$('serat-slots').dataset.owned=own;}$('oil').style.setProperty('--oil',s.pelita?Math.max(.08,s.oil/100):0);$('oil').setAttribute('aria-label',s.pelita?`Minyak ${Math.round(s.oil)} persen`:'Pelita belum diperoleh');$('quest').textContent=inputText(objective());mobile?.update(s);}
  function enter(){q=s.quests;const cp=level.checkpoints[s.checkpoint]||level.checkpoints[0];player.setPosition(...cp);body.setCurrentSpeed(0);body.setCurrentFallSpeed(0);resetCamera();setMode('play');$('hud').hidden=false;$('objective').hidden=false;$('legend').hidden=false;get('Scroll').forEach(o=>{const id=o.getVariables().get('kidung').getAsNumber();if(id)o.hide(s.kidung.includes(id));});hud();save();if(D['intro'+level.id])showDialog(D['intro'+level.id]);}
  function title(){setMode('title');$('hud').hidden=true;$('objective').hidden=true;$('legend').hidden=true;const canResume=saved&&[1,2].includes(saved.version);$('modal').innerHTML=`<section class="title-screen"><div class="title-ornament">✧</div><span class="eyebrow">SERAT SAPTA KETELADANAN</span><h1>Cahaya<br><em>Kadiri</em></h1><div class="gold-rule"></div><p>Ada kisah yang hanya hidup<br>selama seseorang masih mengingatnya.</p><div class="title-buttons"><button class="primary" id="start">Mulai kisah <span>→</span></button>${canResume?'<button id="continue">Lanjutkan perjalanan</button>':''}</div><span class="title-note">SEBUAH PERJALANAN DARI INGATAN KE CAHAYA</span></section>`;
    $('start').onclick=()=>{s=M.newCampaign();q=s.quests;game.__ckState=s;game.__ckStarted=true;if(level.id!=='Prolog')go('Prolog',{resume:true});else enter();};if($('continue'))$('continue').onclick=()=>{s=M.newCampaign(saved);q=s.quests;game.__ckState=s;game.__ckStarted=true;if(s.scene!==level.id)go(s.scene,{resume:true});else enter();};}
  function showDialog(lines,done){dialog=lines;dialogAt=0;dialogDone=done;auto=false;autoTime=0;dialogAge=0;setMode('dialog');renderDialog();}
  function renderDialog(){const[who,text]=dialog[dialogAt];$('modal').innerHTML=`<section class="dialog" aria-label="Percakapan"><div class="dialog-marker">${who==='Kirana'?'❖':'✦'}</div><div class="dialog-content"><span class="eyebrow">${who}</span><p>${inputText(text)}</p><div class="dialog-controls"><button id="skip-dialog" ${dialogAge<2?'disabled':''}>Lewati</button><button id="auto-dialog">${auto?'Auto aktif':'Auto'}</button><span>${dialogAt+1} / ${dialog.length}</span><button id="next-dialog" class="next">${dialogAt===dialog.length-1?'Selesai':'Lanjut'} →</button></div></div></section>`;$('skip-dialog').onclick=endDialog;$('next-dialog').onclick=nextDialog;$('auto-dialog').onclick=()=>{auto=!auto;autoTime=0;renderDialog();};}
  function nextDialog(){autoTime=0;if(++dialogAt===dialog.length)endDialog();else renderDialog();}
  function endDialog(){const done=dialogDone;dialogDone=null;setMode('play');if(done)done();if(active)hud();}
  function award(name,then){if(!M.awardSerat(s,name)){if(then)then();return;}const controls={Asih:'Shift + arah untuk lari; ↓ + arah untuk geser.',Wani:'Tekan Z atau Spasi sekali lagi ketika masih di udara untuk membuat Pijakan Cahaya dan melompat lagi.',Andhap:'Ketuk X untuk Kibas. Tahan X tetap untuk Sorot.',Setya:'Ketuk arah yang sama dua kali untuk menerjang kabut.',Wicaksana:'Tahan X. Jangkauan Sorot kini dua kali lebih jauh.'};soundscape.cue('reward');save();showDialog([['Ingatan Candra Kirana',D.flashbacks[name]],['Serat '+name,M.SERAT.find(r=>r[0]===name)[2]+' kini terbuka. '+(controls[name]||'')]],()=>{toast('Serat '+name+' ditemukan.');if(then)then();});}
  function pause(){setMode('pause');$('modal').innerHTML=`<section class="panel"><span class="eyebrow">SEJENAK MENGINGAT</span><h2>Pelita tetap menyala.</h2><div class="stack"><button id="resume" class="primary">Lanjutkan perjalanan →</button><button id="return-damar">Kembali ke checkpoint</button><button id="sound-toggle">Suara: ${game.__ckMuted?'mati':'aktif'}</button><button id="main-menu">Kembali ke judul</button></div><p class="subtle">Z: lompat · X tahan: sorot / baca · X ketuk: kibas<br>Shift: lari · ↓ + arah: geser · ketuk arah dua kali: dash<br>Kemampuan terbuka seiring serat ditemukan.</p></section>`;$('resume').onclick=()=>setMode('play');$('return-damar').onclick=()=>{setMode('play');respawn();};$('sound-toggle').onclick=()=>{game.__ckMuted=!game.__ckMuted;soundscape.setMuted(game.__ckMuted);pause();};if(mobile?.enabled)$('modal').querySelector('.subtle').textContent='Arah: gerak / tangga. Turun + Lompat: turun pijakan. Pelita: ketuk untuk menyala / mati. Lari: ketuk untuk aktif / mati. Kibas: satu ketukan. Ketuk arah dua kali untuk dash. Kemampuan terbuka seiring serat ditemukan.';audioControls();$('main-menu').onclick=()=>{save();title();};}
  function audioControls(){const box=document.createElement('div');box.className='audio-controls';box.innerHTML=[['ambience','Suasana'],['music','Musik'],['effects','Efek suara']].map(([key,label])=>`<label>${label}<input aria-label="Volume ${label.toLowerCase()}" type="range" min="0" max="100" value="${Math.round(soundscape.settings[key]*100)}" data-audio="${key}"><output>${Math.round(soundscape.settings[key]*100)}%</output></label>`).join('');$('modal').querySelector('.panel').append(box);box.querySelectorAll('input').forEach(input=>input.oninput=()=>{soundscape.setMix(input.dataset.audio,Number(input.value)/100);input.nextElementSibling.value=input.value+'%';});}
  function journal(tab='Serat'){
    setMode('journal');const cast=[['Kirana','Mahasiswi UKM Pendidikan & Penalaran yang belajar meneruskan kisah.'],['Candra Kirana','Putri dalam cerita Keong Mas dan tradisi Panji.'],['Ki Jati','Abdi taman yang mulai lupa nama anaknya sendiri.'],['Dewi Kilisuci','Pertapa dalam adaptasi ini yang membantu Kirana memahami kelalaian.'],['Ki Samar','Pujangga dan penjaga arsip yang lelah karena tak pernah dibaca.'],['Mbok Rondo Dadapan','Penjual yang tetap bertahan dalam ingatan; penolong keong emas.'],['Bayang Galuh','Sisa rasa iri yang berharap versinya juga didengar.']];
    const bodyHtml=tab==='Serat'?`<div class="serat-list">${M.SERAT.map(([name,value,ability],i)=>`<article class="${s.serat.includes(name)?'collected':'locked'}"><span>0${i+1}</span><div><h3>Serat ${name}</h3><p>${s.serat.includes(name)?value+' · '+ability:'Belum ditemukan'}</p></div><b>${s.serat.includes(name)?'✦':'◇'}</b></article>`).join('')}</div>`:tab==='Tokoh'?`<div class="journal-copy">${cast.map(([name,text])=>`<h3>${name}</h3><p>${inputText(text)}</p>`).join('')}</div>`:tab==='Kadiri'?`<div class="journal-copy"><p>${s.kidung.length} / 12 Kidung Terlupa</p>${content.history.map(h=>`<article class="history-entry"><h3>${h.id}. ${s.kidung.includes(h.id)?h.title:'Kidung belum ditemukan'}</h3>${s.kidung.includes(h.id)?`<p>${h.text}</p><a href="${h.source}" target="_blank" rel="noopener noreferrer">Sumber: ${h.label} ↗</a>`:''}</article>`).join('')}</div>`:`<div class="stack">${M.SCENES.map((name,i)=>`<button data-travel="${name}" ${!s.visited.includes(name)||name===level.id?'disabled':''}>${i===0?'P':i} · ${name}${name===level.id?' — di sini':''}</button>`).join('')}</div><p class="subtle">Kunjungi kembali area yang sudah terbuka untuk mencari Kidung yang terlewat.</p>`;
    $('modal').innerHTML=`<section class="panel journal"><div class="panel-head"><div><span class="eyebrow">YANG TIDAK INGIN KULUPAKAN</span><h2>Jurnal Nusantara</h2></div><button id="close-journal" aria-label="Tutup jurnal">×</button></div><nav class="tabs">${['Serat','Tokoh','Kadiri','Perjalanan'].map(t=>`<button data-tab="${t}" class="${tab===t?'active':''}">${t}</button>`).join('')}</nav>${bodyHtml}</section>`;$('close-journal').onclick=()=>setMode('play');ui.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>journal(b.dataset.tab));ui.querySelectorAll('[data-travel]').forEach(b=>b.onclick=()=>go(b.dataset.travel,{revisit:true}));
  }
  function choice(title,text,options,onPick){setMode('choice');$('modal').innerHTML=`<section class="panel"><span class="eyebrow">${level.quest}</span><h2>${title}</h2><p>${inputText(text)}</p><div class="stack">${options.map((label,i)=>`<button data-choice="${i}">${label}</button>`).join('')}</div><button id="cancel-choice">Kembali</button></section>`;ui.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>{setMode('play');onPick(Number(b.dataset.choice));});$('cancel-choice').onclick=()=>setMode('play');}
  function orderedPuzzle(kind){
    const manuscript=kind==='manuscript';if(manuscript&&(s.serat.length<7||!q.debate)){toast('Tujuh serat dan nama Ki Samar harus pulih terlebih dahulu.');return;}
    previewOrder=[];setMode('puzzle');const entries=manuscript?M.MANUSCRIPT:M.RELIEF;
    const arranged=manuscript?[entries[4],entries[2],entries[6],entries[0],entries[5],entries[3],entries[1]]:[entries[2],entries[0],entries[3],entries[1]];
    function render(){
      $('modal').innerHTML=`<section class="panel relief-panel"><span class="eyebrow">${manuscript?'TUJUH SERAT · SATU KISAH':'RELIEF YANG AUS'}</span><h2>${manuscript?'Kembalikan urutan kisah.':'Susun kembali sebuah kisah.'}</h2><p>${manuscript?'Seret kepingan ke tempat kosong, atau ketuk menurut urutan peristiwa.':'Pilih panel menurut urutan peristiwa.'} Ketuk kepingan terpilih untuk mengurungkan.</p><div class="relief-slots ${manuscript?'seven':''}">${entries.map((_,i)=>`<button data-slot="${i}">${previewOrder[i]?entries.find(r=>r.id===previewOrder[i]).title:String(i+1).padStart(2,'0')+' · · ·'}</button>`).join('')}</div><div class="relief-cards ${manuscript?'seven-cards':''}">${arranged.map(r=>`<button draggable="true" data-relief="${r.id}" class="${previewOrder.includes(r.id)?'selected':''}"><span class="relief-icon">${manuscript?'✦':'❋'}</span><strong>${r.title}</strong><small>${r.text}</small></button>`).join('')}</div><div id="relief-feedback" role="status">${(manuscript?q.manuscriptAttempts:s.attempts)>=3?'Petunjuk: '+entries.map(r=>r.title).join(' → '):'Setiap peristiwa membuka jalan bagi yang berikutnya.'}</div><div class="panel-buttons"><button id="cancel-relief">Kembali</button><button id="check-relief" class="primary" ${previewOrder.filter(Boolean).length!==entries.length?'disabled':''}>Satukan ingatan →</button></div></section>`;
      ui.querySelectorAll('[data-relief]').forEach(b=>{b.onclick=()=>{const id=b.dataset.relief;if(previewOrder.includes(id))previewOrder=previewOrder.filter(v=>v!==id);else{const empty=previewOrder.findIndex(v=>!v);if(empty>=0)previewOrder[empty]=id;else previewOrder.push(id);}render();};b.ondragstart=e=>e.dataTransfer.setData('text/plain',b.dataset.relief);});
      ui.querySelectorAll('[data-slot]').forEach(b=>{b.onclick=()=>{previewOrder.splice(Number(b.dataset.slot),1);render();};b.ondragover=e=>e.preventDefault();b.ondrop=e=>{e.preventDefault();const id=e.dataTransfer.getData('text/plain');if(!entries.some(r=>r.id===id))return;const old=previewOrder.indexOf(id),dest=Number(b.dataset.slot);if(old>=0)[previewOrder[old],previewOrder[dest]]=[previewOrder[dest],previewOrder[old]];else if(!previewOrder[dest])previewOrder[dest]=id;render();};});
      $('cancel-relief').onclick=()=>setMode('play');$('check-relief').onclick=()=>{
        if(manuscript){if(M.assembleManuscript(s,previewOrder)){save();showDialog(D.putriEnd,()=>{flash=1;save();});}else{save();render();$('relief-feedback').textContent='Candra Kirana: Cobalah ingat yang terjadi sebelum pertolongan Mbok. '+(q.manuscriptAttempts>=3?entries.map(r=>r.title).join(' → '):'Tidak perlu tergesa.');}}
        else{const before=s.serat.includes('Jujur'),result=M.solveRelief(s,previewOrder);setMode('play');if(result==='solved'){save();showDialog([...D.jujur,['Ingatan Candra Kirana',D.flashbacks.Jujur]],()=>{save();toast('Serat Jujur · Pelita: Baca');});}else{respawn('Urutan belum menyatu. Air pasang mengembalikanmu ke teras atas.');save();}}
      };
    }render();
  }
  function debate(){if(q.debate){showDialog([['Ki Samar','Kini ada yang membaca namaku. Terima kasih, Kirana.']]);return;}const index=q.answers.length,a=M.ARGUMENTS[index];choice('Ki Samar',a.question,a.options,pick=>{M.answerArgument(s,pick);save();if(q.debate){showDialog([...D.samarEnd,['Narasi',M.argumentScore(s)===3?'Kelima pilar menyala terang. Ki Samar menulis namanya dan larut menjadi cahaya.':'Pilar terakhir menyala lembut. Perbedaan jawaban tak menghapus keberanian untuk saling mendengar. Ki Samar menulis namanya.']],()=>{flash=.8;save();});}else debate();});}
  function ending(){if(!q.epilogueRead){toast('Baca dahulu halaman terakhir buku Keong Mas.');return;}s.completed=true;s.golden=s.kidung.length===12;save();const render=()=>{setMode('complete');$('modal').innerHTML=`<section class="panel completion"><div class="title-ornament">✧</div><span class="eyebrow">${s.golden?'ENDING EMAS':'KISAH YANG DITERUSKAN'}</span><h2>Cahaya itu<br>kini ada padamu.</h2><p>Kirana pulang membawa tujuh nilai<br>dan satu nama yang kembali diingat.</p><div class="summary"><span>Serat ${s.serat.length}/7</span><span>Kidung ${s.kidung.length}/12</span><span>${Math.round((s.serat.length+s.kidung.length)/19*100)}%</span></div><div class="stack"><button id="end-journal" class="primary">Buka Jurnal Nusantara →</button><button id="end-explore">Cari ingatan yang terlewat</button>${/^https?:\/\//.test(content.site.ukmUrl)?'<button id="ukm-link">Kembali ke situs UKM PP ↗</button>':''}<button id="end-title">Kembali ke judul</button></div>${content.site.eventDate?`<p>${content.site.eventName} · ${content.site.eventDate}</p>`:''}</section>`;$('end-journal').onclick=()=>journal();$('end-explore').onclick=()=>journal('Perjalanan');$('end-title').onclick=title;if($('ukm-link'))$('ukm-link').onclick=()=>window.open(content.site.ukmUrl,'_blank','noopener,noreferrer');};if(s.golden)showDialog(D.golden,render);else render();}
  function respawn(message='Kabut menyapumu kembali ke Damar Pengingat.'){
    let cp=level.checkpoints[s.checkpoint]||level.checkpoints[0];if(level.id==='Pasar'&&q.chase&&!q.chaseWon){cp=level.checkpoints[1];chaseTime=0;}if(level.id==='Bukit'&&s.serat.includes('Andhap')&&!q.escaped){cp=level.checkpoints[2];escapeTime=0;}
    player.setPosition(...cp);body.setCurrentSpeed(0);body.setCurrentFallSpeed(0);resetCamera();soundscape.cue('respawn');s.oil=Math.max(45,s.oil-15);invulnerable=clock+3;repel=clock+4;keys.clear();pressed.clear();flash=.8;toast(message);history=[];bellPending=null;risingFog=level.height;
  }
  function near(n,r=40){return Math.hypot(player.getX()+16-(n.x+10),player.getY()+16-(n.y+16))<r;}
  function has(name){return s.serat.includes(name);}
  function reveal(index,text){if(!q.clues.includes(index))q.clues.push(index);save();showDialog([['Kirana',text]]);}
  // Scene-specific interactions are defined below; input and physics are shared.
  function interactNode(n){
    switch(n.type){
      case'book':if(!q.books.includes(n.index)){q.books.push(n.index);save();sound(660);toast(['Cerita rakyat kembali ke raknya.','Pengetahuan kembali ke raknya.','Arsip kembali ke raknya.'][n.index]);}else toast('Buku ini sudah kukembalikan.');break;
      case'lamp':q.lamps[n.index]=!q.lamps[n.index];save();toast('Lampu '+(q.lamps[n.index]?'dinyalakan.':'dimatikan.'));break;
      case'portal':if(!M.canLeave(s,'Prolog'))toast('Tiga buku belum kembali ke raknya.');else showDialog(D.portal,()=>{flash=1;go('Pasar');});break;
      case'mbok':if(!q.marketStarted)showDialog(D.mbok,()=>{q.marketStarted=true;save();});else showDialog([['Mbok Rondo',q.orders.length<3?'Pelanggan ada di bawah, panggung, dan atap, Nduk.':'Bungkusan itu untuk Tuan Putri. Lutung membawanya ke dermaga.']]);break;
      case'order':if(!q.marketStarted){toast('Pesanan ada pada Mbok penjual.');break;}if(!q.orders.includes(n.index)){q.orders.push(n.index);save();if(q.orders.length===3&&!q.chaseWon)showDialog(D.chase,()=>{q.chase=true;s.checkpoint=1;chaseTime=0;save();});else toast('Pesanan diterima · '+q.orders.length+'/3.');}break;
      case'lutung':if(q.orders.length<3){toast('Lutung melindungi bungkusan. Antar dulu pesanan Mbok.');break;}choice('Lutung yang lapar','Ia mendekap bungkusan dan menatap sisa sarapanmu.',['Berikan sisa makanan','Coba merebut bungkusan'],pick=>{if(pick===0){q.chaseWon=true;q.chase=false;showDialog(D.asih,()=>award('Asih'));}else toast('Lutung mundur. Mungkin ia membutuhkan sesuatu darimu.');});break;
      case'dakon':dakon();break;
      case'slide':if(!has('Asih'))toast('Celah terlalu rendah. Langkah Cepat belum terbuka.');else toast('Tahan ↓ sambil bergerak untuk menyusup ke bawah dermaga.');break;
      case'jati':if(!s.pelita)showDialog(D.jati,()=>{s.pelita=true;save();});else showDialog([['Ki Jati',!s.sabar?'Hulu dan Akar terbuka, Hilir tertutup. Diam delapan denyut di damar tengah.':!s.drained?'Balik ketiganya: Hulu tutup, Hilir buka, Akar tutup.':'Di depan relief, tahan pelita sambil diam. Akan kubantu membaca sampai kisahnya utuh.']]);break;
      case'relief':if(!s.drained)toast('Alihkan air di teras bawah terlebih dahulu.');else if(s.jujur)showDialog([['Kirana','Putri, kutukan, pertolongan Mbok, lalu kepulangan.']]);else if(readNode!==n.id||readTime<1)toast('Diam sambil menahan X untuk membaca relief.');else orderedPuzzle('relief');break;
      case'wani':if(!shining){toast('Percayakan pijakanmu pada pelita. Tahan X.');break;}award('Wani');break;
      case'kilisuci':showDialog(has('Wani')?D.kilisuci:[...D.kilisuci,['Dewi Kilisuci','Wani menunggumu di tonjolan kanan bawah goa. Turun dengan ↓ + Z dari lantai ini menuju obor berlabel Damar Jurang. Dekati obor untuk mengisi minyak, lalu menuju tepi kanan. Tahan X sambil melompat pada pijakan bercahaya; di dekat Wani, tetap tahan X lalu tekan C.']]);break;
      case'carving':if(!has('Jujur')||!q.caveRead&&(readNode!==n.id||readTime<1)){toast('Diam dan tahan X di dekat pahatan sampai terbaca.');break;}q.caveRead=true;save();showDialog([['Pahatan pertapaan','Air → akar → bunga → bulan → pelita. Nyalakan cerukan di sebelah kanan menurut urutan ini.']]);break;
      case'candles':if(!has('Wani')||!q.caveRead){toast('Ambil cahaya di jurang dan baca pahatan terlebih dahulu.');break;}candlePuzzle();break;
      case'escape':if(!has('Andhap'))toast('Lima cerukan masih menyimpan satu serat.');else{if(!escapeTime)escapeTime=.01;toast('Goa memudar dari belakang. Ikuti lorong atas ke kanan!');}break;
      case'guard':q.guardTalk++;save();showDialog([['Penjaga',q.guardTalk>=3?'Nama yang kau cari: D–A–H–A. Namun empat batu tetap perlu dipulihkan.':'Air membuka lumut, cermin menggeser bayang. Kunci ada pada penjaga di menara. Tanyakan lagi jika kau buntu.']]);break;
      case'jug':q.jug=true;save();toast('Kendi air dibawa.');break;
      case'moss':if(!q.jug)toast('Lumut menutupi aksara. Cari kendi air.');else reveal(0,'Lumut tersapu air. Aksara pertama ditransliterasikan: D.');break;
      case'mirror':reveal(1,'Cermin mengarahkan cahaya senja. Bayangan memperlihatkan aksara kedua: A.');break;
      case'sleeper':if(q.key){toast('Kunci sudah kau bawa.');break;}if(stealthTime<2){toast('Dekati pelan dengan ↓, tunggu ia tertidur, lalu ambil kunci.');break;}q.key=true;save();toast('Kunci diambil tanpa membangunkan penjaga.');break;
      case'store':if(!q.key)toast('Gudang terkunci.');else reveal(2,'Gulungan di gudang memuat aksara ketiga: H.');break;
      case'lost':if(!shining||readTime<1)toast('Diam + X untuk mengungkap aksara yang dilupakan.');else reveal(3,'Di bawah cahaya pelita, aksara terakhir kembali: A.');break;
      case'gate':if(q.gate){toast('Gerbang telah mengenali nama Dhaha.');break;}gatePuzzle();break;
      case'trap':if(q.tapakTrapped)toast('Langkah itu tertahan di bilik.');else if(Math.abs(footX-272)<85){q.tapakTrapped=true;save();toast('Pintu menutup. Tapak Hampa tertahan.');}else toast('Pancing langkah mendekat ke bilik ini, lalu tutup pintunya dengan C.');break;
      case'bell':if(!q.tapakTrapped){toast('Tapak Hampa masih memburu. Pancing ke bilik buntu dahulu.');break;}if(q.bells.includes(n.index)){toast('Lonceng ini sudah berdentang.');break;}if(n.index!==q.bells.length){toast('Mulai dari lonceng barat, lalu tengah dan timur.');break;}bellPending={index:n.index,x:n.x,y:n.y,at:clock+.9};toast('Lonceng terlepas… lompat sekarang!');sound(330,.6);break;
      case'pusaka':if(q.bells.length<3){toast('Bayang Galuh masih memenuhi pendapa.');break;}q.pusaka=true;save();showDialog(D.pusaka);break;
      case'pillar':if(q.pillars.includes(n.index)){toast('Pilar ini telah menyala.');break;}if(n.index!==q.pillars.length){toast('Nyalakan pilar sesuai urutan cahaya.');break;}if(!shining){toast('Tahan X lalu C untuk menyalakan pilar.');break;}q.pillars.push(n.index);s.oil=Math.min(100,s.oil+25);save();sound(523+n.index*80,.5);if(q.pillars.length===4)award('Wicaksana',()=>toast('Ki Samar menunggu jawabanmu.'));else toast(q.pillars.length===2?'Kabut pekat naik. Capai dua pilar berikutnya.':'Pilar menyala. Sebagian Kadiri kembali tampak.');break;
      case'samar':if(q.debate)go('Putri');else if(q.pillars.length<4)showDialog([['Ki Samar','Masih ada ingatan yang belum berani kau jangkau.']]);else debate();break;
      case'putri':showDialog(q.manuscript?D.putriEnd:D.introPutri);break;
      case'manuscript':if(q.manuscript)showDialog([['Kirana','Tujuh serat telah menjadi satu kisah.']]);else orderedPuzzle('manuscript');break;
      case'lastbook':showDialog(D.lastbook,()=>{q.epilogueRead=true;save();});break;
      case'poster':ending();break;
      case'push':toast('Dorong dengan berjalan menempel pada rak atau keranjang.');break;
      default:showDialog([['Kirana',level.id==='Prolog'?'Poster UKM Pendidikan & Penalaran. Ada banyak cara membuat kisah lama bertemu pembaca baru.':level.id==='Pasar'?'Orang-orang masih menyebut Candra Kirana, tetapi suaranya ragu-ragu. Sebuah warung berkedip di ujung pandanganku.':'Akar tumbuh di sela bata. Jalan pintas tidak mengembalikan serat yang tertinggal.']]);
    }
  }
  function gatePuzzle(){if(q.clues.length<4){toast('Pulihkan empat petunjuk sebelum memutar batu.');return;}setMode('choice');let letters=['A','D','A','H'];function render(){$('modal').innerHTML=`<section class="panel"><span class="eyebrow">NAMA SEJATI KERAJAAN</span><h2>Empat batu putar</h2><p>Transliterasi aksara: putar setiap batu sampai nama lama kerajaan terbaca.</p><div class="gate-dials">${letters.map((l,i)=>`<button data-dial="${i}" aria-label="Batu ${i+1}: ${l}">${l}</button>`).join('')}</div><div class="panel-buttons"><button id="gate-back">Kembali</button><button class="primary" id="gate-check">Buka gerbang</button></div><p id="gate-message"></p></section>`;ui.querySelectorAll('[data-dial]').forEach(b=>b.onclick=()=>{const i=Number(b.dataset.dial);letters[i]=['A','D','H'][(['A','D','H'].indexOf(letters[i])+1)%3];render();});$('gate-back').onclick=()=>setMode('play');$('gate-check').onclick=()=>{if(letters.join('')==='DAHA'){q.gate=true;save();award('Setya',()=>showDialog(D.samarGate,()=>{game.__ckSilenceUntil=clock+15;}));}else $('gate-message').textContent='Belum tepat. Ingat urutan petunjuk: D · A · H · A.';};}render();}
  function candlePuzzle(){if(has('Andhap')){toast('Kelima cerukan telah menyala.');return;}const names=['Air','Akar','Bunga','Bulan','Pelita'];choice('Lima cerukan',q.candles.length+'/5 menyala. Urutan pahatan: Air → akar → bunga → bulan → pelita.',names,i=>{if(s.oil<3){toast('Minyak hampir habis. Isi di damar dekat Kilisuci.');return;}s.oil-=3;if(i===q.candles.length)q.candles.push(i);else{q.candles=[];toast('Nyala padam. Baca kembali urutan pahatan.');}save();if(q.candles.length===5)showDialog(D.andhap,()=>award('Andhap'));else candlePuzzle();});}
  let dakonState=null;
  function dakon(){if(q.dakon){toast('Anak itu tersenyum. Kidung sudah menjadi hadiahmu.');return;}dakonState={pits:[2,3,1,4,2,1,0],turns:0};renderDakon();}
  function renderDakon(){setMode('choice');$('modal').innerHTML=`<section class="panel"><span class="eyebrow">DAKON · TANTANGAN ANAK PASAR</span><h2>Antarkan biji ke lumbung.</h2><p>Pilih lubang, lalu bagikan isinya satu per satu ke kanan. Kumpulkan sedikitnya 4 biji di lumbung dalam 6 giliran.</p><div class="dakon">${dakonState.pits.slice(0,6).map((v,i)=>`<button data-pit="${i}" ${v===0?'disabled':''}>${v}</button>`).join('')}<strong>${dakonState.pits[6]}</strong></div><p>Giliran ${dakonState.turns}/6</p><button id="dakon-back">Kembali</button></section>`;$('dakon-back').onclick=()=>setMode('play');ui.querySelectorAll('[data-pit]').forEach(b=>b.onclick=()=>{let i=Number(b.dataset.pit),count=dakonState.pits[i];dakonState.pits[i]=0;while(count-->0){i=(i+1)%7;dakonState.pits[i]++;}dakonState.turns++;sound(520);if(dakonState.pits[6]>=4){q.dakon=true;if(!s.kidung.includes(2))s.kidung.push(2);save();showDialog([['Anak pasar','Kamu memperhatikan ke mana setiap biji pergi! Ini gulungan yang kutemukan di warung.']]);}else if(dakonState.turns>=6){choice('Coba lagi','Biji belum cukup sampai di lumbung. Lubang yang dekat lumbung sering memberi jalan lebih cepat.',['Main lagi'],()=>dakon());}else renderDakon();});}
  function readableAtPlayer(){return level.nodes.find(n=>['relief','carving','lost'].includes(n.type)&&Math.hypot(player.getX()+16-n.x-32,player.getY()-n.y)<72);}
  function interact(){if(level.id!=='Prolog'&&level.next&&M.canLeave(s,level.id)&&Math.hypot(player.getX()+16-level.exit[0],player.getY()-level.exit[1])<46){go(level.next);return;}const readable=readableAtPlayer();if(readable){interactNode(readable);return;}const nearby=level.nodes.filter(n=>near(n,38)).sort((a,b)=>Math.abs(player.getX()-a.x)-Math.abs(player.getX()-b.x));if(nearby.length){interactNode(nearby[0]);return;}
    const x=player.getX()+16,y=player.getY()+16,lever=level.levers.findIndex(([lx,ly])=>Math.hypot(x-lx-8,y-ly-12)<32);
    if(lever>=0){if(!s.pelita){toast('Temui Ki Jati terlebih dahulu.');return;}s.levers[lever]=!s.levers[lever];save();sound(523);toast(['Hulu','Hilir','Akar'][lever]+(s.levers[lever]?' dibuka.':' ditutup.'));return;}
    if(Math.hypot(x-level.exit[0],y-level.exit[1]-16)<46){if(level.next)go(level.next);else ending();return;}
    const cp=level.damars.findIndex(([dx,dy])=>Math.hypot(x-dx-10,y-dy+16)<36);if(cp>=0){s.checkpoint=cp;s.oil=100;save();soundscape.cue('checkpoint');toast('Ingatan tersimpan · minyak penuh.');}
  }
  const down=(...codes)=>codes.some(k=>keys.has(k)),once=(...codes)=>codes.some(k=>pressed.has(k));
  const allowed=['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','KeyA','KeyD','KeyW','KeyS','KeyZ','Space','KeyX','KeyC','KeyE','KeyJ','Escape','Enter','ShiftLeft','ShiftRight'];
  function keyDown(code){if(keys.has(code))return;keys.add(code);pressed.add(code);if(code==='KeyX')lampDown=clock;
    if(mode==='play'&&['ArrowLeft','ArrowRight','KeyA','KeyD'].includes(code)){if(has('Setya')&&lastTap.key===code&&clock-lastTap.at<.28&&clock>dashCooldown){dash=.22;dashCooldown=clock+.8;soundscape.cue('dash');}lastTap={key:code,at:clock};}}
  window.addEventListener('keydown',e=>{if(!allowed.includes(e.code))return;e.preventDefault();if(!e.repeat)keyDown(e.code);},{signal:abort.signal});
  window.addEventListener('keyup',e=>{if(!allowed.includes(e.code))return;e.preventDefault();keys.delete(e.code);release.add(e.code);},{signal:abort.signal});
  window.addEventListener('blur',()=>{keys.clear();if(mode==='play')pause();},{signal:abort.signal});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&mode==='play')pause();},{signal:abort.signal});
  mobile=M.setupMobileControls({ui,signal:abort.signal,down:keyDown,up:(code,emit=true)=>{keys.delete(code);if(emit)release.add(code);},clear:()=>{keys.clear();pressed.clear();release.clear();},onPortrait:()=>{if(mode==='play')pause();},canPlay:()=>mode==='play'});
  $('journal-button').onclick=()=>mode==='play'?journal():null;$('pause-button').onclick=()=>mode==='play'?pause():null;
  const fullscreenButton=document.createElement('button');fullscreenButton.id='fullscreen-button';fullscreenButton.textContent='⛶';
  const fullscreenLabel=()=>{const label=document.fullscreenElement?'Keluar layar penuh':'Layar penuh';fullscreenButton.setAttribute('aria-label',label);fullscreenButton.title=label;};
  fullscreenLabel();ui.querySelector('.hud-actions').prepend(fullscreenButton);
  fullscreenButton.onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else if(mobile.enabled)await mobile.requestLandscape(true);else if(document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();else toast('Gunakan pilihan layar penuh pada browser.');}catch{toast('Gunakan pilihan layar penuh pada browser, atau F11 di komputer.');}};
  document.addEventListener('fullscreenchange',fullscreenLabel,{signal:abort.signal});
  let caveMarker=null,caveLandmarks=[];
  if(level.id==='Bukit'){
    ui.classList.add('cave-ui');caveMarker=document.createElement('div');caveMarker.id='cave-target';caveMarker.hidden=true;caveMarker.innerHTML='<b></b><span></span>';ui.append(caveMarker);
    caveLandmarks=level.damars.map(([x,y],i)=>{const el=document.createElement('div');el.className='cave-landmark';el.hidden=true;el.innerHTML=`<strong>${['Damar Lereng','Damar Jurang','Damar Kilisuci'][i]}</strong><small>Obor emas · simpan & isi minyak</small>`;ui.append(el);return{el,at:[x+10,y-48]};});
  }
  function drawCaveGuide(viewW,viewH){
    if(!caveMarker)return;const playing=mode==='play';caveMarker.hidden=!playing;caveLandmarks.forEach(({el})=>el.hidden=true);if(!playing)return;
    const rect=document.querySelector('canvas').getBoundingClientRect(),project=([x,y])=>[rect.left+(x-scene.getLayer('').getCameraX()+viewW/2)*rect.width/viewW,rect.top+(y-scene.getLayer('').getCameraY()+viewH/2)*rect.height/viewH];
    const g=caveGuide(),[tx,ty]=project(g.at),margin=Math.min(112,rect.width*.24),top=rect.height<550?120:150,bottom=rect.height*.77;
    const sx=Math.max(margin,Math.min(rect.width-margin,tx)),sy=Math.max(top,Math.min(bottom,ty)),off=Math.abs(sx-tx)>2||Math.abs(sy-ty)>2;
    caveMarker.style.left=sx+'px';caveMarker.style.top=sy+'px';caveMarker.dataset.offscreen=String(off);caveMarker.dataset.step=g.step;
    caveMarker.querySelector('b').textContent=off?(ty>bottom?'↓':ty<top?'↑':tx<sx?'←':'→'):'↓';caveMarker.querySelector('span').textContent=g.label;
    for(const{el,at}of caveLandmarks){const[x,y]=project(at);if(x<100||x>rect.width-100||y<110||y>rect.height*.85||Math.hypot(x-sx,y-sy)<100)continue;el.hidden=false;el.style.left=x+'px';el.style.top=y+'px';}
  }
  get('Galuh').forEach(o=>{o.setColor('157;129;191');o.setOpacity(110);});
  get('Garden').forEach(o=>o.setColor(level.id==='Epilog'?'200;205;200':'155;168;166'));
  function tick(){
    if(!active)return;
    if(pendingScene){const next=pendingScene;dispose();gdjs.evtTools.runtimeScene.replaceScene(scene,next,false);return;}
    if(mobile?.blocked){pressed.clear();release.clear();return;}
    const dt=Math.min(.05,scene.getElapsedTime()/1000);clock+=dt;
    if(once('Escape')){if(mode==='play')pause();else if(['pause','journal','choice','puzzle'].includes(mode))setMode('play');}
    if(once('KeyJ')){if(mode==='play')journal();else if(mode==='journal')setMode('play');}
    if(mode==='dialog'){dialogAge+=dt;autoTime+=dt;if($('skip-dialog'))$('skip-dialog').disabled=dialogAge<2;if(once('Enter','KeyC','Space')||auto&&autoTime>Math.max(3,dialog[dialogAt][1].length/24))nextDialog();}
    if(!active)return;
    if(mode==='play'){
      s.playSeconds+=dt;
      const left=down('ArrowLeft','KeyA'),right=down('ArrowRight','KeyD'),up=down('ArrowUp','KeyW'),crouch=down('ArrowDown','KeyS');
      if(left){body.simulateLeftKey();facing=-1;}if(right){body.simulateRightKey();facing=1;}
      if(up){body.simulateLadderKey();body.simulateUpKey();}if(crouch&&level.ladders.some(([lx,ly,lw,lh])=>player.getX()+20>lx&&player.getX()+12<lx+lw&&player.getY()+32>ly&&player.getY()<ly+lh)){body.simulateLadderKey();body.simulateDownKey();}
      sliding=has('Asih')&&crouch&&(body.isOnFloor()||sliding);
      dash=Math.max(0,dash-dt);body.setMaxSpeed(dash>0?270:has('Asih')&&down('ShiftLeft','ShiftRight')?138:104);
      if(dash>0){body.setCurrentSpeed(facing*270);invulnerable=Math.max(invulnerable,clock+.05);}
      if(body.isOnFloor()){lastFloor=clock;doubleUsed=false;}
      if(once('KeyZ','Space')){if(crouch&&body.isOnFloor()){dropUntil=clock+.35;jumpQueued=-10;body.setCurrentFallSpeed(80);}else jumpQueued=clock;}
      get('Upper').forEach(o=>o.activateBehavior('Platform',clock>=dropUntil||player.getX()+24<o.getX()||player.getX()+8>o.getX()+o.getWidth()));
      if(clock-jumpQueued<=.1){if(body.isOnFloor()||clock-lastFloor<=.12){body.setCanJump();body.simulateJumpKey();jumpQueued=-10;lastFloor=-10;soundscape.cue('jump');}else if(has('Wani')&&!doubleUsed){body.setCanJump();body.simulateJumpKey();doubleUsed=true;jumpQueued=-10;pulse=.35;soundscape.cue('double');}}
      player.flipX(facing<0);const anim=sliding?3:!body.isOnFloor()?2:left||right?1:0;if(anim!==lastAnim){player.setAnimation(anim);lastAnim=anim;}
      const x=player.getX()+16,y=player.getY()+16;
      shining=s.pelita&&has('Sabar')&&s.oil>0&&down('KeyX');
      if(once('KeyX')&&!has('Sabar'))toast(s.pelita?'Pulihkan aliran kolam untuk membuka Sorot.':'Ki Jati menyimpan pelita untukmu.');
      if((once('KeyV')||release.has('KeyX')&&clock-lampDown<.24)&&has('Andhap')&&s.oil>=6){s.oil-=6;pulse=.5;repel=clock+3;soundscape.cue('kibas');}
      const cp=level.damars.findIndex(([dx,dy])=>Math.hypot(x-dx-10,y-dy+16)<36);
      const inFog=x>level.fog[0]&&x<level.fog[1];M.stepOil(s,dt,shining,inFog&&dash<=0,cp>=0);
      if(cp>=0&&cp!==s.checkpoint){s.checkpoint=cp;save();soundscape.cue('checkpoint');toast(level.id==='Bukit'?['Damar Lereng','Damar Jurang','Damar Kilisuci'][cp]+' · perjalanan tersimpan, minyak sedang terisi.':'Damar Pengingat · perjalanan tersimpan.');}
      if(s.pelita&&s.oil<=0&&inFog)respawn('Pelita padam. Damar Pengingat menuntunmu kembali.');
      if(level.id==='Petirtaan'){
        const drained=s.drained,reward=M.stepWater(s,dt,cp===1&&!left&&!right&&body.isOnFloor());
        if(reward){save();showDialog([...D.sabar,['Ingatan Candra Kirana',D.flashbacks.Sabar]]);}
        if(s.drained&&!drained){save();toast('Air surut. Jalan menuju relief terbuka.');}
        if(!s.drained&&x>904&&player.getY()<390){player.setX(875);toast('Arus Hilir belum dialihkan. Periksa ketiga tuas.');}
      }
      const readable=readableAtPlayer();
      if(readable&&shining&&!left&&!right&&body.isOnFloor()){if(readNode!==readable.id)readTime=0;readNode=readable.id;readTime=Math.min(2,readTime+dt);}else readTime=0;
      if(readable&&shining&&readTime>=1&&mode==='play'){
        if(readable.type==='carving'&&has('Jujur')&&!q.caveRead){q.caveRead=true;save();showDialog([['Pahatan pertapaan','Air → akar → bunga → bulan → pelita. Nyalakan cerukan di sebelah kanan menurut urutan ini.']]);}
        else if(readable.type==='relief'&&s.drained&&!s.jujur)orderedPuzzle('relief');
        else if(readable.type==='lost'&&has('Jujur')&&!q.clues.includes(3))reveal(3,'Di bawah cahaya pelita, aksara terakhir kembali: A.');
      }
      stealthTime=level.id==='Gerbang'&&crouch&&!left&&!right&&near(level.nodes.find(n=>n.id==='sleeper'),45)?stealthTime+dt:0;
      if(level.id==='Pasar'&&q.chase&&!q.chaseWon&&player.getX()<5210){chaseTime+=dt;const wall=760+chaseTime*70;if(player.getX()<wall-220||player.getY()>486&&player.getX()>900)respawn('Bungkusan menjauh. Coba lagi dari atap pasar.');}
      if(level.id==='Pasar'&&player.getX()>=5210&&s.checkpoint!==2){s.checkpoint=2;save();toast('Dermaga tercapai. Turun dengan ↓ + Z untuk menemui lutung.');}
      if(level.id==='Bukit'){
        if(!has('Andhap')&&player.getX()>928)player.setX(928);
        if(has('Andhap')&&!q.escaped&&!escapeTime&&player.getY()<310&&player.getX()>600){escapeTime=.01;toast('Goa mulai memudar. Ikuti lorong atas ke kanan!');}
        if(escapeTime>0&&!q.escaped){escapeTime+=dt;if(player.getX()<520+escapeTime*62-220)respawn('Goa memudar. Coba lagi dari damar Kilisuci.');if(player.getX()>level.exit[0]-70){q.escaped=true;save();toast('Lorong berhasil dilewati. Gerbang Dhaha menunggu.');}}
        risingFog=Math.max(player.getY()+150,risingFog-dt*8);
        get('Foot').forEach(o=>{if(!M.isLit(x,y,facing,o.getX(),o.getY(),155,shining)&&clock>repel)o.setX(320+Math.sin(clock*.6)*80);if(Math.hypot(x-o.getX(),y-o.getY())<14&&clock>invulnerable)respawn('Rayap Aksara menyentuh ingatanmu. Sorot untuk menghentikannya.');});
      }
      if(level.id==='Kedaton'){
        const foot=get('Foot')[0];if(!q.tapakTrapped&&Math.abs(player.getX()-footX)<320)footX+=(player.getX()>footX?1:-1)*dt*55;foot.setPosition(footX,600);foot.hide(q.tapakTrapped);
        if(!q.tapakTrapped&&Math.hypot(x-footX,y-600)<12&&clock>invulnerable)respawn('Tapak Hampa mendekat. Pancing ke bilik buntu.');
        history.push({at:clock,x:player.getX(),y:player.getY()});while(history.length>1&&history[1].at<clock-1)history.shift();const ghost=get('Galuh')[0];ghost.setPosition(history[0].x,history[0].y);ghost.hide(q.bells.length===3);
        if(bellPending&&clock>=bellPending.at){const b=bellPending;bellPending=null;if(player.getY()<b.y-18&&Math.abs(ghost.getX()-b.x)<50){q.bells.push(b.index);save();pulse=.7;sound(880,.6);if(q.bells.length===3)showDialog(D.galuh);else toast('Lonceng menangkap satu bayangan.');}else toast('Bayang lolos. Diam di dekat lonceng, tekan C lalu lompat.');}
      }
      if(level.id==='Bangsal'&&q.pillars.length>=2&&!q.debate&&cp<0&&dash<=0)s.oil=Math.max(0,s.oil-dt*4);
      const radius=has('Wicaksana')?310:155;
      level.flowers.forEach(([fx,fy],i)=>{if(M.isLit(x,y,facing,fx,fy-8,radius,shining)){lightHistory.add(i);get('Flower')[i].setColor('255;248;185');}});
      get('Kunang').forEach(bug=>{if(clock<repel)return;const bx=bug.getX(),by=bug.getY(),dist=Math.hypot(x-bx,y-by),safe=cp>=0||level.flowers.some(([fx,fy],i)=>lightHistory.has(i)&&Math.hypot(x-fx,y-fy)<38);if(safe&&dist<80)bug.setX(bx+(bx<x?-1:1)*dt*45);else if(dist<110){bug.setPosition(bx+(x-bx)*dt*.35,by+(y-by)*dt*.35);if(dist<12&&clock>invulnerable)respawn('Kunang Sunyi mendekat. Berlindung di cahaya damar atau bunga.');}});
      get('Scroll').forEach(o=>{const id=o.getVariables().get('kidung').getAsNumber();if(!id)return;const locked=id===1&&q.lamps[1]||id===2&&!q.dakon||id===3&&(!has('Asih')||!sliding);o.hide(s.kidung.includes(id)||locked);if(!o.isHidden()&&Math.hypot(x-o.getX()-o.getWidth()/2,y-o.getY()-o.getHeight()/2)<25){s.kidung.push(id);s.oil=Math.min(100,s.oil+25);save();sound(880,.25);toast('Kidung Terlupa #'+id+' · tersimpan di Jurnal Nusantara.');}});
      get('Crate').forEach(o=>{if(body.isOnFloor()&&Math.abs(player.getY()+player.getHeight()-o.getY()-o.getHeight())<8&&Math.abs(x-o.getX()-16)<25&&(left||right))o.setX(Math.max(8,Math.min(level.width-40,o.getX()+facing*dt*55)));});
      if(once('KeyC','KeyE'))interact();if(!active)return;
      player.setX(Math.max(0,Math.min(level.width-32,player.getX())));if(player.getY()>level.height+40)respawn();
      let prompt='';const nearby=level.nodes.filter(n=>near(n,40)).sort((a,b)=>Math.abs(a.x-player.getX())-Math.abs(b.x-player.getX()))[0];if(nearby)prompt='C · '+nearby.label;
      if(readable){if(readable.type==='carving'&&q.caveRead)prompt='C · Baca ulang urutan cerukan';else if(shining)prompt='Membaca pahatan · '+Math.round(Math.min(1,readTime)*100)+'%';else prompt='Diam + tahan X · Baca pahatan';}
      level.levers.forEach(([lx,ly],i)=>{if(Math.hypot(x-lx-8,y-ly-12)<32)prompt='C · '+(s.levers[i]?'Tutup ':'Buka ')+['Hulu','Hilir','Akar'][i];});
      if(cp>=0&&!prompt)prompt=level.id==='Petirtaan'&&cp===1&&!s.sabar?'Diam · '+Math.min(8,Math.floor(s.waiting))+' / 8 denyut':'C · Beristirahat di damar';
      if(level.id==='Bukit'&&cp===1)prompt='Damar Jurang · minyak '+Math.round(s.oil)+'% · C isi penuh';
      if(Math.hypot(x-level.exit[0],y-level.exit[1]-16)<46&&M.canLeave(s,level.id))prompt='C · '+(level.next?'Menuju '+level.next:'Kisah yang diteruskan');
      $('prompt').textContent=inputText(prompt);$('prompt').hidden=mode!=='play'||!prompt;
      const progress=JSON.stringify([s.serat,s.kidung,q,s.levers]);if(progress!==lastProgress){lastProgress=progress;hintTime=0;}else hintTime+=dt;if(hintTime>90){toast(objective());hintTime=0;}
    }else shining=false;
    const px=player.getX()+16,py=player.getY()+16,radius=has('Wicaksana')?310:155;
    get('Faded').forEach((o,i)=>{const lit=M.isLit(px,py,facing,o.getX()+o.getWidth()/2,o.getY(),radius,shining),erased=level.id==='Bangsal'&&!q.debate&&Math.sin(clock*.8+i*.9)>.94;let solid=lit;if(level.id==='Bukit'){const touched=Math.abs(player.getY()+player.getHeight()-o.getY())<5&&px>o.getX()&&px<o.getX()+o.getWidth();if(touched&&!thinTouched.has(i))thinTouched.set(i,clock);if(!touched&&clock-(thinTouched.get(i)??clock)>4)thinTouched.delete(i);solid=lit||!thinTouched.has(i)||clock-thinTouched.get(i)<2;}o.activateBehavior('Platform',solid);o.setOpacity(solid?255:erased?8:55+Math.sin(clock*3)*12);});
    get('MemoryGarden').forEach(o=>o.setOpacity(q.pillars.length*38));
    get('Barrier').forEach(o=>{o.activateBehavior('Platform',!q.gate);o.hide(q.gate);});
    get('Pillar').forEach(o=>{const n=level.nodes.find(n=>n.id===o.getVariables().get('node').getAsString());o.setColor(q.pillars.includes(n.index)?'255;229;151':'120;130;150');o.setOpacity(n.index===4&&q.debate?129+M.argumentScore(s)*42:255);});
    get('Putri').forEach(o=>o.setOpacity(q.manuscript?255:100));get('Samar').forEach(o=>o.hide(q.debate));
    if(level.id==='Petirtaan'){
      get('Lever').forEach((o,i)=>{o.setAngle(s.levers[i]?20:-20);o.setColor(s.levers[i]?'255;223;135':'161;185;168');});get('Raft')[0].setY(402-s.water*66);get('Water')[0].setY(410-s.water*60);get('Water')[0].setHeight(102+s.water*60);get('Water')[1].setY(s.drained?440:404);get('Water')[1].setHeight(s.drained?72:108);
    }
    if(level.id==='Prolog')get('Lamp').forEach(o=>{const n=level.nodes.find(n=>n.id===o.getVariables().get('node').getAsString());if(n?.type==='lamp')o.setColor(q.lamps[n.index]?'255;226;149':'90;90;110');});
    pulse=Math.max(0,pulse-dt);const beam=get('Beam')[0];beam.hide(!shining);beam.setWidth(radius);beam.flipX(facing<0);beam.setPosition(facing>0?px:px-radius,py-50);
    get('Glow').forEach(o=>{if(o.getVariables().get('playerLight').getAsNumber()===1){o.setPosition(px-50-pulse*35,py-50-pulse*35);o.setWidth(100+pulse*70);o.setHeight(100+pulse*70);o.setOpacity(s.pelita?70+100*s.oil/100:0);}});
    const viewW=game.getGameResolutionWidth(),viewH=game.getGameResolutionHeight(),halfW=viewW/2,halfH=viewH/2;
    get('Spark').forEach((o,i)=>{o.setPosition(camera.x-halfW+(i*43+clock*(i%2?6:-4)+2000)%viewW,camera.y-halfH+(i*31+Math.sin(clock+i)*12)%viewH);o.setOpacity(80+Math.sin(clock*2+i)*60);});
    get('Mist').forEach((o,i)=>{o.setX(i*180+Math.sin(clock*.12+i)*35);if(level.id==='Bangsal'&&q.pillars.length>=2)o.setY(camera.y+45+Math.sin(clock*.5+i)*20);o.setOpacity(shining||pulse>0?25:level.id==='Bangsal'?150:55);});
    M.followCamera(camera,{x:player.getX(),y:player.getY(),onFloor:body.isOnFloor(),viewW,viewH,width:level.width,height:level.height,dt});
    [['L0Sky',.05],['L1Mountains',.20],['L2Garden',.45],['L3Walls',.75],['',1],['L5Foreground',1.25],['L6Atmosphere',1]].forEach(([name,m])=>{const l=scene.getLayer(name);l.setCameraX(Math.round(halfW+(camera.x-halfW)*m));l.setCameraY(Math.round(halfH+(camera.y-halfH)*m));});
    updateTerrain();drawCaveGuide(viewW,viewH);
    soundscape.update({scene:level.id,x:player.getX(),y:player.getY(),mode,shining,moving:down('ArrowLeft','ArrowRight','KeyA','KeyD'),grounded:body.isOnFloor(),speed:body.getMaxSpeed(),hidden:document.hidden,silence:level.id==='Gerbang'&&q.gate&&clock<game.__ckSilenceUntil});
    $('vignette').style.opacity=s.pelita&&s.oil<25?'.9':'.3';flash=Math.max(0,flash-dt*2);$('flash').style.opacity=flash;if(clock>toastEnd)$('toast').hidden=true;hudTime+=dt;if(hudTime>.15){hud();hudTime=0;}pressed.clear();release.clear();
  }
  // Observation only: test tools drive keyboard, pointer and saved-game resume.
  window.__ckRender=()=>{const r=player.getRendererObject();return {visible:r.visible,alpha:r.alpha,worldAlpha:r.worldAlpha,tint:r.tint,renderable:r.renderable,x:r.x,y:r.y,bounds:r.getBounds(),texture:r.texture?.baseTexture?.resource?.url,frame:r.texture?.frame,scale:{x:r.scale.x,y:r.scale.y},z:player.getZOrder(),index:r.parent?.children.indexOf(r),last:r.parent?.children.slice(-8).map(x=>({z:x.zOrder,url:x.texture?.baseTexture?.resource?.url}))};};
  window.__cahaya={snapshot:()=>({scene:level.id,mode,camera:{x:scene.getLayer('').getCameraX(),y:scene.getLayer('').getCameraY()},audio:soundscape.snapshot(),state:JSON.parse(JSON.stringify(s)),x:player.getX(),y:player.getY(),width:player.getWidth(),height:player.getHeight(),hidden:player.isHidden(),animation:player.getAnimation(),onFloor:body.isOnFloor(),shining,readTime,stealthTime,chaseTime,escapeTime,footX,sliding,solidPlatforms:get('Faded').map(o=>o.getBehavior('Platform').activated()),npcs:['KiJati','Kilisuci','Guard'].flatMap(name=>get(name).map(o=>({name,node:o.getVariables().get('node').getAsString(),frame:o.getAnimationFrame(),x:o.getX(),y:o.getY(),width:o.getWidth(),height:o.getHeight()})))})};
  if(game.__ckStarted)enter();else title();
  if(mobile.blocked&&mode==='play')pause();
  return {tick,dispose};
}
)(runtimeScene,{"width":1536,"height":512,"platforms":[[0,352,288,160],[288,416,160,96],[448,352,160,160],[608,416,192,96],[800,352,128,160],[1088,352,448,160],[160,288,96,12],[224,224,64,12],[384,256,96,12],[480,224,96,12],[736,288,96,12],[1184,288,128,12],[1312,256,128,12]],"faded":[[928,336,48,12],[992,320,48,12],[1056,336,32,12]],"levers":[[224,328],[496,328],[768,392]],"damars":[[88,352],[512,352],[1120,352]],"kidung":[[4,512,202],[5,1376,234]],"flowers":[[24,352],[274,352],[464,352],[588,352],[806,352],[1154,352],[1250,352],[1470,352]],"ladders":[],"nodes":[{"id":"jati","type":"jati","x":132,"y":320,"label":"Ki Jati"},{"id":"relief","type":"relief","x":1216,"y":320,"label":"Relief yang aus"}],"fog":[924,1088],"checkpoints":[[56,320],[496,320],[1120,320]],"palette":"jade","name":"Petirtaan & Taman Wijayakusuma","npc":[132,320],"relief":[1216,320],"exit":[1464,320],"id":"Petirtaan","chapter":"BABAK I · TERLEMPAR","quest":"Air yang Mengingat","background":"petirtaan","next":"Bukit"},model,"@import url('data:text/css,');\n:root{color-scheme:dark}*{box-sizing:border-box}body{margin:0;background:#0b1917;overflow:hidden}canvas{image-rendering:pixelated}button{font:inherit;cursor:pointer}button:focus-visible{outline:2px solid #ecd698;outline-offset:5px}button:disabled{opacity:.35;cursor:default}[hidden]{display:none!important}\n#ck{position:fixed;inset:0;pointer-events:none;color:#eee8cf;font:14px/1.55 Georgia,'Times New Roman',serif;z-index:10}#ck button{pointer-events:auto;border:1px solid #b9bd9333;color:#e9e4cd;background:#102b27b8;padding:10px 18px;transition:background .2s,border-color .2s}#ck button:hover{background:#29473c;border-color:#d7c68b99}#ck button.primary{background:#d5bc7c;color:#18352b;border-color:#ead59e;font-weight:bold}#ck button.primary:hover{background:#ecd697}.eyebrow{display:block;font:10px/1.6 system-ui,sans-serif;letter-spacing:2.8px;color:#d9c992}.subtle{color:#98aea0;font:12px/1.8 system-ui,sans-serif}.gold-rule{height:1px;width:68px;background:#d3b777;margin:26px 0}.small{font-size:10px!important}\n#vignette{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,transparent 38%,#061814 100%);opacity:.35;transition:opacity 1s}#flash{position:absolute;inset:0;background:#fff9df;opacity:0;z-index:20}\n#hud{position:absolute;left:4%;right:4%;top:4%;display:flex;align-items:center;justify-content:space-between;gap:20px;text-shadow:0 2px 5px #000}.memory{display:flex;align-items:center;gap:16px}.memory .eyebrow{font-size:9px;letter-spacing:2px}#oil{width:36px;height:47px;position:relative;--oil:1}.flame{position:absolute;left:12px;top:0;color:#ffe4a3;font-size:23px;opacity:var(--oil);filter:drop-shadow(0 0 10px #ffe4a3);transform:scaleY(calc(.35 + var(--oil)*.65));transform-origin:center bottom}.lamp{position:absolute;font-size:42px;left:1px;bottom:-7px;color:#d4af62}#serat-slots{display:flex;gap:6px;margin-top:9px}#serat-slots i{width:9px;height:12px;border:1px solid #abbd9c70;transform:skewY(-12deg);background:#11292188}#serat-slots i.filled{background:#dbc38a;border-color:#ffedb3;box-shadow:0 0 9px #d9c07940}.chapter{text-align:center;font-size:16px}.chapter .eyebrow{font-size:8px;letter-spacing:2px;color:#a5bdad}.hud-actions{display:flex;gap:8px}#ck .hud-actions button{padding:6px 12px;font:12px system-ui,sans-serif}.hud-actions span{padding-left:7px;color:#afc0ae}\n#objective{position:absolute;top:16%;left:4%;max-width:260px;padding-left:13px;border-left:1px solid #bbcb9850;background:linear-gradient(90deg,#0b22199c,transparent)}#objective .eyebrow{font-size:8px;letter-spacing:2px}#objective p{font:12px/1.7 system-ui,sans-serif;color:#d5dfcd;margin:6px 0 0}#prompt{position:absolute;bottom:14%;left:50%;transform:translateX(-50%);padding:8px 18px;border:1px solid #e8d29766;background:#102821e8;white-space:nowrap;font:12px/1.5 system-ui,sans-serif;color:#ecd9a3}#toast{position:absolute;top:18%;left:50%;transform:translateX(-50%);max-width:70%;padding:12px 22px;background:#122b25f2;border-top:1px solid #bca46d;border-bottom:1px solid #bca46d;color:#eee1b8;text-align:center;font:13px/1.6 system-ui,sans-serif;z-index:9}\n#modal{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:#07191375;pointer-events:auto;backdrop-filter:blur(2px)}#modal:has(.title-screen){background:linear-gradient(90deg,#081e18ed 0%,#0c211bbf 38%,#0d211c35 75%);justify-content:flex-start;backdrop-filter:none}.title-screen{margin:0 0 0 12%;padding:30px 0;max-width:460px}.title-ornament{font-size:39px;color:#d5bd7c;line-height:1;margin-bottom:22px}.title-screen h1{font-size:clamp(58px,7.5vw,108px);font-weight:400;line-height:.94;letter-spacing:-3px;margin:22px 0;color:#ede6c9;text-shadow:0 2px 15px #071c14}.title-screen h1 em{font-weight:400;color:#d7bd7c}.title-screen p{font-size:16px;color:#b7c7b4;line-height:1.7}.title-buttons{display:flex;flex-direction:column;gap:10px;max-width:260px;margin-top:30px}.title-buttons button{text-align:left}.title-buttons button span{float:right;font-size:20px;line-height:20px}.title-note{display:block;font:9px system-ui,sans-serif;letter-spacing:2px;color:#8fa899;margin-top:27px}.title-note.small{letter-spacing:.4px;margin-top:9px;color:#7f9988}\n.panel{width:min(90vw,520px);padding:34px;background:linear-gradient(135deg,#15352e,#102820);border:1px solid #c4b37666;box-shadow:0 24px 100px #020c097a;max-height:86vh;overflow:auto}.panel h2{font-size:29px;line-height:1.2;font-weight:400;color:#eee3ba;margin:12px 0 18px}.panel p{color:#b8cbbb}.stack{display:flex;flex-direction:column;gap:10px;margin:24px 0}.panel-head{display:flex;justify-content:space-between;align-items:flex-start}#ck .panel-head button{padding:2px 12px;font-size:25px;border:0}.panel-head h2{margin-bottom:10px}.tabs{display:flex;gap:15px;border-bottom:1px solid #a1b29830;margin-bottom:20px}#ck .tabs button{border:0;background:transparent;color:#91aa97;padding:10px 2px}#ck .tabs button.active{color:#e0ce95;border-bottom:2px solid #cfb977}.serat-list{display:grid;gap:0}.serat-list article{display:flex;align-items:center;gap:15px;border-bottom:1px solid #93a9871c;padding:9px 0}.serat-list article>span{font:11px system-ui;color:#91a68c}.serat-list h3{font-weight:400;margin:0;font-size:16px}.serat-list p{margin:0;font:10px system-ui;color:#9cad98}.serat-list b{margin-left:auto;color:#d9c07e}.serat-list .locked{opacity:.4}.journal-copy h3{font-weight:400;color:#d8c58b}.journal-copy p{font-size:14px}.journal{width:min(90vw,600px)}\n.dialog{position:absolute;bottom:10%;left:50%;transform:translateX(-50%);width:min(84%,820px);display:flex;gap:24px;padding:24px 30px;background:#0c2722f5;border:1px solid #c9b5777a;box-shadow:0 10px 80px #04100bc0}.dialog-marker{font-size:40px;line-height:1.4;color:#bea66d;border-right:1px solid #bac59930;padding-right:22px}.dialog-content{flex:1}.dialog-content p{font-size:17px;line-height:1.7;margin:12px 0 24px}.dialog-controls{display:flex;gap:12px;align-items:center}.dialog-controls span{margin-left:auto;font:10px system-ui;color:#789a86}#ck .dialog-controls button{background:none;border:0;padding:4px;font:11px system-ui;color:#99b29f}#ck .dialog-controls button.next{color:#e1cd96;padding-left:12px}.relief-panel{width:min(92vw,860px)}.relief-panel>p{font:12px/1.7 system-ui}.relief-slots{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:22px 0}.relief-slots span{border:1px dashed #9bac8a60;padding:12px 6px;text-align:center;min-height:46px;font-size:12px;color:#dcc990}.relief-cards{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}#ck .relief-cards button{padding:16px 12px;text-align:center;display:flex;flex-direction:column;align-items:center;background:#243e31}#ck .relief-cards button.selected{border-color:#d4bc7d;background:#39513b}.relief-icon{font-size:32px;line-height:1.6;color:#d2c589}.relief-cards strong{font-weight:400;font-size:14px;white-space:nowrap}.relief-cards small{color:#a8baa5;font:11px/1.6 system-ui;margin-top:9px}.panel-buttons{display:flex;justify-content:space-between;margin-top:22px}#relief-feedback{font:11px/1.6 system-ui;color:#a5b79d;min-height:32px;padding-top:18px}.completion{text-align:center}.completion h2{font-size:33px}.summary{display:flex;justify-content:center;gap:18px;font-size:13px;color:#d1bc83;margin:25px 0}\n#legend{position:absolute;bottom:4%;left:4%;display:flex;gap:24px;font:11px system-ui;color:#d8cca0}#legend b{font-weight:400;color:#9cb29f;margin-left:6px}#build-label{position:absolute;bottom:4%;right:4%;font:8px system-ui;letter-spacing:1.7px;color:#a5b99a99}#build-label span{margin:0 5px}#touch{position:absolute;bottom:5%;left:3%;right:3%;display:none;justify-content:space-between}#touch>div{display:flex;gap:9px}#ck #touch button{width:48px;height:46px;padding:0;background:#19392baa;border-color:#b3c0a344;border-radius:4px;touch-action:none;user-select:none;font:19px system-ui}\n@media(pointer:coarse){#touch{display:flex}#legend{display:none}#prompt{bottom:22%}#build-label{bottom:1%}.dialog{bottom:18%}}@media(max-width:700px){.chapter{display:none}#objective{top:17%;max-width:200px}#objective p{font-size:10px}.title-screen{margin-left:9%}.title-screen h1{font-size:64px}.title-screen p{font-size:14px}.title-ornament{margin-bottom:12px}.title-buttons{margin-top:20px}.title-note{margin-top:18px}.panel{padding:22px}.relief-cards{grid-template-columns:repeat(2,1fr)}.relief-cards small{font-size:10px}.relief-icon{font-size:22px}.relief-slots span{font-size:10px}.dialog{width:92%;padding:18px;gap:14px}.dialog-marker{display:none}.dialog-content p{font-size:14px}#legend{gap:12px;font-size:9px}#build-label{display:none}}@media(max-height:550px){.title-screen{padding:10px 0}.title-screen h1{font-size:58px;margin:8px 0}.title-screen p{margin:8px 0;font-size:13px}.gold-rule{margin:12px 0}.title-ornament{display:none}.title-buttons{margin-top:12px}.title-note{margin-top:14px}.panel{max-height:92vh;padding:18px}.dialog{bottom:6%}.dialog-content p{margin:8px 0 15px}.serat-list article{padding:5px 0}}\n\n#ck a{color:#e2c98c;pointer-events:auto}.history-entry{border-bottom:1px solid #98ad8b33;padding-bottom:12px}.history-entry a{font:11px system-ui}.relief-slots.seven{grid-template-columns:repeat(7,1fr)}#ck .relief-slots button{padding:8px 4px;font-size:11px;border-style:dashed;min-height:56px}.seven-cards{grid-template-columns:repeat(4,1fr)}.seven-cards strong{white-space:normal}.gate-dials,.dakon{display:flex;gap:12px;justify-content:center;margin:24px 0}#ck .gate-dials button{font-size:32px;padding:14px 20px}.dakon strong{padding:10px;color:#e8cf84}.journal-copy{max-height:53vh;overflow:auto}#touch>div{gap:5px}#ck #touch button{width:44px}.title-note{max-width:340px;line-height:1.8}@media(max-width:700px){.relief-slots.seven{grid-template-columns:repeat(4,1fr)}.seven-cards{grid-template-columns:repeat(2,1fr)}}@media(max-height:550px){.relief-panel{max-height:94vh}.relief-cards small{display:none}.relief-icon{font-size:18px;line-height:1}.relief-cards{gap:5px}#ck .relief-cards button{padding:8px}.relief-slots{margin:10px 0}.panel h2{font-size:23px;margin:8px 0}.chapter{font-size:13px}#objective{top:19%;max-width:210px}#objective p{font-size:10px}#ck #touch button{width:39px;height:38px}#touch{bottom:3%}#prompt{bottom:17%;font-size:10px}}\n#ck.cave-ui #objective{max-width:310px;background:linear-gradient(90deg,#081b18ed,#081b1899);padding:8px 12px}\n.cave-landmark,#cave-target{position:absolute;transform:translate(-50%,-100%);text-align:center;pointer-events:none;font:11px/1.4 system-ui;color:#ffedb5;background:#112923ed;border:1px solid #d4bd7888;padding:5px 9px;border-radius:4px;text-shadow:0 1px 2px #000;max-width:215px}\n.cave-landmark strong,.cave-landmark small{display:block}.cave-landmark small{font-size:9px;color:#c3d5c5}\n#cave-target{border-color:#ffe7a1;box-shadow:0 0 14px #e4bd6b22;z-index:2}#cave-target b{display:block;font-size:23px;line-height:1.1}#cave-target span{display:block}#cave-target[data-offscreen=true]{border-style:dashed}\n@media(max-height:550px),(max-width:700px){#ck.cave-ui #objective{max-width:240px;padding:5px 8px}#ck.cave-ui #objective p{font-size:10px;line-height:1.45}.cave-landmark,#cave-target{font-size:10px;max-width:180px}.cave-landmark small{font-size:8px}}\n.audio-controls{border-top:1px solid #b9bd9333;padding-top:12px;display:grid;gap:10px}.audio-controls label{display:grid;grid-template-columns:75px 1fr 40px;gap:10px;align-items:center;font:12px system-ui}.audio-controls input{width:100%;accent-color:#d5bc7c;pointer-events:auto}.audio-controls output{text-align:right;color:#d5bc7c}\n\n/* All touch sizes are CSS pixels, independent from the game's pixel scale. */\n#rotate-device{position:absolute;inset:0;z-index:100;display:grid;place-items:center;padding:max(24px,env(safe-area-inset-top)) max(24px,env(safe-area-inset-right)) max(24px,env(safe-area-inset-bottom)) max(24px,env(safe-area-inset-left));background:radial-gradient(ellipse at top,#24473a,#081e19 75%);pointer-events:auto;text-align:center}\n.rotate-card{max-width:340px}.rotate-card h2{font-size:29px;font-weight:400;line-height:1.25;color:#f0dfb0}.rotate-card p{font:14px/1.8 system-ui;color:#bfcec0}.rotate-phone{margin:0 auto 30px;width:104px;height:62px;border:2px solid #dac38a;border-radius:13px;color:#dac38a;font:42px/56px system-ui;box-shadow:0 0 45px #cdb47716}#ck #landscape-start{min-height:50px;width:100%;border-radius:12px}#rotate-note{font-size:12px}\n#ck.mobile-ui{--pad:12px;--key:clamp(46px,12.8dvh,58px);--gap:5px;font-size:13px}\n.mobile-ui #hud{top:max(8px,env(safe-area-inset-top));left:max(var(--pad),env(safe-area-inset-left));right:max(var(--pad),env(safe-area-inset-right));gap:12px;align-items:flex-start}\n.mobile-ui .memory{gap:8px}.mobile-ui #oil{transform:scale(.8);transform-origin:top left;width:30px}.mobile-ui .memory .eyebrow{font-size:8px;letter-spacing:1px}.mobile-ui #serat-slots{gap:5px;margin-top:6px}.mobile-ui #serat-slots i{width:8px;height:10px}.mobile-ui .chapter{font-size:12px;max-width:36%;line-height:1.4}.mobile-ui .chapter .eyebrow{font-size:8px;letter-spacing:1px}\n#ck.mobile-ui .hud-actions button{min-width:44px;min-height:44px;padding:8px;border-radius:12px;background:#102b27de;font-size:17px}.mobile-ui .hud-actions{gap:6px}.mobile-ui .hud-actions span{font-size:11px;padding-left:3px}\n.mobile-ui #legend,.mobile-ui #build-label{display:none}.mobile-ui #touch{display:flex;inset:auto max(var(--pad),env(safe-area-inset-right)) max(10px,env(safe-area-inset-bottom)) max(var(--pad),env(safe-area-inset-left));align-items:flex-end;z-index:4;touch-action:none;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}\n.mobile-ui #touch>div{gap:8px}.mobile-ui .touch-movement{display:flex;align-items:flex-end}.mobile-ui .touch-dpad{display:grid;grid-template-columns:repeat(3,var(--key));grid-template-rows:repeat(3,var(--key));gap:var(--gap)}\n.touch-up{grid-area:1/2}.touch-left{grid-area:2/1}.touch-right{grid-area:2/3}.touch-down{grid-area:3/2}.dpad-center{grid-area:2/2;display:grid;place-items:center;color:#d7c59877;background:#0b22195c;border-radius:50%;font-size:22px}\n#ck.mobile-ui #touch button{width:var(--key);height:var(--key);padding:3px;border-radius:15px;border:1px solid #d4c48b80;background:linear-gradient(145deg,#24463aeb,#102920e6);color:#f4e5b7;box-shadow:0 3px 0 #061b15a6,inset 0 1px 0 #f4e5b720;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;font:24px/1 system-ui;touch-action:none;transition:background .1s,box-shadow .1s}\n#ck.mobile-ui #touch button small{font:9px/1.2 system-ui;letter-spacing:.1px;color:#d6dfce}#ck.mobile-ui #touch button.held,#ck.mobile-ui #touch button[aria-pressed=true]{background:#bea05d;color:#102b23;border-color:#f8dfa0;box-shadow:0 1px 0 #061b15,inset 0 0 0 2px #ffeab735}#ck.mobile-ui #touch button[aria-pressed=true] small,#ck.mobile-ui #touch button.held small{color:#102b23}#ck.mobile-ui #touch button:disabled{opacity:.32}\n.mobile-ui #touch .touch-actions{display:grid;grid-template-columns:var(--key) calc(var(--key)*1.35);grid-template-rows:var(--key) calc(var(--key)*1.35);align-items:end;gap:10px}\n.touch-pulse{grid-area:1/1}.touch-light{grid-area:1/2;justify-self:end}.touch-use{grid-area:2/1}.touch-jump{grid-area:2/2}#ck.mobile-ui #touch .touch-jump{width:calc(var(--key)*1.35);height:calc(var(--key)*1.35);border-radius:50%;font-size:30px;border-color:#f4d99a;background:linear-gradient(145deg,#e5ce90,#b89854);color:#15382c}#ck.mobile-ui #touch .touch-jump small{color:#15382c;font-size:11px;font-weight:600}#ck.mobile-ui #touch .touch-jump.held{background:#f8e9b5;box-shadow:inset 0 2px 7px #6e592f88}.mobile-ui .touch-run{margin-bottom:4px}\n.mobile-ui #objective,.mobile-ui.cave-ui #objective{top:62px;left:max(var(--pad),env(safe-area-inset-left));max-width:min(44vw,300px);padding:5px 8px;background:linear-gradient(90deg,#081b18df,#081b1880);border-radius:0 6px 6px 0}.mobile-ui #objective .eyebrow{font-size:7px;letter-spacing:1px}.mobile-ui #objective p,.mobile-ui.cave-ui #objective p{font-size:10px;line-height:1.45;margin-top:3px}\n.mobile-ui #prompt{bottom:max(24px,env(safe-area-inset-bottom));max-width:calc(100% - 450px);white-space:normal;text-align:center;font-size:11px;padding:7px 10px;border-radius:9px;z-index:3}.mobile-ui #toast{top:65px;font-size:11px;padding:8px 14px;max-width:48%;z-index:8}\n.mobile-ui #modal{z-index:6;padding:max(8px,env(safe-area-inset-top)) max(12px,env(safe-area-inset-right)) max(8px,env(safe-area-inset-bottom)) max(12px,env(safe-area-inset-left))}.mobile-ui .panel{max-height:calc(100dvh - 24px);overscroll-behavior:contain}.mobile-ui .panel button,.mobile-ui .dialog-controls button{min-height:44px}.mobile-ui .dialog{position:relative;bottom:auto;left:auto;transform:none;width:min(94%,800px);max-height:calc(100dvh - 24px);overflow:auto;padding:16px 20px;gap:16px}.mobile-ui .dialog-content{min-width:0}.mobile-ui .dialog-content p{font-size:15px;line-height:1.55;margin:8px 0 12px}#ck.mobile-ui .dialog-controls button{min-width:48px;padding:8px;font-size:12px}.mobile-ui .dialog-controls{gap:8px}.mobile-ui .dialog-marker{font-size:30px}.mobile-ui .title-screen{margin-left:8%;max-height:100%;overflow:auto}.mobile-ui .title-note{font-size:8px}.mobile-ui .title-buttons button{min-height:44px}.mobile-ui .audio-controls input{min-height:32px}.mobile-ui .tabs{gap:12px}\n@media(max-width:740px){.mobile-ui #prompt{bottom:calc(var(--key)*2.5 + 24px);max-width:50%}.mobile-ui .chapter{display:none}.mobile-ui .hud-actions span{display:none}.mobile-ui #objective,.mobile-ui.cave-ui #objective{max-width:52vw}.mobile-ui .title-note{display:none}}\n@media(max-height:370px){#ck.mobile-ui{--pad:8px;--key:44px;--gap:3px}.mobile-ui #objective,.mobile-ui.cave-ui #objective{left:34%;top:8px;max-width:33%;font-size:10px}.mobile-ui #objective .eyebrow{display:none}.mobile-ui #objective p,.mobile-ui.cave-ui #objective p{font-size:9px}.mobile-ui #prompt{bottom:12px;max-width:calc(100% - 390px)}.mobile-ui .title-screen h1{font-size:45px}.mobile-ui .title-screen>.eyebrow{font-size:8px}.mobile-ui .title-note{display:none}.mobile-ui .title-screen p{font-size:12px}.mobile-ui .title-buttons{margin-top:8px}.mobile-ui .title-screen .gold-rule{margin:6px 0}}\n/* Match the cave guide's existing ID specificity on short phone displays. */\n#ck.mobile-ui.cave-ui #objective{max-width:min(44vw,300px);padding:5px 8px}\n@media(max-width:740px){#ck.mobile-ui.cave-ui #objective{max-width:52vw}}\n@media(max-height:370px){#ck.mobile-ui.cave-ui #objective{left:34%;top:8px;max-width:33%}#ck.mobile-ui.cave-ui #objective p{font-size:9px}}\n",{"dialogues":{"introProlog":[["Kirana","Tiga buku harus kukembalikan sebelum perpustakaan tutup. Rak cerita rakyat di bawah, pengetahuan di tengah, dan arsip di loteng."],["Kirana","Tangga besi di kanan menghubungkan ketiganya. Di meja arsip ada buku Keong Mas yang belum pernah kuselesaikan."]],"portal":[["Kirana","…dan Putri Candra Kirana dikutuk menjadi keong emas. Kenapa nggak ada satu pun anak sekarang yang tahu cerita ini, ya?"],["Kirana","…Lho. Tulisannya—"],["Narasi","Huruf-huruf terlepas dari halaman. Cahaya memenuhi loteng. Bunyi hujan berubah menjadi riuh sebuah pasar."]],"introPasar":[["Kirana","Ini bukan perpustakaan. Bau nasi hangat, sungai, atap-atap bambu… Aku ada di mana?"],["Mbok Rondo","Nduk, kowe katon luwe. Mampir warung mbok dhisik."]],"mbok":[["Kirana","Terima kasih, Mbok… tapi saya tidak punya uang. Dan sejujurnya saya juga tidak tahu saya ada di mana."],["Mbok Rondo","Mbok ngerti. Bantu mbok telu wae. Antar pesanan ke pembuat gerabah, pengangkut padi, dan penjaga atap. Mengko mbok wenehi sing luwih penting tinimbang sega."]],"chase":[["Penjaga atap","Terima kasih! Eh—lutung itu membawa bungkusan Mbok!"],["Kirana","Tunggu! Aku cuma ingin tahu apa yang kamu bawa."],["Narasi","Lutung melompat dari atap ke atap menuju dermaga. Ikuti jalur atas; pasar di belakang mulai lenyap dari pandangan."]],"asih":[["Kirana","Kamu lapar juga, ya? Ini sisa sarapanku."],["Narasi","Lutung mengambil makanan itu dan meletakkan bungkusan di tangan Kirana."],["Mbok Rondo","Gawanen menyang Tuan Putri Candra Kirana ing Kedaton Dhaha. Sing isih éling, mung kowe."]],"introPetirtaan":[["Kirana","Serat Asih berpendar ketika aku memasuki taman. Tetapi batu-batunya seperti sedang kehilangan bentuk."],["Kirana","Ada seorang abdi di dekat damar. Mungkin ia tahu jalan menuju kedaton."]],"jati":[["Ki Jati","Pakaianmu asing, Nak. Tapi tanganmu memegang sesuatu yang kukenal lebih baik daripada wajahku sendiri."],["Kirana","Saya Kirana. Mbok penjual di pasar meminta saya menyerahkan ini pada Tuan Putri."],["Ki Jati","Pecahan Serat. Tiga tahun terakhir, tembok ini mulai kosong sendiri. Dulu di sini ada gambar Putri memberi makan burung. Aku tidak lagi ingat bentuknya."],["Kirana","Ki… kenapa Ki Jati menangis?"],["Ki Jati","Kemarin aku memanggil anakku. Lalu aku sadar aku tidak tahu nama yang kupanggil."],["Ki Jati","Bawalah Pelita Ingatan. Selama ia menyala, yang terlupa masih bisa dipijak. Buka Hulu dan Akar, tutup Hilir. Tunggu di damar tengah."]],"sabar":[["Kirana","Satu demi satu relief menyala ketika kolam penuh. Air itu menyelesaikan ceritanya sendiri."],["Ki Jati","Kini balik alirannya: tutup Hulu dan Akar, buka Hilir. Pelitamu sudah bisa menahan pijakan yang memudar. Di depan relief, diam dan tahan cahayanya; kubantu membaca huruf pertamanya."]],"jujur":[["Kirana","Aku hampir mengisi bagian kosong dengan tebakanku. Tetapi urutan peristiwanya masih ada di dinding ini."],["Ki Jati","Kau telah membaca yang tertulis. Bawalah Serat Jujur. Jalan berikutnya menanjak ke tempat sunyi."]],"introBukit":[["Kirana","Obor emas yang berdiri di atas batu adalah Damar Pengingat. Mendekatinya menyimpan perjalanan dan mengisi minyak. Damar Jurang ada di teras sebelum jembatan putus; penunjuk akan menuntunku ke sana."],["Kirana","Dari Damar Jurang, aku harus ke tepi kanan, menahan X, lalu melompat dengan Z melalui pijakan bercahaya. Di dekat gulungan Wani, tetap tahan X dan tekan C. Setelah itu barulah naik ke Kilisuci."]],"kilisuci":[["Dewi Kilisuci","Aku Kilisuci. Yang memilih menyepi agar tak menjadi rebutan."],["Kirana","Kutukan apa sebenarnya yang menimpa Tuan Putri?"],["Dewi Kilisuci","Bukan sihir hitam, Nak. Kutukannya bernama kelalaian. Di zamanmu kisah beliau tak lagi diceritakan. Tanpa diingat, ia tak ada."],["Kirana","Jadi yang membuat Putri menghilang… adalah orang-orang seperti saya."],["Dewi Kilisuci","Dan yang bisa mengembalikannya juga orang seperti kamu. Pedang tak bisa melawan lupa. Hanya cerita yang bisa."],["Dewi Kilisuci","Kau akan bertemu seseorang yang mengatakan membiarkan kisah mati adalah belas kasihan. Dengarkan dia baik-baik. Ia tidak sepenuhnya salah."]],"andhap":[["Kirana","Aku menurunkan pelita mengikuti pahatan, bukan memaksanya mengikuti arahku. Cerukan terakhir akhirnya menyala."],["Dewi Kilisuci","Serat Andhap kini bersamamu. Ketuk pelita untuk mengibaskan kabut kecil. Cepat—lorong goa mulai dilupakan!"]],"introGerbang":[["Penjaga","Gerbang ini mengenali nama lama kerajaan. Empat petunjuk tersebar di halaman, menara, gudang, dan batu yang hampir hilang."],["Kirana","Aku harus melihat apa yang tertutup lumut, bayangan, kunci, dan kabut."]],"samarGate":[["Ki Samar","Delapan ratus tahun aku mencatat nama-nama yang berhenti disebut. Sekarang aku hanya merapikan."],["Kirana","Saya membawa kembali sesuatu yang dilupakan."],["Ki Samar","Dilupakan, atau dilepaskan? Bukankah lebih kejam memaksa sebuah kisah hidup di tempat yang tak menginginkannya?"],["Narasi","Ki Samar menghilang. Selama beberapa saat, hanya bunyi langkah Kirana yang tersisa."]],"introKedaton":[["Kirana","Lantainya hilang ketika pelitaku berpaling. Ada langkah lain… tetapi tidak ada pemiliknya."],["Kirana","Bilik buntu mungkin bisa menahan langkah itu. Dan bayangan di pendapa meniru gerakanku terlambat satu detik."]],"galuh":[["Bayang Galuh","Aku hanya iri karena tak ada yang menceritakan versiku."],["Kirana","Aku mendengarmu. Kisah ini ternyata menyisakan lebih dari satu orang di dalam gelap."]],"pusaka":[["Narasi","Puluhan gulungan di lemari pusaka kosong. Satu-satunya nama yang masih tertulis adalah Candra Kirana."],["Kirana","Kirana… seperti namaku."],["Narasi","Huruf itu memudar di bawah jarinya. Kirana menarik tangan, lalu berlari."]],"introBangsal":[["Ki Samar","Jika ingatanmu memang kuat, nyalakan apa yang masih bisa kau jangkau."],["Kirana","Lima pilar. Cahaya dari satu pilar mungkin membuka jalan ke pilar berikutnya."]],"samarEnd":[["Ki Samar","Kau belum menjawab pertanyaanku yang sesungguhnya. Kenapa kisah ini layak diselamatkan, dan kisahku tidak?"],["Kirana","Siapa bilang tidak? Manuskrip ini belum selesai. Tulis namamu."],["Ki Samar","…Apa?"],["Kirana","Kamu bilang kamu menulis dan tidak pernah dibaca. Sekarang ada yang membaca. Saya."],["Ki Samar","Delapan ratus tahun… dan yang kubutuhkan hanya satu orang yang bertanya siapa namaku."]],"introPutri":[["Kirana","Ruangan ini hampir kosong. Tetapi ada seseorang yang masih menunggu di bawah cahaya bulan."],["Candra Kirana","Kepingan-kepingan itu… bisakah kau mengembalikan urutan kisahnya?"]],"putriEnd":[["Candra Kirana","Siapa namamu, gadis muda?"],["Kirana","Kirana, Tuan Putri. Sama seperti nama Tuan Putri."],["Candra Kirana","Tentu saja. Bagaimana kau menyatukan semuanya?"],["Kirana","Satu per satu. Dari kebaikan seorang mbok, kesabaran seorang abdi, sampai orang yang paling ingin semua ini dilupakan."],["Candra Kirana","Maka kau tidak hanya mengumpulkan kertas. Kau menjalaninya. Kembalilah. Ceritakan dengan caramu, dengan bahasamu, di zamanmu."]],"introEpilog":[["Kirana","Hujannya berhenti. Buku itu masih tergeletak di meja, seolah aku baru saja meninggalkannya."],["Kirana","Aku ingin melihat halaman terakhirnya sekali lagi."]],"lastbook":[["Kirana","Semua huruf kembali. Dan di halaman terakhir ada nama yang tidak tertulis sebelumnya: Ki Samar."],["Narasi","Sebuah ilustrasi menunjukkan Mbok Rondo Dadapan menemukan keong emas. Kirana mengenali wajah penjual yang memberinya sarapan."],["Kirana","Mbok tetap tinggal dalam ingatan yang paling keras bertahan. Sekarang giliranku meneruskan ceritanya."]],"golden":[["Narasi","Seorang anak masuk ke perpustakaan. Ia mengambil buku Keong Mas dari meja Kirana."],["Anak","Kak, halaman ini dulu kosong. Siapa Ki Samar?"],["Kirana","Duduklah. Ada sebuah kisah yang ingin kuceritakan."]],"flashbacks":{"Asih":"Mbok Rondo membawa keong yang ditemukannya pulang, tanpa meminta apa pun sebagai balasan.","Sabar":"Di dalam cangkang keemasan, Candra Kirana menunggu tangan yang mau menolongnya.","Jujur":"Tuduhan yang keliru tidak membuat sang putri melepaskan kebenaran yang ia pegang.","Wani":"Putri melangkah meninggalkan gerbang istana, menghadapi jalan yang belum dikenalnya.","Andhap":"Di rumah kecil Mbok Rondo, ia menyiapkan makanan dan membantu pekerjaan tanpa menuntut penghormatan.","Setya":"Sebelum perpisahan datang, sebuah janji di kedaton tetap ia jaga.","Wicaksana":"Pertemuan kembali membuka halaman baru. Cerita dapat bertahan ketika seseorang bersedia meneruskannya."}},"history":[{"id":1,"title":"Manuskrip yang diingat dunia","text":"Manuskrip cerita Panji tercatat dalam Memory of the World UNESCO pada 2017.","source":"https://www.unesco.org/en/memory-world/panji-tales-manuscripts","label":"UNESCO"},{"id":2,"title":"Panji dan Candra Kirana","text":"Dalam cerita Panji, sang pangeran mencari Candra Kirana sampai keduanya bertemu kembali.","source":"https://www.unesco.org/en/memory-world/panji-tales-manuscripts","label":"UNESCO"},{"id":3,"title":"Nama dan penyamaran","text":"Petualangan Panji menggunakan beragam nama dan penyamaran. Variasi merupakan bagian dari tradisi ceritanya.","source":"https://www.unesco.org/en/memory-world/panji-tales-manuscripts","label":"UNESCO"},{"id":4,"title":"Kisah yang menyeberang laut","text":"UNESCO mencatat pedagang laut berperan dalam penyebaran cerita Panji ketika kisah ini populer pada masa Majapahit.","source":"https://www.unesco.org/en/memory-world/panji-tales-manuscripts","label":"UNESCO"},{"id":5,"title":"Warisan bersama","text":"Pendaftaran manuskrip Panji diajukan bersama oleh Kamboja, Indonesia, Malaysia, Belanda, dan Britania Raya.","source":"https://www.unesco.org/en/memory-world/panji-tales-manuscripts","label":"UNESCO"},{"id":6,"title":"Klotok di Kediri","text":"Gunung Klotok berada di Kelurahan Pojok, Kecamatan Mojoroto, Kota Kediri, dekat kaki Gunung Wilis.","source":"https://dpm.kedirikota.go.id/blog/11/gunung-klotok","label":"DPMPTSP Kota Kediri"},{"id":7,"title":"Tiga goa","text":"Pemerintah Kota Kediri mencatat Goa Selomangleng, Selobale, dan Padedean di kawasan Gunung Klotok.","source":"https://dpm.kedirikota.go.id/blog/11/gunung-klotok","label":"DPMPTSP Kota Kediri"},{"id":8,"title":"Dua puncak","text":"Dua puncak Klotok yang disebut pemerintah kota ialah Klop di tengah dan Watu Bengkah di selatan.","source":"https://dpm.kedirikota.go.id/blog/11/gunung-klotok","label":"DPMPTSP Kota Kediri"},{"id":9,"title":"Museum di kaki bukit","text":"Museum Airlangga termasuk tempat yang berada di sekitar kawasan Gunung Klotok.","source":"https://dpm.kedirikota.go.id/blog/11/gunung-klotok","label":"DPMPTSP Kota Kediri"},{"id":10,"title":"Lebih luas dari Jawa","text":"Tradisi Panji menyebar ke Bali, dunia Melayu, Thailand, Myanmar, dan Kamboja.","source":"https://www.unesco.org/en/memory-world/panji-tales-manuscripts","label":"UNESCO"},{"id":11,"title":"Sastra Jawa bertumbuh","text":"UNESCO melihat cerita Panji sebagai bagian penting berkembangnya sastra Jawa di luar bayang-bayang epos India.","source":"https://www.unesco.org/en/memory-world/panji-tales-manuscripts","label":"UNESCO"},{"id":12,"title":"Cerita dan waktu","text":"UNESCO menyebut cerita Panji dari abad ke-13. Latar Kadiri abad ke-11 dan Kutukan Lupa dalam game adalah adaptasi fiksi, bukan kronologi sejarah.","source":"https://www.unesco.org/en/memory-world/panji-tales-manuscripts","label":"UNESCO · catatan adaptasi"}],"site":{"ukmUrl":"","eventDate":"","eventName":"UKM Pendidikan & Penalaran"}});
}
runtimeScene.__ck.tick();
};
gdjs.PetirtaanCode.eventsList0 = function(runtimeScene) {

{


gdjs.PetirtaanCode.userFunc0x1580890(runtimeScene);

}


};

gdjs.PetirtaanCode.func = function(runtimeScene) {
runtimeScene.getOnceTriggers().startNewFrame();

gdjs.PetirtaanCode.GDKiranaObjects1.length = 0;
gdjs.PetirtaanCode.GDStoneObjects1.length = 0;
gdjs.PetirtaanCode.GDFadedObjects1.length = 0;
gdjs.PetirtaanCode.GDRaftObjects1.length = 0;
gdjs.PetirtaanCode.GDLeverObjects1.length = 0;
gdjs.PetirtaanCode.GDDamarObjects1.length = 0;
gdjs.PetirtaanCode.GDFlowerObjects1.length = 0;
gdjs.PetirtaanCode.GDScrollObjects1.length = 0;
gdjs.PetirtaanCode.GDReliefObjects1.length = 0;
gdjs.PetirtaanCode.GDExitObjects1.length = 0;
gdjs.PetirtaanCode.GDKunangObjects1.length = 0;
gdjs.PetirtaanCode.GDGlowObjects1.length = 0;
gdjs.PetirtaanCode.GDBeamObjects1.length = 0;
gdjs.PetirtaanCode.GDMistObjects1.length = 0;
gdjs.PetirtaanCode.GDWaterObjects1.length = 0;
gdjs.PetirtaanCode.GDSkyObjects1.length = 0;
gdjs.PetirtaanCode.GDMountainObjects1.length = 0;
gdjs.PetirtaanCode.GDVineObjects1.length = 0;
gdjs.PetirtaanCode.GDLadderObjects1.length = 0;
gdjs.PetirtaanCode.GDSparkObjects1.length = 0;
gdjs.PetirtaanCode.GDVoidObjects1.length = 0;
gdjs.PetirtaanCode.GDBookObjects1.length = 0;
gdjs.PetirtaanCode.GDCandlesObjects1.length = 0;
gdjs.PetirtaanCode.GDBellObjects1.length = 0;
gdjs.PetirtaanCode.GDPillarObjects1.length = 0;
gdjs.PetirtaanCode.GDCrateObjects1.length = 0;
gdjs.PetirtaanCode.GDFootObjects1.length = 0;
gdjs.PetirtaanCode.GDStoneFillObjects1.length = 0;
gdjs.PetirtaanCode.GDUpperObjects1.length = 0;
gdjs.PetirtaanCode.GDBarrierObjects1.length = 0;
gdjs.PetirtaanCode.GDMarkerObjects1.length = 0;
gdjs.PetirtaanCode.GDLadderArtObjects1.length = 0;
gdjs.PetirtaanCode.GDLampObjects1.length = 0;
gdjs.PetirtaanCode.GDDakonObjects1.length = 0;
gdjs.PetirtaanCode.GDJugObjects1.length = 0;
gdjs.PetirtaanCode.GDMirrorObjects1.length = 0;
gdjs.PetirtaanCode.GDStoreObjects1.length = 0;
gdjs.PetirtaanCode.GDHeirloomObjects1.length = 0;
gdjs.PetirtaanCode.GDManuscriptObjects1.length = 0;
gdjs.PetirtaanCode.GDPosterObjects1.length = 0;
gdjs.PetirtaanCode.GDRootsObjects1.length = 0;
gdjs.PetirtaanCode.GDPassageObjects1.length = 0;
gdjs.PetirtaanCode.GDGateDialsObjects1.length = 0;
gdjs.PetirtaanCode.GDRoadObjects1.length = 0;
gdjs.PetirtaanCode.GDGroundRoadObjects1.length = 0;
gdjs.PetirtaanCode.GDRoadFillObjects1.length = 0;
gdjs.PetirtaanCode.GDFadedRoadObjects1.length = 0;
gdjs.PetirtaanCode.GDRaftRoadObjects1.length = 0;
gdjs.PetirtaanCode.GDMbokObjects1.length = 0;
gdjs.PetirtaanCode.GDSamarObjects1.length = 0;
gdjs.PetirtaanCode.GDPutriObjects1.length = 0;
gdjs.PetirtaanCode.GDLutungObjects1.length = 0;
gdjs.PetirtaanCode.GDGaluhObjects1.length = 0;
gdjs.PetirtaanCode.GDKiJatiObjects1.length = 0;
gdjs.PetirtaanCode.GDKilisuciObjects1.length = 0;
gdjs.PetirtaanCode.GDGuardObjects1.length = 0;
gdjs.PetirtaanCode.GDGardenObjects1.length = 0;
gdjs.PetirtaanCode.GDMemoryGardenObjects1.length = 0;

gdjs.PetirtaanCode.eventsList0(runtimeScene);
gdjs.PetirtaanCode.GDKiranaObjects1.length = 0;
gdjs.PetirtaanCode.GDStoneObjects1.length = 0;
gdjs.PetirtaanCode.GDFadedObjects1.length = 0;
gdjs.PetirtaanCode.GDRaftObjects1.length = 0;
gdjs.PetirtaanCode.GDLeverObjects1.length = 0;
gdjs.PetirtaanCode.GDDamarObjects1.length = 0;
gdjs.PetirtaanCode.GDFlowerObjects1.length = 0;
gdjs.PetirtaanCode.GDScrollObjects1.length = 0;
gdjs.PetirtaanCode.GDReliefObjects1.length = 0;
gdjs.PetirtaanCode.GDExitObjects1.length = 0;
gdjs.PetirtaanCode.GDKunangObjects1.length = 0;
gdjs.PetirtaanCode.GDGlowObjects1.length = 0;
gdjs.PetirtaanCode.GDBeamObjects1.length = 0;
gdjs.PetirtaanCode.GDMistObjects1.length = 0;
gdjs.PetirtaanCode.GDWaterObjects1.length = 0;
gdjs.PetirtaanCode.GDSkyObjects1.length = 0;
gdjs.PetirtaanCode.GDMountainObjects1.length = 0;
gdjs.PetirtaanCode.GDVineObjects1.length = 0;
gdjs.PetirtaanCode.GDLadderObjects1.length = 0;
gdjs.PetirtaanCode.GDSparkObjects1.length = 0;
gdjs.PetirtaanCode.GDVoidObjects1.length = 0;
gdjs.PetirtaanCode.GDBookObjects1.length = 0;
gdjs.PetirtaanCode.GDCandlesObjects1.length = 0;
gdjs.PetirtaanCode.GDBellObjects1.length = 0;
gdjs.PetirtaanCode.GDPillarObjects1.length = 0;
gdjs.PetirtaanCode.GDCrateObjects1.length = 0;
gdjs.PetirtaanCode.GDFootObjects1.length = 0;
gdjs.PetirtaanCode.GDStoneFillObjects1.length = 0;
gdjs.PetirtaanCode.GDUpperObjects1.length = 0;
gdjs.PetirtaanCode.GDBarrierObjects1.length = 0;
gdjs.PetirtaanCode.GDMarkerObjects1.length = 0;
gdjs.PetirtaanCode.GDLadderArtObjects1.length = 0;
gdjs.PetirtaanCode.GDLampObjects1.length = 0;
gdjs.PetirtaanCode.GDDakonObjects1.length = 0;
gdjs.PetirtaanCode.GDJugObjects1.length = 0;
gdjs.PetirtaanCode.GDMirrorObjects1.length = 0;
gdjs.PetirtaanCode.GDStoreObjects1.length = 0;
gdjs.PetirtaanCode.GDHeirloomObjects1.length = 0;
gdjs.PetirtaanCode.GDManuscriptObjects1.length = 0;
gdjs.PetirtaanCode.GDPosterObjects1.length = 0;
gdjs.PetirtaanCode.GDRootsObjects1.length = 0;
gdjs.PetirtaanCode.GDPassageObjects1.length = 0;
gdjs.PetirtaanCode.GDGateDialsObjects1.length = 0;
gdjs.PetirtaanCode.GDRoadObjects1.length = 0;
gdjs.PetirtaanCode.GDGroundRoadObjects1.length = 0;
gdjs.PetirtaanCode.GDRoadFillObjects1.length = 0;
gdjs.PetirtaanCode.GDFadedRoadObjects1.length = 0;
gdjs.PetirtaanCode.GDRaftRoadObjects1.length = 0;
gdjs.PetirtaanCode.GDMbokObjects1.length = 0;
gdjs.PetirtaanCode.GDSamarObjects1.length = 0;
gdjs.PetirtaanCode.GDPutriObjects1.length = 0;
gdjs.PetirtaanCode.GDLutungObjects1.length = 0;
gdjs.PetirtaanCode.GDGaluhObjects1.length = 0;
gdjs.PetirtaanCode.GDKiJatiObjects1.length = 0;
gdjs.PetirtaanCode.GDKilisuciObjects1.length = 0;
gdjs.PetirtaanCode.GDGuardObjects1.length = 0;
gdjs.PetirtaanCode.GDGardenObjects1.length = 0;
gdjs.PetirtaanCode.GDMemoryGardenObjects1.length = 0;


return;

}

gdjs['PetirtaanCode'] = gdjs.PetirtaanCode;
