function showEndingFeedback({container,signal,onClose,homeUrl,feedback}){
  const storageKey='cahayakadiri_feedback',draftKey='cahayakadiri_feedback_draft',limit=1500;
  const dialog=document.createElement('section');
  dialog.className='panel feedback-panel';dialog.setAttribute('role','dialog');
  dialog.setAttribute('aria-modal','true');dialog.setAttribute('aria-labelledby','feedback-title');
  dialog.innerHTML=`<div class="panel-head"><div><span class="eyebrow">TERIMA KASIH SUDAH BERMAIN</span><h2 id="feedback-title">Bagaimana perjalananmu?</h2></div><button type="button" id="feedback-close" aria-label="Tutup tanggapan">×</button></div>
    <p>Bagikan kesan, bagian favorit, atau saranmu untuk Cahaya Kadiri.</p>
    <form id="feedback-form"><label for="feedback-comment">Komentar atau tanggapan</label>
    <textarea id="feedback-comment" name="comment" rows="4" maxlength="${limit}" placeholder="Ceritakan pengalamanmu di sini…" aria-describedby="feedback-storage feedback-count" required></textarea>
    <div id="feedback-count" class="subtle">0 / ${limit}</div>
    <p id="feedback-storage" class="subtle">Tanggapan akan dikirim ke pengelola Cahaya Kadiri. Draf disimpan di perangkat ini sampai berhasil dikirim.</p>
    <p id="feedback-status" role="status" aria-live="polite"></p>
    <div class="feedback-actions"><button type="submit" id="feedback-save" class="primary">Kirim tanggapan</button><button type="button" id="feedback-later">Nanti saja</button></div></form>
    <a class="home-button" href="${homeUrl}">Kembali ke beranda ↗</a>`;
  container.replaceChildren(dialog);
  const find=id=>dialog.querySelector('#'+id),input=find('feedback-comment'),status=find('feedback-status'),submit=find('feedback-save');
  let sentText='',closed=false,busy=false,draftAvailable=true;
  try{
    const saved=JSON.parse(localStorage.getItem(storageKey)||'null');
    const savedText=typeof saved?.comment==='string'?saved.comment.slice(0,limit):'';
    sentText=saved?.sentAt?savedText:'';
    input.value=(localStorage.getItem(draftKey)??savedText).slice(0,limit);
    if(sentText)status.textContent='Tanggapan sebelumnya sudah terkirim. Kamu dapat menulis tanggapan baru.';
    else if(savedText)status.textContent='Tanggapan lama masih tersimpan di perangkat. Ketuk Kirim tanggapan untuk mengirimnya ke pengelola.';
  }catch{/* The form still works when reading storage is restricted. */}
  function update(){find('feedback-count').textContent=`${input.value.length} / ${limit}`;submit.disabled=busy||!input.value.trim()||input.value.trim()===sentText;}
  input.addEventListener('input',()=>{
    update();status.textContent=input.value.trim()===sentText&&sentText?'Tanggapan ini sudah terkirim.':'';input.setCustomValidity('');
    try{localStorage.setItem(draftKey,input.value);draftAvailable=true;}catch{draftAvailable=false;}
    if(!draftAvailable)status.textContent='Draf tidak dapat disimpan di perangkat ini. Kamu tetap dapat mengirim; salin teks jika ingin meninggalkan halaman.';
  },{signal});
  function close(){
    if(closed||busy)return;closed=true;document.removeEventListener('keydown',trap);onClose();
  }
  const trap=e=>{
    if(container.inert)return;
    if(e.key==='Escape'){e.preventDefault();e.stopPropagation();close();return;}
    if(e.key!=='Tab')return;
    const focusable=[...dialog.querySelectorAll('button:not(:disabled),textarea,a[href]')].filter(el=>el.getClientRects().length);
    const first=focusable[0],last=focusable.at(-1);
    if(!focusable.includes(document.activeElement)){e.preventDefault();(e.shiftKey?last:first).focus();}
    else if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  };
  document.addEventListener('keydown',trap,{signal});
  find('feedback-close').onclick=close;find('feedback-later').onclick=close;
  const home=dialog.querySelector('.home-button');
  function sending(value){
    busy=value;input.readOnly=value;find('feedback-form').setAttribute('aria-busy',String(value));
    find('feedback-close').disabled=value;find('feedback-later').disabled=value;
    if(value){home.removeAttribute('href');home.setAttribute('aria-disabled','true');}
    else{home.href=homeUrl;home.removeAttribute('aria-disabled');}
    submit.textContent=value?'Mengirim…':'Kirim tanggapan';update();
  }
  find('feedback-form').onsubmit=async e=>{
    e.preventDefault();const comment=input.value.trim();
    if(busy||comment===sentText)return;
    if(!comment){input.setCustomValidity('Tuliskan tanggapan sebelum mengirim.');input.reportValidity();return;}
    if(comment.length>limit){status.textContent=`Tanggapan maksimal ${limit} karakter.`;return;}
    try{localStorage.setItem(draftKey,comment);draftAvailable=true;}catch{draftAvailable=false;}
    const controller=new AbortController(),cancel=()=>controller.abort();
    const timeout=setTimeout(cancel,12000);signal.addEventListener('abort',cancel,{once:true});
    sending(true);status.textContent='Sedang mengirim tanggapan…';
    try{
      if(!feedback?.url||!feedback.anonKey||!feedback.table)throw new Error('configuration');
      const response=await fetch(`${feedback.url.replace(/\/$/,'')}/rest/v1/${encodeURIComponent(feedback.table)}`,{
        method:'POST',headers:{apikey:feedback.anonKey,Authorization:`Bearer ${feedback.anonKey}`,'Content-Type':'application/json',Prefer:'return=minimal'},
        body:JSON.stringify({[feedback.commentColumn||'komentar']:comment}),signal:controller.signal
      });
      if(!response.ok){
        status.textContent=(response.status===401||response.status===403?'Pengiriman belum diizinkan. Hubungi pengelola atau coba lagi nanti.':'Tanggapan belum terkirim. Silakan coba lagi nanti.')+(draftAvailable?' Draf tetap tersimpan di perangkat ini.':' Salin teks sebelum meninggalkan halaman.');
        return;
      }
      sentText=comment;
      try{localStorage.setItem(storageKey,JSON.stringify({version:2,game:'Cahaya Kadiri',comment,sentAt:new Date().toISOString()}));localStorage.removeItem(draftKey);}catch{/* Server receipt is authoritative, even without local storage. */}
      status.textContent='Terima kasih! Tanggapanmu berhasil dikirim ke pengelola.';
      find('feedback-later').textContent='Selesai';
    }catch{
      status.textContent='Pengiriman belum dapat dipastikan. Periksa koneksi sebelum mencoba lagi.'+(draftAvailable?' Draf tetap tersimpan di perangkat ini.':' Salin teks sebelum meninggalkan halaman.');
    }finally{clearTimeout(timeout);signal.removeEventListener('abort',cancel);sending(false);}
  };
  update();
  // Focus the heading area first so a phone keyboard does not hide the popup.
  dialog.tabIndex=-1;dialog.focus({preventScroll:true});
}
