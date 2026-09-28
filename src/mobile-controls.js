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
