/* Local cache + durable visitor state. Successful saves stay silent. */
(() => {
  'use strict';
  const keys=['rumbo.store.cart.v2','rumbo.store.favorites.v2','rumbo.integrante2.viaje.v1','rumbo.services.v1','rumbo.profile.v1','rumbo.checkout.v1','rumbo.no-flight.v1','rumbo.departureChecklist.v1'];
  const pendingKey='rumbo.sync.pending.v1', identityKey='rumbo.sync.visitor.v1',recoveryKey='rumbo.sync.recovery.v1';
  const initial=document.getElementById('rumbo-bootstrap');
  const boot=JSON.parse(initial?.textContent||'{"connected":false}');
  const staticPage=!initial;
  window.RumboDatabase=boot;
  const memory=new Map(), revisions={};
  let pending={},conflict=false,timer,activeFlush,redirecting=false;
  const read=k=>{try{return localStorage.getItem(k);}catch{return null;}};
  const readPending=()=>{try{const p=JSON.parse(read(pendingKey)||'{}');return p&&typeof p==='object'&&!Array.isArray(p)?p:{};}catch{return {};}};
  const readRecoveries=()=>{const value=JSON.parse(read(recoveryKey)||'[]');return Array.isArray(value)?value:value?.visitor?[value]:[];};
  const cache=(k,v)=>{memory.set(k,v);try{if(v===null)localStorage.removeItem(k);else localStorage.setItem(k,v);}catch{}};
  function reportError(code='database'){
    if(redirecting)return false;
    redirecting=true;
    const page=location.pathname.split('/').pop()||'index.html';
    const returnTo=page+(location.search||'')+(location.hash||'');
    location.replace('error.html?'+new URLSearchParams({code,returnTo}));
    return false;
  }
  pending=readPending();
  const previous=read(identityKey);
  if(boot.connected&&previous&&previous!==boot.visitor){
    // Keep a recoverable draft for the former account without exposing it to the new one.
    if(Object.keys(pending).length){
      try{localStorage.setItem(recoveryKey,JSON.stringify([...readRecoveries(),{visitor:previous,changes:pending,needsReview:true}]));}
      catch{reportError('storage');return;}
    }
    pending={};keys.forEach(k=>cache(k,null));
  }
  if(boot.connected)cache(identityKey,boot.visitor);
  let recovering=false;
  if(boot.connected){
    try{
      const recoveries=readRecoveries();
      const draft=recoveries.find(item=>item.visitor===boot.visitor&&item.needsReview!==false&&item.changes&&Object.keys(item.changes).length);
      if(draft){
        // Restore only to the original visitor's local review queue, never directly to SQL.
        pending=Object.fromEntries(Object.entries({...draft.changes,...pending}).map(([key,change])=>[key,{...change,needsReview:true}]));
        localStorage.setItem(pendingKey,JSON.stringify(pending));
        draft.needsReview=false;
        localStorage.setItem(recoveryKey,JSON.stringify(recoveries));
        recovering=true;
      }
    }catch{reportError('storage');return;}
  }
  for(const key of keys){
    const row=boot.state?.[key];revisions[key]=row?.revision||0;
    if(pending[key]&&!pending[key].needsReview&&row&&JSON.stringify(pending[key].value)===JSON.stringify(row.value))delete pending[key];
    if(pending[key]){
      if(boot.connected&&(pending[key].needsReview||pending[key].revision!==revisions[key]))conflict=true;
      cache(key,pending[key].value===null?null:JSON.stringify(pending[key].value));
    }else if(row)cache(key,row.value===null?null:JSON.stringify(row.value));
    else{
      memory.set(key,read(key));
      if(boot.connected&&memory.get(key)!==null){try{pending[key]={value:JSON.parse(memory.get(key)),revision:0};}catch{}}
    }
  }
  function savePending(){localStorage.setItem(pendingKey,JSON.stringify(pending));}
  try{savePending();}catch{}
  function flush(options={}){
    clearTimeout(timer);
    if(activeFlush)return activeFlush;
    const run=()=>flushQueue(options.navigateOnError!==false);
    activeFlush=Promise.resolve().then(()=>navigator.locks?navigator.locks.request('rumbo-save',run):run()).finally(()=>{activeFlush=null;});
    return activeFlush;
  }
  async function flushQueue(navigateOnError){
    const fail=code=>{if(navigateOnError)reportError(code);return false;};
    if(staticPage)return true;
    if(!boot.connected)return fail('database');
    if(conflict)return fail('conflict');
    pending=readPending();
    while(Object.keys(pending).length){
      if(read(identityKey)!==boot.visitor)return fail('session');
      if(Object.values(pending).some(change=>change.needsReview)){conflict=true;return fail('recovery');}
      const changes=JSON.parse(JSON.stringify(pending));
      try{
        const response=await fetch('/api/state',{method:'PUT',headers:{'Content-Type':'application/json','X-Rumbo-Visitor':boot.visitor},body:JSON.stringify({changes}),signal:AbortSignal.timeout(10000),keepalive:true});
        if(!response.ok){
          conflict=response.status===409;
          return fail(conflict?'conflict':response.status===401?'session':'save');
        }
        const result=await response.json();
        // A partial or invalid acknowledgement must never clear the local queue.
        if(!result.revisions||!Object.entries(changes).every(([key,change])=>Number.isInteger(result.revisions[key])&&result.revisions[key]>change.revision))return fail('save');
        pending=readPending();
        for(const key of Object.keys(changes)){
          const revision=result.revisions[key];revisions[key]=revision;
          if(JSON.stringify(pending[key])===JSON.stringify(changes[key]))delete pending[key];
          else if(pending[key])pending[key].revision=revision;
        }
        savePending();
      }catch{return fail('save');}
      pending=readPending();
    }
    return !redirecting;
  }
  window.RumboStorage={
    getItem(key){return keys.includes(key)?memory.get(key)??null:read(key);},
    setItem(key,raw){
      if(!keys.includes(key))return localStorage.setItem(key,raw);
      const value=JSON.parse(raw);
      const previousPending=readPending();
      const next={...previousPending,[key]:{...previousPending[key],value,revision:revisions[key]||0}};
      try{localStorage.setItem(pendingKey,JSON.stringify(next));}
      catch(error){reportError('storage');throw error;}
      pending=next;cache(key,raw);clearTimeout(timer);timer=setTimeout(flush,80);
    },
    removeItem(key){this.setItem(key,'null');cache(key,null);},
    flush,reportError,
    isRedirecting(){return redirecting;},
    hasPending(){return Object.keys(readPending()).length>0;}
  };
  window.addEventListener('online',()=>{if(!staticPage&&!redirecting)flush();});
  window.addEventListener('pagehide',()=>flush({navigateOnError:false}));
  window.addEventListener('storage',e=>{if(keys.includes(e.key))memory.set(e.key,e.newValue);});
  window.addEventListener('pageshow',e=>{if(e.persisted)location.reload();});
  document.addEventListener('click',async e=>{
    const link=e.target.closest?.('a[href]');
    if(e.defaultPrevented||e.button!==0||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey||!link||link.target||link.hasAttribute('download')||link.origin!==location.origin||link.pathname===location.pathname&&link.search===location.search)return;
    if(redirecting){e.preventDefault();return;}
    if(Object.keys(readPending()).length||activeFlush){e.preventDefault();if(await flush())location.href=link.href;}
  });
  if(!staticPage&&!boot.connected)reportError('database');
  else if(recovering)reportError('recovery');
  else if(conflict)reportError('conflict');
  else if(Object.keys(pending).length)timer=setTimeout(flush,100);
})();
