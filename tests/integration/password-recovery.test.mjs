import {test} from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID,createHash} from 'node:crypto';
import bcrypt from 'bcryptjs';
import {createApp} from '../../server.mjs';
import {getDb,closeDb} from '../../backend/node/db.mjs';
import {passwordRecovery,validNewPassword} from '../../backend/node/password-recovery.mjs';
try{process.loadEnvFile(new URL('../../.env',import.meta.url));}catch{}

test('recuperación SQL: caducidad, intentos, códigos de un uso y revocación de sesiones',async()=>{
 const email=`recovery-${randomUUID()}@example.invalid`,unknown=`unknown-${randomUUID()}@example.invalid`;
 const password='Una contraseña temporal 2026!';
 const {pool,sql}=await getDb();const server=createApp();
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin=`http://127.0.0.1:${server.address().port}`;
 const post=(path,body)=>fetch(origin+'/api/auth/'+path,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify(body)});
 let code='',sends=0;
 const options={configured:true,minimumDelayMs:0,send:async(to,value)=>{assert.equal(to,email);code=value;sends++;}};
 const recover=(action,body)=>passwordRecovery(action,body,options);
 const row=id=>pool.request().input('id',sql.Char(64),id).query('SELECT * FROM dbo.RumboPasswordResets WHERE Id=@id');
 const clear=()=>pool.request().input('email',sql.NVarChar(254),email).query('DELETE dbo.RumboPasswordResets WHERE UserId IN(SELECT Id FROM dbo.RumboUsers WHERE Email=@email)');
 const bad=fn=>assert.rejects(fn,e=>e.status===400);
 try{
  assert.equal((await post('register',{name:'Prueba de recuperación',email,password})).status,201);
  const requested=await recover('request',{email:email.toUpperCase()});assert.match(requested.requestId,/^[a-f0-9]{64}$/);assert.match(code,/^\d{6}$/);
  const stored=(await row(requested.requestId)).recordset[0];assert.notEqual(stored.CodeHash,code);assert.equal(stored.Delivered,true);
  await assert.rejects(()=>recover('request',{email}),e=>e.status===429);
  const absent=await recover('request',{email:unknown});assert.equal(absent.message,requested.message);assert.equal(sends,1);assert.equal((await row(absent.requestId)).recordset[0].UserId,null);
  await bad(()=>recover('verify',{requestId:absent.requestId,code}));
  await bad(()=>recover('verify',{requestId:requested.requestId,code:code==='000000'?'111111':'000000'}));
  const {resetToken}=await recover('verify',{requestId:requested.requestId,code});
  await bad(()=>recover('verify',{requestId:requested.requestId,code}));
  await bad(()=>recover('reset',{requestId:requested.requestId,resetToken,password:'corta'}));
  await bad(()=>recover('reset',{requestId:requested.requestId,resetToken:'f'.repeat(64),password}));
  const replacement=password+' nueva';await recover('reset',{requestId:requested.requestId,resetToken,password:replacement});
  const user=(await pool.request().input('email',sql.NVarChar(254),email).query('SELECT PasswordHash,(SELECT COUNT(*) FROM dbo.RumboSessions s WHERE s.UserId=u.Id) AS Sessions FROM dbo.RumboUsers u WHERE Email=@email')).recordset[0];
  assert.ok(await bcrypt.compare(replacement,user.PasswordHash));assert.equal(user.Sessions,0);
  await bad(()=>recover('reset',{requestId:requested.requestId,resetToken,password}));
  assert.equal((await post('login',{email,password})).status,401);assert.equal((await post('login',{email,password:replacement})).status,200);
  await clear();const locked=await recover('request',{email});
  const wrong=code==='000000'?'111111':'000000';for(let i=0;i<5;i++)await bad(()=>recover('verify',{requestId:locked.requestId,code:wrong}));
  await bad(()=>recover('verify',{requestId:locked.requestId,code}));
  await clear();const expired=await recover('request',{email});
  await pool.request().input('id',sql.Char(64),expired.requestId).query('UPDATE dbo.RumboPasswordResets SET ExpiresAt=DATEADD(second,-1,SYSUTCDATETIME()) WHERE Id=@id');
  await bad(()=>recover('verify',{requestId:expired.requestId,code}));
  await clear();const grant=await recover('request',{email});const verified=await recover('verify',{requestId:grant.requestId,code});
  await pool.request().input('id',sql.Char(64),grant.requestId).query('UPDATE dbo.RumboPasswordResets SET ExpiresAt=DATEADD(second,-1,SYSUTCDATETIME()) WHERE Id=@id');
  await bad(()=>recover('reset',{requestId:grant.requestId,...verified,password}));
  await clear();const failed=await passwordRecovery('request',{email},{...options,send:async()=>{throw Error('simulated delivery failure');}});
  assert.equal(failed.message,requested.message);assert.equal((await row(failed.requestId)).recordset[0].CodeHash,null);
  await clear();await pool.request().input('email',sql.NVarChar(254),email).query("UPDATE dbo.RumboUsers SET PasswordHash='microsoft:external' WHERE Email=@email");
  const before=sends,social=await recover('request',{email});assert.equal(social.message,requested.message);assert.equal(sends,before);
  assert.equal((await fetch(origin+'/api/auth/password/request',{method:'POST',headers:{Origin:'https://foreign.invalid','Content-Type':'application/json'},body:JSON.stringify({email})})).status,403);
  assert.equal(validNewPassword('é'.repeat(37)),false);assert.equal(validNewPassword('a'.repeat(72)),true);
 }finally{
  await new Promise(r=>server.close(r));
  for(const value of [email,unknown])await pool.request().input('hash',sql.Char(64),createHash('sha256').update(value).digest('hex')).query('DELETE dbo.RumboPasswordResets WHERE EmailHash=@hash');
  await pool.request().input('email',sql.NVarChar(254),email).query('DECLARE @visitor uniqueidentifier;SELECT @visitor=VisitorId FROM dbo.RumboUsers WHERE Email=@email;DELETE dbo.RumboSessions WHERE UserId IN(SELECT Id FROM dbo.RumboUsers WHERE Email=@email);DELETE dbo.RumboUsers WHERE Email=@email;DELETE dbo.RumboVisitors WHERE Id=@visitor;');
  await closeDb();
 }
});
