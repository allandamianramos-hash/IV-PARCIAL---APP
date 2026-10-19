/* One demonstration checkout for services and shop; receipts live on the server. */
(()=>{
  'use strict';
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const money=n=>'HNL '+Number(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
  const t=s=>window.RumboLocale?.translate(s)||s;
  const historyUrl='servicios.html?seccion=historial';
  async function api(url,body){
    const response=await fetch(url,{method:body?'POST':'GET',credentials:'same-origin',cache:'no-store',headers:body?{'Content-Type':'application/json'}:{},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(30000)});
    const data=await response.json();if(!response.ok)throw new Error(data.error||'No se pudo completar la operación. Inténtalo de nuevo.');return data;
  }
  const itemsHtml=items=>items.map(i=>`<li><div><strong>${esc(i.title)}</strong><p>${esc(i.label)}${i.quantity?' · '+i.quantity+' × '+money(i.unit):''}</p><p>${esc(i.detail)}</p></div><strong translate="no">${money(i.total)}</strong></li>`).join('');
  function download(order){
    const lines=['RUMBO · '+t('Comprobante'),order.code,new Date(order.date).toLocaleString(document.documentElement.lang||'es'),order.title,...order.items.map(i=>`${i.title}\n${i.detail}${i.quantity?'\n'+i.quantity+' × '+money(i.unit):''}\n${money(i.total)}`),t('Total')+': '+money(order.total),t('Operación de demostración; no se realiza ningún cobro.'),t('No es una reserva, póliza, factura ni confirmación de envío.')];
    const url=URL.createObjectURL(new Blob(['\uFEFF'+lines.join('\n\n')],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=order.code+'.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);
  }
  let active=false;
  async function open({kind,onSuccess}){
    if(active)return;active=true;
    const previous=document.activeElement,dialog=document.createElement('dialog');dialog.className='rumbo-checkout';dialog.id='rumbo-checkout';dialog.setAttribute('aria-labelledby','demo-payment-title');
    dialog.innerHTML='<header><div><p class="eyebrow">RUMBO</p><h2 id="demo-payment-title">Pago</h2></div><button type="button" data-close aria-label="Cerrar pago">×</button></header><div data-payment-body><p role="status">Preparando el pago…</p></div>';
    document.body.append(dialog);dialog.showModal();
    let busy=false;const content=dialog.querySelector('[data-payment-body]'),close=dialog.querySelector('[data-close]');
    close.onclick=()=>{if(!busy)dialog.close();};dialog.addEventListener('cancel',e=>{if(busy)e.preventDefault();});
    dialog.addEventListener('close',()=>{dialog.remove();active=false;if(previous?.isConnected)previous.focus({preventScroll:true});});
    if(!window.RumboDatabase?.user){content.innerHTML='<p>Inicia sesión para guardar tus compras y consultarlas desde cualquier dispositivo.</p><a class="button button-primary" href="iniciar-sesion.html?returnTo='+encodeURIComponent(location.pathname.slice(1)+location.search)+'">Iniciar sesión</a>';return;}
    try{
      if(await window.RumboStorage?.flush?.({navigateOnError:false})===false)throw Error('No se pudieron guardar tus selecciones. Revisa la conexión e inténtalo de nuevo.');
      const {quote}=await api('/api/checkout?kind='+kind);if(!dialog.open)return;
      content.innerHTML=`<ol class="payment-steps" aria-label="Etapas del pago"><li>1. Revisar</li><li>2. Confirmar</li><li>3. Comprobante</li></ol><h3>${esc(quote.title)}</h3><ul class="receipt-items">${itemsHtml(quote.items)}</ul><div class="payment-total"><span>Total</span><strong translate="no">${money(quote.total)}</strong></div><label class="payment-consent"><input type="checkbox" id="payment-consent"><span>He revisado mi selección y acepto los <a href="servicios.html?seccion=terminos" target="_blank" rel="noopener">términos y condiciones</a>.</span></label><p class="payment-disclosure" id="payment-disclosure">Operación de demostración; no se realiza ningún cobro.</p><p role="status" aria-live="polite" id="payment-status"></p><button type="button" id="confirm-payment" class="button button-primary" aria-describedby="payment-disclosure">Confirmar pago</button>`;
      const button=content.querySelector('#confirm-payment'),status=content.querySelector('#payment-status'),consent=content.querySelector('#payment-consent');
      button.onclick=async()=>{
        if(busy)return;
        if(!consent.checked){status.textContent='Revisa tu selección y acepta los términos y condiciones.';consent.focus();return;}
        busy=true;button.disabled=close.disabled=consent.disabled=true;dialog.setAttribute('aria-busy','true');status.textContent='Procesando…';
        let order;
        try{
          ({order}=await api('/api/checkout',{kind,fingerprint:quote.fingerprint}));
        }catch(error){status.textContent=error.message;}
        finally{busy=false;button.disabled=close.disabled=consent.disabled=false;dialog.removeAttribute('aria-busy');}
        if(!order)return;
        let synchronized=true;
        try{await onSuccess?.(order);synchronized=await window.RumboStorage?.flush?.({navigateOnError:false})!==false;}catch{synchronized=false;}
        content.innerHTML=`<div class="payment-success"><p class="eyebrow">COMPLETADO</p><h3>Pago realizado correctamente</h3><p class="payment-disclosure">Operación de demostración; no se realiza ningún cobro.</p><p class="receipt-code" translate="no">${esc(order.code)}</p><strong translate="no">${money(order.total)}</strong>${synchronized?'':'<p role="status">El comprobante está guardado. No se pudo actualizar la selección local; recarga antes de comprar de nuevo.</p>'}<div class="receipt-actions"><button type="button" class="button button-outline" data-download>Descargar comprobante</button><a class="button button-primary" href="${historyUrl}">Ver historial</a></div></div>`;
        content.querySelector('[data-download]').onclick=()=>download(order);content.querySelector('h3').tabIndex=-1;content.querySelector('h3').focus();
      };
    }catch(error){if(dialog.open)content.innerHTML='<p role="alert">'+esc(error.message)+'</p><p>Cierra esta ventana y vuelve a intentarlo.</p>';}
  }
  async function renderHistory(root){
    root.classList.add('history-page');
    root.innerHTML='<header class="account-history-heading"><p class="eyebrow">MI CUENTA</p><h1>Historial de viajes y compras</h1><p>Consulta tus viajes, servicios y productos.</p><a href="servicios.html?seccion=mi-viaje" class="text-link">Organizar mi viaje actual ↗</a></header>';
    if(!window.RumboDatabase?.user){root.insertAdjacentHTML('beforeend','<section class="history-empty"><h2>Tu historial te espera</h2><p>Inicia sesión para ver las compras de tu cuenta.</p><a class="button button-primary" href="iniciar-sesion.html?returnTo='+encodeURIComponent(historyUrl)+'">Iniciar sesión</a></section>');return;}
    root.insertAdjacentHTML('beforeend','<div class="history-filters" role="group" aria-label="Filtrar compras"><button data-kind="all" aria-pressed="true">Todo</button><button data-kind="trip" aria-pressed="false">Viajes y servicios</button><button data-kind="store" aria-pressed="false">Tienda</button></div><p class="history-status" role="status" aria-live="polite"></p><div class="history-list"></div><button type="button" class="button button-outline" data-more hidden>Cargar más</button>');
    let kind='all',next=null,request=0,loading=false;const list=root.querySelector('.history-list'),status=root.querySelector('.history-status'),more=root.querySelector('[data-more]');
    async function load(append=false){
      const serial=++request;loading=true;more.disabled=true;status.textContent='Cargando historial…';if(!append){list.replaceChildren();more.hidden=true;}
      try{
        const data=await api('/api/orders?kind='+kind+(append&&next?'&before='+encodeURIComponent(next):''));if(serial!==request)return;
        for(const order of data.orders){
          const article=document.createElement('article');article.className='history-order';
          article.innerHTML=`<header><div><p class="eyebrow">${order.kind==='trip'?'VIAJE Y SERVICIOS':'TIENDA'}</p><h2>${esc(order.title)}</h2><time datetime="${esc(order.date)}" translate="no">${esc(new Date(order.date).toLocaleString(document.documentElement.lang||'es'))}</time></div><strong translate="no">${money(order.total)}</strong></header><p class="receipt-code" translate="no">${esc(order.code)}</p>${order.trip?`<p>${esc(order.trip.start)} → ${esc(order.trip.end)} · ${esc(order.trip.travelers)} <span>${order.trip.travelers===1?'viajero':'viajeros'}</span></p>`:''}<p class="payment-disclosure">Operación de demostración; no se realiza ningún cobro.</p><details><summary>Ver detalle de la compra</summary><ul class="receipt-items">${itemsHtml(order.items)}</ul><p class="payment-disclosure">No es una reserva, póliza, factura ni confirmación de envío.</p></details><button type="button" class="text-link" data-download>Descargar comprobante</button>`;
          article.querySelector('[data-download]').onclick=()=>download(order);list.append(article);
        }
        if(!list.children.length)list.innerHTML='<section class="history-empty"><h2>Aún no hay compras</h2><p>Cuando completes una operación, encontrarás aquí su comprobante.</p><a href="servicios.html" class="text-link">Explorar servicios ↗</a></section>';
        next=data.next;more.hidden=!next;status.textContent='';
      }catch(error){if(serial!==request)return;status.textContent=error.message;more.textContent='Reintentar';more.hidden=false;}
      finally{if(serial===request){loading=false;more.disabled=false;}}
    }
    root.querySelectorAll('[data-kind]').forEach(button=>button.onclick=()=>{kind=button.dataset.kind;next=null;more.textContent='Cargar más';root.querySelectorAll('[data-kind]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));load();});
    more.onclick=()=>{if(!loading)load(!!next);};await load();
  }
  window.RumboCheckout={open,renderHistory,download};
})();
