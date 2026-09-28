function createCampaignGame(scene,level,M,css,content){
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
