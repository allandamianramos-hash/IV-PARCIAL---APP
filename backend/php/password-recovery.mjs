import {passwordRecovery,RecoveryError} from '../node/password-recovery.mjs';
import {closeDb} from '../node/db.mjs';
try{process.loadEnvFile(new URL('../../.env',import.meta.url));}catch(error){if(error.code!=='ENOENT')throw error;}
try{
  let raw='';for await(const chunk of process.stdin){raw+=chunk;if(raw.length>5000)throw new RecoveryError(413,'Datos demasiado largos.');}
  const {action,body}=JSON.parse(raw);
  process.stdout.write(JSON.stringify({status:200,data:await passwordRecovery(action,body)}));
}catch(error){process.stdout.write(JSON.stringify({status:error instanceof RecoveryError?error.status:503,data:{error:error instanceof RecoveryError?error.message:'No se pudo completar la recuperación. Inténtalo más tarde.'}}));}
finally{await closeDb();}
