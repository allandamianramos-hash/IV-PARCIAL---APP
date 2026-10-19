// Dedicated hosting entry. Keep dynamic HTML outside Passenger's static folder.
// Local development still uses `node server.mjs` and leaves public/ unchanged.
import {mkdir,readdir,rename,access} from 'node:fs/promises';
const assets=new URL('./public/',import.meta.url),templates=new URL('./templates/',import.meta.url);
await mkdir(templates,{recursive:true});
for(const name of await readdir(assets))if(/^[a-z0-9-]+\.html$/.test(name)){
  try{await rename(new URL(name,assets),new URL(name,templates));}
  catch(error){if(error.code!=='ENOENT')throw error;await access(new URL(name,templates));}
}
// Hostinger imports its entry instead of executing it as process.argv[1].
const {startServer}=await import('./server.mjs');
startServer();
// Check outbound mail without sending a message or delaying HTTP startup.
const {mailConfigured,mailTransport}=await import('./backend/node/recovery-mail.mjs');
if(mailConfigured()){
  const transport=mailTransport();
  transport.verify().then(()=>console.info('Rumbo: SMTP connection verified'),error=>console.warn('Rumbo: SMTP verification failed',/^[A-Z0-9_]+$/.test(error.code||'')?error.code:'CONNECTION')).finally(()=>transport.close());
}
