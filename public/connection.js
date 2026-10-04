/* Live Server proxies PHP on the same origin; never redirect to its internal port. */
(() => {
  'use strict';
  const pages=['index.html','viajes.html','tienda.html','servicios.html','registro.html','iniciar-sesion.html'];
  const local=location.protocol==='file:'||['localhost','127.0.0.1'].includes(location.hostname);
  window.RumboConnect=async function(target){
    if(!local||location.protocol==='file:')return false;
    const origin=location.protocol+'//'+location.hostname+(location.port?':'+location.port:'');
    try{
      const response=await fetch(origin+'/api/health',{credentials:'omit',signal:AbortSignal.timeout(2500)});
      const health=await response.json();
      if(!response.ok||health.app!=='rumbo-viajes'||health.backend!=='php')return false;
      const path=target||((location.pathname.split('/').pop()||'index.html')+location.search+location.hash);
      const url=new URL(path,origin+'/');
      if(url.origin!==origin||!pages.includes(url.pathname.slice(1)))return false;
      location.replace(url.href);return true;
    }catch{return false;}
  };
})();
