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
    const order=['flights','stays','transfers','insurance','experiences','shop'];
    const names=['Vuelo','Hospedaje','Transporte','Seguro','Experiencias','Tienda'];
    const cards=[...grid.children];
    order.forEach((key,i)=>{const card=cards.find(c=>c.querySelector('[data-module="'+key+'"]')||c.classList.contains(({transfers:'none',insurance:'none',experiences:'none',shop:'shop-card'})[key]||'none')||c.querySelector('a[href="'+({transfers:'servicios.html?seccion=traslados',insurance:'servicios.html?seccion=seguros',experiences:'servicios.html?seccion=guias'})[key]+'"]'));
      if(!card)return;grid.append(card);
      // En Inicio, estas tarjetas conservan el diseño con iconos.
      const label=document.createElement('p');label.className='journey-card-number';label.textContent='0'+(i+1);card.prepend(label);
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

