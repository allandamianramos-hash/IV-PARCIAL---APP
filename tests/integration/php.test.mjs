import {test} from 'node:test';
import assert from 'node:assert/strict';
import {randomBytes, randomUUID} from 'node:crypto';
import {loadEnvFile} from 'node:process';
import {getDb,closeDb} from '../../backend/node/db.mjs';
import {passwordHash,passwordMatches} from '../../backend/node/auth-api.mjs';
try {loadEnvFile(new URL('../../.env',import.meta.url));} catch(e) {if(e.code!=='ENOENT')throw e;}
const origin=process.env.PHP_TEST_ORIGIN||'http://127.0.0.1:8000';
test('PHP + SQL Server: registro, login, persistencia, aislamiento y compatibilidad',async()=>{
 const owners=new Set(),users=new Set();
 const {pool,sql}=await getDb();
 const request=async(path,{cookie='',method='GET',body,headers={}}={})=>fetch(origin+path,{method,headers:{Cookie:cookie,Origin:origin,'Content-Type':'application/json',...headers},body:body===undefined?undefined:JSON.stringify(body)});
 const page=async(cookie='')=>{const r=await request('/',{cookie});assert.equal(r.status,200);const html=await r.text();const boot=JSON.parse(html.match(/id="rumbo-bootstrap" type="application\/json">(.*?)<\/script>/s)[1]);assert.equal(boot.connected,true);owners.add(boot.visitor);return {boot,cookie:cookie||r.headers.getSetCookie().map(c=>c.split(';')[0]).join('; ')};};
 const session=r=>r.headers.getSetCookie().filter(c=>c.startsWith('rumbo_session=')).map(c=>c.split(';')[0]).join('; ');
 try {
  assert.equal((await (await request('/api/health')).json()).backend,'php');
  const guest=await page(),other=await page();
  assert.equal(guest.boot.catalog.products.length,100);assert.equal(guest.boot.catalog.destinations.length,18);
  assert.equal(guest.boot.catalog.destinations.reduce((n,d)=>n+d.hotels.length,0),90);
  const key='rumbo.profile.v1',value={alias:'Prueba PHP ñ',preference:'cultura'};
  const put=(cookie,owner,revision=0,extra={})=>request('/api/state',{cookie,method:'PUT',headers:{'X-Rumbo-Visitor':owner,...extra},body:{changes:{[key]:{value,revision}}}});
  assert.equal((await put(guest.cookie,guest.boot.visitor)).status,200);
  assert.equal((await put(guest.cookie,guest.boot.visitor)).status,409);
  assert.equal((await put(guest.cookie,other.boot.visitor,1)).status,409);
  assert.equal((await put(guest.cookie,guest.boot.visitor,1,{Origin:'https://example.invalid'})).status,403);
  assert.deepEqual((await (await request('/api/state',{cookie:other.cookie})).json()).state,{});
  const email=`php-${randomUUID()}@example.test`,password=randomBytes(20).toString('hex');
  let r=await request('/api/auth/register',{cookie:guest.cookie,method:'POST',body:{name:'Prueba PHP',email,password}});
  assert.equal(r.status,201,await r.clone().text());const account=await r.json();users.add(account.user.id);const cookie=session(r);assert.ok(cookie);
  const signed=await page(cookie);assert.notEqual(signed.boot.visitor,guest.boot.visitor);assert.deepEqual(signed.boot.state[key].value,value);
  const stored=(await pool.request().input('id',sql.UniqueIdentifier,account.user.id).query('SELECT PasswordHash FROM dbo.RumboUsers WHERE Id=@id')).recordset[0].PasswordHash;
  assert.notEqual(stored,password);assert.equal(await passwordMatches(password,stored),true);assert.equal(await passwordMatches(password+'x',stored),false);
  r=await request('/api/auth/register',{method:'POST',body:{name:'Prueba PHP',email,password}});assert.equal(r.status,409);
  r=await request('/api/auth/logout',{cookie,method:'POST',body:{}});assert.equal(r.status,200);
  assert.equal((await (await request('/api/auth/me',{cookie})).json()).user,null);
  r=await request('/api/auth/login',{method:'POST',body:{email,password:'incorrecta'}});assert.equal(r.status,401);
  r=await request('/api/auth/login',{method:'POST',body:{email,password}});assert.equal(r.status,200);const newCookie=session(r);assert.notEqual(newCookie,cookie);
  const saved=await (await request('/api/state',{cookie:newCookie})).json();assert.deepEqual(saved.state[key].value,value);
  // Verify every state key against the PHP validator and actual SQL persistence.
  const values={
   'rumbo.store.cart.v2':[{id:1,quantity:2,options:{}}], 'rumbo.store.favorites.v2':[1,2],
   'rumbo.integrante2.viaje.v1':{destinationId:'roatan',travelers:2,nights:3,rooms:1},
   'rumbo.services.v1':[{section:'guias',title:'Guía',detail:'Prueba',total:10,values:{people:'2'}}],
   'rumbo.checkout.v1':{demo:true,signature:'test',code:'test',date:'2026-10-01'},
   'rumbo.no-flight.v1':'Sin vuelo', 'rumbo.departureChecklist.v1':['equipaje']};
  r=await request('/api/state',{cookie:newCookie,method:'PUT',headers:{'X-Rumbo-Visitor':signed.boot.visitor},body:{changes:Object.fromEntries(Object.entries(values).map(([k,v])=>[k,{value:v,revision:0}]))}});assert.equal(r.status,200,await r.clone().text());
  const rows=(await (await request('/api/state',{cookie:newCookie})).json()).state;
  for(const [k,v]of Object.entries(values))assert.deepEqual(rows[k].value,v);
  const legacy=await passwordHash(password);
  await pool.request().input('id',sql.UniqueIdentifier,account.user.id).input('hash',sql.VarChar(200),legacy).query('UPDATE dbo.RumboUsers SET PasswordHash=@hash WHERE Id=@id');
  r=await request('/api/auth/login',{method:'POST',body:{email,password}});assert.equal(r.status,200,await r.clone().text());
  for(const path of ['/.env','/backend/php/conexion.php','/database/INSTALAR_BD_VIAJES.sql','/package.json','/scripts/configurar-php.ps1'])assert.equal((await request(path)).status,404);
 } finally {
  for(const id of users){await pool.request().input('id',sql.UniqueIdentifier,id).query('DELETE dbo.RumboSessions WHERE UserId=@id; DELETE dbo.RumboUsers WHERE Id=@id;');}
  for(const id of owners){await pool.request().input('id',sql.UniqueIdentifier,id).query('DELETE dbo.RumboVisitors WHERE Id=@id AND NOT EXISTS(SELECT 1 FROM dbo.RumboUsers WHERE VisitorId=@id)');}
  await closeDb();
 }
});
