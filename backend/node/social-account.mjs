import {randomBytes,createHash} from 'node:crypto';
import bcrypt from 'bcryptjs';
import {passwordAttempt} from './password-attempts.mjs';
import {getDb} from './db.mjs';
import {validNewPassword} from './password-recovery.mjs';

const hash=value=>createHash('sha256').update(value).digest('hex');
export class SocialPasswordError extends Error {
  constructor(status,code,message,email){super(message);this.status=status;this.code=code;this.email=email;}
}

// This is an internal server function. Identity must already have passed signature,
// issuer, audience, expiry and browser-bound nonce verification.
export async function socialAccount({provider,identity,nonce,password,newPassword,passwordMatches,AccountError}){
  const column=provider==='google'?'GoogleSubject':'MicrosoftSubject';
  const challenges=provider==='google'?'RumboGoogleChallenges':'RumboMicrosoftChallenges';
  const label=provider==='google'?'Google':'Microsoft',prefix=provider.toUpperCase();
  const {pool,sql}=await getDb(),tx=new sql.Transaction(pool);
  // Finish the independent rate transaction before reserving an account transaction.
  // This also avoids exhausting the connection pool under simultaneous sign-ins.
  if(typeof password==='string'&&password){
    const previous=(await pool.request().input('sub',sql.VarChar(255),identity.sub).query(`SELECT Email FROM dbo.RumboUsers WHERE ${column}=@sub`)).recordset[0];
    if(previous?.Email||identity.email)await passwordAttempt(previous?.Email||identity.email);
  }
  await tx.begin();
  try{
    const challenge=await new sql.Request(tx).input('hash',sql.Char(64),hash(nonce)).query(`DELETE dbo.${challenges} OUTPUT DELETED.NonceHash WHERE NonceHash=@hash AND ExpiresAt>SYSUTCDATETIME()`);
    if(!challenge.recordset.length)throw new AccountError(401,prefix+'_EXPIRED',`El acceso con ${label} venció. Recarga la página y vuelve a intentarlo.`);
    await new sql.Request(tx).input('lock',sql.NVarChar(255),'Rumbo'+label+':'+identity.sub).query("DECLARE @r int; EXEC @r=sp_getapplock @Resource=@lock,@LockMode='Exclusive',@LockOwner='Transaction',@LockTimeout=5000; IF @r<0 THROW 51000,'Account lock unavailable',1;");
    let user=(await new sql.Request(tx).input('sub',sql.VarChar(255),identity.sub).query(`SELECT Id,FullName,Email,PasswordHash,${column} FROM dbo.RumboUsers WITH(UPDLOCK,ROWLOCK) WHERE ${column}=@sub`)).recordset[0];
    const linked=!!user;
    if(!user){
      if(!identity.email)throw new AccountError(422,prefix+'_EMAIL_REQUIRED',`${label} no compartió un correo utilizable. Usa otra cuenta o regístrate con tu correo.`);
      user=(await new sql.Request(tx).input('email',sql.NVarChar(254),identity.email).query(`SELECT Id,FullName,Email,PasswordHash,${column} FROM dbo.RumboUsers WITH(UPDLOCK,HOLDLOCK) WHERE Email=@email`)).recordset[0];
      if(user?.[column])throw new AccountError(409,prefix+'_CONFLICT',`Este correo ya está vinculado con otra cuenta de ${label}.`);
    }
    let encoded;
    const email=identity.email||user?.Email;
    const hasPassword=user&&/^(scrypt:|\$2[aby]\$)/.test(user.PasswordHash);
    if(hasPassword){
      if(typeof password!=='string'||!password)throw new SocialPasswordError(409,'RUMBO_PASSWORD_REQUIRED','Confirma tu contraseña de Rumbo para entrar.',email);
      if(password.length>128||!await passwordMatches(password,user.PasswordHash))throw new SocialPasswordError(401,'RUMBO_PASSWORD_REQUIRED','La contraseña de Rumbo no es correcta. Inténtalo de nuevo.',email);
    }else{
      // Matching an email is not proof of ownership of a different social account.
      if(user&&!linked)throw new SocialPasswordError(409,'RUMBO_EXISTING_PROVIDER_REQUIRED','Entra primero con el proveedor que ya vinculaste a Rumbo y crea tu contraseña. Después podrás conectar esta cuenta.');
      if(newPassword===undefined)throw new SocialPasswordError(409,'RUMBO_PASSWORD_SETUP_REQUIRED','Crea tu contraseña de Rumbo para proteger tu cuenta. La necesitarás en cada nuevo acceso.',email);
      if(!validNewPassword(newPassword))throw new SocialPasswordError(400,'RUMBO_PASSWORD_SETUP_REQUIRED','Usa al menos 8 caracteres y como máximo 72 bytes.',email);
      encoded=await bcrypt.hash(newPassword,12);
    }
    const verifiedHash=encoded||user.PasswordHash;
    const created=!user;
    if(created){
      const owner=(await new sql.Request(tx).input('hash',sql.Char(64),hash(randomBytes(32))).query('INSERT dbo.RumboVisitors(TokenHash) OUTPUT INSERTED.Id VALUES(@hash)')).recordset[0].Id;
      user=(await new sql.Request(tx).input('sub',sql.VarChar(255),identity.sub).input('name',sql.NVarChar(120),identity.name).input('email',sql.NVarChar(254),identity.email).input('owner',sql.UniqueIdentifier,owner).input('password',sql.VarChar(200),encoded).query(`INSERT dbo.RumboUsers(FullName,Email,PasswordHash,VisitorId,${column}) OUTPUT INSERTED.Id,INSERTED.FullName,INSERTED.Email VALUES(@name,@email,@password,@owner,@sub)`)).recordset[0];
    }else{
      if(encoded)await new sql.Request(tx).input('id',sql.UniqueIdentifier,user.Id).input('password',sql.VarChar(200),encoded).query('UPDATE dbo.RumboUsers SET PasswordHash=@password WHERE Id=@id; DELETE dbo.RumboSessions WHERE UserId=@id;');
      if(!linked)await new sql.Request(tx).input('id',sql.UniqueIdentifier,user.Id).input('sub',sql.VarChar(255),identity.sub).query(`UPDATE dbo.RumboUsers SET ${column}=@sub WHERE Id=@id`);
    }
    await tx.commit();
    return {user:{Id:user.Id,FullName:user.FullName,Email:user.Email},created,passwordHash:verifiedHash};
  }catch(error){await tx.rollback();throw error;}
}
