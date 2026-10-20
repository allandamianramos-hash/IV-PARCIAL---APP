// Read-only availability, public assets and private-path checks for a deployment.
import assert from 'node:assert/strict';
import {readdir,writeFile,mkdir} from 'node:fs/promises';
import {join,relative} from 'node:path';
const origin=process.argv[2];
assert.ok(origin?.startsWith('https://'),'Supply the exact HTTPS origin');
const request=(path,method='GET')=>fetch(origin+path,{method,signal:AbortSignal.timeout(30000)});
const health=await request('/api/health');assert.equal(health.status,200,'Application must start before testing');
assert.equal((await health.json()).app,'rumbo-viajes');
const database=await request('/api/database');assert.equal(database.status,200,'Database connection');
assert.equal((await database.json()).connected,true);
const catalogue=await request('/api/catalog').then(r=>r.json());
assert.equal(catalogue.products.length,100);assert.equal(catalogue.destinations.length,100);
const pages=['/','/viajes.html','/tienda.html','/servicios.html','/registro.html','/iniciar-sesion.html','/recuperar-contrasena.html'];
for(const path of pages){const res=await request(path);assert.equal(res.status,200,path);const body=await res.text();const match=body.match(/<script id="rumbo-bootstrap" type="application\/json">(.*?)<\/script>/s);assert.ok(match,path+' bootstrap');assert.equal(JSON.parse(match[1]).connected,true,path+' DB');assert.ok(res.headers.get('content-security-policy'));}
for(const path of ['/.env','/server.mjs','/hostinger.mjs','/package.json','/backend/node/db.mjs','/config/oauth-public.json','/templates/index.html'])assert.ok([403,404].includes((await request(path)).status),path+' must stay private');
const assets=[];for(const file of await readdir('public',{recursive:true,withFileTypes:true}))if(file.isFile()&&/\.(?:js|css|ttf|jpg|png|webp|json)$/.test(file.name))assets.push('/'+relative('public',join(file.parentPath,file.name)).replaceAll('\\','/'));
let next=0;const failures=[];
await Promise.all(Array.from({length:5},async()=>{while(next<assets.length){const path=assets[next++];try{const res=await request(path,'HEAD');if(res.status!==200)failures.push({path,status:res.status});}catch(e){failures.push({path,error:e.message});}}}));
const result={origin,checkedAt:new Date().toISOString(),pages:pages.length,assets:assets.length,failures,products:100,destinations:100};
await mkdir('.runtime/hostinger',{recursive:true});await writeFile('.runtime/hostinger/live-checks.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));assert.equal(failures.length,0,'All public resources must load');
