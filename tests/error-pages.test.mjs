import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {request} from 'node:http';
import {createApp} from '../server.mjs';

test('los errores de navegación son Rumbo; las API conservan JSON y HEAD no tiene cuerpo',async()=>{
  const server=createApp();await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const base=`http://127.0.0.1:${server.address().port}`;
  try{
    for(const [path,options,status] of [['/ruta/no-existe',{},404],['/%ZZ',{},400],['/index.html',{method:'POST'},405]]){
      const response=await fetch(base+path,options);assert.equal(response.status,status);
      assert.match(response.headers.get('content-type'),/text\/html/);
      const body=await response.text();assert.match(body,new RegExp('Error '+status));assert.match(body,/href="\/index.html"/);assert.match(body,/src="\/error.js"/);
      assert.doesNotMatch(body,/SQLSTATE|PDOException|stack trace/i);
    }
    const forbidden=await new Promise((resolve,reject)=>{const req=request(base,{headers:{host:'otro.example'}},res=>{let body='';res.on('data',chunk=>body+=chunk);res.on('end',()=>resolve({status:res.statusCode,body}));});req.on('error',reject);req.end();});
    assert.equal(forbidden.status,403);assert.match(forbidden.body,/Error 403/);
    const api=await fetch(base+'/api/no-existe');assert.equal(api.status,404);assert.ok((await api.json()).error);
    const head=await fetch(base+'/ruta/no-existe',{method:'HEAD'});assert.equal(head.status,404);assert.equal(await head.text(),'');
  }finally{await new Promise(r=>server.close(r));}
});

test('Live Server conserva la vista si PHP no responde y rechaza redirecciones externas',async()=>{
  const source=await readFile(new URL('../public/connection.js',import.meta.url),'utf8');
  const redirects=[];
  const scope={window:{},document:{getElementById:()=>null},URL,AbortSignal,fetch:async()=>{throw new Error('offline');},location:{protocol:'http:',hostname:'127.0.0.1',port:'5500',pathname:'/tienda.html',search:'',hash:'',replace:url=>redirects.push(url)}};
  vm.runInNewContext(source,scope);
  assert.equal(await scope.window.RumboConnect(),false);assert.deepEqual(redirects,[]);
  scope.fetch=async()=>({ok:true,json:async()=>({app:'rumbo-viajes',backend:'php'})});
  assert.equal(await scope.window.RumboConnect('https://otro.example/'),false);
  assert.equal(await scope.window.RumboConnect('/.env'),false);assert.deepEqual(redirects,[]);
});
