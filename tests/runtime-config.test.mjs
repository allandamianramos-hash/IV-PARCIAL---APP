import {test} from 'node:test';
import assert from 'node:assert/strict';
import {runtimeConfig} from '../backend/node/runtime-config.mjs';
const production = {NODE_ENV:'production',APP_ORIGIN:'https://rumbo.example',DB_ENABLED:'true',DB_AUTH:'sql',DB_SERVER:'example.database.windows.net',DB_NAME:'rumbo',DB_USER:'app',DB_PASSWORD:'test-only'};
test('producción escucha en la interfaz del alojamiento y desarrollo sigue siendo local',()=>{
  assert.deepEqual(runtimeConfig({}),{host:'127.0.0.1',port:3000});
  assert.deepEqual(runtimeConfig({...production,PORT:'8080'}),{host:'0.0.0.0',port:8080});
  assert.equal(runtimeConfig({...production,HOST:'127.0.0.1'}).host,'127.0.0.1');
});
test('producción rechaza configuración insegura o incompleta antes de escuchar',()=>{
  for(const APP_ORIGIN of ['', 'http://rumbo.example','https://rumbo.example/','https://rumbo.example/path','https://user:password@rumbo.example']) {
    assert.throws(()=>runtimeConfig({...production,APP_ORIGIN}),/APP_ORIGIN/);
  }
  for(const key of ['DB_ENABLED','DB_AUTH','DB_SERVER','DB_NAME','DB_USER','DB_PASSWORD']) assert.throws(()=>runtimeConfig({...production,[key]:''}),/SQL/);
  assert.throws(()=>runtimeConfig({...production,DB_TRUST_CERTIFICATE:'true'}),/certificado/);
  for(const PORT of ['0','-1','65536','abc','3.5'])assert.throws(()=>runtimeConfig({PORT}),/PORT/);
});
