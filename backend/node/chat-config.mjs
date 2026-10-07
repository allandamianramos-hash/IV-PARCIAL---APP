import {readFile} from 'node:fs/promises';
import {parseEnv} from 'node:util';
// Re-read only the assistant settings, so saving a new private key does not
// require restarting PHP, the database connection or the user's session.
export async function readChatConfig(){
 let local={};try{local=parseEnv(await readFile(new URL('../../.env',import.meta.url),'utf8'));}catch(error){if(error.code!=='ENOENT')throw error;}
 return {apiKey:(local.LIGHTNING_API_KEY||process.env.LIGHTNING_API_KEY||'').trim(),model:(local.RUMBITO_MODEL||process.env.RUMBITO_MODEL||'openai/gpt-5-mini').trim()};
}
