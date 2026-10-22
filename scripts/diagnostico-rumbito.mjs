import {loadEnvFile} from 'node:process';
import {readChatConfig} from '../backend/node/chat-config.mjs';
try{loadEnvFile(new URL('../.env',import.meta.url));}catch(error){if(error.code!=='ENOENT')throw error;}
const {apiKey,model}=await readChatConfig();
const origin=process.argv[2]||`http://127.0.0.1:${process.env.PORT||3000}`;
const target=new URL(origin);
if(!['http:','https:'].includes(target.protocol)||target.origin!==origin)throw new Error('Indica un origen HTTP/HTTPS sin ruta ni barra final.');
console.log('Rumbito · modelo: '+model);
if(!apiKey&&!process.argv[2]){console.error('Falta GROQ_API_KEY en .env.');process.exitCode=1;}
else try{
 const response=await fetch(origin+'/api/chat',{method:'POST',headers:{'Content-Type':'application/json',Origin:origin},body:JSON.stringify({message:'Hola',history:[],language:'es'}),signal:AbortSignal.timeout(35000)});
 const data=await response.json();
 if(!response.ok){console.error((data.code||'AI_ERROR')+': '+data.error);process.exitCode=1;}
 else if(data.source==='groq'&&data.reply){console.log('Conexión con Groq confirmada.');}
 else if(data.source==='catalog'&&data.reply){console.error('Catálogo operativo; IA no disponible ('+(data.code||'AI_UNAVAILABLE')+').');process.exitCode=1;}
 else{console.error('No se confirmó una respuesta de IA.');process.exitCode=1;}
}catch{console.error('No se pudo consultar el servidor. Abre INICIAR-RUMBO.cmd y vuelve a ejecutar el diagnóstico.');process.exitCode=1;}
