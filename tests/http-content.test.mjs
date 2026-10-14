import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {createApp} from '../server.mjs';
import {sendContent} from '../backend/node/http-content.mjs';

test('compresión sin pérdida y revalidación de imágenes, scripts y estilos',async()=>{
  const server=createApp();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const origin=`http://127.0.0.1:${server.address().port}`;
  try{
    for(const path of ['js/destinos/guias-catalogo.js','css/destinos/viajes.css','imagenes-viajes/portadas/hero-premium-venecia.jpg']){
      const original=await readFile(new URL('../public/'+path,import.meta.url));
      const response=await fetch(origin+'/'+path,{headers:{'Accept-Encoding':'gzip'}});
      assert.equal(response.status,200);assert.deepEqual(Buffer.from(await response.arrayBuffer()),original);
      assert.match(response.headers.get('cache-control'),/must-revalidate/);
      assert.equal(response.headers.get('vary'),'Accept-Encoding');
      if(path.endsWith('.jpg'))assert.equal(response.headers.get('content-encoding'),null);
      else{assert.equal(response.headers.get('content-encoding'),'gzip');assert.ok(Number(response.headers.get('content-length'))<original.length/2);}
      const cached=await fetch(origin+'/'+path,{headers:{'Accept-Encoding':'gzip','If-None-Match':response.headers.get('etag')}});
      assert.equal(cached.status,304);assert.equal((await cached.arrayBuffer()).byteLength,0);
      const plain=await fetch(origin+'/'+path,{headers:{'Accept-Encoding':'gzip;q=0, *;q=1'}});
      assert.equal(plain.headers.get('content-encoding'),null);assert.deepEqual(Buffer.from(await plain.arrayBuffer()),original);
      const head=await fetch(origin+'/'+path,{method:'HEAD',headers:{'Accept-Encoding':'gzip'}});
      assert.equal(head.headers.get('etag'),response.headers.get('etag'));assert.equal((await head.arrayBuffer()).byteLength,0);
    }
    const page=await fetch(origin+'/iniciar-sesion.html');
    assert.equal(page.headers.get('cache-control'),'no-store');assert.equal(page.headers.get('etag'),null);
    const account=await fetch(origin+'/api/auth/me');assert.equal(account.headers.get('cache-control'),'no-store');
  }finally{await new Promise(resolve=>server.close(resolve));}
});

test('un archivo modificado invalida su ETag aunque mantenga el mismo tamaño',async()=>{
  let body='a'.repeat(2048);
  const server=createServer((req,res)=>sendContent(req,res,body,'text/javascript',{cacheable:true}));
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const url=`http://127.0.0.1:${server.address().port}`;
  try{
    const first=await fetch(url);const etag=first.headers.get('etag');await first.text();
    body='b'.repeat(2048);
    const second=await fetch(url,{headers:{'If-None-Match':etag}});
    assert.equal(second.status,200);assert.notEqual(second.headers.get('etag'),etag);assert.equal(await second.text(),body);
  }finally{await new Promise(resolve=>server.close(resolve));}
});
