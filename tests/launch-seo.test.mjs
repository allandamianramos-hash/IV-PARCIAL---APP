import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {seoHtml,seoEndpoint} from '../backend/node/seo.mjs';
import {siteConfig} from '../backend/node/site-config.mjs';
const html='<html><head><title>Servicios | Rumbo</title><meta name="description" content="Anterior"></head></html>';
test('SEO is private until domain and publication are configured; personal routes never enter sitemap',async()=>{
 const original={...siteConfig};
 try{
  siteConfig.origin='';siteConfig.indexable=false;
  assert.match(seoHtml(html,'/servicios.html?seccion=privacidad'),/noindex,nofollow/);
  assert.match(seoHtml(html,'/servicios.html?seccion=privacidad'),/Política de privacidad/);
  siteConfig.origin='https://rumbo.example';siteConfig.indexable=true;
  const publicPage=seoHtml(html,'/viajes.html?pantalla=detalle-destino&destino=roatan&untrusted=ignored');
  assert.match(publicPage,/index,follow/);assert.match(publicPage,/og:image/);assert.doesNotMatch(publicPage,/untrusted/);
  assert.match(publicPage,/https:\/\/rumbo.example\/viajes.html\?pantalla=detalle-destino&amp;destino=roatan/);
  assert.match(seoHtml(html,'/servicios.html?seccion=historial'),/noindex,nofollow/);
  const result={};seoEndpoint({url:'/sitemap.xml',method:'GET'},{writeHead(status,headers){result.status=status;result.headers=headers;},end(body){result.body=body;}});
  assert.equal(result.status,200);assert.equal((result.body.match(/<loc>/g)||[]).length,85);
  assert.doesNotMatch(result.body,/historial|perfil|iniciar-sesion|registro|mi-viaje/);
  assert.doesNotMatch(seoHtml(html,'/servicios.html?seccion=%22%3E%3Cscript%3E'),/<script>/);
 }finally{Object.assign(siteConfig,original);}
 const pages=JSON.parse(await readFile(new URL('../config/seo-pages.json',import.meta.url),'utf8'));
 for(const page of Object.values(pages))if(page.image)await access(new URL('../public/'+page.image,import.meta.url));
});
