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
