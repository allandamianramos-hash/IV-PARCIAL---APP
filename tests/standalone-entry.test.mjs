import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
const source=await readFile(new URL('../public/js/compartido/connection.js',import.meta.url),'utf8');
const settle=()=>new Promise(resolve=>setImmediate(resolve));
function preview({location={},health={app:'rumbo-viajes',backend:'php'},fetchImpl,storage,connected=true}={}){
 const redirects=[],requests=[];
 const scope={URL,AbortSignal,document:{readyState:'complete'},window:{RumboStorage:storage,RumboDatabase:{connected}},
  location:{protocol:'http:',hostname:'127.0.0.1',port:'5500',pathname:'/public/servicios.html',search:'?seccion=mi-viaje',hash:'#perfil',...location,replace:url=>redirects.push(url)},
  fetch:async(url,options)=>{requests.push(url);return fetchImpl?fetchImpl(url,options):{ok:true,json:async()=>health};}};
 vm.runInNewContext(source,scope);return {scope,redirects,requests};
}
test('Go Live pasa al servidor independiente y conserva la página, parámetros y ancla',async()=>{
 const p=preview();await settle();
 assert.deepEqual(p.redirects,['http://127.0.0.1:8000/servicios.html?seccion=mi-viaje#perfil']);
 assert.deepEqual(p.requests,['http://127.0.0.1:8000/api/health']);
 const home=preview({location:{hostname:'localhost',pathname:'/',search:'',hash:''}});await settle();
 assert.deepEqual(home.redirects,['http://localhost:8000/index.html']);
});
test('espera al guardado y no abandona cambios locales o pendientes de recuperación',async()=>{
 let finish,pending=true;
 const p=preview({storage:{hasPending:()=>pending,flush:()=>new Promise(resolve=>{finish=()=>{pending=false;resolve(true);};})}});
 await settle();assert.deepEqual(p.redirects,[]);finish();await settle();assert.equal(p.redirects.length,1);
 for(const connected of [true,false]){
  const blocked=preview({connected,storage:{hasPending:()=>true,flush:async()=>false}});await settle();assert.deepEqual(blocked.redirects,[]);
 }
});
test('no navega si falla PHP, responde otra aplicación o cambia la página durante la comprobación',async()=>{
 for(const options of [{fetchImpl:async()=>{throw Error('offline');}},{health:{app:'other',backend:'php'}},{health:{app:'rumbo-viajes',backend:'node'}}]){
  const p=preview(options);await settle();assert.deepEqual(p.redirects,[]);
 }
 const p=preview();p.scope.location.pathname='/error.html';await settle();assert.deepEqual(p.redirects,[]);
});
test('no crea bucles ni redirige instalaciones publicadas, archivos o rutas privadas',async()=>{
 for(const location of [{port:'8000'},{port:'3000'},{hostname:'example.com'},{protocol:'file:'},{pathname:'/.env'},{pathname:'/error.html'}]){
  const p=preview({location});await settle();assert.deepEqual(p.redirects,[]);assert.deepEqual(p.requests,[]);
 }
});
