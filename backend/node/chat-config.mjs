import {readFile} from 'node:fs/promises';
import {parseEnv} from 'node:util';
// Re-read only the assistant settings, so saving a new private key does not
// require restarting PHP, the database connection or the user's session.
export const DEFAULT_GROQ_MODEL = 'openai/gpt-oss-20b';
export async function readChatConfig({envFile=new URL('../../.env',import.meta.url),env=process.env}={}){
 let local={};try{local=parseEnv(await readFile(envFile,'utf8'));}catch(error){if(error.code!=='ENOENT')throw error;}
 return {apiKey:(local.GROQ_API_KEY??env.GROQ_API_KEY??'').trim(),model:(local.GROQ_MODEL||env.GROQ_MODEL||DEFAULT_GROQ_MODEL).trim()};
}
