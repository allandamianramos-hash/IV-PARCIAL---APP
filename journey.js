/* Recorrido compartido: una selección, un resumen y un cierre de demostración. */
(() => {
  'use strict';
  const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}};
  const write=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));return true;}catch{return false;}};
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const money=n=>'L '+Number(n).toLocaleString('es-HN',{minimumFractionDigits:2,maximumFractionDigits:2});
  const steps=[['vuelos','Vuelo','viajes.html?pantalla=vuelos'],['hoteles','Hospedaje','viajes.html?pantalla=hoteles'],['traslados','Transporte','servicios.html?seccion=traslados'],['seguros','Seguro','servicios.html?seccion=seguros'],['guias','Experiencias','servicios.html?seccion=guias'],['tienda','Tienda','tienda.html'],['mi-viaje','Resumen y pago','servicios.html?seccion=mi-viaje']];
  const tripKey='rumbo.integrante2.viaje.v1', receiptKey='rumbo.checkout.v1';
  const day=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
  const dateValid=d=>typeof d==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(d)&&!isNaN(Date.parse(d))&&new Date(d).toISOString().slice(0,10)===d;
  const integer=(n,min,max)=>Number.isInteger(n)&&n>=min&&n<=max;
  function snapshot(){
    const t=read(tripKey,{})||{}, catalog=window.RumboViajesDatos, items=[],issues=[];
    const d=catalog?.destinations.find(d=>d.id===t.destinationId), room=catalog?.rooms[t.roomType];
    const validPeople=integer(t.travelers,1,12), validDates=dateValid(t.date)&&t.date>=day()&&dateValid(t.checkIn)&&t.checkIn>=t.date;
    const flight=d&&catalog.origins.includes(t.origin)?catalog.flights(d,t.origin).find(f=>f.id===t.flightId):null;
    const hotel=d?.hotels.find(h=>h.id===t.hotelId);
    const omit=!flight&&read('rumbo.no-flight.v1','')===`${t.destinationId}|${t.date}|${t.origin}`;
    if(!d||!validPeople||!validDates)issues.push({label:'Define destino, fechas y viajeros',url:steps[0][2]});
    if(flight&&validPeople&&['economica','ejecutiva'].includes(t.cabin))items.push({key:'vuelos',label:'Vuelo de ida',title:`${t.origin} → ${d.arrival}`,detail:`${t.date} · ${flight.departure} · ${t.travelers} viajeros · ${t.cabin}`,total:(t.cabin==='ejecutiva'?flight.executive:flight.economy)*t.travelers,url:steps[0][2]});
    else if(!omit)issues.push({label:'Elige un vuelo o indica que no lo necesitas',url:steps[0][2]});
    if(hotel&&room&&validPeople&&integer(t.rooms,1,6)&&integer(t.nights,1,30)&&room.capacity*t.rooms>=t.travelers)items.push({key:'hoteles',label:'Hospedaje',title:hotel.name,detail:`${t.checkIn} · ${t.nights} noches · ${t.rooms} habitaciones · ${room.name}`,total:Math.round(hotel.rate*room.factor)*t.nights*t.rooms,url:steps[1][2]});
    else issues.push({label:'Elige tu hospedaje',url:steps[1][2]});
    let end=t.checkIn;
    if(dateValid(end)&&integer(t.nights,1,30)){const date=new Date(end+'T12:00:00Z');date.setUTCDate(date.getUTCDate()+t.nights);end=date.toISOString().slice(0,10);}
    const services=read('rumbo.services.v1',[]), seen=new Set();
    if(Array.isArray(services))for(const s of services){const step=steps.find(x=>x[0]===s?.section);if(!step||!['traslados','seguros','guias'].includes(s.section)||seen.has(s.section)||!Number.isFinite(s.total)||s.total<0)continue;seen.add(s.section);
      items.push({key:s.section,label:step[1],title:s.title,detail:s.detail,total:s.total,url:step[2]});
      const v=s.values||{};
      if(d&&((s.destinationId&&s.destinationId!==d.id)||(s.section==='guias'&&v.destination!==d.id)||(s.section==='traslados'&&v.route!==({roatan:'roatan',copan:'copan','la-ceiba':'ceiba'})[d.id])||Number(v.people)!==t.travelers||!dateValid(v.date)||v.date<t.date||v.date>end||(s.section==='seguros'&&(!dateValid(v.end)||v.end<end))))issues.push({label:`Ajusta ${step[1].toLowerCase()} a las fechas y viajeros de este viaje`,url:step[2]});
    }
    const cart=read('rumbo.store.cart.v2',[]), products=window.RumboProducts||[], used=new Set();
    if(Array.isArray(cart))for(const row of cart){const p=products.find(p=>p.id===row?.id);if(!p||!integer(row.quantity,1,99))continue;const price=window.RumboProductPrice?.(p,row.options)||p.price;const options=row.options&&typeof row.options==='object'?Object.entries(row.options).map(([key,value])=>`${key}: ${value}`).join(' · '):'';items.push({key:'tienda',label:'Tienda',title:p.name,detail:`${row.quantity} × ${money(price)}${options?' · '+options:''}`,total:price*row.quantity,url:'tienda.html?carrito=1'});}
    const total=items.reduce((sum,i)=>sum+i.total,0), signature=JSON.stringify({destination:d?.id,travelers:t.travelers,dates:[t.date,end],omit,items});
    const receipt=read(receiptKey,null), paid=receipt?.signature===signature&&issues.length===0&&receipt?.demo===true;
    return {t,d,items,issues,total,signature,paid,receipt,omit,end};
  }
  function skipFlight(){const t=read(tripKey,{})||{};return write('rumbo.no-flight.v1',`${t.destinationId}|${t.date}|${t.origin}`);}
  function renderSummary(root){
    const s=snapshot();
    root.innerHTML=`<section class="journey-heading"><p class="eyebrow">MI VIAJE · TODO EN UN SOLO LUGAR</p><h1>${s.paid?'Tu viaje de demostración está completo.':s.issues.length?'Tu viaje va tomando forma.':'Tu viaje está listo para pagar.'}</h1><p>${s.d?`${esc(s.d.name)} · ${esc(s.t.date)} al ${esc(s.end)} · ${esc(s.t.travelers)} viajeros`:'Empieza por el vuelo y el hospedaje. Después añade solo lo que necesitas.'}</p></section><div class="journey-overview"><section aria-label="Selecciones del viaje">${s.omit?'<p class="journey-notice">Has indicado que no necesitas vuelo.</p>':''}${s.items.map(i=>`<article class="journey-item"><div><small>${esc(i.label)}</small><h2>${esc(i.title)}</h2><p>${esc(i.detail)}</p><a href="${i.url}">Cambiar ${esc(i.label.toLowerCase())}</a>${["traslados","seguros","guias"].includes(i.key)?` <button class="journey-remove" data-remove-service="${i.key}">Quitar</button>`:""}</div><strong>${money(i.total)}</strong></article>`).join('')||'<p class="journey-notice">Aún no has seleccionado servicios.</p>'}${!s.paid?'<details class="journey-extras"><summary>Añadir servicios opcionales</summary><p>Transporte, seguro, experiencias y tienda se añaden solo si los necesitas.</p>'+steps.slice(2,6).map(x=>`<a href="${x[2]}">${x[1]} ↗</a>`).join('')+'</details>':''}</section><aside class="journey-checkout"><p class="eyebrow">${s.paid?'PAGO SIMULADO COMPLETADO':'RESUMEN FINAL'}</p><h2>${money(s.total)}</h2><p>Total de las opciones seleccionadas, en HNL.</p>${s.issues.length?`<h3>Falta completar</h3><ul>${s.issues.map(i=>`<li><a href="${i.url}">${esc(i.label)} →</a></li>`).join('')}</ul>`:s.paid?'':`<p>Vuelo y hospedaje definidos. No necesitas volver a seleccionarlos.</p><label class="journey-consent"><input id="demo-consent" type="checkbox"> Entiendo que es una demostración: no se cobra ni se reserva.</label><button id="complete-demo" class="button button-primary" type="button">Completar pago de demostración →</button>`}<p class="journey-note">No hay pasarela de pago conectada. Los precios y servicios son de ejemplo. No se solicitan datos bancarios; envío e impuestos reales no se calculan.</p><p id="journey-status" role="status"></p></aside></div>${s.paid?`<section class="journey-ticket" aria-labelledby="ticket-title"><div><p class="eyebrow">RUMBO ↗ · RECUERDO DE TU VIAJE</p><h2 id="ticket-title">${esc(s.d.name)}</h2><p>${esc(s.t.date)} → ${esc(s.end)} · ${esc(s.t.travelers)} viajeros</p><p>Referencia: ${esc(s.receipt.code)}</p><strong>Pago simulado completado · ${money(s.total)}</strong></div><div><button id="download-ticket" class="button button-primary">Descargar mi ticket ↓</button><p>DEMOSTRACIÓN · No válido para viajar.<br>No es un boleto, reserva ni comprobante bancario.</p></div></section>`:''}`;
    root.querySelector('#complete-demo')?.addEventListener('click',()=>{
      const now=snapshot(),message=root.querySelector('#journey-status');
      if(!root.querySelector('#demo-consent').checked){message.textContent='Marca la casilla para confirmar que deseas completar la demostración.';root.querySelector('#demo-consent').focus();return;}
      if(now.signature!==s.signature||now.issues.length){renderSummary(root);return;}
      if(!write(receiptKey,{signature:now.signature,demo:true,code:'RMB-DEMO-'+Date.now().toString(36).toUpperCase(),date:new Date().toISOString()})){message.textContent='No se pudo guardar el cierre. Habilita el almacenamiento del navegador e inténtalo de nuevo.';return;}
      renderSummary(root);root.querySelector('.journey-ticket').scrollIntoView({block:'center'});root.querySelector('#download-ticket').focus({preventScroll:true});
    });
    root.querySelector('#download-ticket')?.addEventListener('click',()=>{
      const now=snapshot();if(!now.paid){renderSummary(root);return;}
      const text=['RUMBO · TICKET DE DEMOSTRACIÓN','NO VÁLIDO PARA VIAJAR. SIN RESERVA NI COBRO REAL.',now.receipt.code,now.d.name,`${now.t.date} al ${now.end} · ${now.t.travelers} viajeros`,...now.items.map(i=>`${i.label}: ${i.title}\n${i.detail}\n${money(i.total)}`),`TOTAL SIMULADO: ${money(now.total)}`].join('\n\n');
      const url=URL.createObjectURL(new Blob(['\uFEFF'+text],{type:'text/plain;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download='ticket-rumbo-demo.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);
    });
    root.querySelectorAll('[data-remove-service]').forEach(button=>button.addEventListener('click',()=>{const saved=read('rumbo.services.v1',[]);if(write('rumbo.services.v1',Array.isArray(saved)?saved.filter(s=>s.section!==button.dataset.removeService):[])){renderSummary(root);root.querySelector('h1').tabIndex=-1;root.querySelector('h1').focus();}}));
    mountSteps();
  }
  function current(){return document.body.dataset.page||new URLSearchParams(location.search).get('seccion')||(location.pathname.endsWith('tienda.html')?'tienda':'');}
  function mountSteps(){
    const active=current(),index=steps.findIndex(s=>s[0]===active);if(index<0)return;
    document.querySelectorAll('.rv-steps,.service-tabs,.journey-progress').forEach(n=>n.remove());
    const main=document.querySelector('main'), nav=document.createElement('nav');nav.className='journey-progress';nav.setAttribute('aria-label','Organiza tu viaje por pasos');
    nav.innerHTML='<p>ARMA TU VIAJE <span>Elige un paso para continuar o cambiar tu selección.</span></p><ol>'+steps.map(([id,label,url],i)=>`<li><a href="${url}" ${id===active?'aria-current="step"':''}><span>${i+1}</span>${label}</a></li>`).join('')+'</ol>';main.prepend(nav);
    if(['traslados','seguros','guias','tienda'].includes(active)&&!document.querySelector('.journey-next')){const next=steps[index+1],footer=document.createElement('div');footer.className='journey-next';footer.innerHTML=`<a href="${steps[index-1][2]}">← ${steps[index-1][1]}</a><div><p>${active==='tienda'?'Los productos del carrito se incluyen en Mi viaje.':'Este paso es opcional. Guarda tu elección antes de continuar.'}</p><a class="button button-primary" href="${next[2]}">Continuar a ${next[1].toLowerCase()} →</a></div>`;main.append(footer);}
  }
  window.RumboJourney={snapshot,renderSummary,mountSteps,skipFlight};
})();

