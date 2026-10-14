import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {loadEnvFile} from 'node:process';
import {randomUUID} from 'node:crypto';
import {getDb,closeDb} from '../../backend/node/db.mjs';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const origin=process.env.PHP_TEST_ORIGIN||'http://127.0.0.1:8000';
try{loadEnvFile(new URL('../../.env',import.meta.url));}catch(error){if(error.code!=='ENOENT')throw error;}

test('PHP entrega los mismos bytes comprimidos y reutiliza archivos con 304',async()=>{
  for(const path of ['js/destinos/guias-catalogo.js','css/destinos/viajes.css','imagenes-viajes/portadas/hero-premium-venecia.jpg']){
    const original=await readFile(new URL('../../public/'+path,import.meta.url));
    const response=await fetch(origin+'/'+path,{headers:{'Accept-Encoding':'gzip'}});
    assert.equal(response.status,200);assert.deepEqual(Buffer.from(await response.arrayBuffer()),original);
    assert.match(response.headers.get('cache-control'),/must-revalidate/);
    const cached=await fetch(origin+'/'+path,{headers:{'Accept-Encoding':'gzip','If-None-Match':response.headers.get('etag')}});
    assert.equal(cached.status,304);assert.equal((await cached.arrayBuffer()).byteLength,0);
    if(!path.endsWith('.jpg')){assert.equal(response.headers.get('content-encoding'),'gzip');assert.ok(Number(response.headers.get('content-length'))<original.length/2);}
  }
  const auth=await fetch(origin+'/api/auth/me');assert.equal(auth.headers.get('cache-control'),'no-store');
});

test('la caché pública detecta cambios SQL inmediatamente y no contiene datos de sesión',async()=>{
  const {pool,sql}=await getDb(),name='perf-test-'+randomUUID();
  const catalog=async()=>{const response=await fetch(origin+'/api/catalog');assert.equal(response.status,200);return response.json();};
  try{
    const initial=await catalog();assert.ok(initial.destinations.length);assert.ok(!('user' in initial)&&!('state' in initial));
    await pool.request().input('name',sql.VarChar(80),name).query("INSERT dbo.RumboSettings(Name,DataJson) VALUES(@name,N'{\"version\":1}')");
    assert.deepEqual((await catalog())[name],{version:1});
    await pool.request().input('name',sql.VarChar(80),name).query("UPDATE dbo.RumboSettings SET DataJson=N'{\"version\":2}' WHERE Name=@name");
    assert.deepEqual((await catalog())[name],{version:2});
  }finally{
    await pool.request().input('name',sql.VarChar(80),name).query('DELETE dbo.RumboSettings WHERE Name=@name');
    assert.equal((await catalog())[name],undefined);
    await closeDb();
  }
});

test('la limitación de acceso SQL conserva el bloqueo y el recuento de intentos',async()=>{
  const php=process.env.RUMBO_PHP||(existsSync('C:/xampp/php/php.exe')?'C:/xampp/php/php.exe':'php');
  const driver=new URL('../../.runtime/sqlsrv-5.12/Windows/php_pdo_sqlsrv_82_ts_x64.dll',import.meta.url);
  const args=process.platform==='win32'&&existsSync(driver)?['-d','extension='+fileURLToPath(driver)]:[];
  const result=await promisify(execFile)(php,[...args,fileURLToPath(new URL('./auth-rate-limit.php',import.meta.url)),'perf-test-'+randomUUID()],{windowsHide:true});
  assert.match(result.stdout,/Attempt limit retained/);
  assert.match(result.stdout,/OAuth challenge expiry retained/);
});
