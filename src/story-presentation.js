function createStoryPresentation({ui,modal,story,dialogues,sceneId,signal}){
  const root=document.createElement('div');root.id='story-stage';root.setAttribute('aria-hidden','true');
  root.innerHTML='<div class="story-pictures"></div><div class="story-shade"></div><div class="story-caption"><span></span><small></small></div>';
  ui.append(root);
  const pictures=root.querySelector('.story-pictures'),caption=root.querySelector('.story-caption');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const easing='cubic-bezier(.4,0,.2,1)',duration=ms=>reduced.matches?0:ms;
  let request=0,current='',wanted='',hideTimer=0,curtainTimer=0,visible=false,portraitId='',portraitSide='none';
  let closingDialog=null;
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
      caption.querySelector('small').textContent=id.startsWith('serat-')?'KILAS BALIK CANDRA KIRANA':'CAHAYA KADIRI';
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
    box.querySelector('.speaker-name').textContent=who;box.querySelector('.dialog-copy').textContent=text;
    box.querySelector('.dialog-progress').textContent=`${index+1} / ${lines.length}`;
    const skip=box.querySelector('#skip-dialog'),next=box.querySelector('#next-dialog'),toggle=box.querySelector('#auto-dialog');
    skip.disabled=age<2;skip.onclick=onSkip;next.textContent=index===lines.length-1?'Selesai':'Lanjut →';next.onclick=onNext;
    toggle.textContent=auto?'Auto aktif':'Auto';toggle.setAttribute('aria-pressed',String(auto));toggle.onclick=onAuto;
    picture(cue(lines,index));
    // Only the immediate next illustration is prefetched, never the whole story.
    if(index+1<lines.length){const nextId=cue(lines,index+1);if(nextId!==wanted&&story.assets[nextId]){const preload=new Image();preload.src=story.assets[nextId].url;}}
  }
  function hide(){
    if(!visible)return;
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
  signal.addEventListener('abort',()=>{++request;clearTimeout(hideTimer);clearTimeout(curtainTimer);clearPictures();removeClosingDialog();root.remove();},{once:true});
  return {render,hide,decorateChoice,transitionOut,snapshot:()=>({visible,art:current,pendingArt:wanted,side:portraitSide,images:pictures.children.length})};
}
