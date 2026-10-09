/* Leave the editor preview for the independent server after saving pending work. */
(() => {
  'use strict';
  const pages=['index.html','viajes.html','tienda.html','servicios.html','registro.html','iniciar-sesion.html'];
  const local=location.protocol==='file:'||['localhost','127.0.0.1'].includes(location.hostname);
  async function openStandalone(){
    if(!local||location.protocol!=='http:'||location.port!=='5500')return;
    const page=location.pathname.split('/').pop()||'index.html';
    if(!pages.includes(page))return;
    const entry=location.pathname+location.search+location.hash;
    const origin='http://'+location.hostname+':8000';
    try{
      const response=await fetch(origin+'/api/health',{cache:'no-store',credentials:'omit',signal:AbortSignal.timeout(2500)});
      const health=await response.json();
      if(!response.ok||health.app!=='rumbo-viajes'||health.backend!=='php')return;
      const storage=window.RumboStorage;
      if(storage?.hasPending()){
        if(window.RumboDatabase?.connected!==true||!await storage.flush({navigateOnError:false})||storage.hasPending())return;
      }
      // Do not override a navigation or a recovery page opened while checking.
      if(location.pathname+location.search+location.hash!==entry)return;
      location.replace(origin+'/'+page+location.search+location.hash);
    }catch{/* Keep the current page when the independent server is unavailable. */}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',openStandalone,{once:true});
  else void openStandalone();
  window.RumboConnect=async function(target){
    if(!local||location.protocol==='file:')return false;
    const origin=location.protocol+'//'+location.hostname+(location.port?':'+location.port:'');
    try{
      const path=target||((location.pathname.split('/').pop()||'index.html')+location.search+location.hash);
      const url=new URL(path,origin+'/');
      if(url.origin!==origin||!pages.includes(url.pathname.slice(1)))return false;
      const response=await fetch(origin+'/api/health',{credentials:'omit',signal:AbortSignal.timeout(2500)});
      const health=await response.json();
      if(!response.ok||health.app!=='rumbo-viajes')return false;
      const database=await fetch(origin+'/api/database',{cache:'no-store',credentials:'same-origin',signal:AbortSignal.timeout(10000)});
      if(!database.ok||(await database.json()).connected!==true)return false;
      location.replace(url.href);return true;
    }catch{return false;}
  };
})();
