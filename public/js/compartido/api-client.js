// API errors are shown in plain Spanish; HTML error pages are never parsed as JSON.
window.RumboApi={async json(url,options={}){
 let response;try{response=await fetch(url,{...options,signal:options.signal||AbortSignal.timeout(15000)});}catch{throw Error('No se pudo conectar con Rumbo. Comprueba que el servidor esté iniciado e inténtalo de nuevo.');}
 const raw=await response.text();let data;
 try{if(!raw.trim()||!/^application\/json(?:;|$)/i.test(response.headers.get('content-type')||''))throw Error();data=JSON.parse(raw);}catch{throw Error('El servidor no tiene disponible esta función. Actualiza el proyecto y vuelve a abrir INICIAR-RUMBO.cmd.');}
 if(!data||typeof data!=='object'||Array.isArray(data))throw Error('El servidor devolvió una respuesta incompleta. Inténtalo de nuevo.');
 if(!response.ok)throw Error(typeof data.error==='string'?data.error:'No se pudo completar la solicitud. Inténtalo de nuevo.');
 return data;
}};
