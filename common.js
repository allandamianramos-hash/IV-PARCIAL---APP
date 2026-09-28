/* Enlaces compartidos. Cada sección conserva su propio módulo de datos. */
(() => {
  'use strict';
  const routes={login:'perfil',register:'perfil',experiences:'guias',transfers:'traslados',insurance:'seguros',faq:'ayuda',support:'ayuda',changes:'cambios',about:'acerca',team:'equipo',privacy:'privacidad',terms:'terminos'};
  document.querySelectorAll('[data-module]').forEach(button=>{
    const key=button.dataset.module;
    const href=key==='cart'?'tienda.html?carrito=1':key==='shop'?'tienda.html':routes[key]?`servicios.html?seccion=${routes[key]}`:null;
    if(!href)return;
    const link=document.createElement('a');link.className=button.className;link.innerHTML=button.innerHTML;link.href=href;
    if(button.hasAttribute('aria-label'))link.setAttribute('aria-label',button.getAttribute('aria-label'));
    if(key==='login')link.innerHTML='<span>Mi perfil</span>';
    if(key==='register')link.textContent='Mi viaje';
    if(key==='register')link.href='servicios.html?seccion=mi-viaje';
    button.replaceWith(link);
  });
  if(document.querySelector('.rv-page')){
    const nav=document.querySelector('.main-nav');
    nav.querySelectorAll('[data-nav="vuelos"], [data-nav="hoteles"]').forEach(a=>a.remove());
    const shop=nav.querySelector('[href="tienda.html"]');shop.textContent='Tienda';
    const link=document.createElement('a');link.href='servicios.html';link.textContent='Servicios';nav.insertBefore(link,shop);
    if(['vuelos','hoteles'].includes(document.body.dataset.page))link.setAttribute('aria-current','page');
    const trip=document.querySelector('.rv-my-trip');trip.removeAttribute('data-context');trip.removeAttribute('data-path');trip.href='servicios.html?seccion=mi-viaje';
  }
  document.querySelectorAll('[data-module="flights"], [data-module="stays"]').forEach(button=>button.removeAttribute('aria-haspopup'));
  if(!document.getElementById('chat-launcher')){
    const link=document.createElement('a');link.className='global-rumbito';link.href='index.html#hablar-rumbito';link.innerHTML='<span aria-hidden="true">✦</span> Pregúntale a Rumbito';document.body.append(link);
  }
})();
