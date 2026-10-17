import {test} from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID,randomBytes} from 'node:crypto';
import {getDb,closeDb} from '../../backend/node/db.mjs';
import {createApp} from '../../server.mjs';
process.loadEnvFile(new URL('../../.env',import.meta.url));
test('PHP and Node: durable isolated receipts, retry safety, validation and immutable history',async()=>{
 const server=createApp();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const origins=[process.env.PHP_TEST_ORIGIN||'http://127.0.0.1:8000',`http://127.0.0.1:${server.address().port}`];
 const {pool,sql}=await getDb(),users=[],owners=[];
 try{
  for(const origin of origins){
   const request=(path,method='GET',body,cookie='',headers={})=>fetch(origin+path,{method,headers:{Origin:origin,Cookie:cookie,'Content-Type':'application/json',...headers},body:body===undefined?undefined:JSON.stringify(body)});
   const json=async response=>{assert.ok(response.ok,await response.clone().text());return response.json();};
   async function account(){
    const response=await request('/api/auth/register','POST',{name:'Prueba compras',email:`checkout-${randomUUID()}@example.test`,password:randomBytes(24).toString('hex')});
    const data=await json(response);users.push(data.user.id);const cookie=response.headers.getSetCookie().map(c=>c.split(';')[0]).join('; ');
    const state=await json(await request('/api/state','GET',undefined,cookie));owners.push(state.visitor);return {cookie,owner:state.visitor};
   }
   const a=await account(),b=await account();
   const catalog=await json(await request('/api/catalog'));
   const product=catalog.products[0],options=Object.fromEntries(Object.entries(catalog.productOptions[product.id]||{}).map(([k,v])=>[k,v[0]]));
   const save=async(changes)=>json(await request('/api/state','PUT',{changes},a.cookie,{'X-Rumbo-Visitor':a.owner}));
   await save({'rumbo.store.cart.v2':{value:[{id:product.id,quantity:2,options}],revision:0}});
   assert.equal((await request('/api/checkout?kind=store')).status,401);
   const {quote}=await json(await request('/api/checkout?kind=store','GET',undefined,a.cookie));assert.equal(quote.items.length,1);assert.equal(quote.currency,'HNL');assert.equal(quote.demo,true);
   assert.equal((await request('/api/checkout','POST',{kind:'store',fingerprint:quote.fingerprint,card:'should-never-store'},a.cookie)).status,400);
   assert.equal((await request('/api/checkout','POST',{kind:'store',fingerprint:quote.fingerprint},a.cookie,{Origin:'https://foreign.invalid'})).status,403);
   const body={kind:'store',fingerprint:quote.fingerprint};
   const concurrent=await Promise.all([request('/api/checkout','POST',body,a.cookie),request('/api/checkout','POST',body,a.cookie)]);
   const orders=await Promise.all(concurrent.map(json));assert.equal(orders[0].order.id,orders[1].order.id);assert.equal(orders[0].order.total,quote.total);
   const history=await json(await request('/api/orders','GET',undefined,a.cookie));assert.equal(history.orders.length,1);
   assert.equal((await json(await request('/api/orders?owner='+a.owner,'GET',undefined,b.cookie))).orders.length,0);
   await save({'rumbo.store.cart.v2':{value:[],revision:1}});
   const retry=await json(await request('/api/checkout','POST',body,a.cookie));assert.equal(retry.order.id,orders[0].order.id);
   assert.equal((await request('/api/checkout?kind=store','GET',undefined,a.cookie)).status,400);
   const trip={destinationId:'roatan',origin:'Tegucigalpa',date:'2099-10-12',checkIn:'2099-10-12',travelers:1,nights:3,cabin:'economica',rooms:1,roomType:'estandar',flightId:'roatan-0-0',hotelId:'paradise'};
   await save({'rumbo.integrante2.viaje.v1':{value:trip,revision:0}});
   const travel=await json(await request('/api/checkout?kind=trip','GET',undefined,a.cookie));assert.equal(travel.quote.items.length,2);
   await save({'rumbo.integrante2.viaje.v1':{value:{...trip,nights:4},revision:1}});
   assert.equal((await request('/api/checkout','POST',{kind:'trip',fingerprint:travel.quote.fingerprint},a.cookie)).status,409);
   const updated=await json(await request('/api/checkout?kind=trip','GET',undefined,a.cookie));
   const paid=await json(await request('/api/checkout','POST',{kind:'trip',fingerprint:updated.quote.fingerprint},a.cookie));
   assert.equal(paid.order.trip.destinationId,'roatan');assert.equal(paid.order.status,'simulated');
   await save({'rumbo.integrante2.viaje.v1':{value:{},revision:2}});
   const final=await json(await request('/api/orders','GET',undefined,a.cookie));assert.equal(final.orders.length,2);assert.equal(final.orders[0].total,paid.order.total);
   assert.equal((await json(await request('/api/orders?kind=store','GET',undefined,a.cookie))).orders.length,1);
   assert.equal((await request('/api/orders?before=bad','GET',undefined,a.cookie)).status,400);
   console.log(new URL(origin).port+': tienda y viaje guardados; aislamiento y reintentos verificados.');
  }
 }finally{
  for(const id of users)await pool.request().input('id',sql.UniqueIdentifier,id).query('DELETE dbo.RumboOrders WHERE UserId=@id; DELETE dbo.RumboSessions WHERE UserId=@id; DELETE dbo.RumboUsers WHERE Id=@id;');
  for(const id of owners)await pool.request().input('id',sql.UniqueIdentifier,id).query('DELETE dbo.RumboVisitorState WHERE VisitorId=@id; DELETE dbo.RumboVisitors WHERE Id=@id;');
  await new Promise(resolve=>server.close(resolve));await closeDb();
 }
});
