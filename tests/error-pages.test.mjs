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
      const body=await response.text();assert.match(body,new RegExp('Error '+status));assert.match(body,/href="\/index.html"/);assert.match(body,/src="\/js\/compartido\/error.js"/);
      assert.doesNotMatch(body,/SQLSTATE|PDOException|stack trace/i);
    }
    const forbidden=await new Promise((resolve,reject)=>{const req=request(base,{headers:{host:'otro.example'}},res=>{let body='';res.on('data',chunk=>body+=chunk);res.on('end',()=>resolve({status:res.statusCode,body}));});req.on('error',reject);req.end();});
    assert.equal(forbidden.status,403);assert.match(forbidden.body,/Error 403/);
    const api=await fetch(base+'/api/no-existe');assert.equal(api.status,404);assert.ok((await api.json()).error);
    const head=await fetch(base+'/ruta/no-existe',{method:'HEAD'});assert.equal(head.status,404);assert.equal(await head.text(),'');
  }finally{await new Promise(r=>server.close(r));}
});

test('Live Server conserva la vista si PHP no responde y rechaza redirecciones externas',async()=>{
  const source=await readFile(new URL('../public/js/compartido/connection.js',import.meta.url),'utf8');
  const redirects=[];
  const scope={window:{},document:{getElementById:()=>null},URL,AbortSignal,fetch:async()=>{throw new Error('offline');},location:{protocol:'http:',hostname:'127.0.0.1',port:'5500',pathname:'/tienda.html',search:'',hash:'',replace:url=>redirects.push(url)}};
  vm.runInNewContext(source,scope);
  assert.equal(await scope.window.RumboConnect(),false);assert.deepEqual(redirects,[]);
  scope.fetch=async()=>({ok:true,json:async()=>({app:'rumbo-viajes',backend:'php'})});
  assert.equal(await scope.window.RumboConnect('https://otro.example/'),false);
  assert.equal(await scope.window.RumboConnect('/.env'),false);assert.deepEqual(redirects,[]);
});

const errorSource=await readFile(new URL('../public/js/compartido/error.js',import.meta.url),'utf8');
function errorPage(code,fetchImpl,data=new Map(),returnTo='servicios.html?seccion=mi-viaje#plan'){
  const elements=new Map(),redirects=[],calls=[];
  const node=()=>({children:[],textContent:'',hidden:true,append(...children){this.children.push(...children);},replaceChildren(...children){this.children=children;},addEventListener(type,fn){this[type]=fn;}});
  const get=id=>{if(!elements.has(id))elements.set(id,node());return elements.get(id);};
  get('error-number').textContent='404';
  const query=new URLSearchParams({code,returnTo});
  const scope={window:{},navigator:{},URL,URLSearchParams,AbortSignal,
    document:{getElementById:get,createElement:node},
    location:{href:'http://127.0.0.1:3000/error.html?'+query,search:'?'+query,replace:url=>redirects.push(url),reload:()=>redirects.push('reload')},
    localStorage:{getItem:key=>data.get(key)??null,setItem:(key,value)=>data.set(key,value),removeItem:key=>data.delete(key)},
    fetch:async(path,options)=>{calls.push({path,options});return fetchImpl(path,options);}
  };
  vm.runInNewContext(errorSource,scope);
  return {get,redirects,calls,data,scope};
}
const profile='rumbo.profile.v1',queue='rumbo.sync.pending.v1';
const draft=()=>new Map([['rumbo.sync.visitor.v1','a'],[queue,JSON.stringify({[profile]:{value:{alias:'Mi selección',preference:'playa'},revision:1}})]]);
const stateResponse=()=>Response.json({visitor:'a',state:{[profile]:{value:{alias:'Guardada',preference:'cultura'},revision:2}}});

test('la página de conexión no muestra 404 y el reintento comprueba SQL sin bucle',async()=>{
  const p=errorPage('database',async()=>Response.json({connected:false},{status:503}));
  assert.equal(p.get('error-number').textContent,'503');assert.match(p.get('error-title').textContent,/pausa/);
  assert.equal(p.calls.length,0);await p.get('retry').click();
  assert.deepEqual(p.calls.map(c=>c.path),['/api/database']);assert.deepEqual(p.redirects,[]);
  assert.match(p.get('error-help').textContent,/conectar/);assert.equal(p.get('retry').disabled,false);
});

test('al recuperar SQL vuelve al origen y bloquea destinos externos y páginas de error',async()=>{
  for(const [target,expected]of [['viajes.html?destino=roatan#hoteles','http://127.0.0.1:3000/viajes.html?destino=roatan#hoteles'],['https://otro.example/','http://127.0.0.1:3000/index.html'],['//otro.example/','http://127.0.0.1:3000/index.html'],['error.html?code=database','http://127.0.0.1:3000/index.html'],['/.env','http://127.0.0.1:3000/index.html']]){
    const p=errorPage('database',async()=>Response.json({connected:true}),new Map(),target);
    await p.get('retry').click();assert.deepEqual(p.redirects,[expected]);
  }
});

test('recuperación de guardado exige confirmación completa antes de vaciar la cola',async()=>{
  for(const acknowledged of [false,true]){
    const data=draft();
    const p=errorPage('save',async(path,options)=>{
      if(path==='/api/database')return Response.json({connected:true});
      if(options.method==='PUT')return Response.json({revisions:acknowledged?{[profile]:2}:{}});
      return Response.json({visitor:'a',state:{[profile]:{value:{alias:'Antes',preference:'playa'},revision:1}}});
    },data);
    await p.get('retry').click();
    assert.equal(p.redirects.length,acknowledged?1:0);assert.equal(data.get(queue)==='{}',acknowledged);
  }
});

test('conflictos permiten comparar antes de guardar y conservan el borrador al fallar',async()=>{
  const data=draft();let puts=0;
  const p=errorPage('conflict',async(path,options)=>{
    if(path==='/api/database')return Response.json({connected:true});
    if(options.method==='PUT'){puts++;assert.equal(JSON.parse(options.body).changes[profile].revision,2);return Response.json({error:'new conflict'},{status:409});}
    return stateResponse();
  },data);
  await p.get('retry').click();assert.equal(puts,0);assert.equal(p.get('conflict-review').hidden,false);
  assert.match(p.get('conflict-choices').children[0].children[2].textContent,/Mi selección/);
  await p.get('keep-local').click();assert.equal(puts,1);assert.ok(data.get(queue).includes('Mi selección'));assert.deepEqual(p.redirects,[]);
});

test('un aviso 409 antiguo se recupera sin elegir entre dos versiones idénticas',async()=>{
  const data=draft(),value=JSON.parse(data.get(queue))[profile].value;
  const p=errorPage('conflict',async path=>path==='/api/database'?Response.json({connected:true}):Response.json({visitor:'a',state:{[profile]:{value,revision:2}}}),data);
  await p.get('retry').click();assert.equal(data.get(queue),'{}');assert.equal(p.redirects.length,1);assert.equal(p.get('conflict-review').hidden,true);assert.equal(p.calls.filter(c=>c.options.method==='PUT').length,0);
});

test('usar la versión guardada es explícito y conserva una copia del borrador',async()=>{
  const data=draft();
  const p=errorPage('conflict',async path=>path==='/api/database'?Response.json({connected:true}):stateResponse(),data);
  await p.get('retry').click();assert.ok(data.get(queue).includes('Mi selección'));
  await p.get('use-saved').click();assert.equal(data.get(queue),'{}');
  assert.equal(JSON.parse(data.get(profile)).alias,'Guardada');assert.ok(data.get('rumbo.sync.recovery.v1').includes('Mi selección'));assert.equal(p.redirects.length,1);
});

test('la recuperación no envía el borrador a una sesión diferente',async()=>{
  const data=draft();
  const p=errorPage('save',async path=>path==='/api/database'?Response.json({connected:true}):Response.json({visitor:'otra',state:{}}),data);
  await p.get('retry').click();assert.equal(p.calls.filter(c=>c.options.method==='PUT').length,0);
  assert.ok(data.get(queue).includes('Mi selección'));assert.deepEqual(p.redirects,[]);assert.equal(p.get('error-number').textContent,'401');
});

test('sesión vencida: el borrador reaparece solo en la cuenta original y exige elección explícita',async()=>{
  const databaseSource=await readFile(new URL('../public/js/compartido/database-client.js',import.meta.url),'utf8');
  const data=draft(),savedValue={alias:'Antes',preference:'cultura'};
  let savedState={value:savedValue,revision:1},writes=0;
  const backend=async(path,options={})=>{
    if(path==='/api/database')return Response.json({connected:true});
    if(options.method==='PUT'){
      writes++;const change=JSON.parse(options.body).changes[profile];
      assert.equal(options.headers['X-Rumbo-Visitor'],'a');
      savedState={value:change.value,revision:change.revision+1};
      return Response.json({revisions:{[profile]:savedState.revision}});
    }
    return Response.json({visitor:'a',state:{[profile]:savedState}});
  };
  function visit(visitor,fetchImpl=backend){
    const redirects=[],boot={connected:true,visitor,state:visitor==='a'?{[profile]:savedState}:{}};
    const scope={window:{addEventListener(){}},navigator:{},URLSearchParams,AbortSignal,
      location:{pathname:'/index.html',search:'',hash:'',replace:url=>redirects.push(url)},
      document:{getElementById:()=>({textContent:JSON.stringify(boot)}),addEventListener(){}},
      localStorage:{getItem:key=>data.get(key)??null,setItem:(key,value)=>data.set(key,value),removeItem:key=>data.delete(key)},
      fetch:fetchImpl,clearTimeout(){},setTimeout(){return 1;}};
    vm.runInNewContext(databaseSource,scope);
    return {storage:scope.window.RumboStorage,redirects};
  }
  const expired=visit('a',async()=>Response.json({error:'Sesión vencida'},{status:401}));
  assert.equal(await expired.storage.flush(),false);assert.match(expired.redirects[0],/code=session/);
  const login=visit('guest');assert.equal(login.storage.getItem(profile),null);assert.equal(data.get(queue),'{}');
  assert.ok(data.get('rumbo.sync.recovery.v1').includes('Mi selección'));assert.deepEqual(login.redirects,[]);
  const other=visit('b');assert.equal(other.storage.getItem(profile),null);assert.deepEqual(other.redirects,[]);
  // Successful login clears session keys but deliberately preserves archived drafts.
  data.delete('rumbo.sync.visitor.v1');data.delete(queue);
  const recovered=visit('a');assert.match(recovered.redirects[0],/code=recovery/);
  assert.equal(await recovered.storage.flush(),false);assert.equal(writes,0);
  const reload=visit('a');assert.match(reload.redirects[0],/code=conflict/);
  assert.equal(await reload.storage.flush(),false);assert.equal(writes,0);
  const review=errorPage('recovery',backend,data);await review.get('retry').click();
  assert.equal(writes,0);assert.equal(review.get('conflict-review').hidden,false);
  assert.match(review.get('conflict-choices').children[0].children[2].textContent,/Mi selección/);
  await review.get('keep-local').click();assert.equal(writes,1);assert.equal(data.get(queue),'{}');
  assert.equal(savedState.value.alias,'Mi selección');assert.equal(review.redirects.length,1);
  const complete=visit('a');assert.deepEqual(complete.redirects,[]);assert.equal(complete.storage.hasPending(),false);
});

test('la página de sesión ofrece acceso a la recuperación de cuenta',()=>{
  const p=errorPage('session',async()=>Response.json({}));
  assert.equal(p.get('services-link').hidden,false);assert.equal(p.get('services-link').href,'iniciar-sesion.html');
});
