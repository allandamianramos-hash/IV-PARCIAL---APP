/* Shared navigation; account rendering remains owned by js/cuenta/auth-client.js. */
(() => {
  'use strict';
  const currentFile=location.pathname.split('/').pop()||'index.html';
  const currentSection=new URLSearchParams(location.search).get('seccion')||'servicios';
  const travelView=document.body.dataset.page;
  if(['vuelos','hoteles'].includes(travelView)||currentFile==='tienda.html'||(currentFile==='servicios.html'&&['servicios','traslados','seguros','guias','mi-viaje'].includes(currentSection)))document.body.classList.add('booking-page');
  // Una cabecera consistente: los accesos principales llevan a las secciones del inicio.
  const revealCurrentStep=()=>requestAnimationFrame(()=>{
    const list=document.querySelector('.booking-page .journey-progress ol'),active=list?.querySelector('[aria-current]');
    if(!list||!active||list.scrollWidth<=list.clientWidth)return;
    const outer=list.getBoundingClientRect(),item=active.getBoundingClientRect();
    list.scrollBy({left:item.left-outer.left-(outer.width-item.width)/2,behavior:'instant'});
  });
  window.addEventListener('pageshow',revealCurrentStep);
  window.addEventListener('rumbo:localechange',revealCurrentStep);
  // Keep the actual selection controls in one place. On small screens the
  // same summary opens in a modal; no cloned controls or second booking state.
  const main=document.querySelector('main');
  if(document.body.classList.contains('booking-page')&&main){
    const mobile=matchMedia('(max-width:850px)');
    const summarySelector='.rv-trip-summary,.service-summary,.guide-summary,.journey-checkout';
    let panel,summary,anchor,dock,queued=false;
    const setText=(node,value)=>{if(node.textContent!==value)node.textContent=value;};
    const closePanel=()=>{if(panel?.open)panel.close();};
    const restore=()=>{
      closePanel();
      if(summary?.isConnected&&anchor?.isConnected)anchor.replaceWith(summary);
      panel?.remove();dock?.remove();
      panel=summary=anchor=dock=null;
      document.body.classList.remove('has-mobile-selection','selection-open');
    };
    const refresh=()=>{
      queued=false;
      if(!mobile.matches){restore();return;}
      if(summary&&!summary.isConnected)restore();
      const next=main.querySelector(summarySelector);
      if(!next)return;
      if(!panel){
        summary=next;
        anchor=document.createComment('Desktop selection position');
        summary.before(anchor);
        panel=document.createElement('dialog');
        panel.id='mobile-selection-panel';panel.className='mobile-selection-panel';
        panel.setAttribute('aria-labelledby','mobile-selection-title');
        panel.innerHTML='<header class="mobile-selection-header"><h2 id="mobile-selection-title">Tu selección</h2><button type="button" class="mobile-selection-close" aria-label="Cerrar resumen" autofocus>×</button></header>';
        anchor.after(panel);panel.append(summary);
        dock=document.createElement('button');
        dock.type='button';dock.className='mobile-selection-dock';
        dock.setAttribute('aria-haspopup','dialog');dock.setAttribute('aria-controls',panel.id);dock.setAttribute('aria-expanded','false');
        dock.innerHTML='<span class="mobile-selection-copy"><span>Tu selección</span><strong class="mobile-selection-amount" translate="no" aria-live="polite" aria-atomic="true"></strong></span><span class="mobile-selection-action">Revisar el resumen <span aria-hidden="true">↑</span></span>';
        main.append(dock);
        dock.addEventListener('click',()=>{
          document.querySelector('.site-mobile-menu')?.removeAttribute('open');
          panel.showModal();panel.scrollTop=0;
          dock.setAttribute('aria-expanded','true');document.body.classList.add('selection-open');
        });
        panel.querySelector('.mobile-selection-close').addEventListener('click',closePanel);
        panel.addEventListener('click',event=>{
          const bounds=panel.getBoundingClientRect();
          if(event.target===panel&&(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom))closePanel();
        });
        panel.addEventListener('close',event=>{
          if(event.currentTarget!==panel)return;
          document.body.classList.remove('selection-open');
          if(dock?.isConnected){dock.setAttribute('aria-expanded','false');if(mobile.matches)dock.focus({preventScroll:true});}
        });
        document.body.classList.add('has-mobile-selection');
      }
      const total=summary.querySelector('#summary-total,.service-total,.guide-price-breakdown strong')||(summary.matches('.journey-checkout')?summary.querySelector('h2'):null);
      const amount=total?.textContent.trim()||'—';
      setText(dock.querySelector('.mobile-selection-amount'),amount);
    };
    const schedule=()=>{if(!queued){queued=true;requestAnimationFrame(refresh);}};
    new MutationObserver(records=>{
      if(records.some(record=>!(record.target.nodeType===1?record.target:record.target.parentElement)?.closest('.mobile-selection-dock,.mobile-selection-header')))schedule();
    }).observe(main,{childList:true,subtree:true,characterData:true});
    mobile.addEventListener('change',schedule);
    window.addEventListener('rumbo:localechange',schedule);
    // Experience cards link to their summary; open it without losing scroll.
    main.addEventListener('click',event=>{
      if(mobile.matches&&panel&&event.target.closest('a[href="#guide-summary-title"]')){
        event.preventDefault();dock.click();
      }
    });
    schedule();
  }
  const mainNav=document.querySelector('.main-nav');
  if(mainNav){
    const page=location.pathname.split('/').pop()||'index.html';
    const inServices=page==='servicios.html'||['vuelos','hoteles'].includes(document.body.dataset.page);
    mainNav.innerHTML=[['index.html','Inicio'],['viajes.html?pantalla=destinos','Destinos'],['servicios.html','Servicios'],['tienda.html','Tienda']].map(([url,label])=>`<a href="${url}" ${(url==='servicios.html'?inServices:url.split('?')[0]===page&&!inServices)?'aria-current="page"':''}>${label}</a>`).join('');
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
