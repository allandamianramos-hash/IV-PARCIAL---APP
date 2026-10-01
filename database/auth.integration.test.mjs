import {test} from 'node:test';
import assert from 'node:assert/strict';
import {loadEnvFile} from 'node:process';
import {randomUUID} from 'node:crypto';
import {createApp} from '../server.mjs';
import {getDb,closeDb,dbEnabled} from '../db.mjs';
try{loadEnvFile(new URL('../.env',import.meta.url));}catch(e){if(e.code!=='ENOENT')throw e;}
test('SQL: registro, duplicados, acceso, persistencia y revocación',{skip:!dbEnabled()},async()=>{
  const server=createApp();await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const origin=`http://127.0.0.1:${server.address().port}`,email=`test-${randomUUID()}@example.invalid`;
  const data={name:'Prueba automática',email,password:'Prueba temporal 456!'};
  const post=(path,body=data,cookie='')=>fetch(origin+'/api/auth/'+path,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json',Cookie:cookie},body:JSON.stringify(body)});
  const session=r=>r.headers.getSetCookie().find(v=>v.startsWith('rumbo_session=')).split(';')[0];
  const me=async cookie=>(await fetch(origin+'/api/auth/me',{headers:{Cookie:cookie}})).json();
  try{
    assert.equal((await fetch(origin+'/api/auth/register',{method:'POST',headers:{Origin:'https://other.example','Content-Type':'application/json'},body:JSON.stringify(data)})).status,403);
    const registered=await post('register');assert.equal(registered.status,201);
    const first=session(registered);assert.match(registered.headers.get('set-cookie'),/HttpOnly/);assert.match(registered.headers.get('set-cookie'),/Max-Age=2592000/);
    assert.equal((await me(first)).user.name,data.name);
    assert.equal((await post('register')).status,409);
    assert.equal((await post('login',{...data,password:'incorrecta'})).status,401);
    assert.equal((await post('login',{...data,email:'no-existe-'+email})).status,401);
    const login=await post('login',{...data,email:email.toUpperCase()},first);assert.equal(login.status,200);
    const second=session(login);assert.notEqual(first,second);assert.equal((await me(first)).user,null);
    const page=await fetch(origin+'/index.html',{headers:{Cookie:second}});
    const html=await page.text(),boot=JSON.parse(html.match(/id="rumbo-bootstrap" type="application\/json">(.*?)<\/script>/s)[1]);
    assert.equal(boot.user.email,email);assert.ok(boot.visitor);
    const save=await fetch(origin+'/api/state',{method:'PUT',headers:{Origin:origin,Cookie:second,'Content-Type':'application/json','X-Rumbo-Visitor':'stale-account'},body:JSON.stringify({changes:{'rumbo.profile.v1':{value:{alias:'Otro'},revision:0}}})});
    assert.equal(save.status,409);
    assert.equal((await post('logout',{},second)).status,200);assert.equal((await me(second)).user,null);
  }finally{
    await new Promise(r=>server.close(r));
    const {pool,sql}=await getDb();
    await pool.request().input('email',sql.NVarChar(254),email).query('DECLARE @visitor uniqueidentifier; SELECT @visitor=VisitorId FROM dbo.RumboUsers WHERE Email=@email; DELETE dbo.RumboSessions WHERE UserId IN(SELECT Id FROM dbo.RumboUsers WHERE Email=@email); DELETE dbo.RumboUsers WHERE Email=@email; DELETE dbo.RumboVisitors WHERE Id=@visitor;');
    await closeDb();
  }
});
