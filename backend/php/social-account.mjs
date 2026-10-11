import {googleAccount} from '../node/google-accounts.mjs';
import {microsoftAccount} from '../node/microsoft-accounts.mjs';
import {passwordMatches} from '../node/auth-api.mjs';
import {closeDb} from '../node/db.mjs';
try{
  process.loadEnvFile(new URL('../../.env',import.meta.url));
  let raw='';for await(const chunk of process.stdin){raw+=chunk;if(raw.length>40000)throw Error('Oversize');}
  const {provider,identity,nonce,password,newPassword}=JSON.parse(raw);
  if(!['google','microsoft'].includes(provider))throw Error('Invalid provider');
  const result=provider==='google'?await googleAccount(identity,nonce,password,passwordMatches,newPassword):await microsoftAccount(identity,nonce,password,passwordMatches,null,newPassword);
  process.stdout.write(JSON.stringify({status:200,result}));
}catch(error){
  process.stdout.write(JSON.stringify({status:error.status||503,data:{code:error.code||'SOCIAL_UNAVAILABLE',error:error.status?error.message:'No se pudo completar el acceso. Inténtalo de nuevo.',...(error.email?{email:error.email}:{})}}));
}finally{await closeDb();}
