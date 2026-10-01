import { test } from 'node:test';
import assert from 'node:assert/strict';
import { passwordHash, passwordMatches, validCredentials, publicUser } from './auth-api.mjs';
import { createApp } from './server.mjs';

test('las contraseñas usan sal aleatoria y rechazan claves incorrectas',async()=>{
  const a=await passwordHash('Contraseña de prueba 123'),b=await passwordHash('Contraseña de prueba 123');
  assert.notEqual(a,b);
  assert.ok(!a.includes('Contraseña'));
  assert.equal(await passwordMatches('Contraseña de prueba 123',a),true);
  assert.equal(await passwordMatches('otra contraseña',a),false);
  assert.equal(await passwordMatches('otra contraseña',null),false);
});
test('valida registro y no expone hash ni identidad interna de guardado',()=>{
  const data={name:'María López',email:'maria@example.com',password:'12345678'};
  assert.equal(validCredentials(data,true),true);
  for(const bad of [{name:''},{name:'x'},{email:'sin-correo'},{password:'corta'},{password:'a'.repeat(129)},{name:'a\nb'}])assert.equal(validCredentials({...data,...bad},true),false);
  assert.deepEqual(publicUser({Id:'id',FullName:'María',Email:'m@example.com',PasswordHash:'private',VisitorId:'private'}),{id:'id',name:'María',email:'m@example.com'});
});
test('páginas públicas y errores seguros sin conexión a SQL Server',async()=>{
  const previous=process.env.DB_ENABLED;process.env.DB_ENABLED='false';
  const server=createApp();await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const origin=`http://127.0.0.1:${server.address().port}`;
  try{
    for(const path of ['/registro.html','/iniciar-sesion.html']){
      const r=await fetch(origin+path);assert.equal(r.status,200);
      const html=await r.text();assert.ok(html.includes('auth-client.js'));assert.ok(html.includes('id="auth-form"'));
    }
    for(const path of ['register','login','logout']){
      const r=await fetch(origin+'/api/auth/'+path,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:'{}'});
      assert.equal(r.status,503);assert.equal(r.headers.get('set-cookie'),null);assert.ok((await r.json()).error);
    }
    assert.equal((await fetch(origin+'/api/auth/register')).status,405);
    for(const path of ['/auth-api.mjs','/database/migrations/002_accounts.sql'])assert.equal((await fetch(origin+path)).status,404);
  }finally{await new Promise(r=>server.close(r));if(previous===undefined)delete process.env.DB_ENABLED;else process.env.DB_ENABLED=previous;}
});
