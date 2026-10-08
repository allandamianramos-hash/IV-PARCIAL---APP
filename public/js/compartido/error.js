(() => {
  'use strict';
  const params=new URLSearchParams(location.search),code=params.get('code');
  const retry=document.getElementById('retry'),help=document.getElementById('error-help');
  const review=document.getElementById('conflict-review'),choices=document.getElementById('conflict-choices');
  const keep=document.getElementById('keep-local'),useSaved=document.getElementById('use-saved');
  const pendingKey='rumbo.sync.pending.v1',identityKey='rumbo.sync.visitor.v1';
  const pages=['index.html','viajes.html','tienda.html','servicios.html','registro.html','iniciar-sesion.html'];
  const messages={
    database:['Conexión no disponible','Hagamos una pequeña pausa.','No pudimos conectar con el servicio que guarda tu viaje. Tus selecciones pendientes siguen en este navegador. Reintenta para continuar donde estabas.','503'],
    save:['Cambios pendientes','Tu viaje aún no se pudo guardar.','La conexión se interrumpió antes de confirmar el guardado. Conservamos tus cambios en este navegador; reintenta para enviarlos de nuevo.','503'],
    conflict:['Revisa tus cambios','Hay dos versiones de tu viaje.','Otra pestaña guardó cambios más recientes. Conservamos tu selección local. Revisa ambas versiones y elige cuál quieres usar.','409'],
    recovery:['Borrador recuperado','Tu selección te estaba esperando.','Encontramos cambios pendientes de tu sesión anterior. Revisa el borrador y la versión guardada; tú eliges cuál conservar para continuar tu viaje.','↗'],
    session:['La sesión ha cambiado','Volvamos a conectar tu viaje.','No guardaremos tus cambios en una cuenta diferente. Tu borrador sigue en este navegador. Recupera tu sesión original antes de reintentar.','401'],
    storage:['Guardado no disponible','El navegador no pudo guardar tus cambios.','Permite el almacenamiento de este sitio o libera espacio antes de volver a intentarlo. El último cambio no pudo confirmarse.','503'],
    offline:['Conexión no disponible','Rumbo todavía no está conectado.','Inicia el servidor con INICIAR-RUMBO.cmd y vuelve a intentar. Puedes seguir explorando el catálogo sin conexión al servidor.','503']
  };
  let mode=code,reviewDraft,reviewState,reviewVisitor;
  function render(kind){
    mode=kind;
    const copy=messages[kind];if(!copy)return;
    document.title=copy[0]+' | Rumbo';
    for(const [id,value]of [['error-label',copy[0]],['error-title',copy[1]],['error-message',copy[2]],['error-number',copy[3]]])document.getElementById(id).textContent=value;
    retry.hidden=false;retry.textContent=['conflict','recovery'].includes(kind)?'Revisar mis cambios':'Reintentar conexión';
    const sessionLink=document.getElementById('services-link');sessionLink.hidden=kind!=='session';
    if(kind==='session'){sessionLink.href='iniciar-sesion.html';sessionLink.textContent='Recuperar mi sesión';}
  }
  function destination(){
    try{
      const base=new URL('index.html',location.href),url=new URL(params.get('returnTo')||'index.html',base);
      // Only known pages in this same directory; error.html can never be its own return target.
      if(url.origin!==base.origin||url.protocol!==base.protocol||!pages.some(page=>url.pathname===new URL(page,base).pathname))return base.href;
      return url.href;
    }catch{return new URL('index.html',location.href).href;}
  }
  const pending=()=>{const value=JSON.parse(localStorage.getItem(pendingKey)||'{}');if(!value||typeof value!=='object'||Array.isArray(value))throw Error('No se pudo leer tu borrador.');return value;};
  const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
  async function request(path,options={}){
    const response=await fetch(path,{cache:'no-store',credentials:'same-origin',signal:AbortSignal.timeout(10000),...options});
    let data;try{data=await response.json();}catch{throw Error('El servicio todavía no responde. Tus cambios pendientes se conservan.');}
    if(!response.ok){const error=Error(response.status===409?'Hay nuevos cambios. Revisa las versiones otra vez.':response.status===401?'Recupera tu sesión original para guardar este borrador.':'No pudimos conectar. Tus cambios pendientes se conservan; vuelve a intentarlo.');error.status=response.status;throw error;}
    return data;
  }
  async function checkDatabase(){
    const status=await request('/api/database');
    if(status.connected!==true)throw Error('La conexión aún no está disponible. Vuelve a intentarlo en unos momentos.');
  }
  async function snapshot(){
    const data=await request('/api/state');
    if(!data.visitor||data.visitor!==localStorage.getItem(identityKey)){render('session');throw Error('La sesión actual pertenece a otro visitante. Conservamos tu borrador sin enviarlo.');}
    if(!data.state||typeof data.state!=='object')throw Error('No pudimos comprobar la versión guardada.');
    return data;
  }
  const names={'rumbo.store.cart.v2':'Carrito','rumbo.store.favorites.v2':'Favoritos','rumbo.integrante2.viaje.v1':'Mi viaje','rumbo.services.v1':'Servicios','rumbo.profile.v1':'Perfil','rumbo.checkout.v1':'Reserva de demostración','rumbo.no-flight.v1':'Selección de vuelo','rumbo.departureChecklist.v1':'Lista de viaje'};
  const fields={alias:'Nombre',preference:'Preferencia',destinationId:'Destino',origin:'Origen',date:'Fecha',checkIn:'Entrada',cabin:'Cabina',flightId:'Vuelo',hotelId:'Hotel',roomType:'Habitación',travelers:'Viajeros',nights:'Noches',rooms:'Habitaciones',id:'Artículo',quantity:'Cantidad',options:'Opciones',section:'Servicio',title:'Nombre',detail:'Detalle',total:'Total',values:'Selección',people:'Personas',code:'Código',demo:'Demostración',signature:'Resumen'};
  function describe(value){
    if(value===null||value===undefined)return 'Sin selección';
    if(Array.isArray(value))return value.length?value.map(describe).join('\n\n'):'Sin selección';
    if(typeof value==='object')return Object.entries(value).map(([key,item])=>(fields[key]||key)+': '+describe(item)).join('\n');
    return typeof value==='boolean'?(value?'Sí':'No'):String(value);
  }
  function showReview(draft,data){
    reviewDraft=draft;reviewState=data.state;reviewVisitor=data.visitor;
    render(mode==='recovery'?'recovery':'conflict');review.hidden=false;choices.replaceChildren();
    for(const [key,change]of Object.entries(draft)){
      const item=document.createElement('article'),heading=document.createElement('h3');heading.textContent=names[key]||'Selección';item.append(heading);
      for(const [label,value]of [['Tu selección',change.value],['Versión guardada',data.state[key]?.value]]){
        const title=document.createElement('strong'),text=document.createElement('p');title.textContent=label;text.textContent=describe(value);item.append(title,text);
      }
      choices.append(item);
    }
    help.hidden=false;help.textContent='Elige una versión. Si usas la guardada, conservaremos una copia de tu borrador en este navegador.';
  }
  function acknowledge(draft,state){
    const latest=pending();
    for(const key of Object.keys(draft)){
      if(same(latest[key],draft[key])){
        delete latest[key];
        const value=state[key].value;
        if(value===null)localStorage.removeItem(key);else localStorage.setItem(key,JSON.stringify(value));
      }else if(latest[key]){latest[key].revision=state[key].revision;latest[key].base=state[key].value;}
    }
    localStorage.setItem(pendingKey,JSON.stringify(latest));
  }
  async function save(draft,data){
    const changes=Object.fromEntries(Object.entries(draft).map(([key,change])=>[key,{value:change.value,revision:data.state[key]?.revision||0}]));
    const result=await request('/api/state',{method:'PUT',headers:{'Content-Type':'application/json','X-Rumbo-Visitor':data.visitor},body:JSON.stringify({changes})});
    if(!result.revisions||!Object.entries(changes).every(([key,change])=>Number.isInteger(result.revisions[key])&&result.revisions[key]>change.revision))throw Error('El guardado no se confirmó. Conservamos tu selección para reintentar.');
    if(localStorage.getItem(identityKey)!==data.visitor){render('session');throw Error('La sesión cambió durante el guardado. Conservamos el borrador para comprobarlo con tu cuenta original.');}
    acknowledge(draft,Object.fromEntries(Object.entries(changes).map(([key,change])=>[key,{value:change.value,revision:result.revisions[key]}])));
    location.replace(destination());
  }
  async function run(action){
    retry.disabled=keep.disabled=useSaved.disabled=true;help.hidden=true;
    try{if(navigator.locks)await navigator.locks.request('rumbo-save',action);else await action();}
    catch(error){
      if(error.status===409){render('conflict');review.hidden=true;}
      help.hidden=false;help.textContent=error.name==='TimeoutError'?'La conexión tardó demasiado. Tus cambios pendientes se conservan.':error.message||'No se pudo completar la conexión.';
    }finally{retry.disabled=keep.disabled=useSaved.disabled=false;}
  }
  if(messages[code])render(code);
  else if(['500','502','503','504'].includes(document.getElementById('error-number').textContent.trim()))retry.hidden=false;
  retry.addEventListener('click',()=>run(async()=>{
    if(!messages[mode]){location.reload();return;}
    if(mode==='offline'){
      const target=new URL(destination());
      if(!await window.RumboConnect?.(target.pathname.split('/').pop()+target.search+target.hash))throw Error('El servidor o la base de datos aún no responde. Comprueba que INICIAR-RUMBO.cmd esté en ejecución.');
      return;
    }
    if(mode==='storage'){localStorage.setItem('rumbo.storage.check','1');localStorage.removeItem('rumbo.storage.check');}
    await checkDatabase();
    const draft=pending();
    if(!Object.keys(draft).length){location.replace(destination());return;}
    const data=await snapshot();
    if(Object.entries(draft).every(([key,change])=>!change.needsReview&&same(change.value,data.state[key]?.value))){acknowledge(draft,data.state);location.replace(destination());return;}
    if(['conflict','recovery'].includes(mode)||Object.entries(draft).some(([key,change])=>change.needsReview||change.revision!==(data.state[key]?.revision||0)&&!same(change.value,data.state[key]?.value))){showReview(draft,data);return;}
    await save(draft,data);
  }));
  keep.addEventListener('click',()=>run(async()=>{
    if(!reviewDraft||!same(pending(),reviewDraft))throw Error('Tu selección cambió en otra pestaña. Pulsa Revisar mis cambios para actualizarla.');
    const data=await snapshot();
    if(data.visitor!==reviewVisitor||Object.keys(reviewDraft).some(key=>(data.state[key]?.revision||0)!==(reviewState[key]?.revision||0))){showReview(reviewDraft,data);throw Error('La versión guardada cambió. Revisa las nuevas selecciones antes de elegir.');}
    await save(reviewDraft,data);
  }));
  useSaved.addEventListener('click',()=>run(async()=>{
    if(!reviewDraft||!same(pending(),reviewDraft))throw Error('Tu selección cambió en otra pestaña. Pulsa Revisar mis cambios para actualizarla.');
    const data=await snapshot();
    if(data.visitor!==reviewVisitor||Object.keys(reviewDraft).some(key=>(data.state[key]?.revision||0)!==(reviewState[key]?.revision||0))){showReview(reviewDraft,data);throw Error('La versión guardada cambió. Revisa las nuevas selecciones antes de elegir.');}
    const stored=JSON.parse(localStorage.getItem('rumbo.sync.recovery.v1')||'[]');
    const recoveries=Array.isArray(stored)?stored:stored?.visitor?[stored]:[];
    localStorage.setItem('rumbo.sync.recovery.v1',JSON.stringify([...recoveries,{visitor:reviewVisitor,changes:reviewDraft,needsReview:false}]));
    acknowledge(reviewDraft,Object.fromEntries(Object.keys(reviewDraft).map(key=>[key,data.state[key]||{value:null,revision:0}])));
    location.replace(destination());
  }));
})();
