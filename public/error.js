(() => {
  'use strict';
  const code=new URLSearchParams(location.search).get('code');
  const retry=document.getElementById('retry');
  if(code==='offline'){
    document.title='Conexión no disponible | Rumbo';
    document.getElementById('error-label').textContent='Conexión no disponible';
    document.getElementById('error-title').textContent='Rumbo todavía no está conectado.';
    document.getElementById('error-message').textContent='Inicia el servidor con INICIAR-RUMBO.cmd y vuelve a intentar. Puedes seguir explorando el catálogo sin conexión al servidor.';
    document.getElementById('error-number').textContent='↗';
    retry.hidden=false;document.getElementById('services-link').hidden=true;
  }else if(['500','502','503','504'].includes(document.getElementById('error-number').textContent.trim()))retry.hidden=false;
  retry.addEventListener('click',async()=>{
    if(code!=='offline'){location.reload();return;}
    retry.disabled=true;retry.textContent='Conectando…';
    const connected=await window.RumboConnect('index.html');
    if(!connected){const help=document.getElementById('error-help');help.hidden=false;help.textContent='El servidor aún no responde. Comprueba que INICIAR-RUMBO.cmd esté en ejecución.';retry.disabled=false;retry.textContent='Reintentar conexión';}
  });
})();
