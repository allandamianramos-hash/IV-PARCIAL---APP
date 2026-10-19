import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {createServer} from 'node:net';
import {once} from 'node:events';
import {mkdtemp,cp,mkdir,readFile,access,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
test('Hostinger can import its entry and receive HTTP without executing server.mjs directly',async()=>{
  const fixture=await mkdtemp(join(tmpdir(),'rumbo-hostinger-'));
  for(const file of ['server.mjs','hostinger.mjs','backend/node','config'])await cp(new URL('../'+file,import.meta.url),join(fixture,file),{recursive:true});
  // Resolve installed dependencies without copying the application's image library.
  const {symlink}=await import('node:fs/promises');
  await symlink(new URL('../node_modules',import.meta.url),join(fixture,'node_modules'),'junction');
  for(const file of ['index.html','error.html','tienda.html','js']){
    const target=join(fixture,'public',file);await mkdir(join(target,'..'),{recursive:true});
    await cp(new URL('../public/'+file,import.meta.url),target,{recursive:true});
  }
  const probe=createServer();
  probe.listen(0,'127.0.0.1');await once(probe,'listening');
  const port=probe.address().port;await new Promise(resolve=>probe.close(resolve));
  const child=spawn(process.execPath,['--input-type=module','--eval',"await import('./hostinger.mjs')"],{
    cwd:fixture,windowsHide:true,
    env:{...process.env,NODE_ENV:'test',HOST:'127.0.0.1',PORT:String(port),APP_ORIGIN:`http://127.0.0.1:${port}`,DB_ENABLED:'false'}
  });
  let output='';child.stdout.on('data',x=>output+=x);child.stderr.on('data',x=>output+=x);
  try{
    const started=Date.now();let result;
    while(Date.now()-started<10000){
      assert.equal(child.exitCode,null,output);
      try{result=await fetch(`http://127.0.0.1:${port}/api/health`);break;}catch{await new Promise(resolve=>setTimeout(resolve,100));}
    }
    assert.ok(result,output||'Entry did not listen');
    assert.equal(result.status,200);
    assert.equal((await result.json()).status,'ok');
    const page=await fetch(`http://127.0.0.1:${port}/tienda.html`).then(r=>r.text());
    assert.ok(page.includes('id="rumbo-bootstrap"'));
    await assert.rejects(access(join(fixture,'public','tienda.html')));
    assert.ok((await readFile(join(fixture,'templates','tienda.html'),'utf8')).includes('<html'));
  }finally{if(child.exitCode===null){const stopped=once(child,'exit');child.kill();await stopped;}await rm(fixture,{recursive:true,force:true});}
});
