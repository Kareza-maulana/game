function createGame(scene, level, model, css) {
  'use strict';
  const $=id=>document.getElementById(id);
  const player=scene.getObjects('Kirana')[0], body=player.getBehavior('Platformer');
  const get=name=>scene.getObjects(name), keys=new Set(), pressed=new Set();
  let s=model.createState(), mode='title', facing=1, time=0, lastFloor=-10, jumpQueued=-10;
  let shining=false, dialog=null, dialogAt=0, dialogDone=null, auto=false, autoTime=0;
  let camera={x:240,y:260}, lastSaved='', toastUntil=0, hintTimer=0, progress='', lastX=56;
  let flash=0, repel=0, flowerLights=new Set(), reliefRead=0, audio=null, muted=false;
  let saveAvailable=false, saved=null, saveWarning=false;
  const storageKey='cahayakadiri_save';
  try{saved=JSON.parse(localStorage.getItem(storageKey)||'null'); saveAvailable=!!saved&&saved.version===1&&saved.scene==='Petirtaan';}catch{}
  const style=document.createElement('style');style.textContent=css;document.head.append(style);
  const ui=document.createElement('div');ui.id='ck';document.body.append(ui);
  ui.innerHTML=`
    <div id="vignette"></div><div id="flash"></div>
    <header id="hud" hidden><div class="memory"><div id="oil" role="img" aria-label="Minyak Ingatan penuh"><span class="flame">◆</span><span class="lamp">⌣</span></div><div><span class="eyebrow">PELITA INGATAN</span><div id="serat-slots"></div></div></div>
    <div class="chapter"><span class="eyebrow">BABAK I · TERLEMPAR</span><span>Petirtaan Wijayakusuma</span></div>
    <div class="hud-actions"><button id="journal-button" aria-label="Buka jurnal">J <span>Jurnal</span></button><button id="pause-button" aria-label="Jeda permainan">Ⅱ</button></div></header>
    <div id="objective" hidden><span class="eyebrow">AIR YANG MENGINGAT</span><p id="quest"></p></div>
    <div id="prompt" hidden></div><div id="toast" role="status" hidden></div>
    <div id="modal"></div>
    <footer id="legend" hidden><span>← → <b>Bergerak</b></span><span>Z <b>Lompat</b></span><span>X <b>Pelita</b></span><span>C <b>Interaksi</b></span><span>SHIFT <b>Lari</b></span></footer>
    <nav id="touch" aria-label="Kontrol sentuh" hidden><div><button data-key="ArrowLeft" aria-label="Bergerak kiri">←</button><button data-key="ArrowRight" aria-label="Bergerak kanan">→</button></div><div><button data-key="KeyX" aria-label="Sorot pelita">X</button><button data-key="KeyC" aria-label="Interaksi">C</button><button data-key="KeyZ" aria-label="Lompat">Z</button></div></nav>
    <div id="build-label">CAHAYA KADIRI <span>·</span> PETIRTAAN / 0.1</div>`;
  function sound(freq=440,len=.12){
    if(muted)return;
    try{audio??=new(window.AudioContext||window.webkitAudioContext)();audio.resume();const osc=audio.createOscillator(),gain=audio.createGain();osc.type='sine';osc.frequency.setValueAtTime(freq,audio.currentTime);gain.gain.setValueAtTime(.035,audio.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audio.currentTime+len);osc.connect(gain);gain.connect(audio.destination);osc.start();osc.stop(audio.currentTime+len);}catch{}
  }
  function setMode(next){mode=next;keys.clear();pressed.clear();shining=false;player.activateBehavior('Platformer',next==='play');if(next==='play')player.playAnimation();else player.pauseAnimation();$('modal').hidden=next==='play';$('touch').hidden=next!=='play';$('prompt').hidden=true;}
  function toast(text){$('toast').textContent=text;$('toast').hidden=false;toastUntil=time+4;}
  function save(){
    const value=JSON.stringify(s);if(value===lastSaved)return;
    try{localStorage.setItem(storageKey,value);lastSaved=value;saved=JSON.parse(value);saveAvailable=true;}catch{if(!saveWarning){toast('Penyimpanan browser tidak tersedia. Sesi ini tetap bisa dimainkan.');saveWarning=true;}}
  }
  function renderHud(){
    $('serat-slots').innerHTML=model.SERAT.map(([name])=>`<i class="${s.serat.includes(name)?'filled':''}" title="Serat ${name}" aria-label="${name}: ${s.serat.includes(name)?'terkumpul':'belum ditemukan'}"></i>`).join('');
    $('oil').style.setProperty('--oil',s.pelita?Math.max(.08,s.oil/100):0);
    $('oil').setAttribute('aria-label',s.pelita?`Minyak Ingatan ${Math.round(s.oil)} persen`:'Pelita belum diperoleh');
    $('quest').textContent=!s.pelita?'Temui Ki Jati, penjaga taman.':!s.sabar?'Alirkan air: buka Hulu dan Akar, tutup Hilir. Tunggu di Damar tengah.':!s.drained?'Buka jalur bawah: tutup Hulu dan Akar, buka Hilir.':!s.jujur?'Tahan X untuk menyeberangi pijakan lupa. Baca relief di ujung taman.':'Dua serat kembali terbaca. Temui jalan menuju Bukit Klotok.';
  }
  function title(){
    setMode('title');$('hud').hidden=true;$('objective').hidden=true;$('legend').hidden=true;
    $('modal').innerHTML=`<section class="title-screen"><div class="title-ornament">✧</div><span class="eyebrow">SERAT SAPTA KETELADANAN</span><h1>Cahaya<br><em>Kadiri</em></h1><div class="gold-rule"></div><p>Ada kisah yang hanya hidup<br>selama seseorang masih mengingatnya.</p><div class="title-buttons"><button class="primary" id="start">${saveAvailable?'Mulai dari awal':'Masuki taman'} <span>→</span></button>${saveAvailable?'<button class="secondary" id="continue">Lanjutkan perjalanan</button>':''}</div><span class="title-note">SCENE 02 · AIR YANG MENGINGAT</span><span class="title-note small">Prototipe Petirtaan · gunakan keyboard atau kontrol sentuh</span></section>`;
    $('start').onclick=()=>start(false);if($('continue'))$('continue').onclick=()=>start(true);
  }
  function start(resume){
    s=model.createState(resume?saved:null);flowerLights.clear();repel=0;hintTimer=0;reliefRead=0;
    const [x,y]=level.checkpoints[s.checkpoint];player.setPosition(x,y);body.setCurrentSpeed(0);body.setCurrentFallSpeed(0);
    camera={x:Math.max(240,x),y:260};setMode('play');$('hud').hidden=false;$('objective').hidden=false;$('legend').hidden=false;
    get('Scroll').forEach(o=>o.hide(s.kidung.includes(o.getVariables().get('kidung').getAsNumber())));
    renderHud();sound(392,.4);
    if(!resume)showDialog([
      ['Kirana','Mbok penjual menitipkan Serat Asih untuk Tuan Putri. Tetapi taman menuju kedaton ini… seperti sedang kehilangan bentuknya.'],
      ['Kirana','Ada seseorang di dekat damar. Mungkin ia tahu jalan.']
    ],()=>{toast('Bergerak dengan ← → atau A D. Z untuk melompat, C untuk berinteraksi.');save();});
  }
  function showDialog(lines,done){dialog=lines;dialogAt=0;dialogDone=done;auto=false;autoTime=0;setMode('dialog');renderDialog();}
  function renderDialog(){
    const[who,words]=dialog[dialogAt];
    $('modal').innerHTML=`<section class="dialog" aria-label="Percakapan"><div class="dialog-marker">${who==='Ki Jati'?'✦':'❖'}</div><div class="dialog-content"><span class="eyebrow">${who}</span><p>${words}</p><div class="dialog-controls"><button id="skip-dialog">Lewati</button><button id="auto-dialog">${auto?'Auto aktif':'Auto'}</button><span>${dialogAt+1} / ${dialog.length}</span><button class="next" id="next-dialog">${dialogAt===dialog.length-1?'Selesai':'Lanjut'} →</button></div></div></section>`;
    $('next-dialog').onclick=nextDialog;$('skip-dialog').onclick=endDialog;$('auto-dialog').onclick=()=>{auto=!auto;autoTime=0;renderDialog();};
  }
  function nextDialog(){sound(440,.04);autoTime=0;if(++dialogAt>=dialog.length)endDialog();else renderDialog();}
  function endDialog(){const done=dialogDone;dialog=null;dialogDone=null;setMode('play');if(done)done();renderHud();}
  function pause(){
    setMode('pause');$('modal').innerHTML=`<section class="panel"><span class="eyebrow">SEJENAK MENGINGAT</span><h2>Pelita tetap menyala.</h2><p>Perjalananmu tersimpan di Damar Pengingat terakhir.</p><div class="stack"><button class="primary" id="resume">Lanjutkan perjalanan →</button><button id="return-damar">Kembali ke damar</button><button id="sound-toggle">Suara: ${muted?'mati':'aktif'}</button><button id="main-menu">Kembali ke judul</button></div><p class="subtle">← → / A D bergerak · Z / Spasi lompat<br>X tahan: sorot · C / E: interaksi · J: jurnal</p></section>`;
    $('resume').onclick=()=>setMode('play');$('return-damar').onclick=()=>{setMode('play');respawn('Kembali ke Damar Pengingat.');};$('sound-toggle').onclick=()=>{muted=!muted;pause();};$('main-menu').onclick=()=>{save();title();};
  }
  function journal(tab='Serat'){
    setMode('journal');const content=tab==='Serat'?`<div class="serat-list">${model.SERAT.map(([name,value,ability],i)=>`<article class="${s.serat.includes(name)?'collected':'locked'}"><span>0${i+1}</span><div><h3>Serat ${name}</h3><p>${s.serat.includes(name)?value+' · '+ability:'Belum ditemukan'}</p></div><b>${s.serat.includes(name)?'✦':'◇'}</b></article>`).join('')}</div>`:tab==='Tokoh'?`<article class="journal-copy"><h3>Ki Jati</h3><p>Abdi yang menjaga taman ketika relief mulai kosong. Ia mulai melupakan nama anaknya sendiri.</p><h3>Kirana</h3><p>Mahasiswi UKM Pendidikan & Penalaran yang membawa pecahan kisah ke Kadiri. Ia datang dengan Serat Asih dari Pasar Tandes.</p><h3>Candra Kirana</h3><p>Putri dalam kisah Keong Mas. Manuskrip yang terpecah menyimpan jalan untuk mengingatnya kembali.</p></article>`:`<article class="journal-copy"><span class="eyebrow">KIDUNG TERLUPA · ${s.kidung.length} / 2 DI TAMAN</span><h3>Catatan perjalanan</h3>${s.kidung.length?s.kidung.map(id=>`<p><b>Kidung ${id}.</b> ${id===4?'Di atas pancuran, huruf-huruf bertahan dalam percik air. Sesuatu yang kecil pun bisa menjaga sebuah kisah.':'Taman tak meminta aku tergesa. Ada jalan yang baru terlihat ketika aku berhenti.'}</p>`).join(''):'<p>Gulungan tersembunyi menunggu di tempat yang lebih tinggi.</p>'}<p class="subtle">Catatan fiktif Kirana. Entri sejarah Kadiri akan ditambahkan setelah verifikasi sumber.</p></article>`;
    $('modal').innerHTML=`<section class="panel journal"><div class="panel-head"><div><span class="eyebrow">YANG TIDAK INGIN KULUPAKAN</span><h2>Jurnal Nusantara</h2></div><button id="close-journal" aria-label="Tutup jurnal">×</button></div><nav class="tabs">${['Serat','Tokoh','Kadiri'].map(t=>`<button data-tab="${t}" class="${tab===t?'active':''}">${t}</button>`).join('')}</nav>${content}</section>`;
    $('close-journal').onclick=()=>setMode('play');ui.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>journal(b.dataset.tab));
  }
  let order=[];
  function relief(){
    if(!s.sabar||!s.drained){toast('Air di teras bawah masih menutup jalan cerita.');return;}
    if(s.jujur){showDialog([['Kirana','Putri, kutukan, pertolongan Mbok, lalu kepulangan. Kini aku bisa membaca kisahnya kembali.']]);return;}
    if(reliefRead<1){toast('Diam di depan relief sambil menahan X untuk membaca aksaranya.');return;}
    order=[];setMode('relief');renderRelief();
  }
  function renderRelief(){
    const shuffled=[model.RELIEF[2],model.RELIEF[0],model.RELIEF[3],model.RELIEF[1]];
    $('modal').innerHTML=`<section class="panel relief-panel"><span class="eyebrow">RELIEF YANG AUS</span><h2>Susun kembali sebuah kisah.</h2><p>Pilih panel menurut urutan peristiwa. Ketuk panel terpilih untuk mengurungkannya.</p><div class="relief-slots">${[0,1,2,3].map((_,i)=>`<span>${order[i]?model.RELIEF.find(r=>r.id===order[i]).title:'0'+(i+1)+' · · ·'}</span>`).join('')}</div><div class="relief-cards">${shuffled.map((r,i)=>`<button data-relief="${r.id}" class="${order.includes(r.id)?'selected':''}"><span class="relief-icon">${['❋','♛','✧','◉'][i]}</span><strong>${r.title}</strong><small>${r.text}</small></button>`).join('')}</div><div id="relief-feedback" role="status">${s.attempts>=3?'Petunjuk Ki Jati: Putri → kutukan → pertolongan Mbok → kepulangan.':'Yang lebih dahulu terjadi membuka jalan bagi yang berikutnya.'}</div><div class="panel-buttons"><button id="cancel-relief">Kembali</button><button class="primary" id="check-relief" ${order.length!==4?'disabled':''}>Satukan ingatan →</button></div></section>`;
    ui.querySelectorAll('[data-relief]').forEach(b=>b.onclick=()=>{const id=b.dataset.relief;order=order.includes(id)?order.filter(v=>v!==id):[...order,id];renderRelief();});
    $('cancel-relief').onclick=()=>setMode('play');$('check-relief').onclick=()=>{
      const result=model.solveRelief(s,order);setMode('play');
      if(result==='solved'){sound(784,.7);showDialog([['Kirana','Aku hampir mengisi bagian kosong dengan tebakanku sendiri. Tetapi dinding ini menyimpan urutannya.'],['Ingatan Candra Kirana','Mbok menerima keong itu tanpa mengetahui siapa yang bersembunyi di dalamnya. Ketika kisahnya terbuka, sang putri tak lagi menyembunyikan dirinya.'],['Serat Jujur','Huruf-huruf kembali utuh. Pelita: Baca kini menjadi kemampuanmu.']],()=>{renderHud();save();toast('Serat Jujur ditemukan · Pelita: Baca');});}
      else{respawn('Urutannya belum menyatu. Air pasang mengembalikanmu ke teras atas.');save();}
    };
  }
  function finish(){
    if(!s.jujur){toast('Relief di taman belum selesai dibaca.');return;}
    s.completed=true;save();setMode('complete');sound(659,.8);
    $('modal').innerHTML=`<section class="panel completion"><div class="title-ornament">✧</div><span class="eyebrow">AIR YANG MENGINGAT</span><h2>Dua serat.<br>Satu kisah yang kembali.</h2><p>Di balik taman, Bukit Klotok menunggu.<br>Pelita Ki Jati kini menyimpan cahaya yang baru.</p><div class="summary"><span>✦ Sabar</span><span>✦ Jujur</span><span>♧ Kidung ${s.kidung.length}/2</span></div><div class="stack"><button class="primary" id="explore">Jelajahi taman lagi →</button><button id="complete-journal">Buka jurnal</button><button id="complete-title">Kembali ke judul</button></div><p class="subtle">Akhir prototipe Petirtaan. Babak berikutnya belum tersedia.</p></section>`;
    $('explore').onclick=()=>setMode('play');$('complete-journal').onclick=()=>journal();$('complete-title').onclick=title;
  }
  function interact(){
    const x=player.getX()+16,y=player.getY()+16;
    if(Math.hypot(x-141,y-336)<42){
      if(!s.pelita)showDialog([
        ['Ki Jati','Pakaianmu asing, Nak. Tapi tanganmu memegang sesuatu yang kukenal lebih baik daripada wajahku sendiri.'],
        ['Kirana','Saya Kirana. Mbok penjual di pasar meminta saya menyerahkan ini pada Tuan Putri.'],
        ['Ki Jati','Pecahan Serat. Sudah tiga puluh tahun aku menjaga taman ini… dan tiga tahun terakhir, tembok ini mulai kosong sendiri.'],
        ['Ki Jati','Dulu di sini ada gambar Putri memberi makan burung. Aku ingat pernah melihatnya. Tapi aku tidak lagi ingat bagaimana bentuknya.'],
        ['Kirana','Ki… kenapa Ki Jati menangis?'],
        ['Ki Jati','Kemarin aku memanggil anakku. Lalu aku sadar aku tidak tahu nama yang kupanggil.'],
        ['Ki Jati','Bawalah ini. Pelita Ingatan. Selama ia menyala, yang terlupa masih bisa dipijak. Tapi minyaknya terbatas, Nak — seperti ingatan.'],
        ['Ki Jati','Buka saluran Hulu dan Akar. Tutup Hilir. Lalu tunggulah di damar tengah; biarkan kolam menyelesaikan ceritanya.']
      ],()=>{s.pelita=true;save();renderHud();});
      else showDialog([['Ki Jati',!s.sabar?'Hulu dan Akar terbuka, Hilir tertutup. Setelah itu, diamlah di dekat damar tengah sampai delapan denyut berlalu.':!s.drained?'Kini lakukan kebalikannya. Tutup Hulu dan Akar, buka Hilir. Air yang pergi akan membuka jalan.':'Tetaplah di dekat damar jika minyakmu menipis. Di depan relief, tahan pelita sambil diam. Akan kubantu membaca huruf pertamanya.']]);
      return;
    }
    const lever=level.levers.findIndex(([lx,ly])=>Math.hypot(x-lx-8,y-ly-12)<32);
    if(lever>=0){if(!s.pelita){toast('Temui Ki Jati sebelum mengubah aliran taman.');return;}s.levers[lever]=!s.levers[lever];sound(s.levers[lever]?523:330);toast(`${['Hulu','Hilir','Akar'][lever]} ${s.levers[lever]?'dibuka':'ditutup'}.`);save();return;}
    if(Math.hypot(x-(level.relief[0]+32),y-336)<48){relief();return;}
    if(Math.hypot(x-level.exit[0],y-336)<40){finish();return;}
    const damar=level.damars.findIndex(([dx,dy])=>Math.hypot(x-dx-10,y-dy+16)<40);
    if(damar>=0){s.checkpoint=damar;s.oil=100;save();toast('Damar Pengingat · minyak penuh, perjalanan tersimpan.');sound(587,.25);}
  }
  function respawn(message){const[x,y]=level.checkpoints[s.checkpoint];player.setPosition(x,y);body.setCurrentSpeed(0);body.setCurrentFallSpeed(0);s.oil=Math.max(40,s.oil-15);flash=1;repel=time+4;keys.clear();pressed.clear();toast(message);sound(220,.3);}
  $('journal-button').onclick=()=>mode==='play'?journal():null;$('pause-button').onclick=()=>mode==='play'?pause():null;
  const allowed=['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','KeyA','KeyD','KeyW','KeyS','KeyZ','KeyX','KeyC','KeyE','KeyJ','Space','ShiftLeft','ShiftRight','Escape','Enter'];
  window.addEventListener('keydown',e=>{if(!allowed.includes(e.code))return;e.preventDefault();if(e.repeat)return;keys.add(e.code);pressed.add(e.code);
    if(mode==='dialog'&&['KeyC','KeyE','Enter','Space'].includes(e.code))nextDialog();
    else if(e.code==='Escape'){if(mode==='play')pause();else if(['pause','journal','relief'].includes(mode))setMode('play');}
    else if(e.code==='KeyJ'){if(mode==='play')journal();else if(mode==='journal')setMode('play');}
  });
  window.addEventListener('keyup',e=>keys.delete(e.code));
  window.addEventListener('blur',()=>{keys.clear();if(mode==='play')pause();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&mode==='play')pause();});
  ui.querySelectorAll('[data-key]').forEach(b=>{
    b.onpointerdown=e=>{e.preventDefault();b.setPointerCapture(e.pointerId);keys.add(b.dataset.key);pressed.add(b.dataset.key);};
    b.onpointerup=b.onpointercancel=b.onlostpointercapture=()=>keys.delete(b.dataset.key);
  });
  const down=(...codes)=>codes.some(c=>keys.has(c)), once=(...codes)=>codes.some(c=>pressed.has(c));
  function tick(){
    const dt=Math.min(.04,scene.getTimeManager().getElapsedTime()/1000||.016);time+=dt;
    if(mode==='dialog'&&auto){autoTime+=dt;if(autoTime>Math.max(3,dialog[dialogAt][1].length/24))nextDialog();}
    const playing=mode==='play';
    if(playing){
      const left=down('ArrowLeft','KeyA'),right=down('ArrowRight','KeyD');
      if(left){body.simulateLeftKey();facing=-1;}if(right){body.simulateRightKey();facing=1;}
      body.setMaxSpeed(down('ShiftLeft','ShiftRight')?138:104);
      if(body.isOnFloor())lastFloor=time;
      if(once('KeyZ','Space','ArrowUp','KeyW'))jumpQueued=time;
      if(time-jumpQueued<=.1&&(body.isOnFloor()||time-lastFloor<=.12)){body.setCanJump();body.simulateJumpKey();jumpQueued=-10;lastFloor=-10;sound(280,.06);}
      player.flipX(facing<0);player.setAnimation(!body.isOnFloor()?2:(left||right?1:0));
      const x=player.getX()+16,y=player.getY()+16;
      shining=s.pelita&&s.sabar&&s.oil>0&&down('KeyX');
      if(once('KeyX')&&!s.sabar)toast(s.pelita?'Pulihkan aliran kolam untuk membuka Sorot.':'Ki Jati menyimpan pelita untukmu.');
      const checkpoint=level.damars.findIndex(([dx,dy])=>Math.hypot(x-dx-10,y-dy+16)<36);
      model.stepOil(s,dt,shining,x>level.fog[0]&&x<level.fog[1],checkpoint>=0);
      if(checkpoint>=0&&s.checkpoint!==checkpoint){s.checkpoint=checkpoint;save();toast('Damar Pengingat baru · perjalanan tersimpan.');}
      const reward=model.stepWater(s,dt,checkpoint===1&&!left&&!right&&body.isOnFloor());
      if(reward){save();renderHud();showDialog([['Kirana','Satu demi satu, relief di tepi kolam menyala. Aku tidak perlu memaksanya.'],['Ingatan Candra Kirana','Dalam sunyi, sang putri menunggu tangan yang mau menolong. Ia tetap menjaga harapan ketika tak seorang pun mengenalinya.'],['Serat Sabar','Pelita: Sorot terbuka. Tahan X untuk memadatkan pijakan yang memudar.'],['Ki Jati','Tutup Hulu dan Akar, buka Hilir. Sesudah menyeberang, diam dan sorot reliefnya. Kubantu membaca hingga kisahnya kembali utuh.']],()=>save());}
      if(s.drained&&!lastSaved.includes('"drained":true')){save();renderHud();toast('Air surut. Jalur menuju relief terbuka.');}
      if(once('KeyC','KeyE'))interact();
      if(player.getX()<0)player.setX(0);if(player.getX()>1504)player.setX(1504);
      if(player.getY()>490)respawn('Kabut menyapumu kembali ke Damar Pengingat.');
      if(!s.drained&&x>904&&player.getY()<390){player.setX(875);toast('Arus Hilir belum dialihkan. Periksa ketiga tuas.');}
      get('Scroll').forEach(o=>{if(!o.isHidden()&&Math.hypot(x-o.getX()-6,y-o.getY()-8)<23){const id=o.getVariables().get('kidung').getAsNumber();if(!s.kidung.includes(id))s.kidung.push(id);o.hide();s.oil=Math.min(100,s.oil+25);save();sound(880,.25);toast(`Kidung Terlupa #${id} · tersimpan di Jurnal Nusantara.`);}});
      level.flowers.forEach(([fx,fy],i)=>{if(model.isLit(x,y,facing,fx,fy-8,155,shining)&&!flowerLights.has(i)){flowerLights.add(i);get('Flower')[i].setColor('255;248;185');}});
      reliefRead=Math.hypot(x-1248,y-336)<64&&shining&&!left&&!right?Math.min(2,reliefRead+dt):Math.max(0,reliefRead-dt*.2);
      get('Relief')[0].setColor(reliefRead>=1?'255;237;162':'145;163;141');
      const bug=get('Kunang')[0];
      if(time>repel){const bx=bug.getX(),by=bug.getY(),dist=Math.hypot(x-bx,y-by);if(dist<90){bug.setPosition(bx+(x-bx)*dt*.45,by+(y-by)*dt*.45);}else bug.setY(340+Math.sin(time)*14);
        const sanctuary=checkpoint>=0||level.flowers.some(([fx,fy],i)=>flowerLights.has(i)&&Math.hypot(x-fx,y-fy)<34);
        if(sanctuary&&dist<65){bug.setX(bx+(bx<x?-1:1)*dt*45);}else if(dist<12){respawn('Kunang Sunyi memadamkan pelita. Berlindunglah di cahaya damar atau bunga.');}}
      let prompt='';
      if(Math.hypot(x-141,y-336)<42)prompt='C · Bicara dengan Ki Jati';
      level.levers.forEach(([lx,ly],i)=>{if(Math.hypot(x-lx-8,y-ly-12)<32)prompt=`C · ${s.levers[i]?'Tutup':'Buka'} ${['Hulu','Hilir','Akar'][i]}`;});
      if(checkpoint>=0&&!prompt)prompt=checkpoint===1&&!s.sabar&&s.levers[0]&&!s.levers[1]&&s.levers[2]?`Diam sejenak · ${Math.min(8,Math.floor(s.waiting))} / 8 denyut`:'C · Beristirahat di damar';
      if(Math.hypot(x-1248,y-336)<48)prompt=s.jujur?'C · Periksa relief':reliefRead>=1?'C · Susun relief':'Tahan X sambil diam · Baca relief';
      if(Math.hypot(x-level.exit[0],y-336)<40)prompt='C · Menuju Bukit Klotok';
      $('prompt').textContent=prompt;$('prompt').hidden=!prompt;
      const progressNow=JSON.stringify([s.levers,s.sabar,s.drained,s.jujur,s.kidung]);
      if(progress!==progressNow){hintTimer=0;progress=progressNow;}else hintTimer+=dt;
      if(hintTimer>90){toast(!s.sabar?'Ki Jati: Hulu terbuka, Hilir tertutup, Akar terbuka. Tunggu di damar tengah.':!s.drained?'Ki Jati: balik ketiganya — Hulu tutup, Hilir buka, Akar tutup.':'Bunga di tepi taman menuntun ke relief. Tahan X sambil diam.');hintTimer=0;}
      lastX=player.getX();
    }else shining=false;
    const px=player.getX()+16,py=player.getY()+16;
    get('Faded').forEach(o=>{const lit=model.isLit(px,py,facing,o.getX()+o.getWidth()/2,o.getY(),155,shining);o.activateBehavior('Platform',lit);o.setOpacity(lit?255:50+Math.sin(time*3)*12);});
    get('Lever').forEach((o,i)=>{o.setAngle(s.levers[i]?20:-20);o.setColor(s.levers[i]?'255;223;135':'161;185;168');});
    get('Raft')[0].setY(402-s.water*66);
    get('Water')[0].setY(410-s.water*60);get('Water')[0].setHeight(102+s.water*60);
    get('Water')[1].setY(s.drained?440:404);get('Water')[1].setHeight(s.drained?72:108);
    const beam=get('Beam')[0];beam.hide(!shining);beam.flipX(facing<0);beam.setPosition(facing>0?px:px-160,py-50);
    get('Glow').forEach(o=>{if(o.getVariables().get('playerLight').getAsNumber()===1){o.setPosition(px-50,py-50);o.setOpacity(s.pelita?70+100*s.oil/100:0);}});
    get('Mist').forEach((o,i)=>o.setX(i*180+Math.sin(time*.12+i)*35));
    camera.x+=(Math.max(240,Math.min(level.width-240,px+facing*35))-camera.x)*Math.min(1,dt*4);
    camera.y+=(Math.max(180,Math.min(370,py-48))-camera.y)*Math.min(1,dt*3);
    const layers=[['L0Sky',.05],['L1Mountains',.20],['L2Garden',.45],['L3Walls',.75],['',1],['L5Foreground',1.25],['L6Atmosphere',1]];
    layers.forEach(([name,m])=>{const layer=scene.getLayer(name);layer.setCameraX(240+(camera.x-240)*m);layer.setCameraY(260+(camera.y-260)*m);});
    $('vignette').style.opacity=s.pelita&&s.oil<25?'.9':'.35';
    flash=Math.max(0,flash-dt*2);$('flash').style.opacity=flash;
    if(time>toastUntil)$('toast').hidden=true;
    if(playing)renderHud();pressed.clear();
  }
  // Read-only diagnostics allow automated tests to observe real input and physics.
  window.__cahaya={snapshot:()=>({mode,state:JSON.parse(JSON.stringify(s)),x:player.getX(),y:player.getY(),onFloor:body.isOnFloor(),shining,reliefRead,solidPlatforms:get('Faded').map(o=>o.getBehavior('Platform').activated())})};
  title();renderHud();
  return {tick};
}
