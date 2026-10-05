/* Local cache + durable SQL Server visitor state. No database credentials here. */
(() => {
  'use strict';
  const keys=['rumbo.store.cart.v2','rumbo.store.favorites.v2','rumbo.integrante2.viaje.v1','rumbo.services.v1','rumbo.profile.v1','rumbo.checkout.v1','rumbo.no-flight.v1','rumbo.departureChecklist.v1'];
  const pendingKey='rumbo.sync.pending.v1', identityKey='rumbo.sync.visitor.v1';
  const initial=document.getElementById('rumbo-bootstrap');
  const boot=JSON.parse(initial?.textContent||'{"connected":false}');
  const staticPage=!initial;
  const localPreview=staticPage&&(location.protocol==='file:'||['localhost','127.0.0.1'].includes(location.hostname));
  window.RumboDatabase=boot;
  const memory=new Map(), revisions={};
  let pending={},busy=false,conflict=false,timer;
  const read=k=>{try{return localStorage.getItem(k);}catch{return null;}};
  const readPending=()=>{try{const p=JSON.parse(read(pendingKey)||'{}');return p&&typeof p==='object'&&!Array.isArray(p)?p:{};}catch{return {};}};
  const cache=(k,v)=>{memory.set(k,v);try{if(v===null)localStorage.removeItem(k);else localStorage.setItem(k,v);}catch{}};
  try{pending=JSON.parse(read(pendingKey)||'{}');}catch{}
  if(!pending||typeof pending!=='object'||Array.isArray(pending))pending={};
  const previous=read(identityKey);
  if(boot.connected&&previous&&previous!==boot.visitor){pending={};keys.forEach(k=>cache(k,null));}
  if(boot.connected)cache(identityKey,boot.visitor);
  for(const key of keys){
    const row=boot.state?.[key];revisions[key]=row?.revision||0;
    if(pending[key]&&row&&JSON.stringify(pending[key].value)===JSON.stringify(row.value))delete pending[key];
    if(pending[key]){
      if(pending[key].revision!==revisions[key]&&boot.connected)conflict=true;
      cache(key,pending[key].value===null?null:JSON.stringify(pending[key].value));
    }else if(row)cache(key,row.value===null?null:JSON.stringify(row.value));
    else{
      memory.set(key,read(key));
      // Import pre-existing browser selections once, only when the server has no value.
      if(boot.connected&&memory.get(key)!==null){try{pending[key]={value:JSON.parse(memory.get(key)),revision:0};}catch{}}
    }
  }
  function savePending(){localStorage.setItem(pendingKey,JSON.stringify(pending));}
  try{savePending();}catch{}
  const banner=document.createElement('div');banner.className='database-status';banner.setAttribute('role','status');
  const label=document.createElement('span'), retry=document.createElement('button');retry.type='button';retry.textContent='Reintentar';
  banner.append(label,retry);document.body.append(banner);
  function show(message){
    label.textContent=message||(conflict?'Otra pestaña tiene cambios más recientes.':staticPage?'Rumbo está en modo local. Inicia INICIAR-RUMBO.cmd para conectar; tus selecciones se guardan en este navegador.':!boot.connected?'Sin conexión a la base de datos. Tus cambios están pendientes en este navegador.':Object.keys(pending).length?'Guardando en SQL Server…':'Guardado en SQL Server.');
    retry.hidden=boot.connected&&!conflict&&!message;
    retry.textContent=conflict?'Cargar versión guardada':localPreview?'Abrir versión conectada':boot.connected?'Reintentar':'Volver a conectar';
  }
  retry.addEventListener('click',async()=>{
    if(localPreview){
      const file=location.pathname.split('/').pop();
      const page=['index.html','viajes.html','tienda.html','servicios.html','registro.html','iniciar-sesion.html'].includes(file)?file:'index.html';
      if(!await window.RumboConnect?.(page+(location.search||'')))location.href='error.html?code=offline';return;
    }
    if(conflict){pending={};try{savePending();}catch{}location.reload();}
    else if(!boot.connected)location.reload();else flush();
  });
  function flush(){
    // A browser-wide lock prevents two tabs from draining the same queue at once.
    return navigator.locks ? navigator.locks.request('rumbo-save',flushQueue) : flushQueue();
  }
  async function flushQueue(){
    clearTimeout(timer);
    pending=readPending();
    if(busy||!boot.connected||conflict||!Object.keys(pending).length)return;
    busy=true;show();
    const changes=JSON.parse(JSON.stringify(pending));
    try{
      const response=await fetch('/api/state',{method:'PUT',headers:{'Content-Type':'application/json','X-Rumbo-Visitor':boot.visitor},body:JSON.stringify({changes}),signal:AbortSignal.timeout(10000),keepalive:true});
      if(!response.ok){conflict=response.status===409;throw Error(conflict?'Hay cambios más recientes. Carga la versión guardada para revisarlos.':'No se guardó en el servidor. Tus cambios siguen en este navegador.');}
      const result=await response.json();
      pending=readPending();
      for(const [key,revision]of Object.entries(result.revisions)){
        revisions[key]=revision;
        if(JSON.stringify(pending[key])===JSON.stringify(changes[key]))delete pending[key];
        else if(pending[key])pending[key].revision=revision;
      }
      savePending();show();
    }catch(e){show(e.message||'No se pudo conectar. Tus cambios siguen en este navegador.');busy=false;return;}
    busy=false;if(Object.keys(pending).length)timer=setTimeout(flush,100);
  }
  window.RumboStorage={
    getItem(key){return keys.includes(key)?memory.get(key)??null:read(key);},
    setItem(key,raw){
      if(!keys.includes(key))return localStorage.setItem(key,raw);
      const value=JSON.parse(raw);
      // Require a durable local queue before reporting the local save as successful.
      const next={...readPending(),[key]:{value,revision:revisions[key]||0}};
      localStorage.setItem(pendingKey,JSON.stringify(next));
      pending=next;cache(key,raw);show();timer=setTimeout(flush,80);
    },
    removeItem(key){this.setItem(key,'null');cache(key,null);},
    flush,
    hasPending(){return Object.keys(readPending()).length>0;}
  };
  window.addEventListener('online',()=>boot.connected?flush():location.reload());
  window.addEventListener('pagehide',flush);
  window.addEventListener('storage',e=>{if(keys.includes(e.key))memory.set(e.key,e.newValue);});
  window.addEventListener('pageshow',e=>{if(e.persisted)location.reload();});
  document.addEventListener('click',async e=>{
    const link=e.target.closest?.('a[href]');
    if(e.defaultPrevented||e.button!==0||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey||!link||link.target||link.hasAttribute('download')||link.origin!==location.origin||link.pathname===location.pathname&&link.search===location.search)return;
    if(Object.keys(pending).length&&!busy){e.preventDefault();await flush();location.href=link.href;}
  });
  show();if(Object.keys(pending).length)timer=setTimeout(flush,100);
})();
