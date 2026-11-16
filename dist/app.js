const imageDialog=document.getElementById('image-dialog');
const expandedImage=document.getElementById('dialog-image');
const imageTitle=document.getElementById('image-dialog-title');
const ytFrame=(video,title)=>{if(!/^[a-zA-Z0-9_-]{11}$/.test(video))return null;const frame=document.createElement('iframe');frame.src='https://www.youtube-nocookie.com/embed/'+video+'?autoplay=1';frame.title=title;frame.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';return frame;};
const httpsUrl=value=>{try{const url=new URL(value);return url.protocol==='https:'?url.href:'';}catch(error){return '';}};
const previewPath=value=>typeof value==='string'&&/^assets\/[a-z0-9/_-]+\.html$/i.test(value)?value:'';
document.querySelectorAll('[data-gallery]').forEach(gallery=>{
 const media=JSON.parse(gallery.dataset.media),stage=gallery.querySelector('.gallery-stage'),caption=gallery.querySelector('.gallery-caption');
 const fitWebsite=()=>stage.style.setProperty('--site-scale',String(stage.clientWidth/1440));fitWebsite();new ResizeObserver(fitWebsite).observe(stage);
 const render=(index)=>{
  stage.querySelectorAll('video').forEach(v=>v.pause());const item=media[index];stage.replaceChildren();stage.dataset.source=item.src;stage.dataset.kind=item.kind;stage.dataset.fit=item.fit||'cover';
  gallery.querySelectorAll('[data-media-index]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.mediaIndex)===index)));
  caption.textContent=item.caption;
  if(item.kind==='image'){
   const button=document.createElement('button');button.type='button';button.className='image-open';button.setAttribute('aria-label',item.title+' vergrößern');
   const image=document.createElement('img');image.className='gallery-main';image.src=item.src;image.alt=item.title;
   const expand=document.createElement('span');expand.className='expand-icon';expand.setAttribute('aria-hidden','true');expand.textContent='⤢';button.append(image,expand);
   button.addEventListener('click',()=>{expandedImage.src=item.src;expandedImage.alt=item.title;imageTitle.textContent=item.title;imageDialog.showModal();});stage.append(button);
  }else if(item.kind==='video'){
   const preview=document.createElement('div');preview.className='inline-video-preview';
   const poster=document.createElement('img');poster.src=item.src;poster.alt='Videovorschau: '+item.title;preview.append(poster);
   const content=document.createElement('div');content.className='video-overlay';const name=document.createElement('b');name.textContent=item.title;content.append(name);
   const play=document.createElement('button');play.type='button';play.className='gallery-play';play.textContent='▶ Video hier abspielen';
   play.addEventListener('click',()=>{const frame=ytFrame(item.video,item.title);if(!frame){caption.textContent='Dieses Video kann hier nicht eingebettet werden.';return;}stage.replaceChildren(frame);if(location.protocol==='file:'){const note=document.createElement('p');note.className='local-player-note';note.textContent='Lokale Datei: YouTube kann die Wiedergabe mit Fehler 153 blockieren. Der eingebettete Player benötigt eine Website-Adresse.';stage.append(note);}});
   content.append(play);const hint=document.createElement('small');hint.textContent=item.length+' · Beim Abspielen wird YouTube geladen';content.append(hint);preview.append(content);stage.append(preview);
  }else if(item.kind==='website'){
   const safeUrl=httpsUrl(item.url);if(!safeUrl){caption.textContent='Diese Vorschau ist nicht verfügbar.';return;}
   const link=document.createElement('a');link.className='website-preview';link.href=safeUrl;link.target='_blank';link.rel='noopener noreferrer';
   const bar=document.createElement('div');bar.className='browser-bar';const dots=document.createElement('span');dots.setAttribute('aria-hidden','true');dots.textContent='● ● ●';const domain=document.createElement('span');domain.textContent=item.domain;bar.append(dots,domain);
   const body=document.createElement('div');body.className='website-preview-body';const image=document.createElement('img');image.src=item.src;image.alt=item.title;body.append(image);const preview=previewPath(item.previewSrc);if(preview){const viewport=document.createElement('div');viewport.className='live-site-viewport';const frame=document.createElement('iframe');frame.src=preview;frame.setAttribute('sandbox','allow-same-origin');frame.title='Website-Vorschau: '+item.siteTitle;frame.loading='lazy';frame.tabIndex=-1;frame.setAttribute('aria-hidden','true');viewport.append(frame);body.append(viewport);}
   const text=document.createElement('div');text.className='website-preview-title';const title=document.createElement('b');title.textContent=item.siteTitle;const action=document.createElement('span');action.textContent='Website ansehen ↗';text.append(title,action);body.append(text);link.append(bar,body);stage.append(link);
  }
 };
 gallery.querySelectorAll('.media-website').forEach(button=>{const item=media[Number(button.dataset.mediaIndex)];const preview=item&&previewPath(item.previewSrc);if(!preview)return;const frame=document.createElement('iframe');frame.src=preview;frame.title='';frame.tabIndex=-1;frame.setAttribute('aria-hidden','true');frame.setAttribute('sandbox','allow-same-origin');frame.className='site-thumb-frame';button.querySelector('img')?.remove();button.prepend(frame);const fit=()=>button.style.setProperty('--thumb-scale',String(button.clientWidth/1440));new ResizeObserver(fit).observe(button);fit();});
 gallery.querySelectorAll('[data-media-index]').forEach(button=>button.addEventListener('click',()=>render(Number(button.dataset.mediaIndex))));render(0);
});
imageDialog.querySelector('.dialog-close').addEventListener('click',()=>imageDialog.close());
imageDialog.addEventListener('click',e=>{if(e.target===imageDialog){const r=imageDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)imageDialog.close();}});
document.addEventListener('click',e=>{const a=e.target.closest('[data-goal]');if(a)document.getElementById('goal').value=a.dataset.goal;});
document.getElementById('contact-form').addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.target);const body=`Hallo Phil,\n\nName: ${f.get('name')}\nMein Vorhaben: ${f.get('goal')}\n\n${f.get('message')}\n\nViele Grüße\n${f.get('name')}`;window.location.href='mailto:info@phil-splash.de?subject='+encodeURIComponent('SPLASH: Mein Vorhaben gemeinsam umsetzen')+'&body='+encodeURIComponent(body);document.getElementById('form-status').textContent='Dein Mailprogramm sollte sich öffnen. Alternativ direkt an info@phil-splash.de schreiben.';});
