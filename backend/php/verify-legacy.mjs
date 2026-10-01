// Compatibility for accounts created by the original Node backend.
// Passwords only arrive through stdin, never process arguments or logs.
import { scryptSync, timingSafeEqual } from 'node:crypto';
let raw='';
for await (const chunk of process.stdin) {raw+=chunk;if(raw.length>2048)process.exit(1);}
try {
  const {password,hash}=JSON.parse(raw);
  const match=/^scrypt:([a-f0-9]{32}):([a-f0-9]{128})$/.exec(hash);
  if(!match||typeof password!=='string'||password.length>128)process.exit(1);
  process.stdout.write(timingSafeEqual(scryptSync(password,match[1],64),Buffer.from(match[2],'hex'))?'true':'false');
} catch {process.exitCode=1;}
