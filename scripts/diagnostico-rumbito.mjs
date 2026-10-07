import {loadEnvFile} from 'node:process';
import {readChatConfig} from '../backend/node/chat-config.mjs';
try{loadEnvFile(new URL('../.env',import.meta.url));}catch(error){if(error.code!=='ENOENT')throw error;}
const {apiKey,model}=await readChatConfig();
console.log('Rumbito · modelo: '+model);
if(!apiKey){console.error('Falta LIGHTNING_API_KEY en .env.');process.exitCode=1;}
else try{
 const response=await fetch(`http://127.0.0.1:${process.env.PORT||3000}/api/chat`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:'Responde solamente: Listo.',history:[],language:'es'}),signal:AbortSignal.timeout(35000)});
 const data=await response.json();
 if(!response.ok){console.error((data.code||'AI_ERROR')+': '+data.error);process.exitCode=1;}
 else if(data.source==='lightning'&&data.reply){console.log('Conexión de IA confirmada.');}
 else{console.error('No se confirmó una respuesta de IA.');process.exitCode=1;}
}catch{console.error('No se pudo consultar el servidor. Abre INICIAR-RUMBO.cmd y vuelve a ejecutar el diagnóstico.');process.exitCode=1;}
