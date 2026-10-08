import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validState, safeJson } from '../backend/node/database-api.mjs';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
const clientSource=await readFile(new URL('js/compartido/database-client.js', new URL('../public/', import.meta.url)),'utf8');
function client(boot, data=new Map(), fetchImpl=async()=>Response.json({revisions:{'rumbo.profile.v1':1}})){
  const nodes=[],events={},redirects=[];
  const scope={window:{addEventListener(){}},navigator:{},AbortSignal,URLSearchParams,location:{origin:'http://127.0.0.1',protocol:'http:',hostname:'127.0.0.1',pathname:'/public/tienda.html',search:'?categoria=viaje',hash:'#seleccion',reload(){},replace:url=>redirects.push(url)},fetch:fetchImpl,clearTimeout(){},setTimeout(){return 1;},localStorage:{getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)},document:{getElementById:()=>boot?({textContent:JSON.stringify(boot)}):null,addEventListener:(type,fn)=>events[type]=fn,body:{append(){}},createElement:()=>{const n={setAttribute(){},append(){},addEventListener(type,fn){this[type]=fn;}};nodes.push(n);return n;}}};
  vm.runInNewContext(clientSource,scope);
  return {storage:scope.window.RumboStorage,nodes,data,location:scope.location,events,redirects};
}

test('vista estática conserva selecciones sin banner ni redirección automática',async()=>{
  let calls=0;
  const c=client(null,new Map(),async()=>{calls++;});
  c.storage.setItem('rumbo.profile.v1',JSON.stringify({alias:'Ana',preference:'playa'}));
  await c.storage.flush();assert.equal(calls,0);
  assert.equal(c.nodes.length,0);
  assert.deepEqual(c.redirects,[]);
  assert.ok(c.data.get('rumbo.sync.pending.v1').includes('Ana'));
});

test('una caída SQL abre error personalizado y conserva el destino y el borrador',async()=>{
  let calls=0;const c=client({connected:false,reason:'unavailable'},new Map(),async()=>{calls++;});
  c.storage.setItem('rumbo.profile.v1',JSON.stringify({alias:'Ana',preference:'playa'}));
  assert.equal(await c.storage.flush(),false);assert.equal(calls,0);assert.equal(c.nodes.length,0);
  assert.equal(c.redirects.length,1);
  const target=new URL(c.redirects[0],'http://127.0.0.1/');
  assert.equal(target.searchParams.get('code'),'database');
  assert.equal(target.searchParams.get('returnTo'),'tienda.html?categoria=viaje#seleccion');
  assert.ok(c.storage.hasPending());
});
test('recupera un cambio pendiente después de una caída y recarga',async()=>{
  const boot={connected:true,visitor:'a',state:{}},data=new Map();
  const first=client(boot,data,async()=>{throw Error('Sin red');});
  first.storage.setItem('rumbo.profile.v1',JSON.stringify({alias:'Ana',preference:'playa'}));
  await first.storage.flush();
  assert.ok(data.get('rumbo.sync.pending.v1').includes('Ana'));
  const second=client(boot,data);await second.storage.flush();
  assert.equal(data.get('rumbo.sync.pending.v1'),'{}');
  assert.equal(JSON.parse(second.storage.getItem('rumbo.profile.v1')).alias,'Ana');
  assert.equal(second.nodes.length,0);assert.deepEqual(second.redirects,[]);
});
test('el servidor restaura datos sin caché local y conserva eliminaciones',()=>{
  const key='rumbo.profile.v1';
  const restored=client({connected:true,visitor:'a',state:{[key]:{value:{alias:'Ana',preference:'cultura'},revision:2}}});
  assert.equal(JSON.parse(restored.storage.getItem(key)).alias,'Ana');
  const deleted=client({connected:true,visitor:'a',state:{[key]:{value:null,revision:3}}},restored.data);
  assert.equal(deleted.storage.getItem(key),null);
  assert.equal(deleted.data.get('rumbo.sync.pending.v1'),'{}');
});
test('un visitante nuevo no hereda caché ni cambios del visitante anterior',()=>{
  const data=new Map([['rumbo.sync.visitor.v1','anterior'],['rumbo.profile.v1','{"alias":"Privado","preference":"playa"}']]);
  const next=client({connected:true,visitor:'nuevo',state:{}},data);
  assert.equal(next.storage.getItem('rumbo.profile.v1'),null);
});
test('un conflicto conserva el borrador local y no sobrescribe el servidor',async()=>{
  const data=new Map([['rumbo.sync.pending.v1',JSON.stringify({'rumbo.profile.v1':{value:{alias:'Borrador',preference:'playa'},revision:1}})]]);
  let calls=0;
  const c=client({connected:true,visitor:'a',state:{'rumbo.profile.v1':{value:{alias:'Nuevo',preference:'playa'},revision:2}}},data,async()=>{calls++;});
  await c.storage.flush();assert.equal(calls,0);
  assert.equal(JSON.parse(c.storage.getItem('rumbo.profile.v1')).alias,'Borrador');
  assert.match(c.redirects[0],/code=conflict/);assert.ok(c.storage.hasPending());
});

test('409 y respuestas incompletas conservan la cola sin anunciar éxito',async()=>{
  for(const response of [()=>Response.json({error:'conflict'},{status:409}),()=>Response.json({revisions:{}})]){
    const c=client({connected:true,visitor:'a',state:{}},new Map(),async()=>response());
    c.storage.setItem('rumbo.profile.v1',JSON.stringify({alias:'Ana',preference:'playa'}));
    assert.equal(await c.storage.flush(),false);assert.ok(c.storage.hasPending());assert.equal(c.redirects.length,1);
  }
});

test('la navegación espera al guardado en curso y nunca reemplaza su página de error',async()=>{
  let settle;
  const c=client({connected:true,visitor:'a',state:{}},new Map(),()=>new Promise(resolve=>settle=resolve));
  c.storage.setItem('rumbo.profile.v1',JSON.stringify({alias:'Ana',preference:'playa'}));
  const saving=c.storage.flush();await Promise.resolve();
  let prevented=false;
  const link={href:'http://127.0.0.1/servicios.html',origin:'http://127.0.0.1',pathname:'/servicios.html',search:'',hasAttribute:()=>false};
  const navigation=c.events.click({button:0,target:{closest:()=>link},preventDefault(){prevented=true;}});
  assert.equal(prevented,true);assert.equal(c.location.href,undefined);
  settle(Response.json({error:'offline'},{status:503}));await saving;await navigation;
  assert.equal(c.location.href,undefined);assert.match(c.redirects[0],/code=save/);assert.ok(c.storage.hasPending());
});

test('la navegación continúa únicamente después de confirmar todos los cambios',async()=>{
  const c=client({connected:true,visitor:'a',state:{}});
  c.storage.setItem('rumbo.profile.v1',JSON.stringify({alias:'Ana',preference:'playa'}));
  const link={href:'http://127.0.0.1/servicios.html',origin:'http://127.0.0.1',pathname:'/servicios.html',search:'',hasAttribute:()=>false};
  await c.events.click({button:0,target:{closest:()=>link},preventDefault(){}});
  assert.equal(c.location.href,link.href);assert.equal(c.storage.hasPending(),false);
});

test('abrir de nuevo la misma selección no guarda otra versión del viaje',async()=>{
  const key='rumbo.integrante2.viaje.v1',value={destinationId:'roatan',travelers:2};let calls=0;
  const c=client({connected:true,visitor:'a',state:{[key]:{value,revision:3}}},new Map(),async()=>{calls++;});
  c.storage.setItem(key,JSON.stringify(value));
  assert.equal(await c.storage.flush(),true);assert.equal(calls,0);assert.equal(c.storage.hasPending(),false);
});

test('una confirmación perdida se reconoce sin sobrescribir ni mostrar un falso 409',async()=>{
  const key='rumbo.integrante2.viaje.v1',value={destinationId:'paris',travelers:2};const methods=[];
  const c=client({connected:true,visitor:'a',state:{}},new Map(),async(url,options)=>{
    methods.push(options.method||'GET');
    return options.method==='PUT'?Response.json({error:'conflict'},{status:409}):Response.json({visitor:'a',state:{[key]:{value,revision:1}}});
  });
  c.storage.setItem(key,JSON.stringify(value));
  assert.equal(await c.storage.flush(),true);assert.deepEqual(methods,['PUT','GET']);assert.equal(c.storage.hasPending(),false);assert.deepEqual(c.redirects,[]);
});

test('una versión nueva con el mismo contenido permite guardar el destino elegido',async()=>{
  const key='rumbo.integrante2.viaje.v1',base={destinationId:'roatan'},value={destinationId:'paris'};let puts=0;
  const c=client({connected:true,visitor:'a',state:{[key]:{value:base,revision:1}}},new Map(),async(url,options)=>{
    if(options.method!=='PUT')return Response.json({visitor:'a',state:{[key]:{value:base,revision:2}}});
    const change=JSON.parse(options.body).changes[key];puts++;assert.deepEqual(change.value,value);
    if(puts===1){assert.equal(change.revision,1);return Response.json({error:'conflict'},{status:409});}
    assert.equal(change.revision,2);return Response.json({revisions:{[key]:3}});
  });
  c.storage.setItem(key,JSON.stringify(value));assert.equal(await c.storage.flush(),true);assert.equal(puts,2);assert.deepEqual(c.redirects,[]);
});

test('una selección realmente distinta conserva el conflicto y el borrador',async()=>{
  const key='rumbo.integrante2.viaje.v1';let puts=0;
  const c=client({connected:true,visitor:'a',state:{[key]:{value:{destinationId:'roatan'},revision:1}}},new Map(),async(url,options)=>{
    if(options.method==='PUT'){puts++;return Response.json({error:'conflict'},{status:409});}
    return Response.json({visitor:'a',state:{[key]:{value:{destinationId:'osaka'},revision:2}}});
  });
  c.storage.setItem(key,JSON.stringify({destinationId:'paris'}));assert.equal(await c.storage.flush(),false);assert.equal(puts,1);assert.match(c.redirects[0],/code=conflict/);assert.equal(JSON.parse(c.storage.getItem(key)).destinationId,'paris');assert.equal(c.storage.hasPending(),true);
});

test('la reconciliación rechaza otra sesión y limita los reintentos',async()=>{
  const key='rumbo.integrante2.viaje.v1';
  for(const visitor of ['a','b']){
    let puts=0;
    const c=client({connected:true,visitor:'a',state:{}},new Map(),async(url,options)=>{
      if(options.method==='PUT'){puts++;return Response.json({error:'conflict'},{status:409});}
      return Response.json({visitor,state:{}});
    });
    c.storage.setItem(key,JSON.stringify({destinationId:'paris'}));assert.equal(await c.storage.flush(),false);assert.equal(puts,visitor==='a'?2:1);assert.equal(c.storage.hasPending(),true);assert.match(c.redirects[0],visitor==='a'?/code=conflict/:/code=session/);
  }
});

test('los botones esperan el guardado antes de pasar de destino a vuelos',async()=>{
  let settle;
  const key='rumbo.integrante2.viaje.v1',c=client({connected:true,visitor:'a',state:{}},new Map(),()=>new Promise(resolve=>settle=resolve));
  c.storage.setItem(key,JSON.stringify({destinationId:'paris'}));const navigation=c.storage.navigate('viajes.html?pantalla=vuelos');await Promise.resolve();
  assert.equal(c.location.href,undefined);settle(Response.json({revisions:{[key]:1}}));await navigation;assert.equal(c.location.href,'viajes.html?pantalla=vuelos');assert.equal(c.storage.hasPending(),false);
});

test('otra pestaña no guarda automáticamente un borrador que requiere revisión',async()=>{
  let requests=0;
  const c=client({connected:true,visitor:'a',state:{}},new Map(),async()=>{requests++;});
  c.data.set('rumbo.sync.pending.v1',JSON.stringify({'rumbo.profile.v1':{value:{alias:'Recuperada',preference:'playa'},revision:0,needsReview:true}}));
  assert.equal(await c.storage.flush(),false);assert.equal(requests,0);assert.ok(c.storage.hasPending());assert.match(c.redirects[0],/code=recovery/);
});
test('solo permite selecciones conocidas y limita los datos de visitante',()=>{
  assert.ok(validState('rumbo.profile.v1',{alias:'José',preference:'playa'}));
  assert.ok(validState('rumbo.profile.v1',null));
  assert.equal(validState('password','x'),false);
  assert.equal(validState('rumbo.profile.v1',{alias:'x',preference:'playa',password:'x'}),false);
  assert.equal(validState('rumbo.store.cart.v2',[{id:1,quantity:-1,options:{}}]),false);
  assert.equal(validState('rumbo.store.cart.v2',[{id:1,quantity:1,options:{x:{}}}]),false);
  assert.equal(validState('rumbo.checkout.v1',{demo:false,code:'paid'}),false);
  assert.equal(validState('rumbo.integrante2.viaje.v1',{travelers:99}),false);
  assert.ok(validState('rumbo.integrante2.viaje.v1',{travelers:2,destinationId:'roatan'}));
});
test('los datos incrustados no pueden cerrar el script HTML',()=>{
  const value={alias:'</script><script>alert(1)</script>&'};
  assert.ok(!safeJson(value).includes('<'));
  assert.deepEqual(JSON.parse(safeJson(value)),value);
});
