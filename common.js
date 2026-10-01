/* Enlaces compartidos. Cada sección conserva su propio módulo de datos. */
(() => {
  'use strict';
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

  // Una cabecera consistente: los accesos principales llevan a las secciones del inicio.
  const mainNav=document.querySelector('.main-nav');
  if(mainNav){
    const page=location.pathname.split('/').pop()||'index.html';
    const inServices=['servicios.html','tienda.html'].includes(page)||['vuelos','hoteles'].includes(document.body.dataset.page);
    mainNav.innerHTML=[['index.html','Inicio'],['viajes.html?pantalla=destinos','Destinos'],['servicios.html','Servicios']].map(([url,label])=>`<a href="${url}" ${(url==='servicios.html'?inServices:url.split('?')[0]===page&&!inServices)?'aria-current="page"':''}>${label}</a>`).join('');
  }
  const header=document.querySelector('.header-inner');
  if(header&&!header.querySelector('a[href="servicios.html?seccion=mi-viaje"]')){const trip=document.createElement('a');trip.className='button button-outline';trip.href='servicios.html?seccion=mi-viaje';trip.textContent='Mi viaje ↗';header.append(trip);}
  if(header){
    const accounts=document.createElement('div');accounts.className='account-actions';
    [['login-button','Iniciar sesión','iniciar-sesion'],['register-button','Registrarse','registro']].forEach(([className,label,route])=>{
      const link=header.querySelector('.'+className)||document.createElement('a');
      link.className=className+' account-link';link.textContent=label;link.href=route+'.html';
      if(location.pathname.endsWith('/'+route+'.html'))link.setAttribute('aria-current','page');
      accounts.append(link);
    });
    header.append(accounts);
    const trip=header.querySelector('a[href="servicios.html?seccion=mi-viaje"]');
    trip.className='header-trip';
    if(new URLSearchParams(location.search).get('seccion')==='mi-viaje')trip.setAttribute('aria-current','page');
    const actions=header.querySelector('.header-actions')||document.createElement('div');
    actions.className='header-actions';
    actions.prepend(trip);actions.append(accounts);header.append(actions);
    const icons = {
      trip: '<rect x="4" y="7" width="16" height="14" rx="3"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M8 11v6m8-6v6"/>',
      login: '<circle cx="12" cy="8" r="4"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/>',
      register: '<path d="M5 12h14m-6-6 6 6-6 6"/>'
    };
    const icon = key => '<svg class="header-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+icons[key]+'</svg>';
    trip.innerHTML=icon('trip')+'<span>Mi viaje</span>';
    accounts.querySelector('.login-button').innerHTML=icon('login')+'<span>Iniciar sesión</span>';
    accounts.querySelector('.register-button').innerHTML='<span>Registrarse</span>'+icon('register');
    header.querySelector('.logo').href='index.html';
  }
  if(document.getElementById('servicios')){
    const grid=document.querySelector('.booking-grid');
    const order=['flights','stays','transfers','insurance','experiences','shop'];
    const names=['Vuelo','Hospedaje','Transporte','Seguro','Experiencias','Tienda'];
    const cards=[...grid.children];
    order.forEach((key,i)=>{const card=cards.find(c=>c.querySelector('[data-module="'+key+'"]')||c.classList.contains(({transfers:'none',insurance:'none',experiences:'none',shop:'shop-card'})[key]||'none')||c.querySelector('a[href="'+({transfers:'servicios.html?seccion=traslados',insurance:'servicios.html?seccion=seguros',experiences:'servicios.html?seccion=guias'})[key]+'"]'));
      if(!card)return;grid.append(card);
      // En Inicio, estas tarjetas conservan el diseño con iconos.
      const label=document.createElement('p');label.className='journey-card-number';label.textContent='0'+(i+1)+' / '+names[i]+(i>1?' · opcional':'');card.prepend(label);
      const link=card.querySelector('a,button');if(link){card.tabIndex=0;card.setAttribute('role','link');card.setAttribute('aria-label','Organizar '+names[i]);card.addEventListener('click',e=>{if(!e.target.closest('a,button'))link.click();});card.addEventListener('keydown',e=>{if(e.target===card&&e.key==='Enter'){e.preventDefault();link.click();}});}
    });
  }
  document.addEventListener('click',event=>{const a=event.target.closest('a');if(a?.textContent.includes('Continuar solo con hotel'))window.RumboJourney.skipFlight();},true);
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

