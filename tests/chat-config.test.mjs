import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {readChatConfig,DEFAULT_GROQ_MODEL} from '../backend/node/chat-config.mjs';

test('Groq ignora credenciales antiguas y recarga la llave privada sin reiniciar',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'rumbo-groq-'));
 const envFile=join(dir,'.env');
 const env={GROQ_API_KEY:'host-key',LIGHTNING_API_KEY:'old-key',RUMBITO_MODEL:'openai/gpt-5-mini'};
 try {
  assert.deepEqual(await readChatConfig({envFile,env}),{apiKey:'host-key',model:DEFAULT_GROQ_MODEL});
  await writeFile(envFile,'LIGHTNING_API_KEY=old-local\nRUMBITO_MODEL=openai/gpt-5-mini\n');
  assert.equal((await readChatConfig({envFile,env:{}})).apiKey,'');
  await writeFile(envFile,'GROQ_API_KEY=new-key\nGROQ_MODEL=openai/gpt-oss-120b\n');
  assert.deepEqual(await readChatConfig({envFile,env}),{apiKey:'new-key',model:'openai/gpt-oss-120b'});
  await writeFile(envFile,'GROQ_API_KEY=\n');
  assert.equal((await readChatConfig({envFile,env})).apiKey,'');
 } finally {await rm(dir,{recursive:true,force:true});}
});
