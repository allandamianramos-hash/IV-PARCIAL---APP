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
    <nav class="rumbo-footer-column" aria-label="Ayuda e información"><h2>Te acompañamos</h2><a href="servicios.html?seccion=mi-viaje">Mi viaje</a><a href="servicios.html?seccion=ayuda">Centro de ayuda</a><a href="servicios.html?seccion=cambios">Cambios y cancelaciones</a><button type="button" data-open-help>Consultar a Rumbito <span aria-hidden="true">↗</span></button></nav>
    <div class="rumbo-footer-column rumbo-footer-contact"><h2>Hablemos</h2><p>Estamos a un mensaje de distancia.</p><a class="rumbo-contact-link" href="https://wa.me/50496767669" target="_blank" rel="noopener noreferrer">Escribinos por WhatsApp <span aria-hidden="true">↗</span></a><a href="tel:+50496767669">+504 9676-7669</a><div class="rumbo-footer-team"></div></div>
  </div><div class="container rumbo-footer-bottom"><p>© <span id="year">${new Date().getFullYear()}</span> Rumbo · Honduras</p><nav aria-label="Información legal"><a href="servicios.html?seccion=privacidad">Privacidad</a><a href="servicios.html?seccion=terminos">Términos y condiciones</a><a href="servicios.html?seccion=legal">Información legal</a></nav><a href="#" class="rumbo-back-top">Ir al inicio de la página</a></div>`;
  footer.querySelector('.rumbo-footer-team').append(...contacts);
  if (credits) footer.append(credits);
})();

/* Enlaces compartidos. Cada sección conserva su propio módulo de datos. */
(() => {
  'use strict';
  // Preserve explicit anchors, but start every section at its cover.
  if ('scrollRestoration' in history) history.scrollRestoration='manual';
  window.addEventListener('pageshow',()=>{if(!location.hash)window.scrollTo({top:0,left:0,behavior:'instant'});});
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
  const checks=[...document.querySelectorAll('[data-departure]')];
  if(checks.length){
    let saved=[];try{saved=JSON.parse((window.RumboStorage || localStorage).getItem('rumbo.departureChecklist.v1')||'[]');}catch{}
    checks.forEach(c=>c.checked=Array.isArray(saved)&&saved.includes(c.dataset.departure));
    const show=()=>{const count=checks.filter(c=>c.checked).length;document.querySelector('#departure-progress').textContent=count===4?'4 de 4 preparativos completados':count+' de 4 preparativos listos';document.querySelector('#departure-meter').value=count;document.querySelector('#departure-reset').hidden=count===0;};
    const save=()=>{show();try{(window.RumboStorage || localStorage).setItem('rumbo.departureChecklist.v1',JSON.stringify(checks.filter(c=>c.checked).map(c=>c.dataset.departure)));}catch{document.querySelector('#departure-progress').textContent+=' · No se pudo guardar en este navegador.';}};
    checks.forEach(c=>c.addEventListener('change',save));document.querySelector('#departure-reset').addEventListener('click',()=>{checks.forEach(c=>c.checked=false);save();checks[0].focus();});show();
  }
  window.RumboJourney?.mountSteps();
})();

