import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadEnvFile } from 'node:process';
import { createApp } from '../../server.mjs';
import { closeDb, getDb, dbEnabled } from '../../backend/node/db.mjs';
try{loadEnvFile(new URL('../../.env',import.meta.url));}catch(e){if(e.code!=='ENOENT')throw e;}
test('SQL Server: catálogo, aislamiento, guardado, conflictos y eliminaciones',{skip:!dbEnabled()},async()=>{
  let aiInput;
  const server=createApp({apiKey:'test-only',fetchImpl:async(url,request)=>{aiInput=JSON.parse(request.body);return Response.json({choices:[{message:{content:'Puedes explorar Roatán.'},finish_reason:'stop'}]});}});await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const origin=`http://127.0.0.1:${server.address().port}`,visitors=[];
  const page=async()=>{const res=await fetch(origin);assert.equal(res.status,200);const html=await res.text();const boot=JSON.parse(html.match(/id="rumbo-bootstrap" type="application\/json">(.*?)<\/script>/s)[1]);assert.equal(boot.connected,true);visitors.push(boot.visitor);return {cookie:res.headers.get('set-cookie').split(';')[0],boot};};
  try{
    const a=await page(),b=await page();assert.notEqual(a.cookie,b.cookie);
    assert.equal(a.boot.catalog.products.length,100);assert.equal(a.boot.catalog.destinations.length,18);
    assert.equal(typeof a.boot.catalog.products[0].price,'number');
    assert.equal(typeof a.boot.catalog.destinations[0].hotels[0].rate,'number');
    assert.equal(a.boot.catalog.destinations.reduce((n,d)=>n+d.hotels.length,0),90);
    const values={
      'rumbo.profile.v1':{alias:'Prueba SQL ñ <script>',preference:'cultura'},
      'rumbo.store.cart.v2':[{id:1,quantity:2,options:{}}],
      'rumbo.store.favorites.v2':[1,2],
      'rumbo.integrante2.viaje.v1':{destinationId:'roatan',origin:'Tegucigalpa',travelers:2,nights:3,rooms:1},
      'rumbo.services.v1':[{section:'traslados',title:'Traslado',detail:'Prueba',total:750,values:{date:'2026-12-01',people:'2'}}],
      'rumbo.checkout.v1':{signature:'demo',demo:true,code:'TEST',date:new Date().toISOString()},
      'rumbo.no-flight.v1':'roatan|2026-12-01|Tegucigalpa',
      'rumbo.departureChecklist.v1':['documentos']
    };
    const put=(changes,cookie=a.cookie,headers={})=>fetch(origin+'/api/state',{method:'PUT',headers:{Origin:origin,Cookie:cookie,'X-Rumbo-Visitor':a.boot.visitor,'Content-Type':'application/json',...headers},body:JSON.stringify({changes})});
    const changes=Object.fromEntries(Object.entries(values).map(([k,value])=>[k,{value,revision:0}]));
    assert.equal((await put(changes,a.cookie,{Origin:'https://evil.example'})).status,403);
    assert.equal((await put(changes,'')).status,401);
    assert.equal((await put({'unknown':{value:1,revision:0}})).status,400);
    assert.equal((await put(changes)).status,200);
    const read=async(cookie)=>{const r=await fetch(origin+'/api/state',{headers:{Cookie:cookie}});assert.equal(r.status,200);return (await r.json()).state;};
    const saved=await read(a.cookie);for(const [key,value]of Object.entries(values))assert.deepEqual(saved[key].value,value);
    assert.deepEqual(await read(b.cookie),{});
    assert.equal((await put(changes)).status,409);
    assert.equal((await put({'rumbo.profile.v1':{value:null,revision:1}})).status,200);
    assert.equal((await read(a.cookie))['rumbo.profile.v1'].value,null);
    const reload=await fetch(origin+'/servicios.html?seccion=mi-viaje',{headers:{Cookie:a.cookie}});
    const boot=JSON.parse((await reload.text()).match(/id="rumbo-bootstrap" type="application\/json">(.*?)<\/script>/s)[1]);
    assert.deepEqual(boot.state['rumbo.store.cart.v2'].value,values['rumbo.store.cart.v2']);
    assert.equal(boot.state['rumbo.profile.v1'].revision,2);
    for(const path of ['/db.mjs','/.env','/database/manage.mjs','/database/migrations/001_initial.sql'])assert.equal((await fetch(origin+path)).status,404);
    const chat=await fetch(origin+'/api/chat',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify({message:'Hoteles en Roatán',history:[]})});
    assert.equal(chat.status,200);assert.ok(aiInput.messages[0].content.includes(a.boot.catalog.products[0].name));
  }finally{
    await new Promise(r=>server.close(r));
    const {pool,sql}=await getDb();for(const id of visitors)await pool.request().input('id',sql.UniqueIdentifier,id).query('DELETE dbo.RumboVisitors WHERE Id=@id');
    await closeDb();
  }
});
