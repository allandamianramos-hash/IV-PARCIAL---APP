// Uses the same installed Live Server module as VS Code, without changing its running port.
import {createRequire} from 'node:module';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
if(!process.env.RUMBO_LIVE_SERVER_MODULE)throw Error('Define RUMBO_LIVE_SERVER_MODULE con la ruta del modulo live-server instalado por VS Code.');
const live=require(process.env.RUMBO_LIVE_SERVER_MODULE);
const settings=JSON.parse(await readFile(new URL('../../.vscode/settings.json',import.meta.url),'utf8'));
const proxy=settings['liveServer.settings.proxy'];
const server=live.start({host:'127.0.0.1',port:0,root:fileURLToPath(new URL('../../public/',import.meta.url)),open:false,logLevel:0,proxy:[[proxy.baseUri,proxy.proxyUri]]});
if(!server.listening)await new Promise(resolve=>server.once('listening',resolve));
try{
 const origin=`http://127.0.0.1:${server.address().port}`;
 const page=await fetch(origin);const html=await page.text();
 assert.equal(page.status,200);assert.match(html,/"connected":true/);
 assert.match(html,/js/cuenta/auth-client.js/);
 const code=await new Promise((resolve,reject)=>{
  const child=spawn(process.execPath,['--test',fileURLToPath(new URL('./php.test.mjs',import.meta.url))],{stdio:'inherit',windowsHide:true,env:{...process.env,PHP_TEST_ORIGIN:origin}});
  child.once('error',reject);child.once('exit',resolve);
 });
 assert.equal(code,0,'Prueba de PHP a traves de Live Server');
 console.log('Live Server -> PHP -> SQL Server: registro, cookies y guardado verificados.');
}finally{live.shutdown();}
