import {readFile} from 'node:fs/promises';
import {siteConfig} from './site-config.mjs';
const pages=JSON.parse(await readFile(new URL('../../config/seo-pages.json',import.meta.url),'utf8'));
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function publicOrigin(){const value=siteConfig.origin||process.env.APP_ORIGIN||'';try{const u=new URL(value);return u.protocol==='https:'&&u.pathname==='/'&&!u.search&&!u.hash&&!u.username&&!u.password?u.origin:'';}catch{return '';}}
export function pageMeta(requestUrl){
 const u=new URL(requestUrl,'http://localhost'),file=u.pathname.slice(1)||'index.html';let key=file;
 if(file==='viajes.html'){const view=u.searchParams.get('pantalla')||'destinos';key+='?pantalla='+view;if(view==='detalle-destino')key+='&destino='+u.searchParams.get('destino');}
 if(file==='servicios.html'&&u.searchParams.get('seccion')&&u.searchParams.get('seccion')!=='servicios')key+='?seccion='+u.searchParams.get('seccion');
 return {key,page:pages[key]};
}
export function seoHtml(html,url){
 const {key,page}=pageMeta(url),origin=publicOrigin(),indexable=!!page&&!!origin&&siteConfig.indexable;
 const metadata=page||{title:'Mi cuenta | Rumbo',description:'Accede a tu espacio personal de Rumbo.'};
 if(page){html=html.replace(/<title>[^<]*<\/title>/i,'<title>'+esc(page.title)+'</title>');html=html.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,'<meta name="description" content="'+esc(page.description)+'">');}
 let tags=`<meta name="robots" content="${indexable?'index,follow':'noindex,nofollow'}"><meta property="og:type" content="website"><meta property="og:site_name" content="Rumbo"><meta property="og:title" content="${esc(metadata.title)}"><meta property="og:description" content="${esc(metadata.description)}"><meta name="twitter:card" content="summary_large_image">`;
 if(origin&&page){const canonical=origin+'/'+(key==='index.html'?'':key),image=origin+'/'+(page.image||'imagenes-viajes/portadas/hero-premium-venecia.jpg');tags+=`<link rel="canonical" href="${esc(canonical)}"><meta property="og:url" content="${esc(canonical)}"><meta property="og:image" content="${esc(image)}"><meta property="og:image:alt" content="${esc(page.imageAlt||'El Gran Canal de Venecia · Rumbo')}"><meta name="twitter:image" content="${esc(image)}">`;}
 return html.replace('</head>',tags+'</head>');
}
export function seoEndpoint(req,res){
 const path=new URL(req.url,'http://localhost').pathname;if(!['/robots.txt','/sitemap.xml'].includes(path))return false;
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return true;}
 const origin=publicOrigin(),published=!!origin&&siteConfig.indexable;
 const body=path==='/robots.txt'?(published?`User-agent: *\nDisallow: /api/\nSitemap: ${origin}/sitemap.xml\n`:'User-agent: *\nDisallow: /\n'):(published?'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+Object.keys(pages).map(p=>'<url><loc>'+esc(origin+'/'+(p==='index.html'?'':p))+'</loc></url>').join('')+'</urlset>':'<?xml version="1.0" encoding="UTF-8"?><error>El dominio público y la indexación aún no están configurados.</error>');
 res.writeHead(path==='/sitemap.xml'&&!published?503:200,{'Content-Type':path==='/robots.txt'?'text/plain; charset=utf-8':'application/xml; charset=utf-8','Cache-Control':'no-cache'});res.end(req.method==='HEAD'?undefined:body);return true;
}
