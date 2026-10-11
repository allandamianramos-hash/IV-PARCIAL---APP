import {randomBytes,randomInt,createHash,createHmac,timingSafeEqual} from 'node:crypto';
import bcrypt from 'bcryptjs';
import {getDb} from './db.mjs';
import {mailConfigured,sendRecoveryCode} from './recovery-mail.mjs';

const digest=value=>createHash('sha256').update(value).digest('hex');
const opaque=()=>randomBytes(32).toString('hex');
const validId=value=>typeof value==='string'&&/^[a-f0-9]{64}$/.test(value);
const emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const genericMessage='Si el correo corresponde a una cuenta con contraseña, recibirás un código. Revisa también tu carpeta de spam.';
export class RecoveryError extends Error {constructor(status,message){super(message);this.status=status;}}
export function validNewPassword(value){return typeof value==='string'&&Array.from(value).length>=8&&!value.includes('\0')&&Buffer.byteLength(value,'utf8')<=72;}
const codeHash=(id,code)=>createHmac('sha256',process.env.MAIL_RESET_SECRET).update(id+':'+code).digest('hex');
const invalid=()=>new RecoveryError(400,'El código es incorrecto o venció. Puedes solicitar uno nuevo.');

// Shared by Node and the PHP bridge; all counters and grants are stored in SQL.
export async function passwordRecovery(action,body,options={}){
  const started=Date.now();
  try{return await performRecovery(action,body,options);}
  finally{
    // Equalize the request window for known, unknown and social-only accounts.
    if(action==='request'&&(options.configured??mailConfigured()))await new Promise(resolve=>setTimeout(resolve,Math.max(0,(options.minimumDelayMs??18000)-(Date.now()-started))));
  }
}
async function performRecovery(action,body,{send=sendRecoveryCode,configured=mailConfigured()}={}){
  if(!['request','verify','reset'].includes(action))throw new RecoveryError(404,'Ruta no encontrada.');
  if(!body||typeof body!=='object'||Array.isArray(body))throw new RecoveryError(400,'Datos inválidos.');
  if(!configured)throw new RecoveryError(503,'La recuperación por correo todavía no está disponible. Puedes entrar con Google o Microsoft si vinculaste tu cuenta.');
  const {pool,sql}=await getDb();
  if(action==='request'){
    const email=typeof body.email==='string'?body.email.trim().toLowerCase():'';
    if(email.length>254||!emailPattern.test(email))throw new RecoveryError(400,'Introduce un correo electrónico válido.');
    const id=opaque(),code=String(randomInt(0,1000000)).padStart(6,'0'),emailHash=digest(email);
    const tx=new sql.Transaction(pool);await tx.begin();let user;
    try{
      await new sql.Request(tx).input('lock',sql.NVarChar(255),'RumboReset:'+emailHash).query("DECLARE @r int; EXEC @r=sp_getapplock @Resource=@lock,@LockMode='Exclusive',@LockOwner='Transaction',@LockTimeout=5000; IF @r<0 THROW 51000,'Reset lock unavailable',1;");
      const counts=(await new sql.Request(tx).input('email',sql.Char(64),emailHash).query('SELECT COUNT(*) AS Total, SUM(CASE WHEN CreatedAt>DATEADD(second,-60,SYSUTCDATETIME()) THEN 1 ELSE 0 END) AS Recent FROM dbo.RumboPasswordResets WHERE EmailHash=@email AND CreatedAt>DATEADD(minute,-15,SYSUTCDATETIME())')).recordset[0];
      if(counts.Total>=3||counts.Recent>0)throw new RecoveryError(429,'Espera un minuto antes de pedir otro código. Si ya pediste varios, vuelve en 15 minutos.');
      const row=(await new sql.Request(tx).input('email',sql.NVarChar(254),email).query('SELECT Id,PasswordHash FROM dbo.RumboUsers WHERE Email=@email')).recordset[0];
      user=row&&/^(scrypt:|\$2[aby]\$)/.test(row.PasswordHash)?row:null;
      await new sql.Request(tx).input('id',sql.Char(64),id).input('email',sql.Char(64),emailHash).input('user',sql.UniqueIdentifier,user?.Id||null).input('code',sql.Char(64),codeHash(id,code)).query('DELETE dbo.RumboPasswordResets WHERE CreatedAt<DATEADD(day,-1,SYSUTCDATETIME()); INSERT dbo.RumboPasswordResets(Id,EmailHash,UserId,CodeHash,ExpiresAt) VALUES(@id,@email,@user,@code,DATEADD(minute,10,SYSUTCDATETIME()));');
      await tx.commit();
    }catch(error){await tx.rollback();throw error;}
    if(user){
      try{await send(email,code);}
      catch{
        await pool.request().input('id',sql.Char(64),id).query('UPDATE dbo.RumboPasswordResets SET CodeHash=NULL,ConsumedAt=SYSUTCDATETIME() WHERE Id=@id');
        // Same response for unknown accounts and delivery failures: no account enumeration.
        console.error('Rumbo recovery: MAIL_DELIVERY_FAILED');
        return {requestId:id,message:genericMessage};
      }
      await pool.request().input('id',sql.Char(64),id).input('email',sql.Char(64),emailHash).query('UPDATE dbo.RumboPasswordResets SET CodeHash=NULL,ResetHash=NULL,ConsumedAt=SYSUTCDATETIME() WHERE EmailHash=@email AND Id<>@id AND ConsumedAt IS NULL; UPDATE dbo.RumboPasswordResets SET Delivered=1 WHERE Id=@id');
    }
    return {requestId:id,message:genericMessage};
  }
  if(action==='verify'){
    if(!validId(body.requestId)||typeof body.code!=='string'||!/^\d{6}$/.test(body.code))throw invalid();
    const tx=new sql.Transaction(pool);await tx.begin();let resetToken;
    try{
      const row=(await new sql.Request(tx).input('id',sql.Char(64),body.requestId).query('SELECT UserId,CodeHash,Attempts FROM dbo.RumboPasswordResets WITH(UPDLOCK,HOLDLOCK) WHERE Id=@id AND Delivered=1 AND ConsumedAt IS NULL AND ExpiresAt>SYSUTCDATETIME()')).recordset[0];
      if(row?.UserId&&row.CodeHash&&row.Attempts<5){
        const matches=timingSafeEqual(Buffer.from(row.CodeHash,'hex'),Buffer.from(codeHash(body.requestId,body.code),'hex'));
        if(matches){
          resetToken=opaque();
          await new sql.Request(tx).input('id',sql.Char(64),body.requestId).input('token',sql.Char(64),digest(resetToken)).query('UPDATE dbo.RumboPasswordResets SET CodeHash=NULL,ResetHash=@token,ExpiresAt=DATEADD(minute,5,SYSUTCDATETIME()) WHERE Id=@id');
        }else await new sql.Request(tx).input('id',sql.Char(64),body.requestId).query('UPDATE dbo.RumboPasswordResets SET Attempts=Attempts+1 WHERE Id=@id');
      }
      await tx.commit();
    }catch(error){await tx.rollback();throw error;}
    if(!resetToken)throw invalid();
    return {resetToken};
  }
  if(!validId(body.requestId)||!validId(body.resetToken))throw invalid();
  if(!validNewPassword(body.password))throw new RecoveryError(400,'Usa al menos 8 caracteres y como máximo 72 bytes.');
  const encoded=await bcrypt.hash(body.password,12),tx=new sql.Transaction(pool);await tx.begin();
  try{
    const row=(await new sql.Request(tx).input('id',sql.Char(64),body.requestId).input('token',sql.Char(64),digest(body.resetToken)).query('SELECT UserId FROM dbo.RumboPasswordResets WITH(UPDLOCK,HOLDLOCK) WHERE Id=@id AND ResetHash=@token AND ConsumedAt IS NULL AND ExpiresAt>SYSUTCDATETIME()')).recordset[0];
    if(!row?.UserId)throw invalid();
    await new sql.Request(tx).input('user',sql.UniqueIdentifier,row.UserId).input('password',sql.VarChar(200),encoded).query('UPDATE dbo.RumboUsers SET PasswordHash=@password WHERE Id=@user; DELETE dbo.RumboSessions WHERE UserId=@user; UPDATE dbo.RumboPasswordResets SET ConsumedAt=SYSUTCDATETIME(),CodeHash=NULL,ResetHash=NULL WHERE UserId=@user;');
    await tx.commit();
  }catch(error){await tx.rollback();throw error;}
  return {message:'Contraseña actualizada. Ya puedes iniciar sesión con tu nueva contraseña.'};
}
