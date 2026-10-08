import {test} from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID,randomBytes} from 'node:crypto';
import {loadEnvFile} from 'node:process';
import {getDb,closeDb} from '../../backend/node/db.mjs';
import {createApp} from '../../server.mjs';
loadEnvFile(new URL('../../.env',import.meta.url));
test('PHP and Node: deleting a selected review preserves other reviews and checks ownership',async()=>{
 const server=createApp({apiKey:'unused'});await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const {pool,sql}=await getDb();const users=[],visitors=[];
 try{for(const origin of [process.env.PHP_TEST_ORIGIN||'http://127.0.0.1:8000',`http://127.0.0.1:${server.address().port}`]){
  const request=(path,method='GET',cookie='',body,headers={})=>fetch(origin+path,{method,headers:{Origin:origin,Cookie:cookie,'Content-Type':'application/json',...headers},body:body===undefined?undefined:JSON.stringify(body)});
  async function account(){const r=await request('/api/auth/register','POST','',{name:'Prueba reseñas',email:`review-${randomUUID()}@example.test`,password:randomBytes(24).toString('hex')});assert.equal(r.status,201,await r.clone().text());const data=await r.json();users.push(data.user.id);const row=(await pool.request().input('id',sql.UniqueIdentifier,data.user.id).query('SELECT VisitorId FROM dbo.RumboUsers WHERE Id=@id')).recordset[0];visitors.push(row.VisitorId);return {id:data.user.id,cookie:r.headers.getSetCookie().map(c=>c.split(';')[0]).join('; ')};}
  const a=await account(),b=await account();
  const ids=[];
  for(const user of [a,a,b]){const r=await request('/api/reviews','POST',user.cookie,{rating:5,comment:'Reseña temporal de prueba '+user.id});assert.equal(r.status,200);ids.push((await r.json()).id);}
  assert.equal(new Set(ids).size,3);
  assert.equal((await (await request('/api/reviews','GET',a.cookie)).json()).hasOwnReview,true);
  assert.equal((await request('/api/reviews','DELETE')).status,401);
  assert.equal((await request('/api/reviews','DELETE',a.cookie,undefined,{Origin:'https://foreign.invalid'})).status,403);
  assert.equal((await request('/api/reviews','DELETE',a.cookie)).status,400);
  assert.equal((await request('/api/reviews?id='+ids[0]+'&owner='+a.id,'DELETE',b.cookie,{key:ids[0],userId:a.id})).status,404);
  const result=await request('/api/reviews?id='+ids[0],'DELETE',a.cookie);assert.equal(result.status,200);assert.equal((await result.json()).deleted,true);
  assert.equal((await request('/api/reviews?id='+ids[0],'DELETE',a.cookie)).status,404);
  assert.equal((await (await request('/api/reviews','GET',a.cookie)).json()).hasOwnReview,true);
  assert.equal((await (await request('/api/reviews','GET',b.cookie)).json()).hasOwnReview,true);
  const rows=await pool.request().input('key',sql.VarChar(80),'review:'+a.id+':%').query('SELECT Name FROM dbo.RumboSettings WHERE Name LIKE @key');assert.deepEqual(rows.recordset.map(row=>row.Name),[ids[1]]);
  assert.equal((await request('/api/reviews?id='+ids[1],'DELETE',a.cookie)).status,200);
  assert.equal((await (await request('/api/reviews','GET',a.cookie)).json()).hasOwnReview,false);
 }}finally{
  for(const id of users)await pool.request().input('id',sql.UniqueIdentifier,id).input('key',sql.VarChar(80),'review:'+id).query("DELETE dbo.RumboSettings WHERE Name=@key OR Name LIKE @key+':%'; DELETE dbo.RumboSessions WHERE UserId=@id; DELETE dbo.RumboUsers WHERE Id=@id;");
  for(const id of visitors)await pool.request().input('id',sql.UniqueIdentifier,id).query('DELETE dbo.RumboVisitors WHERE Id=@id AND NOT EXISTS(SELECT 1 FROM dbo.RumboUsers WHERE VisitorId=@id)');
  await new Promise(r=>server.close(r));await closeDb();
 }
});
