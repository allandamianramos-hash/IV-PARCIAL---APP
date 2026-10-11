import {createHash} from 'node:crypto';
import {getDb} from './db.mjs';
export class PasswordRateError extends Error {
  constructor(){super('Demasiados intentos. Espera 15 minutos antes de volver a entrar.');this.status=429;this.code='RUMBO_PASSWORD_LIMIT';}
}
export const passwordAttemptKey=email=>createHash('sha256').update('password:'+email.trim().toLowerCase()).digest('hex');
// Shared SQL bucket for all hosts and both local and social password entry points.
export async function passwordAttempt(email){
  const {pool,sql}=await getDb(),tx=new sql.Transaction(pool),key=passwordAttemptKey(email);await tx.begin();
  try{
    await new sql.Request(tx).input('lock',sql.NVarChar(255),'RumboAuth:'+key).query("DECLARE @r int; EXEC @r=sp_getapplock @Resource=@lock,@LockMode='Exclusive',@LockOwner='Transaction',@LockTimeout=5000; IF @r<0 THROW 51000,'Rate lock unavailable',1;");
    const count=(await new sql.Request(tx).input('key',sql.Char(64),key).query('SELECT COUNT(*) AS Total FROM dbo.RumboAuthAttempts WHERE IpHash=@key AND AttemptedAt>DATEADD(minute,-15,SYSUTCDATETIME())')).recordset[0].Total;
    if(count>=10)throw new PasswordRateError();
    await new sql.Request(tx).input('key',sql.Char(64),key).query('DELETE dbo.RumboAuthAttempts WHERE AttemptedAt<DATEADD(day,-1,SYSUTCDATETIME()); INSERT dbo.RumboAuthAttempts(IpHash) VALUES(@key)');await tx.commit();
  }catch(error){await tx.rollback();throw error;}
}
