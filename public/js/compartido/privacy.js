(()=>{
  'use strict';
  const key='rumbo.consent.v1',version='2026-10-17',duration=180*24*60*60*1000;
  let config={analyticsEnabled:false},consent=null,dialog,banner,sent=false;
  try{const value=JSON.parse(localStorage.getItem(key));if(value?.version===version&&Number.isFinite(value.at)&&value.at<=Date.now()&&Date.now()-value.at<duration&&typeof value.analytics==='boolean')consent=value;}catch{}
  const tracked=()=>{
    const file=location.pathname.split('/').pop()||'index.html',params=new URLSearchParams(location.search);
    if(file==='servicios.html'){const section=params.get('seccion')||'servicios';return ['servicios','traslados','seguros','guias','privacidad','terminos','cookies','cancelaciones','legal'].includes(section)?'servicios:'+section:null;}
    if(file==='viajes.html'){const view=params.get('pantalla')||'destinos';return ['destinos','detalle-destino','vuelos','hoteles'].includes(view)?'viajes:'+view:null;}
    return ['index.html','tienda.html'].includes(file)?file:null;
  };
  function analytics(){
    const page=tracked();if(sent||!config.analyticsEnabled||!consent?.analytics||!page||navigator.globalPrivacyControl===true||navigator.doNotTrack==='1')return;
    sent=true;fetch('/api/analytics',{method:'POST',credentials:'omit',headers:{'Content-Type':'application/json'},body:JSON.stringify({page,consent:true}),keepalive:true}).catch(()=>{});
  }
  function save(analyticsAllowed){
    const next={version,at:Date.now(),analytics:config.analyticsEnabled&&analyticsAllowed};
    try{localStorage.setItem(key,JSON.stringify(next));}catch{dialog.querySelector('[role=status]').textContent='No se pudieron guardar tus preferencias en este navegador.';return;}
    consent=next;banner.hidden=true;dialog.close();analytics();window.dispatchEvent(new Event('rumbo:consentchange'));
  }
  function show(){dialog.querySelector('#analytics-consent').checked=consent?.analytics===true;dialog.querySelector('[role=status]').textContent='';dialog.showModal();}
  function mount(){
    if(document.getElementById('cookie-preferences'))return;
    dialog=document.createElement('dialog');dialog.id='cookie-preferences';dialog.className='cookie-dialog';dialog.setAttribute('aria-labelledby','cookie-title');
    dialog.innerHTML='<header><h2 id="cookie-title">Preferencias de privacidad</h2><button type="button" data-close aria-label="Cerrar preferencias">×</button></header><p>Las cookies necesarias permiten iniciar sesión y guardar tus selecciones. No utilizamos cookies publicitarias.</p><p><strong>Necesarias · Siempre activas</strong><br>Sesión, seguridad, carrito, idioma y preferencias de privacidad.</p><label class="cookie-option"><input type="checkbox" id="analytics-consent"><span><strong>Analítica opcional</strong><small>Contar visitas por página y día, sin guardar tu identidad, mensajes, compras ni parámetros de la dirección.</small></span></label><p data-analytics-info></p><p><a href="servicios.html?seccion=cookies">Leer la política de cookies</a> · <a href="servicios.html?seccion=privacidad">Privacidad</a></p><p role="status"></p><div class="cookie-actions"><button type="button" data-reject>Solo necesarias</button><button type="button" data-save>Guardar preferencias</button></div>';
    banner=document.createElement('section');banner.className='cookie-banner';banner.setAttribute('aria-label','Privacidad y cookies');banner.hidden=!!consent;
    banner.innerHTML='<p>Usamos almacenamiento necesario para tu sesión y selecciones. Solo con tu permiso contamos visitas anónimas para mejorar Rumbo. Puedes cambiar tu decisión cuando quieras.</p><div class="cookie-actions"><button type="button" data-reject>Solo necesarias</button><button type="button" data-accept hidden>Aceptar analítica</button><button type="button" data-settings>Configurar</button></div>';
    document.body.append(dialog,banner);
    const authFooter=document.querySelector('.auth-footer-links');
    if(authFooter&&!authFooter.querySelector('[data-cookie-settings]')){const button=document.createElement('button');button.type='button';button.dataset.cookieSettings='';button.textContent='Preferencias de cookies';authFooter.append(button);}
    dialog.querySelector('[data-close]').onclick=()=>dialog.close();dialog.querySelector('[data-reject]').onclick=()=>save(false);dialog.querySelector('[data-save]').onclick=()=>save(dialog.querySelector('#analytics-consent').checked);
    banner.querySelector('[data-reject]').onclick=()=>save(false);banner.querySelector('[data-accept]').onclick=()=>save(true);banner.querySelector('[data-settings]').onclick=show;
    document.addEventListener('click',event=>{if(event.target.closest('[data-cookie-settings]'))show();});
    fetch('/api/site-config',{credentials:'omit',cache:'no-store'}).then(r=>r.ok?r.json():{}).then(value=>{
      config=value;const enabled=config.analyticsEnabled===true;dialog.querySelector('#analytics-consent').disabled=!enabled;banner.querySelector('[data-accept]').hidden=!enabled;
      dialog.querySelector('[data-analytics-info]').textContent=enabled?'Puedes retirar tu permiso desde el pie de cualquier página.':'La analítica está desactivada en este sitio.';analytics();
    }).catch(()=>{banner.querySelector('[data-accept]').hidden=true;dialog.querySelector('#analytics-consent').disabled=true;});
  }
  window.addEventListener('storage',event=>{if(event.key===key){try{consent=JSON.parse(event.newValue);}catch{consent=null;}if(banner)banner.hidden=!!consent;}});
  window.RumboPrivacy={open:show};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();
