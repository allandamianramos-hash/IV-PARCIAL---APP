// Bounded read-only HTTP benchmark. Never targets an external host by default.
import {writeFile,mkdir} from 'node:fs/promises';
import {createApp} from '../server.mjs';
import {getDb,closeDb} from '../backend/node/db.mjs';
process.loadEnvFile(new URL('../.env',import.meta.url));
const php=process.env.LOAD_TEST_ORIGIN||'http://127.0.0.1:8000';
if(!['127.0.0.1','localhost'].includes(new URL(php).hostname))throw Error('La prueba está limitada a localhost. Usa staging con un plan de carga autorizado.');
const server=createApp();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const backends=[['php-development',php],['node-local',`http://127.0.0.1:${server.address().port}`]],results=[],owners=[];
const scenarios={static:['/css/compartido/launch.css','/js/servicios/journey.js','/imagenes-viajes/portadas/hero-premium-venecia.jpg'],dynamic:['/','/viajes.html?pantalla=destinos','/tienda.html','/api/catalog','/api/state']};
const percentile=(values,p)=>values[Math.min(values.length-1,Math.ceil(values.length*p)-1)];
try{
 for(const [backend,origin] of backends){
  const warm=await fetch(origin+'/',{signal:AbortSignal.timeout(20000)}),html=await warm.text();
  const boot=JSON.parse(html.match(/id="rumbo-bootstrap" type="application\/json">(.*?)<\/script>/s)?.[1]||'{}');
  if(!warm.ok||!boot.connected)throw Error(backend+': la base de datos no está conectada.');owners.push(boot.visitor);
  const cookie=warm.headers.getSetCookie().map(c=>c.split(';')[0]).join('; ');
  for(const [scenario,paths]of Object.entries(scenarios)){
   for(const concurrency of [1,5,10,25]){
    const count=Math.max(10,concurrency*2),latencies=[],failures={},start=performance.now();let index=0,bytes=0;
    await Promise.all(Array.from({length:concurrency},async()=>{
     for(;;){const n=index++;if(n>=count)return;const began=performance.now();
      try{
       const path=paths[n%paths.length],response=await fetch(origin+path,{headers:{Cookie:cookie},signal:AbortSignal.timeout(20000)}),buffer=Buffer.from(await response.arrayBuffer()),body=scenario==='dynamic'?buffer.toString('utf8'):'';bytes+=buffer.length;
       const invalid=path==='/api/catalog'?!JSON.parse(body).destinations?.length:path==='/api/state'?!JSON.parse(body).visitor:path==='/'||path.endsWith('.html')||path.includes('.html?')?!/"connected":true/.test(body):false;
       if(!response.ok||invalid)failures[response.status]=(failures[response.status]||0)+1;
      }catch(error){failures[error.name]=(failures[error.name]||0)+1;}
      latencies.push(performance.now()-began);
     }
    }));
    latencies.sort((a,b)=>a-b);const seconds=(performance.now()-start)/1000,errors=Object.values(failures).reduce((a,b)=>a+b,0);
    const row={backend,scenario,concurrency,requests:count,errors,failures,seconds:+seconds.toFixed(2),rps:+(count/seconds).toFixed(2),p50ms:Math.round(percentile(latencies,.5)),p95ms:Math.round(percentile(latencies,.95)),maxMs:Math.round(latencies.at(-1)),decodedMB:+(bytes/1e6).toFixed(2)};results.push(row);console.log(JSON.stringify(row));
    if(errors/count>.05||row.p95ms>15000){console.log('Se detiene el aumento de carga de este escenario.');break;}
   }
  }
 }
}finally{
 await mkdir(new URL('../.runtime/',import.meta.url),{recursive:true});
 await writeFile(new URL('../.runtime/launch-load-results.json',import.meta.url),JSON.stringify({date:new Date().toISOString(),scope:'Local HTTP requests, warm visitor cookie, real Azure database. Not browser users; no checkout writes or production capacity guarantee.',results},null,2));
 try{const {pool,sql}=await getDb();for(const owner of owners)await pool.request().input('id',sql.UniqueIdentifier,owner).query('DELETE FROM dbo.RumboVisitors WHERE Id=@id AND NOT EXISTS(SELECT 1 FROM dbo.RumboUsers WHERE VisitorId=@id) AND NOT EXISTS(SELECT 1 FROM dbo.RumboVisitorState WHERE VisitorId=@id);');}finally{await closeDb();await new Promise(resolve=>server.close(resolve));}
}
