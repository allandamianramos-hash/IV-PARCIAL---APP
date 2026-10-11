import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPairSync, createSign } from 'node:crypto';
import { OAuth2Client } from 'google-auth-library';
import { verifyGoogleIdentity, validGoogleClientId } from '../backend/node/google-identity.mjs';
import { createApp } from '../server.mjs';

const clientId='123456789-test.apps.googleusercontent.com', nonce='a'.repeat(64);
const keys=generateKeyPairSync('rsa',{modulusLength:2048});
const verifier=new OAuth2Client();
verifier.getFederatedSignonCertsAsync=async()=>({certs:{test:keys.publicKey.export({type:'spki',format:'pem'})},format:'PEM'});
const now=Math.floor(Date.now()/1000);
const claims={iss:'https://accounts.google.com',aud:clientId,sub:'12345678901234567890',email:'test@example.invalid',email_verified:true,name:'Viajera',iat:now,exp:now+600,nonce};
function signed(changes={},key=keys.privateKey){
  const data=[{alg:'RS256',kid:'test'},{...claims,...changes}].map(x=>Buffer.from(JSON.stringify(x)).toString('base64url')).join('.');
  return data+'.'+createSign('RSA-SHA256').update(data).sign(key,'base64url');
}
test('Google: firma real, audiencia, emisor, expiración, correo y nonce',async()=>{
  assert.deepEqual(await verifyGoogleIdentity(signed(),clientId,nonce,verifier),{sub:claims.sub,email:claims.email,name:'Viajera'});
  for(const change of [{aud:'otro-cliente'},{iss:'https://attacker.invalid'},{exp:now-1},{nonce:'b'.repeat(64)},{email_verified:false},{email:'sin-correo'},{sub:''}])
    await assert.rejects(verifyGoogleIdentity(signed(change),clientId,nonce,verifier));
  const other=generateKeyPairSync('rsa',{modulusLength:2048});
  await assert.rejects(verifyGoogleIdentity(signed({},other.privateKey),clientId,nonce,verifier));
  await assert.rejects(verifyGoogleIdentity(signed(),clientId,'',verifier));
  await assert.rejects(verifyGoogleIdentity('not.a.token',clientId,nonce,verifier));
  assert.equal(validGoogleClientId(clientId),true);assert.equal(validGoogleClientId(''),false);
});

test('Google API: rechaza CSRF, formatos inválidos y tokens sin emitir sesión',async()=>{
  const previous={DB_ENABLED:process.env.DB_ENABLED,GOOGLE_CLIENT_ID:process.env.GOOGLE_CLIENT_ID,APP_ORIGIN:process.env.APP_ORIGIN};
  process.env.DB_ENABLED='true';process.env.GOOGLE_CLIENT_ID=clientId;delete process.env.APP_ORIGIN;
  const server=createApp();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const origin=`http://127.0.0.1:${server.address().port}`;
  const post=(body,headers={})=>fetch(origin+'/api/auth/google',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json',...headers},body});
  try {
    for(const [body,headers,status] of [
      ['{}',{Origin:'https://attacker.invalid'},403],
      ['{}',{'Content-Type':'text/plain'},415],
      ['invalid',{},400],['{}',{},401],
      [JSON.stringify({credential:'invalid'}),{Cookie:'rumbo_google_nonce='+nonce},401],
      [JSON.stringify({credential:'a'.repeat(17000)}),{},413]
    ]){const response=await post(body,headers);assert.equal(response.status,status);assert.equal(response.headers.get('set-cookie'),null);}
    assert.equal((await fetch(origin+'/api/auth/google')).status,405);
    assert.equal((await fetch(origin+'/api/auth/google/config',{headers:{Origin:'https://attacker.invalid'}})).status,403);
    delete process.env.GOOGLE_CLIENT_ID;
    assert.deepEqual(await(await fetch(origin+'/api/auth/google/config')).json(),{enabled:false});
  } finally {
    await new Promise(resolve=>server.close(resolve));
    for(const [key,value]of Object.entries(previous)){if(value===undefined)delete process.env[key];else process.env[key]=value;}
  }
});
