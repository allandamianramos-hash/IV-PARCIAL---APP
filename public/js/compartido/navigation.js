/* Shared navigation; account rendering remains owned by js/cuenta/auth-client.js. */
(() => {
  'use strict';
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

  if(header){
    const menu=document.createElement('details');menu.className='site-mobile-menu';
    menu.innerHTML='<summary aria-label="Menú" aria-controls="mobile-navigation"><svg class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path class="menu-lines" d="M4 6h16M4 12h16M4 18h16"/><path class="menu-close" d="m6 6 12 12M18 6 6 18"/></svg></summary><nav id="mobile-navigation" aria-label="Navegación móvil">'+mainNav.innerHTML+'<a href="servicios.html?seccion=mi-viaje">Mi viaje</a><a href="iniciar-sesion.html" data-mobile-login>Iniciar sesión</a><a href="registro.html" data-mobile-register>Registrarse</a></nav>';
    header.querySelector('.header-actions').before(menu);
    const updateLogin=()=>{const loggedIn=!!header.querySelector('.account-menu');menu.querySelector('[data-mobile-login]').hidden=loggedIn;menu.querySelector('[data-mobile-register]').hidden=loggedIn;};
    updateLogin();new MutationObserver(updateLogin).observe(header.querySelector('.account-actions'),{childList:true});
    menu.addEventListener('click',event=>{if(event.target.closest('a'))menu.open=false;});
    document.addEventListener('click',event=>{if(!menu.contains(event.target))menu.open=false;});
    document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.open){menu.open=false;menu.querySelector('summary').focus();}});
  }
})();
