/* El mismo pie en inicio, destinos, servicios y tienda. Conserva los créditos. */
(() => {
  const footer = document.querySelector('body > .site-footer, body > .rv-footer, body > .services-footer');
  if (!footer) return;
  const credits = footer.querySelector('.hero-photo-credits');
  const contacts = footer.querySelectorAll('.footer-column details');
  const icons = {
    Instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none"/>',
    Facebook: '<path d="M14 21v-8h3l.5-4H14V7c0-1 .3-2 2-2h2V1.5A24 24 0 0 0 15 1c-3 0-5 2-5 5v3H7v4h3v8"/>',
    WhatsApp: '<path d="m3 21 1.4-5A9 9 0 1 1 8 20Z"/><path d="M8 7c-1 1-1 3 2 6s5 3 6 2l1-2-3-1-1 1c-1-.5-2.5-2-3-3l1-1-1-2Z"/>',
    TikTok: '<path d="M14 3v12.5a4.5 4.5 0 1 1-4-4.5v3a1.5 1.5 0 1 0 1 1.5V3h3c.5 3 2 4.5 5 5v3a9 9 0 0 1-5-2"/>'
  };
  const socials = [
    ['Instagram','https://www.instagram.com/rumbo_icfj/'],
    ['Facebook','https://www.facebook.com/profile.php?id=61595191139443'],
    ['WhatsApp','https://wa.me/50496767669'],
    ['TikTok','https://www.tiktok.com/@rumbo_icfj']
  ].map(([name,url]) => `<a href="${url}" target="_blank" rel="noopener noreferrer" aria-label="${name}" title="${name}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]}</svg></a>`).join('');
  footer.className = 'site-footer rumbo-footer';
  footer.id = 'contacto';
  footer.innerHTML = `<div class="container rumbo-footer-main">
    <div class="rumbo-footer-brand"><a class="logo" href="index.html" aria-label="Rumbo, inicio">rumbo<span aria-hidden="true">↗</span></a><p>Tu próximo destino empieza<br>con una buena idea.</p><span class="rumbo-footer-origin">Hecho en Honduras</span><nav class="rumbo-socials" aria-label="Redes sociales de Rumbo">${socials}</nav></div>
    <nav class="rumbo-footer-column" aria-label="Explorar Rumbo"><h2>Explorá</h2><a href="viajes.html?pantalla=destinos">Destinos</a><a href="servicios.html">Servicios</a><a href="servicios.html?seccion=guias">Guías de viaje</a><a href="tienda.html">Tienda de viaje</a><a href="index.html#quienes-somos">Quiénes somos</a><a href="index.html#nuestro-equipo">Nuestro equipo</a></nav>
    <nav class="rumbo-footer-column" aria-label="Ayuda e información"><h2>Te acompañamos</h2><a href="servicios.html?seccion=mi-viaje">Mi viaje</a><a href="servicios.html?seccion=ayuda">Centro de ayuda</a><a href="servicios.html?seccion=historial">Historial de compras</a><a href="servicios.html?seccion=cancelaciones">Cambios y cancelaciones</a><button type="button" data-open-help>Consultar a Rumbito <span aria-hidden="true">↗</span></button></nav>
    <div class="rumbo-footer-column rumbo-footer-contact"><h2>Hablemos</h2><p>Estamos a un mensaje de distancia.</p><a class="rumbo-contact-link" href="https://wa.me/50496767669" target="_blank" rel="noopener noreferrer">Escribinos por WhatsApp <span aria-hidden="true">↗</span></a><a href="tel:+50496767669">+504 9676-7669</a><div class="rumbo-footer-team"></div></div>
  </div><div class="container rumbo-footer-bottom"><p>© <span id="year">${new Date().getFullYear()}</span> Rumbo · Honduras</p><nav aria-label="Información legal"><a href="servicios.html?seccion=privacidad">Privacidad</a><a href="servicios.html?seccion=terminos">Términos y condiciones</a><a href="servicios.html?seccion=cookies">Cookies</a><a href="servicios.html?seccion=cancelaciones">Cambios y cancelaciones</a><a href="servicios.html?seccion=legal">Información legal</a><button type="button" data-cookie-settings>Preferencias de cookies</button></nav><a href="#" class="rumbo-back-top">Ir al inicio de la página</a></div>`;
  footer.querySelector('.rumbo-footer-team').append(...contacts);
  if (credits) footer.append(credits);
})();

/* Enlaces compartidos. Cada sección conserva su propio módulo de datos. */
(() => {
  'use strict';
  // Cada entrada del historial conserva su posición, incluso cuando la caché
  // de navegación se recarga para sincronizar la cuenta y la base de datos.
  if ('scrollRestoration' in history) history.scrollRestoration='auto';
  const positionKey='rumboView';
  const previousView=history.state?.[positionKey];
  const navigationType=performance.getEntriesByType('navigation')[0]?.type;
  let restoring=false, cancelRestore=()=>{};
  const filterSelector='#destination-filters input, #destination-filters select, #orden-destinos, #hotel-filters input, #hotel-filters select, #hotel-sort, #flight-sort, #guide-form input, #guide-form select, #guide-sort, #product-search, #product-sort';
  const remember=()=>{
    if(restoring)return;
    const filters=Array.from(document.querySelectorAll(filterSelector),node=>({id:node.id,value:node.value,checked:node.checked})).filter(item=>item.id);
    const details=Array.from(document.querySelectorAll('main details'),(node,index)=>node.open?index:-1).filter(index=>index>=0);
    const guideFilter=document.querySelector('[data-guide-filter][aria-pressed="true"]')?.dataset.guideFilter;
    const productCategory=document.querySelector('.filter-btn[aria-pressed="true"]')?.dataset.category;
    try{history.replaceState({...history.state,[positionKey]:{x:scrollX,y:scrollY,filters,details,guideFilter,productCategory}},'');}catch(_){/* Navegación local o almacenamiento restringido. */}
  };
  window.addEventListener('pagehide',remember);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')remember();});
  window.addEventListener('pageshow',event=>{
    if(event.persisted||!previousView||!['back_forward','reload'].includes(navigationType))return;
    restoring=true;
    for(const item of previousView.filters||[]){
      const node=document.getElementById(item.id);
      if(!node?.matches(filterSelector))continue;
      node.value=item.value;
      if(node.type==='checkbox'||node.type==='radio')node.checked=item.checked;
    }
    // Renderizar una sola vez cada grupo, después de recuperar sus valores.
    for(const selector of ['#guide-form','#destination-filters','#hotel-filters','#orden-destinos','#hotel-sort','#flight-sort','#guide-sort','#product-sort']){
      const node=document.querySelector(selector);
      node?.dispatchEvent(new Event(node.tagName==='FORM'?'input':'change',{bubbles:true}));
    }
    const selectedFilter=Array.from(document.querySelectorAll('[data-guide-filter]')).find(node=>node.dataset.guideFilter===previousView.guideFilter);
    selectedFilter?.click();
    const selectedCategory=Array.from(document.querySelectorAll('.filter-btn')).find(node=>node.dataset.category===previousView.productCategory);
    selectedCategory?.click();
    document.querySelectorAll('main details').forEach((node,index)=>{node.open=(previousView.details||[]).includes(index);});
    let frame,observer,timer;
    const restore=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>window.scrollTo({left:previousView.x,top:previousView.y,behavior:'instant'}));};
    cancelRestore=()=>{cancelAnimationFrame(frame);observer?.disconnect();clearTimeout(timer);restoring=false;};
    // Fuentes, imágenes y la cabecera pueden terminar de ajustar el diseño.
    observer=new ResizeObserver(restore);observer.observe(document.body);
    restore();document.fonts?.ready.then(()=>{if(restoring)restore();});
    timer=setTimeout(cancelRestore,2500);
  });
  // Nunca luchar contra una nueva acción del usuario.
  for(const type of ['wheel','touchstart','pointerdown','keydown'])window.addEventListener(type,()=>cancelRestore(),{passive:true});
  if(document.querySelector('.services-main,.store-hero') || document.querySelector('.rv-page')) document.body.classList.add('rumbo-services');
  const routes={login:'iniciar-sesion',register:'registro',experiences:'guias',transfers:'traslados',insurance:'seguros',faq:'ayuda',support:'ayuda',changes:'cambios',about:'acerca',team:'equipo',privacy:'privacidad',terms:'terminos'};
  document.querySelectorAll('[data-module]').forEach(button=>{
    const key=button.dataset.module;
    const href=key==='team'?'index.html#nuestro-equipo':key==='about'?'index.html#quienes-somos':key==='cart'?'tienda.html?carrito=1':key==='shop'?'tienda.html':routes[key]?`servicios.html?seccion=${routes[key]}`:null;
    if(!href)return;
    const link=document.createElement('a');link.className=button.className;link.innerHTML=button.innerHTML;link.href=href;
    if(button.hasAttribute('aria-label'))link.setAttribute('aria-label',button.getAttribute('aria-label'));
    button.replaceWith(link);
  });
  if(document.querySelector('.rv-page')){
    const trip=document.querySelector('.rv-my-trip');trip.removeAttribute('data-context');trip.removeAttribute('data-path');trip.href='servicios.html?seccion=mi-viaje';
  }
  document.querySelectorAll('[data-module="flights"], [data-module="stays"]').forEach(button=>button.removeAttribute('aria-haspopup'));

  if(document.getElementById('servicios')){
    const grid=document.querySelector('.booking-grid');
    const order=['flights','stays','transfers','insurance','experiences'];
    const names=['Vuelo','Hospedaje','Transporte','Seguro','Experiencias'];
    const cards=[...grid.children];
    order.forEach((key,i)=>{const card=cards.find(c=>c.querySelector('[data-module="'+key+'"]')||c.classList.contains(({transfers:'none',insurance:'none',experiences:'none'})[key]||'none')||c.querySelector('a[href="'+({transfers:'servicios.html?seccion=traslados',insurance:'servicios.html?seccion=seguros',experiences:'servicios.html?seccion=guias'})[key]+'"]'));
      if(!card)return;grid.append(card);
      // En Inicio, estas tarjetas conservan el diseño con iconos.
      const label=document.createElement('p');label.className='journey-card-number';label.textContent='0'+(i+1);card.prepend(label);
      const link=card.querySelector('a,button');if(link){card.tabIndex=0;card.setAttribute('role','link');card.setAttribute('aria-label','Organizar '+names[i]);card.addEventListener('click',e=>{if(!e.target.closest('a,button'))link.click();});card.addEventListener('keydown',e=>{if(e.target===card&&e.key==='Enter'){e.preventDefault();link.click();}});}
    });
  }
  document.addEventListener('click',event=>{const a=event.target.closest('a');if(a?.matches('[data-skip-flight]'))window.RumboJourney.skipFlight();},true);
  window.RumboJourney?.mountSteps();
})();





/* Local postcard composition, using the same destination catalog as the site. */
(()=>{
 const form=document.querySelector('#postcard-form');if(!form)return;
 const canvas=document.querySelector('#postcard-canvas'),ctx=canvas.getContext('2d'),download=document.querySelector('#postcard-download'),status=document.querySelector('#postcard-status');
 const place=form.elements.place,message=document.querySelector('#postcard-message'),to=document.querySelector('#postcard-to'),from=document.querySelector('#postcard-from');
 const handwriting='"Rumbo Postal", "Segoe UI", sans-serif';
 const postalFont=new FontFace('Rumbo Postal','url("fonts/Kalam-Regular.ttf")');
 document.fonts.add(postalFont);
 const postalFontReady=postalFont.load().catch(()=>null);
 const destinations=[...(window.RumboViajesDatos?.destinations||[])].sort((a,b)=>a.name.localeCompare(b.name,'es'));
 const catalog=new Map(destinations.map(destination=>[destination.id,destination]));
 for(const destination of destinations){const option=document.createElement('option');option.value=destination.id;option.textContent=destination.name+' · '+destination.country;place.append(option);}
 if(!destinations.length){status.textContent='No se pudieron cargar los destinos.';return;}
 place.value=catalog.has('venecia')?'venecia':destinations[0].id;
 let photo=null,current=catalog.get(place.value),request=0;
 const clean=value=>value.replace(/[\u0000-\u0009\u000b-\u001f\u202a-\u202e\u2066-\u2069]/g,' ').trim();
 const translate=text=>window.RumboLocale?.translate(text)||text;
 function lines(text,width){
  const result=[];
  for(const paragraph of text.split('\n')){
   let line='';
   for(const word of paragraph.split(/\s+/)){
    const candidate=line?line+' '+word:word;
    if(ctx.measureText(candidate).width<=width){line=candidate;continue;}
    if(line)result.push(line);
    line='';
    for(const char of Array.from(word)){if(ctx.measureText(line+char).width>width){result.push(line);line='';}line+=char;}
   }
   result.push(line);
  }
  return result;
 }
 function fit(text,size,width,family){while(size>18){ctx.font=size+'px '+family;if(ctx.measureText(text).width<=width)break;size--;}}
 function draw(){
  const text=clean(message.value),recipient=clean(to.value),sender=clean(from.value);
  canvas.setAttribute('aria-label','Postal de '+current.name+(text?'. '+text:'')+(recipient?'. Para: '+recipient:'')+(sender?'. De: '+sender:''));
  ctx.clearRect(0,0,canvas.width,canvas.height);if(!photo)return;
  const w=canvas.width,h=canvas.height,inset=24,pw=w-inset*2,ph=h-inset*2,scale=Math.max(pw/photo.naturalWidth,ph/photo.naturalHeight);
  ctx.save();
  // The rounded matte and inset frame are part of the downloaded invitation too.
  ctx.fillStyle='#181b1e';ctx.beginPath();ctx.roundRect(0,0,w,h,64);ctx.fill();
  ctx.beginPath();ctx.roundRect(inset,inset,pw,ph,44);ctx.clip();
  ctx.drawImage(photo,(w-photo.naturalWidth*scale)/2,(h-photo.naturalHeight*scale)/2,photo.naturalWidth*scale,photo.naturalHeight*scale);
  // Neutral shading keeps the photograph visible and handwritten copy readable.
  const shade=ctx.createLinearGradient(0,0,0,h);
  shade.addColorStop(0,'rgba(0,0,0,.48)');shade.addColorStop(.38,'rgba(0,0,0,0)');shade.addColorStop(1,text||recipient||sender?'rgba(0,0,0,.78)':'rgba(0,0,0,.08)');
  ctx.fillStyle=shade;ctx.fillRect(0,0,w,h);
  ctx.strokeStyle='rgba(240,242,238,.32)';ctx.lineWidth=2;
  ctx.beginPath();ctx.roundRect(54,54,w-108,h-108,26);ctx.stroke();
  // A personal letter, with a tiny heart seal and soft postal cancellation lines.
  ctx.save();ctx.translate(w-142,150);ctx.rotate(.1);
  ctx.lineWidth=2;ctx.lineCap='round';ctx.lineJoin='round';
  ctx.strokeStyle='rgba(240,242,238,.6)';
  for(const y of [-14,0,14]){
   ctx.beginPath();ctx.moveTo(-124,y);
   ctx.bezierCurveTo(-106,y-12,-88,y+12,-70,y);
   ctx.bezierCurveTo(-58,y-8,-48,y-8,-36,y);ctx.stroke();
  }
  ctx.fillStyle='rgba(24,27,30,.82)';ctx.strokeStyle='rgba(240,242,238,.72)';
  ctx.beginPath();ctx.roundRect(-44,-56,88,112,8);ctx.fill();
  ctx.setLineDash([2,6]);ctx.stroke();ctx.setLineDash([]);
  ctx.strokeStyle='rgba(240,242,238,.25)';ctx.beginPath();ctx.roundRect(-35,-47,70,94,4);ctx.stroke();
  ctx.strokeStyle='#f0f2ee';ctx.lineWidth=2.5;
  ctx.beginPath();ctx.roundRect(-24,-15,48,34,3);ctx.stroke();
  ctx.beginPath();ctx.moveTo(-23,-13);ctx.lineTo(0,4);ctx.lineTo(23,-13);
  ctx.moveTo(-23,17);ctx.lineTo(-9,3);ctx.moveTo(23,17);ctx.lineTo(9,3);ctx.stroke();
  ctx.fillStyle='#b8d86b';ctx.beginPath();ctx.moveTo(0,10);
  ctx.bezierCurveTo(-22,-4,-9,-16,0,-6);ctx.bezierCurveTo(9,-16,22,-4,0,10);ctx.fill();ctx.restore();
  ctx.fillStyle='#fff';ctx.shadowColor='rgba(0,0,0,.3)';ctx.shadowBlur=6;ctx.shadowOffsetY=2;
  fit(current.name,104,w-390,handwriting);ctx.fillText(current.name,100,172);
  ctx.font='24px Inter, sans-serif';ctx.fillText(current.country,104,224);
  if(text){
   let size=62,wrapped;
   do{ctx.font=size+'px '+handwriting;wrapped=lines(text,w-200);if(wrapped.length<=5)break;size-=2;}while(size>=30);
   // Limit blank lines, while keeping the full message and long words within the photo.
   if(wrapped.length>5){wrapped=lines(text.replace(/\s+/g,' '),w-200);}
   const lineHeight=size*1.3,bottom=recipient||sender?h-210:h-110;
   wrapped.forEach((line,index)=>ctx.fillText(line,100,bottom-(wrapped.length-1-index)*lineHeight));
  }
  if(recipient||sender){ctx.shadowBlur=0;ctx.strokeStyle='rgba(240,242,238,.35)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(100,h-164);ctx.lineTo(w-100,h-164);ctx.stroke();}
  if(recipient){fit(translate('Para')+' '+recipient,36,650,handwriting);ctx.fillText(translate('Para')+' '+recipient,100,h-108);}
  if(sender){const signature=translate('De')+' '+sender;fit(signature,36,650,handwriting);ctx.textAlign='right';ctx.fillText(signature,w-100,h-108);}
  ctx.restore();
 }
 function load(){
  const id=++request;current=catalog.get(place.value);photo=null;download.disabled=true;canvas.setAttribute('aria-busy','true');status.textContent='Cargando foto…';draw();
  const image=new Image();
  image.onload=async()=>{await postalFontReady;if(id!==request)return;photo=image;draw();download.disabled=false;canvas.setAttribute('aria-busy','false');status.textContent='';};
  image.onerror=()=>{if(id!==request)return;canvas.setAttribute('aria-busy','false');status.textContent='No se pudo cargar la foto. Elegí otro destino.';};
  image.src=current.image;
 }
 place.addEventListener('change',load);
 form.addEventListener('input',event=>{if(event.target!==place)draw();});
 form.addEventListener('submit',event=>{
  event.preventDefault();if(!photo||download.disabled)return;
  download.disabled=true;const selected=current.id,revision=request;
  canvas.toBlob(blob=>{
   if(revision===request)download.disabled=!photo;
   if(!blob){if(revision===request)status.textContent='No se pudo crear la imagen. Intentá de nuevo.';return;}
   const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='rumbo-postal-'+selected+'.png';link.click();setTimeout(()=>URL.revokeObjectURL(url),30000);
   if(revision===request)status.textContent='Postal descargada.';
  },'image/png');
 });
 load();document.fonts?.ready.then(draw);window.addEventListener('rumbo:localechange',draw);
})();
