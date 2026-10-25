function createStoryPresentation({ui,modal,story,dialogues,sceneId,signal,onTextSound=()=>{}}){
  const root=document.createElement('div');root.id='story-stage';root.setAttribute('aria-hidden','true');
  root.innerHTML='<div class="story-pictures"></div><div class="story-shade"></div><div class="story-caption"><span></span><small></small></div>';
  ui.append(root);
  const pictures=root.querySelector('.story-pictures'),caption=root.querySelector('.story-caption');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const easing='cubic-bezier(.4,0,.2,1)',duration=ms=>reduced.matches?0:ms;
  let request=0,current='',wanted='',hideTimer=0,curtainTimer=0,visible=false,portraitId='',portraitSide='none';
  let closingDialog=null;
  let textRun=null,textFrame=0;
  const segmenter=typeof Intl.Segmenter==='function'?new Intl.Segmenter('id',{granularity:'grapheme'}):null;
  function stopText(){cancelAnimationFrame(textFrame);textFrame=0;textRun=null;}
  function textButton(){
    if(!textRun)return;
    const revealing=textRun.count<textRun.glyphs.length,label=revealing?'Tampilkan teks':textRun.last?'Selesai':'Lanjut →';
    if(textRun.next.textContent!==label)textRun.next.textContent=label;
    if(textRun.copy.dataset.revealing!==String(revealing))textRun.copy.dataset.revealing=String(revealing);
  }
  function finishText(){
    if(!textRun||textRun.count===textRun.glyphs.length)return false;
    cancelAnimationFrame(textFrame);textFrame=0;
    for(const {node}of textRun.glyphs)node.classList.add('is-revealed');
    textRun.count=textRun.glyphs.length;textButton();return true;
  }
  function revealFrame(now){
    textFrame=0;const run=textRun;if(!run||signal.aborted||!visible)return;
    const dt=Math.min(64,now-run.stamp);run.stamp=now;
    // Do not catch up with a burst of text/sound when returning from another tab.
    if(!document.hidden&&!run.copy.closest('[inert]')){
      run.budget+=dt;let voiced=false;
      while(run.count<run.glyphs.length&&run.budget>=run.wait){
        run.budget-=run.wait;const glyph=run.glyphs[run.count++];glyph.node.classList.add('is-revealed');
        voiced=voiced||/[\p{L}\p{N}]/u.test(glyph.char);
        run.wait=/[.!?…]/u.test(glyph.char)?240:/[,;:—]/u.test(glyph.char)?120:run.narration?30:26;
      }
      if(voiced)onTextSound(run.who);
      textButton();
    }
    if(run.count<run.glyphs.length)textFrame=requestAnimationFrame(revealFrame);
  }
  function revealText({copy,next,lines,index,text,who,opening}){
    // Toggling Auto updates controls without restarting the current sentence.
    if(textRun?.copy===copy&&textRun.lines===lines&&textRun.index===index&&textRun.text===text){textButton();return;}
    stopText();
    const accessible=document.createElement('span');accessible.className='dialog-full-text';accessible.textContent=text;
    const visual=document.createElement('span');visual.className='dialog-reveal';visual.setAttribute('aria-hidden','true');
    const glyphs=[];
    for(const word of text.split(/(\s+)/u)){
      if(!word)continue;if(/^\s+$/u.test(word)){visual.append(document.createTextNode(word));continue;}
      const group=document.createElement('span');group.className='dialog-word';
      const chars=segmenter?[...segmenter.segment(word)].map(s=>s.segment):Array.from(word);
      for(const char of chars){const node=document.createElement('span');node.className='dialog-glyph';node.textContent=char;group.append(node);glyphs.push({node,char});}
      visual.append(group);
    }
    copy.replaceChildren(accessible,visual);
    textRun={copy,next,lines,index,text,who,glyphs,count:0,last:index===lines.length-1,narration:/^(Narasi|Ingatan|Serat)/u.test(who),stamp:performance.now(),budget:0,wait:opening?260:90};
    textButton();
    if(reduced.matches)finishText();else if(glyphs.length)textFrame=requestAnimationFrame(revealFrame);
  }
  reduced.addEventListener('change',()=>{if(reduced.matches)finishText();},{signal});
  function clearPictures(){for(const image of pictures.children)image.getAnimations().forEach(a=>a.cancel());pictures.replaceChildren();root.classList.remove('has-picture');current='';}
  function removeClosingDialog(){closingDialog?.remove();closingDialog=null;}
  function releaseCurtain(){
    const curtain=document.getElementById('scene-curtain');if(!curtain||curtain.dataset.releasing)return;
    curtain.dataset.releasing='true';
    const opacity=getComputedStyle(curtain).opacity;curtain.getAnimations().forEach(a=>a.cancel());
    // The scene is ready underneath the curtain; avoid multiplying two fades.
    root.getAnimations().forEach(a=>a.finish());
    const animation=curtain.animate([{opacity},{opacity:0}],{duration:duration(800),easing,fill:'forwards'});
    animation.finished.then(()=>curtain.remove()).catch(()=>{});
  }
  if(document.getElementById('scene-curtain'))curtainTimer=setTimeout(releaseCurtain,2500);
  function cue(lines,index){
    const line=lines[index],flash=Object.entries(dialogues.flashbacks).find(([,text])=>lines[0][1]===text||line[1]===text);
    if(flash&&(/^(Ingatan|Serat) /.test(line[0])))return 'serat-'+flash[0].toLowerCase();
    const key=Object.keys(story.sequences).find(key=>dialogues[key]?.[0]?.[0]===lines[0][0]&&dialogues[key]?.[0]?.[1]===lines[0][1]);
    const sequence=story.sequences[key]||[[0,story.chapters[sceneId]]];
    return sequence.filter(([at])=>at<=index).at(-1)?.[1]||story.chapters[sceneId];
  }
  function picture(id){
    if(wanted===id)return;wanted=id;const token=++request,asset=story.assets[id];
    if(!asset)return;
    // Reopening the same illustration reverses the stage fade without reloading it.
    if(current===id&&pictures.children.length===1)return;
    const image=new Image();image.alt='';image.decoding='async';image.className='story-image';image.src=asset.url;
    // Loading is intentionally lazy. A failed illustration never traps dialogue.
    image.decode().then(()=>{
      if(signal.aborted||token!==request||!visible)return;
      const previous=pictures.lastElementChild;
      pictures.append(image);image.classList.add('is-current');
      // Keep the old plate opaque beneath the incoming fade, including rapid Next.
      if(previous){
        const fade=image.animate([{opacity:0},{opacity:1}],{duration:duration(900),easing});
        fade.finished.then(()=>{if(token===request&&visible)for(const old of [...pictures.children])if(old!==image){old.getAnimations().forEach(a=>a.cancel());old.remove();}}).catch(()=>{});
      }
      current=id;root.dataset.art=id;caption.querySelector('span').textContent=asset.title;
      caption.querySelector('small').textContent=id.startsWith('serat-')?'KILAS BALIK CANDRA KIRANA':'THE JOURNEY OF KIRANA : AWAKENING FORGOTTEN LEGENDS';
      root.classList.add('has-picture');clearTimeout(curtainTimer);releaseCurtain();
    }).catch(()=>{if(token===request){if(!current)root.classList.remove('has-picture');releaseCurtain();}});
  }
  function render({lines,index,text,auto,age,onNext,onSkip,onAuto}){
    const opening=!visible,openingOpacity=closingDialog?getComputedStyle(closingDialog).opacity:0;
    visible=true;clearTimeout(hideTimer);removeClosingDialog();ui.classList.add('dialog-active');root.classList.add('is-open');modal.classList.add('story-dialog-modal');
    if(!modal.querySelector('.story-dialog'))modal.innerHTML='<section class="dialog story-dialog" aria-label="Percakapan"><aside class="speaker-portrait"><img alt=""></aside><div class="dialog-content"><span class="eyebrow speaker-name"></span><p class="dialog-copy"></p><div class="dialog-controls"><button id="skip-dialog">Lewati</button><button id="auto-dialog">Auto</button><span class="dialog-progress"></span><button id="next-dialog" class="next">Lanjut →</button></div></div></section>';
    const box=modal.querySelector('.story-dialog'),who=lines[index][0],portrait=story.portraits[who];
    if(opening){box.getAnimations().forEach(a=>a.cancel());box.animate([{opacity:openingOpacity},{opacity:1}],{duration:duration(600),easing});}
    portraitSide=portrait?(who==='Kirana'?'right':'left'):'none';
    box.dataset.speaker=who;box.dataset.side=portraitSide;box.classList.toggle('ghost-speaker',who==='Bayang Galuh');
    const aside=box.querySelector('.speaker-portrait'),img=aside.querySelector('img');aside.hidden=!portrait;
    if(portrait&&portraitId!==portrait){portraitId=portrait;img.getAnimations().forEach(a=>a.cancel());img.src=story.assets[portrait].url;img.animate([{opacity:0},{opacity:who==='Bayang Galuh'?.75:1}],{duration:duration(450),easing});}
    if(portrait)img.alt='Potret '+who;
    box.querySelector('.speaker-name').textContent=who;
    box.querySelector('.dialog-progress').textContent=`${index+1} / ${lines.length}`;
    const skip=box.querySelector('#skip-dialog'),next=box.querySelector('#next-dialog'),toggle=box.querySelector('#auto-dialog');
    skip.disabled=age<2;skip.onclick=onSkip;next.onclick=onNext;
    revealText({copy:box.querySelector('.dialog-copy'),next,lines,index,text,who,opening});
    toggle.textContent=auto?'Auto aktif':'Auto';toggle.setAttribute('aria-pressed',String(auto));toggle.onclick=onAuto;
    picture(cue(lines,index));
    // Only the immediate next illustration is prefetched, never the whole story.
    if(index+1<lines.length){const nextId=cue(lines,index+1);if(nextId!==wanted&&story.assets[nextId]){const preload=new Image();preload.src=story.assets[nextId].url;}}
  }
  function hide(){
    if(!visible)return;
    stopText();
    // The modal may be hidden/replaced immediately by the runtime. Fade a purely
    // visual copy without duplicate IDs, interactive controls or screen-reader text.
    const box=modal.querySelector('.story-dialog');
    if(box&&!reduced.matches){
      removeClosingDialog();closingDialog=document.createElement('div');closingDialog.className='story-dialog-exit';closingDialog.setAttribute('aria-hidden','true');closingDialog.inert=true;
      const copy=box.cloneNode(true);copy.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));closingDialog.append(copy);ui.append(closingDialog);
      closingDialog.animate([{opacity:getComputedStyle(box).opacity},{opacity:0}],{duration:duration(600),easing,fill:'forwards'});
    }
    visible=false;++request;wanted='';portraitId='';ui.classList.remove('dialog-active');root.classList.remove('is-open');modal.classList.remove('story-dialog-modal');
    hideTimer=setTimeout(()=>{if(!visible){clearPictures();removeClosingDialog();}},duration(760));
  }
  function decorateChoice(who){
    const portrait=story.portraits[who],panel=modal.querySelector('.panel');if(!portrait||!panel)return;
    visible=true;clearTimeout(hideTimer);removeClosingDialog();ui.classList.add('dialog-active');root.classList.add('is-open');
    picture(story.chapters[sceneId]);
    const header=document.createElement('div');header.className='choice-speaker';
    const img=new Image();img.src=story.assets[portrait].url;img.alt='Potret '+who;
    const heading=panel.querySelector('h2');panel.insertBefore(header,heading);header.append(img,heading);panel.classList.add('character-choice');
  }
  function transitionOut(){
    document.getElementById('scene-curtain')?.remove();
    const curtain=document.createElement('div');curtain.id='scene-curtain';document.body.append(curtain);
    const ms=duration(650);
    curtain.animate([{opacity:0},{opacity:1}],{duration:ms,easing,fill:'forwards'});
    return ms;
  }
  signal.addEventListener('abort',()=>{++request;stopText();clearTimeout(hideTimer);clearTimeout(curtainTimer);clearPictures();removeClosingDialog();root.remove();},{once:true});
  return {render,hide,decorateChoice,transitionOut,finishText,isRevealing:()=>!!textRun&&textRun.count<textRun.glyphs.length,snapshot:()=>({visible,art:current,pendingArt:wanted,side:portraitSide,images:pictures.children.length,text:textRun?{revealed:textRun.count,total:textRun.glyphs.length,complete:textRun.count===textRun.glyphs.length}:null})};
}
