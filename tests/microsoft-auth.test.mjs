import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPairSync } from 'node:crypto';
import { SignJWT } from 'jose';
import { verifyMicrosoftIdentity, validMicrosoftClientId } from '../backend/node/microsoft-identity.mjs';
import { createApp } from '../server.mjs';

const clientId='fe9b2972-433b-4cc1-9e0e-f173f742c727', nonce='a'.repeat(64);
const tid='9188040d-6c67-4c5b-b112-36a304b66dad',oid='12345678-1234-1234-1234-123456789012';
const keys=generateKeyPairSync('rsa',{modulusLength:2048});
const now=Math.floor(Date.now()/1000);
const claims={iss:`https://login.microsoftonline.com/${tid}/v2.0`,tid,oid,ver:'2.0',aud:clientId,sub:'opaque-subject',email:'test@example.invalid',name:'Viajera',iat:now,exp:now+600,nonce};
const signed=(changes={},key=keys.privateKey)=>new SignJWT({...claims,...changes}).setProtectedHeader({alg:'RS256',kid:'test'}).sign(key);

test('Microsoft: firma, audiencia, emisor por inquilino, tiempo, nonce e identidad inmutable',async()=>{
  assert.deepEqual(await verifyMicrosoftIdentity(await signed(),clientId,nonce,keys.publicKey),{sub:tid+':'+oid,email:claims.email,name:'Viajera'});
  for(const change of [{aud:'otro-cliente'},{iss:'https://attacker.invalid'},{exp:now-1},{iat:now-3600},{nbf:now+600},{nonce:'b'.repeat(64)},{tid:'otro'},{oid:''},{ver:'1.0'},{iss:'https://login.microsoftonline.com/common/v2.0'},{exp:undefined}])
    await assert.rejects(verifyMicrosoftIdentity(await signed(change),clientId,nonce,keys.publicKey));
  const other=generateKeyPairSync('rsa',{modulusLength:2048});
  await assert.rejects(verifyMicrosoftIdentity(await signed({},other.privateKey),clientId,nonce,keys.publicKey));
  await assert.rejects(verifyMicrosoftIdentity(await signed(),clientId,'',keys.publicKey));
  await assert.rejects(verifyMicrosoftIdentity('not.a.token',clientId,nonce,keys.publicKey));
  assert.equal(validMicrosoftClientId(clientId),true);assert.equal(validMicrosoftClientId(''),false);
  const noEmail=await verifyMicrosoftIdentity(await signed({email:undefined}),clientId,nonce,keys.publicKey);
  assert.equal(noEmail.email,null);assert.equal(noEmail.sub,tid+':'+oid);
  const upn=await verifyMicrosoftIdentity(await signed({email:undefined,preferred_username:'TEST@example.invalid'}),clientId,nonce,keys.publicKey);
  assert.equal(upn.email,'test@example.invalid');
});

test('Microsoft API: CSRF, formatos y tokens inválidos nunca emiten sesión',async()=>{
  const previous={DB_ENABLED:process.env.DB_ENABLED,MICROSOFT_CLIENT_ID:process.env.MICROSOFT_CLIENT_ID,APP_ORIGIN:process.env.APP_ORIGIN};
  process.env.DB_ENABLED='true';process.env.MICROSOFT_CLIENT_ID=clientId;delete process.env.APP_ORIGIN;
  const server=createApp();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const origin=`http://127.0.0.1:${server.address().port}`;
  const post=(body,headers={})=>fetch(origin+'/api/auth/microsoft',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json',...headers},body});
  try {
    for(const [body,headers,status] of [
      ['{}',{Origin:'https://attacker.invalid'},403],['{}',{'Content-Type':'text/plain'},415],
      ['invalid',{},400],['{}',{},401],['null',{},401],
      [JSON.stringify({credential:'invalid'}),{Cookie:'rumbo_microsoft_nonce='+nonce},401],
      [JSON.stringify({credential:'a'.repeat(33000)}),{},413]
    ]){const response=await post(body,headers);assert.equal(response.status,status);assert.equal(response.headers.get('set-cookie'),null);}
    assert.equal((await fetch(origin+'/api/auth/microsoft')).status,405);
    assert.equal((await fetch(origin+'/api/auth/microsoft/config',{headers:{Origin:'https://attacker.invalid'}})).status,403);
    delete process.env.MICROSOFT_CLIENT_ID;
    assert.deepEqual(await(await fetch(origin+'/api/auth/microsoft/config')).json(),{enabled:false});
    const callback=await fetch(origin+'/microsoft-callback.html');
    assert.equal(callback.status,200);assert.doesNotMatch(await callback.text(),/rumbo-bootstrap/);
  } finally {
    await new Promise(resolve=>server.close(resolve));
    for(const [key,value]of Object.entries(previous)){if(value===undefined)delete process.env[key];else process.env[key]=value;}
  }
});
