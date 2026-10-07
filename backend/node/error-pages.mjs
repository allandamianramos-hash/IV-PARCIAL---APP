import { readFileSync } from 'node:fs';
const template=readFileSync(new URL('../../public/error.html',import.meta.url),'utf8');
const messages={400:['Enlace no válido.','Comprueba la dirección o vuelve al inicio para continuar.'],403:['No se puede abrir esta página.','Accede desde la dirección de Rumbo para continuar.'],404:['No encontramos esta página.','El enlace puede haber cambiado o la página ya no está disponible. Puedes seguir explorando desde el inicio.'],405:['Esta acción no está disponible.','Vuelve al inicio y abre la sección que necesitas.'],500:['No pudimos cargar esta página.','Ocurrió un problema en Rumbo. Vuelve a intentarlo en unos momentos.'],503:['Rumbo no está disponible por un momento.','No pudimos completar la solicitud. Vuelve a intentarlo en unos momentos.']};
export function sendError(req,res,status){
  const [title,message]=messages[status]||messages[500];
  const api=(req.url||'').startsWith('/api/');
  res.writeHead(status,{'Content-Type':api?'application/json; charset=utf-8':'text/html; charset=utf-8','Cache-Control':'no-store'});
  const html=template.replace('Página no encontrada | Rumbo',title+' | Rumbo').replaceAll('Error 404','Error '+status).replace('>404<','>'+status+'<').replace('No encontramos esta página.',title).replace('El enlace puede haber cambiado o la página ya no está disponible. Puedes seguir explorando desde el inicio.',message).replaceAll('href="index.html"','href="/index.html"').replaceAll('href="servicios.html"','href="/servicios.html"').replace('src="js/compartido/connection.js"','src="/js/compartido/connection.js"').replace('src="js/compartido/error.js"','src="/js/compartido/error.js"');
  res.end(req.method==='HEAD'?undefined:api?JSON.stringify({error:message}):html);
}
