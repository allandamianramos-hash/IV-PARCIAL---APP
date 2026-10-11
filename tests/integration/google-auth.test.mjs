import {test} from 'node:test';
import assert from 'node:assert/strict';
import {randomBytes,createHash} from 'node:crypto';
import {spawn} from 'node:child_process';
import {getDb,closeDb} from '../../backend/node/db.mjs';
import {googleAccount,createGoogleChallenge} from '../../backend/node/google-accounts.mjs';
import {passwordMatches} from '../../backend/node/auth-api.mjs';
process.loadEnvFile(new URL('../../.env',import.meta.url));
const hash=x=>createHash('sha256').update(x).digest('hex');
const password='Contraseña de prueba social 2026!';

test('SQL Google: contraseña obligatoria, alta, legado, vinculación y bloqueo de intentos',async()=>{
 const {pool,sql}=await getDb();
 const identity={sub:'9'+BigInt('0x'+randomBytes(12).toString('hex')).toString(),email:`google-${randomBytes(10).toString('hex')}@example.invalid`,name:'Prueba Google'};
 const nonces=[];let owner,id;
 const challenge=async()=>{const n=await createGoogleChallenge({headers:{}});nonces.push(n);return n;};
 const call=(n,p,newPassword,i=identity)=>googleAccount(i,n,p,passwordMatches,newPassword);
 const bridge=async(n,p,newPassword)=>new Promise((resolve,reject)=>{
  const child=spawn(process.execPath,['backend/php/social-account.mjs'],{stdio:['pipe','pipe','pipe'],windowsHide:true});let output='';child.stdout.on('data',c=>output+=c);child.stderr.resume();child.on('error',reject);child.on('close',code=>code?reject(Error('Bridge failed')):resolve(JSON.parse(output)));child.stdin.end(JSON.stringify({provider:'google',identity,nonce:n,password:p,newPassword}));
 });
 try{
  const n=await challenge();
  await assert.rejects(call(n),e=>e.code==='RUMBO_PASSWORD_SETUP_REQUIRED'&&e.email===identity.email);
  assert.equal((await pool.request().input('email',sql.NVarChar(254),identity.email).query('SELECT Id FROM dbo.RumboUsers WHERE Email=@email')).recordset.length,0);
  await assert.rejects(call(n,undefined,'short'),e=>e.status===400);
  const first=await call(n,undefined,password);id=first.user.Id;assert.equal(first.created,true);assert.equal(first.user.PasswordHash,undefined);
  const row=(await pool.request().input('id',sql.UniqueIdentifier,id).query('SELECT VisitorId,PasswordHash FROM dbo.RumboUsers WHERE Id=@id')).recordset[0];owner=row.VisitorId;
  assert.match(row.PasswordHash,/^\$2[aby]\$12\$/);assert.ok(await passwordMatches(password,row.PasswordHash));
  await assert.rejects(call(n,password),e=>e.code==='Google_EXPIRED'.toUpperCase());
  const returning=await challenge();
  await assert.rejects(call(returning),e=>e.code==='RUMBO_PASSWORD_REQUIRED'&&e.email===identity.email);
  await assert.rejects(call(returning,undefined,undefined,{...identity,email:null}),e=>e.email===identity.email);
  await assert.rejects(call(returning,undefined,'Replacement password!'),e=>e.code==='RUMBO_PASSWORD_REQUIRED');
  await assert.rejects(call(returning,'incorrecta'),e=>e.status===401);
  assert.equal((await call(returning,password,undefined,{...identity,email:null})).user.Id,id);
  // PHP calls the same mandatory password gate after its independent JWT verifier.
  const bn=await challenge();const step=await bridge(bn);assert.equal(step.data.code,'RUMBO_PASSWORD_REQUIRED');assert.equal(step.data.email,identity.email);assert.equal(step.result,undefined);assert.equal((await bridge(bn,'incorrecta')).status,401);assert.equal((await bridge(bn,password)).status,200);
  await pool.request().input('id',sql.UniqueIdentifier,id).query('UPDATE dbo.RumboUsers SET GoogleSubject=NULL WHERE Id=@id');
  const link=await challenge();await assert.rejects(call(link),e=>e.code==='RUMBO_PASSWORD_REQUIRED');assert.equal((await call(link,password)).user.Id,id);
  await pool.request().input('id',sql.UniqueIdentifier,id).query("UPDATE dbo.RumboUsers SET PasswordHash='!google-only' WHERE Id=@id");
  const legacy=await challenge();await assert.rejects(call(legacy),e=>e.code==='RUMBO_PASSWORD_SETUP_REQUIRED');assert.equal((await call(legacy,undefined,password)).user.Id,id);
  // Email match alone must not let another social identity choose/reset a password.
  await pool.request().input('id',sql.UniqueIdentifier,id).query("UPDATE dbo.RumboUsers SET GoogleSubject=NULL,PasswordHash='!other-only' WHERE Id=@id");
  const conflict=await challenge();await assert.rejects(call(conflict,undefined,password),e=>e.code==='RUMBO_EXISTING_PROVIDER_REQUIRED');
  await pool.request().input('id',sql.UniqueIdentifier,id).input('sub',sql.VarChar(255),identity.sub).input('pw',sql.VarChar(200),row.PasswordHash).query('UPDATE dbo.RumboUsers SET GoogleSubject=@sub,PasswordHash=@pw WHERE Id=@id');
  const rateKey=hash('password:'+identity.email);await pool.request().input('key',sql.Char(64),rateKey).query('DELETE dbo.RumboAuthAttempts WHERE IpHash=@key');
  for(let i=0;i<10;i++)await assert.rejects(call(await challenge(),'incorrecta'),e=>e.status===401);
  await assert.rejects(call(await challenge(),password),e=>e.status===429);
 }finally{
  if(id){await pool.request().input('id',sql.UniqueIdentifier,id).input('key',sql.Char(64),hash('password:'+identity.email)).query('DELETE dbo.RumboSessions WHERE UserId=@id; DELETE dbo.RumboUsers WHERE Id=@id; DELETE dbo.RumboAuthAttempts WHERE IpHash=@key;');}
  if(owner)await pool.request().input('owner',sql.UniqueIdentifier,owner).query('DELETE dbo.RumboVisitors WHERE Id=@owner');
  for(const n of nonces)await pool.request().input('hash',sql.Char(64),hash(n)).query('DELETE dbo.RumboGoogleChallenges WHERE NonceHash=@hash');
  await closeDb();
 }
});
