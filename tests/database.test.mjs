import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validState, safeJson } from '../backend/node/database-api.mjs';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
const clientSource=await readFile(new URL('database-client.js', new URL('../public/', import.meta.url)),'utf8');
function client(boot, data=new Map(), fetchImpl=async()=>Response.json({revisions:{'rumbo.profile.v1':1}})){
  const nodes=[];
  const scope={window:{addEventListener(){}},navigator:{},AbortSignal,location:{protocol:'http:',hostname:'127.0.0.1',pathname:'/public/tienda.html',search:'?categoria=viaje',reload(){}},fetch:fetchImpl,clearTimeout(){},setTimeout(){return 1;},localStorage:{getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)},document:{getElementById:()=>boot?({textContent:JSON.stringify(boot)}):null,addEventListener(){},body:{append(){}},createElement:()=>{const n={setAttribute(){},append(){},addEventListener(type,fn){this[type]=fn;}};nodes.push(n);return n;}}};
  vm.runInNewContext(clientSource,scope);
  return {storage:scope.window.RumboStorage,nodes,data,location:scope.location};
}

test('vista estatica indica como conectar y conserva selecciones locales',async()=>{
  let calls=0;
  const c=client(null,new Map(),async()=>{calls++;});
  c.storage.setItem('rumbo.profile.v1',JSON.stringify({alias:'Ana',preference:'playa'}));
  await c.storage.flush();assert.equal(calls,0);
  assert.match(c.nodes[1].textContent,/modo local/);
  assert.equal(c.nodes[2].textContent,'Abrir versión conectada');await c.nodes[2].click();
  assert.equal(c.location.href,'error.html?code=offline');
  assert.ok(c.data.get('rumbo.sync.pending.v1').includes('Ana'));
});

test('una caida SQL conserva el borrador y nunca anuncia guardado en SQL',async()=>{
  let calls=0;const c=client({connected:false,reason:'unavailable'},new Map(),async()=>{calls++;});
  c.storage.setItem('rumbo.profile.v1',JSON.stringify({alias:'Ana',preference:'playa'}));
  await c.storage.flush();assert.equal(calls,0);assert.match(c.nodes[1].textContent,/Sin conexión a la base de datos/);
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
